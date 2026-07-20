# 环境变量

本页汇总 AXCL SDK 和工具支持的环境变量。除特别说明外，应在相关 AXCL 组件初始化前设置环境变量。

## 快速索引

| 环境变量 | 适用范围 | 说明 |
|---|---|---|
| [AXCL_VISIBLE_DEVICES](#AXCL_VISIBLE_DEVICES) | SDK | 控制当前进程可见的设备。 |
| [AXCL_LOG_DIR](#AXCL_LOG_DIR) | SDK / slave_daemon | 指定默认日志目录。 |
| [AXCL_DUMP_DIR](#AXCL_DUMP_DIR) | Minidump | 指定 minidump 输出目录。 |
| [AXCL_CONSOLE_LEVEL](#AXCL_CONSOLE_LEVEL) | Logger | 设置控制台日志级别。 |
| [AXCL_SHELL_TIMEOUT](#AXCL_SHELL_TIMEOUT) | `axcl-smi` | 设置远端 shell 命令的超时时间。 |

## SDK 环境变量

<a id="AXCL_VISIBLE_DEVICES"></a>

### AXCL_VISIBLE_DEVICES

控制当前进程可见的物理设备集合，以及逻辑设备 ID 到物理设备 ID 的映射。应在调用 [axclInit](../develop/c/system_api.md#axclInit) 前设置。

取值格式、映射规则和示例参见 [AXCL_VISIBLE_DEVICES 设备映射说明](../develop/arch/concept.md#AXCL_VISIBLE_DEVICES)。

<a id="AXCL_LOG_DIR"></a>

### AXCL_LOG_DIR

指定 AXCL 的默认日志目录。在 Linux 上，设置为非空值时，Host SDK 默认使用 `${AXCL_LOG_DIR}/axcl_host.log`；否则使用 `/tmp/axcl/axcl_host.log`。显式配置的 `log.host.path` 会覆盖该默认值。Device daemon 未通过 `-l` 显式指定日志目录时，也使用该目录。

应在 AXCL Logger 初始化前设置该变量。

<a id="AXCL_DUMP_DIR"></a>

### AXCL_DUMP_DIR

指定 Host 进程和 Device worker 的 minidump 输出目录。设置为非空值时，其优先级高于 API 配置或平台回退目录。选定的目录必须可写；目录不存在时，AXCL 会尝试创建缺失的父目录。

应在调用 [axclInitializeMinidump](../develop/c/minidump_api.md#axclInitializeMinidump) 前设置该变量。

<a id="AXCL_CONSOLE_LEVEL"></a>

### AXCL_CONSOLE_LEVEL

设置 AXCL 控制台日志的最低输出级别。未设置时，控制台日志级别默认为 `warning`。该变量应设置为 `0`～`6` 的整数，不支持其他输入。

| 值 | 日志级别 |
|---|---|
| `0` | trace |
| `1` | debug |
| `2` | info |
| `3` | warning |
| `4` | error |
| `5` | critical |
| `6` | off |

应在 AXCL Logger 首次创建前设置该变量。修改该变量不会重新配置已经创建的 Logger。

## 工具环境变量

<a id="AXCL_SHELL_TIMEOUT"></a>

### AXCL_SHELL_TIMEOUT

设置支持远端 shell 执行的 `axcl-smi` 构建在设备上执行 shell 命令时使用的超时时间，单位为毫秒，默认值为 `10000`。该变量不会修改应用调用 [axclrtControlExecuteShellCmd](../develop/c/control_api.md#axclrtControlExecuteShellCmd) 时显式传入的 `timeout` 参数。
