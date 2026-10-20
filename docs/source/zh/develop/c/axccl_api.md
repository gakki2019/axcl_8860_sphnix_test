# AXCCL

AXCCL 是面向多进程、多设备应用的集合通信库。Linux 默认启用自动成员发现；其他构建平台沿用本地后端。`axCclCommInitRootInfo` / `axCclCommInitRank` 默认自动发现 rank 所在进程：同一进程使用本地路径，每个 rank 属于独立进程时使用 Linux 同 Host 多进程路径，无需设置环境变量。默认自动模式须先注册全部声明的 rank，才能执行数据操作或使用注册/自定义算子等需确认路由的功能；可在同一线程中顺序完成各 rank 的 Init。初始化语义和能力范围见文末[自动引导与多进程模式](#axccl-multiprocess)。

当前能力（2026-10-04）：AllGather/Broadcast/Gather/Scatter/Send/Recv/AllToAll/V 原样搬运全部十四种类型。AllReduce、Reduce 和 ReduceScatter 支持全部十四种类型的 SUM/PROD/MIN/MAX/AVG，以及同类型标量的 PreMulSum。能力声明与本地、单芯和 HAPS 验收范围分别记录。

| 类型 | 支持算子 | 数值契约 |
|---|---|---|
| FP32/FP16/BF16/FP8 两种 | SUM/PROD/MIN/MAX/AVG | 原生三浮点 SUM 保持 C2C 路径；模型 PROD 和 AVG 按逻辑 rank 使用 FP32 中间值，AVG 先缩放再加法 |
| INT8/UINT8/INT16/UINT16 | SUM/PROD/MIN/MAX/AVG | 最终饱和转换；AVG 向零截断 |
| INT32/UINT32 | SUM/PROD/MIN/MAX/AVG | 完整32位精度；SUM/PROD最终饱和，AVG精确求和后向零截断 |
| INT64/UINT64 | SUM/PROD/MIN/MAX/AVG及原样搬运 | 保留完整64位；SUM/PROD最终饱和，AVG精确宽位求和后向零截断 |
| FP64 | SUM/PROD/MIN/MAX/AVG及原样搬运 | SUM/PROD按逻辑rank进行binary64运算；AVG精确求和、除以worldSize后一次最近偶数舍入；MIN/MAX保留完整位宽 |

多 rank 的 FP64 复用现有 NPU 整数原语实现 binary64 运算，保留渐进下溢和带符号零，不将完整值转为 FP32。NaN 和无效运算输出规范 NaN `0x7ff8000000000000`；MIN/MAX 遇到任意 NaN 也返回该值，混合正负零分别选择负零/正零。AVG 有限输入采用精确总和，因此不会因为中间求和溢出或预乘倒数丢失最小次正规数；异号无穷之和返回规范 NaN。

新整数路径复用已有NPU原语；32/64位AVG只对有界字与进位/余数使用精确FP32中间量，保持全部输入位，不将完整32/64位整数转为浮点。64位SUM保留宽位总和至最终饱和，PROD使用16位部分乘积并保留符号和晚零。单芯执行与完整通信验收分别记录，最新验证见[64位算术扩展](../../../../develop/CCL_INT64_ARITHMETIC_IMPLEMENTATION_20261003.md)，前阶段记录见[整数规约扩展](../../../../develop/CCL_INTEGER_REDUCTION_IMPLEMENTATION_20261003.md)。

本地与 HAPS 的具体覆盖范围见[实现和验收记录](../../../../develop/CCL_CAPABILITY_IMPLEMENTATION_20261003.md)；声明支持不等于所有规模/非有限输入均已实机覆盖。


当前单进程支持1–8个不同Device。单rank的五种内置规约是逐字节恒等操作，保留NaN payload与正负零；多rank保持下表的规约规则。NULL Stream选择当前Context的已有默认Stream；结果仍须同步所选Stream或Device后读取。count=0在校验dtype/op/root/context和通信轮次后入队逻辑空操作，不读取tensor或标量。

单进程的Group支持嵌套、多轮及混合完整集合操作、配对P2P、协调的跨通信域操作和Barrier。仅最外层GroupEnd提交；每个domain/rank在同组使用一个Context/Stream，所有匹配与依赖循环在入队前检查。多进程仅支持同一通信域的纯集合操作Group或纯Send/Recv Group，详见文末限制。共享Device/Stream上的其他未完成通信域仍须由应用串行安排，不提供自动并发调度。

## 1. 目录

- [axCclAllGather](#axCclAllGather)：从所有 rank 收集等量数据到所有 rank；支持全部十四种存储类型。
- [axCclAllReduce](#axCclAllReduce)：对所有 rank 的数据做逐元素归约，结果返回所有 rank。
- [axCclAllToAll](#axCclAllToAll)：单进程等量全交换，支持全部存储类型。
- [axCclAllToAllV](#axCclAllToAllV)：单进程变长全交换，支持零长度段和 Host 数组快照。
- [axCclBarrier](#axCclBarrier)：已建环通信域内的异步屏障。
- [axCclBroadcast](#axCclBroadcast)：将 root 的数据广播到所有 rank。
- [axCclCommAbort](#axCclCommAbort)：关闭通信域提交入口；成功释放空闲域或已由独立查询证明完成且健康的域。
- [axCclCommCount](#axCclCommCount)：查询通信域的 world size。
- [axCclCommDeregister](#axCclCommDeregister)：注销已注册的缓冲区。
- [axCclCommDestroy](#axCclCommDestroy)：释放通信域句柄。
- [axCclCommDevice](#axCclCommDevice)：查询通信域绑定的逻辑设备 ID。
- [axCclCommFinalize](#axCclCommFinalize)：终结通信域，并将其标记为不可用。
- [axCclCommGetAsyncError](#axCclCommGetAsyncError)：读取并消费本通信域句柄的异步错误通知，失败状态仍保留。
- [axCclCommInitAll](#axCclCommInitAll)：在单进程内为多个设备各创建一个通信域。
- [axCclCommInitRank](#axCclCommInitRank)：按 rank 创建单个通信域，是 [axCclCommInitRootInfo](#axCclCommInitRootInfo) 的别名。
- [axCclCommInitRootInfo](#axCclCommInitRootInfo)：用广播的 root info 创建通信域。
- [axCclCommRank](#axCclCommRank)：查询通信域自身的 rank。
- [axCclCommRegister](#axCclCommRegister)：注册设备缓冲区以复用本地映射资源。
- [axCclFinalize](#axCclFinalize)：去初始化 CCL 模块。
- [axCclGather](#axCclGather)：将所有 rank 的数据收集到 root。
- [axCclGetErrorString](#axCclGetErrorString)：获取错误码的描述字符串。
- [axCclGetRootInfo](#axCclGetRootInfo)：在 rank 0 上生成建链用的 root info。
- [axCclGetVersion](#axCclGetVersion)：查询 CCL 库的版本号。
- [axCclGroupEnd](#axCclGroupEnd)：准备并提交当前 Group 收集到的所有 rank。
- [axCclGroupStart](#axCclGroupStart)：开始收集一轮集合操作或配对的 Send/Recv。
- [axCclInit](#axCclInit)：初始化 CCL 模块。
- [axCclRecv](#axCclRecv)：从指定 rank 接收数据，仅匹配的双方参与。
- [axCclRedOpCreatePreMulSum](#axCclRedOpCreatePreMulSum)：创建预乘求和归约算子。
- [axCclRedOpDestroy](#axCclRedOpDestroy)：销毁自定义归约算子。
- [axCclReduce](#axCclReduce)：将所有 rank 的数据归约到 root。
- [axCclReduceScatter](#axCclReduceScatter)：归约后按等分片散回各 rank。
- [axCclScatter](#axCclScatter)：将 root 的数据分片散到所有 rank。
- [axCclSend](#axCclSend)：向指定 rank 发送数据，仅匹配的双方参与。

<br>

## 2. API

<a id="axCclAllGather"></a>

### 2.1. axCclAllGather

从所有 rank 收集等量数据到所有 rank。

#### 2.1.1. 函数

```c
AX_CCL_EXPORT axclError axCclAllGather(const void *sendbuff, void *recvbuff, size_t sendcount, axCclDataType dtype, axCclComm comm, axclrtStream stream);
```

#### 2.1.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| sendbuff | in | 源设备缓冲区，`sendcount` 个元素。传 `AX_CCL_IN_PLACE` 表示直接收集到本 rank 在 `recvbuff` 中的分片。 |
| recvbuff | out | 结果设备缓冲区，`sendcount * worldSize` 个元素，按 rank 顺序排列。 |
| sendcount | in | 本 rank 贡献的元素个数。 |
| dtype | in | 元素类型。 |
| comm | in | 通信域。 |
| stream | in | 接收该操作的 Stream。 |

#### 2.1.3. 返回值

- `AXCL_SUCC`：本 rank 的调用已登记或入队，读取结果前须同步各参与 Stream。
- `AXCL_ERR_CCL_ILLEGAL_PARAM`：类型、数量、对齐、缓冲区范围或各 rank 的操作不匹配。
- `AXCL_ERR_CCL_NULL_POINTER`：活动输入或输出为 NULL（零长度缓冲区可为 NULL；NULL Stream 使用当前 Context 的默认 Stream）。
- `AXCL_ERR_CCL_INVALID_COMM` / `AXCL_ERR_CCL_INVALID_STATE`：通信域无效或生命周期状态不允许提交。
- `AXCL_ERR_CCL_UNSUPPORT`：当前实现不支持该 rank 数量。

#### 2.1.4. 说明

- 支持 1–8 rank，`sendcount >= 0`，无1024元素人工上限，支持全部十四种存储类型。每个接收缓冲区须由调用方分配 `worldSize * sendcount` 个元素；输入输出按元素宽度对齐。
- 输出第 r 段来自逻辑 rank r，与 C2C 物理环的转发顺序无关。只搬运字节，不转换或归约数值，NaN payload、Inf、正负零和次正规数均原样保留。
- 原地操作要求本地输入已经位于 `recvbuff + rank * sendcount * elementBytes`。可传 `AX_CCL_IN_PLACE` 或该片段的精确指针；其他部分重叠、错误 rank 片段和地址溢出会被拒绝。
- 支持显式 Group，也可像 AllReduce 一样每个 rank 提交一次裸调用；各 rank 必须使用相同操作、类型和 sendcount。不同轮次可在同一通信域中切换 AllGather/AllReduce。
- 实现使用会话 scratch 进行 C2C ring 转发，再按逻辑 rank 拼接输出，不调用 NPU 归约模型。已通过 C2C 模拟器逐字节验证，以及 HAPS 两/四 rank 的连续调用和 AllGather/AllReduce 同域切换；实际硬件覆盖范围见[集合通信](../arch/collective.md#ccl-haps-validation)。

<br>

<a id="axCclAllReduce"></a>

### 2.2. axCclAllReduce

对所有 rank 的数据做逐元素归约，结果返回所有 rank。

#### 2.2.1. 函数

```c
AX_CCL_EXPORT axclError axCclAllReduce(const void *sendbuff, void *recvbuff, size_t count, axCclDataType dtype, axCclRedOp op, axCclComm comm, axclrtStream stream);
```

#### 2.2.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| sendbuff | in | 源设备缓冲区，`count` 个元素。可与 `recvbuff` 完全相同（就地归约），也可传 `AX_CCL_IN_PLACE` 表示就地归约到 `recvbuff`。 |
| recvbuff | out | 结果设备缓冲区，`count` 个元素。不能传 `AX_CCL_IN_PLACE`。 |
| count | in | 完整逻辑元素个数，可为零或小于worldSize；无1024元素人工上限。调用方须提供足够的有效设备内存。 |
| dtype | in | 支持全部十四种公开类型：FP32、FP16、BF16、FP64、FP8 E4M3/E5M2，以及8/16/32/64位有符号和无符号整数。整数保留完整位宽。 |
| op | in | 全部类型支持 SUM/PROD/MIN/MAX/AVG，也支持 [axCclRedOpCreatePreMulSum](#axCclRedOpCreatePreMulSum) 创建的同类型标量预乘求和算子。 |
| comm | in | 通信域。 |
| stream | in | 接收该操作的Stream；NULL选择当前Context的默认Stream。 |

#### 2.2.3. 返回值

- `AXCL_SUCC`：Group 内描述符已收集，或裸调用已登记/入队；不表示数据面执行完成。
- `AXCL_ERR_CCL_UNSUPPORT`：通信域的 `worldSize`不在1到协议上限之间。
- `AXCL_ERR_CCL_ILLEGAL_PARAM`：`count` 越界；`dtype` 或 `op` 不受支持；`sendbuff` 与 `recvbuff` 部分重叠；`recvbuff` 传 `AX_CCL_IN_PLACE`；当前设备与 `comm` 绑定的设备不一致；Stream 所属设备与 `comm` 所属设备不一致。
- `AXCL_ERR_CCL_NULL_POINTER`：正count需要的sendbuff或recvbuff为NULL；零长度无需缓冲区，NULL Stream选择默认Stream。
- `AXCL_ERR_CCL_INVALID_COMM`：`comm` 不是有效句柄。
- `AXCL_ERR_CCL_INVALID_STATE`：CCL 模块尚未初始化，或调用线程没有当前 Context。

#### 2.2.4. 说明

- 本接口**异步入队**：返回表示已入队，不表示数据面操作完成。用 [axclrtSynchronizeStream](stream_api.md#axclrtSynchronizeStream) 或 event 等待完成。
- 在 [axCclGroupStart](#axCclGroupStart) / [axCclGroupEnd](#axCclGroupEnd) 之间调用时，本接口只收集描述符，由 [axCclGroupEnd](#axCclGroupEnd) 统一提交。域已建立后的裸调用直接在本 rank 的 Stream 上入队，不在 Host 等待整轮 rank。对于 `InitRootInfo` 创建且尚未建环的域，首轮裸调用先隐式收集各 rank；收齐后建立会话并提交。读取结果前须提交所有匹配的 rank 调用，再同步相应 Stream。
- 全部十四种类型支持 SUM/PROD/MIN/MAX/AVG。同一次集合操作中各 rank 的 `count`、`dtype` 和 `op` 必须一致；同一个通信域的不同轮次可以切换类型和归约算子。当前文档列出的算术能力不代表全部类型/规模均已通过 HAPS。
- `AX_CCL_DT_FP8_E4M3` 使用 E4M3FN 编码，最大有限值 448；`AX_CCL_DT_FP8_E5M2` 最大有限值 57344。不隐式应用量化 scale。INT8/FP8 使用 NPU 模型提升到 FP32 归约，SUM 只计算有效 rank，最后一次饱和转换：INT8 限制到 [-128,127]，FP8 限制到对应有限范围并按最近偶数舍入；不是 8 位回绕，也不是逐 rank 饱和。已通过本地 gather mcode → 实际模型 cmodel → finish mcode 的数值验证。
- MIN/MAX 及 INT8/FP8 SUM 由 C2C DMA 汇集 rank 数据，再由 NPU 模型归约，最后由 C2C DMA 写回；Device CPU 不参与数值归约。Host 在入队确认后返回，Worker Stream 顺序完成 gather、模型、finish 三个阶段；模型路径的耗时可能高于原生 C2C SUM。当前数值测试覆盖有限值；NaN 和正负零并列时的硬件行为尚未定义。
- 当前内嵌模型使用单芯单核生成路径，无动态 runtime/SHOCM 声明，生产 loader 绑定四项模型 IO。应用无需额外提供模型 scratch，也无需为下一轮归约重新初始化 SYS/NPU 或重建 communicator。模型复用、MIN/MAX 切换、双缓冲以及集合通信连续执行已通过 HAPS 验证；生成器、资产与 loader 应配套更新。这个结论针对当前 AXCCL 资产，不代表任意旧 SHOCM 模型的驱动问题已修复。
- 完整逻辑 count 使用64位传递。NeuLink 的纯复制和三浮点 SUM 按单条 DMA 最多 1 MiB 分块；Scatter/ReduceScatter 的整组载荷共享该预算。模型归约按有效块选择1024列小模型或每 rank 1 MiB 大模型，两类模型均无SHOCM声明。该内部预算不限制公共 count。AllGather/Gather/Scatter/ReduceScatter 保持完整 rank stride，并处理尾块。两个信号槽交替使用，每块确认完成后复位本地槽。仍会拒绝字节数溢出、越界、容量不足或非法重叠。
- 扩大原生块之前的2026-10-02配套库HAPS已通过受测1025/2051/4096/65536/262144形态及尾块/sample矩阵；四芯FP32 SUM count262144首次首轮数值失败，后续原版与输出诊断通过，根因未证明，可靠性问题仍开放（`docs/develop/OPEN_DEFECTS.md` D-009）。实现没有1024上限，不等于任意规模组合都已实机验证。
- DMA 首轮故障来自启动后的 MPS 不匹配（chip3 EP512 B、chip2 RC128 B）；现有 NeuLink 使用整块远端描述符，不做128字节软件分片。BL1 RC 初始化补设512字节以匹配既有 EP512，原内核 `pcie_c2c_ctrl.c` 保持原代码；独立 Host 端点仍按 Host 协商128字节。用户新 PAC 冷启动已验证受测链路配置和单条1MiB搬运；修改前40项大 count 集合调用仍被旧软件拒绝，该历史结果不代表新版通过。参见[硬件验证](../arch/collective.md#ccl-haps-validation)。
- FP16 的最大有限值是 65504，最小正规数是 `2^-14`（约 `6.1e-5`）；BF16 的指数范围与 FP32 相近，最大有限值约为 `3.39e38`。SUM 在 reduce-scatter 阶段把每轮部分和写回所选的 16 位格式，因此 FP16 即使各 rank 输入都可表示，累加结果仍可能超出范围。例如 8 个 rank 各提供 10000，数学和 80000 已超过 FP16 上限。需要较大动态范围时选 BF16 或 FP32；loss scaling 主要用于缓解小梯度下溢，不能保证避免这里的求和溢出。四芯样例的 SUM 数值和舍入已通过 HAPS 验证，但 FP16 溢出表征仍未覆盖。
- 缓冲区支持精确别名（`sendbuff == recvbuff`）或完全不重叠；部分重叠会被拒绝。
- `sendbuff` 与 `recvbuff` 必须是由 [axclrtMalloc](memory_api.md#axclrtMalloc) 分配的设备地址，并且在所有参与 Stream 上完成前保持有效。
- 调用线程必须先用 [axclrtSetDevice](device_api.md#axclrtSetDevice) 激活与 `comm` 一致的设备。

#### 2.2.5. 示例

```c
 axCclAllReduce(buf, buf, 1024, AX_CCL_DT_FP32, AX_CCL_OP_SUM, comm, stream);
 axclrtSynchronizeStream(stream);
```

#### 2.2.6. 参考

- [axCclGroupStart](#axCclGroupStart)
- [axCclGroupEnd](#axCclGroupEnd)
- [axCclCommInitRootInfo](#axCclCommInitRootInfo)
- [axclrtMalloc](memory_api.md#axclrtMalloc)
- [axclrtSynchronizeStream](stream_api.md#axclrtSynchronizeStream)

<br>

<a id="axCclAllToAll"></a>

### 2.3. axCclAllToAll

等量全交换。

#### 2.3.1. 函数

```c
AX_CCL_EXPORT axclError axCclAllToAll(const void *sendbuff, void *recvbuff, size_t count, axCclDataType dtype, axCclComm comm, axclrtStream stream);
```

#### 2.3.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| sendbuff | in | 源设备缓冲区，`count * worldSize` 个元素；支持AX_CCL_IN_PLACE和Device快照。 |
| recvbuff | out | 结果设备缓冲区，`count * worldSize` 个元素。 |
| count | in | 本 rank 发往每个其他 rank 的元素个数。 |
| dtype | in | 元素类型。 |
| comm | in | 通信域。 |
| stream | in | 接收该操作的 Stream。 |

#### 2.3.3. 返回值

- `AXCL_SUCC`：描述符已登记或整轮已入队，尚未代表通信完成。
- `AXCL_ERR_CCL_ILLEGAL_PARAM`：非法 count、位移、重叠或跨 rank 配置不匹配。
- `AXCL_ERR_CCL_UNSUPPORT`：不支持的通信域规模，或通信域启用了多进程模式。

#### 2.3.4. 说明

- 支持单进程 1–8 个不同设备、全部十四种存储类型。完整一轮经 Group 或裸调用收集，所有校验与会话准备完成后入队；同步全部参与 Stream 后再读取或复用缓冲区。
- 多进程模式仍不支持 AllToAll，返回 `AXCL_ERR_CCL_UNSUPPORT`；Send/Recv 的多进程支持不改变该限制。
- 自 rank 段使用既有 NeuLink 本地 DMA，其余使用配对的 Send/Recv 会话。`AX_CCL_IN_PLACE` 将发送基址解析为接收基址；活动发送/接收段重叠时先通过 Device 临时缓冲快照全部发送段，再写接收段。活动接收段之间仍不能重叠；临时缓冲在安全的域清理时释放。

<br>

<a id="axCclAllToAllV"></a>

### 2.4. axCclAllToAllV

变长全交换，对应 all_to_all_single。

#### 2.4.1. 函数

```c
AX_CCL_EXPORT axclError axCclAllToAllV(const void *sendbuff, const int64_t *sendCounts, const int64_t *sdispls, void *recvbuff, const int64_t *recvCounts, const int64_t *rdispls, axCclDataType dtype, axCclComm comm, axclrtStream stream);
```

#### 2.4.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| sendbuff | in | 源设备缓冲区。 |
| sendCounts | in | 本 rank 发往各 rank 的元素个数，长度为 `worldSize`。 |
| sdispls | in | 各发送段在 `sendbuff` 中的元素偏移，长度为 `worldSize`。 |
| recvbuff | out | 结果设备缓冲区。 |
| recvCounts | in | 本 rank 从各 rank 接收的元素个数，长度为 `worldSize`。 |
| rdispls | in | 各接收段在 `recvbuff` 中的元素偏移，长度为 `worldSize`。 |
| dtype | in | 元素类型。 |
| comm | in | 通信域。 |
| stream | in | 接收该操作的 Stream。 |

#### 2.4.3. 返回值

- `AXCL_SUCC`：描述符已登记或整轮已入队，尚未代表通信完成。
- `AXCL_ERR_CCL_ILLEGAL_PARAM`：非法 count、位移、重叠或跨 rank 配置不匹配。
- `AXCL_ERR_CCL_UNSUPPORT`：不支持的通信域规模。

#### 2.4.4. 说明

- counts/displacements 是长度为 worldSize 的 Host 数组，函数内复制快照；值须非负，单位为元素。AX_CCL_IN_PLACE仍须传入全部四个数组，分别描述recvbuff中的发送和接收布局。每条有向发送段必须与对端接收段元素数量一致。零长度段和全零交换合法；完全不使用的缓冲区可为 NULL。
- 支持单进程 1–8 个不同设备、全部十四种存储类型。完整一轮经 Group 或裸调用收集，所有校验与会话准备完成后入队；同步全部参与 Stream 后再读取或复用缓冲区。
- 多进程模式仍不支持 AllToAllV，返回 `AXCL_ERR_CCL_UNSUPPORT`；其单进程数组快照和 Device 数据路径保持原有行为。
- 自 rank 段使用既有 NeuLink 本地 DMA，其余使用配对的 Send/Recv 会话。`AX_CCL_IN_PLACE` 将发送基址解析为接收基址；活动发送/接收段重叠时先通过 Device 临时缓冲快照全部发送段，再写接收段。活动接收段之间仍不能重叠；临时缓冲在安全的域清理时释放。

<br>

<a id="axCclBarrier"></a>

### 2.5. axCclBarrier

全局屏障。

#### 2.5.1. 函数

```c
AX_CCL_EXPORT axclError axCclBarrier(axCclComm comm, axclrtStream stream);
```

#### 2.5.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| comm | in | 通信域。 |
| stream | in | 接收该操作的 Stream。 |

#### 2.5.3. 返回值

- `AXCL_SUCC`：本 rank 的屏障调用已登记或入队，完成须由 Stream 同步确认。
- NULL Stream 使用当前 Context 的默认 Stream。
- `AXCL_ERR_CCL_INVALID_COMM`：通信域句柄无效。
- `AXCL_ERR_CCL_INVALID_STATE`：生命周期状态不允许提交；延迟建环和显式 Group 内匹配的屏障均支持。
- 其他错误：复用 AllReduce 路径时返回对应 CCL 错误。

#### 2.5.4. 说明

- 使用会话自有 stage 缓冲和 FP32 SUM AllReduce 的 signal 汇合，不需要应用传入数据缓冲区。
- `CommInitAll` 预建会话；`InitRootInfo` 域可以直接以屏障作为首轮操作，首次完整调用会建立会话。
- 支持显式 Group 内的匹配屏障轮次。所有 rank 须以相同次序提交屏障，再同步对应 Stream；成功返回不表示整个域已经到达屏障。

<br>

<a id="axCclBroadcast"></a>

### 2.6. axCclBroadcast

将 root 的数据广播到所有 rank。

#### 2.6.1. 函数

```c
AX_CCL_EXPORT axclError axCclBroadcast(const void *sendbuff, void *recvbuff, size_t count, axCclDataType dtype, int32_t root, axCclComm comm, axclrtStream stream);
```

#### 2.6.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| sendbuff | in | root 持有数据的设备缓冲区，`count` 个元素。非 root 忽略该参数，可传 NULL；传 `AX_CCL_IN_PLACE` 表示每个 rank 都就地使用 `recvbuff`。 |
| recvbuff | out | 接收数据的设备缓冲区，`count` 个元素。 |
| count | in | 元素个数。 |
| dtype | in | 元素类型。 |
| root | in | 数据源的 rank。 |
| comm | in | 通信域。 |
| stream | in | 接收该操作的 Stream。 |

#### 2.6.3. 返回值

- `AXCL_SUCC`：本 rank 的调用已登记或入队，不表示硬件已经完成；不支持的 dtype 或参数返回对应 CCL 错误。

#### 2.6.4. 说明

- 支持 1–8 rank、全部十四种存储类型，count >= 0，无1024元素人工上限；所有 rank 提供接收缓冲区，root 取值为 0..worldSize-1。只搬运字节，不做归约。
- 支持显式 Group 或裸调用；读取接收数据前须同步参与 Stream。已有 C2C 模拟与历史 HAPS 验证记录，不能将实现支持范围视为所有类型/规模组合的实机验收。

<br>

<a id="axCclCommAbort"></a>

### 2.7. axCclCommAbort

关闭通信域提交入口，并释放从未启动过任务的空闲域。

#### 2.7.1. 函数

```c
AX_CCL_EXPORT axclError axCclCommAbort(axCclComm comm);
```

#### 2.7.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| comm | in | 通信域。 |

#### 2.7.3. 返回值

- `AXCL_SUCC`：空闲域或已证明完成且健康的域已关闭并释放，随后直接 Destroy 每个 rank 句柄。
- `AXCL_ERR_CCL_UNSUPPORT`：仍有运行任务或并发 lease，缺少安全硬件停止证明，保留资源；提交入口已关闭。
- `AXCL_ERR_CCL_INVALID_STATE`：当前处于活动 Group，或终止状态不允许此操作。

#### 2.7.4. 说明

- 成功 Abort 不需要先 Finalize；每个 rank 的句柄仍须 [axCclCommDestroy](#axCclCommDestroy)。未提交的隐式描述符会被丢弃。
- 自动引导尚未就绪且尚未提交 Device 工作时，Abort 可取消会合并等待后台线程退出；借用的原始 Context 必须保持有效直到清理返回。此取消不提供硬件任务停止能力。
- 已提交过任务的健康域通过有界独立查询证明所有历史 Stream 完成后可 Abort；不会等待或取消运行任务，也不会以释放 fd、Finalize 或软件取消代替硬件停止。失败/未知完成时保留缓冲区、Stream、Context 和 Runtime，等待受控恢复。

#### 2.7.5. 参考

- [axCclCommDestroy](#axCclCommDestroy)

<br>

<a id="axCclCommCount"></a>

### 2.8. axCclCommCount

查询通信域的 world size。

#### 2.8.1. 函数

```c
AX_CCL_EXPORT axclError axCclCommCount(axCclComm comm, int32_t *count);
```

#### 2.8.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| comm | in | 通信域。 |
| count | out | 成功时返回通信域包含的 rank 总数。 |

#### 2.8.3. 返回值

- `AXCL_SUCC`：成功返回 world size。
- `AXCL_ERR_CCL_NULL_POINTER`：`count` 为 NULL。
- `AXCL_ERR_CCL_INVALID_COMM`：`comm` 不是有效句柄。

#### 2.8.4. 参考

- [axCclCommRank](#axCclCommRank)
- [axCclCommDevice](#axCclCommDevice)

<br>

<a id="axCclCommDeregister"></a>

### 2.9. axCclCommDeregister

注销已注册的缓冲区。

#### 2.9.1. 函数

```c
AX_CCL_EXPORT axclError axCclCommDeregister(axCclComm comm, void *handle);
```

#### 2.9.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| comm | in | 通信域。 |
| handle | in | [axCclCommRegister](#axCclCommRegister) 返回的句柄。 |

#### 2.9.3. 返回值

- `AXCL_SUCC`：已注销句柄。
- `AXCL_ERR_CCL_INVALID_STATE`：仍有已接受的操作使用该注册；操作完成后可重试。
- `AXCL_ERR_CCL_ILLEGAL_PARAM`：句柄无效或不属于该通信域。

#### 2.9.4. 说明

- 注销不会等待应用 Stream。若已有工作仍持有该注册，接口返回 `AXCL_ERR_CCL_INVALID_STATE`，调用方应等待相关工作完成后重试。域成功 Finalize 或成功的空闲或完成域 Abort 会清理该域所有 rank 的注册。

#### 2.9.5. 参考

- [axCclCommRegister](#axCclCommRegister)

<br>

<a id="axCclCommDestroy"></a>

### 2.10. axCclCommDestroy

释放通信域句柄。

#### 2.10.1. 函数

```c
AX_CCL_EXPORT axclError axCclCommDestroy(axCclComm comm);
```

#### 2.10.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| comm | in | 待释放的通信域句柄。 |

#### 2.10.3. 返回值

- `AXCL_SUCC`：成功释放句柄。
- `AXCL_ERR_CCL_INVALID_COMM`：`comm` 不是有效句柄。
- `AXCL_ERR_CCL_INVALID_STATE`：当前处于未结束的 Group 中。

#### 2.10.4. 说明

- 本接口不隐式调用 [axCclCommFinalize](#axCclCommFinalize)：必须先终结（或中止）通信域，再释放句柄。
- Group 未结束时不允许销毁，需先调用 [axCclGroupEnd](#axCclGroupEnd)。

#### 2.10.5. 参考

- [axCclCommFinalize](#axCclCommFinalize)
- [axCclFinalize](#axCclFinalize)

<br>

<a id="axCclCommDevice"></a>

### 2.11. axCclCommDevice

查询通信域绑定的逻辑设备 ID。

#### 2.11.1. 函数

```c
AX_CCL_EXPORT axclError axCclCommDevice(axCclComm comm, int32_t *deviceId);
```

#### 2.11.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| comm | in | 通信域。 |
| deviceId | out | 成功时返回该通信域绑定的逻辑设备 ID。 |

#### 2.11.3. 返回值

- `AXCL_SUCC`：成功返回设备 ID。
- `AXCL_ERR_CCL_NULL_POINTER`：`deviceId` 为 NULL。
- `AXCL_ERR_CCL_INVALID_COMM`：`comm` 不是有效句柄。

#### 2.11.4. 参考

- [axCclCommCount](#axCclCommCount)
- [axCclCommRank](#axCclCommRank)

<br>

<a id="axCclCommFinalize"></a>

### 2.12. axCclCommFinalize

终结通信域，并将其标记为不可用。

#### 2.12.1. 函数

```c
AX_CCL_EXPORT axclError axCclCommFinalize(axCclComm comm);
```

#### 2.12.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| comm | in | 待终结的通信域句柄。 |

#### 2.12.3. 返回值

- `AXCL_SUCC`：成功终结。
- `AXCL_ERR_CCL_INVALID_COMM`：`comm` 不是有效句柄。
- `AXCL_ERR_CCL_INVALID_STATE`：当前处于未结束的 Group 中。
- 其他错误：启动不完整或完成状态不确定时返回错误，并保留全部对端资源。

#### 2.12.4. 说明

- 对于已使用的通信域，第一次终结会排空**所有**参与的 application Stream，释放 ring session 资源并关闭整个域，包括域内已建立的配对通道。这些 Stream、Context 和设备必须保持存活直到清理完成。
- 从未提交操作的 Stream 不需要排空；已入队的裸调用同样受域终结的排空约束。
- 自动引导仍在等待 rank 且尚未提交 Device 工作时，Finalize 可取消会合并等待后台线程退出，随后才可释放借用的原始 Context。已就绪的多进程域仍要求所有 rank 参加 Finalize。
- 在一个未提交的 Group 内调用终结会被拒绝。
- 返回启动不完整或完成状态不确定的错误时，**不要**释放缓冲区、销毁 Context、复位设备或拆除 Runtime。
- 终结后必须对每个通信域调用 [axCclCommDestroy](#axCclCommDestroy)。
- 本接口用于最终资源清理。应用读取结果或复用缓冲区前仍须显式同步 Stream（见 [axCclAllReduce](#axCclAllReduce)），不能依靠终结来安排中间操作顺序。

#### 2.12.5. 参考

- [axCclCommDestroy](#axCclCommDestroy)
- [axCclFinalize](#axCclFinalize)

<br>

<a id="axCclCommGetAsyncError"></a>

### 2.13. axCclCommGetAsyncError

读取并消费本通信域句柄的异步错误通知。

#### 2.13.1. 函数

```c
AX_CCL_EXPORT axclError axCclCommGetAsyncError(axCclComm comm, axclError *err);
```

#### 2.13.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| comm | in | 通信域。 |
| err | out | 成功时返回待处理的异步错误码；没有待处理错误时返回 `AXCL_SUCC`。 |

#### 2.13.3. 返回值

- `AXCL_SUCC`：查询成功；`*err` 是待报告错误，或没有新通知时为 `AXCL_SUCC`。
- `AXCL_ERR_CCL_INVALID_STATE`：单进程路径的查询锁正被占用，或当前线程处于活动Group；多进程查询不等待提交锁。
- 其他 Runtime/Worker 错误：查询本身失败，不能据此认定执行成功。

#### 2.13.4. 说明

- 自动引导等待 rank 时，查询不等待全域就绪；后台会合或拓扑初始化失败通过异步错误通知报告。没有新错误不代表引导已经完成。
- 匹配的 Host 和 Worker 通过独立的控制 Stream 查询 CCL 模块保存的主会话及 P2P 执行状态，总查询预算 1000 ms；查询复用原有 Worker 排队机制，不排在应用 Stream 的数据任务后面。
- CCL 模块按 session 独立保存实际执行结果。Host 在已接受的 LAUNCH 后记录私有 Event，并以实际记录代数和预期执行序号检查进度：标记已到达而对应 CCL 未执行时，报告被跳过的请求。新建 Event 的初始完成状态不能作为进度证明；普通 Stream 同步不消费 CCL 记录。
- 各 communicator 消费一次错误通知。查询后失败/终止状态仍保持，后续提交继续失败；不代表硬件已停止或允许提前释放资源。
- 无 reference/golden 数据时，接口无法自动检测“返回成功但数值错误”。

#### 2.13.5. 参考

- [axCclCommAbort](#axCclCommAbort)

<br>

<a id="axCclCommInitAll"></a>

### 2.14. axCclCommInitAll

在单进程内为多个设备各创建一个通信域。

#### 2.14.1. 函数

```c
AX_CCL_EXPORT axclError axCclCommInitAll(axCclComm *comms, int32_t count, const int32_t *deviceIds);
```

#### 2.14.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| comms | out | 长度为 `count` 的数组，成功时返回各通信域句柄。 |
| count | in | 通信域/设备个数，取值范围为 2 到协议支持的 rank 上限。 |
| deviceIds | in | 长度为 `count` 的逻辑设备 ID 数组，元素必须互不相同且在当前进程可见范围内。 |

#### 2.14.3. 返回值

- `AXCL_SUCC`：成功创建全部通信域并建立连接。
- `AXCL_ERR_CCL_UNSUPPORT`：`count` 小于 2、超过协议上限，或当前处于未结束的 Group 中。
- `AXCL_ERR_CCL_NULL_POINTER`：`comms` 或 `deviceIds` 为 NULL。
- `AXCL_ERR_CCL_ILLEGAL_PARAM`：某个设备 ID 为负数、超出可见范围，或与前面的元素重复。
- `AXCL_ERR_CCL_INVALID_STATE`：CCL 模块尚未初始化。
- 其他错误：创建失败，且已创建的通信域会被终结并销毁，`comms` 中对应项为 NULL。

#### 2.14.4. 说明

- 本接口始终使用本地路径，即使设置诊断变量 `AXCCL_MULTIPROCESS=1` 也不会切换为多进程引导。
- `deviceIds` 的数组顺序只决定逻辑 rank，不声明环的拓扑。底层 C2C AllReduce 由 Host 按各 rank 实际的本地 `chip_id` 升序重排参与顺序，并校验由此得到的每个有向 C2C 对端在线；这是静态规则，不是硬件邻接发现。
- 调用会改变当前线程的 Context，返回时恢复调用前的 Context。
- 与 [axCclCommInitRootInfo](#axCclCommInitRootInfo) 不同，本接口在返回前就建立好环，因此任一 rank 的第一次裸 [axCclAllReduce](#axCclAllReduce) 都能直接入队，不必等待其他 rank。

#### 2.14.5. 示例

```c
 axCclComm comms[4];
 int32_t   devices[4] = {0, 1, 2, 3};
 axCclCommInitAll(comms, 4, devices);
```

#### 2.14.6. 参考

- [axCclCommInitRootInfo](#axCclCommInitRootInfo)
- [axCclGetRootInfo](#axCclGetRootInfo)

<br>

<a id="axCclCommInitRank"></a>

### 2.15. axCclCommInitRank

按 rank 创建单个通信域，是 [axCclCommInitRootInfo](#axCclCommInitRootInfo) 的别名。

#### 2.15.1. 函数

```c
AX_CCL_EXPORT axclError axCclCommInitRank(axCclComm *comm, int32_t deviceId, const axCclRootInfo *uniqueId, int32_t worldSize, int32_t rank);
```

#### 2.15.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| comm | out | 成功时返回创建的通信域句柄。 |
| deviceId | in | 当前进程可见的逻辑设备 ID。 |
| uniqueId | in | rank 0 生成并广播的 root info。 |
| worldSize | in | 通信域中的 rank 总数。 |
| rank | in | 本通信域的 rank，范围为 `[0, worldSize - 1]`。 |

#### 2.15.3. 返回值

- `AXCL_SUCC`：成功创建通信域。
- 其他错误：与 [axCclCommInitRootInfo](#axCclCommInitRootInfo) 完全相同。

#### 2.15.4. 说明

- 本接口是 [axCclCommInitRootInfo](#axCclCommInitRootInfo) 的受支持别名，采用完全相同的参数、128 字节 root info、Runtime 环境、自动引导和错误校验。默认初始化只注册本 rank 并借用调用线程的原始 Context，不等待其他 rank。

#### 2.15.5. 参考

- [axCclCommInitRootInfo](#axCclCommInitRootInfo)

<br>

<a id="axCclCommInitRootInfo"></a>

### 2.16. axCclCommInitRootInfo

用广播的 root info 创建通信域。

#### 2.16.1. 函数

```c
AX_CCL_EXPORT axclError axCclCommInitRootInfo(axCclComm *comm, int32_t deviceId, const axCclRootInfo *rootInfo, int32_t worldSize, int32_t rank);
```

#### 2.16.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| comm | out | 成功时返回绑定到 `deviceId`、rank 为 `rank` 的通信域句柄。调用开始时该输出被置为 NULL。 |
| deviceId | in | 当前进程可见的逻辑设备 ID，范围为 `[0, axclrtGetDeviceCount() - 1]`。 |
| rootInfo | in | rank 0 生成并广播到所有 rank 的 root info。 |
| worldSize | in | 通信域中的 rank 总数，必须为正数。 |
| rank | in | 本通信域的 rank，范围为 `[0, worldSize - 1]`。 |

#### 2.16.3. 返回值

- `AXCL_SUCC`：成功注册本 rank 并返回通信域句柄；自动引导可仍在后台进行。
- `AXCL_ERR_CCL_UNSUPPORT`：当前处于未结束的 Group 中。
- `AXCL_ERR_CCL_NULL_POINTER`：`comm` 或 `rootInfo` 为 NULL。
- `AXCL_ERR_CCL_ILLEGAL_PARAM`：`deviceId` 为负数、`worldSize` 不是正数、`rank` 越界、当前设备与 `deviceId` 不一致，或调用线程没有当前 Context。
- `AXCL_ERR_CCL_INVALID_STATE`：CCL 模块尚未初始化。
- 其他错误：本地注册或 Runtime 校验失败；后台会合和 topology 初始化错误由异步查询或等待就绪的数据操作报告。

#### 2.16.4. 说明

- 默认初始化只注册本 rank 并借用调用线程的原始 Context；返回成功不代表全域引导已就绪。Init 不等待其他 rank，同一线程可依次创建 rank 0→1 或 1→0。
- 自动模式根据声明的 `worldSize` 验证完整成员：全部 rank 都必须先调用 Init，之后数据操作、最外层 GroupEnd、注册缓冲区及自定义算子等路由功能才能通过就绪检查。P2P 的无关 rank 也须先 Init，随后可保持空闲而不提交该次数据操作；不得用缺少 rank 后的超时推测本地路由。
- 后台通过 Unix 连接的 `SO_PEERCRED` PID 确认归属：全部 rank 的 PID 相同选择本地路径，全部不同选择多进程路径；跨多个进程且某个进程含多个 rank 的混合布局，在任何 LAUNCH 前返回 `AXCL_ERR_CCL_UNSUPPORT`。身份不来自调用方填报的 Runtime bare TGID。
- 调用线程必须先用 [axclrtSetDevice](device_api.md#axclrtSetDevice) 激活 `deviceId`，并持有当前 Context。
- 单进程路由保留原有惰性建环和完整本地能力；多进程路由在后台绑定借用的原始 Context 并初始化拓扑。数据操作在提交前等待引导就绪；Group 成员仅记录描述符，由最外层 GroupEnd 等待和提交。
- 建链用的 root info 保持原来的 128 字节格式，不含指针，可通过带外通道（例如 PyTorch 的 TCPStore 或 `env://`）交换。借用 Context 必须有效直至 Finalize/Abort 等待后台线程退出并完成安全清理。
- `AXCCL_MULTIPROCESS` 未设置或为 `auto` 时自动选择；`0` 强制旧本地路径，`1` 强制旧同步多进程初始化（每进程一个 rank）。覆盖值仅供诊断，不是默认流程的前置条件。

#### 2.16.5. 示例

```c
 axCclRootInfo root_info;
 if (rank == 0) {
     axCclGetRootInfo(&root_info);
 }
 broadcast(&root_info, sizeof(root_info));

 axCclComm comm;
 axCclCommInitRootInfo(&comm, device_id, &root_info, world_size, rank);
```

#### 2.16.6. 参考

- [axCclGetRootInfo](#axCclGetRootInfo)
- [axCclCommInitRank](#axCclCommInitRank)
- [axCclCommInitAll](#axCclCommInitAll)
- [axclrtSetDevice](device_api.md#axclrtSetDevice)

<br>

<a id="axCclCommRank"></a>

### 2.17. axCclCommRank

查询通信域自身的 rank。

#### 2.17.1. 函数

```c
AX_CCL_EXPORT axclError axCclCommRank(axCclComm comm, int32_t *rank);
```

#### 2.17.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| comm | in | 通信域。 |
| rank | out | 成功时返回该通信域的 rank。 |

#### 2.17.3. 返回值

- `AXCL_SUCC`：成功返回 rank。
- `AXCL_ERR_CCL_NULL_POINTER`：`rank` 为 NULL。
- `AXCL_ERR_CCL_INVALID_COMM`：`comm` 不是有效句柄。

#### 2.17.4. 参考

- [axCclCommCount](#axCclCommCount)
- [axCclCommDevice](#axCclCommDevice)

<br>

<a id="axCclCommRegister"></a>

### 2.18. axCclCommRegister

注册设备缓冲区以复用本地设备映射资源。

#### 2.18.1. 函数

```c
AX_CCL_EXPORT axclError axCclCommRegister(axCclComm comm, void *buff, size_t size, void **handle);
```

#### 2.18.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| comm | in | 通信域。 |
| buff | in | 待注册的设备缓冲区。 |
| size | in | 缓冲区大小，单位为字节。 |
| handle | out | 成功时返回供后续注销使用的句柄。 |

#### 2.18.3. 返回值

- `AXCL_SUCC`：缓冲区已注册并返回不透明句柄。
- `AXCL_ERR_CCL_NULL_POINTER`：`buff` 或输出 `handle` 为空。
- `AXCL_ERR_CCL_INVALID_COMM`：通信域句柄无效。
- `AXCL_ERR_CCL_ILLEGAL_PARAM`：范围为空或越界、指针属性不符，或范围重叠。
- `AXCL_ERR_RT_THREAD_NOT_BIND_CONTEXT`：调用线程没有有效当前 Context。
- `AXCL_ERR_CCL_INVALID_STATE`：模块未初始化、通信域已关闭或当前状态不允许注册。

#### 2.18.4. 说明

- 要求调用线程具有有效当前 Context。实现临时切换到通信域绑定设备的 Context，完成后恢复调用方 Context。
- `buff` 必须是通信域设备上受跟踪的 Device 分配；`size` 必须非零、不超过 `UINT32_MAX` 字节，且物理地址范围须位于 39 位地址空间内。调用方须保证该范围完全落在同一分配内，并保持分配有效直至注销。运行时指针属性仅校验范围端点的设备属性，不验证完整分配范围，也不会固定分配。
- 句柄不透明、归通信域所有且不会复用。当前仅支持单进程；不提供跨进程 IPC、导出句柄或跨进程 rendezvous。支持的集合操作会借用覆盖其设备地址范围的注册映射，并保留每个活动 tile 原有的 Flush/Invalidate。该接口不承诺额外带宽或性能提升；跳过注册不影响正确性。
- NeuLink 初始拒绝重叠注册范围。注册范围及其底层 Device 分配应由调用方管理，避免在注销前释放或复用。

#### 2.18.5. 参考

- [axCclCommDeregister](#axCclCommDeregister)

<br>

<a id="axCclFinalize"></a>

### 2.19. axCclFinalize

去初始化 CCL 模块。

#### 2.19.1. 函数

```c
AX_CCL_EXPORT axclError axCclFinalize(void);
```

#### 2.19.2. 参数

不适用

#### 2.19.3. 返回值

- `AXCL_SUCC`：成功。
- `AXCL_ERR_CCL_INVALID_STATE`：当前处于未结束的 Group 中。

#### 2.19.4. 说明

- 必须在进程退出前显式调用。每次成功的 [axCclInit](#axCclInit) 都会增加内部引用计数，因此必须有一次对应的 [axCclFinalize](#axCclFinalize)。失败的 [axCclInit](#axCclInit) 不需要配对调用。
- 必须在终结所有通信域之后调用。
- 在 Group 未结束时不允许调用，需先调用 [axCclGroupEnd](#axCclGroupEnd)。
- 本接口只释放 CCL 模块，不代替 [axclFinalize](system_api.md#axclFinalize)。

#### 2.19.5. 参考

- [axCclInit](#axCclInit)
- [axCclCommFinalize](#axCclCommFinalize)
- [axclFinalize](system_api.md#axclFinalize)

<br>

<a id="axCclGather"></a>

### 2.20. axCclGather

将所有 rank 的数据收集到 root。

#### 2.20.1. 函数

```c
AX_CCL_EXPORT axclError axCclGather(const void *sendbuff, void *recvbuff, size_t sendcount, axCclDataType dtype, int32_t root, axCclComm comm, axclrtStream stream);
```

#### 2.20.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| sendbuff | in | 本 rank 贡献的设备缓冲区，`sendcount` 个元素。 |
| recvbuff | out | root 上的结果设备缓冲区，`sendcount * worldSize` 个元素；非 root 忽略该参数，可传 NULL。 |
| sendcount | in | 本 rank 贡献的元素个数。 |
| dtype | in | 元素类型。 |
| root | in | 收集目标的 rank。 |
| comm | in | 通信域。 |
| stream | in | 接收该操作的 Stream。 |

#### 2.20.3. 返回值

- `AXCL_SUCC`：本 rank 的调用已登记或入队，不表示硬件已经完成；不支持的 dtype 或参数返回对应 CCL 错误。

#### 2.20.4. 说明

- 支持 1–8 rank、全部十四种存储类型，sendcount >= 0，无1024元素人工上限；root 接收 worldSize*sendcount 个元素，非 root 的 recvbuff 可为 NULL。只搬运字节，不做归约。
- 支持显式 Group 或裸调用；读取 root 输出前须同步参与 Stream。已有 C2C 模拟与历史 HAPS 验证记录。

<br>

<a id="axCclGetErrorString"></a>

### 2.21. axCclGetErrorString

获取错误码的描述字符串。

#### 2.21.1. 函数

```c
AX_CCL_EXPORT const char *axCclGetErrorString(axclError error);
```

#### 2.21.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| error | in | 待解释的错误码，可以是通用的 `AXCL_ERR_*` 或 CCL 子模块的 `AXCL_ERR_CCL_*`。 |

#### 2.21.3. 返回值

- 错误码对应的描述字符串，存储在线程局部缓冲区中，调用者不需要也不应释放。未知错误码返回通用描述。

#### 2.21.4. 说明

- 本接口不要求先调用 [axCclInit](#axCclInit)。
- 实现直接复用 [axclrtGetErrorString](other_api.md#axclrtGetErrorString)。

#### 2.21.5. 参考

- [axclrtGetErrorString](other_api.md#axclrtGetErrorString)

<br>

<a id="axCclGetRootInfo"></a>

### 2.22. axCclGetRootInfo

在 rank 0 上生成建链用的 root info。

#### 2.22.1. 函数

```c
AX_CCL_EXPORT axclError axCclGetRootInfo(axCclRootInfo *rootInfo);
```

#### 2.22.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| rootInfo | out | 成功时返回生成的 root info。调用者负责把这些字节广播到所有 rank。 |

#### 2.22.3. 返回值

- `AXCL_SUCC`：成功生成 root info。
- `AXCL_ERR_CCL_NULL_POINTER`：`rootInfo` 为 NULL。
- `AXCL_ERR_CCL_INVALID_STATE`：CCL 模块尚未初始化。

#### 2.22.4. 说明

- 只在 rank 0 上调用，生成本次建链的标识；其他 rank 通过带外通道收到同一份字节后传给 [axCclCommInitRootInfo](#axCclCommInitRootInfo)。
- root info 是不含指针和 Host 句柄的不透明字节块，可以安全地通过带外通道（例如 PyTorch 的 TCPStore 或 `env://`）交换。

#### 2.22.5. 示例

```c
 axCclRootInfo root_info;
 if (rank == 0) {
     axCclGetRootInfo(&root_info);
 }
 broadcast(&root_info, sizeof(root_info));
```

#### 2.22.6. 参考

- [axCclCommInitRootInfo](#axCclCommInitRootInfo)
- [axCclCommInitAll](#axCclCommInitAll)

<br>

<a id="axCclGetVersion"></a>

### 2.23. axCclGetVersion

查询 CCL 库的版本号。

#### 2.23.1. 函数

```c
AX_CCL_EXPORT axclError axCclGetVersion(int32_t *major, int32_t *minor, int32_t *patch);
```

#### 2.23.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| major | out | 主版本号。允许为 NULL，此时不写出该值。 |
| minor | out | 次版本号。允许为 NULL，此时不写出该值。 |
| patch | out | 修订号。允许为 NULL，此时不写出该值。 |

#### 2.23.3. 返回值

- `AXCL_SUCC`：成功，非 NULL 的输出参数都被写入。

#### 2.23.4. 说明

- 本接口不要求先调用 [axCclInit](#axCclInit)。

<br>

<a id="axCclGroupEnd"></a>

### 2.24. axCclGroupEnd

准备并提交当前 Group 收集到的所有 rank。

#### 2.24.1. 函数

```c
AX_CCL_EXPORT axclError axCclGroupEnd(void);
```

#### 2.24.2. 参数

不适用

#### 2.24.3. 返回值

- `AXCL_SUCC`：成功完成准备与入队。
- 其他错误：参数校验失败时取消整个 Group，不向任何 rank 入队。

#### 2.24.4. 说明

- Group 成员调用仅收集描述符，不等待引导；最外层 GroupEnd 先等待相关域就绪，再准备和提交。
- 成功返回**只表示批量提交/入队**，不表示数据面操作已经完成。在复用一个对端可见的缓冲区之前，必须同步所有 rank 的 Stream。
- 会话在轮次之间复用，只有信号窗口 REARM 和 [axCclCommFinalize](#axCclCommFinalize) 才排空相关 Stream。参与的 Stream、Context 必须保持存活直到 CommFinalize 完成。
- 启动不完整或完成状态不确定时，域进入终止状态，其资源必须保持存活以便操作恢复，即使操作随后迟到完成也不能回收。
- 某个 rank 的 CCL Run 失败或被跳过后，CCL 模块保留该 session 的失败状态，因此更早的 application 同步不会把失败对上层的域屏障隐藏起来。通用 Stream 的错误处理保持原有语义。
- 借用的 Stream/Context 句柄必须保持有效；使用已释放的句柄违反 Runtime API 前置条件，本接口不会检测。
- 单进程的Group支持嵌套、多轮和混合完整集合操作，包括AllReduce、Broadcast、Reduce、AllGather、ReduceScatter、Gather、Scatter、AllToAll/V与Barrier。每轮各rank的root/dtype/op/count须匹配；可协调多个通信域，每个domain/rank在本组使用一个Context/Stream。只有最外层GroupEnd准备并入队，校验失败不会提交前面已经收齐的轮次。
- 单进程也支持纯 Send/Recv Group：按 `(发送 rank, 接收 rank)` 的调用次序 FIFO 匹配，必须收齐每笔传输的双方，并匹配 count/type。允许双向通信、共享 rank 的多个 peer 和通信域的 rank 子集。GroupEnd 会调整任务顺序；同设备上的任意 Recv 区间不得与本组任何 Send 或其他 Recv 区间重叠，因而不支持原地交换。支持集合操作与配对P2P混组；同一匹配自收发的精确同址例外可作为本地复制。包括跨域在内，其他P2P写区重叠仍在任何LAUNCH前拒绝。
- 多进程的纯Send/Recv Group允许不同进程以不同的本地交错顺序收集调用，但每对peer的批次调用数和各方向FIFO的count/dtype须一致；每进程同组最多32个调用，使用同一Context/Stream。同一Group混合P2P和集合操作返回 `AXCL_ERR_CCL_UNSUPPORT`，可分别放入不同的Group。完整限制见文末多进程模式。

#### 2.24.5. 示例

```c
 axCclGroupStart();
 axCclAllReduce(s0, r0, count, AX_CCL_DT_FP32, AX_CCL_OP_SUM, comms[0], streams[0]);
 axCclAllReduce(s1, r1, count, AX_CCL_DT_FP32, AX_CCL_OP_SUM, comms[1], streams[1]);
 axCclGroupEnd();
```

#### 2.24.6. 参考

- [axCclGroupStart](#axCclGroupStart)
- [axCclAllReduce](#axCclAllReduce)
- [axCclCommFinalize](#axCclCommFinalize)

<br>

<a id="axCclGroupStart"></a>

### 2.25. axCclGroupStart

开始或嵌套收集多轮集合操作与配对的Send/Recv调用。

#### 2.25.1. 函数

```c
AX_CCL_EXPORT axclError axCclGroupStart(void);
```

#### 2.25.2. 参数

不适用

#### 2.25.3. 返回值

- `AXCL_SUCC`：成功开始一个 Group。
- `AXCL_ERR_CCL_INTERNAL`：内部错误。

#### 2.25.4. 说明

- 本接口只收集描述符；只有最外层[axCclGroupEnd](#axCclGroupEnd)才准备会话并提交全部匹配轮次。
- 单进程的集合操作要求同一线程收齐全域各 rank；Send/Recv 只要求收齐实际传输的双方，其他 rank 不参与。裸 Send/Recv 成功返回前已入队，调用方须安排相容的双方顺序；双方均先 Send 后 Recv 的双向交换应使用 Group 和独立缓冲区。
- 本组包含的完整跨域操作按依赖调度；共享设备上的其他通信域须由应用串行化，切换域不会自动排空不属于本组的操作。
- 多进程模式由各进程收集本 rank 的调用，再在各自的最外层GroupEnd会合；引导就绪后的纯P2P只要求实际参与的peer匹配；后台引导需要全域rank注册，已就绪域的CommFinalize仍要求全域rank参与。
- 同一显式 Group 的 Start、成员调用和 End 必须使用同一 Host 线程。域已建立后，不同 rank 可以在各自绑定 Context/Stream 的线程上发起裸调用；终结前须停止新的提交，并保留所有参与句柄直到清理完成。

#### 2.25.5. 示例

```c
 axCclGroupStart();
 axCclAllReduce(s0, r0, count, AX_CCL_DT_FP32, AX_CCL_OP_SUM, comms[0], streams[0]);
 axCclAllReduce(s1, r1, count, AX_CCL_DT_FP32, AX_CCL_OP_SUM, comms[1], streams[1]);
 axCclGroupEnd();
```

#### 2.25.6. 参考

- [axCclGroupEnd](#axCclGroupEnd)
- [axCclAllReduce](#axCclAllReduce)

<br>

<a id="axCclInit"></a>

### 2.26. axCclInit

初始化 CCL 模块。

#### 2.26.1. 函数

```c
AX_CCL_EXPORT axclError axCclInit(void);
```

#### 2.26.2. 参数

不适用

#### 2.26.3. 返回值

- `AXCL_SUCC`：成功。
- `AXCL_ERR_CCL_INVALID_STATE`：当前处于未结束的 Group 中。

#### 2.26.4. 说明

- 可以多次调用，每次成功调用都必须与 [axCclFinalize](#axCclFinalize) 配对，引用计数降到 0 时才释放模块资源。
- 必须先调用 [axclInit](system_api.md#axclInit) 初始化 AXCL 运行时。在 [axclInit](system_api.md#axclInit) 之前调用任何 CCL 接口都会失败。
- 在 Group 未结束时不允许调用，需先调用 [axCclGroupEnd](#axCclGroupEnd)。

#### 2.26.5. 示例

```c
 axclInit("");
 axCclInit();

 // 创建通信域、执行集合操作

 axCclFinalize();
 axclFinalize();
```

#### 2.26.6. 参考

- [axCclFinalize](#axCclFinalize)
- [axclInit](system_api.md#axclInit)

<br>

<a id="axCclRecv"></a>

### 2.27. axCclRecv

从指定 rank 接收数据。

#### 2.27.1. 函数

```c
AX_CCL_EXPORT axclError axCclRecv(void *recvbuff, size_t count, axCclDataType dtype, int32_t peer, axCclComm comm, axclrtStream stream);
```

#### 2.27.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| recvbuff | out | 接收数据的设备缓冲区。 |
| count | in | 元素个数。 |
| dtype | in | 元素类型。 |
| peer | in | 发送方的 rank，必须与对端的 [axCclSend](#axCclSend) 匹配。 |
| comm | in | 通信域。 |
| stream | in | 接收该操作的 Stream。 |

#### 2.27.3. 返回值

- `AXCL_SUCC`：裸调用已入队；Group 内调用已收集，GroupEnd 才入队。
- `AXCL_ERR_CCL_NULL_POINTER`：正count需要的缓冲区为空；零长度可无缓冲区，NULL Stream选择默认Stream。
- `AXCL_ERR_CCL_ILLEGAL_PARAM`：peer/count/type/地址或 Context/Stream 不匹配。
- `AXCL_ERR_CCL_INVALID_STATE`：未初始化、peer 未注册、Stream 绑定冲突或信号窗口尚不能安全复位。
- 其他错误：通信域、Runtime 或设备执行错误；异步执行结果通过 Stream 同步获取。

#### 2.27.4. 说明

- 与对端 Send 按调用次序匹配，count/type 必须完全一致。仅双方参与，支持接收先于发送入队；同步接收 Stream 前必须提交匹配的发送。
- 初版范围、Stream/Context 绑定、Group 重叠限制、REARM 和终结语义与 [axCclSend](#axCclSend) 相同。

#### 2.27.5. 参考

- [axCclSend](#axCclSend)

<br>

<a id="axCclRedOpCreatePreMulSum"></a>

### 2.28. axCclRedOpCreatePreMulSum

创建预乘求和归约算子。

#### 2.28.1. 函数

```c
AX_CCL_EXPORT axclError axCclRedOpCreatePreMulSum(axCclComm comm, axCclRedOp *op, const void *scalar, axCclDataType datatype, axCclScalarResidence residence);
```

#### 2.28.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| comm | in | 拥有该算子的通信域。 |
| op | out | 成功时返回自定义算子句柄。 |
| scalar | in | 指向标量的指针，按 `datatype` 解释。指针值在执行时读取（Device 驻留时还会解引用）。 |
| datatype | in | 标量类型。 |
| residence | in | 标量所在的位置，`AX_CCL_RES_HOST` 或 `AX_CCL_RES_DEVICE`。 |

#### 2.28.3. 返回值

- `AXCL_SUCC`：返回归该通信域所有的自定义算子句柄。
- `AXCL_ERR_CCL_UNSUPPORT`：`datatype` 不是支持的公开类型；支持全部十四种公开类型。
- `AXCL_ERR_CCL_NULL_POINTER`：输出 `op` 或 `scalar` 为空。
- `AXCL_ERR_CCL_INVALID_COMM`：通信域句柄无效。
- `AXCL_ERR_CCL_ILLEGAL_PARAM`：驻留类型、标量地址/设备属性或当前设备不匹配。
- `AXCL_ERR_RT_THREAD_NOT_BIND_CONTEXT`：调用线程没有有效当前 Context。
- `AXCL_ERR_CCL_INVALID_STATE`：模块未初始化或通信域当前状态不允许创建。

#### 2.28.4. 说明

- 算子定义为 `result = Σ(scalar_i * x_i)`，常用于梯度缩放。创建仅保存标量指针、类型和驻留位置，不提前读取标量。
- AllReduce、Reduce、ReduceScatter 均可使用自定义句柄。每个 rank 可使用不同的标量值和驻留位置，标量类型必须与本轮共同的通信 dtype 一致；collective 的种类、dtype、root 和元素数量必须匹配。
- Host 标量在逻辑操作执行时通过现有动态回调读取；Device 标量在应用 Stream 中先前写入完成后、逻辑操作执行时读取。每个逻辑操作只读取一次，所有 tile 共用该值。调用方须确保标量存储在所有参与 Stream 完成前保持有效，即使句柄已销毁也一样。
- FP32/FP16/BF16/FP8 按逻辑 rank 顺序以 FP32 执行乘法与加法，最后只转换一次到目标类型。FP8 的无穷输出夹到有限端点，无效运算或 NaN 输出规范 NaN（E4M3：`0x7f`，E5M2：`0x7e`）。
- 整数 PreMulSum 保留完整乘积及宽位总和，包括巨大异号项的抵消，最后一次饱和到目标整数类型。FP64 按逻辑 rank 顺序执行 binary64 乘法与加法，每步最近偶数舍入，保留渐进下溢、带符号零及上述规范 NaN。
- 创建要求线程有与通信域设备匹配的当前 Context；64位标量保留全部原始字节。
- 每次成功创建都必须与 [axCclRedOpDestroy](#axCclRedOpDestroy) 配对，并在销毁 `comm` 前调用。Destroy 移除公开句柄查找，不取消已接受的操作；可在 Group 内及 Finalize 后调用，但须在 CommDestroy 前配对。

#### 2.28.5. 参考

- [axCclRedOpDestroy](#axCclRedOpDestroy)

<br>

<a id="axCclRedOpDestroy"></a>

### 2.29. axCclRedOpDestroy

销毁自定义归约算子。

#### 2.29.1. 函数

```c
AX_CCL_EXPORT axclError axCclRedOpDestroy(axCclComm comm, axCclRedOp op);
```

#### 2.29.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| comm | in | 拥有该算子的通信域。 |
| op | in | [axCclRedOpCreatePreMulSum](#axCclRedOpCreatePreMulSum) 返回的算子句柄。 |

#### 2.29.3. 返回值

- `AXCL_SUCC`：自定义句柄已从公开查找表移除。
- `AXCL_ERR_CCL_ILLEGAL_PARAM`：句柄无效、不属于该通信域，或已销毁。

#### 2.29.4. 说明

- Destroy 不取消已接受的操作；这些操作保留所需的标量所有权直至完成。可在 Group 内或 Finalize 后销毁句柄，但必须在销毁通信域前完成创建/销毁配对。

#### 2.29.5. 参考

- [axCclRedOpCreatePreMulSum](#axCclRedOpCreatePreMulSum)

<br>

<a id="axCclReduce"></a>

### 2.30. axCclReduce

将所有 rank 的数据归约到 root。

#### 2.30.1. 函数

```c
AX_CCL_EXPORT axclError axCclReduce(const void *sendbuff, void *recvbuff, size_t count, axCclDataType dtype, axCclRedOp op, int32_t root, axCclComm comm, axclrtStream stream);
```

#### 2.30.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| sendbuff | in | 源设备缓冲区，`count` 个元素。 |
| recvbuff | out | root 上的结果设备缓冲区，`count` 个元素；非 root 忽略该参数，可传 NULL。 |
| count | in | 元素个数。 |
| dtype | in | 元素类型。 |
| op | in | 归约算子。 |
| root | in | 结果所在的 rank。 |
| comm | in | 通信域。 |
| stream | in | 接收该操作的 Stream。 |

#### 2.30.3. 返回值

- `AXCL_SUCC`：本 rank 的调用已登记或入队；读取结果前须同步参与 Stream。不支持的 dtype 或参数返回对应 CCL 错误。

#### 2.30.4. 说明

- root 上可以就地归约，即传 `sendbuff == recvbuff`；非 root 只读 `sendbuff`，其 `recvbuff` 可传 NULL。
- 支持 1–8 rank、下述归约能力表中的类型/算子，count >= 0，无1024元素人工上限。归约后端与 [AllReduce](#axCclAllReduce) 相同；模型路径支持同生命周期重复执行。
- 此前 HAPS 已验证 FP32 MIN/MAX count1024、root0/3、就地及非就地各连续两次；未将这个范围扩展为所有 dtype/root/count 组合。

<br>

<a id="axCclReduceScatter"></a>

### 2.31. axCclReduceScatter

归约后按等分片散回各 rank。

#### 2.31.1. 函数

```c
AX_CCL_EXPORT axclError axCclReduceScatter(const void *sendbuff, void *recvbuff, size_t recvcount, axCclDataType dtype, axCclRedOp op, axCclComm comm, axclrtStream stream);
```

#### 2.31.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| sendbuff | in | 源设备缓冲区，`recvcount * worldSize` 个元素。可传 `AX_CCL_IN_PLACE` 表示就地归约。 |
| recvbuff | out | 结果设备缓冲区，`recvcount` 个元素，即本 rank 的分片。 |
| recvcount | in | 本 rank 分片的元素个数。 |
| dtype | in | 元素类型。 |
| op | in | 归约算子。 |
| comm | in | 通信域。 |
| stream | in | 接收该操作的 Stream。 |

#### 2.31.3. 返回值

- `AXCL_SUCC`：本 rank 的调用已登记或入队；支持下述归约能力表；不支持的组合在入队前返回 `UNSUPPORT`。

#### 2.31.4. 说明

- 支持 1–8 rank 和下述归约能力表，recvcount >= 0，无1024元素人工上限；发送缓冲区包含 worldSize*recvcount 个元素。原生浮点 SUM 使用 C2C 加法，其余支持的组合使用现有 NPU 模型；就地输出位于逻辑 rank 的分片。
- 已通过 C2C 模拟及历史 HAPS 部分用例；本次生成侧修复的联合验证未新增该操作的硬件覆盖。

<br>

<a id="axCclScatter"></a>

### 2.32. axCclScatter

将 root 的数据分片散到所有 rank。

#### 2.32.1. 函数

```c
AX_CCL_EXPORT axclError axCclScatter(const void *sendbuff, void *recvbuff, size_t recvcount, axCclDataType dtype, int32_t root, axCclComm comm, axclrtStream stream);
```

#### 2.32.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| sendbuff | in | root 上持有全部数据的设备缓冲区，`recvcount * worldSize` 个元素；非 root 忽略该参数，可传 NULL。 |
| recvbuff | out | 本 rank 分片的设备缓冲区，`recvcount` 个元素。 |
| recvcount | in | 本 rank 分片的元素个数。 |
| dtype | in | 元素类型。 |
| root | in | 数据源的 rank。 |
| comm | in | 通信域。 |
| stream | in | 接收该操作的 Stream。 |

#### 2.32.3. 返回值

- `AXCL_SUCC`：本 rank 的调用已登记或入队，不表示硬件已经完成；不支持的 dtype 或参数返回对应 CCL 错误。

#### 2.32.4. 说明

- 支持 1–8 rank、全部十四种存储类型，recvcount >= 0，无1024元素人工上限；root 的发送缓冲区包含 worldSize*recvcount 个元素。只搬运字节，不做归约。root可将recvbuff设为AX_CCL_IN_PLACE或sendbuff中root自己的精确切片；完整源缓冲区保持不变，其他部分重叠仍拒绝。
- 支持显式 Group 或裸调用；读取本 rank 输出前须同步参与 Stream。已有 C2C 模拟与历史 HAPS 验证记录。

<br>

<a id="axCclSend"></a>

### 2.33. axCclSend

向指定 rank 发送数据。

#### 2.33.1. 函数

```c
AX_CCL_EXPORT axclError axCclSend(const void *sendbuff, size_t count, axCclDataType dtype, int32_t peer, axCclComm comm, axclrtStream stream);
```

#### 2.33.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| sendbuff | in | 待发送数据的设备缓冲区。 |
| count | in | 元素个数。 |
| dtype | in | 元素类型。 |
| peer | in | 接收方的 rank，必须与对端的 [axCclRecv](#axCclRecv) 匹配。 |
| comm | in | 通信域。 |
| stream | in | 接收该操作的 Stream。 |

#### 2.33.3. 返回值

- `AXCL_SUCC`：裸调用已入队；Group 内调用已收集，GroupEnd 才入队。
- `AXCL_ERR_CCL_NULL_POINTER`：正count需要的缓冲区为空；零长度可无缓冲区，NULL Stream选择默认Stream。
- `AXCL_ERR_CCL_ILLEGAL_PARAM`：越界peer、无效count/type、地址溢出或未按元素宽度对齐、Context/Stream设备不匹配。自收发须在Group中配齐双方。
- `AXCL_ERR_CCL_INVALID_STATE`：未初始化、peer 未注册、Stream 绑定冲突或信号窗口尚不能安全复位。
- `AXCL_ERR_CCL_UNSUPPORT`：不支持的域规模；多进程模式还会拒绝裸自收发、超过32个调用的P2P Group、混合集合操作的Group和REARM配置。
- 其他错误：无效通信域、Runtime 或设备执行错误；异步执行结果通过 Stream 同步获取。

#### 2.33.4. 说明

- 支持单进程1–8 rank域；不同peer使用两个设备，同rank的匹配Group收发使用本地DMA，count >= 0，无1024元素人工上限；全部十四种已声明 dtype 均原样搬运字节，不做算术或格式转换。不支持 `AX_CCL_IN_PLACE`。
- 使用两端独立的持久通道和设备 DMA；只有匹配的双方执行，不需要其他 rank 的空操作，也不经 Host 中转数据。默认自动引导须先完成全域rank注册和归属确认，随后P2P只需匹配两端；诊断强制本地路径保留仅注册两端即可建pair的行为。
- InitRootInfo 使用注册时的实际 Context，InitAll 使用对应设备的默认 Context。当前 Context 和 Stream 必须属于该 Context。已有工作保持原Stream顺序；在同Context下，有界独立查询证明主域和所有peer通道完成后，可切换到另一个或默认Stream。不同通信域共享设备时由应用串行化。
- 单进程的裸调用成功表示本端已入队，不会在Host等待对端调用。两端须以相容次序提交反向角色、相同count/type，再同步Stream。独立缓冲区的双向Send+Recv、多peer及共享rank场景可放入同一P2P或混合Group；Group的FIFO匹配、重排和重叠限制见 [axCclGroupEnd](#axCclGroupEnd)。提交P2P Group前，应先补齐此前尚未匹配的裸调用。多进程裸调用会等待匹配peer的单笔调用和双方入队确认；自收发须在纯P2P Group内配齐双方。
- 单进程的通道需要REARM时，若本域存在未匹配的已提交操作，本次调用返回 `AXCL_ERR_CCL_INVALID_STATE`，不入队、不排空Stream，也不毒化域；先补齐peer再重试。CommFinalize则先检查所有通道：仍有未匹配操作时返回错误、终止该域并保留资源；已匹配时仍须通过Stream完成确认后才能释放。多进程不支持REARM配置，失败与清理规则见文末。
- 缓冲区在双方执行完成前须保持有效；所有参与的 Stream 和 Context 须保持存活直到 CommFinalize。设备完成状态不确定时遵循现有资源保留与终止机制。

#### 2.33.5. 参考

- [axCclRecv](#axCclRecv)


<a id="axccl-multiprocess"></a>

## 自动引导与 Linux 同 Host 多进程模式

默认无需设置 `AXCCL_MULTIPROCESS`。每个进程调用 `axclInit`、激活自己的 Device、初始化 AXCCL，然后使用完全相同的 128 字节 `axCclRootInfo` 调用 `axCclCommInitRootInfo` 或 `axCclCommInitRank`。RootInfo 格式和公开 API 签名保持不变，由应用自行广播。Init 只注册本 rank 和借用的原始 Context，不等待全域 rank；同一线程可按 0→1 或 1→0 顺序创建本地 rank。

后台通过数据连接的 `SO_PEERCRED` PID 确认归属：全部相同选择本地路径，全部不同选择多进程路径；跨多个进程且某个进程含多个 rank 的混合布局，在任何 LAUNCH 前拒绝为 `AXCL_ERR_CCL_UNSUPPORT`。同进程 RootInfo 域保留 AllToAll/V、注册和自定义算子等本地能力。自动模式先等待全部声明 rank 注册和归属发现完成，数据操作、GroupEnd、注册缓冲区和自定义算子等需要确认路由的功能均受此就绪条件约束。可先在同一线程顺序完成各 rank Init；P2P 的无关 rank 必须 Init，但就绪后无需参与该次数据操作。多进程拓扑在后台绑定各 rank 注册时的原始 Context 初始化；Context 必须保持有效直至清理完成。

多进程路径限定同一台 Linux Host、相同有效 UID、共享 Unix network namespace；broker 必须能取得每个连接的正数 `SO_PEERCRED` PID，PID namespace 布局须保证这种可见性。不支持跨 Host。每个通信域每进程一个 rank，代码支持最多 8 个不同物理 Device；当前硬件验收范围为两个进程/两个 Device，不代表 world8 实卡通过。rank 0必须能够看到所有参与的Device；不同rank的每对Send/Recv peer中，较小全域rank的进程还须能看到该pair两端的物理Device。为导入远端buffer，库可能激活这些Device的Runtime Worker，恢复调用方当前Context，并将额外激活留到应用正常 `axclFinalize` 释放。`axCclCommInitAll` 始终使用本地路径，不受诊断强制多进程设置影响。

支持内置AllReduce、AllGather、ReduceScatter、Broadcast、Reduce、Gather、Scatter、Barrier，以及Send/Recv。同一进程的显式Group最多收集32个调用，全部属于同一通信域、使用同一Context/Stream；最外层GroupEnd才提交。集合操作要求所有rank按相同顺序提交相同的operation、dtype、reduce-op、root和count。纯集合操作Group与纯Send/Recv Group可以分别提交；同一Group内混合P2P和集合操作暂不支持，在执行前返回 `AXCL_ERR_CCL_UNSUPPORT`。

纯Send/Recv Group按peer pair组织独立的持久通道，各方向按照本地调用的FIFO顺序匹配相反角色及相同count/dtype。双方当前pair批次的调用总数必须相同，不能把一端的多个裸调用对应到另一端的一个多调用Group。双方本地Send/Recv的交错顺序可以不同，库会保留每个方向的FIFO并调整方向和pair的执行顺序。传输只要求实际参与的pair匹配；涉及多个peer的Group会在参与的连通分量内确认就绪，未参与此次P2P的其他rank不需要提交空操作。裸自Send/Recv返回 `AXCL_ERR_CCL_UNSUPPORT`；自收发仅在同一Group中配齐双方时使用本地Device复制。

同一进程的P2P Group中，任何Recv物理区间不得与本组任何Send或其他Recv区间重叠；唯一例外是同一笔匹配自收发的精确同址、同长度复制。不支持 `AX_CCL_IN_PLACE`。本地所有权、完整范围和重叠校验失败时尚未进行IPC或Device提交，可纠正参数后重新提交；远端批次不匹配、peer退出、超时或已提交前缀失败会终止通信域并保留不确定资源。

AllToAll/AllToAllV、`axCclCommRegister`、自定义PreMulSum和 `AXCCL_RING_REARM_OPS` 仍不支持多进程模式，返回 `AXCL_ERR_CCL_UNSUPPORT`。AllToAll/AllToAllV的单进程实现与数据路径保持原有行为。

应用传入原始Runtime Token-VA或其合法内部偏移，不把Token值当作Device物理地址。库使用 `axclrtTokenVaResolve` 校验调用的完整span及所属设备，从解析结果取得原始分配base和offset，再使用 `axclrtIpcMemGetExportKey`、`axclrtIpcMemSetImportPid`、`axclrtIpcMemImportByKey`、`axclrtIpcMemClose` 完成IPC验证。默认PID验证只授权协调进程的 `axclrtDeviceGetBareTgid`：集合操作为rank 0，P2P为该pair的较小全域rank。协调进程导入并校验地址、设备、分配范围和所有权，随后先关闭import key并 `axclrtFree` 借用Token，再允许producer关闭export key；完成这一证明后才允许LAUNCH。外部映射或已经导入的borrowed buffer不能重新导出。IPC用于allocation验证；数值数据仍由各rank的本地Worker通过已有C2C/Device DMA传输，不经过Host tensor中转。

默认 Init 返回后在后台进行全 rank 归属发现和多进程拓扑初始化。数据操作等待引导就绪后，集合操作等待全域 rank，Send/Recv 等待匹配 peer 或本次 Group 的参与分量。Group内成员调用只收集描述符；裸调用或最外层GroupEnd成功返回代表本次参与任务已经确认入队，仍不代表数据面完成。执行在各进程调用方原来的application Stream上，与同一Stream中之前和之后的任务保持顺序。跨进程会合默认上限45秒，连接启动上限15秒；可用 `AXCCL_MULTIPROCESS_TIMEOUT_MS=1..60000` 调整会合上限。该模式增加IPC和控制面开销，不承诺比单进程更快。

自动引导尚未就绪且尚未提交 Device 工作时，Finalize/Abort 可取消会合并等待后台线程退出，随后才可释放借用 Context；这不提供硬件任务取消能力。已就绪的多进程域中，每个进程必须在释放 Stream/Context 前调用 `axCclCommFinalize`；即使只参与过一个pair或保持空闲，Finalize仍要求全域rank参加。父域先确认所有参与进程的原始Stream和pair通道完成，再依次释放子通道与父域。调用方须保持每次操作的buffer到Stream完成。`axCclCommGetAsyncError` 在等待引导时独立返回后台错误；就绪后可在其他线程等待 peer 时独立查询父域和已发布 pair 的错误，不等待全域提交；它不提供完成或释放证明。异常退出、入队结果未知或IPC导入回滚无法证明时，关闭admission并保留不确定资源；Abort仅能安全完成明确未提交工作的清理，不提供硬件取消或隔离恢复。

`AXCCL_MULTIPROCESS` 未设置或为 `auto` 时自动选择；`0` 仅供诊断强制旧本地路径；`1` 仅供诊断强制旧多进程路径，其 Init 同步等待全域 rank，每进程仍须一个 rank。这些覆盖值不是运行 sample 的必需设置。旧单进程的部分 world 用法，例如声明 world4 后只创建一个 rank 再暂存裸集合调用，或仅创建两个 P2P rank 而不创建其余 rank，须显式设置诊断值 `0`；自动模式不会以缺少成员或超时作为本地回退条件。此前强制多进程初始化本就要求全域 rank，这项完整成员要求没有减少其多进程能力。

实卡样例位于 `host/sample/ccl/multiprocess`，默认使用自动选择、两个 exec 进程和独立 CPU oracle，并记录 `bootstrap_configuration.selection` 的 `automatic`、`forced_local` 或 `forced_ipc` 选择。已实现的测试覆盖和既有验收不能代替本版本自动引导的实卡验证；本文不声明新 R9 硬件测试通过。
