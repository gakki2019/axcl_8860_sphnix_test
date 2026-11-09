# Event

## Index

- [axclrtCreateEvent](#axclrtCreateEvent): Create an Event with timing enabled on the device associated with the current Context.
- [axclrtCreateEventWithFlags](#axclrtCreateEventWithFlags): Create an Event on the device associated with the current Context according to the specified timing flags.
- [axclrtDestroyEvent](#axclrtDestroyEvent): Destroy an Event created by [axclrtCreateEvent](#axclrtCreateEvent) or [axclrtCreateEventWithFlags](#axclrtCreateEventWithFlags).
- [axclrtEventElapsedTime](#axclrtEventElapsedTime): Calculate the elapsed device time between the latest records of two Events.
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
| event | out | Receives the created Event handle on success. Must not be NULL. |

#### Returns

- `AXCL_SUCC`: The Event was created successfully.
- `others`: Failure.

#### Note

- Events can be used to measure the elapsed time between two record points and to synchronize tasks in different Streams. See [Event semantics](../arch/concept.md#EVENT).
- This function is equivalent to using [AXCL_EVENT_DEFAULT](reference/macro.md#AXCL_EVENT_DEFAULT) to call [axclrtCreateEventWithFlags](#axclrtCreateEventWithFlags). The created Event supports timing.
- The calling thread must have a current Context, and its device must be active. The Event belongs to that device rather than to a particular Context or Stream.
- When the Event is no longer needed, destroy it with [axclrtDestroyEvent](#axclrtDestroyEvent) before releasing its owning device.
- A process can hold at most 1024 Events that have not been destroyed on one device, counted across all Contexts of that device. Beyond that this function fails; destroying an Event frees its place at once.

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
| event | out | Receives the created Event handle on success. Must not be NULL. |
| flags | in | Must be [AXCL_EVENT_DEFAULT](reference/macro.md#AXCL_EVENT_DEFAULT) or [AXCL_EVENT_DISABLE_TIMING](reference/macro.md#AXCL_EVENT_DISABLE_TIMING). |

#### Returns

- `AXCL_SUCC`: The Event was created successfully.
- `others`: Failure.

#### Note

- [AXCL_EVENT_DEFAULT](reference/macro.md#AXCL_EVENT_DEFAULT) records timestamps for [axclrtEventElapsedTime](#axclrtEventElapsedTime).
- [AXCL_EVENT_DISABLE_TIMING](reference/macro.md#AXCL_EVENT_DISABLE_TIMING) does not record timestamps. An Event created with this flag cannot be used for elapsed-time measurement.
- The calling thread must have a current Context, and its device must be active. The Event belongs to that device.
- When the Event is no longer needed, destroy it with [axclrtDestroyEvent](#axclrtDestroyEvent) before releasing its owning device.
- A process can hold at most 1024 Events that have not been destroyed on one device, counted across all Contexts of that device. Beyond that this function fails; destroying an Event frees its place at once.

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
- This function does not wait for tasks. It may be called while a record of the Event is still pending: record points and wait points already submitted complete as usual, and a Host synchronization already waiting on the Event returns when that record ends. Resources are released after they finish.
- Calling this function concurrently with another function on the same Event is undefined behavior.
- After this function succeeds, `event` is invalid. Until the device is released, later calls with it fail, except [axclrtRecordEvent](#axclrtRecordEvent), which returns success while the Device rejects the record point as described there. Once [axclrtResetDevice](device_api.md#axclrtResetDevice) releases the device, every earlier Event handle of that device is invalid and must not be used.

<br>

<a id="axclrtEventElapsedTime"></a>

### axclrtEventElapsedTime

Calculate the elapsed device time between the latest records of two Events.

#### Function

```c
AXCL_EXPORT axclError axclrtEventElapsedTime(float *ms, axclrtEvent startEvent, axclrtEvent endEvent);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| ms | out | Receives the elapsed time in milliseconds. Must not be NULL. |
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
- Both Events must have timing enabled and belong to the same device; otherwise this function fails. Their latest record points must have executed, but may be in different Streams of that device.
- If either Event has never been recorded, or its latest record ended without executing, this function fails.
- This function does not wait for record points to complete. If the latest record point of either Event has not completed, this function returns [AXCL_ERR_RT_EVENT_NOT_READY](reference/error.md#AXCL_ERR_RT_EVENT_NOT_READY); synchronize the Events, for example with [axclrtSynchronizeEvent](#axclrtSynchronizeEvent), and call this function again.
- The result is the timestamp of the latest `endEvent` record minus the timestamp of the latest `startEvent` record, in milliseconds. It is negative when `endEvent` completed first.

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
| event | in | Event handle to query. Must not be NULL. |
| status | out | Receives the Event completion status on success. Must not be NULL. |

#### Returns

- `AXCL_SUCC`: The status was queried successfully.
- `others`: Failure.

#### Note

- This is a non-blocking query API that immediately snapshots the Device execution status.
- The status refers to the Event's latest record. A record submitted before this call from the same thread is always the one queried.
- If the Event has not been recorded yet, or its latest record has ended, it reports [AXCL_EVENT_STATUS_COMPLETE](reference/enum.md#AXCL_EVENT_STATUS_COMPLETE). A record that ended without executing also counts as ended; its failure is reported by its Stream.

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

- `event` and `stream` must belong to the same device; otherwise this function fails.
- This function can be used with [axclrtStreamWaitEvent](#axclrtStreamWaitEvent) to synchronize tasks in different Streams.
- The record point captures the tasks submitted to `stream` before it, and becomes the Event's latest record. [axclrtEventQuery](#axclrtEventQuery), [axclrtSynchronizeEvent](#axclrtSynchronizeEvent) and wait points submitted afterwards refer to this record.
- Recording the Event again replaces its latest record. Wait points and Host synchronizations already submitted keep referring to the record that was latest when they were submitted.
- A successful return does not mean that the record point is complete; it completes when the Stream reaches it.
- A successful return means the request was sent to the Device, not that the Device has accepted the record point. If the Device rejects it, for example because the Stream task queue is full, the record still becomes the latest record and ends without executing, so waiters on it are released. The error is returned by the next [axclrtSynchronizeStream](stream_api.md#axclrtSynchronizeStream) or [axclrtSynchronizeStreamWithTimeout](stream_api.md#axclrtSynchronizeStreamWithTimeout) on the Stream. As with any asynchronous Stream error, tasks in the Stream that have not started yet are skipped until that synchronization returns the error. The Device also rejects a record point whose Event has been destroyed.
- A record point does not carry the Stream's errors; errors are reported by synchronizing the Stream.
- If timing is enabled, the Event stores the timestamp at which its latest record point completed.

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

- `stream` and `event` must belong to the same device; otherwise this function fails.
- The wait point refers to the Event's latest record at the time of submission. A later record of the Event does not change it.
- No wait point is inserted if the Event has never been recorded or if its latest record has already ended. A record that has not ended yet is waited for even if it is on `stream` itself.
- A successful return means only that the wait point was submitted. This function does not block the Host thread. After the specified Stream reaches the wait point, subsequent tasks cannot continue until the record ends.
- A record that ends without executing, because it was rejected or its Stream was destroyed, also releases the wait point. The failure is reported by the recording Stream, not by `stream`.
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
| timeout | in | Timeout in milliseconds. A value of 0 or less, such as -1, waits indefinitely. |

#### Returns

- `AXCL_SUCC`: The wait point was submitted successfully.
- `others`: Failure.

#### Note

- `stream` and `event` must belong to the same device; otherwise this function fails.
- The wait point refers to the Event's latest record at the time of submission, as for [axclrtStreamWaitEvent](#axclrtStreamWaitEvent).
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

- Waits for the Event's latest record at the time of the call. Returns immediately if the Event has never been recorded or that record has already ended.
- Multiple Host threads may synchronize on the same Event at the same time.
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
| timeout | in | Timeout in milliseconds. A negative value, such as -1, waits indefinitely. |

#### Returns

- `AXCL_SUCC`: The Event was signaled within the timeout.
- `others`: Failure.

#### Note

- Waits for the Event's latest record at the time of the call, as for [axclrtSynchronizeEvent](#axclrtSynchronizeEvent).
- The timeout counts from the call, including the time to send the request to the Device. A timeout of 0 only queries the status once.
- If the latest record does not end within the timeout, this function fails.
- A timeout does not modify or destroy the Event; the caller may call this function again to keep waiting.
- Multiple Host threads may synchronize on the same Event at the same time.
- Unlike this function, [axclrtStreamWaitEvent](#axclrtStreamWaitEvent) does not block the Host thread. It inserts a wait point into the specified Stream.

#### Remark

- [axclrtSynchronizeEvent](#axclrtSynchronizeEvent)
- [axclrtStreamWaitEventWithTimeout](#axclrtStreamWaitEventWithTimeout)
