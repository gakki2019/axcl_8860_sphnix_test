# 流

## 1. 目录

- [axclrtCreateStream](#axclrtCreateStream)
- [axclrtDestroyStream](#axclrtDestroyStream)
- [axclrtDestroyStreamForce](#axclrtDestroyStreamForce)
- [axclrtStreamQuery](#axclrtStreamQuery)
- [axclrtSynchronizeStream](#axclrtSynchronizeStream)
- [axclrtSynchronizeStreamWithTimeout](#axclrtSynchronizeStreamWithTimeout)

<br>

## 2. API

<a id="axclrtCreateStream"></a>

### 2.1. axclrtCreateStream

创建流。

#### 2.1.1. 函数

```c
AXCL_EXPORT axclError axclrtCreateStream(axclrtStream *stream);
```

#### 2.1.2. 参数

| 名称   | 方向 | 说明               |
| ------ | ---- | ------------------ |
| stream | out  | 指向已创建流的指针 |

#### 2.1.3. 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

<br>

<a id="axclrtDestroyStream"></a>

### 2.2. axclrtDestroyStream

销毁流。

#### 2.2.1. 函数

```c
AXCL_EXPORT axclError axclrtDestroyStream(axclrtStream stream);
```

#### 2.2.2. 参数

| 名称   | 方向 | 说明                                                            |
| ------ | ---- | --------------------------------------------------------------- |
| stream | in   | 由 [axclrtCreateStream](#axclrtCreateStream) 创建并要销毁的流。 |

#### 2.2.3. 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

<br>

<a id="axclrtDestroyStreamForce"></a>

### 2.3. axclrtDestroyStreamForce

强制销毁流。

#### 2.3.1. 函数

```c
AXCL_EXPORT axclError axclrtDestroyStreamForce(axclrtStream stream);
```

#### 2.3.2. 参数

| 名称   | 方向 | 说明                                                            |
| ------ | ---- | --------------------------------------------------------------- |
| stream | in   | 由 [axclrtCreateStream](#axclrtCreateStream) 创建并要销毁的流。 |

#### 2.3.3. 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

<br>

<a id="axclrtStreamQuery"></a>

### 2.4. axclrtStreamQuery

查询流上所有任务的执行状态（非阻塞）。

#### 2.4.1. 函数

```c
AXCL_EXPORT axclError axclrtStreamQuery(axclrtStream stream, axclrtStreamStatus *status);
```

#### 2.4.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| stream | in | 由 [axclrtCreateStream](#axclrtCreateStream) 创建且待查询的流。 |
| status | out | 用于接收流状态的指针。 |

#### 2.4.3. 返回值

- `AXCL_SUCC`：查询调用成功；通过 status 判断流状态。
- `others`：查询调用本身失败；status 会被设置为 AXCL_STREAM_STATUS_RESERVED。

<br>

<a id="axclrtSynchronizeStream"></a>

### 2.5. axclrtSynchronizeStream

同步流。

#### 2.5.1. 函数

```c
AXCL_EXPORT axclError axclrtSynchronizeStream(axclrtStream stream);
```

#### 2.5.2. 参数

| 名称   | 方向 | 说明                                                              |
| ------ | ---- | ----------------------------------------------------------------- |
| stream | in   | 由 [axclrtCreateStream](#axclrtCreateStream) 创建并用于同步的流。 |

#### 2.5.3. 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

<br>

<a id="axclrtSynchronizeStreamWithTimeout"></a>

### 2.6. axclrtSynchronizeStreamWithTimeout

带超时同步流。

#### 2.6.1. 函数

```c
AXCL_EXPORT axclError axclrtSynchronizeStreamWithTimeout(axclrtStream stream, int32_t timeout);
```

#### 2.6.2. 参数

| 名称    | 方向 | 说明                                                              |
| ------- | ---- | ----------------------------------------------------------------- |
| stream  | in   | 由 [axclrtCreateStream](#axclrtCreateStream) 创建并用于同步的流。 |
| timeout | in   | 超时时间，单位为毫秒；-1 表示无超时。                             |

#### 2.6.3. 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

