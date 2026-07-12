# Device

## Index

- [axclrtGetDevice](#axclrtGetDevice)
- [axclrtGetDeviceCount](#axclrtGetDeviceCount)
- [axclrtGetDeviceInfo](#axclrtGetDeviceInfo)
- [axclrtQueryDeviceStatus](#axclrtQueryDeviceStatus)
- [axclrtResetDevice](#axclrtResetDevice)
- [axclrtResetDeviceForce](#axclrtResetDeviceForce)
- [axclrtSetDevice](#axclrtSetDevice)
- [axclrtSynchronizeDevice](#axclrtSynchronizeDevice)
- [axclrtSynchronizeDeviceWithTimeout](#axclrtSynchronizeDeviceWithTimeout)

<br>

## API

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

<a id="axclrtGetDeviceInfo"></a>

### axclrtGetDeviceInfo

Get device attribute value.

#### Function

```c
AXCL_EXPORT axclError axclrtGetDeviceInfo(int32_t deviceId, axclrtDevAttr attr, uint64_t *value);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| deviceId | in | virtual device id |
| attr | in | device attribute type |
| value | out | attribute value |

#### Returns

- `AXCL_SUCC`: success.
- `others`: failure.

#### Note

[AXCL_DEVICE_ATTR_PHYSICAL_DEVICE_ID](reference/enum.md#AXCL_DEVICE_ATTR_PHYSICAL_DEVICE_ID) returns the physical device id mapped from the input virtual device id.
[AXCL_DEVICE_ATTR_TYPE](reference/enum.md#AXCL_DEVICE_ATTR_TYPE) returns device type: 0 local, 1 PCIe, 2 USB.
[AXCL_DEVICE_ATTR_UID](reference/enum.md#AXCL_DEVICE_ATTR_UID) returns device UID and requires the device to be active.
[AXCL_DEVICE_ATTR_PCIE_DOMAIN](reference/enum.md#AXCL_DEVICE_ATTR_PCIE_DOMAIN), [AXCL_DEVICE_ATTR_PCIE_BUS](reference/enum.md#AXCL_DEVICE_ATTR_PCIE_BUS), [AXCL_DEVICE_ATTR_PCIE_DEV](reference/enum.md#AXCL_DEVICE_ATTR_PCIE_DEV), and [AXCL_DEVICE_ATTR_PCIE_FUNC](reference/enum.md#AXCL_DEVICE_ATTR_PCIE_FUNC) return PCIe BDF fields.

<br>

<a id="axclrtQueryDeviceStatus"></a>

### axclrtQueryDeviceStatus

Query whether a visible device is currently available.

#### Function

```c
AXCL_EXPORT axclError axclrtQueryDeviceStatus(int32_t deviceId, axclrtDeviceStatus *deviceStatus);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| deviceId | in | virtual device id |
| deviceStatus | out | queried device status |

#### Returns

- `AXCL_SUCC`: success.
- `AXCL_ERR_RT_NULL_POINTER`: deviceStatus is nullptr.

#### Note

The input deviceId is a virtual device id visible to current process.
This API reports a lightweight availability status from the current process view.
The current implementation judges availability by whether the device exists and is active.
[AXCL_RT_DEVICE_STATUS_NORMAL](reference/enum.md#AXCL_RT_DEVICE_STATUS_NORMAL) means the device exists and is active, and does not independently represent the latest control online/offline state.
[AXCL_RT_DEVICE_STATUS_ABNORMAL](reference/enum.md#AXCL_RT_DEVICE_STATUS_ABNORMAL) covers device not visible, not found, or not active.

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

<a id="axclrtResetDeviceForce"></a>

### axclrtResetDeviceForce

Force deactivate device and release runtime resources on the device.

#### Function

```c
AXCL_EXPORT axclError axclrtResetDeviceForce(int32_t deviceId);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| deviceId | in | virtual device id |

#### Returns

- `AXCL_SUCC`: success.
- `AXCL_ERR_RT_DEVICE_NOT_EXIST`: device does not exist.
- `AXCL_ERR_RT_DEVICE_NOT_ACTIVE`: device is not active.
- `AXCL_ERR_RT_FAIL`: force cleanup failed.

#### Note

The input deviceId is a virtual device id visible to current process.
Unlike [axclrtResetDevice](#axclrtResetDevice), this API forcibly releases explicit contexts and streams that are still alive.
After success, all host-side handles associated with the device become invalid.

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
