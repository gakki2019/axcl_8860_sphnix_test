# 流

## 1. 目录

- [axclrtCreateStream](#axclrtCreateStream)：创建 Stream。
- [axclrtDestroyStream](#axclrtDestroyStream)：销毁由 [axclrtCreateStream](#axclrtCreateStream) 创建的 Stream。
- [axclrtDestroyStreamForce](#axclrtDestroyStreamForce)：直接销毁 Stream，不等待已提交的任务完成。
- [axclrtStreamQuery](#axclrtStreamQuery)：查询指定 Stream 中是否有未完成的任务。
- [axclrtSynchronizeStream](#axclrtSynchronizeStream)：阻塞等待本次调用前已提交到 Stream 的所有任务完成。
- [axclrtSynchronizeStreamWithTimeout](#axclrtSynchronizeStreamWithTimeout)：在指定超时时间内，阻塞等待本次调用前已提交到 Stream 的所有任务完成。

<br>

## 2. API

<a id="axclrtCreateStream"></a>

### 2.1. axclrtCreateStream

创建 Stream。

#### 2.1.1. 函数

```c
AXCL_EXPORT axclError axclrtCreateStream(axclrtStream *stream);
```

#### 2.1.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| stream | out | 成功时返回创建的 Stream 句柄。 |

#### 2.1.3. 返回值

- `AXCL_SUCC`：成功创建 Stream。
- 其他错误：失败。

#### 2.1.4. 说明

- 同一 Stream 中的任务按照提交顺序执行，不同 Stream 之间默认不保证任务的执行先后顺序。
- 如需在不同 Stream 之间进行同步，请使用 [Event 语义](../arch/concept.md#EVENT)。
- 调用 [axclrtDestroyContext](context_api.md#axclrtDestroyContext) 前，必须先销毁该 Context 中所有显式创建的 Stream。

#### 2.1.5. 参考

- [Stream 语义](../arch/concept.md#STREAM)
- [axclrtDestroyStream](#axclrtDestroyStream)

<br>

<a id="axclrtDestroyStream"></a>

### 2.2. axclrtDestroyStream

销毁由 [axclrtCreateStream](#axclrtCreateStream) 创建的 Stream。

如果其中有未完成的任务，本函数会阻塞，待任务完成后再将其销毁。

#### 2.2.1. 函数

```c
AXCL_EXPORT axclError axclrtDestroyStream(axclrtStream stream);
```

#### 2.2.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| stream | in | [axclrtCreateStream](#axclrtCreateStream) 返回的 Stream 句柄。 |

#### 2.2.3. 返回值

- `AXCL_SUCC`：成功同步并销毁 Stream。
- 其他错误：失败。

#### 2.2.4. 说明

- 本函数只能销毁由 [axclrtCreateStream](#axclrtCreateStream) 显式创建的 Stream，不能销毁默认 Stream，默认 Stream 由随其所属 Context 一起销毁。
- 本函数在销毁 Stream 前，会阻塞等待此前提交到该 Stream 的任务全部完成。

#### 2.2.5. 参考

- [axclrtDestroyStreamForce](#axclrtDestroyStreamForce)
- [axclrtSynchronizeStream](#axclrtSynchronizeStream)
- [axclrtDestroyContext](context_api.md#axclrtDestroyContext)

<br>

<a id="axclrtDestroyStreamForce"></a>

### 2.3. axclrtDestroyStreamForce

直接销毁 Stream，不等待已提交的任务完成。

#### 2.3.1. 函数

```c
AXCL_EXPORT axclError axclrtDestroyStreamForce(axclrtStream stream);
```

#### 2.3.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| stream | in | [axclrtCreateStream](#axclrtCreateStream) 返回的 Stream 句柄。 |

#### 2.3.3. 返回值

- `AXCL_SUCC`：成功销毁 Stream。
- 其他错误：失败。

#### 2.3.4. 说明

- 与 [axclrtDestroyStream](#axclrtDestroyStream) 不同，本函数不会等待已提交的任务完成。
- 尚未完成的任务可能被丢弃，本函数也不会返回已保存的异步任务错误。

#### 2.3.5. 参考

- [axclrtDestroyStream](#axclrtDestroyStream)

<br>

<a id="axclrtStreamQuery"></a>

### 2.4. axclrtStreamQuery

查询指定 Stream 中是否有未完成的任务。

#### 2.4.1. 函数

```c
AXCL_EXPORT axclError axclrtStreamQuery(axclrtStream stream, axclrtStreamStatus *status);
```

#### 2.4.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| stream | in | [axclrtCreateStream](#axclrtCreateStream) 返回的 Stream 句柄。 |
| status | out | 成功时返回 Stream 的任务完成状态。 |

#### 2.4.3. 返回值

- `AXCL_SUCC`：成功返回 Stream 的任务完成状态。
- 其他错误：失败。

<br>

<a id="axclrtSynchronizeStream"></a>

### 2.5. axclrtSynchronizeStream

阻塞等待本次调用前已提交到 Stream 的所有任务完成。

#### 2.5.1. 函数

```c
AXCL_EXPORT axclError axclrtSynchronizeStream(axclrtStream stream);
```

#### 2.5.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| stream | in | [axclrtCreateStream](#axclrtCreateStream) 返回的 Stream 句柄。 |

#### 2.5.3. 返回值

- `AXCL_SUCC`：Stream 中此前提交的所有任务均成功完成。
- 其他错误：失败。

#### 2.5.4. 参考

- [axclrtSynchronizeStreamWithTimeout](#axclrtSynchronizeStreamWithTimeout)

<br>

<a id="axclrtSynchronizeStreamWithTimeout"></a>

### 2.6. axclrtSynchronizeStreamWithTimeout

在指定超时时间内，阻塞等待本次调用前已提交到 Stream 的所有任务完成。

#### 2.6.1. 函数

```c
AXCL_EXPORT axclError axclrtSynchronizeStreamWithTimeout(axclrtStream stream, int32_t timeout);
```

#### 2.6.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| stream | in | [axclrtCreateStream](#axclrtCreateStream) 返回的 Stream 句柄。 |
| timeout | in | 超时时间，单位为毫秒。`-1` 表示无限期等待。 |

#### 2.6.3. 返回值

- `AXCL_SUCC`：Stream 中此前提交的所有任务均在超时时间内成功完成。
- 其他错误：失败。

#### 2.6.4. 说明

- 等待超时不会取消已提交的任务。

#### 2.6.5. 参考

- [axclrtSynchronizeStream](#axclrtSynchronizeStream)
