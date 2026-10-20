# axcl.rt

## 1. 目录

- [axcl.rt.get_version](#axcl.rt.get_version): 获取 AXCL runtime 库的构建版本号。
- [axcl.rt.get_version_str](#axcl.rt.get_version_str): 获取指定来源的版本字符串。
- [axcl.rt.get_soc_name](#axcl.rt.get_soc_name): 获取芯片名称字符串。
- [axcl.rt.get_last_error](#axcl.rt.get_last_error): 获取并清除当前线程的最近一次错误码。
- [axcl.rt.peek_at_last_error](#axcl.rt.peek_at_last_error): 获取当前线程的最近一次错误码，但不清除。
- [axcl.rt.set_last_error](#axcl.rt.set_last_error): 设置当前线程的最近一次错误码。
- [axcl.rt.get_error_string](#axcl.rt.get_error_string): 获取错误码对应的说明字符串。
- [axcl.rt.set_log_level](#axcl.rt.set_log_level): 在运行时设置目标组件的日志级别。
- [axcl.rt.get_log_level](#axcl.rt.get_log_level): 获取目标组件的日志级别。
- [axcl.rt.create_context](#axcl.rt.create_context): 显式创建 Context，并将其绑定到调用线程。
- [axcl.rt.destroy_context](#axcl.rt.destroy_context): 销毁显式创建的 Context（源码未提供创建接口引用）。
- [axcl.rt.set_current_context](#axcl.rt.set_current_context): 将 Context 设为调用线程的当前 Context。
- [axcl.rt.get_current_context](#axcl.rt.get_current_context): 获取调用线程的当前 Context。
- [axcl.rt.control_execute_shell_cmd](#axcl.rt.control_execute_shell_cmd): 在调用线程当前 Context 关联的设备上执行 shell 命令。
- [axcl.rt.set_device](#axcl.rt.set_device): 激活设备，并将其默认 Context 绑定到调用线程。
- [axcl.rt.reset_device](#axcl.rt.reset_device): 递减设备激活引用计数，并在计数变为 0 时释放设备。
- [axcl.rt.reset_device_force](#axcl.rt.reset_device_force): 强制释放已激活的设备。
- [axcl.rt.reg_device_state_callback](#axcl.rt.reg_device_state_callback): 注册或注销设备状态回调函数。
- [axcl.rt.query_device_status](#axcl.rt.query_device_status): 查询设备状态。
- [axcl.rt.get_device_info](#axcl.rt.get_device_info): 获取设备属性值。
- [axcl.rt.get_device](#axcl.rt.get_device): 获取调用线程当前使用的虚拟设备 ID。
- [axcl.rt.get_device_count](#axcl.rt.get_device_count): 获取当前进程可见的设备数量。
- [axcl.rt.device_can_access_peer](#axcl.rt.device_can_access_peer): 查询设备之间是否支持数据交互。
- [axcl.rt.device_enable_peer_access](#axcl.rt.device_enable_peer_access): 启用当前设备到指定设备的数据交互。本函数启用的数据交互是单向的。例如：当前设备 ID 为 0 且（源码示例不完整）。
- [axcl.rt.device_disable_peer_access](#axcl.rt.device_disable_peer_access): 禁用当前设备到指定设备的数据交互。
- [axcl.rt.device_peer_access_status](#axcl.rt.device_peer_access_status): 查询源设备到指定设备的数据交互启用状态。
- [axcl.rt.synchronize_device](#axcl.rt.synchronize_device): 阻塞等待提交到调用线程关联设备的所有任务完成。
- [axcl.rt.synchronize_device_with_timeout](#axcl.rt.synchronize_device_with_timeout): 阻塞等待提交到调用线程关联设备的任务完成，或等待超时。
- [axcl.rt.device_get_bare_tgid](#axcl.rt.device_get_bare_tgid): 获取调用进程在初始 PID 命名空间中的 Host 原始 TGID。
- [axcl.rt.engine_init](#axcl.rt.engine_init): 初始化调用线程当前 Context 关联设备上的 Engine。
- [axcl.rt.engine_get_vnpu_kind](#axcl.rt.engine_get_vnpu_kind): 获取当前 Context 关联设备上 Engine 的 VNPU 模式。
- [axcl.rt.engine_finalize](#axcl.rt.engine_finalize): 去初始化当前 Context 关联设备上的 Engine。
- [axcl.rt.engine_load_from_file](#axcl.rt.engine_load_from_file): 从 Host 文件加载离线模型到当前设备的 Engine。
- [axcl.rt.engine_load_from_mem](#axcl.rt.engine_load_from_mem): 从 Device 内存加载离线模型到当前设备的 Engine。
- [axcl.rt.engine_unload](#axcl.rt.engine_unload): 从当前设备的 Engine 卸载模型。
- [axcl.rt.engine_get_model_compiler_version](#axcl.rt.engine_get_model_compiler_version): 获取已加载模型中保存的编译工具链版本。
- [axcl.rt.engine_set_affinity](#axcl.rt.engine_set_affinity): 设置已加载模型的 NPU 核亲和性掩码。
- [axcl.rt.engine_get_affinity](#axcl.rt.engine_get_affinity): 获取已加载模型的 NPU 核亲和性掩码。
- [axcl.rt.engine_set_context_affinity](#axcl.rt.engine_set_context_affinity): 设置单个 Engine Context 的亲和性；当前不支持此操作。
- [axcl.rt.engine_get_context_affinity](#axcl.rt.engine_get_context_affinity): 获取单个 Engine Context 的亲和性；当前不支持此操作。
- [axcl.rt.engine_get_usage](#axcl.rt.engine_get_usage): 获取模型文件的 Engine 内存使用情况。
- [axcl.rt.engine_get_usage_from_mem](#axcl.rt.engine_get_usage_from_mem): 获取存放在 Device 内存中的模型数据的 Engine 内存使用情况。
- [axcl.rt.engine_get_usage_from_model_id](#axcl.rt.engine_get_usage_from_model_id): 获取已加载模型的 Engine 内存使用情况。
- [axcl.rt.engine_get_model_type](#axcl.rt.engine_get_model_type): 获取模型文件的核数分类。
- [axcl.rt.engine_get_model_type_from_mem](#axcl.rt.engine_get_model_type_from_mem): 获取存放在 Device 内存中的模型数据的核数分类。
- [axcl.rt.engine_get_model_type_from_model_id](#axcl.rt.engine_get_model_type_from_model_id): 获取已加载模型的核数分类。
- [axcl.rt.engine_get_io_info](#axcl.rt.engine_get_io_info): 创建 Host 端元数据对象，用于描述已加载模型的输入和输出。
- [axcl.rt.engine_destroy_io_info](#axcl.rt.engine_destroy_io_info): 销毁已创建的 IO 元数据对象（源码未提供创建接口引用）。
- [axcl.rt.engine_get_shape_groups_count](#axcl.rt.engine_get_shape_groups_count): 获取 IO 元数据对象描述的 shape 组数量。
- [axcl.rt.engine_get_num_inputs](#axcl.rt.engine_get_num_inputs): 获取 IO 元数据对象中的模型输入数量。
- [axcl.rt.engine_get_num_outputs](#axcl.rt.engine_get_num_outputs): 获取 IO 元数据对象中的模型输出数量。
- [axcl.rt.engine_get_input_size_by_index](#axcl.rt.engine_get_input_size_by_index): 获取指定 shape 组中模型输入所需的缓冲区大小。
- [axcl.rt.engine_get_output_size_by_index](#axcl.rt.engine_get_output_size_by_index): 获取指定 shape 组中模型输出所需的缓冲区大小。
- [axcl.rt.engine_get_input_name_by_index](#axcl.rt.engine_get_input_name_by_index): 按索引获取输入张量名称。
- [axcl.rt.engine_get_output_name_by_index](#axcl.rt.engine_get_output_name_by_index): 按索引获取输出张量名称。
- [axcl.rt.engine_get_input_index_by_name](#axcl.rt.engine_get_input_index_by_name): 按名称查找输入张量索引。
- [axcl.rt.engine_get_output_index_by_name](#axcl.rt.engine_get_output_index_by_name): 按名称查找输出张量索引。
- [axcl.rt.engine_get_input_dims](#axcl.rt.engine_get_input_dims): 获取指定 shape 组中输入张量的维度。
- [axcl.rt.engine_get_input_data_type](#axcl.rt.engine_get_input_data_type): 获取输入张量的数据类型。
- [axcl.rt.engine_get_output_data_type](#axcl.rt.engine_get_output_data_type): 获取输出张量的数据类型。
- [axcl.rt.engine_get_input_data_layout](#axcl.rt.engine_get_input_data_layout): 获取输入张量的数据布局。
- [axcl.rt.engine_get_output_data_layout](#axcl.rt.engine_get_output_data_layout): 获取输出张量的数据布局。
- [axcl.rt.engine_get_output_dims](#axcl.rt.engine_get_output_dims): 获取指定 shape 组中输出张量的维度。
- [axcl.rt.engine_create_io](#axcl.rt.engine_create_io): 根据模型 IO 元数据创建 Host 端 IO 绑定对象。
- [axcl.rt.engine_destroy_io](#axcl.rt.engine_destroy_io): 销毁已创建的 IO 绑定对象（源码未提供创建接口引用）。
- [axcl.rt.engine_set_input_buffer_by_index](#axcl.rt.engine_set_input_buffer_by_index): 按索引将 Device 缓冲区绑定到输入。
- [axcl.rt.engine_set_output_buffer_by_index](#axcl.rt.engine_set_output_buffer_by_index): 按索引将 Device 缓冲区绑定到输出。
- [axcl.rt.engine_set_input_buffer_by_name](#axcl.rt.engine_set_input_buffer_by_name): 按张量名称将 Device 缓冲区绑定到输入。
- [axcl.rt.engine_set_output_buffer_by_name](#axcl.rt.engine_set_output_buffer_by_name): 按张量名称将 Device 缓冲区绑定到输出。
- [axcl.rt.engine_get_input_buffer_by_index](#axcl.rt.engine_get_input_buffer_by_index): 获取输入索引对应的已保存缓冲区绑定。
- [axcl.rt.engine_get_output_buffer_by_index](#axcl.rt.engine_get_output_buffer_by_index): 获取输出索引对应的已保存缓冲区绑定。
- [axcl.rt.engine_get_input_buffer_by_name](#axcl.rt.engine_get_input_buffer_by_name): 获取输入张量名称对应的已保存缓冲区绑定。
- [axcl.rt.engine_get_output_buffer_by_name](#axcl.rt.engine_get_output_buffer_by_name): 获取输出张量名称对应的已保存缓冲区绑定。
- [axcl.rt.engine_set_dynamic_batch_size](#axcl.rt.engine_set_dynamic_batch_size): 保存 IO 绑定对象后续执行所使用的动态批大小。
- [axcl.rt.engine_create_context](#axcl.rt.engine_create_context): 为已加载模型创建独立的 Engine 执行 Context。
- [axcl.rt.engine_execute](#axcl.rt.engine_execute): 在当前 runtime Context 的默认 Stream 上同步执行模型推理。
- [axcl.rt.engine_execute_async](#axcl.rt.engine_execute_async): 向 Stream 提交模型推理任务。
- [axcl.rt.create_event](#axcl.rt.create_event): 在当前 Context 关联的设备上创建启用计时的 Event。
- [axcl.rt.destroy_event](#axcl.rt.destroy_event): 销毁已创建的 Event（源码未提供创建接口引用）。
- [axcl.rt.record_event](#axcl.rt.record_event): 向指定 Stream 异步提交 Event 记录点。
- [axcl.rt.stream_wait_event](#axcl.rt.stream_wait_event): 向指定 Stream 异步提交 Event 等待点，使 Stream 仅在 Event 被触发后继续执行。
- [axcl.rt.stream_wait_event_with_timeout](#axcl.rt.stream_wait_event_with_timeout): 向指定 Stream 异步提交带超时的 Event 等待点。
- [axcl.rt.synchronize_event](#axcl.rt.synchronize_event): 阻塞当前 Host 线程，直到 Event 被触发。
- [axcl.rt.synchronize_event_with_timeout](#axcl.rt.synchronize_event_with_timeout): 阻塞当前 Host 线程，直到 Event 被触发或超时。
- [axcl.rt.create_event_with_flags](#axcl.rt.create_event_with_flags): 按指定计时标志，在当前 Context 关联的设备上创建 Event。
- [axcl.rt.event_elapsed_time](#axcl.rt.event_elapsed_time): 计算两个 Event 最近完成的记录点之间的设备时间差。
- [axcl.rt.event_query](#axcl.rt.event_query): 以非阻塞方式查询 Event 所记录的任务是否完成。
- [axcl.rt.transfer_file](#axcl.rt.transfer_file): 传输单个文件或删除单个 Device 文件。
- [axcl.rt.transfer_directory](#axcl.rt.transfer_directory): 递归传输单个目录。
- [axcl.rt.get_mem_info](#axcl.rt.get_mem_info): 获取调用线程当前 Context 关联设备的内存容量快照。
- [axcl.rt.pointer_get_attributes](#axcl.rt.pointer_get_attributes): 获取内存分配属性。
- [axcl.rt.malloc](#axcl.rt.malloc): 在调用线程当前 Context 关联的设备上分配物理连续内存。
- [axcl.rt.malloc_cached](#axcl.rt.malloc_cached): 在当前 Context 关联的设备上分配可缓存的物理连续内存。
- [axcl.rt.free](#axcl.rt.free): 释放 Device 内存。
- [axcl.rt.mem_flush](#axcl.rt.mem_flush): 将 Device 内存范围内的缓存数据写回 DDR。
- [axcl.rt.mem_invalidate](#axcl.rt.mem_invalidate): 使 Device 内存范围内的缓存数据失效。
- [axcl.rt.malloc_host](#axcl.rt.malloc_host): 分配 Host 虚拟内存。
- [axcl.rt.free_host](#axcl.rt.free_host): 释放已分配的 Host 虚拟内存（源码未提供分配接口引用）。
- [axcl.rt.memset](#axcl.rt.memset): 同步将 Device 内存中的字节设置为指定值。
- [axcl.rt.memcpy](#axcl.rt.memcpy): 同步在 Host 或 Device 内存之间拷贝字节。
- [axcl.rt.memcmp](#axcl.rt.memcmp): 同步判断两个 Device 内存范围内的字节是否相同。
- [axcl.rt.memset_async](#axcl.rt.memset_async): 向指定 Stream 异步提交 Device 内存设置操作。
- [axcl.rt.memcpy_async](#axcl.rt.memcpy_async): 向指定 Stream 异步提交 Host 或 Device 内存拷贝。
- [axcl.rt.memcmp_async](#axcl.rt.memcmp_async): 向指定 Stream 异步提交两个 Device 内存范围的比较操作。
- [axcl.rt.mem_get_address_range](#axcl.rt.mem_get_address_range): 获取 AXCL runtime 管理的指针对应的基地址和分配大小。
- [axcl.rt.mem_get_dev_addr](#axcl.rt.mem_get_dev_addr): 从设备指针导出底层设备物理地址和虚拟地址。
- [axcl.rt.mem_map_dev_addr](#axcl.rt.mem_map_dev_addr): 将外部设备内存注册为临时映射的设备指针。
- [axcl.rt.mem_unmap_dev_addr](#axcl.rt.mem_unmap_dev_addr): 注销通过 axclrtMemMapDevAddr 注册的外部设备内存。
- [axcl.rt.ipc_mem_get_export_key](#axcl.rt.ipc_mem_get_export_key): 为设备内存分配导出 IPC 内存共享密钥。
- [axcl.rt.ipc_mem_set_import_pid](#axcl.rt.ipc_mem_set_import_pid): 为导出的 IPC 内存密钥设置目标 TGID 白名单。
- [axcl.rt.ipc_mem_import_by_key](#axcl.rt.ipc_mem_import_by_key): 通过密钥将 IPC 内存句柄导入调用进程。
- [axcl.rt.ipc_mem_close](#axcl.rt.ipc_mem_close): 关闭进程间共享内存密钥。
- [axcl.rt.create_stream](#axcl.rt.create_stream): 创建 Stream。
- [axcl.rt.destroy_stream](#axcl.rt.destroy_stream): 销毁已创建的 Stream（源码未提供创建接口引用）。
- [axcl.rt.destroy_stream_force](#axcl.rt.destroy_stream_force): 立即销毁 Stream，不等待已提交任务完成。
- [axcl.rt.stream_query](#axcl.rt.stream_query): 查询指定 Stream 是否有未完成的任务。
- [axcl.rt.synchronize_stream](#axcl.rt.synchronize_stream): 阻塞等待调用本函数前提交到 Stream 的所有任务完成。
- [axcl.rt.synchronize_stream_with_timeout](#axcl.rt.synchronize_stream_with_timeout): 在指定超时时间内，阻塞等待调用本函数前提交到 Stream 的所有任务完成。
- [axcl.rt.exec_worker](#axcl.rt.exec_worker): 在当前 Context 关联的 Device 上启动 userworker 进程。
- [axcl.rt.kill_worker](#axcl.rt.kill_worker): 终止并回收 userworker 进程。
- [axcl.rt.worker_send](#axcl.rt.worker_send): 向 userworker 进程发送一条完整消息。
- [axcl.rt.worker_recv](#axcl.rt.worker_recv): 从 userworker 进程接收一条完整消息。

<br>

## 2. API

<a id="axcl.rt.get_version"></a>

### 2.1. axcl.rt.get_version

获取 AXCL runtime 库的构建版本号。

#### 2.1.1. 函数

**Python 调用**

```python
major, minor, patch, ret = axcl.rt.get_version()
```

**C++ 原型**

```cpp
axclError axclrtGetVersion(int32_t *major, int32_t *minor, int32_t *patch);
```

#### 2.1.2. 参数

不适用

#### 2.1.3. 返回值

- `major`: *int* — 用于接收主版本号的非 NULL 指针。
- `minor`: *int* — 用于接收次版本号的非 NULL 指针。
- `patch`: *int* — 用于接收补丁版本号的非 NULL 指针。
- `ret`: *int* — 成功。失败。

#### 2.1.4. 说明

返回类型：`tuple[int, int, int, int]`。

源码：`python/axcl/rt/axcl_rt.py:216`。

#### 2.1.5. 示例

```python
major, minor, patch, ret = axcl.rt.get_version()
```

<br>

<a id="axcl.rt.get_version_str"></a>

### 2.2. axcl.rt.get_version_str

获取指定来源的版本字符串。

#### 2.2.1. 函数

**Python 调用**

```python
buf, ret = axcl.rt.get_version_str(name, size)
```

**C++ 原型**

```cpp
axclError axclrtGetVersionStr(const char *name, char *buf, uint32_t size);
```

#### 2.2.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| name | str &#124; bytes &#124; None | 版本来源，支持的值为 `driver` 和 `firmware`。`driver` 返回 SDK 构建版本字符串。`firmware` 返回与当前线程绑定的 runtime 上下文关联设备的固件版本。线程必须先将上下文绑定到已激活的设备，例如通过（源码说明不完整）。 |
| size | int | 大小（源码未说明对象）。 |

#### 2.2.3. 返回值

- `buf`: *str* — 用于存储版本字符串的缓冲区。成功时，结果以 NUL 结尾。失败时，缓冲区内容未定义。
- `ret`: *int* — 成功。失败。

#### 2.2.4. 说明

返回类型：`tuple[str, int]`。

源码：`python/axcl/rt/axcl_rt.py:251`。

#### 2.2.5. 示例

```python
buf, ret = axcl.rt.get_version_str(name, size)
```

<br>

<a id="axcl.rt.get_soc_name"></a>

### 2.3. axcl.rt.get_soc_name

获取芯片名称字符串。

#### 2.3.1. 函数

**Python 调用**

```python
result = axcl.rt.get_soc_name()
```

**C++ 原型**

```cpp
const char * axclrtGetSocName(void);
```

#### 2.3.2. 参数

不适用

#### 2.3.3. 返回值

- `result`: *str* — 由 runtime 持有的芯片名称字符串。不得释放或修改返回的指针。

#### 2.3.4. 说明

返回类型：`str`。

源码：`python/axcl/rt/axcl_rt.py:288`。

#### 2.3.5. 示例

```python
result = axcl.rt.get_soc_name()
```

<br>

<a id="axcl.rt.get_last_error"></a>

### 2.4. axcl.rt.get_last_error

获取并清除当前线程的最近一次错误码。

#### 2.4.1. 函数

**Python 调用**

```python
ret = axcl.rt.get_last_error()
```

**C++ 原型**

```cpp
axclError axclrtGetLastError(void);
```

#### 2.4.2. 参数

不适用

#### 2.4.3. 返回值

- `ret`: *int* — 最近一次错误码。

#### 2.4.4. 说明

返回类型：`int`。

源码：`python/axcl/rt/axcl_rt.py:316`。

#### 2.4.5. 示例

```python
ret = axcl.rt.get_last_error()
```

<br>

<a id="axcl.rt.peek_at_last_error"></a>

### 2.5. axcl.rt.peek_at_last_error

获取当前线程的最近一次错误码，但不清除。

#### 2.5.1. 函数

**Python 调用**

```python
ret = axcl.rt.peek_at_last_error()
```

**C++ 原型**

```cpp
axclError axclrtPeekAtLastError(void);
```

#### 2.5.2. 参数

不适用

#### 2.5.3. 返回值

- `ret`: *int* — 最近一次错误码。

#### 2.5.4. 说明

返回类型：`int`。

源码：`python/axcl/rt/axcl_rt.py:344`。

#### 2.5.5. 示例

```python
ret = axcl.rt.peek_at_last_error()
```

<br>

<a id="axcl.rt.set_last_error"></a>

### 2.6. axcl.rt.set_last_error

设置当前线程的最近一次错误码。

#### 2.6.1. 函数

**Python 调用**

```python
axcl.rt.set_last_error(error)
```

**C++ 原型**

```cpp
void axclrtSetLastError(axclError error);
```

#### 2.6.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| error | int | 要设置的错误码。 |

#### 2.6.3. 返回值

- None

#### 2.6.4. 说明

返回类型：`None`。

源码：`python/axcl/rt/axcl_rt.py:372`。

#### 2.6.5. 示例

```python
axcl.rt.set_last_error(error)
```

<br>

<a id="axcl.rt.get_error_string"></a>

### 2.7. axcl.rt.get_error_string

获取错误码对应的说明字符串。

#### 2.7.1. 函数

**Python 调用**

```python
result = axcl.rt.get_error_string(error)
```

**C++ 原型**

```cpp
const char * axclrtGetErrorString(axclError error);
```

#### 2.7.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| error | int | 错误码。 |

#### 2.7.3. 返回值

- `result`: *str* — 错误说明字符串。未知的 AXCL 错误格式化为 `unknown error code 0xXXXXXXXX`。外部模块的错误包含原始错误码和模块 ID。

#### 2.7.4. 说明

返回类型：`str`。

源码：`python/axcl/rt/axcl_rt.py:403`。

#### 2.7.5. 示例

```python
result = axcl.rt.get_error_string(error)
```

<br>

<a id="axcl.rt.set_log_level"></a>

### 2.8. axcl.rt.set_log_level

在运行时设置目标组件的日志级别。

#### 2.8.1. 函数

**Python 调用**

```python
ret = axcl.rt.set_log_level(target, lv)
```

**C++ 原型**

```cpp
axclError axclrtSetLogLevel(axclrtLogTarget target, int32_t lv);
```

#### 2.8.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| target | int | 日志目标。参见（源码未提供引用目标）。 |
| lv | int | 日志级别：0 trace、1 debug、2 info、3 warning、4 error、5 critical、6 off。超出 0 至 6 范围的值映射为 warning。 |

#### 2.8.3. 返回值

- `ret`: *int* — 成功。失败。

#### 2.8.4. 说明

返回类型：`int`。

源码：`python/axcl/rt/axcl_rt.py:434`。

#### 2.8.5. 示例

```python
ret = axcl.rt.set_log_level(target, lv)
```

<br>

<a id="axcl.rt.get_log_level"></a>

### 2.9. axcl.rt.get_log_level

获取目标组件的日志级别。

#### 2.9.1. 函数

**Python 调用**

```python
lv, ret = axcl.rt.get_log_level(target)
```

**C++ 原型**

```cpp
axclError axclrtGetLogLevel(axclrtLogTarget target, int32_t *lv);
```

#### 2.9.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| target | int | 日志目标。参见（源码未提供引用目标）。 |

#### 2.9.3. 返回值

- `lv`: *int* — 接收日志级别的非 NULL 指针。
- `ret`: *int* — 成功。失败。

#### 2.9.4. 说明

返回类型：`tuple[int, int]`。

源码：`python/axcl/rt/axcl_rt.py:467`。

#### 2.9.5. 示例

```python
lv, ret = axcl.rt.get_log_level(target)
```

<br>

<a id="axcl.rt.create_context"></a>

### 2.10. axcl.rt.create_context

显式创建 Context，并将其绑定到调用线程。

#### 2.10.1. 函数

**Python 调用**

```python
context, ret = axcl.rt.create_context(device_id)
```

**C++ 原型**

```cpp
axclError axclrtCreateContext(axclrtContext *context, int32_t deviceId);
```

#### 2.10.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| device_id | int | 当前进程可见的虚拟设备 ID。有效 ID 范围为 [0, count - 1]，其中 count 的获取方式见（源码说明不完整）。 |

#### 2.10.3. 返回值

- `context`: *int* — 成功时接收创建的 Context 句柄。
- `ret`: *int* — 已成功创建 Context 并将其设为当前 Context。失败。

#### 2.10.4. 说明

返回类型：`tuple[int, int]`。

源码：`python/axcl/rt/axcl_rt_context.py:114`。

#### 2.10.5. 示例

```python
context, ret = axcl.rt.create_context(device_id)
```

<br>

<a id="axcl.rt.destroy_context"></a>

### 2.11. axcl.rt.destroy_context

销毁显式创建的 Context（源码未提供创建接口引用）。

#### 2.11.1. 函数

**Python 调用**

```python
ret = axcl.rt.destroy_context(context)
```

**C++ 原型**

```cpp
axclError axclrtDestroyContext(axclrtContext context);
```

#### 2.11.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| context | int &#124; None | 返回的 Context 句柄（源码未提供接口引用）。 |

#### 2.11.3. 返回值

- `ret`: *int* — 已成功销毁 Context 并释放其设备激活引用。失败。

#### 2.11.4. 说明

返回类型：`int`。

源码：`python/axcl/rt/axcl_rt_context.py:148`。

#### 2.11.5. 示例

```python
ret = axcl.rt.destroy_context(context)
```

<br>

<a id="axcl.rt.set_current_context"></a>

### 2.12. axcl.rt.set_current_context

将 Context 设为调用线程的当前 Context。

#### 2.12.1. 函数

**Python 调用**

```python
ret = axcl.rt.set_current_context(context)
```

**C++ 原型**

```cpp
axclError axclrtSetCurrentContext(axclrtContext context);
```

#### 2.12.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| context | int &#124; None | 要绑定的有效 Context 句柄。 |

#### 2.12.3. 返回值

- `ret`: *int* — 已成功设置当前 Context。失败。

#### 2.12.4. 说明

返回类型：`int`。

源码：`python/axcl/rt/axcl_rt_context.py:179`。

#### 2.12.5. 示例

```python
ret = axcl.rt.set_current_context(context)
```

<br>

<a id="axcl.rt.get_current_context"></a>

### 2.13. axcl.rt.get_current_context

获取调用线程的当前 Context。

#### 2.13.1. 函数

**Python 调用**

```python
context, ret = axcl.rt.get_current_context()
```

**C++ 原型**

```cpp
axclError axclrtGetCurrentContext(axclrtContext *context);
```

#### 2.13.2. 参数

不适用

#### 2.13.3. 返回值

- `context`: *int* — 成功时接收当前 Context 句柄。
- `ret`: *int* — 已成功返回当前 Context。失败。

#### 2.13.4. 说明

返回类型：`tuple[int, int]`。

源码：`python/axcl/rt/axcl_rt_context.py:210`。

#### 2.13.5. 示例

```python
context, ret = axcl.rt.get_current_context()
```

<br>

<a id="axcl.rt.control_execute_shell_cmd"></a>

### 2.14. axcl.rt.control_execute_shell_cmd

在调用线程当前 Context 关联的设备上执行 shell 命令。

#### 2.14.1. 函数

**Python 调用**

```python
output, ret = axcl.rt.control_execute_shell_cmd(cmd, args, timeout)
```

**C++ 原型**

```cpp
axclError axclrtControlExecuteShellCmd(const char *cmd, const char *const args[], size_t argc, const char **output, int32_t timeout);
```

#### 2.14.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| cmd | str &#124; bytes &#124; None | 要执行的 shell 命令。命令传给设备上的 `sh -c`。 |
| args | list | 可选的附加命令文本数组。忽略 NULL 条目和空字符串。 |
| timeout | int | 超时时间，单位为毫秒。任意负值表示无限等待；零表示立即超时。 |

#### 2.14.3. 返回值

- `output`: *str* — 可选指针，以 C 字符串形式接收合并后的标准输出和标准错误。输出受 AXCL_SHELL_CMD_OUTPUT_LIMIT 限制（默认 1 MiB，最大 16 MiB）。
- `ret`: *int* — 命令已完成，退出状态为 0。shell 异常退出、被信号终止、无法启动或无法监控。命令在设备上执行超时，或 Host RPC 等待超时。失败。

#### 2.14.4. 说明

返回类型：`tuple[str, int]`。

源码：`python/axcl/rt/axcl_rt_control.py:93`。

#### 2.14.5. 示例

```python
output, ret = axcl.rt.control_execute_shell_cmd(cmd, args, timeout)
```

<br>

<a id="axcl.rt.set_device"></a>

### 2.15. axcl.rt.set_device

激活设备，并将其默认 Context 绑定到调用线程。

#### 2.15.1. 函数

**Python 调用**

```python
ret = axcl.rt.set_device(device_id)
```

**C++ 原型**

```cpp
axclError axclrtSetDevice(int32_t deviceId);
```

#### 2.15.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| device_id | int | 当前进程可见的虚拟设备 ID。有效 ID 范围为 [0, count - 1]，其中 count 的获取方式见（源码说明不完整）。 |

#### 2.15.3. 返回值

- `ret`: *int* — 设备已成功激活。失败。

#### 2.15.4. 说明

返回类型：`int`。

源码：`python/axcl/rt/axcl_rt_device.py:373`。

#### 2.15.5. 示例

```python
ret = axcl.rt.set_device(device_id)
```

<br>

<a id="axcl.rt.reset_device"></a>

### 2.16. axcl.rt.reset_device

递减设备激活引用计数，并在计数变为 0 时释放设备。

#### 2.16.1. 函数

**Python 调用**

```python
ret = axcl.rt.reset_device(device_id)
```

**C++ 原型**

```cpp
axclError axclrtResetDevice(int32_t deviceId);
```

#### 2.16.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| device_id | int | 当前进程可见的虚拟设备 ID。 |

#### 2.16.3. 返回值

- `ret`: *int* — 引用计数已递减，或设备已成功释放。失败。

#### 2.16.4. 说明

返回类型：`int`。

源码：`python/axcl/rt/axcl_rt_device.py:404`。

#### 2.16.5. 示例

```python
ret = axcl.rt.reset_device(device_id)
```

<br>

<a id="axcl.rt.reset_device_force"></a>

### 2.17. axcl.rt.reset_device_force

强制释放已激活的设备。

#### 2.17.1. 函数

**Python 调用**

```python
ret = axcl.rt.reset_device_force(device_id)
```

**C++ 原型**

```cpp
axclError axclrtResetDeviceForce(int32_t deviceId);
```

#### 2.17.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| device_id | int | 当前进程可见的虚拟设备 ID。 |

#### 2.17.3. 返回值

- `ret`: *int* — 设备已释放，引用计数已重置为 0。失败。

#### 2.17.4. 说明

返回类型：`int`。

源码：`python/axcl/rt/axcl_rt_device.py:435`。

#### 2.17.5. 示例

```python
ret = axcl.rt.reset_device_force(device_id)
```

<br>

<a id="axcl.rt.reg_device_state_callback"></a>

### 2.18. axcl.rt.reg_device_state_callback

注册或注销设备状态回调函数。

#### 2.18.1. 函数

**Python 调用**

```python
ret = axcl.rt.reg_device_state_callback(callback, args)
```

**C++ 原型**

```cpp
axclError axclrtRegDeviceStateCallback(axclrtDeviceStateCallback callback, void *args);
```

#### 2.18.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| callback | object | 回调函数。传入 NULL 以注销当前回调函数。 |
| args | int &#124; None | 传递给回调的用户数据（源码说明不完整）。 |

#### 2.18.3. 返回值

- `ret`: *int* — 已成功注册、替换或注销回调函数。

#### 2.18.4. 说明

返回类型：`int`。

源码：`python/axcl/rt/axcl_rt_device.py:466`。

#### 2.18.5. 示例

```python
ret = axcl.rt.reg_device_state_callback(callback, args)
```

<br>

<a id="axcl.rt.query_device_status"></a>

### 2.19. axcl.rt.query_device_status

查询设备状态。

#### 2.19.1. 函数

**Python 调用**

```python
device_status, ret = axcl.rt.query_device_status(device_id)
```

**C++ 原型**

```cpp
axclError axclrtQueryDeviceStatus(int32_t deviceId, axclrtDeviceStatus *deviceStatus);
```

#### 2.19.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| device_id | int | 当前进程可见的虚拟设备 ID。 |

#### 2.19.3. 返回值

- `device_status`: *int* — 设备可用状态。
- `ret`: *int* — 已成功返回状态。失败。

#### 2.19.4. 说明

返回类型：`tuple[int, int]`。

源码：`python/axcl/rt/axcl_rt_device.py:503`。

#### 2.19.5. 示例

```python
device_status, ret = axcl.rt.query_device_status(device_id)
```

<br>

<a id="axcl.rt.get_device_info"></a>

### 2.20. axcl.rt.get_device_info

获取设备属性值。

#### 2.20.1. 函数

**Python 调用**

```python
value, ret = axcl.rt.get_device_info(device_id, attr)
```

**C++ 原型**

```cpp
axclError axclrtGetDeviceInfo(int32_t deviceId, axclrtDevAttr attr, uint64_t *value);
```

#### 2.20.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| device_id | int | 当前进程可见的虚拟设备 ID。 |
| attr | int | 要查询的设备属性。 |

#### 2.20.3. 返回值

- `value`: *int* — 属性值。
- `ret`: *int* — 已成功返回属性。失败。

#### 2.20.4. 说明

返回类型：`tuple[int, int]`。

源码：`python/axcl/rt/axcl_rt_device.py:537`。

#### 2.20.5. 示例

```python
value, ret = axcl.rt.get_device_info(device_id, attr)
```

<br>

<a id="axcl.rt.get_device"></a>

### 2.21. axcl.rt.get_device

获取调用线程当前使用的虚拟设备 ID。

#### 2.21.1. 函数

**Python 调用**

```python
device_id, ret = axcl.rt.get_device()
```

**C++ 原型**

```cpp
axclError axclrtGetDevice(int32_t *deviceId);
```

#### 2.21.2. 参数

不适用

#### 2.21.3. 返回值

- `device_id`: *int* — 调用线程当前使用的虚拟设备 ID。
- `ret`: *int* — 成功。失败。

#### 2.21.4. 说明

返回类型：`tuple[int, int]`。

源码：`python/axcl/rt/axcl_rt_device.py:573`。

#### 2.21.5. 示例

```python
device_id, ret = axcl.rt.get_device()
```

<br>

<a id="axcl.rt.get_device_count"></a>

### 2.22. axcl.rt.get_device_count

获取当前进程可见的设备数量。

#### 2.22.1. 函数

**Python 调用**

```python
count, ret = axcl.rt.get_device_count()
```

**C++ 原型**

```cpp
axclError axclrtGetDeviceCount(uint32_t *count);
```

#### 2.22.2. 参数

不适用

#### 2.22.3. 返回值

- `count`: *int* — 当前进程可见的设备数量。
- `ret`: *int* — 已成功返回当前进程可见的设备数量。失败。

#### 2.22.4. 说明

返回类型：`tuple[int, int]`。

源码：`python/axcl/rt/axcl_rt_device.py:604`。

#### 2.22.5. 示例

```python
count, ret = axcl.rt.get_device_count()
```

<br>

<a id="axcl.rt.device_can_access_peer"></a>

### 2.23. axcl.rt.device_can_access_peer

查询设备之间是否支持数据交互。

#### 2.23.1. 函数

**Python 调用**

```python
can_access_peer, ret = axcl.rt.device_can_access_peer(device_id, peer_device_id)
```

**C++ 原型**

```cpp
axclError axclrtDeviceCanAccessPeer(int32_t *canAccessPeer, int32_t deviceId, int32_t peerDeviceId);
```

#### 2.23.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| device_id | int | 源虚拟设备 ID。 |
| peer_device_id | int | 目标虚拟设备 ID。 |

#### 2.23.3. 返回值

- `can_access_peer`: *int* — 1 表示支持，其他值表示不支持。
- `ret`: *int* — 成功。失败。

#### 2.23.4. 说明

返回类型：`tuple[int, int]`。

源码：`python/axcl/rt/axcl_rt_device.py:635`。

#### 2.23.5. 示例

```python
can_access_peer, ret = axcl.rt.device_can_access_peer(device_id, peer_device_id)
```

<br>

<a id="axcl.rt.device_enable_peer_access"></a>

### 2.24. axcl.rt.device_enable_peer_access

启用当前设备到指定设备的数据交互。本函数启用的数据交互是单向的。例如：当前设备 ID 为 0 且（源码示例不完整）。

#### 2.24.1. 函数

**Python 调用**

```python
ret = axcl.rt.device_enable_peer_access(peer_device_id, flags)
```

**C++ 原型**

```cpp
axclError axclrtDeviceEnablePeerAccess(int32_t peerDeviceId, uint32_t flags);
```

#### 2.24.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| peer_device_id | int | 目标虚拟设备 ID。 |
| flags | int | 保留，必须为 0。 |

#### 2.24.3. 返回值

- `ret`: *int* — 成功。失败。

#### 2.24.4. 说明

返回类型：`int`。

源码：`python/axcl/rt/axcl_rt_device.py:671`。

#### 2.24.5. 示例

```python
ret = axcl.rt.device_enable_peer_access(peer_device_id, flags)
```

<br>

<a id="axcl.rt.device_disable_peer_access"></a>

### 2.25. axcl.rt.device_disable_peer_access

禁用当前设备到指定设备的数据交互。

#### 2.25.1. 函数

**Python 调用**

```python
ret = axcl.rt.device_disable_peer_access(peer_device_id)
```

**C++ 原型**

```cpp
axclError axclrtDeviceDisablePeerAccess(int32_t peerDeviceId);
```

#### 2.25.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| peer_device_id | int | 目标虚拟设备 ID。 |

#### 2.25.3. 返回值

- `ret`: *int* — 成功。失败。

#### 2.25.4. 说明

返回类型：`int`。

源码：`python/axcl/rt/axcl_rt_device.py:704`。

#### 2.25.5. 示例

```python
ret = axcl.rt.device_disable_peer_access(peer_device_id)
```

<br>

<a id="axcl.rt.device_peer_access_status"></a>

### 2.26. axcl.rt.device_peer_access_status

查询源设备到指定设备的数据交互启用状态。

#### 2.26.1. 函数

**Python 调用**

```python
status, ret = axcl.rt.device_peer_access_status(device_id, peer_device_id)
```

**C++ 原型**

```cpp
axclError axclrtDevicePeerAccessStatus(int32_t deviceId, int32_t peerDeviceId, int32_t *status);
```

#### 2.26.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| device_id | int | 源虚拟设备 ID。 |
| peer_device_id | int | 目标虚拟设备 ID。 |

#### 2.26.3. 返回值

- `status`: *int* — 1 表示启用，其他值表示禁用。
- `ret`: *int* — 成功。失败。

#### 2.26.4. 说明

返回类型：`tuple[int, int]`。

源码：`python/axcl/rt/axcl_rt_device.py:735`。

#### 2.26.5. 示例

```python
status, ret = axcl.rt.device_peer_access_status(device_id, peer_device_id)
```

<br>

<a id="axcl.rt.synchronize_device"></a>

### 2.27. axcl.rt.synchronize_device

阻塞等待提交到调用线程关联设备的所有任务完成。

#### 2.27.1. 函数

**Python 调用**

```python
ret = axcl.rt.synchronize_device()
```

**C++ 原型**

```cpp
axclError axclrtSynchronizeDevice(void);
```

#### 2.27.2. 参数

不适用

#### 2.27.3. 返回值

- `ret`: *int* — 设备上的所有任务均已完成。失败。

#### 2.27.4. 说明

返回类型：`int`。

源码：`python/axcl/rt/axcl_rt_device.py:771`。

#### 2.27.5. 示例

```python
ret = axcl.rt.synchronize_device()
```

<br>

<a id="axcl.rt.synchronize_device_with_timeout"></a>

### 2.28. axcl.rt.synchronize_device_with_timeout

阻塞等待提交到调用线程关联设备的任务完成，或等待超时。

#### 2.28.1. 函数

**Python 调用**

```python
ret = axcl.rt.synchronize_device_with_timeout(timeout)
```

**C++ 原型**

```cpp
axclError axclrtSynchronizeDeviceWithTimeout(int32_t timeout);
```

#### 2.28.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| timeout | int | 超时时间，单位为毫秒。-1 表示无限等待。 |

#### 2.28.3. 返回值

- `ret`: *int* — 设备上的所有任务均已完成。失败。

#### 2.28.4. 说明

返回类型：`int`。

源码：`python/axcl/rt/axcl_rt_device.py:799`。

#### 2.28.5. 示例

```python
ret = axcl.rt.synchronize_device_with_timeout(timeout)
```

<br>

<a id="axcl.rt.device_get_bare_tgid"></a>

### 2.29. axcl.rt.device_get_bare_tgid

获取调用进程在初始 PID 命名空间中的 Host 原始 TGID。

#### 2.29.1. 函数

**Python 调用**

```python
bare_tgid, ret = axcl.rt.device_get_bare_tgid()
```

**C++ 原型**

```cpp
axclError axclrtDeviceGetBareTgid(int32_t *bareTgid);
```

#### 2.29.2. 参数

不适用

#### 2.29.3. 返回值

- `bare_tgid`: *int* — 接收 Host 层级的原始 TGID。
- `ret`: *int* — 成功返回 0，否则返回错误码。

#### 2.29.4. 说明

返回类型：`tuple[int, int]`。

源码：`python/axcl/rt/axcl_rt_device.py:830`。

#### 2.29.5. 示例

```python
bare_tgid, ret = axcl.rt.device_get_bare_tgid()
```

<br>

<a id="axcl.rt.engine_init"></a>

### 2.30. axcl.rt.engine_init

初始化调用线程当前 Context 关联设备上的 Engine。

#### 2.30.1. 函数

**Python 调用**

```python
ret = axcl.rt.engine_init(npu_kind)
```

**C++ 原型**

```cpp
axclError axclrtEngineInit(axclrtEngineVNpuKind npuKind);
```

#### 2.30.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| npu_kind | int | 用于初始化设备 Engine 的 VNPU 模式。 |

#### 2.30.3. 返回值

- `ret`: *int* — Engine 已成功初始化。失败。

#### 2.30.4. 说明

返回类型：`int`。

源码：`python/axcl/rt/axcl_rt_engine.py:1621`。

#### 2.30.5. 示例

```python
ret = axcl.rt.engine_init(npu_kind)
```

<br>

<a id="axcl.rt.engine_get_vnpu_kind"></a>

### 2.31. axcl.rt.engine_get_vnpu_kind

获取当前 Context 关联设备上 Engine 的 VNPU 模式。

#### 2.31.1. 函数

**Python 调用**

```python
npu_kind, ret = axcl.rt.engine_get_vnpu_kind()
```

**C++ 原型**

```cpp
axclError axclrtEngineGetVNpuKind(axclrtEngineVNpuKind *npuKind);
```

#### 2.31.2. 参数

不适用

#### 2.31.3. 返回值

- `npu_kind`: *int* — 接收初始化后的 VNPU 模式。
- `ret`: *int* — 已成功返回 VNPU 模式。失败。

#### 2.31.4. 说明

返回类型：`tuple[int, int]`。

源码：`python/axcl/rt/axcl_rt_engine.py:1652`。

#### 2.31.5. 示例

```python
npu_kind, ret = axcl.rt.engine_get_vnpu_kind()
```

<br>

<a id="axcl.rt.engine_finalize"></a>

### 2.32. axcl.rt.engine_finalize

去初始化当前 Context 关联设备上的 Engine。

#### 2.32.1. 函数

**Python 调用**

```python
ret = axcl.rt.engine_finalize()
```

**C++ 原型**

```cpp
axclError axclrtEngineFinalize(void);
```

#### 2.32.2. 参数

不适用

#### 2.32.3. 返回值

- `ret`: *int* — Engine 已成功去初始化。失败。

#### 2.32.4. 说明

返回类型：`int`。

源码：`python/axcl/rt/axcl_rt_engine.py:1683`。

#### 2.32.5. 示例

```python
ret = axcl.rt.engine_finalize()
```

<br>

<a id="axcl.rt.engine_load_from_file"></a>

### 2.33. axcl.rt.engine_load_from_file

从 Host 文件加载离线模型到当前设备的 Engine。

#### 2.33.1. 函数

**Python 调用**

```python
model_id, ret = axcl.rt.engine_load_from_file(model_path)
```

**C++ 原型**

```cpp
axclError axclrtEngineLoadFromFile(const char *modelPath, uint64_t *modelId);
```

#### 2.33.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| model_path | str &#124; bytes &#124; None | Host 上可读的普通模型文件路径。 |

#### 2.33.3. 返回值

- `model_id`: *int* — 接收后续 Engine 接口使用的模型 ID。
- `ret`: *int* — 模型已成功加载。失败。

#### 2.33.4. 说明

返回类型：`tuple[int, int]`。

源码：`python/axcl/rt/axcl_rt_engine.py:1711`。

#### 2.33.5. 示例

```python
model_id, ret = axcl.rt.engine_load_from_file(model_path)
```

<br>

<a id="axcl.rt.engine_load_from_mem"></a>

### 2.34. axcl.rt.engine_load_from_mem

从 Device 内存加载离线模型到当前设备的 Engine。

#### 2.34.1. 函数

**Python 调用**

```python
model_id, ret = axcl.rt.engine_load_from_mem(model, model_size)
```

**C++ 原型**

```cpp
axclError axclrtEngineLoadFromMem(const void *model, uint64_t modelSize, uint64_t *modelId);
```

#### 2.34.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| model | int &#124; None | 包含模型数据的 Device 内存句柄。 |
| model_size | int | 模型数据大小，单位为字节。必须大于 0。 |

#### 2.34.3. 返回值

- `model_id`: *int* — 接收后续 Engine 接口使用的模型 ID。
- `ret`: *int* — 模型已成功加载。失败。

#### 2.34.4. 说明

返回类型：`tuple[int, int]`。

源码：`python/axcl/rt/axcl_rt_engine.py:1745`。

#### 2.34.5. 示例

```python
model_id, ret = axcl.rt.engine_load_from_mem(model, model_size)
```

<br>

<a id="axcl.rt.engine_unload"></a>

### 2.35. axcl.rt.engine_unload

从当前设备的 Engine 卸载模型。

#### 2.35.1. 函数

**Python 调用**

```python
ret = axcl.rt.engine_unload(model_id)
```

**C++ 原型**

```cpp
axclError axclrtEngineUnload(uint64_t modelId);
```

#### 2.35.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| model_id | int | 加载函数返回的模型 ID。 |

#### 2.35.3. 返回值

- `ret`: *int* — 模型已成功卸载。失败。

#### 2.35.4. 说明

返回类型：`int`。

源码：`python/axcl/rt/axcl_rt_engine.py:1781`。

#### 2.35.5. 示例

```python
ret = axcl.rt.engine_unload(model_id)
```

<br>

<a id="axcl.rt.engine_get_model_compiler_version"></a>

### 2.36. axcl.rt.engine_get_model_compiler_version

获取已加载模型中保存的编译工具链版本。

#### 2.36.1. 函数

**Python 调用**

```python
result = axcl.rt.engine_get_model_compiler_version(model_id)
```

**C++ 原型**

```cpp
const char * axclrtEngineGetModelCompilerVersion(uint64_t modelId);
```

#### 2.36.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| model_id | int | 已加载的模型 ID。 |

#### 2.36.3. 返回值

- `result`: *str* — 成功时返回线程局部、以空字符结尾的版本字符串；失败时返回 NULL。该指针可能被同一线程的后续调用覆盖，调用者不得释放它。

#### 2.36.4. 说明

返回类型：`str`。

源码：`python/axcl/rt/axcl_rt_engine.py:1812`。

#### 2.36.5. 示例

```python
result = axcl.rt.engine_get_model_compiler_version(model_id)
```

<br>

<a id="axcl.rt.engine_set_affinity"></a>

### 2.37. axcl.rt.engine_set_affinity

设置已加载模型的 NPU 核亲和性掩码。

#### 2.37.1. 函数

**Python 调用**

```python
ret = axcl.rt.engine_set_affinity(model_id, set)
```

**C++ 原型**

```cpp
axclError axclrtEngineSetAffinity(uint64_t modelId, axclrtEngineSet set);
```

#### 2.37.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| model_id | int | 已加载的模型 ID。 |
| set | int | 使用位索引 0 至 2 的非零亲和性掩码；有效值为 0x1 至 0x7。 |

#### 2.37.3. 返回值

- `ret`: *int* — 亲和性已成功设置。失败。

#### 2.37.4. 说明

返回类型：`int`。

源码：`python/axcl/rt/axcl_rt_engine.py:1843`。

#### 2.37.5. 示例

```python
ret = axcl.rt.engine_set_affinity(model_id, set)
```

<br>

<a id="axcl.rt.engine_get_affinity"></a>

### 2.38. axcl.rt.engine_get_affinity

获取已加载模型的 NPU 核亲和性掩码。

#### 2.38.1. 函数

**Python 调用**

```python
set, ret = axcl.rt.engine_get_affinity(model_id)
```

**C++ 原型**

```cpp
axclError axclrtEngineGetAffinity(uint64_t modelId, axclrtEngineSet *set);
```

#### 2.38.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| model_id | int | 已加载的模型 ID。 |

#### 2.38.3. 返回值

- `set`: *int* — 接收亲和性掩码。
- `ret`: *int* — 已成功返回亲和性。失败。

#### 2.38.4. 说明

返回类型：`tuple[int, int]`。

源码：`python/axcl/rt/axcl_rt_engine.py:1876`。

#### 2.38.5. 示例

```python
set, ret = axcl.rt.engine_get_affinity(model_id)
```

<br>

<a id="axcl.rt.engine_set_context_affinity"></a>

### 2.39. axcl.rt.engine_set_context_affinity

设置单个 Engine Context 的亲和性；当前不支持此操作。

#### 2.39.1. 函数

**Python 调用**

```python
ret = axcl.rt.engine_set_context_affinity(model_id, context_id, set)
```

**C++ 原型**

```cpp
axclError axclrtEngineSetContextAffinity(uint64_t modelId, uint64_t contextId, axclrtEngineSet set);
```

#### 2.39.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| model_id | int | 已加载的模型 ID。 |
| context_id | int | Engine Context ID。 |
| set | int | 0x1 至 0x7 范围内的非零亲和性掩码。 |

#### 2.39.3. 返回值

- `ret`: *int* — 当前不支持此操作，或参数无效。

#### 2.39.4. 说明

返回类型：`int`。

源码：`python/axcl/rt/axcl_rt_engine.py:1910`。

#### 2.39.5. 示例

```python
ret = axcl.rt.engine_set_context_affinity(model_id, context_id, set)
```

<br>

<a id="axcl.rt.engine_get_context_affinity"></a>

### 2.40. axcl.rt.engine_get_context_affinity

获取单个 Engine Context 的亲和性；当前不支持此操作。

#### 2.40.1. 函数

**Python 调用**

```python
set, ret = axcl.rt.engine_get_context_affinity(model_id, context_id)
```

**C++ 原型**

```cpp
axclError axclrtEngineGetContextAffinity(uint64_t modelId, uint64_t contextId, axclrtEngineSet *set);
```

#### 2.40.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| model_id | int | 已加载的模型 ID。 |
| context_id | int | Engine Context ID。 |

#### 2.40.3. 返回值

- `set`: *int* — 输出亲和性掩码；不支持此操作时不返回值。
- `ret`: *int* — 当前不支持此操作，或参数无效。

#### 2.40.4. 说明

返回类型：`tuple[int, int]`。

源码：`python/axcl/rt/axcl_rt_engine.py:1945`。

#### 2.40.5. 示例

```python
set, ret = axcl.rt.engine_get_context_affinity(model_id, context_id)
```

<br>

<a id="axcl.rt.engine_get_usage"></a>

### 2.41. axcl.rt.engine_get_usage

获取模型文件的 Engine 内存使用情况。

#### 2.41.1. 函数

**Python 调用**

```python
sys_size, cmm_size, ret = axcl.rt.engine_get_usage(model_path)
```

**C++ 原型**

```cpp
axclError axclrtEngineGetUsage(const char *modelPath, int64_t *sysSize, int64_t *cmmSize);
```

#### 2.41.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| model_path | str &#124; bytes &#124; None | Host 上可读的普通模型文件路径。 |

#### 2.41.3. 返回值

- `sys_size`: *int* — 接收系统内存使用量，单位为字节。当前实现返回 0。
- `cmm_size`: *int* — 接收 CMM 内存使用量，单位为字节。
- `ret`: *int* — 已成功返回内存使用量。失败。

#### 2.41.4. 说明

返回类型：`tuple[int, int, int]`。

源码：`python/axcl/rt/axcl_rt_engine.py:1981`。

#### 2.41.5. 示例

```python
sys_size, cmm_size, ret = axcl.rt.engine_get_usage(model_path)
```

<br>

<a id="axcl.rt.engine_get_usage_from_mem"></a>

### 2.42. axcl.rt.engine_get_usage_from_mem

获取存放在 Device 内存中的模型数据的 Engine 内存使用情况。

#### 2.42.1. 函数

**Python 调用**

```python
sys_size, cmm_size, ret = axcl.rt.engine_get_usage_from_mem(model, model_size)
```

**C++ 原型**

```cpp
axclError axclrtEngineGetUsageFromMem(const void *model, uint64_t modelSize, int64_t *sysSize, int64_t *cmmSize);
```

#### 2.42.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| model | int &#124; None | 包含模型数据的 Device 内存句柄。 |
| model_size | int | 模型数据大小，单位为字节。必须大于 0。 |

#### 2.42.3. 返回值

- `sys_size`: *int* — 接收系统内存使用量，单位为字节。当前实现返回 0。
- `cmm_size`: *int* — 接收 CMM 内存使用量，单位为字节。
- `ret`: *int* — 已成功返回内存使用量。失败。

#### 2.42.4. 说明

返回类型：`tuple[int, int, int]`。

源码：`python/axcl/rt/axcl_rt_engine.py:2017`。

#### 2.42.5. 示例

```python
sys_size, cmm_size, ret = axcl.rt.engine_get_usage_from_mem(model, model_size)
```

<br>

<a id="axcl.rt.engine_get_usage_from_model_id"></a>

### 2.43. axcl.rt.engine_get_usage_from_model_id

获取已加载模型的 Engine 内存使用情况。

#### 2.43.1. 函数

**Python 调用**

```python
sys_size, cmm_size, ret = axcl.rt.engine_get_usage_from_model_id(model_id)
```

**C++ 原型**

```cpp
axclError axclrtEngineGetUsageFromModelId(uint64_t modelId, int64_t *sysSize, int64_t *cmmSize);
```

#### 2.43.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| model_id | int | 已加载的模型 ID。 |

#### 2.43.3. 返回值

- `sys_size`: *int* — 接收系统内存使用量，单位为字节。当前实现返回 0。
- `cmm_size`: *int* — 接收 CMM 内存使用量，单位为字节。
- `ret`: *int* — 已成功返回内存使用量。失败。

#### 2.43.4. 说明

返回类型：`tuple[int, int, int]`。

源码：`python/axcl/rt/axcl_rt_engine.py:2055`。

#### 2.43.5. 示例

```python
sys_size, cmm_size, ret = axcl.rt.engine_get_usage_from_model_id(model_id)
```

<br>

<a id="axcl.rt.engine_get_model_type"></a>

### 2.44. axcl.rt.engine_get_model_type

获取模型文件的核数分类。

#### 2.44.1. 函数

**Python 调用**

```python
model_type, ret = axcl.rt.engine_get_model_type(model_path)
```

**C++ 原型**

```cpp
axclError axclrtEngineGetModelType(const char *modelPath, axclrtEngineModelKind *modelType);
```

#### 2.44.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| model_path | str &#124; bytes &#124; None | Host 上可读的普通模型文件路径。 |

#### 2.44.3. 返回值

- `model_type`: *int* — 接收模型类型。
- `ret`: *int* — 已成功返回模型类型。失败。

#### 2.44.4. 说明

返回类型：`tuple[int, int]`。

源码：`python/axcl/rt/axcl_rt_engine.py:2091`。

#### 2.44.5. 示例

```python
model_type, ret = axcl.rt.engine_get_model_type(model_path)
```

<br>

<a id="axcl.rt.engine_get_model_type_from_mem"></a>

### 2.45. axcl.rt.engine_get_model_type_from_mem

获取存放在 Device 内存中的模型数据的核数分类。

#### 2.45.1. 函数

**Python 调用**

```python
model_type, ret = axcl.rt.engine_get_model_type_from_mem(model, model_size)
```

**C++ 原型**

```cpp
axclError axclrtEngineGetModelTypeFromMem(const void *model, uint64_t modelSize, axclrtEngineModelKind *modelType);
```

#### 2.45.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| model | int &#124; None | 包含模型数据的 Device 内存句柄。 |
| model_size | int | 模型数据大小，单位为字节。必须大于 0。 |

#### 2.45.3. 返回值

- `model_type`: *int* — 接收模型类型。
- `ret`: *int* — 已成功返回模型类型。失败。

#### 2.45.4. 说明

返回类型：`tuple[int, int]`。

源码：`python/axcl/rt/axcl_rt_engine.py:2125`。

#### 2.45.5. 示例

```python
model_type, ret = axcl.rt.engine_get_model_type_from_mem(model, model_size)
```

<br>

<a id="axcl.rt.engine_get_model_type_from_model_id"></a>

### 2.46. axcl.rt.engine_get_model_type_from_model_id

获取已加载模型的核数分类。

#### 2.46.1. 函数

**Python 调用**

```python
model_type, ret = axcl.rt.engine_get_model_type_from_model_id(model_id)
```

**C++ 原型**

```cpp
axclError axclrtEngineGetModelTypeFromModelId(uint64_t modelId, axclrtEngineModelKind *modelType);
```

#### 2.46.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| model_id | int | 已加载的模型 ID。 |

#### 2.46.3. 返回值

- `model_type`: *int* — 接收模型类型。
- `ret`: *int* — 已成功返回模型类型。失败。

#### 2.46.4. 说明

返回类型：`tuple[int, int]`。

源码：`python/axcl/rt/axcl_rt_engine.py:2161`。

#### 2.46.5. 示例

```python
model_type, ret = axcl.rt.engine_get_model_type_from_model_id(model_id)
```

<br>

<a id="axcl.rt.engine_get_io_info"></a>

### 2.47. axcl.rt.engine_get_io_info

创建 Host 端元数据对象，用于描述已加载模型的输入和输出。

#### 2.47.1. 函数

**Python 调用**

```python
io_info, ret = axcl.rt.engine_get_io_info(model_id)
```

**C++ 原型**

```cpp
axclError axclrtEngineGetIOInfo(uint64_t modelId, axclrtEngineIOInfo *ioInfo);
```

#### 2.47.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| model_id | int | 已加载的模型 ID。 |

#### 2.47.3. 返回值

- `io_info`: *int* — 接收创建的 IO 元数据句柄。
- `ret`: *int* — IO 元数据已成功创建。失败。

#### 2.47.4. 说明

返回类型：`tuple[int, int]`。

源码：`python/axcl/rt/axcl_rt_engine.py:2195`。

#### 2.47.5. 示例

```python
io_info, ret = axcl.rt.engine_get_io_info(model_id)
```

<br>

<a id="axcl.rt.engine_destroy_io_info"></a>

### 2.48. axcl.rt.engine_destroy_io_info

销毁已创建的 IO 元数据对象（源码未提供创建接口引用）。

#### 2.48.1. 函数

**Python 调用**

```python
ret = axcl.rt.engine_destroy_io_info(io_info)
```

**C++ 原型**

```cpp
axclError axclrtEngineDestroyIOInfo(axclrtEngineIOInfo ioInfo);
```

#### 2.48.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| io_info | int &#124; None | 要销毁的 IO 元数据句柄。 |

#### 2.48.3. 返回值

- `ret`: *int* — IO 元数据已成功销毁。失败。

#### 2.48.4. 说明

返回类型：`int`。

源码：`python/axcl/rt/axcl_rt_engine.py:2229`。

#### 2.48.5. 示例

```python
ret = axcl.rt.engine_destroy_io_info(io_info)
```

<br>

<a id="axcl.rt.engine_get_shape_groups_count"></a>

### 2.49. axcl.rt.engine_get_shape_groups_count

获取 IO 元数据对象描述的 shape 组数量。

#### 2.49.1. 函数

**Python 调用**

```python
count, ret = axcl.rt.engine_get_shape_groups_count(io_info)
```

**C++ 原型**

```cpp
axclError axclrtEngineGetShapeGroupsCount(axclrtEngineIOInfo ioInfo, int32_t *count);
```

#### 2.49.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| io_info | int &#124; None | 有效的 IO 元数据句柄。 |

#### 2.49.3. 返回值

- `count`: *int* — 接收 shape 组数量；模型无输入时为 0。
- `ret`: *int* — 已成功返回数量。失败。

#### 2.49.4. 说明

返回类型：`tuple[int, int]`。

源码：`python/axcl/rt/axcl_rt_engine.py:2260`。

#### 2.49.5. 示例

```python
count, ret = axcl.rt.engine_get_shape_groups_count(io_info)
```

<br>

<a id="axcl.rt.engine_get_num_inputs"></a>

### 2.50. axcl.rt.engine_get_num_inputs

获取 IO 元数据对象中的模型输入数量。

#### 2.50.1. 函数

**Python 调用**

```python
ret = axcl.rt.engine_get_num_inputs(io_info)
```

**C++ 原型**

```cpp
uint32_t axclrtEngineGetNumInputs(axclrtEngineIOInfo ioInfo);
```

#### 2.50.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| io_info | int &#124; None | 有效的 IO 元数据句柄。 |

#### 2.50.3. 返回值

- `ret`: *int* — 输入数量。如果（源码条件不完整）。

#### 2.50.4. 说明

返回类型：`int`。

源码：`python/axcl/rt/axcl_rt_engine.py:2294`。

#### 2.50.5. 示例

```python
ret = axcl.rt.engine_get_num_inputs(io_info)
```

<br>

<a id="axcl.rt.engine_get_num_outputs"></a>

### 2.51. axcl.rt.engine_get_num_outputs

获取 IO 元数据对象中的模型输出数量。

#### 2.51.1. 函数

**Python 调用**

```python
ret = axcl.rt.engine_get_num_outputs(io_info)
```

**C++ 原型**

```cpp
uint32_t axclrtEngineGetNumOutputs(axclrtEngineIOInfo ioInfo);
```

#### 2.51.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| io_info | int &#124; None | 有效的 IO 元数据句柄。 |

#### 2.51.3. 返回值

- `ret`: *int* — 输出数量。如果（源码条件不完整）。

#### 2.51.4. 说明

返回类型：`int`。

源码：`python/axcl/rt/axcl_rt_engine.py:2325`。

#### 2.51.5. 示例

```python
ret = axcl.rt.engine_get_num_outputs(io_info)
```

<br>

<a id="axcl.rt.engine_get_input_size_by_index"></a>

### 2.52. axcl.rt.engine_get_input_size_by_index

获取指定 shape 组中模型输入所需的缓冲区大小。

#### 2.52.1. 函数

**Python 调用**

```python
ret = axcl.rt.engine_get_input_size_by_index(io_info, group, index)
```

**C++ 原型**

```cpp
uint64_t axclrtEngineGetInputSizeByIndex(axclrtEngineIOInfo ioInfo, uint32_t group, uint32_t index);
```

#### 2.52.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| io_info | int &#124; None | 有效的 IO 元数据句柄。 |
| group | int | shape 组索引，从 0 开始。 |
| index | int | 输入索引，从 0 开始。 |

#### 2.52.3. 返回值

- `ret`: *int* — 所需大小，单位为字节。失败时返回编码后的错误值，并设置最近一次错误。

#### 2.52.4. 说明

返回类型：`int`。

源码：`python/axcl/rt/axcl_rt_engine.py:2356`。

#### 2.52.5. 示例

```python
ret = axcl.rt.engine_get_input_size_by_index(io_info, group, index)
```

<br>

<a id="axcl.rt.engine_get_output_size_by_index"></a>

### 2.53. axcl.rt.engine_get_output_size_by_index

获取指定 shape 组中模型输出所需的缓冲区大小。

#### 2.53.1. 函数

**Python 调用**

```python
ret = axcl.rt.engine_get_output_size_by_index(io_info, group, index)
```

**C++ 原型**

```cpp
uint64_t axclrtEngineGetOutputSizeByIndex(axclrtEngineIOInfo ioInfo, uint32_t group, uint32_t index);
```

#### 2.53.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| io_info | int &#124; None | 有效的 IO 元数据句柄。 |
| group | int | shape 组索引，从 0 开始。 |
| index | int | 输出索引，从 0 开始。 |

#### 2.53.3. 返回值

- `ret`: *int* — 所需大小，单位为字节。失败时返回编码后的错误值，并设置最近一次错误。

#### 2.53.4. 说明

返回类型：`int`。

源码：`python/axcl/rt/axcl_rt_engine.py:2391`。

#### 2.53.5. 示例

```python
ret = axcl.rt.engine_get_output_size_by_index(io_info, group, index)
```

<br>

<a id="axcl.rt.engine_get_input_name_by_index"></a>

### 2.54. axcl.rt.engine_get_input_name_by_index

按索引获取输入张量名称。

#### 2.54.1. 函数

**Python 调用**

```python
result = axcl.rt.engine_get_input_name_by_index(io_info, index)
```

**C++ 原型**

```cpp
const char * axclrtEngineGetInputNameByIndex(axclrtEngineIOInfo ioInfo, uint32_t index);
```

#### 2.54.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| io_info | int &#124; None | 有效的 IO 元数据句柄。 |
| index | int | 输入索引，从 0 开始。 |

#### 2.54.3. 返回值

- `result`: *str* — 成功时返回张量名称；失败时返回 NULL。返回指针的所有者为（源码说明不完整）。

#### 2.54.4. 说明

返回类型：`str`。

源码：`python/axcl/rt/axcl_rt_engine.py:2426`。

#### 2.54.5. 示例

```python
result = axcl.rt.engine_get_input_name_by_index(io_info, index)
```

<br>

<a id="axcl.rt.engine_get_output_name_by_index"></a>

### 2.55. axcl.rt.engine_get_output_name_by_index

按索引获取输出张量名称。

#### 2.55.1. 函数

**Python 调用**

```python
result = axcl.rt.engine_get_output_name_by_index(io_info, index)
```

**C++ 原型**

```cpp
const char * axclrtEngineGetOutputNameByIndex(axclrtEngineIOInfo ioInfo, uint32_t index);
```

#### 2.55.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| io_info | int &#124; None | 有效的 IO 元数据句柄。 |
| index | int | 输出索引，从 0 开始。 |

#### 2.55.3. 返回值

- `result`: *str* — 成功时返回张量名称；失败时返回 NULL。返回指针的所有者为（源码说明不完整）。

#### 2.55.4. 说明

返回类型：`str`。

源码：`python/axcl/rt/axcl_rt_engine.py:2459`。

#### 2.55.5. 示例

```python
result = axcl.rt.engine_get_output_name_by_index(io_info, index)
```

<br>

<a id="axcl.rt.engine_get_input_index_by_name"></a>

### 2.56. axcl.rt.engine_get_input_index_by_name

按名称查找输入张量索引。

#### 2.56.1. 函数

**Python 调用**

```python
ret = axcl.rt.engine_get_input_index_by_name(io_info, name)
```

**C++ 原型**

```cpp
int32_t axclrtEngineGetInputIndexByName(axclrtEngineIOInfo ioInfo, const char *name);
```

#### 2.56.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| io_info | int &#124; None | 有效的 IO 元数据句柄。 |
| name | str &#124; bytes &#124; None | 输入张量名称。 |

#### 2.56.3. 返回值

- `ret`: *int* — 成功时返回非负输入索引；失败时返回 Engine 错误值。使用（源码说明不完整）。

#### 2.56.4. 说明

返回类型：`int`。

源码：`python/axcl/rt/axcl_rt_engine.py:2492`。

#### 2.56.5. 示例

```python
ret = axcl.rt.engine_get_input_index_by_name(io_info, name)
```

<br>

<a id="axcl.rt.engine_get_output_index_by_name"></a>

### 2.57. axcl.rt.engine_get_output_index_by_name

按名称查找输出张量索引。

#### 2.57.1. 函数

**Python 调用**

```python
ret = axcl.rt.engine_get_output_index_by_name(io_info, name)
```

**C++ 原型**

```cpp
int32_t axclrtEngineGetOutputIndexByName(axclrtEngineIOInfo ioInfo, const char *name);
```

#### 2.57.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| io_info | int &#124; None | 有效的 IO 元数据句柄。 |
| name | str &#124; bytes &#124; None | 输出张量名称。 |

#### 2.57.3. 返回值

- `ret`: *int* — 成功时返回非负输出索引；失败时返回 Engine 错误值。使用（源码说明不完整）。

#### 2.57.4. 说明

返回类型：`int`。

源码：`python/axcl/rt/axcl_rt_engine.py:2525`。

#### 2.57.5. 示例

```python
ret = axcl.rt.engine_get_output_index_by_name(io_info, name)
```

<br>

<a id="axcl.rt.engine_get_input_dims"></a>

### 2.58. axcl.rt.engine_get_input_dims

获取指定 shape 组中输入张量的维度。

#### 2.58.1. 函数

**Python 调用**

```python
dims, ret = axcl.rt.engine_get_input_dims(io_info, group, index)
```

**C++ 原型**

```cpp
axclError axclrtEngineGetInputDims(axclrtEngineIOInfo ioInfo, uint32_t group, uint32_t index, axclrtEngineIODims *dims);
```

#### 2.58.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| io_info | int &#124; None | 有效的 IO 元数据句柄。 |
| group | int | shape 组索引，从 0 开始。 |
| index | int | 输入索引，从 0 开始。 |

#### 2.58.3. 返回值

- `dims`: *dict* — 调用者提供的结构体，用于接收维度。
- `ret`: *int* — 已成功返回维度。失败。

#### 2.58.4. 说明

返回类型：`tuple[dict, int]`。

源码：`python/axcl/rt/axcl_rt_engine.py:2558`。

#### 2.58.5. 示例

```python
dims, ret = axcl.rt.engine_get_input_dims(io_info, group, index)
```

<br>

<a id="axcl.rt.engine_get_input_data_type"></a>

### 2.59. axcl.rt.engine_get_input_data_type

获取输入张量的数据类型。

#### 2.59.1. 函数

**Python 调用**

```python
type, ret = axcl.rt.engine_get_input_data_type(io_info, index)
```

**C++ 原型**

```cpp
axclError axclrtEngineGetInputDataType(axclrtEngineIOInfo ioInfo, uint32_t index, axclrtEngineDataType *type);
```

#### 2.59.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| io_info | int &#124; None | 有效的 IO 元数据句柄。 |
| index | int | 输入索引，从 0 开始。 |

#### 2.59.3. 返回值

- `type`: *int* — 接收输入数据类型。
- `ret`: *int* — 已成功返回数据类型。失败。

#### 2.59.4. 说明

返回类型：`tuple[int, int]`。

源码：`python/axcl/rt/axcl_rt_engine.py:2596`。

#### 2.59.5. 示例

```python
type, ret = axcl.rt.engine_get_input_data_type(io_info, index)
```

<br>

<a id="axcl.rt.engine_get_output_data_type"></a>

### 2.60. axcl.rt.engine_get_output_data_type

获取输出张量的数据类型。

#### 2.60.1. 函数

**Python 调用**

```python
type, ret = axcl.rt.engine_get_output_data_type(io_info, index)
```

**C++ 原型**

```cpp
axclError axclrtEngineGetOutputDataType(axclrtEngineIOInfo ioInfo, uint32_t index, axclrtEngineDataType *type);
```

#### 2.60.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| io_info | int &#124; None | 有效的 IO 元数据句柄。 |
| index | int | 输出索引，从 0 开始。 |

#### 2.60.3. 返回值

- `type`: *int* — 接收输出数据类型。
- `ret`: *int* — 已成功返回数据类型。失败。

#### 2.60.4. 说明

返回类型：`tuple[int, int]`。

源码：`python/axcl/rt/axcl_rt_engine.py:2632`。

#### 2.60.5. 示例

```python
type, ret = axcl.rt.engine_get_output_data_type(io_info, index)
```

<br>

<a id="axcl.rt.engine_get_input_data_layout"></a>

### 2.61. axcl.rt.engine_get_input_data_layout

获取输入张量的数据布局。

#### 2.61.1. 函数

**Python 调用**

```python
layout, ret = axcl.rt.engine_get_input_data_layout(io_info, index)
```

**C++ 原型**

```cpp
axclError axclrtEngineGetInputDataLayout(axclrtEngineIOInfo ioInfo, uint32_t index, axclrtEngineDataLayout *layout);
```

#### 2.61.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| io_info | int &#124; None | 有效的 IO 元数据句柄。 |
| index | int | 输入索引，从 0 开始。 |

#### 2.61.3. 返回值

- `layout`: *int* — 接收输入数据布局。
- `ret`: *int* — 已成功返回数据布局。失败。

#### 2.61.4. 说明

返回类型：`tuple[int, int]`。

源码：`python/axcl/rt/axcl_rt_engine.py:2668`。

#### 2.61.5. 示例

```python
layout, ret = axcl.rt.engine_get_input_data_layout(io_info, index)
```

<br>

<a id="axcl.rt.engine_get_output_data_layout"></a>

### 2.62. axcl.rt.engine_get_output_data_layout

获取输出张量的数据布局。

#### 2.62.1. 函数

**Python 调用**

```python
layout, ret = axcl.rt.engine_get_output_data_layout(io_info, index)
```

**C++ 原型**

```cpp
axclError axclrtEngineGetOutputDataLayout(axclrtEngineIOInfo ioInfo, uint32_t index, axclrtEngineDataLayout *layout);
```

#### 2.62.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| io_info | int &#124; None | 有效的 IO 元数据句柄。 |
| index | int | 输出索引，从 0 开始。 |

#### 2.62.3. 返回值

- `layout`: *int* — 接收输出数据布局。
- `ret`: *int* — 已成功返回数据布局。失败。

#### 2.62.4. 说明

返回类型：`tuple[int, int]`。

源码：`python/axcl/rt/axcl_rt_engine.py:2704`。

#### 2.62.5. 示例

```python
layout, ret = axcl.rt.engine_get_output_data_layout(io_info, index)
```

<br>

<a id="axcl.rt.engine_get_output_dims"></a>

### 2.63. axcl.rt.engine_get_output_dims

获取指定 shape 组中输出张量的维度。

#### 2.63.1. 函数

**Python 调用**

```python
dims, ret = axcl.rt.engine_get_output_dims(io_info, group, index)
```

**C++ 原型**

```cpp
axclError axclrtEngineGetOutputDims(axclrtEngineIOInfo ioInfo, uint32_t group, uint32_t index, axclrtEngineIODims *dims);
```

#### 2.63.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| io_info | int &#124; None | 有效的 IO 元数据句柄。 |
| group | int | shape 组索引，从 0 开始。 |
| index | int | 输出索引，从 0 开始。 |

#### 2.63.3. 返回值

- `dims`: *dict* — 调用者提供的结构体，用于接收维度。
- `ret`: *int* — 已成功返回维度。失败。

#### 2.63.4. 说明

返回类型：`tuple[dict, int]`。

源码：`python/axcl/rt/axcl_rt_engine.py:2740`。

#### 2.63.5. 示例

```python
dims, ret = axcl.rt.engine_get_output_dims(io_info, group, index)
```

<br>

<a id="axcl.rt.engine_create_io"></a>

### 2.64. axcl.rt.engine_create_io

根据模型 IO 元数据创建 Host 端 IO 绑定对象。

#### 2.64.1. 函数

**Python 调用**

```python
io, ret = axcl.rt.engine_create_io(io_info)
```

**C++ 原型**

```cpp
axclError axclrtEngineCreateIO(axclrtEngineIOInfo ioInfo, axclrtEngineIO *io);
```

#### 2.64.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| io_info | int &#124; None | 有效的 IO 元数据句柄。 |

#### 2.64.3. 返回值

- `io`: *int* — 接收创建的 IO 绑定句柄。
- `ret`: *int* — IO 绑定对象已成功创建。失败。

#### 2.64.4. 说明

返回类型：`tuple[int, int]`。

源码：`python/axcl/rt/axcl_rt_engine.py:2778`。

#### 2.64.5. 示例

```python
io, ret = axcl.rt.engine_create_io(io_info)
```

<br>

<a id="axcl.rt.engine_destroy_io"></a>

### 2.65. axcl.rt.engine_destroy_io

销毁已创建的 IO 绑定对象（源码未提供创建接口引用）。

#### 2.65.1. 函数

**Python 调用**

```python
ret = axcl.rt.engine_destroy_io(io)
```

**C++ 原型**

```cpp
axclError axclrtEngineDestroyIO(axclrtEngineIO io);
```

#### 2.65.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| io | int &#124; None | 要销毁的 IO 绑定句柄。 |

#### 2.65.3. 返回值

- `ret`: *int* — IO 绑定对象已成功销毁。失败。

#### 2.65.4. 说明

返回类型：`int`。

源码：`python/axcl/rt/axcl_rt_engine.py:2812`。

#### 2.65.5. 示例

```python
ret = axcl.rt.engine_destroy_io(io)
```

<br>

<a id="axcl.rt.engine_set_input_buffer_by_index"></a>

### 2.66. axcl.rt.engine_set_input_buffer_by_index

按索引将 Device 缓冲区绑定到输入。

#### 2.66.1. 函数

**Python 调用**

```python
ret = axcl.rt.engine_set_input_buffer_by_index(io, index, data_buffer, size)
```

**C++ 原型**

```cpp
axclError axclrtEngineSetInputBufferByIndex(axclrtEngineIO io, uint32_t index, const void *dataBuffer, uint64_t size);
```

#### 2.66.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| io | int &#124; None | 有效的 IO 绑定句柄。 |
| index | int | 输入索引，从 0 开始。 |
| data_buffer | int &#124; None | 要绑定的 Device 内存句柄。 |
| size | int | 绑定缓冲区的大小，单位为字节。必须大于 0。 |

#### 2.66.3. 返回值

- `ret`: *int* — 缓冲区绑定已成功保存。失败。

#### 2.66.4. 说明

返回类型：`int`。

源码：`python/axcl/rt/axcl_rt_engine.py:2843`。

#### 2.66.5. 示例

```python
ret = axcl.rt.engine_set_input_buffer_by_index(io, index, data_buffer, size)
```

<br>

<a id="axcl.rt.engine_set_output_buffer_by_index"></a>

### 2.67. axcl.rt.engine_set_output_buffer_by_index

按索引将 Device 缓冲区绑定到输出。

#### 2.67.1. 函数

**Python 调用**

```python
ret = axcl.rt.engine_set_output_buffer_by_index(io, index, data_buffer, size)
```

**C++ 原型**

```cpp
axclError axclrtEngineSetOutputBufferByIndex(axclrtEngineIO io, uint32_t index, const void *dataBuffer, uint64_t size);
```

#### 2.67.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| io | int &#124; None | 有效的 IO 绑定句柄。 |
| index | int | 输出索引，从 0 开始。 |
| data_buffer | int &#124; None | 要绑定的 Device 内存句柄。 |
| size | int | 绑定缓冲区的大小，单位为字节。必须大于 0。 |

#### 2.67.3. 返回值

- `ret`: *int* — 缓冲区绑定已成功保存。失败。

#### 2.67.4. 说明

返回类型：`int`。

源码：`python/axcl/rt/axcl_rt_engine.py:2880`。

#### 2.67.5. 示例

```python
ret = axcl.rt.engine_set_output_buffer_by_index(io, index, data_buffer, size)
```

<br>

<a id="axcl.rt.engine_set_input_buffer_by_name"></a>

### 2.68. axcl.rt.engine_set_input_buffer_by_name

按张量名称将 Device 缓冲区绑定到输入。

#### 2.68.1. 函数

**Python 调用**

```python
ret = axcl.rt.engine_set_input_buffer_by_name(io, name, data_buffer, size)
```

**C++ 原型**

```cpp
axclError axclrtEngineSetInputBufferByName(axclrtEngineIO io, const char *name, const void *dataBuffer, uint64_t size);
```

#### 2.68.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| io | int &#124; None | 有效的 IO 绑定句柄。 |
| name | str &#124; bytes &#124; None | 输入张量名称。 |
| data_buffer | int &#124; None | 要绑定的 Device 内存句柄。 |
| size | int | 绑定缓冲区的大小，单位为字节。必须大于 0。 |

#### 2.68.3. 返回值

- `ret`: *int* — 缓冲区绑定已成功保存。失败。

#### 2.68.4. 说明

返回类型：`int`。

源码：`python/axcl/rt/axcl_rt_engine.py:2917`。

#### 2.68.5. 示例

```python
ret = axcl.rt.engine_set_input_buffer_by_name(io, name, data_buffer, size)
```

<br>

<a id="axcl.rt.engine_set_output_buffer_by_name"></a>

### 2.69. axcl.rt.engine_set_output_buffer_by_name

按张量名称将 Device 缓冲区绑定到输出。

#### 2.69.1. 函数

**Python 调用**

```python
ret = axcl.rt.engine_set_output_buffer_by_name(io, name, data_buffer, size)
```

**C++ 原型**

```cpp
axclError axclrtEngineSetOutputBufferByName(axclrtEngineIO io, const char *name, const void *dataBuffer, uint64_t size);
```

#### 2.69.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| io | int &#124; None | 有效的 IO 绑定句柄。 |
| name | str &#124; bytes &#124; None | 输出张量名称。 |
| data_buffer | int &#124; None | 要绑定的 Device 内存句柄。 |
| size | int | 绑定缓冲区的大小，单位为字节。必须大于 0。 |

#### 2.69.3. 返回值

- `ret`: *int* — 缓冲区绑定已成功保存。失败。

#### 2.69.4. 说明

返回类型：`int`。

源码：`python/axcl/rt/axcl_rt_engine.py:2956`。

#### 2.69.5. 示例

```python
ret = axcl.rt.engine_set_output_buffer_by_name(io, name, data_buffer, size)
```

<br>

<a id="axcl.rt.engine_get_input_buffer_by_index"></a>

### 2.70. axcl.rt.engine_get_input_buffer_by_index

获取输入索引对应的已保存缓冲区绑定。

#### 2.70.1. 函数

**Python 调用**

```python
data_buffer, size, ret = axcl.rt.engine_get_input_buffer_by_index(io, index)
```

**C++ 原型**

```cpp
axclError axclrtEngineGetInputBufferByIndex(axclrtEngineIO io, uint32_t index, void **dataBuffer, uint64_t *size);
```

#### 2.70.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| io | int &#124; None | 有效的 IO 绑定句柄。 |
| index | int | 输入索引，从 0 开始。 |

#### 2.70.3. 返回值

- `data_buffer`: *int* — 接收已保存的 Device 内存句柄。
- `size`: *int* — 接收已保存的缓冲区大小，单位为字节。
- `ret`: *int* — 已成功返回保存的绑定。失败。

#### 2.70.4. 说明

返回类型：`tuple[int, int, int]`。

源码：`python/axcl/rt/axcl_rt_engine.py:2995`。

#### 2.70.5. 示例

```python
data_buffer, size, ret = axcl.rt.engine_get_input_buffer_by_index(io, index)
```

<br>

<a id="axcl.rt.engine_get_output_buffer_by_index"></a>

### 2.71. axcl.rt.engine_get_output_buffer_by_index

获取输出索引对应的已保存缓冲区绑定。

#### 2.71.1. 函数

**Python 调用**

```python
data_buffer, size, ret = axcl.rt.engine_get_output_buffer_by_index(io, index)
```

**C++ 原型**

```cpp
axclError axclrtEngineGetOutputBufferByIndex(axclrtEngineIO io, uint32_t index, void **dataBuffer, uint64_t *size);
```

#### 2.71.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| io | int &#124; None | 有效的 IO 绑定句柄。 |
| index | int | 输出索引，从 0 开始。 |

#### 2.71.3. 返回值

- `data_buffer`: *int* — 接收已保存的 Device 内存句柄。
- `size`: *int* — 接收已保存的缓冲区大小，单位为字节。
- `ret`: *int* — 已成功返回保存的绑定。失败。

#### 2.71.4. 说明

返回类型：`tuple[int, int, int]`。

源码：`python/axcl/rt/axcl_rt_engine.py:3033`。

#### 2.71.5. 示例

```python
data_buffer, size, ret = axcl.rt.engine_get_output_buffer_by_index(io, index)
```

<br>

<a id="axcl.rt.engine_get_input_buffer_by_name"></a>

### 2.72. axcl.rt.engine_get_input_buffer_by_name

获取输入张量名称对应的已保存缓冲区绑定。

#### 2.72.1. 函数

**Python 调用**

```python
data_buffer, size, ret = axcl.rt.engine_get_input_buffer_by_name(io, name)
```

**C++ 原型**

```cpp
axclError axclrtEngineGetInputBufferByName(axclrtEngineIO io, const char *name, void **dataBuffer, uint64_t *size);
```

#### 2.72.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| io | int &#124; None | 有效的 IO 绑定句柄。 |
| name | str &#124; bytes &#124; None | 输入张量名称。 |

#### 2.72.3. 返回值

- `data_buffer`: *int* — 接收已保存的 Device 内存句柄。
- `size`: *int* — 接收已保存的缓冲区大小，单位为字节。
- `ret`: *int* — 已成功返回保存的绑定。失败。

#### 2.72.4. 说明

返回类型：`tuple[int, int, int]`。

源码：`python/axcl/rt/axcl_rt_engine.py:3071`。

#### 2.72.5. 示例

```python
data_buffer, size, ret = axcl.rt.engine_get_input_buffer_by_name(io, name)
```

<br>

<a id="axcl.rt.engine_get_output_buffer_by_name"></a>

### 2.73. axcl.rt.engine_get_output_buffer_by_name

获取输出张量名称对应的已保存缓冲区绑定。

#### 2.73.1. 函数

**Python 调用**

```python
data_buffer, size, ret = axcl.rt.engine_get_output_buffer_by_name(io, name)
```

**C++ 原型**

```cpp
axclError axclrtEngineGetOutputBufferByName(axclrtEngineIO io, const char *name, void **dataBuffer, uint64_t *size);
```

#### 2.73.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| io | int &#124; None | 有效的 IO 绑定句柄。 |
| name | str &#124; bytes &#124; None | 输出张量名称。 |

#### 2.73.3. 返回值

- `data_buffer`: *int* — 接收已保存的 Device 内存句柄。
- `size`: *int* — 接收已保存的缓冲区大小，单位为字节。
- `ret`: *int* — 已成功返回保存的绑定。失败。

#### 2.73.4. 说明

返回类型：`tuple[int, int, int]`。

源码：`python/axcl/rt/axcl_rt_engine.py:3109`。

#### 2.73.5. 示例

```python
data_buffer, size, ret = axcl.rt.engine_get_output_buffer_by_name(io, name)
```

<br>

<a id="axcl.rt.engine_set_dynamic_batch_size"></a>

### 2.74. axcl.rt.engine_set_dynamic_batch_size

保存 IO 绑定对象后续执行所使用的动态批大小。

#### 2.74.1. 函数

**Python 调用**

```python
ret = axcl.rt.engine_set_dynamic_batch_size(io, batch_size)
```

**C++ 原型**

```cpp
axclError axclrtEngineSetDynamicBatchSize(axclrtEngineIO io, uint32_t batchSize);
```

#### 2.74.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| io | int &#124; None | 有效的 IO 绑定句柄。 |
| batch_size | int | 要保存的批大小。 |

#### 2.74.3. 返回值

- `ret`: *int* — 批大小已成功保存。失败。

#### 2.74.4. 说明

返回类型：`int`。

源码：`python/axcl/rt/axcl_rt_engine.py:3147`。

#### 2.74.5. 示例

```python
ret = axcl.rt.engine_set_dynamic_batch_size(io, batch_size)
```

<br>

<a id="axcl.rt.engine_create_context"></a>

### 2.75. axcl.rt.engine_create_context

为已加载模型创建独立的 Engine 执行 Context。

#### 2.75.1. 函数

**Python 调用**

```python
context_id, ret = axcl.rt.engine_create_context(model_id)
```

**C++ 原型**

```cpp
axclError axclrtEngineCreateContext(uint64_t modelId, uint64_t *contextId);
```

#### 2.75.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| model_id | int | 已加载的模型 ID。 |

#### 2.75.3. 返回值

- `context_id`: *int* — 接收创建的 Engine Context ID。
- `ret`: *int* — Engine Context 已成功创建。失败。

#### 2.75.4. 说明

返回类型：`tuple[int, int]`。

源码：`python/axcl/rt/axcl_rt_engine.py:3180`。

#### 2.75.5. 示例

```python
context_id, ret = axcl.rt.engine_create_context(model_id)
```

<br>

<a id="axcl.rt.engine_execute"></a>

### 2.76. axcl.rt.engine_execute

在当前 runtime Context 的默认 Stream 上同步执行模型推理。

#### 2.76.1. 函数

**Python 调用**

```python
ret = axcl.rt.engine_execute(model_id, context_id, group, io)
```

**C++ 原型**

```cpp
axclError axclrtEngineExecute(uint64_t modelId, uint64_t contextId, uint32_t group, axclrtEngineIO io);
```

#### 2.76.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| model_id | int | 已加载的模型 ID。 |
| context_id | int | 为模型创建的 Engine Context ID（源码说明不完整）。 |
| group | int | shape 组索引，从 0 开始。 |
| io | int &#124; None | 包含所有必需 Device 缓冲区的 IO 绑定对象。 |

#### 2.76.3. 返回值

- `ret`: *int* — 推理已成功完成。失败。

#### 2.76.4. 说明

返回类型：`int`。

源码：`python/axcl/rt/axcl_rt_engine.py:3214`。

#### 2.76.5. 示例

```python
ret = axcl.rt.engine_execute(model_id, context_id, group, io)
```

<br>

<a id="axcl.rt.engine_execute_async"></a>

### 2.77. axcl.rt.engine_execute_async

向 Stream 提交模型推理任务。

#### 2.77.1. 函数

**Python 调用**

```python
ret = axcl.rt.engine_execute_async(model_id, context_id, group, io, stream)
```

**C++ 原型**

```cpp
axclError axclrtEngineExecuteAsync(uint64_t modelId, uint64_t contextId, uint32_t group, axclrtEngineIO io, axclrtStream stream);
```

#### 2.77.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| model_id | int | 已加载的模型 ID。 |
| context_id | int | 为模型创建的 Engine Context ID（源码说明不完整）。 |
| group | int | shape 组索引，从 0 开始。 |
| io | int &#124; None | 包含所有必需 Device 缓冲区的 IO 绑定对象。 |
| stream | int &#124; None | 接收推理请求的 Stream。传入 NULL 以使用当前 runtime Context 的默认 Stream。 |

#### 2.77.3. 返回值

- `ret`: *int* — 推理请求已成功提交。失败。

#### 2.77.4. 说明

返回类型：`int`。

源码：`python/axcl/rt/axcl_rt_engine.py:3251`。

#### 2.77.5. 示例

```python
ret = axcl.rt.engine_execute_async(model_id, context_id, group, io, stream)
```

<br>

<a id="axcl.rt.create_event"></a>

### 2.78. axcl.rt.create_event

在当前 Context 关联的设备上创建启用计时的 Event。

#### 2.78.1. 函数

**Python 调用**

```python
event, ret = axcl.rt.create_event()
```

**C++ 原型**

```cpp
axclError axclrtCreateEvent(axclrtEvent *event);
```

#### 2.78.2. 参数

不适用

#### 2.78.3. 返回值

- `event`: *int* — 成功时接收创建的 Event 句柄。
- `ret`: *int* — Event 已成功创建。失败。

#### 2.78.4. 说明

返回类型：`tuple[int, int]`。

源码：`python/axcl/rt/axcl_rt_event.py:296`。

#### 2.78.5. 示例

```python
event, ret = axcl.rt.create_event()
```

<br>

<a id="axcl.rt.destroy_event"></a>

### 2.79. axcl.rt.destroy_event

销毁已创建的 Event（源码未提供创建接口引用）。

#### 2.79.1. 函数

**Python 调用**

```python
ret = axcl.rt.destroy_event(event)
```

**C++ 原型**

```cpp
axclError axclrtDestroyEvent(axclrtEvent event);
```

#### 2.79.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| event | int &#124; None | 要销毁的 Event 句柄。 |

#### 2.79.3. 返回值

- `ret`: *int* — Event 已成功销毁。失败。

#### 2.79.4. 说明

返回类型：`int`。

源码：`python/axcl/rt/axcl_rt_event.py:327`。

#### 2.79.5. 示例

```python
ret = axcl.rt.destroy_event(event)
```

<br>

<a id="axcl.rt.record_event"></a>

### 2.80. axcl.rt.record_event

向指定 Stream 异步提交 Event 记录点。

#### 2.80.1. 函数

**Python 调用**

```python
ret = axcl.rt.record_event(event, stream)
```

**C++ 原型**

```cpp
axclError axclrtRecordEvent(axclrtEvent event, axclrtStream stream);
```

#### 2.80.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| event | int &#124; None | 要记录的 Event。 |
| stream | int &#124; None | 接收记录点的 Stream。 |

#### 2.80.3. 返回值

- `ret`: *int* — 记录点已成功提交。失败。

#### 2.80.4. 说明

返回类型：`int`。

源码：`python/axcl/rt/axcl_rt_event.py:358`。

#### 2.80.5. 示例

```python
ret = axcl.rt.record_event(event, stream)
```

<br>

<a id="axcl.rt.stream_wait_event"></a>

### 2.81. axcl.rt.stream_wait_event

向指定 Stream 异步提交 Event 等待点，使 Stream 仅在 Event 被触发后继续执行。

#### 2.81.1. 函数

**Python 调用**

```python
ret = axcl.rt.stream_wait_event(stream, event)
```

**C++ 原型**

```cpp
axclError axclrtStreamWaitEvent(axclrtStream stream, axclrtEvent event);
```

#### 2.81.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| stream | int &#124; None | 等待 Event 的 Stream。 |
| event | int &#124; None | 要等待的 Event。 |

#### 2.81.3. 返回值

- `ret`: *int* — 等待点已成功提交。失败。

#### 2.81.4. 说明

返回类型：`int`。

源码：`python/axcl/rt/axcl_rt_event.py:391`。

#### 2.81.5. 示例

```python
ret = axcl.rt.stream_wait_event(stream, event)
```

<br>

<a id="axcl.rt.stream_wait_event_with_timeout"></a>

### 2.82. axcl.rt.stream_wait_event_with_timeout

向指定 Stream 异步提交带超时的 Event 等待点。

#### 2.82.1. 函数

**Python 调用**

```python
ret = axcl.rt.stream_wait_event_with_timeout(stream, event, timeout)
```

**C++ 原型**

```cpp
axclError axclrtStreamWaitEventWithTimeout(axclrtStream stream, axclrtEvent event, int32_t timeout);
```

#### 2.82.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| stream | int &#124; None | 等待 Event 的 Stream。 |
| event | int &#124; None | 要等待的 Event。 |
| timeout | int | 超时时间，单位为毫秒。-1 表示无限等待。 |

#### 2.82.3. 返回值

- `ret`: *int* — 等待点已成功提交。失败。

#### 2.82.4. 说明

返回类型：`int`。

源码：`python/axcl/rt/axcl_rt_event.py:424`。

#### 2.82.5. 示例

```python
ret = axcl.rt.stream_wait_event_with_timeout(stream, event, timeout)
```

<br>

<a id="axcl.rt.synchronize_event"></a>

### 2.83. axcl.rt.synchronize_event

阻塞当前 Host 线程，直到 Event 被触发。

#### 2.83.1. 函数

**Python 调用**

```python
ret = axcl.rt.synchronize_event(event)
```

**C++ 原型**

```cpp
axclError axclrtSynchronizeEvent(axclrtEvent event);
```

#### 2.83.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| event | int &#124; None | 要等待的 Event。 |

#### 2.83.3. 返回值

- `ret`: *int* — Event 已被触发。失败。

#### 2.83.4. 说明

返回类型：`int`。

源码：`python/axcl/rt/axcl_rt_event.py:459`。

#### 2.83.5. 示例

```python
ret = axcl.rt.synchronize_event(event)
```

<br>

<a id="axcl.rt.synchronize_event_with_timeout"></a>

### 2.84. axcl.rt.synchronize_event_with_timeout

阻塞当前 Host 线程，直到 Event 被触发或超时。

#### 2.84.1. 函数

**Python 调用**

```python
ret = axcl.rt.synchronize_event_with_timeout(event, timeout)
```

**C++ 原型**

```cpp
axclError axclrtSynchronizeEventWithTimeout(axclrtEvent event, int32_t timeout);
```

#### 2.84.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| event | int &#124; None | 要等待的 Event。 |
| timeout | int | 超时时间，单位为毫秒。-1 表示无限等待。 |

#### 2.84.3. 返回值

- `ret`: *int* — Event 已在超时时间内被触发。失败。

#### 2.84.4. 说明

返回类型：`int`。

源码：`python/axcl/rt/axcl_rt_event.py:490`。

#### 2.84.5. 示例

```python
ret = axcl.rt.synchronize_event_with_timeout(event, timeout)
```

<br>

<a id="axcl.rt.create_event_with_flags"></a>

### 2.85. axcl.rt.create_event_with_flags

按指定计时标志，在当前 Context 关联的设备上创建 Event。

#### 2.85.1. 函数

**Python 调用**

```python
event, ret = axcl.rt.create_event_with_flags(flags)
```

**C++ 原型**

```cpp
axclError axclrtCreateEventWithFlags(axclrtEvent *event, uint32_t flags);
```

#### 2.85.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| flags | int | 标志参数。 |

#### 2.85.3. 返回值

- `event`: *int* — 成功时接收创建的 Event 句柄。
- `ret`: *int* — Event 已成功创建。失败。

#### 2.85.4. 说明

返回类型：`tuple[int, int]`。

源码：`python/axcl/rt/axcl_rt_event.py:523`。

#### 2.85.5. 示例

```python
event, ret = axcl.rt.create_event_with_flags(flags)
```

<br>

<a id="axcl.rt.event_elapsed_time"></a>

### 2.86. axcl.rt.event_elapsed_time

计算两个 Event 最近完成的记录点之间的设备时间差。

#### 2.86.1. 函数

**Python 调用**

```python
ms, ret = axcl.rt.event_elapsed_time(start_event, end_event)
```

**C++ 原型**

```cpp
axclError axclrtEventElapsedTime(float *ms, axclrtEvent startEvent, axclrtEvent endEvent);
```

#### 2.86.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| start_event | int &#124; None | 标记起点的 Event。 |
| end_event | int &#124; None | 标记终点的 Event。 |

#### 2.86.3. 返回值

- `ms`: *float* — 接收时间差，单位为毫秒。
- `ret`: *int* — 已成功返回时间差。失败。

#### 2.86.4. 说明

返回类型：`tuple[float, int]`。

源码：`python/axcl/rt/axcl_rt_event.py:557`。

#### 2.86.5. 示例

```python
ms, ret = axcl.rt.event_elapsed_time(start_event, end_event)
```

<br>

<a id="axcl.rt.event_query"></a>

### 2.87. axcl.rt.event_query

以非阻塞方式查询 Event 所记录的任务是否完成。

#### 2.87.1. 函数

**Python 调用**

```python
status, ret = axcl.rt.event_query(event)
```

**C++ 原型**

```cpp
axclError axclrtEventQuery(axclrtEvent event, axclrtEventStatus *status);
```

#### 2.87.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| event | int &#124; None | Event 句柄。 |

#### 2.87.3. 返回值

- `status`: *int* — 成功时接收 Event 完成状态。
- `ret`: *int* — 已成功返回状态。失败。

#### 2.87.4. 说明

返回类型：`tuple[int, int]`。

源码：`python/axcl/rt/axcl_rt_event.py:593`。

#### 2.87.5. 示例

```python
status, ret = axcl.rt.event_query(event)
```

<br>

<a id="axcl.rt.transfer_file"></a>

### 2.88. axcl.rt.transfer_file

传输单个文件或删除单个 Device 文件。

#### 2.88.1. 函数

**Python 调用**

```python
ret = axcl.rt.transfer_file(src_path, dst_path, policy)
```

**C++ 原型**

```cpp
axclError axclrtTransferFile(const char *src_path, const char *dst_path, axclrtFileTransferPolicy policy);
```

#### 2.88.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| src_path | str &#124; bytes &#124; None | 源路径，或要删除的 Device 路径。 |
| dst_path | str &#124; bytes &#124; None | 目标路径。仅在以下条件下，此参数可为 NULL（源码条件不完整）。 |
| policy | int | 文件传输操作。 |

#### 2.88.3. 返回值

- `ret`: *int* — 请求的操作已成功完成。失败。

#### 2.88.4. 说明

返回类型：`int`。

源码：`python/axcl/rt/axcl_rt_file.py:110`。

#### 2.88.5. 示例

```python
ret = axcl.rt.transfer_file(src_path, dst_path, policy)
```

<br>

<a id="axcl.rt.transfer_directory"></a>

### 2.89. axcl.rt.transfer_directory

递归传输单个目录。

#### 2.89.1. 函数

**Python 调用**

```python
ret = axcl.rt.transfer_directory(src_dir, dst_dir, policy)
```

**C++ 原型**

```cpp
axclError axclrtTransferDirectory(const char *src_dir, const char *dst_dir, axclrtFileTransferPolicy policy);
```

#### 2.89.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| src_dir | str &#124; bytes &#124; None | 源目录。末尾带有 "/." 时仅拷贝目录内容。 |
| dst_dir | str &#124; bytes &#124; None | 目标目录路径。 |
| policy | int | 目录传输方向。不支持删除目录。 |

#### 2.89.3. 返回值

- `ret`: *int* — 请求的操作已成功完成。失败。

#### 2.89.4. 说明

返回类型：`int`。

源码：`python/axcl/rt/axcl_rt_file.py:145`。

#### 2.89.5. 示例

```python
ret = axcl.rt.transfer_directory(src_dir, dst_dir, policy)
```

<br>

<a id="axcl.rt.get_mem_info"></a>

### 2.90. axcl.rt.get_mem_info

获取调用线程当前 Context 关联设备的内存容量快照。

#### 2.90.1. 函数

**Python 调用**

```python
free, total, ret = axcl.rt.get_mem_info(attr)
```

**C++ 原型**

```cpp
axclError axclrtGetMemInfo(axclrtMemAttr attr, size_t *free, size_t *total);
```

#### 2.90.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| attr | int | 要查询的内存池。 |

#### 2.90.3. 返回值

- `free`: *int* — 可选指针，接收空闲字节数。
- `total`: *int* — 可选指针，接收总字节数。
- `ret`: *int* — 已成功返回请求的内存信息。失败。

#### 2.90.4. 说明

返回类型：`tuple[int, int, int]`。

源码：`python/axcl/rt/axcl_rt_memory.py:807`。

#### 2.90.5. 示例

```python
free, total, ret = axcl.rt.get_mem_info(attr)
```

<br>

<a id="axcl.rt.pointer_get_attributes"></a>

### 2.91. axcl.rt.pointer_get_attributes

获取内存分配属性。

#### 2.91.1. 函数

**Python 调用**

```python
attributes, ret = axcl.rt.pointer_get_attributes(ptr)
```

**C++ 原型**

```cpp
axclError axclrtPointerGetAttributes(const void *ptr, axclrtPtrAttributes *attributes);
```

#### 2.91.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| ptr | int &#124; None | 指向已分配内存起始位置或内部任意字节的指针。 |

#### 2.91.3. 返回值

- `attributes`: *dict* — 接收指针属性。
- `ret`: *int* — 已成功返回属性。失败。

#### 2.91.4. 说明

返回类型：`tuple[dict, int]`。

源码：`python/axcl/rt/axcl_rt_memory.py:843`。

#### 2.91.5. 示例

```python
attributes, ret = axcl.rt.pointer_get_attributes(ptr)
```

<br>

<a id="axcl.rt.malloc"></a>

### 2.92. axcl.rt.malloc

在调用线程当前 Context 关联的设备上分配物理连续内存。

#### 2.92.1. 函数

**Python 调用**

```python
dev_ptr, ret = axcl.rt.malloc(size, policy)
```

**C++ 原型**

```cpp
axclError axclrtMalloc(void **devPtr, size_t size, axclrtMemMallocPolicy policy);
```

#### 2.92.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| size | int | 要分配的字节数。支持的范围为 1 至 UINT32_MAX。 |
| policy | int | Device 内存分配策略。 |

#### 2.92.3. 返回值

- `dev_ptr`: *int* — 成功时接收 Device 物理内存基地址。
- `ret`: *int* — Device 内存已成功分配。失败。

#### 2.92.4. 说明

返回类型：`tuple[int, int]`。

源码：`python/axcl/rt/axcl_rt_memory.py:877`。

#### 2.92.5. 示例

```python
dev_ptr, ret = axcl.rt.malloc(size, policy)
```

<br>

<a id="axcl.rt.malloc_cached"></a>

### 2.93. axcl.rt.malloc_cached

在当前 Context 关联的设备上分配可缓存的物理连续内存。

#### 2.93.1. 函数

**Python 调用**

```python
dev_ptr, ret = axcl.rt.malloc_cached(size, policy)
```

**C++ 原型**

```cpp
axclError axclrtMallocCached(void **devPtr, size_t size, axclrtMemMallocPolicy policy);
```

#### 2.93.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| size | int | 要分配的字节数。支持的范围为 1 至 UINT32_MAX。 |
| policy | int | Device 内存分配策略。 |

#### 2.93.3. 返回值

- `dev_ptr`: *int* — 成功时接收 Device 地址句柄。
- `ret`: *int* — Device 内存已成功分配。失败。

#### 2.93.4. 说明

返回类型：`tuple[int, int]`。

源码：`python/axcl/rt/axcl_rt_memory.py:913`。

#### 2.93.5. 示例

```python
dev_ptr, ret = axcl.rt.malloc_cached(size, policy)
```

<br>

<a id="axcl.rt.free"></a>

### 2.94. axcl.rt.free

释放 Device 内存。

#### 2.94.1. 函数

**Python 调用**

```python
ret = axcl.rt.free(dev_ptr)
```

**C++ 原型**

```cpp
axclError axclrtFree(void *devPtr);
```

#### 2.94.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| dev_ptr | int &#124; None | 内存分配函数返回的 Device 内存基地址。 |

#### 2.94.3. 返回值

- `ret`: *int* — Device 内存已成功释放。失败。

#### 2.94.4. 说明

返回类型：`int`。

源码：`python/axcl/rt/axcl_rt_memory.py:949`。

#### 2.94.5. 示例

```python
ret = axcl.rt.free(dev_ptr)
```

<br>

<a id="axcl.rt.mem_flush"></a>

### 2.95. axcl.rt.mem_flush

将 Device 内存范围内的缓存数据写回 DDR。

#### 2.95.1. 函数

**Python 调用**

```python
ret = axcl.rt.mem_flush(dev_ptr, size)
```

**C++ 原型**

```cpp
axclError axclrtMemFlush(void *devPtr, size_t size);
```

#### 2.95.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| dev_ptr | int &#124; None | 范围起始处的 Device 内存地址。 |
| size | int | 要刷新的字节数。支持的范围为 1 至 UINT32_MAX。 |

#### 2.95.3. 返回值

- `ret`: *int* — 缓存范围已成功刷新。失败。

#### 2.95.4. 说明

返回类型：`int`。

源码：`python/axcl/rt/axcl_rt_memory.py:980`。

#### 2.95.5. 示例

```python
ret = axcl.rt.mem_flush(dev_ptr, size)
```

<br>

<a id="axcl.rt.mem_invalidate"></a>

### 2.96. axcl.rt.mem_invalidate

使 Device 内存范围内的缓存数据失效。

#### 2.96.1. 函数

**Python 调用**

```python
ret = axcl.rt.mem_invalidate(dev_ptr, size)
```

**C++ 原型**

```cpp
axclError axclrtMemInvalidate(void *devPtr, size_t size);
```

#### 2.96.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| dev_ptr | int &#124; None | 待失效范围起始处的 Device 物理内存地址。 |
| size | int | 要处理的字节数。支持的范围为 1 至 UINT32_MAX。 |

#### 2.96.3. 返回值

- `ret`: *int* — 缓存范围已成功失效。失败。

#### 2.96.4. 说明

返回类型：`int`。

源码：`python/axcl/rt/axcl_rt_memory.py:1013`。

#### 2.96.5. 示例

```python
ret = axcl.rt.mem_invalidate(dev_ptr, size)
```

<br>

<a id="axcl.rt.malloc_host"></a>

### 2.97. axcl.rt.malloc_host

分配 Host 虚拟内存。

#### 2.97.1. 函数

**Python 调用**

```python
host_ptr, ret = axcl.rt.malloc_host(size)
```

**C++ 原型**

```cpp
axclError axclrtMallocHost(void **hostPtr, size_t size);
```

#### 2.97.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| size | int | 要分配的字节数。必须大于 0。 |

#### 2.97.3. 返回值

- `host_ptr`: *int* — 成功时接收 Host 可访问的虚拟地址。
- `ret`: *int* — Host 内存已成功分配。失败。

#### 2.97.4. 说明

返回类型：`tuple[int, int]`。

源码：`python/axcl/rt/axcl_rt_memory.py:1046`。

#### 2.97.5. 示例

```python
host_ptr, ret = axcl.rt.malloc_host(size)
```

<br>

<a id="axcl.rt.free_host"></a>

### 2.98. axcl.rt.free_host

释放已分配的 Host 虚拟内存（源码未提供分配接口引用）。

#### 2.98.1. 函数

**Python 调用**

```python
ret = axcl.rt.free_host(host_ptr)
```

**C++ 原型**

```cpp
axclError axclrtFreeHost(void *hostPtr);
```

#### 2.98.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| host_ptr | int &#124; None | 返回的 Host 虚拟基地址（源码未提供接口引用）。 |

#### 2.98.3. 返回值

- `ret`: *int* — Host 内存已成功释放。失败。

#### 2.98.4. 说明

返回类型：`int`。

源码：`python/axcl/rt/axcl_rt_memory.py:1080`。

#### 2.98.5. 示例

```python
ret = axcl.rt.free_host(host_ptr)
```

<br>

<a id="axcl.rt.memset"></a>

### 2.99. axcl.rt.memset

同步将 Device 内存中的字节设置为指定值。

#### 2.99.1. 函数

**Python 调用**

```python
ret = axcl.rt.memset(dev_ptr, value, count)
```

**C++ 原型**

```cpp
axclError axclrtMemset(void *devPtr, uint8_t value, size_t count);
```

#### 2.99.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| dev_ptr | int &#124; None | 开始写入的 Device 内存地址。 |
| value | int | 要写入的字节值。 |
| count | int | 要设置的字节数。支持的范围为 1 至 UINT32_MAX。 |

#### 2.99.3. 返回值

- `ret`: *int* — Device 内存已成功设置。失败。

#### 2.99.4. 说明

返回类型：`int`。

源码：`python/axcl/rt/axcl_rt_memory.py:1111`。

#### 2.99.5. 示例

```python
ret = axcl.rt.memset(dev_ptr, value, count)
```

<br>

<a id="axcl.rt.memcpy"></a>

### 2.100. axcl.rt.memcpy

同步在 Host 或 Device 内存之间拷贝字节。

#### 2.100.1. 函数

**Python 调用**

```python
ret = axcl.rt.memcpy(dst_ptr, src_ptr, count, kind)
```

**C++ 原型**

```cpp
axclError axclrtMemcpy(void *dstPtr, const void *srcPtr, size_t count, axclrtMemcpyKind kind);
```

#### 2.100.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| dst_ptr | int &#124; None | 目标地址，其解释依据为（源码说明不完整）。 |
| src_ptr | int &#124; None | 源地址，其解释依据为（源码说明不完整）。 |
| count | int | 要拷贝的字节数。必须大于 0。 |
| kind | int | 拷贝方向和地址类型。 |

#### 2.100.3. 返回值

- `ret`: *int* — 拷贝已成功完成。失败。

#### 2.100.4. 说明

返回类型：`int`。

源码：`python/axcl/rt/axcl_rt_memory.py:1146`。

#### 2.100.5. 示例

```python
ret = axcl.rt.memcpy(dst_ptr, src_ptr, count, kind)
```

<br>

<a id="axcl.rt.memcmp"></a>

### 2.101. axcl.rt.memcmp

同步判断两个 Device 内存范围内的字节是否相同。

#### 2.101.1. 函数

**Python 调用**

```python
ret = axcl.rt.memcmp(dev_ptr1, dev_ptr2, count)
```

**C++ 原型**

```cpp
axclError axclrtMemcmp(const void *devPtr1, const void *devPtr2, size_t count);
```

#### 2.101.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| dev_ptr1 | int &#124; None | 第一个 Device 内存范围的地址。 |
| dev_ptr2 | int &#124; None | 第二个 Device 内存范围的地址。 |
| count | int | 要比较的字节数。支持的范围为 1 至 UINT32_MAX。 |

#### 2.101.3. 返回值

- `ret`: *int* — 比较的字节相同。字节不同，或比较失败。

#### 2.101.4. 说明

返回类型：`int`。

源码：`python/axcl/rt/axcl_rt_memory.py:1183`。

#### 2.101.5. 示例

```python
ret = axcl.rt.memcmp(dev_ptr1, dev_ptr2, count)
```

<br>

<a id="axcl.rt.memset_async"></a>

### 2.102. axcl.rt.memset_async

向指定 Stream 异步提交 Device 内存设置操作。

#### 2.102.1. 函数

**Python 调用**

```python
ret = axcl.rt.memset_async(dev_ptr, value, count, stream)
```

**C++ 原型**

```cpp
axclError axclrtMemsetAsync(void *devPtr, uint8_t value, size_t count, axclrtStream stream);
```

#### 2.102.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| dev_ptr | int &#124; None | 开始写入的 Device 内存地址。 |
| value | int | 要写入的字节值。 |
| count | int | 要设置的字节数。支持的范围为 1 至 UINT32_MAX。 |
| stream | int &#124; None | 接收操作的 Stream。 |

#### 2.102.3. 返回值

- `ret`: *int* — 操作已成功提交。失败。

.. note::
    绑定不会保留 Device 缓冲区。`dev_ptr` 必须保持有效，直到 `axcl.rt.synchronize_stream(stream)` 成功返回。

#### 2.102.4. 说明

返回类型：`int`。

源码：`python/axcl/rt/axcl_rt_memory.py:1218`。

#### 2.102.5. 示例

```python
ret = axcl.rt.memset_async(dev_ptr, value, count, stream)
```

<br>

<a id="axcl.rt.memcpy_async"></a>

### 2.103. axcl.rt.memcpy_async

向指定 Stream 异步提交 Host 或 Device 内存拷贝。

#### 2.103.1. 函数

**Python 调用**

```python
ret = axcl.rt.memcpy_async(dst_ptr, src_ptr, count, kind, stream)
```

**C++ 原型**

```cpp
axclError axclrtMemcpyAsync(void *dstPtr, const void *srcPtr, size_t count, axclrtMemcpyKind kind, axclrtStream stream);
```

#### 2.103.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| dst_ptr | int &#124; None | 目标地址，其解释依据为（源码说明不完整）。 |
| src_ptr | int &#124; None | 源地址，其解释依据为（源码说明不完整）。 |
| count | int | 要拷贝的字节数。必须大于 0。 |
| kind | int | 拷贝方向和地址类型。 |
| stream | int &#124; None | 接收拷贝操作的 Stream。 |

#### 2.103.3. 返回值

- `ret`: *int* — 拷贝已成功提交。失败。

.. note::
    绑定不会保留源缓冲区或目标缓冲区。`dst_ptr` 和 `src_ptr` 必须保持有效，直到 `axcl.rt.synchronize_stream(stream)` 成功返回。传入整数地址；绑定不会拷贝 Python 缓冲区。

#### 2.103.4. 说明

返回类型：`int`。

源码：`python/axcl/rt/axcl_rt_memory.py:1259`。

#### 2.103.5. 示例

```python
ret = axcl.rt.memcpy_async(dst_ptr, src_ptr, count, kind, stream)
```

<br>

<a id="axcl.rt.memcmp_async"></a>

### 2.104. axcl.rt.memcmp_async

向指定 Stream 异步提交两个 Device 内存范围的比较操作。

#### 2.104.1. 函数

**Python 调用**

```python
ret = axcl.rt.memcmp_async(dev_ptr1, dev_ptr2, count, stream)
```

**C++ 原型**

```cpp
axclError axclrtMemcmpAsync(const void *devPtr1, const void *devPtr2, size_t count, axclrtStream stream);
```

#### 2.104.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| dev_ptr1 | int &#124; None | 第一个 Device 内存范围的地址。 |
| dev_ptr2 | int &#124; None | 第二个 Device 内存范围的地址。 |
| count | int | 要比较的字节数。支持的范围为 1 至 UINT32_MAX。 |
| stream | int &#124; None | 接收比较操作的 Stream。 |

#### 2.104.3. 返回值

- `ret`: *int* — 比较已成功提交。失败。

.. note::
    绑定不会保留 Device 内存范围。`dev_ptr1` 和 `dev_ptr2` 必须保持有效，直到 `axcl.rt.synchronize_stream(stream)` 成功返回。

#### 2.104.4. 说明

返回类型：`int`。

源码：`python/axcl/rt/axcl_rt_memory.py:1303`。

#### 2.104.5. 示例

```python
ret = axcl.rt.memcmp_async(dev_ptr1, dev_ptr2, count, stream)
```

<br>

<a id="axcl.rt.mem_get_address_range"></a>

### 2.105. axcl.rt.mem_get_address_range

获取 AXCL runtime 管理的指针对应的基地址和分配大小。

#### 2.105.1. 函数

**Python 调用**

```python
base, size, ret = axcl.rt.mem_get_address_range(ptr)
```

**C++ 原型**

```cpp
axclError axclrtMemGetAddressRange(void *ptr, void **base, size_t *size);
```

#### 2.105.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| ptr | int &#124; None | 指向已分配内存起始位置或内部任意字节的指针。 |

#### 2.105.3. 返回值

- `base`: *int* — 接收已分配内存块的基地址。
- `size`: *int* — 接收总分配大小，单位为字节。
- `ret`: *int* — 成功返回 0，否则返回错误码。

#### 2.105.4. 说明

返回类型：`tuple[int, int, int]`。

源码：`python/axcl/rt/axcl_rt_memory.py:1344`。

#### 2.105.5. 示例

```python
base, size, ret = axcl.rt.mem_get_address_range(ptr)
```

<br>

<a id="axcl.rt.mem_get_dev_addr"></a>

### 2.106. axcl.rt.mem_get_dev_addr

从设备指针导出底层设备物理地址和虚拟地址。

#### 2.106.1. 函数

**Python 调用**

```python
desc, ret = axcl.rt.mem_get_dev_addr(dev_ptr, access_size)
```

**C++ 原型**

```cpp
axclError axclrtMemGetDevAddr(const void *devPtr, uint64_t access_size, axclrtDevMemDesc *desc);
```

#### 2.106.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| dev_ptr | int &#124; None | 有效的设备指针（基指针或内部切片）。 |
| access_size | int | 预期访问的字节跨度。为 0 时导出剩余切片长度。默认值：`0`。 |

#### 2.106.3. 返回值

- `desc`: *dict* — 接收物理/虚拟地址描述符。
- `ret`: *int* — 成功返回 0，否则返回错误码。

#### 2.106.4. 说明

返回类型：`tuple[dict, int]`。

源码：`python/axcl/rt/axcl_rt_memory.py:1380`。

#### 2.106.5. 示例

```python
desc, ret = axcl.rt.mem_get_dev_addr(dev_ptr, access_size)
```

<br>

<a id="axcl.rt.mem_map_dev_addr"></a>

### 2.107. axcl.rt.mem_map_dev_addr

将外部设备内存注册为临时映射的设备指针。

#### 2.107.1. 函数

**Python 调用**

```python
dev_ptr, ret = axcl.rt.mem_map_dev_addr(desc)
```

**C++ 原型**

```cpp
axclError axclrtMemMapDevAddr(const axclrtDevMemDesc *desc, void **devPtr);
```

#### 2.107.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| desc | dict &#124; None | 描述设备物理地址、大小和设备 ID 的描述符。 |

#### 2.107.3. 返回值

- `dev_ptr`: *int* — 接收映射后的设备指针句柄。
- `ret`: *int* — 成功返回 0，否则返回错误码。

#### 2.107.4. 说明

返回类型：`tuple[int, int]`。

源码：`python/axcl/rt/axcl_rt_memory.py:1416`。

#### 2.107.5. 示例

```python
dev_ptr, ret = axcl.rt.mem_map_dev_addr(desc)
```

<br>

<a id="axcl.rt.mem_unmap_dev_addr"></a>

### 2.108. axcl.rt.mem_unmap_dev_addr

注销通过 axclrtMemMapDevAddr 注册的外部设备内存。

#### 2.108.1. 函数

**Python 调用**

```python
ret = axcl.rt.mem_unmap_dev_addr(dev_ptr)
```

**C++ 原型**

```cpp
axclError axclrtMemUnmapDevAddr(void *devPtr);
```

#### 2.108.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| dev_ptr | int &#124; None | axclrtMemMapDevAddr 返回的设备基指针。 |

#### 2.108.3. 返回值

- `ret`: *int* — 成功返回 0，否则返回错误码。

#### 2.108.4. 说明

返回类型：`int`。

源码：`python/axcl/rt/axcl_rt_memory.py:1450`。

#### 2.108.5. 示例

```python
ret = axcl.rt.mem_unmap_dev_addr(dev_ptr)
```

<br>

<a id="axcl.rt.ipc_mem_get_export_key"></a>

### 2.109. axcl.rt.ipc_mem_get_export_key

为设备内存分配导出 IPC 内存共享密钥。

#### 2.109.1. 函数

**Python 调用**

```python
key, ret = axcl.rt.ipc_mem_get_export_key(dev_ptr, len, flags)
```

**C++ 原型**

```cpp
axclError axclrtIpcMemGetExportKey(void *devPtr, char *key, size_t len, uint32_t flags);
```

#### 2.109.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| dev_ptr | int &#124; None | Device 内存基地址。 |
| len | int | 密钥字符串缓冲区长度，必须为 AXCL_IPC_KEY_MAX_LEN（65）。默认值：`65`。 |
| flags | int | IPC 导出标志：AXCL_IPC_EXPORT_FLAG_DEFAULT 或 AXCL_IPC_EXPORT_FLAG_DISABLE_PID_VALIDATION。默认值：`0`。 |

#### 2.109.3. 返回值

- `key`: *str* — 导出的 IPC 密钥字符串。
- `ret`: *int* — 成功返回 0，否则返回错误码。

#### 2.109.4. 说明

返回类型：`tuple[str, int]`。

源码：`python/axcl/rt/axcl_rt_memory.py:1481`。

#### 2.109.5. 示例

```python
key, ret = axcl.rt.ipc_mem_get_export_key(dev_ptr, len, flags)
```

<br>

<a id="axcl.rt.ipc_mem_set_import_pid"></a>

### 2.110. axcl.rt.ipc_mem_set_import_pid

为导出的 IPC 内存密钥设置目标 TGID 白名单。

#### 2.110.1. 函数

**Python 调用**

```python
ret = axcl.rt.ipc_mem_set_import_pid(key, tgid_list, num)
```

**C++ 原型**

```cpp
axclError axclrtIpcMemSetImportPid(const char *key, const int32_t *tgid_list, uint32_t num);
```

#### 2.110.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| key | str &#124; bytes &#124; None | 以空字符结尾的 IPC 密钥字符串。 |
| tgid_list | int | 指向允许导入的原始 TGID 数组的指针。 |
| num | int | tgid_list 中的 TGID 条目数。 |

#### 2.110.3. 返回值

- `ret`: *int* — 成功返回 0，否则返回错误码。

#### 2.110.4. 说明

返回类型：`int`。

源码：`python/axcl/rt/axcl_rt_memory.py:1520`。

#### 2.110.5. 示例

```python
ret = axcl.rt.ipc_mem_set_import_pid(key, tgid_list, num)
```

<br>

<a id="axcl.rt.ipc_mem_import_by_key"></a>

### 2.111. axcl.rt.ipc_mem_import_by_key

通过密钥将 IPC 内存句柄导入调用进程。

#### 2.111.1. 函数

**Python 调用**

```python
dev_ptr, ret = axcl.rt.ipc_mem_import_by_key(key)
```

**C++ 原型**

```cpp
axclError axclrtIpcMemImportByKey(void **devPtr, const char *key);
```

#### 2.111.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| key | str &#124; bytes &#124; None | 以空字符结尾的 IPC 密钥字符串。 |

#### 2.111.3. 返回值

- `dev_ptr`: *int* — 接收映射后的本地设备内存指针。
- `ret`: *int* — 成功返回 0，否则返回错误码。

#### 2.111.4. 说明

返回类型：`tuple[int, int]`。

源码：`python/axcl/rt/axcl_rt_memory.py:1555`。

#### 2.111.5. 示例

```python
dev_ptr, ret = axcl.rt.ipc_mem_import_by_key(key)
```

<br>

<a id="axcl.rt.ipc_mem_close"></a>

### 2.112. axcl.rt.ipc_mem_close

关闭进程间共享内存密钥。

#### 2.112.1. 函数

**Python 调用**

```python
ret = axcl.rt.ipc_mem_close(key)
```

**C++ 原型**

```cpp
axclError axclrtIpcMemClose(const char *key);
```

#### 2.112.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| key | str &#124; bytes &#124; None | 以空字符结尾的 IPC 密钥字符串。 |

#### 2.112.3. 返回值

- `ret`: *int* — 成功返回 0，否则返回错误码。

#### 2.112.4. 说明

返回类型：`int`。

源码：`python/axcl/rt/axcl_rt_memory.py:1589`。

#### 2.112.5. 示例

```python
ret = axcl.rt.ipc_mem_close(key)
```

<br>

<a id="axcl.rt.create_stream"></a>

### 2.113. axcl.rt.create_stream

创建 Stream。

#### 2.113.1. 函数

**Python 调用**

```python
stream, ret = axcl.rt.create_stream()
```

**C++ 原型**

```cpp
axclError axclrtCreateStream(axclrtStream *stream);
```

#### 2.113.2. 参数

不适用

#### 2.113.3. 返回值

- `stream`: *int* — 成功时接收创建的 Stream 句柄。
- `ret`: *int* — Stream 已成功创建。失败。

#### 2.113.4. 说明

返回类型：`tuple[int, int]`。

源码：`python/axcl/rt/axcl_rt_stream.py:158`。

#### 2.113.5. 示例

```python
stream, ret = axcl.rt.create_stream()
```

<br>

<a id="axcl.rt.destroy_stream"></a>

### 2.114. axcl.rt.destroy_stream

销毁已创建的 Stream（源码未提供创建接口引用）。

#### 2.114.1. 函数

**Python 调用**

```python
ret = axcl.rt.destroy_stream(stream)
```

**C++ 原型**

```cpp
axclError axclrtDestroyStream(axclrtStream stream);
```

#### 2.114.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| stream | int &#124; None | 返回的 Stream 句柄（源码未提供接口引用）。 |

#### 2.114.3. 返回值

- `ret`: *int* — Stream 已成功同步并销毁。失败。

#### 2.114.4. 说明

返回类型：`int`。

源码：`python/axcl/rt/axcl_rt_stream.py:189`。

#### 2.114.5. 示例

```python
ret = axcl.rt.destroy_stream(stream)
```

<br>

<a id="axcl.rt.destroy_stream_force"></a>

### 2.115. axcl.rt.destroy_stream_force

立即销毁 Stream，不等待已提交任务完成。

#### 2.115.1. 函数

**Python 调用**

```python
ret = axcl.rt.destroy_stream_force(stream)
```

**C++ 原型**

```cpp
axclError axclrtDestroyStreamForce(axclrtStream stream);
```

#### 2.115.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| stream | int &#124; None | 返回的 Stream 句柄（源码未提供接口引用）。 |

#### 2.115.3. 返回值

- `ret`: *int* — Stream 已成功销毁。失败。

#### 2.115.4. 说明

返回类型：`int`。

源码：`python/axcl/rt/axcl_rt_stream.py:220`。

#### 2.115.5. 示例

```python
ret = axcl.rt.destroy_stream_force(stream)
```

<br>

<a id="axcl.rt.stream_query"></a>

### 2.116. axcl.rt.stream_query

查询指定 Stream 是否有未完成的任务。

#### 2.116.1. 函数

**Python 调用**

```python
status, ret = axcl.rt.stream_query(stream)
```

**C++ 原型**

```cpp
axclError axclrtStreamQuery(axclrtStream stream, axclrtStreamStatus *status);
```

#### 2.116.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| stream | int &#124; None | 返回的 Stream 句柄（源码未提供接口引用）。 |

#### 2.116.3. 返回值

- `status`: *int* — 成功时接收 Stream 的任务完成状态。
- `ret`: *int* — 已成功返回 Stream 的任务完成状态。失败。

#### 2.116.4. 说明

返回类型：`tuple[int, int]`。

源码：`python/axcl/rt/axcl_rt_stream.py:251`。

#### 2.116.5. 示例

```python
status, ret = axcl.rt.stream_query(stream)
```

<br>

<a id="axcl.rt.synchronize_stream"></a>

### 2.117. axcl.rt.synchronize_stream

阻塞等待调用本函数前提交到 Stream 的所有任务完成。

#### 2.117.1. 函数

**Python 调用**

```python
ret = axcl.rt.synchronize_stream(stream)
```

**C++ 原型**

```cpp
axclError axclrtSynchronizeStream(axclrtStream stream);
```

#### 2.117.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| stream | int &#124; None | 返回的 Stream 句柄（源码未提供接口引用）。 |

#### 2.117.3. 返回值

- `ret`: *int* — 此前提交到 Stream 的所有任务均已成功完成。失败。

#### 2.117.4. 说明

返回类型：`int`。

源码：`python/axcl/rt/axcl_rt_stream.py:285`。

#### 2.117.5. 示例

```python
ret = axcl.rt.synchronize_stream(stream)
```

<br>

<a id="axcl.rt.synchronize_stream_with_timeout"></a>

### 2.118. axcl.rt.synchronize_stream_with_timeout

在指定超时时间内，阻塞等待调用本函数前提交到 Stream 的所有任务完成。

#### 2.118.1. 函数

**Python 调用**

```python
ret = axcl.rt.synchronize_stream_with_timeout(stream, timeout)
```

**C++ 原型**

```cpp
axclError axclrtSynchronizeStreamWithTimeout(axclrtStream stream, int32_t timeout);
```

#### 2.118.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| stream | int &#124; None | 返回的 Stream 句柄（源码未提供接口引用）。 |
| timeout | int | 超时时间，单位为毫秒。`-1` 表示无限等待。 |

#### 2.118.3. 返回值

- `ret`: *int* — 此前提交到 Stream 的所有任务均已在超时时间内成功完成。失败。

#### 2.118.4. 说明

返回类型：`int`。

源码：`python/axcl/rt/axcl_rt_stream.py:316`。

#### 2.118.5. 示例

```python
ret = axcl.rt.synchronize_stream_with_timeout(stream, timeout)
```

<br>

<a id="axcl.rt.exec_worker"></a>

### 2.119. axcl.rt.exec_worker

在当前 Context 关联的 Device 上启动 userworker 进程。

#### 2.119.1. 函数

**Python 调用**

```python
pid, ret = axcl.rt.exec_worker(path, argv)
```

**C++ 原型**

```cpp
axclError axclrtExecWorker(const char *path, const int32_t *argc, const char *argv[], uint32_t *pid);
```

#### 2.119.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| path | str &#124; bytes &#124; None | userworker 可执行文件的 Device 路径。 |
| argv | list | 可选参数数组。在以下情况下必需（源码条件不完整）。 |

#### 2.119.3. 返回值

- `pid`: *int* — 成功时接收 Device 进程 ID。
- `ret`: *int* — userworker 已成功启动并初始化。失败。

#### 2.119.4. 说明

返回类型：`tuple[int, int]`。

源码：`python/axcl/rt/axcl_rt_usrwork.py:204`。

#### 2.119.5. 示例

```python
pid, ret = axcl.rt.exec_worker(path, argv)
```

<br>

<a id="axcl.rt.kill_worker"></a>

### 2.120. axcl.rt.kill_worker

终止并回收 userworker 进程。

#### 2.120.1. 函数

**Python 调用**

```python
ret = axcl.rt.kill_worker(pid)
```

**C++ 原型**

```cpp
axclError axclrtKillWorker(uint32_t pid);
```

#### 2.120.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| pid | int | 返回的 Device 进程 ID（源码未提供接口引用）。 |

#### 2.120.3. 返回值

- `ret`: *int* — 进程及其 Host 端通信资源已释放。失败。

#### 2.120.4. 说明

返回类型：`int`。

源码：`python/axcl/rt/axcl_rt_usrwork.py:242`。

#### 2.120.5. 示例

```python
ret = axcl.rt.kill_worker(pid)
```

<br>

<a id="axcl.rt.worker_send"></a>

### 2.121. axcl.rt.worker_send

向 userworker 进程发送一条完整消息。

#### 2.121.1. 函数

**Python 调用**

```python
ret = axcl.rt.worker_send(pid, buf, size, timeout)
```

**C++ 原型**

```cpp
axclError axclrtWorkerSend(uint32_t pid, const void *buf, uint32_t size, int32_t timeout);
```

#### 2.121.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| pid | int | 返回的 Device 进程 ID（源码未提供接口引用）。 |
| buf | int &#124; None | 消息数据。 |
| size | int | 消息大小，单位为字节。必须大于零。 |
| timeout | int | 超时时间，单位为毫秒。使用（源码说明不完整）。 |

#### 2.121.3. 返回值

- `ret`: *int* — 已成功发送完整消息。失败。

#### 2.121.4. 说明

返回类型：`int`。

源码：`python/axcl/rt/axcl_rt_usrwork.py:273`。

#### 2.121.5. 示例

```python
ret = axcl.rt.worker_send(pid, buf, size, timeout)
```

<br>

<a id="axcl.rt.worker_recv"></a>

### 2.122. axcl.rt.worker_recv

从 userworker 进程接收一条完整消息。

#### 2.122.1. 函数

**Python 调用**

```python
recvlen, ret = axcl.rt.worker_recv(pid, buf, bufsize, timeout)
```

**C++ 原型**

```cpp
axclError axclrtWorkerRecv(uint32_t pid, void *buf, uint32_t bufsize, uint32_t *recvlen, int32_t timeout);
```

#### 2.122.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| pid | int | 返回的 Device 进程 ID（源码未提供接口引用）。 |
| buf | int | 接收消息的缓冲区。 |
| bufsize | int | 容量（源码未说明对象）。 |
| timeout | int | 超时时间，单位为毫秒。使用（源码说明不完整）。 |

#### 2.122.3. 返回值

- `recvlen`: *int* — 实际完整消息长度；消息内容写入调用者提供的 buf。
- `ret`: *int* — 已成功接收完整消息。失败。

#### 2.122.4. 说明

返回类型：`tuple[int, int]`。

源码：`python/axcl/rt/axcl_rt_usrwork.py:310`。

#### 2.122.5. 示例

```python
recvlen, ret = axcl.rt.worker_recv(pid, buf, bufsize, timeout)
```
