# Engine API

## Index

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

Create a model context.

#### Function

```c
AXCL_EXPORT axclError axclrtEngineCreateContext(uint64_t modelId, uint64_t *contextId);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| modelId | in | Model id |
| contextId | out | The created context id |

#### Returns

- `AXCL_SUCC`: success.
- `others`: failure.

#### Remark

[axclrtEngineLoadFromFile](#axclrtEngineLoadFromFile) | [axclrtEngineLoadFromMem](#axclrtEngineLoadFromMem)

#### Restriction

One model id could create several running context, and each of them running only with its own settings and memory spaces.

<br>

<a id="axclrtEngineCreateIO"></a>

### axclrtEngineCreateIO

Create axclrtEngineIO data.

#### Function

```c
AXCL_EXPORT axclError axclrtEngineCreateIO(axclrtEngineIOInfo ioInfo, axclrtEngineIO *io);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| ioInfo | in | axclrtEngineIOInfo pointer |
| io | out | The created axclrtEngineIO pointer |

#### Returns

- `AXCL_SUCC`: success.
- `others`: failure.

#### Restriction

Users should call axclrtEngineDestroyIO to release the axclrtEngineIO after using it.

<br>

<a id="axclrtEngineDestroyIO"></a>

### axclrtEngineDestroyIO

Destroy axclrtEngineIO data.

#### Function

```c
AXCL_EXPORT axclError axclrtEngineDestroyIO(axclrtEngineIO io);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| io | in | Pointer to axclrtEngineIO to be destroyed |

#### Returns

- `AXCL_SUCC`: success.
- `others`: failure.

<br>

<a id="axclrtEngineDestroyIOInfo"></a>

### axclrtEngineDestroyIOInfo

Destroy axclrtEngineIOInfo data.

#### Function

```c
AXCL_EXPORT axclError axclrtEngineDestroyIOInfo(axclrtEngineIOInfo ioInfo);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| ioInfo | in | axclrtEngineIOInfo pointer |

#### Returns

- `AXCL_SUCC`: success.
- `others`: failure.

<br>

<a id="axclrtEngineExecute"></a>

### axclrtEngineExecute

Execute model inference synchronously.

#### Function

```c
AXCL_EXPORT axclError axclrtEngineExecute(uint64_t modelId, uint64_t contextId, uint32_t group, axclrtEngineIO io);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| modelId | in | Model id |
| contextId | in | Model inference context |
| group | in | Model shape group index |
| io | in | Model inference IOs |

#### Returns

- `AXCL_SUCC`: success.
- `others`: failure.

<br>

<a id="axclrtEngineExecuteAsync"></a>

### axclrtEngineExecuteAsync

Execute model inference asynchronously.

#### Function

```c
AXCL_EXPORT axclError axclrtEngineExecuteAsync(uint64_t modelId, uint64_t contextId, uint32_t group, axclrtEngineIO io, axclrtStream stream);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| modelId | in | Model id |
| contextId | in | Model inference context |
| group | in | Model shape group index |
| io | in | Model inference IOs |
| stream | in | stream |

#### Returns

- `AXCL_SUCC`: success.
- `others`: failure.

#### Remark

axclLoadFromFile | axclLoadFromMem | axclLoadFromFileWithMem | axclLoadFromMemWithMem

<br>

<a id="axclrtEngineFinalize"></a>

### axclrtEngineFinalize

Finalize the runtime engine.

#### Function

```c
AXCL_EXPORT axclError axclrtEngineFinalize();
```

#### Parameters

N/A

#### Returns

- `AXCL_SUCC`: success.
- `others`: failure.

#### Restriction

User needs to call axclrtEngineInit to initialize the runtime

<br>

<a id="axclrtEngineGetAffinity"></a>

### axclrtEngineGetAffinity

Get model affinity.

#### Function

```c
AXCL_EXPORT axclError axclrtEngineGetAffinity(uint64_t modelId, axclrtEngineSet *set);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| modelId | in | Model id |
| set | out | The affinity set |

#### Returns

- `AXCL_SUCC`: success.
- `others`: failure.

#### Remark

[axclrtEngineCreateContext](#axclrtEngineCreateContext) | [axclrtEngineSetAffinity](#axclrtEngineSetAffinity)

<br>

<a id="axclrtEngineGetContextAffinity"></a>

### axclrtEngineGetContextAffinity

Get context affinity, not supported yet.

#### Function

```c
AXCL_EXPORT axclError axclrtEngineGetContextAffinity(uint64_t modelId, uint64_t contextId, axclrtEngineSet *set);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| modelId | in | Model id |
| contextId | in | Context id |
| set | out | The affinity set |

#### Returns

- `AXCL_SUCC`: success.
- `others`: failure.

#### Remark

[axclrtEngineCreateContext](#axclrtEngineCreateContext) | [axclrtEngineSetContextAffinity](#axclrtEngineSetContextAffinity)

<br>

<a id="axclrtEngineGetIOInfo"></a>

### axclrtEngineGetIOInfo

Get I/O information.

#### Function

```c
AXCL_EXPORT axclError axclrtEngineGetIOInfo(uint64_t modelId, axclrtEngineIOInfo *ioInfo);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| modelId | in | Model id |
| ioInfo | out | axclrtEngineIOInfo pointer |

#### Returns

- `AXCL_SUCC`: success.
- `others`: failure.

#### Remark

[axclrtEngineDestroyIOInfo](#axclrtEngineDestroyIOInfo) | axclrtEngineGetIOInfoByIndex

#### Restriction

Users should call axclrtEngineDestroyIOInfo to release the axclrtEngineIOInfo after using it.

<br>

<a id="axclrtEngineGetInputBufferByIndex"></a>

### axclrtEngineGetInputBufferByIndex

Get the input data buffer by I/O index.

#### Function

```c
AXCL_EXPORT axclError axclrtEngineGetInputBufferByIndex(axclrtEngineIO io, uint32_t index, void **dataBuffer, uint64_t *size);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| io | in | axclrtEngineIO address of data buffer to be got |
| index | in | Input tensor index |
| dataBuffer | out | data buffer address |
| size | out | data buffer size |

#### Returns

- `AXCL_SUCC`: success.
- `others`: failure.

#### Restriction

The data buffer is Device memory, and requires user application and release.

<br>

<a id="axclrtEngineGetInputBufferByName"></a>

### axclrtEngineGetInputBufferByName

Get the input data buffer by I/O name.

#### Function

```c
AXCL_EXPORT axclError axclrtEngineGetInputBufferByName(axclrtEngineIO io, const char *name, void **dataBuffer, uint64_t *size);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| io | in | axclrtEngineIO address of data buffer to be got |
| name | in | Input tensor name |
| dataBuffer | out | data buffer address |
| size | out | data buffer size |

#### Returns

- `AXCL_SUCC`: success.
- `others`: failure.

#### Restriction

The data buffer is Device memory, and requires user application and release.

<br>

<a id="axclrtEngineGetInputDataLayout"></a>

### axclrtEngineGetInputDataLayout

Get the input data layout.

#### Function

```c
AXCL_EXPORT axclError axclrtEngineGetInputDataLayout(axclrtEngineIOInfo ioInfo, uint32_t index, axclrtEngineDataLayout *layout);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| ioInfo | in | axclrtEngineIOInfo pointer |
| index | in | input io index |
| layout | out | input IO data layout |

#### Returns

- `AXCL_SUCC`: success.
- `others`: failure.

#### Remark

[axclrtEngineGetIOInfo](#axclrtEngineGetIOInfo) | axclrtEngineGetIOInfoByIndex | [axclrtEngineGetNumInputs](#axclrtEngineGetNumInputs)

<br>

<a id="axclrtEngineGetInputDataType"></a>

### axclrtEngineGetInputDataType

Get the input data type.

#### Function

```c
AXCL_EXPORT axclError axclrtEngineGetInputDataType(axclrtEngineIOInfo ioInfo, uint32_t index, axclrtEngineDataType *type);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| ioInfo | in | axclrtEngineIOInfo pointer |
| index | in | input io index |
| type | out | input IO data type |

#### Returns

- `AXCL_SUCC`: success.
- `others`: failure.

#### Remark

[axclrtEngineGetIOInfo](#axclrtEngineGetIOInfo) | axclrtEngineGetIOInfoByIndex | [axclrtEngineGetNumInputs](#axclrtEngineGetNumInputs)

<br>

<a id="axclrtEngineGetInputDims"></a>

### axclrtEngineGetInputDims

Get input dimension information.

#### Function

```c
AXCL_EXPORT axclError axclrtEngineGetInputDims(axclrtEngineIOInfo ioInfo, uint32_t group, uint32_t index, axclrtEngineIODims *dims);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| ioInfo | in | axclrtEngineIOInfo pointer |
| group | in | input shape group index |
| index | in | input tensor index |
| dims | out | dims info |

#### Returns

- `AXCL_SUCC`: success.
- `others`: failure.

#### Remark

[axclrtEngineGetIOInfo](#axclrtEngineGetIOInfo) | axclrtEngineGetIOInfoByIndex | [axclrtEngineGetNumInputs](#axclrtEngineGetNumInputs)

#### Restriction

Users should release the [axclrtEngineIODims](reference/struct.md#axclrtEngineIODims) after using it.

<br>

<a id="axclrtEngineGetInputIndexByName"></a>

### axclrtEngineGetInputIndexByName

Get the input tensor index by name.

#### Function

```c
AXCL_EXPORT int32_t axclrtEngineGetInputIndexByName(axclrtEngineIOInfo ioInfo, const char *name);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| ioInfo | in | axclrtEngineIOInfo pointer |
| name | in | input tensor name |

#### Returns

- `input`: tensor index
- `-1`: if not found

<br>

<a id="axclrtEngineGetInputNameByIndex"></a>

### axclrtEngineGetInputNameByIndex

Get the input name.

#### Function

```c
AXCL_EXPORT const char* axclrtEngineGetInputNameByIndex(axclrtEngineIOInfo ioInfo, uint32_t index);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| ioInfo | in | axclrtEngineIOInfo pointer |
| index | in | input io index |

#### Returns

- `input`: tensor name,the same life cycle with ioInfo
- `NULL`: if not found

#### Remark

[axclrtEngineGetIOInfo](#axclrtEngineGetIOInfo) | axclrtEngineGetIOInfoByIndex | [axclrtEngineGetNumInputs](#axclrtEngineGetNumInputs)

<br>

<a id="axclrtEngineGetInputSizeByIndex"></a>

### axclrtEngineGetInputSizeByIndex

Get the size of the specified input from axclrtEngineIOInfo.

#### Function

```c
AXCL_EXPORT uint64_t axclrtEngineGetInputSizeByIndex(axclrtEngineIOInfo ioInfo, uint32_t group, uint32_t index);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| ioInfo | in | axclrtEngineIOInfo pointer |
| group | in | input shape group index |
| index | in | the size of the number of inputs to be obtained, the index value starts from 0 |

#### Returns

- `Specify`: the size of the input

<br>

<a id="axclrtEngineGetModelCompilerVersion"></a>

### axclrtEngineGetModelCompilerVersion

Get the model build toolchain version.

#### Function

```c
AXCL_EXPORT const char* axclrtEngineGetModelCompilerVersion(uint64_t modelId);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| modelId | in | Model id |

#### Returns

- `AXCL_SUCC`: success.
- `others`: failure.

<br>

<a id="axclrtEngineGetModelType"></a>

### axclrtEngineGetModelType

Get model type.

#### Function

```c
AXCL_EXPORT axclError axclrtEngineGetModelType(const char *modelPath, axclrtEngineModelKind *modelType);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| modelPath | in | Model path to get model type |
| modelType | out | Model type |

#### Returns

- `AXCL_SUCC`: success.
- `others`: failure.

<br>

<a id="axclrtEngineGetModelTypeFromMem"></a>

### axclrtEngineGetModelTypeFromMem

Get model type.

#### Function

```c
AXCL_EXPORT axclError axclrtEngineGetModelTypeFromMem(const void *model, uint64_t modelSize, axclrtEngineModelKind *modelType);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| model | in | Model memory which user manages |
| modelSize | in | Model data size |
| modelType | out | Model type |

#### Returns

- `AXCL_SUCC`: success.
- `others`: failure.

#### Restriction

The model memory is Device memory, and requires user application and release.

<br>

<a id="axclrtEngineGetModelTypeFromModelId"></a>

### axclrtEngineGetModelTypeFromModelId

Get model type.

#### Function

```c
AXCL_EXPORT axclError axclrtEngineGetModelTypeFromModelId(uint64_t modelId, axclrtEngineModelKind *modelType);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| modelId | in | Model id |
| modelType | out | Model type |

#### Returns

- `AXCL_SUCC`: success.
- `others`: failure.

<br>

<a id="axclrtEngineGetNumInputs"></a>

### axclrtEngineGetNumInputs

Get the number of model inputs from axclrtEngineIOInfo.

#### Function

```c
AXCL_EXPORT uint32_t axclrtEngineGetNumInputs(axclrtEngineIOInfo ioInfo);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| ioInfo | in | axclrtEngineIOInfo pointer |

#### Returns

- `input`: size with axclrtEngineIOInfo

<br>

<a id="axclrtEngineGetNumOutputs"></a>

### axclrtEngineGetNumOutputs

Get the number of model outputs from axclrtEngineIOInfo.

#### Function

```c
AXCL_EXPORT uint32_t axclrtEngineGetNumOutputs(axclrtEngineIOInfo ioInfo);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| ioInfo | in | axclrtEngineIOInfo pointer |

#### Returns

- `output`: size with axclrtEngineIOInfo

<br>

<a id="axclrtEngineGetOutputBufferByIndex"></a>

### axclrtEngineGetOutputBufferByIndex

Get the output data buffer by I/O index.

#### Function

```c
AXCL_EXPORT axclError axclrtEngineGetOutputBufferByIndex(axclrtEngineIO io, uint32_t index, void **dataBuffer, uint64_t *size);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| io | in | axclrtEngineIO address of data buffer to be got |
| index | in | Output tensor index |
| dataBuffer | out | data buffer address |
| size | out | data buffer size |

#### Returns

- `AXCL_SUCC`: success.
- `others`: failure.

#### Restriction

The data buffer is Device memory, and requires user application and release.

<br>

<a id="axclrtEngineGetOutputBufferByName"></a>

### axclrtEngineGetOutputBufferByName

Get the output data buffer by I/O name.

#### Function

```c
AXCL_EXPORT axclError axclrtEngineGetOutputBufferByName(axclrtEngineIO io, const char *name, void **dataBuffer, uint64_t *size);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| io | in | axclrtEngineIO address of data buffer to be got |
| name | in | Output tensor name |
| dataBuffer | out | data buffer address |
| size | out | data buffer size |

#### Returns

- `AXCL_SUCC`: success.
- `others`: failure.

#### Restriction

The data buffer is Device memory, and requires user application and release.

<br>

<a id="axclrtEngineGetOutputDataLayout"></a>

### axclrtEngineGetOutputDataLayout

Get the output data layout.

#### Function

```c
AXCL_EXPORT axclError axclrtEngineGetOutputDataLayout(axclrtEngineIOInfo ioInfo, uint32_t index, axclrtEngineDataLayout *layout);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| ioInfo | in | axclrtEngineIOInfo pointer |
| index | in | output io index |
| layout | out | output IO data layout |

#### Returns

- `AXCL_SUCC`: success.
- `others`: failure.

#### Remark

[axclrtEngineGetIOInfo](#axclrtEngineGetIOInfo) | axclrtEngineGetIOInfoByIndex | [axclrtEngineGetNumOutputs](#axclrtEngineGetNumOutputs)

<br>

<a id="axclrtEngineGetOutputDataType"></a>

### axclrtEngineGetOutputDataType

Get the output data type.

#### Function

```c
AXCL_EXPORT axclError axclrtEngineGetOutputDataType(axclrtEngineIOInfo ioInfo, uint32_t index, axclrtEngineDataType *type);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| ioInfo | in | axclrtEngineIOInfo pointer |
| index | in | output io index |
| type | out | output IO data type |

#### Returns

- `AXCL_SUCC`: success.
- `others`: failure.

#### Remark

[axclrtEngineGetIOInfo](#axclrtEngineGetIOInfo) | axclrtEngineGetIOInfoByIndex | [axclrtEngineGetNumOutputs](#axclrtEngineGetNumOutputs)

<br>

<a id="axclrtEngineGetOutputDims"></a>

### axclrtEngineGetOutputDims

Get output dimension information.

#### Function

```c
AXCL_EXPORT axclError axclrtEngineGetOutputDims(axclrtEngineIOInfo ioInfo, uint32_t group, uint32_t index, axclrtEngineIODims *dims);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| ioInfo | in | axclrtEngineIOInfo pointer |
| group | in | output shape group index |
| index | in | output tensor index |
| dims | out | dims info |

#### Returns

- `AXCL_SUCC`: success.
- `others`: failure.

#### Remark

[axclrtEngineGetIOInfo](#axclrtEngineGetIOInfo) | axclrtEngineGetIOInfoByIndex | [axclrtEngineGetNumOutputs](#axclrtEngineGetNumOutputs)

#### Restriction

Users should release the [axclrtEngineIODims](reference/struct.md#axclrtEngineIODims) after using it.

<br>

<a id="axclrtEngineGetOutputIndexByName"></a>

### axclrtEngineGetOutputIndexByName

Get the output tensor index by name.

#### Function

```c
AXCL_EXPORT int32_t axclrtEngineGetOutputIndexByName(axclrtEngineIOInfo ioInfo, const char *name);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| ioInfo | in | axclrtEngineIOInfo pointer |
| name | in | output tensor name |

#### Returns

- `output`: tensor index
- `-1`: if not found

<br>

<a id="axclrtEngineGetOutputNameByIndex"></a>

### axclrtEngineGetOutputNameByIndex

Get the output name.

#### Function

```c
AXCL_EXPORT const char* axclrtEngineGetOutputNameByIndex(axclrtEngineIOInfo ioInfo, uint32_t index);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| ioInfo | in | axclrtEngineIOInfo pointer |
| index | in | output io index |

#### Returns

- `output`: tensor name,the same life cycle with ioInfo
- `NULL`: if not found

#### Remark

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

| Name | Direction | Description |
|---|---|---|
| ioInfo | in | axclrtEngineIOInfo pointer |
| group | in | output shape group index |
| index | in | the size of the number of outputs to be obtained, the index value starts from 0 |

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

| Name | Direction | Description |
|---|---|---|
| ioInfo | in | axclrtEngineIOInfo pointer |
| count | out | Shape groups count |

#### Returns

- `AXCL_SUCC`: success.
- `others`: failure.

#### Remark

[axclrtEngineGetIOInfo](#axclrtEngineGetIOInfo) | axclrtEngineGetIOInfoByIndex

#### Restriction

Pulsar2 toolchain can specify several shapes in model conversion a time. There is only one shape in a normal model, and so it's no needs to call this function for normally converted model.

<br>

<a id="axclrtEngineGetUsage"></a>

### axclrtEngineGetUsage

Get memory usage.

#### Function

```c
AXCL_EXPORT axclError axclrtEngineGetUsage(const char *modelPath, int64_t *sysSize, int64_t *cmmSize);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| modelPath | in | Model path to get memory information |
| sysSize | out | The amount of working system memory for model executed |
| cmmSize | out | The amount of cmm memory for model executed |

#### Returns

- `AXCL_SUCC`: success.
- `others`: failure.

<br>

<a id="axclrtEngineGetUsageFromMem"></a>

### axclrtEngineGetUsageFromMem

Get memory usage.

#### Function

```c
AXCL_EXPORT axclError axclrtEngineGetUsageFromMem(const void *model, uint64_t modelSize, int64_t *sysSize, int64_t *cmmSize);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| model | in | Model memory which user manages |
| modelSize | in | Model data size |
| sysSize | out | The amount of working system memory for model executed |
| cmmSize | out | The amount of cmm memory for model executed |

#### Returns

- `AXCL_SUCC`: success.
- `others`: failure.

#### Restriction

The model memory is Device memory, and requires user application and release.

<br>

<a id="axclrtEngineGetUsageFromModelId"></a>

### axclrtEngineGetUsageFromModelId

Get memory usage.

#### Function

```c
AXCL_EXPORT axclError axclrtEngineGetUsageFromModelId(uint64_t modelId, int64_t *sysSize, int64_t *cmmSize);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| modelId | in | Model id |
| sysSize | out | The amount of working system memory for model executed |
| cmmSize | out | The amount of cmm memory for model executed |

#### Returns

- `AXCL_SUCC`: success.
- `others`: failure.

<br>

<a id="axclrtEngineGetVNpuKind"></a>

### axclrtEngineGetVNpuKind

Get the visual NPU kind.

#### Function

```c
AXCL_EXPORT axclError axclrtEngineGetVNpuKind(axclrtEngineVNpuKind *npuKind);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| npuKind | out | VNPU type |

#### Returns

- `AXCL_SUCC`: success.
- `others`: failure.

<br>

<a id="axclrtEngineInit"></a>

### axclrtEngineInit

Initialize the runtime engine.

#### Function

```c
AXCL_EXPORT axclError axclrtEngineInit(axclrtEngineVNpuKind npuKind);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| npuKind | in | Initialize the runtime engine with the specified VNPU type |

#### Returns

- `AXCL_SUCC`: success.
- `others`: failure.

#### Restriction

User needs to call axclrtEngineFinalize to finalize the runtime engine after using it

<br>

<a id="axclrtEngineLoadFromFile"></a>

### axclrtEngineLoadFromFile

Load offline model data from files and manage memory internally.

#### Function

```c
AXCL_EXPORT axclError axclrtEngineLoadFromFile(const char *modelPath, uint64_t *modelId);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| modelPath | in | Storage path for offline model files |
| modelId | out | Model ID generated after the system finishes loading the model |

#### Returns

- `AXCL_SUCC`: success.
- `others`: failure.

<br>

<a id="axclrtEngineLoadFromMem"></a>

### axclrtEngineLoadFromMem

Load offline model data from memory and manage runtime memory internally.

#### Function

```c
AXCL_EXPORT axclError axclrtEngineLoadFromMem(const void *model, uint64_t modelSize, uint64_t *modelId);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| model | in | Model data stored in memory |
| modelSize | in | Model data size |
| modelId | out | Model ID generated after the system finishes loading the model |

#### Returns

- `AXCL_SUCC`: success.
- `others`: failure.

#### Restriction

The model memory is device memory, and requires user allocation and release

<br>

<a id="axclrtEngineSetAffinity"></a>

### axclrtEngineSetAffinity

Set model affinity.

#### Function

```c
AXCL_EXPORT axclError axclrtEngineSetAffinity(uint64_t modelId, axclrtEngineSet set);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| modelId | in | Model id |
| set | in | The affinity set |

#### Returns

- `AXCL_SUCC`: success.
- `others`: failure.

#### Remark

[axclrtEngineCreateContext](#axclrtEngineCreateContext) | [axclrtEngineGetAffinity](#axclrtEngineGetAffinity)

#### Restriction

Zero is not allowed, and the masked bit of the set cannot be out of the affinity range.

<br>

<a id="axclrtEngineSetContextAffinity"></a>

### axclrtEngineSetContextAffinity

Set context affinity, not supported yet.

#### Function

```c
AXCL_EXPORT axclError axclrtEngineSetContextAffinity(uint64_t modelId, uint64_t contextId, axclrtEngineSet set);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| modelId | in | Model id |
| contextId | in | Context id |
| set | in | The affinity set |

#### Returns

- `AXCL_SUCC`: success.
- `others`: failure.

#### Remark

[axclrtEngineCreateContext](#axclrtEngineCreateContext) | [axclrtEngineSetContextAffinity](#axclrtEngineSetContextAffinity)

<br>

<a id="axclrtEngineSetDynamicBatchSize"></a>

### axclrtEngineSetDynamicBatchSize

Set the dynamic batch size used during model inference.

#### Function

```c
AXCL_EXPORT axclError axclrtEngineSetDynamicBatchSize(axclrtEngineIO io, uint32_t batchSize);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| io | in | Model inference IOs |
| batchSize | in | Number of images processed at a time during model |

#### Returns

- `AXCL_SUCC`: success.
- `others`: failure.

#### Remark

[axclrtEngineCreateContext](#axclrtEngineCreateContext) |

<br>

<a id="axclrtEngineSetInputBufferByIndex"></a>

### axclrtEngineSetInputBufferByIndex

Set the input data buffer by I/O index.

#### Function

```c
AXCL_EXPORT axclError axclrtEngineSetInputBufferByIndex(axclrtEngineIO io, uint32_t index, const void *dataBuffer, uint64_t size);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| io | in | axclrtEngineIO address of data buffer to be set |
| index | in | Input tensor index |
| dataBuffer | in | data buffer address to be added |
| size | in | data buffer size |

#### Returns

- `AXCL_SUCC`: success.
- `others`: failure.

#### Restriction

The data buffer is Device memory, and requires user application and release.

<br>

<a id="axclrtEngineSetInputBufferByName"></a>

### axclrtEngineSetInputBufferByName

Set the input data buffer by I/O name.

#### Function

```c
AXCL_EXPORT axclError axclrtEngineSetInputBufferByName(axclrtEngineIO io, const char *name, const void *dataBuffer, uint64_t size);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| io | in | axclrtEngineIO address of data buffer to be set |
| name | in | Input tensor name |
| dataBuffer | in | data buffer address to be added |
| size | in | data buffer size |

#### Returns

- `AXCL_SUCC`: success.
- `others`: failure.

#### Restriction

The data buffer is Device memory, and requires user application and release.

<br>

<a id="axclrtEngineSetOutputBufferByIndex"></a>

### axclrtEngineSetOutputBufferByIndex

Set the output data buffer by I/O index.

#### Function

```c
AXCL_EXPORT axclError axclrtEngineSetOutputBufferByIndex(axclrtEngineIO io, uint32_t index, const void *dataBuffer, uint64_t size);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| io | in | axclrtEngineIO address of data buffer to be set |
| index | in | Output tensor index |
| dataBuffer | in | data buffer address to be added |
| size | in | data buffer size |

#### Returns

- `AXCL_SUCC`: success.
- `others`: failure.

#### Restriction

The data buffer is Device memory, and requires user application and release.

<br>

<a id="axclrtEngineSetOutputBufferByName"></a>

### axclrtEngineSetOutputBufferByName

Set the output data buffer by I/O name.

#### Function

```c
AXCL_EXPORT axclError axclrtEngineSetOutputBufferByName(axclrtEngineIO io, const char *name, const void *dataBuffer, uint64_t size);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| io | in | axclrtEngineIO address of data buffer to be set |
| name | in | Output tensor name |
| dataBuffer | in | data buffer address to be added |
| size | in | data buffer size |

#### Returns

- `AXCL_SUCC`: success.
- `others`: failure.

#### Restriction

The data buffer is Device memory, and requires user application and release.

<br>

<a id="axclrtEngineUnload"></a>

### axclrtEngineUnload

Unload a model by model ID.

#### Function

```c
AXCL_EXPORT axclError axclrtEngineUnload(uint64_t modelId);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| modelId | in | Model id to be unloaded |

#### Returns

- `AXCL_SUCC`: success.
- `others`: failure.
