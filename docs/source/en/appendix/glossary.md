# Glossary

| Term | Description |
|---|---|
| AXCL | A Host-side development kit for AXERA AI devices. |
| HOST | The control system that runs user applications and AXCL Host-side libraries. |
| DEVICE | An AXERA AI compute device managed by AXCL, and the device abstraction in Runtime. |
| RUNTIME | The AXCL runtime layer that manages devices, resources, tasks, and synchronization. |
| CONTEXT | An execution environment on a specified device, carrying streams, events, memory, and inference resources. |
| STREAM | A logical FIFO task queue used to organize task order and parallel execution. |
| FIFO | First In, First Out. In an AXCL stream, tasks in the same task queue execute in submission order. |
| EVENT | An object used for task progress recording, elapsed-time measurement, and stream synchronization. |
| RPC | Remote Procedure Call. AXCL Host-side code uses RPC requests to invoke Device-side worker or NATIVE SDK capabilities. |
| NATIVE SDK | A set of device-side native capabilities. |
| NPU | Neural Processing Unit. |
| VDEC | Video Decoder. |
| VENC | Video Encoder. |
| IVE | Intelligent Video Engine, a hardware acceleration module in intelligent analysis systems. |
| IVPS | Image Video Process System, a video and image processing subsystem. |
| DMA | Direct Memory Access. |
| CMM | Continuous memory management resources on AXERA devices. |
| PCIe | A high-speed interconnect channel between Host and Device. |
| RC | Root Complex, the PCIe controller-side role, usually corresponding to Host. |
| EP | Endpoint, the PCIe endpoint-side role, usually corresponding to Device. |
