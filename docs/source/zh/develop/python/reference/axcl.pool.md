# axcl.pool

## 1. 目录

- [axcl.pool.set_config](#axcl.pool.set_config): 设置媒体子系统的公共内存池规划。
- [axcl.pool.get_config](#axcl.pool.get_config): 获取媒体子系统的公共内存池规划。
- [axcl.pool.init](#axcl.pool.init): 根据配置的规划创建公共内存池。
- [axcl.pool.exit](#axcl.pool.exit): 释放所有已创建的媒体子系统内存池。
- [axcl.pool.create_pool](#axcl.pool.create_pool): 创建视频缓冲池。
- [axcl.pool.destroy_pool](#axcl.pool.destroy_pool): 销毁 AX_POOL_CreatePool 创建的视频缓冲池。
- [axcl.pool.get_block](#axcl.pool.get_block): 从指定内存池或匹配的公共内存池获取内存块。
- [axcl.pool.release_block](#axcl.pool.release_block): 释放通过 AX_POOL_GetBlock 借用的内存块。
- [axcl.pool.phy_addr_to_handle](#axcl.pool.phy_addr_to_handle): 将内存池块物理地址转换为内存块 ID。
- [axcl.pool.handle_to_phy_addr](#axcl.pool.handle_to_phy_addr): 将内存块 ID 转换为内存块物理地址。
- [axcl.pool.handle_to_meta_phys_addr](#axcl.pool.handle_to_meta_phys_addr): 将内存块 ID 转换为元数据物理地址。
- [axcl.pool.handle_to_pool_id](#axcl.pool.handle_to_pool_id): 获取内存块 ID 所属的内存池 ID。
- [axcl.pool.handle_to_blk_size](#axcl.pool.handle_to_blk_size): 获取内存块 ID 对应的对齐后内存块大小。
- [axcl.pool.mmap_pool](#axcl.pool.mmap_pool): 将视频缓冲池的全部内存块映射到用户虚拟地址。
- [axcl.pool.munmap_pool](#axcl.pool.munmap_pool): 解除视频缓冲池用户虚拟地址的映射。
- [axcl.pool.get_block_vir_addr](#axcl.pool.get_block_vir_addr): 获取内存池块的用户虚拟地址。
- [axcl.pool.get_meta_vir_addr](#axcl.pool.get_meta_vir_addr): 获取内存池块元数据区域的用户虚拟地址。
- [axcl.pool.increase_ref_cnt](#axcl.pool.increase_ref_cnt): 增加内存池块的 AX_ID_USER 引用计数。
- [axcl.pool.decrease_ref_cnt](#axcl.pool.decrease_ref_cnt): 减少内存池块的 AX_ID_USER 引用计数。
- [axcl.pool.free_comm_pool](#axcl.pool.free_comm_pool): 仅释放公共内存池内存。

<br>

## 2. API

<a id="axcl.pool.set_config"></a>

### 2.1. axcl.pool.set_config

设置媒体子系统的公共内存池规划。

#### 2.1.1. 函数

**Python 调用**

```python
ret = axcl.pool.set_config(pool_floor_plan)
```

**C++ 原型**

```cpp
AX_S32 AX_POOL_SetConfig(const AX_POOL_FLOORPLAN_T *pPoolFloorPlan);
```

#### 2.1.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| pool_floor_plan | dict &#124; None | 指向公共内存池规划的指针。 |

#### 2.1.3. 返回值

- `ret`: *int* — 成功。失败；返回 POOL 错误码。

#### 2.1.4. 说明

返回类型：`int`。

源码：`python/axcl/pool/axcl_pool.py:363`。

#### 2.1.5. 示例

```python
ret = axcl.pool.set_config(pool_floor_plan)
```

<br>

<a id="axcl.pool.get_config"></a>

### 2.2. axcl.pool.get_config

获取媒体子系统的公共内存池规划。

#### 2.2.1. 函数

**Python 调用**

```python
pool_floor_plan, ret = axcl.pool.get_config()
```

**C++ 原型**

```cpp
AX_S32 AX_POOL_GetConfig(AX_POOL_FLOORPLAN_T *pPoolFloorPlan);
```

#### 2.2.2. 参数

不适用

#### 2.2.3. 返回值

- `pool_floor_plan`: *dict* — 用于返回公共内存池规划的指针。
- `ret`: *int* — 成功。失败；返回 POOL 错误码。

#### 2.2.4. 说明

返回类型：`tuple[dict, int]`。

源码：`python/axcl/pool/axcl_pool.py:394`。

#### 2.2.5. 示例

```python
pool_floor_plan, ret = axcl.pool.get_config()
```

<br>

<a id="axcl.pool.init"></a>

### 2.3. axcl.pool.init

根据配置的规划创建公共内存池。

#### 2.3.1. 函数

**Python 调用**

```python
ret = axcl.pool.init()
```

**C++ 原型**

```cpp
AX_S32 AX_POOL_Init(void);
```

#### 2.3.2. 参数

不适用

#### 2.3.3. 返回值

- `ret`: *int* — 成功。失败；返回 POOL 错误码。

#### 2.3.4. 说明

返回类型：`int`。

源码：`python/axcl/pool/axcl_pool.py:425`。

#### 2.3.5. 示例

```python
ret = axcl.pool.init()
```

<br>

<a id="axcl.pool.exit"></a>

### 2.4. axcl.pool.exit

释放所有已创建的媒体子系统内存池。

#### 2.4.1. 函数

**Python 调用**

```python
ret = axcl.pool.exit()
```

**C++ 原型**

```cpp
AX_S32 AX_POOL_Exit(void);
```

#### 2.4.2. 参数

不适用

#### 2.4.3. 返回值

- `ret`: *int* — 成功。失败；返回 POOL 错误码。

#### 2.4.4. 说明

返回类型：`int`。

源码：`python/axcl/pool/axcl_pool.py:453`。

#### 2.4.5. 示例

```python
ret = axcl.pool.exit()
```

<br>

<a id="axcl.pool.create_pool"></a>

### 2.5. axcl.pool.create_pool

创建视频缓冲池。

#### 2.5.1. 函数

**Python 调用**

```python
ret = axcl.pool.create_pool(pool_config)
```

**C++ 原型**

```cpp
AX_POOL AX_POOL_CreatePool(AX_POOL_CONFIG_T *pPoolConfig);
```

#### 2.5.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| pool_config | dict &#124; None | 指向内存池配置的指针。 |

#### 2.5.3. 返回值

- `ret`: *int* — 成功时返回有效的内存池 ID；

#### 2.5.4. 说明

返回类型：`int`。

源码：`python/axcl/pool/axcl_pool.py:481`。

#### 2.5.5. 示例

```python
ret = axcl.pool.create_pool(pool_config)
```

<br>

<a id="axcl.pool.destroy_pool"></a>

### 2.6. axcl.pool.destroy_pool

销毁 AX_POOL_CreatePool 创建的视频缓冲池。

#### 2.6.1. 函数

**Python 调用**

```python
ret = axcl.pool.destroy_pool(pool_id)
```

**C++ 原型**

```cpp
AX_S32 AX_POOL_DestroyPool(AX_POOL PoolId);
```

#### 2.6.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| pool_id | int | 内存池 ID。 |

#### 2.6.3. 返回值

- `ret`: *int* — 成功。失败；返回 POOL 错误码。

#### 2.6.4. 说明

返回类型：`int`。

源码：`python/axcl/pool/axcl_pool.py:512`。

#### 2.6.5. 示例

```python
ret = axcl.pool.destroy_pool(pool_id)
```

<br>

<a id="axcl.pool.get_block"></a>

### 2.7. axcl.pool.get_block

从指定内存池或匹配的公共内存池获取内存块。

#### 2.7.1. 函数

**Python 调用**

```python
ret = axcl.pool.get_block(pool_id, blk_size, partition_name)
```

**C++ 原型**

```cpp
AX_BLK AX_POOL_GetBlock(AX_POOL PoolId, AX_U64 BlkSize, const AX_S8 *pPartitionName);
```

#### 2.7.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| pool_id | int | 内存池 ID。使用（源码说明不完整）。 |
| blk_size | int | 请求的内存块大小，单位为字节。 |
| partition_name | str &#124; bytes &#124; None | 用于查找公共内存池的 CMM 分区名称。为 NULL 时使用匿名分区。 |

#### 2.7.3. 返回值

- `ret`: *int* — 成功时返回有效的内存块 ID；

#### 2.7.4. 说明

返回类型：`int`。

源码：`python/axcl/pool/axcl_pool.py:543`。

#### 2.7.5. 示例

```python
ret = axcl.pool.get_block(pool_id, blk_size, partition_name)
```

<br>

<a id="axcl.pool.release_block"></a>

### 2.8. axcl.pool.release_block

释放通过 AX_POOL_GetBlock 借用的内存块。

#### 2.8.1. 函数

**Python 调用**

```python
ret = axcl.pool.release_block(blk_id)
```

**C++ 原型**

```cpp
AX_S32 AX_POOL_ReleaseBlock(AX_BLK BlockId);
```

#### 2.8.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| blk_id | int | 内存块 ID。 |

#### 2.8.3. 返回值

- `ret`: *int* — 成功。失败；返回 POOL 错误码。

#### 2.8.4. 说明

返回类型：`int`。

源码：`python/axcl/pool/axcl_pool.py:578`。

#### 2.8.5. 示例

```python
ret = axcl.pool.release_block(blk_id)
```

<br>

<a id="axcl.pool.phy_addr_to_handle"></a>

### 2.9. axcl.pool.phy_addr_to_handle

将内存池块物理地址转换为内存块 ID。

#### 2.9.1. 函数

**Python 调用**

```python
ret = axcl.pool.phy_addr_to_handle(phys_addr)
```

**C++ 原型**

```cpp
AX_BLK AX_POOL_PhysAddr2Handle(AX_U64 PhysAddr);
```

#### 2.9.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| phys_addr | int | 内存池块的物理地址。 |

#### 2.9.3. 返回值

- `ret`: *int* — 成功时返回有效的内存块 ID；

#### 2.9.4. 说明

返回类型：`int`。

源码：`python/axcl/pool/axcl_pool.py:609`。

#### 2.9.5. 示例

```python
ret = axcl.pool.phy_addr_to_handle(phys_addr)
```

<br>

<a id="axcl.pool.handle_to_phy_addr"></a>

### 2.10. axcl.pool.handle_to_phy_addr

将内存块 ID 转换为内存块物理地址。

#### 2.10.1. 函数

**Python 调用**

```python
ret = axcl.pool.handle_to_phy_addr(blk_id)
```

**C++ 原型**

```cpp
AX_U64 AX_POOL_Handle2PhysAddr(AX_BLK BlockId);
```

#### 2.10.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| blk_id | int | 内存块 ID。 |

#### 2.10.3. 返回值

- `ret`: *int* — 成功时返回物理地址；失败时返回 0。

#### 2.10.4. 说明

返回类型：`int`。

源码：`python/axcl/pool/axcl_pool.py:640`。

#### 2.10.5. 示例

```python
ret = axcl.pool.handle_to_phy_addr(blk_id)
```

<br>

<a id="axcl.pool.handle_to_meta_phys_addr"></a>

### 2.11. axcl.pool.handle_to_meta_phys_addr

将内存块 ID 转换为元数据物理地址。

#### 2.11.1. 函数

**Python 调用**

```python
ret = axcl.pool.handle_to_meta_phys_addr(blk_id)
```

**C++ 原型**

```cpp
AX_U64 AX_POOL_Handle2MetaPhysAddr(AX_BLK BlockId);
```

#### 2.11.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| blk_id | int | 内存块 ID。 |

#### 2.11.3. 返回值

- `ret`: *int* — 成功时返回元数据物理地址；失败时返回 0。

#### 2.11.4. 说明

返回类型：`int`。

源码：`python/axcl/pool/axcl_pool.py:671`。

#### 2.11.5. 示例

```python
ret = axcl.pool.handle_to_meta_phys_addr(blk_id)
```

<br>

<a id="axcl.pool.handle_to_pool_id"></a>

### 2.12. axcl.pool.handle_to_pool_id

获取内存块 ID 所属的内存池 ID。

#### 2.12.1. 函数

**Python 调用**

```python
ret = axcl.pool.handle_to_pool_id(blk_id)
```

**C++ 原型**

```cpp
AX_POOL AX_POOL_Handle2PoolId(AX_BLK BlockId);
```

#### 2.12.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| blk_id | int | 内存块 ID。 |

#### 2.12.3. 返回值

- `ret`: *int* — 成功时返回内存池 ID；

#### 2.12.4. 说明

返回类型：`int`。

源码：`python/axcl/pool/axcl_pool.py:702`。

#### 2.12.5. 示例

```python
ret = axcl.pool.handle_to_pool_id(blk_id)
```

<br>

<a id="axcl.pool.handle_to_blk_size"></a>

### 2.13. axcl.pool.handle_to_blk_size

获取内存块 ID 对应的对齐后内存块大小。

#### 2.13.1. 函数

**Python 调用**

```python
ret = axcl.pool.handle_to_blk_size(blk_id)
```

**C++ 原型**

```cpp
AX_U64 AX_POOL_Handle2BlkSize(AX_BLK BlockId);
```

#### 2.13.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| blk_id | int | 内存块 ID。 |

#### 2.13.3. 返回值

- `ret`: *int* — 成功时返回对齐后的内存块大小，单位为字节；失败时返回 0。

#### 2.13.4. 说明

返回类型：`int`。

源码：`python/axcl/pool/axcl_pool.py:733`。

#### 2.13.5. 示例

```python
ret = axcl.pool.handle_to_blk_size(blk_id)
```

<br>

<a id="axcl.pool.mmap_pool"></a>

### 2.14. axcl.pool.mmap_pool

将视频缓冲池的全部内存块映射到用户虚拟地址。

#### 2.14.1. 函数

**Python 调用**

```python
ret = axcl.pool.mmap_pool(pool_id)
```

**C++ 原型**

```cpp
AX_S32 AX_POOL_MmapPool(AX_POOL PoolId);
```

#### 2.14.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| pool_id | int | 内存池 ID。 |

#### 2.14.3. 返回值

- `ret`: *int* — 成功。失败；返回 POOL 错误码。

#### 2.14.4. 说明

返回类型：`int`。

源码：`python/axcl/pool/axcl_pool.py:764`。

#### 2.14.5. 示例

```python
ret = axcl.pool.mmap_pool(pool_id)
```

<br>

<a id="axcl.pool.munmap_pool"></a>

### 2.15. axcl.pool.munmap_pool

解除视频缓冲池用户虚拟地址的映射。

#### 2.15.1. 函数

**Python 调用**

```python
ret = axcl.pool.munmap_pool(pool_id)
```

**C++ 原型**

```cpp
AX_S32 AX_POOL_MunmapPool(AX_POOL PoolId);
```

#### 2.15.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| pool_id | int | 内存池 ID。 |

#### 2.15.3. 返回值

- `ret`: *int* — 成功。失败；返回 POOL 错误码。

#### 2.15.4. 说明

返回类型：`int`。

源码：`python/axcl/pool/axcl_pool.py:795`。

#### 2.15.5. 示例

```python
ret = axcl.pool.munmap_pool(pool_id)
```

<br>

<a id="axcl.pool.get_block_vir_addr"></a>

### 2.16. axcl.pool.get_block_vir_addr

获取内存池块的用户虚拟地址。

#### 2.16.1. 函数

**Python 调用**

```python
ret = axcl.pool.get_block_vir_addr(blk_id)
```

**C++ 原型**

```cpp
AX_VOID * AX_POOL_GetBlockVirAddr(AX_BLK BlockId);
```

#### 2.16.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| blk_id | int | 内存块 ID。 |

#### 2.16.3. 返回值

- `ret`: *int* — 成功时返回有效虚拟地址；失败时返回 NULL。

#### 2.16.4. 说明

返回类型：`int`。

源码：`python/axcl/pool/axcl_pool.py:826`。

#### 2.16.5. 示例

```python
ret = axcl.pool.get_block_vir_addr(blk_id)
```

<br>

<a id="axcl.pool.get_meta_vir_addr"></a>

### 2.17. axcl.pool.get_meta_vir_addr

获取内存池块元数据区域的用户虚拟地址。

#### 2.17.1. 函数

**Python 调用**

```python
ret = axcl.pool.get_meta_vir_addr(blk_id)
```

**C++ 原型**

```cpp
AX_VOID * AX_POOL_GetMetaVirAddr(AX_BLK BlockId);
```

#### 2.17.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| blk_id | int | 内存块 ID。 |

#### 2.17.3. 返回值

- `ret`: *int* — 成功时返回有效的元数据虚拟地址；失败时返回 NULL。

#### 2.17.4. 说明

返回类型：`int`。

源码：`python/axcl/pool/axcl_pool.py:857`。

#### 2.17.5. 示例

```python
ret = axcl.pool.get_meta_vir_addr(blk_id)
```

<br>

<a id="axcl.pool.increase_ref_cnt"></a>

### 2.18. axcl.pool.increase_ref_cnt

增加内存池块的 AX_ID_USER 引用计数。

#### 2.18.1. 函数

**Python 调用**

```python
ret = axcl.pool.increase_ref_cnt(blk_id)
```

**C++ 原型**

```cpp
AX_S32 AX_POOL_IncreaseRefCnt(AX_BLK BlockId);
```

#### 2.18.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| blk_id | int | 内存块 ID。 |

#### 2.18.3. 返回值

- `ret`: *int* — 成功。失败；返回 POOL 错误码。

#### 2.18.4. 说明

返回类型：`int`。

源码：`python/axcl/pool/axcl_pool.py:888`。

#### 2.18.5. 示例

```python
ret = axcl.pool.increase_ref_cnt(blk_id)
```

<br>

<a id="axcl.pool.decrease_ref_cnt"></a>

### 2.19. axcl.pool.decrease_ref_cnt

减少内存池块的 AX_ID_USER 引用计数。

#### 2.19.1. 函数

**Python 调用**

```python
ret = axcl.pool.decrease_ref_cnt(blk_id)
```

**C++ 原型**

```cpp
AX_S32 AX_POOL_DecreaseRefCnt(AX_BLK BlockId);
```

#### 2.19.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| blk_id | int | 内存块 ID。 |

#### 2.19.3. 返回值

- `ret`: *int* — 成功。失败；返回 POOL 错误码。

#### 2.19.4. 说明

返回类型：`int`。

源码：`python/axcl/pool/axcl_pool.py:919`。

#### 2.19.5. 示例

```python
ret = axcl.pool.decrease_ref_cnt(blk_id)
```

<br>

<a id="axcl.pool.free_comm_pool"></a>

### 2.20. axcl.pool.free_comm_pool

仅释放公共内存池内存。

#### 2.20.1. 函数

**Python 调用**

```python
ret = axcl.pool.free_comm_pool()
```

**C++ 原型**

```cpp
AX_S32 AX_POOL_FreeCommPool(void);
```

#### 2.20.2. 参数

不适用

#### 2.20.3. 返回值

- `ret`: *int* — 成功。失败；返回 POOL 错误码。

#### 2.20.4. 说明

返回类型：`int`。

源码：`python/axcl/pool/axcl_pool.py:950`。

#### 2.20.5. 示例

```python
ret = axcl.pool.free_comm_pool()
```
