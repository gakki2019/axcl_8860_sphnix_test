# Memory Management

This document introduces the AXCL memory model in a Host-Device architecture, and the runtime APIs related to memory allocation, data movement, and synchronization boundaries.

In a single-SoC scenario, an application typically works with a local operating system, a local process address space, and local device memory. AXCL targets a Host-Device architecture: applications and AXCL runtime run on the Host side, while the Device side provides AI compute, media processing, and other hardware capabilities. The two sides use different address spaces, and cross-end data access is completed through AXCL runtime APIs.

Compared with a single-SoC scenario, AXCL memory management places more emphasis on the boundary between Host and Device. Host virtual addresses, Host physical addresses, and Device addresses have different meanings. `devPtr` is a Device memory handle passed to AXCL APIs.

AXCL provides both synchronous and asynchronous copy APIs for moving data between Host and Device. When a synchronous copy API returns, the copy has completed. When an asynchronous copy API returns, it only means that the copy request has been submitted; whether the data is available must be confirmed through the corresponding Stream, Event, or synchronization API.

```{image} ../../asserts/memory.svg
:alt: AXCL Host-Device memory boundary
:align: center
```

The figure shows the basic memory access boundary in the AXCL Host-Device architecture:

- Host applications can directly access only Host buffers;
- Device memory cannot be directly dereferenced on the Host, and Host / Device data movement must be completed through AXCL runtime APIs.

## 1. Memory Objects

### 1.1. Device Memory

AXCL provides [axclrtMalloc](../c/memory_api.md#axclrtMalloc) and [axclrtMallocCached](../c/memory_api.md#axclrtMallocCached) to allocate memory on the Device side, and returns it to the Host as `devPtr`. The Host side passes `devPtr` as a Device memory handle to AXCL runtime APIs.

| Operation | API | Description |
|---|---|---|
| Allocate Device memory | [axclrtMalloc](../c/memory_api.md#axclrtMalloc) | Allocates physically contiguous Device memory. |
| Allocate cached Device memory | [axclrtMallocCached](../c/memory_api.md#axclrtMallocCached) | Allocates Device memory with the cached attribute. The cached attribute can be queried through `axclrtPointerGetAttributes`. |
| Free Device memory | [axclrtFree](../c/memory_api.md#axclrtFree) | Frees memory allocated by `axclrtMalloc` / `axclrtMallocCached`. |

```{important}
`devPtr` is not a valid accessible address in the Host process and must not be directly dereferenced on the Host side.
```

### 1.2. Host Memory

AXCL provides [axclrtMallocHost](../c/memory_api.md#axclrtMallocHost) to allocate memory on the Host side. Host applications can directly read and write this memory.

| Operation | API | Description |
|---|---|---|
| Allocate Host virtual memory | [axclrtMallocHost](../c/memory_api.md#axclrtMallocHost) | Functionally similar to standard `malloc`. |
| Free Host virtual memory | [axclrtFreeHost](../c/memory_api.md#axclrtFreeHost) | Frees memory allocated by `axclrtMallocHost`. |

```{note}
1. Memory allocated by the standard library `malloc` can be used for Host ↔ Device copies, but [axclrtMallocHost](../c/memory_api.md#axclrtMallocHost) is recommended. Memory allocated by [axclrtMallocHost](../c/memory_api.md#axclrtMallocHost) is better suited for the AXCL data transfer path, and its attributes can be queried through [axclrtPointerGetAttributes](../c/memory_api.md#axclrtPointerGetAttributes).
2. Host memory must be released by the matching free API: memory allocated by [axclrtMallocHost](../c/memory_api.md#axclrtMallocHost) must be released by [axclrtFreeHost](../c/memory_api.md#axclrtFreeHost); memory allocated by the standard library `malloc` must be released by the standard library `free`. These two allocation and free API pairs must not be mixed.
```

## 2. Data Movement

A typical task flow includes four stages: preparing input on the Host, Host-to-Device copy, Device-side task execution, and Device-to-Host copy.

For example, in a CNN detection model, the Host copies the input image to the Device. After the Device completes inference, the detection result is copied back to the Host.

```{image} ../../asserts/memory_cnn_flow.svg
:alt: CNN detection model Host-Device data movement
:align: center
```

### 2.1. Copy Directions

AXCL uses [axclrtMemcpyKind](../c/reference/enum.md#axclrtMemcpyKind) to describe copy directions:

| Copy kind | Direction |
|---|---|
| [AXCL_MEMCPY_HOST_TO_HOST](../c/reference/enum.md#AXCL_MEMCPY_HOST_TO_HOST) | Host virtual memory to Host virtual memory. |
| [AXCL_MEMCPY_HOST_TO_DEVICE](../c/reference/enum.md#AXCL_MEMCPY_HOST_TO_DEVICE) | Host virtual memory to Device physical memory. |
| [AXCL_MEMCPY_DEVICE_TO_HOST](../c/reference/enum.md#AXCL_MEMCPY_DEVICE_TO_HOST) | Device physical memory to Host virtual memory. |
| [AXCL_MEMCPY_DEVICE_TO_DEVICE](../c/reference/enum.md#AXCL_MEMCPY_DEVICE_TO_DEVICE) | Device physical memory to Device physical memory. |
| [AXCL_MEMCPY_HOST_PHY_TO_DEVICE](../c/reference/enum.md#AXCL_MEMCPY_HOST_PHY_TO_DEVICE) | Host physical memory to Device physical memory. |
| [AXCL_MEMCPY_DEVICE_TO_HOST_PHY](../c/reference/enum.md#AXCL_MEMCPY_DEVICE_TO_HOST_PHY) | Device physical memory to Host physical memory. |

<a id="memory-synchronous-copy"></a>

### 2.2. Synchronous Copy

[axclrtMemcpy](../c/memory_api.md#axclrtMemcpy) is a synchronous copy API. For Host ↔ Device copies, a successful return indicates that the current synchronous copy has completed.

The following example shows the core call sequence. [axclInit](../c/system_api.md#axclInit) / [axclFinalize](../c/system_api.md#axclFinalize) and error-code checks are omitted.

```c
void *hostMem = NULL;
void *devMem = NULL;
size_t size = 1024 * 1024;

axclrtSetDevice(0);

axclrtMallocHost(&hostMem, size);
axclrtMalloc(&devMem, size, AXCL_MEM_MALLOC_HUGE_FIRST);

/* After filling hostMem on the Host side, copy it synchronously to the Device. */
axclrtMemcpy(devMem, hostMem, size, AXCL_MEMCPY_HOST_TO_DEVICE);

axclrtFree(devMem);
axclrtFreeHost(hostMem);
axclrtResetDevice(0);
```

<a id="memory-asynchronous-copy"></a>

### 2.3. Asynchronous Copy

[axclrtMemcpyAsync](../c/memory_api.md#axclrtMemcpyAsync) associates a copy request with the specified [axclrtStream](../c/reference/struct.md#axclrtStream), so the copy and other Tasks in the same Stream are executed in submission order.

```c
axclrtStream stream;
void *hostIn = NULL;
void *hostOut = NULL;
void *devIn = NULL;
void *devOut = NULL;
size_t size = 1024 * 1024;

axclrtSetDevice(0);
axclrtCreateStream(&stream);

axclrtMallocHost(&hostIn, size);
axclrtMallocHost(&hostOut, size);
axclrtMalloc(&devIn, size, AXCL_MEM_MALLOC_HUGE_FIRST);
axclrtMalloc(&devOut, size, AXCL_MEM_MALLOC_HUGE_FIRST);

/* The H2D copy is submitted to stream. */
axclrtMemcpyAsync(devIn, hostIn, size, AXCL_MEMCPY_HOST_TO_DEVICE, stream);

/* Subsequent inference in the same stream runs after the H2D copy and writes devOut. */
axclrtEngineExecuteAsync(..., stream);

/* The D2H copy runs after the preceding inference writes devOut. */
axclrtMemcpyAsync(hostOut, devOut, size, AXCL_MEMCPY_DEVICE_TO_HOST, stream);

/* Wait for all submitted tasks in stream to complete. */
axclrtSynchronizeStream(stream);

axclrtFree(devOut);
axclrtFree(devIn);
axclrtFreeHost(hostOut);
axclrtFreeHost(hostIn);
axclrtDestroyStream(stream);
axclrtResetDevice(0);
```

```{important}
When [axclrtMemcpyAsync](../c/memory_api.md#axclrtMemcpyAsync) returns successfully, the copy has only been submitted to the specified Stream. It does not mean that the data has already been copied. Completion of an asynchronous copy can be confirmed by synchronizing that Stream, waiting for an Event recorded on that Stream, or using a Device-level synchronization API.
```

<a id="memory-inter-device-copy"></a>

### 2.4. Inter-Device Copy

The following example copies memory from Device 0 to Device 1. The application first checks whether Peer Access is supported between the two devices, and then enables access in both directions. Error handling is omitted.

```c
axclInit(NULL);

int32_t canAccessPeer = 0;
axclrtDeviceCanAccessPeer(&canAccessPeer, 0, 1);
if (canAccessPeer == 1) {
    uint32_t reserved = 0U;

    axclrtSetDevice(0);
    axclrtDeviceEnablePeerAccess(1, reserved);

    void *dev0Mem = NULL;
    axclrtMalloc(&dev0Mem, 10, AXCL_MEM_MALLOC_NORMAL_ONLY);

    axclrtSetDevice(1);
    axclrtDeviceEnablePeerAccess(0, reserved);

    void *dev1Mem = NULL;
    axclrtMalloc(&dev1Mem, 10, AXCL_MEM_MALLOC_NORMAL_ONLY);

    /* Copy data from Device 0 to Device 1. */
    axclrtMemcpy(dev1Mem, dev0Mem, 10, AXCL_MEMCPY_DEVICE_TO_DEVICE);

    axclrtDeviceDisablePeerAccess(0);
    axclrtFree(dev1Mem);
    axclrtResetDevice(1);

    axclrtSetDevice(0);
    axclrtDeviceDisablePeerAccess(1);
    axclrtFree(dev0Mem);
    axclrtResetDeviceForce(0);
}

axclFinalize();
```

## 3. Other Memory Operations

AXCL also provides APIs for setting and comparing Device memory:

| Operation | Synchronous API | Asynchronous API | Description |
|---|---|---|---|
| Set Device memory | [axclrtMemset](../c/memory_api.md#axclrtMemset) | [axclrtMemsetAsync](../c/memory_api.md#axclrtMemsetAsync) | `axclrtMemset` supports Device memory only. |
| Compare Device memory | [axclrtMemcmp](../c/memory_api.md#axclrtMemcmp) | [axclrtMemcmpAsync](../c/memory_api.md#axclrtMemcmpAsync) | Compares two Device memory ranges. The synchronous API returns `AXCL_SUCC` when the content is identical. |

## 4. Important APIs

| API | Function | Memory object |
|---|---|---|
| [axclrtMalloc](../c/memory_api.md#axclrtMalloc) | Allocates Device memory. | Device memory |
| [axclrtMallocCached](../c/memory_api.md#axclrtMallocCached) | Allocates Device memory with the cached attribute. | Device memory |
| [axclrtFree](../c/memory_api.md#axclrtFree) | Frees memory allocated by `axclrtMalloc` / `axclrtMallocCached`. | Device memory |
| [axclrtMallocHost](../c/memory_api.md#axclrtMallocHost) | Allocates Host virtual memory. | Host memory |
| [axclrtFreeHost](../c/memory_api.md#axclrtFreeHost) | Frees memory allocated by `axclrtMallocHost`. | Host memory |
| [axclrtMemcpy](../c/memory_api.md#axclrtMemcpy) | Copies Host / Device data synchronously. | Host memory, Device memory |
| [axclrtMemcpyAsync](../c/memory_api.md#axclrtMemcpyAsync) | Submits an asynchronous copy request to a Stream. | Host memory, Device memory |
| [axclrtMemset](../c/memory_api.md#axclrtMemset) | Sets Device memory synchronously. | Device memory |
| [axclrtMemsetAsync](../c/memory_api.md#axclrtMemsetAsync) | Submits an asynchronous Device memory set request to a Stream. | Device memory |
| [axclrtMemcmp](../c/memory_api.md#axclrtMemcmp) | Compares two Device memory ranges synchronously. | Device memory |
| [axclrtMemcmpAsync](../c/memory_api.md#axclrtMemcmpAsync) | Submits an asynchronous Device memory comparison request to a Stream. | Device memory |
| [axclrtGetMemInfo](../c/memory_api.md#axclrtGetMemInfo) | Queries Device-side memory capacity information. | Device memory |
| [axclrtPointerGetAttributes](../c/memory_api.md#axclrtPointerGetAttributes) | Queries pointer location and flags. | Host memory, Device memory |
