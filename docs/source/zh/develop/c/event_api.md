# 事件 API

## 目录

- [axclrtCreateEvent](#axclrtCreateEvent)
- [axclrtDestroyEvent](#axclrtDestroyEvent)
- [axclrtRecordEvent](#axclrtRecordEvent)
- [axclrtStreamWaitEvent](#axclrtStreamWaitEvent)
- [axclrtStreamWaitEventWithTimeout](#axclrtStreamWaitEventWithTimeout)
- [axclrtSynchronizeEvent](#axclrtSynchronizeEvent)
- [axclrtSynchronizeEventWithTimeout](#axclrtSynchronizeEventWithTimeout)

<br>

## API

<a id="axclrtCreateEvent"></a>

### axclrtCreateEvent

创建事件。

#### 函数

```c
AXCL_EXPORT axclError axclrtCreateEvent(axclrtEvent *event);
```

#### 参数

| 名称  | 方向 | 说明                 |
| ----- | ---- | -------------------- |
| event | out  | 指向已创建事件的指针 |

#### 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

<br>

<a id="axclrtDestroyEvent"></a>

### axclrtDestroyEvent

销毁事件。

#### 函数

```c
AXCL_EXPORT axclError axclrtDestroyEvent(axclrtEvent event);
```

#### 参数

| 名称  | 方向 | 说明                                                            |
| ----- | ---- | --------------------------------------------------------------- |
| event | in   | 由 [axclrtCreateEvent](#axclrtCreateEvent) 创建并要销毁的事件。 |

#### 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

<br>

<a id="axclrtRecordEvent"></a>

### axclrtRecordEvent

在流上记录事件。

#### 函数

```c
AXCL_EXPORT axclError axclrtRecordEvent(axclrtEvent event, axclrtStream stream);
```

#### 参数

| 名称   | 方向 | 说明                                                                             |
| ------ | ---- | -------------------------------------------------------------------------------- |
| event  | in   | 由 [axclrtCreateEvent](#axclrtCreateEvent) 创建并要记录的事件。                  |
| stream | in   | 由 [axclrtCreateStream](stream_api.md#axclrtCreateStream) 创建并要记录事件的流。 |

#### 返回值

不适用

<br>

<a id="axclrtStreamWaitEvent"></a>

### axclrtStreamWaitEvent

在流上等待事件。

#### 函数

```c
AXCL_EXPORT axclError axclrtStreamWaitEvent(axclrtStream stream, axclrtEvent event);
```

#### 参数

| 名称   | 方向 | 说明                                                                           |
| ------ | ---- | ------------------------------------------------------------------------------ |
| stream | in   | 由 [axclrtCreateStream](stream_api.md#axclrtCreateStream) 创建并等待事件的流。 |
| event  | in   | 由 [axclrtCreateEvent](#axclrtCreateEvent) 创建并等待的事件。                  |

#### 返回值

不适用

<br>

<a id="axclrtStreamWaitEventWithTimeout"></a>

### axclrtStreamWaitEventWithTimeout

在流上等待事件并设置超时。

#### 函数

```c
AXCL_EXPORT axclError axclrtStreamWaitEventWithTimeout(axclrtStream stream, axclrtEvent event, int32_t timeout);
```

#### 参数

| 名称    | 方向 | 说明                                                                           |
| ------- | ---- | ------------------------------------------------------------------------------ |
| stream  | in   | 由 [axclrtCreateStream](stream_api.md#axclrtCreateStream) 创建并等待事件的流。 |
| event   | in   | 由 [axclrtCreateEvent](#axclrtCreateEvent) 创建并等待的事件。                  |
| timeout | in   | 超时时间，单位为毫秒；-1 表示无超时。                                          |

#### 返回值

不适用

<br>

<a id="axclrtSynchronizeEvent"></a>

### axclrtSynchronizeEvent

阻塞主机，直到事件被触发（记录）。

#### 函数

```c
AXCL_EXPORT axclError axclrtSynchronizeEvent(axclrtEvent event);
```

#### 参数

| 名称  | 方向 | 说明                                                          |
| ----- | ---- | ------------------------------------------------------------- |
| event | in   | 由 [axclrtCreateEvent](#axclrtCreateEvent) 创建并等待的事件。 |

#### 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

<br>

<a id="axclrtSynchronizeEventWithTimeout"></a>

### axclrtSynchronizeEventWithTimeout

阻塞主机，直到事件被触发（记录）并达到超时时间。

#### 函数

```c
AXCL_EXPORT axclError axclrtSynchronizeEventWithTimeout(axclrtEvent event, int32_t timeout);
```

#### 参数

| 名称    | 方向 | 说明                                                          |
| ------- | ---- | ------------------------------------------------------------- |
| event   | in   | 由 [axclrtCreateEvent](#axclrtCreateEvent) 创建并等待的事件。 |
| timeout | in   | 超时时间，单位为毫秒；-1 表示无超时。                         |

#### 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。
