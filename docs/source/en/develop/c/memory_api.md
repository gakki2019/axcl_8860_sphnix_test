# Memory

## Index

- [axclrtFree](#axclrtFree)
- [axclrtFreeHost](#axclrtFreeHost)
- [axclrtGetMemInfo](#axclrtGetMemInfo)
- [axclrtMalloc](#axclrtMalloc)
- [axclrtMallocCached](#axclrtMallocCached)
- [axclrtMallocHost](#axclrtMallocHost)
- [axclrtMemFlush](#axclrtMemFlush)
- [axclrtMemInvalidate](#axclrtMemInvalidate)
- [axclrtMemcmp](#axclrtMemcmp)
- [axclrtMemcmpAsync](#axclrtMemcmpAsync)
- [axclrtMemcpy](#axclrtMemcpy)
- [axclrtMemcpyAsync](#axclrtMemcpyAsync)
- [axclrtMemset](#axclrtMemset)
- [axclrtMemsetAsync](#axclrtMemsetAsync)
- [axclrtPointerGetAttributes](#axclrtPointerGetAttributes)

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
| devPtr | in | Base Device memory address returned by a memory allocation function. |

#### Returns

- `AXCL_SUCC`: Device memory was freed successfully.
- `others`: Failure.

#### Note

- This function can free only Device memory allocated by [axclrtMalloc](#axclrtMalloc) or [axclrtMallocCached](#axclrtMallocCached).
- The calling thread must set a Context for the device that owns the memory as its current Context.
- After this function succeeds, `devPtr` is invalid and must not be used again.

#### Remark

[axclrtMalloc](#axclrtMalloc) | [axclrtMallocCached](#axclrtMallocCached)

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
- `others`: Failure.

#### Note

- This function can free only Host virtual memory allocated by [axclrtMallocHost](#axclrtMallocHost).
- The calling thread must set a Context associated with the device communication channel used to allocate the memory as its current Context.
- After this function succeeds, `hostPtr` is invalid and must not be used again.

#### Remark

[axclrtMallocHost](#axclrtMallocHost)

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
| devPtr | out | Receives the base address of the Device physical memory on success. |
| size | in | Number of bytes to allocate. The supported range is 1 through UINT32_MAX. |
| policy | in | Device memory allocation policy. |

#### Returns

- `AXCL_SUCC`: Device memory was allocated successfully.
- `others`: Failure.

#### Note

- This function does not initialize the allocated memory. Use [axclrtMemset](#axclrtMemset) when initialization is required.
- `devPtr` is a Device address used as an opaque handle by AXCL APIs. It is not a Host pointer and must not be dereferenced by the Host application.
- Free the allocation with [axclrtFree](#axclrtFree) while a Context for the same device is current.
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

[axclrtFree](#axclrtFree)

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
| devPtr | out | Receives the Device address handle on success. |
| size | in | Number of bytes to allocate. The supported range is 1 through UINT32_MAX. |
| policy | in | Device memory allocation policy. |

#### Returns

- `AXCL_SUCC`: Device memory was allocated successfully.
- `others`: Failure.

#### Note

- The returned allocation is recorded with [AXCL_POINTER_ATTRIBUTE_FLAG_CACHED](reference/enum.md#AXCL_POINTER_ATTRIBUTE_FLAG_CACHED) and can be queried with [axclrtPointerGetAttributes](#axclrtPointerGetAttributes).
- `devPtr` is the base address of Device memory used by AXCL APIs. It must not be dereferenced by the Host.
- Use [axclrtMemFlush](#axclrtMemFlush) and [axclrtMemInvalidate](#axclrtMemInvalidate) to maintain cache coherency when required.
- Free the allocation with [axclrtFree](#axclrtFree) while a Context for the same device is current.

#### Remark

[axclrtFree](#axclrtFree) | [axclrtMemFlush](#axclrtMemFlush) | [axclrtMemInvalidate](#axclrtMemInvalidate)

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
- `others`: Failure.

#### Note

- For copy directions that use Host virtual addresses, the AXCL memory copy APIs also support memory allocated by the C library `malloc`. Using this function to allocate Host memory is recommended.
- Memory allocated by this function must be freed with [axclrtFreeHost](#axclrtFreeHost), not the C library `free`. Memory allocated by the C library `malloc` must be freed with the C library `free`.

#### Remark

[axclrtFreeHost](#axclrtFreeHost)

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
| devPtr | in | Device memory address at which the range begins. |
| size | in | Number of bytes to flush. The supported range is 1 through UINT32_MAX. |

#### Returns

- `AXCL_SUCC`: The cache range was flushed successfully.
- `others`: Failure.

#### Note

- This function is intended for memory returned by [axclrtMallocCached](#axclrtMallocCached).
- The calling thread must set a Context for the device that owns the memory as its current Context.

#### Remark

[axclrtMallocCached](#axclrtMallocCached) | [axclrtMemInvalidate](#axclrtMemInvalidate)

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
| devPtr | in | Device physical memory address at which the range to invalidate begins. |
| size | in | Number of bytes to process. The supported range is 1 through UINT32_MAX. |

#### Returns

- `AXCL_SUCC`: The cache range was invalidated successfully.
- `others`: Failure.

#### Note

- This function is intended for memory returned by [axclrtMallocCached](#axclrtMallocCached).
- The calling thread must set a Context for the device that owns the memory as its current Context.

#### Remark

[axclrtMallocCached](#axclrtMallocCached) | [axclrtMemFlush](#axclrtMemFlush)

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

[axclrtMemcmpAsync](#axclrtMemcmpAsync)

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

[axclrtMemcmp](#axclrtMemcmp) | [axclrtSynchronizeStream](stream_api.md#axclrtSynchronizeStream)

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
- For [AXCL_MEMCPY_HOST_PHY_TO_DEVICE](reference/enum.md#AXCL_MEMCPY_HOST_PHY_TO_DEVICE) and [AXCL_MEMCPY_DEVICE_TO_HOST_PHY](reference/enum.md#AXCL_MEMCPY_DEVICE_TO_HOST_PHY), pass the Host physical address value through the corresponding pointer parameter.
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

[axclrtMemcpyAsync](#axclrtMemcpyAsync) | [axclrtMalloc](#axclrtMalloc) | [axclrtMallocHost](#axclrtMallocHost)

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
- This function supports Host-to-Host, Host-to-Device, Device-to-Host, Host-physical-to-Device, and Device-to-Host-physical copies. Use synchronous [axclrtMemcpy](#axclrtMemcpy) for Device-to-Device copies.
- For [AXCL_MEMCPY_HOST_PHY_TO_DEVICE](reference/enum.md#AXCL_MEMCPY_HOST_PHY_TO_DEVICE) and [AXCL_MEMCPY_DEVICE_TO_HOST_PHY](reference/enum.md#AXCL_MEMCPY_DEVICE_TO_HOST_PHY), pass the Host physical address value through the corresponding pointer parameter.
- Any Device memory must belong to the device associated with `stream`. All source and destination ranges must remain valid until the copy completes.

#### Example

For a complete H2D asynchronous copy, asynchronous inference, D2H asynchronous copy, and Stream synchronization flow, see [Asynchronous Copy](../arch/memory.md#memory-asynchronous-copy).

#### Remark

[axclrtMemcpy](#axclrtMemcpy) | [axclrtSynchronizeStream](stream_api.md#axclrtSynchronizeStream)

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

[axclrtMemsetAsync](#axclrtMemsetAsync)

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

[axclrtMemset](#axclrtMemset) | [axclrtSynchronizeStream](stream_api.md#axclrtSynchronizeStream)

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
