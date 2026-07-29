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
| cmd | in | Shell command to execute. The command is passed to `sh -c` on the device. |
| args | in | Optional array of additional command text. NULL entries and empty strings are ignored. |
| argc | in | Number of entries to inspect in the `args` array. |
| output | out | Optional pointer that receives combined standard output and standard error as a C string. Output is limited by AXCL_SHELL_CMD_OUTPUT_LIMIT (1 MiB by default, 16 MiB maximum). |
| timeout | in | Timeout in milliseconds. Any negative value waits indefinitely; zero times out immediately. |

#### Returns

- `AXCL_SUCC`: The command completed with exit status 0.
- `AXCL_ERR_RT_SHELL_FAIL`: The shell exited unsuccessfully, was terminated by a signal, could not be started, or could not be monitored.
- `AXCL_ERR_RT_TIMEOUT`: The command timed out on the device or the Host RPC wait timed out.
- `others`: Failure.

#### Note

- `output` points to thread-local storage owned by the calling thread. It may be used only in that thread and must not be freed by the caller. Copy the output if it must be retained.
- The command runs through `/bin/sh -c` with stdin connected to `/dev/null`; interactive commands and TTY use are not supported. stdout and stderr are merged.
- A finite timeout terminates the shell process group. A process that creates another session or process group may survive. Normal shell exit does not terminate background processes; background jobs should redirect stdout/stderr.
- Output truncation does not change a successful command result. The runner continues draining discarded output.
- The API returns text through a NUL-terminated C string and does not expose an output length. It is not suitable for retrieving binary output containing embedded NUL bytes.
- This API does not inspect, filter, or restrict the shell command. The device passes the command directly to `sh -c`, including potentially destructive commands such as `rm -rf`. Before execution, ensure that the command and its arguments come from trusted sources, contain the intended text, and have been validated as necessary.
