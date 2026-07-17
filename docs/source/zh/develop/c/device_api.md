# 设备

## 1. 目录

- [axclrtGetDevice](#axclrtGetDevice)
- [axclrtGetDeviceCount](#axclrtGetDeviceCount)
- [axclrtGetDeviceInfo](#axclrtGetDeviceInfo)
- [axclrtQueryDeviceStatus](#axclrtQueryDeviceStatus)
- [axclrtRegDeviceStateCallback](#axclrtRegDeviceStateCallback)
- [axclrtResetDevice](#axclrtResetDevice)
- [axclrtResetDeviceForce](#axclrtResetDeviceForce)
- [axclrtSetDevice](#axclrtSetDevice)
- [axclrtSynchronizeDevice](#axclrtSynchronizeDevice)
- [axclrtSynchronizeDeviceWithTimeout](#axclrtSynchronizeDeviceWithTimeout)

<br>

## 2. API

<a id="axclrtGetDevice"></a>

### 2.1. axclrtGetDevice

获取调用线程正在使用的虚拟设备 ID。

#### 2.1.1. 函数

```c
AXCL_EXPORT axclError axclrtGetDevice(int32_t *deviceId);
```

#### 2.1.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| deviceId | out | 调用线程正在使用的虚拟设备 ID。 |

#### 2.1.3. 返回值

- `AXCL_SUCC`：成功。
- 其他错误：失败。

<br>

<a id="axclrtGetDeviceCount"></a>

### 2.2. axclrtGetDeviceCount

获取当前进程可见的设备数量。

#### 2.2.1. 函数

```c
AXCL_EXPORT axclError axclrtGetDeviceCount(uint32_t *count);
```

#### 2.2.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| count | out | 当前进程可见的设备数量。 |

#### 2.2.3. 返回值

- `AXCL_SUCC`：成功返回当前进程可见的设备数量。
- 其他错误：失败。

#### 2.2.4. 说明

- 本接口返回的是当前进程可见的设备数量，不是已激活的设备数量，也不是连接的设备数量。
- 环境变量 [AXCL_VISIBLE_DEVICES](../arch/concept.md#AXCL_VISIBLE_DEVICES) 用于控制可见的设备数量。
- 未配置环境变量 [AXCL_VISIBLE_DEVICES](../arch/concept.md#AXCL_VISIBLE_DEVICES) 时，可见设备数量等于驱动能够识别的已连接设备数量。

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
| deviceId | in | 当前进程可见的虚拟设备 ID。 |
| attr | in | 要查询的设备属性。 |
| value | out | 属性值。 |

#### 2.3.3. 返回值

- `AXCL_SUCC`：成功返回属性值。
- 其他错误：失败。

<br>

<a id="axclrtQueryDeviceStatus"></a>

### 2.4. axclrtQueryDeviceStatus

查询设备状态。

#### 2.4.1. 函数

```c
AXCL_EXPORT axclError axclrtQueryDeviceStatus(int32_t deviceId, axclrtDeviceStatus *deviceStatus);
```

#### 2.4.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| deviceId | in | 当前进程可见的虚拟设备 ID。 |
| deviceStatus | out | 设备可用状态。 |

#### 2.4.3. 返回值

- `AXCL_SUCC`：成功返回设备状态。
- 其他错误：失败。

#### 2.4.4. 说明

- [AXCL_RT_DEVICE_STATUS_NORMAL](reference/enum.md#AXCL_RT_DEVICE_STATUS_NORMAL) 表示设备对当前进程可见、设备存在且已激活，并且未被标记为离线。
- [AXCL_RT_DEVICE_STATUS_ABNORMAL](reference/enum.md#AXCL_RT_DEVICE_STATUS_ABNORMAL) 表示设备不可见、不存在、未激活或已被标记为离线。

<br>

<a id="axclrtRegDeviceStateCallback"></a>

### 2.5. axclrtRegDeviceStateCallback

注册或注销设备状态回调函数。

#### 2.5.1. 函数

```c
AXCL_EXPORT axclError axclrtRegDeviceStateCallback(axclrtDeviceStateCallback callback, void *args);
```

#### 2.5.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| callback | in | 回调函数。传入 NULL 注销当前回调函数。 |
| args | in | 传递给 callback 的用户数据。callback 为 NULL 时忽略该参数。 |

#### 2.5.3. 返回值

- `AXCL_SUCC`：成功注册、替换或注销回调函数。

#### 2.5.4. 说明

- 一个进程只保存一个回调函数，再次注册会替换先前的回调函数。
- 当检测到当前进程可见且已激活的设备离线时，会调用该回调函数。

<br>

<a id="axclrtResetDevice"></a>

### 2.6. axclrtResetDevice

将设备激活引用计数减 1，引用计数变为 0 时释放设备。

#### 2.6.1. 函数

```c
AXCL_EXPORT axclError axclrtResetDevice(int32_t deviceId);
```

#### 2.6.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| deviceId | in | 当前进程可见的虚拟设备 ID。 |

#### 2.6.3. 返回值

- `AXCL_SUCC`：成功将引用计数减 1，或成功释放设备。
- 其他错误：失败。

#### 2.6.4. 说明

- 如果设备仍有其他引用，本函数只将引用计数减 1，并解除当前调用线程与共享默认 Context 的绑定。
- 释放最后一个引用时，将等待默认 Stream 中的任务完成，然后销毁默认 Stream 和默认 Context。
- 释放最后一个引用前，必须按以下顺序销毁所有显式创建的 Stream 和 Context：

  ```c
     axclrtDestroyStream -> axclrtDestroyContext -> axclrtResetDevice
  ```

#### 2.6.5. 参考

[axclrtSetDevice](#axclrtSetDevice) | [axclrtDestroyContext](context_api.md#axclrtDestroyContext) | [axclrtDestroyStream](stream_api.md#axclrtDestroyStream)

<br>

<a id="axclrtResetDeviceForce"></a>

### 2.7. axclrtResetDeviceForce

强制释放已激活的设备。

#### 2.7.1. 函数

```c
AXCL_EXPORT axclError axclrtResetDeviceForce(int32_t deviceId);
```

#### 2.7.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| deviceId | in | 当前进程可见的虚拟设备 ID。 |

#### 2.7.3. 返回值

- `AXCL_SUCC`：成功释放设备并将引用计数重置为 0。
- 其他错误：失败。

#### 2.7.4. 说明

- 与 [axclrtResetDevice](#axclrtResetDevice) 不同，即使引用计数大于 1，本函数也会尝试立即释放设备。本函数不会销毁显式创建的 Context 或 Stream。
- 调用本函数前，必须按以下顺序销毁所有显式创建的 Stream 和 Context：

  ```c
     axclrtDestroyStream -> axclrtDestroyContext -> axclrtResetDeviceForce
  ```
- 等待默认 Stream 中的任务完成，然后销毁默认 Stream 和默认 Context。

#### 2.7.5. 参考

[axclrtResetDevice](#axclrtResetDevice) | [axclrtDestroyContext](context_api.md#axclrtDestroyContext) | [axclrtDestroyStream](stream_api.md#axclrtDestroyStream)

<br>

<a id="axclrtSetDevice"></a>

### 2.8. axclrtSetDevice

激活设备，并将该设备的默认 Context 绑定到当前调用线程。

#### 2.8.1. 函数

```c
AXCL_EXPORT axclError axclrtSetDevice(int32_t deviceId);
```

#### 2.8.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| deviceId | in | 当前进程可见的虚拟设备 ID。有效范围为 [0, count - 1]，count 由 [axclrtGetDeviceCount](#axclrtGetDeviceCount) 返回。 |

#### 2.8.3. 返回值

- `AXCL_SUCC`：成功激活设备。
- 其他错误：失败。

#### 2.8.4. 说明

- 首次调用将激活设备，并隐式创建一个包含默认 Stream 的默认 Context。之后对同一设备的调用会复用这些默认资源，并将当前调用线程绑定到共享的默认 Context。
- 为每个设备维护进程级引用计数。每次成功调用 [axclrtSetDevice](#axclrtSetDevice) 都应与 [axclrtResetDevice](#axclrtResetDevice) 成对使用。引用计数变为 0 时才会释放设备。
- [axclrtCreateContext](context_api.md#axclrtCreateContext) 在创建显式 Context 前也会激活指定设备。

#### 2.8.5. 示例

```c
 int main(int argc, char *argv[]) {
     axclInit("");

     axclrtSetDevice(0);
     axclrtResetDevice(0);

     axclFinalize();
     return 0;
 }
```

#### 2.8.6. 参考

[axclrtResetDevice](#axclrtResetDevice) | [axclrtCreateContext](context_api.md#axclrtCreateContext)

<br>

<a id="axclrtSynchronizeDevice"></a>

### 2.9. axclrtSynchronizeDevice

阻塞等待提交到与当前调用线程关联设备的所有任务完成。

#### 2.9.1. 函数

```c
AXCL_EXPORT axclError axclrtSynchronizeDevice();
```

#### 2.9.2. 参数

不适用

#### 2.9.3. 返回值

- `AXCL_SUCC`：设备上的所有任务已完成。
- 其他错误：失败。

<br>

<a id="axclrtSynchronizeDeviceWithTimeout"></a>

### 2.10. axclrtSynchronizeDeviceWithTimeout

在超时限制内阻塞等待提交到与当前调用线程关联设备的任务完成。

#### 2.10.1. 函数

```c
AXCL_EXPORT axclError axclrtSynchronizeDeviceWithTimeout(int32_t timeout);
```

#### 2.10.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| timeout | in | 超时时间，单位为毫秒。-1 表示无限期等待。 |

#### 2.10.3. 返回值

- `AXCL_SUCC`：设备上的所有任务已完成。
- 其他错误：失败。
