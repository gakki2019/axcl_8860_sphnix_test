# Stream

## Index

- [axclrtCreateStream](#axclrtCreateStream): Create a Stream.
- [axclrtDestroyStream](#axclrtDestroyStream): Destroy a Stream created by [axclrtCreateStream](#axclrtCreateStream).
- [axclrtDestroyStreamForce](#axclrtDestroyStreamForce): Destroy a Stream immediately without waiting for submitted tasks to complete.
- [axclrtStreamQuery](#axclrtStreamQuery): Query whether a specified Stream has unfinished tasks.
- [axclrtSynchronizeStream](#axclrtSynchronizeStream): Block until all tasks submitted to a Stream before this call have completed.
- [axclrtSynchronizeStreamWithTimeout](#axclrtSynchronizeStreamWithTimeout): Block for up to the specified timeout until all tasks submitted to a Stream before this call have completed.

<br>

## API

<a id="axclrtCreateStream"></a>

### axclrtCreateStream

Create a Stream.

#### Function

```c
AXCL_EXPORT axclError axclrtCreateStream(axclrtStream *stream);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| stream | out | Receives the created Stream handle on success. Must not be NULL. |

#### Returns

- `AXCL_SUCC`: The Stream was created successfully.
- `others`: Failure.

#### Note

- The Stream is created in the calling thread's current Context. If the calling thread has no current Context, this function fails.
- Tasks in the same Stream execute in submission order. By default, the execution order of tasks in different Streams is not guaranteed.
- To synchronize different Streams, use [Event semantics](../arch/concept.md#EVENT).
- Before calling [axclrtDestroyContext](context_api.md#axclrtDestroyContext), destroy all explicitly created Streams in that Context.

#### Remark

- [Stream semantics](../arch/concept.md#STREAM)
- [axclrtDestroyStream](#axclrtDestroyStream)

<br>

<a id="axclrtDestroyStream"></a>

### axclrtDestroyStream

Destroy a Stream created by [axclrtCreateStream](#axclrtCreateStream).

If it has unfinished tasks, this function blocks until they complete before destroying the Stream.

#### Function

```c
AXCL_EXPORT axclError axclrtDestroyStream(axclrtStream stream);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| stream | in | Stream handle returned by [axclrtCreateStream](#axclrtCreateStream). |

#### Returns

- `AXCL_SUCC`: The Stream was synchronized and destroyed successfully.
- `others`: Failure.

#### Note

- This function can destroy only a Stream explicitly created by [axclrtCreateStream](#axclrtCreateStream); it cannot destroy a default Stream. The runtime destroys the default Stream with its owning Context.
- Before destroying the Stream, this function waits for all tasks previously submitted to it to complete.
- If the Stream holds an asynchronous task error that has not been returned yet (see [axclrtSynchronizeStream](#axclrtSynchronizeStream)), this function returns that error and does not destroy the Stream. The error is cleared once returned; call this function again to destroy the Stream.
- If the device is offline, this function releases the Stream without waiting, because its unfinished tasks have already been aborted.

#### Remark

- [axclrtDestroyStreamForce](#axclrtDestroyStreamForce)
- [axclrtSynchronizeStream](#axclrtSynchronizeStream)
- [axclrtDestroyContext](context_api.md#axclrtDestroyContext)

<br>

<a id="axclrtDestroyStreamForce"></a>

### axclrtDestroyStreamForce

Destroy a Stream immediately without waiting for submitted tasks to complete.

#### Function

```c
AXCL_EXPORT axclError axclrtDestroyStreamForce(axclrtStream stream);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| stream | in | Stream handle returned by [axclrtCreateStream](#axclrtCreateStream). |

#### Returns

- `AXCL_SUCC`: The Stream was destroyed successfully.
- `others`: Failure.

#### Note

- Unlike [axclrtDestroyStream](#axclrtDestroyStream), this function does not wait for submitted tasks to complete.
- Unfinished tasks may be discarded, and this function does not report stored asynchronous task errors.

#### Remark

- [axclrtDestroyStream](#axclrtDestroyStream)

<br>

<a id="axclrtStreamQuery"></a>

### axclrtStreamQuery

Query whether a specified Stream has unfinished tasks.

#### Function

```c
AXCL_EXPORT axclError axclrtStreamQuery(axclrtStream stream, axclrtStreamStatus *status);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| stream | in | Stream handle returned by [axclrtCreateStream](#axclrtCreateStream). |
| status | out | Receives the task completion status of the Stream on success. Must not be NULL. |

#### Returns

- `AXCL_SUCC`: The task completion status of the Stream was returned successfully.
- `others`: Failure.

#### Note

- This function does not block. [AXCL_STREAM_STATUS_COMPLETE](reference/enum.md#AXCL_STREAM_STATUS_COMPLETE) means all tasks submitted to the Stream have completed; [AXCL_STREAM_STATUS_NOT_READY](reference/enum.md#AXCL_STREAM_STATUS_NOT_READY) means at least one has not.
- This function does not report errors of asynchronous tasks; use [axclrtSynchronizeStream](#axclrtSynchronizeStream) to get them.

<br>

<a id="axclrtSynchronizeStream"></a>

### axclrtSynchronizeStream

Block until all tasks submitted to a Stream before this call have completed.

#### Function

```c
AXCL_EXPORT axclError axclrtSynchronizeStream(axclrtStream stream);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| stream | in | Stream handle returned by [axclrtCreateStream](#axclrtCreateStream). |

#### Returns

- `AXCL_SUCC`: All previously submitted tasks in the Stream completed successfully.
- `others`: Failure.

#### Note

- Errors of asynchronous tasks submitted to the Stream, such as [axclrtEngineExecuteAsync](engine_api.md#axclrtEngineExecuteAsync), are reported here rather than by the submitting call. This includes a task the Device rejected because the Stream task queue was full. Only the first such error is returned; it is cleared once returned.
- Once such an error is recorded, tasks in the Stream that have not started yet are skipped until this call returns the error.
- An AXCL error code raised on the Device carries [AXCL_ID_DEVICE](reference/macro.md#AXCL_ID_DEVICE) in bits [23:16] instead of [AXCL_ID_HOST](reference/macro.md#AXCL_ID_HOST), so it does not equal the same error code macro expanded in the Host application. Compare bits [15:0] to identify it.

#### Remark

- [axclrtSynchronizeStreamWithTimeout](#axclrtSynchronizeStreamWithTimeout)

<br>

<a id="axclrtSynchronizeStreamWithTimeout"></a>

### axclrtSynchronizeStreamWithTimeout

Block for up to the specified timeout until all tasks submitted to a Stream before this call have completed.

#### Function

```c
AXCL_EXPORT axclError axclrtSynchronizeStreamWithTimeout(axclrtStream stream, int32_t timeout);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| stream | in | Stream handle returned by [axclrtCreateStream](#axclrtCreateStream). |
| timeout | in | Timeout in milliseconds. A negative value, such as `-1`, waits indefinitely. |

#### Returns

- `AXCL_SUCC`: All previously submitted tasks in the Stream completed successfully within the timeout.
- `others`: Failure.

#### Note

- A timeout does not cancel submitted tasks.
- Errors of asynchronous tasks are reported as described in [axclrtSynchronizeStream](#axclrtSynchronizeStream).

#### Remark

- [axclrtSynchronizeStream](#axclrtSynchronizeStream)
