# Control

## Index

- [axclrtControlExecuteShellCmd](#axclrtControlExecuteShellCmd): Execute a shell command on the device associated with the calling thread's current Context.

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
| cmd | in | Shell command to execute. Must not be NULL. The command is passed to `sh -c` on the device. |
| args | in | Optional array of additional command text, or NULL. Each non-empty entry is appended to `cmd` after a single space, without quoting or escaping. NULL entries and empty strings are ignored. |
| argc | in | Number of entries to inspect in the `args` array. |
| output | out | Optional pointer that receives combined standard output and standard error as a C string. Output is limited by AXCL_SHELL_CMD_OUTPUT_LIMIT (1 MiB by default, 16 MiB maximum). Pass NULL to discard the output. It is set to NULL if the call fails before any text is available. |
| timeout | in | Timeout in milliseconds. Any negative value waits indefinitely; zero times out immediately. |

#### Returns

- `AXCL_SUCC`: The command completed with exit status 0.
- `others`: Failure.

#### Note

- The function fails if the shell exits with a non-zero status, is terminated by a signal, cannot be started, or cannot be monitored. In these cases, `output` receives the captured output, or a failure description if none was captured.
- The function fails if the command times out on the device or the Host RPC wait times out. In these cases, `output` receives a timeout message, appended to any captured output. After a Host RPC wait timeout, the device command state is unknown.
- `output` points to thread-local storage owned by the calling thread. It may be used only in that thread and must not be freed by the caller. The next call of this function in the same thread overwrites it. Copy the output if it must be retained.
- The command runs through `/bin/sh -c` with stdin connected to `/dev/null`; interactive commands and TTY use are not supported. stdout and stderr are merged.
- A finite timeout terminates the shell process group. A process that creates another session or process group may survive. Normal shell exit does not terminate background processes; background jobs should redirect stdout/stderr.
- Output truncation does not change a successful command result. The runner continues draining discarded output.
- The API returns text through a NUL-terminated C string and does not expose an output length. It is not suitable for retrieving binary output containing embedded NUL bytes.
- This API does not inspect, filter, or restrict the shell command. The device passes the command directly to `sh -c`, including potentially destructive commands such as `rm -rf`. Before execution, ensure that the command and its arguments come from trusted sources, contain the intended text, and have been validated as necessary.
