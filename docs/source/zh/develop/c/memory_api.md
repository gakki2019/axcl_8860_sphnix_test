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

| 名称 | 方向 | 说明 |
|---|---|---|
| devPtr | in | 内存分配函数返回的设备内存基地址。 |

#### 2.1.3. 返回值

- `AXCL_SUCC`：成功释放设备内存。
- 其他错误：失败。

#### 2.1.4. 说明

- 本函数只能释放由 [axclrtMalloc](#axclrtMalloc) 或 [axclrtMallocCached](#axclrtMallocCached) 分配的设备内存。
- 调用线程必须将拥有该内存的设备所对应的 Context 设为当前 Context。
- 本函数成功后，`devPtr` 失效，不能再次使用。

#### 2.1.5. 参考

- [axclrtMalloc](#axclrtMalloc)
- [axclrtMallocCached](#axclrtMallocCached)

<br>

<a id="axclrtFreeHost"></a>

### 2.2. axclrtFreeHost

释放由 [axclrtMallocHost](#axclrtMallocHost) 分配的 Host 虚拟内存。

#### 2.2.1. 函数

```c
AXCL_EXPORT axclError axclrtFreeHost(void *hostPtr);
```

#### 2.2.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| hostPtr | in | [axclrtMallocHost](#axclrtMallocHost) 返回的 Host 虚拟内存基地址。 |

#### 2.2.3. 返回值

- `AXCL_SUCC`：成功释放 Host 内存。
- 其他错误：失败。

#### 2.2.4. 说明

- 本函数只能释放由 [axclrtMallocHost](#axclrtMallocHost) 分配的 Host 虚拟内存。
- 调用线程必须将分配该内存时使用的设备通信通道所对应的 Context 设为当前 Context。
- 本函数成功后，`hostPtr` 失效，不能再次使用。

#### 2.2.5. 参考

- [axclrtMallocHost](#axclrtMallocHost)

<br>

<a id="axclrtGetMemInfo"></a>

### 2.3. axclrtGetMemInfo

获取调用线程当前 Context 所属设备的内存容量快照。

#### 2.3.1. 函数

```c
AXCL_EXPORT axclError axclrtGetMemInfo(axclrtMemAttr attr, size_t *free, size_t *total);
```

#### 2.3.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| attr | in | 要查询的内存池。 |
| free | out | 可选参数，用于返回空闲字节数。 |
| total | out | 可选参数，用于返回总字节数。 |

#### 2.3.3. 返回值

- `AXCL_SUCC`：成功返回指定的内存信息。
- 其他错误：失败。

#### 2.3.4. 说明

- `free` 和 `total` 至少有一个不能为 `NULL`。
- [AXCL_DDR_CMM](reference/enum.md#AXCL_DDR_CMM) 返回设备所有 CMM 内存池的空闲字节数之和与总字节数之和。
- [AXCL_DDR_SYS](reference/enum.md#AXCL_DDR_SYS) 返回设备系统内存的 `MemFree` 和 `MemTotal` 字节数。

<br>

<a id="axclrtMalloc"></a>

### 2.4. axclrtMalloc

在调用线程当前 Context 所属的设备上分配物理连续内存。

#### 2.4.1. 函数

```c
AXCL_EXPORT axclError axclrtMalloc(void **devPtr, size_t size, axclrtMemMallocPolicy policy);
```

#### 2.4.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| devPtr | out | 成功时返回设备物理内存基地址。 |
| size | in | 要分配的字节数。支持范围为 1 到 `UINT32_MAX`。 |
| policy | in | 设备内存分配策略。 |

#### 2.4.3. 返回值

- `AXCL_SUCC`：成功分配设备内存。
- 其他错误：失败。

#### 2.4.4. 说明

- 本接口不会初始化分配的内存；如需初始化，请调用 [axclrtMemset](#axclrtMemset)。
- `devPtr` 是供 AXCL API 使用的设备地址句柄，不是 Host 指针，Host 应用不能直接解引用。
- 释放内存时，必须将同一设备的 Context 设为当前 Context，并调用 [axclrtFree](#axclrtFree)。
- 频繁申请和释放内存会影响性能，建议预先分配内存或进行二次管理。

#### 2.4.5. 示例

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

#### 2.4.6. 参考

- [axclrtFree](#axclrtFree)

<br>

<a id="axclrtMallocCached"></a>

### 2.5. axclrtMallocCached

在当前 Context 所属的设备上分配 cached 物理连续内存。

#### 2.5.1. 函数

```c
AXCL_EXPORT axclError axclrtMallocCached(void **devPtr, size_t size, axclrtMemMallocPolicy policy);
```

#### 2.5.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| devPtr | out | 成功时返回设备地址句柄。 |
| size | in | 要分配的字节数。支持范围为 1 到 `UINT32_MAX`。 |
| policy | in | 设备内存分配策略。 |

#### 2.5.3. 返回值

- `AXCL_SUCC`：成功分配设备内存。
- 其他错误：失败。

#### 2.5.4. 说明

- 返回的内存分配会记录 [AXCL_POINTER_ATTRIBUTE_FLAG_CACHED](reference/enum.md#AXCL_POINTER_ATTRIBUTE_FLAG_CACHED) 属性，可以通过 [axclrtPointerGetAttributes](#axclrtPointerGetAttributes) 查询。
- `devPtr` 是供 AXCL API 使用的设备内存基地址，Host 不能直接解引用。
- 根据需要调用 [axclrtMemFlush](#axclrtMemFlush) 和 [axclrtMemInvalidate](#axclrtMemInvalidate) 维护缓存一致性。
- 释放内存时，必须将同一设备的 Context 设为当前 Context，并调用 [axclrtFree](#axclrtFree)。

#### 2.5.5. 参考

- [axclrtFree](#axclrtFree)
- [axclrtMemFlush](#axclrtMemFlush)
- [axclrtMemInvalidate](#axclrtMemInvalidate)

<br>

<a id="axclrtMallocHost"></a>

### 2.6. axclrtMallocHost

分配 Host 虚拟内存。

#### 2.6.1. 函数

```c
AXCL_EXPORT axclError axclrtMallocHost(void **hostPtr, size_t size);
```

#### 2.6.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| hostPtr | out | 成功时返回 Host 可访问的虚拟地址。 |
| size | in | 要分配的字节数，必须大于 0。 |

#### 2.6.3. 返回值

- `AXCL_SUCC`：成功分配 Host 内存。
- 其他错误：失败。

#### 2.6.4. 说明

- 对于使用 Host 虚拟地址的复制方向，AXCL 内存复制接口也支持标准库 `malloc` 分配的内存。推荐使用本接口分配 Host 内存。
- 本接口分配的内存必须通过 [axclrtFreeHost](#axclrtFreeHost) 释放，不能使用标准库 `free`；标准库 `malloc` 分配的内存也必须使用标准库 `free` 释放。

#### 2.6.5. 参考

- [axclrtFreeHost](#axclrtFreeHost)

<br>

<a id="axclrtMemFlush"></a>

### 2.7. axclrtMemFlush

将一段 cached 设备内存的 cache 数据写回 DDR。

#### 2.7.1. 函数

```c
AXCL_EXPORT axclError axclrtMemFlush(void *devPtr, size_t size);
```

#### 2.7.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| devPtr | in | 要刷新范围的起始设备内存地址。 |
| size | in | 要刷新的字节数。支持范围为 1 到 `UINT32_MAX`。 |

#### 2.7.3. 返回值

- `AXCL_SUCC`：成功刷新指定 cache 范围。
- 其他错误：失败。

#### 2.7.4. 说明

- 本函数用于处理 [axclrtMallocCached](#axclrtMallocCached) 返回的内存。
- 调用线程必须将拥有该内存的设备所对应的 Context 设为当前 Context。

#### 2.7.5. 参考

- [axclrtMallocCached](#axclrtMallocCached)
- [axclrtMemInvalidate](#axclrtMemInvalidate)

<br>

<a id="axclrtMemInvalidate"></a>

### 2.8. axclrtMemInvalidate

使一段 cached 设备内存对应的 cache 内容失效。

#### 2.8.1. 函数

```c
AXCL_EXPORT axclError axclrtMemInvalidate(void *devPtr, size_t size);
```

#### 2.8.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| devPtr | in | 要使 cache 失效范围的起始设备物理内存地址。 |
| size | in | 要处理的字节数。支持范围为 1 到 `UINT32_MAX`。 |

#### 2.8.3. 返回值

- `AXCL_SUCC`：成功使指定 cache 范围失效。
- 其他错误：失败。

#### 2.8.4. 说明

- 本函数用于处理 [axclrtMallocCached](#axclrtMallocCached) 返回的内存。
- 调用线程必须将拥有该内存的设备所对应的 Context 设为当前 Context。

#### 2.8.5. 参考

- [axclrtMallocCached](#axclrtMallocCached)
- [axclrtMemFlush](#axclrtMemFlush)

<br>

<a id="axclrtMemcmp"></a>

### 2.9. axclrtMemcmp

同步判断两段设备内存中的字节是否完全相同。

#### 2.9.1. 函数

```c
AXCL_EXPORT axclError axclrtMemcmp(const void *devPtr1, const void *devPtr2, size_t count);
```

#### 2.9.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| devPtr1 | in | 第一段设备内存的地址。 |
| devPtr2 | in | 第二段设备内存的地址。 |
| count | in | 要比较的字节数。支持范围为 1 到 `UINT32_MAX`。 |

#### 2.9.3. 返回值

- `AXCL_SUCC`：比较的字节完全相同。
- 其他错误：字节内容不同或比较操作失败。

#### 2.9.4. 说明

- 本接口不返回三路比较结果。非成功返回值无法区分内容不同和执行失败。
- 调用线程必须将拥有这两段内存的设备所对应的 Context 设为当前 Context。

#### 2.9.5. 参考

- [axclrtMemcmpAsync](#axclrtMemcmpAsync)

<br>

<a id="axclrtMemcmpAsync"></a>

### 2.10. axclrtMemcmpAsync

将两段设备内存的比较操作异步提交到指定的 Stream。

#### 2.10.1. 函数

```c
AXCL_EXPORT axclError axclrtMemcmpAsync(const void *devPtr1, const void *devPtr2, size_t count, axclrtStream stream);
```

#### 2.10.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| devPtr1 | in | 第一段设备内存的地址。 |
| devPtr2 | in | 第二段设备内存的地址。 |
| count | in | 要比较的字节数。支持范围为 1 到 `UINT32_MAX`。 |
| stream | in | 接收比较操作的 Stream。 |

#### 2.10.3. 返回值

- `AXCL_SUCC`：成功提交比较操作。
- 其他错误：失败。

#### 2.10.4. 说明

- 本接口将比较任务提交到指定的 Stream 即返回，成功返回不表示比较已经完成。
- 本异步接口不返回两段内存是否相等。如果需要比较结果，请使用同步接口 [axclrtMemcmp](#axclrtMemcmp)。
- 两段内存都必须属于 `stream` 所关联的设备，并且在操作完成前保持有效。

#### 2.10.5. 参考

- [axclrtMemcmp](#axclrtMemcmp)
- [axclrtSynchronizeStream](stream_api.md#axclrtSynchronizeStream)

<br>

<a id="axclrtMemcpy"></a>

### 2.11. axclrtMemcpy

在 Host 或设备内存之间同步复制字节。

#### 2.11.1. 函数

```c
AXCL_EXPORT axclError axclrtMemcpy(void *dstPtr, const void *srcPtr, size_t count, axclrtMemcpyKind kind);
```

#### 2.11.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| dstPtr | in | 目标地址，其含义由 `kind` 决定。 |
| srcPtr | in | 源地址，其含义由 `kind` 决定。 |
| count | in | 要复制的字节数，必须大于 0。 |
| kind | in | 复制方向及地址类型。 |

#### 2.11.3. 返回值

- `AXCL_SUCC`：成功完成复制。
- 其他错误：失败。

#### 2.11.4. 说明

- 本函数为同步接口，即在复制完成后返回。
- 本函数支持 [axclrtMemcpyKind](reference/enum.md#axclrtMemcpyKind) 的全部取值，包括同一设备内的 Device-to-Device 复制。
- 使用 [AXCL_MEMCPY_HOST_PHY_TO_DEVICE](reference/enum.md#AXCL_MEMCPY_HOST_PHY_TO_DEVICE) 和 [AXCL_MEMCPY_DEVICE_TO_HOST_PHY](reference/enum.md#AXCL_MEMCPY_DEVICE_TO_HOST_PHY) 时，通过对应的指针参数传入 Host 物理地址值。
- 调用线程必须已有当前 Context。所有设备内存必须属于该 Context 所关联的设备，并且源、目标内存范围在函数返回前必须保持有效。

#### 2.11.5. 示例

Host 与设备之间的双向内存复制（以下伪代码省略错误处理）：

```c
void *hostSrc = NULL;
void *hostDst = NULL;
void *devMem = NULL;
const size_t size = 1024 * 1024;

/* 分配 Host 和设备内存。 */
axclrtMallocHost(&hostSrc, size);
axclrtMallocHost(&hostDst, size);
axclrtMalloc(&devMem, size, AXCL_MEM_MALLOC_HUGE_FIRST);

/* 准备 Host 源数据。 */
memset(hostSrc, 0x5A, size);

/* Host -> Device。 */
axclrtMemcpy(devMem, hostSrc, size, AXCL_MEMCPY_HOST_TO_DEVICE);

/* Device -> Host。 */
axclrtMemcpy(hostDst, devMem, size, AXCL_MEMCPY_DEVICE_TO_HOST);

/* 此时可以在 Host 上读取并校验 hostDst。 */

axclrtFree(devMem);
axclrtFreeHost(hostDst);
axclrtFreeHost(hostSrc);
```

更完整的同步拷贝流程参见 [同步拷贝](../arch/memory.md#memory-synchronous-copy)，设备间拷贝参见 [设备间拷贝](../arch/memory.md#memory-inter-device-copy)。

#### 2.11.6. 参考

- [axclrtMemcpyAsync](#axclrtMemcpyAsync)
- [axclrtMalloc](#axclrtMalloc)
- [axclrtMallocHost](#axclrtMallocHost)

<br>

<a id="axclrtMemcpyAsync"></a>

### 2.12. axclrtMemcpyAsync

将 Host 或设备内存复制操作异步提交到指定的 Stream。

#### 2.12.1. 函数

```c
AXCL_EXPORT axclError axclrtMemcpyAsync(void *dstPtr, const void *srcPtr, size_t count, axclrtMemcpyKind kind, axclrtStream stream);
```

#### 2.12.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| dstPtr | in | 目标地址，其含义由 `kind` 决定。 |
| srcPtr | in | 源地址，其含义由 `kind` 决定。 |
| count | in | 要复制的字节数，必须大于 0。 |
| kind | in | 复制方向及地址类型。不支持 [AXCL_MEMCPY_DEVICE_TO_DEVICE](reference/enum.md#AXCL_MEMCPY_DEVICE_TO_DEVICE)。 |
| stream | in | 接收复制操作的 Stream。 |

#### 2.12.3. 返回值

- `AXCL_SUCC`：成功提交复制操作。
- 其他错误：失败。

#### 2.12.4. 说明

- 本函数为异步接口，成功返回只表示复制操作已提交，不表示复制已经完成。使用目标内存或释放任一内存前，必须同步 `stream`，例如调用 [axclrtSynchronizeStream](stream_api.md#axclrtSynchronizeStream)。
- 本函数支持 Host-to-Host、Host-to-Device、Device-to-Host、Host-physical-to-Device 和 Device-to-Host-physical 复制；Device-to-Device 复制请使用同步接口 [axclrtMemcpy](#axclrtMemcpy)。
- 使用 [AXCL_MEMCPY_HOST_PHY_TO_DEVICE](reference/enum.md#AXCL_MEMCPY_HOST_PHY_TO_DEVICE) 和 [AXCL_MEMCPY_DEVICE_TO_HOST_PHY](reference/enum.md#AXCL_MEMCPY_DEVICE_TO_HOST_PHY) 时，通过对应的指针参数传入 Host 物理地址值。
- 所有设备内存必须属于 `stream` 所关联的设备。源、目标内存范围在复制完成前必须保持有效。

#### 2.12.5. 示例

有关 H2D 异步拷贝、异步推理、D2H 异步拷贝和 Stream 同步的完整流程，参见 [异步拷贝](../arch/memory.md#memory-asynchronous-copy)。

#### 2.12.6. 参考

- [axclrtMemcpy](#axclrtMemcpy)
- [axclrtSynchronizeStream](stream_api.md#axclrtSynchronizeStream)

<br>

<a id="axclrtMemset"></a>

### 2.13. axclrtMemset

同步将设备内存中的字节设置为指定值。

#### 2.13.1. 函数

```c
AXCL_EXPORT axclError axclrtMemset(void *devPtr, uint8_t value, size_t count);
```

#### 2.13.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| devPtr | in | 开始写入的设备内存地址。 |
| value | in | 要写入的字节值。 |
| count | in | 要设置的字节数。支持范围为 1 到 `UINT32_MAX`。 |

#### 2.13.3. 返回值

- `AXCL_SUCC`：成功设置设备内存。
- 其他错误：失败。

#### 2.13.4. 说明

- 本函数仅支持设备内存，并在操作完成后返回。
- 调用线程必须将拥有该内存的设备所对应的 Context 设为当前 Context。

#### 2.13.5. 参考

- [axclrtMemsetAsync](#axclrtMemsetAsync)

<br>

<a id="axclrtMemsetAsync"></a>

### 2.14. axclrtMemsetAsync

将设备内存设置操作异步提交到指定的 Stream。

#### 2.14.1. 函数

```c
AXCL_EXPORT axclError axclrtMemsetAsync(void *devPtr, uint8_t value, size_t count, axclrtStream stream);
```

#### 2.14.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| devPtr | in | 开始写入的设备内存地址。 |
| value | in | 要写入的字节值。 |
| count | in | 要设置的字节数。支持范围为 1 到 `UINT32_MAX`。 |
| stream | in | 接收该操作的 Stream。 |

#### 2.14.3. 返回值

- `AXCL_SUCC`：成功提交内存设置操作。
- 其他错误：失败。

#### 2.14.4. 说明

- 本接口为异步接口，成功返回不表示内存已经更新。读取或释放内存前，必须同步 `stream`。
- `devPtr` 必须属于 `stream` 所关联的设备，并且在操作完成前保持有效。

#### 2.14.5. 参考

- [axclrtMemset](#axclrtMemset)
- [axclrtSynchronizeStream](stream_api.md#axclrtSynchronizeStream)

<br>

<a id="axclrtPointerGetAttributes"></a>

### 2.15. axclrtPointerGetAttributes

获取内存分配属性。

#### 2.15.1. 函数

```c
AXCL_EXPORT axclError axclrtPointerGetAttributes(const void *ptr, axclrtPtrAttributes *attributes);
```

#### 2.15.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| ptr | in | 内存分配的起始地址或内部任意字节的地址。 |
| attributes | out | 用于返回指针属性。 |

#### 2.15.3. 返回值

- `AXCL_SUCC`：成功返回指针属性。
- 其他错误：失败。

#### 2.15.4. 说明

- SDK 会记录当前进程中通过 [axclrtMalloc](#axclrtMalloc)、[axclrtMallocCached](#axclrtMallocCached) 和 [axclrtMallocHost](#axclrtMallocHost) 创建的内存分配。
- 对于已记录的内存，本函数返回其 Host 或设备位置类型。设备内存的位置 ID 为分配时的虚拟设备 ID；Host 内存的位置 ID 为 `-1`。[axclrtMallocCached](#axclrtMallocCached) 分配的内存还会设置 [AXCL_POINTER_ATTRIBUTE_FLAG_CACHED](reference/enum.md#AXCL_POINTER_ATTRIBUTE_FLAG_CACHED) 标志。
- 如果 `ptr` 不在任何已跟踪的内存分配内（例如标准库 `malloc` 分配的内存），本函数仍返回 `AXCL_SUCC`，同时将位置类型设置为 [AXCL_MEM_LOCATION_TYPE_UNREGISTERED](reference/enum.md#AXCL_MEM_LOCATION_TYPE_UNREGISTERED)、位置 ID 设置为 `-1`，并将 `flags` 设置为 `0`。
