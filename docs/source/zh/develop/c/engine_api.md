# 引擎

## 目录

- [axclrtEngineCreateContext](#axclrtEngineCreateContext)
- [axclrtEngineCreateIO](#axclrtEngineCreateIO)
- [axclrtEngineDestroyIO](#axclrtEngineDestroyIO)
- [axclrtEngineDestroyIOInfo](#axclrtEngineDestroyIOInfo)
- [axclrtEngineExecute](#axclrtEngineExecute)
- [axclrtEngineExecuteAsync](#axclrtEngineExecuteAsync)
- [axclrtEngineFinalize](#axclrtEngineFinalize)
- [axclrtEngineGetAffinity](#axclrtEngineGetAffinity)
- [axclrtEngineGetContextAffinity](#axclrtEngineGetContextAffinity)
- [axclrtEngineGetIOInfo](#axclrtEngineGetIOInfo)
- [axclrtEngineGetInputBufferByIndex](#axclrtEngineGetInputBufferByIndex)
- [axclrtEngineGetInputBufferByName](#axclrtEngineGetInputBufferByName)
- [axclrtEngineGetInputDataLayout](#axclrtEngineGetInputDataLayout)
- [axclrtEngineGetInputDataType](#axclrtEngineGetInputDataType)
- [axclrtEngineGetInputDims](#axclrtEngineGetInputDims)
- [axclrtEngineGetInputIndexByName](#axclrtEngineGetInputIndexByName)
- [axclrtEngineGetInputNameByIndex](#axclrtEngineGetInputNameByIndex)
- [axclrtEngineGetInputSizeByIndex](#axclrtEngineGetInputSizeByIndex)
- [axclrtEngineGetModelCompilerVersion](#axclrtEngineGetModelCompilerVersion)
- [axclrtEngineGetModelType](#axclrtEngineGetModelType)
- [axclrtEngineGetModelTypeFromMem](#axclrtEngineGetModelTypeFromMem)
- [axclrtEngineGetModelTypeFromModelId](#axclrtEngineGetModelTypeFromModelId)
- [axclrtEngineGetNumInputs](#axclrtEngineGetNumInputs)
- [axclrtEngineGetNumOutputs](#axclrtEngineGetNumOutputs)
- [axclrtEngineGetOutputBufferByIndex](#axclrtEngineGetOutputBufferByIndex)
- [axclrtEngineGetOutputBufferByName](#axclrtEngineGetOutputBufferByName)
- [axclrtEngineGetOutputDataLayout](#axclrtEngineGetOutputDataLayout)
- [axclrtEngineGetOutputDataType](#axclrtEngineGetOutputDataType)
- [axclrtEngineGetOutputDims](#axclrtEngineGetOutputDims)
- [axclrtEngineGetOutputIndexByName](#axclrtEngineGetOutputIndexByName)
- [axclrtEngineGetOutputNameByIndex](#axclrtEngineGetOutputNameByIndex)
- [axclrtEngineGetOutputSizeByIndex](#axclrtEngineGetOutputSizeByIndex)
- [axclrtEngineGetShapeGroupsCount](#axclrtEngineGetShapeGroupsCount)
- [axclrtEngineGetUsage](#axclrtEngineGetUsage)
- [axclrtEngineGetUsageFromMem](#axclrtEngineGetUsageFromMem)
- [axclrtEngineGetUsageFromModelId](#axclrtEngineGetUsageFromModelId)
- [axclrtEngineGetVNpuKind](#axclrtEngineGetVNpuKind)
- [axclrtEngineInit](#axclrtEngineInit)
- [axclrtEngineLoadFromFile](#axclrtEngineLoadFromFile)
- [axclrtEngineLoadFromMem](#axclrtEngineLoadFromMem)
- [axclrtEngineSetAffinity](#axclrtEngineSetAffinity)
- [axclrtEngineSetContextAffinity](#axclrtEngineSetContextAffinity)
- [axclrtEngineSetDynamicBatchSize](#axclrtEngineSetDynamicBatchSize)
- [axclrtEngineSetInputBufferByIndex](#axclrtEngineSetInputBufferByIndex)
- [axclrtEngineSetInputBufferByName](#axclrtEngineSetInputBufferByName)
- [axclrtEngineSetOutputBufferByIndex](#axclrtEngineSetOutputBufferByIndex)
- [axclrtEngineSetOutputBufferByName](#axclrtEngineSetOutputBufferByName)
- [axclrtEngineUnload](#axclrtEngineUnload)

<br>

## API

<a id="axclrtEngineCreateContext"></a>

### axclrtEngineCreateContext

创建模型上下文。

#### 函数

```c
AXCL_EXPORT axclError axclrtEngineCreateContext(uint64_t modelId, uint64_t *contextId);
```

#### 参数

| 名称      | 方向 | 说明              |
| --------- | ---- | ----------------- |
| modelId   | in   | 模型 ID           |
| contextId | out  | 已创建的上下文 ID |

#### 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

#### 参考

[axclrtEngineLoadFromFile](#axclrtEngineLoadFromFile) | [axclrtEngineLoadFromMem](#axclrtEngineLoadFromMem)

#### 限制

一个 model id 可以创建多个运行上下文，并且每个上下文都只会在自己的配置和内存空间中运行。

<br>

<a id="axclrtEngineCreateIO"></a>

### axclrtEngineCreateIO

创建 axclrtEngineIO 数据。

#### 函数

```c
AXCL_EXPORT axclError axclrtEngineCreateIO(axclrtEngineIOInfo ioInfo, axclrtEngineIO *io);
```

#### 参数

| 名称   | 方向 | 说明                         |
| ------ | ---- | ---------------------------- |
| ioInfo | in   | axclrtEngineIOInfo 指针      |
| io     | out  | 已创建的 axclrtEngineIO 指针 |

#### 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

#### 限制

用户在使用完 axclrtEngineIO 后应调用 axclrtEngineDestroyIO 进行释放。

<br>

<a id="axclrtEngineDestroyIO"></a>

### axclrtEngineDestroyIO

销毁 axclrtEngineIO 数据。

#### 函数

```c
AXCL_EXPORT axclError axclrtEngineDestroyIO(axclrtEngineIO io);
```

#### 参数

| 名称 | 方向 | 说明                         |
| ---- | ---- | ---------------------------- |
| io   | in   | 要销毁的 axclrtEngineIO 指针 |

#### 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

<br>

<a id="axclrtEngineDestroyIOInfo"></a>

### axclrtEngineDestroyIOInfo

销毁 axclrtEngineIOInfo 数据。

#### 函数

```c
AXCL_EXPORT axclError axclrtEngineDestroyIOInfo(axclrtEngineIOInfo ioInfo);
```

#### 参数

| 名称   | 方向 | 说明                    |
| ------ | ---- | ----------------------- |
| ioInfo | in   | axclrtEngineIOInfo 指针 |

#### 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

<br>

<a id="axclrtEngineExecute"></a>

### axclrtEngineExecute

同步执行模型推理。

#### 函数

```c
AXCL_EXPORT axclError axclrtEngineExecute(uint64_t modelId, uint64_t contextId, uint32_t group, axclrtEngineIO io);
```

#### 参数

| 名称      | 方向 | 说明           |
| --------- | ---- | -------------- |
| modelId   | in   | 模型 ID        |
| contextId | in   | 模型推理上下文 |
| group     | in   | 模型形状组索引 |
| io        | in   | 模型推理 IO    |

#### 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

<br>

<a id="axclrtEngineExecuteAsync"></a>

### axclrtEngineExecuteAsync

异步执行模型推理。

#### 函数

```c
AXCL_EXPORT axclError axclrtEngineExecuteAsync(uint64_t modelId, uint64_t contextId, uint32_t group, axclrtEngineIO io, axclrtStream stream);
```

#### 参数

| 名称      | 方向 | 说明           |
| --------- | ---- | -------------- |
| modelId   | in   | 模型 ID        |
| contextId | in   | 模型推理上下文 |
| group     | in   | 模型形状组索引 |
| io        | in   | 模型推理 IO    |
| stream    | in   | 流             |

#### 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

#### 参考

axclLoadFromFile | axclLoadFromMem | axclLoadFromFileWithMem | axclLoadFromMemWithMem

<br>

<a id="axclrtEngineFinalize"></a>

### axclrtEngineFinalize

结束运行时引擎。

#### 函数

```c
AXCL_EXPORT axclError axclrtEngineFinalize();
```

#### 参数

不适用

#### 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

#### 限制

用户需要先调用 axclrtEngineInit 初始化运行时。

<br>

<a id="axclrtEngineGetAffinity"></a>

### axclrtEngineGetAffinity

获取模型亲和性。

#### 函数

```c
AXCL_EXPORT axclError axclrtEngineGetAffinity(uint64_t modelId, axclrtEngineSet *set);
```

#### 参数

| 名称    | 方向 | 说明       |
| ------- | ---- | ---------- |
| modelId | in   | 模型 ID    |
| set     | out  | 亲和性集合 |

#### 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

#### 参考

[axclrtEngineCreateContext](#axclrtEngineCreateContext) | [axclrtEngineSetAffinity](#axclrtEngineSetAffinity)

<br>

<a id="axclrtEngineGetContextAffinity"></a>

### axclrtEngineGetContextAffinity

获取上下文亲和性，当前尚不支持。

#### 函数

```c
AXCL_EXPORT axclError axclrtEngineGetContextAffinity(uint64_t modelId, uint64_t contextId, axclrtEngineSet *set);
```

#### 参数

| 名称      | 方向 | 说明       |
| --------- | ---- | ---------- |
| modelId   | in   | 模型 ID    |
| contextId | in   | 上下文 ID  |
| set       | out  | 亲和性集合 |

#### 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

#### 参考

[axclrtEngineCreateContext](#axclrtEngineCreateContext) | [axclrtEngineSetContextAffinity](#axclrtEngineSetContextAffinity)

<br>

<a id="axclrtEngineGetIOInfo"></a>

### axclrtEngineGetIOInfo

获取 I/O 信息。

#### 函数

```c
AXCL_EXPORT axclError axclrtEngineGetIOInfo(uint64_t modelId, axclrtEngineIOInfo *ioInfo);
```

#### 参数

| 名称    | 方向 | 说明                    |
| ------- | ---- | ----------------------- |
| modelId | in   | 模型 ID                 |
| ioInfo  | out  | axclrtEngineIOInfo 指针 |

#### 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

#### 参考

[axclrtEngineDestroyIOInfo](#axclrtEngineDestroyIOInfo) | axclrtEngineGetIOInfoByIndex

#### 限制

用户在使用完 axclrtEngineIOInfo 后应调用 axclrtEngineDestroyIOInfo 进行释放。

<br>

<a id="axclrtEngineGetInputBufferByIndex"></a>

### axclrtEngineGetInputBufferByIndex

按 I/O 索引获取输入数据缓冲区。

#### 函数

```c
AXCL_EXPORT axclError axclrtEngineGetInputBufferByIndex(axclrtEngineIO io, uint32_t index, void **dataBuffer, uint64_t *size);
```

#### 参数

| 名称       | 方向 | 说明                                   |
| ---------- | ---- | -------------------------------------- |
| io         | in   | 要获取数据缓冲区的 axclrtEngineIO 地址 |
| index      | in   | 输入张量索引                           |
| dataBuffer | out  | 数据缓冲区地址                         |
| size       | out  | 数据缓冲区大小                         |

#### 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

#### 限制

该数据缓冲区是设备内存，需要用户自行申请和释放。

<br>

<a id="axclrtEngineGetInputBufferByName"></a>

### axclrtEngineGetInputBufferByName

按 I/O 名称获取输入数据缓冲区。

#### 函数

```c
AXCL_EXPORT axclError axclrtEngineGetInputBufferByName(axclrtEngineIO io, const char *name, void **dataBuffer, uint64_t *size);
```

#### 参数

| 名称       | 方向 | 说明                                   |
| ---------- | ---- | -------------------------------------- |
| io         | in   | 要获取数据缓冲区的 axclrtEngineIO 地址 |
| name       | in   | 输入张量名称                           |
| dataBuffer | out  | 数据缓冲区地址                         |
| size       | out  | 数据缓冲区大小                         |

#### 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

#### 限制

该数据缓冲区是设备内存，需要用户自行申请和释放。

<br>

<a id="axclrtEngineGetInputDataLayout"></a>

### axclrtEngineGetInputDataLayout

获取输入数据布局。

#### 函数

```c
AXCL_EXPORT axclError axclrtEngineGetInputDataLayout(axclrtEngineIOInfo ioInfo, uint32_t index, axclrtEngineDataLayout *layout);
```

#### 参数

| 名称   | 方向 | 说明                    |
| ------ | ---- | ----------------------- |
| ioInfo | in   | axclrtEngineIOInfo 指针 |
| index  | in   | 输入 io 索引            |
| layout | out  | 输入 IO 数据布局        |

#### 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

#### 参考

[axclrtEngineGetIOInfo](#axclrtEngineGetIOInfo) | axclrtEngineGetIOInfoByIndex | [axclrtEngineGetNumInputs](#axclrtEngineGetNumInputs)

<br>

<a id="axclrtEngineGetInputDataType"></a>

### axclrtEngineGetInputDataType

获取输入数据类型。

#### 函数

```c
AXCL_EXPORT axclError axclrtEngineGetInputDataType(axclrtEngineIOInfo ioInfo, uint32_t index, axclrtEngineDataType *type);
```

#### 参数

| 名称   | 方向 | 说明                    |
| ------ | ---- | ----------------------- |
| ioInfo | in   | axclrtEngineIOInfo 指针 |
| index  | in   | 输入 io 索引            |
| type   | out  | 输入 IO 数据类型        |

#### 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

#### 参考

[axclrtEngineGetIOInfo](#axclrtEngineGetIOInfo) | axclrtEngineGetIOInfoByIndex | [axclrtEngineGetNumInputs](#axclrtEngineGetNumInputs)

<br>

<a id="axclrtEngineGetInputDims"></a>

### axclrtEngineGetInputDims

获取输入维度信息。

#### 函数

```c
AXCL_EXPORT axclError axclrtEngineGetInputDims(axclrtEngineIOInfo ioInfo, uint32_t group, uint32_t index, axclrtEngineIODims *dims);
```

#### 参数

| 名称   | 方向 | 说明                    |
| ------ | ---- | ----------------------- |
| ioInfo | in   | axclrtEngineIOInfo 指针 |
| group  | in   | 输入形状组索引          |
| index  | in   | 输入张量索引            |
| dims   | out  | 维度信息                |

#### 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

#### 参考

[axclrtEngineGetIOInfo](#axclrtEngineGetIOInfo) | axclrtEngineGetIOInfoByIndex | [axclrtEngineGetNumInputs](#axclrtEngineGetNumInputs)

#### 限制

用户在使用完 [axclrtEngineIODims](reference/struct.md#axclrtEngineIODims) 后应进行释放。

<br>

<a id="axclrtEngineGetInputIndexByName"></a>

### axclrtEngineGetInputIndexByName

按名称获取输入张量索引。

#### 函数

```c
AXCL_EXPORT int32_t axclrtEngineGetInputIndexByName(axclrtEngineIOInfo ioInfo, const char *name);
```

#### 参数

| 名称   | 方向 | 说明                    |
| ------ | ---- | ----------------------- |
| ioInfo | in   | axclrtEngineIOInfo 指针 |
| name   | in   | 输入张量名称            |

#### 返回值

- `input`：张量索引。
- `-1`：未找到。

<br>

<a id="axclrtEngineGetInputNameByIndex"></a>

### axclrtEngineGetInputNameByIndex

按索引获取输入名称。

#### 函数

```c
AXCL_EXPORT const char* axclrtEngineGetInputNameByIndex(axclrtEngineIOInfo ioInfo, uint32_t index);
```

#### 参数

| 名称   | 方向 | 说明                    |
| ------ | ---- | ----------------------- |
| ioInfo | in   | axclrtEngineIOInfo 指针 |
| index  | in   | 输入 io 索引            |

#### 返回值

- `input`：张量名称，与 ioInfo 生命周期一致。
- `NULL`：未找到。

#### 参考

[axclrtEngineGetIOInfo](#axclrtEngineGetIOInfo) | axclrtEngineGetIOInfoByIndex | [axclrtEngineGetNumInputs](#axclrtEngineGetNumInputs)

<br>

<a id="axclrtEngineGetInputSizeByIndex"></a>

### axclrtEngineGetInputSizeByIndex

从 axclrtEngineIOInfo 获取指定输入的大小。

#### 函数

```c
AXCL_EXPORT uint64_t axclrtEngineGetInputSizeByIndex(axclrtEngineIOInfo ioInfo, uint32_t group, uint32_t index);
```

#### 参数

| 名称   | 方向 | 说明                                  |
| ------ | ---- | ------------------------------------- |
| ioInfo | in   | axclrtEngineIOInfo 指针               |
| group  | in   | 输入形状组索引                        |
| index  | in   | 要获取的输入编号索引，索引值从 0 开始 |

#### 返回值

- `Specify`：输入大小。

<br>

<a id="axclrtEngineGetModelCompilerVersion"></a>

### axclrtEngineGetModelCompilerVersion

获取模型构建工具链版本。

#### 函数

```c
AXCL_EXPORT const char* axclrtEngineGetModelCompilerVersion(uint64_t modelId);
```

#### 参数

| 名称    | 方向 | 说明    |
| ------- | ---- | ------- |
| modelId | in   | 模型 ID |

#### 返回值

- 编译工具链版字符串

<br>

<a id="axclrtEngineGetModelType"></a>

### axclrtEngineGetModelType

获取模型类型。

#### 函数

```c
AXCL_EXPORT axclError axclrtEngineGetModelType(const char *modelPath, axclrtEngineModelKind *modelType);
```

#### 参数

| 名称      | 方向 | 说明                   |
| --------- | ---- | ---------------------- |
| modelPath | in   | 用于获取模型类型的路径 |
| modelType | out  | 模型类型               |

#### 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

<br>

<a id="axclrtEngineGetModelTypeFromMem"></a>

### axclrtEngineGetModelTypeFromMem

获取模型类型。

#### 函数

```c
AXCL_EXPORT axclError axclrtEngineGetModelTypeFromMem(const void *model, uint64_t modelSize, axclrtEngineModelKind *modelType);
```

#### 参数

| 名称      | 方向 | 说明               |
| --------- | ---- | ------------------ |
| model     | in   | 用户管理的模型内存 |
| modelSize | in   | 模型数据大小       |
| modelType | out  | 模型类型           |

#### 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

#### 限制

该模型内存是设备内存，需要用户自行申请和释放。

<br>

<a id="axclrtEngineGetModelTypeFromModelId"></a>

### axclrtEngineGetModelTypeFromModelId

获取模型类型。

#### 函数

```c
AXCL_EXPORT axclError axclrtEngineGetModelTypeFromModelId(uint64_t modelId, axclrtEngineModelKind *modelType);
```

#### 参数

| 名称      | 方向 | 说明     |
| --------- | ---- | -------- |
| modelId   | in   | 模型 ID  |
| modelType | out  | 模型类型 |

#### 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

<br>

<a id="axclrtEngineGetNumInputs"></a>

### axclrtEngineGetNumInputs

从 axclrtEngineIOInfo 获取模型输入数量。

#### 函数

```c
AXCL_EXPORT uint32_t axclrtEngineGetNumInputs(axclrtEngineIOInfo ioInfo);
```

#### 参数

| 名称   | 方向 | 说明                    |
| ------ | ---- | ----------------------- |
| ioInfo | in   | axclrtEngineIOInfo 指针 |

#### 返回值

- `input`：axclrtEngineIOInfo 中的数量。

<br>

<a id="axclrtEngineGetNumOutputs"></a>

### axclrtEngineGetNumOutputs

从 axclrtEngineIOInfo 获取模型输出数量。

#### 函数

```c
AXCL_EXPORT uint32_t axclrtEngineGetNumOutputs(axclrtEngineIOInfo ioInfo);
```

#### 参数

| 名称   | 方向 | 说明                    |
| ------ | ---- | ----------------------- |
| ioInfo | in   | axclrtEngineIOInfo 指针 |

#### 返回值

- `output`：axclrtEngineIOInfo 中的数量。

<br>

<a id="axclrtEngineGetOutputBufferByIndex"></a>

### axclrtEngineGetOutputBufferByIndex

按 I/O 索引获取输出数据缓冲区。

#### 函数

```c
AXCL_EXPORT axclError axclrtEngineGetOutputBufferByIndex(axclrtEngineIO io, uint32_t index, void **dataBuffer, uint64_t *size);
```

#### 参数

| 名称       | 方向 | 说明                                   |
| ---------- | ---- | -------------------------------------- |
| io         | in   | 要获取数据缓冲区的 axclrtEngineIO 地址 |
| index      | in   | 输出张量索引                           |
| dataBuffer | out  | 数据缓冲区地址                         |
| size       | out  | 数据缓冲区大小                         |

#### 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

#### Restriction

该数据缓冲区是设备内存，需要用户自行申请和释放。

<br>

<a id="axclrtEngineGetOutputBufferByName"></a>

### axclrtEngineGetOutputBufferByName

按 I/O 名称获取输出数据缓冲区。

#### 函数

```c
AXCL_EXPORT axclError axclrtEngineGetOutputBufferByName(axclrtEngineIO io, const char *name, void **dataBuffer, uint64_t *size);
```

#### 参数

| 名称       | 方向 | 说明                                   |
| ---------- | ---- | -------------------------------------- |
| io         | in   | 要获取数据缓冲区的 axclrtEngineIO 地址 |
| name       | in   | 输出张量名称                           |
| dataBuffer | out  | 数据缓冲区地址                         |
| size       | out  | 数据缓冲区大小                         |

#### 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

#### 限制

该数据缓冲区是设备内存，需要用户自行申请和释放。

<br>

<a id="axclrtEngineGetOutputDataLayout"></a>

### axclrtEngineGetOutputDataLayout

获取输出数据布局。

#### 函数

```c
AXCL_EXPORT axclError axclrtEngineGetOutputDataLayout(axclrtEngineIOInfo ioInfo, uint32_t index, axclrtEngineDataLayout *layout);
```

#### 参数

| 名称   | 方向 | 说明                    |
| ------ | ---- | ----------------------- |
| ioInfo | in   | axclrtEngineIOInfo 指针 |
| index  | in   | 输出 io 索引            |
| layout | out  | 输出 IO 数据布局        |

#### 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

#### 参考

[axclrtEngineGetIOInfo](#axclrtEngineGetIOInfo) | axclrtEngineGetIOInfoByIndex | [axclrtEngineGetNumOutputs](#axclrtEngineGetNumOutputs)

<br>

<a id="axclrtEngineGetOutputDataType"></a>

### axclrtEngineGetOutputDataType

获取输出数据类型。

#### 函数

```c
AXCL_EXPORT axclError axclrtEngineGetOutputDataType(axclrtEngineIOInfo ioInfo, uint32_t index, axclrtEngineDataType *type);
```

#### 参数

| 名称   | 方向 | 说明                    |
| ------ | ---- | ----------------------- |
| ioInfo | in   | axclrtEngineIOInfo 指针 |
| index  | in   | 输出 io 索引            |
| type   | out  | 输出 IO 数据类型        |

#### 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

#### 参考

[axclrtEngineGetIOInfo](#axclrtEngineGetIOInfo) | axclrtEngineGetIOInfoByIndex | [axclrtEngineGetNumOutputs](#axclrtEngineGetNumOutputs)

<br>

<a id="axclrtEngineGetOutputDims"></a>

### axclrtEngineGetOutputDims

获取输出维度信息。

#### 函数

```c
AXCL_EXPORT axclError axclrtEngineGetOutputDims(axclrtEngineIOInfo ioInfo, uint32_t group, uint32_t index, axclrtEngineIODims *dims);
```

#### 参数

| 名称   | 方向 | 说明                    |
| ------ | ---- | ----------------------- |
| ioInfo | in   | axclrtEngineIOInfo 指针 |
| group  | in   | 输出形状组索引          |
| index  | in   | 输出张量索引            |
| dims   | out  | 维度信息                |

#### 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

#### 参考

[axclrtEngineGetIOInfo](#axclrtEngineGetIOInfo) | axclrtEngineGetIOInfoByIndex | [axclrtEngineGetNumOutputs](#axclrtEngineGetNumOutputs)

#### 限制

用户在使用完 [axclrtEngineIODims](reference/struct.md#axclrtEngineIODims) 后应进行释放。

<br>

<a id="axclrtEngineGetOutputIndexByName"></a>

### axclrtEngineGetOutputIndexByName

Get the output tensor index by name.

#### Function

```c
AXCL_EXPORT int32_t axclrtEngineGetOutputIndexByName(axclrtEngineIOInfo ioInfo, const char *name);
```

#### Parameters

| Name   | Direction | Description                |
| ------ | --------- | -------------------------- |
| ioInfo | in        | axclrtEngineIOInfo pointer |
| name   | in        | output tensor name         |

#### Returns

- `output`: tensor index
- `-1`: if not found

<br>

<a id="axclrtEngineGetOutputNameByIndex"></a>

### axclrtEngineGetOutputNameByIndex

按索引获取输出名称。

#### 函数

```c
AXCL_EXPORT const char* axclrtEngineGetOutputNameByIndex(axclrtEngineIOInfo ioInfo, uint32_t index);
```

#### Parameters

| Name   | Direction | Description                |
| ------ | --------- | -------------------------- |
| ioInfo | in        | axclrtEngineIOInfo pointer |
| index  | in        | output io index            |

#### Returns

- `output`: tensor name,the same life cycle with ioInfo
- `NULL`: if not found

#### 参考

[axclrtEngineGetIOInfo](#axclrtEngineGetIOInfo) | axclrtEngineGetIOInfoByIndex | [axclrtEngineGetNumOutputs](#axclrtEngineGetNumOutputs)

<br>

<a id="axclrtEngineGetOutputSizeByIndex"></a>

### axclrtEngineGetOutputSizeByIndex

Get the size of the specified output from axclrtEngineIOInfo.

#### Function

```c
AXCL_EXPORT uint64_t axclrtEngineGetOutputSizeByIndex(axclrtEngineIOInfo ioInfo, uint32_t group, uint32_t index);
```

#### Parameters

| Name   | Direction | Description                                                                     |
| ------ | --------- | ------------------------------------------------------------------------------- |
| ioInfo | in        | axclrtEngineIOInfo pointer                                                      |
| group  | in        | output shape group index                                                        |
| index  | in        | the size of the number of outputs to be obtained, the index value starts from 0 |

#### Returns

- `Specify`: the size of the output

<br>

<a id="axclrtEngineGetShapeGroupsCount"></a>

### axclrtEngineGetShapeGroupsCount

Get the shape group count.

#### Function

```c
AXCL_EXPORT axclError axclrtEngineGetShapeGroupsCount(axclrtEngineIOInfo ioInfo, int32_t *count);
```

#### Parameters

| Name   | Direction | Description                |
| ------ | --------- | -------------------------- |
| ioInfo | in        | axclrtEngineIOInfo pointer |
| count  | out       | Shape groups count         |

#### Returns

- `AXCL_SUCC`: success.
- `others`: failure.

#### 参考

[axclrtEngineGetIOInfo](#axclrtEngineGetIOInfo) | axclrtEngineGetIOInfoByIndex

#### Restriction

RestrictionPulsar2 toolchain can specify several shapes in model conversion a time. There is only one shape in a normal model, and so it's no needs to call this function for normally converted model.

<br>

<a id="axclrtEngineGetUsage"></a>

### axclrtEngineGetUsage

获取内存占用。

#### 函数

```c
AXCL_EXPORT axclError axclrtEngineGetUsage(const char *modelPath, int64_t *sysSize, int64_t *cmmSize);
```

#### 参数

| 名称      | 方向 | 说明                             |
| --------- | ---- | -------------------------------- |
| modelPath | in   | 用于获取内存信息的模型路径       |
| sysSize   | out  | 模型执行时所需的系统工作内存大小 |
| cmmSize   | out  | 模型执行时所需的 cmm 内存大小    |

#### 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

<br>

<a id="axclrtEngineGetUsageFromMem"></a>

### axclrtEngineGetUsageFromMem

获取内存占用。

#### 函数

```c
AXCL_EXPORT axclError axclrtEngineGetUsageFromMem(const void *model, uint64_t modelSize, int64_t *sysSize, int64_t *cmmSize);
```

#### 参数

| 名称      | 方向 | 说明                             |
| --------- | ---- | -------------------------------- |
| model     | in   | 用户管理的模型内存               |
| modelSize | in   | 模型数据大小                     |
| sysSize   | out  | 模型执行时所需的系统工作内存大小 |
| cmmSize   | out  | 模型执行时所需的 cmm 内存大小    |

#### 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

#### 限制

该模型内存是设备内存，需要用户自行申请和释放。

<br>

<a id="axclrtEngineGetUsageFromModelId"></a>

### axclrtEngineGetUsageFromModelId

获取内存占用。

#### 函数

```c
AXCL_EXPORT axclError axclrtEngineGetUsageFromModelId(uint64_t modelId, int64_t *sysSize, int64_t *cmmSize);
```

#### 参数

| 名称    | 方向 | 说明                             |
| ------- | ---- | -------------------------------- |
| modelId | in   | 模型 ID                          |
| sysSize | out  | 模型执行时所需的系统工作内存大小 |
| cmmSize | out  | 模型执行时所需的 cmm 内存大小    |

#### 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

<br>

<a id="axclrtEngineGetVNpuKind"></a>

### axclrtEngineGetVNpuKind

获取视觉 NPU 类型。

#### 函数

```c
AXCL_EXPORT axclError axclrtEngineGetVNpuKind(axclrtEngineVNpuKind *npuKind);
```

#### 参数

| 名称    | 方向 | 说明      |
| ------- | ---- | --------- |
| npuKind | out  | VNPU 类型 |

#### 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

<br>

<a id="axclrtEngineInit"></a>

### axclrtEngineInit

初始化运行时引擎。

#### 函数

```c
AXCL_EXPORT axclError axclrtEngineInit(axclrtEngineVNpuKind npuKind);
```

#### 参数

| 名称    | 方向 | 说明                                 |
| ------- | ---- | ------------------------------------ |
| npuKind | in   | 使用指定的 VNPU 类型初始化运行时引擎 |

#### 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

#### 限制

用户在使用后需要调用 axclrtEngineFinalize 结束运行时引擎。

<br>

<a id="axclrtEngineLoadFromFile"></a>

### axclrtEngineLoadFromFile

从文件加载离线模型数据，并在内部管理内存。

#### 函数

```c
AXCL_EXPORT axclError axclrtEngineLoadFromFile(const char *modelPath, uint64_t *modelId);
```

#### 参数

| 名称      | 方向 | 说明                            |
| --------- | ---- | ------------------------------- |
| modelPath | in   | 离线模型文件的存储路径          |
| modelId   | out  | 系统完成模型加载后生成的模型 ID |

#### 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

<br>

<a id="axclrtEngineLoadFromMem"></a>

### axclrtEngineLoadFromMem

从内存加载离线模型数据，并在内部管理运行时内存。

#### 函数

```c
AXCL_EXPORT axclError axclrtEngineLoadFromMem(const void *model, uint64_t modelSize, uint64_t *modelId);
```

#### 参数

| 名称      | 方向 | 说明                            |
| --------- | ---- | ------------------------------- |
| model     | in   | 存储在内存中的模型数据          |
| modelSize | in   | 模型数据大小                    |
| modelId   | out  | 系统完成模型加载后生成的模型 ID |

#### 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

#### 限制

该模型内存是设备内存，需要用户自行申请和释放。

<br>

<a id="axclrtEngineSetAffinity"></a>

### axclrtEngineSetAffinity

设置模型亲和性。

#### 函数

```c
AXCL_EXPORT axclError axclrtEngineSetAffinity(uint64_t modelId, axclrtEngineSet set);
```

#### 参数

| 名称    | 方向 | 说明       |
| ------- | ---- | ---------- |
| modelId | in   | 模型 ID    |
| set     | in   | 亲和性集合 |

#### 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

#### 参考

[axclrtEngineCreateContext](#axclrtEngineCreateContext) | [axclrtEngineGetAffinity](#axclrtEngineGetAffinity)

#### 限制

不允许为 0，且 set 中被掩码的位不能超出亲和性范围。

<br>

<a id="axclrtEngineSetContextAffinity"></a>

### axclrtEngineSetContextAffinity

设置上下文亲和性，当前尚不支持。

#### 函数

```c
AXCL_EXPORT axclError axclrtEngineSetContextAffinity(uint64_t modelId, uint64_t contextId, axclrtEngineSet set);
```

#### 参数

| 名称      | 方向 | 说明       |
| --------- | ---- | ---------- |
| modelId   | in   | 模型 ID    |
| contextId | in   | 上下文 ID  |
| set       | in   | 亲和性集合 |

#### 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

#### 参考

[axclrtEngineCreateContext](#axclrtEngineCreateContext) | [axclrtEngineSetContextAffinity](#axclrtEngineSetContextAffinity)

<br>

<a id="axclrtEngineSetDynamicBatchSize"></a>

### axclrtEngineSetDynamicBatchSize

设置模型推理期间使用的动态 batch 大小。

#### 函数

```c
AXCL_EXPORT axclError axclrtEngineSetDynamicBatchSize(axclrtEngineIO io, uint32_t batchSize);
```

#### 参数

| 名称      | 方向 | 说明                   |
| --------- | ---- | ---------------------- |
| io        | in   | 模型推理 IO            |
| batchSize | in   | 模型一次处理的图像数量 |

#### 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

#### 参考

[axclrtEngineCreateContext](#axclrtEngineCreateContext) |

<br>

<a id="axclrtEngineSetInputBufferByIndex"></a>

### axclrtEngineSetInputBufferByIndex

按 I/O 索引设置输入数据缓冲区。

#### 函数

```c
AXCL_EXPORT axclError axclrtEngineSetInputBufferByIndex(axclrtEngineIO io, uint32_t index, const void *dataBuffer, uint64_t size);
```

#### 参数

| 名称       | 方向 | 说明                                   |
| ---------- | ---- | -------------------------------------- |
| io         | in   | 要设置数据缓冲区的 axclrtEngineIO 地址 |
| index      | in   | 输入张量索引                           |
| dataBuffer | in   | 要添加的数据缓冲区地址                 |
| size       | in   | 数据缓冲区大小                         |

#### Returns

- `AXCL_SUCC`: success.
- `others`: failure.

#### 限制

该数据缓冲区是设备内存，需要用户自行申请和释放。

<br>

<a id="axclrtEngineSetInputBufferByName"></a>

### axclrtEngineSetInputBufferByName

Set the input data buffer by I/O name.

#### Function

```c
AXCL_EXPORT axclError axclrtEngineSetInputBufferByName(axclrtEngineIO io, const char *name, const void *dataBuffer, uint64_t size);
```

#### Parameters

| Name       | Direction | Description                                     |
| ---------- | --------- | ----------------------------------------------- |
| io         | in        | axclrtEngineIO address of data buffer to be set |
| name       | in        | Input tensor name                               |
| dataBuffer | in        | data buffer address to be added                 |
| size       | in        | data buffer size                                |

#### Returns

- `AXCL_SUCC`: success.
- `others`: failure.

#### 限制

该数据缓冲区是设备内存，需要用户自行申请和释放。

<br>

<a id="axclrtEngineSetOutputBufferByIndex"></a>

### axclrtEngineSetOutputBufferByIndex

Set the output data buffer by I/O index.

#### Function

```c
AXCL_EXPORT axclError axclrtEngineSetOutputBufferByIndex(axclrtEngineIO io, uint32_t index, const void *dataBuffer, uint64_t size);
```

#### Parameters

| Name       | Direction | Description                                     |
| ---------- | --------- | ----------------------------------------------- |
| io         | in        | axclrtEngineIO address of data buffer to be set |
| index      | in        | Output tensor index                             |
| dataBuffer | in        | data buffer address to be added                 |
| size       | in        | data buffer size                                |

#### Returns

- `AXCL_SUCC`: success.
- `others`: failure.

#### 限制

该数据缓冲区是设备内存，需要用户自行申请和释放。

<br>

<a id="axclrtEngineSetOutputBufferByName"></a>

### axclrtEngineSetOutputBufferByName

Set the output data buffer by I/O name.

#### Function

```c
AXCL_EXPORT axclError axclrtEngineSetOutputBufferByName(axclrtEngineIO io, const char *name, const void *dataBuffer, uint64_t size);
```

#### Parameters

| Name       | Direction | Description                                     |
| ---------- | --------- | ----------------------------------------------- |
| io         | in        | axclrtEngineIO address of data buffer to be set |
| name       | in        | Output tensor name                              |
| dataBuffer | in        | data buffer address to be added                 |
| size       | in        | data buffer size                                |

#### Returns

- `AXCL_SUCC`: success.
- `others`: failure.

#### 限制

该数据缓冲区是设备内存，需要用户自行申请和释放。

<br>

<a id="axclrtEngineUnload"></a>

### axclrtEngineUnload

Unload a model by model ID.

#### Function

```c
AXCL_EXPORT axclError axclrtEngineUnload(uint64_t modelId);
```

#### Parameters

| Name    | Direction | Description             |
| ------- | --------- | ----------------------- |
| modelId | in        | Model id to be unloaded |

#### Returns

- `AXCL_SUCC`: success.
- `others`: failure.
