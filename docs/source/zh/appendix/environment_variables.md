# 环境变量

本页汇总 AXCL SDK 和工具支持的环境变量。AXCL 在任一组件首次查询环境配置时生成进程级快照。应在初始化任何 AXCL 组件前设置这些变量；快照生成后再修改不会生效。

## 快速索引

| 环境变量 | 适用范围 | 说明 |
|---|---|---|
| [AXCL_VISIBLE_DEVICES](#AXCL_VISIBLE_DEVICES) | SDK | 控制当前进程可见的设备。 |
| [AXCL_HOST_LOG_DIR](#AXCL_HOST_LOG_DIR) | Host SDK | 指定 Host 日志目录。 |
| [AXCL_DUMP_DIR](#AXCL_DUMP_DIR) | Minidump | 指定 minidump 输出目录。 |
| [AXCL_HOST_LOGFILE_LEVEL](#AXCL_HOST_LOGFILE_LEVEL) | Host SDK | 设置 Host 日志文件级别。 |
| [AXCL_HOST_CONSOLE_LEVEL](#AXCL_HOST_CONSOLE_LEVEL) | Host SDK | 设置 Host 控制台级别。 |
| [AXCL_DEVICE_WORKER_LOGFILE_LEVEL](#AXCL_DEVICE_WORKER_LOGFILE_LEVEL) | Host SDK | 设置 Device worker 日志文件级别（下发给 worker）。 |
| [AXCL_DEVICE_WORKER_CONSOLE_LEVEL](#AXCL_DEVICE_WORKER_CONSOLE_LEVEL) | Host SDK | 设置 Device worker 控制台级别（下发给 worker）。 |
| [AXCL_DEVICE_DAEMON_LOG_LEVEL](#AXCL_DEVICE_DAEMON_LOG_LEVEL) | slave_daemon | 设置 slave_daemon 日志文件级别。 |
| [AXCL_SHELL_CMD_OUTPUT_LIMIT](#AXCL_SHELL_CMD_OUTPUT_LIMIT) | SDK | 设置远端 shell 命令的输出上限。 |
| [AXCL_SMI_SHELL_TIMEOUT](#AXCL_SMI_SHELL_TIMEOUT) | `axcl-smi` | 覆盖远端 shell 命令超时。 |

## SDK 环境变量

<a id="AXCL_VISIBLE_DEVICES"></a>

### AXCL_VISIBLE_DEVICES

控制当前进程可见的物理设备集合，以及逻辑设备 ID 到物理设备 ID 的映射。应在调用 [axclInit](../develop/c/system_api.md#axclInit) 前设置。

取值格式、映射规则和示例参见 [AXCL_VISIBLE_DEVICES 设备映射说明](../develop/arch/concept.md#AXCL_VISIBLE_DEVICES)。

<a id="AXCL_HOST_LOG_DIR"></a>

### AXCL_HOST_LOG_DIR

指定 Host 日志目录，在所有平台生效。设置为非空值时，Host SDK 使用 `${AXCL_HOST_LOG_DIR}/axcl_host.log` 作为日志文件。未设置时，在 Linux 上回退为 `/tmp/axcl/axcl_host.log`，在 Windows 上回退为可执行文件同级 `log` 目录下的 `axcl_host.log`。Device 的 slave_daemon 与 worker 使用固定日志目录，不读取该变量。

应在任一 AXCL 组件首次查询环境前设置该变量。

<a id="AXCL_DUMP_DIR"></a>

### AXCL_DUMP_DIR

指定 Host 进程和 Device worker 的 minidump 输出目录。设置为非空值时，其优先级高于 API 配置或平台回退目录。选定的目录必须可写；目录不存在时，AXCL 会尝试创建缺失的父目录。

应在调用 [axclInitializeMinidump](../develop/c/minidump_api.md#axclInitializeMinidump) 前设置该变量。

<a id="AXCL_HOST_LOGFILE_LEVEL"></a>

### AXCL_HOST_LOGFILE_LEVEL

设置 Host 日志文件的最低输出级别。该变量应设置为 `0`～`6` 的整数。未设置、空值、无效值或超出该范围时，AXCL 默认使用 `warning`（`3`）。

| 值 | 日志级别 |
|---|---|
| `0` | trace |
| `1` | debug |
| `2` | info |
| `3` | warning |
| `4` | error |
| `5` | critical |
| `6` | off |

应在 AXCL Logger 首次创建前设置该变量。修改该变量不会重新配置已经创建的 Logger。运行时可用 [axclrtSetLogLevel](../develop/c/other_api.md#axclrtSetLogLevel) 配合 `AXCL_LOG_TARGET_HOST_RUNTIME_FILE` 动态修改。

<a id="AXCL_HOST_CONSOLE_LEVEL"></a>

### AXCL_HOST_CONSOLE_LEVEL

设置 Host 控制台输出的最低级别。取值范围与默认值同 [AXCL_HOST_LOGFILE_LEVEL](#AXCL_HOST_LOGFILE_LEVEL)（`0`～`6`，默认 `warning`）。控制台输出不写入日志文件。运行时可用 [axclrtSetLogLevel](../develop/c/other_api.md#axclrtSetLogLevel) 配合 `AXCL_LOG_TARGET_HOST_RUNTIME_CONSOLE` 动态修改。

<a id="AXCL_DEVICE_WORKER_LOGFILE_LEVEL"></a>

### AXCL_DEVICE_WORKER_LOGFILE_LEVEL

设置 Device worker 日志文件的最低级别。该变量由 Host 读取并下发给每个 spawn 的 worker；worker 不读取自身环境。取值范围与默认值同 [AXCL_HOST_LOGFILE_LEVEL](#AXCL_HOST_LOGFILE_LEVEL)（`0`～`6`，默认 `warning`）。运行时可用 [axclrtSetLogLevel](../develop/c/other_api.md#axclrtSetLogLevel) 配合 `AXCL_LOG_TARGET_DEVICE_WORKER_FILE` 动态修改。

<a id="AXCL_DEVICE_WORKER_CONSOLE_LEVEL"></a>

### AXCL_DEVICE_WORKER_CONSOLE_LEVEL

设置 Device worker 控制台输出的最低级别。该变量由 Host 读取并下发给每个 spawn 的 worker。取值范围与默认值同 [AXCL_HOST_LOGFILE_LEVEL](#AXCL_HOST_LOGFILE_LEVEL)（`0`～`6`，默认 `warning`）。控制台输出不写入日志文件。运行时可用 [axclrtSetLogLevel](../develop/c/other_api.md#axclrtSetLogLevel) 配合 `AXCL_LOG_TARGET_DEVICE_WORKER_CONSOLE` 动态修改。

<a id="AXCL_DEVICE_DAEMON_LOG_LEVEL"></a>

### AXCL_DEVICE_DAEMON_LOG_LEVEL

设置 slave_daemon 日志文件的最低级别，由 Device 上的 daemon 直接读取。取值范围为 `0`～`6`；未设置、空值、无效值或超出范围时，daemon 默认使用 `info`（`2`）。daemon 的控制台输出始终关闭。

<a id="AXCL_SHELL_CMD_OUTPUT_LIMIT"></a>

### AXCL_SHELL_CMD_OUTPUT_LIMIT

设置 Host 调用 [axclrtControlExecuteShellCmd](../develop/c/control_api.md#axclrtControlExecuteShellCmd) 并请求返回 `output` 时，远端 shell 命令可返回的最大输出量，单位为字节。默认值为 `1048576`（1 MiB），最大值为 `16777216`（16 MiB）。无效值使用默认值；超过最大值时按最大值处理。达到上限的输出会被截断，但不会改变命令的执行结果。

## 工具环境变量

<a id="AXCL_SMI_SHELL_TIMEOUT"></a>

### AXCL_SMI_SHELL_TIMEOUT

覆盖 `axcl-smi` 在设备上执行远端 shell 命令时使用的超时时间，单位为毫秒，默认值为 `10000` ms。该变量应设置为正十进制整数，或使用 `-1` 表示无限等待。无效值、零、小于 `-1` 的值或溢出值使用默认值。该变量不会修改应用调用 [axclrtControlExecuteShellCmd](../develop/c/control_api.md#axclrtControlExecuteShellCmd) 时显式传入的 `timeout` 参数。
