# AXCCL

## 1. 目录

- [axCclAllGather](#axCclAllGather)：AllGather：将每个 rank 的 `sendcount` 个元素收集到每个 rank 的 `recvbuff` 中。
- [axCclAllReduce](#axCclAllReduce)：AllReduce：对所有 rank 的 `sendbuff` 按 `op` 做逐元素归约，结果返回所有 rank。
- [axCclAllToAll](#axCclAllToAll)：AllToAll：等量交换。rank i 向每个 rank j 发送 `count` 个元素；`recvbuff` 从每个 rank 接收 `count` 个元素。
- [axCclAllToAllV](#axCclAllToAllV)：AllToAllV：变长交换（对应 ProcessGroup.all_to_all_single）。
- [axCclBarrier](#axCclBarrier)：Barrier：阻塞 `stream`，直到所有 rank 都已到达。
- [axCclBroadcast](#axCclBroadcast)：Broadcast：将 `count` 个元素从 `root` 复制到所有 rank。
- [axCclCommAbort](#axCclCommAbort)：关闭提交入口，并释放工作已被证明完成的健康通信域。
- [axCclCommCount](#axCclCommCount)：查询 `comm` 的 world size（rank 数量）。
- [axCclCommDeregister](#axCclCommDeregister)：注销通过 [axCclCommRegister](#axCclCommRegister) 注册的缓冲区。
- [axCclCommDestroy](#axCclCommDestroy)：释放已终结或已中止的 communicator 句柄。本接口不隐式终结 `comm`。
- [axCclCommDevice](#axCclCommDevice)：查询 `comm` 绑定的逻辑设备 ID。
- [axCclCommFinalize](#axCclCommFinalize)：终结 communicator 资源，并将 `comm` 标记为不可用。
- [axCclCommGetAsyncError](#axCclCommGetAsyncError)：读取并消费本 communicator 的异步错误通知。
- [axCclCommInitAll](#axCclCommInitAll)：在单进程内为每个设备各创建一个 communicator（单线程多设备）。
- [axCclCommInitRank](#axCclCommInitRank)：按 rank 创建单个 communicator（NCCL 风格的便捷接口）。
- [axCclCommInitRootInfo](#axCclCommInitRootInfo)：用广播的 root info 创建 communicator（推荐的建链路径）。
- [axCclCommRank](#axCclCommRank)：查询 `comm` 的 rank。
- [axCclCommRegister](#axCclCommRegister)：注册设备缓冲区以复用本地设备映射资源。
- [axCclFinalize](#axCclFinalize)：去初始化 CCL 模块并释放模块级资源。
- [axCclGather](#axCclGather)：按逻辑 rank 顺序将每个 rank 的 `sendcount` 个元素收集到 `root`。
- [axCclGetErrorString](#axCclGetErrorString)：获取 CCL 接口所返回错误码的描述字符串。
- [axCclGetRootInfo](#axCclGetRootInfo)：在 rank 0 上生成建链用的 root info。
- [axCclGetVersion](#axCclGetVersion)：返回 CCL 库的构建版本号。
- [axCclGroupEnd](#axCclGroupEnd)：准备当前 Group 中的每个 rank 并将其入队。
- [axCclGroupStart](#axCclGroupStart)：在同一 Host 线程上收集协调的轮次与配对的 Send/Recv 调用。
- [axCclInit](#axCclInit)：初始化 CCL 模块。
- [axCclRecv](#axCclRecv)：从 rank `peer` 接收 `count` 个元素。
- [axCclRedOpCreatePreMulSum](#axCclRedOpCreatePreMulSum)：创建“预乘求和”归约算子：result = sum(scalar_i * x_i)。
- [axCclRedOpDestroy](#axCclRedOpDestroy)：销毁由 [axCclRedOpCreatePreMulSum](#axCclRedOpCreatePreMulSum) 创建的自定义归约算子。
- [axCclReduce](#axCclReduce)：Reduce：按 `op` 做逐元素归约，结果仅写入 `root`。
- [axCclReduceScatter](#axCclReduceScatter)：ReduceScatter：在各 rank 间按 `op` 归约，再将结果按等分片散发。
- [axCclScatter](#axCclScatter)：按逻辑 rank 顺序从 `root` 散发每份 `recvcount` 个元素的分片。
- [axCclSend](#axCclSend)：向 rank `peer` 发送 `count` 个元素（与 `peer` 上的 Recv 匹配）。

<br>

## 2. API

<a id="axCclAllGather"></a>

### 2.1. axCclAllGather

AllGather：将每个 rank 的 `sendcount` 个元素收集到每个 rank 的 `recvbuff` 中。

#### 2.1.1. 函数

```c
AX_CCL_EXPORT axclError axCclAllGather(const void *sendbuff, void *recvbuff, size_t sendcount, axCclDataType dtype, axCclComm comm, axclrtStream stream);
```

#### 2.1.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| sendbuff | in | 源缓冲区，`sendcount` 个元素。传 [AX_CCL_IN_PLACE](reference/macro.md#AX_CCL_IN_PLACE) 表示直接收集到本 rank 在 `recvbuff` 中的分片。 |
| recvbuff | out | 结果缓冲区，`sendcount` * worldSize 个元素，按 rank 顺序排列。 |
| sendcount | in | 本 rank 贡献的元素个数。 |
| dtype | in | 元素类型。 |
| comm | in | communicator 句柄。 |
| stream | in | 接收该操作的 Stream；NULL 选择默认 Stream。 |

#### 2.1.3. 说明

支持全部已声明的存储类型、1..8 个 rank 以及 sendcount >= 0。结果按逻辑 rank 顺序排列，与物理环顺序无关。recvbuff 须分配 worldSize * sendcount 个元素。使用 AX_CCL_IN_PLACE 时，输入必须已位于 recvbuff + rank * sendcount * sizeof(dtype)；也支持直接传入该分片的精确指针。其他重叠均无效。与 AllReduce 相同，可使用显式 GroupStart/End，也可每个 rank 提交一次裸调用；读取结果前须同步所有参与的 Stream。位模式原样复制（包括 NaN 和带符号零）。

#### 2.1.4. 返回值

- `AXCL_SUCC`：操作已被接受（已在 Group 内收集、已登记或已入队）。
- 其他错误：失败。

<br>

<a id="axCclAllReduce"></a>

### 2.2. axCclAllReduce

AllReduce：对所有 rank 的 `sendbuff` 按 `op` 做逐元素归约，结果返回所有 rank。

#### 2.2.1. 函数

```c
AX_CCL_EXPORT axclError axCclAllReduce(const void *sendbuff, void *recvbuff, size_t count, axCclDataType dtype, axCclRedOp op, axCclComm comm, axclrtStream stream);
```

#### 2.2.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| sendbuff | in | 源设备缓冲区，`count` 个元素；支持与 recvbuff 完全相同（精确别名），也支持传 [AX_CCL_IN_PLACE](reference/macro.md#AX_CCL_IN_PLACE)。 |
| recvbuff | out | 结果设备缓冲区，每个 rank `count` 个元素。 |
| count | in | 元素个数。 |
| dtype | in | 元素类型。 |
| op | in | 内置归约算子，或 [axCclRedOpCreatePreMulSum](#axCclRedOpCreatePreMulSum) 返回的句柄。 |
| comm | in | communicator 句柄。 |
| stream | in | 接收该操作的 Stream；NULL 选择默认 Stream。 |

#### 2.2.3. 返回值

- `AXCL_SUCC`：操作已被接受（已在 Group 内收集、已登记或已入队）。
- 其他错误：失败。

#### 2.2.4. 说明

可使用显式 [axCclGroupStart](#axCclGroupStart) / [axCclGroupEnd](#axCclGroupEnd)，也可每个 rank 提交一次裸调用。成功返回只表示操作已被接受；读取 `recvbuff` 前须同步所有参与的 Stream。各 rank 须按相同调用顺序传入相同的 `count`、`dtype` 和 `op`。`sendbuff` 和 `recvbuff` 须是在 communicator 所在设备上用 [axclrtMalloc](memory_api.md#axclrtMalloc) 分配的 Device 内存，每段范围位于同一次分配内，并在操作完成前保持有效。原地操作可令 `sendbuff` == `recvbuff`，或传 [AX_CCL_IN_PLACE](reference/macro.md#AX_CCL_IN_PLACE)；部分重叠会被拒绝。`count` 为零合法。

<br>

<a id="axCclAllToAll"></a>

### 2.3. axCclAllToAll

AllToAll：等量交换。rank i 向每个 rank j 发送 `count` 个元素；`recvbuff` 从每个 rank 接收 `count` 个元素。

#### 2.3.1. 函数

```c
AX_CCL_EXPORT axclError axCclAllToAll(const void *sendbuff, void *recvbuff, size_t count, axCclDataType dtype, axCclComm comm, axclrtStream stream);
```

#### 2.3.2. 参数


| 名称 | 方向 | 说明 |
|---|---|---|
| sendbuff | in | 源设备缓冲区，`count` * worldSize 个元素。传 [AX_CCL_IN_PLACE](reference/macro.md#AX_CCL_IN_PLACE) 时在 `recvbuff` 中交换数据。 |
| recvbuff | out | 结果设备缓冲区，`count` * worldSize 个元素。不能传 [AX_CCL_IN_PLACE](reference/macro.md#AX_CCL_IN_PLACE)。 |
| count | in | 本 rank 向每个 rank 发送、并从每个 rank 接收的元素个数。 |
| dtype | in | 元素类型。 |
| comm | in | communicator 句柄。 |
| stream | in | 接收该操作的 Stream；NULL 选择默认 Stream。 |

#### 2.3.3. 返回值

- `AXCL_SUCC`：操作已被接受（已在 Group 内收集、已登记或已入队）。
- 其他错误：失败。

#### 2.3.4. 说明

在包含 1..8 个 rank 的单个进程中支持全部已声明的存储类型；多进程路径不支持。每个活动缓冲区须提供 worldSize * count 个元素；count 为零合法。每个 rank 的一次调用经 Group 或裸调用收集；最后到达的调用完成校验后入队整轮交换。须使用创建 communicator 时捕获的 Context。IN_PLACE 将 sendbuff 解析为 recvbuff；recvbuff 传 IN_PLACE 会被拒绝。发送/接收范围重叠时，先将其复制到 Device 临时存储，再写入接收数据；各接收范围之间不得重叠。临时存储保留到 communicator 终结或中止。重新绑定 Stream 须使用同一 Context，并证明此前的工作已完成。

<br>

<a id="axCclAllToAllV"></a>

### 2.4. axCclAllToAllV

AllToAllV：变长交换（对应 ProcessGroup.all_to_all_single）。

#### 2.4.1. 函数

```c
AX_CCL_EXPORT axclError axCclAllToAllV(const void *sendbuff, const int64_t *sendCounts, const int64_t *sdispls, void *recvbuff, const int64_t *recvCounts, const int64_t *rdispls, axCclDataType dtype, axCclComm comm, axclrtStream stream);
```

#### 2.4.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| sendbuff | in | 源设备缓冲区。 |
| sendCounts | in | 本 rank 发往各 rank 的元素个数，长度为 worldSize。 |
| sdispls | in | 各 rank 对应发送段在 `sendbuff` 中的元素偏移，长度为 worldSize。 |
| recvbuff | out | 目标设备缓冲区。 |
| recvCounts | in | 本 rank 从各 rank 接收的元素个数，长度为 worldSize。 |
| rdispls | in | 各 rank 对应接收段在 `recvbuff` 中的元素偏移，长度为 worldSize。 |
| dtype | in | 元素类型。 |
| comm | in | communicator 句柄。 |
| stream | in | 接收该操作的 Stream；NULL 选择默认 Stream。 |

#### 2.4.3. 说明

counts/displacements 是 Host 数组，在调用期间复制。值必须非负，且每条有向发送段的元素个数必须与对端的接收个数一致。零长度段和全零交换合法；未使用的缓冲区可为 NULL。活动接收范围之间不得重叠。发送/接收重叠和 IN_PLACE 使用与 [axCclAllToAll](#axCclAllToAll) 相同的临时复制路径。使用 IN_PLACE 时仍须传入全部四个数组（均不得为 NULL），分别描述 recvbuff 中的发送和接收布局。[axCclAllToAll](#axCclAllToAll) 的其他限制同样适用。

#### 2.4.4. 返回值

- `AXCL_SUCC`：操作已被接受（已在 Group 内收集、已登记或已入队）。
- 其他错误：失败。

<br>

<a id="axCclBarrier"></a>

### 2.5. axCclBarrier

Barrier：阻塞 `stream`，直到所有 rank 都已到达。

支持尚未建环的 InitRootInfo communicator，以及 Group 内的匹配轮次。调用成功返回时不等待 Barrier 完成；须同步 `stream` 才能等待。在多进程路径上，裸调用要等所有 rank 都提交后才返回。

#### 2.5.1. 函数

```c
AX_CCL_EXPORT axclError axCclBarrier(axCclComm comm, axclrtStream stream);
```

#### 2.5.2. 参数


| 名称 | 方向 | 说明 |
|---|---|---|
| comm | in | communicator 句柄。 |
| stream | in | 接收该操作的 Stream；NULL 选择默认 Stream。 |

#### 2.5.3. 返回值

- `AXCL_SUCC`：操作已被接受（已在 Group 内收集、已登记或已入队）。
- 其他错误：失败。

<br>

<a id="axCclBroadcast"></a>

### 2.6. axCclBroadcast

Broadcast：将 `count` 个元素从 `root` 复制到所有 rank。

#### 2.6.1. 函数

```c
AX_CCL_EXPORT axclError axCclBroadcast(const void *sendbuff, void *recvbuff, size_t count, axCclDataType dtype, int32_t root, axCclComm comm, axclrtStream stream);
```

#### 2.6.2. 参数


| 名称 | 方向 | 说明 |
|---|---|---|
| sendbuff | in | `root` 上存放数据的设备缓冲区，`count` 个元素。非 root rank 忽略该参数，可传 NULL。传 [AX_CCL_IN_PLACE](reference/macro.md#AX_CCL_IN_PLACE) 时每个 rank 原地使用 `recvbuff`。 |
| recvbuff | out | 每个 rank 上接收数据的设备缓冲区，`count` 个元素。 |
| count | in | 元素个数。 |
| dtype | in | 元素类型。 |
| root | in | root rank，取值范围为 [0, worldSize - 1]，各 rank 须相同。 |
| comm | in | communicator 句柄。 |
| stream | in | 接收该操作的 Stream；NULL 选择默认 Stream。 |

#### 2.6.3. 返回值

- `AXCL_SUCC`：操作已被接受（已在 Group 内收集、已登记或已入队）。
- 其他错误：失败。

#### 2.6.4. 说明

`root` 取值范围为 [0, worldSize - 1]，且所有 rank 须传入相同值。root rank 上由 `sendbuff` 持有数据；非 root rank 忽略 `sendbuff`，可传 NULL。每个 rank 都须提供 `recvbuff`。将 [AX_CCL_IN_PLACE](reference/macro.md#AX_CCL_IN_PLACE) 作为 `sendbuff` 传入，表示每个 rank 都原地使用 `recvbuff`。

<br>

<a id="axCclCommAbort"></a>

### 2.7. axCclCommAbort

关闭提交入口，并释放工作已被证明完成的健康通信域。

#### 2.7.1. 函数

```c
AX_CCL_EXPORT axclError axCclCommAbort(axCclComm comm);
```

#### 2.7.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| comm | in | 该通信域的任一 communicator 句柄。 |

#### 2.7.3. 返回值

- `AXCL_SUCC`：该通信域已释放；随后须销毁每个 rank 的句柄。
- 其他错误：失败。

#### 2.7.4. 说明

有界查询证明所有历史应用 Stream 均已完成且健康后，成功的 Abort 会释放空闲或曾使用过的通信域；Abort 本身不等待应用 Stream。尚未完成的自动初始化也可被取消；Abort 在初始化不再使用借用的 Context 后才返回。随后须销毁每个 rank 的句柄；成功 Abort 后无需 Finalize。仍在等待其他 rank 的裸调用会被丢弃。Abort 一旦作用于该通信域，即使 Abort 失败，提交入口也保持关闭：通信域不再接受新操作。仍有任务运行或其他线程正在提交时，Abort 失败并保留资源：没有可用的受支持硬件停止栅栏（fence）。应先同步参与的 Stream，再重试 Abort 或调用 [axCclCommFinalize](#axCclCommFinalize)。多进程路径下，Abort 仅在尚未提交任何工作时成功；提交工作后 Abort 失败，通信域进入失败状态。状态不确定或已失败的通信域返回其持久失败；须保持 Stream、Context 和缓冲区存活以便恢复。不能在 Group 内调用。Abort 不会停止正在执行的硬件任务。

<br>

<a id="axCclCommCount"></a>

### 2.8. axCclCommCount

查询 `comm` 的 world size（rank 数量）。

#### 2.8.1. 函数

```c
AX_CCL_EXPORT axclError axCclCommCount(axCclComm comm, int32_t *count);
```

#### 2.8.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| comm | in | communicator 句柄。 |
| count | out | 返回 world size。不得为 NULL。 |

#### 2.8.3. 返回值

- `AXCL_SUCC`：成功返回 world size。
- 其他错误：失败。

<br>

<a id="axCclCommDeregister"></a>

### 2.9. axCclCommDeregister

注销通过 [axCclCommRegister](#axCclCommRegister) 注册的缓冲区。

#### 2.9.1. 函数

```c
AX_CCL_EXPORT axclError axCclCommDeregister(axCclComm comm, void *handle);
```

#### 2.9.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| comm | in | 拥有该注册的 communicator。 |
| handle | in | [axCclCommRegister](#axCclCommRegister) 返回的句柄。不得为 NULL。 |

#### 2.9.3. 返回值

- `AXCL_SUCC`：注册已释放。
- 其他错误：失败。

#### 2.9.4. 说明

已接受的工作仍在使用该注册时返回 AXCL_ERR_CCL_INVALID_STATE；该注册保持有效，待该工作完成后重试。成功的 [axCclCommFinalize](#axCclCommFinalize) 或 [axCclCommAbort](#axCclCommAbort) 会释放该通信域拥有的注册，无需事先逐个注销。不能在 Group 内调用。

<br>

<a id="axCclCommDestroy"></a>

### 2.10. axCclCommDestroy

释放已终结或已中止的 communicator 句柄。本接口不隐式终结 `comm`。

#### 2.10.1. 函数

```c
AX_CCL_EXPORT axclError axCclCommDestroy(axCclComm comm);
```

#### 2.10.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| comm | in | 已终结的 communicator，或所属通信域已成功中止的 communicator。 |

#### 2.10.3. 返回值

- `AXCL_SUCC`：成功释放句柄；此后不得再使用 `comm`。
- 其他错误：失败。

#### 2.10.4. 说明

须先用 [axCclRedOpDestroy](#axCclRedOpDestroy) 销毁 `comm` 的所有自定义归约算子。不能在 Group 内调用。

<br>

<a id="axCclCommDevice"></a>

### 2.11. axCclCommDevice

查询 `comm` 绑定的逻辑设备 ID。

#### 2.11.1. 函数

```c
AX_CCL_EXPORT axclError axCclCommDevice(axCclComm comm, int32_t *deviceId);
```

#### 2.11.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| comm | in | communicator 句柄。 |
| deviceId | out | 返回逻辑设备 ID。不得为 NULL。 |

#### 2.11.3. 返回值

- `AXCL_SUCC`：成功返回设备 ID。
- 其他错误：失败。

<br>

<a id="axCclCommFinalize"></a>

### 2.12. axCclCommFinalize

终结 communicator 资源，并将 `comm` 标记为不可用。

对于已执行过工作的通信域，第一次终结会同步每个 rank 的全部参与应用 Stream，释放该通信域的 Device 资源，并关闭整个通信域，不再接受后续操作。在此屏障完成前，这些 Stream、Context 和设备必须保持存活。此后须终结/销毁每个 communicator。从未执行过工作的 communicator 不同步应用 Stream。在 Group 内调用终结会被拒绝。仍在等待其他 rank 的裸调用会被丢弃，不会入队。尚未完成的自动初始化会被取消；Finalize 在初始化不再使用借用的 Context 后才返回。多进程路径下，每个 rank 都必须调用 Finalize。启动不完整或完成状态不确定时返回错误，并保留全部对端资源；此时不要释放缓冲区、销毁 Context、复位设备或拆除 Runtime。

#### 2.12.1. 函数

```c
AX_CCL_EXPORT axclError axCclCommFinalize(axCclComm comm);
```

#### 2.12.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| comm | in | 待终结的 communicator。 |

#### 2.12.3. 返回值

- `AXCL_SUCC`：成功终结，可随后销毁该 communicator。
- 其他错误：失败。

<br>

<a id="axCclCommGetAsyncError"></a>

### 2.13. axCclCommGetAsyncError

读取并消费本 communicator 的异步错误通知。

没有待处理的通知时返回 AXCL_SUCC，且 `err` == AXCL_SUCC。查询尚未完成的自动初始化时不等待其他 rank；初始化失败通过本接口报告。没有错误不代表已就绪。本接口查询该通信域使用的所有集合操作及 P2P 应用 Stream，不排在其已入队的工作之后，Device 查询总预算有界，约 1000 ms（多进程路径还会查询其他进程，最长约 16 s）。查询失败通过函数返回值报告，不写入 `err`。普通 Stream 同步后，Device 侧 CCL 失败和被跳过的 CCL 任务仍可查询。首次观察到的错误会终止该通信域，并阻止后续下发。每个 communicator 只报告一次该错误；消费通知不会清除失败状态，也不证明硬件已完成。Host 和 Device 软件版本须兼容。借用的 Stream/Context 必须保持存活，直到 communicator 终结。

#### 2.13.1. 函数

```c
AX_CCL_EXPORT axclError axCclCommGetAsyncError(axCclComm comm, axclError *err);
```

#### 2.13.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| comm | in | communicator 句柄。 |
| err | out | 返回待处理的异步错误，或 AXCL_SUCC。不得为 NULL。 |

#### 2.13.3. 返回值

- `AXCL_SUCC`：查询完成；`err` 中为查询结果。
- 其他错误：失败。

#### 2.13.4. 说明

失败时 `err` 无意义。单进程路径下，若其他线程正在向同一通信域提交，本接口不执行查询，直接返回 AXCL_ERR_CCL_INVALID_STATE；待该提交返回后重试。不能在 Group 内调用。

<br>

<a id="axCclCommInitAll"></a>

### 2.14. axCclCommInitAll

在单进程内为每个设备各创建一个 communicator（单线程多设备）。

#### 2.14.1. 函数

```c
AX_CCL_EXPORT axclError axCclCommInitAll(axCclComm *comms, int32_t count, const int32_t *deviceIds);
```

#### 2.14.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| comms | out | 长度为 `count` 的数组，用于接收各 communicator。不得为 NULL；失败时不返回任何 communicator。 |
| count | in | communicator/设备个数，取值范围为 [1, 8]。 |
| deviceIds | in | 长度为 `count` 的数组，包含每个 communicator 对应的逻辑设备 ID。不得为 NULL；各 ID 必须互不相同，取值范围为 [0, [axclrtGetDeviceCount](device_api.md#axclrtGetDeviceCount)() - 1]。 |

#### 2.14.3. 返回值

- `AXCL_SUCC`：已创建并连接全部 communicator。
- 其他错误：失败。

#### 2.14.4. 说明

支持单个 Host 进程内 1 到 8 个不同的逻辑 Device ID。当前主要拓扑为四个设备；实现接受完整的协议范围。须先用 [axclrtSetDevice](device_api.md#axclrtSetDevice) 激活列出的每个 Device；每个 communicator 使用该 Device 的默认 Context。数组顺序只决定逻辑 rank，不声明环。对于 ring 集合操作，各 rank 按实际的本地 chip_id 升序排列，且每个 rank 到下一个 rank 的 C2C 链路必须在线，否则本调用失败。这是静态规则，不是硬件邻接发现。环在返回前已建立，因此单个 rank 的裸集合操作不会等待其他 rank 调用。如果调用线程已有当前 Context，返回前会恢复；否则返回后该线程可能绑定在某个列出 Device 的默认 Context 上。InitAll 始终使用单进程路径，即使诊断变量 AXCCL_MULTIPROCESS 覆盖为 "1" 也是如此。不能在 Group 内调用。

<br>

<a id="axCclCommInitRank"></a>

### 2.15. axCclCommInitRank

按 rank 创建单个 communicator（NCCL 风格的便捷接口）。

等效于 [axCclCommInitRootInfo](#axCclCommInitRootInfo)；`uniqueId` 即所有 rank 共享的 root info。参数、返回值和说明均与 [axCclCommInitRootInfo](#axCclCommInitRootInfo) 相同。

#### 2.15.1. 函数

```c
AX_CCL_EXPORT axclError axCclCommInitRank(axCclComm *comm, int32_t deviceId, const axCclRootInfo *uniqueId, int32_t worldSize, int32_t rank);
```

#### 2.15.2. 参数


| 名称 | 方向 | 说明 |
|---|---|---|
| comm | out | 接收创建的 communicator 句柄，与 [axCclCommInitRootInfo](#axCclCommInitRootInfo) 相同。 |
| deviceId | in | 逻辑（虚拟）设备 ID，与 [axCclCommInitRootInfo](#axCclCommInitRootInfo) 相同。 |
| uniqueId | in | 所有 rank 共享的 root info，即 [axCclCommInitRootInfo](#axCclCommInitRootInfo) 的 `rootInfo`。 |
| worldSize | in | rank 总数，取值范围为 [1, 8]。 |
| rank | in | 本 communicator 的 rank，取值范围为 [0, worldSize - 1]。 |

#### 2.15.3. 返回值

- `AXCL_SUCC`：本 rank 已注册，`comm` 有效。
- 其他错误：失败。

<br>

<a id="axCclCommInitRootInfo"></a>

### 2.16. axCclCommInitRootInfo

用广播的 root info 创建 communicator（推荐的建链路径）。

#### 2.16.1. 函数

```c
AX_CCL_EXPORT axclError axCclCommInitRootInfo(axCclComm *comm, int32_t deviceId, const axCclRootInfo *rootInfo, int32_t worldSize, int32_t rank);
```

#### 2.16.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| comm | out | 返回绑定到 `deviceId`、rank 为 `rank` 的 communicator。不得为 NULL；失败时置为 NULL。 |
| deviceId | in | 当前进程可见的逻辑（虚拟）设备 ID，取值范围为 [0, [axclrtGetDeviceCount](device_api.md#axclrtGetDeviceCount)() - 1]。必须是调用线程的当前设备。 |
| rootInfo | in | 由 [axCclGetRootInfo](#axCclGetRootInfo) 生成、原样广播到所有 rank 的 root info。不得为 NULL。 |
| worldSize | in | communicator 中的 rank 总数，取值范围为 [1, 8]。所有 rank 必须传入相同值。 |
| rank | in | 本 communicator 的 rank，取值范围为 [0, worldSize - 1]；每个 rank 只能使用一次。 |

#### 2.16.3. 返回值

- `AXCL_SUCC`：本 rank 已注册，`comm` 有效。
- 其他错误：失败。

#### 2.16.4. 说明

调用线程的当前 Context 必须属于 `deviceId`，例如在调用 [axclrtSetDevice](device_api.md#axclrtSetDevice) 或 [axclrtCreateContext](context_api.md#axclrtCreateContext) 之后。communicator 借用该 Context，该 Context 须保持有效，直到 [axCclCommFinalize](#axCclCommFinalize) 或 [axCclCommAbort](#axCclCommAbort) 返回。本调用只注册本 rank，不等待其他 rank 即返回；同一线程可按任意顺序初始化多个 rank。不能在 Group 内调用。所有声明的 rank 都必须先调用本接口，之后数据调用、[axCclGroupEnd](#axCclGroupEnd)、[axCclCommRegister](#axCclCommRegister) 或 [axCclRedOpCreatePreMulSum](#axCclRedOpCreatePreMulSum) 才能继续；这些调用会等待全部 rank 加入。不参与某次 P2P 传输的 rank 也须先初始化，随后可在该次传输中保持空闲。缺少 rank 或超时都不会回退到单进程路径。Linux 上自动检测进程布局：全部 rank 位于同一进程时使用单进程路径，每个 rank 位于独立进程时使用多进程路径；其他布局（多个进程中某些进程含多个 rank）失败。本调用返回后发生的初始化失败由 [axCclCommGetAsyncError](#axCclCommGetAsyncError) 报告。多进程路径要求同一 Host、相同的有效 UID 和网络命名空间、每个进程一个 rank，且各 rank 使用不同的物理 Device。rank 0 必须能看到所有 Device；每对 P2P 中较小的 rank 必须能看到这两个 Device。最多支持 8 个 rank；硬件验证覆盖两个进程/两个 Device。跨进程支持内置 ring 集合操作（AllReduce、Reduce、Broadcast、AllGather、ReduceScatter、Gather、Scatter、Barrier）、Send/Recv 和单 communicator Group；不支持 AllToAll[V]、缓冲区注册和自定义归约。单进程 communicator 保留全部功能。每个进程的 Group 最多包含 32 个调用，使用同一 Context/Stream，且只能全部是 P2P 调用或全部是集合操作。多进程路径下，每个 rank 都必须调用 [axCclCommFinalize](#axCclCommFinalize) 后才能释放其 Stream/Context。Device 工作状态不确定时保留现有资源。诊断环境变量 AXCCL_MULTIPROCESS 的值不是 "0" 或 "1" 时（包括未设置）自动检测；"0" 强制旧单进程路径；"1" 强制旧多进程路径，其初始化会等待全部 rank。旧的部分 world 本地提交，或未初始化无关 rank 的 P2P，需要设置 "0"。普通的完整 world 应用无需覆盖。

<br>

<a id="axCclCommRank"></a>

### 2.17. axCclCommRank

查询 `comm` 的 rank。

#### 2.17.1. 函数

```c
AX_CCL_EXPORT axclError axCclCommRank(axCclComm comm, int32_t *rank);
```

#### 2.17.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| comm | in | communicator 句柄。 |
| rank | out | 返回 rank。不得为 NULL。 |

#### 2.17.3. 返回值

- `AXCL_SUCC`：成功返回 rank。
- 其他错误：失败。

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
| comm | in | communicator 句柄。 |
| buff | in | Device 范围的起始地址。不得为 NULL。 |
| size | in | 范围大小，单位为字节，取值范围为 [1, UINT32_MAX]。 |
| handle | out | 返回注册句柄。不得为 NULL；失败时置为 NULL。 |

#### 2.18.3. 说明

要求有效的当前 Context；实现会临时切换到 communicator 设备的 Context，完成后恢复调用方的 Context。`buff` 必须属于该设备上受跟踪的 Device 分配。非空字节范围必须位于 39 位物理地址空间内，且最多包含 UINT32_MAX 字节。该范围必须位于该分配之内，调用方须保持该分配有效直至注销。注册会校验该范围，但不会固定该分配。注册仅限单进程且不透明，句柄不会复用。重叠范围会被拒绝。本接口不提供跨进程 IPC 或导出内存。多进程路径不支持本接口；本接口会等待自动初始化完成。此后该 communicator 上缓冲区范围落在已注册范围内的操作会自动使用该注册。不能在 Group 内调用。

#### 2.18.4. 返回值

- `AXCL_SUCC`：范围已注册，`handle` 有效。
- 其他错误：失败。

<br>

<a id="axCclFinalize"></a>

### 2.19. axCclFinalize

去初始化 CCL 模块并释放模块级资源。

每次调用释放一次 [axCclInit](#axCclInit) 引用；只有最后一次调用才释放模块级资源。

#### 2.19.1. 函数

```c
AX_CCL_EXPORT axclError axCclFinalize(void);
```

#### 2.19.2. 参数

不适用

#### 2.19.3. 返回值

- `AXCL_SUCC`：已释放一次引用，或模块已去初始化。
- 其他错误：失败。

#### 2.19.4. 说明

最后一次 [axCclFinalize](#axCclFinalize) 前须终结并销毁所有 communicator；否则调用失败，模块保持已初始化状态。不能在 Group 内调用。

<br>

<a id="axCclGather"></a>

### 2.20. axCclGather

按逻辑 rank 顺序将每个 rank 的 `sendcount` 个元素收集到 `root`。

#### 2.20.1. 函数

```c
AX_CCL_EXPORT axclError axCclGather(const void *sendbuff, void *recvbuff, size_t sendcount, axCclDataType dtype, int32_t root, axCclComm comm, axclrtStream stream);
```

#### 2.20.2. 参数


| 名称 | 方向 | 说明 |
|---|---|---|
| sendbuff | in | 存放本 rank 贡献数据的设备缓冲区，`sendcount` 个元素。 |
| recvbuff | out | `root` 上的结果设备缓冲区，`sendcount` * worldSize 个元素。非 root rank 忽略该参数，可传 NULL。 |
| sendcount | in | 每个 rank 贡献的元素个数。 |
| dtype | in | 元素类型。 |
| root | in | root rank，取值范围为 [0, worldSize - 1]，各 rank 须相同。 |
| comm | in | communicator 句柄。 |
| stream | in | 接收该操作的 Stream；NULL 选择默认 Stream。 |

#### 2.20.3. 返回值

- `AXCL_SUCC`：操作已被接受（已在 Group 内收集、已登记或已入队）。
- 其他错误：失败。

#### 2.20.4. 说明

`root` 取值范围为 [0, worldSize - 1]，且所有 rank 须传入相同值。只有 `root` 写入 `recvbuff`，其中须容纳 worldSize * sendcount 个元素。非 root rank 的 `recvbuff` 可传 NULL。仅 root 支持原地操作：将 [AX_CCL_IN_PLACE](reference/macro.md#AX_CCL_IN_PLACE) 或 root 在 `recvbuff` 中的精确分片作为 `sendbuff` 传入。

<br>

<a id="axCclGetErrorString"></a>

### 2.21. axCclGetErrorString

获取 CCL 接口所返回错误码的描述字符串。

CCL 模块错误码映射为固定字符串；其他错误码由 [axclrtGetErrorString](other_api.md#axclrtGetErrorString) 描述。不要求先调用 [axCclInit](#axCclInit)。

#### 2.21.1. 函数

```c
AX_CCL_EXPORT const char* axCclGetErrorString(axclError error);
```

#### 2.21.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| error | in | 错误码。 |

#### 2.21.3. 返回值

- 描述字符串。不得释放或修改；动态格式化的描述可能被同一线程的后续调用覆盖。

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
| rootInfo | out | 返回 root info。不得为 NULL。调用者负责把这些字节原样广播到所有 rank。 |

#### 2.22.3. 返回值

- `AXCL_SUCC`：成功生成 root info。
- 其他错误：失败。

#### 2.22.4. 说明

须先成功调用 [axCclInit](#axCclInit)。每次调用都会生成新的 communicator 标识；同一 communicator 的所有 rank 必须使用同一次调用生成的字节。

<br>

<a id="axCclGetVersion"></a>

### 2.23. axCclGetVersion

返回 CCL 库的构建版本号。

不要求先调用 [axCclInit](#axCclInit)。

#### 2.23.1. 函数

```c
AX_CCL_EXPORT axclError axCclGetVersion(int32_t *major, int32_t *minor, int32_t *patch);
```

#### 2.23.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| major | out | 返回主版本号。可为 NULL。 |
| minor | out | 返回次版本号。可为 NULL。 |
| patch | out | 返回修订号。可为 NULL。 |

#### 2.23.3. 返回值

- `AXCL_SUCC`：成功返回版本号。
- 其他错误：失败。

<br>

<a id="axCclGroupEnd"></a>

### 2.24. axCclGroupEnd

准备当前 Group 中的每个 rank 并将其入队。

只有最外层 GroupEnd 入队；它会先等待自动初始化就绪。成功返回不表示执行完成。复用或释放任何对端可访问的缓冲区之前，须同步所有 rank 的 Stream。Device 资源在轮次之间保留，由 [axCclCommFinalize](#axCclCommFinalize) 释放，该接口会同步参与的 Stream。所有参与的 Stream/Context 必须保持存活直到 CommFinalize。启动不完整或完成状态不确定时，通信域进入终止状态，其资源必须保持存活以便运维人员恢复，即使操作随后迟到完成也是如此。CCL 任务失败或被跳过后会留下持久错误，即使应用此前已同步该 Stream，后续检查仍会报告该错误。必须保持借用的 Stream/Context 句柄有效；使用已释放的句柄违反 Runtime API 前置条件，本接口不会检测。

#### 2.24.1. 函数

```c
AX_CCL_EXPORT axclError axCclGroupEnd(void);
```

#### 2.24.2. 参数

不适用

#### 2.24.3. 返回值

- `AXCL_SUCC`：已关闭一个内层 Group，或最外层 Group 已入队。
- 其他错误：失败。

#### 2.24.4. 说明

空 Group，或没有匹配 [axCclGroupStart](#axCclGroupStart) 的 GroupEnd，均会失败。最外层 GroupEnd 失败时丢弃整个 Group。

<br>

<a id="axCclGroupStart"></a>

### 2.25. axCclGroupStart

在同一 Host 线程上收集协调的轮次与配对的 Send/Recv 调用。

#### 2.25.1. 函数

```c
AX_CCL_EXPORT axclError axCclGroupStart(void);
```

#### 2.25.2. 参数

不适用

#### 2.25.3. 返回值

- `AXCL_SUCC`：已开启一个 Group，或嵌套深度已加一。
- 其他错误：失败。

#### 2.25.4. 说明

Group 状态按 Host 线程维护。须先成功调用 [axCclInit](#axCclInit)。支持嵌套 Group；只有最外层 GroupEnd 准备并入队。每个集合轮次需要每个 rank 各一次调用，且形状/类型/算子须匹配。单进程模式支持多轮及混合轮次、多个 communicator、AllToAll[V] 和配对的 P2P 调用。成员调用只校验并收集参数，不等待初始化；最外层 GroupEnd 等待就绪。每个 communicator/rank 使用一个 Context/Stream；任何入队之前都会校验整个 Group，包括顺序依赖环。P2P Group 则按 FIFO 顺序匹配每个有向 peer 的 Send/Recv 调用；完整 world 自动初始化完成后，不活动的 rank 无需提交数据。它们仍须初始化。限制见 axCclSend。Group 内第一个失败的调用会由 GroupEnd 再次报告，校验错误会取消整个 Group。后续轮次和终结须使用同一 Host 线程。多进程模式支持单 communicator 的纯 P2P 或纯集合操作 Group，每个进程最多 32 个调用，使用同一 Context/Stream。peer 匹配和批次限制见 axCclSend。模块初始化/去初始化、communicator 的创建/终结/销毁/中止、[axCclCommGetAsyncError](#axCclCommGetAsyncError) 和缓冲区注册均不能在 Group 内调用。共享设备/Stream 的无关 communicator 须由应用在本协调 Group 之外串行化；不提供自动的并发 communicator 调度器。终止状态的通信域会阻止后续下发。

<br>

<a id="axCclInit"></a>

### 2.26. axCclInit

初始化 CCL 模块。

可以多次调用；每次成功调用都必须与 [axCclFinalize](#axCclFinalize) 配对。须在 [axclInit](system_api.md#axclInit) 之后调用。在 [axclInit](system_api.md#axclInit) 之前调用任何 CCL 接口，行为未定义。本接口成功前，除 [axCclGetVersion](#axCclGetVersion) 和 [axCclGetErrorString](#axCclGetErrorString) 外，其他 CCL 接口均会失败。不能在 Group 内调用。

#### 2.26.1. 函数

```c
AX_CCL_EXPORT axclError axCclInit(void);
```

#### 2.26.2. 参数

不适用

#### 2.26.3. 返回值

- `AXCL_SUCC`：CCL 模块已初始化，或其引用计数已加一。
- 其他错误：失败。

<br>

<a id="axCclRecv"></a>

### 2.27. axCclRecv

从 rank `peer` 接收 `count` 个元素。

#### 2.27.1. 函数

```c
AX_CCL_EXPORT axclError axCclRecv(void *recvbuff, size_t count, axCclDataType dtype, int32_t peer, axCclComm comm, axclrtStream stream);
```

#### 2.27.2. 参数


| 名称 | 方向 | 说明 |
|---|---|---|
| recvbuff | out | 目标设备缓冲区，`count` 个元素。 |
| count | in | 元素个数。 |
| dtype | in | 元素类型。 |
| peer | in | 发送方 rank，取值范围为 [0, worldSize - 1]，须与对端的 [axCclSend](#axCclSend) 匹配。 |
| comm | in | communicator 句柄。 |
| stream | in | 接收该操作的 Stream；NULL 选择默认 Stream。 |

#### 2.27.3. 返回值

- `AXCL_SUCC`：调用已被接受（已在 Group 内收集或已入队）。
- 其他错误：失败。

#### 2.27.4. 说明

[axCclSend](#axCclSend) 的匹配、Stream、缓冲区及生命周期规则同样适用。

<br>

<a id="axCclRedOpCreatePreMulSum"></a>

### 2.28. axCclRedOpCreatePreMulSum

创建“预乘求和”归约算子：result = sum(scalar_i * x_i)。

#### 2.28.1. 函数

```c
AX_CCL_EXPORT axclError axCclRedOpCreatePreMulSum(axCclComm comm, axCclRedOp *op, const void *scalar, axCclDataType datatype, axCclScalarResidence residence);
```

#### 2.28.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| comm | in | 拥有该算子的 communicator。 |
| op | out | 返回自定义算子句柄。 |
| scalar | in | 指向标量的指针，按 `datatype` 解释。支持的类型包括全部十四种已声明 dtype。其值在逻辑操作执行时读取一次，所有 tile 使用该值。所指存储须保持有效，直到所有参与的 Stream 完成，即使算子已销毁也一样。 |
| datatype | in | 标量类型。 |
| residence | in | `scalar` 所在的位置。 |

#### 2.28.3. 返回值

- `AXCL_SUCC`：算子已创建，`op` 中为其句柄。
- 其他错误：失败。

#### 2.28.4. 说明

创建要求存在与 communicator 设备对应的当前 Context，并会等待自动初始化完成。多进程路径不支持本接口。句柄仅对 `comm` 有效，且仅可用于 [axCclAllReduce](#axCclAllReduce)、[axCclReduce](#axCclReduce) 和 [axCclReduceScatter](#axCclReduceScatter)。每个 rank 可使用不同的标量值和驻留位置。每个标量类型必须与集合操作的 dtype 一致；集合操作的种类、dtype、root 和 count 必须匹配。Host 标量在逻辑操作执行时读取；Device 标量在应用 Stream 中先前的写入完成后读取。FP32/FP16/BF16/FP8 按逻辑 rank 顺序以 FP32 执行乘法与累加，最后只转换一次。整数乘积与求和保留全部位，仅在最终结果处饱和一次。FP64 按逻辑 rank 顺序执行 binary64 乘法与加法，采用最近偶数舍入，并保留渐进下溢。FP8 将无穷值夹到有限端点，并输出规范 NaN（E4M3:0x7f，E5M2:0x7e）；FP64 对无效结果输出规范值 0x7ff8000000000000。

每次成功创建都必须在销毁 `comm` 前与 [axCclRedOpDestroy](#axCclRedOpDestroy) 配对。

<br>

<a id="axCclRedOpDestroy"></a>

### 2.29. axCclRedOpDestroy

销毁由 [axCclRedOpCreatePreMulSum](#axCclRedOpCreatePreMulSum) 创建的自定义归约算子。

#### 2.29.1. 函数

```c
AX_CCL_EXPORT axclError axCclRedOpDestroy(axCclComm comm, axCclRedOp op);
```

#### 2.29.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| comm | in | 创建 `op` 的 communicator。 |
| op | in | 自定义算子句柄。 |

#### 2.29.3. 返回值

- `AXCL_SUCC`：算子已销毁；新的调用中不得再使用 `op`。
- 其他错误：失败。

#### 2.29.4. 说明

已使用 `op` 接受的操作仍会完成；标量存储须保持有效，直至这些操作完成。

<br>

<a id="axCclReduce"></a>

### 2.30. axCclReduce

Reduce：按 `op` 做逐元素归约，结果仅写入 `root`。

`root` 取值范围为 [0, worldSize - 1]，且所有 rank 须传入相同值。`op` 可以是内置算子，也可以是 [axCclRedOpCreatePreMulSum](#axCclRedOpCreatePreMulSum) 返回的句柄。

#### 2.30.1. 函数

```c
AX_CCL_EXPORT axclError axCclReduce(const void *sendbuff, void *recvbuff, size_t count, axCclDataType dtype, axCclRedOp op, int32_t root, axCclComm comm, axclrtStream stream);
```

#### 2.30.2. 参数


| 名称 | 方向 | 说明 |
|---|---|---|
| sendbuff | in | 源设备缓冲区，`count` 个元素。 |
| recvbuff | out | `root` 上的结果设备缓冲区，`count` 个元素。非 root rank 忽略该参数，可传 NULL。 |
| count | in | 元素个数。 |
| dtype | in | 元素类型。 |
| op | in | 内置归约算子，或 [axCclRedOpCreatePreMulSum](#axCclRedOpCreatePreMulSum) 返回的句柄。 |
| root | in | root rank，取值范围为 [0, worldSize - 1]，各 rank 须相同。 |
| comm | in | communicator 句柄。 |
| stream | in | 接收该操作的 Stream；NULL 选择默认 Stream。 |

#### 2.30.3. 返回值

- `AXCL_SUCC`：操作已被接受（已在 Group 内收集、已登记或已入队）。
- 其他错误：失败。

#### 2.30.4. 说明

root rank 上可原地归约：传 `sendbuff` == `recvbuff` 或 [AX_CCL_IN_PLACE](reference/macro.md#AX_CCL_IN_PLACE)。非 root rank 只读取 `sendbuff`；其 `recvbuff` 被忽略，可传 NULL（使用 [AX_CCL_IN_PLACE](reference/macro.md#AX_CCL_IN_PLACE) 时，非 root rank 从 `recvbuff` 读取输入）。

<br>

<a id="axCclReduceScatter"></a>

### 2.31. axCclReduceScatter

ReduceScatter：在各 rank 间按 `op` 归约，再将结果按等分片散发。

#### 2.31.1. 函数

```c
AX_CCL_EXPORT axclError axCclReduceScatter(const void *sendbuff, void *recvbuff, size_t recvcount, axCclDataType dtype, axCclRedOp op, axCclComm comm, axclrtStream stream);
```

#### 2.31.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| sendbuff | in | 源缓冲区，`recvcount` * worldSize 个元素。原地操作时传 [AX_CCL_IN_PLACE](reference/macro.md#AX_CCL_IN_PLACE) 或与 `recvbuff` 完全相同的地址；其他重叠会被拒绝。 |
| recvbuff | out | 结果缓冲区，`recvcount` 个元素（本 rank 的分片）。原地操作时，它同时存放 `recvcount` * worldSize 个输入元素。 |
| recvcount | in | 每个 rank 结果分片的元素个数。 |
| dtype | in | 元素类型。 |
| op | in | 内置归约算子，或 [axCclRedOpCreatePreMulSum](#axCclRedOpCreatePreMulSum) 返回的句柄。 |
| comm | in | communicator 句柄。 |
| stream | in | 接收该操作的 Stream；NULL 选择默认 Stream。 |

#### 2.31.3. 返回值

- `AXCL_SUCC`：操作已被接受（已在 Group 内收集、已登记或已入队）。
- 其他错误：失败。

#### 2.31.4. 说明

`op` 可以是内置算子，也可以是 [axCclRedOpCreatePreMulSum](#axCclRedOpCreatePreMulSum) 返回的句柄。

<br>

<a id="axCclScatter"></a>

### 2.32. axCclScatter

按逻辑 rank 顺序从 `root` 散发每份 `recvcount` 个元素的分片。

#### 2.32.1. 函数

```c
AX_CCL_EXPORT axclError axCclScatter(const void *sendbuff, void *recvbuff, size_t recvcount, axCclDataType dtype, int32_t root, axCclComm comm, axclrtStream stream);
```

#### 2.32.2. 参数


| 名称 | 方向 | 说明 |
|---|---|---|
| sendbuff | in | `root` 上存放全部分片的设备缓冲区，`recvcount` * worldSize 个元素。非 root rank 忽略该参数，可传 NULL。 |
| recvbuff | out | 接收本 rank 分片的设备缓冲区，`recvcount` 个元素。 |
| recvcount | in | 每个 rank 分片的元素个数。 |
| dtype | in | 元素类型。 |
| root | in | root rank，取值范围为 [0, worldSize - 1]，各 rank 须相同。 |
| comm | in | communicator 句柄。 |
| stream | in | 接收该操作的 Stream；NULL 选择默认 Stream。 |

#### 2.32.3. 说明

root 的 `sendbuff` 包含 worldSize * recvcount 个元素。非 root rank 的 `sendbuff` 可传 NULL。root 可将 recvbuff 设为 IN_PLACE，或设为 sendbuff 中 root 自己的精确逻辑 rank 分片。完整的 root 源数据保持不变。其他 rank 正常提供 recvbuff；其他活动的部分重叠会被拒绝。sendbuff 传 IN_PLACE 会被拒绝。`root` 取值范围为 [0, worldSize - 1]，且所有 rank 须传入相同值。

#### 2.32.4. 返回值

- `AXCL_SUCC`：操作已被接受（已在 Group 内收集、已登记或已入队）。
- 其他错误：失败。

<br>

<a id="axCclSend"></a>

### 2.33. axCclSend

向 rank `peer` 发送 `count` 个元素（与 `peer` 上的 Recv 匹配）。

#### 2.33.1. 函数

```c
AX_CCL_EXPORT axclError axCclSend(const void *sendbuff, size_t count, axCclDataType dtype, int32_t peer, axCclComm comm, axclrtStream stream);
```

#### 2.33.2. 参数


| 名称 | 方向 | 说明 |
|---|---|---|
| sendbuff | in | 源设备缓冲区，`count` 个元素。 |
| count | in | 元素个数。 |
| dtype | in | 元素类型。 |
| peer | in | 接收方 rank，取值范围为 [0, worldSize - 1]，须与对端的 [axCclRecv](#axCclRecv) 匹配。 |
| comm | in | communicator 句柄。 |
| stream | in | 接收该操作的 Stream；NULL 选择默认 Stream。 |

#### 2.33.3. 返回值

- `AXCL_SUCC`：调用已被接受（已在 Group 内收集或已入队）。
- 其他错误：失败。

#### 2.33.4. 说明

单进程通信域支持 1..8 个 rank、count 为零以及全部存储类型。`peer` 取值范围为 [0, worldSize - 1]。自收发（`peer` 等于本 rank）须在 Group 中配齐匹配的双方，并在 Device 上本地复制。缓冲区为按元素宽度对齐的设备地址；不支持 IN_PLACE。双方 peer 都必须已注册 communicator。只有这两个 peer 执行；其他 rank 无需提交操作。须使用 CommInitRootInfo 时捕获的 Context（CommInitAll 为默认 Context）。重新绑定到另一个或默认的应用 Stream 时，须使用同一 Context，并通过有界查询证明此前所有父级/配对工作均已完成。裸调用成功即表示本端已入队。调用方须在同步前按相同的逐对顺序提交相容的反向角色/count/类型；裸调用不会在 Host 上重排或暂存。P2P Group 必须包含每笔传输的双方；它可以重排任务，并支持使用独立缓冲区的双向传输。在同一设备上，任何接收范围都不得与该组中的任何发送或其他接收重叠。允许一次匹配自复制的精确别名。P2P/集合操作混合 Group 会在入队前校验完整的阶段和顺序。提交 P2P Group 前，须先完成此前尚未匹配的裸提交；本通信域仍有未匹配的裸 Send/Recv 时，提交 Group 或在其 Device 上切换 Stream 会返回 AXCL_ERR_CCL_INVALID_STATE，且不入队任何操作：先补齐缺失的 peer 调用再重试。若改为在存在未匹配提交时调用 Finalize，通信域将进入终止状态并保留资源。缓冲区、Stream 和 Context 须保持存活直到完成；共享这些设备的其他通信域须串行化。Linux 多进程模式下，裸调用会等待匹配 peer 的单笔调用提交且双方均已入队。纯 P2P Group 在同一通信域中每个进程最多收集 32 个调用，使用同一 Context/Stream。每对 peer 的调用数量须在进程间一致；反向角色/count/类型按各方向 FIFO 顺序匹配，本地交错顺序可以不同。P2P 提交时只有参与的配对（及与其相连的 rank）同步。自动初始化首先要求全部声明的 rank 完成初始化；之后不参与的 rank 可在 P2P 传输期间保持空闲。不支持裸自传输；支持 Group 内匹配的自复制。上述 Group 重叠规则同样适用。P2P 和集合操作须使用不同的多进程 Group。缓冲区必须是调用进程在 communicator 设备上通过 [axclrtMalloc](memory_api.md#axclrtMalloc) 分配的 Device 内存；整个范围须位于同一次分配内。Finalize 仍要求全部 rank 参与。
