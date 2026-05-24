# Control

## Index

- [axclrtControlExecuteShellCmd](#axclrtControlExecuteShellCmd)

<br>

## API

<a id="axclrtControlExecuteShellCmd"></a>

### axclrtControlExecuteShellCmd

Execute a shell command.

#### Function

```c
AXCL_EXPORT axclError axclrtControlExecuteShellCmd(const char *cmd, const char *const args[], size_t argc, const char **output, int32_t timeout);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| cmd | in | The command to execute. |
| args | in | The arguments to the command. |
| argc | in | The number of arguments. |
| output | out | The output of the command. |
| timeout | in | The timeout in milliseconds. |

#### Returns

- `AXCL_SUCC`: success.
- `others`: failure.
