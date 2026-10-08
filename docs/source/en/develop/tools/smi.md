# axcl-smi

`axcl-smi` (AXCL System Management Interface) is the AXCL device management command-line tool. It runs on the host and is used to query device status, run shell commands on a device, transfer files between the host and a device, and collect device logs.


## 1. Capabilities

| Capability      | Description                                                                                                                               |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Device summary  | Lists the firmware version, Bus-Id, temperature, CPU/NPU utilization, system memory, and CMM usage of every enumerated device in a table, along with the process list and per-process NPU memory usage. |
| Device details  | Prints the product name, UID, per-module frequencies, CPU and per-core NPU utilization, memory breakdown, and PCI information of a single card. |
| Live monitoring | Refreshes device temperature, utilization, and memory usage at a fixed interval.                                                          |
| Remote shell    | Runs a shell command on a device and echoes its output.                                                                                   |
| File transfer   | Uploads and downloads files or directories between the host and a device.                                                                 |
| Log collection  | Packages the device-side AXSyslog and axclLog directories into a `tar.gz` and downloads it to the host.                                   |


## 2. Command Overview

```text
axcl-smi [<command> [<args>]] {OPTIONS}
```

| Command       | Description                                                                    | `-d` required |
| ------------- | ------------------------------------------------------------------------------ | ------------- |
| (no command)  | Prints the device summary table; enters live monitoring when `-n` is specified | No            |
| `info`        | Prints detailed device information                                             | No            |
| `watch`       | Monitors device status in real time                                            | No            |
| `sh`          | Runs a shell command on a device                                               | Yes           |
| `push`        | Uploads a file or directory to a device                                        | Yes           |
| `pull`        | Downloads a file or directory from a device                                    | Yes           |
| `collect-log` | Collects device logs and downloads them to the host                            | Yes           |

Global options:

| Option                | Default | Description                                                                                                                                                                                                                                                                                             |
| --------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `-d`, `--device`      | None    | Card index in the range `[0, connected cards number - 1]`. When omitted, `info`, `watch`, and the no-command summary apply to every enumerated device; `sh`, `push`, `pull`, and `collect-log` require a single card and fail immediately when it is omitted instead of broadcasting to multiple cards. |
| `-n`, `--interval`    | `2`     | Refresh interval in seconds for watch mode; a value of `0` is treated as `2` seconds. The default only provides the interval value. Without a subcommand, whether `-n` is passed decides between entering live monitoring and printing the summary once before exiting.                                                 |
| `-v`, `--version`     | --      | Prints the `axcl-smi` version and exits.                                                                                                                                                                                                                                                                |
| `-h`, `--help`        | --      | Prints the help message and exits.                                                                                                                                                                                                                                                                      |

```{note}
`axcl-smi` clears `AXCL_VISIBLE_DEVICES` in its own process, so it always numbers all physical devices and is not affected by that variable. In addition, when the user has not explicitly set `AXCL_HOST_CONSOLE_LEVEL`, the tool sets it to `6` (off) so that runtime logs do not interfere with the table output.
```

## 3. Device Summary

When invoked without a subcommand, the tool prints the summary table and running processes for all devices:

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

Field description:

| Field                  | Description                                                           |
| ---------------------- | --------------------------------------------------------------------- |
| `Card`                 | Card index.                                                           |
| `Name`                 | Device SoC name.                                                      |
| `Firmware`             | Device firmware version.                                              |
| `Driver`               | Host-side driver version.                                             |
| `Bus-Id`               | PCIe BDF in the `domain:bus:device.function` format.                  |
| `Temp`                 | Chip temperature in degrees Celsius.                                  |
| `CPU` / `NPU`          | Device-side CPU and NPU utilization (NPU is the sum of all cores).     |
| `Memory-Usage`         | Used and total device system memory.                                  |
| `CMM-Usage`            | Used and total device CMM memory.                                     |
| `Fan`, `Pwr:Usage/Cap` | Not provided in the current version; always displayed as `--`.        |
| `PID`                  | Process ID running on the device.                                     |
| `Process Name`         | Process executable path (long paths are abbreviated).                 |
| `NPU Memory Usage`     | NPU CMM memory used by the process.                                   |


## 4. Device Details

`info` prints the complete information of a card, including the UID, per-module frequencies, CPU and per-core NPU utilization, and PCI details that are not shown in the summary table:

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

When `-d` is omitted, the details of all devices are printed in sequence. Power and fan speed are not provided in the current version and are always displayed as `--`. PCI information (Vendor ID, Device ID, Domain, Bus, Device, Function, maximum and current link speeds and widths) is read via the driver and displayed.

## 5. Live Monitoring

`watch` clears the screen and refreshes at the interval specified by `-n`, which is convenient for observing load changes:

```bash
# Refresh the status of all devices every 2 seconds
axcl-smi watch -n 2

# Monitor device 0 only at 1-second interval
axcl-smi watch -d 0 -n 1
```

Output format:

```text
Card     Chip     Pwr(W)     Temp(C)     CPU (%)     NPU(%)     Memory(%)     CMM(%)
0        ax8860   --         35          16          19         2             8
```

`Memory(%)` and `CMM(%)` are the used amount as a percentage of the total. Press `Ctrl+C` to exit; pressing it three times in a row terminates the process forcibly.

```{note}
When no subcommand is given but `-n` is specified explicitly, `axcl-smi` also enters live monitoring mode, which is equivalent to `axcl-smi watch -n <interval>`. Without `-n`, it prints the summary table once and exits.
```

## 6. Remote Shell

`sh` runs a single shell command on the specified device and echoes the output to the host. Wrap the command and its arguments in double quotes so that characters such as spaces, `*`, `|`, and `>` are not split or expanded by the host-side shell first:

```bash
axcl-smi sh -d 0 "free"
```

```{warning}
`sh` only forwards the command verbatim to the device, where `/bin/sh -c` interprets and runs it directly. It performs no command parsing, allowlist filtering, or injection protection, and it inherits the privileges of the device-side worker process (typically root). Operations such as `rm -rf`, `dd`, `mkfs`, or redirection that overwrites system files take effect immediately and cannot be undone, which may corrupt the device file system or require reflashing the firmware.

You are responsible for the consequences of the commands you issue: only issue commands whose impact you fully understand, and never concatenate content from external input, configuration files, network data, or untrusted scripts into the command string. Doing so is equivalent to exposing the device shell directly to that input source.
```

The command is built on [axclrtControlExecuteShellCmd](../c/control_api.md#axclrtControlExecuteShellCmd) and follows the same constraints: the timeout defaults to `10000` ms and can be overridden with [AXCL_SMI_SHELL_TIMEOUT](../../appendix/environment_variables.md#AXCL_SMI_SHELL_TIMEOUT); the returned output is capped by [AXCL_SHELL_CMD_OUTPUT_LIMIT](../../appendix/environment_variables.md#AXCL_SHELL_CMD_OUTPUT_LIMIT) at 1 MiB by default and truncated beyond that; interactive commands and TTYs are not supported.

## 7. File Transfer

`push` uploads a host file or directory to a device, and `pull` downloads from a device to the host:

```bash
# Upload a single file
axcl-smi push -d 0 ./model.axmodel /tmp/model.axmodel

# Download a single file
axcl-smi pull -d 0 /tmp/runtime.log ./runtime.log

# An existing destination directory receives the source file name; equivalent to /opt/bin/model.axmodel
axcl-smi push -d 0 ./model.axmodel /opt/bin/
```

Transferring a directory requires an explicit `-r` or `--recursive`:

```bash
axcl-smi push -d 0 -r ./assets /tmp/deploy
axcl-smi pull -d 0 --recursive /tmp/deploy/assets ./download
```

Constraints:

- `-d` must select exactly one device; transferring to multiple cards in one invocation is not supported.
- Without `-r`, the source path of `push` accepts only a regular file on the host; with `-r`, it accepts only a directory.
- Without `-r`, a destination that ends with `/` or is an existing directory (including a symbolic link to a directory) resolves to the file with the source name inside it. When a `push` destination does not end with `/`, a shell command is first run on the device to check whether it is a directory; if the check fails, nothing is transferred. A trailing `/` skips the check.
- A single regular file must not exceed 4 GiB. Special files are not supported.
- Existing destination files are overwritten, and extra entries in the destination directory are kept.
- The command does not start a Userworker and requires the host runtime and the device-side `slave_worker` to be of matching versions.

For directory semantics, permissions, and error codes, see [File API](../c/file_api.md).

## 8. Log Collection

`collect-log` packages the `AXSyslog` and `axclLog` directories under `/opt/data` on the device into a `tar.gz`, downloads it to the host, and then removes the temporary archive on the device:

```bash
# Download to the current directory
axcl-smi collect-log -d 0

# Specify an output directory
axcl-smi collect-log -d 0 /tmp/axcl-logs
```

The generated file name follows the `device<card>_log_<YYYYMMDD>_<HHMMSS>_<milliseconds>.tar.gz` format, and the archive contains a single top-level directory with the same name:

```text
device0_log_20260923_101530_204.tar.gz
└── device0_log_20260923_101530_204/
    ├── AXSyslog/
    └── axclLog/
```

Notes:

- The packaging step uses symbolic links together with `tar -h`, so the live log directories are neither moved nor copied.
- The command fails and prints a hint on stderr when neither log directory exists.
- The packaging step is also bounded by [AXCL_SMI_SHELL_TIMEOUT](../../appendix/environment_variables.md#AXCL_SMI_SHELL_TIMEOUT). Increase it when the logs are large.
- The temporary archive on the device is always removed, even when the download fails.

## 9. Related Environment Variables

| Environment variable                                                                               | Description                                                                                                         |
| -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| [AXCL_SMI_SHELL_TIMEOUT](../../appendix/environment_variables.md#AXCL_SMI_SHELL_TIMEOUT)           | Overrides the timeout, in milliseconds, used by `sh` and `collect-log` when running commands on the device.         |
| [AXCL_SHELL_CMD_OUTPUT_LIMIT](../../appendix/environment_variables.md#AXCL_SHELL_CMD_OUTPUT_LIMIT) | Limits the amount of output returned by a remote shell command.                                                     |
| [AXCL_HOST_CONSOLE_LEVEL](../../appendix/environment_variables.md#AXCL_HOST_CONSOLE_LEVEL)         | When set explicitly, `axcl-smi` no longer disables console logging by default, which helps diagnose runtime issues. |
| [AXCL_HOST_LOG_DIR](../../appendix/environment_variables.md#AXCL_HOST_LOG_DIR)                     | Specifies the host log directory. The log path reported in diagnostic messages comes from this setting.             |

## 10. Troubleshooting

When a data item cannot be collected, `axcl-smi` does not abort the output. Instead it displays that field as `--` and appends a diagnostic line and the runtime log path to stderr.

| Symptom                                         | Possible cause                                                                                         | Suggested action                                                                              |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------- |
| `failed to initialize AXCL, ret = 0x...`        | The driver is not loaded, the device is not enumerated, or the environment variables are not in effect | Check the kernel module status and retry after running `source /etc/profile`.                 |
| `no AXCL devices available`                     | No usable device was found                                                                             | Verify the PCIe link and the device power state.                                              |
| `invalid device index: N`                       | `-d` is outside `[0, device count - 1]`                                                                | Run `axcl-smi` first to confirm the actual card index.                                        |
| `axcl-smi: failed to create context for card N` | Creating the runtime context for that card failed                                                      | Check the reported runtime log to locate the cause.                                           |
| `axcl-smi: card N unavailable: ...`             | Collecting the corresponding fields failed                                                             | Check the device-side `proc` / `sysfs` nodes or the firmware version for the reported fields. |
| `'<command>' requires -d <device>`             | The subcommand (e.g. `sh`, `push`, `pull`, `collect-log`) is missing the required `-d` | Add `-d <card>`.                                                                              |

The command returns `0` on success and a non-zero value on failure.
