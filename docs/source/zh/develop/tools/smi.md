# axcl-smi

`axcl-smi`（AXCL System Management Interface）是 AXCL 的设备管理命令行工具，运行在主控侧，用于查询设备状态、在设备上执行 shell 命令、在主控和设备之间传输文件以及收集设备日志。


## 1. 功能概述

| 能力       | 说明                                                                                            |
| ---------- | ----------------------------------------------------------------------------------------------- |
| 设备概览   | 以表格形式列出所有已枚举设备的固件版本、Bus-Id、温度、CPU/NPU 利用率、系统内存和 CMM 使用情况，以及设备上运行的进程列表和 NPU 内存占用。 |
| 设备详情   | 输出单张卡的产品名、UID、各模块频率、CPU 与分核 NPU 利用率、内存明细和 PCI 信息。                 |
| 实时监控   | 按固定间隔刷新设备的温度、利用率和内存占用。                                                    |
| 远端 shell | 在设备上执行 shell 命令并回显输出。                                                             |
| 文件传输   | 在主控和设备之间上传、下载文件或目录。                                                          |
| 日志收集   | 将设备侧的 AXSyslog 与 axclLog 打包为 `tar.gz` 并下载到主控。                                   |


## 2. 命令总览

```text
axcl-smi [<command> [<args>]] {OPTIONS}
```

| 命令          | 说明                                     | 是否必须指定 `-d` |
| ------------- | ---------------------------------------- | ----------------- |
| （无命令）    | 输出设备概览表；指定 `-n` 时进入实时监控 | 否                |
| `info`        | 输出设备详细信息                         | 否                |
| `watch`       | 实时监控设备状态                         | 否                |
| `sh`          | 在设备上执行 shell 命令                  | 是                |
| `push`        | 上传文件或目录到设备                     | 是                |
| `pull`        | 从设备下载文件或目录                     | 是                |
| `collect-log` | 收集设备日志并下载到主控                 | 是                |

全局选项：

| 选项                  | 默认值 | 说明                                                                                                                                                                                               |
| --------------------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `-d`、`--device`      | 无     | 卡号，取值范围 `[0, 已连接设备数 - 1]`。省略时，`info`、`watch` 和不带子命令的概览对所有已枚举设备生效；`sh`、`push`、`pull`、`collect-log` 必须指定唯一卡号，省略时命令直接失败而不会广播到多卡。 |
| `-n`、`--interval`    | `2`    | 刷新间隔，单位为秒，取值为 `0` 时按 `2` 秒处理。该默认值仅作为间隔取值；不带子命令时，是否传入 `-n` 决定进入实时监控还是只输出一次概览后退出。                                                     |
| `-v`、`--version`     | --     | 打印 `axcl-smi` 版本并退出。                                                                                                                                                                       |
| `-h`、`--help`        | --     | 打印帮助信息并退出。                                                                                                                                                                               |

```{note}
`axcl-smi` 启动时会清除进程内的 `AXCL_VISIBLE_DEVICES`，因此它始终按全部物理设备编号，不受该变量影响。同时，在用户未显式设置 `AXCL_HOST_CONSOLE_LEVEL` 时，工具会将其设为 `6`（关闭），避免 Runtime 日志干扰表格输出。
```

## 3. 设备概览

不带任何子命令执行时，输出所有设备的概览表及卡上进程信息：

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

| 字段                   | 说明                                                         |
| ---------------------- | ------------------------------------------------------------ |
| `Card`                 | 卡号。                                                       |
| `Name`                 | 设备 SoC 名称。                                              |
| `Firmware`             | 设备固件版本。                                               |
| `Driver`               | 主控侧驱动版本。                                             |
| `Bus-Id`               | PCIe BDF，格式为 `domain:bus:device.function`。              |
| `Temp`                 | 芯片温度，单位为摄氏度。                                     |
| `CPU` / `NPU`          | 设备侧 CPU 和 NPU 利用率（NPU 为所有核利用率之和）。         |
| `Memory-Usage`         | 设备系统内存已用量和总量。                                   |
| `CMM-Usage`            | 设备 CMM 内存已用量和总量。                                  |
| `Fan`、`Pwr:Usage/Cap` | 当前版本未提供，固定显示 `--`。                              |
| `PID`                  | 设备上运行的进程 ID。                                        |
| `Process Name`         | 进程可执行文件路径（长路径会被截短）。                       |
| `NPU Memory Usage`     | 该进程占用的 NPU CMM 内存大小。                             |


## 4. 设备详情

`info` 输出单张卡的完整信息，包含概览表中未展示的 UID、各模块频率、CPU 与分核 NPU 利用率以及 PCI 明细：

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
    CPU_CLST0_2         : 1650
    CPU_CLST0_3         : 1650
    CPU_CLST0_4         : 1650
    CPU_CLST0_5         : 1650
    CPU_CLST0_6         : 1650
    CPU_CLST0_7         : 1650
    CPU_CLST1_0         : 1650
    CPU_CLST1_1         : 1650
    CPU_CLST1_2         : 1650
    CPU_CLST1_3         : 1650
    CPU_CLST1_4         : 1650
    CPU_CLST1_5         : 1650
    CPU_CLST1_6         : 1650
    CPU_CLST1_7         : 1650
    DSU                 : 1200
    DSU_PERIPH          : 600
    CPU_FAB_PCIE        : 1200
    CPU_DMA             : 1200
    NPU0_FDTHR_CFG      : 500
    NPU0_FDTHR_SOC      : 1200
    NPU0_FDTHR_DDR0     : 1200
    NPU0_FDTHR_DDR1     : 1200
    NPU0_FDTHR_DDR2     : 1200
    NPU0_FDTHR_DDR3     : 1200
    NPU0_GLB_FAB        : 500
    NPU0_MAIN0          : 1000
    NPU0_MAIN1          : 1000
    NPU0_MAIN2          : 1000
    NPU0_MAIN3          : 1000
    NPU0_CONV0          : 1000
    NPU0_CONV1          : 1000
    NPU0_CONV2          : 1000
    NPU0_CONV3          : 1000
    NPU1_FDTHR_CFG      : 500
    NPU1_FDTHR_SOC      : 1200
    NPU1_FDTHR_DDR0     : 1200
    NPU1_FDTHR_DDR1     : 1200
    NPU1_FDTHR_DDR2     : 1200
    NPU1_FDTHR_DDR3     : 1200
    NPU1_GLB_FAB        : 500
    NPU1_MAIN0          : 1000
    NPU1_MAIN1          : 1000
    NPU1_MAIN2          : 1000
    NPU1_MAIN3          : 1000
    NPU1_CONV0          : 1000
    NPU1_CONV1          : 1000
    NPU1_CONV2          : 1000
    NPU1_CONV3          : 1000
    NPU2_FDTHR_CFG      : 500
    NPU2_FDTHR_SOC      : 1200
    NPU2_FDTHR_DDR0     : 1200
    NPU2_FDTHR_DDR1     : 1200
    NPU2_FDTHR_DDR2     : 1200
    NPU2_FDTHR_DDR3     : 1200
    NPU2_GLB_FAB        : 500
    NPU2_MAIN0          : 1000
    NPU2_MAIN1          : 1000
    NPU2_MAIN2          : 1000
    NPU2_MAIN3          : 1000
    NPU2_CONV0          : 1000
    NPU2_CONV1          : 1000
    NPU2_CONV2          : 1000
    NPU2_CONV3          : 1000
    NPU3_FDTHR_CFG      : 500
    NPU3_FDTHR_SOC      : 1200
    NPU3_FDTHR_DDR0     : 1200
    NPU3_FDTHR_DDR1     : 1200
    NPU3_FDTHR_DDR2     : 1200
    NPU3_FDTHR_DDR3     : 1200
    NPU3_GLB_FAB        : 500
    NPU3_MAIN0          : 1000
    NPU3_MAIN1          : 1000
    NPU3_MAIN2          : 1000
    NPU3_MAIN3          : 1000
    NPU3_CONV0          : 1000
    NPU3_CONV1          : 1000
    NPU3_CONV2          : 1000
    NPU3_CONV3          : 1000
    INTCNT_FAB_CFG      : 400
    INTCNT_FAB_DDR_P1   : 1200
    NPU_C2C             : 1000
    NPU_SHARE_OCM       : 1000
    MAU0                : 1000
    MAU1                : 1000
    PP_FAB_CFG          : 400
    PP_FAB_DATA         : 800
    CPFD_FAB_CFG        : 400
    CPFD_FAB_DATA       : 800
    VPU_CFG             : 300
    VPU_DDR             : 400
    MMCORE_FAB          : 400
    VENC                : 500
    JENC                : 300
    VDEC0               : 1000
    VDEC1               : 1000
    VDEC2               : 1000
    JDEC                : 800
    VPU_FAB_CFG         : 300
    TDP                 : 400
    VPP0                : 400
    VPP1                : 400
    VPP2                : 400
    VGP0                : 400
    VGP1                : 400
    IVE0                : 800
    IVE1                : 800
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

不指定 `-d` 时，依次输出所有设备的详情。功耗和风扇转速在当前版本未提供，固定显示 `--`。PCI 信息（Vendor ID、Device ID、Domain、Bus、Device、Function、最大及当前链路速率和位宽）通过驱动读取并展示。

## 5. 实时监控

`watch` 按 `-n` 指定的间隔清屏刷新，适合观察负载变化：

```bash
# 每 2 秒刷新一次所有设备状态
axcl-smi watch -n 2

# 只监控 0 号设备，每 1 秒刷新一次
axcl-smi watch -d 0 -n 1
```

输出格式：

```text
Card     Chip     Pwr(W)     Temp(C)     CPU (%)     NPU(%)     Memory(%)     CMM(%)
0        ax8860   --         35          16          19         2             8
```

其中 `Memory(%)` 和 `CMM(%)` 为已用量占总量的百分比。按 `Ctrl+C` 退出；连续按 3 次会强制终止进程。

```{note}
不带子命令但显式指定 `-n` 时，`axcl-smi` 同样进入实时监控模式，等价于 `axcl-smi watch -n <interval>`；未指定 `-n` 时输出一次概览表后退出。
```

## 6. 远端 shell

`sh` 在指定设备上执行一条 shell 命令，并把输出回显到主控。命令及其参数建议统一用双引号包裹，避免空格、`*`、`|`、`>` 等字符被主控侧 shell 提前拆分或展开：

```bash
axcl-smi sh -d 0 "free"
```

```{warning}
`sh` 只负责把命令原样下发到设备侧，由 `/bin/sh -c` 直接解释执行，不做命令解析、白名单过滤或注入防护，并继承设备侧 worker 进程的权限（通常为 root）。`rm -rf`、`dd`、`mkfs`、重定向覆盖系统文件等操作会立即生效且无法撤销，可能导致设备文件系统损坏或需要重新烧写固件。

使用者需自行判断下发命令的后果：只下发自己明确了解其影响的命令；不要把来自外部输入、配置文件、网络数据或不受信脚本的内容拼接进命令字符串，否则等同于把设备的 shell 直接暴露给该输入源。
```

该命令基于 [axclrtControlExecuteShellCmd](../c/control_api.md#axclrtControlExecuteShellCmd) 实现，遵循相同的约束：超时时间默认 `10000` ms，可通过 [AXCL_SMI_SHELL_TIMEOUT](../../appendix/environment_variables.md#AXCL_SMI_SHELL_TIMEOUT) 覆盖；返回的输出量上限由 [AXCL_SHELL_CMD_OUTPUT_LIMIT](../../appendix/environment_variables.md#AXCL_SHELL_CMD_OUTPUT_LIMIT) 控制，默认 1 MiB，超出部分被截断；不支持交互命令和 TTY。

## 7. 文件传输

`push` 将主控文件或目录上传到设备，`pull` 从设备下载到主控：

```bash
# 上传单个文件
axcl-smi push -d 0 ./model.axmodel /tmp/model.axmodel

# 下载单个文件
axcl-smi pull -d 0 /tmp/runtime.log ./runtime.log

# 目标为已存在的目录时，自动追加源文件名，等价于 /opt/bin/model.axmodel
axcl-smi push -d 0 ./model.axmodel /opt/bin/
```

传输目录必须显式添加 `-r` 或 `--recursive`：

```bash
axcl-smi push -d 0 -r ./assets /tmp/deploy
axcl-smi pull -d 0 --recursive /tmp/deploy/assets ./download
```

约束：

- `-d` 必须指定唯一设备，不支持一次向多张卡传输。
- 未添加 `-r` 时，`push` 的源路径只接受主控侧的普通文件；添加 `-r` 时只接受目录。
- 未添加 `-r` 时，若目标路径以 `/` 结尾，或是已存在的目录（含指向目录的符号链接），实际目标为该目录下的同名文件。`push` 的目标不以 `/` 结尾时，会先在设备侧执行一次 shell 命令确认其是否为目录，确认失败则不传输；目标以 `/` 结尾可跳过该检查。
- 单个普通文件不得超过 4 GiB，不支持特殊文件。
- 已存在的目标文件会被覆盖，目标目录中多余的条目会保留。
- 该命令不启动 Userworker，要求主控 Runtime 与设备侧 `slave_worker` 使用配套版本。

目录语义、权限和错误码等细节参见 [文件接口](../c/file_api.md)。

## 8. 日志收集

`collect-log` 在设备侧把 `/opt/data` 下的 `AXSyslog` 和 `axclLog` 目录打包成 `tar.gz`，下载到主控后删除设备侧的临时归档：

```bash
# 下载到当前目录
axcl-smi collect-log -d 0

# 指定输出目录
axcl-smi collect-log -d 0 /tmp/axcl-logs
```

生成的文件名格式为 `device<卡号>_log_<YYYYMMDD>_<HHMMSS>_<毫秒>.tar.gz`，归档内只有一个与文件名同名的顶层目录：

```text
device0_log_20260923_101530_204.tar.gz
└── device0_log_20260923_101530_204/
    ├── AXSyslog/
    └── axclLog/
```

说明：

- 打包过程使用符号链接配合 `tar -h`，不会移动或复制正在写入的日志目录。
- 两个日志目录都不存在时命令失败，并在 stderr 给出提示。
- 打包使用的超时时间同样受 [AXCL_SMI_SHELL_TIMEOUT](../../appendix/environment_variables.md#AXCL_SMI_SHELL_TIMEOUT) 控制，日志量较大时建议适当调大。
- 即使下载失败，设备侧临时归档也会被清理。

## 9. 相关环境变量

| 环境变量                                                                                           | 说明                                                                     |
| -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| [AXCL_SMI_SHELL_TIMEOUT](../../appendix/environment_variables.md#AXCL_SMI_SHELL_TIMEOUT)           | 覆盖 `sh` 和 `collect-log` 在设备上执行命令的超时时间，单位为毫秒。      |
| [AXCL_SHELL_CMD_OUTPUT_LIMIT](../../appendix/environment_variables.md#AXCL_SHELL_CMD_OUTPUT_LIMIT) | 限制远端 shell 命令返回的输出量。                                        |
| [AXCL_HOST_CONSOLE_LEVEL](../../appendix/environment_variables.md#AXCL_HOST_CONSOLE_LEVEL)         | 显式设置后，`axcl-smi` 不再默认关闭控制台日志，可用于排查 Runtime 问题。 |
| [AXCL_HOST_LOG_DIR](../../appendix/environment_variables.md#AXCL_HOST_LOG_DIR)                     | 指定主控日志目录，诊断信息中提示的日志路径来自该配置。                   |

## 10. 故障排查

`axcl-smi` 在某项数据采集失败时不会中断输出，而是把该字段显示为 `--`，并在 stderr 追加诊断行和 Runtime 日志路径。

| 现象                                            | 可能原因                               | 处理建议                                                  |
| ----------------------------------------------- | -------------------------------------- | --------------------------------------------------------- |
| `failed to initialize AXCL, ret = 0x...`        | 驱动未加载、设备未枚举或环境变量未生效 | 检查内核模块加载情况，执行 `source /etc/profile` 后重试。 |
| `no AXCL devices available`                     | 未找到可用设备                         | 确认 PCIe 链路和设备上电状态。                            |
| `invalid device index: N`                       | `-d` 超出 `[0, 设备数 - 1]`            | 先执行 `axcl-smi` 确认实际卡号。                          |
| `axcl-smi: failed to create context for card N` | 该卡 Runtime 上下文创建失败            | 查看提示的 Runtime 日志定位原因。                         |
| `axcl-smi: card N unavailable: ...`             | 对应字段采集失败                       | 按提示字段检查设备侧 `proc` / `sysfs` 节点或固件版本。    |
| `'<command>' requires -d <device>`             | 子命令（如 `sh`、`push`、`pull`、`collect-log`）缺少必需的 `-d` | 补充 `-d <卡号>`。                                        |

命令执行成功返回 `0`，失败返回非 `0`。