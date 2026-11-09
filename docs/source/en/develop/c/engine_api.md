# Engine

## Index

- [axclrtEngineCreateContext](#axclrtEngineCreateContext): Create an independent Engine execution Context for a loaded model.
- [axclrtEngineCreateIO](#axclrtEngineCreateIO): Create a Host-side IO binding object from model IO metadata.
- [axclrtEngineDestroyIO](#axclrtEngineDestroyIO): Destroy an IO binding object created by [axclrtEngineCreateIO](#axclrtEngineCreateIO).
- [axclrtEngineDestroyIOInfo](#axclrtEngineDestroyIOInfo): Destroy an IO metadata object created by [axclrtEngineGetIOInfo](#axclrtEngineGetIOInfo).
- [axclrtEngineDestroyIOInfoV2](#axclrtEngineDestroyIOInfoV2): Release metadata returned by axclrtEngineGetIOInfoV2, including all nested arrays and names.
- [axclrtEngineExecute](#axclrtEngineExecute): Execute model inference synchronously on the current runtime Context's default Stream.
- [axclrtEngineExecuteAsync](#axclrtEngineExecuteAsync): Submit a model inference task to a Stream.
- [axclrtEngineExecuteAsyncV2](#axclrtEngineExecuteAsyncV2): Submit a model inference task to a Stream and run it on the Native asynchronous engine.
- [axclrtEngineExecuteV2](#axclrtEngineExecuteV2): Submit complete IO bindings and execute synchronously on the default Stream.
- [axclrtEngineFinalize](#axclrtEngineFinalize): Deinitialize Engine on the device associated with the current Context.
- [axclrtEngineGetAffinity](#axclrtEngineGetAffinity): Get the NPU-core affinity mask of a loaded model.
- [axclrtEngineGetContextAffinity](#axclrtEngineGetContextAffinity): Get affinity for one Engine Context; this operation is currently unsupported.
- [axclrtEngineGetIOInfo](#axclrtEngineGetIOInfo): Create a Host-side metadata object describing a loaded model's inputs and outputs.
- [axclrtEngineGetIOInfoV2](#axclrtEngineGetIOInfoV2): Get complete default-group tensor metadata using the existing Native structure.
- [axclrtEngineGetInputBufferByIndex](#axclrtEngineGetInputBufferByIndex): Get the buffer binding stored for an input index.
- [axclrtEngineGetInputBufferByName](#axclrtEngineGetInputBufferByName): Get the buffer binding stored for an input tensor name.
- [axclrtEngineGetInputDataLayout](#axclrtEngineGetInputDataLayout): Get the data layout of an input tensor.
- [axclrtEngineGetInputDataType](#axclrtEngineGetInputDataType): Get the data type of an input tensor.
- [axclrtEngineGetInputDims](#axclrtEngineGetInputDims): Get the dimensions of an input tensor in the specified shape group.
- [axclrtEngineGetInputIndexByName](#axclrtEngineGetInputIndexByName): Find an input tensor index by name.
- [axclrtEngineGetInputNameByIndex](#axclrtEngineGetInputNameByIndex): Get an input tensor name by index.
- [axclrtEngineGetInputSizeByIndex](#axclrtEngineGetInputSizeByIndex): Get the required buffer size for a model input in the specified shape group.
- [axclrtEngineGetModelCompilerVersion](#axclrtEngineGetModelCompilerVersion): Get the compiler toolchain version stored in a loaded model.
- [axclrtEngineGetModelType](#axclrtEngineGetModelType): Get the core-count classification of a model file.
- [axclrtEngineGetModelTypeFromMem](#axclrtEngineGetModelTypeFromMem): Get the core-count classification of model data stored in Device memory.
- [axclrtEngineGetModelTypeFromModelId](#axclrtEngineGetModelTypeFromModelId): Get the core-count classification of a loaded model.
- [axclrtEngineGetNumInputs](#axclrtEngineGetNumInputs): Get the number of model inputs in an IO metadata object.
- [axclrtEngineGetNumOutputs](#axclrtEngineGetNumOutputs): Get the number of model outputs in an IO metadata object.
- [axclrtEngineGetOutputBufferByIndex](#axclrtEngineGetOutputBufferByIndex): Get the buffer binding stored for an output index.
- [axclrtEngineGetOutputBufferByName](#axclrtEngineGetOutputBufferByName): Get the buffer binding stored for an output tensor name.
- [axclrtEngineGetOutputDataLayout](#axclrtEngineGetOutputDataLayout): Get the data layout of an output tensor.
- [axclrtEngineGetOutputDataType](#axclrtEngineGetOutputDataType): Get the data type of an output tensor.
- [axclrtEngineGetOutputDims](#axclrtEngineGetOutputDims): Get the dimensions of an output tensor in the specified shape group.
- [axclrtEngineGetOutputIndexByName](#axclrtEngineGetOutputIndexByName): Find an output tensor index by name.
- [axclrtEngineGetOutputNameByIndex](#axclrtEngineGetOutputNameByIndex): Get an output tensor name by index.
- [axclrtEngineGetOutputSizeByIndex](#axclrtEngineGetOutputSizeByIndex): Get the required buffer size for a model output in the specified shape group.
- [axclrtEngineGetShapeGroupsCount](#axclrtEngineGetShapeGroupsCount): Get the number of shape groups described by an IO metadata object.
- [axclrtEngineGetUsage](#axclrtEngineGetUsage): Get Engine memory usage for a model file.
- [axclrtEngineGetUsageFromMem](#axclrtEngineGetUsageFromMem): Get Engine memory usage for model data stored in Device memory.
- [axclrtEngineGetUsageFromModelId](#axclrtEngineGetUsageFromModelId): Get Engine memory usage for a loaded model.
- [axclrtEngineGetVNpuKind](#axclrtEngineGetVNpuKind): Get the VNPU mode of Engine on the current Context's device.
- [axclrtEngineInit](#axclrtEngineInit): Initialize Engine on the device associated with the calling thread's current Context.
- [axclrtEngineLoadFromFile](#axclrtEngineLoadFromFile): Load an offline model from a Host file into Engine on the current device.
- [axclrtEngineLoadFromMem](#axclrtEngineLoadFromMem): Load an offline model from Device memory into Engine on the current device.
- [axclrtEngineSetAffinity](#axclrtEngineSetAffinity): Set the NPU-core affinity mask of a loaded model.
- [axclrtEngineSetContextAffinity](#axclrtEngineSetContextAffinity): Set affinity for one Engine Context; this operation is currently unsupported.
- [axclrtEngineSetDynamicBatchSize](#axclrtEngineSetDynamicBatchSize): Store the dynamic batch size used for later execution with an IO binding object.
- [axclrtEngineSetInputBufferByIndex](#axclrtEngineSetInputBufferByIndex): Bind a Device buffer to an input by index.
- [axclrtEngineSetInputBufferByName](#axclrtEngineSetInputBufferByName): Bind a Device buffer to an input by tensor name.
- [axclrtEngineSetOutputBufferByIndex](#axclrtEngineSetOutputBufferByIndex): Bind a Device buffer to an output by index.
- [axclrtEngineSetOutputBufferByName](#axclrtEngineSetOutputBufferByName): Bind a Device buffer to an output by tensor name.
- [axclrtEngineUnload](#axclrtEngineUnload): Unload a model from Engine on the current device.

<br>

## API

<a id="axclrtEngineCreateContext"></a>

### axclrtEngineCreateContext

Create an independent Engine execution Context for a loaded model.

#### Function

```c
AXCL_EXPORT axclError axclrtEngineCreateContext(uint64_t modelId, uint64_t *contextId);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| modelId | in | Loaded model ID. |
| contextId | out | Receives the created Engine Context ID. Must not be NULL. |

#### Returns

- `AXCL_SUCC`: The Engine Context was created successfully.
- `others`: Failure.

#### Note

A model can have multiple Engine Contexts, each with independent execution state. There is no separate destroy function; Engine Context IDs become invalid when the model is unloaded with [axclrtEngineUnload](#axclrtEngineUnload). This API is unrelated to the runtime Context type used by [axclrtCreateContext](context_api.md#axclrtCreateContext).

#### Remark

- [axclrtEngineLoadFromFile](#axclrtEngineLoadFromFile)
- [axclrtEngineLoadFromMem](#axclrtEngineLoadFromMem)

<br>

<a id="axclrtEngineCreateIO"></a>

### axclrtEngineCreateIO

Create a Host-side IO binding object from model IO metadata.

#### Function

```c
AXCL_EXPORT axclError axclrtEngineCreateIO(axclrtEngineIOInfo ioInfo, axclrtEngineIO *io);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| ioInfo | in | Valid IO metadata handle. |
| io | out | Receives the created IO binding handle. Must not be NULL. |

#### Returns

- `AXCL_SUCC`: The IO binding object was created successfully.
- `others`: Failure.

#### Note

The new object contains one unbound entry for each input and output, with buffer address and size set to 0 and dynamic batch size set to 0. It copies the tensor names and counts, so `ioInfo` can be destroyed after this function succeeds. Destroy the returned IO object with [axclrtEngineDestroyIO](#axclrtEngineDestroyIO).

<br>

<a id="axclrtEngineDestroyIO"></a>

### axclrtEngineDestroyIO

Destroy an IO binding object created by [axclrtEngineCreateIO](#axclrtEngineCreateIO).

#### Function

```c
AXCL_EXPORT axclError axclrtEngineDestroyIO(axclrtEngineIO io);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| io | in | IO binding handle to destroy. Must not be NULL. |

#### Returns

- `AXCL_SUCC`: The IO binding object was destroyed successfully.
- `others`: Failure.

#### Note

This function does not free Device buffers recorded in the object. The caller owns those buffers. After this function succeeds, `io` is invalid.

<br>

<a id="axclrtEngineDestroyIOInfo"></a>

### axclrtEngineDestroyIOInfo

Destroy an IO metadata object created by [axclrtEngineGetIOInfo](#axclrtEngineGetIOInfo).

#### Function

```c
AXCL_EXPORT axclError axclrtEngineDestroyIOInfo(axclrtEngineIOInfo ioInfo);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| ioInfo | in | IO metadata handle to destroy. Must not be NULL. |

#### Returns

- `AXCL_SUCC`: The IO metadata was destroyed successfully.
- `others`: Failure.

#### Note

After this function succeeds, `ioInfo` and all names returned from it are invalid.

<br>

<a id="axclrtEngineDestroyIOInfoV2"></a>

### axclrtEngineDestroyIOInfoV2

Release metadata returned by axclrtEngineGetIOInfoV2, including all nested arrays and names.

#### Function

```c
AXCL_EXPORT axclError axclrtEngineDestroyIOInfoV2(AX_ENGINE_IO_INFO_T *ioInfo);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| ioInfo | in | Metadata returned by axclrtEngineGetIOInfoV2. Must not be NULL. |

#### Returns

- AXCL_SUCC on success; an error code otherwise.

#### Note

Release exactly once. Do not pass caller-owned objects or Native AX_ENGINE_GetIOInfo results. This call does not release tensor buffers. Metadata may be released once no descriptor references its storage.

<br>

<a id="axclrtEngineExecute"></a>

### axclrtEngineExecute

Execute model inference synchronously on the current runtime Context's default Stream.

#### Function

```c
AXCL_EXPORT axclError axclrtEngineExecute(uint64_t modelId, uint64_t contextId, uint32_t group, axclrtEngineIO io);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| modelId | in | Loaded model ID. |
| contextId | in | Engine Context ID created for `modelId`. |
| group | in | Shape-group index, starting at 0. Currently ignored. |
| io | in | IO binding object containing all required Device buffers. Must not be NULL. |

#### Returns

- `AXCL_SUCC`: Inference completed successfully.
- `others`: Failure.

#### Note

The caller must bind valid buffers of the required sizes and keep the model, Engine Context, IO object, and Device buffers valid until this function returns. Every input and output in `io` must be bound to Device memory on the same device as the default Stream; otherwise the function fails without sending the request.

<br>

<a id="axclrtEngineExecuteAsync"></a>

### axclrtEngineExecuteAsync

Submit a model inference task to a Stream.

#### Function

```c
AXCL_EXPORT axclError axclrtEngineExecuteAsync(uint64_t modelId, uint64_t contextId, uint32_t group, axclrtEngineIO io, axclrtStream stream);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| modelId | in | Loaded model ID. |
| contextId | in | Engine Context ID created for `modelId`. |
| group | in | Shape-group index, starting at 0. Currently ignored. |
| io | in | IO binding object containing all required Device buffers. Must not be NULL. |
| stream | in | Stream that receives the inference request. Pass NULL to use the current runtime Context's default Stream. |

#### Returns

- `AXCL_SUCC`: The inference request was submitted successfully.
- `others`: Failure.

#### Note

- A successful return means the request was sent to the Device, not that inference has completed or that the Device has accepted it. Keep the model, Engine Context, and all bound Device buffers valid until the Stream completes.
- The buffer bindings and batch size in `io` are captured when the request is submitted, so `io` can be modified or destroyed after this function returns without affecting the submitted request.
- Every input and output in `io` must be bound to Device memory on the same device as `stream`; otherwise the function fails without sending the request.
- Errors detected on the Device, including a rejection because the Stream task queue is full, are returned by the next [axclrtSynchronizeStream](stream_api.md#axclrtSynchronizeStream) or [axclrtSynchronizeStreamWithTimeout](stream_api.md#axclrtSynchronizeStreamWithTimeout) on the Stream. Tasks in the Stream that have not started yet, except Event record and wait points, are skipped until that synchronization returns the error.
- Exception: if the Device cannot obtain its Context or Stream for the request, for example because it is out of resources, the request is discarded without running and no error is reported by the later synchronization.

#### Remark

- [axclrtEngineExecute](#axclrtEngineExecute)
- [axclrtSynchronizeStream](stream_api.md#axclrtSynchronizeStream)

<br>

<a id="axclrtEngineExecuteAsyncV2"></a>

### axclrtEngineExecuteAsyncV2

Submit a model inference task to a Stream and run it on the Native asynchronous engine.

Unlike [axclrtEngineExecuteAsync](#axclrtEngineExecuteAsync), the Stream does not wait for the inference: once the Native engine accepts the task, the Stream goes on with its next commands while the inference runs.

#### Function

```c
AXCL_EXPORT axclError axclrtEngineExecuteAsyncV2(uint64_t modelId, uint64_t contextId, uint32_t group, const AX_ENGINE_IO_T *io, axclrtStream stream);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| modelId | in | Loaded model ID. |
| contextId | in | Engine Context ID created for `modelId`. |
| group | in | Shape-group index. Must be 0: only the default shape group is supported. |
| io | in | Caller-owned complete IO descriptor with RT Tokens. Must not be NULL. |
| stream | in | Stream that receives the inference request. Pass NULL to use the current runtime Context's default Stream. |

#### Returns

- `AXCL_SUCC`: The inference request was submitted successfully.
- `others`: Failure.

#### Note

- Models with more than one shape group are not supported; the Native engine rejects them, and the error is returned by the next [axclrtSynchronizeStream](stream_api.md#axclrtSynchronizeStream) on `stream`.
- Later commands on `stream` do not wait for this inference. A command that reads its outputs must be ordered after it explicitly: record an Event after this call and make the reading Stream, which may be `stream` itself, wait for it with [axclrtStreamWaitEvent](event_api.md#axclrtStreamWaitEvent), or synchronize on the Host first.
- An Event recorded on `stream` after this call completes only when this inference has finished, and [axclrtSynchronizeStream](stream_api.md#axclrtSynchronizeStream) returns only when it has finished. Event completion does not mean the inference succeeded; its error is returned by the next [axclrtSynchronizeStream](stream_api.md#axclrtSynchronizeStream) or [axclrtSynchronizeStreamWithTimeout](stream_api.md#axclrtSynchronizeStreamWithTimeout) on `stream`, including a rejection by the Native engine.
- Exception: if the Device cannot obtain its Context or Stream for the request, for example because it is out of resources, the request is discarded without running and no error is reported by the later synchronization.
- Inferences on the same Stream and Engine Context run one after another. Using one Engine Context on several Streams at the same time requires the application to order them with Events.
- Keep the model, Engine Context, and all bound Device buffers valid until the inference has finished. A timed-out wait does not cancel it.
- IO fields follow axclrtEngineExecuteV2. Token bindings are resolved once on Host, including device and bounds checks. The caller remains responsible for all buffer lifetimes.
- AX_ENGINE_IO_T carries no cache attributes. Runtime obtains cached flags from output Tokens. Worker selects Native SHARED_CACHED or SHARED_UNCACHED from these flags. Native validates output addresses and memory support; outputs without Device VA are rejected. Native errors appear on synchronization. Free RT-owned memory through RT.
- Requires a matching Host Runtime and Worker supporting aggregate IO and output cache attributes.
- This aggregate entry replaces the original axclrtEngineIO argument of ExecuteAsyncV2 with AX_ENGINE_IO_T; callers of the earlier V2 entry must rebuild and migrate their IO descriptors.
- IO descriptors are serialized before return and may then be reused or released; tensor buffers must remain valid.
- With stream=NULL, wait with axclrtSynchronizeDevice; axclrtSynchronizeStream does not accept NULL.

#### Remark

- [axclrtEngineExecuteAsync](#axclrtEngineExecuteAsync)
- [axclrtRecordEvent](event_api.md#axclrtRecordEvent)
- [axclrtStreamWaitEvent](event_api.md#axclrtStreamWaitEvent)
- [axclrtSynchronizeStream](stream_api.md#axclrtSynchronizeStream)

<br>

<a id="axclrtEngineExecuteV2"></a>

### axclrtEngineExecuteV2

Submit complete IO bindings and execute synchronously on the default Stream.

#### Function

```c
AXCL_EXPORT axclError axclrtEngineExecuteV2(uint64_t modelId, uint64_t contextId, uint32_t group, const AX_ENGINE_IO_T *io);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| modelId | in | Loaded model ID. |
| contextId | in | Engine Context ID created for the model. |
| group | in | Shape-group index. Currently ignored, as in axclrtEngineExecute. |
| io | in | Caller-owned descriptor containing all inputs and outputs in model order. |

#### Returns

- AXCL_SUCC when inference completes; an error code otherwise.

#### Note

No CreateIO or SetBuffer calls are needed. Descriptor arrays and Device buffers must remain valid until return. Buffers must belong to the default Stream's device. This call does not allocate or copy tensor data and does not take ownership of any caller memory. Each buffer must use phyAddr=0 and a nonnull RT Token-VA in pVirAddr. Host resolves addresses, bounds and device ownership from the Token. Nonzero phyAddr and invalid Tokens return AXCL_ERR_ENGINE_ILLEGAL_PARAM. RT allocations and IPC imports are accepted; axclrtMemMapDevAddr Tokens are unsupported because their cache attributes are unknown. A Token with no Device VA requires model/Engine support for physical-only IO. Custom pStride/nStrideSize and pIoSetting are currently unsupported and must be NULL/0. nSize is a positive uint32 byte count. Retain RT handles for memory operations and buffer lifetime. Neither Token-VA nor Device VA may be dereferenced on Host. RT model/Context handles remain unchanged. This Token convention is specific to RT V2: do not pass Token descriptors directly to Native Engine. The axcl_test_rtengine cases axclrtEngineV2Test.* provide runnable examples and output comparisons. The optional DISABLED_LatencyComparison case compares fixed IO and repeated binding in C++.

<br>

<a id="axclrtEngineFinalize"></a>

### axclrtEngineFinalize

Deinitialize Engine on the device associated with the current Context.

#### Function

```c
AXCL_EXPORT axclError axclrtEngineFinalize(void);
```

#### Parameters

N/A

#### Returns

- `AXCL_SUCC`: Engine was deinitialized successfully.
- `others`: Failure.

#### Note

- Complete all asynchronous inference and unload all models before deinitializing Engine. The function fails if Engine is not initialized, or if models are still loaded when the last paired call is made.
- Initialization is counted per device in each Host process. If [axclrtEngineInit](#axclrtEngineInit) succeeded more than once, Engine remains initialized until this function has been called the same number of times.
- After deinitialization, model and Engine Context IDs from this device must no longer be used. Host-side IO metadata and binding objects remain owned by the caller and must still be destroyed with their corresponding destroy functions.

<br>

<a id="axclrtEngineGetAffinity"></a>

### axclrtEngineGetAffinity

Get the NPU-core affinity mask of a loaded model.

#### Function

```c
AXCL_EXPORT axclError axclrtEngineGetAffinity(uint64_t modelId, axclrtEngineSet *set);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| modelId | in | Loaded model ID. |
| set | out | Receives the affinity mask. Must not be NULL. |

#### Returns

- `AXCL_SUCC`: The affinity was returned successfully.
- `others`: Failure.

#### Remark

- [axclrtEngineSetAffinity](#axclrtEngineSetAffinity)
- [axclrtEngineCreateContext](#axclrtEngineCreateContext)

<br>

<a id="axclrtEngineGetContextAffinity"></a>

### axclrtEngineGetContextAffinity

Get affinity for one Engine Context; this operation is currently unsupported.

#### Function

```c
AXCL_EXPORT axclError axclrtEngineGetContextAffinity(uint64_t modelId, uint64_t contextId, axclrtEngineSet *set);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| modelId | in | Loaded model ID. |
| contextId | in | Engine Context ID. |
| set | out | Output affinity mask; no value is returned while the operation is unsupported. Must not be NULL. |

#### Returns

- `others`: The operation is currently unsupported, or an argument is invalid.

#### Remark

- [axclrtEngineGetAffinity](#axclrtEngineGetAffinity)
- [axclrtEngineCreateContext](#axclrtEngineCreateContext)

<br>

<a id="axclrtEngineGetIOInfo"></a>

### axclrtEngineGetIOInfo

Create a Host-side metadata object describing a loaded model's inputs and outputs.

#### Function

```c
AXCL_EXPORT axclError axclrtEngineGetIOInfo(uint64_t modelId, axclrtEngineIOInfo *ioInfo);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| modelId | in | Loaded model ID. |
| ioInfo | out | Receives the created IO metadata handle. Must not be NULL. |

#### Returns

- `AXCL_SUCC`: IO metadata was created successfully.
- `others`: Failure.

#### Note

Destroy the returned handle with [axclrtEngineDestroyIOInfo](#axclrtEngineDestroyIOInfo). Tensor-name pointers returned from this object remain valid only until the handle is destroyed.

#### Remark

- [axclrtEngineDestroyIOInfo](#axclrtEngineDestroyIOInfo)
- [axclrtEngineCreateIO](#axclrtEngineCreateIO)

<br>

<a id="axclrtEngineGetIOInfoV2"></a>

### axclrtEngineGetIOInfoV2

Get complete default-group tensor metadata using the existing Native structure.

#### Function

```c
AXCL_EXPORT axclError axclrtEngineGetIOInfoV2(uint64_t modelId, AX_ENGINE_IO_INFO_T **ioInfo);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| modelId | in | Loaded model ID. |
| ioInfo | out | Receives Runtime-owned, read-only metadata; NULL on failure. |

#### Returns

- AXCL_SUCC on success; an error code otherwise.

#### Note

Release with axclrtEngineDestroyIOInfoV2. All nested arrays and names remain valid until release. This object is independent of the legacy axclrtEngineIOInfo handle and Native AX_ENGINE_GetIOInfo allocations. Uses Native enum values. Shape and stride arrays have nShapeSize elements; pStride may be NULL. Uses the independent GET_INFOV2 protocol and requires a Worker that supports it. No automatic fallback to GET_INFO is provided; the legacy metadata descriptor is unchanged. The result includes pInputs/nInputSize, pOutputs/nOutputSize, nMaxBatchSize and bDynamicBatchSize. Tensor fields include pName, pShape/nShapeSize, pStride, eDataType, eLayout, eMemoryType and nSize. Optional pExtraMeta carries color information; it is NULL when absent. Current encoding supports up to eight shape/stride dimensions. Reserved and untransmitted quantization fields are zero. Do not modify or individually free nested fields, or release this object with the legacy destroy API.

<br>

<a id="axclrtEngineGetInputBufferByIndex"></a>

### axclrtEngineGetInputBufferByIndex

Get the buffer binding stored for an input index.

#### Function

```c
AXCL_EXPORT axclError axclrtEngineGetInputBufferByIndex(axclrtEngineIO io, uint32_t index, void **dataBuffer, uint64_t *size);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| io | in | Valid IO binding handle. |
| index | in | Input index, starting at 0. Must be less than the number of inputs. |
| dataBuffer | out | Receives the stored Device memory handle. Must not be NULL. |
| size | out | Receives the stored buffer size in bytes. Must not be NULL. |

#### Returns

- `AXCL_SUCC`: The stored binding was returned successfully.
- `others`: Failure.

#### Note

A newly created IO object returns a NULL buffer and size 0 until the entry is bound.

<br>

<a id="axclrtEngineGetInputBufferByName"></a>

### axclrtEngineGetInputBufferByName

Get the buffer binding stored for an input tensor name.

#### Function

```c
AXCL_EXPORT axclError axclrtEngineGetInputBufferByName(axclrtEngineIO io, const char *name, void **dataBuffer, uint64_t *size);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| io | in | Valid IO binding handle. |
| name | in | Input tensor name. Must not be NULL and must match an input of `io`. |
| dataBuffer | out | Receives the stored Device memory handle. Must not be NULL. |
| size | out | Receives the stored buffer size in bytes. Must not be NULL. |

#### Returns

- `AXCL_SUCC`: The stored binding was returned successfully.
- `others`: Failure.

<br>

<a id="axclrtEngineGetInputDataLayout"></a>

### axclrtEngineGetInputDataLayout

Get the data layout of an input tensor.

#### Function

```c
AXCL_EXPORT axclError axclrtEngineGetInputDataLayout(axclrtEngineIOInfo ioInfo, uint32_t index, axclrtEngineDataLayout *layout);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| ioInfo | in | Valid IO metadata handle. |
| index | in | Input index, starting at 0. Must be less than the number of inputs. |
| layout | out | Receives the input data layout. Must not be NULL. |

#### Returns

- `AXCL_SUCC`: The data layout was returned successfully.
- `others`: Failure.

<br>

<a id="axclrtEngineGetInputDataType"></a>

### axclrtEngineGetInputDataType

Get the data type of an input tensor.

#### Function

```c
AXCL_EXPORT axclError axclrtEngineGetInputDataType(axclrtEngineIOInfo ioInfo, uint32_t index, axclrtEngineDataType *type);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| ioInfo | in | Valid IO metadata handle. |
| index | in | Input index, starting at 0. Must be less than the number of inputs. |
| type | out | Receives the input data type. Must not be NULL. |

#### Returns

- `AXCL_SUCC`: The data type was returned successfully.
- `others`: Failure.

<br>

<a id="axclrtEngineGetInputDims"></a>

### axclrtEngineGetInputDims

Get the dimensions of an input tensor in the specified shape group.

#### Function

```c
AXCL_EXPORT axclError axclrtEngineGetInputDims(axclrtEngineIOInfo ioInfo, uint32_t group, uint32_t index, axclrtEngineIODims *dims);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| ioInfo | in | Valid IO metadata handle. |
| group | in | Shape-group index, starting at 0. Must be less than the selected tensor's shape-group count. |
| index | in | Input index, starting at 0. Must be less than the number of inputs. |
| dims | out | Caller-provided structure that receives the dimensions. Must not be NULL. |

#### Returns

- `AXCL_SUCC`: The dimensions were returned successfully.
- `others`: Failure.

#### Note

`dims` does not allocate memory and does not require a release call.

<br>

<a id="axclrtEngineGetInputIndexByName"></a>

### axclrtEngineGetInputIndexByName

Find an input tensor index by name.

#### Function

```c
AXCL_EXPORT int32_t axclrtEngineGetInputIndexByName(axclrtEngineIOInfo ioInfo, const char *name);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| ioInfo | in | Valid IO metadata handle. |
| name | in | Input tensor name. Must not be NULL. |

#### Returns

- Nonnegative input index on success; a negative Engine error value on failure, including when no input matches `name`. [axclrtGetLastError](other_api.md#axclrtGetLastError) also reports the failure.

<br>

<a id="axclrtEngineGetInputNameByIndex"></a>

### axclrtEngineGetInputNameByIndex

Get an input tensor name by index.

#### Function

```c
AXCL_EXPORT const char* axclrtEngineGetInputNameByIndex(axclrtEngineIOInfo ioInfo, uint32_t index);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| ioInfo | in | Valid IO metadata handle. |
| index | in | Input index, starting at 0. Must be less than the number of inputs. |

#### Returns

- Tensor name on success; NULL on failure. The returned pointer is owned by `ioInfo` and remains valid until [axclrtEngineDestroyIOInfo](#axclrtEngineDestroyIOInfo) is called.

#### Remark

- [axclrtEngineGetInputIndexByName](#axclrtEngineGetInputIndexByName)
- [axclrtEngineGetNumInputs](#axclrtEngineGetNumInputs)

<br>

<a id="axclrtEngineGetInputSizeByIndex"></a>

### axclrtEngineGetInputSizeByIndex

Get the required buffer size for a model input in the specified shape group.

#### Function

```c
AXCL_EXPORT uint64_t axclrtEngineGetInputSizeByIndex(axclrtEngineIOInfo ioInfo, uint32_t group, uint32_t index);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| ioInfo | in | Valid IO metadata handle. |
| group | in | Shape-group index, starting at 0. Must be less than the selected tensor's shape-group count. |
| index | in | Input index, starting at 0. Must be less than the number of inputs. |

#### Returns

- Required size in bytes. On failure, returns an encoded error value and sets the last error.

<br>

<a id="axclrtEngineGetModelCompilerVersion"></a>

### axclrtEngineGetModelCompilerVersion

Get the compiler toolchain version stored in a loaded model.

#### Function

```c
AXCL_EXPORT const char* axclrtEngineGetModelCompilerVersion(uint64_t modelId);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| modelId | in | Loaded model ID. |

#### Returns

- A thread-local, null-terminated version string on success; NULL on failure. The pointer may be overwritten by a later call in the same thread and must not be freed by the caller.

<br>

<a id="axclrtEngineGetModelType"></a>

### axclrtEngineGetModelType

Get the core-count classification of a model file.

#### Function

```c
AXCL_EXPORT axclError axclrtEngineGetModelType(const char *modelPath, axclrtEngineModelKind *modelType);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| modelPath | in | Path to an existing, readable regular model file on the Host. Must not be NULL. |
| modelType | out | Receives the model type. Must not be NULL. |

#### Returns

- `AXCL_SUCC`: The model type was returned successfully.
- `others`: Failure.

#### Note

This function temporarily loads the model and unloads it before returning.

<br>

<a id="axclrtEngineGetModelTypeFromMem"></a>

### axclrtEngineGetModelTypeFromMem

Get the core-count classification of model data stored in Device memory.

#### Function

```c
AXCL_EXPORT axclError axclrtEngineGetModelTypeFromMem(const void *model, uint64_t modelSize, axclrtEngineModelKind *modelType);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| model | in | Device memory handle containing model data. Must not be NULL. |
| modelSize | in | Model data size in bytes. Must be greater than 0. |
| modelType | out | Receives the model type. Must not be NULL. |

#### Returns

- `AXCL_SUCC`: The model type was returned successfully.
- `others`: Failure.

#### Note

This function temporarily loads and unloads the model. The caller retains ownership of `model`, which must belong to the current device and remain valid until the function returns.

<br>

<a id="axclrtEngineGetModelTypeFromModelId"></a>

### axclrtEngineGetModelTypeFromModelId

Get the core-count classification of a loaded model.

#### Function

```c
AXCL_EXPORT axclError axclrtEngineGetModelTypeFromModelId(uint64_t modelId, axclrtEngineModelKind *modelType);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| modelId | in | Loaded model ID. |
| modelType | out | Receives the model type. Must not be NULL. |

#### Returns

- `AXCL_SUCC`: The model type was returned successfully.
- `others`: Failure.

<br>

<a id="axclrtEngineGetNumInputs"></a>

### axclrtEngineGetNumInputs

Get the number of model inputs in an IO metadata object.

#### Function

```c
AXCL_EXPORT uint32_t axclrtEngineGetNumInputs(axclrtEngineIOInfo ioInfo);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| ioInfo | in | Valid IO metadata handle. |

#### Returns

- Number of inputs. If `ioInfo` is NULL, the return value is an encoded error value and [axclrtGetLastError](other_api.md#axclrtGetLastError) reports the failure.

<br>

<a id="axclrtEngineGetNumOutputs"></a>

### axclrtEngineGetNumOutputs

Get the number of model outputs in an IO metadata object.

#### Function

```c
AXCL_EXPORT uint32_t axclrtEngineGetNumOutputs(axclrtEngineIOInfo ioInfo);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| ioInfo | in | Valid IO metadata handle. |

#### Returns

- Number of outputs. If `ioInfo` is NULL, the return value is an encoded error value and [axclrtGetLastError](other_api.md#axclrtGetLastError) reports the failure.

<br>

<a id="axclrtEngineGetOutputBufferByIndex"></a>

### axclrtEngineGetOutputBufferByIndex

Get the buffer binding stored for an output index.

#### Function

```c
AXCL_EXPORT axclError axclrtEngineGetOutputBufferByIndex(axclrtEngineIO io, uint32_t index, void **dataBuffer, uint64_t *size);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| io | in | Valid IO binding handle. |
| index | in | Output index, starting at 0. Must be less than the number of outputs. |
| dataBuffer | out | Receives the stored Device memory handle. Must not be NULL. |
| size | out | Receives the stored buffer size in bytes. Must not be NULL. |

#### Returns

- `AXCL_SUCC`: The stored binding was returned successfully.
- `others`: Failure.

#### Note

A newly created IO object returns a NULL buffer and size 0 until the entry is bound.

<br>

<a id="axclrtEngineGetOutputBufferByName"></a>

### axclrtEngineGetOutputBufferByName

Get the buffer binding stored for an output tensor name.

#### Function

```c
AXCL_EXPORT axclError axclrtEngineGetOutputBufferByName(axclrtEngineIO io, const char *name, void **dataBuffer, uint64_t *size);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| io | in | Valid IO binding handle. |
| name | in | Output tensor name. Must not be NULL and must match an output of `io`. |
| dataBuffer | out | Receives the stored Device memory handle. Must not be NULL. |
| size | out | Receives the stored buffer size in bytes. Must not be NULL. |

#### Returns

- `AXCL_SUCC`: The stored binding was returned successfully.
- `others`: Failure.

<br>

<a id="axclrtEngineGetOutputDataLayout"></a>

### axclrtEngineGetOutputDataLayout

Get the data layout of an output tensor.

#### Function

```c
AXCL_EXPORT axclError axclrtEngineGetOutputDataLayout(axclrtEngineIOInfo ioInfo, uint32_t index, axclrtEngineDataLayout *layout);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| ioInfo | in | Valid IO metadata handle. |
| index | in | Output index, starting at 0. Must be less than the number of outputs. |
| layout | out | Receives the output data layout. Must not be NULL. |

#### Returns

- `AXCL_SUCC`: The data layout was returned successfully.
- `others`: Failure.

<br>

<a id="axclrtEngineGetOutputDataType"></a>

### axclrtEngineGetOutputDataType

Get the data type of an output tensor.

#### Function

```c
AXCL_EXPORT axclError axclrtEngineGetOutputDataType(axclrtEngineIOInfo ioInfo, uint32_t index, axclrtEngineDataType *type);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| ioInfo | in | Valid IO metadata handle. |
| index | in | Output index, starting at 0. Must be less than the number of outputs. |
| type | out | Receives the output data type. Must not be NULL. |

#### Returns

- `AXCL_SUCC`: The data type was returned successfully.
- `others`: Failure.

<br>

<a id="axclrtEngineGetOutputDims"></a>

### axclrtEngineGetOutputDims

Get the dimensions of an output tensor in the specified shape group.

#### Function

```c
AXCL_EXPORT axclError axclrtEngineGetOutputDims(axclrtEngineIOInfo ioInfo, uint32_t group, uint32_t index, axclrtEngineIODims *dims);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| ioInfo | in | Valid IO metadata handle. |
| group | in | Shape-group index, starting at 0. Must be less than the selected tensor's shape-group count. |
| index | in | Output index, starting at 0. Must be less than the number of outputs. |
| dims | out | Caller-provided structure that receives the dimensions. Must not be NULL. |

#### Returns

- `AXCL_SUCC`: The dimensions were returned successfully.
- `others`: Failure.

#### Note

`dims` does not allocate memory and does not require a release call.

<br>

<a id="axclrtEngineGetOutputIndexByName"></a>

### axclrtEngineGetOutputIndexByName

Find an output tensor index by name.

#### Function

```c
AXCL_EXPORT int32_t axclrtEngineGetOutputIndexByName(axclrtEngineIOInfo ioInfo, const char *name);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| ioInfo | in | Valid IO metadata handle. |
| name | in | Output tensor name. Must not be NULL. |

#### Returns

- Nonnegative output index on success; a negative Engine error value on failure, including when no output matches `name`. [axclrtGetLastError](other_api.md#axclrtGetLastError) also reports the failure.

<br>

<a id="axclrtEngineGetOutputNameByIndex"></a>

### axclrtEngineGetOutputNameByIndex

Get an output tensor name by index.

#### Function

```c
AXCL_EXPORT const char* axclrtEngineGetOutputNameByIndex(axclrtEngineIOInfo ioInfo, uint32_t index);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| ioInfo | in | Valid IO metadata handle. |
| index | in | Output index, starting at 0. Must be less than the number of outputs. |

#### Returns

- Tensor name on success; NULL on failure. The returned pointer is owned by `ioInfo` and remains valid until [axclrtEngineDestroyIOInfo](#axclrtEngineDestroyIOInfo) is called.

#### Remark

- [axclrtEngineGetOutputIndexByName](#axclrtEngineGetOutputIndexByName)
- [axclrtEngineGetNumOutputs](#axclrtEngineGetNumOutputs)

<br>

<a id="axclrtEngineGetOutputSizeByIndex"></a>

### axclrtEngineGetOutputSizeByIndex

Get the required buffer size for a model output in the specified shape group.

#### Function

```c
AXCL_EXPORT uint64_t axclrtEngineGetOutputSizeByIndex(axclrtEngineIOInfo ioInfo, uint32_t group, uint32_t index);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| ioInfo | in | Valid IO metadata handle. |
| group | in | Shape-group index, starting at 0. Must be less than the selected tensor's shape-group count. |
| index | in | Output index, starting at 0. Must be less than the number of outputs. |

#### Returns

- Required size in bytes. On failure, returns an encoded error value and sets the last error.

<br>

<a id="axclrtEngineGetShapeGroupsCount"></a>

### axclrtEngineGetShapeGroupsCount

Get the number of shape groups described by an IO metadata object.

#### Function

```c
AXCL_EXPORT axclError axclrtEngineGetShapeGroupsCount(axclrtEngineIOInfo ioInfo, int32_t *count);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| ioInfo | in | Valid IO metadata handle. |
| count | out | Receives the shape-group count; 0 if the model has no inputs. Must not be NULL. |

#### Returns

- `AXCL_SUCC`: The count was returned successfully.
- `others`: Failure.

#### Remark

- [axclrtEngineGetIOInfo](#axclrtEngineGetIOInfo)
- [axclrtEngineGetInputSizeByIndex](#axclrtEngineGetInputSizeByIndex)
- [axclrtEngineGetOutputSizeByIndex](#axclrtEngineGetOutputSizeByIndex)

<br>

<a id="axclrtEngineGetUsage"></a>

### axclrtEngineGetUsage

Get Engine memory usage for a model file.

#### Function

```c
AXCL_EXPORT axclError axclrtEngineGetUsage(const char *modelPath, int64_t *sysSize, int64_t *cmmSize);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| modelPath | in | Path to an existing, readable regular model file on the Host. Must not be NULL. |
| sysSize | out | Receives system-memory usage in bytes. The current implementation returns 0. Must not be NULL. |
| cmmSize | out | Receives CMM memory usage in bytes. Must not be NULL. |

#### Returns

- `AXCL_SUCC`: The usage values were returned successfully.
- `others`: Failure.

#### Note

This function temporarily loads the model and unloads it before returning.

<br>

<a id="axclrtEngineGetUsageFromMem"></a>

### axclrtEngineGetUsageFromMem

Get Engine memory usage for model data stored in Device memory.

#### Function

```c
AXCL_EXPORT axclError axclrtEngineGetUsageFromMem(const void *model, uint64_t modelSize, int64_t *sysSize, int64_t *cmmSize);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| model | in | Device memory handle containing model data. Must not be NULL. |
| modelSize | in | Model data size in bytes. Must be greater than 0. |
| sysSize | out | Receives system-memory usage in bytes. The current implementation returns 0. Must not be NULL. |
| cmmSize | out | Receives CMM memory usage in bytes. Must not be NULL. |

#### Returns

- `AXCL_SUCC`: The usage values were returned successfully.
- `others`: Failure.

#### Note

This function temporarily loads and unloads the model. The caller retains ownership of `model`, which must belong to the current device and remain valid until the function returns.

<br>

<a id="axclrtEngineGetUsageFromModelId"></a>

### axclrtEngineGetUsageFromModelId

Get Engine memory usage for a loaded model.

#### Function

```c
AXCL_EXPORT axclError axclrtEngineGetUsageFromModelId(uint64_t modelId, int64_t *sysSize, int64_t *cmmSize);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| modelId | in | Loaded model ID. |
| sysSize | out | Receives system-memory usage in bytes. The current implementation returns 0. Must not be NULL. |
| cmmSize | out | Receives CMM memory usage in bytes. Must not be NULL. |

#### Returns

- `AXCL_SUCC`: The usage values were returned successfully.
- `others`: Failure.

<br>

<a id="axclrtEngineGetVNpuKind"></a>

### axclrtEngineGetVNpuKind

Get the VNPU mode of Engine on the current Context's device.

#### Function

```c
AXCL_EXPORT axclError axclrtEngineGetVNpuKind(axclrtEngineVNpuKind *npuKind);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| npuKind | out | Receives the initialized VNPU mode. Must not be NULL. |

#### Returns

- `AXCL_SUCC`: The VNPU mode was returned successfully.
- `others`: Failure.

#### Note

Engine must already be initialized on the device.

<br>

<a id="axclrtEngineInit"></a>

### axclrtEngineInit

Initialize Engine on the device associated with the calling thread's current Context.

#### Function

```c
AXCL_EXPORT axclError axclrtEngineInit(axclrtEngineVNpuKind npuKind);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| npuKind | in | VNPU mode used to initialize the device Engine. |

#### Returns

- `AXCL_SUCC`: Engine was initialized successfully.
- `others`: Failure.

#### Note

- Call this function after establishing a current Context and before using other Engine APIs on that device. Pair each successful initialization with [axclrtEngineFinalize](#axclrtEngineFinalize) before releasing the device.
- Calling this function again while Engine is initialized succeeds only if `npuKind` matches the active VNPU mode; a different mode fails. The supported VNPU modes depend on the device.

<br>

<a id="axclrtEngineLoadFromFile"></a>

### axclrtEngineLoadFromFile

Load an offline model from a Host file into Engine on the current device.

#### Function

```c
AXCL_EXPORT axclError axclrtEngineLoadFromFile(const char *modelPath, uint64_t *modelId);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| modelPath | in | Path to an existing, readable regular model file on the Host. Must not be NULL. |
| modelId | out | Receives the model ID used by subsequent Engine APIs. Must not be NULL. |

#### Returns

- `AXCL_SUCC`: The model was loaded successfully.
- `others`: Failure.

#### Note

This function reads the file, temporarily allocates Device memory, copies the model to the device, loads it, and releases the temporary allocation before returning. Unload the returned model ID with [axclrtEngineUnload](#axclrtEngineUnload).

<br>

<a id="axclrtEngineLoadFromMem"></a>

### axclrtEngineLoadFromMem

Load an offline model from Device memory into Engine on the current device.

#### Function

```c
AXCL_EXPORT axclError axclrtEngineLoadFromMem(const void *model, uint64_t modelSize, uint64_t *modelId);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| model | in | Device memory handle containing the model data. Must not be NULL. |
| modelSize | in | Model data size in bytes. Must be greater than 0. |
| modelId | out | Receives the model ID used by subsequent Engine APIs. Must not be NULL. |

#### Returns

- `AXCL_SUCC`: The model was loaded successfully.
- `others`: Failure.

#### Note

`model` must belong to the current device and remain valid until this function returns. The caller owns that memory and may free it after a successful load. Unload the returned model ID with [axclrtEngineUnload](#axclrtEngineUnload).

<br>

<a id="axclrtEngineSetAffinity"></a>

### axclrtEngineSetAffinity

Set the NPU-core affinity mask of a loaded model.

#### Function

```c
AXCL_EXPORT axclError axclrtEngineSetAffinity(uint64_t modelId, axclrtEngineSet set);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| modelId | in | Loaded model ID. |
| set | in | Nonzero affinity mask using bits 0 through 7; valid values are 0x1 through 0xFF. The mask replaces the previous affinity selection. The device may impose additional limits by chip mode or model type. |

#### Returns

- `AXCL_SUCC`: The affinity was set successfully.
- `others`: Failure.

#### Remark

- [axclrtEngineGetAffinity](#axclrtEngineGetAffinity)
- [axclrtEngineCreateContext](#axclrtEngineCreateContext)

<br>

<a id="axclrtEngineSetContextAffinity"></a>

### axclrtEngineSetContextAffinity

Set affinity for one Engine Context; this operation is currently unsupported.

#### Function

```c
AXCL_EXPORT axclError axclrtEngineSetContextAffinity(uint64_t modelId, uint64_t contextId, axclrtEngineSet set);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| modelId | in | Loaded model ID. |
| contextId | in | Engine Context ID. |
| set | in | Nonzero affinity mask from 0x1 through 0x7. |

#### Returns

- `others`: The operation is currently unsupported, or an argument is invalid.

#### Remark

- [axclrtEngineSetAffinity](#axclrtEngineSetAffinity)
- [axclrtEngineCreateContext](#axclrtEngineCreateContext)

<br>

<a id="axclrtEngineSetDynamicBatchSize"></a>

### axclrtEngineSetDynamicBatchSize

Store the dynamic batch size used for later execution with an IO binding object.

#### Function

```c
AXCL_EXPORT axclError axclrtEngineSetDynamicBatchSize(axclrtEngineIO io, uint32_t batchSize);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| io | in | Valid IO binding handle. |
| batchSize | in | Batch size to store. |

#### Returns

- `AXCL_SUCC`: The batch size was stored successfully.
- `others`: Failure.

#### Note

This function only stores the value in `io` and does not validate it against the model. The stored value is sent to the Device with each later execution that uses `io`.

<br>

<a id="axclrtEngineSetInputBufferByIndex"></a>

### axclrtEngineSetInputBufferByIndex

Bind a Device buffer to an input by index.

#### Function

```c
AXCL_EXPORT axclError axclrtEngineSetInputBufferByIndex(axclrtEngineIO io, uint32_t index, const void *dataBuffer, uint64_t size);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| io | in | Valid IO binding handle. |
| index | in | Input index, starting at 0. Must be less than the number of inputs. |
| dataBuffer | in | Device memory handle to bind. Must not be NULL. |
| size | in | Bound buffer size in bytes. Must be greater than 0. |

#### Returns

- `AXCL_SUCC`: The buffer binding was stored successfully.
- `others`: Failure.

#### Note

The function stores the address and size without copying or taking ownership of the buffer. The caller must use the size required by the selected shape group and keep the buffer valid through execution.

<br>

<a id="axclrtEngineSetInputBufferByName"></a>

### axclrtEngineSetInputBufferByName

Bind a Device buffer to an input by tensor name.

#### Function

```c
AXCL_EXPORT axclError axclrtEngineSetInputBufferByName(axclrtEngineIO io, const char *name, const void *dataBuffer, uint64_t size);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| io | in | Valid IO binding handle. |
| name | in | Input tensor name. Must not be NULL and must match an input of `io`. |
| dataBuffer | in | Device memory handle to bind. Must not be NULL. |
| size | in | Bound buffer size in bytes. Must be greater than 0. |

#### Returns

- `AXCL_SUCC`: The buffer binding was stored successfully.
- `others`: Failure.

#### Note

The function stores the address and size without copying or taking ownership of the buffer. The caller must keep the buffer valid through execution and use the size required by the selected shape group.

<br>

<a id="axclrtEngineSetOutputBufferByIndex"></a>

### axclrtEngineSetOutputBufferByIndex

Bind a Device buffer to an output by index.

#### Function

```c
AXCL_EXPORT axclError axclrtEngineSetOutputBufferByIndex(axclrtEngineIO io, uint32_t index, const void *dataBuffer, uint64_t size);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| io | in | Valid IO binding handle. |
| index | in | Output index, starting at 0. Must be less than the number of outputs. |
| dataBuffer | in | Device memory handle to bind. Must not be NULL. |
| size | in | Bound buffer size in bytes. Must be greater than 0. |

#### Returns

- `AXCL_SUCC`: The buffer binding was stored successfully.
- `others`: Failure.

#### Note

The function stores the address and size without copying or taking ownership of the buffer. The caller must use the size required by the selected shape group and keep the buffer valid through execution.

<br>

<a id="axclrtEngineSetOutputBufferByName"></a>

### axclrtEngineSetOutputBufferByName

Bind a Device buffer to an output by tensor name.

#### Function

```c
AXCL_EXPORT axclError axclrtEngineSetOutputBufferByName(axclrtEngineIO io, const char *name, const void *dataBuffer, uint64_t size);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| io | in | Valid IO binding handle. |
| name | in | Output tensor name. Must not be NULL and must match an output of `io`. |
| dataBuffer | in | Device memory handle to bind. Must not be NULL. |
| size | in | Bound buffer size in bytes. Must be greater than 0. |

#### Returns

- `AXCL_SUCC`: The buffer binding was stored successfully.
- `others`: Failure.

#### Note

The function stores the address and size without copying or taking ownership of the buffer. The caller must keep the buffer valid through execution and use the size required by the selected shape group.

<br>

<a id="axclrtEngineUnload"></a>

### axclrtEngineUnload

Unload a model from Engine on the current device.

#### Function

```c
AXCL_EXPORT axclError axclrtEngineUnload(uint64_t modelId);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| modelId | in | Model ID returned by a load function. |

#### Returns

- `AXCL_SUCC`: The model was unloaded successfully.
- `others`: Failure.

#### Note

Ensure that no synchronous or asynchronous execution still uses the model or an Engine Context created from it. After this function succeeds, `modelId` and all Engine Context IDs created for the model are invalid and must no longer be used.
