# 其他

## 1. 目录

- [axclAppLog](#axclAppLog)：按指定格式记录应用日志。
- [axclGetLogLevel](#axclGetLogLevel)：获取 Host 日志级别。
- [axclSetLogLevel](#axclSetLogLevel)：设置 Host 日志级别。
- [axclrtGetErrorString](#axclrtGetErrorString)：获取错误码对应的错误描述字符串。
- [axclrtGetLastError](#axclrtGetLastError)：获取并清除当前线程的最后一个错误码。
- [axclrtGetSocName](#axclrtGetSocName)：获取芯片名称字符串。
- [axclrtGetVersion](#axclrtGetVersion)：获取 AXCL 运行时库构建版本号。
- [axclrtGetVersionStr](#axclrtGetVersionStr)：获取指定来源的版本字符串。
- [axclrtPeekAtLastError](#axclrtPeekAtLastError)：获取当前线程的最后一个错误码，但不清除该错误码。
- [axclrtSetLastError](#axclrtSetLastError)：设置当前线程的最后一个错误码。

<br>

## 2. API

<a id="axclAppLog"></a>

### 2.1. axclAppLog

按指定格式记录应用日志。

#### 2.1.1. 函数

```c
AXCL_EXPORT void axclAppLog(int32_t lv, const char *func, const char *file, uint32_t line, const char *fmt, ...);
```

#### 2.1.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| lv | in | 日志级别，参见 [axclSetLogLevel](#axclSetLogLevel)。 |
| func | in | 函数名；如果设为 NULL，则不打印函数名。 |
| file | in | 文件名；如果设为 NULL，则不打印文件名。 |
| line | in | 行号。 |
| fmt | in | 非 NULL 的 printf 风格格式字符串。格式化后的消息保存在包含结尾 NUL 的 1024 字节内部缓冲区中；超过 1023 字节的消息会被截断。格式说明符必须与参数匹配。 |

#### 2.1.3. 示例

```c
  axclAppLog(5, __func__, NULL, __LINE__, "json: %s, device: %d", json, device);
  // [YYYY-MM-DD HH:MM:SS.mmm][tid][lv][APP][func][line]: message
  // [2026-07-12 14:24:22.380][1330][C][APP][main][53]: json: ./axcl.json, device: 1
```

#### 2.1.4. 参考

[axclSetLogLevel](#axclSetLogLevel)

#### 2.1.5. 返回值

不适用

<br>

<a id="axclGetLogLevel"></a>

### 2.2. axclGetLogLevel

获取 Host 日志级别。

#### 2.2.1. 函数

```c
AXCL_EXPORT axclError axclGetLogLevel(int32_t *lv);
```

#### 2.2.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| lv | out | 用于接收日志级别的可选指针。如果为 NULL，则不写入任何值。 |

#### 2.2.3. 返回值

- `AXCL_SUCC`：成功。

#### 2.2.4. 参考

[axclSetLogLevel](#axclSetLogLevel)

<br>

<a id="axclSetLogLevel"></a>

### 2.3. axclSetLogLevel

设置 Host 日志级别。

#### 2.3.1. 函数

```c
AXCL_EXPORT axclError axclSetLogLevel(int32_t lv);
```

#### 2.3.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| lv | in | 日志级别：0 trace，1 debug，2 info，3 warning，4 error，5 critical，6 off。超出 0～6 范围的值会映射为 warning。 |

#### 2.3.3. 返回值

- `AXCL_SUCC`：成功。

<br>

<a id="axclrtGetErrorString"></a>

### 2.4. axclrtGetErrorString

获取错误码对应的错误描述字符串。

#### 2.4.1. 函数

```c
AXCL_EXPORT const char* axclrtGetErrorString(axclError error);
```

#### 2.4.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| error | in | 错误码。 |

#### 2.4.3. 返回值

- 错误描述字符串。未知 AXCL 错误的格式为 `unknown error code 0xXXXXXXXX`；属于外部模块的错误包含原始错误码和模块 ID。

#### 2.4.4. 说明

- 不得释放或修改返回的指针。
- 动态格式化的描述使用线程局部存储，同一线程中的后续调用可能覆盖其内容。

<br>

<a id="axclrtGetLastError"></a>

### 2.5. axclrtGetLastError

获取并清除当前线程的最后一个错误码。

#### 2.5.1. 函数

```c
AXCL_EXPORT axclError axclrtGetLastError(void);
```

#### 2.5.2. 参数

不适用

#### 2.5.3. 返回值

- 最后一个错误码。

#### 2.5.4. 说明

与 [axclrtPeekAtLastError](#axclrtPeekAtLastError) 不同，本接口读取错误码后会将当前线程的错误码重置为 `AXCL_SUCC`。

#### 2.5.5. 参考

[axclrtPeekAtLastError](#axclrtPeekAtLastError)

<br>

<a id="axclrtGetSocName"></a>

### 2.6. axclrtGetSocName

获取芯片名称字符串。

#### 2.6.1. 函数

```c
AXCL_EXPORT const char* axclrtGetSocName();
```

#### 2.6.2. 参数

不适用

#### 2.6.3. 返回值

- 由运行时管理的芯片名称字符串，不得释放或修改返回的指针。

<br>

<a id="axclrtGetVersion"></a>

### 2.7. axclrtGetVersion

获取 AXCL 运行时库构建版本号。

#### 2.7.1. 函数

```c
AXCL_EXPORT axclError axclrtGetVersion(int32_t *major, int32_t *minor, int32_t *patch);
```

#### 2.7.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| major | out | 用于接收主版本号的非 NULL 指针。 |
| minor | out | 用于接收次版本号的非 NULL 指针。 |
| patch | out | 用于接收补丁版本号的非 NULL 指针。 |

#### 2.7.3. 返回值

- `AXCL_SUCC`：成功。
- 其他错误：失败。

#### 2.7.4. 说明

如果无法解析构建版本，三个输出值都会被设为 0，接口返回 `AXCL_SUCC`。

<br>

<a id="axclrtGetVersionStr"></a>

### 2.8. axclrtGetVersionStr

获取指定来源的版本字符串。

#### 2.8.1. 函数

```c
AXCL_EXPORT axclError axclrtGetVersionStr(const char *name, char *buf, uint32_t size);
```

#### 2.8.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| name | in | 版本来源，支持 `driver` 和 `firmware`。`driver` 返回 SDK 构建版本字符串；`firmware` 返回当前线程绑定的运行时上下文所关联设备的固件版本。线程必须先将上下文绑定到已激活的设备，例如调用 [axclrtSetDevice](device_api.md#axclrtSetDevice) 或 [axclrtCreateContext](context_api.md#axclrtCreateContext)。 |
| buf | out | 用于保存版本字符串的缓冲区。成功时结果以 NUL 结尾；失败时缓冲区内容未定义。 |
| size | in | `buf` 的大小，单位为字节，必须大于 0。如果缓冲区过小，成功结果会被截断以适配缓冲区，并保留结尾 NUL。 |

#### 2.8.3. 返回值

- `AXCL_SUCC`：成功。
- 其他错误：失败。

<br>

<a id="axclrtPeekAtLastError"></a>

### 2.9. axclrtPeekAtLastError

获取当前线程的最后一个错误码，但不清除该错误码。

#### 2.9.1. 函数

```c
AXCL_EXPORT axclError axclrtPeekAtLastError(void);
```

#### 2.9.2. 参数

不适用

#### 2.9.3. 返回值

- 最后一个错误码。

#### 2.9.4. 说明

与 [axclrtGetLastError](#axclrtGetLastError) 不同，本接口不会重置当前线程的错误码。

#### 2.9.5. 参考

[axclrtGetLastError](#axclrtGetLastError)

<br>

<a id="axclrtSetLastError"></a>

### 2.10. axclrtSetLastError

设置当前线程的最后一个错误码。

#### 2.10.1. 函数

```c
AXCL_EXPORT void axclrtSetLastError(axclError error);
```

#### 2.10.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| error | in | 要设置的错误码。 |

#### 2.10.3. 返回值

不适用

#### 2.10.4. 说明

本接口内部使用，不推荐调用。
