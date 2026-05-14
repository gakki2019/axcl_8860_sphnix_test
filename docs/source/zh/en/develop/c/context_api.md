# Context API

## Index

- [axclrtCreateContext](#axclrtCreateContext)
- [axclrtDestroyContext](#axclrtDestroyContext)
- [axclrtGetCurrentContext](#axclrtGetCurrentContext)
- [axclrtSetCurrentContext](#axclrtSetCurrentContext)

<br>

## API

<a id="axclrtCreateContext"></a>

### axclrtCreateContext

Create a context on specified device and bind to calling thread.

#### Function

```c
AXCL_EXPORT axclError axclrtCreateContext(axclrtContext *context, int32_t deviceId);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| context | out | pointer to created context |
| deviceId | in | device id |

#### Returns

- `AXCL_SUCC`: success.
- `others`: failure.

#### Note

If don't call the [axclrtCreateContext](#axclrtCreateContext) API to explicitly create the context, the system will use the default context, which is implicitly created when the [axclrtSetDevice](device_api.md#axclrtSetDevice) API is called.
If multiple contexts are created in calling thread, only the latest created context will be used.
[axclrtDestroyContext](#axclrtDestroyContext) must be called explicitly to destroy the created context.

#### Remark

[axclrtDestroyContext](#axclrtDestroyContext) | [axclrtSetDevice](device_api.md#axclrtSetDevice)

#### Example

```c
// create a context and bind to device_id
void working_thread(int device_id) {
     // create a context and bind to calling thread
     axclrtContext context;
     axclrtCreateContext(&context, device_id);

     // TODO: working body

     // destroy the context before thread quit.
     axclrtDestroyContext(context);
}
```

<br>

<a id="axclrtDestroyContext"></a>

### axclrtDestroyContext

Destroy the context explicitly created by [axclrtCreateContext](#axclrtCreateContext).

#### Function

```c
AXCL_EXPORT axclError axclrtDestroyContext(axclrtContext context);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| context | in | context created by [axclrtCreateContext](#axclrtCreateContext). |

#### Returns

- `AXCL_SUCC`: success.
- `others`: failure.

#### Note

[axclrtDestroyContext](#axclrtDestroyContext) cannot destroy the default context which is created by [axclrtSetDevice](device_api.md#axclrtSetDevice).

#### Remark

[axclrtCreateContext](#axclrtCreateContext) | [axclrtSetDevice](device_api.md#axclrtSetDevice)

<br>

<a id="axclrtGetCurrentContext"></a>

### axclrtGetCurrentContext

Get context of current calling thread.

#### Function

```c
AXCL_EXPORT axclError axclrtGetCurrentContext(axclrtContext *context);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| context | out | pointer to context. |

#### Returns

- `AXCL_SUCC`: success.
- `others`: failure.

<br>

<a id="axclrtSetCurrentContext"></a>

### axclrtSetCurrentContext

Bind the specified context to current calling thread.

#### Function

```c
AXCL_EXPORT axclError axclrtSetCurrentContext(axclrtContext context);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| context | in | context. |

#### Returns

- `AXCL_SUCC`: success.
- `others`: failure.
