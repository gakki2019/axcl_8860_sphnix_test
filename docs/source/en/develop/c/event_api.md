# Event

## Index

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

Create an event.

#### Function

```c
AXCL_EXPORT axclError axclrtCreateEvent(axclrtEvent *event);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| event | out | pointer to created event |

#### Returns

- `AXCL_SUCC`: success.
- `others`: failure.

<br>

<a id="axclrtDestroyEvent"></a>

### axclrtDestroyEvent

Destroy an event.

#### Function

```c
AXCL_EXPORT axclError axclrtDestroyEvent(axclrtEvent event);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| event | in | event created by [axclrtCreateEvent](#axclrtCreateEvent) to destroy. |

#### Returns

- `AXCL_SUCC`: success.
- `others`: failure.

<br>

<a id="axclrtRecordEvent"></a>

### axclrtRecordEvent

Record an event on a stream.

#### Function

```c
AXCL_EXPORT axclError axclrtRecordEvent(axclrtEvent event, axclrtStream stream);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| event | in | event created by [axclrtCreateEvent](#axclrtCreateEvent) to record. |
| stream | in | stream created by [axclrtCreateStream](stream_api.md#axclrtCreateStream) to record the event. |

#### Returns

- `AXCL_SUCC`: success.
- `others`: failure.

<br>

<a id="axclrtStreamWaitEvent"></a>

### axclrtStreamWaitEvent

Wait for an event on a stream.

#### Function

```c
AXCL_EXPORT axclError axclrtStreamWaitEvent(axclrtStream stream, axclrtEvent event);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| stream | in | stream created by [axclrtCreateStream](stream_api.md#axclrtCreateStream) to wait for the event. |
| event | in | event created by [axclrtCreateEvent](#axclrtCreateEvent) to wait for. |

#### Returns

- `AXCL_SUCC`: success.
- `others`: failure.

<br>

<a id="axclrtStreamWaitEventWithTimeout"></a>

### axclrtStreamWaitEventWithTimeout

Wait for an event on a stream with timeout.

#### Function

```c
AXCL_EXPORT axclError axclrtStreamWaitEventWithTimeout(axclrtStream stream, axclrtEvent event, int32_t timeout);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| stream | in | stream created by [axclrtCreateStream](stream_api.md#axclrtCreateStream) to wait for the event. |
| event | in | event created by [axclrtCreateEvent](#axclrtCreateEvent) to wait for. |
| timeout | in | timeout in milliseconds, -1 for no timeout. |

#### Returns

- `AXCL_SUCC`: success.
- `others`: failure.

<br>

<a id="axclrtSynchronizeEvent"></a>

### axclrtSynchronizeEvent

Block host until the event is signaled (recorded).

#### Function

```c
AXCL_EXPORT axclError axclrtSynchronizeEvent(axclrtEvent event);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| event | in | event created by [axclrtCreateEvent](#axclrtCreateEvent) to wait for. |

#### Returns

- `AXCL_SUCC`: success.
- `others`: failure.

<br>

<a id="axclrtSynchronizeEventWithTimeout"></a>

### axclrtSynchronizeEventWithTimeout

Block host until the event is signaled (recorded) with timeout.

#### Function

```c
AXCL_EXPORT axclError axclrtSynchronizeEventWithTimeout(axclrtEvent event, int32_t timeout);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| event | in | event created by [axclrtCreateEvent](#axclrtCreateEvent) to wait for. |
| timeout | in | timeout in milliseconds, -1 for no timeout. |

#### Returns

- `AXCL_SUCC`: success.
- `others`: failure.
