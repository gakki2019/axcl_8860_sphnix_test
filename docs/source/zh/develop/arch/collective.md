# 集合通信

AXCCL（AXCL 集合通信库）为多设备、多进程应用提供基于 Stream 的集合通信能力，接口形态
对齐 NCCL/HCCL，便于接入 torch_npu 风格的 ProcessGroup。集合调用异步入队到
`axclrtStream`，返回时并不表示数据面操作已经完成。

本文介绍 AXCCL 的框架、执行模型和算子支持范围。单个接口的参数、返回值和示例见
[AXCCL API](../c/axccl_api.md)。

阅读本文前，建议先阅读 [系统架构](system.md)、[核心概念](concept.md) 和
[编程模型](programming.md)，了解 Host-Device 架构、Device / Context / Stream 对象关系，
以及异步提交与同步等待的语义。

## 1. 基本对象

| 对象 | 说明 | 典型接口 |
|---|---|---|
| communicator | 把一个逻辑 Device 绑定到集合通信组中的一个 rank，是 AXCCL 的句柄 | [axCclCommInitRootInfo](../c/axccl_api.md)、[axCclCommDestroy](../c/axccl_api.md) |
| rank / world size | rank 是通信组内的编号，world size 是通信组成员总数 | [axCclCommRank](../c/axccl_api.md)、[axCclCommCount](../c/axccl_api.md) |
| root info | rank0 生成、带外广播给其他 rank 的建链信息 | [axCclGetRootInfo](../c/axccl_api.md) |
| Group | 可选的批量化入口，把同一线程内多个 rank 的调用成批提交 | [axCclGroupStart](../c/axccl_api.md)、[axCclGroupEnd](../c/axccl_api.md) |

当前实现要求 world size 为正数，rank 取值 `0 <= rank < worldSize`。一个 communicator 只绑定
一个逻辑 Device，因此单进程驱动多个设备时，每个设备对应一个 communicator。

## 2. 建链

建链通过 root info 完成，rank0 生成信息后由应用带外广播（例如 PyTorch TCPStore 或 MPI），
各 rank 再凭该信息初始化 communicator：

```c
axCclRootInfo ri;
if (rank == 0) {
    axCclGetRootInfo(&ri);
}
broadcast(&ri, sizeof(ri));

axCclComm comm;
axCclCommInitRootInfo(&comm, deviceId, &ri, worldSize, rank);
```

`axCclCommInitRootInfo` 在当前线程已激活的 Device Context 上查询并缓存拓扑，不创建
discovery-only Worker，也不替调用方 ResetDevice。单进程多设备的场景可以直接使用
`axCclCommInitAll` 一次建立整组 communicator。

## 3. 执行模型

AXCCL 的执行模型是 **ring session**：通信域建立时一次性分配该 rank 的固定资源，此后每次
集合操作只是在调用方 Stream 上的一次提交。

| 阶段 | 时机 | 作用 |
|---|---|---|
| `ESTABLISH` | `CommInitAll`，或 `InitRootInfo` 域的首次操作 | 分配该 rank 的 stage / scratch 双缓冲、一个 signal 和 mcode 缓冲 |
| `CONNECT` | 紧随 `ESTABLISH` | 一次性映射后继 rank 的上述资源 |
| `LAUNCH` | 每次集合操作 | 在该 rank 自己的 stream 上提交一次执行 |
| `REARM` | 通信域结束或复位时 | 将 signal 值与操作序号归零 |
| `RELEASE` | 通信域结束时 | 释放全部会话资源 |

会话资源由 **Device 拥有**，Host 只负责交换 peer 地址；rank 之间在 Device 侧通过 signal
汇合，Host 不做碰头等待。`LAUNCH` 使用用户 Stream 的 `ON_ENQUEUE`，返回只表示已入队，应用
仍须同步相应 Stream 或 Event——由于汇合在 Device 侧，这个同步会一直阻塞到整个 ring 完成。

参与 ring 的 rank 顺序由 Host 依据本地 chip ID 升序给出，并校验每条有向 C2C peer 在线。
当前没有邻接关系查询接口，因此这是静态规则，不是硬件发现的物理拓扑。

## 4. 调用约定

会话建立后 Device 的 signal 每次 `LAUNCH` 前进一格，因此**每个 rank 必须以相同顺序发起
相同次数的操作**；Host 不校验调用集合的一致性，这是 NCCL/HCCL 的标准集合通信契约。

同步语义：

- `axCclAllReduce` 等集合调用只负责入队，返回不代表完成；
- `axCclGroupEnd` 返回只表示批量提交 / 入队，仍需同步相应的 Stream 或 Event；
- `axCclCommFinalize` 只完成 Host 状态转换，不代替 Stream 同步，应用须先同步相关 Stream；
- 执行结果不确定时，整个会话的资源会被 pin 住并阻止继续提交，`REARM` / `RELEASE`
  返回 `BUSY`；隔离等异常还会置位进程级失败标志，之后该进程的 launch 会被拒绝。

## 5. 算子支持

当前只实现 `FP32 + SUM` 的 Ring AllReduce，支持 in-place 精确别名或 out-of-place 不重叠
buffer，count 范围为 world size 到 1024 个元素。

| 接口 | 当前状态 |
|---|---|
| `axCclAllReduce` | 支持（`FP32 + SUM`，Ring） |
| `axCclBroadcast` / `axCclReduce` / `axCclAllGather` / `axCclReduceScatter` | 未实现，返回 `AXCL_ERR_CCL_UNSUPPORT` |
| `axCclAllToAll` / `axCclAllToAllV` / `axCclGather` / `axCclScatter` / `axCclBarrier` | 未实现，返回 `AXCL_ERR_CCL_UNSUPPORT` |
| `axCclSend` / `axCclRecv` | 未实现 |
| 自定义归约算子（`axCclRedOpCreatePreMulSum` 等） | 未实现 |
| 缓冲区注册（`axCclCommRegister` / `axCclCommDeregister`） | 未实现 |
| 异步错误查询与 Abort（`axCclCommGetAsyncError` / `axCclCommAbort`） | 未实现 |

公共头文件同时给出了完整的数据类型与归约算子枚举
（`AX_CCL_DT_*`、`AX_CCL_OP_SUM/PROD/MIN/MAX/AVG`），当前只有 `AX_CCL_DT_FP32` 与
`AX_CCL_OP_SUM` 生效：`axCclAllReduce` 遇到其他类型或算子组合时返回
`AXCL_ERR_CCL_ILLEGAL_PARAM`，未实现的集合接口返回 `AXCL_ERR_CCL_UNSUPPORT`。

## 6. 部署约束

- Host 库、Device 侧 Worker 与 `libax_neulink.so` 必须使用同批构建并同批部署，没有旧协议
  fallback；
- AXCCL 只有一套执行 wire，协议版本为 v4，会话 opcode 固定为 15..19，1..14 是删除旧协议
  留下的空洞且永不复用；
- 当前 `libax_neulink.so` 只注册 C2C provider，对外保留 `GetTopology` / `ReleaseTopology`
  与 `EstablishRing` / `CheckRingKey` / `ConnectRing` / `LaunchRing` / `RearmRing` /
  `ReleaseRing` 共 8 个入口；
- `AXCL_CCL` 错误子模块 ID 为 `0x5B`。

## 7. 相关文档

- [AXCCL API](../c/axccl_api.md)：AXCCL 公共接口的参数、返回值与调用示例；
- [编程模型](programming.md)：Stream、Event 与异步提交的编程语义；
- [核心概念](concept.md)：Device、Context、Stream、Task、Event 的层级关系；
- [内存管理](memory.md)：Host / Device 内存与数据搬运。
