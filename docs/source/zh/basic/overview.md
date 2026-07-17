# 概览

## 1. AXCL 是什么

**AXCL** 是面向 AXERA AI 计算设备的 Host 侧开发套件。用户可以在主控侧通过 AXCL 提供的 C API、运行时库、设备管理工具和示例程序，使用 AXERA 硬件资源完成深度学习推理、图像处理、视频编解码和数据搬运等任务。

从应用开发者视角看，AXCL 屏蔽了 Host 与 Device 之间的 PCIe 通信、设备进程、内核驱动和硬件资源管理细节。应用只需要按 API 生命周期完成初始化、选择设备、创建上下文和流、分配内存、提交任务、同步结果与释放资源，即可把计算或媒体处理工作负载下发到 AX8860 等 AXERA AI 设备执行。

## 2. 逻辑架构

```{image} ../../shared/overview_logic_arch.svg
:alt: AXCL 逻辑架构
:align: center
```

AXCL 的整体架构可以概括为：

- **应用层**：用户业务程序、`ffmpeg`、`axstream`等。
- **AXCL API 层**：对外提供 C API，并基于 C API 封装 Python API，作为应用访问 AXERA AI 设备的统一入口。
- **运行时能力层**：提供内存管理、模型推理、媒体处理和运行管理等基础能力。
- **通信与驱动层**：负责 Host 与 Device 之间的控制消息、数据传输、DMA 搬运和设备状态感知。
- **计算设备层**：AX8860 AXERA AI 设备实际执行 NPU 推理、视频编解码、图像处理和 DMA 等任务。

## 3. 主要功能

### 3.1. 运行时与设备管理

AXCL 运行时库负责 SDK 的全局生命周期、设备枚举、设备激活和设备同步。应用通常先调用 [axclInit](../develop/c/system_api.md#axclInit) 初始化运行环境，再通过设备 API 查询设备数量、选择目标设备，并在使用结束后调用 [axclFinalize](../develop/c/system_api.md#axclFinalize) 释放运行时资源。

相关能力包括：

- 获取 AXCL、驱动、固件等版本信息。
- 查询芯片名称、设备数量和设备属性。
- 激活或复位指定设备。
- 查询设备可用状态。
- 同步设备上已提交的任务。

更多接口见 [系统 API](../develop/c/system_api.md) 和 [设备 API](../develop/c/device_api.md)。

### 3.2. 上下文、流和事件

AXCL 使用 **device → context → stream** 的对象模型组织任务执行：

- **device** 是 Host 侧可见的 AXERA AI 计算设备在 AXCL 中的运行时抽象，是设备选择、资源管理和任务提交的根对象。
- **context** 是在指定 device 上创建或默认绑定的执行环境，用于承载该设备上的 stream、event、内存和推理等运行资源。
- **stream** 是逻辑 FIFO 任务流，同一 stream 内任务按提交顺序执行，不同 stream 可用于组织并行任务。FIFO 术语说明见 [术语表](../appendix/glossary.md)。
- **event** 用于记录任务进度、测量耗时，以及在 stream 之间建立同步关系。

应用可以创建自定义 context 和 stream，也可以使用设备激活后自动创建的默认对象。同步接口支持阻塞等待、带超时等待和非阻塞状态查询，便于构建同步或异步执行流程。

更多接口见 [上下文 API](../develop/c/context_api.md)、[流 API](../develop/c/stream_api.md) 和 [事件 API](../develop/c/event_api.md)。

### 3.3. 内存管理与数据搬运

AXCL 提供 Host 内存、Device 内存以及跨端拷贝相关接口，用于管理模型、输入输出张量、媒体帧和中间缓存。Device 内存可按策略分配，支持普通分配、cached 分配、释放、查询属性、查询容量，以及显式 cache flush / invalidate。

相关能力包括：

- 分配和释放 Device 内存。
- 分配和释放 Host 侧内存。
- 查询内存余量和指针属性。
- 支持 Host ↔ Device、Device ↔ Device、Host 物理地址 ↔ Device 等拷贝类型。
- 支持同步和异步的 `memcpy`、`memset`、`memcmp`。
- 使用 stream 组织异步内存操作和后续计算任务。

更多接口见 [内存 API](../develop/c/memory_api.md)。

### 3.4. 模型推理

AXCL Engine API 面向离线模型推理场景，提供模型加载、模型信息查询、输入输出描述管理、运行上下文创建和同步/异步执行能力。应用可以从文件或内存加载模型，获取模型输入输出数量、名称、shape、数据类型、layout 和 buffer 大小，然后绑定输入输出 buffer 并提交推理任务。

典型能力包括：

- 初始化和反初始化 runtime engine。
- 从 `.axmodel` 文件或内存加载模型。
- 查询模型类型、编译工具链版本和内存用量。
- 查询输入输出 tensor 的名称、索引、shape、数据类型和 layout。
- 创建和销毁模型运行上下文。
- 设置输入输出 buffer。
- 同步执行模型推理，或将推理任务异步提交到 stream。

更多接口见 [引擎 API](../develop/c/engine_api.md)。如需快速验证模型执行环境，可参考 [快速开始](quick_start.md) 中的 `axcl_run_model` 示例。

### 3.5. 媒体处理

除 AXCL Runtime API 外，AXCL Host 侧还集成了 NATIVE SDK 相关 SO，用于把图像处理、视频编解码和 DMA 等能力以 Host 侧接口形式暴露给应用：

- `sys`：系统初始化、内存、资源池等基础能力。
- `ive` / `ivps`：图像处理、图像预处理和后处理能力。
- `vdec` / `venc`：视频解码和视频编码能力。
- `dmadim`：DMA 拷贝、二维拷贝、memset、checksum 等数据搬运能力。

这些模块让 Host 应用能够以接近设备侧 NATIVE SDK 的方式调用 AXERA AI 设备能力，适合转码、视觉预处理、AI 推理前后处理、图像增强、视频流处理等场景。

### 3.6. 设备状态与辅助工具

AXCL 提供 `axcl-smi` 命令行工具，用于查看设备和进程状态。用户可以通过它确认驱动、固件、设备枚举、温度、CPU/NPU 利用率、内存和 CMM 使用情况等信息，快速判断运行环境是否可用。

此外，AXCL 还包含 minidump、日志、示例程序和测试程序，用于辅助开发、调试和问题定位。

## 4. 典型使用流程

一个典型的 AXCL 应用通常遵循以下步骤：

1. **初始化运行时**：调用 [axclInit](../develop/c/system_api.md#axclInit)，加载运行配置并初始化 Host 侧运行环境。
2. **发现并选择设备**：调用设备查询接口获取设备数量和状态，使用 [axclrtSetDevice](../develop/c/device_api.md#axclrtSetDevice) 激活目标设备。
3. **创建执行资源**：按需创建 context、stream 和 event；简单场景也可以使用默认 context / stream。
4. **准备数据内存**：分配 Host / Device 内存，完成模型文件、输入数据或媒体帧的搬运。
5. **提交任务**：通过 Engine API 提交模型推理，或通过 NATIVE API 提交编解码、图像处理、DMA 等任务。
6. **同步和取回结果**：使用 device、stream 或 event 同步接口等待任务完成，并把输出数据拷回 Host。
7. **释放资源**：按 stream、context、device、runtime 的生命周期释放资源，最后调用 [axclFinalize](../develop/c/system_api.md#axclFinalize)。

异步场景下，`stream` 是组织任务顺序的核心对象：应用可以把内存拷贝、模型推理和后处理任务按顺序提交到同一 stream，也可以使用多个 stream 和 event 构建更复杂的并发执行流程。

## 5. 适用场景

AXCL 适合以下类型的 Host 侧应用：

- **AI 推理应用**：加载 `.axmodel`，管理输入输出 buffer，在 AXERA NPU 上执行模型推理。
- **视频编解码应用**：使用 AXERA 硬件能力完成视频解码、编码或转码。
- **图像预处理 / 后处理应用**：使用 IVPS、IVE、DMA 等能力完成 resize、格式转换、拷贝、填充等处理。
- **多设备管理应用**：在一台 Host 上枚举、选择和管理多张 AXERA AI 设备。
- **性能验证和设备诊断**：使用 `axcl-smi`、`axcl_run_model` 和 sample 程序确认设备状态、模型性能和基础功能。

## 6. 下一步

建议按以下顺序继续阅读：

1. 阅读 [安装指南](install/index.md)，完成驱动、运行时和工具安装。
2. 阅读 [快速开始](quick_start.md)，用 `axcl-smi` 和 `axcl_run_model` 验证设备可用性。
3. 阅读 [C API 索引](../develop/c/index.rst)，根据业务类型选择系统、设备、内存、stream、event 或 engine API。
4. 阅读 [系统架构](../develop/arch/system.md)，了解 AXCL 在 Host、驱动和 Device 之间的分层关系。
