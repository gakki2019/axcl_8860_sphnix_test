# Control

## Index

- [axclrtControlExecuteShellCmd](#axclrtControlExecuteShellCmd)

<br>

## API

<a id="axclrtControlExecuteShellCmd"></a>

### axclrtControlExecuteShellCmd

Execute a shell command on the device associated with the calling thread's current Context.

#### Function

```c
AXCL_EXPORT axclError axclrtControlExecuteShellCmd(const char *cmd, const char *const args[], size_t argc, const char **output, int32_t timeout);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| cmd | in | Shell command to execute. The command is passed to `sh -c` on the device. |
| args | in | Optional array of additional command text. NULL entries and empty strings are ignored. |
| argc | in | Number of entries to inspect in the `args` array. |
| output | out | Optional pointer that receives the combined standard output and standard error. |
| timeout | in | Timeout in milliseconds. -1 waits indefinitely. |

#### Returns

- `AXCL_SUCC`: The command completed with exit status 0.
- `others`: Failure.

#### Note

- `output` points to thread-local storage owned by the calling thread. It may be used only in that thread and must not be freed by the caller. Copy the output if it must be retained.
- This API does not inspect, filter, or restrict the shell command. The device passes the command directly to `sh -c`, including potentially destructive commands such as `rm -rf`. Before execution, ensure that the command and its arguments come from trusted sources, contain the intended text, and have been validated as necessary.
