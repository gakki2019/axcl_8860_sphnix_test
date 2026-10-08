# Memory

## Index

- [axclrtFree](#axclrtFree): Free Device memory.
- [axclrtFreeHost](#axclrtFreeHost): Free Host virtual memory allocated by [axclrtMallocHost](#axclrtMallocHost).
- [axclrtGetMemInfo](#axclrtGetMemInfo): Get a snapshot of memory capacity on the device associated with the calling thread's current Context.
- [axclrtIpcMemClose](#axclrtIpcMemClose): Close an inter-process shared memory key.
- [axclrtIpcMemGetExportKey](#axclrtIpcMemGetExportKey): Export device memory for cross-process sharing and obtain an IPC key.
- [axclrtIpcMemImportByKey](#axclrtIpcMemImportByKey): Import shared device memory using an IPC key.
- [axclrtIpcMemSetImportPid](#axclrtIpcMemSetImportPid): Set the target Host TGID whitelist for an exported IPC key.
- [axclrtMalloc](#axclrtMalloc): Allocate physically contiguous memory on the device associated with the calling thread's current Context.
- [axclrtMallocCached](#axclrtMallocCached): Allocate cached, physically contiguous memory on the device associated with the current Context.
- [axclrtMallocHost](#axclrtMallocHost): Allocate Host virtual memory.
- [axclrtMemFlush](#axclrtMemFlush): Write cached data for a Device memory range back to DDR.
- [axclrtMemGetAddressRange](#axclrtMemGetAddressRange): Get the base handle and size of an allocation or external registration managed by AXCL runtime.
- [axclrtMemGetDevAddr](#axclrtMemGetDevAddr): Export underlying device physical and virtual addresses from a device memory handle.
- [axclrtMemInvalidate](#axclrtMemInvalidate): Invalidate cached data for a Device memory range.
- [axclrtMemMapDevAddr](#axclrtMemMapDevAddr): Register external device memory (e.g. from Native modules) as a temporary mapped device pointer.
- [axclrtMemUnmapDevAddr](#axclrtMemUnmapDevAddr): Unregister an external device memory registered via [axclrtMemMapDevAddr](#axclrtMemMapDevAddr).
- [axclrtMemcmp](#axclrtMemcmp): Synchronously determine whether two Device memory ranges contain identical bytes.
- [axclrtMemcmpAsync](#axclrtMemcmpAsync): Asynchronously submit a comparison of two Device memory ranges to a specified Stream.
- [axclrtMemcpy](#axclrtMemcpy): Synchronously copy bytes between Host or Device memory.
- [axclrtMemcpyAsync](#axclrtMemcpyAsync): Asynchronously submit a Host or Device memory copy to a specified Stream.
- [axclrtMemset](#axclrtMemset): Synchronously set bytes in Device memory to a value.
- [axclrtMemsetAsync](#axclrtMemsetAsync): Asynchronously submit a Device memory set operation to a specified Stream.
- [axclrtPointerGetAttributes](#axclrtPointerGetAttributes): Get memory allocation attributes.

<br>

## API

<a id="axclrtFree"></a>

### axclrtFree

Free Device memory.

#### Function

```c
AXCL_EXPORT axclError axclrtFree(void *devPtr);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| devPtr | in | Base Device memory address returned by [axclrtMalloc](#axclrtMalloc), [axclrtMallocCached](#axclrtMallocCached), or imported via [axclrtIpcMemImportByKey](#axclrtIpcMemImportByKey). |

#### Returns

- `AXCL_SUCC`: Device memory was freed successfully.
- `others`: Failure.

#### Note

- This function can free Device memory allocated by [axclrtMalloc](#axclrtMalloc) or [axclrtMallocCached](#axclrtMallocCached), as well as local virtual address mappings imported via [axclrtIpcMemImportByKey](#axclrtIpcMemImportByKey). Must pass the base allocation handle; interior pointers are rejected.
- For imported memory ([axclrtIpcMemImportByKey](#axclrtIpcMemImportByKey)), this function releases the local virtual address mapping without deallocating the underlying device physical memory allocated by the producer process.
- For locally allocated device memory, the calling thread must set a Context for the device that owns the memory as its current Context. For imported memory, no active Context is required.
- After this function succeeds, `devPtr` is invalid and must not be used again.

#### Remark

- [axclrtMalloc](#axclrtMalloc)
- [axclrtMallocCached](#axclrtMallocCached)
- [axclrtIpcMemImportByKey](#axclrtIpcMemImportByKey)

<br>

<a id="axclrtFreeHost"></a>

### axclrtFreeHost

Free Host virtual memory allocated by [axclrtMallocHost](#axclrtMallocHost).

#### Function

```c
AXCL_EXPORT axclError axclrtFreeHost(void *hostPtr);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| hostPtr | in | Base Host virtual address returned by [axclrtMallocHost](#axclrtMallocHost). |

#### Returns

- `AXCL_SUCC`: Host memory was freed successfully.
- `AXCL_ERR_RT_NULL_POINTER`: `hostPtr` is NULL.
- `AXCL_ERR_RT_CONTEXT_NOT_EXIST`: No usable device channel is available; the allocation record is preserved.
- `AXCL_ERR_RT_ILLEGAL_PARAM`: `hostPtr` is not a base address returned by [axclrtMallocHost](#axclrtMallocHost), is a Device address, or has already been freed.
- `others`: Failure.

#### Note

- This function can free only Host virtual memory allocated by [axclrtMallocHost](#axclrtMallocHost).
- No current Context is required. The memory need not be freed under the device used to allocate it.
- A usable active device channel is required. For a non-NULL pointer, this is checked before allocation validity.
- The application must complete all asynchronous operations using `hostPtr` before calling this function.
- Serialize this call with operations that close a device and with [axclFinalize](system_api.md#axclFinalize).
- After this function succeeds, `hostPtr` is invalid and must not be used again.

#### Remark

- [axclrtMallocHost](#axclrtMallocHost)

<br>

<a id="axclrtGetMemInfo"></a>

### axclrtGetMemInfo

Get a snapshot of memory capacity on the device associated with the calling thread's current Context.

#### Function

```c
AXCL_EXPORT axclError axclrtGetMemInfo(axclrtMemAttr attr, size_t *free, size_t *total);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| attr | in | Memory pool to query. |
| free | out | Optional pointer that receives the number of free bytes. |
| total | out | Optional pointer that receives the total number of bytes. |

#### Returns

- `AXCL_SUCC`: The requested memory information was returned successfully.
- `others`: Failure.

#### Note

- At least one of `free` and `total` must be non-NULL.
- [AXCL_DDR_CMM](reference/enum.md#AXCL_DDR_CMM) returns the sum of the free bytes and the sum of the total bytes across all CMM pools on the device.
- [AXCL_DDR_SYS](reference/enum.md#AXCL_DDR_SYS) returns the device system memory's MemFree and MemTotal values in bytes.

<br>

<a id="axclrtIpcMemClose"></a>

### axclrtIpcMemClose

Close an inter-process shared memory key.

#### Function

```c
AXCL_EXPORT axclError axclrtIpcMemClose(const char *key);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| key | in | Null-terminated IPC key string. |

#### Returns

- `AXCL_SUCC`: Success.
- `AXCL_ERR_RT_NULL_POINTER`: `key` is NULL.
- `AXCL_ERR_RT_ILLEGAL_PARAM`: `key` is invalid or not recognized.
- `others`: Failure.

#### Note

- Both the producer process (which called [axclrtIpcMemGetExportKey](#axclrtIpcMemGetExportKey)) and consumer processes (which called [axclrtIpcMemImportByKey](#axclrtIpcMemImportByKey)) must invoke this function to release their IPC references.
- For a given key, all consumer processes should invoke [axclrtIpcMemClose](#axclrtIpcMemClose) before the producer process invokes [axclrtIpcMemClose](#axclrtIpcMemClose).
- This function releases the IPC reference in the driver, but does not release the local virtual address mapping. Use [axclrtFree](#axclrtFree) to release the memory pointer.

#### Remark

- [axclrtIpcMemGetExportKey](#axclrtIpcMemGetExportKey)
- [axclrtIpcMemImportByKey](#axclrtIpcMemImportByKey)
- [axclrtFree](#axclrtFree)

<br>

<a id="axclrtIpcMemGetExportKey"></a>

### axclrtIpcMemGetExportKey

Export device memory for cross-process sharing and obtain an IPC key.

#### Function

```c
AXCL_EXPORT axclError axclrtIpcMemGetExportKey(void *devPtr, char *key, size_t len, uint32_t flags);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| devPtr | in | Base device memory address to export. |
| key | out | Buffer to receive the null-terminated IPC key string. |
| len | in | Length of `key` in bytes, must be exactly [AXCL_IPC_KEY_MAX_LEN](reference/macro.md#AXCL_IPC_KEY_MAX_LEN). |
| flags | in | Export flags ([AXCL_IPC_EXPORT_FLAG_DEFAULT](reference/macro.md#AXCL_IPC_EXPORT_FLAG_DEFAULT) or [AXCL_IPC_EXPORT_FLAG_DISABLE_PID_VALIDATION](reference/macro.md#AXCL_IPC_EXPORT_FLAG_DISABLE_PID_VALIDATION)). |

#### Returns

- `AXCL_SUCC`: Success.
- `AXCL_ERR_RT_NULL_POINTER`: `devPtr` or `key` is NULL.
- `AXCL_ERR_RT_ILLEGAL_PARAM`: `len` != [AXCL_IPC_KEY_MAX_LEN](reference/macro.md#AXCL_IPC_KEY_MAX_LEN), `flags` is invalid, or `devPtr` is not an exportable base allocation.
- `others`: Failure.

#### Note

- `devPtr` must be the base address of a physical device memory allocation created by the calling process.
- Interior offset pointers and imported memory cannot be exported.

#### Remark

- [axclrtIpcMemSetImportPid](#axclrtIpcMemSetImportPid)
- [axclrtIpcMemImportByKey](#axclrtIpcMemImportByKey)
- [axclrtIpcMemClose](#axclrtIpcMemClose)

<br>

<a id="axclrtIpcMemImportByKey"></a>

### axclrtIpcMemImportByKey

Import shared device memory using an IPC key.

#### Function

```c
AXCL_EXPORT axclError axclrtIpcMemImportByKey(void **devPtr, const char *key);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| devPtr | out | Receives the imported device memory handle in the caller's address space. |
| key | in | Null-terminated IPC key string. |

#### Returns

- `AXCL_SUCC`: Success.
- `AXCL_ERR_RT_NULL_POINTER`: `devPtr` or `key` is NULL.
- `AXCL_ERR_RT_ILLEGAL_PARAM`: `key` is invalid or not recognized.
- `others`: Failure.

#### Note

- Each calling process may import an exported key once to establish a local virtual address mapping pointing to the shared physical device memory.
- Callers must release both the IPC sharing reference via [axclrtIpcMemClose](#axclrtIpcMemClose) and the local virtual address mapping via [axclrtFree](#axclrtFree). Do not pass imported handles to [axclrtMemUnmapDevAddr](#axclrtMemUnmapDevAddr).
- Lifetime constraint: The producer process's allocation lifecycle must strictly encompass the consumer's usage duration. Closing the key or destroying consumer handles does not coordinate physical memory retention; freeing the memory prematurely in the producer results in undefined behavior (dangling hardware access).

#### Remark

- [axclrtIpcMemGetExportKey](#axclrtIpcMemGetExportKey)
- [axclrtIpcMemClose](#axclrtIpcMemClose)
- [axclrtFree](#axclrtFree)

<br>

<a id="axclrtIpcMemSetImportPid"></a>

### axclrtIpcMemSetImportPid

Set the target Host TGID whitelist for an exported IPC key.

#### Function

```c
AXCL_EXPORT axclError axclrtIpcMemSetImportPid(const char *key, const int32_t *tgid_list, uint32_t num);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| key | in | Null-terminated IPC key string. |
| tgid_list | in | Array of target process Host TGIDs (bare TGIDs). |
| num | in | Number of target Host TGIDs in `tgid_list` (1 <= num <= [AXCL_IPC_MAX_TARGETS](reference/macro.md#AXCL_IPC_MAX_TARGETS)). |

#### Returns

- `AXCL_SUCC`: Success.
- `AXCL_ERR_RT_NULL_POINTER`: `key` or `tgid_list` is NULL.
- `AXCL_ERR_RT_ILLEGAL_PARAM`: `key` is invalid, `num` is 0, or `num` exceeds [AXCL_IPC_MAX_TARGETS](reference/macro.md#AXCL_IPC_MAX_TARGETS).
- `others`: Failure.

#### Note

- In containerized environments (such as Docker or Kubernetes), `tgid_list` must contain bare Host TGIDs obtained via [axclrtDeviceGetBareTgid](device_api.md#axclrtDeviceGetBareTgid) rather than container-local PIDs returned by getpid().
- When exported with [AXCL_IPC_EXPORT_FLAG_DEFAULT](reference/macro.md#AXCL_IPC_EXPORT_FLAG_DEFAULT), `num` must be at least 1. Passing `num` == 0 is rejected with [AXCL_ERR_RT_ILLEGAL_PARAM](reference/error.md#AXCL_ERR_RT_ILLEGAL_PARAM). To allow open access without whitelist restrictions, export with [AXCL_IPC_EXPORT_FLAG_DISABLE_PID_VALIDATION](reference/macro.md#AXCL_IPC_EXPORT_FLAG_DISABLE_PID_VALIDATION) instead of configuring a whitelist.

#### Remark

- [axclrtIpcMemGetExportKey](#axclrtIpcMemGetExportKey)
- [axclrtDeviceGetBareTgid](device_api.md#axclrtDeviceGetBareTgid)
- [axclrtIpcMemImportByKey](#axclrtIpcMemImportByKey)

<br>

<a id="axclrtMalloc"></a>

### axclrtMalloc

Allocate physically contiguous memory on the device associated with the calling thread's current Context.

#### Function

```c
AXCL_EXPORT axclError axclrtMalloc(void **devPtr, size_t size, axclrtMemMallocPolicy policy);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| devPtr | out | Receives an opaque handle representing Device memory on success. |
| size | in | Number of bytes to allocate. The supported range is 1 through UINT32_MAX. |
| policy | in | Device memory allocation policy. |

#### Returns

- `AXCL_SUCC`: Device memory was allocated successfully.
- `others`: Failure.

#### Note

- This function does not initialize the allocated memory. Use [axclrtMemset](#axclrtMemset) when initialization is required.
- `devPtr` is an opaque handle used by AXCL APIs. It is not a Host pointer and must not be dereferenced by the Host application, nor treated as a physical address.
- Free the allocation with [axclrtFree](#axclrtFree) using the base handle while a Context for the same device is current.
- Frequent allocation and deallocation can reduce performance. Preallocate memory or manage allocations in the application when possible.

#### Example

```c
 void *devMem = NULL;
 void *hostMem = NULL;
 const size_t size = 1024 * 1024;
 axclrtMalloc(&devMem, size, AXCL_MEM_MALLOC_HUGE_FIRST);
 axclrtMallocHost(&hostMem, size);

 axclrtMemcpy(devMem, hostMem, size, AXCL_MEMCPY_HOST_TO_DEVICE);

 axclrtFree(devMem);
 axclrtFreeHost(hostMem);
```

#### Remark

- [axclrtFree](#axclrtFree)

<br>

<a id="axclrtMallocCached"></a>

### axclrtMallocCached

Allocate cached, physically contiguous memory on the device associated with the current Context.

#### Function

```c
AXCL_EXPORT axclError axclrtMallocCached(void **devPtr, size_t size, axclrtMemMallocPolicy policy);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| devPtr | out | Receives an opaque handle representing cached Device memory on success. |
| size | in | Number of bytes to allocate. The supported range is 1 through UINT32_MAX. |
| policy | in | Device memory allocation policy. |

#### Returns

- `AXCL_SUCC`: Device memory was allocated successfully.
- `others`: Failure.

#### Note

- The returned allocation is recorded with [AXCL_POINTER_ATTRIBUTE_FLAG_CACHED](reference/enum.md#AXCL_POINTER_ATTRIBUTE_FLAG_CACHED) and can be queried with [axclrtPointerGetAttributes](#axclrtPointerGetAttributes).
- `devPtr` is an opaque handle used by AXCL APIs. It must not be dereferenced by the Host, nor treated as a physical address.
- Use [axclrtMemFlush](#axclrtMemFlush) and [axclrtMemInvalidate](#axclrtMemInvalidate) to maintain cache coherency when required.
- Free the allocation with [axclrtFree](#axclrtFree) using the base handle while a Context for the same device is current.

#### Remark

- [axclrtFree](#axclrtFree)
- [axclrtMemFlush](#axclrtMemFlush)
- [axclrtMemInvalidate](#axclrtMemInvalidate)

<br>

<a id="axclrtMallocHost"></a>

### axclrtMallocHost

Allocate Host virtual memory.

#### Function

```c
AXCL_EXPORT axclError axclrtMallocHost(void **hostPtr, size_t size);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| hostPtr | out | Receives a Host-accessible virtual address on success. |
| size | in | Number of bytes to allocate. Must be greater than 0. |

#### Returns

- `AXCL_SUCC`: Host memory was allocated successfully.
- `AXCL_ERR_RT_NULL_POINTER`: `hostPtr` is NULL or `size` is 0.
- `AXCL_ERR_RT_CONTEXT_NOT_EXIST`: No usable device channel is available.
- `AXCL_ERR_RT_NO_MEMORY`: The Host DMA memory or its allocation record could not be allocated.
- `others`: Failure.

#### Note

- For copy directions that use Host virtual addresses, the AXCL memory copy APIs also support memory allocated by the C library `malloc`. Using this function to allocate Host memory is recommended.
- Memory allocated by this function must be freed with [axclrtFreeHost](#axclrtFreeHost), not the C library `free`. Memory allocated by the C library `malloc` must be freed with the C library `free`.
- The allocation belongs to the process DMA session and is usable with any device opened in the process. It stays valid until it is freed or the last opened device in the process is reset.
- No current Context is required, but at least one usable active device must provide the DMA session.
- Serialize this call with operations that close a device and with [axclFinalize](system_api.md#axclFinalize).

#### Remark

- [axclrtFreeHost](#axclrtFreeHost)

<br>

<a id="axclrtMemFlush"></a>

### axclrtMemFlush

Write cached data for a Device memory range back to DDR.

#### Function

```c
AXCL_EXPORT axclError axclrtMemFlush(void *devPtr, size_t size);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| devPtr | in | Device memory handle at which the range begins. |
| size | in | Number of bytes to flush. The supported range is 1 through UINT32_MAX. |

#### Returns

- `AXCL_SUCC`: The cache range was flushed successfully.
- `others`: Failure.

#### Note

- This function is intended for memory returned by [axclrtMallocCached](#axclrtMallocCached).
- The calling thread must set a Context for the device that owns the memory as its current Context.

#### Remark

- [axclrtMallocCached](#axclrtMallocCached)
- [axclrtMemInvalidate](#axclrtMemInvalidate)

<br>

<a id="axclrtMemGetAddressRange"></a>

### axclrtMemGetAddressRange

Get the base handle and size of an allocation or external registration managed by AXCL runtime.

#### Function

```c
AXCL_EXPORT axclError axclrtMemGetAddressRange(void *ptr, void **base, size_t *size);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| ptr | in | Pointer to the beginning or an interior byte of an allocation or registration. |
| base | out | Receives its base handle. |
| size | out | Receives its total allocated or registered size in bytes. |

#### Returns

- `AXCL_SUCC`: The base address and size were returned successfully.
- `AXCL_ERR_RT_NULL_POINTER`: `base` or `size` is NULL.
- `AXCL_ERR_RT_ILLEGAL_PARAM`: `ptr` is invalid, out of bounds, or not managed by runtime.
- `others`: Failure.

#### Note

- Accepts both base address and interior slice pointers, returning the same base handle and total size.
- For external memory registered by axclrtMemMapDevAddr, returns that registration's base handle and size, even if it describes only a subrange of a Native allocation. Does not recover the original Native allocation base.

<br>

<a id="axclrtMemGetDevAddr"></a>

### axclrtMemGetDevAddr

Export underlying device physical and virtual addresses from a device memory handle.

#### Function

```c
AXCL_EXPORT axclError axclrtMemGetDevAddr(const void *devPtr, uint64_t access_size, axclrtDevMemDesc *desc);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| devPtr | in | Valid device memory pointer (base pointer or interior slice). |
| access_size | in | Expected byte span to access. If 0, remaining slice length is exported. |
| desc | out | Receives physical/virtual address descriptor. |

#### Returns

- `AXCL_SUCC`: Success.
- `AXCL_ERR_RT_NULL_POINTER`: `devPtr` or `desc` is NULL.
- `AXCL_ERR_RT_ILLEGAL_PARAM`: Address is out of bounds or not a valid device pointer.
- `others`: Failure.

#### Note

- An interior pointer advances both the Device PA and a nonzero Device VA by its offset within the registration. A missing Device VA remains 0. Returned addresses already include this offset; do not apply it again.
- Preserve the returned Device VA when a Native API requires it. The caller must ensure that the Native API executes in the device address space where that VA is valid and that the underlying memory remains alive.

<br>

<a id="axclrtMemInvalidate"></a>

### axclrtMemInvalidate

Invalidate cached data for a Device memory range.

#### Function

```c
AXCL_EXPORT axclError axclrtMemInvalidate(void *devPtr, size_t size);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| devPtr | in | Device memory handle at which the range to invalidate begins. |
| size | in | Number of bytes to process. The supported range is 1 through UINT32_MAX. |

#### Returns

- `AXCL_SUCC`: The cache range was invalidated successfully.
- `others`: Failure.

#### Note

- This function is intended for memory returned by [axclrtMallocCached](#axclrtMallocCached).
- The calling thread must set a Context for the device that owns the memory as its current Context.

#### Remark

- [axclrtMallocCached](#axclrtMallocCached)
- [axclrtMemFlush](#axclrtMemFlush)

<br>

<a id="axclrtMemMapDevAddr"></a>

### axclrtMemMapDevAddr

Register external device memory (e.g. from Native modules) as a temporary mapped device pointer.

#### Function

```c
AXCL_EXPORT axclError axclrtMemMapDevAddr(const axclrtDevMemDesc *desc, void **devPtr);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| desc | in | Descriptor describing the interval's Device PA, optional Native Device VA, size, and device ID. |
| devPtr | out | Receives the base handle of this registration, whose offset 0 corresponds to desc->device_pa. Pass this exact value to [axclrtMemUnmapDevAddr](#axclrtMemUnmapDevAddr). |

#### Returns

- `AXCL_SUCC`: Success.
- `AXCL_ERR_RT_NULL_POINTER`: `desc` or `devPtr` is NULL.
- `AXCL_ERR_RT_ILLEGAL_PARAM`: Parameters are invalid (e.g. size=0, device_pa=0, nonzero flags, or a device memory handle returned by AXCL passed as device_pa).
- `AXCL_ERR_RT_DEVICE_NOT_EXIST`: Invalid device_id.
- `others`: Failure.

#### Note

- Registers exactly the supplied interval and preserves its PA and VA. The interval may start at a Native allocation base or an interior byte. No original allocation base lookup or range expansion is performed.
- device_pa must be a Device PA, such as one returned by a Native API or [axclrtMemGetDevAddr](#axclrtMemGetDevAddr). A device memory handle returned by AXCL passed as device_pa is rejected. device_va is not checked because it is a device-side address.
- This operation creates a handle only; it neither creates a Native VA mapping nor takes ownership. A Native API's output VA must be preserved when available, and may be 0 when that API provides no VA.
- The caller must ensure that nonzero PA and VA identify the same byte on the specified device, that the entire interval is backed by valid memory, and that the VA is valid in the consuming Native execution context. Runtime range checks validate the descriptor's numeric bounds, not its Native backing or address correspondence.
- Keep the Native memory and any Native VA mapping alive until all operations using this handle have completed and this registration is removed. Retain the original Native allocation/mapping handles for Native release.
- Overlapping registrations are allowed. The caller must coordinate all users and retain the backing memory until every registration and Native user has finished; no automatic lifetime tracking is provided.

<br>

<a id="axclrtMemUnmapDevAddr"></a>

### axclrtMemUnmapDevAddr

Unregister an external device memory registered via [axclrtMemMapDevAddr](#axclrtMemMapDevAddr).

#### Function

```c
AXCL_EXPORT axclError axclrtMemUnmapDevAddr(void *devPtr);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| devPtr | in | Base device pointer returned by [axclrtMemMapDevAddr](#axclrtMemMapDevAddr). |

#### Returns

- `AXCL_SUCC`: Success.
- `AXCL_ERR_RT_NULL_POINTER`: `devPtr` is NULL.
- `AXCL_ERR_RT_ILLEGAL_PARAM`: `devPtr` is invalid, not an external mapped device pointer, or not base address.
- `AXCL_ERR_RT_BUSY`: `devPtr` is being released by another thread.
- `others`: Failure.

#### Note

- Pass the exact base handle returned by axclrtMemMapDevAddr, including for a registered subrange.
- Removes only this registration. Does not free Native memory, unmap a Native VA, or remove other registrations. The caller must first complete operations using this handle, then release Native resources through their matching Native APIs with the original handles after all users of those resources have finished.
- A device reset removes all registrations on that device. Discard handles obtained before the reset and do not pass them to this function; a later registration may receive a handle with the same value.

<br>

<a id="axclrtMemcmp"></a>

### axclrtMemcmp

Synchronously determine whether two Device memory ranges contain identical bytes.

#### Function

```c
AXCL_EXPORT axclError axclrtMemcmp(const void *devPtr1, const void *devPtr2, size_t count);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| devPtr1 | in | Address of the first Device memory range. |
| devPtr2 | in | Address of the second Device memory range. |
| count | in | Number of bytes to compare. The supported range is 1 through UINT32_MAX. |

#### Returns

- `AXCL_SUCC`: The compared bytes are equal.
- `others`: The bytes are different or the comparison failed.

#### Note

- This function does not return a three-way comparison result. A non-success return cannot distinguish different contents from an execution failure.
- The calling thread must set a Context for the device that owns both ranges as its current Context.

#### Remark

- [axclrtMemcmpAsync](#axclrtMemcmpAsync)

<br>

<a id="axclrtMemcmpAsync"></a>

### axclrtMemcmpAsync

Asynchronously submit a comparison of two Device memory ranges to a specified Stream.

#### Function

```c
AXCL_EXPORT axclError axclrtMemcmpAsync(const void *devPtr1, const void *devPtr2, size_t count, axclrtStream stream);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| devPtr1 | in | Address of the first Device memory range. |
| devPtr2 | in | Address of the second Device memory range. |
| count | in | Number of bytes to compare. The supported range is 1 through UINT32_MAX. |
| stream | in | Stream that receives the comparison operation. |

#### Returns

- `AXCL_SUCC`: The comparison was submitted successfully.
- `others`: Failure.

#### Note

- This function returns after submitting the comparison to the specified Stream. A successful return does not mean that the comparison has completed.
- This asynchronous API does not return whether the two ranges are equal. Use synchronous [axclrtMemcmp](#axclrtMemcmp) when the comparison result is required.
- Both ranges must belong to the device associated with `stream` and remain valid until the operation completes.

#### Remark

- [axclrtMemcmp](#axclrtMemcmp)
- [axclrtSynchronizeStream](stream_api.md#axclrtSynchronizeStream)

<br>

<a id="axclrtMemcpy"></a>

### axclrtMemcpy

Synchronously copy bytes between Host or Device memory.

#### Function

```c
AXCL_EXPORT axclError axclrtMemcpy(void *dstPtr, const void *srcPtr, size_t count, axclrtMemcpyKind kind);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| dstPtr | in | Destination address interpreted according to `kind`. |
| srcPtr | in | Source address interpreted according to `kind`. |
| count | in | Number of bytes to copy. Must be greater than 0. |
| kind | in | Copy direction and address types. |

#### Returns

- `AXCL_SUCC`: The copy completed successfully.
- `others`: Failure.

#### Note

- This is a synchronous function and returns after the copy completes.
- This function supports all [axclrtMemcpyKind](reference/enum.md#axclrtMemcpyKind) values, including Device-to-Device copies within the same device.
- The calling thread must have a current Context. All Device memory must belong to the device associated with that Context, and the source and destination ranges must remain valid until this function returns.

#### Example

The following pseudocode omits error handling and copies data from the Host to a Device and back to the Host.

```c
 void *hostSrc = NULL;
 void *hostDst = NULL;
 void *devMem = NULL;
 const size_t size = 1024 * 1024;

 // Allocate Host and Device memory.
 axclrtMallocHost(&hostSrc, size);
 axclrtMallocHost(&hostDst, size);
 axclrtMalloc(&devMem, size, AXCL_MEM_MALLOC_HUGE_FIRST);

 // Prepare the source data on the Host.
 memset(hostSrc, 0x5A, size);

 // Host -> Device.
 axclrtMemcpy(devMem, hostSrc, size, AXCL_MEMCPY_HOST_TO_DEVICE);

 // Device -> Host.
 axclrtMemcpy(hostDst, devMem, size, AXCL_MEMCPY_DEVICE_TO_HOST);

 // hostDst can now be read and verified on the Host.

 axclrtFree(devMem);
 axclrtFreeHost(hostDst);
 axclrtFreeHost(hostSrc);
```

For a complete synchronous copy flow, see [Synchronous Copy](../arch/memory.md#memory-synchronous-copy). For an inter-device copy, see [Inter-Device Copy](../arch/memory.md#memory-inter-device-copy).

#### Remark

- [axclrtMemcpyAsync](#axclrtMemcpyAsync)
- [axclrtMalloc](#axclrtMalloc)
- [axclrtMallocHost](#axclrtMallocHost)

<br>

<a id="axclrtMemcpyAsync"></a>

### axclrtMemcpyAsync

Asynchronously submit a Host or Device memory copy to a specified Stream.

#### Function

```c
AXCL_EXPORT axclError axclrtMemcpyAsync(void *dstPtr, const void *srcPtr, size_t count, axclrtMemcpyKind kind, axclrtStream stream);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| dstPtr | in | Destination address interpreted according to `kind`. |
| srcPtr | in | Source address interpreted according to `kind`. |
| count | in | Number of bytes to copy. Must be greater than 0. |
| kind | in | Copy direction and address types. [AXCL_MEMCPY_DEVICE_TO_DEVICE](reference/enum.md#AXCL_MEMCPY_DEVICE_TO_DEVICE) is not supported. |
| stream | in | Stream that receives the copy operation. |

#### Returns

- `AXCL_SUCC`: The copy was submitted successfully.
- `others`: Failure.

#### Note

- This is an asynchronous function. A successful return means only that the copy was submitted, not that it completed. Synchronize `stream` before using the destination or releasing either memory range, for example by calling [axclrtSynchronizeStream](stream_api.md#axclrtSynchronizeStream).
- This function supports Host-to-Host, Host-to-Device, and Device-to-Host copies. Use synchronous [axclrtMemcpy](#axclrtMemcpy) for Device-to-Device copies.
- Any Device memory must belong to the device associated with `stream`. All source and destination ranges must remain valid until the copy completes.

#### Example

For a complete H2D asynchronous copy, asynchronous inference, D2H asynchronous copy, and Stream synchronization flow, see [Asynchronous Copy](../arch/memory.md#memory-asynchronous-copy).

#### Remark

- [axclrtMemcpy](#axclrtMemcpy)
- [axclrtSynchronizeStream](stream_api.md#axclrtSynchronizeStream)

<br>

<a id="axclrtMemset"></a>

### axclrtMemset

Synchronously set bytes in Device memory to a value.

#### Function

```c
AXCL_EXPORT axclError axclrtMemset(void *devPtr, uint8_t value, size_t count);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| devPtr | in | Device memory address at which to begin writing. |
| value | in | Byte value to write. |
| count | in | Number of bytes to set. The supported range is 1 through UINT32_MAX. |

#### Returns

- `AXCL_SUCC`: The Device memory was set successfully.
- `others`: Failure.

#### Note

- This function supports Device memory only and returns after the operation completes.
- The calling thread must set a Context for the device that owns the memory as its current Context.

#### Remark

- [axclrtMemsetAsync](#axclrtMemsetAsync)

<br>

<a id="axclrtMemsetAsync"></a>

### axclrtMemsetAsync

Asynchronously submit a Device memory set operation to a specified Stream.

#### Function

```c
AXCL_EXPORT axclError axclrtMemsetAsync(void *devPtr, uint8_t value, size_t count, axclrtStream stream);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| devPtr | in | Device memory address at which to begin writing. |
| value | in | Byte value to write. |
| count | in | Number of bytes to set. The supported range is 1 through UINT32_MAX. |
| stream | in | Stream that receives the operation. |

#### Returns

- `AXCL_SUCC`: The operation was submitted successfully.
- `others`: Failure.

#### Note

- This is an asynchronous function. A successful return does not mean that the memory has already been updated. Synchronize `stream` before reading or freeing the memory.
- `devPtr` must belong to the device associated with `stream` and must remain valid until the operation completes.

#### Remark

- [axclrtMemset](#axclrtMemset)
- [axclrtSynchronizeStream](stream_api.md#axclrtSynchronizeStream)

<br>

<a id="axclrtPointerGetAttributes"></a>

### axclrtPointerGetAttributes

Get memory allocation attributes.

#### Function

```c
AXCL_EXPORT axclError axclrtPointerGetAttributes(const void *ptr, axclrtPtrAttributes *attributes);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| ptr | in | Pointer to the beginning or an interior byte of an allocation. |
| attributes | out | Receives the pointer attributes. |

#### Returns

- `AXCL_SUCC`: The attributes were returned successfully.
- `others`: Failure.

#### Note

- The runtime tracks allocations created in the current process by [axclrtMalloc](#axclrtMalloc), [axclrtMallocCached](#axclrtMallocCached), and [axclrtMallocHost](#axclrtMallocHost).
- For a tracked allocation, this function returns whether the memory is located on the Host or a Device. The location ID is the virtual device ID recorded when Device memory was allocated, or -1 for Host memory. Memory allocated by [axclrtMallocCached](#axclrtMallocCached) also has the [AXCL_POINTER_ATTRIBUTE_FLAG_CACHED](reference/enum.md#AXCL_POINTER_ATTRIBUTE_FLAG_CACHED) flag.
- If `ptr` is not within a tracked allocation, this function still returns [AXCL_SUCC](reference/enum.md#AXCL_SUCC) with location type [AXCL_MEM_LOCATION_TYPE_UNREGISTERED](reference/enum.md#AXCL_MEM_LOCATION_TYPE_UNREGISTERED), location ID -1, and flags set to 0.
