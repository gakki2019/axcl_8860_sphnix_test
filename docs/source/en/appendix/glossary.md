# Glossary

| Term | Description |
|---|---|
| AXCL | A Host-side development kit for AXERA AI devices. |
| HOST | The control system that runs user applications and AXCL Host-side libraries. |
| DEVICE | An AXERA AI compute device managed by AXCL, and the object that represents it in the Runtime API. |
| RUNTIME | The AXCL runtime layer that manages devices, resources, tasks, and synchronization. |
| CONTEXT | An execution environment bound to one device. It owns the streams created in it and has a default stream. |
| STREAM | A FIFO task queue in a context. Tasks in one stream run in submission order; tasks in different streams can run in parallel. |
| FIFO | First In, First Out. In an AXCL stream, tasks in the same task queue execute in submission order. |
| EVENT | An object used for task progress recording, elapsed-time measurement, and stream synchronization. |
| RPC | Remote Procedure Call. AXCL forwards Host API calls as requests to the Device, which executes them and returns the results. |
| NATIVE SDK | The Device-side media and system SDK (such as `sys`, `ivps`, `ive`, `vdec`, `venc`, and `dmadim`). AXCL exposes it to Host applications through NATIVE APIs. |
| NPU | Neural Processing Unit. |
| VDEC | Video Decoder. |
| VENC | Video Encoder. |
| IVE | Intelligent Video Engine, a hardware acceleration module in intelligent analysis systems. |
| IVPS | Image Video Process System, a video and image processing subsystem. |
| DMA | Direct Memory Access. |
| CMM | Contiguous Memory Manager, the physically contiguous memory pools on an AXERA device. |
| PCIe | PCI Express, the high-speed interconnect between Host and Device. |
| RC | Root Complex, the PCIe controller-side role, usually corresponding to Host. |
| EP | Endpoint, the PCIe endpoint-side role, usually corresponding to Device. |
