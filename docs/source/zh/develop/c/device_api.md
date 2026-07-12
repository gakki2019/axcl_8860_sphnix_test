# 设备

## 1. 目录

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

## 2. API

<a id="axclrtGetDevice"></a>

### 2.1. axclrtGetDevice

获取当前调用线程的设备 ID。

#### 2.1.1. 函数

```c
AXCL_EXPORT axclError axclrtGetDevice(int32_t *deviceId);
```

#### 2.1.2. 参数

| 名称     | 方向 | 说明    |
| -------- | ---- | ------- |
| deviceId | out  | 设备 ID |

#### 2.1.3. 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

<br>

<a id="axclrtGetDeviceCount"></a>

### 2.2. axclrtGetDeviceCount

获取设备数量。

#### 2.2.1. 函数

```c
AXCL_EXPORT axclError axclrtGetDeviceCount(uint32_t *count);
```

#### 2.2.2. 参数

| 名称  | 方向 | 说明     |
| ----- | ---- | -------- |
| count | out  | 设备数量 |

#### 2.2.3. 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

<br>

<a id="axclrtGetDeviceInfo"></a>

### 2.3. axclrtGetDeviceInfo

获取设备属性值。

#### 2.3.1. 函数

```c
AXCL_EXPORT axclError axclrtGetDeviceInfo(int32_t deviceId, axclrtDevAttr attr, uint64_t *value);
```

#### 2.3.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| deviceId | in | 逻辑设备 ID |
| attr | in | 设备属性类型 |
| value | out | 属性值 |

#### 2.3.3. 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

#### 2.3.4. 说明

[AXCL_DEVICE_ATTR_PHYSICAL_DEVICE_ID](reference/enum.md#AXCL_DEVICE_ATTR_PHYSICAL_DEVICE_ID) 返回输入逻辑设备 ID 映射到的物理设备 ID。
[AXCL_DEVICE_ATTR_TYPE](reference/enum.md#AXCL_DEVICE_ATTR_TYPE) 返回设备类型：0 表示本地设备，1 表示 PCIe 设备，2 表示 USB 设备。
[AXCL_DEVICE_ATTR_UID](reference/enum.md#AXCL_DEVICE_ATTR_UID) 返回设备 UID，要求设备已激活。
[AXCL_DEVICE_ATTR_PCIE_DOMAIN](reference/enum.md#AXCL_DEVICE_ATTR_PCIE_DOMAIN)、[AXCL_DEVICE_ATTR_PCIE_BUS](reference/enum.md#AXCL_DEVICE_ATTR_PCIE_BUS)、[AXCL_DEVICE_ATTR_PCIE_DEV](reference/enum.md#AXCL_DEVICE_ATTR_PCIE_DEV) 和 [AXCL_DEVICE_ATTR_PCIE_FUNC](reference/enum.md#AXCL_DEVICE_ATTR_PCIE_FUNC) 返回 PCIe BDF 字段。

<br>

<a id="axclrtQueryDeviceStatus"></a>

### 2.4. axclrtQueryDeviceStatus

查询当前可见设备是否可用。

#### 2.4.1. 函数

```c
AXCL_EXPORT axclError axclrtQueryDeviceStatus(int32_t deviceId, axclrtDeviceStatus *deviceStatus);
```

#### 2.4.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| deviceId | in | 逻辑设备 ID |
| deviceStatus | out | 查询到的设备状态 |

#### 2.4.3. 返回值

- `AXCL_SUCC`：成功。
- `AXCL_ERR_RT_NULL_POINTER`：deviceStatus 为空指针。

#### 2.4.4. 说明

输入的 deviceId 是当前进程可见的逻辑设备 ID。
该 API 从当前进程视角报告轻量级可用状态。
当前实现通过设备是否存在且已激活来判断可用性。
[AXCL_RT_DEVICE_STATUS_NORMAL](reference/enum.md#AXCL_RT_DEVICE_STATUS_NORMAL) 表示设备存在且已激活，不单独表示最新的控制面在线/离线状态。
[AXCL_RT_DEVICE_STATUS_ABNORMAL](reference/enum.md#AXCL_RT_DEVICE_STATUS_ABNORMAL) 覆盖设备不可见、未找到或未激活等状态。

<br>

<a id="axclrtResetDevice"></a>

### 2.5. axclrtResetDevice

停用设备。

#### 2.5.1. 函数

```c
AXCL_EXPORT axclError axclrtResetDevice(int32_t deviceId);
```

#### 2.5.2. 参数

| 名称     | 方向 | 说明    |
| -------- | ---- | ------- |
| deviceId | in   | 设备 ID |

#### 2.5.3. 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

#### 2.5.4. 说明

在停用设备之前，所有上下文和流都会等待同步完成。
所有显式创建的上下文和流都应在停用前销毁，也就是说：[axclrtDestroyStream](stream_api.md#axclrtDestroyStream) -> [axclrtDestroyContext](context_api.md#axclrtDestroyContext) -> [axclrtResetDevice](#axclrtResetDevice)

<br>

<a id="axclrtResetDeviceForce"></a>

### 2.6. axclrtResetDeviceForce

强制停用设备并释放该设备上的 runtime 资源。

#### 2.6.1. 函数

```c
AXCL_EXPORT axclError axclrtResetDeviceForce(int32_t deviceId);
```

#### 2.6.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| deviceId | in | 逻辑设备 ID |

#### 2.6.3. 返回值

- `AXCL_SUCC`：成功。
- `AXCL_ERR_RT_DEVICE_NOT_EXIST`：设备不存在。
- `AXCL_ERR_RT_DEVICE_NOT_ACTIVE`：设备未激活。
- `AXCL_ERR_RT_FAIL`：强制清理失败。

#### 2.6.4. 说明

输入的 deviceId 是当前进程可见的逻辑设备 ID。
不同于 [axclrtResetDevice](#axclrtResetDevice)，该 API 会强制释放仍然存活的显式 Context 和 Stream。
调用成功后，与该设备关联的所有 Host 侧句柄都会失效。

<br>

<a id="axclrtSetDevice"></a>

### 2.7. axclrtSetDevice

激活设备。

#### 2.7.1. 函数

```c
AXCL_EXPORT axclError axclrtSetDevice(int32_t deviceId);
```

#### 2.7.2. 参数

| 名称     | 方向 | 说明                          |
| -------- | ---- | ----------------------------- |
| deviceId | in   | 设备 ID，[0 - (设备数量 - 1)] |

#### 2.7.3. 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

#### 2.7.4. 说明

[axclrtSetDevice](#axclrtSetDevice) 可以被多次调用，对应地调用 [axclrtResetDevice](#axclrtResetDevice) 来停用。
首次激活设备时，系统会创建一个默认上下文和一个默认流。
在不同线程中调用 [axclrtSetDevice](#axclrtSetDevice) 激活同一设备时，这些线程将使用相同的默认上下文和默认流。

#### 2.7.5. 参考

[axclrtResetDevice](#axclrtResetDevice) | [axclrtCreateContext](context_api.md#axclrtCreateContext)

<br>

<a id="axclrtSynchronizeDevice"></a>

### 2.8. axclrtSynchronizeDevice

阻塞当前线程，直到与当前上下文绑定的设备完成。

#### 2.8.1. 函数

```c
AXCL_EXPORT axclError axclrtSynchronizeDevice();
```

#### 2.8.2. 参数

不适用

#### 2.8.3. 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

<br>

<a id="axclrtSynchronizeDeviceWithTimeout"></a>

### 2.9. axclrtSynchronizeDeviceWithTimeout

阻塞当前线程，直到与当前上下文绑定的设备在超时时间内完成。

#### 2.9.1. 函数

```c
AXCL_EXPORT axclError axclrtSynchronizeDeviceWithTimeout(int32_t timeout);
```

#### 2.9.2. 参数

| 名称    | 方向 | 说明                                  |
| ------- | ---- | ------------------------------------- |
| timeout | in   | 超时时间，单位为毫秒；-1 表示无超时。 |

#### 2.9.3. 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

