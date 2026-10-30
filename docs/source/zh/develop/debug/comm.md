# COMM 驱动调试

COMM 驱动的 `info` 节点用于查看通信设备、握手状态、管道收发统计、DMA 任务和 DMA 内存，可用于排查连接失败、消息收发异常、接收队列积压及 DMA 传输问题。

在运行 AXCL 应用的主控端执行以下命令。该节点的权限为 `0444`，普通用户可读。若节点不存在，请检查 COMM 驱动是否已加载，以及驱动版本是否包含该接口。

```bash
cat /proc/ax_proc/comm/info
```

示例数值仅供参考；没有管道、任务或内存块时，对应明细可能为空。

## 1. 设备概览

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

| 字段 | 含义 |
| --- | --- |
| `pipe_buf_capacity` | 每个可缓存接收缓冲区（cookie）的数据容量，单位为字节。 |
| `Device` | 设备在本次输出中的序号，从 1 开始。 |
| `devid` | COMM 驱动设备标识，以十六进制显示。关联 RT 数据时，需核对设备标识和端口号；`Device` 列仅用于标记输出顺序。 |
| `type` | 设备类型：`PCIE-H`、`USB-H`、`LOC-H` 为主控侧类型；`PCIE-S`、`USB-S`、`LOC-S` 为设备侧类型。 |
| `status` | `ONLINE`、`OFFLINE`、`REMOVED` 或 `UNKNOWN`。 |
| `ref` | 设备对象的内核引用计数。 |
| `bdf` | PCIe 主控侧设备的 PCI 地址，格式为 `domain:bus:device.function`，可用于关联系统枚举信息。其他设备类型可能不显示此项。 |

连接异常时，先确认目标设备存在且状态为 `ONLINE`，再检查握手状态和业务管道。

## 2. 握手与通信管道

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

`Handshake` 显示设备握手管道，`Pipes(n)` 显示本次快照中的普通管道及其数量。管道数量与应用连接数没有一一对应关系。

| 字段 | 含义 |
| --- | --- |
| `id` | 驱动管道句柄标识，以十六进制显示，用来关联本次输出中的状态表和流量表。 |
| `type` / `port` | 管道类型编号及端口号；类型 `0` 为控制管道，`1` 为数据管道，`2` 为调试管道。 |
| `status` | 当前管道状态，见下表。 |
| `loc-gen` / `peer-gen` | 本端和对端的管道握手代次标识，用于区分管道重建前后的状态。两端标识独立生成，数值可以不同。 |
| `rx_queue` | `当前排队消息数(历史峰值)`；例如 `2(8)` 表示当前 2 条，历史峰值 8 条。 |
| `cookie_reuse/requests(%)` | 接收缓冲区（cookie）的复用次数、申请次数和复用比例。申请次数为 0 时，比例显示 `-`。 |
| `tx(msg/byte)` / `rx(msg/byte)` | 当前管道累计成功发送、接收的消息数和字节数，格式为 `消息数/字节数`。DMA 任务信息单独显示。 |
| `tx(msg/s)` / `rx(msg/s)` | 最近更新的速率，格式为 `消息数每秒(字节速率KB/s)`；此处 `KB` 按 1000 字节计算。 |

| 状态 | 含义与查看方向 |
| --- | --- |
| `INIT` | 初始状态。 |
| `CREATED` | 管道已创建，尚未完成就绪握手；持续停留时检查对端及握手日志。 |
| `READY` | 管道已就绪，仍需结合收发计数和应用结果确认业务正常。 |
| `PCLSD` | 对端已关闭；核对对端退出、管道释放或重建过程。 |
| `DESTROY` | 管道进入销毁状态。 |
| `UNKNOWN` | 当前状态值没有对应的显示名称，需结合驱动版本及日志分析。 |

速率在成功收发消息时更新，统计窗口至少为 1 秒。尚未生成有效速率，或超过 3 秒没有更新时，显示 `-`。读取不会重置累计计数或统计窗口，因此查询间隔不决定速率的统计区间。

### 排查示例

- **消息接收异常**：核对设备和端口，检查管道是否为 `READY`、累计 `tx/rx` 是否变化，并检查对端接收逻辑。比较计数时应考虑端点、管道和采集时间的差异。
- **接收延迟增加**：连续采集 `rx_queue`。当前队列持续增长时，检查应用读取消息或执行回调的处理速度；历史峰值仅表示曾经出现的最大积压。
- **管道重建**：结合 `id`、`port`、`loc-gen`、`peer-gen` 和应用日志确认。新管道的累计计数从初始值开始。
- **出现 `... snapshot truncated ...`**：快照容量确定后有新管道加入，本次管道列表不完整，请重新采集。
- **出现 `Pipes: snapshot allocation failed`**：管道快照内存分配失败，本次无法提供完整管道明细。请检查可用内存后重试。

## 3. DMA 任务

支持 DMA 传输的设备会显示 `DMA` 段落。任务按所有者的 `TGID (进程名)` 分组，包含 `Summary`、`Tasks` 和 `Resources`。统计仅包含采集时仍存在的任务，已回收任务不再显示。

### 3.1 属性与任务信息

| 字段 | 含义 |
| --- | --- |
| `attrs` | DMA 一致性、散列表映射方式及属性位值，显示为 `coherent/non-coherent`、`sg-map/direct-sg`。 |
| `total` / `Summary` | 全设备或当前进程的任务数，以及同步/异步、方向和状态的分类数量。 |
| `id` | DMA 任务标识。 |
| `mode` | `sync` 为同步任务，`async` 为异步任务。 |
| `dir` | `h2d` 为主控到设备，`d2h` 为设备到主控。 |
| `status` | `created`、`pending`、`running`、`completed`、`aborted`、`cleanup` 或 `unknown`。 |
| `size` | 本次任务传输大小，十六进制，单位为字节。 |
| `create_us` | 任务创建阶段的耗时，单位为微秒。 |
| `xfer_us` | 从提交到完成的时间；未完成时为提交到采集时刻的时间，未提交时显示 `-`。单位为微秒，不等于纯硬件搬运时间。 |
| `hw_task_id` | 底层传输任务标识，以十六进制显示。 |

### 3.2 任务资源

| 字段 | 含义 |
| --- | --- |
| `mem_type` | 任务使用的内存类型：`pinned` 为固定的用户内存页，`memblk` 为驱动内存块。 |
| `mapped` | 当前是否已执行 DMA 映射。 |
| `pinned` | 当前是否持有固定的用户页。 |
| `sg_nents` / `orig_nents` | 当前散列表项数和原始项数。DMA 映射可能合并表项，两者可以不同。 |

任务长时间停留在 `pending` 或 `running` 时，检查任务大小、`xfer_us`、设备状态、接口返回码和内核日志。`completed` 任务可能在结果读取或资源回收前短暂保留；判断资源泄漏时需对比多次采集结果。

出现 `DMA: snapshot allocation failed` 表示本次 DMA 任务信息未能完整采集，需要检查可用内存后重试。

## 4. DMA 内存

`DMA Memory` 按 DMA 字符设备类型显示 `host` 或 `slave`，再按所有者进程分组。统计范围为 COMM 驱动登记的 DMA 内存块，不包括全部设备内存、固定用户页或 Runtime IPC 导出记录。

| 字段 | 含义 |
| --- | --- |
| `blocks` | 当前快照中的内存块数量。 |
| `needed_total` / `allocated_total` | 申请大小总和与实际分配大小总和，十六进制，单位为字节。 |
| `id` | 内存块标识。 |
| `needed` / `allocated` | 单个内存块的申请大小和实际分配大小。受分配粒度或对齐要求影响，实际分配大小可能大于申请大小。 |
| `type` | 分配路径，`buddy` 或 `coherent`。 |
| `sg_nents` | 内存块散列表项数。 |

排查内存释放问题时，在业务开始前和资源释放后采集，按进程和内存块标识对比，并确认应用已释放内存、相关任务和驱动句柄。

出现 `host: snapshot allocation failed` 或 `slave: snapshot allocation failed` 时，本次未能采集对应内存块信息。请检查可用内存后重试。

## 5. RT 与 COMM 联合排查

1. 在 [RT 用户信息](rt.md#rt-user-info) 中找到应用 PID、设备和端口。
2. 在 COMM 输出中找到对应设备及管道，确认状态、队列及收发计数是否符合业务预期。
3. 如果失败发生在 DMA 数据传输，继续查看同进程的 DMA 任务和内存块；如果发生在共享内存导入，则查看 [IPC 导出信息](rt.md#rt-ipc-info)。
4. 结合接口返回码、发生时间和内核日志确认原因，保留相关采集结果。

### 信息采集

出现问题时，可执行以下命令采集诊断信息，每次结果保存到独立目录。排查资源释放问题时，可对比释放前后的采集结果。若命令报错，请检查对应信息是否采集成功。

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

各节点反映各自读取时的状态，不是同一时刻的完整系统快照。比较结果时，应结合业务操作和采集时间；节点序号、队列长度和任务数量发生变化，并不直接表示异常。

这些接口仅用于读取诊断信息，不会清零统计计数。采集会占用 CPU 和临时内存，并可能与业务操作竞争驱动锁，建议按需读取，避免高频轮询。对外提供采集结果前，请检查共享标识、设备地址和进程信息是否需要脱敏。
