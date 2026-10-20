# axcl.sys

## 1. 目录

- [axcl.sys.init](#axcl.sys.init): 初始化媒体子系统的系统控制模块。调用依赖 SYS 的其他媒体子系统服务前，必须先调用本接口。单进程模式下，重复调用返回成功且不产生其他效果。多进程模式下，每个进程必须分别调用本接口。
- [axcl.sys.deinit](#axcl.sys.deinit): 去初始化媒体子系统的系统控制模块。不再使用媒体子系统服务后，调用本接口。单进程模式下，重复调用返回成功且不产生其他效果。多进程模式下，每个进程必须分别调用本接口。
- [axcl.sys.mem_alloc](#axcl.sys.mem_alloc): 从 CMM 分区分配不可缓存的连续内存。本接口分配可供通用用途使用的物理连续内存块。返回的物理地址必须通过相应接口释放（源码未提供接口引用）。
- [axcl.sys.mem_alloc_cached](#axcl.sys.mem_alloc_cached): 从 CMM 分区分配可缓存的连续内存。本接口分配物理连续内存块，并将其映射为可缓存内存。与硬件共享缓冲区时，需使用缓存维护接口。
- [axcl.sys.mem_free](#axcl.sys.mem_free): 释放已分配的内存（源码未提供分配接口引用）。
- [axcl.sys.mmap](#axcl.sys.mmap): 将物理内存映射到不可缓存的用户虚拟地址。映射由 /dev/axdev/ax_cmm 处理。输入物理范围可以是 CMM 管理的内存，也可以是不受 CMM 管理的任意有效 DDR 物理范围。
- [axcl.sys.mmap_cache](#axcl.sys.mmap_cache): 将物理内存映射到可缓存的用户虚拟地址。映射由 /dev/axdev/ax_cmm 处理。输入物理范围可以是 CMM 管理的内存，也可以是不受 CMM 管理的任意有效 DDR 物理范围。
- [axcl.sys.mmap_fast](#axcl.sys.mmap_fast): 通过快速映射路径，将物理内存映射到不可缓存的用户虚拟地址。对于 CMM 管理的内存，SDK 映射整个已分配内存块；若映射已存在，则复用它。对于不受管理的 DDR 内存，SDK 每次调用均映射指定物理范围。
- [axcl.sys.mmap_cache_fast](#axcl.sys.mmap_cache_fast): 通过快速映射路径，将物理内存映射到可缓存的用户虚拟地址。对于 CMM 管理的内存，SDK 映射整个已分配内存块；若映射已存在，则复用它。对于不受管理的 DDR 内存，SDK 每次调用均映射指定物理范围。
- [axcl.sys.munmap](#axcl.sys.munmap): 解除 AX_SYS_Mmap 接口返回的用户虚拟地址映射。
- [axcl.sys.mflush_cache](#axcl.sys.mflush_cache): 将 CPU 缓存内容刷新到 DDR 内存，并使缓存行失效。硬件读取最近由 CPU 修改的数据前，需调用本接口。
- [axcl.sys.minvalidate_cache](#axcl.sys.minvalidate_cache): CPU 读取共享 DDR 内存前，使 CPU 缓存失效。
- [axcl.sys.mem_get_block_info_by_phy](#axcl.sys.mem_get_block_info_by_phy): 通过内存块内部的物理地址查询 CMM 内存块信息。
- [axcl.sys.mem_get_block_info_by_virt](#axcl.sys.mem_get_block_info_by_virt): 通过用户虚拟地址查询 CMM 内存块物理地址和内存类型。
- [axcl.sys.mem_get_partition_info](#axcl.sys.mem_get_partition_info): 获取当前 CMM 分区配置信息。
- [axcl.sys.mem_set_config](#axcl.sys.mem_set_config): 配置模块使用的 CMM 分区名称。
- [axcl.sys.mem_get_config](#axcl.sys.mem_get_config): 获取为模块配置的 CMM 分区名称。
- [axcl.sys.mem_set_param](#axcl.sys.mem_set_param): 配置模块内存类别使用的 CMM 分区名称。本接口扩展了（源码说明不完整）。
- [axcl.sys.mem_get_param](#axcl.sys.mem_get_param): 获取为模块内存类别配置的 CMM 分区名称。
- [axcl.sys.mem_query_status](#axcl.sys.mem_query_status): 查询当前 CMM 内存使用状态。
- [axcl.sys.mem_get_max_free_region_info](#axcl.sys.mem_get_max_free_region_info): 获取最大连续空闲 CMM 区域的起始物理地址和大小。
- [axcl.sys.link](#axcl.sys.link): 将数据源绑定到数据接收端。
- [axcl.sys.un_link](#axcl.sys.un_link): 解除数据源与数据接收端的绑定。
- [axcl.sys.get_link_by_dest](#axcl.sys.get_link_by_dest): 通过目标模块信息获取源模块信息。
- [axcl.sys.get_link_by_src](#axcl.sys.get_link_by_src): 获取与源模块绑定的所有目标模块信息。
- [axcl.sys.get_cur_pts](#axcl.sys.get_cur_pts): 获取当前媒体时间戳，单位为微秒。
- [axcl.sys.init_pts_base](#axcl.sys.init_pts_base): 设置媒体时间戳基准，单位为微秒。
- [axcl.sys.sync_pts](#axcl.sys.sync_pts): 同步媒体时间戳基准，单位为微秒。
- [axcl.sys.set_log_level](#axcl.sys.set_log_level): 设置 SYS 日志级别。
- [axcl.sys.set_log_target](#axcl.sys.set_log_target): 设置 SYS 日志输出目标。
- [axcl.sys.enable_timestamp](#axcl.sys.enable_timestamp): 启用或禁用 SYS 日志时间戳。
- [axcl.sys.get_chip_type](#axcl.sys.get_chip_type): 获取当前芯片类型。
- [axcl.sys.sleep](#axcl.sys.sleep): 请求系统进入休眠模式。
- [axcl.sys.wake_lock](#axcl.sys.wake_lock): 为模块获取用户态 WakeLock。
- [axcl.sys.wake_unlock](#axcl.sys.wake_unlock): 释放模块的用户态 WakeLock。
- [axcl.sys.register_event_cb](#axcl.sys.register_event_cb): 为模块注册休眠/唤醒事件回调函数。
- [axcl.sys.unregister_event_cb](#axcl.sys.unregister_event_cb): 注销模块的休眠/唤醒事件回调函数。
- [axcl.sys.sleep_time_stamp](#axcl.sys.sleep_time_stamp): 在用户态休眠/唤醒流程中添加时间戳点。

<br>

## 2. API

<a id="axcl.sys.init"></a>

### 2.1. axcl.sys.init

初始化媒体子系统的系统控制模块。调用依赖 SYS 的其他媒体子系统服务前，必须先调用本接口。单进程模式下，重复调用返回成功且不产生其他效果。多进程模式下，每个进程必须分别调用本接口。

#### 2.1.1. 函数

**Python 调用**

```python
ret = axcl.sys.init()
```

**C++ 原型**

```cpp
AX_S32 AX_SYS_Init(void);
```

#### 2.1.2. 参数

不适用

#### 2.1.3. 返回值

- `ret`: *int* — 成功。失败；返回 SYS 错误码。

#### 2.1.4. 说明

返回类型：`int`。

源码：`python/axcl/sys/ax_sys.py:1011`。

#### 2.1.5. 示例

```python
ret = axcl.sys.init()
```

<br>

<a id="axcl.sys.deinit"></a>

### 2.2. axcl.sys.deinit

去初始化媒体子系统的系统控制模块。不再使用媒体子系统服务后，调用本接口。单进程模式下，重复调用返回成功且不产生其他效果。多进程模式下，每个进程必须分别调用本接口。

#### 2.2.1. 函数

**Python 调用**

```python
ret = axcl.sys.deinit()
```

**C++ 原型**

```cpp
AX_S32 AX_SYS_Deinit(void);
```

#### 2.2.2. 参数

不适用

#### 2.2.3. 返回值

- `ret`: *int* — 成功。失败；返回 SYS 错误码。

#### 2.2.4. 说明

返回类型：`int`。

源码：`python/axcl/sys/ax_sys.py:1039`。

#### 2.2.5. 示例

```python
ret = axcl.sys.deinit()
```

<br>

<a id="axcl.sys.mem_alloc"></a>

### 2.3. axcl.sys.mem_alloc

从 CMM 分区分配不可缓存的连续内存。本接口分配可供通用用途使用的物理连续内存块。返回的物理地址必须通过相应接口释放（源码未提供接口引用）。

#### 2.3.1. 函数

**Python 调用**

```python
phyaddr, pviraddr, ret = axcl.sys.mem_alloc(size, align, token)
```

**C++ 原型**

```cpp
AX_S32 AX_SYS_MemAlloc(AX_U64 *phyaddr, AX_VOID **pviraddr, AX_U32 size, AX_U32 align, const AX_S8 *token);
```

#### 2.3.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| size | int | 内存大小，单位为字节。 |
| align | int | 内存对齐要求，单位为字节。当前忽略此参数；SDK 始终按 4 KB 对齐。 |
| token | str &#124; bytes &#124; None | 分配标识字符串。指定分区使用 "PartitionName:BlockName"，匿名分区使用 "BlockName"。标识字符串长度不得超过 30 字节。 |

#### 2.3.3. 返回值

- `phyaddr`: *int* — 指向已分配内存块起始物理地址的指针。不得为 NULL。
- `pviraddr`: *int* — 用于返回映射后用户虚拟地址的指针。pviraddr 为 NULL 时，不创建虚拟映射。
- `ret`: *int* — 成功。失败；返回 CMM 错误码。

#### 2.3.4. 说明

返回类型：`tuple[int, int, int]`。

源码：`python/axcl/sys/ax_sys.py:1067`。

#### 2.3.5. 示例

```python
phyaddr, pviraddr, ret = axcl.sys.mem_alloc(size, align, token)
```

<br>

<a id="axcl.sys.mem_alloc_cached"></a>

### 2.4. axcl.sys.mem_alloc_cached

从 CMM 分区分配可缓存的连续内存。本接口分配物理连续内存块，并将其映射为可缓存内存。与硬件共享缓冲区时，需使用缓存维护接口。

#### 2.4.1. 函数

**Python 调用**

```python
phyaddr, pviraddr, ret = axcl.sys.mem_alloc_cached(size, align, token)
```

**C++ 原型**

```cpp
AX_S32 AX_SYS_MemAllocCached(AX_U64 *phyaddr, AX_VOID **pviraddr, AX_U32 size, AX_U32 align, const AX_S8 *token);
```

#### 2.4.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| size | int | 内存大小，单位为字节。 |
| align | int | 内存对齐要求，单位为字节。 |
| token | str &#124; bytes &#124; None | 分配标识字符串。指定分区使用 "PartitionName:BlockName"，匿名分区使用 "BlockName"。标识字符串长度不得超过 30 字节。 |

#### 2.4.3. 返回值

- `phyaddr`: *int* — 指向已分配可缓存内存块起始物理地址的指针。不得为 NULL。
- `pviraddr`: *int* — 用于返回映射后可缓存用户虚拟地址的指针。不得为 NULL。
- `ret`: *int* — 成功。失败；返回 CMM 错误码。

#### 2.4.4. 说明

返回类型：`tuple[int, int, int]`。

源码：`python/axcl/sys/ax_sys.py:1107`。

#### 2.4.5. 示例

```python
phyaddr, pviraddr, ret = axcl.sys.mem_alloc_cached(size, align, token)
```

<br>

<a id="axcl.sys.mem_free"></a>

### 2.5. axcl.sys.mem_free

释放已分配的内存（源码未提供分配接口引用）。

#### 2.5.1. 函数

**Python 调用**

```python
ret = axcl.sys.mem_free(phyaddr, pviraddr)
```

**C++ 原型**

```cpp
AX_S32 AX_SYS_MemFree(AX_U64 phyaddr, AX_VOID *pviraddr);
```

#### 2.5.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| phyaddr | int | 分配接口返回的起始物理地址。 |
| pviraddr | int &#124; None | 分配接口返回的虚拟地址；分配时未请求虚拟映射则为 NULL。 |

#### 2.5.3. 返回值

- `ret`: *int* — 成功。失败；返回 CMM 错误码。

#### 2.5.4. 说明

返回类型：`int`。

源码：`python/axcl/sys/ax_sys.py:1147`。

#### 2.5.5. 示例

```python
ret = axcl.sys.mem_free(phyaddr, pviraddr)
```

<br>

<a id="axcl.sys.mmap"></a>

### 2.6. axcl.sys.mmap

将物理内存映射到不可缓存的用户虚拟地址。映射由 /dev/axdev/ax_cmm 处理。输入物理范围可以是 CMM 管理的内存，也可以是不受 CMM 管理的任意有效 DDR 物理范围。

#### 2.6.1. 函数

**Python 调用**

```python
ret = axcl.sys.mmap(phyaddr, size)
```

**C++ 原型**

```cpp
AX_VOID * AX_SYS_Mmap(AX_U64 phyaddr, AX_U32 size);
```

#### 2.6.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| phyaddr | int | 要映射的起始物理地址。 |
| size | int | 映射大小，单位为字节。不得为 0。 |

#### 2.6.3. 返回值

- `ret`: *int* — 成功时返回有效虚拟地址；失败时返回 NULL。

#### 2.6.4. 说明

返回类型：`int`。

源码：`python/axcl/sys/ax_sys.py:1180`。

#### 2.6.5. 示例

```python
ret = axcl.sys.mmap(phyaddr, size)
```

<br>

<a id="axcl.sys.mmap_cache"></a>

### 2.7. axcl.sys.mmap_cache

将物理内存映射到可缓存的用户虚拟地址。映射由 /dev/axdev/ax_cmm 处理。输入物理范围可以是 CMM 管理的内存，也可以是不受 CMM 管理的任意有效 DDR 物理范围。

#### 2.7.1. 函数

**Python 调用**

```python
ret = axcl.sys.mmap_cache(phyaddr, size)
```

**C++ 原型**

```cpp
AX_VOID * AX_SYS_MmapCache(AX_U64 phyaddr, AX_U32 size);
```

#### 2.7.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| phyaddr | int | 要映射的起始物理地址。 |
| size | int | 映射大小，单位为字节。不得为 0。 |

#### 2.7.3. 返回值

- `ret`: *int* — 成功时返回有效虚拟地址；失败时返回 NULL。

#### 2.7.4. 说明

返回类型：`int`。

源码：`python/axcl/sys/ax_sys.py:1213`。

#### 2.7.5. 示例

```python
ret = axcl.sys.mmap_cache(phyaddr, size)
```

<br>

<a id="axcl.sys.mmap_fast"></a>

### 2.8. axcl.sys.mmap_fast

通过快速映射路径，将物理内存映射到不可缓存的用户虚拟地址。对于 CMM 管理的内存，SDK 映射整个已分配内存块；若映射已存在，则复用它。对于不受管理的 DDR 内存，SDK 每次调用均映射指定物理范围。

#### 2.8.1. 函数

**Python 调用**

```python
ret = axcl.sys.mmap_fast(phyaddr, size)
```

**C++ 原型**

```cpp
AX_VOID * AX_SYS_MmapFast(AX_U64 phyaddr, AX_U32 size);
```

#### 2.8.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| phyaddr | int | 要映射的起始物理地址。 |
| size | int | 映射大小，单位为字节。对于不受管理的内存，此参数不得为 0。 |

#### 2.8.3. 返回值

- `ret`: *int* — 成功时返回有效虚拟地址；失败时返回 NULL。

#### 2.8.4. 说明

返回类型：`int`。

源码：`python/axcl/sys/ax_sys.py:1246`。

#### 2.8.5. 示例

```python
ret = axcl.sys.mmap_fast(phyaddr, size)
```

<br>

<a id="axcl.sys.mmap_cache_fast"></a>

### 2.9. axcl.sys.mmap_cache_fast

通过快速映射路径，将物理内存映射到可缓存的用户虚拟地址。对于 CMM 管理的内存，SDK 映射整个已分配内存块；若映射已存在，则复用它。对于不受管理的 DDR 内存，SDK 每次调用均映射指定物理范围。

#### 2.9.1. 函数

**Python 调用**

```python
ret = axcl.sys.mmap_cache_fast(phyaddr, size)
```

**C++ 原型**

```cpp
AX_VOID * AX_SYS_MmapCacheFast(AX_U64 phyaddr, AX_U32 size);
```

#### 2.9.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| phyaddr | int | 要映射的起始物理地址。 |
| size | int | 映射大小，单位为字节。对于不受管理的内存，此参数不得为 0。 |

#### 2.9.3. 返回值

- `ret`: *int* — 成功时返回有效虚拟地址；失败时返回 NULL。

#### 2.9.4. 说明

返回类型：`int`。

源码：`python/axcl/sys/ax_sys.py:1279`。

#### 2.9.5. 示例

```python
ret = axcl.sys.mmap_cache_fast(phyaddr, size)
```

<br>

<a id="axcl.sys.munmap"></a>

### 2.10. axcl.sys.munmap

解除 AX_SYS_Mmap 接口返回的用户虚拟地址映射。

#### 2.10.1. 函数

**Python 调用**

```python
ret = axcl.sys.munmap(pviraddr, size)
```

**C++ 原型**

```cpp
AX_S32 AX_SYS_Munmap(AX_VOID *pviraddr, AX_U32 size);
```

#### 2.10.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| pviraddr | int &#124; None | 返回的虚拟地址（源码未提供接口引用）。 |
| size | int | 映射大小，单位为字节。不得为 0。 |

#### 2.10.3. 返回值

- `ret`: *int* — 成功。失败；返回 CMM 错误码。

#### 2.10.4. 说明

返回类型：`int`。

源码：`python/axcl/sys/ax_sys.py:1312`。

#### 2.10.5. 示例

```python
ret = axcl.sys.munmap(pviraddr, size)
```

<br>

<a id="axcl.sys.mflush_cache"></a>

### 2.11. axcl.sys.mflush_cache

将 CPU 缓存内容刷新到 DDR 内存，并使缓存行失效。硬件读取最近由 CPU 修改的数据前，需调用本接口。

#### 2.11.1. 函数

**Python 调用**

```python
ret = axcl.sys.mflush_cache(phyaddr, pviraddr, size)
```

**C++ 原型**

```cpp
AX_S32 AX_SYS_MflushCache(AX_U64 phyaddr, AX_VOID *pviraddr, AX_U32 size);
```

#### 2.11.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| phyaddr | int | 内存范围的起始物理地址。 |
| pviraddr | int &#124; None | 同一内存范围的起始虚拟地址。 |
| size | int | 内存大小，单位为字节。不得为 0。 |

#### 2.11.3. 返回值

- `ret`: *int* — 成功。失败；返回 CMM 错误码。

#### 2.11.4. 说明

返回类型：`int`。

源码：`python/axcl/sys/ax_sys.py:1345`。

#### 2.11.5. 示例

```python
ret = axcl.sys.mflush_cache(phyaddr, pviraddr, size)
```

<br>

<a id="axcl.sys.minvalidate_cache"></a>

### 2.12. axcl.sys.minvalidate_cache

CPU 读取共享 DDR 内存前，使 CPU 缓存失效。

#### 2.12.1. 函数

**Python 调用**

```python
ret = axcl.sys.minvalidate_cache(phyaddr, pviraddr, size)
```

**C++ 原型**

```cpp
AX_S32 AX_SYS_MinvalidateCache(AX_U64 phyaddr, AX_VOID *pviraddr, AX_U32 size);
```

#### 2.12.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| phyaddr | int | 内存范围的起始物理地址。 |
| pviraddr | int &#124; None | 同一内存范围的起始虚拟地址。 |
| size | int | 内存大小，单位为字节。不得为 0。 |

#### 2.12.3. 返回值

- `ret`: *int* — 成功。失败；返回 CMM 错误码。

#### 2.12.4. 说明

返回类型：`int`。

源码：`python/axcl/sys/ax_sys.py:1380`。

#### 2.12.5. 示例

```python
ret = axcl.sys.minvalidate_cache(phyaddr, pviraddr, size)
```

<br>

<a id="axcl.sys.mem_get_block_info_by_phy"></a>

### 2.13. axcl.sys.mem_get_block_info_by_phy

通过内存块内部的物理地址查询 CMM 内存块信息。

#### 2.13.1. 函数

**Python 调用**

```python
pmem_type, pviraddr, pblock_size, ret = axcl.sys.mem_get_block_info_by_phy(phyaddr)
```

**C++ 原型**

```cpp
AX_S32 AX_SYS_MemGetBlockInfoByPhy(AX_U64 phyaddr, AX_S32 *pmemType, AX_VOID **pviraddr, AX_U32 *pblockSize);
```

#### 2.13.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| phyaddr | int | 已分配内存块内部的物理地址（源码未提供分配接口引用）。 |

#### 2.13.3. 返回值

- `pmem_type`: *int* — 指向内存类型的指针。
- `pviraddr`: *int* — 用于返回对应用户虚拟地址的指针。phyaddr 在内存块内存在偏移时，返回地址具有相同偏移。
- `pblock_size`: *int* — 用于返回偏移后剩余内存块大小的指针。
- `ret`: *int* — 成功。失败；返回 CMM 错误码。

#### 2.13.4. 说明

返回类型：`tuple[int, int, int, int]`。

源码：`python/axcl/sys/ax_sys.py:1415`。

#### 2.13.5. 示例

```python
pmem_type, pviraddr, pblock_size, ret = axcl.sys.mem_get_block_info_by_phy(phyaddr)
```

<br>

<a id="axcl.sys.mem_get_block_info_by_virt"></a>

### 2.14. axcl.sys.mem_get_block_info_by_virt

通过用户虚拟地址查询 CMM 内存块物理地址和内存类型。

#### 2.14.1. 函数

**Python 调用**

```python
phyaddr, pmem_type, ret = axcl.sys.mem_get_block_info_by_virt(pviraddr)
```

**C++ 原型**

```cpp
AX_S32 AX_SYS_MemGetBlockInfoByVirt(AX_VOID *pviraddr, AX_U64 *phyaddr, AX_S32 *pmemType);
```

#### 2.14.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| pviraddr | int &#124; None | 已分配内存块内部的虚拟地址（源码未提供分配接口引用）。 |

#### 2.14.3. 返回值

- `phyaddr`: *int* — 用于返回对应物理地址的指针。pviraddr 在内存块内存在偏移时，返回地址具有相同偏移。
- `pmem_type`: *int* — 指向内存类型的指针。
- `ret`: *int* — 成功。失败；返回 CMM 错误码。

#### 2.14.4. 说明

返回类型：`tuple[int, int, int]`。

源码：`python/axcl/sys/ax_sys.py:1458`。

#### 2.14.5. 示例

```python
phyaddr, pmem_type, ret = axcl.sys.mem_get_block_info_by_virt(pviraddr)
```

<br>

<a id="axcl.sys.mem_get_partition_info"></a>

### 2.15. axcl.sys.mem_get_partition_info

获取当前 CMM 分区配置信息。

#### 2.15.1. 函数

**Python 调用**

```python
cmm_partition_info, ret = axcl.sys.mem_get_partition_info()
```

**C++ 原型**

```cpp
AX_S32 AX_SYS_MemGetPartitionInfo(AX_CMM_PARTITION_INFO_T *pCmmPartitionInfo);
```

#### 2.15.2. 参数

不适用

#### 2.15.3. 返回值

- `cmm_partition_info`: *dict* — 用于返回 CMM 分区数量、名称、起始物理地址及大小的指针，大小单位为 KB。
- `ret`: *int* — 成功。失败；返回 CMM 错误码。

#### 2.15.4. 说明

返回类型：`tuple[dict, int]`。

源码：`python/axcl/sys/ax_sys.py:1494`。

#### 2.15.5. 示例

```python
cmm_partition_info, ret = axcl.sys.mem_get_partition_info()
```

<br>

<a id="axcl.sys.mem_set_config"></a>

### 2.16. axcl.sys.mem_set_config

配置模块使用的 CMM 分区名称。

#### 2.16.1. 函数

**Python 调用**

```python
ret = axcl.sys.mem_set_config(mod_info, partition_name)
```

**C++ 原型**

```cpp
AX_S32 AX_SYS_MemSetConfig(const AX_MOD_INFO_T *pModInfo, const AX_S8 *pPartitionName);
```

#### 2.16.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| mod_info | dict &#124; None | 指向模块信息的指针。 |
| partition_name | str &#124; bytes &#124; None | CMM 分区名称。为 NULL 或未配置时，模块使用匿名分区。 |

#### 2.16.3. 返回值

- `ret`: *int* — 成功。失败；返回 CMM 或 SYS 错误码。

#### 2.16.4. 说明

返回类型：`int`。

源码：`python/axcl/sys/ax_sys.py:1525`。

#### 2.16.5. 示例

```python
ret = axcl.sys.mem_set_config(mod_info, partition_name)
```

<br>

<a id="axcl.sys.mem_get_config"></a>

### 2.17. axcl.sys.mem_get_config

获取为模块配置的 CMM 分区名称。

#### 2.17.1. 函数

**Python 调用**

```python
partition_name, ret = axcl.sys.mem_get_config(mod_info)
```

**C++ 原型**

```cpp
AX_S32 AX_SYS_MemGetConfig(const AX_MOD_INFO_T *pModInfo, AX_S8 *pPartitionName);
```

#### 2.17.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| mod_info | dict &#124; None | 指向模块信息的指针。 |

#### 2.17.3. 返回值

- `partition_name`: *str* — 用于返回已配置分区名称的缓冲区。
- `ret`: *int* — 成功。失败；返回 CMM 或 SYS 错误码。

#### 2.17.4. 说明

返回类型：`tuple[str, int]`。

源码：`python/axcl/sys/ax_sys.py:1558`。

#### 2.17.5. 示例

```python
partition_name, ret = axcl.sys.mem_get_config(mod_info)
```

<br>

<a id="axcl.sys.mem_set_param"></a>

### 2.18. axcl.sys.mem_set_param

配置模块内存类别使用的 CMM 分区名称。本接口扩展了（源码说明不完整）。

#### 2.18.1. 函数

**Python 调用**

```python
ret = axcl.sys.mem_set_param(mod_info, partition_name, type)
```

**C++ 原型**

```cpp
AX_S32 AX_SYS_MemSetParam(const AX_MOD_INFO_T *pModInfo, const AX_S8 *pPartitionName, AX_U8 type);
```

#### 2.18.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| mod_info | dict &#124; None | 指向模块信息的指针。 |
| partition_name | str &#124; bytes &#124; None | CMM 分区名称。为 NULL 或未配置时，模块使用匿名分区。 |
| type | int | 模块特定的内存类别。type 0 等价于（源码说明不完整）。 |

#### 2.18.3. 返回值

- `ret`: *int* — 成功。失败；返回 CMM 或 SYS 错误码。

#### 2.18.4. 说明

返回类型：`int`。

源码：`python/axcl/sys/ax_sys.py:1593`。

#### 2.18.5. 示例

```python
ret = axcl.sys.mem_set_param(mod_info, partition_name, type)
```

<br>

<a id="axcl.sys.mem_get_param"></a>

### 2.19. axcl.sys.mem_get_param

获取为模块内存类别配置的 CMM 分区名称。

#### 2.19.1. 函数

**Python 调用**

```python
partition_name, ret = axcl.sys.mem_get_param(mod_info, type)
```

**C++ 原型**

```cpp
AX_S32 AX_SYS_MemGetParam(const AX_MOD_INFO_T *pModInfo, AX_S8 *pPartitionName, AX_U8 type);
```

#### 2.19.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| mod_info | dict &#124; None | 指向模块信息的指针。 |
| type | int | 模块特定的内存类别。 |

#### 2.19.3. 返回值

- `partition_name`: *str* — 用于返回已配置分区名称的缓冲区。
- `ret`: *int* — 成功。失败；返回 CMM 或 SYS 错误码。

#### 2.19.4. 说明

返回类型：`tuple[str, int]`。

源码：`python/axcl/sys/ax_sys.py:1628`。

#### 2.19.5. 示例

```python
partition_name, ret = axcl.sys.mem_get_param(mod_info, type)
```

<br>

<a id="axcl.sys.mem_query_status"></a>

### 2.20. axcl.sys.mem_query_status

查询当前 CMM 内存使用状态。

#### 2.20.1. 函数

**Python 调用**

```python
cmm_status, ret = axcl.sys.mem_query_status()
```

**C++ 原型**

```cpp
AX_S32 AX_SYS_MemQueryStatus(AX_CMM_STATUS_T *pCmmStatus);
```

#### 2.20.2. 参数

不适用

#### 2.20.3. 返回值

- `cmm_status`: *dict* — 用于返回 CMM 总大小、剩余大小、内存块数量和分区信息的指针。
- `ret`: *int* — 成功。失败；返回 CMM 错误码。

#### 2.20.4. 说明

返回类型：`tuple[dict, int]`。

源码：`python/axcl/sys/ax_sys.py:1665`。

#### 2.20.5. 示例

```python
cmm_status, ret = axcl.sys.mem_query_status()
```

<br>

<a id="axcl.sys.mem_get_max_free_region_info"></a>

### 2.21. axcl.sys.mem_get_max_free_region_info

获取最大连续空闲 CMM 区域的起始物理地址和大小。

#### 2.21.1. 函数

**Python 调用**

```python
phyaddr, size, ret = axcl.sys.mem_get_max_free_region_info()
```

**C++ 原型**

```cpp
AX_S32 AX_SYS_MemGetMaxFreeRegionInfo(AX_U64 *pPhyaddr, AX_U32 *pSize);
```

#### 2.21.2. 参数

不适用

#### 2.21.3. 返回值

- `phyaddr`: *int* — 用于返回起始物理地址的指针。
- `size`: *int* — 用于返回区域大小的指针，单位为字节。
- `ret`: *int* — 成功。失败；pPhyaddr 和 pSize 均返回 0。

#### 2.21.4. 说明

返回类型：`tuple[int, int, int]`。

源码：`python/axcl/sys/ax_sys.py:1696`。

#### 2.21.5. 示例

```python
phyaddr, size, ret = axcl.sys.mem_get_max_free_region_info()
```

<br>

<a id="axcl.sys.link"></a>

### 2.22. axcl.sys.link

将数据源绑定到数据接收端。

#### 2.22.1. 函数

**Python 调用**

```python
ret = axcl.sys.link(src, dest)
```

**C++ 原型**

```cpp
AX_S32 AX_SYS_Link(const AX_MOD_INFO_T *pSrc, const AX_MOD_INFO_T *pDest);
```

#### 2.22.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| src | dict &#124; None | 指向源模块信息的指针。 |
| dest | dict &#124; None | 指向目标模块信息的指针。 |

#### 2.22.3. 返回值

- `ret`: *int* — 成功。失败；返回 LINK 错误码。

#### 2.22.4. 说明

返回类型：`int`。

源码：`python/axcl/sys/ax_sys.py:1729`。

#### 2.22.5. 示例

```python
ret = axcl.sys.link(src, dest)
```

<br>

<a id="axcl.sys.un_link"></a>

### 2.23. axcl.sys.un_link

解除数据源与数据接收端的绑定。

#### 2.23.1. 函数

**Python 调用**

```python
ret = axcl.sys.un_link(src, dest)
```

**C++ 原型**

```cpp
AX_S32 AX_SYS_UnLink(const AX_MOD_INFO_T *pSrc, const AX_MOD_INFO_T *pDest);
```

#### 2.23.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| src | dict &#124; None | 指向源模块信息的指针。 |
| dest | dict &#124; None | 指向目标模块信息的指针。 |

#### 2.23.3. 返回值

- `ret`: *int* — 成功。失败；返回 LINK 错误码。

#### 2.23.4. 说明

返回类型：`int`。

源码：`python/axcl/sys/ax_sys.py:1762`。

#### 2.23.5. 示例

```python
ret = axcl.sys.un_link(src, dest)
```

<br>

<a id="axcl.sys.get_link_by_dest"></a>

### 2.24. axcl.sys.get_link_by_dest

通过目标模块信息获取源模块信息。

#### 2.24.1. 函数

**Python 调用**

```python
src, ret = axcl.sys.get_link_by_dest(dest)
```

**C++ 原型**

```cpp
AX_S32 AX_SYS_GetLinkByDest(const AX_MOD_INFO_T *pDest, AX_MOD_INFO_T *pSrc);
```

#### 2.24.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| dest | dict &#124; None | 指向目标模块信息的指针。 |

#### 2.24.3. 返回值

- `src`: *dict* — 用于返回源模块信息的指针。
- `ret`: *int* — 成功。失败；返回 LINK 错误码。

#### 2.24.4. 说明

返回类型：`tuple[dict, int]`。

源码：`python/axcl/sys/ax_sys.py:1795`。

#### 2.24.5. 示例

```python
src, ret = axcl.sys.get_link_by_dest(dest)
```

<br>

<a id="axcl.sys.get_link_by_src"></a>

### 2.25. axcl.sys.get_link_by_src

获取与源模块绑定的所有目标模块信息。

#### 2.25.1. 函数

**Python 调用**

```python
link_dest, ret = axcl.sys.get_link_by_src(src)
```

**C++ 原型**

```cpp
AX_S32 AX_SYS_GetLinkBySrc(const AX_MOD_INFO_T *pSrc, AX_LINK_DEST_T *pLinkDest);
```

#### 2.25.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| src | dict &#124; None | 指向源模块信息的指针。 |

#### 2.25.3. 返回值

- `link_dest`: *dict* — 用于返回目标模块信息集合的指针。
- `ret`: *int* — 成功。失败；返回 LINK 错误码。

#### 2.25.4. 说明

返回类型：`tuple[dict, int]`。

源码：`python/axcl/sys/ax_sys.py:1829`。

#### 2.25.5. 示例

```python
link_dest, ret = axcl.sys.get_link_by_src(src)
```

<br>

<a id="axcl.sys.get_cur_pts"></a>

### 2.26. axcl.sys.get_cur_pts

获取当前媒体时间戳，单位为微秒。

#### 2.26.1. 函数

**Python 调用**

```python
cur_pts, ret = axcl.sys.get_cur_pts()
```

**C++ 原型**

```cpp
AX_S32 AX_SYS_GetCurPTS(AX_U64 *pu64CurPTS);
```

#### 2.26.2. 参数

不适用

#### 2.26.3. 返回值

- `cur_pts`: *int* — 用于返回当前时间戳的指针，单位为微秒。
- `ret`: *int* — 成功。失败；返回 PTS 错误码。

#### 2.26.4. 说明

返回类型：`tuple[int, int]`。

源码：`python/axcl/sys/ax_sys.py:1863`。

#### 2.26.5. 示例

```python
cur_pts, ret = axcl.sys.get_cur_pts()
```

<br>

<a id="axcl.sys.init_pts_base"></a>

### 2.27. axcl.sys.init_pts_base

设置媒体时间戳基准，单位为微秒。

#### 2.27.1. 函数

**Python 调用**

```python
ret = axcl.sys.init_pts_base(pts_base)
```

**C++ 原型**

```cpp
AX_S32 AX_SYS_InitPTSBase(AX_U64 u64PTSBase);
```

#### 2.27.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| pts_base | int | 时间戳基准，单位为微秒。 |

#### 2.27.3. 返回值

- `ret`: *int* — 成功。失败；返回 PTS 错误码。

#### 2.27.4. 说明

返回类型：`int`。

源码：`python/axcl/sys/ax_sys.py:1894`。

#### 2.27.5. 示例

```python
ret = axcl.sys.init_pts_base(pts_base)
```

<br>

<a id="axcl.sys.sync_pts"></a>

### 2.28. axcl.sys.sync_pts

同步媒体时间戳基准，单位为微秒。

#### 2.28.1. 函数

**Python 调用**

```python
ret = axcl.sys.sync_pts(pts_base)
```

**C++ 原型**

```cpp
AX_S32 AX_SYS_SyncPTS(AX_U64 u64PTSBase);
```

#### 2.28.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| pts_base | int | 时间戳基准，单位为微秒。 |

#### 2.28.3. 返回值

- `ret`: *int* — 成功。失败；返回 PTS 错误码。

#### 2.28.4. 说明

返回类型：`int`。

源码：`python/axcl/sys/ax_sys.py:1925`。

#### 2.28.5. 示例

```python
ret = axcl.sys.sync_pts(pts_base)
```

<br>

<a id="axcl.sys.set_log_level"></a>

### 2.29. axcl.sys.set_log_level

设置 SYS 日志级别。

#### 2.29.1. 函数

**Python 调用**

```python
ret = axcl.sys.set_log_level(level)
```

**C++ 原型**

```cpp
AX_S32 AX_SYS_SetLogLevel(AX_LOG_LEVEL_E level);
```

#### 2.29.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| level | int | 日志级别。 |

#### 2.29.3. 返回值

- `ret`: *int* — 成功。失败；返回 SYS 错误码。

#### 2.29.4. 说明

返回类型：`int`。

源码：`python/axcl/sys/ax_sys.py:1956`。

#### 2.29.5. 示例

```python
ret = axcl.sys.set_log_level(level)
```

<br>

<a id="axcl.sys.set_log_target"></a>

### 2.30. axcl.sys.set_log_target

设置 SYS 日志输出目标。

#### 2.30.1. 函数

**Python 调用**

```python
ret = axcl.sys.set_log_target(target)
```

**C++ 原型**

```cpp
AX_S32 AX_SYS_SetLogTarget(AX_LOG_TARGET_E target);
```

#### 2.30.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| target | int | 日志输出目标。 |

#### 2.30.3. 返回值

- `ret`: *int* — 成功。失败；返回 SYS 错误码。

#### 2.30.4. 说明

返回类型：`int`。

源码：`python/axcl/sys/ax_sys.py:1987`。

#### 2.30.5. 示例

```python
ret = axcl.sys.set_log_target(target)
```

<br>

<a id="axcl.sys.enable_timestamp"></a>

### 2.31. axcl.sys.enable_timestamp

启用或禁用 SYS 日志时间戳。

#### 2.31.1. 函数

**Python 调用**

```python
ret = axcl.sys.enable_timestamp(enable)
```

**C++ 原型**

```cpp
AX_S32 AX_SYS_EnableTimestamp(AX_BOOL enable);
```

#### 2.31.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| enable | int | AX_TRUE 启用日志时间戳；AX_FALSE 禁用日志时间戳。 |

#### 2.31.3. 返回值

- `ret`: *int* — 成功。失败；返回 SYS 错误码。

#### 2.31.4. 说明

返回类型：`int`。

源码：`python/axcl/sys/ax_sys.py:2018`。

#### 2.31.5. 示例

```python
ret = axcl.sys.enable_timestamp(enable)
```

<br>

<a id="axcl.sys.get_chip_type"></a>

### 2.32. axcl.sys.get_chip_type

获取当前芯片类型。

#### 2.32.1. 函数

**Python 调用**

```python
ret = axcl.sys.get_chip_type()
```

**C++ 原型**

```cpp
AX_CHIP_TYPE_E AX_SYS_GetChipType(void);
```

#### 2.32.2. 参数

不适用

#### 2.32.3. 返回值

- `ret`: *int* — 当前芯片类型。参见 AX_CHIP_TYPE_E。

#### 2.32.4. 说明

返回类型：`int`。

源码：`python/axcl/sys/ax_sys.py:2049`。

#### 2.32.5. 示例

```python
ret = axcl.sys.get_chip_type()
```

<br>

<a id="axcl.sys.sleep"></a>

### 2.33. axcl.sys.sleep

请求系统进入休眠模式。

#### 2.33.1. 函数

**Python 调用**

```python
ret = axcl.sys.sleep()
```

**C++ 原型**

```cpp
AX_S32 AX_SYS_Sleep(void);
```

#### 2.33.2. 参数

不适用

#### 2.33.3. 返回值

- `ret`: *int* — 成功。失败；返回 PWR 错误码。

#### 2.33.4. 说明

返回类型：`int`。

源码：`python/axcl/sys/ax_sys.py:2077`。

#### 2.33.5. 示例

```python
ret = axcl.sys.sleep()
```

<br>

<a id="axcl.sys.wake_lock"></a>

### 2.34. axcl.sys.wake_lock

为模块获取用户态 WakeLock。

#### 2.34.1. 函数

**Python 调用**

```python
ret = axcl.sys.wake_lock(mod_id)
```

**C++ 原型**

```cpp
AX_S32 AX_SYS_WakeLock(const AX_MOD_ID_E ModId);
```

#### 2.34.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| mod_id | int | 模块 ID。 |

#### 2.34.3. 返回值

- `ret`: *int* — 成功。失败；返回 PWR 错误码。

#### 2.34.4. 说明

返回类型：`int`。

源码：`python/axcl/sys/ax_sys.py:2105`。

#### 2.34.5. 示例

```python
ret = axcl.sys.wake_lock(mod_id)
```

<br>

<a id="axcl.sys.wake_unlock"></a>

### 2.35. axcl.sys.wake_unlock

释放模块的用户态 WakeLock。

#### 2.35.1. 函数

**Python 调用**

```python
ret = axcl.sys.wake_unlock(mod_id)
```

**C++ 原型**

```cpp
AX_S32 AX_SYS_WakeUnlock(const AX_MOD_ID_E ModId);
```

#### 2.35.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| mod_id | int | 模块 ID。 |

#### 2.35.3. 返回值

- `ret`: *int* — 成功。失败；返回 PWR 错误码。

#### 2.35.4. 说明

返回类型：`int`。

源码：`python/axcl/sys/ax_sys.py:2136`。

#### 2.35.5. 示例

```python
ret = axcl.sys.wake_unlock(mod_id)
```

<br>

<a id="axcl.sys.register_event_cb"></a>

### 2.36. axcl.sys.register_event_cb

为模块注册休眠/唤醒事件回调函数。

#### 2.36.1. 函数

**Python 调用**

```python
ret = axcl.sys.register_event_cb(mod_id, function, data)
```

**C++ 原型**

```cpp
AX_S32 AX_SYS_RegisterEventCb(const AX_MOD_ID_E ModId, NotifyEventCallback pFunction, AX_VOID * pData);
```

#### 2.36.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| mod_id | int | 模块 ID。 |
| function | object | 回调函数。休眠前接收 AX_NOTIFY_EVENT_SLEEP，唤醒后接收 AX_NOTIFY_EVENT_WAKEUP。 |
| data | int &#124; None | 传递给回调函数的用户数据。未使用时传入 NULL。 |

#### 2.36.3. 返回值

- `ret`: *int* — 成功。失败；返回 PWR 错误码。

#### 2.36.4. 说明

返回类型：`int`。

源码：`python/axcl/sys/ax_sys.py:2167`。

#### 2.36.5. 示例

```python
ret = axcl.sys.register_event_cb(mod_id, function, data)
```

<br>

<a id="axcl.sys.unregister_event_cb"></a>

### 2.37. axcl.sys.unregister_event_cb

注销模块的休眠/唤醒事件回调函数。

#### 2.37.1. 函数

**Python 调用**

```python
ret = axcl.sys.unregister_event_cb(mod_id)
```

**C++ 原型**

```cpp
AX_S32 AX_SYS_UnregisterEventCb(const AX_MOD_ID_E ModId);
```

#### 2.37.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| mod_id | int | 模块 ID。 |

#### 2.37.3. 返回值

- `ret`: *int* — 成功。失败；返回 PWR 错误码。

#### 2.37.4. 说明

返回类型：`int`。

源码：`python/axcl/sys/ax_sys.py:2206`。

#### 2.37.5. 示例

```python
ret = axcl.sys.unregister_event_cb(mod_id)
```

<br>

<a id="axcl.sys.sleep_time_stamp"></a>

### 2.38. axcl.sys.sleep_time_stamp

在用户态休眠/唤醒流程中添加时间戳点。

#### 2.38.1. 函数

**Python 调用**

```python
ret = axcl.sys.sleep_time_stamp(mod_id, sub_id)
```

**C++ 原型**

```cpp
AX_S32 AX_SYS_SleepTimeStamp(const AX_MOD_ID_E ModId, AX_U8 SubId);
```

#### 2.38.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| mod_id | int | 模块 ID。 |
| sub_id | int | 模块的时间戳索引，从 0 开始。 |

#### 2.38.3. 返回值

- `ret`: *int* — 成功。失败；返回 PWR 错误码。

#### 2.38.4. 说明

返回类型：`int`。

源码：`python/axcl/sys/ax_sys.py:2242`。

#### 2.38.5. 示例

```python
ret = axcl.sys.sleep_time_stamp(mod_id, sub_id)
```
