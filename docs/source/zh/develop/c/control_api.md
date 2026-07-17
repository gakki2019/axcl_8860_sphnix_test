# 控制

## 1. 目录

- [axclrtControlExecuteShellCmd](#axclrtControlExecuteShellCmd)

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
| output | out | 可选参数，用于返回标准输出和标准错误的合并内容。 |
| timeout | in | 超时时间，单位为毫秒。-1 表示无限期等待。 |

#### 2.1.3. 返回值

- `AXCL_SUCC`：命令执行完成，退出状态为 0。
- 其他错误：失败。

#### 2.1.4. 说明

- `output` 指向调用线程内部的线程局部存储（`thread-local storage`），仅可在该线程中使用，调用者不得释放该指针。如需长期保留输出，调用者应自行复制。
- 本接口不会检查、过滤或限制待执行的 shell 命令。命令将由设备上的 `sh -c` 直接解释并执行，包括 `rm -rf` 等可能删除数据或改变系统状态的危险命令。调用者应确保命令及其参数来源可信、内容符合预期，并在执行前进行必要的校验。
