# Device

## Index

- [axclrtDeviceGetUid](#axclrtDeviceGetUid)
- [axclrtGetDevice](#axclrtGetDevice)
- [axclrtGetDeviceCount](#axclrtGetDeviceCount)
- [axclrtResetDevice](#axclrtResetDevice)
- [axclrtSetDevice](#axclrtSetDevice)
- [axclrtSynchronizeDevice](#axclrtSynchronizeDevice)
- [axclrtSynchronizeDeviceWithTimeout](#axclrtSynchronizeDeviceWithTimeout)

<br>

## API

<a id="axclrtDeviceGetUid"></a>

### axclrtDeviceGetUid

Get the UID of a device.

#### Function

```c
AXCL_EXPORT axclError axclrtDeviceGetUid(int32_t deviceId, uint64_t *uid);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| deviceId | in | device id |
| uid | out | UID of the device |

#### Returns

- `AXCL_SUCC`: success.
- `others`: failure.

<br>

<a id="axclrtGetDevice"></a>

### axclrtGetDevice

Get device id of current calling thread.

#### Function

```c
AXCL_EXPORT axclError axclrtGetDevice(int32_t *deviceId);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| deviceId | out | device id |

#### Returns

- `AXCL_SUCC`: success.
- `others`: failure.

<br>

<a id="axclrtGetDeviceCount"></a>

### axclrtGetDeviceCount

Get the number of devices.

#### Function

```c
AXCL_EXPORT axclError axclrtGetDeviceCount(uint32_t *count);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| count | out | number of devices |

#### Returns

- `AXCL_SUCC`: success.
- `others`: failure.

<br>

<a id="axclrtResetDevice"></a>

### axclrtResetDevice

Deactivate device.

#### Function

```c
AXCL_EXPORT axclError axclrtResetDevice(int32_t deviceId);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| deviceId | in | device id |

#### Returns

- `AXCL_SUCC`: success.
- `others`: failure.

#### Note

Before deactive, all contexts and streams will wait for finished synchronization.
All explicit created contexts and streams should be destroyed before deactive, that means: [axclrtDestroyStream](stream_api.md#axclrtDestroyStream) -> [axclrtDestroyContext](context_api.md#axclrtDestroyContext) -> [axclrtResetDevice](#axclrtResetDevice)

<br>

<a id="axclrtSetDevice"></a>

### axclrtSetDevice

Activate device.

#### Function

```c
AXCL_EXPORT axclError axclrtSetDevice(int32_t deviceId);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| deviceId | in | device id, [0 - (device count - 1)] |

#### Returns

- `AXCL_SUCC`: success.
- `others`: failure.

#### Note

[axclrtSetDevice](#axclrtSetDevice) can be called multiple times, correspondingly call [axclrtResetDevice](#axclrtResetDevice) to deactivate.
When the 1st time to activate the device, the system will create a default context and a default stream.
Invoke [axclrtSetDevice](#axclrtSetDevice) to activate the same device in different threads, those threads use the same default context and default stream.

#### Remark

[axclrtResetDevice](#axclrtResetDevice) | [axclrtCreateContext](context_api.md#axclrtCreateContext)

<br>

<a id="axclrtSynchronizeDevice"></a>

### axclrtSynchronizeDevice

Block the current thread until the device bound to the current context has completed.

#### Function

```c
AXCL_EXPORT axclError axclrtSynchronizeDevice();
```

#### Parameters

N/A

#### Returns

- `AXCL_SUCC`: success.
- `others`: failure.

<br>

<a id="axclrtSynchronizeDeviceWithTimeout"></a>

### axclrtSynchronizeDeviceWithTimeout

Block the current thread until the device which is bound to the current context has completed in timeout.

#### Function

```c
AXCL_EXPORT axclError axclrtSynchronizeDeviceWithTimeout(int32_t timeout);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| timeout | in | timeout in milliseconds, -1 for no timeout. |

#### Returns

- `AXCL_SUCC`: success.
- `others`: failure.
