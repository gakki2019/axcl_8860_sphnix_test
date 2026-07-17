# 事件

## 1. 目录

- [axclrtCreateEvent](#axclrtCreateEvent)
- [axclrtCreateEventWithFlags](#axclrtCreateEventWithFlags)
- [axclrtDestroyEvent](#axclrtDestroyEvent)
- [axclrtEventElapsedTime](#axclrtEventElapsedTime)
- [axclrtRecordEvent](#axclrtRecordEvent)
- [axclrtStreamWaitEvent](#axclrtStreamWaitEvent)
- [axclrtStreamWaitEventWithTimeout](#axclrtStreamWaitEventWithTimeout)
- [axclrtSynchronizeEvent](#axclrtSynchronizeEvent)
- [axclrtSynchronizeEventWithTimeout](#axclrtSynchronizeEventWithTimeout)

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
| event | out | 成功时返回创建的事件句柄。 |

#### 2.1.3. 返回值

- `AXCL_SUCC`：成功创建事件。
- 其他错误：失败。

#### 2.1.4. 说明

- 事件可用于统计两个记录点之间的耗时，以及同步不同 Stream 中的任务。参阅 [事件语义](../arch/concept.md#EVENT)。
- 本接口等效于使用 [AXCL_EVENT_DEFAULT](reference/macro.md#AXCL_EVENT_DEFAULT) 调用 [axclrtCreateEventWithFlags](#axclrtCreateEventWithFlags)，创建的事件支持计时。
- 调用线程必须已有当前 Context，且该 Context 所属设备必须处于活动状态。事件属于该设备，不属于特定的 Context 或 Stream。
- 不再需要事件时，调用 [axclrtDestroyEvent](#axclrtDestroyEvent) 将其销毁，并在释放所属设备前完成销毁。

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
| event | out | 成功时返回创建的事件句柄。 |
| flags | in | [AXCL_EVENT_DEFAULT](reference/macro.md#AXCL_EVENT_DEFAULT) 或 [AXCL_EVENT_DISABLE_TIMING](reference/macro.md#AXCL_EVENT_DISABLE_TIMING)。 |

#### 2.2.3. 返回值

- `AXCL_SUCC`：成功创建事件。
- 其他错误：失败。

#### 2.2.4. 说明

- [AXCL_EVENT_DEFAULT](reference/macro.md#AXCL_EVENT_DEFAULT) 会为 [axclrtEventElapsedTime](#axclrtEventElapsedTime) 记录时间戳。
- [AXCL_EVENT_DISABLE_TIMING](reference/macro.md#AXCL_EVENT_DISABLE_TIMING) 不记录时间戳，使用该标志创建的事件不能用于计算耗时。
- 调用线程必须已有当前 Context，且该 Context 所属设备必须处于活动状态。事件属于该设备。
- 不再需要事件时，调用 [axclrtDestroyEvent](#axclrtDestroyEvent) 将其销毁，并在释放所属设备前完成销毁。

#### 2.2.5. 参考

- [axclrtCreateEvent](#axclrtCreateEvent)
- [axclrtDestroyEvent](#axclrtDestroyEvent)
- [axclrtEventElapsedTime](#axclrtEventElapsedTime)

<br>

<a id="axclrtDestroyEvent"></a>

### 2.3. axclrtDestroyEvent

销毁事件。

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
- 销毁前必须确保没有 Stream 的记录或等待操作仍在使用该事件。销毁事件会唤醒正在等待该事件的 Host 同步请求，并使该请求返回失败。
- 本接口成功后，`event` 句柄失效，不能再次使用。

<br>

<a id="axclrtEventElapsedTime"></a>

### 2.4. axclrtEventElapsedTime

计算两个事件最近一次已完成记录点之间的设备时间差。

#### 2.4.1. 函数

```c
AXCL_EXPORT axclError axclrtEventElapsedTime(float *ms, axclrtEvent startEvent, axclrtEvent endEvent);
```

#### 2.4.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| ms | out | 成功时返回设备时间差，单位为毫秒。 |
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
  /* 提交需要统计耗时的任务。 */
  axclrtRecordEvent(endEvent, stream);
  axclrtSynchronizeEvent(endEvent);
  axclrtEventElapsedTime(&ms, startEvent, endEvent);
  ```
- 两个事件都必须启用计时功能并属于同一设备，且最近一次记录点均已完成并位于同一 Stream。
- 本接口不会等待记录点完成；如果任一事件的最近一次记录点尚未完成，本接口返回失败。
- 返回值为 `endEvent` 最近一次记录时间戳减去 `startEvent` 最近一次记录时间戳，单位为毫秒。

#### 2.4.5. 参考

- [axclrtCreateEvent](#axclrtCreateEvent)
- [axclrtCreateEventWithFlags](#axclrtCreateEventWithFlags)
- [axclrtRecordEvent](#axclrtRecordEvent)
- [axclrtSynchronizeEvent](#axclrtSynchronizeEvent)

<br>

<a id="axclrtRecordEvent"></a>

### 2.5. axclrtRecordEvent

将事件记录点异步提交到指定的 Stream。

#### 2.5.1. 函数

```c
AXCL_EXPORT axclError axclrtRecordEvent(axclrtEvent event, axclrtStream stream);
```

#### 2.5.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| event | in | 要记录的事件。 |
| stream | in | 接收记录点的 Stream。 |

#### 2.5.3. 返回值

- `AXCL_SUCC`：成功提交记录点。
- 其他错误：失败。

#### 2.5.4. 说明

- `event` 和 `stream` 必须属于同一设备。
- 本接口可与 [axclrtStreamWaitEvent](#axclrtStreamWaitEvent) 配合，实现不同 Stream 之间的任务同步。
- 本接口成功返回仅表示记录点已提交，不表示事件已经触发。Stream 完成此前提交的任务并执行到记录点时，事件才会触发。
- 再次调用本接口会重置先前的触发状态。
- 如果启用了计时功能，事件会保存最近一次已完成记录点的时间戳。

#### 2.5.5. 参考

- [事件语义](../arch/concept.md#EVENT)
- [axclrtStreamWaitEvent](#axclrtStreamWaitEvent)
- [axclrtSynchronizeEvent](#axclrtSynchronizeEvent)
- [axclrtEventElapsedTime](#axclrtEventElapsedTime)

<br>

<a id="axclrtStreamWaitEvent"></a>

### 2.6. axclrtStreamWaitEvent

异步向指定 Stream 提交事件等待点，使该 Stream 等待事件触发后再继续执行。

#### 2.6.1. 函数

```c
AXCL_EXPORT axclError axclrtStreamWaitEvent(axclrtStream stream, axclrtEvent event);
```

#### 2.6.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| stream | in | 等待事件的 Stream。 |
| event | in | 要等待的事件。 |

#### 2.6.3. 返回值

- `AXCL_SUCC`：成功提交等待点。
- 其他错误：失败。

#### 2.6.4. 说明

- `stream` 和 `event` 必须属于同一设备。
- 本接口成功返回仅表示等待点已提交，不会阻塞 Host 线程。指定 Stream 执行到等待点后，后续任务必须等到事件触发后才能继续执行。
- 支持多个 Stream 等待同一个事件，参阅 [事件语义](../arch/concept.md#EVENT)。
- 与本接口不同，[axclrtSynchronizeEvent](#axclrtSynchronizeEvent) 会阻塞 Host 当前线程，直至事件触发。

#### 2.6.5. 参考

- [axclrtStreamWaitEventWithTimeout](#axclrtStreamWaitEventWithTimeout)
- [axclrtRecordEvent](#axclrtRecordEvent)
- [axclrtSynchronizeEvent](#axclrtSynchronizeEvent)

<br>

<a id="axclrtStreamWaitEventWithTimeout"></a>

### 2.7. axclrtStreamWaitEventWithTimeout

异步向指定 Stream 提交带超时限制的事件等待点。

#### 2.7.1. 函数

```c
AXCL_EXPORT axclError axclrtStreamWaitEventWithTimeout(axclrtStream stream, axclrtEvent event, int32_t timeout);
```

#### 2.7.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| stream | in | 等待事件的 Stream。 |
| event | in | 要等待的事件。 |
| timeout | in | 超时时间，单位为毫秒。`-1` 表示无限期等待。 |

#### 2.7.3. 返回值

- `AXCL_SUCC`：成功提交等待点。
- 其他错误：失败。

#### 2.7.4. 说明

- `stream` 和 `event` 必须属于同一设备。
- 本接口成功返回仅表示等待点已提交，不会阻塞 Host 线程。
- 指定 Stream 执行到等待点后开始等待事件，等待期间不会执行后续任务。超时时间从此时开始计算；等待超时会记录为 Stream 的异步执行错误，后续同步该 Stream 时会返回该错误。
- 支持多个 Stream 等待同一个事件，参阅 [事件语义](../arch/concept.md#EVENT)。

#### 2.7.5. 参考

- [axclrtStreamWaitEvent](#axclrtStreamWaitEvent)

<br>

<a id="axclrtSynchronizeEvent"></a>

### 2.8. axclrtSynchronizeEvent

阻塞 Host 当前线程，直至事件触发。

#### 2.8.1. 函数

```c
AXCL_EXPORT axclError axclrtSynchronizeEvent(axclrtEvent event);
```

#### 2.8.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| event | in | 要等待的事件。 |

#### 2.8.3. 返回值

- `AXCL_SUCC`：事件已触发。
- 其他错误：失败。

#### 2.8.4. 说明

- 同一事件同时只允许一个 Host 同步请求等待。
- 与本接口不同，[axclrtStreamWaitEvent](#axclrtStreamWaitEvent) 不会阻塞 Host 线程，而是在指定 Stream 中插入等待点。

#### 2.8.5. 参考

- [axclrtStreamWaitEvent](#axclrtStreamWaitEvent)
- [axclrtSynchronizeEventWithTimeout](#axclrtSynchronizeEventWithTimeout)

<br>

<a id="axclrtSynchronizeEventWithTimeout"></a>

### 2.9. axclrtSynchronizeEventWithTimeout

阻塞 Host 当前线程，直至事件触发或等待超时。

#### 2.9.1. 函数

```c
AXCL_EXPORT axclError axclrtSynchronizeEventWithTimeout(axclrtEvent event, int32_t timeout);
```

#### 2.9.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| event | in | 要等待的事件。 |
| timeout | in | 超时时间，单位为毫秒。`-1` 表示无限期等待。 |

#### 2.9.3. 返回值

- `AXCL_SUCC`：事件在超时时间内触发。
- 其他错误：失败。

#### 2.9.4. 说明

- 等待超时不会修改或销毁事件。
- 同一事件同时只允许一个 Host 同步请求等待。
- 与本接口不同，[axclrtStreamWaitEvent](#axclrtStreamWaitEvent) 不会阻塞 Host 线程，而是在指定 Stream 中插入等待点。

#### 2.9.5. 参考

- [axclrtSynchronizeEvent](#axclrtSynchronizeEvent)
- [axclrtStreamWaitEventWithTimeout](#axclrtStreamWaitEventWithTimeout)
