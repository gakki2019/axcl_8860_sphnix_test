# 上下文

## 1. 目录

- [axclrtCreateContext](#axclrtCreateContext)：显式创建 Context，并将其绑定到当前线程。
- [axclrtDestroyContext](#axclrtDestroyContext)：销毁由 [axclrtCreateContext](#axclrtCreateContext) 显式创建的 Context。
- [axclrtGetCurrentContext](#axclrtGetCurrentContext)：获取调用线程的当前 Context。
- [axclrtSetCurrentContext](#axclrtSetCurrentContext)：将指定 Context 设为调用线程的当前 Context。

<br>

## 2. API

<a id="axclrtCreateContext"></a>

### 2.1. axclrtCreateContext

显式创建 Context，并将其绑定到当前线程。

#### 2.1.1. 函数

```c
AXCL_EXPORT axclError axclrtCreateContext(axclrtContext *context, int32_t deviceId);
```

#### 2.1.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| context | out | 成功时返回创建的 Context 句柄。不能为 NULL。 |
| deviceId | in | 当前进程可见的虚拟设备 ID。有效范围为 [0, count - 1]，count 由 [axclrtGetDeviceCount](device_api.md#axclrtGetDeviceCount) 返回。 |

#### 2.1.3. 返回值

- `AXCL_SUCC`：成功创建 Context，并将其设为当前 Context。
- 其他错误：失败。

#### 2.1.4. 说明

- 如果尚未调用 [axclrtSetDevice](device_api.md#axclrtSetDevice) 激活指定设备，本函数将先激活指定设备，再创建 Context。
- 新 Context 替换调用线程原来的当前 Context，包括 [axclrtSetDevice](device_api.md#axclrtSetDevice) 绑定的默认 Context。本函数失败时，线程绑定保持不变。
- 每个显式创建的 Context 都会包含一个隐式创建的默认 Stream。
- 显式创建的 Context 必须通过 [axclrtDestroyContext](#axclrtDestroyContext) 显式销毁。
- 销毁 Context 前，必须先销毁在该 Context 中显式创建的所有 Stream，默认 Stream 由 [axclrtDestroyContext](#axclrtDestroyContext) 负责销毁。

#### 2.1.5. 示例

```c
 void working_thread(int device_id) {
     // 显式创建 Context，并将其绑定到当前线程
     axclrtContext context;
     if (axclrtCreateContext(&context, device_id) != AXCL_SUCC) {
         return;
     }

     // TODO：任务将下发到 Context 所属的设备

     // 不再使用 Context 时，必须销毁显式创建的 Context
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

#### 2.1.6. 参考

- [Context 语义](../arch/concept.md#CONTEXT)
- [axclrtDestroyContext](#axclrtDestroyContext)
- [axclrtSetDevice](device_api.md#axclrtSetDevice)
- [axclrtCreateStream](stream_api.md#axclrtCreateStream)
- [axclrtDestroyStream](stream_api.md#axclrtDestroyStream)

<br>

<a id="axclrtDestroyContext"></a>

### 2.2. axclrtDestroyContext

销毁由 [axclrtCreateContext](#axclrtCreateContext) 显式创建的 Context。

#### 2.2.1. 函数

```c
AXCL_EXPORT axclError axclrtDestroyContext(axclrtContext context);
```

#### 2.2.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| context | in | [axclrtCreateContext](#axclrtCreateContext) 返回的 Context 句柄。不能为 NULL，且必须指向已存在的 Context；已被销毁的 Context 不存在。 |

#### 2.2.3. 返回值

- `AXCL_SUCC`：成功销毁 Context，并释放其对应的设备激活引用。
- 其他错误：失败。

#### 2.2.4. 说明

- 调用本函数前，必须先销毁在该 Context 中显式创建的所有 Stream，否则本函数失败，且 Context 不会被销毁。
- 本函数会阻塞等待 Context 的默认 Stream 中的任务完成，然后自动销毁默认 Stream。
- 成功销毁 Context 后，运行时会删除所有线程中指向该 Context 的绑定。当前 Context 被销毁的线程变为未绑定状态：之前的 Context 和默认 Context 都不会重新成为当前 Context。之后调用需要当前 Context 的接口前，须先调用 [axclrtSetCurrentContext](#axclrtSetCurrentContext) 或 [axclrtSetDevice](device_api.md#axclrtSetDevice)。
- 本函数会释放该 Context 持有的设备激活引用。如果这是最后一个引用，设备将被关闭；此类调用需要与进程内的 [axclrtMallocHost](memory_api.md#axclrtMallocHost) 和 [axclrtFreeHost](memory_api.md#axclrtFreeHost) 调用串行执行。
- 本函数不能销毁由 [axclrtSetDevice](device_api.md#axclrtSetDevice) 创建的默认 Context。默认 Context 由 [axclrtResetDevice](device_api.md#axclrtResetDevice) 销毁。
- 多个线程并发销毁同一个 Context 时，只有一次调用成功，其余调用失败，且不释放设备激活引用。

#### 2.2.5. 参考

- [Context 语义](../arch/concept.md#CONTEXT)
- [axclrtCreateContext](#axclrtCreateContext)
- [axclrtCreateStream](stream_api.md#axclrtCreateStream)
- [axclrtDestroyStream](stream_api.md#axclrtDestroyStream)
- [axclrtSetDevice](device_api.md#axclrtSetDevice)
- [axclrtResetDevice](device_api.md#axclrtResetDevice)

<br>

<a id="axclrtGetCurrentContext"></a>

### 2.3. axclrtGetCurrentContext

获取调用线程的当前 Context。

#### 2.3.1. 函数

```c
AXCL_EXPORT axclError axclrtGetCurrentContext(axclrtContext *context);
```

#### 2.3.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| context | out | 成功时返回当前 Context 句柄。不能为 NULL。 |

#### 2.3.3. 返回值

- `AXCL_SUCC`：成功返回当前 Context。
- 其他错误：失败。

#### 2.3.4. 说明

- 调用线程没有当前 Context 时，本函数失败。
- 当前 Context 是调用线程最近一次成功调用 [axclrtCreateContext](#axclrtCreateContext)、[axclrtSetCurrentContext](#axclrtSetCurrentContext) 或 [axclrtSetDevice](device_api.md#axclrtSetDevice) 所设置的 Context。
- 如果该 Context 已被销毁，或其所属设备已被释放，调用线程没有当前 Context。
- 绑定属于线程，线程退出时随之释放。

#### 2.3.5. 参考

- [axclrtSetCurrentContext](#axclrtSetCurrentContext)

<br>

<a id="axclrtSetCurrentContext"></a>

### 2.4. axclrtSetCurrentContext

将指定 Context 设为调用线程的当前 Context。

#### 2.4.1. 函数

```c
AXCL_EXPORT axclError axclrtSetCurrentContext(axclrtContext context);
```

#### 2.4.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| context | in | 要绑定的 Context 句柄。不能为 NULL，且必须指向已存在的 Context。已被销毁的 Context，或已被释放的设备的默认 Context，均不存在。 |

#### 2.4.3. 返回值

- `AXCL_SUCC`：成功将指定 Context 设为当前 Context。
- 其他错误：失败。

#### 2.4.4. 说明

- 本函数失败时，调用线程的绑定保持不变。
- 同一个 Context 可以同时设为多个线程的当前 Context。使用期间，调用者必须确保该 Context 仍然有效，否则会导致程序异常。
- 本函数不会创建 Context，也不会增加设备激活引用，因此不会延长 Context 或设备的生命周期。
- 如果多次调用本接口设置线程的 Context，最后一次设置的 Context 生效。
- 指定 Context 替换调用线程原来的当前 Context，包括 [axclrtSetDevice](device_api.md#axclrtSetDevice) 绑定的默认 Context。Context 不按栈保存：该 Context 被销毁后，之前的 Context 不会自动恢复。需要临时切换时，先用 [axclrtGetCurrentContext](#axclrtGetCurrentContext) 保存原 Context，切换结束后再设置回去。

#### 2.4.5. 参考

- [axclrtGetCurrentContext](#axclrtGetCurrentContext)
