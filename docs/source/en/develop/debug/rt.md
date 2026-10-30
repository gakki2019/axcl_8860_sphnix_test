# RT Driver Debugging

The RT driver provides two read-only nodes: `info` for users and pipes, and `ipc_info` for IPC export records. Use them to investigate application initialization, worker associations, and shared-memory import failures. Run the following commands on the host running the AXCL application.

`rt/info` has permissions `0444` and is readable by regular users. `rt/ipc_info` has permissions `0400` and typically requires root access because its output includes sharing identifiers and device addresses. If a node is missing, check that the RT driver is loaded and that its version includes the interface.

<a id="rt-user-info"></a>
## 1. Users and Pipes: `rt/info`

```bash
cat /proc/ax_proc/rt/info
```

Example output follows. Values are illustrative.

```text
========= Runtime Users Info =========
User[1]:
  pid:        1234
  refcount:   1
  report_num: 0
  Devices:
    Dev[1]:
      devid:   0
      Pipes:
        Group[1]:
          pid[0]:     1234
          pid[1]:     2345
          port_num:   2
          ports[0]:   100
          ports[1]:   101

```

| Field | Description |
| --- | --- |
| `User[n]` | User record index in this output, starting at 1. |
| `pid` | Host process identifier associated with the user record. |
| `refcount` | Kernel reference count of the user object. Multiple references can be valid; assess the count against the object lifecycle. |
| `report_num` | Reports waiting to be read by user space, including device events and worker exit reports. |
| `Dev[n]` / `devid` | Device record index and driver device identifier associated with the user. |
| `Group[n]` | Pipe group index under the current device. |
| `pid[0]` / `pid[1]` | Process identifiers registered for the two ends of the pipe group. A Runtime pipe group typically associates a host process with a device worker. `pid[1]` can be 0 for a group without a worker. |
| `port_num` / `ports[n]` | Number of ports and their port numbers. Use these to correlate COMM pipe information. |

If no user records exist, only the heading is printed. Device and pipe sections appear only when corresponding records exist.

Troubleshooting procedure:

1. Locate the application `pid` and check whether a user record exists in the driver.
2. Check `devid`, pipe groups, and port numbers, then inspect pipe status and traffic counters in [COMM Debugging](comm.md).
3. If `report_num` keeps increasing, check whether the application reads events and reports promptly. This count indicates report queue length; review the report contents and logs to determine whether a fault has occurred.
4. If a record remains after application exit, verify that the process has exited, all driver handles are closed, and the associated objects are no longer referenced.

<a id="rt-ipc-info"></a>
## 2. IPC Export Records: `rt/ipc_info`

```bash
sudo cat /proc/ax_proc/rt/ipc_info
```

This node lists global IPC export records for checking shared keys, owners, devices, memory attributes, and PID authorization. It covers IPC export nodes only, not all device memory allocations or consumer-local references.

### 2.1 Example Output

The following example contains one export record with a PID allowlist. The `key`, PID values, and address are illustrative.

```text
========= AXCL RT IPC Info =========
[global]
node_count=1
node_limit=4096
snapshot_truncated=0
target_limit=64

Export[0]
key=000004d200000000000000010000000000000000000000000000000000000000
owner_tgid=1234
phys_devid=0
dev_pa=0x10000000
size=0x1000
mem_flags=normal
policy=whitelist
target_num=1
target[0]=5678

```

### 2.2 Output Fields

| Field | Description |
| --- | --- |
| `node_count` | Number of IPC export nodes included in this snapshot. |
| `node_limit` | Global export node limit, currently 4096. |
| `snapshot_truncated` | `1` indicates insufficient snapshot capacity: some nodes are omitted from this output. `0` indicates no capacity truncation. |
| `target_limit` | Maximum number of PID allowlist entries per node, currently 64. |
| `Export[n]` | Record index in this snapshot, starting at 0. Use `key` to correlate records across reads. |
| `key` | IPC sharing identifier corresponding to the `key` used by the application for export and import. |
| `owner_tgid` | TGID of the process that created the export record. This is a process-level identifier. |
| `phys_devid` | Physical device ID associated with the record. |
| `dev_pa` / `size` | Device address and memory size in the export record, both in hexadecimal. The size is in bytes. Only the address value is displayed. |
| `mem_flags` | Memory attribute: `normal` or `cached`. |
| `policy` | `whitelist` enables PID allowlist checks. `disable_pid_validation` disables PID allowlist checks; other import checks still apply. |
| `target_num` / `target[n]` | Number of valid allowlist entries and the target process TGIDs. Duplicate PID entries are allowed, so the entry count can exceed the number of distinct target processes. |

When there are no export records, the output contains only the heading and the `[global]` section with `node_count=0`. No `Export[n]` sections appear.

### 2.3 Troubleshooting

**Shared-memory import failure:**

1. Search for the complete `key` used by the application. If it is missing, verify the key, check that export succeeded, and confirm that the record has not been released. Collect the output again if the snapshot is truncated.
2. Check that `owner_tgid`, `phys_devid`, `dev_pa`, `size`, and `mem_flags` match the exporter's expected values.
3. If `policy=whitelist`, confirm that the allowlist contains the importing process TGID. Authorization checks use the process identifier and include protection against PID reuse. A new process does not automatically inherit authorization by reusing the same PID.
4. Continue with the import return code, device online status, and kernel logs. Other import conditions still apply after the record and authorization checks pass.

**Export records remain after release:**

Collect output before and after the operation and compare records by `key` and `owner_tgid`. Confirm that the exporter has released the record or closed its last associated driver handle. With other IPC applications running, `node_count` can remain nonzero; focus on the target application's records.

**`snapshot_truncated=1`:**

New nodes were added after snapshot capacity was determined, so the output is incomplete. Read again when activity is lower. `node_count` is the number of nodes actually printed in this snapshot; results can differ between reads.

**Out-of-memory read error:**

If snapshot allocation fails, the read may return `ENOMEM`. The driver attempts to output `global_snapshot_error=-ENOMEM`, but the text may be unavailable because the read fails. Save the command error and kernel logs, check available host memory, and retry.

### 2.4 Read Overhead

The driver creates a temporary snapshot on read: it copies records while holding the IPC lock, then releases the lock before formatting the output. The snapshot is freed after content generation, and the output buffer is freed when the file is closed. This node has no background collection task.

A large number of nodes with long allowlists can produce several MB of output. We recommend collecting information as needed and avoiding high-frequency polling. Total read time includes snapshot copying and output formatting; the IPC lock is held only during copying.
