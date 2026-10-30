# Device

## Index

- [axclrtDeviceCanAccessPeer](#axclrtDeviceCanAccessPeer): Query whether devices support data interaction.
- [axclrtDeviceDisablePeerAccess](#axclrtDeviceDisablePeerAccess): Disable data interaction from the current device to the specified device.
- [axclrtDeviceEnablePeerAccess](#axclrtDeviceEnablePeerAccess): Enable data interaction from the current device to the specified device.
- [axclrtDeviceGetBareTgid](#axclrtDeviceGetBareTgid): Get the bare Host TGID of the calling process in the initial PID namespace.
- [axclrtDevicePeerAccessStatus](#axclrtDevicePeerAccessStatus): Query data interaction enable status from source device to the specified device.
- [axclrtGetDevice](#axclrtGetDevice): Get the virtual device ID currently used by the calling thread.
- [axclrtGetDeviceCount](#axclrtGetDeviceCount): Get the number of devices visible to the current process.
- [axclrtGetDeviceInfo](#axclrtGetDeviceInfo): Get a device attribute value.
- [axclrtQueryDeviceStatus](#axclrtQueryDeviceStatus): Query device status.
- [axclrtRegDeviceStateCallback](#axclrtRegDeviceStateCallback): Register or unregister a device state callback.
- [axclrtResetDevice](#axclrtResetDevice): Decrement a device's activation reference count and release it when the count reaches 0.
- [axclrtResetDeviceForce](#axclrtResetDeviceForce): Forcibly release an active device.
- [axclrtSetDevice](#axclrtSetDevice): Activate a device and bind its default Context to the calling thread.
- [axclrtSynchronizeDevice](#axclrtSynchronizeDevice): Block until all work submitted to the device associated with the calling thread has completed.
- [axclrtSynchronizeDeviceWithTimeout](#axclrtSynchronizeDeviceWithTimeout): Block until work submitted to the device associated with the calling thread completes or the timeout expires.

<br>

## API

<a id="axclrtDeviceCanAccessPeer"></a>

### axclrtDeviceCanAccessPeer

Query whether devices support data interaction.

#### Function

```c
AXCL_EXPORT axclError axclrtDeviceCanAccessPeer(int32_t *canAccessPeer, int32_t deviceId, int32_t peerDeviceId);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| canAccessPeer | out | Receives 1 if supported, or 0 otherwise. Must not be NULL. |
| deviceId | in | Source virtual device ID visible to the current process. |
| peerDeviceId | in | Destination virtual device ID visible to the current process. Must differ from `deviceId`. |

#### Returns

- `AXCL_SUCC`: The access capability was returned successfully.
- `others`: Failure.

#### Note

- The device `deviceId` must be active; the capability is queried on that device.

<br>

<a id="axclrtDeviceDisablePeerAccess"></a>

### axclrtDeviceDisablePeerAccess

Disable data interaction from the current device to the specified device.

#### Function

```c
AXCL_EXPORT axclError axclrtDeviceDisablePeerAccess(int32_t peerDeviceId);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| peerDeviceId | in | Destination virtual device ID. Must differ from the current device. |

#### Returns

- `AXCL_SUCC`: Data interaction from the current device to `peerDeviceId` was disabled successfully.
- `others`: Failure.

#### Note

- The current device is the one that owns the calling thread's current Context.
- Disabling a permission that is not enabled succeeds.

<br>

<a id="axclrtDeviceEnablePeerAccess"></a>

### axclrtDeviceEnablePeerAccess

Enable data interaction from the current device to the specified device.

Data interaction enabled by this function is one-way. For example:

- If the current device ID is 0 and `peerDeviceId` is 1, it means device 0 can access data on device 1, but device 1 cannot access data on device 0.
- To allow device 1 to access data on device 0, switch to device 1 and call this function with `peerDeviceId` set to 0.

#### Function

```c
AXCL_EXPORT axclError axclrtDeviceEnablePeerAccess(int32_t peerDeviceId, uint32_t flags);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| peerDeviceId | in | Destination virtual device ID visible to the current process. Must differ from the current device. |
| flags | in | Reserved; must be 0. |

#### Returns

- `AXCL_SUCC`: Data interaction from the current device to `peerDeviceId` was enabled successfully.
- `others`: Failure.

#### Note

- The current device is the one that owns the calling thread's current Context.
- This function only records the permission; it does not check whether the devices can interact. Use [axclrtDeviceCanAccessPeer](#axclrtDeviceCanAccessPeer) to check the capability.
- The permission applies to the whole process and remains in effect until [axclrtDeviceDisablePeerAccess](#axclrtDeviceDisablePeerAccess) is called.

#### Remark

- [axclrtDeviceCanAccessPeer](#axclrtDeviceCanAccessPeer)
- [axclrtDeviceDisablePeerAccess](#axclrtDeviceDisablePeerAccess)
- [Inter-Device Copy](../../develop/arch/memory.md#memory-inter-device-copy)

<br>

<a id="axclrtDeviceGetBareTgid"></a>

### axclrtDeviceGetBareTgid

Get the bare Host TGID of the calling process in the initial PID namespace.

In containerized environments, returns the Host root namespace TGID required for cross-process IPC authorization whitelists.

#### Function

```c
AXCL_EXPORT axclError axclrtDeviceGetBareTgid(int32_t *bareTgid);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| bareTgid | out | Receives the Host-level bare TGID. Must not be NULL. |

#### Returns

- `AXCL_SUCC`: The bare TGID was returned successfully.
- `others`: Failure.

#### Remark

- [axclrtIpcMemSetImportPid](memory_api.md#axclrtIpcMemSetImportPid)

<br>

<a id="axclrtDevicePeerAccessStatus"></a>

### axclrtDevicePeerAccessStatus

Query data interaction enable status from source device to the specified device.

#### Function

```c
AXCL_EXPORT axclError axclrtDevicePeerAccessStatus(int32_t deviceId, int32_t peerDeviceId, int32_t *status);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| deviceId | in | Source virtual device ID visible to the current process. |
| peerDeviceId | in | Destination virtual device ID visible to the current process. |
| status | out | Receives 1 if enabled by [axclrtDeviceEnablePeerAccess](#axclrtDeviceEnablePeerAccess), or 0 otherwise. Must not be NULL. |

#### Returns

- `AXCL_SUCC`: The enable status was returned successfully.
- `others`: Failure.

<br>

<a id="axclrtGetDevice"></a>

### axclrtGetDevice

Get the virtual device ID currently used by the calling thread.

#### Function

```c
AXCL_EXPORT axclError axclrtGetDevice(int32_t *deviceId);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| deviceId | out | Receives the virtual device ID currently used by the calling thread. Must not be NULL. |

#### Returns

- `AXCL_SUCC`: The virtual device ID was returned successfully.
- `others`: Failure.

#### Note

- The device is the one that owns the calling thread's current Context. If the calling thread has no current Context, this function fails.

<br>

<a id="axclrtGetDeviceCount"></a>

### axclrtGetDeviceCount

Get the number of devices visible to the current process.

#### Function

```c
AXCL_EXPORT axclError axclrtGetDeviceCount(uint32_t *count);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| count | out | Receives the number of devices visible to the current process. Must not be NULL. |

#### Returns

- `AXCL_SUCC`: The number of devices visible to the current process was returned successfully.
- `others`: Failure.

#### Note

- This function returns the number of devices visible to the current process, not the number of active devices or the number of connected devices.
- The [AXCL_VISIBLE_DEVICES](../../appendix/environment_variables.md#AXCL_VISIBLE_DEVICES) environment variable controls which devices are visible to the current process.
- If [AXCL_VISIBLE_DEVICES](../../appendix/environment_variables.md#AXCL_VISIBLE_DEVICES) is not set, the visible device count is equal to the number of connected devices recognized by the driver, excluding devices whose information could not be read during [axclInit](system_api.md#axclInit).

<br>

<a id="axclrtGetDeviceInfo"></a>

### axclrtGetDeviceInfo

Get a device attribute value.

#### Function

```c
AXCL_EXPORT axclError axclrtGetDeviceInfo(int32_t deviceId, axclrtDevAttr attr, uint64_t *value);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| deviceId | in | Virtual device ID visible to the current process. |
| attr | in | Device attribute to query. Must be a valid [axclrtDevAttr](reference/enum.md#axclrtDevAttr) value below [AXCL_DEVICE_ATTR_BUTT](reference/enum.md#AXCL_DEVICE_ATTR_BUTT). |
| value | out | Receives the attribute value on success. Must not be NULL. |

#### Returns

- `AXCL_SUCC`: The attribute value was returned successfully.
- `others`: Failure.

#### Note

- Querying [AXCL_DEVICE_ATTR_UID](reference/enum.md#AXCL_DEVICE_ATTR_UID) fails if the device is not active.
- The UID is read through the calling thread's current Context. Make a Context of `deviceId` current before querying [AXCL_DEVICE_ATTR_UID](reference/enum.md#AXCL_DEVICE_ATTR_UID).

<br>

<a id="axclrtQueryDeviceStatus"></a>

### axclrtQueryDeviceStatus

Query device status.

#### Function

```c
AXCL_EXPORT axclError axclrtQueryDeviceStatus(int32_t deviceId, axclrtDeviceStatus *deviceStatus);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| deviceId | in | Virtual device ID visible to the current process. |
| deviceStatus | out | Receives the device availability status. Must not be NULL. |

#### Returns

- `AXCL_SUCC`: The device status was returned successfully.
- `others`: Failure.

#### Note

- [AXCL_RT_DEVICE_STATUS_NORMAL](reference/enum.md#AXCL_RT_DEVICE_STATUS_NORMAL) means the device is visible, exists, is active, and has not been marked offline.
- [AXCL_RT_DEVICE_STATUS_ABNORMAL](reference/enum.md#AXCL_RT_DEVICE_STATUS_ABNORMAL) means the device is visible and exists, but is inactive or marked offline.
- If the device is invisible or nonexistent, a failure is returned and `deviceStatus` is set to [AXCL_RT_DEVICE_STATUS_ABNORMAL](reference/enum.md#AXCL_RT_DEVICE_STATUS_ABNORMAL).

<br>

<a id="axclrtRegDeviceStateCallback"></a>

### axclrtRegDeviceStateCallback

Register or unregister a device state callback.

#### Function

```c
AXCL_EXPORT axclError axclrtRegDeviceStateCallback(axclrtDeviceStateCallback callback, void *args);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| callback | in | Callback function. Pass NULL to unregister the current callback. |
| args | in | User data passed to `callback`. Ignored when `callback` is NULL. |

#### Returns

- `AXCL_SUCC`: The callback was registered, replaced, or unregistered successfully.
- `others`: Failure.

#### Note

- Only one callback is stored for the process. Registering another callback replaces the previous one.
- The callback is invoked when a visible, active device goes offline, is removed, or the worker process serving this process on that device exits.
- These events report OFFLINE once until the device is successfully reopened. A worker process exit does not imply a board-wide failure.
- The callback runs on a runtime thread, not on the registering thread. Return from it promptly, and do not call [axclrtRegDeviceStateCallback](#axclrtRegDeviceStateCallback) from inside the callback.

<br>

<a id="axclrtResetDevice"></a>

### axclrtResetDevice

Decrement a device's activation reference count and release it when the count reaches 0.

#### Function

```c
AXCL_EXPORT axclError axclrtResetDevice(int32_t deviceId);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| deviceId | in | Virtual device ID visible to the current process. |

#### Returns

- `AXCL_SUCC`: The reference count was decremented, or the device was released successfully.
- `others`: Failure.

#### Note

- If references remain, this function only decrements the reference count. The Context bindings of all threads, including the calling thread, are unchanged; a thread bound to the default Context keeps it.
- When the final reference is released, the runtime waits for work in the default Stream to finish, then destroys the default Stream and default Context. Threads bound to the default Context become unbound; no other Context becomes current.
- Serialize device closure with [axclrtMallocHost](memory_api.md#axclrtMallocHost) and [axclrtFreeHost](memory_api.md#axclrtFreeHost) calls in the process.
- Destroy all explicitly created Streams and Contexts before releasing the final reference, in this order; otherwise, releasing the final reference fails:

  ```c
     axclrtDestroyStream -> axclrtDestroyContext -> axclrtResetDevice
  ```

#### Remark

- [axclrtSetDevice](#axclrtSetDevice)
- [axclrtDestroyContext](context_api.md#axclrtDestroyContext)
- [axclrtDestroyStream](stream_api.md#axclrtDestroyStream)

<br>

<a id="axclrtResetDeviceForce"></a>

### axclrtResetDeviceForce

Forcibly release an active device.

#### Function

```c
AXCL_EXPORT axclError axclrtResetDeviceForce(int32_t deviceId);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| deviceId | in | Virtual device ID visible to the current process. |

#### Returns

- `AXCL_SUCC`: The device was released and its reference count was reset to 0.
- `others`: Failure.

#### Note

- Unlike [axclrtResetDevice](#axclrtResetDevice), this function attempts to release the device immediately even when its reference count is greater than 1. It does not destroy explicitly created Contexts or Streams.
- Destroy all explicitly created Streams and Contexts before calling this function, in this order; otherwise, this function fails:

  ```c
     axclrtDestroyStream -> axclrtDestroyContext -> axclrtResetDeviceForce
  ```
- This function waits for work in the default Stream to finish, then destroys the default Stream and default Context. Threads bound to the default Context become unbound.
- Serialize this call with [axclrtMallocHost](memory_api.md#axclrtMallocHost) and [axclrtFreeHost](memory_api.md#axclrtFreeHost) calls in the process.

#### Remark

- [axclrtResetDevice](#axclrtResetDevice)
- [axclrtDestroyContext](context_api.md#axclrtDestroyContext)
- [axclrtDestroyStream](stream_api.md#axclrtDestroyStream)

<br>

<a id="axclrtSetDevice"></a>

### axclrtSetDevice

Activate a device and bind its default Context to the calling thread.

#### Function

```c
AXCL_EXPORT axclError axclrtSetDevice(int32_t deviceId);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| deviceId | in | Virtual device ID visible to the current process. Valid IDs are in the range [0, count - 1], where count is returned by [axclrtGetDeviceCount](#axclrtGetDeviceCount). |

#### Returns

- `AXCL_SUCC`: The device was activated and its default Context was made current successfully.
- `others`: Failure.

#### Note

- The first call activates the device and implicitly creates a default Context containing a default Stream. Later calls for the same device reuse these default resources and bind the calling thread to the shared default Context.
- The default Context replaces the calling thread's current Context, including one set by [axclrtCreateContext](context_api.md#axclrtCreateContext) or [axclrtSetCurrentContext](context_api.md#axclrtSetCurrentContext). It stays current until another Context is made current or the device is released. If this function fails, the binding is unchanged.
- The runtime maintains a process-wide reference count for each device. Each successful call to [axclrtSetDevice](#axclrtSetDevice) should be paired with [axclrtResetDevice](#axclrtResetDevice). The device is released when the count reaches 0.
- [axclrtCreateContext](context_api.md#axclrtCreateContext) also activates the specified device before creating an explicit Context.

#### Example

```c
 int main(int argc, char *argv[]) {
     axclInit("");

     axclrtSetDevice(0);
     axclrtResetDevice(0);

     axclFinalize();
     return 0;
 }
```

#### Remark

- [axclrtResetDevice](#axclrtResetDevice)
- [axclrtCreateContext](context_api.md#axclrtCreateContext)

<br>

<a id="axclrtSynchronizeDevice"></a>

### axclrtSynchronizeDevice

Block until all work submitted to the device associated with the calling thread has completed.

#### Function

```c
AXCL_EXPORT axclError axclrtSynchronizeDevice();
```

#### Parameters

N/A

#### Returns

- `AXCL_SUCC`: All work on the device has completed.
- `others`: Failure.

#### Note

- The device is the one that owns the calling thread's current Context, and it must be active.
- This function synchronizes every Stream in every Context of that device in the process, including Streams used by other threads.
- Errors of asynchronous tasks are reported as described in [axclrtSynchronizeStream](stream_api.md#axclrtSynchronizeStream). Synchronization stops at the first Stream that reports an error.

<br>

<a id="axclrtSynchronizeDeviceWithTimeout"></a>

### axclrtSynchronizeDeviceWithTimeout

Block until work submitted to the device associated with the calling thread completes or the timeout expires.

#### Function

```c
AXCL_EXPORT axclError axclrtSynchronizeDeviceWithTimeout(int32_t timeout);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| timeout | in | Timeout in milliseconds. A negative value, such as -1, waits indefinitely. |

#### Returns

- `AXCL_SUCC`: All work on the device has completed.
- `others`: Failure.

#### Note

- The behavior is the same as [axclrtSynchronizeDevice](#axclrtSynchronizeDevice), except that each Stream is waited for up to `timeout`. The total wait can therefore exceed `timeout`.
- A timeout does not cancel submitted work.
