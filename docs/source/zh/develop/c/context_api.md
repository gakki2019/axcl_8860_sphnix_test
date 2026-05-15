# 上下文 API

## 目录

- [axclrtCreateContext](#axclrtCreateContext)
- [axclrtDestroyContext](#axclrtDestroyContext)
- [axclrtGetCurrentContext](#axclrtGetCurrentContext)
- [axclrtSetCurrentContext](#axclrtSetCurrentContext)

<br>

## API

<a id="axclrtCreateContext"></a>

### axclrtCreateContext

在指定设备上创建上下文，并绑定到调用线程。

#### 函数

```c
AXCL_EXPORT axclError axclrtCreateContext(axclrtContext *context, int32_t deviceId);
```

#### 参数

| 名称     | 方向 | 说明                   |
| -------- | ---- | ---------------------- |
| context  | out  | 指向已创建上下文的指针 |
| deviceId | in   | 设备 ID                |

#### 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

#### 说明

如果没有显式调用 [axclrtCreateContext](#axclrtCreateContext) API 创建上下文，系统将使用默认上下文，而默认上下文会在调用 [axclrtSetDevice](device_api.md#axclrtSetDevice) API 时隐式创建。
如果在同一调用线程中创建了多个上下文，则只会使用最近创建的上下文。
[axclrtDestroyContext](#axclrtDestroyContext) 必须显式调用，才能销毁已创建的上下文。

#### 参考

[axclrtDestroyContext](#axclrtDestroyContext) | [axclrtSetDevice](device_api.md#axclrtSetDevice)

#### 示例

```c
// create a context and bind to device_id
void working_thread(int device_id) {
     // create a context and bind to calling thread
     axclrtContext context;
     axclrtCreateContext(&context, device_id);

     // TODO: working body

     // destroy the context before thread quit.
     axclrtDestroyContext(context);
}
```

<br>

<a id="axclrtDestroyContext"></a>

### axclrtDestroyContext

Destroy the context explicitly created by [axclrtCreateContext](#axclrtCreateContext).

#### 函数

```c
AXCL_EXPORT axclError axclrtDestroyContext(axclrtContext context);
```

#### Parameters

| 名称    | 方向 | 说明                                                          |
| ------- | ---- | ------------------------------------------------------------- |
| context | in   | 由 [axclrtCreateContext](#axclrtCreateContext) 创建的上下文。 |

#### Returns

- `AXCL_SUCC`：成功。
- `others`：失败。

#### 说明

[axclrtDestroyContext](#axclrtDestroyContext) 不能销毁由 [axclrtSetDevice](device_api.md#axclrtSetDevice) 创建的默认上下文。

#### 参考

[axclrtCreateContext](#axclrtCreateContext) | [axclrtSetDevice](device_api.md#axclrtSetDevice)

<br>

<a id="axclrtGetCurrentContext"></a>

### axclrtGetCurrentContext

获取当前调用线程的上下文。

#### 函数

```c
AXCL_EXPORT axclError axclrtGetCurrentContext(axclrtContext *context);
```

#### 参数

| 名称    | 方向 | 说明         |
| ------- | ---- | ------------ |
| context | out  | 上下文指针。 |

#### 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

<br>

<a id="axclrtSetCurrentContext"></a>

### axclrtSetCurrentContext

将指定上下文绑定到当前调用线程。

#### 函数

```c
AXCL_EXPORT axclError axclrtSetCurrentContext(axclrtContext context);
```

#### 参数

| 名称    | 方向 | 说明     |
| ------- | ---- | -------- |
| context | in   | 上下文。 |

#### 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。
