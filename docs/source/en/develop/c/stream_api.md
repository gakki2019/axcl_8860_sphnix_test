# Stream

## Index

- [axclrtCreateStream](#axclrtCreateStream): Create an explicit Stream.
- [axclrtDestroyStream](#axclrtDestroyStream): Destroy an explicit Stream created by [axclrtCreateStream](#axclrtCreateStream).
- [axclrtDestroyStreamForce](#axclrtDestroyStreamForce): Destroy a Stream immediately without waiting for submitted tasks to complete.
- [axclrtStreamQuery](#axclrtStreamQuery): Query whether a specified Stream has unfinished tasks.
- [axclrtSynchronizeStream](#axclrtSynchronizeStream): Block until all tasks submitted to a Stream before this call have completed.
- [axclrtSynchronizeStreamWithTimeout](#axclrtSynchronizeStreamWithTimeout): Block for up to the specified timeout until all tasks submitted to a Stream before this call have completed.

<br>

## API

<a id="axclrtCreateStream"></a>

### axclrtCreateStream

Create an explicit Stream.

#### Function

```c
AXCL_EXPORT axclError axclrtCreateStream(axclrtStream *stream);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| stream | out | Receives the created Stream handle on success. |

#### Returns

- `AXCL_SUCC`: The Stream was created successfully.
- `others`: Failure.

#### Note

- Tasks in the same Stream execute in submission order. By default, the execution order of tasks in different Streams is not guaranteed.
- To synchronize different Streams, use [Event semantics](../arch/concept.md#EVENT).
- Before calling [axclrtDestroyContext](context_api.md#axclrtDestroyContext), destroy all explicitly created Streams in that Context.

#### Remark

- [Stream semantics](../arch/concept.md#STREAM)
- [axclrtDestroyStream](#axclrtDestroyStream)

<br>

<a id="axclrtDestroyStream"></a>

### axclrtDestroyStream

Destroy an explicit Stream created by [axclrtCreateStream](#axclrtCreateStream).

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
| status | out | Receives the task completion status of the Stream on success. |

#### Returns

- `AXCL_SUCC`: The task completion status of the Stream was returned successfully.
- `others`: Failure.

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
| timeout | in | Timeout in milliseconds. `-1` waits indefinitely. |

#### Returns

- `AXCL_SUCC`: All previously submitted tasks in the Stream completed successfully within the timeout.
- `others`: Failure.

#### Note

- A timeout does not cancel submitted tasks.

#### Remark

- [axclrtSynchronizeStream](#axclrtSynchronizeStream)
