# axcl.engine

## 1. 目录

- [axcl.engine.get_version](#axcl.engine.get_version): 获取 AX Engine 库版本字符串。
- [axcl.engine.npu_reset](#axcl.engine.npu_reset): 复位 NPU 硬件。
- [axcl.engine.init](#axcl.engine.init): 初始化 engine runtime 所需的资源，并指定 NPU 工作模式。
- [axcl.engine.get_vnpu_attr](#axcl.engine.get_vnpu_attr): 获取当前 NPU 属性。
- [axcl.engine.deinit](#axcl.engine.deinit): 释放 engine runtime 持有的资源。
- [axcl.engine.get_model_type](#axcl.engine.get_model_type): 通过读取模型内存缓冲区获取模型类型。
- [axcl.engine.create_handle](#axcl.engine.create_handle): 创建推理引擎句柄并加载 axmodel 模型数据。axmodel 文件大小即模型加载后占用的最大 CMM 空间。
- [axcl.engine.create_handle_v2](#axcl.engine.create_handle_v2): 使用额外参数创建推理引擎句柄。与 AX_ENGINE_CreateHandle() 相同，并额外支持通过 AX_ENGINE_HANDLE_EXTRA_T 从加密模型创建句柄。
- [axcl.engine.destroy_handle](#axcl.engine.destroy_handle): 销毁推理引擎句柄并释放模型相关的全部资源。
- [axcl.engine.get_io_info](#axcl.engine.get_io_info): 获取句柄所加载模型的输入输出信息。
- [axcl.engine.get_group_io_info_count](#axcl.engine.get_group_io_info_count): 获取模型的多组 IO 信息数量。
- [axcl.engine.get_group_io_info](#axcl.engine.get_group_io_info): 获取指定组的 IO 信息。
- [axcl.engine.get_handle_model_type](#axcl.engine.get_handle_model_type): 获取句柄所加载模型的类型。
- [axcl.engine.create_context](#axcl.engine.create_context): 创建执行 graph 所需的默认上下文，并初始化 graph 资源。
- [axcl.engine.create_context_v2](#axcl.engine.create_context_v2): 创建执行 graph 所需的额外上下文。同一模型句柄可创建多个上下文，因此多上下文任务不再需要多个句柄。
- [axcl.engine.run_sync](#axcl.engine.run_sync): 在默认上下文中同步执行 graph 推理。
- [axcl.engine.run_sync_v2](#axcl.engine.run_sync_v2): 在指定上下文中同步执行 graph 推理。
- [axcl.engine.run_group_io_sync](#axcl.engine.run_group_io_sync): 同步执行组 IO 推理。
- [axcl.engine.set_affinity](#axcl.engine.set_affinity): 设置模型句柄的 NPU 核亲和性。
- [axcl.engine.get_affinity](#axcl.engine.get_affinity): 获取模型句柄的 NPU 核亲和性。
- [axcl.engine.get_cmm_usage](#axcl.engine.get_cmm_usage): 获取模型的 CMM 内存使用情况。
- [axcl.engine.get_model_tools_version](#axcl.engine.get_model_tools_version): 获取编译模型所用的 Pulsar2 工具链版本。

<br>

## 2. API

<a id="axcl.engine.get_version"></a>

### 2.1. axcl.engine.get_version

获取 AX Engine 库版本字符串。

#### 2.1.1. 函数

**Python 调用**

```python
result = axcl.engine.get_version()
```

**C++ 原型**

```cpp
const AX_CHAR * AX_ENGINE_GetVersion(void);
```

#### 2.1.2. 参数

不适用

#### 2.1.3. 返回值

- `result`: *str* — Engine 版本字符串。

#### 2.1.4. 说明

返回类型：`str`。

源码：`python/axcl/engine/ax_engine.py:597`。

#### 2.1.5. 示例

```python
result = axcl.engine.get_version()
```

<br>

<a id="axcl.engine.npu_reset"></a>

### 2.2. axcl.engine.npu_reset

复位 NPU 硬件。

#### 2.2.1. 函数

**Python 调用**

```python
axcl.engine.npu_reset()
```

**C++ 原型**

```cpp
AX_VOID AX_ENGINE_NPUReset(void);
```

#### 2.2.2. 参数

不适用

#### 2.2.3. 返回值

- None

#### 2.2.4. 说明

返回类型：`None`。

源码：`python/axcl/engine/ax_engine.py:625`。

#### 2.2.5. 示例

```python
axcl.engine.npu_reset()
```

<br>

<a id="axcl.engine.init"></a>

### 2.3. axcl.engine.init

初始化 engine runtime 所需的资源，并指定 NPU 工作模式。

#### 2.3.1. 函数

**Python 调用**

```python
ret = axcl.engine.init(npu_attr)
```

**C++ 原型**

```cpp
AX_S32 AX_ENGINE_Init(AX_ENGINE_NPU_ATTR_T* pNpuAttr);
```

#### 2.3.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| npu_attr | dict &#124; None | NPU 属性。可为 NULL，以使用默认属性。 |

#### 2.3.3. 返回值

- `ret`: *int* — 成功。失败。返回错误码。

#### 2.3.4. 说明

返回类型：`int`。

源码：`python/axcl/engine/ax_engine.py:653`。

#### 2.3.5. 示例

```python
ret = axcl.engine.init(npu_attr)
```

<br>

<a id="axcl.engine.get_vnpu_attr"></a>

### 2.4. axcl.engine.get_vnpu_attr

获取当前 NPU 属性。

#### 2.4.1. 函数

**Python 调用**

```python
npu_attr, ret = axcl.engine.get_vnpu_attr()
```

**C++ 原型**

```cpp
AX_S32 AX_ENGINE_GetVNPUAttr(AX_ENGINE_NPU_ATTR_T* pNpuAttr);
```

#### 2.4.2. 参数

不适用

#### 2.4.3. 返回值

- `npu_attr`: *dict* — NPU 属性。
- `ret`: *int* — 成功。失败。返回错误码。

#### 2.4.4. 说明

返回类型：`tuple[dict, int]`。

源码：`python/axcl/engine/ax_engine.py:684`。

#### 2.4.5. 示例

```python
npu_attr, ret = axcl.engine.get_vnpu_attr()
```

<br>

<a id="axcl.engine.deinit"></a>

### 2.5. axcl.engine.deinit

释放 engine runtime 持有的资源。

#### 2.5.1. 函数

**Python 调用**

```python
ret = axcl.engine.deinit()
```

**C++ 原型**

```cpp
AX_S32 AX_ENGINE_Deinit(void);
```

#### 2.5.2. 参数

不适用

#### 2.5.3. 返回值

- `ret`: *int* — 成功。失败。返回错误码。

#### 2.5.4. 说明

返回类型：`int`。

源码：`python/axcl/engine/ax_engine.py:715`。

#### 2.5.5. 示例

```python
ret = axcl.engine.deinit()
```

<br>

<a id="axcl.engine.get_model_type"></a>

### 2.6. axcl.engine.get_model_type

通过读取模型内存缓冲区获取模型类型。

#### 2.6.1. 函数

**Python 调用**

```python
model_type, ret = axcl.engine.get_model_type(data, data_size)
```

**C++ 原型**

```cpp
AX_S32 AX_ENGINE_GetModelType(const AX_VOID* pData, AX_U32 nDataSize, AX_ENGINE_MODEL_TYPE_T* pModelType);
```

#### 2.6.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| data | int &#124; None | 模型数据的设备物理地址（将模型拷贝到设备内存后，通过 `axcl.rt.mem_get_dev_addr` 获取）。 |
| data_size | int | 模型数据长度，单位为字节。 |

#### 2.6.3. 返回值

- `model_type`: *int* — 模型类型枚举。
- `ret`: *int* — 成功。失败。返回错误码。

#### 2.6.4. 说明

返回类型：`tuple[int, int]`。

源码：`python/axcl/engine/ax_engine.py:743`。

#### 2.6.5. 示例

```python
model_type, ret = axcl.engine.get_model_type(data, data_size)
```

<br>

<a id="axcl.engine.create_handle"></a>

### 2.7. axcl.engine.create_handle

创建推理引擎句柄并加载 axmodel 模型数据。axmodel 文件大小即模型加载后占用的最大 CMM 空间。

#### 2.7.1. 函数

**Python 调用**

```python
handle, ret = axcl.engine.create_handle(data, data_size)
```

**C++ 原型**

```cpp
AX_S32 AX_ENGINE_CreateHandle(AX_ENGINE_HANDLE *pHandle, const AX_VOID *pData, AX_U32 nDataSize);
```

#### 2.7.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| data | int &#124; None | 模型数据的设备物理地址（将模型拷贝到设备内存后，通过 `axcl.rt.mem_get_dev_addr` 获取）。 |
| data_size | int | 模型数据长度，单位为字节。 |

#### 2.7.3. 返回值

- `handle`: *int* — 推理引擎句柄。
- `ret`: *int* — 成功。失败。返回错误码。

#### 2.7.4. 说明

返回类型：`tuple[int, int]`。

源码：`python/axcl/engine/ax_engine.py:780`。

#### 2.7.5. 示例

```python
handle, ret = axcl.engine.create_handle(data, data_size)
```

<br>

<a id="axcl.engine.create_handle_v2"></a>

### 2.8. axcl.engine.create_handle_v2

使用额外参数创建推理引擎句柄。与 AX_ENGINE_CreateHandle() 相同，并额外支持通过 AX_ENGINE_HANDLE_EXTRA_T 从加密模型创建句柄。

#### 2.8.1. 函数

**Python 调用**

```python
handle, ret = axcl.engine.create_handle_v2(data, data_size, extra_param)
```

**C++ 原型**

```cpp
AX_S32 AX_ENGINE_CreateHandleV2(AX_ENGINE_HANDLE* pHandle, const AX_VOID* pData, AX_U32 nDataSize, AX_ENGINE_HANDLE_EXTRA_T* pExtraParam);
```

#### 2.8.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| data | int &#124; None | 模型数据的设备物理地址（将模型拷贝到设备内存后，通过 `axcl.rt.mem_get_dev_addr` 获取）。 |
| data_size | int | 模型数据长度，单位为字节。 |
| extra_param | dict &#124; None | 额外参数（NPU 集合、模型名称、加密密钥）。 |

#### 2.8.3. 返回值

- `handle`: *int* — 推理引擎句柄。
- `ret`: *int* — 成功。失败。返回错误码。

#### 2.8.4. 说明

返回类型：`tuple[int, int]`。

源码：`python/axcl/engine/ax_engine.py:817`。

#### 2.8.5. 示例

```python
handle, ret = axcl.engine.create_handle_v2(data, data_size, extra_param)
```

<br>

<a id="axcl.engine.destroy_handle"></a>

### 2.9. axcl.engine.destroy_handle

销毁推理引擎句柄并释放模型相关的全部资源。

#### 2.9.1. 函数

**Python 调用**

```python
ret = axcl.engine.destroy_handle(handle)
```

**C++ 原型**

```cpp
AX_S32 AX_ENGINE_DestroyHandle(AX_ENGINE_HANDLE nHandle);
```

#### 2.9.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| handle | int &#124; None | 模型句柄。 |

#### 2.9.3. 返回值

- `ret`: *int* — 成功。失败。返回错误码。

#### 2.9.4. 说明

返回类型：`int`。

源码：`python/axcl/engine/ax_engine.py:856`。

#### 2.9.5. 示例

```python
ret = axcl.engine.destroy_handle(handle)
```

<br>

<a id="axcl.engine.get_io_info"></a>

### 2.10. axcl.engine.get_io_info

获取句柄所加载模型的输入输出信息。

#### 2.10.1. 函数

**Python 调用**

```python
io, ret = axcl.engine.get_io_info(handle)
```

**C++ 原型**

```cpp
AX_S32 AX_ENGINE_GetIOInfo(AX_ENGINE_HANDLE nHandle, AX_ENGINE_IO_INFO_T** pIO);
```

#### 2.10.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| handle | int &#124; None | 模型句柄。 |

#### 2.10.3. 返回值

- `io`: *dict* — 模型 IO 信息。
- `ret`: *int* — 成功。失败。返回错误码。

#### 2.10.4. 说明

返回类型：`tuple[dict, int]`。

源码：`python/axcl/engine/ax_engine.py:887`。

#### 2.10.5. 示例

```python
io, ret = axcl.engine.get_io_info(handle)
```

<br>

<a id="axcl.engine.get_group_io_info_count"></a>

### 2.11. axcl.engine.get_group_io_info_count

获取模型的多组 IO 信息数量。

#### 2.11.1. 函数

**Python 调用**

```python
count, ret = axcl.engine.get_group_io_info_count(handle)
```

**C++ 原型**

```cpp
AX_S32 AX_ENGINE_GetGroupIOInfoCount(AX_ENGINE_HANDLE nHandle, AX_U32* pCount);
```

#### 2.11.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| handle | int &#124; None | 模型句柄。 |

#### 2.11.3. 返回值

- `count`: *int* — 多组 IO 信息数量。
- `ret`: *int* — 成功。失败。返回错误码。

#### 2.11.4. 说明

返回类型：`tuple[int, int]`。

源码：`python/axcl/engine/ax_engine.py:921`。

#### 2.11.5. 示例

```python
count, ret = axcl.engine.get_group_io_info_count(handle)
```

<br>

<a id="axcl.engine.get_group_io_info"></a>

### 2.12. axcl.engine.get_group_io_info

获取指定组的 IO 信息。

#### 2.12.1. 函数

**Python 调用**

```python
io, ret = axcl.engine.get_group_io_info(handle, index)
```

**C++ 原型**

```cpp
AX_S32 AX_ENGINE_GetGroupIOInfo(AX_ENGINE_HANDLE nHandle, AX_U32 nIndex, AX_ENGINE_IO_INFO_T** pIO);
```

#### 2.12.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| handle | int &#124; None | 模型句柄。 |
| index | int | 组索引。必须小于组数。 |

#### 2.12.3. 返回值

- `io`: *dict* — 组 IO 信息。
- `ret`: *int* — 成功。失败。返回错误码。

#### 2.12.4. 说明

返回类型：`tuple[dict, int]`。

源码：`python/axcl/engine/ax_engine.py:955`。

#### 2.12.5. 示例

```python
io, ret = axcl.engine.get_group_io_info(handle, index)
```

<br>

<a id="axcl.engine.get_handle_model_type"></a>

### 2.13. axcl.engine.get_handle_model_type

获取句柄所加载模型的类型。

#### 2.13.1. 函数

**Python 调用**

```python
model_type, ret = axcl.engine.get_handle_model_type(handle)
```

**C++ 原型**

```cpp
AX_S32 AX_ENGINE_GetHandleModelType(AX_ENGINE_HANDLE nHandle, AX_ENGINE_MODEL_TYPE_T* pModelType);
```

#### 2.13.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| handle | int &#124; None | 模型句柄。 |

#### 2.13.3. 返回值

- `model_type`: *int* — 模型类型枚举。
- `ret`: *int* — 成功。失败。返回错误码。

#### 2.13.4. 说明

返回类型：`tuple[int, int]`。

源码：`python/axcl/engine/ax_engine.py:991`。

#### 2.13.5. 示例

```python
model_type, ret = axcl.engine.get_handle_model_type(handle)
```

<br>

<a id="axcl.engine.create_context"></a>

### 2.14. axcl.engine.create_context

创建执行 graph 所需的默认上下文，并初始化 graph 资源。

#### 2.14.1. 函数

**Python 调用**

```python
ret = axcl.engine.create_context(handle)
```

**C++ 原型**

```cpp
AX_S32 AX_ENGINE_CreateContext(AX_ENGINE_HANDLE handle);
```

#### 2.14.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| handle | int &#124; None | 模型句柄。 |

#### 2.14.3. 返回值

- `ret`: *int* — 成功。失败。返回错误码。

#### 2.14.4. 说明

返回类型：`int`。

源码：`python/axcl/engine/ax_engine.py:1025`。

#### 2.14.5. 示例

```python
ret = axcl.engine.create_context(handle)
```

<br>

<a id="axcl.engine.create_context_v2"></a>

### 2.15. axcl.engine.create_context_v2

创建执行 graph 所需的额外上下文。同一模型句柄可创建多个上下文，因此多上下文任务不再需要多个句柄。

#### 2.15.1. 函数

**Python 调用**

```python
context, ret = axcl.engine.create_context_v2(handle)
```

**C++ 原型**

```cpp
AX_S32 AX_ENGINE_CreateContextV2(AX_ENGINE_HANDLE nHandle, AX_ENGINE_CONTEXT_T* pContext);
```

#### 2.15.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| handle | int &#124; None | 模型句柄。 |

#### 2.15.3. 返回值

- `context`: *int* — 模型上下文句柄。
- `ret`: *int* — 成功。失败。返回错误码。

#### 2.15.4. 说明

返回类型：`tuple[int, int]`。

源码：`python/axcl/engine/ax_engine.py:1056`。

#### 2.15.5. 示例

```python
context, ret = axcl.engine.create_context_v2(handle)
```

<br>

<a id="axcl.engine.run_sync"></a>

### 2.16. axcl.engine.run_sync

在默认上下文中同步执行 graph 推理。

#### 2.16.1. 函数

**Python 调用**

```python
ret = axcl.engine.run_sync(handle, io)
```

**C++ 原型**

```cpp
AX_S32 AX_ENGINE_RunSync(AX_ENGINE_HANDLE handle, AX_ENGINE_IO_T* pIO);
```

#### 2.16.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| handle | int &#124; None | 模型句柄。 |
| io | dict &#124; None | 输入 IO 描述符。`inputs` 和 `outputs` 为缓冲区字典列表；`input_size` 和 `output_size` 为对应数量。缓冲区的 `phy_addr`/`vir_addr` 为设备地址，而非 Host 内存分配句柄。输出张量数据写入引用的设备缓冲区；不返回描述符。该调用为同步调用。 |

#### 2.16.3. 返回值

- `ret`: *int* — 成功。失败。返回错误码。

#### 2.16.4. 说明

返回类型：`int`。

源码：`python/axcl/engine/ax_engine.py:1090`。

#### 2.16.5. 示例

```python
ret = axcl.engine.run_sync(handle, io)
```

<br>

<a id="axcl.engine.run_sync_v2"></a>

### 2.17. axcl.engine.run_sync_v2

在指定上下文中同步执行 graph 推理。

#### 2.17.1. 函数

**Python 调用**

```python
ret = axcl.engine.run_sync_v2(handle, context, io)
```

**C++ 原型**

```cpp
AX_S32 AX_ENGINE_RunSyncV2(AX_ENGINE_HANDLE handle, AX_ENGINE_CONTEXT_T context, AX_ENGINE_IO_T* pIO);
```

#### 2.17.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| handle | int &#124; None | 模型句柄。 |
| context | int &#124; None | 由 AX_ENGINE_CreateContextV2() 创建的上下文句柄。 |
| io | dict &#124; None | 输入 IO 描述符。`inputs` 和 `outputs` 为缓冲区字典列表；`input_size` 和 `output_size` 为对应数量。缓冲区的 `phy_addr`/`vir_addr` 为设备地址，而非 Host 内存分配句柄。输出张量数据写入引用的设备缓冲区；不返回描述符。该调用为同步调用。 |

#### 2.17.3. 返回值

- `ret`: *int* — 成功。失败。返回错误码。

#### 2.17.4. 说明

返回类型：`int`。

源码：`python/axcl/engine/ax_engine.py:1127`。

#### 2.17.5. 示例

```python
ret = axcl.engine.run_sync_v2(handle, context, io)
```

<br>

<a id="axcl.engine.run_group_io_sync"></a>

### 2.18. axcl.engine.run_group_io_sync

同步执行组 IO 推理。

#### 2.18.1. 函数

**Python 调用**

```python
ret = axcl.engine.run_group_io_sync(handle, context, index, io)
```

**C++ 原型**

```cpp
AX_S32 AX_ENGINE_RunGroupIOSync(AX_ENGINE_HANDLE handle, AX_ENGINE_CONTEXT_T context, AX_U32 nIndex, AX_ENGINE_IO_T* pIO);
```

#### 2.18.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| handle | int &#124; None | 模型句柄。 |
| context | int &#124; None | 上下文句柄。 |
| index | int | 组索引。必须与组 IO 信息对应。 |
| io | dict &#124; None | 输入 IO 描述符。`inputs` 和 `outputs` 为缓冲区字典列表；`input_size` 和 `output_size` 为对应数量。缓冲区的 `phy_addr`/`vir_addr` 为设备地址，而非 Host 内存分配句柄。输出张量数据写入引用的设备缓冲区；不返回描述符。该调用为同步调用。 |

#### 2.18.3. 返回值

- `ret`: *int* — 成功。失败。返回错误码。

#### 2.18.4. 说明

返回类型：`int`。

源码：`python/axcl/engine/ax_engine.py:1166`。

#### 2.18.5. 示例

```python
ret = axcl.engine.run_group_io_sync(handle, context, index, io)
```

<br>

<a id="axcl.engine.set_affinity"></a>

### 2.19. axcl.engine.set_affinity

设置模型句柄的 NPU 核亲和性。

#### 2.19.1. 函数

**Python 调用**

```python
ret = axcl.engine.set_affinity(handle, npu_set)
```

**C++ 原型**

```cpp
AX_S32 AX_ENGINE_SetAffinity(AX_ENGINE_HANDLE nHandle, AX_ENGINE_NPU_SET_T nNpuSet);
```

#### 2.19.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| handle | int &#124; None | 模型句柄。 |
| npu_set | int | NPU 核集合位掩码。 |

#### 2.19.3. 返回值

- `ret`: *int* — 成功。失败。返回错误码。

#### 2.19.4. 说明

返回类型：`int`。

源码：`python/axcl/engine/ax_engine.py:1207`。

#### 2.19.5. 示例

```python
ret = axcl.engine.set_affinity(handle, npu_set)
```

<br>

<a id="axcl.engine.get_affinity"></a>

### 2.20. axcl.engine.get_affinity

获取模型句柄的 NPU 核亲和性。

#### 2.20.1. 函数

**Python 调用**

```python
npu_set, ret = axcl.engine.get_affinity(handle)
```

**C++ 原型**

```cpp
AX_S32 AX_ENGINE_GetAffinity(AX_ENGINE_HANDLE nHandle, AX_ENGINE_NPU_SET_T* pNpuSet);
```

#### 2.20.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| handle | int &#124; None | 模型句柄。 |

#### 2.20.3. 返回值

- `npu_set`: *int* — NPU 核集合位掩码。
- `ret`: *int* — 成功。失败。返回错误码。

#### 2.20.4. 说明

返回类型：`tuple[int, int]`。

源码：`python/axcl/engine/ax_engine.py:1240`。

#### 2.20.5. 示例

```python
npu_set, ret = axcl.engine.get_affinity(handle)
```

<br>

<a id="axcl.engine.get_cmm_usage"></a>

### 2.21. axcl.engine.get_cmm_usage

获取模型的 CMM 内存使用情况。

#### 2.21.1. 函数

**Python 调用**

```python
cmm_info, ret = axcl.engine.get_cmm_usage(handle)
```

**C++ 原型**

```cpp
AX_S32 AX_ENGINE_GetCMMUsage(AX_ENGINE_HANDLE nHandle, AX_ENGINE_CMM_INFO_T* pCMMInfo);
```

#### 2.21.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| handle | int &#124; None | 模型句柄。 |

#### 2.21.3. 返回值

- `cmm_info`: *dict* — 指向 CMM 信息结构体的指针。
- `ret`: *int* — 成功。失败。返回错误码。

#### 2.21.4. 说明

返回类型：`tuple[dict, int]`。

源码：`python/axcl/engine/ax_engine.py:1274`。

#### 2.21.5. 示例

```python
cmm_info, ret = axcl.engine.get_cmm_usage(handle)
```

<br>

<a id="axcl.engine.get_model_tools_version"></a>

### 2.22. axcl.engine.get_model_tools_version

获取编译模型所用的 Pulsar2 工具链版本。

#### 2.22.1. 函数

**Python 调用**

```python
result = axcl.engine.get_model_tools_version(handle)
```

**C++ 原型**

```cpp
const AX_CHAR * AX_ENGINE_GetModelToolsVersion(AX_ENGINE_HANDLE nHandle);
```

#### 2.22.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| handle | int &#124; None | 模型句柄。 |

#### 2.22.3. 返回值

- `result`: *str* — Pulsar2 工具链版本字符串。

#### 2.22.4. 说明

返回类型：`str`。

源码：`python/axcl/engine/ax_engine.py:1308`。

#### 2.22.5. 示例

```python
result = axcl.engine.get_model_tools_version(handle)
```
