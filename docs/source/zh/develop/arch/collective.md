# 集合通信

AXCCL（AXCL 集合通信库）是面向多进程、多设备应用的集合通信库，提供基于 Stream 的
异步接口。接口形态对齐 NCCL/HCCL，便于接入 torch_npu 风格的 ProcessGroup。集合调用入队到
`axclrtStream`，返回时并不表示操作已经完成。

本文介绍 AXCCL 的框架、执行模型和算子支持范围。单个接口的参数、返回值和示例见
[AXCCL API](../c/axccl_api.md)。

阅读本文前，建议先阅读 [系统架构](system.md)、[核心概念](concept.md) 和
[编程模型](programming.md)，了解 Host-Device 架构、Device / Context / Stream 对象关系，
以及异步提交与同步等待的语义。

## 1. 基本对象

| 对象 | 说明 | 典型接口 |
|---|---|---|
| communicator | 把一个逻辑 Device 绑定到集合通信组中的一个 rank，是 AXCCL 的句柄 | [axCclCommInitRootInfo](../c/axccl_api.md#axCclCommInitRootInfo)、[axCclCommFinalize](../c/axccl_api.md#axCclCommFinalize)、[axCclCommDestroy](../c/axccl_api.md#axCclCommDestroy) |
| rank / world size | rank 是通信组内的编号，world size 是通信组成员总数 | [axCclCommRank](../c/axccl_api.md#axCclCommRank)、[axCclCommCount](../c/axccl_api.md#axCclCommCount) |
| root info | rank 0 生成、带外广播给其他 rank 的不透明建链数据 | [axCclGetRootInfo](../c/axccl_api.md#axCclGetRootInfo) |
| Group | 可选的批量化作用域，使同一线程可以一并提交多个 rank 的调用或多个 Send/Recv 调用 | [axCclGroupStart](../c/axccl_api.md#axCclGroupStart)、[axCclGroupEnd](../c/axccl_api.md#axCclGroupEnd) |

world size 取值范围为 `[1, 8]`，rank 取值范围为 `[0, worldSize - 1]`，每个 rank 只能使用一次。
一个 communicator 只绑定一个逻辑 Device，因此单进程驱动多个设备时，每个设备对应一个 communicator。
AXCCL 模块采用引用计数：在 [axclInit](../c/system_api.md#axclInit) 之后调用
[axCclInit](../c/axccl_api.md#axCclInit)，并在所有 communicator 都已终结和销毁后调用
[axCclFinalize](../c/axccl_api.md#axCclFinalize) 与之配对。

## 2. 建链

建链通过 root info 完成，rank0 生成信息后由应用带外广播（例如 PyTorch TCPStore 或 MPI），
各 rank 再凭该信息初始化 communicator：

```c
axclInit(NULL);
axCclInit();

/* communicator 借用调用线程在 deviceId 上的当前 Context。 */
axclrtSetDevice(deviceId);

axCclRootInfo ri;
if (rank == 0) {
    axCclGetRootInfo(&ri);
}
broadcast(&ri, sizeof(ri));

axCclComm comm;
axCclCommInitRootInfo(&comm, deviceId, &ri, worldSize, rank);
```

- 调用 [axCclCommInitRootInfo](../c/axccl_api.md#axCclCommInitRootInfo) 前，调用线程必须已激活
  `deviceId`，并持有该 Device 上的当前 Context。communicator 会借用该 Context；在
  [axCclCommFinalize](../c/axccl_api.md#axCclCommFinalize) 或
  [axCclCommAbort](../c/axccl_api.md#axCclCommAbort) 返回前，需保持该 Context 有效。
- 该调用登记本 rank 后即返回，不等待其他 rank。数据操作调用、
  [axCclGroupEnd](../c/axccl_api.md#axCclGroupEnd) 以及其他需要整组参与的调用，会等到所有 rank
  都已加入。调用返回后发生的初始化失败，由
  [axCclCommGetAsyncError](../c/axccl_api.md#axCclCommGetAsyncError) 报告。
- 在 Linux 上，AXCCL 自动检测进程布局：所有 rank 位于同一进程时使用单进程路径，每个 rank
  位于独立进程时使用多进程路径。其他布局会失败。
- [axCclCommInitRank](../c/axccl_api.md#axCclCommInitRank) 是
  [axCclCommInitRootInfo](../c/axccl_api.md#axCclCommInitRootInfo) 的 NCCL 风格别名。
- 单进程多设备的场景可以使用 [axCclCommInitAll](../c/axccl_api.md#axCclCommInitAll)，一次为列出的
  每个设备各创建一个 communicator。调用前需先用 [axclrtSetDevice](../c/device_api.md#axclrtSetDevice)
  激活列出的每个设备；每个 communicator 使用对应设备的默认 Context，并且 ring 在调用返回前已完成连接。

## 3. 执行模型

AXCCL 的执行模型是 **ring session**：通信域一次性分配各 rank 的 Device 资源，此后每次
操作只是在调用方 Stream 上的一次提交。

| 阶段 | 时机 | 作用 |
|---|---|---|
| 建立（Establish） | [axCclCommInitAll](../c/axccl_api.md#axCclCommInitAll)，或 [axCclCommInitRootInfo](../c/axccl_api.md#axCclCommInitRootInfo) 通信域的首次操作 | 分配该 rank 在 Device 侧的通信缓冲区和同步资源 |
| 连接（Connect） | 紧随建立阶段 | 一次性将每个 rank 连接到其在 ring 中的后继 rank |
| 下发（Launch） | 每次操作 | 在该 rank 传入的 Stream 上提交一个任务 |
| 释放（Release） | [axCclCommFinalize](../c/axccl_api.md#axCclCommFinalize)，或成功的 [axCclCommAbort](../c/axccl_api.md#axCclCommAbort) | 释放该通信域的 Device 资源 |

会话资源驻留在 Device 侧，并在多次操作之间保持。裸集合调用（不在 Group 内）何时返回取决于所走路径（裸
Send/Recv 参见 [axCclSend](../c/axccl_api.md#axCclSend)）：

- 单进程路径，ring 建立后：调用将本 rank 的部分入队后即返回，不等待其他 rank 发起该调用；各 rank
  在 Device 侧相互同步。
- 单进程路径，在 [axCclCommInitRootInfo](../c/axccl_api.md#axCclCommInitRootInfo) 通信域的 ring
  建立之前，以及 [axCclAllToAll](../c/axccl_api.md#axCclAllToAll) /
  [axCclAllToAllV](../c/axccl_api.md#axCclAllToAllV) 的所有调用：调用只登记本 rank 后即返回，由最后
  一个 rank 的调用为所有 rank 统一入队。
- 多进程路径：所有 rank 都提交该调用后才返回。

无论哪种情况，成功返回都不代表完成。须等所有 rank 的调用都返回后，再同步相应的 Stream 或 Event；
该同步会一直阻塞，直到整个 ring 完成该操作。

ring 顺序不等于 rank 顺序：rank 按本地 chip ID 升序排列，且每个 rank 到下一个 rank 的 C2C
链路必须在线，否则 ring 建立失败。这是静态规则，不是硬件发现的物理拓扑。

## 4. 调用约定

**每个 rank 必须以相同顺序发起相同的操作**，且操作类型、数据类型、归约算子、root 和 count 均需匹配；
这是标准的 NCCL/HCCL 集合通信契约。两种路径下 AXCCL 都会比较所有 rank 的调用，使不匹配的调用失败。
在多进程路径下，以及单进程路径下 ring 建立后的裸调用中，不匹配还会使该通信域失败。ring 建立之前，
待处理的操作会对所有 rank 丢弃，包括调用已返回成功的 rank。

每次调用都在调用线程的当前 Device 上执行，该 Device 必须是 communicator 绑定的设备。`stream` 为 NULL
时选择当前 Context 的默认 Stream。在多进程路径下，以及调用 [axCclAllToAll](../c/axccl_api.md#axCclAllToAll) /
[axCclAllToAllV](../c/axccl_api.md#axCclAllToAllV) 和 [axCclSend](../c/axccl_api.md#axCclSend) /
[axCclRecv](../c/axccl_api.md#axCclRecv) 时，当前 Context 必须是创建 communicator 时捕获的 Context。
一个 Device 同一时间只在一个 Stream 上运行 CCL 工作：在能够确认该 Device 之前的 CCL 工作已完成之前，
将其 CCL 工作切换到另一个 Stream 会失败，因此须先同步原 Stream。在多进程路径下，这种切换会使该通信域失败。缓冲区须是在 communicator 绑定设备上通过
[axclrtMalloc](../c/memory_api.md#axclrtMalloc) 分配的 Device 内存，并且在操作于所有参与 Stream 上完成之前必须保持有效。

同步语义：

- [axCclAllReduce](../c/axccl_api.md#axCclAllReduce) 等集合调用按第 3 节所述被接受，在 Group 内则只收集参数；
  返回不代表完成。执行错误在同步各参与 Stream 时返回；
- 只有最外层的 [axCclGroupEnd](../c/axccl_api.md#axCclGroupEnd) 会将 Group 入队。它会先等待所有
  rank 完成初始化，并校验整个 Group；校验失败时丢弃整个 Group，而部分 Group 已入队后发生的失败会使该 Group 涉及的每个通信域失败。
  在多进程路径下，各进程交换 Group 之后 GroupEnd 发生的失败也会使该通信域失败。成功返回同样不代表完成；
- 对于已执行过工作的通信域，首次调用 [axCclCommFinalize](../c/axccl_api.md#axCclCommFinalize)
  会同步每个 rank 的所有参与 Stream，再释放该通信域的 Device 资源。在其返回前，需保持这些 Stream
  和 Context 有效。之后由 [axCclCommDestroy](../c/axccl_api.md#axCclCommDestroy) 释放句柄；该接口不会
  终结 communicator；
- 操作失败或其完成状态不确定时，该通信域进入失败状态：之后对其调用都会返回该失败，且其资源保持分配。
  不得释放该通信域使用的缓冲区、销毁其使用的 Context 或复位其使用的 Device。除自动初始化期间的失败外，任何通信域
  失败都会在本进程的剩余生命周期内阻止所有通信域之后的下发；自动初始化期间的失败只会使该通信域失败。[axCclCommGetAsyncError](../c/axccl_api.md#axCclCommGetAsyncError) 对每个
  communicator 报告一次该失败。

## 5. 算子支持

所有已声明的操作均已实现。单进程 communicator 支持全部功能，多进程路径支持其中一部分：

| 接口 | 当前支持范围 |
|---|---|
| [axCclAllReduce](../c/axccl_api.md#axCclAllReduce) / [axCclReduce](../c/axccl_api.md#axCclReduce) / [axCclReduceScatter](../c/axccl_api.md#axCclReduceScatter) | 两种路径均支持，所有已声明数据类型均支持 `AX_CCL_OP_SUM/PROD/MIN/MAX/AVG` |
| [axCclBroadcast](../c/axccl_api.md#axCclBroadcast) / [axCclAllGather](../c/axccl_api.md#axCclAllGather) / [axCclGather](../c/axccl_api.md#axCclGather) / [axCclScatter](../c/axccl_api.md#axCclScatter) / [axCclBarrier](../c/axccl_api.md#axCclBarrier) | 两种路径均支持；对所有已声明数据类型原样复制数据 |
| [axCclAllToAll](../c/axccl_api.md#axCclAllToAll) / [axCclAllToAllV](../c/axccl_api.md#axCclAllToAllV) | 仅单进程路径支持 |
| [axCclSend](../c/axccl_api.md#axCclSend) / [axCclRecv](../c/axccl_api.md#axCclRecv) | 两种路径均支持；peer 配对规则参见 API 参考 |
| 自定义归约算子（[axCclRedOpCreatePreMulSum](../c/axccl_api.md#axCclRedOpCreatePreMulSum) / [axCclRedOpDestroy](../c/axccl_api.md#axCclRedOpDestroy)） | 仅单进程路径支持，适用于 AllReduce、Reduce 和 ReduceScatter |
| 缓冲区注册（[axCclCommRegister](../c/axccl_api.md#axCclCommRegister) / [axCclCommDeregister](../c/axccl_api.md#axCclCommDeregister)） | 仅单进程路径支持 |
| 异步错误查询与 Abort（[axCclCommGetAsyncError](../c/axccl_api.md#axCclCommGetAsyncError) / [axCclCommAbort](../c/axccl_api.md#axCclCommAbort)） | 支持。仅当该通信域的全部工作已被证明完成时，Abort 才会成功；多进程路径下，仅在尚未提交任何工作时成功 |

`count` 表示元素个数。由于大操作会在内部拆分，`count` 没有固定上限；小于 world size 的 count 以及
count 为 0 均合法。将同一缓冲区或 [AX_CCL_IN_PLACE](../c/reference/macro.md#AX_CCL_IN_PLACE) 作为
`sendbuff` 传入即选择原地操作；部分重叠的缓冲区会被拒绝。FP16 的最大有限值为 65504，即使每个 rank 的输入
都是有限值，FP16 归约结果也可能超出该范围。

## 6. 部署约束

- Host 库 `libaxccl.so`、Device 侧 Worker 与 `libax_neulink.so` 必须来自同一发布版本；Host 和 Device
  只接受同一个协议版本，没有 fallback；
- Ring 集合操作要求参与的 Device 之间 C2C 链路在线；ring 顺序规则见第 3 节；
- 多进程路径要求所有 rank 位于同一 Host、具有相同的有效 UID 和网络命名空间、每个进程一个 rank，且使用
  不同的物理 Device。完整要求参见 [axCclCommInitRootInfo](../c/axccl_api.md#axCclCommInitRootInfo)；
- AXCCL 错误使用 `AXCL_CCL` 子模块 ID `0x5B`；
  [axCclGetErrorString](../c/axccl_api.md#axCclGetErrorString) 返回错误码的描述。

## 7. 相关文档

- [AXCCL API](../c/axccl_api.md)：AXCCL 公共接口的参数、返回值与调用示例；
- [编程模型](programming.md)：Stream、Event 与异步提交的编程语义；
- [核心概念](concept.md)：Device、Context、Stream、Task、Event 的层级关系；
- [内存管理](memory.md)：Host / Device 内存与数据搬运。
