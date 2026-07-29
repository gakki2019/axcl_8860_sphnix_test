# 控制

## 1. 目录

- [axclrtControlExecuteShellCmd](#axclrtControlExecuteShellCmd)：在调用线程当前 Context 所属的设备上执行 shell 命令。

<br>

## 2. API

<a id="axclrtControlExecuteShellCmd"></a>

### 2.1. axclrtControlExecuteShellCmd

在调用线程当前 Context 所属的设备上执行 shell 命令。

#### 2.1.1. 函数

```c
AXCL_EXPORT axclError axclrtControlExecuteShellCmd(const char *cmd, const char *const args[], size_t argc, const char **output, int32_t timeout);
```

#### 2.1.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| cmd | in | 要执行的 shell 命令。命令在设备上通过 `sh -c` 执行。 |
| args | in | 可选的附加命令文本数组。NULL 元素和空字符串会被忽略。 |
| argc | in | `args` 数组中需要检查的元素数量。 |
| output | out | 可选参数，以 C 字符串返回标准输出和标准错误的合并内容。输出受 `AXCL_SHELL_CMD_OUTPUT_LIMIT` 限制，默认 1 MiB，最大 16 MiB。 |
| timeout | in | 超时时间，单位为毫秒。任意负数表示无限等待，0 表示立即超时。 |

#### 2.1.3. 返回值

- `AXCL_SUCC`：命令执行完成，退出状态为 0。
- `AXCL_ERR_RT_SHELL_FAIL`：shell 非零退出、被信号终止、无法启动或无法正常监控。
- `AXCL_ERR_RT_TIMEOUT`：Device 命令执行超时或 Host RPC 等待超时。
- 其他错误：失败。

#### 2.1.4. 说明

- `output` 指向调用线程内部的线程局部存储（`thread-local storage`），仅可在该线程中使用，调用者不得释放该指针。如需长期保留输出，调用者应自行复制。
- 命令通过 `/bin/sh -c` 执行，stdin 连接到 `/dev/null`，stdout 和 stderr 合并；不支持交互命令和 TTY。
- 有限 timeout 会终止 shell process group。主动创建新 session 或 process group 的进程可能继续存活。shell 正常退出时不终止后台进程，长期后台任务应显式重定向 stdout/stderr。
- 输出截断不改变成功命令的返回结果，超出上限的数据仍会被读取并丢弃。
- API 不返回 output 长度，不适合获取包含内嵌 NUL 字节的二进制输出。
- 本接口不会检查、过滤或限制待执行的 shell 命令。命令将由设备上的 `sh -c` 直接解释并执行，包括 `rm -rf` 等可能删除数据或改变系统状态的危险命令。调用者应确保命令及其参数来源可信、内容符合预期，并在执行前进行必要的校验。
