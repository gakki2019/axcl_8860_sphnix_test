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
| context | out | 成功时返回创建的 Context 句柄。 |
| deviceId | in | 当前进程可见的虚拟设备 ID。有效范围为 [0, count - 1]，count 由 [axclrtGetDeviceCount](device_api.md#axclrtGetDeviceCount) 返回。 |

#### 2.1.3. 返回值

- `AXCL_SUCC`：成功创建 Context，并将其设为当前 Context。
- 其他错误：失败。

#### 2.1.4. 说明

- 如果尚未调用 [axclrtSetDevice](device_api.md#axclrtSetDevice) 激活指定设备，本函数将先激活指定设备，再创建 Context。
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
| context | in | [axclrtCreateContext](#axclrtCreateContext) 返回的 Context 句柄。 |

#### 2.2.3. 返回值

- `AXCL_SUCC`：成功销毁 Context，并释放其对应的设备激活引用。
- 其他错误：失败。

#### 2.2.4. 说明

- 调用本函数前，必须先销毁在该 Context 中显式创建的所有 Stream。
- 本函数会阻塞等待 Context 的默认 Stream 中的任务完成，然后自动销毁默认 Stream。
- 成功销毁 Context 后，运行时会删除所有线程中指向该 Context 的全部绑定记录。
- 本函数不能销毁由 [axclrtSetDevice](device_api.md#axclrtSetDevice) 创建的默认 Context。默认 Context 由 [axclrtResetDevice](device_api.md#axclrtResetDevice) 销毁。

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
| context | out | 成功时返回当前 Context 句柄。 |

#### 2.3.3. 返回值

- `AXCL_SUCC`：成功返回当前 Context。
- 其他错误：失败。

#### 2.3.4. 说明

- 当前 Context 是最近绑定且尚未被销毁的 Context。
- 如果多次调用 [axclrtSetCurrentContext](#axclrtSetCurrentContext)，本函数获取的是最后一次设置的 Context。

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
| context | in | 要绑定的有效 Context 句柄。 |

#### 2.4.3. 返回值

- `AXCL_SUCC`：成功将指定 Context 设为当前 Context。
- 其他错误：失败。

#### 2.4.4. 说明

- 同一个 Context 可以同时设为多个线程的当前 Context。使用期间，调用者必须确保该 Context 仍然有效，否则会导致程序异常。
- 本函数不会创建 Context，也不会增加设备激活引用，因此不会延长 Context 或设备的生命周期。
- 如果多次调用本接口设置线程的 Context，最后一次设置的 Context 生效。

#### 2.4.5. 参考

- [axclrtGetCurrentContext](#axclrtGetCurrentContext)
