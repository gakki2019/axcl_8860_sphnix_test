# 环境变量

本页列出 AXCL SDK 和工具支持的环境变量。在每个进程中，AXCL 会在首次需要其中任一变量时读取一次这些变量。请在进程启动前设置，或至少在首次调用 AXCL 前设置；之后的修改不会生效。

## 快速索引

| 环境变量 | 适用范围 | 说明 |
|---|---|---|
| [AXCL_VISIBLE_DEVICES](#AXCL_VISIBLE_DEVICES) | SDK | 控制当前进程可见的设备。 |
| [AXCL_HOST_LOG_DIR](#AXCL_HOST_LOG_DIR) | Host SDK | 指定 Host 日志目录。 |
| [AXCL_DUMP_DIR](#AXCL_DUMP_DIR) | Minidump | 指定 minidump 输出目录。 |
| [AXCL_HOST_LOGFILE_LEVEL](#AXCL_HOST_LOGFILE_LEVEL) | Host SDK | 设置 Host 日志文件级别。 |
| [AXCL_HOST_CONSOLE_LEVEL](#AXCL_HOST_CONSOLE_LEVEL) | Host SDK | 设置 Host 控制台级别。 |
| [AXCL_DEVICE_WORKER_LOGFILE_LEVEL](#AXCL_DEVICE_WORKER_LOGFILE_LEVEL) | Host SDK | 设置 Device worker 日志文件级别。在 Host 上设置。 |
| [AXCL_DEVICE_WORKER_CONSOLE_LEVEL](#AXCL_DEVICE_WORKER_CONSOLE_LEVEL) | Host SDK | 设置 Device worker 控制台级别。在 Host 上设置。 |
| [AXCL_HOST_TICK_MASK](#AXCL_HOST_TICK_MASK) | Host SDK | 按类别启用 Host API 耗时打点。仅用于调试。 |
| [AXCL_DEVICE_WORKER_TICK_MASK](#AXCL_DEVICE_WORKER_TICK_MASK) | Host SDK | 按类别启用 Device worker 耗时打点。在 Host 上设置。仅用于调试。 |
| [AXCL_DEVICE_DAEMON_LOG_LEVEL](#AXCL_DEVICE_DAEMON_LOG_LEVEL) | slave_daemon | 设置 slave_daemon 日志文件级别。在 Device 上设置。 |
| [AXCL_SHELL_CMD_OUTPUT_LIMIT](#AXCL_SHELL_CMD_OUTPUT_LIMIT) | Host SDK | 设置远端 shell 命令返回的最大输出量。 |
| [AXCL_SMI_SHELL_TIMEOUT](#AXCL_SMI_SHELL_TIMEOUT) | `axcl-smi` | 设置 `axcl-smi` 在 Device 上执行 shell 命令的超时时间。 |

## SDK 环境变量

<a id="AXCL_VISIBLE_DEVICES"></a>

### AXCL_VISIBLE_DEVICES

控制当前进程可见的物理设备集合，以及逻辑设备 ID 到物理设备 ID 的映射。应在调用 [axclInit](../develop/c/system_api.md#axclInit) 前设置。

取值格式、映射规则和示例参见 [AXCL_VISIBLE_DEVICES 设备映射说明](../develop/arch/concept.md#AXCL_VISIBLE_DEVICES)。

<a id="AXCL_HOST_LOG_DIR"></a>

### AXCL_HOST_LOG_DIR

指定 Host 日志目录。设置为非空值时，Host SDK 将日志写入 `${AXCL_HOST_LOG_DIR}/axcl_host.log`。未设置或为空时，日志文件在 Linux 上为 `/tmp/axcl/axcl_host.log`，在 Windows 上为可执行文件同级 `log` 目录下的 `axcl_host.log`。`axcl-smi` 无法读取部分设备信息时会打印该路径。Device 的 slave_daemon 与 worker 使用固定日志目录，忽略该变量。

应在进程中首次调用 AXCL 接口（如 [axclInitializeMinidump](../develop/c/minidump_api.md#axclInitializeMinidump) 或 [axclInit](../develop/c/system_api.md#axclInit)）前设置该变量。

<a id="AXCL_DUMP_DIR"></a>

### AXCL_DUMP_DIR

指定 minidump 输出目录。设置为非空值时，其优先级高于传给 [axclInitializeMinidump](../develop/c/minidump_api.md#axclInitializeMinidump) 的目录和默认目录（Linux 上为 `/tmp`）。目录不存在时，AXCL 会创建该目录及缺失的父目录；目录无法创建或不可写时，`axclInitializeMinidump` 调用失败。

在 Host 上，应在进程中首次调用 AXCL 接口前，在应用环境中设置该变量。在 Device 上，slave_daemon 及其 worker 从 slave_daemon 服务环境读取该变量，而不是从 Host 读取。AX8860 Debian 镜像将其设为 `/opt/data/axclDump`，并定期删除超过 7 天的 dump 文件；未设置时，worker 将 minidump 写入其日志文件同级的 `minidump` 目录。

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

该级别在 [axclInit](../develop/c/system_api.md#axclInit) 中生效。初始化后如需修改，请调用 [axclrtSetLogLevel](../develop/c/other_api.md#axclrtSetLogLevel) 并指定 `AXCL_LOG_TARGET_HOST_RUNTIME_FILE`。

<a id="AXCL_HOST_CONSOLE_LEVEL"></a>

### AXCL_HOST_CONSOLE_LEVEL

设置 Host 控制台输出的最低级别。取值范围与默认值同 [AXCL_HOST_LOGFILE_LEVEL](#AXCL_HOST_LOGFILE_LEVEL)（`0`～`6`，默认 `warning`（`3`））。控制台级别与日志文件级别相互独立。`axcl-smi` 在该变量未设置时会为自身将其设为 `6`（off），以免 SDK 日志与其输出混在一起。初始化后如需修改，请调用 [axclrtSetLogLevel](../develop/c/other_api.md#axclrtSetLogLevel) 并指定 `AXCL_LOG_TARGET_HOST_RUNTIME_CONSOLE`。

<a id="AXCL_DEVICE_WORKER_LOGFILE_LEVEL"></a>

### AXCL_DEVICE_WORKER_LOGFILE_LEVEL

设置 Device worker 日志文件的最低级别。请在 Host 应用环境中设置该变量：AXCL 会把该值下发给其启动的每个 Device worker，在 Device 上设置无效。取值范围与默认值同 [AXCL_HOST_LOGFILE_LEVEL](#AXCL_HOST_LOGFILE_LEVEL)（`0`～`6`，默认 `warning`（`3`））。初始化后如需修改，请调用 [axclrtSetLogLevel](../develop/c/other_api.md#axclrtSetLogLevel) 并指定 `AXCL_LOG_TARGET_DEVICE_WORKER_FILE`。

<a id="AXCL_DEVICE_WORKER_CONSOLE_LEVEL"></a>

### AXCL_DEVICE_WORKER_CONSOLE_LEVEL

设置 Device worker 控制台输出的最低级别。与 [AXCL_DEVICE_WORKER_LOGFILE_LEVEL](#AXCL_DEVICE_WORKER_LOGFILE_LEVEL) 相同，请在 Host 应用环境中设置该变量。取值范围与默认值同 [AXCL_HOST_LOGFILE_LEVEL](#AXCL_HOST_LOGFILE_LEVEL)（`0`～`6`，默认 `warning`（`3`））。控制台级别与日志文件级别相互独立。初始化后如需修改，请调用 [axclrtSetLogLevel](../develop/c/other_api.md#axclrtSetLogLevel) 并指定 `AXCL_LOG_TARGET_DEVICE_WORKER_CONSOLE`。

<a id="AXCL_HOST_TICK_MASK"></a>

### AXCL_HOST_TICK_MASK

仅用于调试，请在技术支持指导下使用。

为选定类别的 Host API 启用逐次调用的耗时报告。该掩码在 [axclInit](../develop/c/system_api.md#axclInit) 中生效。取值为十进制或 `0x` 前缀的十六进制整数，范围 `0`～`0xFF`；未设置、空值、无效值或超出范围时为 `0`（关闭）。

| 位 | 类别 | 覆盖接口 |
|---|---|---|
| bit0 | engine | 发起 Device 请求的 `axclrtEngine*` 接口，如 `axclrtEngineExecute`、`axclrtEngineExecuteAsync`、`axclrtEngineLoadFromMem` |
| bit1 | event | `axclrtRecordEvent`、`axclrtStreamWaitEvent[WithTimeout]`、`axclrtSynchronizeEvent[WithTimeout]` |
| bit2 | stream | `axclrtSynchronizeStream[WithTimeout]` |
| bit3～7 | 预留 | - |

每次调用所覆盖的接口时向 stderr 输出一行，格式为 `[axcl][tick] <func> dur=<us>us enter=<tick> exit=<tick> freq=<Hz>Hz`。`enter` 和 `exit` 为 Host 时钟的计数器原始值，不能与 Device 侧的值比较。调用不带超时的接口（如 `axclrtSynchronizeStream`）时，也会报告其 `WithTimeout` 版本，因此会输出两行：`WithTimeout` 版本的一行在前，第二行的耗时包含第一行的耗时。

<a id="AXCL_DEVICE_WORKER_TICK_MASK"></a>

### AXCL_DEVICE_WORKER_TICK_MASK

仅用于调试，请在技术支持指导下使用。

为选定类别的 Device worker 处理启用耗时报告。请在 Host 应用环境中设置该变量：AXCL 会把该值下发给其启动的每个 Device worker，因此无需修改 Device 配置或重启 slave_daemon。取值规则同 [AXCL_HOST_TICK_MASK](#AXCL_HOST_TICK_MASK)。

| 位 | 类别 | 覆盖接口 |
|---|---|---|
| bit0 | engine | Device 侧对 `axclrtEngine*` 请求的处理 |
| bit1～7 | 预留 | - |

报告使用相同的行格式，写入 Device 上 slave_daemon 的 stderr：使用 systemd 时，可通过 `journalctl -u axcl-slave-daemon` 查看；否则输出到 Device 控制台。

<a id="AXCL_DEVICE_DAEMON_LOG_LEVEL"></a>

### AXCL_DEVICE_DAEMON_LOG_LEVEL

设置 slave_daemon 日志文件的最低级别。请在 Device 上 slave_daemon 的环境中设置该变量，slave_daemon 启动时生效。取值范围同 [AXCL_HOST_LOGFILE_LEVEL](#AXCL_HOST_LOGFILE_LEVEL)（`0`～`6`）。未设置或为空时，级别为 `info`（`2`）；无效值或超出范围时同样回退为 `info`，并向 stderr 输出一条警告。日志文件默认为 `/opt/data/axclLog` 下的 `slave_daemon.log`。slave_daemon 从不向控制台输出日志。

<a id="AXCL_SHELL_CMD_OUTPUT_LIMIT"></a>

### AXCL_SHELL_CMD_OUTPUT_LIMIT

设置调用方请求返回 `output` 时，[axclrtControlExecuteShellCmd](../develop/c/control_api.md#axclrtControlExecuteShellCmd) 返回的最大输出量，单位为字节。请在 Host 应用环境中设置该变量。取值为十进制整数，默认值为 `1048576`（1 MiB），最大值为 `16777216`（16 MiB）。无效值使用默认值；超过最大值时按最大值处理。超出上限的输出会被丢弃，并在 Host 日志中写入一条警告；命令的返回码不受影响。

## 工具环境变量

<a id="AXCL_SMI_SHELL_TIMEOUT"></a>

### AXCL_SMI_SHELL_TIMEOUT

设置 `axcl-smi` 在 Device 上执行 shell 命令的超时时间，单位为毫秒，适用于 `axcl-smi sh` 执行的命令、`axcl-smi collect-log` 在 Device 侧的日志打包，以及不带 `-r` 的 `axcl-smi push` 的目标路径检查。默认值为 `10000` ms。该变量应设置为正十进制整数，或使用 `-1` 表示无限等待。零、小于 `-1` 的值、非数字值或溢出值使用默认值。该变量不影响调用 [axclrtControlExecuteShellCmd](../develop/c/control_api.md#axclrtControlExecuteShellCmd) 的应用，这些应用自行传入 `timeout`。
