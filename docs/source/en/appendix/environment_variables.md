# Environment Variables

This page lists the environment variables supported by the AXCL SDK and tools. AXCL reads these variables once per process, the first time one of them is needed. Set them before the process starts, or at least before the first AXCL call; later changes do not take effect.

## Quick Reference

| Environment Variable | Scope | Description |
|---|---|---|
| [AXCL_VISIBLE_DEVICES](#AXCL_VISIBLE_DEVICES) | SDK | Controls the devices visible to the current process. |
| [AXCL_HOST_LOG_DIR](#AXCL_HOST_LOG_DIR) | Host SDK | Specifies the Host log directory. |
| [AXCL_DUMP_DIR](#AXCL_DUMP_DIR) | Minidump | Specifies the minidump output directory. |
| [AXCL_HOST_LOGFILE_LEVEL](#AXCL_HOST_LOGFILE_LEVEL) | Host SDK | Sets the Host log file level. |
| [AXCL_HOST_CONSOLE_LEVEL](#AXCL_HOST_CONSOLE_LEVEL) | Host SDK | Sets the Host console level. |
| [AXCL_DEVICE_WORKER_LOGFILE_LEVEL](#AXCL_DEVICE_WORKER_LOGFILE_LEVEL) | Host SDK | Sets the Device worker log file level. Set on the Host. |
| [AXCL_DEVICE_WORKER_CONSOLE_LEVEL](#AXCL_DEVICE_WORKER_CONSOLE_LEVEL) | Host SDK | Sets the Device worker console level. Set on the Host. |
| [AXCL_HOST_TICK_MASK](#AXCL_HOST_TICK_MASK) | Host SDK | Enables Host API latency ticks by category. Debugging only. |
| [AXCL_DEVICE_WORKER_TICK_MASK](#AXCL_DEVICE_WORKER_TICK_MASK) | Host SDK | Enables Device worker latency ticks by category. Set on the Host. Debugging only. |
| [AXCL_DEVICE_DAEMON_LOG_LEVEL](#AXCL_DEVICE_DAEMON_LOG_LEVEL) | slave_daemon | Sets the slave_daemon log file level. Set on the Device. |
| [AXCL_SHELL_CMD_OUTPUT_LIMIT](#AXCL_SHELL_CMD_OUTPUT_LIMIT) | Host SDK | Sets the maximum output returned by a remote shell command. |
| [AXCL_SMI_SHELL_TIMEOUT](#AXCL_SMI_SHELL_TIMEOUT) | `axcl-smi` | Sets the timeout of the shell commands that `axcl-smi` runs on a Device. |

## SDK Environment Variables

<a id="AXCL_VISIBLE_DEVICES"></a>

### AXCL_VISIBLE_DEVICES

Controls the physical devices visible to the current process and the mapping from logical device IDs to physical device IDs. Set it before calling [axclInit](../develop/c/system_api.md#axclInit).

For the value syntax, mapping rules, and examples, see [AXCL_VISIBLE_DEVICES device mapping](../develop/arch/concept.md#AXCL_VISIBLE_DEVICES).

<a id="AXCL_HOST_LOG_DIR"></a>

### AXCL_HOST_LOG_DIR

Specifies the Host log directory. When set to a non-empty value, the Host SDK writes its log to `${AXCL_HOST_LOG_DIR}/axcl_host.log`. When unset or empty, the log file is `/tmp/axcl/axcl_host.log` on Linux, or `axcl_host.log` in the `log` directory next to the executable on Windows. When `axcl-smi` cannot read some device information, it prints this path. The Device slave_daemon and workers use a fixed log directory and ignore this variable.

Set this variable before the first AXCL call in the process, such as [axclInitializeMinidump](../develop/c/minidump_api.md#axclInitializeMinidump) or [axclInit](../develop/c/system_api.md#axclInit).

<a id="AXCL_DUMP_DIR"></a>

### AXCL_DUMP_DIR

Specifies the minidump output directory. A non-empty value takes precedence over the directory passed to [axclInitializeMinidump](../develop/c/minidump_api.md#axclInitializeMinidump) and over the default directory (`/tmp` on Linux). AXCL creates the directory, including missing parents, if it does not exist; if the directory cannot be created or is not writable, `axclInitializeMinidump` fails.

On the Host, set this variable in the application environment before the first AXCL call in the process. On the Device, slave_daemon and its workers read it from the slave_daemon service environment, not from the Host. The AX8860 Debian image sets it to `/opt/data/axclDump` and periodically removes dump files older than 7 days; if it is unset, a worker writes minidumps to a `minidump` directory next to its log file.

<a id="AXCL_HOST_LOGFILE_LEVEL"></a>

### AXCL_HOST_LOGFILE_LEVEL

Sets the minimum level of the Host log file. Set it to an integer from `0` through `6`. If the variable is unset, empty, invalid, or outside this range, AXCL defaults to `warning` (`3`).

| Value | Log Level |
|---|---|
| `0` | trace |
| `1` | debug |
| `2` | info |
| `3` | warning |
| `4` | error |
| `5` | critical |
| `6` | off |

The level is applied in [axclInit](../develop/c/system_api.md#axclInit). To change it after initialization, call [axclrtSetLogLevel](../develop/c/other_api.md#axclrtSetLogLevel) with `AXCL_LOG_TARGET_HOST_RUNTIME_FILE`.

<a id="AXCL_HOST_CONSOLE_LEVEL"></a>

### AXCL_HOST_CONSOLE_LEVEL

Sets the minimum level of the Host console output. Uses the same `0` through `6` scale and `warning` (`3`) default as [AXCL_HOST_LOGFILE_LEVEL](#AXCL_HOST_LOGFILE_LEVEL). The console level and the log file level are independent. `axcl-smi` sets this variable to `6` (off) for itself when it is unset, so SDK log messages do not mix with its output. To change the level after initialization, call [axclrtSetLogLevel](../develop/c/other_api.md#axclrtSetLogLevel) with `AXCL_LOG_TARGET_HOST_RUNTIME_CONSOLE`.

<a id="AXCL_DEVICE_WORKER_LOGFILE_LEVEL"></a>

### AXCL_DEVICE_WORKER_LOGFILE_LEVEL

Sets the minimum level of the Device worker log file. Set it in the Host application environment: AXCL passes the value to each Device worker it starts, and setting it on the Device has no effect. Uses the same `0` through `6` scale and `warning` (`3`) default as [AXCL_HOST_LOGFILE_LEVEL](#AXCL_HOST_LOGFILE_LEVEL). To change the level after initialization, call [axclrtSetLogLevel](../develop/c/other_api.md#axclrtSetLogLevel) with `AXCL_LOG_TARGET_DEVICE_WORKER_FILE`.

<a id="AXCL_DEVICE_WORKER_CONSOLE_LEVEL"></a>

### AXCL_DEVICE_WORKER_CONSOLE_LEVEL

Sets the minimum level of the Device worker console output. Like [AXCL_DEVICE_WORKER_LOGFILE_LEVEL](#AXCL_DEVICE_WORKER_LOGFILE_LEVEL), set it in the Host application environment. Uses the same `0` through `6` scale and `warning` (`3`) default as [AXCL_HOST_LOGFILE_LEVEL](#AXCL_HOST_LOGFILE_LEVEL). The console level and the log file level are independent. To change the level after initialization, call [axclrtSetLogLevel](../develop/c/other_api.md#axclrtSetLogLevel) with `AXCL_LOG_TARGET_DEVICE_WORKER_CONSOLE`.

<a id="AXCL_HOST_TICK_MASK"></a>

### AXCL_HOST_TICK_MASK

For debugging only. Use under the guidance of technical support.

Enables per-call latency reports for the selected categories of Host APIs. The mask is applied in [axclInit](../develop/c/system_api.md#axclInit). Accepts a decimal or `0x`-prefixed hexadecimal integer from `0` through `0xFF`; unset, empty, invalid, or out-of-range values mean `0` (disabled).

| Bit | Category | Covered APIs |
|---|---|---|
| bit0 | engine | `axclrtEngine*` APIs that send a Device request, such as `axclrtEngineExecute`, `axclrtEngineExecuteAsync`, and `axclrtEngineLoadFromMem` |
| bit1 | event | `axclrtRecordEvent`, `axclrtStreamWaitEvent[WithTimeout]`, `axclrtSynchronizeEvent[WithTimeout]` |
| bit2 | stream | `axclrtSynchronizeStream[WithTimeout]` |
| bit3-7 | Reserved | - |

Each covered call prints one line to stderr in the form `[axcl][tick] <func> dur=<us>us enter=<tick> exit=<tick> freq=<Hz>Hz`. `enter` and `exit` are raw counter values of the Host clock and cannot be compared with Device values. Calling an API without a timeout, such as `axclrtSynchronizeStream`, also reports its `WithTimeout` variant, so two lines are printed: the `WithTimeout` line comes first, and the second line's duration includes the first.

<a id="AXCL_DEVICE_WORKER_TICK_MASK"></a>

### AXCL_DEVICE_WORKER_TICK_MASK

For debugging only. Use under the guidance of technical support.

Enables latency reports for the selected categories of Device worker processing. Set it in the Host application environment: AXCL passes the value to each Device worker it starts, so no Device configuration change or slave_daemon restart is needed. Uses the same value rules as [AXCL_HOST_TICK_MASK](#AXCL_HOST_TICK_MASK).

| Bit | Category | Covered APIs |
|---|---|---|
| bit0 | engine | Device-side processing of `axclrtEngine*` requests |
| bit1-7 | Reserved | - |

Reports use the same line format, written to the stderr of slave_daemon on the Device: with systemd, read them with `journalctl -u axcl-slave-daemon`; otherwise they appear on the Device console.

<a id="AXCL_DEVICE_DAEMON_LOG_LEVEL"></a>

### AXCL_DEVICE_DAEMON_LOG_LEVEL

Sets the minimum level of the slave_daemon log file. Set it in the slave_daemon environment on the Device; it takes effect when slave_daemon starts. Uses the same `0` through `6` scale as [AXCL_HOST_LOGFILE_LEVEL](#AXCL_HOST_LOGFILE_LEVEL). If unset or empty, the level is `info` (`2`); an invalid or out-of-range value also falls back to `info` and prints a warning to stderr. The log file is `slave_daemon.log` in `/opt/data/axclLog` by default. slave_daemon never writes log messages to the console.

<a id="AXCL_SHELL_CMD_OUTPUT_LIMIT"></a>

### AXCL_SHELL_CMD_OUTPUT_LIMIT

Sets the maximum output, in bytes, that [axclrtControlExecuteShellCmd](../develop/c/control_api.md#axclrtControlExecuteShellCmd) returns when the caller requests `output`. Set it in the Host application environment. The value is a decimal integer; the default is `1048576` (1 MiB) and the maximum is `16777216` (16 MiB). Invalid values use the default; larger values are clamped to the maximum. Output beyond the limit is dropped and a warning is written to the Host log; the return code of the command is not affected.

## Tool Environment Variables

<a id="AXCL_SMI_SHELL_TIMEOUT"></a>

### AXCL_SMI_SHELL_TIMEOUT

Sets the timeout, in milliseconds, of the shell commands that `axcl-smi` runs on a Device: the command of `axcl-smi sh`, the Device-side log packaging of `axcl-smi collect-log`, and the destination check of `axcl-smi push` without `-r`. The default is `10000` ms. Set it to a positive decimal integer, or `-1` to wait indefinitely. Zero, values less than `-1`, non-numeric values, and values that overflow use the default. This variable does not affect applications that call [axclrtControlExecuteShellCmd](../develop/c/control_api.md#axclrtControlExecuteShellCmd); they pass their own `timeout`.
