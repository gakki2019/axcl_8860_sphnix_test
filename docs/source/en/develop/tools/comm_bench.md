# axcl_comm_bench

`axcl_comm_bench` is the AXCL communication benchmark tool. It runs on the host to verify that the link between the host and a device is up, and to measure the data transfer bandwidth at the AXCL runtime layer.

The tool is built on public interfaces such as [axclInit](../c/system_api.md#axclInit), [axclrtSetDevice](../c/device_api.md#axclrtSetDevice), [axclrtMalloc](../c/memory_api.md#axclrtMalloc), and [axclrtMemcpy](../c/memory_api.md#axclrtMemcpy), so it measures the end-to-end bandwidth visible to an application rather than the raw driver or PCIe link bandwidth.

Typical use cases:

- Quickly confirm that the host-device communication link works after powering up a new board or upgrading the driver.
- Evaluate bandwidth across transfer directions, payload sizes, and concurrent thread counts.
- Compare how [axclrtMallocHost](../c/memory_api.md#axclrtMallocHost) and the standard library `malloc` affect transfer performance as host memory allocators.
- Produce archivable and comparable report files when investigating performance issues.

## 1. Test Items

| Test item | Description |
| --- | --- |
| `connect` | Connectivity check. Verifies session setup, memory allocation, H2D, D2H, and D2D copies, and message loopback in sequence. |
| `bandwidth --htod` | Single-threaded Host to Device bandwidth. |
| `bandwidth --dtoh` | Single-threaded Device to Host bandwidth. |
| `bandwidth --dtod` | Single-threaded Device to Device bandwidth. |
| `bandwidth --h2h` | Host to Host copy bandwidth, used as a reference baseline. |
| `sweep` | Concurrent multi-threaded sweep covering the H2D, D2H, and D2D directions. |
| `message` | Latency and bandwidth of the internal message channel loopback. |
| `compare` | H2D -> D2H data loopback validation using `memcmp`. |

Data specification of each test item:

| Test item | Payload size | Threads | Repetitions |
| --- | --- | --- | --- |
| `bandwidth --htod` / `--dtoh` / `--dtod` | 1 KiB, 10 KiB, 100 KiB, 1 MiB, 10 MiB, 100 MiB | 1 | 1 warm-up + 3 timed runs |
| `bandwidth --h2h` | Same as above | 1 | 1 warm-up + 10 timed runs |
| `sweep` | 1 MiB, 10 MiB, 100 MiB | 1, 2, 4, 8 | 1 run per combination |
| `message` | 32 B, 64 B, 256 B, 512 B | 1 | 1 warm-up + 1000 loopbacks |
| `compare` | 1–100 KiB, 100 KiB–1 MiB, 1–10 MiB, 10–100 MiB (random sizes and source data) | 1 | 1 H2D + 1 D2H + `memcmp` per size |

```{note}
`bandwidth --h2h` uses the host CPU `memcpy` and does not go through PCIe DMA. It only provides a reference baseline for host-side memory copies. This item is not part of the full automatic run, must be requested explicitly, and always covers the four source/destination allocator combinations (including the same-allocator baselines), producing four tables.
```

```{note}
`message` uses the internal message loopback interface (not a public API). Each payload is smaller than 1 KiB and travels over the message channel instead of the DMA channel, which makes it suitable for evaluating small-packet round-trip latency. The item reports `SKIP` when the device or firmware does not support it.
```

## 2. Usage

```text
axcl_comm_bench [--device <id>] [--out-dir <dir>] [--config <json>]
                [--host-alloc malloc-host,glibc]
axcl_comm_bench bandwidth --htod|--dtoh|--h2h|--dtod [--device <id>] [--out-dir <dir>]
                [--config <json>] [--host-alloc malloc-host,glibc]
axcl_comm_bench sweep    [--device <id>] [--out-dir <dir>] [--config <json>]
axcl_comm_bench connect  [--device <id>] [--out-dir <dir>] [--config <json>]
axcl_comm_bench message  [--device <id>] [--out-dir <dir>] [--config <json>]
axcl_comm_bench compare  [--device <id>] [--out-dir <dir>] [--config <json>]
                [--host-alloc malloc-host,glibc]
```

| Option | Default | Description |
| --- | --- | --- |
| `-d`, `--device` | `0` | Device index in the range `[0, device count - 1]`. |
| `-o`, `--out-dir` | `./axcl_comm_bench_out` | Report output directory. It is created when it does not exist. |
| `-c`, `--config` | Empty | Path of the JSON configuration file passed to [axclInit](../c/system_api.md#axclInit). |
| `--host-alloc` | `malloc-host,glibc` | Host memory allocator, given as a comma-separated combination: `malloc-host` uses [axclrtMallocHost](../c/memory_api.md#axclrtMallocHost), `glibc` uses the standard library `malloc`, and `both` tests both. It applies only to the H2D / D2H steps; `sweep`, `connect`, `message`, `--h2h`, and `--dtod` are not affected. |
| `-h`, `--help` | -- | Prints the usage and exits. |

```{note}
`--htod`, `--dtoh`, `--h2h`, and `--dtod` are direction options of the `bandwidth` subcommand and cannot be used with the full automatic run. The `bandwidth` subcommand requires at least one of them.
```

## 3. Typical Usage

Without a subcommand, the tool performs the full automatic run: `connect`, H2D, D2H, D2D, `sweep`, and `message` (excluding `--h2h`):

The full automatic run does not execute `compare`; data validation runs only when the `compare` subcommand is specified explicitly.

```bash
axcl_comm_bench --device 0
```

Running a single item:

```bash
# Connectivity check only
axcl_comm_bench connect --device 0

# Host to Device only, with axclrtMallocHost as the host allocator
axcl_comm_bench bandwidth --htod --device 0 --host-alloc malloc-host

# Host-side copy baseline
axcl_comm_bench bandwidth --h2h --device 0

# Concurrent sweep, with reports written to a dedicated directory
axcl_comm_bench sweep --device 0 --out-dir /tmp/bench-sweep

# Small-packet message loopback
axcl_comm_bench message --device 0

# H2D -> D2H data loopback validation
axcl_comm_bench compare --device 0
```

## 4. Output

The tool prints results to the console in real time and writes three files under `--out-dir` when it finishes:

| File | Content |
| --- | --- |
| `report.log` | Verbatim console output, convenient for direct reading. |
| `report.md` | Results as a Markdown table, convenient for archiving and review. |
| `report.csv` | Structured per-row data, convenient for scripting and comparing multiple runs. |

Columns of `report.csv`:

```text
device,mode,direction,host_alloc,src_alloc,dst_alloc,size_bytes,size_label,threads,mean_MBps,latency_us,status,note
```

`src_alloc` and `dst_alloc` identify the memory source of the source and destination: `malloc_host` is host memory allocated by [axclrtMallocHost](../c/memory_api.md#axclrtMallocHost), `glibc_malloc` is host memory allocated by the standard library `malloc`, and `device` is device memory. They make results of different allocators distinguishable within the same direction.

### 4.1. Connectivity Check Output

```text
AXCL Connectivity, device 0
AXCL runtime  (no bandwidth)  threads=1

  Check                      Status
  session                      PASS
  malloc                       PASS
  memcpy H2D                   PASS
  memcpy D2H                   PASS
  memcpy D2D                   PASS
  msg loopback                 PASS

  overall: PASS
```

`overall` is determined by the H2D and D2H results only. When D2D or message loopback is unsupported, it shows `SKIP` and does not affect the overall verdict.

### 4.2. Bandwidth Output

```text
Host to Device Bandwidth, device 0
AXCL axclrtMemcpy  HOST_TO_DEVICE   threads=1  host_alloc=axclrtMallocHost

  Transfer Size          Bandwidth (MB/s)
  1.00 KiB                            xxx
  10.00 KiB                           xxx
  100.00 KiB                          xxx
  1.00 MiB                            xxx
  10.00 MiB                           xxx
  100.00 MiB                          xxx

  peak: xxx MB/s at 100.00 MiB  host_alloc=axclrtMallocHost
```

### 4.3. Concurrent Sweep Output

```text
Concurrent Sweep, device 0
AXCL axclrtMemcpy  H2D/D2H/D2D   threads={1,2,4,8}  host_alloc=axclrtMallocHost

  Transfer Size    Threads     H2D (MB/s)     D2H (MB/s)     D2D (MB/s)
  1.00 MiB               1            xxx            xxx            xxx
  ...

  peak H2D: xxx MB/s at 100.00 MiB threads=8
  peak D2H: xxx MB/s at 100.00 MiB threads=8
  peak D2D: xxx MB/s
```

`sweep` splits the given total payload evenly across the threads, starts all transfers at the same time, and measures the total elapsed time from the first thread starting to the last thread finishing, so the result reflects the aggregated concurrent bandwidth.

```{note}
`sweep` always prints one table per host allocator, first for `axclrtMallocHost` and then for the standard library `malloc`, and is not controlled by `--host-alloc`. D2D does not involve host memory, so it is measured only in the first table and the second table reuses that result.
```

### 4.4. Message Loopback Output

```text
AXCL Message Loopback (internal, not public API), device 0
AXCL internal msg loopback  threads=1  count=1000

  Transfer Size          Latency (us)     Bandwidth (MB/s)
  32 B                            xxx                  xxx
  64 B                            xxx                  xxx
  256 B                           xxx                  xxx
  512 B                           xxx                  xxx

  peak: xxx MB/s at 512 B
```

`Latency (us)` is the average single round-trip latency over 1000 loopbacks.

## 5. Status and Return Value

Every result row carries a status:

| Status | Meaning |
| --- | --- |
| `PASS` | The item succeeded and its bandwidth or latency data is valid. |
| `FAIL` | The item failed. The `note` column records the failing stage and the error code. |
| `SKIP_UNSUPPORTED` | The current device or firmware does not support the capability. The console shows `SKIP`. |

```{note}
`SKIP` means not tested; it is not equivalent to 0 MB/s. When comparing reports, keep `SKIP` distinct from `FAIL` and from low bandwidth.
```

Process return value: `0` means no executed test item reported `FAIL`; `1` means there were failing items or initialization failed; `2` means the command line arguments were invalid.

## 6. Notes

- Bandwidth is reported in MB/s with 1 MB = 10^6 bytes, which is a different base from the `MiB` payload labels in the same report.
- While running, the tool temporarily lowers the kernel console log level by writing `/proc/sys/kernel/printk` so that kernel prints do not disturb the timing, and restores the original value on exit. The step is skipped without permission and does not affect the test.
- A single run targets one device. For multi-card setups, run the tool per `--device` and use `--out-dir` to keep the reports separate.
- The 100 MiB payload requires 100 MiB of memory on both the host and the device. Confirm that the device has enough free CMM beforehand, which can be checked with [axcl-smi](smi.md).
- Avoid running other heavy workloads on the device during the test; otherwise the bandwidth numbers are not comparable.
