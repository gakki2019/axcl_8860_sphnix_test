# 控制

## 1. 目录

- [axclrtControlExecuteShellCmd](#axclrtControlExecuteShellCmd)

<br>

## 2. API

<a id="axclrtControlExecuteShellCmd"></a>

### 2.1. axclrtControlExecuteShellCmd

执行 Shell 命令。

#### 2.1.1. 函数

```c
AXCL_EXPORT axclError axclrtControlExecuteShellCmd(const char *cmd, const char *const args[], size_t argc, const char **output, int32_t timeout);
```

#### 2.1.2. 参数

| 名称    | 方向 | 说明                   |
| ------- | ---- | ---------------------- |
| cmd     | in   | 要执行的命令。         |
| args    | in   | 命令参数。             |
| argc    | in   | 参数数量。             |
| output  | out  | 命令输出。             |
| timeout | in   | 超时时间，单位为毫秒。 |

#### 2.1.3. 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。
