# Context

## Index

- [axclrtCreateContext](#axclrtCreateContext): Explicitly create a Context and bind it to the calling thread.
- [axclrtDestroyContext](#axclrtDestroyContext): Destroy a Context explicitly created by [axclrtCreateContext](#axclrtCreateContext).
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
| context | out | Receives the created Context handle on success. Must not be NULL. |
| deviceId | in | Virtual device ID visible to the current process. Valid IDs are in the range [0, count - 1], where count is returned by [axclrtGetDeviceCount](device_api.md#axclrtGetDeviceCount). |

#### Returns

- `AXCL_SUCC`: The Context was created and made current successfully.
- `others`: Failure.

#### Note

- On success, this function adds one activation reference to the specified device, opening the device first if it is not active. [axclrtDestroyContext](#axclrtDestroyContext) releases that reference.
- The new Context replaces the calling thread's current Context, including the default Context bound by [axclrtSetDevice](device_api.md#axclrtSetDevice). If this function fails, the binding is unchanged.
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

- [Context concept](../arch/concept.md#CONTEXT)
- [axclrtDestroyContext](#axclrtDestroyContext)
- [axclrtSetDevice](device_api.md#axclrtSetDevice)
- [axclrtCreateStream](stream_api.md#axclrtCreateStream)
- [axclrtDestroyStream](stream_api.md#axclrtDestroyStream)

<br>

<a id="axclrtDestroyContext"></a>

### axclrtDestroyContext

Destroy a Context explicitly created by [axclrtCreateContext](#axclrtCreateContext).

#### Function

```c
AXCL_EXPORT axclError axclrtDestroyContext(axclrtContext context);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| context | in | Context handle returned by [axclrtCreateContext](#axclrtCreateContext). Must not be NULL and must refer to an existing Context; a Context that has already been destroyed does not exist. |

#### Returns

- `AXCL_SUCC`: The Context was destroyed and its device activation reference was released successfully.
- `others`: Failure.

#### Note

- Before calling this function, destroy all Streams explicitly created in this Context; otherwise, this function fails and the Context is not destroyed.
- This function blocks until work in the Context's default Stream completes, and then destroys the default Stream automatically.
- After the Context is destroyed successfully, the runtime removes all bindings to it from all threads. A thread whose current Context is destroyed becomes unbound: neither an earlier Context nor the default Context becomes current again. Call [axclrtSetCurrentContext](#axclrtSetCurrentContext) or [axclrtSetDevice](device_api.md#axclrtSetDevice) before calling APIs that need a current Context.
- This function releases the device activation reference held by the Context. If that is the final reference, the device is closed; serialize such a call with [axclrtMallocHost](memory_api.md#axclrtMallocHost) and [axclrtFreeHost](memory_api.md#axclrtFreeHost) calls in the process. If an unpaired [axclrtResetDevice](device_api.md#axclrtResetDevice) has already released that reference, the Context is destroyed but this function returns an error.
- This function cannot destroy the default Context created by [axclrtSetDevice](device_api.md#axclrtSetDevice). The default Context is destroyed by [axclrtResetDevice](device_api.md#axclrtResetDevice).
- If multiple threads destroy the same Context concurrently, exactly one call succeeds; the others fail and release no device activation reference.

#### Remark

- [Context concept](../arch/concept.md#CONTEXT)
- [axclrtCreateContext](#axclrtCreateContext)
- [axclrtCreateStream](stream_api.md#axclrtCreateStream)
- [axclrtDestroyStream](stream_api.md#axclrtDestroyStream)
- [axclrtSetDevice](device_api.md#axclrtSetDevice)
- [axclrtResetDevice](device_api.md#axclrtResetDevice)

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
| context | out | Receives the current Context handle on success. Must not be NULL. |

#### Returns

- `AXCL_SUCC`: The current Context was returned successfully.
- `others`: Failure.

#### Note

- If the calling thread has no current Context, this function fails.
- The current Context is the one set by the most recent successful [axclrtCreateContext](#axclrtCreateContext), [axclrtSetCurrentContext](#axclrtSetCurrentContext), or [axclrtSetDevice](device_api.md#axclrtSetDevice) call in the calling thread.
- If that Context has been destroyed, or its device has been released, the thread has no current Context.
- Bindings belong to the thread and are released when the thread exits.

#### Remark

- [axclrtSetCurrentContext](#axclrtSetCurrentContext)

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
| context | in | Context handle to bind. Must not be NULL and must refer to an existing Context. A destroyed Context, or the default Context of a device that has been released, does not exist. |

#### Returns

- `AXCL_SUCC`: The Context was made current successfully.
- `others`: Failure.

#### Note

- If this function fails, the calling thread's binding is unchanged.
- The same Context can be current in multiple threads at the same time. The caller must ensure that the Context remains valid while it is in use; otherwise, the application will behave abnormally.
- This function does not create a Context or increase the device activation reference count, so it does not extend the lifetime of the Context or device.
- If this function is called multiple times for a thread, the Context set by the most recent call takes effect.
- The Context replaces the calling thread's current Context, including the default Context bound by [axclrtSetDevice](device_api.md#axclrtSetDevice). Contexts are not stacked: an earlier Context is not restored when this one is destroyed. To switch temporarily, save the result of [axclrtGetCurrentContext](#axclrtGetCurrentContext) and set it again afterwards.

#### Remark

- [axclrtGetCurrentContext](#axclrtGetCurrentContext)
