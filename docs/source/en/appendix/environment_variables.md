# Environment Variables

This page summarizes the environment variables supported by the AXCL SDK and tools. AXCL captures these variables in a process-wide snapshot when an AXCL component first queries the environment. Set them before initializing any AXCL component; changes made afterward do not take effect.

## Quick Reference

| Environment Variable | Scope | Description |
|---|---|---|
| [AXCL_VISIBLE_DEVICES](#AXCL_VISIBLE_DEVICES) | SDK | Controls the devices visible to the current process. |
| [AXCL_HOST_LOG_DIR](#AXCL_HOST_LOG_DIR) | Host SDK | Specifies the Host log directory. |
| [AXCL_DUMP_DIR](#AXCL_DUMP_DIR) | Minidump | Specifies the minidump output directory. |
| [AXCL_HOST_LOGFILE_LEVEL](#AXCL_HOST_LOGFILE_LEVEL) | Host SDK | Sets the Host log file level. |
| [AXCL_HOST_CONSOLE_LEVEL](#AXCL_HOST_CONSOLE_LEVEL) | Host SDK | Sets the Host console level. |
| [AXCL_DEVICE_WORKER_LOGFILE_LEVEL](#AXCL_DEVICE_WORKER_LOGFILE_LEVEL) | Host SDK | Sets the Device worker log file level (passed to the worker). |
| [AXCL_DEVICE_WORKER_CONSOLE_LEVEL](#AXCL_DEVICE_WORKER_CONSOLE_LEVEL) | Host SDK | Sets the Device worker console level (passed to the worker). |
| [AXCL_HOST_TICK_MASK](#AXCL_HOST_TICK_MASK) | Host SDK | Sets the category mask of Host API latency ticks. |
| [AXCL_DEVICE_WORKER_TICK_MASK](#AXCL_DEVICE_WORKER_TICK_MASK) | Host SDK | Sets the category mask of Device worker latency ticks (passed to the worker). |
| [AXCL_DEVICE_DAEMON_LOG_LEVEL](#AXCL_DEVICE_DAEMON_LOG_LEVEL) | slave_daemon | Sets the slave_daemon log file level. |
| [AXCL_SHELL_CMD_OUTPUT_LIMIT](#AXCL_SHELL_CMD_OUTPUT_LIMIT) | SDK | Sets the output limit for remote shell commands. |
| [AXCL_SMI_SHELL_TIMEOUT](#AXCL_SMI_SHELL_TIMEOUT) | `axcl-smi` | Overrides the timeout for remote shell commands. |

## SDK Environment Variables

<a id="AXCL_VISIBLE_DEVICES"></a>

### AXCL_VISIBLE_DEVICES

Controls the physical devices visible to the current process and the mapping from logical device IDs to physical device IDs. Set it before calling [axclInit](../develop/c/system_api.md#axclInit).

For the value syntax, mapping rules, and examples, see [AXCL_VISIBLE_DEVICES device mapping](../develop/arch/concept.md#AXCL_VISIBLE_DEVICES).

<a id="AXCL_HOST_LOG_DIR"></a>

### AXCL_HOST_LOG_DIR

Specifies the Host log directory on all platforms. When set to a non-empty value, the Host SDK uses `${AXCL_HOST_LOG_DIR}/axcl_host.log` as its log file. When unset, it falls back to `/tmp/axcl/axcl_host.log` on Linux, or to `axcl_host.log` under the `log` directory next to the executable on Windows. The Device slave_daemon and workers use a fixed log directory and do not read this variable.

Set this variable before any AXCL component first queries the environment.

<a id="AXCL_DUMP_DIR"></a>

### AXCL_DUMP_DIR

Specifies the minidump output directory for Host processes and Device workers. A non-empty value takes precedence over the API configuration or platform fallback directory. The selected directory must be writable; AXCL creates missing parent directories when possible.

Set this variable before calling [axclInitializeMinidump](../develop/c/minidump_api.md#axclInitializeMinidump).

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

Set this variable before the AXCL logger is first created. Changing it does not reconfigure an existing logger. At runtime, use [axclrtSetLogLevel](../develop/c/other_api.md#axclrtSetLogLevel) with `AXCL_LOG_TARGET_HOST_RUNTIME_FILE`.

<a id="AXCL_HOST_CONSOLE_LEVEL"></a>

### AXCL_HOST_CONSOLE_LEVEL

Sets the minimum level of the Host console output. Uses the same `0` through `6` scale and `warning` (`3`) default as [AXCL_HOST_LOGFILE_LEVEL](#AXCL_HOST_LOGFILE_LEVEL). Console output is not written to the log file. At runtime, use [axclrtSetLogLevel](../develop/c/other_api.md#axclrtSetLogLevel) with `AXCL_LOG_TARGET_HOST_RUNTIME_CONSOLE`.

<a id="AXCL_DEVICE_WORKER_LOGFILE_LEVEL"></a>

### AXCL_DEVICE_WORKER_LOGFILE_LEVEL

Sets the minimum level of the Device worker log file. This variable is read by the Host and passed to each spawned worker; the worker does not read its own environment. Uses the same `0` through `6` scale and `warning` (`3`) default as [AXCL_HOST_LOGFILE_LEVEL](#AXCL_HOST_LOGFILE_LEVEL). At runtime, use [axclrtSetLogLevel](../develop/c/other_api.md#axclrtSetLogLevel) with `AXCL_LOG_TARGET_DEVICE_WORKER_FILE`.

<a id="AXCL_DEVICE_WORKER_CONSOLE_LEVEL"></a>

### AXCL_DEVICE_WORKER_CONSOLE_LEVEL

Sets the minimum level of the Device worker console output. This variable is read by the Host and passed to each spawned worker. Uses the same `0` through `6` scale and `warning` (`3`) default as [AXCL_HOST_LOGFILE_LEVEL](#AXCL_HOST_LOGFILE_LEVEL). Console output is not written to the log file. At runtime, use [axclrtSetLogLevel](../develop/c/other_api.md#axclrtSetLogLevel) with `AXCL_LOG_TARGET_DEVICE_WORKER_CONSOLE`.

<a id="AXCL_HOST_TICK_MASK"></a>

### AXCL_HOST_TICK_MASK

Sets the category mask of Host API latency ticks, read in [axclInit](../develop/c/system_api.md#axclInit). Accepts a decimal or `0x`-prefixed hexadecimal integer from `0` through `0xFF`; unset, empty, invalid, or out-of-range values mean `0` (disabled).

| Bit | Category | Covered APIs |
|---|---|---|
| bit0 | engine | `axclrtEngine*` APIs that send a Device request, such as `axclrtEngineExecute`, `axclrtEngineExecuteAsync`, and `axclrtEngineLoadFromMem` |
| bit1 | event | `axclrtRecordEvent`, `axclrtStreamWaitEvent[WithTimeout]`, `axclrtSynchronizeEvent[WithTimeout]` |
| bit2 | stream | `axclrtSynchronizeStream[WithTimeout]` |
| bit3-7 | Reserved | - |

Each call prints one stderr line in the form `[axcl][tick] <func> dur=<us>us enter=<tick> exit=<tick> freq=<Hz>Hz`. `enter`/`exit` are raw values of the local counter and cannot be compared with the Device side. An API without a timeout calls its timeout variant, so both print a line and the outer duration includes the inner one.

<a id="AXCL_DEVICE_WORKER_TICK_MASK"></a>

### AXCL_DEVICE_WORKER_TICK_MASK

Sets the category mask of Device worker latency ticks. This variable is read by the Host and passed to each spawned worker; the worker does not read its own environment, so no Device configuration change or slave_daemon restart is needed. Uses the same value rules as [AXCL_HOST_TICK_MASK](#AXCL_HOST_TICK_MASK); reserved bits are passed through as-is.

| Bit | Category | Covered APIs |
|---|---|---|
| bit0 | engine | All worker handlers of `axclrtEngine*` requests, such as `handle_Run` |
| bit1-7 | Reserved | - |

The worker inherits stderr from slave_daemon: under systemd it goes to the journal (`journalctl -u axcl-slave-daemon`); under inittab it goes to the console.

<a id="AXCL_DEVICE_DAEMON_LOG_LEVEL"></a>

### AXCL_DEVICE_DAEMON_LOG_LEVEL

Sets the minimum level of the slave_daemon log file, read directly by the daemon on the Device. Uses the same `0` through `6` scale; if unset, empty, invalid, or out of range, the daemon defaults to `info` (`2`). The daemon console output is always disabled.

<a id="AXCL_SHELL_CMD_OUTPUT_LIMIT"></a>

### AXCL_SHELL_CMD_OUTPUT_LIMIT

Sets the maximum output, in bytes, that a remote shell command can return when the Host calls [axclrtControlExecuteShellCmd](../develop/c/control_api.md#axclrtControlExecuteShellCmd) and requests `output`. The default is `1048576` (1 MiB), and the maximum is `16777216` (16 MiB). Invalid values use the default; values above the maximum are clamped to the maximum. Output that reaches the limit is truncated without changing the command execution result.

## Tool Environment Variables

<a id="AXCL_SMI_SHELL_TIMEOUT"></a>

### AXCL_SMI_SHELL_TIMEOUT

Overrides the timeout, in milliseconds, used by `axcl-smi` when executing remote shell commands on devices. The default is `10000` ms. Set it to a positive decimal integer, or `-1` to wait indefinitely. Invalid values, zero, values less than `-1`, or overflowing values use the default. This variable does not change the `timeout` argument explicitly passed by an application to [axclrtControlExecuteShellCmd](../develop/c/control_api.md#axclrtControlExecuteShellCmd).
