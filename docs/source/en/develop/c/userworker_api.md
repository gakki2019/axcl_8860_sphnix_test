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
| path | in | Device path of the userworker executable. Must not be NULL or empty. |
| argc | in | Optional pointer to the number of arguments in `argv`. NULL means zero arguments. The value must not be negative. |
| argv | in | Optional argument array. Required when `argc` points to a value greater than zero. The first entries counted by `argc` must not be NULL. The entries are passed to the userworker after its program name, so the userworker receives `path` as `argv[0]`. |
| pid | out | Receives the Device process ID on success, or zero on failure. Must not be NULL. |

#### Returns

- `AXCL_SUCC`: The userworker was started and initialized successfully.
- `others`: Failure.

#### Note

- This function blocks until the userworker successfully calls the Device-side `axclrtWorkerInit` function. If the userworker exits, fails to initialize, or does not initialize in time, this function fails and the process is terminated.
- The returned PID is scoped to the Device of the current Context. Call [axclrtKillWorker](#axclrtKillWorker), [axclrtWorkerSend](#axclrtWorkerSend), and [axclrtWorkerRecv](#axclrtWorkerRecv) with a Context of the same Device current.
- Release each started userworker with [axclrtKillWorker](#axclrtKillWorker). Resetting the Device or finalizing the runtime also releases the Host-side resources of userworkers still started on that Device, and their PIDs become invalid.

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

#### Note

- If the userworker has already exited, this function still releases its Host-side resources and returns [AXCL_SUCC](reference/enum.md#AXCL_SUCC) or [AXCL_ERR_USRWORK_PROCESS_NOT_FOUND](reference/error.md#AXCL_ERR_USRWORK_PROCESS_NOT_FOUND). The latter is also returned for an unknown or already released PID. In both cases the PID's lifetime has ended.
- On other failures, the PID remains valid and the call can be retried.

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
| buf | out | Host memory that receives the message. Must not be NULL or Device memory. |
| bufsize | in | Capacity of `buf` in bytes. Must be greater than zero. |
| recvlen | out | Receives the complete message size. Must not be NULL. Set to zero when no message is returned. |
| timeout | in | Timeout in milliseconds. Use [NO_TIMEOUT](reference/macro.md#NO_TIMEOUT) to wait indefinitely; zero returns immediately if no complete message is available. Other negative values are invalid. |

#### Returns

- `AXCL_SUCC`: The complete message was received successfully.
- `others`: Failure.

#### Note

- Each successful call returns exactly one message, in the order the userworker sent them.
- If this function returns [AXCL_ERR_USRWORK_BUFFER_TOO_SMALL](reference/error.md#AXCL_ERR_USRWORK_BUFFER_TOO_SMALL), `recvlen` holds the size of the message, and the message is discarded without copying a partial payload. A later call returns the next message, so size `buf` for the largest message the userworker can send.
- If this function returns [AXCL_ERR_USRWORK_PROCESS_NOT_FOUND](reference/error.md#AXCL_ERR_USRWORK_PROCESS_NOT_FOUND), the PID is unknown or the userworker has exited. Stop sending and receiving with this PID, and call [axclrtKillWorker](#axclrtKillWorker) to release it. If the userworker exits before any message has been exchanged, this function may instead return [AXCL_ERR_USRWORK_OPEN_CHANNEL](reference/error.md#AXCL_ERR_USRWORK_OPEN_CHANNEL) or time out.

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
| buf | in | Host memory that holds the message data. Must not be NULL or Device memory. |
| size | in | Message size in bytes. Must be greater than zero. |
| timeout | in | Timeout in milliseconds. Use [NO_TIMEOUT](reference/macro.md#NO_TIMEOUT) to wait indefinitely; other negative values are invalid. |

#### Returns

- `AXCL_SUCC`: The complete message was sent successfully.
- `others`: Failure.

#### Note

- Messages are delivered to the userworker in send order, and message boundaries are preserved.
- If this function returns [AXCL_ERR_USRWORK_PROCESS_NOT_FOUND](reference/error.md#AXCL_ERR_USRWORK_PROCESS_NOT_FOUND), the PID is unknown or the userworker has exited. Stop sending and receiving with this PID, and call [axclrtKillWorker](#axclrtKillWorker) to release it. If the userworker exits before any message has been exchanged, this function may instead return [AXCL_ERR_USRWORK_OPEN_CHANNEL](reference/error.md#AXCL_ERR_USRWORK_OPEN_CHANNEL) or time out.
