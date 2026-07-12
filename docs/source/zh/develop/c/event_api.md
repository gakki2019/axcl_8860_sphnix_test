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

创建事件。

#### 2.1.1. 函数

```c
AXCL_EXPORT axclError axclrtCreateEvent(axclrtEvent *event);
```

#### 2.1.2. 参数

| 名称  | 方向 | 说明                 |
| ----- | ---- | -------------------- |
| event | out  | 指向已创建事件的指针 |

#### 2.1.3. 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

<br>

<a id="axclrtCreateEventWithFlags"></a>

### 2.2. axclrtCreateEventWithFlags

按指定 flags 创建事件。

#### 2.2.1. 函数

```c
AXCL_EXPORT axclError axclrtCreateEventWithFlags(axclrtEvent *event, uint32_t flags);
```

#### 2.2.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| event | out | 指向创建出的事件的指针 |
| flags | in | 事件创建标志（AXCL_EVENT_DEFAULT 或 AXCL_EVENT_DISABLE_TIMING） |

#### 2.2.3. 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

<br>

<a id="axclrtDestroyEvent"></a>

### 2.3. axclrtDestroyEvent

销毁事件。

#### 2.3.1. 函数

```c
AXCL_EXPORT axclError axclrtDestroyEvent(axclrtEvent event);
```

#### 2.3.2. 参数

| 名称  | 方向 | 说明                                                            |
| ----- | ---- | --------------------------------------------------------------- |
| event | in   | 由 [axclrtCreateEvent](#axclrtCreateEvent) 创建并要销毁的事件。 |

#### 2.3.3. 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

<br>

<a id="axclrtEventElapsedTime"></a>

### 2.4. axclrtEventElapsedTime

计算两个事件之间的耗时。

#### 2.4.1. 函数

```c
AXCL_EXPORT axclError axclrtEventElapsedTime(float *ms, axclrtEvent startEvent, axclrtEvent endEvent);
```

#### 2.4.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| ms | out | 指向 float 的指针，用于保存毫秒级耗时 |
| startEvent | in | 起始事件（必须已被记录） |
| endEvent | in | 结束事件（必须已被记录且已完成） |

#### 2.4.3. 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

<br>

<a id="axclrtRecordEvent"></a>

### 2.5. axclrtRecordEvent

在流上记录事件。

#### 2.5.1. 函数

```c
AXCL_EXPORT axclError axclrtRecordEvent(axclrtEvent event, axclrtStream stream);
```

#### 2.5.2. 参数

| 名称   | 方向 | 说明                                                                             |
| ------ | ---- | -------------------------------------------------------------------------------- |
| event  | in   | 由 [axclrtCreateEvent](#axclrtCreateEvent) 创建并要记录的事件。                  |
| stream | in   | 由 [axclrtCreateStream](stream_api.md#axclrtCreateStream) 创建并要记录事件的流。 |

#### 2.5.3. 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

<br>

<a id="axclrtStreamWaitEvent"></a>

### 2.6. axclrtStreamWaitEvent

在流上等待事件。

#### 2.6.1. 函数

```c
AXCL_EXPORT axclError axclrtStreamWaitEvent(axclrtStream stream, axclrtEvent event);
```

#### 2.6.2. 参数

| 名称   | 方向 | 说明                                                                           |
| ------ | ---- | ------------------------------------------------------------------------------ |
| stream | in   | 由 [axclrtCreateStream](stream_api.md#axclrtCreateStream) 创建并等待事件的流。 |
| event  | in   | 由 [axclrtCreateEvent](#axclrtCreateEvent) 创建并等待的事件。                  |

#### 2.6.3. 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

<br>

<a id="axclrtStreamWaitEventWithTimeout"></a>

### 2.7. axclrtStreamWaitEventWithTimeout

在流上等待事件并设置超时。

#### 2.7.1. 函数

```c
AXCL_EXPORT axclError axclrtStreamWaitEventWithTimeout(axclrtStream stream, axclrtEvent event, int32_t timeout);
```

#### 2.7.2. 参数

| 名称    | 方向 | 说明                                                                           |
| ------- | ---- | ------------------------------------------------------------------------------ |
| stream  | in   | 由 [axclrtCreateStream](stream_api.md#axclrtCreateStream) 创建并等待事件的流。 |
| event   | in   | 由 [axclrtCreateEvent](#axclrtCreateEvent) 创建并等待的事件。                  |
| timeout | in   | 超时时间，单位为毫秒；-1 表示无超时。                                          |

#### 2.7.3. 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

<br>

<a id="axclrtSynchronizeEvent"></a>

### 2.8. axclrtSynchronizeEvent

阻塞主机，直到事件被触发（记录）。

#### 2.8.1. 函数

```c
AXCL_EXPORT axclError axclrtSynchronizeEvent(axclrtEvent event);
```

#### 2.8.2. 参数

| 名称  | 方向 | 说明                                                          |
| ----- | ---- | ------------------------------------------------------------- |
| event | in   | 由 [axclrtCreateEvent](#axclrtCreateEvent) 创建并等待的事件。 |

#### 2.8.3. 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

<br>

<a id="axclrtSynchronizeEventWithTimeout"></a>

### 2.9. axclrtSynchronizeEventWithTimeout

阻塞主机，直到事件被触发（记录）并达到超时时间。

#### 2.9.1. 函数

```c
AXCL_EXPORT axclError axclrtSynchronizeEventWithTimeout(axclrtEvent event, int32_t timeout);
```

#### 2.9.2. 参数

| 名称    | 方向 | 说明                                                          |
| ------- | ---- | ------------------------------------------------------------- |
| event   | in   | 由 [axclrtCreateEvent](#axclrtCreateEvent) 创建并等待的事件。 |
| timeout | in   | 超时时间，单位为毫秒；-1 表示无超时。                         |

#### 2.9.3. 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

