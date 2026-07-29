# Environment Variables

This page summarizes the environment variables supported by the AXCL SDK and tools. Unless otherwise stated, set an environment variable before the related AXCL component is initialized.

## Quick Reference

| Environment Variable | Scope | Description |
|---|---|---|
| [AXCL_VISIBLE_DEVICES](#AXCL_VISIBLE_DEVICES) | SDK | Controls the devices visible to the current process. |
| [AXCL_LOG_DIR](#AXCL_LOG_DIR) | SDK / slave_daemon | Specifies the default log directory. |
| [AXCL_DUMP_DIR](#AXCL_DUMP_DIR) | Minidump | Specifies the minidump output directory. |
| [AXCL_CONSOLE_LEVEL](#AXCL_CONSOLE_LEVEL) | Logger | Sets the console log level. |
| [AXCL_SHELL_CMD_OUTPUT_LIMIT](#AXCL_SHELL_CMD_OUTPUT_LIMIT) | SDK | Sets the output limit for remote shell commands. |
| [AXCL_SHELL_TIMEOUT](#AXCL_SHELL_TIMEOUT) | `axcl-smi` | Sets the timeout for remote shell commands. |

## SDK Environment Variables

<a id="AXCL_VISIBLE_DEVICES"></a>

### AXCL_VISIBLE_DEVICES

Controls the physical devices visible to the current process and the mapping from logical device IDs to physical device IDs. Set it before calling [axclInit](../develop/c/system_api.md#axclInit).

For the value syntax, mapping rules, and examples, see [AXCL_VISIBLE_DEVICES device mapping](../develop/arch/concept.md#AXCL_VISIBLE_DEVICES).

<a id="AXCL_LOG_DIR"></a>

### AXCL_LOG_DIR

Specifies the default AXCL log directory. On Linux, the Host SDK uses `${AXCL_LOG_DIR}/axcl_host.log` as its default log file when the variable is set to a non-empty value; otherwise it uses `/tmp/axcl/axcl_host.log`. An explicit `log.host.path` configuration overrides this default. The Device daemon also uses this directory unless its log directory is explicitly specified with `-l`.

Set this variable before the AXCL logger is initialized.

<a id="AXCL_DUMP_DIR"></a>

### AXCL_DUMP_DIR

Specifies the minidump output directory for Host processes and Device workers. A non-empty value takes precedence over the API configuration or platform fallback directory. The selected directory must be writable; AXCL creates missing parent directories when possible.

Set this variable before calling [axclInitializeMinidump](../develop/c/minidump_api.md#axclInitializeMinidump).

<a id="AXCL_CONSOLE_LEVEL"></a>

### AXCL_CONSOLE_LEVEL

Sets the minimum AXCL console log level. If the variable is not set, the console level defaults to `warning`. Set it to an integer from `0` through `6`; other inputs are not supported.

| Value | Log Level |
|---|---|
| `0` | trace |
| `1` | debug |
| `2` | info |
| `3` | warning |
| `4` | error |
| `5` | critical |
| `6` | off |

Set this variable before the AXCL logger is first created. Changing it does not reconfigure an existing logger.

<a id="AXCL_SHELL_CMD_OUTPUT_LIMIT"></a>

### AXCL_SHELL_CMD_OUTPUT_LIMIT

Sets the maximum output, in bytes, that a remote shell command can return when the Host calls [axclrtControlExecuteShellCmd](../develop/c/control_api.md#axclrtControlExecuteShellCmd) and requests `output`. The default is `1048576` (1 MiB), and the maximum is `16777216` (16 MiB). Invalid values use the default; values above the maximum are clamped to the maximum. Output that reaches the limit is truncated without changing the command execution result.

## Tool Environment Variables

<a id="AXCL_SHELL_TIMEOUT"></a>

### AXCL_SHELL_TIMEOUT

Sets the timeout, in milliseconds, used by supported `axcl-smi` builds when executing remote shell commands on devices. The default is `10000`. This variable does not change the `timeout` argument explicitly passed by an application to [axclrtControlExecuteShellCmd](../develop/c/control_api.md#axclrtControlExecuteShellCmd).
