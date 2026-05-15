# 设备 API

## 目录

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

获取设备的 UID。

#### 函数

```c
AXCL_EXPORT axclError axclrtDeviceGetUid(int32_t deviceId, uint64_t *uid);
```

#### 参数

| 名称     | 方向 | 说明     |
| -------- | ---- | -------- |
| deviceId | in   | 设备 ID  |
| uid      | out  | 设备 UID |

#### 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

<br>

<a id="axclrtGetDevice"></a>

### axclrtGetDevice

获取当前调用线程的设备 ID。

#### 函数

```c
AXCL_EXPORT axclError axclrtGetDevice(int32_t *deviceId);
```

#### 参数

| 名称     | 方向 | 说明    |
| -------- | ---- | ------- |
| deviceId | out  | 设备 ID |

#### 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

<br>

<a id="axclrtGetDeviceCount"></a>

### axclrtGetDeviceCount

获取设备数量。

#### 函数

```c
AXCL_EXPORT axclError axclrtGetDeviceCount(uint32_t *count);
```

#### 参数

| 名称  | 方向 | 说明     |
| ----- | ---- | -------- |
| count | out  | 设备数量 |

#### 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

<br>

<a id="axclrtResetDevice"></a>

### axclrtResetDevice

停用设备。

#### 函数

```c
AXCL_EXPORT axclError axclrtResetDevice(int32_t deviceId);
```

#### 参数

| 名称     | 方向 | 说明    |
| -------- | ---- | ------- |
| deviceId | in   | 设备 ID |

#### 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

#### 说明

在停用设备之前，所有上下文和流都会等待同步完成。
所有显式创建的上下文和流都应在停用前销毁，也就是说：[axclrtDestroyStream](stream_api.md#axclrtDestroyStream) -> [axclrtDestroyContext](context_api.md#axclrtDestroyContext) -> [axclrtResetDevice](#axclrtResetDevice)

<br>

<a id="axclrtSetDevice"></a>

### axclrtSetDevice

激活设备。

#### 函数

```c
AXCL_EXPORT axclError axclrtSetDevice(int32_t deviceId);
```

#### 参数

| 名称     | 方向 | 说明                          |
| -------- | ---- | ----------------------------- |
| deviceId | in   | 设备 ID，[0 - (设备数量 - 1)] |

#### 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

#### 说明

[axclrtSetDevice](#axclrtSetDevice) 可以被多次调用，对应地调用 [axclrtResetDevice](#axclrtResetDevice) 来停用。
首次激活设备时，系统会创建一个默认上下文和一个默认流。
在不同线程中调用 [axclrtSetDevice](#axclrtSetDevice) 激活同一设备时，这些线程将使用相同的默认上下文和默认流。

#### 参考

[axclrtResetDevice](#axclrtResetDevice) | [axclrtCreateContext](context_api.md#axclrtCreateContext)

<br>

<a id="axclrtSynchronizeDevice"></a>

### axclrtSynchronizeDevice

阻塞当前线程，直到与当前上下文绑定的设备完成。

#### 函数

```c
AXCL_EXPORT axclError axclrtSynchronizeDevice();
```

#### 参数

不适用

#### 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

<br>

<a id="axclrtSynchronizeDeviceWithTimeout"></a>

### axclrtSynchronizeDeviceWithTimeout

阻塞当前线程，直到与当前上下文绑定的设备在超时时间内完成。

#### 函数

```c
AXCL_EXPORT axclError axclrtSynchronizeDeviceWithTimeout(int32_t timeout);
```

#### 参数

| 名称    | 方向 | 说明                                  |
| ------- | ---- | ------------------------------------- |
| timeout | in   | 超时时间，单位为毫秒；-1 表示无超时。 |

#### 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。
