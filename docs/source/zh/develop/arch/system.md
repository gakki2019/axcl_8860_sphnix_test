# 系统架构

AXCL 是 Host 应用访问 AXERA AI 设备的统一软件入口。应用运行在 Host 侧，通过 AXCL 提供的 C API、Python API 和工具完成设备初始化、资源管理、任务提交、数据搬运和同步等待。

需要在 Device 侧执行的请求由 AXCL 转发到 Device 侧执行环境，再由其调用本地 NATIVE SDK 访问硬件资源。

在系统层面，AXCL 连接 Host 应用与 Device 本地能力：
- Host 侧提供 API、运行时对象管理和跨端通信能力；
- Device 侧提供守护进程、工作进程、本地 SDK 和硬件资源访问能力；
- 两侧通过 PCIe 等传输通道协同完成控制消息、任务请求和数据传输。

```{image} ../../asserts/arch.svg
:alt: AXCL Host-Device 系统架构图
:align: center
```

上图展示 AXCL 在 Host-Device 主从架构下的逻辑分层和部署形态：

- 左侧为 HOST 侧组件；
- 右侧为 DEVICE 侧组件；
- 中间为 Host 与 Device 之间的跨端传输边界。

## 1. Host-Device 边界

AXCL 应用运行在 Host 侧，实际硬件资源位于 Device 侧。Host API 调用可能在 Host 本地完成，也可能被封装为跨端请求，由 Device 侧执行环境调用本地 NATIVE SDK 完成。

Host-Device 边界主要体现在以下方面：

- Host 应用与 Device 侧执行环境分属不同进程和地址空间；
- Host 侧运行时库管理运行时对象和跨端通道；
- Device 侧执行环境承接 Host 提交的请求，并调用本地 NATIVE SDK 访问硬件资源；
- Host / Device 数据交换通过运行时库的数据搬运能力和通信通道完成；
- 异步接口返回成功通常表示任务已提交到运行时或跨端通道，任务完成状态需通过运行时库提供的同步或状态查询机制确认。

## 2. HOST 侧组件

HOST 侧是用户应用和 AXCL API 的主要入口。用户通常直接使用 C API、Python API、工具或上层框架；运行时库、协议通信库和内核驱动由 AXCL 在内部协同完成设备控制和跨端通信。

| 组件 | 作用 |
|---|---|
| 业务应用 | 用户业务入口，调用 AXCL API 或基于 AXCL 的上层框架。 |
| FFmpeg | 适配既有 FFmpeg 媒体处理链路，使编解码和图像处理能力可通过 FFmpeg 方式接入，降低应用改造成本。 |
| AXStream | 面向媒体流处理的上层框架。 |
| 设备监控和管理 | 通过 `axcl-smi` 查询设备状态和执行系统控制。 |
| 运行时库 | `libaxcl_rt.so`，提供 Device、Context、Stream、Task、Event 等核心运行时对象。 |
| NATIVE RPC 库 | `libaxcl_sys.so`、`libaxcl_vdec.so`、`libaxcl_venc.so` 等，将 Host 侧调用转发到 Device 侧 NATIVE SDK。 |
| Python API | 基于 C API 封装的 Python 入口。 |
| 协议通信库 | `libaxcl_protocol.so`、`libaxcl_comm.so`，负责封包、通道管理和跨端传输。 |
| 内核驱动 | `axcl_rt.ko`、`ax_comm.ko` 等，负责 Host 侧设备控制和通信传输。 |

## 3. DEVICE 侧组件

DEVICE 侧负责接收并处理来自 Host 的请求，通过本地 NATIVE SDK 访问硬件资源，并配合 Host 侧完成任务执行、数据传输和状态反馈。

| 组件 | 作用 |
|---|---|
| 设备控制驱动 | `axcl_dev.ko`，承接 Host 侧控制请求并上报 Device 状态。 |
| 工作监控驱动 | `axcl_wk_monitor.ko`，监测 Worker 进程生命周期。 |
| 通信传输驱动 | `ax_comm.ko`，提供 Device 侧跨端消息和 DMA 通道。 |
| 协议通信库 | `libax_protocol.so`、`libax_comm.so`，解析请求、封装响应并支撑跨端传输。 |
| 守护进程 | `slave_daemon`，常驻 Device 侧，接收控制请求并管理 Worker 生命周期。 |
| 工作进程 | `slave_worker`，承接 Host 应用的任务请求，调用 Device 本地 SDK 完成执行。 |
| NATIVE SDK | `libax_sys.so`、`libax_ivps.so`、`libax_vdec.so`、`libax_venc.so`、`libax_engine.so` 等，访问 Device 本地硬件能力。 |
| 硬件资源 | CPU、NPU、VPU、IVE、IVPS、DMA 等 Device 本地硬件资源。 |

## 4. App 启动与退出

Device 系统启动后会启动常驻守护进程 `slave_daemon`。Host 应用启动并首次激活某个 Device 时，AXCL 会在 Device 侧为该应用创建对应的 `slave_worker`；激活完成后，Host 应用与对应的 `slave_worker` 通过专属通信通道交互。

```{image} ../../asserts/app_start.svg
:alt: App 启动过程时序图
:align: center
```

Host 应用正常释放 Device 或退出时，AXCL 会向 Device 侧发送释放请求；`slave_daemon` 终止对应的 `slave_worker`，并通过控制链路向 Host 侧反馈退出状态。

```{image} ../../asserts/app_exit.svg
:alt: App 退出过程时序图
:align: center
```

这两张图概括了 Host 应用激活 Device 时建立对应 Worker、释放 Device 时回收对应 Worker 的主要过程。

## 5. 多进程支持

AXCL 支持多个 Host 进程同时访问同一 Device。每个 Host 进程在 Device 侧对应独立的 Worker，并通过独立通信通道提交任务；Device 侧常驻管理进程负责按需创建和释放这些 Worker，不直接执行业务任务。

```{image} ../../asserts/multi_process.svg
:alt: AXCL 多进程支持示意图
:align: center
```

同一 Host 进程访问多个 Device 时，会分别在对应 Device 上建立独立的执行通道。

## 6. 相关文档

与 AXCL 系统架构相关的内容包括：

- [核心概念](concept.md)：介绍 Device、Context、Stream、Task、Event 等运行时对象；
- [主从内存管理](memory.md)：介绍 Host / Device 主从内存和数据同步；
- [C API 参考](../c/index.md)：提供具体接口定义和参数说明。
