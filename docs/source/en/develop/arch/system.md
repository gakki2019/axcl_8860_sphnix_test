# System Architecture

AXCL provides a unified software entry point for Host applications to access AXERA AI devices. Applications run on the Host side and use AXCL C APIs, Python APIs, and tools for device initialization, resource management, task submission, data movement, and synchronization.

Requests that need to run on the Device side are forwarded by AXCL to the Device-side execution environment, which then calls the local NATIVE SDK to access hardware resources.

At the system level, AXCL connects Host applications with Device-local capabilities:

- The Host side provides APIs, runtime object management, and cross-end communication capabilities;
- The Device side provides daemon processes, worker processes, the local NATIVE SDK, and hardware resource access;
- Both sides work together over PCIe and other transport links to exchange control messages, task requests, and data.

```{image} ../../asserts/arch.svg
:alt: AXCL Host-Device system architecture
:align: center
```

The figure shows AXCL's logical layers and deployment view in a Host-Device architecture:

- The left side contains HOST-side components;
- The right side contains DEVICE-side components;
- The middle represents the cross-end transport boundary between Host and Device.

## 1. Host-Device Boundary

AXCL applications run on the Host side, while the actual hardware resources are on the Device side. A Host API call may complete locally on the Host, or it may be packaged as a cross-end request and completed by the Device-side execution environment through the local NATIVE SDK.

The Host-Device boundary is reflected in the following aspects:

- Host applications and the Device-side execution environment run in different processes and address spaces;
- The Host-side runtime library manages runtime objects and cross-end channels;
- The Device-side execution environment receives Host requests and calls the local NATIVE SDK to access hardware resources;
- Host / Device data exchange is completed through the runtime library's data movement capability and communication channels;
- A successful return from an asynchronous API means the task has been submitted, not that it has completed. Task completion and execution errors must be obtained through the synchronization or status query APIs of the runtime library.

## 2. HOST-side Components

The HOST side is the main entry point for user applications and AXCL APIs. Applications typically use C APIs, Python APIs, tools, or upper-layer frameworks directly; runtime libraries, protocol / communication libraries, and kernel drivers work together internally to complete device control and cross-end communication.

| Component | Role |
|---|---|
| Business application | User application entry point that calls AXCL APIs or upper-layer frameworks built on AXCL. |
| FFmpeg | Adapts existing FFmpeg media pipelines so codec and image-processing capabilities can be integrated through FFmpeg-style workflows, reducing application migration cost. |
| AXStream | Upper-layer framework for media stream processing. |
| Device monitoring and management | Uses `axcl-smi` to query device status and perform system control. |
| Runtime library | `libaxcl_rt.so`, providing core runtime objects such as Device, Context, Stream, Task, and Event. |
| NATIVE RPC library | `libaxcl_sys.so`, `libaxcl_vdec.so`, `libaxcl_venc.so`, and others, forwarding Host-side calls to the Device-side NATIVE SDK. |
| Python API | Python entry point built on top of the C APIs. |
| Protocol / communication libraries | `libaxcl_protocol.so` and `libaxcl_comm.so`, responsible for packet handling, channel management, and cross-end transport. |
| Kernel drivers | `axcl_rt.ko`, `ax_comm.ko`, and related modules, responsible for Host-side device control and communication transport. |

## 3. DEVICE-side Components

The DEVICE side receives and processes requests from the Host, accesses hardware resources through the local NATIVE SDK, and cooperates with the Host side to complete task execution, data transfer, and status feedback.

| Component | Role |
|---|---|
| Device control driver | `axcl_dev.ko`, passing Host-side control requests to the daemon and reporting Device and Worker status to the Host. |
| Worker monitor driver | `axcl_wk_monitor.ko`, monitoring the lifecycle of Worker processes and reporting their exit status. |
| Communication transport driver | `ax_comm.ko`, providing Device-side cross-end messages and DMA channels. |
| Protocol / communication libraries | `libax_protocol.so` and `libax_comm.so`, parsing requests, packaging responses, and supporting cross-end transport. |
| Daemon process | `slave_daemon`, a resident Device-side process that receives control requests and manages Worker lifecycles. |
| Worker process | `slave_worker`, receiving Host application task requests and calling the Device-local SDK to complete execution. |
| NATIVE SDK | `libax_sys.so`, `libax_ivps.so`, `libax_vdec.so`, `libax_venc.so`, `libax_engine.so`, and others, providing access to Device-local hardware capabilities. |
| Hardware resources | Device-local hardware resources such as CPU, NPU, VPU, IVE, IVPS, and DMA. |

## 4. App Start and Exit

After the Device system starts, the resident daemon process `slave_daemon` starts running. [axclInit](../c/system_api.md#axclInit) only detects Devices; no worker is created yet. When a Host process activates a Device for the first time, through [axclrtSetDevice](../c/device_api.md#axclrtSetDevice) or [axclrtCreateContext](../c/context_api.md#axclrtCreateContext), `slave_daemon` starts a `slave_worker` for that process on that Device. After activation, the Host process communicates with its `slave_worker` through a dedicated communication channel.

```{image} ../../asserts/app_start.svg
:alt: App start sequence
:align: center
```

When a Host process finally releases a Device with [axclrtResetDevice](../c/device_api.md#axclrtResetDevice) or [axclrtResetDeviceForce](../c/device_api.md#axclrtResetDeviceForce), or calls [axclFinalize](../c/system_api.md#axclFinalize), AXCL sends a release request to the Device and waits until the worker has exited. `slave_daemon` terminates the corresponding `slave_worker`, and the Device-side driver reports the worker's exit to the Host. If the Host process exits without releasing the Device, the Host driver closes its channels and the Device reclaims the worker in the same way.

If a `slave_worker` exits unexpectedly while the Device is still in use, AXCL marks the Device offline for that Host process, fails its unfinished tasks, and notifies the callback registered by [axclrtRegDeviceStateCallback](../c/device_api.md#axclrtRegDeviceStateCallback).

```{image} ../../asserts/app_exit.svg
:alt: App exit sequence
:align: center
```

The two diagrams summarize how a Worker is started when a Host process activates a Device and reclaimed when the Device is released.

## 5. Multi-process Support

AXCL supports multiple Host processes accessing the same Device concurrently. Each Host process maps to an independent Worker on the Device side and submits tasks through an independent communication channel. The resident management process on the Device side creates and releases these Workers on demand and does not execute business tasks directly.

```{image} ../../asserts/multi_process.svg
:alt: AXCL multi-process support
:align: center
```

When the same Host process accesses multiple Devices, independent execution channels are established on the corresponding Devices.

## 6. Related Documents

Content related to AXCL system architecture includes:

- [Core Concepts](concept.md): introduces runtime objects such as Device, Context, Stream, Task, and Event;
- [C API Reference](../c/index.md): provides concrete API definitions and parameter descriptions.
