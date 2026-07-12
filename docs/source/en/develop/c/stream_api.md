# Stream

## Index

- [axclrtCreateStream](#axclrtCreateStream)
- [axclrtDestroyStream](#axclrtDestroyStream)
- [axclrtDestroyStreamForce](#axclrtDestroyStreamForce)
- [axclrtStreamQuery](#axclrtStreamQuery)
- [axclrtSynchronizeStream](#axclrtSynchronizeStream)
- [axclrtSynchronizeStreamWithTimeout](#axclrtSynchronizeStreamWithTimeout)

<br>

## API

<a id="axclrtCreateStream"></a>

### axclrtCreateStream

Create a stream.

#### Function

```c
AXCL_EXPORT axclError axclrtCreateStream(axclrtStream *stream);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| stream | out | pointer to created stream |

#### Returns

- `AXCL_SUCC`: success.
- `others`: failure.

<br>

<a id="axclrtDestroyStream"></a>

### axclrtDestroyStream

Destroy a stream.

#### Function

```c
AXCL_EXPORT axclError axclrtDestroyStream(axclrtStream stream);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| stream | in | stream created by [axclrtCreateStream](#axclrtCreateStream) to destroy. |

#### Returns

- `AXCL_SUCC`: success.
- `others`: failure.

<br>

<a id="axclrtDestroyStreamForce"></a>

### axclrtDestroyStreamForce

Destroy a stream forcefully.

#### Function

```c
AXCL_EXPORT axclError axclrtDestroyStreamForce(axclrtStream stream);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| stream | in | stream created by [axclrtCreateStream](#axclrtCreateStream) to destroy. |

#### Returns

- `AXCL_SUCC`: success.
- `others`: failure.

<br>

<a id="axclrtStreamQuery"></a>

### axclrtStreamQuery

Query the execution status of all tasks on a stream (non-blocking).

#### Function

```c
AXCL_EXPORT axclError axclrtStreamQuery(axclrtStream stream, axclrtStreamStatus *status);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| stream | in | stream created by [axclrtCreateStream](#axclrtCreateStream) to query. |
| status | out | pointer to receive the stream status. |

#### Returns

- `AXCL_SUCC`: if the query was successful; check status for the stream state.
- `others`: if the query call itself failed; status is set to AXCL_STREAM_STATUS_RESERVED.

<br>

<a id="axclrtSynchronizeStream"></a>

### axclrtSynchronizeStream

Synchronize a stream.

#### Function

```c
AXCL_EXPORT axclError axclrtSynchronizeStream(axclrtStream stream);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| stream | in | stream created by [axclrtCreateStream](#axclrtCreateStream) to synchronize. |

#### Returns

- `AXCL_SUCC`: success.
- `others`: failure.

<br>

<a id="axclrtSynchronizeStreamWithTimeout"></a>

### axclrtSynchronizeStreamWithTimeout

Synchronize a stream with timeout.

#### Function

```c
AXCL_EXPORT axclError axclrtSynchronizeStreamWithTimeout(axclrtStream stream, int32_t timeout);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| stream | in | stream created by [axclrtCreateStream](#axclrtCreateStream) to synchronize. |
| timeout | in | timeout in milliseconds, -1 for no timeout. |

#### Returns

- `AXCL_SUCC`: success.
- `others`: failure.
