# 设备

## 1. 目录

- [axclrtDeviceCanAccessPeer](#axclrtDeviceCanAccessPeer)：查询设备之间是否支持数据交互。
- [axclrtDeviceDisablePeerAccess](#axclrtDeviceDisablePeerAccess)：禁用当前设备到指定设备的数据交互。
- [axclrtDeviceEnablePeerAccess](#axclrtDeviceEnablePeerAccess)：启用当前设备到指定设备的数据交互。
- [axclrtDeviceGetBareTgid](#axclrtDeviceGetBareTgid)：获取调用进程在初始 PID 命名空间中的 Host 原始 TGID。
- [axclrtDevicePeerAccessStatus](#axclrtDevicePeerAccessStatus)：查询源设备到指定设备的数据交互启用状态。
- [axclrtGetDevice](#axclrtGetDevice)：获取调用线程正在使用的虚拟设备 ID。
- [axclrtGetDeviceCount](#axclrtGetDeviceCount)：获取当前进程可见的设备数量。
- [axclrtGetDeviceInfo](#axclrtGetDeviceInfo)：获取设备属性值。
- [axclrtQueryDeviceStatus](#axclrtQueryDeviceStatus)：查询设备状态。
- [axclrtRegDeviceStateCallback](#axclrtRegDeviceStateCallback)：注册或注销设备状态回调函数。
- [axclrtResetDevice](#axclrtResetDevice)：将设备激活引用计数减 1，引用计数变为 0 时释放设备。
- [axclrtResetDeviceForce](#axclrtResetDeviceForce)：强制释放已激活的设备。
- [axclrtSetDevice](#axclrtSetDevice)：激活设备，并将该设备的默认 Context 绑定到当前调用线程。
- [axclrtSynchronizeDevice](#axclrtSynchronizeDevice)：阻塞等待提交到与当前调用线程关联设备的所有任务完成。
- [axclrtSynchronizeDeviceWithTimeout](#axclrtSynchronizeDeviceWithTimeout)：在超时限制内阻塞等待提交到与当前调用线程关联设备的任务完成。

<br>

## 2. API

<a id="axclrtDeviceCanAccessPeer"></a>

### 2.1. axclrtDeviceCanAccessPeer

查询设备之间是否支持数据交互。

#### 2.1.1. 函数

```c
AXCL_EXPORT axclError axclrtDeviceCanAccessPeer(int32_t *canAccessPeer, int32_t deviceId, int32_t peerDeviceId);
```

#### 2.1.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| canAccessPeer | out | 支持时接收 1，否则接收 0。不能为 NULL。 |
| deviceId | in | 当前进程可见的源虚拟设备 ID。 |
| peerDeviceId | in | 当前进程可见的目标虚拟设备 ID。必须与 `deviceId` 不同。 |

#### 2.1.3. 返回值

- `AXCL_SUCC`：成功返回访问能力。
- 其他错误：失败。

#### 2.1.4. 说明

- 设备 `deviceId` 必须已激活，访问能力在该设备上查询。
- 不同加速卡上的设备之间不支持设备间直接拷贝，`canAccessPeer` 接收 0。

<br>

<a id="axclrtDeviceDisablePeerAccess"></a>

### 2.2. axclrtDeviceDisablePeerAccess

禁用当前设备到指定设备的数据交互。

#### 2.2.1. 函数

```c
AXCL_EXPORT axclError axclrtDeviceDisablePeerAccess(int32_t peerDeviceId);
```

#### 2.2.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| peerDeviceId | in | 目标虚拟设备 ID。必须与当前设备不同。 |

#### 2.2.3. 返回值

- `AXCL_SUCC`：成功禁用当前设备到 `peerDeviceId` 的数据交互。
- 其他错误：失败。

#### 2.2.4. 说明

- 当前设备是调用线程当前 Context 所属的设备。
- 禁用未启用的访问权限时，本函数也返回成功。

<br>

<a id="axclrtDeviceEnablePeerAccess"></a>

### 2.3. axclrtDeviceEnablePeerAccess

启用当前设备到指定设备的数据交互。

本接口启用的数据交互是单向的。例如：

- 当前设备 ID 为 0、`peerDeviceId` 为 1 时，表示设备 0 可以访问设备 1 上的数据，但设备 1 不能访问设备 0 上的数据。
- 要允许设备 1 访问设备 0 上的数据，需要切换到设备 1，并将 `peerDeviceId` 设置为 0 后调用本接口。

#### 2.3.1. 函数

```c
AXCL_EXPORT axclError axclrtDeviceEnablePeerAccess(int32_t peerDeviceId, uint32_t flags);
```

#### 2.3.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| peerDeviceId | in | 当前进程可见的目标虚拟设备 ID。必须与当前设备不同。 |
| flags | in | 保留参数，必须设置为 0。 |

#### 2.3.3. 返回值

- `AXCL_SUCC`：成功启用当前设备到 `peerDeviceId` 的数据交互。
- 其他错误：失败。

#### 2.3.4. 说明

- 当前设备是调用线程当前 Context 所属的设备。
- 本函数只记录访问权限，不检查设备之间能否进行数据交互。如需检查访问能力，请使用 [axclrtDeviceCanAccessPeer](#axclrtDeviceCanAccessPeer)。
- 该权限对整个进程生效，直到调用 [axclrtDeviceDisablePeerAccess](#axclrtDeviceDisablePeerAccess) 为止。

#### 2.3.5. 参考

- [axclrtDeviceCanAccessPeer](#axclrtDeviceCanAccessPeer)
- [axclrtDeviceDisablePeerAccess](#axclrtDeviceDisablePeerAccess)
- [设备间拷贝](../../develop/arch/memory.md#memory-inter-device-copy)

<br>

<a id="axclrtDeviceGetBareTgid"></a>

### 2.4. axclrtDeviceGetBareTgid

获取调用进程在初始 PID 命名空间中的 Host 原始 TGID。

在容器化环境中，本函数返回跨进程 IPC 授权白名单所需的 Host 根命名空间 TGID。

#### 2.4.1. 函数

```c
AXCL_EXPORT axclError axclrtDeviceGetBareTgid(int32_t *bareTgid);
```

#### 2.4.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| bareTgid | out | 接收 Host 层级的原始 TGID。不能为 NULL。 |

#### 2.4.3. 返回值

- `AXCL_SUCC`：成功返回原始 TGID。
- 其他错误：失败。

#### 2.4.4. 参考

- [axclrtIpcMemSetImportPid](memory_api.md#axclrtIpcMemSetImportPid)

<br>

<a id="axclrtDevicePeerAccessStatus"></a>

### 2.5. axclrtDevicePeerAccessStatus

查询源设备到指定设备的数据交互启用状态。

#### 2.5.1. 函数

```c
AXCL_EXPORT axclError axclrtDevicePeerAccessStatus(int32_t deviceId, int32_t peerDeviceId, int32_t *status);
```

#### 2.5.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| deviceId | in | 当前进程可见的源虚拟设备 ID。 |
| peerDeviceId | in | 当前进程可见的目标虚拟设备 ID。 |
| status | out | 已通过 [axclrtDeviceEnablePeerAccess](#axclrtDeviceEnablePeerAccess) 启用时接收 1，否则接收 0。不能为 NULL。 |

#### 2.5.3. 返回值

- `AXCL_SUCC`：成功返回启用状态。
- 其他错误：失败。

<br>

<a id="axclrtGetDevice"></a>

### 2.6. axclrtGetDevice

获取调用线程正在使用的虚拟设备 ID。

#### 2.6.1. 函数

```c
AXCL_EXPORT axclError axclrtGetDevice(int32_t *deviceId);
```

#### 2.6.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| deviceId | out | 接收调用线程正在使用的虚拟设备 ID。不能为 NULL。 |

#### 2.6.3. 返回值

- `AXCL_SUCC`：成功返回虚拟设备 ID。
- 其他错误：失败。

#### 2.6.4. 说明

- 该设备是调用线程当前 Context 所属的设备。调用线程没有当前 Context 时，本函数失败。

<br>

<a id="axclrtGetDeviceCount"></a>

### 2.7. axclrtGetDeviceCount

获取当前进程可见的设备数量。

#### 2.7.1. 函数

```c
AXCL_EXPORT axclError axclrtGetDeviceCount(uint32_t *count);
```

#### 2.7.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| count | out | 接收当前进程可见的设备数量。不能为 NULL。 |

#### 2.7.3. 返回值

- `AXCL_SUCC`：成功返回当前进程可见的设备数量。
- 其他错误：失败。

#### 2.7.4. 说明

- 本接口返回的是当前进程可见的设备数量，不是已激活的设备数量，也不是连接的设备数量。
- 环境变量 [AXCL_VISIBLE_DEVICES](../../appendix/environment_variables.md#AXCL_VISIBLE_DEVICES) 用于控制当前进程可见的设备。
- 未配置环境变量 [AXCL_VISIBLE_DEVICES](../../appendix/environment_variables.md#AXCL_VISIBLE_DEVICES) 时，可见设备数量等于驱动能够识别的已连接设备数量，但不包括在 [axclInit](system_api.md#axclInit) 期间无法读取设备信息的设备。

<br>

<a id="axclrtGetDeviceInfo"></a>

### 2.8. axclrtGetDeviceInfo

获取设备属性值。

#### 2.8.1. 函数

```c
AXCL_EXPORT axclError axclrtGetDeviceInfo(int32_t deviceId, axclrtDevAttr attr, uint64_t *value);
```

#### 2.8.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| deviceId | in | 当前进程可见的虚拟设备 ID。 |
| attr | in | 要查询的设备属性。必须是小于 [AXCL_DEVICE_ATTR_BUTT](reference/enum.md#AXCL_DEVICE_ATTR_BUTT) 的有效 [axclrtDevAttr](reference/enum.md#axclrtDevAttr) 值。 |
| value | out | 成功时接收属性值。不能为 NULL。 |

#### 2.8.3. 返回值

- `AXCL_SUCC`：成功返回属性值。
- 其他错误：失败。

#### 2.8.4. 说明

- 设备未激活时，查询 [AXCL_DEVICE_ATTR_UID](reference/enum.md#AXCL_DEVICE_ATTR_UID)，本函数失败。
- UID 通过调用线程的当前 Context 读取。查询 [AXCL_DEVICE_ATTR_UID](reference/enum.md#AXCL_DEVICE_ATTR_UID) 前，需将 `deviceId` 的某个 Context 设为当前 Context。

<br>

<a id="axclrtQueryDeviceStatus"></a>

### 2.9. axclrtQueryDeviceStatus

查询设备状态。

#### 2.9.1. 函数

```c
AXCL_EXPORT axclError axclrtQueryDeviceStatus(int32_t deviceId, axclrtDeviceStatus *deviceStatus);
```

#### 2.9.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| deviceId | in | 当前进程可见的虚拟设备 ID。 |
| deviceStatus | out | 接收设备可用状态。不能为 NULL。 |

#### 2.9.3. 返回值

- `AXCL_SUCC`：成功返回设备状态。
- 其他错误：失败。

#### 2.9.4. 说明

- [AXCL_RT_DEVICE_STATUS_NORMAL](reference/enum.md#AXCL_RT_DEVICE_STATUS_NORMAL) 表示设备对当前进程可见、设备存在且已激活，并且未被标记为离线。
- [AXCL_RT_DEVICE_STATUS_ABNORMAL](reference/enum.md#AXCL_RT_DEVICE_STATUS_ABNORMAL) 表示设备可见且存在，但未激活或已被标记为离线。
- 设备不可见或不存在时返回失败，并将 `deviceStatus` 置为 [AXCL_RT_DEVICE_STATUS_ABNORMAL](reference/enum.md#AXCL_RT_DEVICE_STATUS_ABNORMAL)。

<br>

<a id="axclrtRegDeviceStateCallback"></a>

### 2.10. axclrtRegDeviceStateCallback

注册或注销设备状态回调函数。

#### 2.10.1. 函数

```c
AXCL_EXPORT axclError axclrtRegDeviceStateCallback(axclrtDeviceStateCallback callback, void *args);
```

#### 2.10.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| callback | in | 回调函数。传入 NULL 注销当前回调函数。 |
| args | in | 传递给 callback 的用户数据。callback 为 NULL 时忽略该参数。 |

#### 2.10.3. 返回值

- `AXCL_SUCC`：成功注册、替换或注销回调函数。
- 其他错误：失败。

#### 2.10.4. 说明

- 一个进程只保存一个回调函数，再次注册会替换先前的回调函数。
- 当前进程可见且已激活的设备离线、被移除，或该设备上为当前进程服务的工作进程退出时，会调用该回调函数。
- 这些事件只上报一次 OFFLINE，直到设备被成功重新打开。工作进程退出并不表示整板故障。
- 回调函数在运行时线程中执行，而不是在注册回调的线程中执行。回调函数应尽快返回，且不得在回调函数内调用 [axclrtRegDeviceStateCallback](#axclrtRegDeviceStateCallback)。

<br>

<a id="axclrtResetDevice"></a>

### 2.11. axclrtResetDevice

将设备激活引用计数减 1，引用计数变为 0 时释放设备。

#### 2.11.1. 函数

```c
AXCL_EXPORT axclError axclrtResetDevice(int32_t deviceId);
```

#### 2.11.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| deviceId | in | 当前进程可见的虚拟设备 ID。 |

#### 2.11.3. 返回值

- `AXCL_SUCC`：成功将引用计数减 1，或成功释放设备。
- 其他错误：失败。

#### 2.11.4. 说明

- 如果设备仍有其他引用，本函数只将引用计数减 1，所有线程（包括调用线程）的 Context 绑定都保持不变，绑定默认 Context 的线程仍以其为当前 Context。
- 释放最后一个引用时，将等待默认 Stream 中的任务完成，然后销毁默认 Stream 和默认 Context。绑定该默认 Context 的线程变为未绑定状态，不会切换到其他 Context。
- 关闭设备的操作需要与进程内的 [axclrtMallocHost](memory_api.md#axclrtMallocHost) 和 [axclrtFreeHost](memory_api.md#axclrtFreeHost) 调用串行执行。
- 释放最后一个引用前，必须按以下顺序销毁所有显式创建的 Stream 和 Context，否则释放最后一个引用失败：

  ```c
     axclrtDestroyStream -> axclrtDestroyContext -> axclrtResetDevice
  ```

#### 2.11.5. 参考

- [axclrtSetDevice](#axclrtSetDevice)
- [axclrtDestroyContext](context_api.md#axclrtDestroyContext)
- [axclrtDestroyStream](stream_api.md#axclrtDestroyStream)

<br>

<a id="axclrtResetDeviceForce"></a>

### 2.12. axclrtResetDeviceForce

强制释放已激活的设备。

#### 2.12.1. 函数

```c
AXCL_EXPORT axclError axclrtResetDeviceForce(int32_t deviceId);
```

#### 2.12.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| deviceId | in | 当前进程可见的虚拟设备 ID。 |

#### 2.12.3. 返回值

- `AXCL_SUCC`：成功释放设备并将引用计数重置为 0。
- 其他错误：失败。

#### 2.12.4. 说明

- 与 [axclrtResetDevice](#axclrtResetDevice) 不同，即使引用计数大于 1，本函数也会尝试立即释放设备。本函数不会销毁显式创建的 Context 或 Stream。
- 调用本函数前，必须按以下顺序销毁所有显式创建的 Stream 和 Context，否则本函数失败：

  ```c
     axclrtDestroyStream -> axclrtDestroyContext -> axclrtResetDeviceForce
  ```
- 等待默认 Stream 中的任务完成，然后销毁默认 Stream 和默认 Context。绑定该默认 Context 的线程变为未绑定状态。
- 本函数需要与进程内的 [axclrtMallocHost](memory_api.md#axclrtMallocHost) 和 [axclrtFreeHost](memory_api.md#axclrtFreeHost) 调用串行执行。

#### 2.12.5. 参考

- [axclrtResetDevice](#axclrtResetDevice)
- [axclrtDestroyContext](context_api.md#axclrtDestroyContext)
- [axclrtDestroyStream](stream_api.md#axclrtDestroyStream)

<br>

<a id="axclrtSetDevice"></a>

### 2.13. axclrtSetDevice

激活设备，并将该设备的默认 Context 绑定到当前调用线程。

#### 2.13.1. 函数

```c
AXCL_EXPORT axclError axclrtSetDevice(int32_t deviceId);
```

#### 2.13.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| deviceId | in | 当前进程可见的虚拟设备 ID。有效范围为 [0, count - 1]，count 由 [axclrtGetDeviceCount](#axclrtGetDeviceCount) 返回。 |

#### 2.13.3. 返回值

- `AXCL_SUCC`：成功激活设备，并将其默认 Context 设为当前 Context。
- 其他错误：失败。

#### 2.13.4. 说明

- 首次调用将激活设备，并隐式创建一个包含默认 Stream 的默认 Context。之后对同一设备的调用会复用这些默认资源，并将当前调用线程绑定到共享的默认 Context。
- 默认 Context 替换调用线程原来的当前 Context，包括通过 [axclrtCreateContext](context_api.md#axclrtCreateContext) 或 [axclrtSetCurrentContext](context_api.md#axclrtSetCurrentContext) 设置的 Context，直到设置其他 Context 或设备被释放。本函数失败时，线程绑定保持不变。
- 为每个设备维护进程级引用计数。每次成功调用 [axclrtSetDevice](#axclrtSetDevice) 都应与 [axclrtResetDevice](#axclrtResetDevice) 成对使用。引用计数变为 0 时才会释放设备。[axclrtCreateContext](context_api.md#axclrtCreateContext) 和 [axclrtDestroyContext](context_api.md#axclrtDestroyContext) 也在这一计数上增加和释放引用，因此 [axclrtCreateContext](context_api.md#axclrtCreateContext) 同样会激活指定设备。

#### 2.13.5. 示例

```c
 axclInit("");
 axclrtSetDevice(0);
 // Submit tasks to device 0.
 axclrtResetDevice(0);
 axclFinalize();
```

#### 2.13.6. 参考

- [axclrtResetDevice](#axclrtResetDevice)
- [axclrtCreateContext](context_api.md#axclrtCreateContext)

<br>

<a id="axclrtSynchronizeDevice"></a>

### 2.14. axclrtSynchronizeDevice

阻塞等待提交到与当前调用线程关联设备的所有任务完成。

#### 2.14.1. 函数

```c
AXCL_EXPORT axclError axclrtSynchronizeDevice();
```

#### 2.14.2. 参数

不适用

#### 2.14.3. 返回值

- `AXCL_SUCC`：设备上的所有任务已完成。
- 其他错误：失败。

#### 2.14.4. 说明

- 该设备是调用线程当前 Context 所属的设备，且必须已激活。
- 本函数同步当前进程中该设备所有 Context 下的所有 Stream，包括其他线程使用的 Stream。
- 异步任务错误的上报方式与 [axclrtSynchronizeStream](stream_api.md#axclrtSynchronizeStream) 相同。同步在第一个上报错误的 Stream 处停止。

<br>

<a id="axclrtSynchronizeDeviceWithTimeout"></a>

### 2.15. axclrtSynchronizeDeviceWithTimeout

在超时限制内阻塞等待提交到与当前调用线程关联设备的任务完成。

#### 2.15.1. 函数

```c
AXCL_EXPORT axclError axclrtSynchronizeDeviceWithTimeout(int32_t timeout);
```

#### 2.15.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| timeout | in | 超时时间，单位为毫秒。负数（如 -1）表示无限期等待。 |

#### 2.15.3. 返回值

- `AXCL_SUCC`：设备上的所有任务已完成。
- 其他错误：失败。

#### 2.15.4. 说明

- 行为与 [axclrtSynchronizeDevice](#axclrtSynchronizeDevice) 相同，区别在于每个 Stream 最多等待 `timeout`，因此总等待时间可能超过 `timeout`。
- 超时不会取消已提交的任务。
