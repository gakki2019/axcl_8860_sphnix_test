# 引擎

## 1. 目录

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

## 2. API

<a id="axclrtEngineCreateContext"></a>

### 2.1. axclrtEngineCreateContext

创建模型上下文。

#### 2.1.1. 函数

```c
AXCL_EXPORT axclError axclrtEngineCreateContext(uint64_t modelId, uint64_t *contextId);
```

#### 2.1.2. 参数

| 名称      | 方向 | 说明              |
| --------- | ---- | ----------------- |
| modelId   | in   | 模型 ID           |
| contextId | out  | 已创建的上下文 ID |

#### 2.1.3. 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

#### 2.1.4. 参考

[axclrtEngineLoadFromFile](#axclrtEngineLoadFromFile) | [axclrtEngineLoadFromMem](#axclrtEngineLoadFromMem)

#### 2.1.5. 限制

一个 model id 可以创建多个运行上下文，并且每个上下文都只会在自己的配置和内存空间中运行。

<br>

<a id="axclrtEngineCreateIO"></a>

### 2.2. axclrtEngineCreateIO

创建 axclrtEngineIO 数据。

#### 2.2.1. 函数

```c
AXCL_EXPORT axclError axclrtEngineCreateIO(axclrtEngineIOInfo ioInfo, axclrtEngineIO *io);
```

#### 2.2.2. 参数

| 名称   | 方向 | 说明                         |
| ------ | ---- | ---------------------------- |
| ioInfo | in   | axclrtEngineIOInfo 指针      |
| io     | out  | 已创建的 axclrtEngineIO 指针 |

#### 2.2.3. 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

#### 2.2.4. 限制

用户在使用完 axclrtEngineIO 后应调用 axclrtEngineDestroyIO 进行释放。

<br>

<a id="axclrtEngineDestroyIO"></a>

### 2.3. axclrtEngineDestroyIO

销毁 axclrtEngineIO 数据。

#### 2.3.1. 函数

```c
AXCL_EXPORT axclError axclrtEngineDestroyIO(axclrtEngineIO io);
```

#### 2.3.2. 参数

| 名称 | 方向 | 说明                         |
| ---- | ---- | ---------------------------- |
| io   | in   | 要销毁的 axclrtEngineIO 指针 |

#### 2.3.3. 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

<br>

<a id="axclrtEngineDestroyIOInfo"></a>

### 2.4. axclrtEngineDestroyIOInfo

销毁 axclrtEngineIOInfo 数据。

#### 2.4.1. 函数

```c
AXCL_EXPORT axclError axclrtEngineDestroyIOInfo(axclrtEngineIOInfo ioInfo);
```

#### 2.4.2. 参数

| 名称   | 方向 | 说明                    |
| ------ | ---- | ----------------------- |
| ioInfo | in   | axclrtEngineIOInfo 指针 |

#### 2.4.3. 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

<br>

<a id="axclrtEngineExecute"></a>

### 2.5. axclrtEngineExecute

同步执行模型推理。

#### 2.5.1. 函数

```c
AXCL_EXPORT axclError axclrtEngineExecute(uint64_t modelId, uint64_t contextId, uint32_t group, axclrtEngineIO io);
```

#### 2.5.2. 参数

| 名称      | 方向 | 说明           |
| --------- | ---- | -------------- |
| modelId   | in   | 模型 ID        |
| contextId | in   | 模型推理上下文 |
| group     | in   | 模型形状组索引 |
| io        | in   | 模型推理 IO    |

#### 2.5.3. 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

<br>

<a id="axclrtEngineExecuteAsync"></a>

### 2.6. axclrtEngineExecuteAsync

异步执行模型推理。

#### 2.6.1. 函数

```c
AXCL_EXPORT axclError axclrtEngineExecuteAsync(uint64_t modelId, uint64_t contextId, uint32_t group, axclrtEngineIO io, axclrtStream stream);
```

#### 2.6.2. 参数

| 名称      | 方向 | 说明           |
| --------- | ---- | -------------- |
| modelId   | in   | 模型 ID        |
| contextId | in   | 模型推理上下文 |
| group     | in   | 模型形状组索引 |
| io        | in   | 模型推理 IO    |
| stream    | in   | 流             |

#### 2.6.3. 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

#### 2.6.4. 参考

axclLoadFromFile | axclLoadFromMem | axclLoadFromFileWithMem | axclLoadFromMemWithMem

<br>

<a id="axclrtEngineFinalize"></a>

### 2.7. axclrtEngineFinalize

结束运行时引擎。

#### 2.7.1. 函数

```c
AXCL_EXPORT axclError axclrtEngineFinalize();
```

#### 2.7.2. 参数

不适用

#### 2.7.3. 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

#### 2.7.4. 限制

用户需要先调用 axclrtEngineInit 初始化运行时。

<br>

<a id="axclrtEngineGetAffinity"></a>

### 2.8. axclrtEngineGetAffinity

获取模型亲和性。

#### 2.8.1. 函数

```c
AXCL_EXPORT axclError axclrtEngineGetAffinity(uint64_t modelId, axclrtEngineSet *set);
```

#### 2.8.2. 参数

| 名称    | 方向 | 说明       |
| ------- | ---- | ---------- |
| modelId | in   | 模型 ID    |
| set     | out  | 亲和性集合 |

#### 2.8.3. 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

#### 2.8.4. 参考

[axclrtEngineCreateContext](#axclrtEngineCreateContext) | [axclrtEngineSetAffinity](#axclrtEngineSetAffinity)

<br>

<a id="axclrtEngineGetContextAffinity"></a>

### 2.9. axclrtEngineGetContextAffinity

获取上下文亲和性，当前尚不支持。

#### 2.9.1. 函数

```c
AXCL_EXPORT axclError axclrtEngineGetContextAffinity(uint64_t modelId, uint64_t contextId, axclrtEngineSet *set);
```

#### 2.9.2. 参数

| 名称      | 方向 | 说明       |
| --------- | ---- | ---------- |
| modelId   | in   | 模型 ID    |
| contextId | in   | 上下文 ID  |
| set       | out  | 亲和性集合 |

#### 2.9.3. 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

#### 2.9.4. 参考

[axclrtEngineCreateContext](#axclrtEngineCreateContext) | [axclrtEngineSetContextAffinity](#axclrtEngineSetContextAffinity)

<br>

<a id="axclrtEngineGetIOInfo"></a>

### 2.10. axclrtEngineGetIOInfo

获取 I/O 信息。

#### 2.10.1. 函数

```c
AXCL_EXPORT axclError axclrtEngineGetIOInfo(uint64_t modelId, axclrtEngineIOInfo *ioInfo);
```

#### 2.10.2. 参数

| 名称    | 方向 | 说明                    |
| ------- | ---- | ----------------------- |
| modelId | in   | 模型 ID                 |
| ioInfo  | out  | axclrtEngineIOInfo 指针 |

#### 2.10.3. 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

#### 2.10.4. 参考

[axclrtEngineDestroyIOInfo](#axclrtEngineDestroyIOInfo) | axclrtEngineGetIOInfoByIndex

#### 2.10.5. 限制

用户在使用完 axclrtEngineIOInfo 后应调用 axclrtEngineDestroyIOInfo 进行释放。

<br>

<a id="axclrtEngineGetInputBufferByIndex"></a>

### 2.11. axclrtEngineGetInputBufferByIndex

按 I/O 索引获取输入数据缓冲区。

#### 2.11.1. 函数

```c
AXCL_EXPORT axclError axclrtEngineGetInputBufferByIndex(axclrtEngineIO io, uint32_t index, void **dataBuffer, uint64_t *size);
```

#### 2.11.2. 参数

| 名称       | 方向 | 说明                                   |
| ---------- | ---- | -------------------------------------- |
| io         | in   | 要获取数据缓冲区的 axclrtEngineIO 地址 |
| index      | in   | 输入张量索引                           |
| dataBuffer | out  | 数据缓冲区地址                         |
| size       | out  | 数据缓冲区大小                         |

#### 2.11.3. 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

#### 2.11.4. 限制

该数据缓冲区是设备内存，需要用户自行申请和释放。

<br>

<a id="axclrtEngineGetInputBufferByName"></a>

### 2.12. axclrtEngineGetInputBufferByName

按 I/O 名称获取输入数据缓冲区。

#### 2.12.1. 函数

```c
AXCL_EXPORT axclError axclrtEngineGetInputBufferByName(axclrtEngineIO io, const char *name, void **dataBuffer, uint64_t *size);
```

#### 2.12.2. 参数

| 名称       | 方向 | 说明                                   |
| ---------- | ---- | -------------------------------------- |
| io         | in   | 要获取数据缓冲区的 axclrtEngineIO 地址 |
| name       | in   | 输入张量名称                           |
| dataBuffer | out  | 数据缓冲区地址                         |
| size       | out  | 数据缓冲区大小                         |

#### 2.12.3. 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

#### 2.12.4. 限制

该数据缓冲区是设备内存，需要用户自行申请和释放。

<br>

<a id="axclrtEngineGetInputDataLayout"></a>

### 2.13. axclrtEngineGetInputDataLayout

获取输入数据布局。

#### 2.13.1. 函数

```c
AXCL_EXPORT axclError axclrtEngineGetInputDataLayout(axclrtEngineIOInfo ioInfo, uint32_t index, axclrtEngineDataLayout *layout);
```

#### 2.13.2. 参数

| 名称   | 方向 | 说明                    |
| ------ | ---- | ----------------------- |
| ioInfo | in   | axclrtEngineIOInfo 指针 |
| index  | in   | 输入 io 索引            |
| layout | out  | 输入 IO 数据布局        |

#### 2.13.3. 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

#### 2.13.4. 参考

[axclrtEngineGetIOInfo](#axclrtEngineGetIOInfo) | axclrtEngineGetIOInfoByIndex | [axclrtEngineGetNumInputs](#axclrtEngineGetNumInputs)

<br>

<a id="axclrtEngineGetInputDataType"></a>

### 2.14. axclrtEngineGetInputDataType

获取输入数据类型。

#### 2.14.1. 函数

```c
AXCL_EXPORT axclError axclrtEngineGetInputDataType(axclrtEngineIOInfo ioInfo, uint32_t index, axclrtEngineDataType *type);
```

#### 2.14.2. 参数

| 名称   | 方向 | 说明                    |
| ------ | ---- | ----------------------- |
| ioInfo | in   | axclrtEngineIOInfo 指针 |
| index  | in   | 输入 io 索引            |
| type   | out  | 输入 IO 数据类型        |

#### 2.14.3. 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

#### 2.14.4. 参考

[axclrtEngineGetIOInfo](#axclrtEngineGetIOInfo) | axclrtEngineGetIOInfoByIndex | [axclrtEngineGetNumInputs](#axclrtEngineGetNumInputs)

<br>

<a id="axclrtEngineGetInputDims"></a>

### 2.15. axclrtEngineGetInputDims

获取输入维度信息。

#### 2.15.1. 函数

```c
AXCL_EXPORT axclError axclrtEngineGetInputDims(axclrtEngineIOInfo ioInfo, uint32_t group, uint32_t index, axclrtEngineIODims *dims);
```

#### 2.15.2. 参数

| 名称   | 方向 | 说明                    |
| ------ | ---- | ----------------------- |
| ioInfo | in   | axclrtEngineIOInfo 指针 |
| group  | in   | 输入形状组索引          |
| index  | in   | 输入张量索引            |
| dims   | out  | 维度信息                |

#### 2.15.3. 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

#### 2.15.4. 参考

[axclrtEngineGetIOInfo](#axclrtEngineGetIOInfo) | axclrtEngineGetIOInfoByIndex | [axclrtEngineGetNumInputs](#axclrtEngineGetNumInputs)

#### 2.15.5. 限制

用户在使用完 [axclrtEngineIODims](reference/struct.md#axclrtEngineIODims) 后应进行释放。

<br>

<a id="axclrtEngineGetInputIndexByName"></a>

### 2.16. axclrtEngineGetInputIndexByName

按名称获取输入张量索引。

#### 2.16.1. 函数

```c
AXCL_EXPORT int32_t axclrtEngineGetInputIndexByName(axclrtEngineIOInfo ioInfo, const char *name);
```

#### 2.16.2. 参数

| 名称   | 方向 | 说明                    |
| ------ | ---- | ----------------------- |
| ioInfo | in   | axclrtEngineIOInfo 指针 |
| name   | in   | 输入张量名称            |

#### 2.16.3. 返回值

- `input`：张量索引。
- `-1`：未找到。

<br>

<a id="axclrtEngineGetInputNameByIndex"></a>

### 2.17. axclrtEngineGetInputNameByIndex

按索引获取输入名称。

#### 2.17.1. 函数

```c
AXCL_EXPORT const char* axclrtEngineGetInputNameByIndex(axclrtEngineIOInfo ioInfo, uint32_t index);
```

#### 2.17.2. 参数

| 名称   | 方向 | 说明                    |
| ------ | ---- | ----------------------- |
| ioInfo | in   | axclrtEngineIOInfo 指针 |
| index  | in   | 输入 io 索引            |

#### 2.17.3. 返回值

- `input`：张量名称，与 ioInfo 生命周期一致。
- `NULL`：未找到。

#### 2.17.4. 参考

[axclrtEngineGetIOInfo](#axclrtEngineGetIOInfo) | axclrtEngineGetIOInfoByIndex | [axclrtEngineGetNumInputs](#axclrtEngineGetNumInputs)

<br>

<a id="axclrtEngineGetInputSizeByIndex"></a>

### 2.18. axclrtEngineGetInputSizeByIndex

从 axclrtEngineIOInfo 获取指定输入的大小。

#### 2.18.1. 函数

```c
AXCL_EXPORT uint64_t axclrtEngineGetInputSizeByIndex(axclrtEngineIOInfo ioInfo, uint32_t group, uint32_t index);
```

#### 2.18.2. 参数

| 名称   | 方向 | 说明                                  |
| ------ | ---- | ------------------------------------- |
| ioInfo | in   | axclrtEngineIOInfo 指针               |
| group  | in   | 输入形状组索引                        |
| index  | in   | 要获取的输入编号索引，索引值从 0 开始 |

#### 2.18.3. 返回值

- `Specify`：输入大小。

<br>

<a id="axclrtEngineGetModelCompilerVersion"></a>

### 2.19. axclrtEngineGetModelCompilerVersion

获取模型构建工具链版本。

#### 2.19.1. 函数

```c
AXCL_EXPORT const char* axclrtEngineGetModelCompilerVersion(uint64_t modelId);
```

#### 2.19.2. 参数

| 名称    | 方向 | 说明    |
| ------- | ---- | ------- |
| modelId | in   | 模型 ID |

#### 2.19.3. 返回值

- 编译工具链版字符串

<br>

<a id="axclrtEngineGetModelType"></a>

### 2.20. axclrtEngineGetModelType

获取模型类型。

#### 2.20.1. 函数

```c
AXCL_EXPORT axclError axclrtEngineGetModelType(const char *modelPath, axclrtEngineModelKind *modelType);
```

#### 2.20.2. 参数

| 名称      | 方向 | 说明                   |
| --------- | ---- | ---------------------- |
| modelPath | in   | 用于获取模型类型的路径 |
| modelType | out  | 模型类型               |

#### 2.20.3. 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

<br>

<a id="axclrtEngineGetModelTypeFromMem"></a>

### 2.21. axclrtEngineGetModelTypeFromMem

获取模型类型。

#### 2.21.1. 函数

```c
AXCL_EXPORT axclError axclrtEngineGetModelTypeFromMem(const void *model, uint64_t modelSize, axclrtEngineModelKind *modelType);
```

#### 2.21.2. 参数

| 名称      | 方向 | 说明               |
| --------- | ---- | ------------------ |
| model     | in   | 用户管理的模型内存 |
| modelSize | in   | 模型数据大小       |
| modelType | out  | 模型类型           |

#### 2.21.3. 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

#### 2.21.4. 限制

该模型内存是设备内存，需要用户自行申请和释放。

<br>

<a id="axclrtEngineGetModelTypeFromModelId"></a>

### 2.22. axclrtEngineGetModelTypeFromModelId

获取模型类型。

#### 2.22.1. 函数

```c
AXCL_EXPORT axclError axclrtEngineGetModelTypeFromModelId(uint64_t modelId, axclrtEngineModelKind *modelType);
```

#### 2.22.2. 参数

| 名称      | 方向 | 说明     |
| --------- | ---- | -------- |
| modelId   | in   | 模型 ID  |
| modelType | out  | 模型类型 |

#### 2.22.3. 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

<br>

<a id="axclrtEngineGetNumInputs"></a>

### 2.23. axclrtEngineGetNumInputs

从 axclrtEngineIOInfo 获取模型输入数量。

#### 2.23.1. 函数

```c
AXCL_EXPORT uint32_t axclrtEngineGetNumInputs(axclrtEngineIOInfo ioInfo);
```

#### 2.23.2. 参数

| 名称   | 方向 | 说明                    |
| ------ | ---- | ----------------------- |
| ioInfo | in   | axclrtEngineIOInfo 指针 |

#### 2.23.3. 返回值

- `input`：axclrtEngineIOInfo 中的数量。

<br>

<a id="axclrtEngineGetNumOutputs"></a>

### 2.24. axclrtEngineGetNumOutputs

从 axclrtEngineIOInfo 获取模型输出数量。

#### 2.24.1. 函数

```c
AXCL_EXPORT uint32_t axclrtEngineGetNumOutputs(axclrtEngineIOInfo ioInfo);
```

#### 2.24.2. 参数

| 名称   | 方向 | 说明                    |
| ------ | ---- | ----------------------- |
| ioInfo | in   | axclrtEngineIOInfo 指针 |

#### 2.24.3. 返回值

- `output`：axclrtEngineIOInfo 中的数量。

<br>

<a id="axclrtEngineGetOutputBufferByIndex"></a>

### 2.25. axclrtEngineGetOutputBufferByIndex

按 I/O 索引获取输出数据缓冲区。

#### 2.25.1. 函数

```c
AXCL_EXPORT axclError axclrtEngineGetOutputBufferByIndex(axclrtEngineIO io, uint32_t index, void **dataBuffer, uint64_t *size);
```

#### 2.25.2. 参数

| 名称       | 方向 | 说明                                   |
| ---------- | ---- | -------------------------------------- |
| io         | in   | 要获取数据缓冲区的 axclrtEngineIO 地址 |
| index      | in   | 输出张量索引                           |
| dataBuffer | out  | 数据缓冲区地址                         |
| size       | out  | 数据缓冲区大小                         |

#### 2.25.3. 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

#### 2.25.4. Restriction

该数据缓冲区是设备内存，需要用户自行申请和释放。

<br>

<a id="axclrtEngineGetOutputBufferByName"></a>

### 2.26. axclrtEngineGetOutputBufferByName

按 I/O 名称获取输出数据缓冲区。

#### 2.26.1. 函数

```c
AXCL_EXPORT axclError axclrtEngineGetOutputBufferByName(axclrtEngineIO io, const char *name, void **dataBuffer, uint64_t *size);
```

#### 2.26.2. 参数

| 名称       | 方向 | 说明                                   |
| ---------- | ---- | -------------------------------------- |
| io         | in   | 要获取数据缓冲区的 axclrtEngineIO 地址 |
| name       | in   | 输出张量名称                           |
| dataBuffer | out  | 数据缓冲区地址                         |
| size       | out  | 数据缓冲区大小                         |

#### 2.26.3. 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

#### 2.26.4. 限制

该数据缓冲区是设备内存，需要用户自行申请和释放。

<br>

<a id="axclrtEngineGetOutputDataLayout"></a>

### 2.27. axclrtEngineGetOutputDataLayout

获取输出数据布局。

#### 2.27.1. 函数

```c
AXCL_EXPORT axclError axclrtEngineGetOutputDataLayout(axclrtEngineIOInfo ioInfo, uint32_t index, axclrtEngineDataLayout *layout);
```

#### 2.27.2. 参数

| 名称   | 方向 | 说明                    |
| ------ | ---- | ----------------------- |
| ioInfo | in   | axclrtEngineIOInfo 指针 |
| index  | in   | 输出 io 索引            |
| layout | out  | 输出 IO 数据布局        |

#### 2.27.3. 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

#### 2.27.4. 参考

[axclrtEngineGetIOInfo](#axclrtEngineGetIOInfo) | axclrtEngineGetIOInfoByIndex | [axclrtEngineGetNumOutputs](#axclrtEngineGetNumOutputs)

<br>

<a id="axclrtEngineGetOutputDataType"></a>

### 2.28. axclrtEngineGetOutputDataType

获取输出数据类型。

#### 2.28.1. 函数

```c
AXCL_EXPORT axclError axclrtEngineGetOutputDataType(axclrtEngineIOInfo ioInfo, uint32_t index, axclrtEngineDataType *type);
```

#### 2.28.2. 参数

| 名称   | 方向 | 说明                    |
| ------ | ---- | ----------------------- |
| ioInfo | in   | axclrtEngineIOInfo 指针 |
| index  | in   | 输出 io 索引            |
| type   | out  | 输出 IO 数据类型        |

#### 2.28.3. 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

#### 2.28.4. 参考

[axclrtEngineGetIOInfo](#axclrtEngineGetIOInfo) | axclrtEngineGetIOInfoByIndex | [axclrtEngineGetNumOutputs](#axclrtEngineGetNumOutputs)

<br>

<a id="axclrtEngineGetOutputDims"></a>

### 2.29. axclrtEngineGetOutputDims

获取输出维度信息。

#### 2.29.1. 函数

```c
AXCL_EXPORT axclError axclrtEngineGetOutputDims(axclrtEngineIOInfo ioInfo, uint32_t group, uint32_t index, axclrtEngineIODims *dims);
```

#### 2.29.2. 参数

| 名称   | 方向 | 说明                    |
| ------ | ---- | ----------------------- |
| ioInfo | in   | axclrtEngineIOInfo 指针 |
| group  | in   | 输出形状组索引          |
| index  | in   | 输出张量索引            |
| dims   | out  | 维度信息                |

#### 2.29.3. 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

#### 2.29.4. 参考

[axclrtEngineGetIOInfo](#axclrtEngineGetIOInfo) | axclrtEngineGetIOInfoByIndex | [axclrtEngineGetNumOutputs](#axclrtEngineGetNumOutputs)

#### 2.29.5. 限制

用户在使用完 [axclrtEngineIODims](reference/struct.md#axclrtEngineIODims) 后应进行释放。

<br>

<a id="axclrtEngineGetOutputIndexByName"></a>

### 2.30. axclrtEngineGetOutputIndexByName

Get the output tensor index by name.

#### 2.30.1. Function

```c
AXCL_EXPORT int32_t axclrtEngineGetOutputIndexByName(axclrtEngineIOInfo ioInfo, const char *name);
```

#### 2.30.2. Parameters

| Name   | Direction | Description                |
| ------ | --------- | -------------------------- |
| ioInfo | in        | axclrtEngineIOInfo pointer |
| name   | in        | output tensor name         |

#### 2.30.3. Returns

- `output`: tensor index
- `-1`: if not found

<br>

<a id="axclrtEngineGetOutputNameByIndex"></a>

### 2.31. axclrtEngineGetOutputNameByIndex

按索引获取输出名称。

#### 2.31.1. 函数

```c
AXCL_EXPORT const char* axclrtEngineGetOutputNameByIndex(axclrtEngineIOInfo ioInfo, uint32_t index);
```

#### 2.31.2. Parameters

| Name   | Direction | Description                |
| ------ | --------- | -------------------------- |
| ioInfo | in        | axclrtEngineIOInfo pointer |
| index  | in        | output io index            |

#### 2.31.3. Returns

- `output`: tensor name,the same life cycle with ioInfo
- `NULL`: if not found

#### 2.31.4. 参考

[axclrtEngineGetIOInfo](#axclrtEngineGetIOInfo) | axclrtEngineGetIOInfoByIndex | [axclrtEngineGetNumOutputs](#axclrtEngineGetNumOutputs)

<br>

<a id="axclrtEngineGetOutputSizeByIndex"></a>

### 2.32. axclrtEngineGetOutputSizeByIndex

Get the size of the specified output from axclrtEngineIOInfo.

#### 2.32.1. Function

```c
AXCL_EXPORT uint64_t axclrtEngineGetOutputSizeByIndex(axclrtEngineIOInfo ioInfo, uint32_t group, uint32_t index);
```

#### 2.32.2. Parameters

| Name   | Direction | Description                                                                     |
| ------ | --------- | ------------------------------------------------------------------------------- |
| ioInfo | in        | axclrtEngineIOInfo pointer                                                      |
| group  | in        | output shape group index                                                        |
| index  | in        | the size of the number of outputs to be obtained, the index value starts from 0 |

#### 2.32.3. Returns

- `Specify`: the size of the output

<br>

<a id="axclrtEngineGetShapeGroupsCount"></a>

### 2.33. axclrtEngineGetShapeGroupsCount

Get the shape group count.

#### 2.33.1. Function

```c
AXCL_EXPORT axclError axclrtEngineGetShapeGroupsCount(axclrtEngineIOInfo ioInfo, int32_t *count);
```

#### 2.33.2. Parameters

| Name   | Direction | Description                |
| ------ | --------- | -------------------------- |
| ioInfo | in        | axclrtEngineIOInfo pointer |
| count  | out       | Shape groups count         |

#### 2.33.3. Returns

- `AXCL_SUCC`: success.
- `others`: failure.

#### 2.33.4. 参考

[axclrtEngineGetIOInfo](#axclrtEngineGetIOInfo) | axclrtEngineGetIOInfoByIndex

#### 2.33.5. Restriction

RestrictionPulsar2 toolchain can specify several shapes in model conversion a time. There is only one shape in a normal model, and so it's no needs to call this function for normally converted model.

<br>

<a id="axclrtEngineGetUsage"></a>

### 2.34. axclrtEngineGetUsage

获取内存占用。

#### 2.34.1. 函数

```c
AXCL_EXPORT axclError axclrtEngineGetUsage(const char *modelPath, int64_t *sysSize, int64_t *cmmSize);
```

#### 2.34.2. 参数

| 名称      | 方向 | 说明                             |
| --------- | ---- | -------------------------------- |
| modelPath | in   | 用于获取内存信息的模型路径       |
| sysSize   | out  | 模型执行时所需的系统工作内存大小 |
| cmmSize   | out  | 模型执行时所需的 cmm 内存大小    |

#### 2.34.3. 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

<br>

<a id="axclrtEngineGetUsageFromMem"></a>

### 2.35. axclrtEngineGetUsageFromMem

获取内存占用。

#### 2.35.1. 函数

```c
AXCL_EXPORT axclError axclrtEngineGetUsageFromMem(const void *model, uint64_t modelSize, int64_t *sysSize, int64_t *cmmSize);
```

#### 2.35.2. 参数

| 名称      | 方向 | 说明                             |
| --------- | ---- | -------------------------------- |
| model     | in   | 用户管理的模型内存               |
| modelSize | in   | 模型数据大小                     |
| sysSize   | out  | 模型执行时所需的系统工作内存大小 |
| cmmSize   | out  | 模型执行时所需的 cmm 内存大小    |

#### 2.35.3. 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

#### 2.35.4. 限制

该模型内存是设备内存，需要用户自行申请和释放。

<br>

<a id="axclrtEngineGetUsageFromModelId"></a>

### 2.36. axclrtEngineGetUsageFromModelId

获取内存占用。

#### 2.36.1. 函数

```c
AXCL_EXPORT axclError axclrtEngineGetUsageFromModelId(uint64_t modelId, int64_t *sysSize, int64_t *cmmSize);
```

#### 2.36.2. 参数

| 名称    | 方向 | 说明                             |
| ------- | ---- | -------------------------------- |
| modelId | in   | 模型 ID                          |
| sysSize | out  | 模型执行时所需的系统工作内存大小 |
| cmmSize | out  | 模型执行时所需的 cmm 内存大小    |

#### 2.36.3. 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

<br>

<a id="axclrtEngineGetVNpuKind"></a>

### 2.37. axclrtEngineGetVNpuKind

获取视觉 NPU 类型。

#### 2.37.1. 函数

```c
AXCL_EXPORT axclError axclrtEngineGetVNpuKind(axclrtEngineVNpuKind *npuKind);
```

#### 2.37.2. 参数

| 名称    | 方向 | 说明      |
| ------- | ---- | --------- |
| npuKind | out  | VNPU 类型 |

#### 2.37.3. 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

<br>

<a id="axclrtEngineInit"></a>

### 2.38. axclrtEngineInit

初始化运行时引擎。

#### 2.38.1. 函数

```c
AXCL_EXPORT axclError axclrtEngineInit(axclrtEngineVNpuKind npuKind);
```

#### 2.38.2. 参数

| 名称    | 方向 | 说明                                 |
| ------- | ---- | ------------------------------------ |
| npuKind | in   | 使用指定的 VNPU 类型初始化运行时引擎 |

#### 2.38.3. 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

#### 2.38.4. 限制

用户在使用后需要调用 axclrtEngineFinalize 结束运行时引擎。

<br>

<a id="axclrtEngineLoadFromFile"></a>

### 2.39. axclrtEngineLoadFromFile

从文件加载离线模型数据，并在内部管理内存。

#### 2.39.1. 函数

```c
AXCL_EXPORT axclError axclrtEngineLoadFromFile(const char *modelPath, uint64_t *modelId);
```

#### 2.39.2. 参数

| 名称      | 方向 | 说明                            |
| --------- | ---- | ------------------------------- |
| modelPath | in   | 离线模型文件的存储路径          |
| modelId   | out  | 系统完成模型加载后生成的模型 ID |

#### 2.39.3. 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

<br>

<a id="axclrtEngineLoadFromMem"></a>

### 2.40. axclrtEngineLoadFromMem

从内存加载离线模型数据，并在内部管理运行时内存。

#### 2.40.1. 函数

```c
AXCL_EXPORT axclError axclrtEngineLoadFromMem(const void *model, uint64_t modelSize, uint64_t *modelId);
```

#### 2.40.2. 参数

| 名称      | 方向 | 说明                            |
| --------- | ---- | ------------------------------- |
| model     | in   | 存储在内存中的模型数据          |
| modelSize | in   | 模型数据大小                    |
| modelId   | out  | 系统完成模型加载后生成的模型 ID |

#### 2.40.3. 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

#### 2.40.4. 限制

该模型内存是设备内存，需要用户自行申请和释放。

<br>

<a id="axclrtEngineSetAffinity"></a>

### 2.41. axclrtEngineSetAffinity

设置模型亲和性。

#### 2.41.1. 函数

```c
AXCL_EXPORT axclError axclrtEngineSetAffinity(uint64_t modelId, axclrtEngineSet set);
```

#### 2.41.2. 参数

| 名称    | 方向 | 说明       |
| ------- | ---- | ---------- |
| modelId | in   | 模型 ID    |
| set     | in   | 亲和性集合 |

#### 2.41.3. 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

#### 2.41.4. 参考

[axclrtEngineCreateContext](#axclrtEngineCreateContext) | [axclrtEngineGetAffinity](#axclrtEngineGetAffinity)

#### 2.41.5. 限制

不允许为 0，且 set 中被掩码的位不能超出亲和性范围。

<br>

<a id="axclrtEngineSetContextAffinity"></a>

### 2.42. axclrtEngineSetContextAffinity

设置上下文亲和性，当前尚不支持。

#### 2.42.1. 函数

```c
AXCL_EXPORT axclError axclrtEngineSetContextAffinity(uint64_t modelId, uint64_t contextId, axclrtEngineSet set);
```

#### 2.42.2. 参数

| 名称      | 方向 | 说明       |
| --------- | ---- | ---------- |
| modelId   | in   | 模型 ID    |
| contextId | in   | 上下文 ID  |
| set       | in   | 亲和性集合 |

#### 2.42.3. 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

#### 2.42.4. 参考

[axclrtEngineCreateContext](#axclrtEngineCreateContext) | [axclrtEngineSetContextAffinity](#axclrtEngineSetContextAffinity)

<br>

<a id="axclrtEngineSetDynamicBatchSize"></a>

### 2.43. axclrtEngineSetDynamicBatchSize

设置模型推理期间使用的动态 batch 大小。

#### 2.43.1. 函数

```c
AXCL_EXPORT axclError axclrtEngineSetDynamicBatchSize(axclrtEngineIO io, uint32_t batchSize);
```

#### 2.43.2. 参数

| 名称      | 方向 | 说明                   |
| --------- | ---- | ---------------------- |
| io        | in   | 模型推理 IO            |
| batchSize | in   | 模型一次处理的图像数量 |

#### 2.43.3. 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

#### 2.43.4. 参考

[axclrtEngineCreateContext](#axclrtEngineCreateContext) |

<br>

<a id="axclrtEngineSetInputBufferByIndex"></a>

### 2.44. axclrtEngineSetInputBufferByIndex

按 I/O 索引设置输入数据缓冲区。

#### 2.44.1. 函数

```c
AXCL_EXPORT axclError axclrtEngineSetInputBufferByIndex(axclrtEngineIO io, uint32_t index, const void *dataBuffer, uint64_t size);
```

#### 2.44.2. 参数

| 名称       | 方向 | 说明                                   |
| ---------- | ---- | -------------------------------------- |
| io         | in   | 要设置数据缓冲区的 axclrtEngineIO 地址 |
| index      | in   | 输入张量索引                           |
| dataBuffer | in   | 要添加的数据缓冲区地址                 |
| size       | in   | 数据缓冲区大小                         |

#### 2.44.3. Returns

- `AXCL_SUCC`: success.
- `others`: failure.

#### 2.44.4. 限制

该数据缓冲区是设备内存，需要用户自行申请和释放。

<br>

<a id="axclrtEngineSetInputBufferByName"></a>

### 2.45. axclrtEngineSetInputBufferByName

Set the input data buffer by I/O name.

#### 2.45.1. Function

```c
AXCL_EXPORT axclError axclrtEngineSetInputBufferByName(axclrtEngineIO io, const char *name, const void *dataBuffer, uint64_t size);
```

#### 2.45.2. Parameters

| Name       | Direction | Description                                     |
| ---------- | --------- | ----------------------------------------------- |
| io         | in        | axclrtEngineIO address of data buffer to be set |
| name       | in        | Input tensor name                               |
| dataBuffer | in        | data buffer address to be added                 |
| size       | in        | data buffer size                                |

#### 2.45.3. Returns

- `AXCL_SUCC`: success.
- `others`: failure.

#### 2.45.4. 限制

该数据缓冲区是设备内存，需要用户自行申请和释放。

<br>

<a id="axclrtEngineSetOutputBufferByIndex"></a>

### 2.46. axclrtEngineSetOutputBufferByIndex

Set the output data buffer by I/O index.

#### 2.46.1. Function

```c
AXCL_EXPORT axclError axclrtEngineSetOutputBufferByIndex(axclrtEngineIO io, uint32_t index, const void *dataBuffer, uint64_t size);
```

#### 2.46.2. Parameters

| Name       | Direction | Description                                     |
| ---------- | --------- | ----------------------------------------------- |
| io         | in        | axclrtEngineIO address of data buffer to be set |
| index      | in        | Output tensor index                             |
| dataBuffer | in        | data buffer address to be added                 |
| size       | in        | data buffer size                                |

#### 2.46.3. Returns

- `AXCL_SUCC`: success.
- `others`: failure.

#### 2.46.4. 限制

该数据缓冲区是设备内存，需要用户自行申请和释放。

<br>

<a id="axclrtEngineSetOutputBufferByName"></a>

### 2.47. axclrtEngineSetOutputBufferByName

Set the output data buffer by I/O name.

#### 2.47.1. Function

```c
AXCL_EXPORT axclError axclrtEngineSetOutputBufferByName(axclrtEngineIO io, const char *name, const void *dataBuffer, uint64_t size);
```

#### 2.47.2. Parameters

| Name       | Direction | Description                                     |
| ---------- | --------- | ----------------------------------------------- |
| io         | in        | axclrtEngineIO address of data buffer to be set |
| name       | in        | Output tensor name                              |
| dataBuffer | in        | data buffer address to be added                 |
| size       | in        | data buffer size                                |

#### 2.47.3. Returns

- `AXCL_SUCC`: success.
- `others`: failure.

#### 2.47.4. 限制

该数据缓冲区是设备内存，需要用户自行申请和释放。

<br>

<a id="axclrtEngineUnload"></a>

### 2.48. axclrtEngineUnload

Unload a model by model ID.

#### 2.48.1. Function

```c
AXCL_EXPORT axclError axclrtEngineUnload(uint64_t modelId);
```

#### 2.48.2. Parameters

| Name    | Direction | Description             |
| ------- | --------- | ----------------------- |
| modelId | in        | Model id to be unloaded |

#### 2.48.3. Returns

- `AXCL_SUCC`: success.
- `others`: failure.
