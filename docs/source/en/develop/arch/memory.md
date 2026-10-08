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

AXCL provides [axclrtMalloc](../c/memory_api.md#axclrtMalloc) and [axclrtMallocCached](../c/memory_api.md#axclrtMallocCached) to allocate memory on the Device side, and returns it to the Host as `devPtr`. The Host side passes `devPtr` as a Device memory handle to AXCL runtime APIs. The value of `devPtr` is not a Device physical address and must not be passed directly to native SDK APIs.

| Operation | API | Description |
|---|---|---|
| Allocate Device memory | [axclrtMalloc](../c/memory_api.md#axclrtMalloc) | Allocates physically contiguous Device memory. |
| Allocate cached Device memory | [axclrtMallocCached](../c/memory_api.md#axclrtMallocCached) | Allocates Device memory with the cached attribute. The cached attribute can be queried through `axclrtPointerGetAttributes`. |
| Free Device memory | [axclrtFree](../c/memory_api.md#axclrtFree) | Frees memory allocated by `axclrtMalloc` / `axclrtMallocCached`. |

```{important}
- `devPtr` is not a valid accessible address in the Host process and must not be directly dereferenced on the Host side.
- [axclrtFree](../c/memory_api.md#axclrtFree) must be given the base address returned by [axclrtMalloc](../c/memory_api.md#axclrtMalloc) / [axclrtMallocCached](../c/memory_api.md#axclrtMallocCached). An offset pointer is not accepted.
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
3. Memory allocated by [axclrtMallocHost](../c/memory_api.md#axclrtMallocHost) belongs to the process-level DMA session. No current Context is required for allocation or release, but at least one opened and usable device must exist in the process. The memory can be used with any opened device in the process, and remains valid until it is freed or the last opened device in the process is reset.
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
| Export | [axclrtIpcMemGetExportKey](../c/memory_api.md#axclrtIpcMemGetExportKey) | The Producer exports the base address of Device memory allocated by the process and obtains an IPC Key. |
| Set import whitelist | [axclrtIpcMemSetImportPid](../c/memory_api.md#axclrtIpcMemSetImportPid) | The Producer sets the processes (Host TGIDs) allowed to import the IPC Key. |
| Query Host TGID | [axclrtDeviceGetBareTgid](../c/device_api.md#axclrtDeviceGetBareTgid) | A Consumer queries its own TGID in the initial PID namespace, for the Producer to set the whitelist. |
| Import | [axclrtIpcMemImportByKey](../c/memory_api.md#axclrtIpcMemImportByKey) | A Consumer imports by the IPC Key and obtains a `devPtr` handle in its own process. |
| Close | [axclrtIpcMemClose](../c/memory_api.md#axclrtIpcMemClose) | The Producer and each Consumer release their own IPC references. |

```{important}
- The lifetime of the shared memory is determined by the Producer. The Producer must ensure that the memory is not freed before all Consumers finish using it; otherwise the result of hardware access by the Consumers is undefined. Closing the IPC Key or freeing its own handle in a Consumer does not extend the lifetime of the Producer's memory.
- For the same IPC Key, all Consumers should call [axclrtIpcMemClose](../c/memory_api.md#axclrtIpcMemClose) before the Producer does.
- Calling [axclrtFree](../c/memory_api.md#axclrtFree) in a Consumer only releases the mapping in that process and does not release the Device physical memory.
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
| [AXCL_MEMCPY_HOST_TO_DEVICE](../c/reference/enum.md#AXCL_MEMCPY_HOST_TO_DEVICE) | Host virtual memory to Device physical memory. |
| [AXCL_MEMCPY_DEVICE_TO_HOST](../c/reference/enum.md#AXCL_MEMCPY_DEVICE_TO_HOST) | Device physical memory to Host virtual memory. |
| [AXCL_MEMCPY_DEVICE_TO_DEVICE](../c/reference/enum.md#AXCL_MEMCPY_DEVICE_TO_DEVICE) | Device physical memory to Device physical memory. |

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

<a id="memory-external-device-memory"></a>

### 2.5. External Device Memory Interoperability

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

### 2.6. Cross-Process Shared Memory

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
| [axclrtMemset](../c/memory_api.md#axclrtMemset) | Sets Device memory synchronously. | Device memory |
| [axclrtMemsetAsync](../c/memory_api.md#axclrtMemsetAsync) | Submits an asynchronous Device memory set request to a Stream. | Device memory |
| [axclrtMemcmp](../c/memory_api.md#axclrtMemcmp) | Compares two Device memory ranges synchronously. | Device memory |
| [axclrtMemcmpAsync](../c/memory_api.md#axclrtMemcmpAsync) | Submits an asynchronous Device memory comparison request to a Stream. | Device memory |
| [axclrtGetMemInfo](../c/memory_api.md#axclrtGetMemInfo) | Queries Device-side memory capacity information. | Device memory |
| [axclrtPointerGetAttributes](../c/memory_api.md#axclrtPointerGetAttributes) | Queries pointer location and flags. | Host memory, Device memory |
