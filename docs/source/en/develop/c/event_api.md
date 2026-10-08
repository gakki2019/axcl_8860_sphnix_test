# Event

## Index

- [axclrtCreateEvent](#axclrtCreateEvent): Create an Event with timing enabled on the device associated with the current Context.
- [axclrtCreateEventWithFlags](#axclrtCreateEventWithFlags): Create an Event on the device associated with the current Context according to the specified timing flags.
- [axclrtDestroyEvent](#axclrtDestroyEvent): Destroy an Event created by [axclrtCreateEvent](#axclrtCreateEvent) or [axclrtCreateEventWithFlags](#axclrtCreateEventWithFlags).
- [axclrtEventElapsedTime](#axclrtEventElapsedTime): Calculate the elapsed device time between the latest completed records of two Events.
- [axclrtEventQuery](#axclrtEventQuery): Query the completion status of tasks captured by an Event without blocking the Host thread.
- [axclrtRecordEvent](#axclrtRecordEvent): Asynchronously submit an Event record point to the specified Stream.
- [axclrtStreamWaitEvent](#axclrtStreamWaitEvent): Asynchronously submit an Event wait point to the specified Stream so that the Stream continues only after the Event is signaled.
- [axclrtStreamWaitEventWithTimeout](#axclrtStreamWaitEventWithTimeout): Asynchronously submit an Event wait point with a timeout to the specified Stream.
- [axclrtSynchronizeEvent](#axclrtSynchronizeEvent): Block the current Host thread until an Event is signaled.
- [axclrtSynchronizeEventWithTimeout](#axclrtSynchronizeEventWithTimeout): Block the current Host thread until an Event is signaled or the timeout expires.

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

- Events can be used to measure the elapsed time between two record points and to synchronize tasks in different Streams. See [Event semantics](../arch/concept.md#EVENT).
- This function is equivalent to using [AXCL_EVENT_DEFAULT](reference/macro.md#AXCL_EVENT_DEFAULT) to call [axclrtCreateEventWithFlags](#axclrtCreateEventWithFlags). The created Event supports timing.
- The calling thread must have a current Context, and its device must be active. The Event belongs to that device rather than to a particular Context or Stream.
- When the Event is no longer needed, destroy it with [axclrtDestroyEvent](#axclrtDestroyEvent) before releasing its owning device.

#### Remark

- [Event semantics](../arch/concept.md#EVENT)
- [axclrtCreateEventWithFlags](#axclrtCreateEventWithFlags)
- [axclrtDestroyEvent](#axclrtDestroyEvent)

<br>

<a id="axclrtCreateEventWithFlags"></a>

### axclrtCreateEventWithFlags

Create an Event on the device associated with the current Context according to the specified timing flags.

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

- [AXCL_EVENT_DEFAULT](reference/macro.md#AXCL_EVENT_DEFAULT) records timestamps for [axclrtEventElapsedTime](#axclrtEventElapsedTime).
- [AXCL_EVENT_DISABLE_TIMING](reference/macro.md#AXCL_EVENT_DISABLE_TIMING) does not record timestamps. An Event created with this flag cannot be used for elapsed-time measurement.
- The calling thread must have a current Context, and its device must be active. The Event belongs to that device.
- When the Event is no longer needed, destroy it with [axclrtDestroyEvent](#axclrtDestroyEvent) before releasing its owning device.

#### Remark

- [axclrtCreateEvent](#axclrtCreateEvent)
- [axclrtDestroyEvent](#axclrtDestroyEvent)
- [axclrtEventElapsedTime](#axclrtEventElapsedTime)

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

- This function destroys an Event created by [axclrtCreateEvent](#axclrtCreateEvent) or [axclrtCreateEventWithFlags](#axclrtCreateEventWithFlags).
- Before destroying the Event, ensure that no Stream record or wait operation is still using it. Destroying the Event wakes any Host synchronization request waiting on it and causes that request to fail.
- After this function succeeds, `event` is invalid and must not be used again.

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

- Use this function together with Event record and synchronization functions, for example:

  ```c
     axclrtCreateEvent(&startEvent);
     axclrtCreateEvent(&endEvent);
     axclrtRecordEvent(startEvent, stream);
     // Submit the tasks whose elapsed time is to be measured.
     axclrtRecordEvent(endEvent, stream);
     axclrtSynchronizeEvent(endEvent);
     axclrtEventElapsedTime(&ms, startEvent, endEvent);
  ```
- Both Events must have timing enabled and belong to the same device. Their latest record points must be complete and must be in the same Stream.
- This function does not wait for record points to complete. If the latest record point of either Event has not completed, this function fails.
- The result is the timestamp of the latest `endEvent` record minus the timestamp of the latest `startEvent` record, in milliseconds.

#### Remark

- [axclrtCreateEvent](#axclrtCreateEvent)
- [axclrtCreateEventWithFlags](#axclrtCreateEventWithFlags)
- [axclrtRecordEvent](#axclrtRecordEvent)
- [axclrtSynchronizeEvent](#axclrtSynchronizeEvent)

<br>

<a id="axclrtEventQuery"></a>

### axclrtEventQuery

Query the completion status of tasks captured by an Event without blocking the Host thread.

#### Function

```c
AXCL_EXPORT axclError axclrtEventQuery(axclrtEvent event, axclrtEventStatus *status);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| event | in | Event handle to query. |
| status | out | Receives the Event completion status on success. |

#### Returns

- `AXCL_SUCC`: The status was queried successfully.
- `AXCL_ERR_RT_NULL_POINTER`: Invalid pointer (event or status is nil).
- `others`: Failure.

#### Note

- This is a non-blocking query API that immediately snapshots the Device execution status.
- If the Event has not been recorded yet or has completed all tasks, it reports [AXCL_EVENT_STATUS_COMPLETE](reference/enum.md#AXCL_EVENT_STATUS_COMPLETE).

#### Remark

- [axclrtRecordEvent](#axclrtRecordEvent)
- [axclrtSynchronizeEvent](#axclrtSynchronizeEvent)

<br>

<a id="axclrtRecordEvent"></a>

### axclrtRecordEvent

Asynchronously submit an Event record point to the specified Stream.

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
- This function can be used with [axclrtStreamWaitEvent](#axclrtStreamWaitEvent) to synchronize tasks in different Streams.
- A successful return does not mean that the Event is already signaled. The Event is signaled when the Stream reaches the record point after completing earlier work.
- Recording the Event again resets its previous signaled state.
- If timing is enabled, the Event stores the timestamp of the most recently completed record point.

#### Remark

- [Event semantics](../arch/concept.md#EVENT)
- [axclrtStreamWaitEvent](#axclrtStreamWaitEvent)
- [axclrtSynchronizeEvent](#axclrtSynchronizeEvent)
- [axclrtEventElapsedTime](#axclrtEventElapsedTime)

<br>

<a id="axclrtStreamWaitEvent"></a>

### axclrtStreamWaitEvent

Asynchronously submit an Event wait point to the specified Stream so that the Stream continues only after the Event is signaled.

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
- A successful return means only that the wait point was submitted. This function does not block the Host thread. After the specified Stream reaches the wait point, subsequent tasks cannot continue until the Event is signaled.
- Multiple Streams can wait on the same Event. See [Event semantics](../arch/concept.md#EVENT).
- Unlike this function, [axclrtSynchronizeEvent](#axclrtSynchronizeEvent) blocks the current Host thread until the Event is signaled.

#### Remark

- [axclrtStreamWaitEventWithTimeout](#axclrtStreamWaitEventWithTimeout)
- [axclrtRecordEvent](#axclrtRecordEvent)
- [axclrtSynchronizeEvent](#axclrtSynchronizeEvent)

<br>

<a id="axclrtStreamWaitEventWithTimeout"></a>

### axclrtStreamWaitEventWithTimeout

Asynchronously submit an Event wait point with a timeout to the specified Stream.

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

- `stream` and `event` must belong to the same device.
- A successful return means only that the wait point was submitted. This function does not block the Host thread.
- The specified Stream starts waiting for the Event when it reaches the wait point, and subsequent tasks do not execute while it waits. The timeout starts at that point. A wait timeout is recorded as an asynchronous Stream execution error and is returned by a later synchronization of that Stream.
- Multiple Streams can wait on the same Event. See [Event semantics](../arch/concept.md#EVENT).

#### Remark

- [axclrtStreamWaitEvent](#axclrtStreamWaitEvent)

<br>

<a id="axclrtSynchronizeEvent"></a>

### axclrtSynchronizeEvent

Block the current Host thread until an Event is signaled.

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

- Only one Host synchronization request can wait on the same Event at a time.
- Unlike this function, [axclrtStreamWaitEvent](#axclrtStreamWaitEvent) does not block the Host thread. It inserts a wait point into the specified Stream.

#### Remark

- [axclrtStreamWaitEvent](#axclrtStreamWaitEvent)
- [axclrtSynchronizeEventWithTimeout](#axclrtSynchronizeEventWithTimeout)

<br>

<a id="axclrtSynchronizeEventWithTimeout"></a>

### axclrtSynchronizeEventWithTimeout

Block the current Host thread until an Event is signaled or the timeout expires.

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

- A timeout does not modify or destroy the Event.
- Only one Host synchronization request can wait on the same Event at a time.
- Unlike this function, [axclrtStreamWaitEvent](#axclrtStreamWaitEvent) does not block the Host thread. It inserts a wait point into the specified Stream.

#### Remark

- [axclrtSynchronizeEvent](#axclrtSynchronizeEvent)
- [axclrtStreamWaitEventWithTimeout](#axclrtStreamWaitEventWithTimeout)
