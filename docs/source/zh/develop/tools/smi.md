# axcl-smi

`axcl-smi` 是 AXCL 的设备管理命令行工具，在主控上运行，用于查看设备状态、在设备上执行命令、在主控和设备之间传输文件，以及收集设备日志。


## 1. 功能概述

| 能力       | 说明                                                                                     |
| ---------- | ---------------------------------------------------------------------------------------- |
| 设备概览   | 列出所有卡的固件版本、温度、CPU/NPU 利用率、内存使用情况，以及卡上运行的进程。           |
| 设备详情   | 显示单张卡的完整信息，包括 UID、各模块频率、各 NPU 核利用率和 PCI 信息。                 |
| 实时监控   | 定时刷新显示各卡的温度、利用率和内存占用。                                               |
| 远端 shell | 在设备上执行一条 shell 命令并显示输出。                                                  |
| 文件传输   | 在主控和设备之间上传、下载文件或目录。                                                   |
| 日志收集   | 把设备日志打包下载到主控，可收集单张卡，也可用 `--all` 收集全部卡。                     |


## 2. 命令总览

```text
axcl-smi [<command> [<args>]] {OPTIONS}
```

| 命令          | 说明                                     | 是否必须指定 `-d` |
| ------------- | ---------------------------------------- | ----------------- |
| （无命令）    | 显示设备概览；指定 `-n` 时进入实时监控   | 否                |
| `info`        | 显示设备详情                             | 否                |
| `watch`       | 实时监控设备状态                         | 否                |
| `sh`          | 在设备上执行 shell 命令                  | 是                |
| `push`        | 上传文件或目录到设备                     | 是                |
| `pull`        | 从设备下载文件或目录                     | 是                |
| `collect-log` | 收集设备日志并下载到主控                 | 是（或 `--all`）  |

全局选项：

| 选项               | 默认值 | 说明                                                                                                                       |
| ------------------ | ------ | -------------------------------------------------------------------------------------------------------------------------- |
| `-d`、`--device`   | 无     | 卡号，从 `0` 开始。`info`、`watch` 和概览不指定时显示所有卡；`sh`、`push`、`pull` 必须指定一张卡；`collect-log` 需指定 `-d` 或 `--all`。 |
| `-n`、`--interval` | `2`    | 实时监控的刷新间隔，单位为秒，`0` 按 `2` 秒处理。                                                                          |
| `-v`、`--version`  | --     | 显示版本并退出。                                                                                                           |
| `-h`、`--help`     | --     | 显示帮助并退出。                                                                                                           |

```{note}
- 卡号始终按主控上的全部设备编号，不受 `AXCL_VISIBLE_DEVICES` 影响。
- 为了不打乱表格输出，`axcl-smi` 默认不在终端打印 Runtime 日志；排查问题时可通过 `AXCL_HOST_CONSOLE_LEVEL` 打开，如 `AXCL_HOST_CONSOLE_LEVEL=3 axcl-smi info -d 0`。
- 按一次 `Ctrl+C`，`axcl-smi` 会在当前操作或当前一轮刷新完成后退出。长时间没有反应时（例如设备无响应）可再按一次强制退出，此时可能留下未传完的文件。
```

## 3. 设备概览

不带命令执行时，显示所有卡的概览和卡上运行的进程：

```bash
root:/# axcl-smi
+------------------------------------------------------------------------------------------------+
| AXCL-SMI  V0.2.0                                                                Driver  V0.2.0 |
+-----------------------------------------+--------------+---------------------------------------+
| Card  Name                     Firmware | Bus-Id       |                          Memory-Usage |
| Fan   Temp                Pwr:Usage/Cap | CPU      NPU |                             CMM-Usage |
|=========================================+==============+=======================================|
|    0  ax8860                     V0.2.0 | 0000:02:00.0 |                337 MiB /    15461 MiB |
|   --   35C                      -- / -- | 18%      19% |               4259 MiB /    49152 MiB |
+-----------------------------------------+--------------+---------------------------------------+

+------------------------------------------------------------------------------------------------+
| Processes:                                                                                     |
| Card      PID  Process Name                                                   NPU Memory Usage |
|================================================================================================|
|    0     9237  /usr/local/axhelix/bin/aibox/aibox                                    10260 KiB |
+------------------------------------------------------------------------------------------------+
```

字段说明：

| 字段                   | 说明                                               |
| ---------------------- | -------------------------------------------------- |
| `Card`                 | 卡号。                                             |
| `Name`                 | 芯片型号。                                         |
| `Firmware`             | 设备固件版本。                                     |
| `Driver`               | 主控驱动版本。                                     |
| `Bus-Id`               | 卡在主控上的 PCIe 地址。                           |
| `Temp`                 | 芯片温度，单位为摄氏度。                           |
| `CPU` / `NPU`          | 设备 CPU 和 NPU 利用率（NPU 为各核之和）。         |
| `Memory-Usage`         | 设备系统内存的已用量和总量。                       |
| `CMM-Usage`            | 设备 CMM 内存的已用量和总量。                      |
| `Fan`、`Pwr:Usage/Cap` | 当前版本不支持，显示为 `--`。                      |
| `PID`                  | 设备上运行的进程号。                               |
| `Process Name`         | 进程路径，过长时会截短显示。                       |
| `NPU Memory Usage`     | 该进程占用的 NPU 内存。                            |


## 4. 设备详情

`info` 显示单张卡的完整信息，比概览多出 UID、各模块频率、各 NPU 核利用率和 PCI 信息（以下示例省略了部分频率项）：

```bash
root:/# axcl-smi info -d 0
================ axcl-smi V0.2.0 ================
Card 0
Product Name            : ax8860
UID                     : 0000000000000000
Driver                  : V0.2.0
Firmware                : V0.2.0
Temperature(C)
    Chip                : 35
Frequency(MHz)
    CPU_CLST0_0         : 1650
    CPU_CLST0_1         : 1650
    ...
    DSU                 : 1200
    CPU_FAB_PCIE        : 1200
    NPU0_MAIN0          : 1000
    NPU0_CONV0          : 1000
    ...
    VENC                : 500
    VDEC0               : 1000
    IVE0                : 800
    ...
Utilization(%)
    CPU                 : 19
    NPU0                : 20
    NPU1                : 0
    NPU2                : 0
    NPU3                : 0
Memory Usage(MB)
    Total               : 15461
    Used                : 337
    Free                : 15124
CMM Usage(MB)
    Total               : 49152
    Used                : 4259
    Free                : 44892
Power(W)
    Usage               : --
    Cap                 : --
    Max                 : --
    Min                 : --
Fan Speed(%)            : --
PCI
    Vendor ID           : 0x1F4B
    Device ID           : 0x8860
    Sub-Vendor ID       : 0x1F4B
    Sub-Device ID       : 0x8860
    Domain              : 0000
    Bus                 : 02
    Device              : 00
    Function            : 00
    Max Speed(GT/s)     : 32.0 (Gen 5)
    Max Width(x)        : 8
    Current Speed(GT/s) : 8.0  (Gen 3)
    Current Width(x)    : 4
```

不指定 `-d` 时依次显示所有卡。功耗和风扇转速当前版本不支持，显示为 `--`。

## 5. 实时监控

`watch` 按 `-n` 指定的间隔刷新显示，适合观察负载变化：

```bash
# 每 2 秒刷新一次所有卡的状态
axcl-smi watch -n 2

# 只看 0 号卡，每 1 秒刷新一次
axcl-smi watch -d 0 -n 1
```

输出格式：

```text
Card     Chip     Pwr(W)     Temp(C)     CPU (%)     NPU(%)     Memory(%)     CMM(%)
0        ax8860   --         35          16          19         2             8
```

`Memory(%)` 和 `CMM(%)` 为已用量占总量的百分比。按 `Ctrl+C` 退出。

```{note}
不带命令但指定了 `-n` 时，同样进入实时监控，等同于 `axcl-smi watch -n <间隔>`；不指定 `-n` 时只显示一次概览。
```

## 6. 远端 shell

`sh` 在指定的卡上执行一条 shell 命令，并把输出显示在主控上。请用双引号括起整条命令，否则以 `-` 开头的参数会被 `axcl-smi` 当成自己的选项，空格、`*`、`|`、`>` 等字符也会先被主控的 shell 处理。命令中含 `$` 或反引号时请改用单引号，否则它们会先在主控上展开：

```bash
axcl-smi sh -d 0 "free"
axcl-smi sh -d 0 "ls -l /opt/data"
```

```{warning}
命令会原样交给设备执行，不做任何检查或过滤，并且通常以 root 权限运行。`rm -rf`、`dd`、`mkfs`、覆盖系统文件等操作会立即生效且无法撤销，可能损坏设备文件系统，甚至需要重新烧写固件。

只执行清楚后果的命令；不要把外部输入、配置文件、网络数据或来源不明的脚本内容拼接进命令。
```

- 命令默认 10 秒超时，可通过 [AXCL_SMI_SHELL_TIMEOUT](../../appendix/environment_variables.md#AXCL_SMI_SHELL_TIMEOUT) 调整。
- 输出最多返回 1 MiB，超出部分会被截断，可通过 [AXCL_SHELL_CMD_OUTPUT_LIMIT](../../appendix/environment_variables.md#AXCL_SHELL_CMD_OUTPUT_LIMIT) 调整。
- 不支持 `top`、`vi` 等交互式命令。
- 命令执行失败（返回非 `0`、被终止或超时）时，仍会显示命令已有的输出（没有输出时显示失败原因，如 `shell command exited with status 1`），随后提示 `shell command failed on device N`，`axcl-smi` 返回非 `0`。提示 `shell RPC timed out` 时，设备上的命令可能仍在运行。

在程序中执行设备命令可使用 [axclrtControlExecuteShellCmd](../c/control_api.md#axclrtControlExecuteShellCmd)。

## 7. 文件传输

`push` 把主控上的文件或目录上传到设备，`pull` 从设备下载到主控：

```bash
# 上传单个文件
axcl-smi push -d 0 ./model.axmodel /tmp/model.axmodel

# 下载单个文件
axcl-smi pull -d 0 /tmp/runtime.log ./runtime.log

# 目标是目录时，文件按原名放入该目录，等同于 /opt/bin/model.axmodel
axcl-smi push -d 0 ./model.axmodel /opt/bin/
```

传输目录时必须加 `-r` 或 `--recursive`：

```bash
# /tmp/deploy 已存在时，上传后为 /tmp/deploy/assets
axcl-smi push -d 0 -r ./assets /tmp/deploy
axcl-smi pull -d 0 --recursive /tmp/deploy/assets ./download
```

注意事项：

- 每次只能对一张卡传输。
- 不加 `-r` 时只能传单个普通文件，且不支持空文件；加 `-r` 时只能传目录，目录中的空文件可以正常传输。
- 不加 `-r` 时，目标是已存在的目录或以 `/` 结尾，文件按原名放入该目录。上传到设备上的目录时建议以 `/` 结尾，否则会先检查目标是否为目录，检查失败则不传输。
- 加 `-r` 时，目标目录已存在，源目录整个放到它下面；目标目录不存在，则新建该目录并放入源目录的内容。两种情况下，目标目录的上一级目录都必须已存在。
- 不加 `-r` 时，`push` 要求设备上目标文件的上一级目录已存在；`pull` 会在主控上自动创建缺失的上级目录。
- 单个文件不超过 4 GiB，不支持设备文件、管道等特殊文件。
- 同名文件会被覆盖，目标目录中原有的其他文件保留。
- `pull` 下载前会先检查主控上的目标位置能否写入，不能写入时直接报错。
- 文件传输要求主控软件包与设备固件版本配套，否则传输会失败。

更多细节参见 [文件接口](../c/file_api.md)。

## 8. 日志收集

`collect-log` 把设备上 `/opt/data` 下的 `AXSyslog`、`axclLog` 目录和设备内核日志打包成 `tar.gz`，下载到主控：

```bash
# 下载到当前目录
axcl-smi collect-log -d 0

# 下载到指定目录
axcl-smi collect-log -d 0 /tmp/axcl-logs

# 收集全部卡，每张卡生成一个文件
axcl-smi collect-log --all /tmp/axcl-logs
```

文件名格式为 `device<卡号>_log_<日期>_<时间>_<毫秒>.tar.gz`，解压后是一个同名目录：

```text
device0_log_20260923_101530_204.tar.gz
└── device0_log_20260923_101530_204/
    ├── AXSyslog/
    ├── axclLog/
    └── dmesg.txt
```

说明：

- 收集不会打断设备上正在写入的日志，归档中的日志为收集时刻的内容。
- `dmesg.txt` 是设备的内核日志。获取失败时只给出提示，归档中不含该文件。
- 设备上 `AXSyslog` 和 `axclLog` 都不存在时，收集失败。
- 收集过程中的提示信息会打印到 stderr，并标明卡号。收集期间若有日志文件被轮转或删除，也会在这里提示，对应文件在归档中可能不完整。
- 输出目录不能写入时直接报错。在没有写权限的目录（如 `/usr/local/axhelix/bin`）下执行时，请指定输出目录，如 `axcl-smi collect-log -d 0 /tmp`。
- `--all` 逐张卡收集，不能与 `-d` 同时使用。某张卡失败不影响其他卡，结束时显示 `collect-log: <成功数>/<总数> devices succeeded`（无响应而被跳过的卡计入总数），有卡失败时返回非 `0`。收集中按 `Ctrl+C`，会在当前卡完成后停止；若还有未收集的卡，这些卡会被跳过，汇总行末尾带 `(interrupted)` 并返回非 `0`。
- 日志较多时打包可能超时，可调大 [AXCL_SMI_SHELL_TIMEOUT](../../appendix/environment_variables.md#AXCL_SMI_SHELL_TIMEOUT)。
- 无论下载是否成功，设备上的临时文件都会被清理。打包超时时，设备上 `/opt/data` 下可能留下 `.collect_*` 目录或未完成的 `device*_log_*.tar.gz`，确认没有其他收集任务在进行后，可用 `axcl-smi sh` 删除。

## 9. 相关环境变量

| 环境变量                                                                                           | 说明                                                         |
| -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| [AXCL_SMI_SHELL_TIMEOUT](../../appendix/environment_variables.md#AXCL_SMI_SHELL_TIMEOUT)           | `sh` 和 `collect-log` 在设备上执行命令的超时时间，单位为毫秒。 |
| [AXCL_SHELL_CMD_OUTPUT_LIMIT](../../appendix/environment_variables.md#AXCL_SHELL_CMD_OUTPUT_LIMIT) | `sh` 返回输出的上限。                                        |
| [AXCL_HOST_CONSOLE_LEVEL](../../appendix/environment_variables.md#AXCL_HOST_CONSOLE_LEVEL)         | 设置后在终端显示 Runtime 日志，用于排查问题。                |
| [AXCL_HOST_LOG_DIR](../../appendix/environment_variables.md#AXCL_HOST_LOG_DIR)                     | 主控日志目录，出错提示中给出的日志路径即在此目录下。         |

## 10. 故障排查

显示设备信息时，某项获取失败不会中断输出，而是把该项显示为 `--`，并在 stderr 提示原因和 Runtime 日志位置；这种情况不影响命令返回值。

| 现象                                                         | 可能原因                                   | 处理建议                                                        |
| ------------------------------------------------------------ | ------------------------------------------ | --------------------------------------------------------------- |
| `failed to initialize AXCL, ret = 0x...`                     | 驱动未加载、未识别到设备或环境变量未生效   | 确认驱动已加载，执行 `source /etc/profile` 后重试。             |
| `no AXCL devices available`                                  | 没有找到可用的卡                           | 确认卡已正确安装并上电。                                        |
| `invalid device index: N`                                    | `-d` 指定的卡号不存在                      | 先执行 `axcl-smi` 查看实际卡号。                                |
| `failed to create context for card N` / `... for device N`   | 无法连接该卡                               | 查看提示中的 Runtime 日志。                                     |
| `axcl-smi: card N: not responding (no reply within 1000 ms)` | 主控到设备的通路不通，或设备内核无响应 | 查看主控 `dmesg` 与 `/proc/ax_proc/comm/info`，必要时重启该卡。 |
| `axcl-smi: card N: offline`                                  | 该卡已离线                                 | 查看主控 `dmesg`，确认卡状态后重启该卡。                         |
| `axcl-smi: card N: slave_daemon not running`                 | 通路正常，但设备上的 `slave_daemon` 未运行（未启动、已退出或崩溃） | 检查设备上的 `slave_daemon` 进程及其日志。                       |
| `axcl-smi: card N: status check failed, ret = 0x...`         | 检查设备状态失败                           | 用 `AXCL_HOST_CONSOLE_LEVEL=3` 重新执行，查看 Runtime 日志。    |
| `axcl-smi: card N unavailable: ...`                          | 该卡的部分信息获取失败                     | 确认设备固件与主控软件包版本配套；仍有问题时用 `collect-log` 收集日志反馈。 |
| `'<command>' requires -d <device>`                           | `sh`、`push`、`pull` 未指定卡号            | 加上 `-d <卡号>`。                                              |
| `'collect-log' requires -d <device> or --all`                | `collect-log` 未指定 `-d` 或 `--all`       | 加上 `-d <卡号>` 或 `--all`。                                   |
| `'collect-log' accepts either -d <device> or --all, not both` | 同时指定了 `-d` 和 `--all`                | 只保留其中一个。                                                |
| `collect-log: cannot write to output directory '<目录>': ...` | 输出目录（默认为当前目录）没有写权限      | 换到有写权限的目录，或在命令末尾指定输出目录，如 `/tmp`。       |
| `failed to check whether '<路径>' is a directory on device N ...` | `push` 的目标不以 `/` 结尾，检查目标是否为目录失败 | 目标是目录时在末尾加 `/`。                                      |
| `pull: cannot write '<路径>': ...`                           | 主控上的目标位置无法写入；或使用 `-r` 时目标的上一级目录不存在 | 改用有写权限的目标路径。                                        |

命令成功时返回 `0`，失败时返回非 `0`。
