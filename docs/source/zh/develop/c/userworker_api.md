# Userworker

## 1. 目录

- [axclrtExecWorker](#axclrtExecWorker)：在当前 Context 所属的 Device 上启动 userworker 进程。
- [axclrtKillWorker](#axclrtKillWorker)：终止并回收 userworker 进程。
- [axclrtWorkerRecv](#axclrtWorkerRecv)：从 userworker 进程接收一条完整消息。
- [axclrtWorkerSend](#axclrtWorkerSend)：向 userworker 进程发送一条完整消息。

<br>

## 2. API

<a id="axclrtExecWorker"></a>

### 2.1. axclrtExecWorker

在当前 Context 所属的 Device 上启动 userworker 进程。

#### 2.1.1. 函数

```c
AXCL_EXPORT axclError axclrtExecWorker(const char *path, const int32_t *argc, const char *argv[], uint32_t *pid);
```

#### 2.1.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| path | in | userworker 可执行文件的 Device 路径。不能为 NULL 或空字符串。 |
| argc | in | 可选指针，指向 `argv` 中的参数数量。NULL 表示参数数量为零。该值不能为负数。 |
| argv | in | 可选的参数数组。当 `argc` 指向的值大于零时，本参数为必选参数。前 `argc` 所指数量的元素不能为 NULL。这些元素在程序名之后传递给 userworker，因此 userworker 收到的 `argv[0]` 为 `path`。 |
| pid | out | 成功时返回 Device 进程 ID，失败时返回 0。不能为 NULL。 |

#### 2.1.3. 返回值

- `AXCL_SUCC`：userworker 启动并初始化成功。
- 其他错误：失败。

#### 2.1.4. 说明

- 本函数阻塞，直到 userworker 成功调用 Device 侧 `axclrtWorkerInit` 函数。如果 userworker 退出、初始化失败或未在规定时间内完成初始化，本函数失败，并终止该进程。
- 返回的 PID 仅在当前 Context 所属的 Device 范围内有效。调用 [axclrtKillWorker](#axclrtKillWorker)、[axclrtWorkerSend](#axclrtWorkerSend) 和 [axclrtWorkerRecv](#axclrtWorkerRecv) 时，必须将同一 Device 的 Context 设为当前 Context。
- 每个已启动的 userworker 都应通过 [axclrtKillWorker](#axclrtKillWorker) 释放。重置 Device 或反初始化运行时，也会释放该 Device 上仍处于启动状态的 userworker 的 Host 侧资源，其 PID 随之失效。

<br>

<a id="axclrtKillWorker"></a>

### 2.2. axclrtKillWorker

终止并回收 userworker 进程。

#### 2.2.1. 函数

```c
AXCL_EXPORT axclError axclrtKillWorker(uint32_t pid);
```

#### 2.2.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| pid | in | [axclrtExecWorker](#axclrtExecWorker) 返回的 Device 进程 ID。 |

#### 2.2.3. 返回值

- `AXCL_SUCC`：进程及其 Host 侧通信资源已释放。
- 其他错误：失败。

#### 2.2.4. 说明

- 如果 userworker 已经退出，本函数仍会释放其 Host 侧资源，并返回 [AXCL_SUCC](reference/enum.md#AXCL_SUCC) 或 [AXCL_ERR_USRWORK_PROCESS_NOT_FOUND](reference/error.md#AXCL_ERR_USRWORK_PROCESS_NOT_FOUND)。PID 未知或已释放时，也返回后者。两种情况下该 PID 的生命周期均已结束。
- 发生其他失败时，PID 仍然有效，可以重试调用。

<br>

<a id="axclrtWorkerRecv"></a>

### 2.3. axclrtWorkerRecv

从 userworker 进程接收一条完整消息。

#### 2.3.1. 函数

```c
AXCL_EXPORT axclError axclrtWorkerRecv(uint32_t pid, void *buf, uint32_t bufsize, uint32_t *recvlen, int32_t timeout);
```

#### 2.3.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| pid | in | [axclrtExecWorker](#axclrtExecWorker) 返回的 Device 进程 ID。 |
| buf | out | 用于接收消息的 Host 内存。不能为 NULL，也不能是 Device 内存。 |
| bufsize | in | `buf` 的容量，单位为字节。必须大于零。 |
| recvlen | out | 返回完整消息的大小。不能为 NULL。未返回消息时置为 0。 |
| timeout | in | 超时时间，单位为毫秒。使用 [NO_TIMEOUT](reference/macro.md#NO_TIMEOUT) 表示无限等待；为 0 时，如果没有可用的完整消息，立即返回。其他负数无效。 |

#### 2.3.3. 返回值

- `AXCL_SUCC`：成功接收完整消息。
- 其他错误：失败。

#### 2.3.4. 说明

- 每次成功调用恰好返回一条消息，顺序与 userworker 发送消息的顺序一致。
- 如果本函数返回 [AXCL_ERR_USRWORK_BUFFER_TOO_SMALL](reference/error.md#AXCL_ERR_USRWORK_BUFFER_TOO_SMALL)，`recvlen` 中为该消息的大小，该消息被丢弃，不复制部分数据。之后的调用返回下一条消息，因此应按 userworker 可能发送的最大消息分配 `buf`。
- 如果本函数返回 [AXCL_ERR_USRWORK_PROCESS_NOT_FOUND](reference/error.md#AXCL_ERR_USRWORK_PROCESS_NOT_FOUND)，表示 PID 未知或 userworker 已退出。应停止使用该 PID 收发消息，并调用 [axclrtKillWorker](#axclrtKillWorker) 释放该 PID。如果 userworker 在交换任何消息之前就已退出，本函数也可能返回 [AXCL_ERR_USRWORK_OPEN_CHANNEL](reference/error.md#AXCL_ERR_USRWORK_OPEN_CHANNEL) 或超时。

<br>

<a id="axclrtWorkerSend"></a>

### 2.4. axclrtWorkerSend

向 userworker 进程发送一条完整消息。

#### 2.4.1. 函数

```c
AXCL_EXPORT axclError axclrtWorkerSend(uint32_t pid, const void *buf, uint32_t size, int32_t timeout);
```

#### 2.4.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| pid | in | [axclrtExecWorker](#axclrtExecWorker) 返回的 Device 进程 ID。 |
| buf | in | 存放消息数据的 Host 内存。不能为 NULL，也不能是 Device 内存。 |
| size | in | 消息大小，单位为字节。必须大于零。 |
| timeout | in | 超时时间，单位为毫秒。使用 [NO_TIMEOUT](reference/macro.md#NO_TIMEOUT) 表示无限等待；其他负数无效。 |

#### 2.4.3. 返回值

- `AXCL_SUCC`：成功发送完整消息。
- 其他错误：失败。

#### 2.4.4. 说明

- 消息按发送顺序投递给 userworker，并保留消息边界。
- 如果本函数返回 [AXCL_ERR_USRWORK_PROCESS_NOT_FOUND](reference/error.md#AXCL_ERR_USRWORK_PROCESS_NOT_FOUND)，表示 PID 未知或 userworker 已退出。应停止使用该 PID 收发消息，并调用 [axclrtKillWorker](#axclrtKillWorker) 释放该 PID。如果 userworker 在交换任何消息之前就已退出，本函数也可能返回 [AXCL_ERR_USRWORK_OPEN_CHANNEL](reference/error.md#AXCL_ERR_USRWORK_OPEN_CHANNEL) 或超时。
