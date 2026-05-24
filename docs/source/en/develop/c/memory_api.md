# Memory

## Index

- [axclrtFree](#axclrtFree)
- [axclrtFreeHost](#axclrtFreeHost)
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

<br>

## API

<a id="axclrtFree"></a>

### axclrtFree

Free device memory.

#### Function

```c
AXCL_EXPORT axclError axclrtFree(void *devPtr);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| devPtr | in | Device memory allocated by [axclrtMalloc](#axclrtMalloc). |

#### Returns

- `AXCL_SUCC`: success.
- `others`: failure.

#### Remark

[axclrtMalloc](#axclrtMalloc) | [axclrtMallocCached](#axclrtMallocCached)

<br>

<a id="axclrtFreeHost"></a>

### axclrtFreeHost

Free host virtual memory.

#### Function

```c
AXCL_EXPORT axclError axclrtFreeHost(void *hostPtr);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| hostPtr | in | Host memory. |

#### Returns

- `AXCL_SUCC`: success.
- `others`: failure.

#### Remark

[axclrtMallocHost](#axclrtMallocHost)

<br>

<a id="axclrtMalloc"></a>

### axclrtMalloc

Allocate device memory.

#### Function

```c
AXCL_EXPORT axclError axclrtMalloc(void **devPtr, size_t size, axclrtMemMallocPolicy policy);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| devPtr | out | Pointer to allocated device memory. |
| size | in | Size of memory to allocate. |
| policy | in | Memory allocation policy, [axclrtMemMallocPolicy](reference/enum.md#axclrtMemMallocPolicy). |

#### Returns

- `AXCL_SUCC`: success.
- `others`: failure.

#### Note

Memory allocated from device is physically continuous memory.
Call [axclrtFree](#axclrtFree) to free.

#### Remark

[axclrtFree](#axclrtFree)

#### Example

```c
void *devMem, *hostMem;
const size_t size = 1024*1024;
axclrtMalloc(&devMem, size, AXCL_MEM_MALLOC_HUGE_FIRST);
axclrtMallocHost(&hostMem, size);
// memcpy from host to device
axclrtMemcpy(devMem, hostMem, size, AXCL_MEMCPY_HOST_TO_DEVICE);
axclrtFree(devMem);
axclrtFreeHost(hostMem);
```

<br>

<a id="axclrtMallocCached"></a>

### axclrtMallocCached

Allocate cached device memory. Call [axclrtFree](#axclrtFree) to free memory.

#### Function

```c
AXCL_EXPORT axclError axclrtMallocCached(void **devPtr, size_t size, axclrtMemMallocPolicy policy);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| devPtr | out | Pointer to allocated cached device memory. |
| size | in | Size of memory to allocate. |
| policy | in | Memory allocation policy, [axclrtMemMallocPolicy](reference/enum.md#axclrtMemMallocPolicy). |

#### Returns

- `AXCL_SUCC`: success.
- `others`: failure.

#### Remark

[axclrtFree](#axclrtFree)

<br>

<a id="axclrtMallocHost"></a>

### axclrtMallocHost

Allocate host virtual memory.

#### Function

```c
AXCL_EXPORT axclError axclrtMallocHost(void **hostPtr, size_t size);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| hostPtr | out | Pointer to allocated host virtual memory. |
| size | in | Size of memory to allocate. |

#### Returns

- `AXCL_SUCC`: success.
- `others`: failure.

#### Note

[axclrtMallocHost](#axclrtMallocHost) is same as malloc function of standard C library, but [axclrtMallocHost](#axclrtMallocHost) is recommended.

#### Remark

[axclrtFreeHost](#axclrtFreeHost)

<br>

<a id="axclrtMemFlush"></a>

### axclrtMemFlush

Flush device memory.

#### Function

```c
AXCL_EXPORT axclError axclrtMemFlush(void *devPtr, size_t size);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| devPtr | in | Device memory. |
| size | in | Size of memory to flush. |

#### Returns

- `AXCL_SUCC`: success.
- `others`: failure.

#### Note

Only available for cached device memory.

<br>

<a id="axclrtMemInvalidate"></a>

### axclrtMemInvalidate

Invalidate device memory.

#### Function

```c
AXCL_EXPORT axclError axclrtMemInvalidate(void *devPtr, size_t size);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| devPtr | in | Device memory. |
| size | in | Size of memory to invalidate. |

#### Returns

- `AXCL_SUCC`: success.
- `others`: failure.

#### Note

Only available for cached device memory.

<br>

<a id="axclrtMemcmp"></a>

### axclrtMemcmp

Compare device memories.

#### Function

```c
AXCL_EXPORT axclError axclrtMemcmp(const void *devPtr1, const void *devPtr2, size_t count);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| devPtr1 | in | First device memory. |
| devPtr2 | in | Second device memory. |
| count | in | Number of bytes to compare. |

#### Returns

- `AXCL_SUCC`: success.
- `others`: failure.

<br>

<a id="axclrtMemcmpAsync"></a>

### axclrtMemcmpAsync

Compare device memories asynchronously.

#### Function

```c
AXCL_EXPORT axclError axclrtMemcmpAsync(const void *devPtr1, const void *devPtr2, size_t count, axclrtStream stream);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| devPtr1 | in | First device memory. |
| devPtr2 | in | Second device memory. |
| count | in | Number of bytes to compare. |
| stream | in | stream created by [axclrtCreateStream](stream_api.md#axclrtCreateStream). |

#### Returns

- `AXCL_SUCC`: success.
- `others`: failure.

<br>

<a id="axclrtMemcpy"></a>

### axclrtMemcpy

Copy memory.

#### Function

```c
AXCL_EXPORT axclError axclrtMemcpy(void *dstPtr, const void *srcPtr, size_t count, axclrtMemcpyKind kind);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| dstPtr | in | Destination memory. |
| srcPtr | in | Source memory. |
| count | in | Number of bytes to copy. |
| kind | in | Memory copy kind of [axclrtMemcpyKind](reference/enum.md#axclrtMemcpyKind). |

#### Returns

- `AXCL_SUCC`: success.
- `others`: failure.

#### Remark

[axclrtMalloc](#axclrtMalloc)

<br>

<a id="axclrtMemcpyAsync"></a>

### axclrtMemcpyAsync

Copy memory asynchronously.

#### Function

```c
AXCL_EXPORT axclError axclrtMemcpyAsync(void *dstPtr, const void *srcPtr, size_t count, axclrtMemcpyKind kind, axclrtStream stream);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| dstPtr | in | Destination memory. |
| srcPtr | in | Source memory. |
| count | in | Number of bytes to copy. |
| kind | in | Memory copy kind of [axclrtMemcpyKind](reference/enum.md#axclrtMemcpyKind). |
| stream | in | stream created by [axclrtCreateStream](stream_api.md#axclrtCreateStream). |

#### Returns

- `AXCL_SUCC`: success.
- `others`: failure.

<br>

<a id="axclrtMemset"></a>

### axclrtMemset

Set device memory to the specified value.

#### Function

```c
AXCL_EXPORT axclError axclrtMemset(void *devPtr, uint8_t value, size_t count);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| devPtr | in | Device memory. |
| value | in | Value to set. |
| count | in | Number of bytes to set. |

#### Returns

- `AXCL_SUCC`: success.
- `others`: failure.

#### Note

[axclrtMemset](#axclrtMemset) only support device memory.

<br>

<a id="axclrtMemsetAsync"></a>

### axclrtMemsetAsync

Set device memory asynchronously.

#### Function

```c
AXCL_EXPORT axclError axclrtMemsetAsync(void *devPtr, uint8_t value, size_t count, axclrtStream stream);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| devPtr | in | Pointer to device memory to set. |
| value | in | Value to set. |
| count | in | Number of bytes to set. |
| stream | in | stream created by [axclrtCreateStream](stream_api.md#axclrtCreateStream). |

#### Returns

- `AXCL_SUCC`: success.
- `others`: failure.
