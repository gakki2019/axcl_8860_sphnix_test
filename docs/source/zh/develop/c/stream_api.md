# 流

## 目录

- [axclrtCreateStream](#axclrtCreateStream)
- [axclrtDestroyStream](#axclrtDestroyStream)
- [axclrtDestroyStreamForce](#axclrtDestroyStreamForce)
- [axclrtSynchronizeStream](#axclrtSynchronizeStream)
- [axclrtSynchronizeStreamWithTimeout](#axclrtSynchronizeStreamWithTimeout)

<br>

## API

<a id="axclrtCreateStream"></a>

### axclrtCreateStream

创建流。

#### 函数

```c
AXCL_EXPORT axclError axclrtCreateStream(axclrtStream *stream);
```

#### 参数

| 名称   | 方向 | 说明               |
| ------ | ---- | ------------------ |
| stream | out  | 指向已创建流的指针 |

#### 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

<br>

<a id="axclrtDestroyStream"></a>

### axclrtDestroyStream

销毁流。

#### 函数

```c
AXCL_EXPORT axclError axclrtDestroyStream(axclrtStream stream);
```

#### 参数

| 名称   | 方向 | 说明                                                            |
| ------ | ---- | --------------------------------------------------------------- |
| stream | in   | 由 [axclrtCreateStream](#axclrtCreateStream) 创建并要销毁的流。 |

#### 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

<br>

<a id="axclrtDestroyStreamForce"></a>

### axclrtDestroyStreamForce

强制销毁流。

#### 函数

```c
AXCL_EXPORT axclError axclrtDestroyStreamForce(axclrtStream stream);
```

#### 参数

| 名称   | 方向 | 说明                                                            |
| ------ | ---- | --------------------------------------------------------------- |
| stream | in   | 由 [axclrtCreateStream](#axclrtCreateStream) 创建并要销毁的流。 |

#### 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

<br>

<a id="axclrtSynchronizeStream"></a>

### axclrtSynchronizeStream

同步流。

#### 函数

```c
AXCL_EXPORT axclError axclrtSynchronizeStream(axclrtStream stream);
```

#### 参数

| 名称   | 方向 | 说明                                                              |
| ------ | ---- | ----------------------------------------------------------------- |
| stream | in   | 由 [axclrtCreateStream](#axclrtCreateStream) 创建并用于同步的流。 |

#### 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

<br>

<a id="axclrtSynchronizeStreamWithTimeout"></a>

### axclrtSynchronizeStreamWithTimeout

带超时同步流。

#### 函数

```c
AXCL_EXPORT axclError axclrtSynchronizeStreamWithTimeout(axclrtStream stream, int32_t timeout);
```

#### 参数

| 名称    | 方向 | 说明                                                              |
| ------- | ---- | ----------------------------------------------------------------- |
| stream  | in   | 由 [axclrtCreateStream](#axclrtCreateStream) 创建并用于同步的流。 |
| timeout | in   | 超时时间，单位为毫秒；-1 表示无超时。                             |

#### 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。
