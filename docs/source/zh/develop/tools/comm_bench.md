# axcl_comm_bench

`axcl_comm_bench` 是运行在主控侧的 AXCL 通信基准测试工具，用于验证主控与设备之间的链路是否连通，并测量 AXCL Runtime 层的数据搬运带宽。

工具基于 [axclInit](../c/system_api.md#axclInit)、[axclrtSetDevice](../c/device_api.md#axclrtSetDevice)、[axclrtMalloc](../c/memory_api.md#axclrtMalloc)、[axclrtMemcpy](../c/memory_api.md#axclrtMemcpy) 等公开接口实现，测得的是应用可见的端到端带宽，而非驱动或 PCIe 裸链路带宽。

典型使用场景：

- 新板卡上电或驱动升级后，快速确认主控与设备之间的通信链路可用。
- 评估不同传输方向、不同数据块大小和并发线程数下的带宽表现。
- 对比 [axclrtMallocHost](../c/memory_api.md#axclrtMallocHost) 与标准库 `malloc` 两种主控内存分配方式对传输性能的影响。
- 定位性能问题时，产出可归档、可比对的报告文件。

## 1. 测试项

| 测试项 | 说明 |
| --- | --- |
| `connect` | 连通性检查。依次验证会话建立、内存分配、H2D、D2H、D2D 拷贝和消息回环。 |
| `bandwidth --htod` | 主控到设备（Host to Device）单线程带宽。 |
| `bandwidth --dtoh` | 设备到主控（Device to Host）单线程带宽。 |
| `bandwidth --dtod` | 设备内部（Device to Device）单线程带宽。 |
| `bandwidth --h2h` | 主控内部（Host to Host）拷贝带宽，用作对照基线。 |
| `sweep` | 多线程并发扫描，覆盖 H2D / D2H / D2D 三个方向。 |
| `message` | 内部消息通道回环时延与带宽。 |
| `compare` | H2D→D2H 数据回环校验。对源数据和回读数据执行 `memcmp`。 |

各测试项的数据规格：

| 测试项 | 数据块大小 | 线程数 | 重复次数 |
| --- | --- | --- | --- |
| `bandwidth --htod` / `--dtoh` / `--dtod` | 1 KiB、10 KiB、100 KiB、1 MiB、10 MiB、100 MiB | 1 | 1 次预热 + 3 次计时 |
| `bandwidth --h2h` | 同上 | 1 | 1 次预热 + 10 次计时 |
| `sweep` | 1 MiB、10 MiB、100 MiB | 1、2、4、8 | 每组合 1 次 |
| `message` | 32 B、64 B、256 B、512 B | 1 | 1 次预热 + 1000 次回环 |
| `compare` | 1–100 KiB、100 KiB–1 MiB、1–10 MiB、10–100 MiB（size 和源数据均随机） | 1 | 每档 1 次 H2D + 1 次 D2H + `memcmp` |

```{note}
`bandwidth --h2h` 走的是主控 CPU 的 `memcpy`，不经过 PCIe DMA，仅用于给出主控侧内存拷贝的参考基线。该项不包含在全自动流程中，需要显式指定，且固定输出源端和目的端分配方式的四种组合（含同种分配方式的基线），共四段表格。
```

```{note}
`message` 使用内部消息回环接口（非公开 API），单次负载小于 1 KiB，走消息通道而不是 DMA 通道，用于评估小包往返时延。设备或固件不支持时该项输出 `SKIP`。
```

## 2. 用法

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

| 参数 | 默认值 | 说明 |
| --- | --- | --- |
| `-d`、`--device` | `0` | 设备号，取值范围 `[0, 设备数 - 1]`。 |
| `-o`、`--out-dir` | `./axcl_comm_bench_out` | 报告输出目录，不存在时自动创建。 |
| `-c`、`--config` | 空 | 传给 [axclInit](../c/system_api.md#axclInit) 的 JSON 配置文件路径。 |
| `--host-alloc` | `malloc-host,glibc` | 主控内存分配方式，支持逗号分隔组合：`malloc-host` 使用 [axclrtMallocHost](../c/memory_api.md#axclrtMallocHost)，`glibc` 使用标准库 `malloc`，`both` 表示两者都测。仅对 H2D / D2H 环节生效，`sweep`、`connect`、`message`、`--h2h` 和 `--dtod` 不受该参数影响。 |
| `-h`、`--help` | -- | 打印用法并退出。 |

```{note}
`--htod`、`--dtoh`、`--h2h`、`--dtod` 是 `bandwidth` 子命令的方向选项，不能用于全自动流程；`bandwidth` 子命令则必须至少指定其中一个方向。
```

## 3. 典型用法

不带子命令时执行全自动流程，依次运行 `connect`、H2D、D2H、D2D、`sweep`、`message`（不含 `--h2h`）：

全自动流程不会执行 `compare`；只有显式指定 `compare` 子命令时才进行数据校验。

```bash
axcl_comm_bench --device 0
```

单项运行：

```bash
# 仅做连通性检查
axcl_comm_bench connect --device 0

# 只测主控到设备方向，且只用 axclrtMallocHost 分配主控内存
axcl_comm_bench bandwidth --htod --device 0 --host-alloc malloc-host

# 主控内部拷贝基线
axcl_comm_bench bandwidth --h2h --device 0

# 多线程并发扫描，报告输出到指定目录
axcl_comm_bench sweep --device 0 --out-dir /tmp/bench-sweep

# 小包消息回环
axcl_comm_bench message --device 0

# H2D→D2H 数据回环校验
axcl_comm_bench compare --device 0
```

## 4. 输出说明

工具在控制台实时输出结果，结束后在 `--out-dir` 下生成三个文件：

| 文件 | 内容 |
| --- | --- |
| `report.log` | 控制台输出的原文，便于直接查看。 |
| `report.md` | Markdown 表格形式的结果，便于归档和评审。 |
| `report.csv` | 逐行结构化数据，便于脚本处理和多次结果比对。 |

`report.csv` 的列定义：

```text
device,mode,direction,host_alloc,src_alloc,dst_alloc,size_bytes,size_label,threads,mean_MBps,latency_us,status,note
```

其中 `src_alloc` 和 `dst_alloc` 标识源端和目的端的内存来源：`malloc_host` 为 [axclrtMallocHost](../c/memory_api.md#axclrtMallocHost) 分配的主控内存，`glibc_malloc` 为标准库 `malloc` 分配的主控内存，`device` 为设备内存。据此可区分同一方向下不同分配方式的结果。

### 4.1. 连通性检查输出

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

`overall` 仅由 H2D 和 D2H 的结果决定；D2D 和消息回环不支持时显示 `SKIP`，不影响整体判定。

### 4.2. 带宽测试输出

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

### 4.3. 并发扫描输出

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

`sweep` 将给定的总数据量按线程数均分，各线程同时发起传输，统计从全部线程开始到全部完成的总耗时，因此结果反映的是并发聚合带宽。

```{note}
`sweep` 总是依次按 `axclrtMallocHost` 和标准库 `malloc` 两种主控内存分配方式各输出一段表格，不受 `--host-alloc` 控制。D2D 不涉及主控内存，仅在第一段实测，第二段直接复用该结果。
```

### 4.4. 消息回环输出

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

`Latency (us)` 为 1000 次回环的平均单次往返时延。

## 5. 状态与返回值

每行结果带有状态标识：

| 状态 | 含义 |
| --- | --- |
| `PASS` | 该项执行成功，带宽或时延数据有效。 |
| `FAIL` | 该项执行失败，`note` 列记录失败阶段和错误码。 |
| `SKIP_UNSUPPORTED` | 当前设备或固件不支持该能力，控制台显示为 `SKIP`。 |

```{note}
`SKIP` 表示未测试，不等于 0 MB/s。比对报告时应把 `SKIP` 与 `FAIL`、低带宽区分开。
```

进程返回值：`0` 表示所有执行的测试项均未出现 `FAIL`；`1` 表示存在失败项或初始化失败；`2` 表示命令行参数错误。

## 6. 注意事项

- 带宽单位为 MB/s，按 1 MB = 10^6 字节换算，与报告中的 `MiB` 数据块标签不是同一进制。
- 工具在运行期间会临时调低内核控制台日志级别（写入 `/proc/sys/kernel/printk`），避免内核打印干扰计时，退出时恢复原值。无权限时跳过该操作，不影响测试。
- 单次运行只针对一个设备；多卡场景需要按 `--device` 分别执行，并用 `--out-dir` 区分报告目录。
- 100 MiB 档位需要在主控和设备侧各分配 100 MiB 内存，运行前请确认设备 CMM 余量充足，可用 [axcl-smi](smi.md) 查看。
- 测试过程中设备上不宜运行其他高负载业务，否则带宽数据不具备可比性。
