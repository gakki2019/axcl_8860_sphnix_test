# Engine

## 1. 目录

- [axclrtEngineCreateContext](#axclrtEngineCreateContext)：为已加载的模型创建独立的 Engine 执行 Context。
- [axclrtEngineCreateIO](#axclrtEngineCreateIO)：根据模型 IO 元数据创建 Host 侧 IO 绑定对象。
- [axclrtEngineDestroyIO](#axclrtEngineDestroyIO)：销毁由 [axclrtEngineCreateIO](#axclrtEngineCreateIO) 创建的 IO 绑定对象。
- [axclrtEngineDestroyIOInfo](#axclrtEngineDestroyIOInfo)：销毁由 [axclrtEngineGetIOInfo](#axclrtEngineGetIOInfo) 创建的 IO 元数据对象。
- [axclrtEngineExecute](#axclrtEngineExecute)：在当前 Runtime Context 的默认 Stream 上同步执行模型推理。
- [axclrtEngineExecuteAsync](#axclrtEngineExecuteAsync)：向 Stream 提交模型推理任务。
- [axclrtEngineFinalize](#axclrtEngineFinalize)：反初始化当前 Context 所属设备上的 Engine。
- [axclrtEngineGetAffinity](#axclrtEngineGetAffinity)：获取已加载模型的 NPU 核亲和性掩码。
- [axclrtEngineGetContextAffinity](#axclrtEngineGetContextAffinity)：获取指定 Engine Context 的亲和性；当前版本不支持此操作。
- [axclrtEngineGetIOInfo](#axclrtEngineGetIOInfo)：创建描述已加载模型输入和输出的 Host 侧 IO 元数据对象。
- [axclrtEngineGetInputBufferByIndex](#axclrtEngineGetInputBufferByIndex)：获取指定输入索引保存的缓冲区绑定。
- [axclrtEngineGetInputBufferByName](#axclrtEngineGetInputBufferByName)：获取指定输入张量名称保存的缓冲区绑定。
- [axclrtEngineGetInputDataLayout](#axclrtEngineGetInputDataLayout)：获取输入张量的数据布局。
- [axclrtEngineGetInputDataType](#axclrtEngineGetInputDataType)：获取输入张量的数据类型。
- [axclrtEngineGetInputDims](#axclrtEngineGetInputDims)：获取指定 shape group 中输入张量的维度。
- [axclrtEngineGetInputIndexByName](#axclrtEngineGetInputIndexByName)：根据名称查找输入张量索引。
- [axclrtEngineGetInputNameByIndex](#axclrtEngineGetInputNameByIndex)：根据索引获取输入张量名称。
- [axclrtEngineGetInputSizeByIndex](#axclrtEngineGetInputSizeByIndex)：获取指定 shape group 中模型输入所需的缓冲区大小。
- [axclrtEngineGetModelCompilerVersion](#axclrtEngineGetModelCompilerVersion)：获取已加载模型中记录的编译工具链版本。
- [axclrtEngineGetModelType](#axclrtEngineGetModelType)：获取模型文件的 NPU 核数分类。
- [axclrtEngineGetModelTypeFromMem](#axclrtEngineGetModelTypeFromMem)：获取 Device 内存中模型数据的 NPU 核数分类。
- [axclrtEngineGetModelTypeFromModelId](#axclrtEngineGetModelTypeFromModelId)：获取已加载模型的 NPU 核数分类。
- [axclrtEngineGetNumInputs](#axclrtEngineGetNumInputs)：获取 IO 元数据对象中的模型输入数量。
- [axclrtEngineGetNumOutputs](#axclrtEngineGetNumOutputs)：获取 IO 元数据对象中的模型输出数量。
- [axclrtEngineGetOutputBufferByIndex](#axclrtEngineGetOutputBufferByIndex)：获取指定输出索引保存的缓冲区绑定。
- [axclrtEngineGetOutputBufferByName](#axclrtEngineGetOutputBufferByName)：获取指定输出张量名称保存的缓冲区绑定。
- [axclrtEngineGetOutputDataLayout](#axclrtEngineGetOutputDataLayout)：获取输出张量的数据布局。
- [axclrtEngineGetOutputDataType](#axclrtEngineGetOutputDataType)：获取输出张量的数据类型。
- [axclrtEngineGetOutputDims](#axclrtEngineGetOutputDims)：获取指定 shape group 中输出张量的维度。
- [axclrtEngineGetOutputIndexByName](#axclrtEngineGetOutputIndexByName)：根据名称查找输出张量索引。
- [axclrtEngineGetOutputNameByIndex](#axclrtEngineGetOutputNameByIndex)：根据索引获取输出张量名称。
- [axclrtEngineGetOutputSizeByIndex](#axclrtEngineGetOutputSizeByIndex)：获取指定 shape group 中模型输出所需的缓冲区大小。
- [axclrtEngineGetShapeGroupsCount](#axclrtEngineGetShapeGroupsCount)：获取 IO 元数据对象中的 shape group 数量。
- [axclrtEngineGetUsage](#axclrtEngineGetUsage)：获取模型文件的 Engine 内存用量。
- [axclrtEngineGetUsageFromMem](#axclrtEngineGetUsageFromMem)：获取 Device 内存中模型数据的 Engine 内存用量。
- [axclrtEngineGetUsageFromModelId](#axclrtEngineGetUsageFromModelId)：获取已加载模型的 Engine 内存用量。
- [axclrtEngineGetVNpuKind](#axclrtEngineGetVNpuKind)：获取当前 Context 所属设备上 Engine 的 VNPU 模式。
- [axclrtEngineInit](#axclrtEngineInit)：在调用线程当前 Context 所属的设备上初始化 Engine。
- [axclrtEngineLoadFromFile](#axclrtEngineLoadFromFile)：从 Host 文件向当前设备的 Engine 加载离线模型。
- [axclrtEngineLoadFromMem](#axclrtEngineLoadFromMem)：从 Device 内存向当前设备的 Engine 加载离线模型。
- [axclrtEngineSetAffinity](#axclrtEngineSetAffinity)：设置已加载模型的 NPU 核亲和性掩码。
- [axclrtEngineSetContextAffinity](#axclrtEngineSetContextAffinity)：设置指定 Engine Context 的亲和性；当前版本不支持此操作。
- [axclrtEngineSetDynamicBatchSize](#axclrtEngineSetDynamicBatchSize)：在 IO 绑定对象中保存后续推理使用的动态 batch 大小。
- [axclrtEngineSetInputBufferByIndex](#axclrtEngineSetInputBufferByIndex)：根据索引为输入绑定 Device 缓冲区。
- [axclrtEngineSetInputBufferByName](#axclrtEngineSetInputBufferByName)：根据张量名称为输入绑定 Device 缓冲区。
- [axclrtEngineSetOutputBufferByIndex](#axclrtEngineSetOutputBufferByIndex)：根据索引为输出绑定 Device 缓冲区。
- [axclrtEngineSetOutputBufferByName](#axclrtEngineSetOutputBufferByName)：根据张量名称为输出绑定 Device 缓冲区。
- [axclrtEngineUnload](#axclrtEngineUnload)：从当前设备的 Engine 中卸载模型。

<br>

## 2. API

<a id="axclrtEngineCreateContext"></a>

### 2.1. axclrtEngineCreateContext

为已加载的模型创建独立的 Engine 执行 Context。

#### 2.1.1. 函数

```c
AXCL_EXPORT axclError axclrtEngineCreateContext(uint64_t modelId, uint64_t *contextId);
```

#### 2.1.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| modelId | in | 已加载的模型 ID。 |
| contextId | out | 成功时返回创建的 Engine Context ID。 |

#### 2.1.3. 返回值

- `AXCL_SUCC`：成功创建 Engine Context。
- 其他错误：失败。

#### 2.1.4. 说明

一个模型可以创建多个 Engine Context，每个 Engine Context 具有独立的执行状态。本接口中的 Engine Context 与 [axclrtCreateContext](context_api.md#axclrtCreateContext) 创建的 Runtime Context 是两种不同的对象。

#### 2.1.5. 参考

[axclrtEngineLoadFromFile](#axclrtEngineLoadFromFile) | [axclrtEngineLoadFromMem](#axclrtEngineLoadFromMem)

<br>

<a id="axclrtEngineCreateIO"></a>

### 2.2. axclrtEngineCreateIO

根据模型 IO 元数据创建 Host 侧 IO 绑定对象。

#### 2.2.1. 函数

```c
AXCL_EXPORT axclError axclrtEngineCreateIO(axclrtEngineIOInfo ioInfo, axclrtEngineIO *io);
```

#### 2.2.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| ioInfo | in | 有效的 IO 元数据句柄。 |
| io | out | 成功时返回创建的 IO 绑定句柄。 |

#### 2.2.3. 返回值

- `AXCL_SUCC`：成功创建 IO 绑定对象。
- 其他错误：失败。

#### 2.2.4. 说明

新对象为每个输入和输出创建一个未绑定条目，缓冲区地址和大小均初始化为 0，动态 batch 大小也初始化为 0。对象会复制张量名称和数量，因此本函数成功后可以销毁 `ioInfo`。不再使用返回的 IO 对象时，通过 [axclrtEngineDestroyIO](#axclrtEngineDestroyIO) 销毁。

<br>

<a id="axclrtEngineDestroyIO"></a>

### 2.3. axclrtEngineDestroyIO

销毁由 [axclrtEngineCreateIO](#axclrtEngineCreateIO) 创建的 IO 绑定对象。

#### 2.3.1. 函数

```c
AXCL_EXPORT axclError axclrtEngineDestroyIO(axclrtEngineIO io);
```

#### 2.3.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| io | in | 待销毁的 IO 绑定句柄。 |

#### 2.3.3. 返回值

- `AXCL_SUCC`：成功销毁 IO 绑定对象。
- 其他错误：失败。

#### 2.3.4. 说明

本函数不会释放对象中记录的 Device 缓冲区，这些缓冲区仍由调用者管理。本函数成功后，`io` 失效。

<br>

<a id="axclrtEngineDestroyIOInfo"></a>

### 2.4. axclrtEngineDestroyIOInfo

销毁由 [axclrtEngineGetIOInfo](#axclrtEngineGetIOInfo) 创建的 IO 元数据对象。

#### 2.4.1. 函数

```c
AXCL_EXPORT axclError axclrtEngineDestroyIOInfo(axclrtEngineIOInfo ioInfo);
```

#### 2.4.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| ioInfo | in | 待销毁的 IO 元数据句柄。 |

#### 2.4.3. 返回值

- `AXCL_SUCC`：成功销毁 IO 元数据对象。
- 其他错误：失败。

#### 2.4.4. 说明

本函数成功后，`ioInfo` 以及通过该对象获取的所有名称指针均失效。

<br>

<a id="axclrtEngineExecute"></a>

### 2.5. axclrtEngineExecute

在当前 Runtime Context 的默认 Stream 上同步执行模型推理。

#### 2.5.1. 函数

```c
AXCL_EXPORT axclError axclrtEngineExecute(uint64_t modelId, uint64_t contextId, uint32_t group, axclrtEngineIO io);
```

#### 2.5.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| modelId | in | 已加载的模型 ID。 |
| contextId | in | 为 modelId 创建的 Engine Context ID。 |
| group | in | Shape group 索引，从 0 开始。 |
| io | in | 包含全部必需 Device 缓冲区的 IO 绑定对象。 |

#### 2.5.3. 返回值

- `AXCL_SUCC`：推理执行成功并已完成。
- 其他错误：失败。

#### 2.5.4. 说明

调用者必须为全部输入和输出绑定满足大小要求的有效缓冲区，并确保模型、Engine Context、IO 对象和 Device 缓冲区在本函数返回前始终有效。

<br>

<a id="axclrtEngineExecuteAsync"></a>

### 2.6. axclrtEngineExecuteAsync

向 Stream 提交模型推理任务。

#### 2.6.1. 函数

```c
AXCL_EXPORT axclError axclrtEngineExecuteAsync(uint64_t modelId, uint64_t contextId, uint32_t group, axclrtEngineIO io, axclrtStream stream);
```

#### 2.6.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| modelId | in | 已加载的模型 ID。 |
| contextId | in | 为 modelId 创建的 Engine Context ID。 |
| group | in | Shape group 索引，从 0 开始。 |
| io | in | 包含全部必需 Device 缓冲区的 IO 绑定对象。 |
| stream | in | 接收推理任务的 Stream。传入 NULL 时使用当前 Runtime Context 的默认 Stream。 |

#### 2.6.3. 返回值

- `AXCL_SUCC`：成功提交推理任务。
- 其他错误：失败。

#### 2.6.4. 说明

成功返回仅表示推理任务已提交，不表示推理已经完成。在 Stream 完成前，必须确保模型、Engine Context 和所有已绑定的 Device 缓冲区始终有效；同步 Stream 后可获取推理执行阶段的错误。

#### 2.6.5. 参考

[axclrtEngineExecute](#axclrtEngineExecute) | [axclrtSynchronizeStream](stream_api.md#axclrtSynchronizeStream)

<br>

<a id="axclrtEngineFinalize"></a>

### 2.7. axclrtEngineFinalize

反初始化当前 Context 所属设备上的 Engine。

#### 2.7.1. 函数

```c
AXCL_EXPORT axclError axclrtEngineFinalize();
```

#### 2.7.2. 参数

不适用

#### 2.7.3. 返回值

- `AXCL_SUCC`：成功反初始化 Engine。
- 其他错误：失败。

#### 2.7.4. 说明

反初始化 Engine 前，应等待所有异步推理完成并卸载全部模型。反初始化后，不得继续使用该设备上的模型 ID 和 Engine Context ID。Host 侧 IO 元数据对象和 IO 绑定对象仍由调用者管理，仍需通过对应的销毁接口释放。

<br>

<a id="axclrtEngineGetAffinity"></a>

### 2.8. axclrtEngineGetAffinity

获取已加载模型的 NPU 核亲和性掩码。

#### 2.8.1. 函数

```c
AXCL_EXPORT axclError axclrtEngineGetAffinity(uint64_t modelId, axclrtEngineSet *set);
```

#### 2.8.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| modelId | in | 已加载的模型 ID。 |
| set | out | 成功时返回亲和性掩码。 |

#### 2.8.3. 返回值

- `AXCL_SUCC`：成功获取亲和性掩码。
- 其他错误：失败。

#### 2.8.4. 参考

[axclrtEngineSetAffinity](#axclrtEngineSetAffinity) | [axclrtEngineCreateContext](#axclrtEngineCreateContext)

<br>

<a id="axclrtEngineGetContextAffinity"></a>

### 2.9. axclrtEngineGetContextAffinity

获取指定 Engine Context 的亲和性；当前版本不支持此操作。

#### 2.9.1. 函数

```c
AXCL_EXPORT axclError axclrtEngineGetContextAffinity(uint64_t modelId, uint64_t contextId, axclrtEngineSet *set);
```

#### 2.9.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| modelId | in | 已加载的模型 ID。 |
| contextId | in | Engine Context ID。 |
| set | out | 用于返回亲和性掩码；当前操作不受支持，因此不会返回有效值。 |

#### 2.9.3. 返回值

- 其他错误：当前操作不受支持，或参数无效。

#### 2.9.4. 参考

[axclrtEngineGetAffinity](#axclrtEngineGetAffinity) | [axclrtEngineCreateContext](#axclrtEngineCreateContext)

<br>

<a id="axclrtEngineGetIOInfo"></a>

### 2.10. axclrtEngineGetIOInfo

创建描述已加载模型输入和输出的 Host 侧 IO 元数据对象。

#### 2.10.1. 函数

```c
AXCL_EXPORT axclError axclrtEngineGetIOInfo(uint64_t modelId, axclrtEngineIOInfo *ioInfo);
```

#### 2.10.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| modelId | in | 已加载的模型 ID。 |
| ioInfo | out | 成功时返回创建的 IO 元数据句柄。 |

#### 2.10.3. 返回值

- `AXCL_SUCC`：成功创建 IO 元数据对象。
- 其他错误：失败。

#### 2.10.4. 说明

不再使用返回的句柄时，通过 [axclrtEngineDestroyIOInfo](#axclrtEngineDestroyIOInfo) 销毁。通过该对象获取的张量名称指针仅在句柄销毁前有效。

#### 2.10.5. 参考

[axclrtEngineDestroyIOInfo](#axclrtEngineDestroyIOInfo) | [axclrtEngineCreateIO](#axclrtEngineCreateIO)

<br>

<a id="axclrtEngineGetInputBufferByIndex"></a>

### 2.11. axclrtEngineGetInputBufferByIndex

获取指定输入索引保存的缓冲区绑定。

#### 2.11.1. 函数

```c
AXCL_EXPORT axclError axclrtEngineGetInputBufferByIndex(axclrtEngineIO io, uint32_t index, void **dataBuffer, uint64_t *size);
```

#### 2.11.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| io | in | 有效的 IO 绑定句柄。 |
| index | in | 输入索引，从 0 开始。 |
| dataBuffer | out | 成功时返回已保存的 Device 内存句柄。 |
| size | out | 成功时返回已保存的缓冲区大小，单位为字节。 |

#### 2.11.3. 返回值

- `AXCL_SUCC`：成功获取已保存的缓冲区绑定。
- 其他错误：失败。

#### 2.11.4. 说明

新创建的 IO 对象在相应条目完成绑定前，返回的缓冲区为 NULL、大小为 0。

<br>

<a id="axclrtEngineGetInputBufferByName"></a>

### 2.12. axclrtEngineGetInputBufferByName

获取指定输入张量名称保存的缓冲区绑定。

#### 2.12.1. 函数

```c
AXCL_EXPORT axclError axclrtEngineGetInputBufferByName(axclrtEngineIO io, const char *name, void **dataBuffer, uint64_t *size);
```

#### 2.12.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| io | in | 有效的 IO 绑定句柄。 |
| name | in | 输入张量名称。 |
| dataBuffer | out | 成功时返回已保存的 Device 内存句柄。 |
| size | out | 成功时返回已保存的缓冲区大小，单位为字节。 |

#### 2.12.3. 返回值

- `AXCL_SUCC`：成功获取已保存的缓冲区绑定。
- 其他错误：失败。

<br>

<a id="axclrtEngineGetInputDataLayout"></a>

### 2.13. axclrtEngineGetInputDataLayout

获取输入张量的数据布局。

#### 2.13.1. 函数

```c
AXCL_EXPORT axclError axclrtEngineGetInputDataLayout(axclrtEngineIOInfo ioInfo, uint32_t index, axclrtEngineDataLayout *layout);
```

#### 2.13.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| ioInfo | in | 有效的 IO 元数据句柄。 |
| index | in | 输入索引，从 0 开始。 |
| layout | out | 成功时返回输入张量的数据布局。 |

#### 2.13.3. 返回值

- `AXCL_SUCC`：成功获取数据布局。
- 其他错误：失败。

<br>

<a id="axclrtEngineGetInputDataType"></a>

### 2.14. axclrtEngineGetInputDataType

获取输入张量的数据类型。

#### 2.14.1. 函数

```c
AXCL_EXPORT axclError axclrtEngineGetInputDataType(axclrtEngineIOInfo ioInfo, uint32_t index, axclrtEngineDataType *type);
```

#### 2.14.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| ioInfo | in | 有效的 IO 元数据句柄。 |
| index | in | 输入索引，从 0 开始。 |
| type | out | 成功时返回输入张量的数据类型。 |

#### 2.14.3. 返回值

- `AXCL_SUCC`：成功获取数据类型。
- 其他错误：失败。

<br>

<a id="axclrtEngineGetInputDims"></a>

### 2.15. axclrtEngineGetInputDims

获取指定 shape group 中输入张量的维度。

#### 2.15.1. 函数

```c
AXCL_EXPORT axclError axclrtEngineGetInputDims(axclrtEngineIOInfo ioInfo, uint32_t group, uint32_t index, axclrtEngineIODims *dims);
```

#### 2.15.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| ioInfo | in | 有效的 IO 元数据句柄。 |
| group | in | Shape group 索引，从 0 开始。 |
| index | in | 输入索引，从 0 开始。 |
| dims | out | 调用者提供的结构体，用于返回张量维度。 |

#### 2.15.3. 返回值

- `AXCL_SUCC`：成功获取张量维度。
- 其他错误：失败。

#### 2.15.4. 说明

`dims` 使用调用者提供的结构体，不会分配内存，因此无需调用释放接口。

<br>

<a id="axclrtEngineGetInputIndexByName"></a>

### 2.16. axclrtEngineGetInputIndexByName

根据名称查找输入张量索引。

#### 2.16.1. 函数

```c
AXCL_EXPORT int32_t axclrtEngineGetInputIndexByName(axclrtEngineIOInfo ioInfo, const char *name);
```

#### 2.16.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| ioInfo | in | 有效的 IO 元数据句柄。 |
| name | in | 输入张量名称。 |

#### 2.16.3. 返回值

- 成功时返回非负的输入索引；失败时返回 Engine 错误值。使用 [axclrtGetLastError](other_api.md#axclrtGetLastError) 区分有效索引和错误。

<br>

<a id="axclrtEngineGetInputNameByIndex"></a>

### 2.17. axclrtEngineGetInputNameByIndex

根据索引获取输入张量名称。

#### 2.17.1. 函数

```c
AXCL_EXPORT const char* axclrtEngineGetInputNameByIndex(axclrtEngineIOInfo ioInfo, uint32_t index);
```

#### 2.17.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| ioInfo | in | 有效的 IO 元数据句柄。 |
| index | in | 输入索引，从 0 开始。 |

#### 2.17.3. 返回值

- 成功时返回张量名称，失败时返回 NULL。返回的指针由 `ioInfo` 管理，在调用 [axclrtEngineDestroyIOInfo](#axclrtEngineDestroyIOInfo) 前有效。

#### 2.17.4. 参考

[axclrtEngineGetInputIndexByName](#axclrtEngineGetInputIndexByName) | [axclrtEngineGetNumInputs](#axclrtEngineGetNumInputs)

<br>

<a id="axclrtEngineGetInputSizeByIndex"></a>

### 2.18. axclrtEngineGetInputSizeByIndex

获取指定 shape group 中模型输入所需的缓冲区大小。

#### 2.18.1. 函数

```c
AXCL_EXPORT uint64_t axclrtEngineGetInputSizeByIndex(axclrtEngineIOInfo ioInfo, uint32_t group, uint32_t index);
```

#### 2.18.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| ioInfo | in | 有效的 IO 元数据句柄。 |
| group | in | Shape group 索引，从 0 开始。 |
| index | in | 输入索引，从 0 开始。 |

#### 2.18.3. 返回值

- 成功时返回所需大小，单位为字节；失败时返回编码后的错误值，并设置最后一次错误。

<br>

<a id="axclrtEngineGetModelCompilerVersion"></a>

### 2.19. axclrtEngineGetModelCompilerVersion

获取已加载模型中记录的编译工具链版本。

#### 2.19.1. 函数

```c
AXCL_EXPORT const char* axclrtEngineGetModelCompilerVersion(uint64_t modelId);
```

#### 2.19.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| modelId | in | 已加载的模型 ID。 |

#### 2.19.3. 返回值

- 成功时返回线程局部的、以空字符结尾的版本字符串；失败时返回 NULL。同一线程后续调用本接口可能覆盖该字符串，调用者不得释放返回的指针。

<br>

<a id="axclrtEngineGetModelType"></a>

### 2.20. axclrtEngineGetModelType

获取模型文件的 NPU 核数分类。

#### 2.20.1. 函数

```c
AXCL_EXPORT axclError axclrtEngineGetModelType(const char *modelPath, axclrtEngineModelKind *modelType);
```

#### 2.20.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| modelPath | in | Host 上可读取的普通模型文件路径。 |
| modelType | out | 成功时返回模型类型。 |

#### 2.20.3. 返回值

- `AXCL_SUCC`：成功获取模型类型。
- 其他错误：失败。

#### 2.20.4. 说明

本函数会临时加载模型，并在返回前卸载该模型。

<br>

<a id="axclrtEngineGetModelTypeFromMem"></a>

### 2.21. axclrtEngineGetModelTypeFromMem

获取 Device 内存中模型数据的 NPU 核数分类。

#### 2.21.1. 函数

```c
AXCL_EXPORT axclError axclrtEngineGetModelTypeFromMem(const void *model, uint64_t modelSize, axclrtEngineModelKind *modelType);
```

#### 2.21.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| model | in | 保存模型数据的 Device 内存句柄。 |
| modelSize | in | 模型数据大小，单位为字节，必须大于 0。 |
| modelType | out | 成功时返回模型类型。 |

#### 2.21.3. 返回值

- `AXCL_SUCC`：成功获取模型类型。
- 其他错误：失败。

#### 2.21.4. 说明

本函数会临时加载并卸载模型。`model` 仍由调用者管理，必须属于当前设备，并在本函数返回前始终有效。

<br>

<a id="axclrtEngineGetModelTypeFromModelId"></a>

### 2.22. axclrtEngineGetModelTypeFromModelId

获取已加载模型的 NPU 核数分类。

#### 2.22.1. 函数

```c
AXCL_EXPORT axclError axclrtEngineGetModelTypeFromModelId(uint64_t modelId, axclrtEngineModelKind *modelType);
```

#### 2.22.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| modelId | in | 已加载的模型 ID。 |
| modelType | out | 成功时返回模型类型。 |

#### 2.22.3. 返回值

- `AXCL_SUCC`：成功获取模型类型。
- 其他错误：失败。

<br>

<a id="axclrtEngineGetNumInputs"></a>

### 2.23. axclrtEngineGetNumInputs

获取 IO 元数据对象中的模型输入数量。

#### 2.23.1. 函数

```c
AXCL_EXPORT uint32_t axclrtEngineGetNumInputs(axclrtEngineIOInfo ioInfo);
```

#### 2.23.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| ioInfo | in | 有效的 IO 元数据句柄。 |

#### 2.23.3. 返回值

- 成功时返回输入数量。如果 `ioInfo` 无效，返回值为编码后的错误值，可通过 [axclrtGetLastError](other_api.md#axclrtGetLastError) 获取错误。

<br>

<a id="axclrtEngineGetNumOutputs"></a>

### 2.24. axclrtEngineGetNumOutputs

获取 IO 元数据对象中的模型输出数量。

#### 2.24.1. 函数

```c
AXCL_EXPORT uint32_t axclrtEngineGetNumOutputs(axclrtEngineIOInfo ioInfo);
```

#### 2.24.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| ioInfo | in | 有效的 IO 元数据句柄。 |

#### 2.24.3. 返回值

- 成功时返回输出数量。如果 `ioInfo` 无效，返回值为编码后的错误值，可通过 [axclrtGetLastError](other_api.md#axclrtGetLastError) 获取错误。

<br>

<a id="axclrtEngineGetOutputBufferByIndex"></a>

### 2.25. axclrtEngineGetOutputBufferByIndex

获取指定输出索引保存的缓冲区绑定。

#### 2.25.1. 函数

```c
AXCL_EXPORT axclError axclrtEngineGetOutputBufferByIndex(axclrtEngineIO io, uint32_t index, void **dataBuffer, uint64_t *size);
```

#### 2.25.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| io | in | 有效的 IO 绑定句柄。 |
| index | in | 输出索引，从 0 开始。 |
| dataBuffer | out | 成功时返回已保存的 Device 内存句柄。 |
| size | out | 成功时返回已保存的缓冲区大小，单位为字节。 |

#### 2.25.3. 返回值

- `AXCL_SUCC`：成功获取已保存的缓冲区绑定。
- 其他错误：失败。

#### 2.25.4. 说明

新创建的 IO 对象在相应条目完成绑定前，返回的缓冲区为 NULL、大小为 0。

<br>

<a id="axclrtEngineGetOutputBufferByName"></a>

### 2.26. axclrtEngineGetOutputBufferByName

获取指定输出张量名称保存的缓冲区绑定。

#### 2.26.1. 函数

```c
AXCL_EXPORT axclError axclrtEngineGetOutputBufferByName(axclrtEngineIO io, const char *name, void **dataBuffer, uint64_t *size);
```

#### 2.26.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| io | in | 有效的 IO 绑定句柄。 |
| name | in | 输出张量名称。 |
| dataBuffer | out | 成功时返回已保存的 Device 内存句柄。 |
| size | out | 成功时返回已保存的缓冲区大小，单位为字节。 |

#### 2.26.3. 返回值

- `AXCL_SUCC`：成功获取已保存的缓冲区绑定。
- 其他错误：失败。

<br>

<a id="axclrtEngineGetOutputDataLayout"></a>

### 2.27. axclrtEngineGetOutputDataLayout

获取输出张量的数据布局。

#### 2.27.1. 函数

```c
AXCL_EXPORT axclError axclrtEngineGetOutputDataLayout(axclrtEngineIOInfo ioInfo, uint32_t index, axclrtEngineDataLayout *layout);
```

#### 2.27.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| ioInfo | in | 有效的 IO 元数据句柄。 |
| index | in | 输出索引，从 0 开始。 |
| layout | out | 成功时返回输出张量的数据布局。 |

#### 2.27.3. 返回值

- `AXCL_SUCC`：成功获取数据布局。
- 其他错误：失败。

<br>

<a id="axclrtEngineGetOutputDataType"></a>

### 2.28. axclrtEngineGetOutputDataType

获取输出张量的数据类型。

#### 2.28.1. 函数

```c
AXCL_EXPORT axclError axclrtEngineGetOutputDataType(axclrtEngineIOInfo ioInfo, uint32_t index, axclrtEngineDataType *type);
```

#### 2.28.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| ioInfo | in | 有效的 IO 元数据句柄。 |
| index | in | 输出索引，从 0 开始。 |
| type | out | 成功时返回输出张量的数据类型。 |

#### 2.28.3. 返回值

- `AXCL_SUCC`：成功获取数据类型。
- 其他错误：失败。

<br>

<a id="axclrtEngineGetOutputDims"></a>

### 2.29. axclrtEngineGetOutputDims

获取指定 shape group 中输出张量的维度。

#### 2.29.1. 函数

```c
AXCL_EXPORT axclError axclrtEngineGetOutputDims(axclrtEngineIOInfo ioInfo, uint32_t group, uint32_t index, axclrtEngineIODims *dims);
```

#### 2.29.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| ioInfo | in | 有效的 IO 元数据句柄。 |
| group | in | Shape group 索引，从 0 开始。 |
| index | in | 输出索引，从 0 开始。 |
| dims | out | 调用者提供的结构体，用于返回张量维度。 |

#### 2.29.3. 返回值

- `AXCL_SUCC`：成功获取张量维度。
- 其他错误：失败。

#### 2.29.4. 说明

`dims` 使用调用者提供的结构体，不会分配内存，因此无需调用释放接口。

<br>

<a id="axclrtEngineGetOutputIndexByName"></a>

### 2.30. axclrtEngineGetOutputIndexByName

根据名称查找输出张量索引。

#### 2.30.1. 函数

```c
AXCL_EXPORT int32_t axclrtEngineGetOutputIndexByName(axclrtEngineIOInfo ioInfo, const char *name);
```

#### 2.30.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| ioInfo | in | 有效的 IO 元数据句柄。 |
| name | in | 输出张量名称。 |

#### 2.30.3. 返回值

- 成功时返回非负的输出索引；失败时返回 Engine 错误值。使用 [axclrtGetLastError](other_api.md#axclrtGetLastError) 区分有效索引和错误。

<br>

<a id="axclrtEngineGetOutputNameByIndex"></a>

### 2.31. axclrtEngineGetOutputNameByIndex

根据索引获取输出张量名称。

#### 2.31.1. 函数

```c
AXCL_EXPORT const char* axclrtEngineGetOutputNameByIndex(axclrtEngineIOInfo ioInfo, uint32_t index);
```

#### 2.31.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| ioInfo | in | 有效的 IO 元数据句柄。 |
| index | in | 输出索引，从 0 开始。 |

#### 2.31.3. 返回值

- 成功时返回张量名称，失败时返回 NULL。返回的指针由 `ioInfo` 管理，在调用 [axclrtEngineDestroyIOInfo](#axclrtEngineDestroyIOInfo) 前有效。

#### 2.31.4. 参考

[axclrtEngineGetOutputIndexByName](#axclrtEngineGetOutputIndexByName) | [axclrtEngineGetNumOutputs](#axclrtEngineGetNumOutputs)

<br>

<a id="axclrtEngineGetOutputSizeByIndex"></a>

### 2.32. axclrtEngineGetOutputSizeByIndex

获取指定 shape group 中模型输出所需的缓冲区大小。

#### 2.32.1. 函数

```c
AXCL_EXPORT uint64_t axclrtEngineGetOutputSizeByIndex(axclrtEngineIOInfo ioInfo, uint32_t group, uint32_t index);
```

#### 2.32.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| ioInfo | in | 有效的 IO 元数据句柄。 |
| group | in | Shape group 索引，从 0 开始。 |
| index | in | 输出索引，从 0 开始。 |

#### 2.32.3. 返回值

- 成功时返回所需大小，单位为字节；失败时返回编码后的错误值，并设置最后一次错误。

<br>

<a id="axclrtEngineGetShapeGroupsCount"></a>

### 2.33. axclrtEngineGetShapeGroupsCount

获取 IO 元数据对象中的 shape group 数量。

#### 2.33.1. 函数

```c
AXCL_EXPORT axclError axclrtEngineGetShapeGroupsCount(axclrtEngineIOInfo ioInfo, int32_t *count);
```

#### 2.33.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| ioInfo | in | 有效的 IO 元数据句柄。 |
| count | out | 成功时返回 shape group 数量；模型没有输入时返回 0。 |

#### 2.33.3. 返回值

- `AXCL_SUCC`：成功获取数量。
- 其他错误：失败。

#### 2.33.4. 参考

[axclrtEngineGetIOInfo](#axclrtEngineGetIOInfo) | [axclrtEngineGetInputSizeByIndex](#axclrtEngineGetInputSizeByIndex) | [axclrtEngineGetOutputSizeByIndex](#axclrtEngineGetOutputSizeByIndex)

<br>

<a id="axclrtEngineGetUsage"></a>

### 2.34. axclrtEngineGetUsage

获取模型文件的 Engine 内存用量。

#### 2.34.1. 函数

```c
AXCL_EXPORT axclError axclrtEngineGetUsage(const char *modelPath, int64_t *sysSize, int64_t *cmmSize);
```

#### 2.34.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| modelPath | in | Host 上可读取的普通模型文件路径。 |
| sysSize | out | 成功时返回系统内存用量，单位为字节；当前实现返回 0。 |
| cmmSize | out | 成功时返回 CMM 内存用量，单位为字节。 |

#### 2.34.3. 返回值

- `AXCL_SUCC`：成功获取内存用量。
- 其他错误：失败。

#### 2.34.4. 说明

本函数会临时加载模型，并在返回前卸载该模型。

<br>

<a id="axclrtEngineGetUsageFromMem"></a>

### 2.35. axclrtEngineGetUsageFromMem

获取 Device 内存中模型数据的 Engine 内存用量。

#### 2.35.1. 函数

```c
AXCL_EXPORT axclError axclrtEngineGetUsageFromMem(const void *model, uint64_t modelSize, int64_t *sysSize, int64_t *cmmSize);
```

#### 2.35.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| model | in | 保存模型数据的 Device 内存句柄。 |
| modelSize | in | 模型数据大小，单位为字节，必须大于 0。 |
| sysSize | out | 成功时返回系统内存用量，单位为字节；当前实现返回 0。 |
| cmmSize | out | 成功时返回 CMM 内存用量，单位为字节。 |

#### 2.35.3. 返回值

- `AXCL_SUCC`：成功获取内存用量。
- 其他错误：失败。

#### 2.35.4. 说明

本函数会临时加载并卸载模型。`model` 仍由调用者管理，必须属于当前设备，并在本函数返回前始终有效。

<br>

<a id="axclrtEngineGetUsageFromModelId"></a>

### 2.36. axclrtEngineGetUsageFromModelId

获取已加载模型的 Engine 内存用量。

#### 2.36.1. 函数

```c
AXCL_EXPORT axclError axclrtEngineGetUsageFromModelId(uint64_t modelId, int64_t *sysSize, int64_t *cmmSize);
```

#### 2.36.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| modelId | in | 已加载的模型 ID。 |
| sysSize | out | 成功时返回系统内存用量，单位为字节；当前实现返回 0。 |
| cmmSize | out | 成功时返回 CMM 内存用量，单位为字节。 |

#### 2.36.3. 返回值

- `AXCL_SUCC`：成功获取内存用量。
- 其他错误：失败。

<br>

<a id="axclrtEngineGetVNpuKind"></a>

### 2.37. axclrtEngineGetVNpuKind

获取当前 Context 所属设备上 Engine 的 VNPU 模式。

#### 2.37.1. 函数

```c
AXCL_EXPORT axclError axclrtEngineGetVNpuKind(axclrtEngineVNpuKind *npuKind);
```

#### 2.37.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| npuKind | out | 成功时返回 Engine 初始化时使用的 VNPU 模式。 |

#### 2.37.3. 返回值

- `AXCL_SUCC`：成功获取 VNPU 模式。
- 其他错误：失败。

#### 2.37.4. 说明

调用本接口前，必须已在该设备上初始化 Engine。

<br>

<a id="axclrtEngineInit"></a>

### 2.38. axclrtEngineInit

在调用线程当前 Context 所属的设备上初始化 Engine。

#### 2.38.1. 函数

```c
AXCL_EXPORT axclError axclrtEngineInit(axclrtEngineVNpuKind npuKind);
```

#### 2.38.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| npuKind | in | 用于初始化设备 Engine 的 VNPU 模式。 |

#### 2.38.3. 返回值

- `AXCL_SUCC`：成功初始化 Engine。
- 其他错误：失败。

#### 2.38.4. 说明

建立当前 Context 后、使用该设备上的其他 Engine 接口前调用本函数。成功初始化后，应在释放设备前调用 [axclrtEngineFinalize](#axclrtEngineFinalize) 进行反初始化。

<br>

<a id="axclrtEngineLoadFromFile"></a>

### 2.39. axclrtEngineLoadFromFile

从 Host 文件向当前设备的 Engine 加载离线模型。

#### 2.39.1. 函数

```c
AXCL_EXPORT axclError axclrtEngineLoadFromFile(const char *modelPath, uint64_t *modelId);
```

#### 2.39.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| modelPath | in | Host 上可读取的普通模型文件路径。 |
| modelId | out | 成功时返回供后续 Engine 接口使用的模型 ID。 |

#### 2.39.3. 返回值

- `AXCL_SUCC`：成功加载模型。
- 其他错误：失败。

#### 2.39.4. 说明

本函数读取模型文件，临时分配 Device 内存，将模型复制到设备并完成加载，然后在返回前释放临时内存。不再使用返回的模型 ID 时，通过 [axclrtEngineUnload](#axclrtEngineUnload) 卸载模型。

<br>

<a id="axclrtEngineLoadFromMem"></a>

### 2.40. axclrtEngineLoadFromMem

从 Device 内存向当前设备的 Engine 加载离线模型。

#### 2.40.1. 函数

```c
AXCL_EXPORT axclError axclrtEngineLoadFromMem(const void *model, uint64_t modelSize, uint64_t *modelId);
```

#### 2.40.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| model | in | 保存模型数据的 Device 内存句柄。 |
| modelSize | in | 模型数据大小，单位为字节，必须大于 0。 |
| modelId | out | 成功时返回供后续 Engine 接口使用的模型 ID。 |

#### 2.40.3. 返回值

- `AXCL_SUCC`：成功加载模型。
- 其他错误：失败。

#### 2.40.4. 说明

`model` 必须属于当前设备，并在本函数返回前始终有效。该内存仍由调用者管理，模型加载成功后即可释放。不再使用返回的模型 ID 时，通过 [axclrtEngineUnload](#axclrtEngineUnload) 卸载模型。

<br>

<a id="axclrtEngineSetAffinity"></a>

### 2.41. axclrtEngineSetAffinity

设置已加载模型的 NPU 核亲和性掩码。

#### 2.41.1. 函数

```c
AXCL_EXPORT axclError axclrtEngineSetAffinity(uint64_t modelId, axclrtEngineSet set);
```

#### 2.41.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| modelId | in | 已加载的模型 ID。 |
| set | in | 使用 bit 0～2 的非零亲和性掩码，有效值为 0x1～0x7。 |

#### 2.41.3. 返回值

- `AXCL_SUCC`：成功设置亲和性掩码。
- 其他错误：失败。

#### 2.41.4. 参考

[axclrtEngineGetAffinity](#axclrtEngineGetAffinity) | [axclrtEngineCreateContext](#axclrtEngineCreateContext)

<br>

<a id="axclrtEngineSetContextAffinity"></a>

### 2.42. axclrtEngineSetContextAffinity

设置指定 Engine Context 的亲和性；当前版本不支持此操作。

#### 2.42.1. 函数

```c
AXCL_EXPORT axclError axclrtEngineSetContextAffinity(uint64_t modelId, uint64_t contextId, axclrtEngineSet set);
```

#### 2.42.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| modelId | in | 已加载的模型 ID。 |
| contextId | in | Engine Context ID。 |
| set | in | 非零亲和性掩码，有效值为 0x1～0x7。 |

#### 2.42.3. 返回值

- 其他错误：当前操作不受支持，或参数无效。

#### 2.42.4. 参考

[axclrtEngineSetAffinity](#axclrtEngineSetAffinity) | [axclrtEngineCreateContext](#axclrtEngineCreateContext)

<br>

<a id="axclrtEngineSetDynamicBatchSize"></a>

### 2.43. axclrtEngineSetDynamicBatchSize

在 IO 绑定对象中保存后续推理使用的动态 batch 大小。

#### 2.43.1. 函数

```c
AXCL_EXPORT axclError axclrtEngineSetDynamicBatchSize(axclrtEngineIO io, uint32_t batchSize);
```

#### 2.43.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| io | in | 有效的 IO 绑定句柄。 |
| batchSize | in | 待保存的 batch 大小。 |

#### 2.43.3. 返回值

- `AXCL_SUCC`：成功保存 batch 大小。
- 其他错误：失败。

#### 2.43.4. 说明

本函数仅在 `io` 中保存该值，实际执行推理时才根据模型进行校验。

<br>

<a id="axclrtEngineSetInputBufferByIndex"></a>

### 2.44. axclrtEngineSetInputBufferByIndex

根据索引为输入绑定 Device 缓冲区。

#### 2.44.1. 函数

```c
AXCL_EXPORT axclError axclrtEngineSetInputBufferByIndex(axclrtEngineIO io, uint32_t index, const void *dataBuffer, uint64_t size);
```

#### 2.44.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| io | in | 有效的 IO 绑定句柄。 |
| index | in | 输入索引，从 0 开始。 |
| dataBuffer | in | 待绑定的 Device 内存句柄。 |
| size | in | 绑定的缓冲区大小，单位为字节，必须大于 0。 |

#### 2.44.3. 返回值

- `AXCL_SUCC`：成功保存缓冲区绑定。
- 其他错误：失败。

#### 2.44.4. 说明

本函数仅保存缓冲区地址和大小，不复制缓冲区，也不取得缓冲区所有权。调用者必须使用所选 shape group 要求的大小，并确保缓冲区在推理执行完成前始终有效。

<br>

<a id="axclrtEngineSetInputBufferByName"></a>

### 2.45. axclrtEngineSetInputBufferByName

根据张量名称为输入绑定 Device 缓冲区。

#### 2.45.1. 函数

```c
AXCL_EXPORT axclError axclrtEngineSetInputBufferByName(axclrtEngineIO io, const char *name, const void *dataBuffer, uint64_t size);
```

#### 2.45.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| io | in | 有效的 IO 绑定句柄。 |
| name | in | 输入张量名称。 |
| dataBuffer | in | 待绑定的 Device 内存句柄。 |
| size | in | 绑定的缓冲区大小，单位为字节，必须大于 0。 |

#### 2.45.3. 返回值

- `AXCL_SUCC`：成功保存缓冲区绑定。
- 其他错误：失败。

#### 2.45.4. 说明

本函数仅保存缓冲区地址和大小，不复制缓冲区，也不取得缓冲区所有权。调用者必须确保缓冲区在推理执行完成前始终有效，并使用所选 shape group 要求的大小。

<br>

<a id="axclrtEngineSetOutputBufferByIndex"></a>

### 2.46. axclrtEngineSetOutputBufferByIndex

根据索引为输出绑定 Device 缓冲区。

#### 2.46.1. 函数

```c
AXCL_EXPORT axclError axclrtEngineSetOutputBufferByIndex(axclrtEngineIO io, uint32_t index, const void *dataBuffer, uint64_t size);
```

#### 2.46.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| io | in | 有效的 IO 绑定句柄。 |
| index | in | 输出索引，从 0 开始。 |
| dataBuffer | in | 待绑定的 Device 内存句柄。 |
| size | in | 绑定的缓冲区大小，单位为字节，必须大于 0。 |

#### 2.46.3. 返回值

- `AXCL_SUCC`：成功保存缓冲区绑定。
- 其他错误：失败。

#### 2.46.4. 说明

本函数仅保存缓冲区地址和大小，不复制缓冲区，也不取得缓冲区所有权。调用者必须使用所选 shape group 要求的大小，并确保缓冲区在推理执行完成前始终有效。

<br>

<a id="axclrtEngineSetOutputBufferByName"></a>

### 2.47. axclrtEngineSetOutputBufferByName

根据张量名称为输出绑定 Device 缓冲区。

#### 2.47.1. 函数

```c
AXCL_EXPORT axclError axclrtEngineSetOutputBufferByName(axclrtEngineIO io, const char *name, const void *dataBuffer, uint64_t size);
```

#### 2.47.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| io | in | 有效的 IO 绑定句柄。 |
| name | in | 输出张量名称。 |
| dataBuffer | in | 待绑定的 Device 内存句柄。 |
| size | in | 绑定的缓冲区大小，单位为字节，必须大于 0。 |

#### 2.47.3. 返回值

- `AXCL_SUCC`：成功保存缓冲区绑定。
- 其他错误：失败。

#### 2.47.4. 说明

本函数仅保存缓冲区地址和大小，不复制缓冲区，也不取得缓冲区所有权。调用者必须确保缓冲区在推理执行完成前始终有效，并使用所选 shape group 要求的大小。

<br>

<a id="axclrtEngineUnload"></a>

### 2.48. axclrtEngineUnload

从当前设备的 Engine 中卸载模型。

#### 2.48.1. 函数

```c
AXCL_EXPORT axclError axclrtEngineUnload(uint64_t modelId);
```

#### 2.48.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| modelId | in | 模型加载接口返回的模型 ID。 |

#### 2.48.3. 返回值

- `AXCL_SUCC`：成功卸载模型。
- 其他错误：失败。

#### 2.48.4. 说明

调用本函数前，必须确保没有同步或异步推理仍在使用该模型或由该模型创建的 Engine Context。本函数成功后，`modelId` 失效。
