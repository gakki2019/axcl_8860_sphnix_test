# Virtual TTY

`ax_vtty` provides a virtual terminal between the host and a device. On the host, connect to the device terminal through `/dev/ttyAXV*` in the same way as you would use a serial terminal.

`ax_vtty` does not connect to a physical UART. The `115200` value is a compatibility setting required by terminal tools; it does not represent the actual AXCL link speed.

## 1. Installing `picocom`

`picocom` is the recommended tool for connecting to the virtual terminal. Choose the installation command for the host operating system.

**Debian / Ubuntu:**

```bash
sudo apt update
sudo apt install -y picocom
```

**CentOS:**

```bash
sudo yum install -y picocom
```

Verify the installation:

```bash
picocom --help
```

## 2. Pre-use checks

The loading behavior of `ax_vtty` depends on where it runs:

- **Host:** The user must load `ax_vtty` manually.
- **Device:** The system loads `ax_vtty` automatically during boot in the normal configuration.

Use `axcl-smi sh` to check the module and device node on device 0:

```bash
# Check the device-side module
axcl-smi sh -d 0 "lsmod | grep -E 'ax_vtty'"

# Check the device-side virtual TTY node
axcl-smi sh -d 0 "ls -l /dev/ttyAXV*"
```

When the device side is ready, these commands normally show `ax_vtty` and `/dev/ttyAXV0`. `axcl-smi sh` is intended for checks and does not provide an interactive TTY; use `picocom` for the actual terminal session.

## 3. Loading the host driver

On the host, load only `ax_vtty` manually:

```bash
sudo modprobe ax_vtty
```

`modprobe` resolves the module dependencies automatically.

Check the host-side nodes:

```bash
lsmod | grep ax_vtty
ls -l /dev/ttyAXV*
dmesg | grep 'vtty: /dev/'
```

The kernel log maps each node to a device ID, for example:

```text
vtty: /dev/ttyAXV0 devid 3 port 80 ready, rx_pkts 1024 payload 1024
```

The host module normally needs to be loaded only once. If the device list or device IDs change, reload the host module to recreate the nodes.

## 4. Connecting with `picocom`

`picocom` is the recommended terminal tool. For example, connect to `/dev/ttyAXV0` on the host:

```bash
sudo picocom -b 115200 --flow n /dev/ttyAXV0
```

Common terminal settings:

| Setting | Value |
| --- | --- |
| Baud rate | `115200` |
| Data bits | `8` |
| Stop bits | `1` |
| Parity | None |
| Hardware flow control | Disabled |
| Software flow control | Disabled |

After entering `picocom`, a login prompt is shown when `getty` is running on the device. Log in with the credentials configured for the device.

Exit `picocom` with:

```text
Ctrl-A, then Ctrl-X
```

If the node is not `/dev/ttyAXV0`, use the node shown by the host-side `dmesg` output:

```bash
sudo picocom -b 115200 --flow n /dev/ttyAXV1
```

Only one terminal program should own a node at a time. Running multiple `picocom`, `screen`, or `minicom` instances on the same node can interleave output or steal input.

## 5. Complete usage example

The following example checks the device, loads the host driver, and opens a device shell.

### 5.1 Check the device side

```bash
axcl-smi sh -d 0 "lsmod | grep -E 'ax_comm|ax_vtty'"
axcl-smi sh -d 0 "ls -l /dev/ttyAXV*"
```

If `ax_vtty` is missing on the device, check the device boot sequence and kernel log. Normally, the device side does not require a manual `insmod`.

### 5.2 Load the host driver

```bash
sudo modprobe ax_vtty
ls -l /dev/ttyAXV*
```

### 5.3 Connect to the terminal

```bash
sudo picocom -b 115200 --flow n /dev/ttyAXV0
```

Then run a command in the device terminal:

```text
cat /proc/ax_proc/version
```

## 6. Selecting a device and naming nodes

By default, the host module creates nodes for all supported devices. To connect only to one device, pass its `devid` when loading the host module:

```bash
sudo modprobe ax_vtty devid=3
ls -l /dev/ttyAXV*
sudo picocom -b 115200 --flow n /dev/ttyAXV0
```

Node numbers are assigned in device enumeration order and do not necessarily equal `devid`. Use `dmesg | grep 'vtty: /dev/'` to confirm the mapping.

Common module parameters:

| Parameter | Default | Description |
| --- | ---: | --- |
| `devid` | `-1` | `-1` selects all devices; a non-negative value selects one device ID. |
| `port` | `80` | Virtual terminal communication port. Both sides must use the same port convention. |
| `dev_name` | `ttyAXV` | Prefix for host-side TTY nodes. |
| `payload_size` | `1024` | Maximum payload of one communication packet, limited to `256` through `1024` bytes. |
| `rx_buf_size` | `1048576` | Receive buffer size, up to `16777216` bytes. |

Parameters take effect only when the module is loaded. Exit `picocom` before changing them, then unload and reload the module:

```bash
sudo modprobe -r ax_vtty
sudo modprobe ax_vtty devid=3
```

`port` and `payload_size` should match the device side. The device normally loads its default parameters automatically; if custom values are used on the host, make sure the device-side communication configuration matches them.

## 7. Troubleshooting

| Symptom | Check | Action |
| --- | --- | --- |
| No `/dev/ttyAXV*` on the host | `lsmod \| grep ax_vtty`, `dmesg \| grep vtty` | Run `sudo modprobe ax_vtty` on the host and let module dependencies be resolved automatically. |
| `ax_vtty` missing on the device | `axcl-smi sh -d 0 "lsmod \| grep ax_vtty"` | Check the device boot log and module files; the device normally loads it automatically. |
| No `/dev/ttyAXV*` on the device | `axcl-smi sh -d 0 "ls -l /dev/ttyAXV*"` | Confirm that the device is enumerated and devtmpfs is mounted. If needed, run `axcl-smi sh -d 0 "dmesg \| grep vtty"`. |
| `picocom` cannot open the node | `ls -l /dev/ttyAXV*`, `dmesg \| grep vtty` | Use an existing node and confirm that the current user has read/write permission. |
| No output after opening the node | Check both sides' `port`, module state, and terminal ownership | Use the same `port` on both sides and stop other programs that own the node. |
| Output is lost or truncated | Check `dmesg \| grep vtty` and the device log | Open `picocom` before starting the workload, read promptly, and increase `rx_buf_size` when necessary. |

`axcl-smi sh` can inspect device-side state, but it cannot replace `picocom` for an interactive terminal session.
