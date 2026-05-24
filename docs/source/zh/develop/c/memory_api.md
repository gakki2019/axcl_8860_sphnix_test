# 内存

## 目录

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

释放设备内存。

#### 函数

```c
AXCL_EXPORT axclError axclrtFree(void *devPtr);
```

#### 参数

| 名称   | 方向 | 说明                                              |
| ------ | ---- | ------------------------------------------------- |
| devPtr | in   | 由 [axclrtMalloc](#axclrtMalloc) 分配的设备内存。 |

#### 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

#### 参考

[axclrtMalloc](#axclrtMalloc) | [axclrtMallocCached](#axclrtMallocCached)

<br>

<a id="axclrtFreeHost"></a>

### axclrtFreeHost

释放主机虚拟内存。

#### 函数

```c
AXCL_EXPORT axclError axclrtFreeHost(void *hostPtr);
```

#### 参数

| 名称    | 方向 | 说明       |
| ------- | ---- | ---------- |
| hostPtr | in   | 主机内存。 |

#### 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

#### 参考

[axclrtMallocHost](#axclrtMallocHost)

<br>

<a id="axclrtMalloc"></a>

### axclrtMalloc

分配设备内存。

#### 函数

```c
AXCL_EXPORT axclError axclrtMalloc(void **devPtr, size_t size, axclrtMemMallocPolicy policy);
```

#### 参数

| 名称   | 方向 | 说明                                                                                  |
| ------ | ---- | ------------------------------------------------------------------------------------- |
| devPtr | out  | 指向已分配设备内存的指针。                                                            |
| size   | in   | 要分配的内存大小。                                                                    |
| policy | in   | 内存分配策略，参见 [axclrtMemMallocPolicy](reference/enum.md#axclrtMemMallocPolicy)。 |

#### 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

#### 说明

从设备分配的内存是物理连续内存。
使用 [axclrtFree](#axclrtFree) 释放。

#### 参考

[axclrtFree](#axclrtFree)

#### 示例

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

分配带缓存的设备内存。使用 [axclrtFree](#axclrtFree) 释放内存。

#### 函数

```c
AXCL_EXPORT axclError axclrtMallocCached(void **devPtr, size_t size, axclrtMemMallocPolicy policy);
```

#### 参数

| 名称   | 方向 | 说明                                                                                  |
| ------ | ---- | ------------------------------------------------------------------------------------- |
| devPtr | out  | 指向已分配带缓存设备内存的指针。                                                      |
| size   | in   | 要分配的内存大小。                                                                    |
| policy | in   | 内存分配策略，参见 [axclrtMemMallocPolicy](reference/enum.md#axclrtMemMallocPolicy)。 |

#### 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

#### 参考

[axclrtFree](#axclrtFree)

<br>

<a id="axclrtMallocHost"></a>

### axclrtMallocHost

分配主机虚拟内存。

#### 函数

```c
AXCL_EXPORT axclError axclrtMallocHost(void **hostPtr, size_t size);
```

#### 参数

| 名称    | 方向 | 说明                           |
| ------- | ---- | ------------------------------ |
| hostPtr | out  | 指向已分配主机虚拟内存的指针。 |
| size    | in   | 要分配的内存大小。             |

#### 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

#### 说明

[axclrtMallocHost](#axclrtMallocHost) 与标准 C 库的 malloc 函数相同，但建议优先使用 [axclrtMallocHost](#axclrtMallocHost)。

#### 参考

[axclrtFreeHost](#axclrtFreeHost)

<br>

<a id="axclrtMemFlush"></a>

### axclrtMemFlush

刷新设备内存。

#### 函数

```c
AXCL_EXPORT axclError axclrtMemFlush(void *devPtr, size_t size);
```

#### 参数

| 名称   | 方向 | 说明         |
| ------ | ---- | ------------ |
| devPtr | in   | 设备内存。   |
| size   | in   | 要刷新的大小。 |

#### 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

#### 说明

仅适用于带缓存的设备内存。

<br>

<a id="axclrtMemInvalidate"></a>

### axclrtMemInvalidate

使设备内存失效。

#### 函数

```c
AXCL_EXPORT axclError axclrtMemInvalidate(void *devPtr, size_t size);
```

#### 参数

| 名称   | 方向 | 说明           |
| ------ | ---- | -------------- |
| devPtr | in   | 设备内存。     |
| size   | in   | 要失效的大小。 |

#### 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

#### 说明

仅适用于带缓存的设备内存。

<br>

<a id="axclrtMemcmp"></a>

### axclrtMemcmp

比较设备内存。

#### 函数

```c
AXCL_EXPORT axclError axclrtMemcmp(const void *devPtr1, const void *devPtr2, size_t count);
```

#### 参数

| 名称    | 方向 | 说明           |
| ------- | ---- | -------------- |
| devPtr1 | in   | 第一块设备内存。 |
| devPtr2 | in   | 第二块设备内存。 |
| count   | in   | 要比较的字节数。 |

#### 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

<br>

<a id="axclrtMemcmpAsync"></a>

### axclrtMemcmpAsync

异步比较设备内存。

#### 函数

```c
AXCL_EXPORT axclError axclrtMemcmpAsync(const void *devPtr1, const void *devPtr2, size_t count, axclrtStream stream);
```

#### 参数

| 名称    | 方向 | 说明 |
| ------- | ---- | ---- |
| devPtr1 | in   | 第一块设备内存。 |
| devPtr2 | in   | 第二块设备内存。 |
| count   | in   | 要比较的字节数。 |
| stream  | in   | 由 [axclrtCreateStream](stream_api.md#axclrtCreateStream) 创建的 stream。 |

#### 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

<br>

<a id="axclrtMemcpy"></a>

### axclrtMemcpy

复制内存。

#### 函数

```c
AXCL_EXPORT axclError axclrtMemcpy(void *dstPtr, const void *srcPtr, size_t count, axclrtMemcpyKind kind);
```

#### 参数

| 名称   | 方向 | 说明 |
| ------ | ---- | ---- |
| dstPtr | in   | 目标内存。 |
| srcPtr | in   | 源内存。 |
| count  | in   | 要复制的字节数。 |
| kind   | in   | 内存拷贝类型，参见 [axclrtMemcpyKind](reference/enum.md#axclrtMemcpyKind)。 |

#### 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

#### 参考

[axclrtMalloc](#axclrtMalloc)

<br>

<a id="axclrtMemcpyAsync"></a>

### axclrtMemcpyAsync

异步复制内存。

#### 函数

```c
AXCL_EXPORT axclError axclrtMemcpyAsync(void *dstPtr, const void *srcPtr, size_t count, axclrtMemcpyKind kind, axclrtStream stream);
```

#### 参数

| 名称   | 方向 | 说明 |
| ------ | ---- | ---- |
| dstPtr | in   | 目标内存。 |
| srcPtr | in   | 源内存。 |
| count  | in   | 要复制的字节数。 |
| kind   | in   | 内存拷贝类型，参见 [axclrtMemcpyKind](reference/enum.md#axclrtMemcpyKind)。 |
| stream | in   | 由 [axclrtCreateStream](stream_api.md#axclrtCreateStream) 创建的 stream。 |

#### 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

<br>

<a id="axclrtMemset"></a>

### axclrtMemset

将设备内存设置为指定值。

#### 函数

```c
AXCL_EXPORT axclError axclrtMemset(void *devPtr, uint8_t value, size_t count);
```

#### 参数

| 名称   | 方向 | 说明 |
| ------ | ---- | ---- |
| devPtr | in   | 设备内存。 |
| value  | in   | 要设置的值。 |
| count  | in   | 要设置的字节数。 |

#### 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

#### 说明

[axclrtMemset](#axclrtMemset) 仅支持设备内存。

<br>

<a id="axclrtMemsetAsync"></a>

### axclrtMemsetAsync

异步设置设备内存。

#### 函数

```c
AXCL_EXPORT axclError axclrtMemsetAsync(void *devPtr, uint8_t value, size_t count, axclrtStream stream);
```

#### 参数

| 名称   | 方向 | 说明 |
| ------ | ---- | ---- |
| devPtr | in   | 要设置的设备内存指针。 |
| value  | in   | 要设置的值。 |
| count  | in   | 要设置的字节数。 |
| stream | in   | 由 [axclrtCreateStream](stream_api.md#axclrtCreateStream) 创建的 stream。 |

#### 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

