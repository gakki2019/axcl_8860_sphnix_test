# COMM Driver Debugging

The COMM driver `info` node reports communication devices, handshake status, pipe traffic statistics, DMA tasks, and DMA memory. Use it to investigate connection failures, message transfer issues, receive queue buildup, and DMA transfer problems.

Run the following command on the host running the AXCL application. The node has permissions `0444` and is readable by regular users. If it is missing, check that the COMM driver is loaded and that its version includes the interface.

```bash
cat /proc/ax_proc/comm/info
```

Example values are illustrative; details may be empty when no pipes, tasks, or memory blocks exist.

## 1. Device Overview

```text
================================================================================
Comm Devices
  pipe_buf_capacity: 4096 bytes
================================================================================

  Device  devid   type   status  ref
  1       0x0     PCIE-H ONLINE  3

Device 1
--------------------------------------------------------------------------------
  bdf: 0000:01:00.0
```

| Field | Description |
| --- | --- |
| `pipe_buf_capacity` | Data capacity of each cacheable receive buffer (cookie), in bytes. |
| `Device` | Device index in this output, starting at 1. |
| `devid` | COMM driver device identifier in hexadecimal. Check the device identifier and port number when correlating RT data; the `Device` column only indicates output order. |
| `type` | Device type: `PCIE-H`, `USB-H`, and `LOC-H` are host types; `PCIE-S`, `USB-S`, and `LOC-S` are device types. |
| `status` | `ONLINE`, `OFFLINE`, `REMOVED`, or `UNKNOWN`. |
| `ref` | Kernel reference count of the device object. |
| `bdf` | PCI address of a host PCIe device, in `domain:bus:device.function` format. Use it to correlate system enumeration data. Other device types may omit this field. |

For connection issues, first confirm that the target device exists and is `ONLINE`, then check handshake status and application pipes.

## 2. Handshake and Communication Pipes

```text
    Handshake:
      type  port  status   tx(msg/byte)   rx(msg/byte)
      0     0     READY    10/640         10/640

    Pipes(1):
      id       type  port  status   loc-gen    peer-gen   rx_queue     cookie_reuse/requests(%)
      0x1      1     100   READY    0x12       0x34       2(8)         90/100(90.00%)

      id       tx(msg/byte)             rx(msg/byte)             tx(msg/s)                rx(msg/s)
      0x1      100/6400                 80/5120                  20(1.28KB/s)             16(1.02KB/s)
```

`Handshake` shows the device handshake pipe. `Pipes(n)` shows the regular pipes in this snapshot and their count. Pipe counts do not have a one-to-one correspondence with application connection counts.

| Field | Description |
| --- | --- |
| `id` | Driver pipe handle identifier in hexadecimal. Use it to correlate the status and traffic tables in this output. |
| `type` / `port` | Pipe type number and port number. Type `0` is a control pipe, `1` is a data pipe, and `2` is a debug pipe. |
| `status` | Current pipe state; see the table below. |
| `loc-gen` / `peer-gen` | Local and peer handshake generation identifiers, used to distinguish pipe instances before and after recreation. They are generated independently and can differ. |
| `rx_queue` | `current (peak)`, where the values are the current message count and its historical peak. For example, `2(8)` means 2 messages are queued and the historical peak is 8. |
| `cookie_reuse/requests(%)` | Receive buffer (cookie) reuse count, request count, and reuse percentage. The percentage is `-` when the request count is 0. |
| `tx(msg/byte)` / `rx(msg/byte)` | Cumulative successful sends and receives for this pipe, as `message count/byte count`. DMA task information is reported separately. |
| `tx(msg/s)` / `rx(msg/s)` | Last updated rate, as `message rate (byte rate)`, in messages per second and KB/s. Here, `KB` is 1000 bytes. |

| State | Meaning and Checks |
| --- | --- |
| `INIT` | Initial state. |
| `CREATED` | The pipe is created but the readiness handshake is incomplete. If it remains in this state, check the peer and handshake logs. |
| `READY` | The pipe is ready. Check traffic counters and application results to verify operation. |
| `PCLSD` | The peer has closed. Check peer exit, pipe release, or recreation. |
| `DESTROY` | The pipe is being destroyed. |
| `UNKNOWN` | No display name is defined for the current state value. Check the driver version and logs. |

Rates update on successful message transfers over a window of at least 1 second. A rate is shown as `-` if no valid rate is available or if it has not been updated for more than 3 seconds. Reading does not reset cumulative counters or the measurement window, so the polling interval does not determine the rate measurement period.

### Troubleshooting

- **Message receive issues:** Check the device and port, confirm that the pipe is `READY`, inspect changes in cumulative `tx/rx` counters, and check peer receive logic. Account for endpoint, pipe, and collection-time differences when comparing counters.
- **Increasing receive latency:** Collect `rx_queue` repeatedly. If the current queue keeps growing, check how quickly the application reads messages or runs callbacks. The historical peak records only the largest previous backlog.
- **Pipe recreation:** Correlate `id`, `port`, `loc-gen`, and `peer-gen` with application logs. A new pipe starts with initial counter values.
- **`... snapshot truncated ...`:** New pipes were added after snapshot capacity was determined. The pipe list is incomplete; collect it again.
- **`Pipes: snapshot allocation failed`:** Pipe snapshot allocation failed, so complete pipe details are unavailable. Check available memory and retry.

## 3. DMA Tasks

Devices that support DMA transfers display a `DMA` section. Tasks are grouped by owner as `TGID (process name)`, with `Summary`, `Tasks`, and `Resources` sections. Statistics cover tasks that still exist at collection time; reclaimed tasks are no longer listed.

### 3.1 Attributes and Task Information

| Field | Description |
| --- | --- |
| `attrs` | DMA coherency, scatter-gather mapping mode, and attribute bits, shown as `coherent/non-coherent` and `sg-map/direct-sg`. |
| `total` / `Summary` | Device-wide or per-process task counts, classified by synchronous/asynchronous mode, direction, and state. |
| `id` | DMA task identifier. |
| `mode` | `sync` for a synchronous task; `async` for an asynchronous task. |
| `dir` | `h2d` for host to device; `d2h` for device to host. |
| `status` | `created`, `pending`, `running`, `completed`, `aborted`, `cleanup`, or `unknown`. |
| `size` | Task transfer size in hexadecimal, in bytes. |
| `create_us` | Time spent creating the task, in microseconds. |
| `xfer_us` | Time from submission to completion. For unfinished tasks, the value is the time from submission to collection; for unsubmitted tasks, it is `-`. The unit is microseconds; this is not pure hardware transfer time. |
| `hw_task_id` | Underlying transfer task identifier in hexadecimal. |

### 3.2 Task Resources

| Field | Description |
| --- | --- |
| `mem_type` | Task memory type: `pinned` for pinned user pages; `memblk` for a driver memory block. |
| `mapped` | Whether DMA mapping is currently established. |
| `pinned` | Whether pinned user pages are currently held. |
| `sg_nents` / `orig_nents` | Current and original scatter-gather entry counts. DMA mapping can merge entries, so the counts can differ. |

If a task remains `pending` or `running` for an extended period, check task size, `xfer_us`, device status, interface return codes, and kernel logs. A `completed` task may remain briefly until its result is read or its resources are reclaimed. Compare multiple captures when investigating a resource leak.

`DMA: snapshot allocation failed` indicates that DMA task information could not be collected completely. Check available memory and retry.

## 4. DMA Memory

`DMA Memory` displays `host` or `slave` by DMA character device type, then groups records by owner process. It covers DMA memory blocks registered with the COMM driver, not all device memory, pinned user pages, or Runtime IPC export records.

| Field | Description |
| --- | --- |
| `blocks` | Number of memory blocks in the current snapshot. |
| `needed_total` / `allocated_total` | Total requested and allocated sizes in hexadecimal, in bytes. |
| `id` | Memory block identifier. |
| `needed` / `allocated` | Requested and allocated sizes of one block. Allocation granularity or alignment requirements can make the allocated size larger than the requested size. |
| `type` | Allocation method: `buddy` or `coherent`. |
| `sg_nents` | Number of scatter-gather entries in the memory block. |

To investigate memory release issues, collect output before the operation and after resource release, compare records by process and block identifier, and confirm that the application has released the memory, associated tasks, and driver handles.

`host: snapshot allocation failed` or `slave: snapshot allocation failed` indicates that the corresponding memory block information is unavailable. Check available memory and retry.

## 5. Correlating RT and COMM Information

1. Locate the application PID, device, and ports in [RT User Information](rt.md#rt-user-info).
2. Find the corresponding device and pipes in COMM output, and check status, queues, and traffic counters against expected application behavior.
3. For DMA transfer failures, inspect DMA tasks and memory blocks for the same process. For shared-memory import failures, inspect [IPC Export Records](rt.md#rt-ipc-info).
4. Correlate interface return codes, issue timestamps, and kernel logs to identify the cause, and retain the collected information.

### Collecting Diagnostic Information

When an issue occurs, run the following commands to collect diagnostic information. Each capture is saved in a separate directory. To investigate resource release issues, compare captures taken before and after release. If a command reports an error, check whether the corresponding information was collected.

```bash
if capture_dir=$(mktemp -d ./axcl-debug.XXXXXXXX); then
    date -Iseconds > "$capture_dir/time.txt"
    uname -a > "$capture_dir/kernel.txt"
    cat /proc/ax_proc/rt/info > "$capture_dir/rt-info.txt"
    sudo cat /proc/ax_proc/rt/ipc_info > "$capture_dir/rt-ipc-info.txt"
    cat /proc/ax_proc/comm/info > "$capture_dir/comm-info.txt"
    sudo dmesg > "$capture_dir/dmesg.txt"
    printf 'Capture directory: %s\n' "$capture_dir"
fi
```

Each node reflects its state at the time it is read; the outputs do not form a system-wide snapshot taken at a single instant. Account for application operations and collection times when comparing results. Changes in record indices, queue lengths, or task counts do not by themselves indicate a fault.

These interfaces only read diagnostic information and do not reset statistics. Collection uses CPU time and temporary memory and may contend with application operations for driver locks. Collect information as needed and avoid high-frequency polling. Before sharing the output externally, check whether sharing identifiers, device addresses, and process information need to be redacted.
