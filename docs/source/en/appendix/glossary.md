# Glossary

| Term | Description |
|---|---|
| AXCL | A Host-side development kit for AXERA AI devices. |
| HOST | The control system that runs user applications and AXCL Host-side libraries. |
| DEVICE | An AXERA AI compute device managed by AXCL, and the object that represents it in the Runtime API. One device is a single AXERA chip. The `deviceId` / `device_id` of AXCL APIs is a logical device ID, mapped to a physical device according to [AXCL_VISIBLE_DEVICES](environment_variables.md#AXCL_VISIBLE_DEVICES). |
| CARD | An accelerator card: a group of devices connected to each other through C2C. A card can hold several devices; "card" never refers to a single device. Device-to-Device copy between different devices is supported only within the same card. Exception: the `-d` option, the `Card` column and `card N` in messages of `axcl-smi`, and the `-d` option of `axcl-collect-logs` are device indexes. |
| Device PA | The physical address of Device memory, used by Native APIs and Device hardware. Runtime APIs take an opaque Device memory handle (`devPtr`) instead, which the Host must not dereference and which is not a Device PA. [axclrtMemGetDevAddr](../develop/c/memory_api.md#axclrtMemGetDevAddr) and [axclrtMemMapDevAddr](../develop/c/memory_api.md#axclrtMemMapDevAddr) convert between a handle and Device PA / VA. |
| Device VA | The virtual address of Device memory in a Device-side process, provided by Native APIs and used by the Device CPU. It may be absent (0), for example for memory imported through IPC. |
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
