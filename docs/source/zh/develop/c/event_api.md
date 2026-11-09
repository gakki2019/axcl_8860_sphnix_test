# 事件

## 1. 目录

- [axclrtCreateEvent](#axclrtCreateEvent)：在当前 Context 所属的设备上创建启用计时功能的事件。
- [axclrtCreateEventWithFlags](#axclrtCreateEventWithFlags)：在当前 Context 所属的设备上，根据指定的计时标志创建事件。
- [axclrtDestroyEvent](#axclrtDestroyEvent)：销毁由 [axclrtCreateEvent](#axclrtCreateEvent) 或 [axclrtCreateEventWithFlags](#axclrtCreateEventWithFlags) 创建的事件。
- [axclrtEventElapsedTime](#axclrtEventElapsedTime)：计算两个事件最近一次记录之间的设备时间差。
- [axclrtEventQuery](#axclrtEventQuery)：查询事件所捕获任务的完成状态，不阻塞 Host 线程。
- [axclrtRecordEvent](#axclrtRecordEvent)：将事件记录点异步提交到指定的 Stream。
- [axclrtStreamWaitEvent](#axclrtStreamWaitEvent)：异步向指定 Stream 提交事件等待点，使该 Stream 等待事件触发后再继续执行。
- [axclrtStreamWaitEventWithTimeout](#axclrtStreamWaitEventWithTimeout)：异步向指定 Stream 提交带超时限制的事件等待点。
- [axclrtSynchronizeEvent](#axclrtSynchronizeEvent)：阻塞 Host 当前线程，直至事件触发。
- [axclrtSynchronizeEventWithTimeout](#axclrtSynchronizeEventWithTimeout)：阻塞 Host 当前线程，直至事件触发或等待超时。

<br>

## 2. API

<a id="axclrtCreateEvent"></a>

### 2.1. axclrtCreateEvent

在当前 Context 所属的设备上创建启用计时功能的事件。

#### 2.1.1. 函数

```c
AXCL_EXPORT axclError axclrtCreateEvent(axclrtEvent *event);
```

#### 2.1.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| event | out | 成功时返回创建的事件句柄。不能为 NULL。 |

#### 2.1.3. 返回值

- `AXCL_SUCC`：成功创建事件。
- 其他错误：失败。

#### 2.1.4. 说明

- 事件可用于统计两个记录点之间的耗时，以及同步不同 Stream 中的任务。参阅 [事件语义](../arch/concept.md#EVENT)。
- 本接口等效于使用 [AXCL_EVENT_DEFAULT](reference/macro.md#AXCL_EVENT_DEFAULT) 调用 [axclrtCreateEventWithFlags](#axclrtCreateEventWithFlags)，创建的事件支持计时。
- 调用线程必须已有当前 Context，且该 Context 所属设备必须处于活动状态。事件属于该设备，不属于特定的 Context 或 Stream。
- 不再需要事件时，调用 [axclrtDestroyEvent](#axclrtDestroyEvent) 将其销毁，并在释放所属设备前完成销毁。
- 一个进程在同一设备上最多同时持有 1024 个未销毁的事件，该设备所有 Context 合并计数。超出时本函数失败；销毁事件会立即释放名额。

#### 2.1.5. 参考

- [事件语义](../arch/concept.md#EVENT)
- [axclrtCreateEventWithFlags](#axclrtCreateEventWithFlags)
- [axclrtDestroyEvent](#axclrtDestroyEvent)

<br>

<a id="axclrtCreateEventWithFlags"></a>

### 2.2. axclrtCreateEventWithFlags

在当前 Context 所属的设备上，根据指定的计时标志创建事件。

#### 2.2.1. 函数

```c
AXCL_EXPORT axclError axclrtCreateEventWithFlags(axclrtEvent *event, uint32_t flags);
```

#### 2.2.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| event | out | 成功时返回创建的事件句柄。不能为 NULL。 |
| flags | in | 必须为 [AXCL_EVENT_DEFAULT](reference/macro.md#AXCL_EVENT_DEFAULT) 或 [AXCL_EVENT_DISABLE_TIMING](reference/macro.md#AXCL_EVENT_DISABLE_TIMING)。 |

#### 2.2.3. 返回值

- `AXCL_SUCC`：成功创建事件。
- 其他错误：失败。

#### 2.2.4. 说明

- [AXCL_EVENT_DEFAULT](reference/macro.md#AXCL_EVENT_DEFAULT) 会为 [axclrtEventElapsedTime](#axclrtEventElapsedTime) 记录时间戳。
- [AXCL_EVENT_DISABLE_TIMING](reference/macro.md#AXCL_EVENT_DISABLE_TIMING) 不记录时间戳，使用该标志创建的事件不能用于计算耗时。
- 调用线程必须已有当前 Context，且该 Context 所属设备必须处于活动状态。事件属于该设备。
- 不再需要事件时，调用 [axclrtDestroyEvent](#axclrtDestroyEvent) 将其销毁，并在释放所属设备前完成销毁。
- 一个进程在同一设备上最多同时持有 1024 个未销毁的事件，该设备所有 Context 合并计数。超出时本函数失败；销毁事件会立即释放名额。

#### 2.2.5. 参考

- [axclrtCreateEvent](#axclrtCreateEvent)
- [axclrtDestroyEvent](#axclrtDestroyEvent)
- [axclrtEventElapsedTime](#axclrtEventElapsedTime)

<br>

<a id="axclrtDestroyEvent"></a>

### 2.3. axclrtDestroyEvent

销毁由 [axclrtCreateEvent](#axclrtCreateEvent) 或 [axclrtCreateEventWithFlags](#axclrtCreateEventWithFlags) 创建的事件。

#### 2.3.1. 函数

```c
AXCL_EXPORT axclError axclrtDestroyEvent(axclrtEvent event);
```

#### 2.3.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| event | in | 要销毁的事件句柄。 |

#### 2.3.3. 返回值

- `AXCL_SUCC`：成功销毁事件。
- 其他错误：失败。

#### 2.3.4. 说明

- 销毁由 [axclrtCreateEvent](#axclrtCreateEvent) 或 [axclrtCreateEventWithFlags](#axclrtCreateEventWithFlags) 创建的事件。
- 本接口不等待任务完成，可以在事件的记录点尚未完成时调用：已经提交的记录点和等待点照常完成，已经在等待该事件的 Host 同步请求在该记录结束时返回。相关资源在它们完成后释放。
- 与同一事件上的其他接口并发调用属于未定义行为。
- 本接口成功后，`event` 句柄失效。在设备被释放之前，之后用它调用其他接口会失败；唯一的例外是 [axclrtRecordEvent](#axclrtRecordEvent)：它返回成功，记录点由 Device 拒绝，后果见该接口说明。[axclrtResetDevice](device_api.md#axclrtResetDevice) 释放设备之后，该设备此前的所有事件句柄都失效，不能再使用。

<br>

<a id="axclrtEventElapsedTime"></a>

### 2.4. axclrtEventElapsedTime

计算两个事件最近一次记录之间的设备时间差。

#### 2.4.1. 函数

```c
AXCL_EXPORT axclError axclrtEventElapsedTime(float *ms, axclrtEvent startEvent, axclrtEvent endEvent);
```

#### 2.4.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| ms | out | 成功时返回设备时间差，单位为毫秒。不能为 NULL。 |
| startEvent | in | 标记起始位置的事件。 |
| endEvent | in | 标记结束位置的事件。 |

#### 2.4.3. 返回值

- `AXCL_SUCC`：成功返回耗时。
- 其他错误：失败。

#### 2.4.4. 说明

- 本接口需与事件记录及同步接口配合使用，例如：

  ```c
     axclrtCreateEvent(&startEvent);
     axclrtCreateEvent(&endEvent);
     axclrtRecordEvent(startEvent, stream);
     // 提交需要统计耗时的任务。
     axclrtRecordEvent(endEvent, stream);
     axclrtSynchronizeEvent(endEvent);
     axclrtEventElapsedTime(&ms, startEvent, endEvent);
  ```
- 两个事件都必须启用计时功能并属于同一设备，否则本函数失败。两者最近一次记录点都必须已经执行，可以位于该设备的不同 Stream。
- 任一事件从未记录，或其最近一次记录未执行就已结束时，本函数失败。
- 本接口不会等待记录点完成；如果任一事件的最近一次记录点尚未完成，本接口返回 [AXCL_ERR_RT_EVENT_NOT_READY](reference/error.md#AXCL_ERR_RT_EVENT_NOT_READY)；此时应先同步事件（例如调用 [axclrtSynchronizeEvent](#axclrtSynchronizeEvent)），再重新调用本接口。
- 返回值为 `endEvent` 最近一次记录时间戳减去 `startEvent` 最近一次记录时间戳，单位为毫秒；`endEvent` 先完成时为负值。

#### 2.4.5. 参考

- [axclrtCreateEvent](#axclrtCreateEvent)
- [axclrtCreateEventWithFlags](#axclrtCreateEventWithFlags)
- [axclrtRecordEvent](#axclrtRecordEvent)
- [axclrtSynchronizeEvent](#axclrtSynchronizeEvent)

<br>

<a id="axclrtEventQuery"></a>

### 2.5. axclrtEventQuery

查询事件所捕获任务的完成状态，不阻塞 Host 线程。

#### 2.5.1. 函数

```c
AXCL_EXPORT axclError axclrtEventQuery(axclrtEvent event, axclrtEventStatus *status);
```

#### 2.5.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| event | in | 要查询的事件句柄。不能为 NULL。 |
| status | out | 成功时返回事件的完成状态。不能为 NULL。 |

#### 2.5.3. 返回值

- `AXCL_SUCC`：成功查询状态。
- 其他错误：失败。

#### 2.5.4. 说明

- 本接口为非阻塞查询接口，会立即获取 Device 执行状态的快照。
- 查询的状态针对事件的最近一次记录。同一线程在本次调用前提交的记录，一定是被查询的那一次记录。
- 事件尚未记录，或其最近一次记录已经结束时，查询结果为 [AXCL_EVENT_STATUS_COMPLETE](reference/enum.md#AXCL_EVENT_STATUS_COMPLETE)。未执行就结束的记录同样视为已结束，其失败由记录所在的 Stream 报告。

#### 2.5.5. 参考

- [axclrtRecordEvent](#axclrtRecordEvent)
- [axclrtSynchronizeEvent](#axclrtSynchronizeEvent)

<br>

<a id="axclrtRecordEvent"></a>

### 2.6. axclrtRecordEvent

将事件记录点异步提交到指定的 Stream。

#### 2.6.1. 函数

```c
AXCL_EXPORT axclError axclrtRecordEvent(axclrtEvent event, axclrtStream stream);
```

#### 2.6.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| event | in | 要记录的事件。 |
| stream | in | 接收记录点的 Stream。 |

#### 2.6.3. 返回值

- `AXCL_SUCC`：成功提交记录点。
- 其他错误：失败。

#### 2.6.4. 说明

- `event` 和 `stream` 必须属于同一设备，否则本函数失败。
- 本接口可与 [axclrtStreamWaitEvent](#axclrtStreamWaitEvent) 配合，实现不同 Stream 之间的任务同步。
- 记录点捕获此前已提交到 `stream` 的任务，并成为事件的最近一次记录。此后调用的 [axclrtEventQuery](#axclrtEventQuery)、[axclrtSynchronizeEvent](#axclrtSynchronizeEvent) 以及此后提交的等待点，都针对这次记录。
- 再次记录会替换事件的最近一次记录。已经提交的等待点和 Host 同步请求，仍针对它们提交时的那一次记录。
- 本接口成功返回仅表示记录点已提交，不表示记录点已经完成。Stream 执行到记录点时，记录点才完成。
- 成功返回仅表示请求已发送到 Device，不表示 Device 已接受该记录点。Device 侧拒绝记录点（例如 Stream 任务队列已满）时，这次记录仍成为最近一次记录，并以"未执行"结束，等待它的一方会被放行。错误由该 Stream 的下一次 [axclrtSynchronizeStream](stream_api.md#axclrtSynchronizeStream) 或 [axclrtSynchronizeStreamWithTimeout](stream_api.md#axclrtSynchronizeStreamWithTimeout) 返回。与其他 Stream 异步错误相同，在该同步返回此错误之前，Stream 中尚未开始执行的任务都会被跳过。事件已被销毁时，Device 同样会拒绝记录点。
- 记录点不携带 Stream 的错误，错误通过同步 Stream 获取。
- 如果启用了计时功能，事件会保存最近一次记录点完成时的时间戳。

#### 2.6.5. 参考

- [事件语义](../arch/concept.md#EVENT)
- [axclrtStreamWaitEvent](#axclrtStreamWaitEvent)
- [axclrtSynchronizeEvent](#axclrtSynchronizeEvent)
- [axclrtEventElapsedTime](#axclrtEventElapsedTime)

<br>

<a id="axclrtStreamWaitEvent"></a>

### 2.7. axclrtStreamWaitEvent

异步向指定 Stream 提交事件等待点，使该 Stream 等待事件触发后再继续执行。

#### 2.7.1. 函数

```c
AXCL_EXPORT axclError axclrtStreamWaitEvent(axclrtStream stream, axclrtEvent event);
```

#### 2.7.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| stream | in | 等待事件的 Stream。 |
| event | in | 要等待的事件。 |

#### 2.7.3. 返回值

- `AXCL_SUCC`：成功提交等待点。
- 其他错误：失败。

#### 2.7.4. 说明

- `stream` 和 `event` 必须属于同一设备，否则本函数失败。
- 等待点针对提交时事件的最近一次记录，之后再次记录事件不会改变它。
- 事件从未记录或最近一次记录已经结束时，不插入等待点。尚未结束的记录即使就在 `stream` 上，也会被等待。
- 本接口成功返回仅表示等待点已提交，不会阻塞 Host 线程。指定 Stream 执行到等待点后，后续任务必须等到该记录结束后才能继续执行。
- 记录未执行就结束（被拒绝或所在 Stream 被销毁）时，同样放行等待点；该失败由记录所在的 Stream 报告，而不是 `stream`。
- 支持多个 Stream 等待同一个事件，参阅 [事件语义](../arch/concept.md#EVENT)。
- 与本接口不同，[axclrtSynchronizeEvent](#axclrtSynchronizeEvent) 会阻塞 Host 当前线程，直至事件触发。

#### 2.7.5. 参考

- [axclrtStreamWaitEventWithTimeout](#axclrtStreamWaitEventWithTimeout)
- [axclrtRecordEvent](#axclrtRecordEvent)
- [axclrtSynchronizeEvent](#axclrtSynchronizeEvent)

<br>

<a id="axclrtStreamWaitEventWithTimeout"></a>

### 2.8. axclrtStreamWaitEventWithTimeout

异步向指定 Stream 提交带超时限制的事件等待点。

#### 2.8.1. 函数

```c
AXCL_EXPORT axclError axclrtStreamWaitEventWithTimeout(axclrtStream stream, axclrtEvent event, int32_t timeout);
```

#### 2.8.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| stream | in | 等待事件的 Stream。 |
| event | in | 要等待的事件。 |
| timeout | in | 超时时间，单位为毫秒。取值小于或等于 0（例如 `-1`）时表示无限期等待。 |

#### 2.8.3. 返回值

- `AXCL_SUCC`：成功提交等待点。
- 其他错误：失败。

#### 2.8.4. 说明

- `stream` 和 `event` 必须属于同一设备，否则本函数失败。
- 等待点针对提交时事件的最近一次记录，与 [axclrtStreamWaitEvent](#axclrtStreamWaitEvent) 相同。
- 本接口成功返回仅表示等待点已提交，不会阻塞 Host 线程。
- 指定 Stream 执行到等待点后开始等待事件，等待期间不会执行后续任务。超时时间从此时开始计算；等待超时会记录为 Stream 的异步执行错误，后续同步该 Stream 时会返回该错误。
- 支持多个 Stream 等待同一个事件，参阅 [事件语义](../arch/concept.md#EVENT)。

#### 2.8.5. 参考

- [axclrtStreamWaitEvent](#axclrtStreamWaitEvent)

<br>

<a id="axclrtSynchronizeEvent"></a>

### 2.9. axclrtSynchronizeEvent

阻塞 Host 当前线程，直至事件触发。

#### 2.9.1. 函数

```c
AXCL_EXPORT axclError axclrtSynchronizeEvent(axclrtEvent event);
```

#### 2.9.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| event | in | 要等待的事件。 |

#### 2.9.3. 返回值

- `AXCL_SUCC`：事件已触发。
- 其他错误：失败。

#### 2.9.4. 说明

- 等待调用时事件的最近一次记录。事件从未记录或该记录已经结束时立即返回。
- 允许多个 Host 线程同时同步同一事件。
- 与本接口不同，[axclrtStreamWaitEvent](#axclrtStreamWaitEvent) 不会阻塞 Host 线程，而是在指定 Stream 中插入等待点。

#### 2.9.5. 参考

- [axclrtStreamWaitEvent](#axclrtStreamWaitEvent)
- [axclrtSynchronizeEventWithTimeout](#axclrtSynchronizeEventWithTimeout)

<br>

<a id="axclrtSynchronizeEventWithTimeout"></a>

### 2.10. axclrtSynchronizeEventWithTimeout

阻塞 Host 当前线程，直至事件触发或等待超时。

#### 2.10.1. 函数

```c
AXCL_EXPORT axclError axclrtSynchronizeEventWithTimeout(axclrtEvent event, int32_t timeout);
```

#### 2.10.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| event | in | 要等待的事件。 |
| timeout | in | 超时时间，单位为毫秒。负数（如 `-1`）表示无限期等待。 |

#### 2.10.3. 返回值

- `AXCL_SUCC`：事件在超时时间内触发。
- 其他错误：失败。

#### 2.10.4. 说明

- 等待调用时事件的最近一次记录，与 [axclrtSynchronizeEvent](#axclrtSynchronizeEvent) 相同。
- 超时时间从调用开始计算，包含把请求发送到 Device 的时间。超时时间为 0 时只查询一次状态。
- 最近一次记录在超时时间内没有结束时，本函数失败。
- 等待超时不会修改或销毁事件；调用者可以再次调用本函数继续等待。
- 允许多个 Host 线程同时同步同一事件。
- 与本接口不同，[axclrtStreamWaitEvent](#axclrtStreamWaitEvent) 不会阻塞 Host 线程，而是在指定 Stream 中插入等待点。

#### 2.10.5. 参考

- [axclrtSynchronizeEvent](#axclrtSynchronizeEvent)
- [axclrtStreamWaitEventWithTimeout](#axclrtStreamWaitEventWithTimeout)
