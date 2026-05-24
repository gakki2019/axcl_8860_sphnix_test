# 内存 API

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

