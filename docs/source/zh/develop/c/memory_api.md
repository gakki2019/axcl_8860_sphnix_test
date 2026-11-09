# 内存

## 1. 目录

- [axclrtFree](#axclrtFree)：释放设备内存。
- [axclrtFreeHost](#axclrtFreeHost)：释放由 [axclrtMallocHost](#axclrtMallocHost) 分配的 Host 虚拟内存。
- [axclrtGetMemInfo](#axclrtGetMemInfo)：获取调用线程当前 Context 所属设备的内存容量快照。
- [axclrtIpcMemClose](#axclrtIpcMemClose)：关闭跨进程共享内存的 IPC Key。
- [axclrtIpcMemGetExportKey](#axclrtIpcMemGetExportKey)：导出设备内存用于跨进程共享，并获取 IPC Key。
- [axclrtIpcMemImportByKey](#axclrtIpcMemImportByKey)：通过 IPC Key 导入共享的设备内存。
- [axclrtIpcMemSetImportPid](#axclrtIpcMemSetImportPid)：为已导出的 IPC Key 设置目标 Host TGID 白名单。
- [axclrtMalloc](#axclrtMalloc)：在调用线程当前 Context 所属的设备上分配物理连续内存。
- [axclrtMallocCached](#axclrtMallocCached)：在当前 Context 所属的设备上分配 cached 物理连续内存。
- [axclrtMallocHost](#axclrtMallocHost)：分配 Host 虚拟内存。
- [axclrtMemFlush](#axclrtMemFlush)：将一段 cached 设备内存的 cache 数据写回 DDR。
- [axclrtMemGetAddressRange](#axclrtMemGetAddressRange)：获取 AXCL runtime 管理的内存分配或外部注册的基地址句柄和大小。
- [axclrtMemGetDevAddr](#axclrtMemGetDevAddr)：由设备内存句柄导出底层的 Device 物理地址和虚拟地址。
- [axclrtMemInvalidate](#axclrtMemInvalidate)：使一段 cached 设备内存对应的 cache 内容失效。
- [axclrtMemMapDevAddr](#axclrtMemMapDevAddr)：将外部设备内存（例如来自 Native 模块的内存）注册为临时映射的设备指针。
- [axclrtMemUnmapDevAddr](#axclrtMemUnmapDevAddr)：注销通过 [axclrtMemMapDevAddr](#axclrtMemMapDevAddr) 注册的外部设备内存。
- [axclrtMemcmp](#axclrtMemcmp)：同步判断两段设备内存中的字节是否完全相同。
- [axclrtMemcmpAsync](#axclrtMemcmpAsync)：将两段设备内存的比较操作异步提交到指定的 Stream。
- [axclrtMemcpy](#axclrtMemcpy)：在 Host 或设备内存之间同步复制字节。
- [axclrtMemcpy2d](#axclrtMemcpy2d)：在 Host 与设备内存之间同步复制一个二维矩形区域。
- [axclrtMemcpy2dAsync](#axclrtMemcpy2dAsync)：将 Host 与设备内存之间的二维矩形复制操作异步提交到指定的 Stream。
- [axclrtMemcpyAsync](#axclrtMemcpyAsync)：将 Host 或设备内存复制操作异步提交到指定的 Stream。
- [axclrtMemset](#axclrtMemset)：同步将设备内存中的字节设置为指定值。
- [axclrtMemsetAsync](#axclrtMemsetAsync)：将设备内存设置操作异步提交到指定的 Stream。
- [axclrtPointerGetAttributes](#axclrtPointerGetAttributes)：获取内存分配属性。

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
| devPtr | in | [axclrtMalloc](#axclrtMalloc)、[axclrtMallocCached](#axclrtMallocCached) 返回的设备内存基地址，或通过 [axclrtIpcMemImportByKey](#axclrtIpcMemImportByKey) 导入的设备内存基地址。 |

#### 2.1.3. 返回值

- `AXCL_SUCC`：成功释放设备内存。
- 其他错误：失败。

#### 2.1.4. 说明

- 本函数可以释放由 [axclrtMalloc](#axclrtMalloc) 或 [axclrtMallocCached](#axclrtMallocCached) 分配的设备内存，以及通过 [axclrtIpcMemImportByKey](#axclrtIpcMemImportByKey) 导入的本地虚拟地址映射。必须传入内存分配的基地址句柄，内部指针会被拒绝。
- 对于导入的内存（[axclrtIpcMemImportByKey](#axclrtIpcMemImportByKey)），本函数只释放本地虚拟地址映射，不释放 Producer 进程分配的底层 Device 物理内存。
- 对于本进程分配的设备内存，调用线程必须将拥有该内存的设备所对应的 Context 设为当前 Context。对于导入的内存，不需要当前 Context。
- 本函数成功后，`devPtr` 失效，不能再次使用。

#### 2.1.5. 参考

- [axclrtMalloc](#axclrtMalloc)
- [axclrtMallocCached](#axclrtMallocCached)
- [axclrtIpcMemImportByKey](#axclrtIpcMemImportByKey)

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
| hostPtr | in | [axclrtMallocHost](#axclrtMallocHost) 返回的 Host 虚拟内存基地址。不能为 NULL。 |

#### 2.2.3. 返回值

- `AXCL_SUCC`：成功释放 Host 内存。
- 其他错误：失败。

#### 2.2.4. 说明

- 本函数只能释放由 [axclrtMallocHost](#axclrtMallocHost) 分配的 Host 虚拟内存。内部指针、Device 地址以及已经释放的内存会被拒绝。
- 不需要当前 Context。释放内存时也不需要使用分配该内存时的设备。
- 至少需要一个可用的已激活设备。对于非 NULL 指针，会先检查该条件，再检查内存分配是否有效；如果没有满足条件的设备，本函数失败，该内存分配仍然有效。
- 调用本函数前，应用必须确保所有使用 `hostPtr` 的异步操作已经完成。
- 本函数需要与关闭设备的操作以及 [axclFinalize](system_api.md#axclFinalize) 串行调用。
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

<a id="axclrtIpcMemClose"></a>

### 2.4. axclrtIpcMemClose

关闭跨进程共享内存的 IPC Key。

#### 2.4.1. 函数

```c
AXCL_EXPORT axclError axclrtIpcMemClose(const char *key);
```

#### 2.4.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| key | in | 以空字符结尾的 IPC Key 字符串。不能为 NULL。 |

#### 2.4.3. 返回值

- `AXCL_SUCC`：成功释放调用进程为 `key` 持有的 IPC 引用。
- 其他错误：失败。

#### 2.4.4. 说明

- Producer 进程（调用 [axclrtIpcMemGetExportKey](#axclrtIpcMemGetExportKey) 的进程）和 Consumer 进程（调用 [axclrtIpcMemImportByKey](#axclrtIpcMemImportByKey) 的进程）都必须调用本函数，释放各自的 IPC 引用。
- 调用进程未持有 `key` 的 IPC 引用时，本函数失败。
- 每次调用释放一个 IPC 引用。多次导入 `key` 的进程必须针对每次导入各调用一次本函数。如果该进程同时也导出了 `key`，则先释放其导入引用，再释放其导出引用。
- Producer 进程关闭 `key` 后，新的 `key` 导入请求会失败。
- 对同一个 Key，所有 Consumer 进程应先于 Producer 进程调用 [axclrtIpcMemClose](#axclrtIpcMemClose)。
- 本函数释放驱动中的 IPC 引用，但不释放本地虚拟地址映射。请使用 [axclrtFree](#axclrtFree) 释放该内存指针。

#### 2.4.5. 参考

- [axclrtIpcMemGetExportKey](#axclrtIpcMemGetExportKey)
- [axclrtIpcMemImportByKey](#axclrtIpcMemImportByKey)
- [axclrtFree](#axclrtFree)

<br>

<a id="axclrtIpcMemGetExportKey"></a>

### 2.5. axclrtIpcMemGetExportKey

导出设备内存用于跨进程共享，并获取 IPC Key。

#### 2.5.1. 函数

```c
AXCL_EXPORT axclError axclrtIpcMemGetExportKey(void *devPtr, char *key, size_t len, uint32_t flags);
```

#### 2.5.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| devPtr | in | 要导出的设备内存基地址。不能为 NULL。 |
| key | out | 用于接收以空字符结尾的 IPC Key 字符串的缓冲区。不能为 NULL。 |
| len | in | `key` 的字节长度，必须等于 [AXCL_IPC_KEY_MAX_LEN](reference/macro.md#AXCL_IPC_KEY_MAX_LEN)。 |
| flags | in | 导出标志。必须为 [AXCL_IPC_EXPORT_FLAG_DEFAULT](reference/macro.md#AXCL_IPC_EXPORT_FLAG_DEFAULT) 或 [AXCL_IPC_EXPORT_FLAG_DISABLE_PID_VALIDATION](reference/macro.md#AXCL_IPC_EXPORT_FLAG_DISABLE_PID_VALIDATION)。 |

#### 2.5.3. 返回值

- `AXCL_SUCC`：成功导出设备内存，并将其 IPC Key 写入 `key`。
- 其他错误：失败。

#### 2.5.4. 说明

- `devPtr` 必须是调用进程通过 [axclrtMalloc](#axclrtMalloc) 或 [axclrtMallocCached](#axclrtMallocCached) 创建的内存分配的基地址。
- 内部偏移指针、通过 [axclrtIpcMemImportByKey](#axclrtIpcMemImportByKey) 导入的内存，以及通过 [axclrtMemMapDevAddr](#axclrtMemMapDevAddr) 注册的外部内存，都不能导出。
- 一个内存分配同一时间只能有一个已导出的 Key。在本进程通过 [axclrtIpcMemClose](#axclrtIpcMemClose) 关闭现有 Key 之前，再次导出会失败。

#### 2.5.5. 参考

- [axclrtIpcMemSetImportPid](#axclrtIpcMemSetImportPid)
- [axclrtIpcMemImportByKey](#axclrtIpcMemImportByKey)
- [axclrtIpcMemClose](#axclrtIpcMemClose)

<br>

<a id="axclrtIpcMemImportByKey"></a>

### 2.6. axclrtIpcMemImportByKey

通过 IPC Key 导入共享的设备内存。

#### 2.6.1. 函数

```c
AXCL_EXPORT axclError axclrtIpcMemImportByKey(void **devPtr, const char *key);
```

#### 2.6.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| devPtr | out | 用于返回调用者地址空间中导入的设备内存句柄。不能为 NULL。 |
| key | in | [axclrtIpcMemGetExportKey](#axclrtIpcMemGetExportKey) 返回的以空字符结尾的 IPC Key 字符串。不能为 NULL。 |

#### 2.6.3. 返回值

- `AXCL_SUCC`：成功导入共享的设备内存，并将其句柄写入 `devPtr`。
- 其他错误：失败。

#### 2.6.4. 说明

- 每次成功调用都会为共享的设备内存创建一个新的本地句柄，并持有 `key` 的一个 IPC 引用。同一进程再次导入同一 Key 时，返回不同的句柄。
- 拥有该共享内存的设备必须在调用进程中处于激活状态。
- `key` 不是当前已导出的 Key，或者该 Key 以 [AXCL_IPC_EXPORT_FLAG_DEFAULT](reference/macro.md#AXCL_IPC_EXPORT_FLAG_DEFAULT) 导出且调用进程不在其白名单中时，本函数失败。
- 对于每次成功导入，调用者都必须通过 [axclrtIpcMemClose](#axclrtIpcMemClose) 释放 IPC 引用，并通过 [axclrtFree](#axclrtFree) 释放本地句柄。不能将导入的句柄传给 [axclrtMemUnmapDevAddr](#axclrtMemUnmapDevAddr)。
- 导入的句柄没有 Native Device 虚拟地址；对该句柄调用 [axclrtMemGetDevAddr](#axclrtMemGetDevAddr) 时，device_va 返回 0。
- 生命周期约束：Producer 进程中内存分配的生命周期必须完全覆盖 Consumer 的使用期间。关闭 Key 或销毁 Consumer 句柄不会协调物理内存的保留；Producer 过早释放内存会导致未定义行为（悬空的硬件访问）。

#### 2.6.5. 参考

- [axclrtIpcMemGetExportKey](#axclrtIpcMemGetExportKey)
- [axclrtIpcMemClose](#axclrtIpcMemClose)
- [axclrtFree](#axclrtFree)

<br>

<a id="axclrtIpcMemSetImportPid"></a>

### 2.7. axclrtIpcMemSetImportPid

为已导出的 IPC Key 设置目标 Host TGID 白名单。

#### 2.7.1. 函数

```c
AXCL_EXPORT axclError axclrtIpcMemSetImportPid(const char *key, const int32_t *tgid_list, uint32_t num);
```

#### 2.7.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| key | in | [axclrtIpcMemGetExportKey](#axclrtIpcMemGetExportKey) 返回的以空字符结尾的 IPC Key 字符串。不能为 NULL。 |
| tgid_list | in | 目标进程 Host TGID（bare TGID）数组。不能为 NULL。 |
| num | in | `tgid_list` 中目标 Host TGID 的数量（1 <= num <= [AXCL_IPC_MAX_TARGETS](reference/macro.md#AXCL_IPC_MAX_TARGETS)）。 |

#### 2.7.3. 返回值

- `AXCL_SUCC`：成功设置 `key` 的导入白名单。
- 其他错误：失败。

#### 2.7.4. 说明

- 在 Docker、Kubernetes 等容器环境中，`tgid_list` 必须包含通过 [axclrtDeviceGetBareTgid](device_api.md#axclrtDeviceGetBareTgid) 获取的 bare Host TGID，不能使用 getpid() 返回的容器内 PID。
- 只有导出 `key` 的进程可以设置其白名单。每次调用都会替换之前的白名单。
- 白名单中的 TGID 仅对将该 TGID 加入白名单时已在运行的进程有效。请在 Consumer 进程启动后再设置白名单。
- 以 [AXCL_IPC_EXPORT_FLAG_DEFAULT](reference/macro.md#AXCL_IPC_EXPORT_FLAG_DEFAULT) 导出时，`num` 至少为 1。如需不受白名单限制的开放访问，请使用 [AXCL_IPC_EXPORT_FLAG_DISABLE_PID_VALIDATION](reference/macro.md#AXCL_IPC_EXPORT_FLAG_DISABLE_PID_VALIDATION) 导出，而不是配置白名单。为以 [AXCL_IPC_EXPORT_FLAG_DISABLE_PID_VALIDATION](reference/macro.md#AXCL_IPC_EXPORT_FLAG_DISABLE_PID_VALIDATION) 导出的 Key 设置白名单时，本函数失败。

#### 2.7.5. 参考

- [axclrtIpcMemGetExportKey](#axclrtIpcMemGetExportKey)
- [axclrtDeviceGetBareTgid](device_api.md#axclrtDeviceGetBareTgid)
- [axclrtIpcMemImportByKey](#axclrtIpcMemImportByKey)

<br>

<a id="axclrtMalloc"></a>

### 2.8. axclrtMalloc

在调用线程当前 Context 所属的设备上分配物理连续内存。

#### 2.8.1. 函数

```c
AXCL_EXPORT axclError axclrtMalloc(void **devPtr, size_t size, axclrtMemMallocPolicy policy);
```

#### 2.8.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| devPtr | out | 成功时返回表示设备内存的不透明句柄。 |
| size | in | 要分配的字节数，至少为 1，且不得超过 Device 侧 CMM 单次分配上限。 |
| policy | in | 设备内存分配策略。 |

#### 2.8.3. 返回值

- `AXCL_SUCC`：成功分配设备内存。
- 其他错误：失败。

#### 2.8.4. 说明

- 本接口不会初始化分配的内存；如需初始化，请调用 [axclrtMemset](#axclrtMemset)。
- `devPtr` 是供 AXCL API 使用的不透明句柄，不是 Host 指针，Host 应用不能直接解引用，也不能将其视为物理地址。
- 释放内存时，必须将同一设备的 Context 设为当前 Context，并使用基地址句柄调用 [axclrtFree](#axclrtFree)。
- 频繁申请和释放内存会影响性能，建议预先分配内存或进行二次管理。

#### 2.8.5. 示例

```c
 axclrtMalloc(&devMem, size, AXCL_MEM_MALLOC_HUGE_FIRST);
 axclrtMemcpy(devMem, hostMem, size, AXCL_MEMCPY_HOST_TO_DEVICE);
 axclrtFree(devMem);
```

#### 2.8.6. 参考

- [axclrtFree](#axclrtFree)

<br>

<a id="axclrtMallocCached"></a>

### 2.9. axclrtMallocCached

在当前 Context 所属的设备上分配 cached 物理连续内存。

#### 2.9.1. 函数

```c
AXCL_EXPORT axclError axclrtMallocCached(void **devPtr, size_t size, axclrtMemMallocPolicy policy);
```

#### 2.9.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| devPtr | out | 成功时返回表示 cached 设备内存的不透明句柄。 |
| size | in | 要分配的字节数，至少为 1，且不得超过 Device 侧 CMM 单次分配上限。 |
| policy | in | 设备内存分配策略。 |

#### 2.9.3. 返回值

- `AXCL_SUCC`：成功分配设备内存。
- 其他错误：失败。

#### 2.9.4. 说明

- 返回的内存分配会记录 [AXCL_POINTER_ATTRIBUTE_FLAG_CACHED](reference/enum.md#AXCL_POINTER_ATTRIBUTE_FLAG_CACHED) 属性，可以通过 [axclrtPointerGetAttributes](#axclrtPointerGetAttributes) 查询。
- `devPtr` 是供 AXCL API 使用的不透明句柄，Host 不能直接解引用，也不能将其视为物理地址。
- 根据需要调用 [axclrtMemFlush](#axclrtMemFlush) 和 [axclrtMemInvalidate](#axclrtMemInvalidate) 维护缓存一致性。
- 释放内存时，必须将同一设备的 Context 设为当前 Context，并使用基地址句柄调用 [axclrtFree](#axclrtFree)。

#### 2.9.5. 参考

- [axclrtFree](#axclrtFree)
- [axclrtMemFlush](#axclrtMemFlush)
- [axclrtMemInvalidate](#axclrtMemInvalidate)

<br>

<a id="axclrtMallocHost"></a>

### 2.10. axclrtMallocHost

分配 Host 虚拟内存。

#### 2.10.1. 函数

```c
AXCL_EXPORT axclError axclrtMallocHost(void **hostPtr, size_t size);
```

#### 2.10.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| hostPtr | out | 成功时返回 Host 可访问的虚拟地址。不能为 NULL。 |
| size | in | 要分配的字节数，必须大于 0。 |

#### 2.10.3. 返回值

- `AXCL_SUCC`：成功分配 Host 内存。
- 其他错误：失败。

#### 2.10.4. 说明

- 对于使用 Host 虚拟地址的复制方向，AXCL 内存复制接口也支持标准库 `malloc` 分配的内存。推荐使用本接口分配 Host 内存。
- 本接口分配的内存必须通过 [axclrtFreeHost](#axclrtFreeHost) 释放，不能使用标准库 `free`；标准库 `malloc` 分配的内存也必须使用标准库 `free` 释放。
- 该内存属于进程级 DMA 会话，可用于进程内任意已打开的设备，在被释放或进程内最后一个已打开的设备被 reset 之前一直有效。
- 不需要当前 Context，但至少需要有一个可用的已激活设备提供 DMA 会话。
- 本函数需要与关闭设备的操作以及 [axclFinalize](system_api.md#axclFinalize) 串行调用。

#### 2.10.5. 参考

- [axclrtFreeHost](#axclrtFreeHost)

<br>

<a id="axclrtMemFlush"></a>

### 2.11. axclrtMemFlush

将一段 cached 设备内存的 cache 数据写回 DDR。

#### 2.11.1. 函数

```c
AXCL_EXPORT axclError axclrtMemFlush(void *devPtr, size_t size);
```

#### 2.11.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| devPtr | in | 要刷新范围的起始设备内存句柄。 |
| size | in | 要刷新的字节数，至少为 1，且范围必须位于同一块已分配的 Device 内存内。 |

#### 2.11.3. 返回值

- `AXCL_SUCC`：成功刷新指定 cache 范围。
- 其他错误：失败。

#### 2.11.4. 说明

- 本函数用于处理 [axclrtMallocCached](#axclrtMallocCached) 返回的内存。
- 调用线程必须将拥有该内存的设备所对应的 Context 设为当前 Context。

#### 2.11.5. 参考

- [axclrtMallocCached](#axclrtMallocCached)
- [axclrtMemInvalidate](#axclrtMemInvalidate)

<br>

<a id="axclrtMemGetAddressRange"></a>

### 2.12. axclrtMemGetAddressRange

获取 AXCL runtime 管理的内存分配或外部注册的基地址句柄和大小。

#### 2.12.1. 函数

```c
AXCL_EXPORT axclError axclrtMemGetAddressRange(void *ptr, void **base, size_t *size);
```

#### 2.12.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| ptr | in | 内存分配或注册的起始地址或内部任意字节的地址。不能为 NULL。 |
| base | out | 用于返回其基地址句柄。不能为 NULL。 |
| size | out | 用于返回其分配或注册的总字节数。不能为 NULL。 |

#### 2.12.3. 返回值

- `AXCL_SUCC`：成功返回基地址和大小。
- 其他错误：失败。

#### 2.12.4. 说明

- 同时接受基地址和内部切片指针，二者返回相同的基地址句柄和总大小。
- 只接受 AXCL runtime 管理的设备内存句柄。`ptr` 不在有效的设备内存分配或注册范围内时（包括 [axclrtMallocHost](#axclrtMallocHost) 分配的 Host 内存），本函数失败。
- 对于通过 [axclrtMemMapDevAddr](#axclrtMemMapDevAddr) 注册的外部内存，返回该注册的基地址句柄和大小，即使该注册只描述 Native 内存分配的一个子范围。本函数不会还原原始 Native 内存分配的基地址。

<br>

<a id="axclrtMemGetDevAddr"></a>

### 2.13. axclrtMemGetDevAddr

由设备内存句柄导出底层的 Device 物理地址和虚拟地址。

#### 2.13.1. 函数

```c
AXCL_EXPORT axclError axclrtMemGetDevAddr(const void *devPtr, uint64_t access_size, axclrtDevMemDesc *desc);
```

#### 2.13.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| devPtr | in | AXCL runtime 管理的有效设备内存指针（基地址指针或内部切片）。不能为 NULL。 |
| access_size | in | 预期访问的字节跨度。为 0 时导出切片的剩余长度。不能超过从 `devPtr` 到其所属分配或注册末尾的字节数。 |
| desc | out | 用于返回物理地址和虚拟地址描述符。不能为 NULL。 |

#### 2.13.3. 返回值

- `AXCL_SUCC`：成功返回 Device 地址。
- 其他错误：失败。

#### 2.13.4. 说明

- 对于内部指针，Device 物理地址和非零的 Device 虚拟地址都会按其在所属分配或注册中的偏移量前移；缺失的 Device 虚拟地址仍为 0。返回的地址已经包含该偏移量，不能再次叠加。
- 当 Native API 需要 Device 虚拟地址时，请保留返回的 Device 虚拟地址。调用者必须确保该 Native API 在该虚拟地址有效的设备地址空间中执行，并且底层内存保持有效。

<br>

<a id="axclrtMemInvalidate"></a>

### 2.14. axclrtMemInvalidate

使一段 cached 设备内存对应的 cache 内容失效。

#### 2.14.1. 函数

```c
AXCL_EXPORT axclError axclrtMemInvalidate(void *devPtr, size_t size);
```

#### 2.14.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| devPtr | in | 要使 cache 失效范围的起始设备内存句柄。 |
| size | in | 要处理的字节数，至少为 1，且范围必须位于同一块已分配的 Device 内存内。 |

#### 2.14.3. 返回值

- `AXCL_SUCC`：成功使指定 cache 范围失效。
- 其他错误：失败。

#### 2.14.4. 说明

- 本函数用于处理 [axclrtMallocCached](#axclrtMallocCached) 返回的内存。
- 调用线程必须将拥有该内存的设备所对应的 Context 设为当前 Context。

#### 2.14.5. 参考

- [axclrtMallocCached](#axclrtMallocCached)
- [axclrtMemFlush](#axclrtMemFlush)

<br>

<a id="axclrtMemMapDevAddr"></a>

### 2.15. axclrtMemMapDevAddr

将外部设备内存（例如来自 Native 模块的内存）注册为临时映射的设备指针。

#### 2.15.1. 函数

```c
AXCL_EXPORT axclError axclrtMemMapDevAddr(const axclrtDevMemDesc *desc, void **devPtr);
```

#### 2.15.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| desc | in | 描述该区间的 Device 物理地址、可选的 Native Device 虚拟地址、大小和设备 ID。不能为 NULL。desc->size 和 desc->device_pa 必须非零，desc->flags 必须为 0，desc->device_id 必须对应一个在调用进程中已激活的设备。 |
| devPtr | out | 用于返回本次注册的基地址句柄，其偏移 0 对应 desc->device_pa。调用 [axclrtMemUnmapDevAddr](#axclrtMemUnmapDevAddr) 时必须传入该值本身。不能为 NULL。 |

#### 2.15.3. 返回值

- `AXCL_SUCC`：成功注册外部设备内存。
- 其他错误：失败。

#### 2.15.4. 说明

- 严格按传入的区间注册，并保留其物理地址和虚拟地址。该区间可以从 Native 内存分配的基地址或内部任意字节开始。本函数不会查找原始分配的基地址，也不会扩展范围。
- device_pa 必须是 Device 物理地址，例如 Native API 或 [axclrtMemGetDevAddr](#axclrtMemGetDevAddr) 返回的地址。将 AXCL 返回的设备内存句柄作为 device_pa 传入会被拒绝。device_va 是 Device 侧地址，因此不做检查。
- 本操作只创建句柄，既不创建 Native 虚拟地址映射，也不接管所有权。Native API 输出虚拟地址时必须保留该地址；该 API 不提供虚拟地址时可以为 0。
- 调用者必须确保非零的物理地址和虚拟地址指向指定设备上的同一字节，整个区间都有有效内存支撑，并且该虚拟地址在使用它的 Native 执行上下文中有效。runtime 的范围检查只校验描述符的数值边界，不校验其 Native 内存支撑或地址对应关系。
- 在所有使用该句柄的操作完成并移除本次注册之前，Native 内存及其 Native 虚拟地址映射必须保持有效。请保留原始 Native 内存分配和映射句柄，用于 Native 释放。
- 允许注册重叠的区间。调用者必须协调所有使用者，并在每个注册和每个 Native 使用者都结束前保留底层内存；本函数不提供自动的生命周期跟踪。

<br>

<a id="axclrtMemUnmapDevAddr"></a>

### 2.16. axclrtMemUnmapDevAddr

注销通过 [axclrtMemMapDevAddr](#axclrtMemMapDevAddr) 注册的外部设备内存。

#### 2.16.1. 函数

```c
AXCL_EXPORT axclError axclrtMemUnmapDevAddr(void *devPtr);
```

#### 2.16.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| devPtr | in | [axclrtMemMapDevAddr](#axclrtMemMapDevAddr) 返回的设备内存基地址指针。不能为 NULL。 |

#### 2.16.3. 返回值

- `AXCL_SUCC`：成功注销外部设备内存。
- 其他错误：失败。

#### 2.16.4. 说明

- 必须传入 [axclrtMemMapDevAddr](#axclrtMemMapDevAddr) 返回的基地址句柄本身，注册的是子范围时也是如此。内部指针以及并非由 [axclrtMemMapDevAddr](#axclrtMemMapDevAddr) 创建的句柄（例如 [axclrtMalloc](#axclrtMalloc) 返回的句柄）会被拒绝。
- 同一句柄正在被其他线程并发释放时，本函数失败。
- 只移除本次注册，不释放 Native 内存，不解除 Native 虚拟地址映射，也不移除其他注册。调用者必须先完成使用该句柄的操作，然后在这些资源的所有使用者都结束后，使用原始句柄通过对应的 Native API 释放 Native 资源。
- 设备 reset 会移除该设备上的所有注册。reset 前获得的句柄必须丢弃，不能传给本函数；之后的注册可能得到数值相同的句柄。

<br>

<a id="axclrtMemcmp"></a>

### 2.17. axclrtMemcmp

同步判断两段设备内存中的字节是否完全相同。

#### 2.17.1. 函数

```c
AXCL_EXPORT axclError axclrtMemcmp(const void *devPtr1, const void *devPtr2, size_t count);
```

#### 2.17.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| devPtr1 | in | 第一段设备内存的地址。 |
| devPtr2 | in | 第二段设备内存的地址。 |
| count | in | 要比较的字节数，至少为 1，且每个范围都必须位于一块已分配的 Device 内存内。 |

#### 2.17.3. 返回值

- `AXCL_SUCC`：比较的字节完全相同。
- 其他错误：失败。

#### 2.17.4. 说明

- 本接口不返回三路比较结果。字节内容不同时同样返回非成功值，因此非成功返回值无法区分内容不同和执行失败。
- 调用线程必须将拥有这两段内存的设备所对应的 Context 设为当前 Context。

#### 2.17.5. 参考

- [axclrtMemcmpAsync](#axclrtMemcmpAsync)

<br>

<a id="axclrtMemcmpAsync"></a>

### 2.18. axclrtMemcmpAsync

将两段设备内存的比较操作异步提交到指定的 Stream。

#### 2.18.1. 函数

```c
AXCL_EXPORT axclError axclrtMemcmpAsync(const void *devPtr1, const void *devPtr2, size_t count, axclrtStream stream);
```

#### 2.18.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| devPtr1 | in | 第一段设备内存的地址。 |
| devPtr2 | in | 第二段设备内存的地址。 |
| count | in | 要比较的字节数，至少为 1，且每个范围都必须位于一块已分配的 Device 内存内。 |
| stream | in | 接收比较操作的 Stream。 |

#### 2.18.3. 返回值

- `AXCL_SUCC`：成功提交比较操作。
- 其他错误：失败。

#### 2.18.4. 说明

- 本接口将比较任务提交到指定的 Stream 即返回，成功返回不表示比较已经完成。
- 成功返回表示请求已发送到 Device，不表示 Device 已接受该请求。Device 接受或执行比较操作时产生的错误，由 `stream` 上的下一次 [axclrtSynchronizeStream](stream_api.md#axclrtSynchronizeStream) 返回。
- 本异步接口不返回两段内存是否相等。如果需要比较结果，请使用同步接口 [axclrtMemcmp](#axclrtMemcmp)。
- 两段内存都必须属于 `stream` 所关联的设备，并且在操作完成前保持有效。

#### 2.18.5. 参考

- [axclrtMemcmp](#axclrtMemcmp)
- [axclrtSynchronizeStream](stream_api.md#axclrtSynchronizeStream)

<br>

<a id="axclrtMemcpy"></a>

### 2.19. axclrtMemcpy

在 Host 或设备内存之间同步复制字节。

#### 2.19.1. 函数

```c
AXCL_EXPORT axclError axclrtMemcpy(void *dstPtr, const void *srcPtr, size_t count, axclrtMemcpyKind kind);
```

#### 2.19.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| dstPtr | in | 目标地址，其含义由 `kind` 决定。 |
| srcPtr | in | 源地址，其含义由 `kind` 决定。 |
| count | in | 要复制的字节数，必须大于 0。 |
| kind | in | 复制方向及地址类型。 |

#### 2.19.3. 返回值

- `AXCL_SUCC`：成功完成复制。
- 其他错误：失败。

#### 2.19.4. 说明

- 本函数为同步接口，即在复制完成后返回。
- 本函数支持 [axclrtMemcpyKind](reference/enum.md#axclrtMemcpyKind) 的全部取值，包括同一设备内和不同设备之间的 Device-to-Device 复制。
- 调用线程必须已有当前 Context，并且源、目标内存范围在函数返回前必须保持有效。所有设备内存必须属于该 Context 所关联的设备；不同设备之间的 Device-to-Device 复制除外，此时当前设备必须拥有源内存或目标内存之一，并且必须已通过 [axclrtDeviceEnablePeerAccess](device_api.md#axclrtDeviceEnablePeerAccess) 启用到另一设备的 Peer Access。
- 仅当两个设备位于同一卡上时，才支持不同设备之间的 Device-to-Device 复制；位于不同卡上的设备之间的复制会失败，即使已启用 Peer Access。

#### 2.19.5. 示例

以下伪代码将数据从 Host 复制到设备，再复制回 Host。

```c
 axclrtMemcpy(devMem, hostSrc, size, AXCL_MEMCPY_HOST_TO_DEVICE);
 axclrtMemcpy(hostDst, devMem, size, AXCL_MEMCPY_DEVICE_TO_HOST);
```

更完整的同步拷贝流程参见 [同步拷贝](../arch/memory.md#memory-synchronous-copy)，设备间拷贝参见 [设备间拷贝](../arch/memory.md#memory-inter-device-copy)。

#### 2.19.6. 参考

- [axclrtMemcpyAsync](#axclrtMemcpyAsync)
- [axclrtMalloc](#axclrtMalloc)
- [axclrtMallocHost](#axclrtMallocHost)

<br>

<a id="axclrtMemcpy2d"></a>

### 2.20. axclrtMemcpy2d

在 Host 与设备内存之间同步复制一个二维矩形区域。

复制 `height` 行，每行 `width` 字节：第 y 行从 `srcPtr` + y * `spitch` 复制到 `dstPtr` + y * `dpitch`。一行末尾到下一行起始之间的字节（padding）不会被读取或写入。

#### 2.20.1. 函数

```c
AXCL_EXPORT axclError axclrtMemcpy2d(void *dstPtr, size_t dpitch, const void *srcPtr, size_t spitch, size_t width, size_t height, axclrtMemcpyKind kind);
```

#### 2.20.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| dstPtr | out | 目标矩形第一行的地址，其含义由 `kind` 决定。 |
| dpitch | in | 目标内存中相邻两行起始地址之间的字节数，不能小于 `width`。 |
| srcPtr | in | 源矩形第一行的地址，其含义由 `kind` 决定。 |
| spitch | in | 源内存中相邻两行起始地址之间的字节数，不能小于 `width`。 |
| width | in | 每行复制的字节数，必须大于 0。 |
| height | in | 复制的行数，必须大于 0，且不超过 UINT32_MAX。 |
| kind | in | 仅支持 [AXCL_MEMCPY_HOST_TO_DEVICE](reference/enum.md#AXCL_MEMCPY_HOST_TO_DEVICE) 和 [AXCL_MEMCPY_DEVICE_TO_HOST](reference/enum.md#AXCL_MEMCPY_DEVICE_TO_HOST)。 |

#### 2.20.3. 返回值

- `AXCL_SUCC`：成功完成复制。
- 其他错误：失败。

#### 2.20.4. 说明

- 本函数为同步接口，即在复制完成后返回。
- 不支持 [AXCL_MEMCPY_HOST_TO_HOST](reference/enum.md#AXCL_MEMCPY_HOST_TO_HOST) 和 [AXCL_MEMCPY_DEVICE_TO_DEVICE](reference/enum.md#AXCL_MEMCPY_DEVICE_TO_DEVICE)，传入时返回 AXCL_ERR_RT_UNSUPPORT。
- 每一端的跨度为 (`height` - 1) * pitch + `width` 字节。设备端的整个跨度必须位于当前 Context 所属设备上的同一块设备内存内，例如同一块由 [axclrtMalloc](#axclrtMalloc) 或 [axclrtMallocCached](#axclrtMallocCached) 分配的内存。
- Host 端的整个跨度（包括 padding）必须是已映射的内存；Device-to-Host 复制时还必须可写。
- 复制完成前，CPU 不能读写 Host 端跨度内的任何部分，包括 padding。
- 在非 DMA coherent 的设备上（所有 AX8860 本地设备都属于此类），把设备数据复制到普通 Host 内存（例如 malloc 分配的内存）会返回 AXCL_ERR_COMM_UNSUPPORT，除非两端的 pitch 都等于 `width`，或 `height` 为 1。请改用 [axclrtMallocHost](#axclrtMallocHost) 分配的内存，它在所有设备上都可用。
- 行很短、行数很多时，复制速度低于相同数据量的一次连续复制。条件允许时，请合并连续的行。
- 与 CANN 不同，除 `height` 不超过 UINT32_MAX 外，`width` 和 `height` 没有其他固定上限。

#### 2.20.5. 示例

以下伪代码省略错误处理，把 256 行、每行 1000 字节的数据，从行间距为 1024 字节的 Host 内存复制到行间距为 2048 字节的设备内存，再复制回 Host。

```c
const size_t width = 1000;
const size_t height = 256;
const size_t hostPitch = 1024;
const size_t devPitch = 2048;
void *hostSrc = NULL;
void *hostDst = NULL;
void *devMem = NULL;

/* 分配 Host 和设备内存；每一端按各自的 pitch 存放 height 行。 */
axclrtMallocHost(&hostSrc, hostPitch * height);
axclrtMallocHost(&hostDst, hostPitch * height);
axclrtMalloc(&devMem, devPitch * height, AXCL_MEM_MALLOC_HUGE_FIRST);

/* Host -> Device：复制每行的前 width 字节，padding 不复制。 */
axclrtMemcpy2d(devMem, devPitch, hostSrc, hostPitch, width, height, AXCL_MEMCPY_HOST_TO_DEVICE);

/* Device -> Host。 */
axclrtMemcpy2d(hostDst, hostPitch, devMem, devPitch, width, height, AXCL_MEMCPY_DEVICE_TO_HOST);

axclrtFree(devMem);
axclrtFreeHost(hostDst);
axclrtFreeHost(hostSrc);
```

#### 2.20.6. 参考

- [axclrtMemcpy2dAsync](#axclrtMemcpy2dAsync)
- [axclrtMemcpy](#axclrtMemcpy)
- [axclrtMallocHost](#axclrtMallocHost)

<br>

<a id="axclrtMemcpy2dAsync"></a>

### 2.21. axclrtMemcpy2dAsync

将 Host 与设备内存之间的二维矩形复制操作异步提交到指定的 Stream。

矩形、参数和约束与 [axclrtMemcpy2d](#axclrtMemcpy2d) 相同，在 `stream` 上按提交顺序执行。

#### 2.21.1. 函数

```c
AXCL_EXPORT axclError axclrtMemcpy2dAsync(void *dstPtr, size_t dpitch, const void *srcPtr, size_t spitch, size_t width, size_t height, axclrtMemcpyKind kind, axclrtStream stream);
```

#### 2.21.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| dstPtr | out | 目标矩形第一行的地址，其含义由 `kind` 决定。 |
| dpitch | in | 目标内存中相邻两行起始地址之间的字节数，不能小于 `width`。 |
| srcPtr | in | 源矩形第一行的地址，其含义由 `kind` 决定。 |
| spitch | in | 源内存中相邻两行起始地址之间的字节数，不能小于 `width`。 |
| width | in | 每行复制的字节数，必须大于 0。 |
| height | in | 复制的行数，必须大于 0，且不超过 UINT32_MAX。 |
| kind | in | 仅支持 [AXCL_MEMCPY_HOST_TO_DEVICE](reference/enum.md#AXCL_MEMCPY_HOST_TO_DEVICE) 和 [AXCL_MEMCPY_DEVICE_TO_HOST](reference/enum.md#AXCL_MEMCPY_DEVICE_TO_HOST)。 |
| stream | in | 接收复制操作的 Stream，不能为 NULL。 |

#### 2.21.3. 返回值

- `AXCL_SUCC`：成功提交复制操作。
- 其他错误：失败。

#### 2.21.4. 说明

- 本函数为异步接口，成功返回只表示复制操作已提交，不表示复制已经完成。复制执行时产生的错误由 `stream` 上的下一次 [axclrtSynchronizeStream](stream_api.md#axclrtSynchronizeStream) 返回。例如，在 [axclrtMemcpy2d](#axclrtMemcpy2d) 返回 AXCL_ERR_COMM_UNSUPPORT 的情况下，本函数仍会成功提交复制，同步时返回 AXCL_ERR_COMM_UNSUPPORT。
- 支持的复制方向和内存要求与 [axclrtMemcpy2d](#axclrtMemcpy2d) 相同，区别是设备端范围必须属于 `stream` 所关联的设备。
- 与 CANN 不同，即使 Host 内存是 malloc 分配的普通内存，本函数也在提交后返回。同步 `stream` 之前，两端内存必须保持有效，CPU 不能访问 Host 端跨度内的任何部分，包括 padding。
- 复制操作与 `stream` 上的其他任务按提交顺序执行。

#### 2.21.5. 示例

以下伪代码省略错误处理，把 [axclrtMemcpy2d](#axclrtMemcpy2d) 示例中的两次复制提交到一个 Stream，并等待两者完成。

```c
const size_t width = 1000;
const size_t height = 256;
const size_t hostPitch = 1024;
const size_t devPitch = 2048;
void *hostSrc = NULL;
void *hostDst = NULL;
void *devMem = NULL;
axclrtStream stream = NULL;

axclrtCreateStream(&stream);
axclrtMallocHost(&hostSrc, hostPitch * height);
axclrtMallocHost(&hostDst, hostPitch * height);
axclrtMalloc(&devMem, devPitch * height, AXCL_MEM_MALLOC_HUGE_FIRST);

/* 两次复制在 Stream 上按顺序执行。 */
axclrtMemcpy2dAsync(devMem, devPitch, hostSrc, hostPitch, width, height, AXCL_MEMCPY_HOST_TO_DEVICE, stream);
axclrtMemcpy2dAsync(hostDst, hostPitch, devMem, devPitch, width, height, AXCL_MEMCPY_DEVICE_TO_HOST, stream);

/* 同步返回之前，不能访问 hostSrc 或 hostDst，包括 padding。 */
axclrtSynchronizeStream(stream);

axclrtFree(devMem);
axclrtFreeHost(hostDst);
axclrtFreeHost(hostSrc);
axclrtDestroyStream(stream);
```

#### 2.21.6. 参考

- [axclrtMemcpy2d](#axclrtMemcpy2d)
- [axclrtSynchronizeStream](stream_api.md#axclrtSynchronizeStream)

<br>

<a id="axclrtMemcpyAsync"></a>

### 2.22. axclrtMemcpyAsync

将 Host 或设备内存复制操作异步提交到指定的 Stream。

#### 2.22.1. 函数

```c
AXCL_EXPORT axclError axclrtMemcpyAsync(void *dstPtr, const void *srcPtr, size_t count, axclrtMemcpyKind kind, axclrtStream stream);
```

#### 2.22.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| dstPtr | in | 目标地址，其含义由 `kind` 决定。 |
| srcPtr | in | 源地址，其含义由 `kind` 决定。 |
| count | in | 要复制的字节数，必须大于 0。 |
| kind | in | 复制方向及地址类型。[AXCL_MEMCPY_DEVICE_TO_DEVICE](reference/enum.md#AXCL_MEMCPY_DEVICE_TO_DEVICE) 支持同一设备内和不同设备之间的复制。 |
| stream | in | 接收复制操作的 Stream。不能为 NULL。 |

#### 2.22.3. 返回值

- `AXCL_SUCC`：成功提交复制操作。
- 其他错误：失败。

#### 2.22.4. 说明

- 本函数为异步接口，成功返回只表示复制操作已提交，不表示复制已经完成。使用目标内存或释放任一内存前，必须同步 `stream`，例如调用 [axclrtSynchronizeStream](stream_api.md#axclrtSynchronizeStream)。
- 成功返回表示请求已发送到 Device，不表示 Device 已接受该请求。Device 接受或执行复制操作时产生的错误，由 `stream` 上的下一次 [axclrtSynchronizeStream](stream_api.md#axclrtSynchronizeStream) 返回。
- 本函数支持 Host-to-Host、Host-to-Device、Device-to-Host 复制，以及同一设备内和不同设备之间的 Device-to-Device 复制。
- 复制操作与 `stream` 上的其他任务（包括 Host-to-Host 复制）按提交顺序执行。
- 所有设备内存必须属于 `stream` 所关联的设备；不同设备之间的 Device-to-Device 复制除外，此时 `stream` 所关联的设备必须拥有源内存或目标内存之一，并且必须已通过 [axclrtDeviceEnablePeerAccess](device_api.md#axclrtDeviceEnablePeerAccess) 启用该设备到另一设备的 Peer Access。源、目标内存范围在复制完成前必须保持有效。
- 仅当两个设备位于同一卡上时，才支持不同设备之间的 Device-to-Device 复制；位于不同卡上的设备之间的复制会失败，即使已启用 Peer Access。

#### 2.22.5. 示例

有关 H2D 异步拷贝、异步推理、D2H 异步拷贝和 Stream 同步的完整流程，参见 [异步拷贝](../arch/memory.md#memory-asynchronous-copy)。

#### 2.22.6. 参考

- [axclrtMemcpy](#axclrtMemcpy)
- [axclrtSynchronizeStream](stream_api.md#axclrtSynchronizeStream)

<br>

<a id="axclrtMemset"></a>

### 2.23. axclrtMemset

同步将设备内存中的字节设置为指定值。

#### 2.23.1. 函数

```c
AXCL_EXPORT axclError axclrtMemset(void *devPtr, uint8_t value, size_t count);
```

#### 2.23.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| devPtr | in | 开始写入的设备内存地址。 |
| value | in | 要写入的字节值。 |
| count | in | 要设置的字节数，至少为 1，且范围必须位于同一块已分配的 Device 内存内。 |

#### 2.23.3. 返回值

- `AXCL_SUCC`：成功设置设备内存。
- 其他错误：失败。

#### 2.23.4. 说明

- 本函数仅支持设备内存，并在操作完成后返回。
- 调用线程必须将拥有该内存的设备所对应的 Context 设为当前 Context。

#### 2.23.5. 参考

- [axclrtMemsetAsync](#axclrtMemsetAsync)

<br>

<a id="axclrtMemsetAsync"></a>

### 2.24. axclrtMemsetAsync

将设备内存设置操作异步提交到指定的 Stream。

#### 2.24.1. 函数

```c
AXCL_EXPORT axclError axclrtMemsetAsync(void *devPtr, uint8_t value, size_t count, axclrtStream stream);
```

#### 2.24.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| devPtr | in | 开始写入的设备内存地址。 |
| value | in | 要写入的字节值。 |
| count | in | 要设置的字节数，至少为 1，且范围必须位于同一块已分配的 Device 内存内。 |
| stream | in | 接收该操作的 Stream。 |

#### 2.24.3. 返回值

- `AXCL_SUCC`：成功提交内存设置操作。
- 其他错误：失败。

#### 2.24.4. 说明

- 本接口为异步接口，成功返回不表示内存已经更新。读取或释放内存前，必须同步 `stream`。
- 成功返回表示请求已发送到 Device，不表示 Device 已接受该请求。Device 接受或执行该操作时产生的错误，由 `stream` 上的下一次 [axclrtSynchronizeStream](stream_api.md#axclrtSynchronizeStream) 返回。
- `devPtr` 必须属于 `stream` 所关联的设备，并且在操作完成前保持有效。

#### 2.24.5. 参考

- [axclrtMemset](#axclrtMemset)
- [axclrtSynchronizeStream](stream_api.md#axclrtSynchronizeStream)

<br>

<a id="axclrtPointerGetAttributes"></a>

### 2.25. axclrtPointerGetAttributes

获取内存分配属性。

#### 2.25.1. 函数

```c
AXCL_EXPORT axclError axclrtPointerGetAttributes(const void *ptr, axclrtPtrAttributes *attributes);
```

#### 2.25.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| ptr | in | 内存分配的起始地址或内部任意字节的地址。不能为 NULL。 |
| attributes | out | 用于返回指针属性。不能为 NULL。 |

#### 2.25.3. 返回值

- `AXCL_SUCC`：成功返回指针属性。
- 其他错误：失败。

#### 2.25.4. 说明

- 运行时会记录当前进程中通过 [axclrtMalloc](#axclrtMalloc)、[axclrtMallocCached](#axclrtMallocCached) 和 [axclrtMallocHost](#axclrtMallocHost) 创建的内存分配，以及通过 [axclrtMemMapDevAddr](#axclrtMemMapDevAddr) 和 [axclrtIpcMemImportByKey](#axclrtIpcMemImportByKey) 创建的设备内存句柄。
- 对于已记录的内存，本函数返回其 Host 或设备位置类型。设备内存的位置 ID 为拥有该内存的设备的虚拟设备 ID；Host 内存的位置 ID 为 `-1`。[axclrtMallocCached](#axclrtMallocCached) 分配的内存，以及通过 [axclrtIpcMemImportByKey](#axclrtIpcMemImportByKey) 从此类内存导入的内存，还会设置 [AXCL_POINTER_ATTRIBUTE_FLAG_CACHED](reference/enum.md#AXCL_POINTER_ATTRIBUTE_FLAG_CACHED) 标志。
- 如果 `ptr` 不在任何已跟踪的内存分配内，本函数仍返回 [AXCL_SUCC](reference/enum.md#AXCL_SUCC)，同时将位置类型设置为 [AXCL_MEM_LOCATION_TYPE_UNREGISTERED](reference/enum.md#AXCL_MEM_LOCATION_TYPE_UNREGISTERED)、位置 ID 设置为 `-1`，并将 `flags` 设置为 `0`。
