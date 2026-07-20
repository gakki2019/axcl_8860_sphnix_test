# Context

## Index

- [axclrtCreateContext](#axclrtCreateContext): Explicitly create a Context and bind it to the calling thread.
- [axclrtDestroyContext](#axclrtDestroyContext): Destroy a Context created by [axclrtCreateContext](#axclrtCreateContext).
- [axclrtGetCurrentContext](#axclrtGetCurrentContext): Get the current Context of the calling thread.
- [axclrtSetCurrentContext](#axclrtSetCurrentContext): Make a Context current for the calling thread.

<br>

## API

<a id="axclrtCreateContext"></a>

### axclrtCreateContext

Explicitly create a Context and bind it to the calling thread.

#### Function

```c
AXCL_EXPORT axclError axclrtCreateContext(axclrtContext *context, int32_t deviceId);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| context | out | Receives the created Context handle on success. |
| deviceId | in | Virtual device ID visible to the current process. Valid IDs are in the range [0, count - 1], where count is returned by [axclrtGetDeviceCount](device_api.md#axclrtGetDeviceCount). |

#### Returns

- `AXCL_SUCC`: The Context was created and made current successfully.
- `others`: Failure.

#### Note

- If [axclrtSetDevice](device_api.md#axclrtSetDevice) has not been called to activate the specified device, this function activates the device before creating the Context.
- Each explicitly created Context contains an implicitly created default Stream.
- Every explicitly created Context must be explicitly destroyed with [axclrtDestroyContext](#axclrtDestroyContext).
- Before destroying the Context, destroy all Streams explicitly created in it. [axclrtDestroyContext](#axclrtDestroyContext) destroys the default Stream.

#### Example

```c
 void working_thread(int device_id) {
     // Explicitly create a Context and bind it to the calling thread.
     axclrtContext context;
     if (axclrtCreateContext(&context, device_id) != AXCL_SUCC) {
         return;
     }

     // TODO: Tasks are submitted to the device associated with the Context.

     // Destroy the explicitly created Context when it is no longer needed.
     axclrtDestroyContext(context);
 }

 int main() {
     int32_t device_id = 0;
     axclInit("");
     axclrtSetDevice(device_id);

     start_working_thread(working_thread, device_id);
     join_working_thread();

     axclrtResetDevice(device_id);
     axclFinalize();
     return 0;
 }
```

#### Remark

[Context concept](../arch/concept.md#CONTEXT) | [axclrtDestroyContext](#axclrtDestroyContext) | [axclrtSetDevice](device_api.md#axclrtSetDevice) | [axclrtCreateStream](stream_api.md#axclrtCreateStream) | [axclrtDestroyStream](stream_api.md#axclrtDestroyStream)

<br>

<a id="axclrtDestroyContext"></a>

### axclrtDestroyContext

Destroy a Context created by [axclrtCreateContext](#axclrtCreateContext).

#### Function

```c
AXCL_EXPORT axclError axclrtDestroyContext(axclrtContext context);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| context | in | Context handle returned by [axclrtCreateContext](#axclrtCreateContext). |

#### Returns

- `AXCL_SUCC`: The Context was destroyed and its device activation reference was released successfully.
- `others`: Failure.

#### Note

- Before calling this function, destroy all Streams explicitly created in this Context.
- This function blocks until work in the Context's default Stream completes, and then destroys the default Stream automatically.
- After the Context is destroyed successfully, the runtime removes all bindings to it from all threads.
- This function cannot destroy the default Context created by [axclrtSetDevice](device_api.md#axclrtSetDevice). The default Context is destroyed by [axclrtResetDevice](device_api.md#axclrtResetDevice).

#### Remark

[Context concept](../arch/concept.md#CONTEXT) | [axclrtCreateContext](#axclrtCreateContext) | [axclrtCreateStream](stream_api.md#axclrtCreateStream) | [axclrtDestroyStream](stream_api.md#axclrtDestroyStream) | [axclrtSetDevice](device_api.md#axclrtSetDevice) | [axclrtResetDevice](device_api.md#axclrtResetDevice)

<br>

<a id="axclrtGetCurrentContext"></a>

### axclrtGetCurrentContext

Get the current Context of the calling thread.

#### Function

```c
AXCL_EXPORT axclError axclrtGetCurrentContext(axclrtContext *context);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| context | out | Receives the current Context handle on success. |

#### Returns

- `AXCL_SUCC`: The current Context was returned successfully.
- `others`: Failure.

#### Note

- The current Context is the most recently bound Context that has not been destroyed.
- If [axclrtSetCurrentContext](#axclrtSetCurrentContext) is called multiple times, this function returns the Context set by the most recent call.

#### Remark

[axclrtSetCurrentContext](#axclrtSetCurrentContext)

<br>

<a id="axclrtSetCurrentContext"></a>

### axclrtSetCurrentContext

Make a Context current for the calling thread.

#### Function

```c
AXCL_EXPORT axclError axclrtSetCurrentContext(axclrtContext context);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| context | in | Valid Context handle to bind. |

#### Returns

- `AXCL_SUCC`: The Context was made current successfully.
- `others`: Failure.

#### Note

- The same Context can be current in multiple threads at the same time. The caller must ensure that the Context remains valid while it is in use; otherwise, the application will behave abnormally.
- This function does not create a Context or increase the device activation reference count, so it does not extend the lifetime of the Context or device.
- If this function is called multiple times for a thread, the Context set by the most recent call takes effect.

#### Remark

[axclrtGetCurrentContext](#axclrtGetCurrentContext)
