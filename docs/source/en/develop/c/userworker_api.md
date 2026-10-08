# Userworker

## Index

- [axclrtExecWorker](#axclrtExecWorker): Start a userworker process on the Device associated with the current Context.
- [axclrtKillWorker](#axclrtKillWorker): Terminate and reap a userworker process.
- [axclrtWorkerRecv](#axclrtWorkerRecv): Receive one complete message from a userworker process.
- [axclrtWorkerSend](#axclrtWorkerSend): Send one complete message to a userworker process.

<br>

## API

<a id="axclrtExecWorker"></a>

### axclrtExecWorker

Start a userworker process on the Device associated with the current Context.

#### Function

```c
AXCL_EXPORT axclError axclrtExecWorker(const char *path, const int32_t *argc, const char *argv[], uint32_t *pid);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| path | in | Device path of the userworker executable. |
| argc | in | Optional pointer to the number of arguments in `argv`. NULL means zero arguments. |
| argv | in | Optional argument array. Required when `argc` points to a value greater than zero. |
| pid | out | Receives the Device process ID on success. |

#### Returns

- `AXCL_SUCC`: The userworker was started and initialized successfully.
- `others`: Failure.

#### Note

The returned PID is scoped to the current Device and is used by [axclrtKillWorker](#axclrtKillWorker), [axclrtWorkerSend](#axclrtWorkerSend), and [axclrtWorkerRecv](#axclrtWorkerRecv).

<br>

<a id="axclrtKillWorker"></a>

### axclrtKillWorker

Terminate and reap a userworker process.

#### Function

```c
AXCL_EXPORT axclError axclrtKillWorker(uint32_t pid);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| pid | in | Device process ID returned by [axclrtExecWorker](#axclrtExecWorker). |

#### Returns

- `AXCL_SUCC`: The process and its Host-side communication resources were released.
- `others`: Failure.

<br>

<a id="axclrtWorkerRecv"></a>

### axclrtWorkerRecv

Receive one complete message from a userworker process.

#### Function

```c
AXCL_EXPORT axclError axclrtWorkerRecv(uint32_t pid, void *buf, uint32_t bufsize, uint32_t *recvlen, int32_t timeout);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| pid | in | Device process ID returned by [axclrtExecWorker](#axclrtExecWorker). |
| buf | out | Buffer that receives the message. |
| bufsize | in | Capacity of `buf` in bytes. Must be greater than zero. |
| recvlen | out | Receives the complete message size. |
| timeout | in | Timeout in milliseconds. Use [NO_TIMEOUT](reference/macro.md#NO_TIMEOUT) to wait indefinitely. |

#### Returns

- `AXCL_SUCC`: The complete message was received successfully.
- `others`: Failure.

#### Note

If `bufsize` is too small, the function returns [AXCL_ERR_USRWORK_BUFFER_TOO_SMALL](reference/error.md#AXCL_ERR_USRWORK_BUFFER_TOO_SMALL), writes the required size to `recvlen`, and discards the message without copying a partial payload.

<br>

<a id="axclrtWorkerSend"></a>

### axclrtWorkerSend

Send one complete message to a userworker process.

#### Function

```c
AXCL_EXPORT axclError axclrtWorkerSend(uint32_t pid, const void *buf, uint32_t size, int32_t timeout);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| pid | in | Device process ID returned by [axclrtExecWorker](#axclrtExecWorker). |
| buf | in | Message data. |
| size | in | Message size in bytes. Must be greater than zero. |
| timeout | in | Timeout in milliseconds. Use [NO_TIMEOUT](reference/macro.md#NO_TIMEOUT) to wait indefinitely. |

#### Returns

- `AXCL_SUCC`: The complete message was sent successfully.
- `others`: Failure.
