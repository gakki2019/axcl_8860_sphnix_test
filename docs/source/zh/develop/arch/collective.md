# 集合通信

AXCCL（AXCL 集合通信库）是面向多进程、多设备应用的集合通信库，提供基于 Stream 的
异步接口。接口形态对齐 NCCL/HCCL，便于接入 torch_npu 风格的 ProcessGroup。集合调用入队到
`axclrtStream`，返回时并不表示数据面操作已经完成。

当前版本仅支持单进程多设备执行，尚不提供多进程 rendezvous。

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
当前执行支持 2–8 rank，所有参与 rank 必须由同一个 Host 进程管理；尚不提供多进程 rendezvous。

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
| `ESTABLISH` | `CommInitAll`，或 `InitRootInfo` 域的首次操作 | 分配该 rank 的 stage / scratch 双缓冲、两个交替使用的 signal 槽和 mcode 缓冲 |
| `CONNECT` | 紧随 `ESTABLISH` | 一次性映射后继 rank 的上述资源 |
| `LAUNCH` | 每次集合操作 | 在该 rank 自己的 stream 上提交一次执行 |
| `REARM` | 操作序号到达 signal 窗口边界时 | 等所有 rank 到达边界并排空 Stream，再将 signal 值与操作序号归零 |
| `RELEASE` | 通信域结束时 | 释放全部会话资源 |

会话资源由 **Device 拥有**，Host 只负责交换 peer 地址；rank 之间在 Device 侧通过 signal
汇合。域已建立后的裸调用可直接提交；尚未建环的 `InitRootInfo` 域先在 Host 汇集首轮各 rank
的调用，再建立会话。`LAUNCH` 使用用户 Stream 的 `ON_ENQUEUE`，返回只表示已入队，应用
仍须同步相应 Stream 或 Event——由于汇合在 Device 侧，这个同步会一直阻塞到整个 ring 完成。

参与 ring 的 rank 顺序由 Host 依据本地 chip ID 升序给出，并校验每条有向 C2C peer 在线。
当前没有邻接关系查询接口，因此这是静态规则，不是硬件发现的物理拓扑。

### 3.1. 归约后端与模型资源

FP32/FP16/BF16 的 SUM 使用 C2C DMA 加法。所有支持类型的 MIN/MAX，以及 INT8/FP8 的
SUM，使用 C2C gather → NPU 归约模型 → C2C finish 三个顺序完成的阶段；Device CPU 不做数值归约。

NPU 模型采用现有单芯单核编译路径，33 个内嵌资产不再声明动态 runtime 或 SHOCM。
`ReduceModel` 按名称、大小、IO 方向和物理内存类型验证并绑定 `values`、`values_offset`、
`result_offset`、`result` 四项 IO；偏移控制共用一个零值缓冲，不分配第五项模型 scratch。
这些模型 IO 与 ring session 的 stage / scratch 双缓冲是不同层次的资源：会话缓冲仍由
NeuLink 分配和复用，调用方只提供公共 API 的发送、接收缓冲区。

模型 handle 可在同一 SYS/NPU 生命周期内连续执行；不同轮次可复用模型并切换 dtype/op。
生成器移除不必要 SHOCM 后，原先第二次执行失败的路径已通过生产 loader 和集合通信重复验证。
这项修复适用于当前内嵌资产，不代表底层驱动对其他 SHOCM 模型的释放问题也已修复。

## 4. 调用约定

会话建立后 Device 按各 rank 一致的操作序号和内部块序号执行，因此**每个 rank 必须以相同顺序发起
相同次数、参数匹配的操作**。显式 Group 和首次建环的隐式收集会校验各 rank 的操作描述；
域已建立后的裸调用不会由 Host 再次汇集整轮，调用方仍须满足这个契约。

同步语义：

- `axCclAllReduce` 等集合调用只负责入队，返回不代表完成；
- `axCclGroupEnd` 返回只表示批量提交 / 入队，仍需同步相应的 Stream 或 Event；
- `axCclCommFinalize` 会排空域内已使用的 application Stream，再释放会话并关闭整个域；
  应用在读取结果或复用缓冲区前仍应显式同步，不能依靠最终清理来安排中间轮次的顺序；
- 执行结果不确定时，整个会话的资源会被 pin 住并阻止继续提交，`REARM` / `RELEASE`
  也不会强行回收资源，而会返回对应错误；隔离等异常还会置位进程级失败标志，之后该进程的 launch 会被拒绝。

## 5. 算子支持

Ring 已实现 AllReduce、Broadcast、Reduce、AllGather、Gather、Scatter 和 ReduceScatter。
Send/Recv 支持 2–8 rank 域中两个不同设备之间的配对通信；一笔传输仅由双方参与。
当前支持的六种类型是 FP32、FP16、BF16、INT8、FP8_E4M3（E4M3FN）、FP8_E5M2。

调用方传入完整逻辑 count；Host 和 NeuLink 不再设置 1024 元素上限。AllReduce 仍要求
count 至少为 worldSize，其他数据操作至少为 1；字节数乘法、地址范围、对齐和缓冲区容量检查仍保留。
NeuLink 分开模型列数和原生 DMA 字节预算：MIN/MAX 及 INT8/FP8 SUM 模型保持 1024 列；
纯复制及 FP32/FP16/BF16 SUM 按单条 DMA 最多 1 MiB 拆块。Scatter/ReduceScatter 一条描述符
携带各 rank 的整组数据，所以每 rank 块大小还须除以 worldSize。此预算不是公共 count 上限。
各 rank 的输入输出偏移仍以完整 count 计算。两个信号槽随内部块交替使用，在确认块完成后复位本地槽。
扩大原生块之前的2026-10-02配套库实机通过受测1025/2051/4096/65536/262144形态及尾块/sample矩阵；
四芯FP32 SUM count262144首次首轮曾数值失败，后续原版与输出诊断通过，但根因未证明。

| 接口 | 当前支持范围 |
|---|---|
| `axCclAllReduce` / `axCclReduce` | 六种类型的 SUM/MIN/MAX；AllReduce count >= worldSize，Reduce count >= 1 |
| `axCclAllGather` | FP32/FP16/BF16，sendcount >= 1；原样搬运字节 |
| `axCclBroadcast` / `axCclGather` / `axCclScatter` | 六种类型，单 rank 元素数 >= 1；原样搬运字节 |
| `axCclReduceScatter` | FP32/FP16/BF16 的 SUM，recvcount >= 1 |
| `axCclSend` / `axCclRecv` | 六种类型，count >= 1；配对通信 |
| `axCclBarrier` | 已建环域中复用 FP32 SUM AllReduce 的 signal 同步；当前不支持放入 Group |
| `axCclAllToAll` / `axCclAllToAllV` | 未实现，返回 `AXCL_ERR_CCL_UNSUPPORT` |
| 自定义归约算子（`axCclRedOpCreatePreMulSum` 等） | 未实现 |
| 缓冲区注册（`axCclCommRegister` / `axCclCommDeregister`） | 未实现 |
| 异步错误查询与 Abort（`axCclCommGetAsyncError` / `axCclCommAbort`） | 未实现 |

公共头文件提供完整的数据类型与归约算子枚举（`AX_CCL_DT_*`、
`AX_CCL_OP_SUM/PROD/MIN/MAX/AVG`）；具体可用组合由每个操作的执行后端决定。非 root 的
Broadcast send、Reduce recv、Gather recv 和 Scatter send 缓冲区可传 NULL，因为这些 rank
不会访问相应缓冲区。
当前归约不支持 PROD、AVG 或自定义算子；枚举声明不代表后端已经实现。

<a id="ccl-haps-validation"></a>

### 5.1. 硬件验证范围

2026-10-01 的生成侧修复联合验证完成 16 组 HAPS 用例，所有进程正常退出，1160 条
结果、输入保持及 poison 区域检查均为零不匹配。覆盖两/四 rank、三种浮点 MIN/MAX 的
默认七项 count 序列重复执行、INT8/两种 FP8 的 SUM/MIN/MAX、Group/Bare/Threads
即时同步、REARM、AllGather/归约切换、FP32 rooted Reduce count1024 及通信/P2P 控制回归。

协议支持上限 8 rank 不等于已完成 8 rank 实机验收。world3/5/6/7/8 的 byte SUM 资产
已生成并通过 cmodel；本轮未实机覆盖这些规模、16 位模型输入 offset2，以及所有
dtype/root/in-place/count 组合。开发验收明细见仓库中的 `docs/develop/INTERFACE_COVERAGE_MATRIX.md`。

首轮 chip3→chip2 故障来自启动后留下的不匹配配置：chip3 ctrl1 EP 的 operational MPS 为512字节、chip2 ctrl2 RC
为128字节，尽管两端宣告能力均为1024字节；A/B/A 验证确认将 RC 恢复到512字节后通过，回退128字节重现丢失，
再设512字节恢复。后续 chip0→chip3→chip2 探针另有一次误将 chip3 RC2 降到128字节的配置错误，现已纠正；
当前四个 C2C EP/RC 均配置为512字节，Host ctrl1 EP0 单独保持128字节。完整诊断记录见
`docs/develop/dma128_colleague_audit_20261001.md`。

当前 `ring_plan.cpp` 使用整块描述符，已移除128字节软件分片和 `AX_NEULINK_REMOTE_DMA_MAX_BYTES`；
当前源码已取消逻辑 count 的1024上限，并将原生块扩大到 1 MiB 描述符预算；模型块保持1024列。
此前固定块配套库受测形态通过262144，首次SUM数值异常仍开放（`docs/develop/OPEN_DEFECTS.md` D-009）。当前交付在 BL1 的 RC 初始化中复用既有 MPS 设置函数，
在开启链路前将 RC 设为512字节，匹配 BL1 原有 EP512 策略；`pcie_c2c_ctrl.c` 已恢复原代码。
独立 Host 端点继续遵守 Host 协商的128字节。用户更新 PAC 并重启后，四芯 RC/C2C EP 冷读均为512字节、Host端点128字节；
原生设备栈上的1024控制和单条1MiB写通过，验证了本次启动配置效果。

未分片验收完成16个阳性进程、250轮、1076项输入/输出检查，均为0 mismatch，包含两芯/四芯浮点 SUM、
六种浮点 MIN/MAX、mixed-wide、comm-mixed、P2P 及三项 SUM final 配置。FP32 P2P PLAN offset为0，
byte dtype为1，FP16/BF16为2。Host 与四个 Device 的最终清理检查通过；以下是原内核加 MPS 热修正的验收结果，不等于新 BL1 冷启动验收。
完整记录以[`VALIDATION.md`](../../../../../out/ccl_dma_mps_fix_20261001_a01/VALIDATION.md) 为准，逐项证据见
`docs/develop/dma128_colleague_audit_20261001.md`。

修改前的新 PAC 两/四芯调用实测：count1025/4096/65536/262144（最后一项为1MiB FP32）在
AllReduce SUM/MIN、AllGather、Broadcast、Send/Recv的40项用例中均被Host检查拒绝
（`0x80305B03`），没有大count NPU执行；同板单条、单行、无分片1MiB C2C写通过。
这些结果记录的是修改前的拒绝；后续源码已实现内部分块，本轮按用户要求不上 HAPS。
不能把底层 DMA 能力、预期拒绝或本地仿真当作新版大 count 实机通过。
详细记录见[`新PAC实测`](../../../../../out/ccl_count_capacity_20261001_a01/VALIDATION.md)。

## 6. 部署约束

- Host 库、Device 侧 Worker 与 `libax_neulink.so` 必须匹配同一 wire/ABI；协议升级时需要
  同步更新相关双方，没有旧协议 fallback。接口保持兼容时可以热更新 NeuLink 库；
- AXCCL 只有一套执行 wire，协议版本为 v5，会话 opcode 固定为 15..19，1..14 是删除旧协议
  留下的空洞且永不复用；
- 当前 `libax_neulink.so` 只注册 C2C provider，对外保留 `GetTopology` / `ReleaseTopology`
  与 `EstablishRing` / `CheckRingKey` / `ConnectRing` / `LaunchRing` / `RearmRing` /
  `ReleaseRing` 共 8 个入口；
- 内嵌模型资产与 loader 一同编译部署，不能将旧五项 IO 模型直接混入当前四项 IO loader。
  只读挂载和 bind 热更新在设备重启后需要重新应用，不等于已经更新 PAC；
- CCL 异步状态查询使用独立的 v6 查询记录，包含预期完成序号和私有 Event 的记录代数；
  会话执行与 NeuLink 基础 ABI 仍为 v5。Host 和 Worker 的查询版本必须匹配，没有旧查询 fallback；
- 错误和执行进度由 CCL 模块保存；通用 Dispatcher/Stream 不识别 CCL 专用状态。
  私有 Event 仅证明队列推进，成功还须有匹配的 CCL 执行结果；标记未确认时不推断任务被跳过。
  Event 在已完成且没有查询快照引用时复用，清理失败或创建/记录结果不确定时保留资源归属；
- `AXCL_CCL` 错误子模块 ID 为 `0x5B`。

## 7. 相关文档

- [AXCCL API](../c/axccl_api.md)：AXCCL 公共接口的参数、返回值与调用示例；
- [编程模型](programming.md)：Stream、Event 与异步提交的编程语义；
- [核心概念](concept.md)：Device、Context、Stream、Task、Event 的层级关系；
- [内存管理](memory.md)：Host / Device 内存与数据搬运。
