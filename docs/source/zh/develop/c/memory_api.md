# 内存

## 1. 目录

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

## 2. API

<a id="axclrtFree"></a>

### 2.1. axclrtFree

释放设备内存。

#### 2.1.1. 函数

```c
AXCL_EXPORT axclError axclrtFree(void *devPtr);
```

#### 2.1.2. 参数

| 名称   | 方向 | 说明                                              |
| ------ | ---- | ------------------------------------------------- |
| devPtr | in   | 由 [axclrtMalloc](#axclrtMalloc) 分配的设备内存。 |

#### 2.1.3. 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

#### 2.1.4. 参考

[axclrtMalloc](#axclrtMalloc) | [axclrtMallocCached](#axclrtMallocCached)

<br>

<a id="axclrtFreeHost"></a>

### 2.2. axclrtFreeHost

释放主机虚拟内存。

#### 2.2.1. 函数

```c
AXCL_EXPORT axclError axclrtFreeHost(void *hostPtr);
```

#### 2.2.2. 参数

| 名称    | 方向 | 说明       |
| ------- | ---- | ---------- |
| hostPtr | in   | 主机内存。 |

#### 2.2.3. 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

#### 2.2.4. 参考

[axclrtMallocHost](#axclrtMallocHost)

<br>

<a id="axclrtGetMemInfo"></a>

### 2.3. axclrtGetMemInfo

获取内存信息。

#### 2.3.1. 函数

```c
AXCL_EXPORT axclError axclrtGetMemInfo(axclrtMemAttr attr, size_t *free, size_t *total);
```

#### 2.3.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| attr | in | 内存信息类型 |
| free | out | 空闲字节数 |
| total | out | 总字节数 |

#### 2.3.3. 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

<br>

<a id="axclrtMalloc"></a>

### 2.4. axclrtMalloc

分配设备内存。

#### 2.4.1. 函数

```c
AXCL_EXPORT axclError axclrtMalloc(void **devPtr, size_t size, axclrtMemMallocPolicy policy);
```

#### 2.4.2. 参数

| 名称   | 方向 | 说明                                                                                  |
| ------ | ---- | ------------------------------------------------------------------------------------- |
| devPtr | out  | 指向已分配设备内存的指针。                                                            |
| size   | in   | 要分配的内存大小。                                                                    |
| policy | in   | 内存分配策略，参见 [axclrtMemMallocPolicy](reference/enum.md#axclrtMemMallocPolicy)。 |

#### 2.4.3. 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

#### 2.4.4. 说明

从设备分配的内存是物理连续内存。
使用 [axclrtFree](#axclrtFree) 释放。

#### 2.4.5. 参考

[axclrtFree](#axclrtFree)

#### 2.4.6. 示例

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

### 2.5. axclrtMallocCached

分配带缓存的设备内存。使用 [axclrtFree](#axclrtFree) 释放内存。

#### 2.5.1. 函数

```c
AXCL_EXPORT axclError axclrtMallocCached(void **devPtr, size_t size, axclrtMemMallocPolicy policy);
```

#### 2.5.2. 参数

| 名称   | 方向 | 说明                                                                                  |
| ------ | ---- | ------------------------------------------------------------------------------------- |
| devPtr | out  | 指向已分配带缓存设备内存的指针。                                                      |
| size   | in   | 要分配的内存大小。                                                                    |
| policy | in   | 内存分配策略，参见 [axclrtMemMallocPolicy](reference/enum.md#axclrtMemMallocPolicy)。 |

#### 2.5.3. 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

#### 2.5.4. 参考

[axclrtFree](#axclrtFree)

<br>

<a id="axclrtMallocHost"></a>

### 2.6. axclrtMallocHost

分配主机虚拟内存。

#### 2.6.1. 函数

```c
AXCL_EXPORT axclError axclrtMallocHost(void **hostPtr, size_t size);
```

#### 2.6.2. 参数

| 名称    | 方向 | 说明                           |
| ------- | ---- | ------------------------------ |
| hostPtr | out  | 指向已分配主机虚拟内存的指针。 |
| size    | in   | 要分配的内存大小。             |

#### 2.6.3. 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

#### 2.6.4. 说明

[axclrtMallocHost](#axclrtMallocHost) 与标准 C 库的 malloc 函数相同，但建议优先使用 [axclrtMallocHost](#axclrtMallocHost)。

#### 2.6.5. 参考

[axclrtFreeHost](#axclrtFreeHost)

<br>

<a id="axclrtMemFlush"></a>

### 2.7. axclrtMemFlush

刷新设备内存。

#### 2.7.1. 函数

```c
AXCL_EXPORT axclError axclrtMemFlush(void *devPtr, size_t size);
```

#### 2.7.2. 参数

| 名称   | 方向 | 说明         |
| ------ | ---- | ------------ |
| devPtr | in   | 设备内存。   |
| size   | in   | 要刷新的大小。 |

#### 2.7.3. 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

#### 2.7.4. 说明

仅适用于带缓存的设备内存。

<br>

<a id="axclrtMemInvalidate"></a>

### 2.8. axclrtMemInvalidate

使设备内存失效。

#### 2.8.1. 函数

```c
AXCL_EXPORT axclError axclrtMemInvalidate(void *devPtr, size_t size);
```

#### 2.8.2. 参数

| 名称   | 方向 | 说明           |
| ------ | ---- | -------------- |
| devPtr | in   | 设备内存。     |
| size   | in   | 要失效的大小。 |

#### 2.8.3. 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

#### 2.8.4. 说明

仅适用于带缓存的设备内存。

<br>

<a id="axclrtMemcmp"></a>

### 2.9. axclrtMemcmp

比较设备内存。

#### 2.9.1. 函数

```c
AXCL_EXPORT axclError axclrtMemcmp(const void *devPtr1, const void *devPtr2, size_t count);
```

#### 2.9.2. 参数

| 名称    | 方向 | 说明           |
| ------- | ---- | -------------- |
| devPtr1 | in   | 第一块设备内存。 |
| devPtr2 | in   | 第二块设备内存。 |
| count   | in   | 要比较的字节数。 |

#### 2.9.3. 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

<br>

<a id="axclrtMemcmpAsync"></a>

### 2.10. axclrtMemcmpAsync

异步比较设备内存。

#### 2.10.1. 函数

```c
AXCL_EXPORT axclError axclrtMemcmpAsync(const void *devPtr1, const void *devPtr2, size_t count, axclrtStream stream);
```

#### 2.10.2. 参数

| 名称    | 方向 | 说明 |
| ------- | ---- | ---- |
| devPtr1 | in   | 第一块设备内存。 |
| devPtr2 | in   | 第二块设备内存。 |
| count   | in   | 要比较的字节数。 |
| stream  | in   | 由 [axclrtCreateStream](stream_api.md#axclrtCreateStream) 创建的 stream。 |

#### 2.10.3. 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

<br>

<a id="axclrtMemcpy"></a>

### 2.11. axclrtMemcpy

复制内存。

#### 2.11.1. 函数

```c
AXCL_EXPORT axclError axclrtMemcpy(void *dstPtr, const void *srcPtr, size_t count, axclrtMemcpyKind kind);
```

#### 2.11.2. 参数

| 名称   | 方向 | 说明 |
| ------ | ---- | ---- |
| dstPtr | in   | 目标内存。 |
| srcPtr | in   | 源内存。 |
| count  | in   | 要复制的字节数。 |
| kind   | in   | 内存拷贝类型，参见 [axclrtMemcpyKind](reference/enum.md#axclrtMemcpyKind)。 |

#### 2.11.3. 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

#### 2.11.4. 参考

[axclrtMalloc](#axclrtMalloc)

<br>

<a id="axclrtMemcpyAsync"></a>

### 2.12. axclrtMemcpyAsync

异步复制内存。

#### 2.12.1. 函数

```c
AXCL_EXPORT axclError axclrtMemcpyAsync(void *dstPtr, const void *srcPtr, size_t count, axclrtMemcpyKind kind, axclrtStream stream);
```

#### 2.12.2. 参数

| 名称   | 方向 | 说明 |
| ------ | ---- | ---- |
| dstPtr | in   | 目标内存。 |
| srcPtr | in   | 源内存。 |
| count  | in   | 要复制的字节数。 |
| kind   | in   | 内存拷贝类型，参见 [axclrtMemcpyKind](reference/enum.md#axclrtMemcpyKind)。 |
| stream | in   | 由 [axclrtCreateStream](stream_api.md#axclrtCreateStream) 创建的 stream。 |

#### 2.12.3. 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

<br>

<a id="axclrtMemset"></a>

### 2.13. axclrtMemset

将设备内存设置为指定值。

#### 2.13.1. 函数

```c
AXCL_EXPORT axclError axclrtMemset(void *devPtr, uint8_t value, size_t count);
```

#### 2.13.2. 参数

| 名称   | 方向 | 说明 |
| ------ | ---- | ---- |
| devPtr | in   | 设备内存。 |
| value  | in   | 要设置的值。 |
| count  | in   | 要设置的字节数。 |

#### 2.13.3. 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

#### 2.13.4. 说明

[axclrtMemset](#axclrtMemset) 仅支持设备内存。

<br>

<a id="axclrtMemsetAsync"></a>

### 2.14. axclrtMemsetAsync

异步设置设备内存。

#### 2.14.1. 函数

```c
AXCL_EXPORT axclError axclrtMemsetAsync(void *devPtr, uint8_t value, size_t count, axclrtStream stream);
```

#### 2.14.2. 参数

| 名称   | 方向 | 说明 |
| ------ | ---- | ---- |
| devPtr | in   | 要设置的设备内存指针。 |
| value  | in   | 要设置的值。 |
| count  | in   | 要设置的字节数。 |
| stream | in   | 由 [axclrtCreateStream](stream_api.md#axclrtCreateStream) 创建的 stream。 |

#### 2.14.3. 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

<a id="axclrtPointerGetAttributes"></a>

### 2.15. axclrtPointerGetAttributes

获取指针属性。

#### 2.15.1. 函数

```c
AXCL_EXPORT axclError axclrtPointerGetAttributes(const void *ptr, axclrtPtrAttributes *attributes);
```

#### 2.15.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| ptr | in | 待查询的指针。 |
| attributes | out | 指针属性。 |

#### 2.15.3. 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

