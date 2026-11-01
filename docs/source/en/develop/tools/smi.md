# axcl-smi

`axcl-smi` is the AXCL device management command-line tool. It runs on the host and lets you view device status, run commands on a device, transfer files between the host and a device, and collect device logs.


## 1. Capabilities

| Capability      | Description                                                                                         |
| --------------- | --------------------------------------------------------------------------------------------------- |
| Device summary  | Lists the firmware version, temperature, CPU/NPU utilization, and memory usage of every card, along with the processes running on it. |
| Device details  | Shows detailed information about a card, including the UID, module frequencies, per-core NPU utilization, and PCI information. |
| Live monitoring | Periodically refreshes the temperature, utilization, and memory usage of each card.                 |
| Remote shell    | Runs a shell command on a device and shows its output.                                               |
| File transfer   | Uploads and downloads files or directories between the host and a device.                            |
| Log collection  | Packages the device logs and downloads them to the host, for one card or, with `--all`, for every card. |


## 2. Command Overview

```text
axcl-smi [<command> [<args>]] {OPTIONS}
```

| Command       | Description                                                       | `-d` required    |
| ------------- | ----------------------------------------------------------------- | ---------------- |
| (no command)  | Shows the device summary; enters live monitoring when `-n` is given | No               |
| `info`        | Shows device details                                              | No               |
| `watch`       | Monitors device status in real time                               | No               |
| `sh`          | Runs a shell command on a device                                  | Yes              |
| `push`        | Uploads a file or directory to a device                           | Yes              |
| `pull`        | Downloads a file or directory from a device                       | Yes              |
| `collect-log` | Collects device logs and downloads them to the host               | Yes (or `--all`) |

Global options:

| Option             | Default | Description                                                                                                                     |
| ------------------ | ------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `-d`, `--device`   | None    | Card index, starting from `0`. Without it, `info`, `watch`, and the summary show every card; `sh`, `push`, and `pull` require one card; `collect-log` requires `-d` or `--all`. |
| `-n`, `--interval` | `2`     | Refresh interval of live monitoring in seconds; `0` is treated as `2`.                                                          |
| `-v`, `--version`  | --      | Shows the version and exits.                                                                                                    |
| `-h`, `--help`     | --      | Shows the help and exits.                                                                                                       |

```{note}
- Card indexes always cover every device on the host and ignore `AXCL_VISIBLE_DEVICES`.
- To keep the tables readable, `axcl-smi` does not print runtime logs to the terminal by default; set `AXCL_HOST_CONSOLE_LEVEL` to turn them on when troubleshooting, for example `AXCL_HOST_CONSOLE_LEVEL=3 axcl-smi info -d 0`.
- Press `Ctrl+C` once and `axcl-smi` exits after the current operation or refresh completes. If it does not respond for a long time (for example, the device is unresponsive), press `Ctrl+C` again to force it to quit, which may leave a partially transferred file behind.
```

## 3. Device Summary

Without a command, `axcl-smi` shows the summary of every card and the processes running on it:

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

Fields:

| Field                  | Description                                                  |
| ---------------------- | ------------------------------------------------------------ |
| `Card`                 | Card index.                                                  |
| `Name`                 | Chip model.                                                  |
| `Firmware`             | Device firmware version.                                     |
| `Driver`               | Host driver version.                                         |
| `Bus-Id`               | PCIe address of the card on the host.                        |
| `Temp`                 | Chip temperature in degrees Celsius.                         |
| `CPU` / `NPU`          | Device CPU and NPU utilization (NPU is the sum of all cores). |
| `Memory-Usage`         | Used and total device system memory.                         |
| `CMM-Usage`            | Used and total device CMM memory.                            |
| `Fan`, `Pwr:Usage/Cap` | Not supported in the current version; shown as `--`.         |
| `PID`                  | Process ID on the device.                                    |
| `Process Name`         | Process path, shortened when too long.                       |
| `NPU Memory Usage`     | NPU memory used by the process.                              |


## 4. Device Details

`info` shows detailed information about a card. Compared with the summary, it adds the UID, module frequencies, per-core NPU utilization, and PCI information (some frequency entries are omitted in the example below):

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

Without `-d`, every card is shown in turn. Power and fan speed are not supported in the current version and are shown as `--`.

## 5. Live Monitoring

`watch` refreshes the display at the interval given by `-n`, which is handy for watching load changes:

```bash
# Refresh the status of every card every 2 seconds
axcl-smi watch -n 2

# Watch card 0 only, refreshing every second
axcl-smi watch -d 0 -n 1
```

Output format:

```text
Card     Chip     Pwr(W)     Temp(C)     CPU (%)     NPU(%)     Memory(%)     CMM(%)
0        ax8860   --         35          16          19         2             8
```

`Memory(%)` and `CMM(%)` are the used amount as a percentage of the total. Press `Ctrl+C` to exit.

```{note}
Without a command but with `-n`, `axcl-smi` also enters live monitoring, the same as `axcl-smi watch -n <interval>`. Without `-n`, it shows the summary once.
```

## 6. Remote Shell

`sh` runs a shell command on the specified card and shows the output on the host. Wrap the whole command in double quotes; otherwise arguments starting with `-` are taken as `axcl-smi` options, and characters such as spaces, `*`, `|`, and `>` are handled by the host shell first. Use single quotes when the command contains `$` or backticks; otherwise they are expanded on the host first:

```bash
axcl-smi sh -d 0 "free"
axcl-smi sh -d 0 "ls -l /opt/data"
```

```{warning}
The command is passed to the device as is, without any checking or filtering, and usually runs as root. Operations such as `rm -rf`, `dd`, `mkfs`, or overwriting system files take effect immediately and cannot be undone, and may corrupt the device file system or even require reflashing the firmware.

Only run commands whose effects you understand, and never build the command from external input, configuration files, network data, or scripts of unknown origin.
```

- The command times out after 10 seconds by default; adjust it with [AXCL_SMI_SHELL_TIMEOUT](../../appendix/environment_variables.md#AXCL_SMI_SHELL_TIMEOUT).
- At most 1 MiB of output is returned and the rest is truncated; adjust it with [AXCL_SHELL_CMD_OUTPUT_LIMIT](../../appendix/environment_variables.md#AXCL_SHELL_CMD_OUTPUT_LIMIT).
- Interactive commands such as `top` and `vi` are not supported.
- If the command fails (exits with a non-zero status, is terminated, or times out), its output so far is still shown (or, when there is none, the reason, such as `shell command exited with status 1`), followed by `shell command failed on device N`, and `axcl-smi` returns non-zero. After `shell RPC timed out`, the command may still be running on the device.

To run device commands from a program, use [axclrtControlExecuteShellCmd](../c/control_api.md#axclrtControlExecuteShellCmd).

## 7. File Transfer

`push` uploads a file or directory from the host to a device, and `pull` downloads from a device to the host:

```bash
# Upload a single file
axcl-smi push -d 0 ./model.axmodel /tmp/model.axmodel

# Download a single file
axcl-smi pull -d 0 /tmp/runtime.log ./runtime.log

# When the destination is a directory, the file keeps its name inside it; same as /opt/bin/model.axmodel
axcl-smi push -d 0 ./model.axmodel /opt/bin/
```

Transferring a directory requires `-r` or `--recursive`:

```bash
# If /tmp/deploy exists, the result is /tmp/deploy/assets
axcl-smi push -d 0 -r ./assets /tmp/deploy
axcl-smi pull -d 0 --recursive /tmp/deploy/assets ./download
```

Notes:

- Each transfer works with a single card.
- Without `-r`, only a single regular file can be transferred, and empty files are not supported; with `-r`, only a directory, and empty files inside it are transferred normally.
- Without `-r`, when the destination is an existing directory or ends with `/`, the file keeps its name inside that directory. When uploading to a directory on the device, end the destination with `/`; otherwise the tool first checks whether the destination is a directory and does not transfer if the check fails.
- With `-r`, if the destination directory exists, the source directory is placed inside it as a whole; if it does not exist, it is created and receives the contents of the source directory. In both cases, the parent of the destination directory must already exist.
- Without `-r`, `push` requires the parent directory of the destination file to already exist on the device, while `pull` creates missing parent directories on the host.
- A single file must not exceed 4 GiB. Device files, pipes, and other special files are not supported.
- A file with the same name is overwritten; other files already in the destination directory are kept.
- Before downloading, `pull` checks that the destination on the host can be written; if not, it reports an error right away.
- File transfer requires the host package and the device firmware to be of matching versions; otherwise the transfer fails.

For more details, see [File API](../c/file_api.md).

## 8. Log Collection

`collect-log` packages the `AXSyslog` and `axclLog` directories under `/opt/data` on the device, together with the device kernel log, into a `tar.gz` and downloads it to the host:

```bash
# Download to the current directory
axcl-smi collect-log -d 0

# Download to a given directory
axcl-smi collect-log -d 0 /tmp/axcl-logs

# Collect every card, one file per card
axcl-smi collect-log --all /tmp/axcl-logs
```

The file name follows the `device<card>_log_<date>_<time>_<milliseconds>.tar.gz` format and extracts into a directory with the same name:

```text
device0_log_20260923_101530_204.tar.gz
└── device0_log_20260923_101530_204/
    ├── AXSyslog/
    ├── axclLog/
    └── dmesg.txt
```

Notes:

- Collection does not interrupt logs that are being written on the device; the archive holds their content at the time of collection.
- `dmesg.txt` is the device kernel log. If it cannot be obtained, a notice is shown and the archive does not include it.
- Collection fails when neither `AXSyslog` nor `axclLog` exists on the device.
- Progress and warning messages go to stderr, tagged with the card index. If a log file is rotated or deleted during collection, it is reported there as well, and that file may be incomplete in the archive.
- If the output directory cannot be written, an error is reported right away. When running in a directory without write permission (such as `/usr/local/axhelix/bin`), specify an output directory, for example `axcl-smi collect-log -d 0 /tmp`.
- `--all` collects the cards one by one and cannot be combined with `-d`. A failed card does not affect the others. The command ends with `collect-log: <succeeded>/<total> devices succeeded` (cards skipped because they did not respond count toward the total) and returns non-zero if any card failed. Pressing `Ctrl+C` during collection stops after the current card; if cards remain, they are skipped, the summary line ends with `(interrupted)`, and the command returns non-zero.
- Packaging may time out when there are many logs; increase [AXCL_SMI_SHELL_TIMEOUT](../../appendix/environment_variables.md#AXCL_SMI_SHELL_TIMEOUT) in that case.
- Temporary files on the device are always cleaned up, whether or not the download succeeds. If packaging times out, a `.collect_*` directory or an unfinished `device*_log_*.tar.gz` may be left under `/opt/data` on the device; after making sure no other collection is running, remove it with `axcl-smi sh`.

## 9. Related Environment Variables

| Environment variable                                                                               | Description                                                                  |
| -------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| [AXCL_SMI_SHELL_TIMEOUT](../../appendix/environment_variables.md#AXCL_SMI_SHELL_TIMEOUT)           | Timeout, in milliseconds, of commands that `sh` and `collect-log` run on the device. |
| [AXCL_SHELL_CMD_OUTPUT_LIMIT](../../appendix/environment_variables.md#AXCL_SHELL_CMD_OUTPUT_LIMIT) | Maximum output returned by `sh`.                                             |
| [AXCL_HOST_CONSOLE_LEVEL](../../appendix/environment_variables.md#AXCL_HOST_CONSOLE_LEVEL)         | When set, runtime logs are shown in the terminal, which helps troubleshooting. |
| [AXCL_HOST_LOG_DIR](../../appendix/environment_variables.md#AXCL_HOST_LOG_DIR)                     | Host log directory; the log path given in error messages is in this directory. |

## 10. Troubleshooting

When showing device information, an item that cannot be obtained does not stop the output. That item is shown as `--`, and the reason and the runtime log location are printed to stderr; this does not affect the return value.

| Symptom                                                       | Possible cause                                           | Suggested action                                                     |
| ------------------------------------------------------------- | -------------------------------------------------------- | -------------------------------------------------------------------- |
| `failed to initialize AXCL, ret = 0x...`                      | The driver is not loaded, no device is detected, or the AXCL environment variables are not set in the current shell | Make sure the driver is loaded, run `source /etc/profile`, and retry. |
| `no AXCL devices available`                                   | No usable card was found                                 | Make sure the card is installed correctly and powered on.            |
| `invalid device index: N`                                     | The card given by `-d` does not exist                    | Run `axcl-smi` to see the actual card indexes.                       |
| `failed to create context for card N` / `... for device N`    | The card cannot be reached                               | Check the runtime log given in the message.                          |
| `axcl-smi: card N: not responding (no reply within 1000 ms)` | The path from the host to the device is broken, or the device kernel does not respond | Check `dmesg` and `/proc/ax_proc/comm/info` on the host; reboot the card if needed. |
| `axcl-smi: card N: offline`                                   | The card is offline                                      | Check `dmesg` on the host, confirm the card state, then reboot the card. |
| `axcl-smi: card N: slave_daemon not running`                  | The path is fine, but `slave_daemon` on the device is not running (not started, exited, or crashed) | Check the `slave_daemon` process and its log on the device. |
| `axcl-smi: card N: status check failed, ret = 0x...`          | Checking the device status failed                        | Rerun with `AXCL_HOST_CONSOLE_LEVEL=3` and check the runtime log.    |
| `axcl-smi: card N unavailable: ...`                           | Some information of the card cannot be obtained          | Make sure the device firmware matches the host package; if the problem persists, collect logs with `collect-log` and report it. |
| `'<command>' requires -d <device>`                            | No card was given for `sh`, `push`, or `pull`            | Add `-d <card>`.                                                     |
| `'collect-log' requires -d <device> or --all`                 | `collect-log` was given neither `-d` nor `--all`         | Add `-d <card>` or `--all`.                                          |
| `'collect-log' accepts either -d <device> or --all, not both` | Both `-d` and `--all` were given                         | Keep only one of them.                                               |
| `collect-log: cannot write to output directory '<dir>': ...`  | No write permission on the output directory (the current directory by default) | Change to a writable directory, or give an output directory such as `/tmp` at the end of the command. |
| `failed to check whether '<path>' is a directory on device N ...` | The `push` destination does not end with `/` and checking whether it is a directory failed | If the destination is a directory, add `/` at the end. |
| `pull: cannot write '<path>': ...`                            | The destination on the host cannot be written, or the parent of a `-r` destination does not exist | Use a writable destination path.                                     |

The command returns `0` on success and non-zero on failure.
