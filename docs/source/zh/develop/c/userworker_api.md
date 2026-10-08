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
| path | in | userworker 可执行文件的 Device 路径。 |
| argc | in | 可选指针，指向 `argv` 中的参数数量。NULL 表示参数数量为零。 |
| argv | in | 可选的参数数组。当 `argc` 指向的值大于零时，本参数为必选参数。 |
| pid | out | 成功时返回 Device 进程 ID。 |

#### 2.1.3. 返回值

- `AXCL_SUCC`：userworker 启动并初始化成功。
- 其他错误：失败。

#### 2.1.4. 说明

返回的 PID 仅在当前 Device 范围内有效，供 [axclrtKillWorker](#axclrtKillWorker)、[axclrtWorkerSend](#axclrtWorkerSend) 和 [axclrtWorkerRecv](#axclrtWorkerRecv) 使用。

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
| buf | out | 用于接收消息的缓冲区。 |
| bufsize | in | `buf` 的容量，单位为字节。必须大于零。 |
| recvlen | out | 返回完整消息的大小。 |
| timeout | in | 超时时间，单位为毫秒。使用 [NO_TIMEOUT](reference/macro.md#NO_TIMEOUT) 表示无限等待。 |

#### 2.3.3. 返回值

- `AXCL_SUCC`：成功接收完整消息。
- 其他错误：失败。

#### 2.3.4. 说明

如果 `bufsize` 太小，本函数返回 [AXCL_ERR_USRWORK_BUFFER_TOO_SMALL](reference/error.md#AXCL_ERR_USRWORK_BUFFER_TOO_SMALL)，通过 `recvlen` 返回所需大小，并丢弃该消息，不复制部分数据。

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
| buf | in | 消息数据。 |
| size | in | 消息大小，单位为字节。必须大于零。 |
| timeout | in | 超时时间，单位为毫秒。使用 [NO_TIMEOUT](reference/macro.md#NO_TIMEOUT) 表示无限等待。 |

#### 2.4.3. 返回值

- `AXCL_SUCC`：成功发送完整消息。
- 其他错误：失败。
