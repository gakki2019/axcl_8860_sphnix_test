# Log Collection

`axcl-collect-logs` collects logs in one step when you run into a problem with AXCL. It packs the logs of the host and all AXCL devices into a single file; just send that file to technical support.

You can run it even when a device has stopped responding: logs on the host are still collected, and devices that do not respond are skipped after a timeout.

## 1. Quick Start

Run on the host:

```bash
sudo /usr/local/axhelix/bin/axcl-collect-logs -o /tmp
```

When it finishes, the last line shows the log package that was created, for example:

```text
archive: /tmp/axhelix_logs_20261031_105529_816.tar.gz
```

Send this file to technical support; its name contains the time it was created. `-o` sets the directory to save the log package in; without it, the current directory is used. Many systems clear `/tmp` on reboot, so send the log package or copy it elsewhere before rebooting.

```{note}
Running with `sudo` is recommended; use the full path, because with `sudo` the bare command name is not found. The tool also runs without `sudo`, but some kernel logs and driver status can only be read by an administrator and will be missing; at the end the tool prints the command to rerun with `sudo`.
```

````{note}
If your application uses the environment variable `AXCL_HOST_LOG_DIR` or `AXCL_DUMP_DIR` to store logs or crash files in another directory, run the tool with `sudo -E` in the terminal where these variables are set, otherwise it cannot find those directories:

```bash
sudo -E /usr/local/axhelix/bin/axcl-collect-logs -o /tmp
```
````

## 2. Options

```text
axcl-collect-logs [options]
```

| Option | Description |
| --- | --- |
| `-o, --output <dir>` | Directory to save the log package in; created if it does not exist. Defaults to the current directory. |
| `-d, --device <list>` | Which cards to collect logs from: `all` for every card (default), `none` to skip the devices and collect host logs only, or card numbers such as `0` or `0,2`. Card numbers start at `0`; a number beyond the actual card count is an error and the tool exits without collecting anything. When only one card has a problem, collecting just that card is faster. |
| `-t, --timeout <sec>` | Maximum time to wait for the log package of each card, in seconds, `40` to `300`, default `120`. Increase it if a device has a lot of logs. Reading the device state before the log package is not counted in `-t` and takes up to about 30 seconds per item; all cards, including reading the device state, share a total of about 5 minutes. |
| `-v, --version` | Show the version and exit. |
| `-h, --help` | Show the help and exit. |

When calling the tool from a script, check its exit status: `0` means the log package was created (also when a few items could not be collected), `1` means invalid arguments (including a card number beyond the actual card count), and `2` means the log package could not be created.

## 3. Collected Content

| Category | Content |
| --- | --- |
| Host system | Operating system version, CPU, memory, disk space, PCIe device list and topology, and details of the whole PCIe path from the root port to each card (including PCIe switches in between) |
| AXCL installation | Package version and integrity check, install and uninstall logs, driver build status |
| Kernel and drivers | Kernel logs (including the previous boot), interrupt statistics, version, parameters and status of the AXCL driver modules |
| AXCL runtime | AXCL runtime logs on the host, crash files (minidumps) written when an application crashes, AXCL environment variables |
| Devices | System logs, AXCL logs, crash files, kernel logs, interrupt statistics, memory information and driver status of every card |

- `summary.txt` in the log package lists whether each item was collected.
- The tool does not collect personal files, home directories, the full environment or process lists.
- The log package is readable by all users (including users of other hosts when it is saved on network storage), so that it can be picked up directly from shared directories. It contains kernel logs, driver states and program crash dumps; on a host shared by several people, save it to a directory only you can access, or move it away after collection.

## 4. Run Time and Interruption

- It usually finishes within a few dozen seconds. It takes longer when a device does not respond or has a lot of logs, but it always finishes within about 7 minutes.
- Pressing `Ctrl+C` stops the collection, and what has been collected is still packed into a log package. Once packing has started (the screen shows `packing archive`), `Ctrl+C` has no effect; wait for packing to finish, which usually takes only a few seconds.

## 5. Common Messages

| Message | Meaning and action |
| --- | --- |
| `not run as root, some items were skipped` | `sudo` was not used and some content is missing. Rerun with `sudo` using the printed command. |
| `output directory ... is inside ..., which is collected` | The log package cannot be saved inside a log directory that is itself collected (`/tmp/axcl`, `/var/log/axhelix`). Use `-o` to choose another directory, for example `-o /tmp`. |
| `bash 5.0 or later is required` | The system's bash is too old for the tool. Every system supported by AXCL ships bash 5.0 or later; check that the system meets the AXCL installation requirements. |
| `cannot write to output directory` | The output directory (the current directory unless `-o` is given) is not writable. Use `-o` to choose a writable directory, for example `-o /tmp`. |
| `WARN: device/<N>/device<N>_collect-log.txt: failed` or `timeout` | The logs of card `N` could not be collected; everything else is unaffected. `timeout` is shown when the device does not respond or has a lot of logs. The reason is recorded in the log package, so just send the log package to technical support. |
| Other `WARN: <item>: failed`, `timeout` or `partial` | That item could not be collected or is incomplete (for example, some driver status cannot be read without `sudo`); everything else is unaffected and the log package is still created. Just send the log package to technical support. |
| `WARN: cannot set the archive permissions` | The output directory does not support changing file permissions (for example, some network storage). The log package is created, but other users may not be able to read it. To share it, rerun with `-o` to choose another directory. |
| `summary.txt` says temporary files may remain on a device | The device had a lot of logs or the collection was interrupted. After making sure no other collection is running, remove them with `axcl-smi sh -d <N> "rm -rf /opt/data/.collect_* /opt/data/device<N>_log_*.tar.gz"`, replacing both `<N>` with the card number; for card 0: `axcl-smi sh -d 0 "rm -rf /opt/data/.collect_* /opt/data/device0_log_*.tar.gz"`. |
