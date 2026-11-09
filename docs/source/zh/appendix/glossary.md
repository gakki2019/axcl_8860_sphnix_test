# 术语表

| 术语 | 说明 |
|---|---|
| AXCL | 面向 AXERA AI 设备的 Host 侧开发套件。 |
| HOST | 运行用户应用和 AXCL Host 侧库的主控系统。 |
| DEVICE | AXCL 管理的 AXERA AI 计算设备，也是 Runtime API 中表示该设备的对象。一个设备即一颗 AXERA 芯片。AXCL API 的 `deviceId` / `device_id` 是逻辑设备号，按 [AXCL_VISIBLE_DEVICES](environment_variables.md#AXCL_VISIBLE_DEVICES) 映射到物理设备。 |
| CARD | 加速卡，即通过 C2C 相互连接的一组设备。一张卡可包含多个设备；「卡」不指代单个设备。不同设备之间的 Device-to-Device 复制只在同一张卡内支持。例外：`axcl-smi` 的 `-d` 参数、`Card` 列和提示信息中的 `card N`，以及 `axcl-collect-logs` 的 `-d` 参数，都是设备索引。 |
| Device PA | Device 内存的物理地址，供 Native API 和 Device 硬件使用。Runtime API 使用的是不透明的 Device 内存句柄（`devPtr`），Host 不能解引用，它也不是 Device PA。句柄与 Device PA / VA 之间用 [axclrtMemGetDevAddr](../develop/c/memory_api.md#axclrtMemGetDevAddr) 和 [axclrtMemMapDevAddr](../develop/c/memory_api.md#axclrtMemMapDevAddr) 转换。 |
| Device VA | Device 内存在 Device 侧进程中的虚拟地址，由 Native API 提供，供 Device CPU 访问。可能没有（为 0），例如通过 IPC 导入的内存。 |
| RUNTIME | AXCL 运行时层，负责设备、资源、任务和同步管理。 |
| CONTEXT | 绑定到一个 device 的执行环境，拥有在其中创建的 stream，并带有一个默认 stream。 |
| STREAM | context 中的 FIFO 任务流。同一 stream 中的任务按提交顺序执行，不同 stream 中的任务可以并行执行。 |
| FIFO | First In, First Out，先进先出。AXCL stream 中同一任务流内的任务按提交顺序执行。 |
| EVENT | 用于任务进度记录、耗时统计和 stream 间同步的对象。 |
| RPC | Remote Procedure Call，远程过程调用。AXCL 将 Host 侧的 API 调用作为请求转发给 Device，由 Device 执行并返回结果。 |
| NATIVE SDK | Device 侧的媒体与系统 SDK（如 `sys`、`ivps`、`ive`、`vdec`、`venc`、`dmadim`）。AXCL 通过 NATIVE API 将其提供给 Host 应用。 |
| NPU | Neural Processing Unit，神经网络处理单元。 |
| VDEC | Video Decoder，视频解码模块。 |
| VENC | Video Encoder，视频编码模块。 |
| IVE | Intelligent Video Engine，智能分析系统中的硬件加速模块。 |
| IVPS | Image Video Process System，视频图像处理子系统。 |
| DMA | Direct Memory Access，直接内存访问。 |
| CMM | Contiguous Memory Manager，连续内存管理器，即 AXERA 设备上的物理连续内存池。 |
| PCIe | PCI Express，Host 与 Device 之间的高速互连。 |
| RC | Root Complex，PCIe 主控侧角色，通常对应 Host。 |
| EP | Endpoint，PCIe 端点侧角色，通常对应 Device。 |
