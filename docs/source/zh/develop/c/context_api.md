# 上下文

## 1. 目录

- [axclrtCreateContext](#axclrtCreateContext)
- [axclrtDestroyContext](#axclrtDestroyContext)
- [axclrtGetCurrentContext](#axclrtGetCurrentContext)
- [axclrtSetCurrentContext](#axclrtSetCurrentContext)

<br>

## 2. API

<a id="axclrtCreateContext"></a>

### 2.1. axclrtCreateContext

在指定设备上创建上下文，并绑定到调用线程。

#### 2.1.1. 函数

```c
AXCL_EXPORT axclError axclrtCreateContext(axclrtContext *context, int32_t deviceId);
```

#### 2.1.2. 参数

| 名称     | 方向 | 说明                   |
| -------- | ---- | ---------------------- |
| context  | out  | 指向已创建上下文的指针 |
| deviceId | in   | 设备 ID                |

#### 2.1.3. 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

#### 2.1.4. 说明

如果没有显式调用 [axclrtCreateContext](#axclrtCreateContext) API 创建上下文，系统将使用默认上下文，而默认上下文会在调用 [axclrtSetDevice](device_api.md#axclrtSetDevice) API 时隐式创建。
如果在同一调用线程中创建了多个上下文，则只会使用最近创建的上下文。
[axclrtDestroyContext](#axclrtDestroyContext) 必须显式调用，才能销毁已创建的上下文。

#### 2.1.5. 参考

[axclrtDestroyContext](#axclrtDestroyContext) | [axclrtSetDevice](device_api.md#axclrtSetDevice)

#### 2.1.6. 示例

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

### 2.2. axclrtDestroyContext

Destroy the context explicitly created by [axclrtCreateContext](#axclrtCreateContext).

#### 2.2.1. 函数

```c
AXCL_EXPORT axclError axclrtDestroyContext(axclrtContext context);
```

#### 2.2.2. Parameters

| 名称    | 方向 | 说明                                                          |
| ------- | ---- | ------------------------------------------------------------- |
| context | in   | 由 [axclrtCreateContext](#axclrtCreateContext) 创建的上下文。 |

#### 2.2.3. Returns

- `AXCL_SUCC`：成功。
- `others`：失败。

#### 2.2.4. 说明

[axclrtDestroyContext](#axclrtDestroyContext) 不能销毁由 [axclrtSetDevice](device_api.md#axclrtSetDevice) 创建的默认上下文。

#### 2.2.5. 参考

[axclrtCreateContext](#axclrtCreateContext) | [axclrtSetDevice](device_api.md#axclrtSetDevice)

<br>

<a id="axclrtGetCurrentContext"></a>

### 2.3. axclrtGetCurrentContext

获取当前调用线程的上下文。

#### 2.3.1. 函数

```c
AXCL_EXPORT axclError axclrtGetCurrentContext(axclrtContext *context);
```

#### 2.3.2. 参数

| 名称    | 方向 | 说明         |
| ------- | ---- | ------------ |
| context | out  | 上下文指针。 |

#### 2.3.3. 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

<br>

<a id="axclrtSetCurrentContext"></a>

### 2.4. axclrtSetCurrentContext

将指定上下文绑定到当前调用线程。

#### 2.4.1. 函数

```c
AXCL_EXPORT axclError axclrtSetCurrentContext(axclrtContext context);
```

#### 2.4.2. 参数

| 名称    | 方向 | 说明     |
| ------- | ---- | -------- |
| context | in   | 上下文。 |

#### 2.4.3. 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。
