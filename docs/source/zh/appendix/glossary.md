# 术语表

| 术语 | 说明 |
|---|---|
| AXCL | 面向 AXERA AI 设备的 Host 侧开发套件。 |
| HOST | 运行用户应用和 AXCL Host 侧库的主控系统。 |
| DEVICE | AXCL 管理的 AXERA AI 计算设备，也是 Runtime 中的设备抽象。 |
| RUNTIME | AXCL 运行时层，负责设备、资源、任务和同步管理。 |
| CONTEXT | 指定 device 上的执行环境，承载 stream、event、内存和推理资源。 |
| STREAM | 逻辑 FIFO 任务流，用于组织任务顺序和并行执行。 |
| FIFO | First In, First Out，先进先出。AXCL stream 中同一任务流内的任务按提交顺序执行。 |
| EVENT | 用于任务进度记录、耗时统计和 stream 间同步的对象。 |
| RPC | Remote Procedure Call，远程过程调用。AXCL Host 侧通过 RPC 请求调用 Device 侧 worker 或 NATIVE SDK 能力。 |
| NATIVE SDK | 设备侧原生能力集合。 |
| NPU | Neural Processing Unit，神经网络处理单元。 |
| VDEC | Video Decoder，视频解码模块。 |
| VENC | Video Encoder，视频编码模块。 |
| IVE | Intelligent Video Engine，智能分析系统中的硬件加速模块。 |
| IVPS | Image Video Process System，视频图像处理子系统。 |
| DMA | Direct Memory Access，直接内存访问。 |
| CMM | AXERA 设备侧连续内存管理资源。 |
| PCIe | Host 与 Device 之间的高速互连通道。 |
| RC | Root Complex，PCIe 主控侧角色，通常对应 Host。 |
| EP | Endpoint，PCIe 端点侧角色，通常对应 Device。 |
