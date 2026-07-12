# Overview

## 1. What is AXCL

**AXCL** is a Host-side development kit for AXERA AI compute devices. With the C API, runtime libraries, device management tools, and sample programs provided by AXCL, applications can use AXERA hardware resources for deep learning inference, image processing, video encoding/decoding, and data movement.

From an application developer's perspective, AXCL hides the details of PCIe communication, device-side processes, kernel drivers, and hardware resource management between Host and Device. An application only needs to follow the API lifecycle: initialize the runtime, select a device, create contexts and streams, allocate memory, submit tasks, synchronize results, and release resources. AXCL then dispatches the compute or media workload to AXERA AI devices such as AX8860.

## 2. Logical Architecture

```{image} ../../shared/overview_logic_arch.svg
:alt: AXCL logical architecture
:align: center
```

The AXCL architecture can be summarized as follows:

- **Application layer**: user applications, `ffmpeg`, `axstream`, etc.
- **AXCL API layer**: provides the C API and wraps it to provide the Python API, serving as a unified entry for applications to access AXERA AI devices.
- **Runtime capability layer**: provides core capabilities such as memory management, model inference, media processing, and runtime management.
- **Communication and driver layer**: handles control messages, data transfer, DMA movement, and device status reporting between Host and Device.
- **Compute device layer**: AXERA AI devices such as AX8860 execute NPU inference, video encoding/decoding, image processing, and DMA tasks.

## 3. Main Features

### 3.1. Runtime and Device Management

The AXCL runtime library manages the SDK lifecycle, device enumeration, device activation, and device synchronization. Applications usually call [axclInit](../develop/c/system_api.md#axclInit) to initialize the runtime environment, query and select devices through the device APIs, and call [axclFinalize](../develop/c/system_api.md#axclFinalize) to release runtime resources when finished.

Key capabilities include:

- Querying AXCL, driver, firmware, and related version information.
- Querying the chip name, device count, and device attributes.
- Activating or resetting a specified device.
- Querying device availability.
- Synchronizing submitted tasks on a device.

For details, see [System API](../develop/c/system_api.md) and [Device API](../develop/c/device_api.md).

### 3.2. Contexts, Streams, and Events

AXCL uses the **device → context → stream** object model to organize task execution:

- **device** is the runtime abstraction of a Host-visible AXERA AI compute device in AXCL. It is the root object for device selection, resource management, and task submission.
- **context** is an execution environment created on, or default-bound to, a specified device. It carries runtime resources such as streams, events, memory, and inference resources for that device.
- **stream** is a logical FIFO task queue. Tasks in the same stream execute in submission order, while different streams can be used to organize parallel work. For the FIFO term, see [Glossary](../appendix/glossary.md).
- **event** records task progress, measures elapsed time, and establishes synchronization relationships between streams.

Applications can create custom contexts and streams, or use the default objects created when a device is activated. Synchronization APIs support blocking waits, timeout waits, and non-blocking status queries, making them suitable for both synchronous and asynchronous execution flows.

For details, see [Context API](../develop/c/context_api.md), [Stream API](../develop/c/stream_api.md), and [Event API](../develop/c/event_api.md).

### 3.3. Memory Management and Data Movement

AXCL provides Host memory, Device memory, and cross-end copy APIs for models, input/output tensors, media frames, and intermediate buffers. Device memory can be allocated with different policies and supports normal allocation, cached allocation, release, attribute query, capacity query, and explicit cache flush / invalidate operations.

Key capabilities include:

- Allocating and freeing Device memory.
- Allocating and freeing Host-side memory.
- Querying memory capacity and pointer attributes.
- Supporting Host ↔ Device, Device ↔ Device, and Host physical address ↔ Device copy types.
- Supporting synchronous and asynchronous `memcpy`, `memset`, and `memcmp`.
- Using streams to organize asynchronous memory operations and subsequent compute tasks.

For details, see [Memory API](../develop/c/memory_api.md).

### 3.4. Model Inference

The AXCL Engine API targets offline model inference. It provides model loading, model information query, input/output descriptor management, runtime context creation, and synchronous/asynchronous execution. Applications can load a model from a file or memory, query the number, names, shapes, data types, layouts, and buffer sizes of input/output tensors, bind input/output buffers, and submit inference tasks.

Typical capabilities include:

- Initializing and finalizing the runtime engine.
- Loading a model from a `.axmodel` file or from memory.
- Querying model type, compiler version, and memory usage.
- Querying input/output tensor names, indices, shapes, data types, and layouts.
- Creating and destroying model execution contexts.
- Setting input/output buffers.
- Executing inference synchronously, or submitting inference tasks asynchronously to a stream.

For details, see [Engine API](../develop/c/engine_api.md). To quickly verify the model execution environment, see the `axcl_run_model` example in [Quick Start](quick_start.md).

### 3.5. Media Processing

In addition to the AXCL Runtime API, the AXCL Host side integrates NATIVE SDK related shared objects. These expose image processing, video encoding/decoding, and DMA capabilities to Host applications:

- `sys`: system initialization, memory, resource pools, and other base capabilities.
- `ive` / `ivps`: image processing, image preprocessing, and postprocessing.
- `vdec` / `venc`: video decoding and video encoding.
- `dmadim`: DMA copy, 2D copy, memset, checksum, and related data movement capabilities.

These modules allow Host applications to use AXERA AI device capabilities in a way close to the device-side NATIVE SDK. They are suitable for transcoding, visual preprocessing, AI inference pre/post-processing, image enhancement, and video stream processing.

### 3.6. Device Status and Auxiliary Tools

AXCL provides the `axcl-smi` command-line tool for viewing device and process status. Users can use it to check driver and firmware versions, device enumeration, temperature, CPU/NPU utilization, memory usage, and CMM usage, and quickly determine whether the runtime environment is available.

AXCL also includes crash dump support, logging, sample programs, and test programs to help with development, debugging, and issue diagnosis.

## 4. Typical Usage Flow

A typical AXCL application usually follows these steps:

1. **Initialize the runtime**: call [axclInit](../develop/c/system_api.md#axclInit) to load the runtime configuration and initialize the Host-side runtime environment.
2. **Discover and select a device**: use the device query APIs to get device count and status, then call [axclrtSetDevice](../develop/c/device_api.md#axclrtSetDevice) to activate the target device.
3. **Create execution resources**: create contexts, streams, and events as needed; simple scenarios can use the default context / stream.
4. **Prepare data memory**: allocate Host / Device memory and transfer model files, input data, or media frames.
5. **Submit tasks**: submit model inference through the Engine API, or submit encoding/decoding, image processing, and DMA tasks through NATIVE APIs.
6. **Synchronize and retrieve results**: use device, stream, or event synchronization APIs to wait for task completion and copy output data back to Host.
7. **Release resources**: release resources according to the stream, context, device, and runtime lifecycle, and finally call [axclFinalize](../develop/c/system_api.md#axclFinalize).

In asynchronous scenarios, `stream` is the core object for organizing task order. Applications can submit memory copies, model inference, and post-processing tasks to the same stream in sequence, or use multiple streams and events to build more complex concurrent execution flows.

## 5. Applicable Scenarios

AXCL is suitable for the following Host-side applications:

- **AI inference applications**: load `.axmodel` files, manage input/output buffers, and execute model inference on AXERA NPU.
- **Video encoding/decoding applications**: use AXERA hardware capabilities for video decoding, encoding, or transcoding.
- **Image preprocessing / postprocessing applications**: use IVPS, IVE, DMA, and related capabilities for resize, format conversion, copy, fill, and other processing.
- **Multi-device management applications**: enumerate, select, and manage multiple AXERA AI devices from one Host.
- **Performance validation and device diagnosis**: use `axcl-smi`, `axcl_run_model`, and sample programs to verify device status, model performance, and basic functionality.

## 6. Next Steps

Continue with the following topics:

1. Read [Install](install/index.md) to install the driver, runtime, and tools.
2. Read [Quick Start](quick_start.md) to verify device availability with `axcl-smi` and `axcl_run_model`.
3. Read the [C API Index](../develop/c/index.rst) and choose the system, device, memory, stream, event, or engine APIs based on your use case.
4. Read [System Architecture](../develop/arch/system.md) to understand the layering between AXCL, the Host, the driver, and the Device.
