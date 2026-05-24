# 控制

## 目录

- [axclrtControlExecuteShellCmd](#axclrtControlExecuteShellCmd)

<br>

## API

<a id="axclrtControlExecuteShellCmd"></a>

### axclrtControlExecuteShellCmd

执行 Shell 命令。

#### 函数

```c
AXCL_EXPORT axclError axclrtControlExecuteShellCmd(const char *cmd, const char *const args[], size_t argc, const char **output, int32_t timeout);
```

#### 参数

| 名称    | 方向 | 说明                   |
| ------- | ---- | ---------------------- |
| cmd     | in   | 要执行的命令。         |
| args    | in   | 命令参数。             |
| argc    | in   | 参数数量。             |
| output  | out  | 命令输出。             |
| timeout | in   | 超时时间，单位为毫秒。 |

#### 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。
