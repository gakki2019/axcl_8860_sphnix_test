# Event

## Index

- [axclrtCreateEvent](#axclrtCreateEvent): Create an Event with timing enabled on the device associated with the current Context.
- [axclrtCreateEventWithFlags](#axclrtCreateEventWithFlags): Create an Event with specified timing behavior on the device associated with the current Context.
- [axclrtDestroyEvent](#axclrtDestroyEvent): Destroy an Event created by [axclrtCreateEvent](#axclrtCreateEvent) or [axclrtCreateEventWithFlags](#axclrtCreateEventWithFlags).
- [axclrtEventElapsedTime](#axclrtEventElapsedTime): Calculate the elapsed device time between the latest completed records of two Events.
- [axclrtRecordEvent](#axclrtRecordEvent): Submit an Event record point to a Stream.
- [axclrtStreamWaitEvent](#axclrtStreamWaitEvent): Submit an indefinite Event wait point to a Stream.
- [axclrtStreamWaitEventWithTimeout](#axclrtStreamWaitEventWithTimeout): Submit a timed Event wait point to a Stream.
- [axclrtSynchronizeEvent](#axclrtSynchronizeEvent): Block the Host until an Event is signaled.
- [axclrtSynchronizeEventWithTimeout](#axclrtSynchronizeEventWithTimeout): Block the Host until an Event is signaled or the timeout expires.

<br>

## API

<a id="axclrtCreateEvent"></a>

### axclrtCreateEvent

Create an Event with timing enabled on the device associated with the current Context.

#### Function

```c
AXCL_EXPORT axclError axclrtCreateEvent(axclrtEvent *event);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| event | out | Receives the created Event handle on success. |

#### Returns

- `AXCL_SUCC`: The Event was created successfully.
- `others`: Failure.

#### Note

- The calling thread must have a current Context, and its device must be active. The Event belongs to that device rather than to a particular Context or Stream.
- Destroy the Event with [axclrtDestroyEvent](#axclrtDestroyEvent) when no Stream or Host wait still uses it, and before releasing its owning device.

#### Remark

[axclrtCreateEventWithFlags](#axclrtCreateEventWithFlags) | [axclrtDestroyEvent](#axclrtDestroyEvent) | [axclrtRecordEvent](#axclrtRecordEvent)

<br>

<a id="axclrtCreateEventWithFlags"></a>

### axclrtCreateEventWithFlags

Create an Event with specified timing behavior on the device associated with the current Context.

#### Function

```c
AXCL_EXPORT axclError axclrtCreateEventWithFlags(axclrtEvent *event, uint32_t flags);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| event | out | Receives the created Event handle on success. |
| flags | in | [AXCL_EVENT_DEFAULT](reference/macro.md#AXCL_EVENT_DEFAULT) or [AXCL_EVENT_DISABLE_TIMING](reference/macro.md#AXCL_EVENT_DISABLE_TIMING). |

#### Returns

- `AXCL_SUCC`: The Event was created successfully.
- `others`: Failure.

#### Note

- [AXCL_EVENT_DEFAULT](reference/macro.md#AXCL_EVENT_DEFAULT) enables timestamps for [axclrtEventElapsedTime](#axclrtEventElapsedTime). [AXCL_EVENT_DISABLE_TIMING](reference/macro.md#AXCL_EVENT_DISABLE_TIMING) avoids recording timestamps, and Events created with this flag cannot be used for elapsed-time measurement.
- The calling thread must have a current Context, and its device must be active. The Event belongs to that device.

#### Remark

[axclrtCreateEvent](#axclrtCreateEvent) | [axclrtDestroyEvent](#axclrtDestroyEvent) | [axclrtEventElapsedTime](#axclrtEventElapsedTime)

<br>

<a id="axclrtDestroyEvent"></a>

### axclrtDestroyEvent

Destroy an Event created by [axclrtCreateEvent](#axclrtCreateEvent) or [axclrtCreateEventWithFlags](#axclrtCreateEventWithFlags).

#### Function

```c
AXCL_EXPORT axclError axclrtDestroyEvent(axclrtEvent event);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| event | in | Event handle to destroy. |

#### Returns

- `AXCL_SUCC`: The Event was destroyed successfully.
- `others`: Failure.

#### Note

Ensure that no Stream record or wait operation and no Host synchronization is still using the Event. After this function succeeds, `event` is invalid and must not be used again.

<br>

<a id="axclrtEventElapsedTime"></a>

### axclrtEventElapsedTime

Calculate the elapsed device time between the latest completed records of two Events.

#### Function

```c
AXCL_EXPORT axclError axclrtEventElapsedTime(float *ms, axclrtEvent startEvent, axclrtEvent endEvent);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| ms | out | Receives the elapsed time in milliseconds. |
| startEvent | in | Event marking the start point. |
| endEvent | in | Event marking the end point. |

#### Returns

- `AXCL_SUCC`: The elapsed time was returned successfully.
- `others`: Failure.

#### Note

- Both Events must have timing enabled, belong to the same device, have completed at least one record, and have their latest records on the same Stream.
- If either Event has not completed its latest record, this function fails instead of waiting. Synchronize `endEvent` first when the Host must wait for the measurement interval to finish.
- The result is the latest `endEvent` timestamp minus the latest `startEvent` timestamp.

#### Remark

[axclrtRecordEvent](#axclrtRecordEvent) | [axclrtSynchronizeEvent](#axclrtSynchronizeEvent) | [axclrtCreateEventWithFlags](#axclrtCreateEventWithFlags)

<br>

<a id="axclrtRecordEvent"></a>

### axclrtRecordEvent

Submit an Event record point to a Stream.

#### Function

```c
AXCL_EXPORT axclError axclrtRecordEvent(axclrtEvent event, axclrtStream stream);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| event | in | Event to record. |
| stream | in | Stream that receives the record point. |

#### Returns

- `AXCL_SUCC`: The record point was submitted successfully.
- `others`: Failure.

#### Note

- `event` and `stream` must belong to the same device.
- A successful return does not mean that the Event is already signaled. The Event is signaled when the Stream reaches the record point after completing earlier work.
- Recording an Event again resets its previous signaled state. If timing is enabled, the Event stores the timestamp of the most recently completed record point.

#### Remark

[axclrtStreamWaitEvent](#axclrtStreamWaitEvent) | [axclrtSynchronizeEvent](#axclrtSynchronizeEvent) | [axclrtEventElapsedTime](#axclrtEventElapsedTime)

<br>

<a id="axclrtStreamWaitEvent"></a>

### axclrtStreamWaitEvent

Submit an indefinite Event wait point to a Stream.

#### Function

```c
AXCL_EXPORT axclError axclrtStreamWaitEvent(axclrtStream stream, axclrtEvent event);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| stream | in | Stream that waits for the Event. |
| event | in | Event to wait for. |

#### Returns

- `AXCL_SUCC`: The wait point was submitted successfully.
- `others`: Failure.

#### Note

- `stream` and `event` must belong to the same device.
- This function does not block the Host until the Event is signaled. Tasks submitted later to the same Stream do not execute past the wait point until the Event is signaled.

#### Remark

[axclrtStreamWaitEventWithTimeout](#axclrtStreamWaitEventWithTimeout) | [axclrtRecordEvent](#axclrtRecordEvent) | [axclrtSynchronizeEvent](#axclrtSynchronizeEvent)

<br>

<a id="axclrtStreamWaitEventWithTimeout"></a>

### axclrtStreamWaitEventWithTimeout

Submit a timed Event wait point to a Stream.

#### Function

```c
AXCL_EXPORT axclError axclrtStreamWaitEventWithTimeout(axclrtStream stream, axclrtEvent event, int32_t timeout);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| stream | in | Stream that waits for the Event. |
| event | in | Event to wait for. |
| timeout | in | Timeout in milliseconds. -1 waits indefinitely. |

#### Returns

- `AXCL_SUCC`: The wait point was submitted successfully.
- `others`: Failure.

#### Note

- `stream` and `event` must belong to the same device. This function returns after submitting the wait point; it does not block the Host until the Event is signaled.
- The timeout is evaluated when the Stream executes the wait point. A wait timeout becomes a Stream execution error and is returned by a later Stream synchronization.

#### Remark

[axclrtStreamWaitEvent](#axclrtStreamWaitEvent) | [axclrtSynchronizeStream](stream_api.md#axclrtSynchronizeStream) | [axclrtSynchronizeEventWithTimeout](#axclrtSynchronizeEventWithTimeout)

<br>

<a id="axclrtSynchronizeEvent"></a>

### axclrtSynchronizeEvent

Block the Host until an Event is signaled.

#### Function

```c
AXCL_EXPORT axclError axclrtSynchronizeEvent(axclrtEvent event);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| event | in | Event to wait for. |

#### Returns

- `AXCL_SUCC`: The Event was signaled.
- `others`: Failure.

#### Note

Only one Host synchronization request can wait on the same Event at a time. Use [axclrtStreamWaitEvent](#axclrtStreamWaitEvent) when a Stream, rather than the Host thread, should wait.

#### Remark

[axclrtSynchronizeEventWithTimeout](#axclrtSynchronizeEventWithTimeout) | [axclrtRecordEvent](#axclrtRecordEvent)

<br>

<a id="axclrtSynchronizeEventWithTimeout"></a>

### axclrtSynchronizeEventWithTimeout

Block the Host until an Event is signaled or the timeout expires.

#### Function

```c
AXCL_EXPORT axclError axclrtSynchronizeEventWithTimeout(axclrtEvent event, int32_t timeout);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| event | in | Event to wait for. |
| timeout | in | Timeout in milliseconds. -1 waits indefinitely. |

#### Returns

- `AXCL_SUCC`: The Event was signaled within the timeout.
- `others`: Failure.

#### Note

A timeout does not modify or destroy the Event. Only one Host synchronization request can wait on the same Event at a time.

#### Remark

[axclrtSynchronizeEvent](#axclrtSynchronizeEvent) | [axclrtStreamWaitEventWithTimeout](#axclrtStreamWaitEventWithTimeout)
