# AXCCL

## 1. 目录

- [axCclAllGather](#axCclAllGather)：从所有 rank 收集等量数据到所有 rank；当前尚未实现。
- [axCclAllReduce](#axCclAllReduce)：对所有 rank 的数据做逐元素归约，结果返回所有 rank。
- [axCclAllToAll](#axCclAllToAll)：等量全交换；当前尚未实现。
- [axCclAllToAllV](#axCclAllToAllV)：变长全交换，对应 all_to_all_single；当前尚未实现。
- [axCclBarrier](#axCclBarrier)：全局屏障；当前尚未实现。
- [axCclBroadcast](#axCclBroadcast)：将 root 的数据广播到所有 rank；当前尚未实现。
- [axCclCommAbort](#axCclCommAbort)：立即中止通信域；当前尚未实现。
- [axCclCommCount](#axCclCommCount)：查询通信域的 world size。
- [axCclCommDeregister](#axCclCommDeregister)：注销已注册的缓冲区；当前尚未实现。
- [axCclCommDestroy](#axCclCommDestroy)：释放通信域句柄。
- [axCclCommDevice](#axCclCommDevice)：查询通信域绑定的逻辑设备 ID。
- [axCclCommFinalize](#axCclCommFinalize)：终结通信域，并将其标记为不可用。
- [axCclCommGetAsyncError](#axCclCommGetAsyncError)：读取并清除通信域的异步错误状态；当前尚未实现。
- [axCclCommInitAll](#axCclCommInitAll)：在单进程内为多个设备各创建一个通信域。
- [axCclCommInitRank](#axCclCommInitRank)：按 rank 创建单个通信域，是 [axCclCommInitRootInfo](#axCclCommInitRootInfo) 的别名。
- [axCclCommInitRootInfo](#axCclCommInitRootInfo)：用广播的 root info 创建通信域。
- [axCclCommRank](#axCclCommRank)：查询通信域自身的 rank。
- [axCclCommRegister](#axCclCommRegister)：注册设备缓冲区以优化跨 rank 访问；当前尚未实现。
- [axCclFinalize](#axCclFinalize)：去初始化 CCL 模块。
- [axCclGather](#axCclGather)：将所有 rank 的数据收集到 root；当前尚未实现。
- [axCclGetErrorString](#axCclGetErrorString)：获取错误码的描述字符串。
- [axCclGetRootInfo](#axCclGetRootInfo)：在 rank 0 上生成建链用的 root info。
- [axCclGetVersion](#axCclGetVersion)：查询 CCL 库的版本号。
- [axCclGroupEnd](#axCclGroupEnd)：准备并提交当前 Group 收集到的所有 rank。
- [axCclGroupStart](#axCclGroupStart)：开始收集每个 rank 的一次 AllReduce 调用。
- [axCclInit](#axCclInit)：初始化 CCL 模块。
- [axCclRecv](#axCclRecv)：从指定 rank 接收数据；当前尚未实现。
- [axCclRedOpCreatePreMulSum](#axCclRedOpCreatePreMulSum)：创建预乘求和归约算子；当前尚未实现。
- [axCclRedOpDestroy](#axCclRedOpDestroy)：销毁自定义归约算子；当前尚未实现。
- [axCclReduce](#axCclReduce)：将所有 rank 的数据归约到 root；当前尚未实现。
- [axCclReduceScatter](#axCclReduceScatter)：归约后按等分片散回各 rank；当前尚未实现。
- [axCclScatter](#axCclScatter)：将 root 的数据分片散到所有 rank；当前尚未实现。
- [axCclSend](#axCclSend)：向指定 rank 发送数据；当前尚未实现。

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

- `AXCL_ERR_CCL_UNSUPPORT`：本接口当前尚未实现。

#### 2.1.4. 说明

- 本接口当前尚未实现，任何参数组合下都返回 `AXCL_ERR_CCL_UNSUPPORT`。

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
| count | in | 元素个数，取值范围为 `[worldSize, 1024]`。 |
| dtype | in | 元素类型。当前只支持 `AX_CCL_DT_FP32`。可取值：`AX_CCL_DT_INT8`、`AX_CCL_DT_UINT8`、`AX_CCL_DT_INT16`、`AX_CCL_DT_UINT16`、`AX_CCL_DT_INT32`、`AX_CCL_DT_UINT32`、`AX_CCL_DT_INT64`、`AX_CCL_DT_UINT64`、`AX_CCL_DT_FP16`、`AX_CCL_DT_FP32`、`AX_CCL_DT_FP64`、`AX_CCL_DT_BF16`、`AX_CCL_DT_FP8_E4M3`、`AX_CCL_DT_FP8_E5M2`。 |
| op | in | 归约算子。当前只支持 `AX_CCL_OP_SUM`。可取值：`AX_CCL_OP_SUM`、`AX_CCL_OP_PROD`、`AX_CCL_OP_MIN`、`AX_CCL_OP_MAX`、`AX_CCL_OP_AVG`，以及 [axCclRedOpCreatePreMulSum](#axCclRedOpCreatePreMulSum) 创建的自定义算子。 |
| comm | in | 通信域。 |
| stream | in | 接收该操作的 Stream，不能为 NULL。 |

#### 2.2.3. 返回值

- `AXCL_SUCC`：成功入队。
- `AXCL_ERR_CCL_UNSUPPORT`：通信域的 `worldSize` 不在 2 到协议上限之间。
- `AXCL_ERR_CCL_ILLEGAL_PARAM`：`count` 越界；`dtype` 或 `op` 不受支持；`sendbuff` 与 `recvbuff` 部分重叠；`recvbuff` 传 `AX_CCL_IN_PLACE`；当前设备与 `comm` 绑定的设备不一致；Stream 所属设备与 `comm` 所属设备不一致。
- `AXCL_ERR_CCL_NULL_POINTER`：`stream` 为 NULL，或 `sendbuff`、`recvbuff` 为 NULL。
- `AXCL_ERR_CCL_INVALID_COMM`：`comm` 不是有效句柄。
- `AXCL_ERR_CCL_INVALID_STATE`：CCL 模块尚未初始化，或调用线程没有当前 Context。

#### 2.2.4. 说明

- 本接口**异步入队**：返回表示已入队，不表示数据面操作完成。用 [axclrtSynchronizeStream](stream_api.md#axclrtSynchronizeStream) 或 event 等待完成。
- 在 [axCclGroupStart](#axCclGroupStart) / [axCclGroupEnd](#axCclGroupEnd) 之间调用时，本接口只收集描述符，由 [axCclGroupEnd](#axCclGroupEnd) 统一提交。在 Group 之外调用时按通信域隐式成组：调用在本 rank 注册后返回，`worldSize` 个 rank 都到达后由最后一个 rank 的调用执行整个操作。
- 只支持连续 FP32 SUM，允许各 rank 的 `count` 不相等。
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
| sendbuff | in | 源设备缓冲区，`count * worldSize` 个元素。传 `AX_CCL_IN_PLACE` 表示就地交换。 |
| recvbuff | out | 结果设备缓冲区，`count * worldSize` 个元素。 |
| count | in | 本 rank 发往每个其他 rank 的元素个数。 |
| dtype | in | 元素类型。 |
| comm | in | 通信域。 |
| stream | in | 接收该操作的 Stream。 |

#### 2.3.3. 返回值

- `AXCL_ERR_CCL_UNSUPPORT`：本接口当前尚未实现。

#### 2.3.4. 说明

- 本接口当前尚未实现，任何参数组合下都返回 `AXCL_ERR_CCL_UNSUPPORT`。

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

- `AXCL_ERR_CCL_UNSUPPORT`：本接口当前尚未实现。

#### 2.4.4. 说明

- 本接口当前尚未实现，任何参数组合下都返回 `AXCL_ERR_CCL_UNSUPPORT`。

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

- `AXCL_ERR_CCL_UNSUPPORT`：本接口当前尚未实现。

#### 2.5.4. 说明

- 本接口当前尚未实现，任何参数组合下都返回 `AXCL_ERR_CCL_UNSUPPORT`。

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
| sendbuff | in | root 持有数据的设备缓冲区，`count` 个元素。非 root 忽略该参数；传 `AX_CCL_IN_PLACE` 表示每个 rank 都就地使用 `recvbuff`。 |
| recvbuff | out | 接收数据的设备缓冲区，`count` 个元素。 |
| count | in | 元素个数。 |
| dtype | in | 元素类型。 |
| root | in | 数据源的 rank。 |
| comm | in | 通信域。 |
| stream | in | 接收该操作的 Stream。 |

#### 2.6.3. 返回值

- `AXCL_ERR_CCL_UNSUPPORT`：本接口当前尚未实现。

#### 2.6.4. 说明

- 本接口当前尚未实现，任何参数组合下都返回 `AXCL_ERR_CCL_UNSUPPORT`。

<br>

<a id="axCclCommAbort"></a>

### 2.7. axCclCommAbort

立即中止通信域。

#### 2.7.1. 函数

```c
AX_CCL_EXPORT axclError axCclCommAbort(axCclComm comm);
```

#### 2.7.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| comm | in | 通信域。 |

#### 2.7.3. 返回值

- `AXCL_ERR_CCL_UNSUPPORT`：本接口当前尚未实现。

#### 2.7.4. 说明

- 本接口当前尚未实现，任何参数组合下都返回 `AXCL_ERR_CCL_UNSUPPORT`。
- 计划语义：用于故障隔离，未完成的操作可能被丢弃；句柄仍需通过 [axCclCommDestroy](#axCclCommDestroy) 释放。

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

- `AXCL_ERR_CCL_UNSUPPORT`：本接口当前尚未实现。

#### 2.9.4. 说明

- 本接口当前尚未实现，任何参数组合下都返回 `AXCL_ERR_CCL_UNSUPPORT`。

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

- 对于成组执行过的通信域，第一次终结会同步**所有**参与的 application Stream，销毁已完成的执行和域信号，并关闭整个域。这些 Stream、Context 和设备必须保持存活直到该屏障完成。
- 从未参与成组执行的通信域不会同步 application Stream。
- 在一个未提交的 Group 内调用终结会被拒绝。
- 返回启动不完整或完成状态不确定的错误时，**不要**释放缓冲区、销毁 Context、复位设备或拆除 Runtime。
- 终结后必须对每个通信域调用 [axCclCommDestroy](#axCclCommDestroy)。
- 本接口只完成 Host 侧状态转换，不能替代对 Stream 的同步（见 [axCclAllReduce](#axCclAllReduce)）。

#### 2.12.5. 参考

- [axCclCommDestroy](#axCclCommDestroy)
- [axCclFinalize](#axCclFinalize)

<br>

<a id="axCclCommGetAsyncError"></a>

### 2.13. axCclCommGetAsyncError

读取并清除通信域的异步错误状态。

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

- `AXCL_ERR_CCL_UNSUPPORT`：本接口当前尚未实现。

#### 2.13.4. 说明

- 本接口当前尚未实现，任何参数组合下都返回 `AXCL_ERR_CCL_UNSUPPORT`。
- 计划语义：无待处理错误时返回 `AXCL_SUCC` 且 `err` 为 `AXCL_SUCC`；有错误时 `err` 收到错误码，通信域进入失败状态。

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

- 本接口当前是 [axCclCommInitRootInfo](#axCclCommInitRootInfo) 的受支持别名，采用完全相同的参数、root info、Runtime 环境、topology 和错误校验。

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

- `AXCL_SUCC`：成功创建通信域。
- `AXCL_ERR_CCL_UNSUPPORT`：当前处于未结束的 Group 中。
- `AXCL_ERR_CCL_NULL_POINTER`：`comm` 或 `rootInfo` 为 NULL。
- `AXCL_ERR_CCL_ILLEGAL_PARAM`：`deviceId` 为负数、`worldSize` 不是正数、`rank` 越界、当前设备与 `deviceId` 不一致，或调用线程没有当前 Context。
- `AXCL_ERR_CCL_INVALID_STATE`：CCL 模块尚未初始化。
- 其他错误：topology 创建失败时返回底层错误。

#### 2.16.4. 说明

- 本接口会阻塞，直到所有 rank 都到达该调用。
- 调用线程必须先用 [axclrtSetDevice](device_api.md#axclrtSetDevice) 激活 `deviceId`，并持有当前 Context。
- 与 [axCclCommInitAll](#axCclCommInitAll) 不同，本接口建立的域在第一次集合操作时才惰性建环。
- 建链用的 root info 是不含指针的字节块，可通过带外通道（例如 PyTorch 的 TCPStore 或 `env://`）交换。

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

注册设备缓冲区以优化跨 rank 访问。

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

- `AXCL_ERR_CCL_UNSUPPORT`：本接口当前尚未实现。

#### 2.18.4. 说明

- 本接口当前尚未实现，任何参数组合下都返回 `AXCL_ERR_CCL_UNSUPPORT`。
- 计划语义：可选的性能提示，跳过不影响功能正确性。

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
| recvbuff | out | root 上的结果设备缓冲区，`sendcount * worldSize` 个元素；非 root 忽略该参数。 |
| sendcount | in | 本 rank 贡献的元素个数。 |
| dtype | in | 元素类型。 |
| root | in | 收集目标的 rank。 |
| comm | in | 通信域。 |
| stream | in | 接收该操作的 Stream。 |

#### 2.20.3. 返回值

- `AXCL_ERR_CCL_UNSUPPORT`：本接口当前尚未实现。

#### 2.20.4. 说明

- 本接口当前尚未实现，任何参数组合下都返回 `AXCL_ERR_CCL_UNSUPPORT`。

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

- 成功返回**只表示批量提交/入队**，不表示数据面操作已经完成。在复用一个对端可见的缓冲区之前，必须同步所有 rank 的 Stream。
- 开始新一轮之前，本接口会先同步上一轮的所有 Stream、销毁上一轮的执行并复位所有持久信号。参与的 Stream、Context 必须保持存活直到该屏障（或 [axCclCommFinalize](#axCclCommFinalize)）完成。
- 启动不完整或完成状态不确定时，域进入终止状态，其资源必须保持存活以便操作恢复，即使操作随后迟到完成也不能回收。
- 某个 rank 的 CCL Run 失败或被跳过后，会在其 Worker Stream 上留下持久错误，因此更早的 application 同步不会把失败对上层的域屏障隐藏起来。
- 借用的 Stream/Context 句柄必须保持有效；使用已释放的句柄违反 Runtime API 前置条件，本接口不会检测。
- Group 只支持每 rank 一次 AllReduce，且必须是 FP32 SUM、同一 RootInfo 域、每个设备一个显式 Stream。嵌套 Group、其他操作、一个 Group 内多个集合操作均不支持。

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

开始收集每个 rank 的一次 AllReduce 调用。

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

- 本接口只收集描述符；[axCclGroupEnd](#axCclGroupEnd) 才准备并绑定所有 rank，再提交全部执行。
- 同一线程必须在 `GroupStart` 与 `GroupEnd` 之间收齐每个 rank 的一次 [axCclAllReduce](#axCclAllReduce) 调用。单线程多设备也可以不使用 Group，直接按 rank 顺序各调一次即可。
- 同一 Host 进程内只允许一个集合操作在飞。切换域时会先排空上一个域再启动下一个域，其信号在终结前仍归该域所有。
- 不提供多进程 rendezvous。
- 后续轮次和终结都必须使用同一 Host 线程。

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

- `AXCL_ERR_CCL_UNSUPPORT`：本接口当前尚未实现。

#### 2.27.4. 说明

- 本接口当前尚未实现，任何参数组合下都返回 `AXCL_ERR_CCL_UNSUPPORT`。

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

- `AXCL_ERR_CCL_UNSUPPORT`：本接口当前尚未实现。

#### 2.28.4. 说明

- 本接口当前尚未实现，任何参数组合下都返回 `AXCL_ERR_CCL_UNSUPPORT`。
- 计划语义：`result = Σ(scalar_i * x_i)`，常用于梯度缩放。
- 计划语义：每次成功创建都必须与 [axCclRedOpDestroy](#axCclRedOpDestroy) 配对，且要在销毁 `comm` 之前完成。

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

- `AXCL_ERR_CCL_UNSUPPORT`：本接口当前尚未实现。

#### 2.29.4. 说明

- 本接口当前尚未实现，任何参数组合下都返回 `AXCL_ERR_CCL_UNSUPPORT`。

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
| recvbuff | out | root 上的结果设备缓冲区，`count` 个元素；非 root 忽略该参数。 |
| count | in | 元素个数。 |
| dtype | in | 元素类型。 |
| op | in | 归约算子。 |
| root | in | 结果所在的 rank。 |
| comm | in | 通信域。 |
| stream | in | 接收该操作的 Stream。 |

#### 2.30.3. 返回值

- `AXCL_ERR_CCL_UNSUPPORT`：本接口当前尚未实现。

#### 2.30.4. 说明

- 本接口当前尚未实现，任何参数组合下都返回 `AXCL_ERR_CCL_UNSUPPORT`。
- 计划语义：root 上可以就地归约，即传 `sendbuff == recvbuff`；非 root 只读 `sendbuff`。

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
| sendbuff | in | 源设备缓冲区，`recvcount * worldSize` 个元素。传 `AX_CCL_IN_PLACE` 表示就地归约。 |
| recvbuff | out | 结果设备缓冲区，`recvcount` 个元素，即本 rank 的分片。 |
| recvcount | in | 本 rank 分片的元素个数。 |
| dtype | in | 元素类型。 |
| op | in | 归约算子。 |
| comm | in | 通信域。 |
| stream | in | 接收该操作的 Stream。 |

#### 2.31.3. 返回值

- `AXCL_ERR_CCL_UNSUPPORT`：本接口当前尚未实现。

#### 2.31.4. 说明

- 本接口当前尚未实现，任何参数组合下都返回 `AXCL_ERR_CCL_UNSUPPORT`。

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
| sendbuff | in | root 上持有全部数据的设备缓冲区，`recvcount * worldSize` 个元素；非 root 忽略该参数。 |
| recvbuff | out | 本 rank 分片的设备缓冲区，`recvcount` 个元素。 |
| recvcount | in | 本 rank 分片的元素个数。 |
| dtype | in | 元素类型。 |
| root | in | 数据源的 rank。 |
| comm | in | 通信域。 |
| stream | in | 接收该操作的 Stream。 |

#### 2.32.3. 返回值

- `AXCL_ERR_CCL_UNSUPPORT`：本接口当前尚未实现。

#### 2.32.4. 说明

- 本接口当前尚未实现，任何参数组合下都返回 `AXCL_ERR_CCL_UNSUPPORT`。

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

- `AXCL_ERR_CCL_UNSUPPORT`：本接口当前尚未实现。

#### 2.33.4. 说明

- 本接口当前尚未实现，任何参数组合下都返回 `AXCL_ERR_CCL_UNSUPPORT`。

#### 2.33.5. 参考

- [axCclRecv](#axCclRecv)
