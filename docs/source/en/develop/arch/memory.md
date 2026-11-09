# Memory Management

This document introduces the AXCL memory model in a Host-Device architecture, and the runtime APIs related to memory allocation, data movement, and synchronization boundaries.

In a single-SoC scenario, an application typically works with a local operating system, a local process address space, and local device memory. AXCL targets a Host-Device architecture: applications and AXCL runtime run on the Host side, while the Device side provides AI compute, media processing, and other hardware capabilities. The two sides use different address spaces, and cross-end data access is completed through AXCL runtime APIs.

Compared with a single-SoC scenario, AXCL memory management places more emphasis on the boundary between Host and Device. Host virtual addresses and Device addresses have different meanings. `devPtr` is an opaque Device memory handle passed to AXCL APIs; it is neither a Host pointer nor a Device address.

AXCL provides both synchronous and asynchronous copy APIs for moving data between Host and Device. When a synchronous copy API returns, the copy has completed. When an asynchronous copy API returns, the copy has only been submitted; confirm that the data is available through the corresponding Stream, Event, or Device synchronization API.

```{image} ../../asserts/memory.svg
:alt: AXCL Host-Device memory boundary
:align: center
```

The figure shows the basic memory access boundary in the AXCL Host-Device architecture:

- Host applications can directly access only Host buffers;
- Device memory cannot be directly dereferenced on the Host, and Host / Device data movement must be completed through AXCL runtime APIs.

## 1. Memory Objects

### 1.1. Device Memory

AXCL provides [axclrtMalloc](../c/memory_api.md#axclrtMalloc) and [axclrtMallocCached](../c/memory_api.md#axclrtMallocCached) to allocate memory on the Device of the calling thread's current Context, and returns it to the Host as `devPtr`. The Host passes `devPtr` as a Device memory handle to AXCL runtime APIs. `devPtr` is not a Device physical address and must not be passed directly to native SDK APIs; see [External Device Memory Interoperability](memory.md#memory-external-device-memory) for conversion.

| Operation | API | Description |
|---|---|---|
| Allocate Device memory | [axclrtMalloc](../c/memory_api.md#axclrtMalloc) | Allocates physically contiguous Device memory. The memory is not initialized. |
| Allocate cached Device memory | [axclrtMallocCached](../c/memory_api.md#axclrtMallocCached) | Allocates physically contiguous Device memory with the cached attribute, which [axclrtPointerGetAttributes](../c/memory_api.md#axclrtPointerGetAttributes) reports. Use [axclrtMemFlush](../c/memory_api.md#axclrtMemFlush) and [axclrtMemInvalidate](../c/memory_api.md#axclrtMemInvalidate) to maintain cache coherency when required. |
| Free Device memory | [axclrtFree](../c/memory_api.md#axclrtFree) | Frees memory allocated by `axclrtMalloc` / `axclrtMallocCached`, or releases a handle imported by `axclrtIpcMemImportByKey`. |

```{important}
- `devPtr` is not an accessible address in the Host process and must not be dereferenced on the Host.
- [axclrtFree](../c/memory_api.md#axclrtFree) must be given the base handle returned by [axclrtMalloc](../c/memory_api.md#axclrtMalloc) / [axclrtMallocCached](../c/memory_api.md#axclrtMallocCached). An offset pointer is rejected.
- To free locally allocated memory, the calling thread's current Context must belong to the Device that owns the memory.
- Frequent allocation and release can reduce performance. Preallocate memory where possible.
```

### 1.2. Host Memory

AXCL provides [axclrtMallocHost](../c/memory_api.md#axclrtMallocHost) to allocate memory on the Host side. Host applications can directly read and write this memory.

| Operation | API | Description |
|---|---|---|
| Allocate Host virtual memory | [axclrtMallocHost](../c/memory_api.md#axclrtMallocHost) | Allocates Host memory that is prepared for AXCL data transfer. The Host accesses it like memory from `malloc`. |
| Free Host virtual memory | [axclrtFreeHost](../c/memory_api.md#axclrtFreeHost) | Frees memory allocated by `axclrtMallocHost`. |

```{note}
1. Memory allocated by the standard library `malloc` can be used for Host ↔ Device copies, but [axclrtMallocHost](../c/memory_api.md#axclrtMallocHost) is recommended: `malloc` memory is pinned and unpinned on every transfer, while [axclrtMallocHost](../c/memory_api.md#axclrtMallocHost) memory is already prepared for DMA. Its attributes can be queried through [axclrtPointerGetAttributes](../c/memory_api.md#axclrtPointerGetAttributes).
2. Host memory must be released by the matching free API: memory allocated by [axclrtMallocHost](../c/memory_api.md#axclrtMallocHost) must be released by [axclrtFreeHost](../c/memory_api.md#axclrtFreeHost); memory allocated by the standard library `malloc` must be released by the standard library `free`. Do not mix the two pairs.
3. Memory allocated by [axclrtMallocHost](../c/memory_api.md#axclrtMallocHost) belongs to the process, not to a Device or Context. Allocation and release need no current Context, but at least one usable active Device must exist in the process. The memory can be used with any active Device in the process, and stays valid until it is freed or the last active Device in the process is released.
```

```{important}
- Before calling [axclrtFreeHost](../c/memory_api.md#axclrtFreeHost), make sure all asynchronous operations that use the memory have completed.
- [axclrtMallocHost](../c/memory_api.md#axclrtMallocHost) / [axclrtFreeHost](../c/memory_api.md#axclrtFreeHost) must be serialized with operations that close a device and with [axclFinalize](../c/system_api.md#axclFinalize). Operations that close a device include [axclrtResetDevice](../c/device_api.md#axclrtResetDevice), [axclrtResetDeviceForce](../c/device_api.md#axclrtResetDeviceForce), and [axclrtDestroyContext](../c/context_api.md#axclrtDestroyContext) when it releases the last activation reference of the device.
```

### 1.3. External Device Memory

native SDK APIs, such as `AX_XXX_YYYY` APIs, describe memory by Device physical address and Device virtual address, which differ from the AXCL `devPtr` handle. AXCL provides the following APIs to convert the same Device memory between the two, so that native SDK APIs and AXCL runtime APIs can be used together. Addresses and sizes are passed through [axclrtDevMemDesc](../c/reference/struct.md#axclrtDevMemDesc).

| Operation | API | Description |
|---|---|---|
| Export Device addresses | [axclrtMemGetDevAddr](../c/memory_api.md#axclrtMemGetDevAddr) | Exports the Device physical and virtual addresses from `devPtr` for use by native SDK APIs. |
| Register external Device memory | [axclrtMemMapDevAddr](../c/memory_api.md#axclrtMemMapDevAddr) | Registers the Device physical and virtual addresses returned by native SDK APIs as a `devPtr` handle. |
| Unregister external Device memory | [axclrtMemUnmapDevAddr](../c/memory_api.md#axclrtMemUnmapDevAddr) | Unregisters a `devPtr` handle registered by `axclrtMemMapDevAddr`. |
| Query address range | [axclrtMemGetAddressRange](../c/memory_api.md#axclrtMemGetAddressRange) | Queries the base handle and total size of the allocation or registration that `devPtr` belongs to. |

```{important}
- [axclrtMemMapDevAddr](../c/memory_api.md#axclrtMemMapDevAddr) only creates a `devPtr` handle. It does not create a native virtual address mapping or take ownership of the external memory. The physical address passed in must be a Device physical address, not a `devPtr`; the caller must ensure that the physical address and the virtual address refer to the same valid memory.
- [axclrtMemUnmapDevAddr](../c/memory_api.md#axclrtMemUnmapDevAddr) only unregisters the handle and does not free the native memory. The external memory must be released through the matching native SDK API after all operations that use the handle have completed.
- After a device is reset, all handles registered on that device become invalid. They must not be used again, and must not be passed to [axclrtMemUnmapDevAddr](../c/memory_api.md#axclrtMemUnmapDevAddr).
```

For a typical call flow, see [External Device Memory Interoperability](memory.md#memory-external-device-memory).

### 1.4. Cross-Process Shared Memory

AXCL provides the following APIs to share the same Device memory among multiple processes. The process that allocates the memory (Producer) exports an IPC Key, and other processes (Consumers) import it by the IPC Key to obtain a `devPtr` handle valid in their own process. Both sides access the same Device memory, and no data copy is required.

| Operation | API | Description |
|---|---|---|
| Export | [axclrtIpcMemGetExportKey](../c/memory_api.md#axclrtIpcMemGetExportKey) | The Producer exports the base handle of memory it allocated with `axclrtMalloc` / `axclrtMallocCached` and obtains an IPC Key. An allocation has at most one exported key at a time. Imported handles and handles registered by `axclrtMemMapDevAddr` cannot be exported. |
| Set import whitelist | [axclrtIpcMemSetImportPid](../c/memory_api.md#axclrtIpcMemSetImportPid) | The Producer sets the processes (Host TGIDs) allowed to import the IPC Key. Each call replaces the previous whitelist. To skip whitelist checks, export with [AXCL_IPC_EXPORT_FLAG_DISABLE_PID_VALIDATION](../c/reference/macro.md#AXCL_IPC_EXPORT_FLAG_DISABLE_PID_VALIDATION) instead. |
| Query Host TGID | [axclrtDeviceGetBareTgid](../c/device_api.md#axclrtDeviceGetBareTgid) | A Consumer queries its own TGID in the initial PID namespace, for the Producer to set the whitelist. |
| Import | [axclrtIpcMemImportByKey](../c/memory_api.md#axclrtIpcMemImportByKey) | A Consumer imports by the IPC Key and obtains a `devPtr` handle in its own process. The Device that owns the memory must be active in the Consumer process. Each import takes one IPC reference and returns a new handle. |
| Close | [axclrtIpcMemClose](../c/memory_api.md#axclrtIpcMemClose) | The Producer and each Consumer release their own IPC references, one call per export or import. After the Producer closes the key, new imports fail. |

```{important}
- The Producer determines the lifetime of the shared memory. It must not free the memory before all Consumers finish using it; otherwise Device access from the Consumers is undefined. Closing the IPC Key or freeing a handle in a Consumer does not extend the lifetime of the Producer's memory.
- For the same IPC Key, all Consumers should call [axclrtIpcMemClose](../c/memory_api.md#axclrtIpcMemClose) before the Producer does.
- Calling [axclrtFree](../c/memory_api.md#axclrtFree) in a Consumer only releases the handle in that process and does not release the Device physical memory. Each import must be released with both [axclrtIpcMemClose](../c/memory_api.md#axclrtIpcMemClose) and [axclrtFree](../c/memory_api.md#axclrtFree).
- A whitelisted TGID is accepted only for a process that was already running when it was added. Set the whitelist after the Consumer has started.
- In containerized environments such as Docker and Kubernetes, the whitelist must use the Host TGID returned by [axclrtDeviceGetBareTgid](../c/device_api.md#axclrtDeviceGetBareTgid), not the in-container PID returned by `getpid`.
```

For a typical call flow, see [Cross-Process Shared Memory](memory.md#memory-ipc-shared-memory).

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
| [AXCL_MEMCPY_HOST_TO_DEVICE](../c/reference/enum.md#AXCL_MEMCPY_HOST_TO_DEVICE) | Host virtual memory to Device memory (`devPtr`). |
| [AXCL_MEMCPY_DEVICE_TO_HOST](../c/reference/enum.md#AXCL_MEMCPY_DEVICE_TO_HOST) | Device memory (`devPtr`) to Host virtual memory. |
| [AXCL_MEMCPY_DEVICE_TO_DEVICE](../c/reference/enum.md#AXCL_MEMCPY_DEVICE_TO_DEVICE) | Device memory to Device memory, on the same Device or between two Devices. |

Device memory in a copy must belong to the Device of the current Context (for [axclrtMemcpy](../c/memory_api.md#axclrtMemcpy)) or of the Stream (for [axclrtMemcpyAsync](../c/memory_api.md#axclrtMemcpyAsync)). The exception is a Device-to-Device copy between two Devices; see [Inter-Device Copy](memory.md#memory-inter-device-copy).

<a id="memory-synchronous-copy"></a>

### 2.2. Synchronous Copy

[axclrtMemcpy](../c/memory_api.md#axclrtMemcpy) is a synchronous copy API that supports all copy directions. A successful return means the copy has completed. The calling thread must have a current Context.

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

[axclrtMemcpyAsync](../c/memory_api.md#axclrtMemcpyAsync) submits a copy to the specified [axclrtStream](../c/reference/struct.md#axclrtStream). The copy runs in submission order with the other Tasks in that Stream, including Host-to-Host copies.

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
- When [axclrtMemcpyAsync](../c/memory_api.md#axclrtMemcpyAsync) returns successfully, the copy has only been submitted to the Stream; the data may not have been copied yet. Confirm completion by synchronizing the Stream, waiting for an Event recorded on the Stream after the copy, or synchronizing the Device.
- Errors raised when the Device accepts or executes the copy are returned by the next [axclrtSynchronizeStream](../c/stream_api.md#axclrtSynchronizeStream) on the Stream.
- Keep the source and destination memory valid until the copy completes. Do not read the destination or free either buffer before then.
```

<a id="memory-2d-copy"></a>

### 2.4. 2D Copy

[axclrtMemcpy2d](../c/memory_api.md#axclrtMemcpy2d) and [axclrtMemcpy2dAsync](../c/memory_api.md#axclrtMemcpy2dAsync) copy a 2D rectangle between Host and Device memory: `height` rows of `width` bytes, where the source and destination advance to the next row by `spitch` and `dpitch` respectively. The bytes between rows (padding) are neither read nor written. Use them for row-aligned images or data stored at a fixed stride, so that one call replaces a copy per row.

2D copies support only [AXCL_MEMCPY_HOST_TO_DEVICE](../c/reference/enum.md#AXCL_MEMCPY_HOST_TO_DEVICE) and [AXCL_MEMCPY_DEVICE_TO_HOST](../c/reference/enum.md#AXCL_MEMCPY_DEVICE_TO_HOST). Completion semantics and Device ownership rules of the synchronous and asynchronous functions are the same as for 1D copies.

```c
/* Copy a 1000 x 256 rectangle whose Host rows are 1024 bytes apart to Device rows 2048 bytes apart. */
axclrtMemcpy2d(devMem, 2048, hostMem, 1024, 1000, 256, AXCL_MEMCPY_HOST_TO_DEVICE);
```

```{important}
- Each side spans `(height - 1) * pitch + width` bytes. The Device span must lie in one Device allocation. The Host span, padding included, must be mapped, and writable for a Device-to-Host copy.
- Until the copy completes, the CPU must not read or write any byte of the Host span, padding included.
- On a device that is not DMA coherent, such as an AX8860 local device, the destination of a Device-to-Host 2D copy must come from [axclrtMallocHost](../c/memory_api.md#axclrtMallocHost); plain `malloc` memory returns `AXCL_ERR_COMM_UNSUPPORT`. This does not apply when both pitches equal `width` or there is only one row.
- Many short rows copy noticeably slower than one contiguous copy of the same size.
```

<a id="memory-inter-device-copy"></a>

### 2.5. Inter-Device Copy

A Device-to-Device copy between two Devices runs on the current Device (for [axclrtMemcpy](../c/memory_api.md#axclrtMemcpy)) or on the Device of the Stream (for [axclrtMemcpyAsync](../c/memory_api.md#axclrtMemcpyAsync)). That Device must own either the source or the destination, and peer access from it to the other Device must be enabled with [axclrtDeviceEnablePeerAccess](../c/device_api.md#axclrtDeviceEnablePeerAccess). Peer access is one-way, applies to the whole process, and stays enabled until [axclrtDeviceDisablePeerAccess](../c/device_api.md#axclrtDeviceDisablePeerAccess) is called. [axclrtDeviceCanAccessPeer](../c/device_api.md#axclrtDeviceCanAccessPeer) queries the capability and requires the source Device to be active. Direct Device-to-Device copy is supported only between Devices on the same accelerator card; a direct copy between Devices on different cards returns an error and must go through the Host.

The following example copies memory from Device 0 to Device 1. The application activates Device 0, checks whether peer access is supported between the two Devices, and then enables access in both directions. Error handling is omitted.

```c
axclInit(NULL);

/* Activate Device 0 first; the capability query runs on an active Device. */
axclrtSetDevice(0);

int32_t canAccessPeer = 0;
axclrtDeviceCanAccessPeer(&canAccessPeer, 0, 1);
if (canAccessPeer == 1) {
    uint32_t reserved = 0U;

    axclrtDeviceEnablePeerAccess(1, reserved);

    void *dev0Mem = NULL;
    axclrtMalloc(&dev0Mem, 10, AXCL_MEM_MALLOC_NORMAL_ONLY);

    axclrtSetDevice(1);
    axclrtDeviceEnablePeerAccess(0, reserved);

    void *dev1Mem = NULL;
    axclrtMalloc(&dev1Mem, 10, AXCL_MEM_MALLOC_NORMAL_ONLY);

    /* The copy runs on the current Device 1, which owns the destination and has peer access to Device 0. */
    axclrtMemcpy(dev1Mem, dev0Mem, 10, AXCL_MEMCPY_DEVICE_TO_DEVICE);

    axclrtDeviceDisablePeerAccess(0);
    axclrtFree(dev1Mem);
    axclrtResetDevice(1);

    /* Switching back with axclrtSetDevice adds a second reference to Device 0, so reset it twice. */
    axclrtSetDevice(0);
    axclrtDeviceDisablePeerAccess(1);
    axclrtFree(dev0Mem);
    axclrtResetDevice(0);
    axclrtResetDevice(0);
} else {
    axclrtResetDevice(0);
}

axclFinalize();
```

<a id="memory-external-device-memory"></a>

### 2.6. External Device Memory Interoperability

The following examples show the two directions in which memory is passed between AXCL and native SDK APIs. `AX_XXX_YYYY` represents a native SDK API. Error-code checks are omitted.

Passing memory allocated by AXCL to a native SDK API:

```c
void *devMem = NULL;
axclrtDevMemDesc desc = {0};
size_t size = 1024 * 1024;

axclrtSetDevice(0);
axclrtMalloc(&devMem, size, AXCL_MEM_MALLOC_HUGE_FIRST);

/* Export the Device physical and virtual addresses of devMem. An access_size of 0 exports up to the end of the allocation. */
axclrtMemGetDevAddr(devMem, 0, &desc);

/* Pass the Device addresses to the native SDK API. devMem must remain valid while the API is running. */
AX_XXX_YYYY(..., desc.device_pa, desc.device_va, ...);

axclrtFree(devMem);
axclrtResetDevice(0);
```

Using memory output by a native SDK API in AXCL:

```c
void *hostMem = NULL;
void *devMem = NULL;
axclrtDevMemDesc desc = {0};
uint64_t phyAddr = 0;
uint64_t virAddr = 0;
size_t size = 1024 * 1024;

axclrtSetDevice(0);
axclrtMallocHost(&hostMem, size);

/* The native SDK API outputs a block of memory and returns its Device physical address phyAddr and virtual address virAddr. virAddr can be 0. */
AX_XXX_YYYY(..., &phyAddr, &virAddr, ...);

desc.device_id = 0;
desc.device_pa = phyAddr;
desc.device_va = virAddr;
desc.size = size;

/* Register the memory as a devPtr handle, which can then be passed to AXCL runtime APIs. */
axclrtMemMapDevAddr(&desc, &devMem);
axclrtMemcpy(hostMem, devMem, size, AXCL_MEMCPY_DEVICE_TO_HOST);

/* Unregister the handle first, then release the memory through the native SDK API. */
axclrtMemUnmapDevAddr(devMem);
AX_XXX_YYYY_Release(...);

axclrtFreeHost(hostMem);
axclrtResetDevice(0);
```

<a id="memory-ipc-shared-memory"></a>

### 2.7. Cross-Process Shared Memory

The following examples show a Producer process allocating memory, and a Consumer process importing and reading it. The way the two processes exchange the TGID and the IPC Key is chosen by the application, and is represented by `send_to_xxx` / `receive_from_xxx` in the examples. Error-code checks are omitted.

Producer process:

```c
void *devMem = NULL;
char key[AXCL_IPC_KEY_MAX_LEN];
int32_t consumerTgid = 0;
size_t size = 1024 * 1024;

axclrtSetDevice(0);
axclrtMalloc(&devMem, size, AXCL_MEM_MALLOC_HUGE_FIRST);

/* Export devMem and obtain the IPC Key. */
axclrtIpcMemGetExportKey(devMem, key, sizeof(key), AXCL_IPC_EXPORT_FLAG_DEFAULT);

/* Get the Host TGID of the Consumer and set it as a process allowed to import the IPC Key. */
receive_from_consumer(&consumerTgid);
axclrtIpcMemSetImportPid(key, &consumerTgid, 1);

/* Send the IPC Key to the Consumer and wait until all Consumers finish using the memory. */
send_to_consumer(key);
wait_for_consumer_done();

axclrtIpcMemClose(key);
axclrtFree(devMem);
axclrtResetDevice(0);
```

Consumer process:

```c
void *hostMem = NULL;
void *devMem = NULL;
char key[AXCL_IPC_KEY_MAX_LEN];
int32_t bareTgid = 0;
size_t size = 1024 * 1024;

axclrtSetDevice(0);
axclrtMallocHost(&hostMem, size);

/* Get the Host TGID of this process and notify the Producer. In containerized environments, this API must be used instead of getpid. */
axclrtDeviceGetBareTgid(&bareTgid);
send_to_producer(bareTgid);

/* After receiving the IPC Key, import it to obtain a devPtr handle valid in this process. */
receive_from_producer(key);
axclrtIpcMemImportByKey(&devMem, key);

axclrtMemcpy(hostMem, devMem, size, AXCL_MEMCPY_DEVICE_TO_HOST);

/* Close the IPC Key first, then release the mapping in this process, and finally notify the Producer. */
axclrtIpcMemClose(key);
axclrtFree(devMem);
notify_producer_done();

axclrtFreeHost(hostMem);
axclrtResetDevice(0);
```

## 3. Other Memory Operations

AXCL also provides APIs for setting and comparing Device memory:

| Operation | Synchronous API | Asynchronous API | Description |
|---|---|---|---|
| Set Device memory | [axclrtMemset](../c/memory_api.md#axclrtMemset) | [axclrtMemsetAsync](../c/memory_api.md#axclrtMemsetAsync) | Sets each byte of a Device memory range to a value. Both APIs support Device memory only. |
| Compare Device memory | [axclrtMemcmp](../c/memory_api.md#axclrtMemcmp) | [axclrtMemcmpAsync](../c/memory_api.md#axclrtMemcmpAsync) | Compares two Device memory ranges on the same Device. The synchronous API returns `AXCL_SUCC` only when the contents are identical; a failure can mean either different contents or an execution error. The asynchronous API does not report whether the ranges are equal. |

## 4. Important APIs

| API | Function | Memory object |
|---|---|---|
| [axclrtMalloc](../c/memory_api.md#axclrtMalloc) | Allocates Device memory. | Device memory |
| [axclrtMallocCached](../c/memory_api.md#axclrtMallocCached) | Allocates Device memory with the cached attribute. | Device memory |
| [axclrtFree](../c/memory_api.md#axclrtFree) | Frees memory allocated by `axclrtMalloc` / `axclrtMallocCached`, or releases a handle imported by `axclrtIpcMemImportByKey`. | Device memory |
| [axclrtMallocHost](../c/memory_api.md#axclrtMallocHost) | Allocates Host virtual memory prepared for AXCL data transfer. | Host memory |
| [axclrtFreeHost](../c/memory_api.md#axclrtFreeHost) | Frees memory allocated by `axclrtMallocHost`. | Host memory |
| [axclrtMemGetAddressRange](../c/memory_api.md#axclrtMemGetAddressRange) | Queries the base handle and total size of the allocation or registration that `devPtr` belongs to. | Device memory |
| [axclrtMemGetDevAddr](../c/memory_api.md#axclrtMemGetDevAddr) | Exports the Device physical and virtual addresses from `devPtr`. | Device memory |
| [axclrtMemMapDevAddr](../c/memory_api.md#axclrtMemMapDevAddr) | Registers external Device memory as a `devPtr` handle. | Device memory |
| [axclrtMemUnmapDevAddr](../c/memory_api.md#axclrtMemUnmapDevAddr) | Unregisters a handle registered by `axclrtMemMapDevAddr`. | Device memory |
| [axclrtIpcMemGetExportKey](../c/memory_api.md#axclrtIpcMemGetExportKey) | Exports Device memory and obtains an IPC Key. | Device memory |
| [axclrtIpcMemSetImportPid](../c/memory_api.md#axclrtIpcMemSetImportPid) | Sets the whitelist of processes allowed to import an IPC Key. | Device memory |
| [axclrtIpcMemImportByKey](../c/memory_api.md#axclrtIpcMemImportByKey) | Imports shared Device memory by an IPC Key. | Device memory |
| [axclrtIpcMemClose](../c/memory_api.md#axclrtIpcMemClose) | Closes an IPC Key and releases the IPC reference. | Device memory |
| [axclrtMemcpy](../c/memory_api.md#axclrtMemcpy) | Copies Host / Device data synchronously. | Host memory, Device memory |
| [axclrtMemcpyAsync](../c/memory_api.md#axclrtMemcpyAsync) | Submits an asynchronous copy request to a Stream. | Host memory, Device memory |
| [axclrtMemcpy2d](../c/memory_api.md#axclrtMemcpy2d) | Synchronously copies a 2D rectangle between Host and Device. | Host memory, Device memory |
| [axclrtMemcpy2dAsync](../c/memory_api.md#axclrtMemcpy2dAsync) | Submits an asynchronous 2D rectangle copy request to a Stream. | Host memory, Device memory |
| [axclrtMemset](../c/memory_api.md#axclrtMemset) | Sets Device memory synchronously. | Device memory |
| [axclrtMemsetAsync](../c/memory_api.md#axclrtMemsetAsync) | Submits an asynchronous Device memory set request to a Stream. | Device memory |
| [axclrtMemcmp](../c/memory_api.md#axclrtMemcmp) | Compares two Device memory ranges synchronously. | Device memory |
| [axclrtMemcmpAsync](../c/memory_api.md#axclrtMemcmpAsync) | Submits an asynchronous Device memory comparison request to a Stream. | Device memory |
| [axclrtGetMemInfo](../c/memory_api.md#axclrtGetMemInfo) | Queries a snapshot of the memory capacity of the current Device. | Device memory |
| [axclrtPointerGetAttributes](../c/memory_api.md#axclrtPointerGetAttributes) | Queries the location and flags of memory tracked by AXCL runtime. | Host memory, Device memory |
