# 系统

## 1. 目录

- [axclAppLog](#axclAppLog)
- [axclFinalize](#axclFinalize)
- [axclGetLogLevel](#axclGetLogLevel)
- [axclInit](#axclInit)
- [axclSetLogLevel](#axclSetLogLevel)
- [axclrtGetErrorString](#axclrtGetErrorString)
- [axclrtGetLastError](#axclrtGetLastError)
- [axclrtGetSocName](#axclrtGetSocName)
- [axclrtGetVersion](#axclrtGetVersion)
- [axclrtGetVersionStr](#axclrtGetVersionStr)
- [axclrtPeekAtLastError](#axclrtPeekAtLastError)
- [axclrtSetLastError](#axclrtSetLastError)

<br>

## 2. API

<a id="axclAppLog"></a>

### 2.1. axclAppLog

按以下格式记录应用日志：[date time][tid][level][APP][function][file][line]: formatted message。示例：axclAppLog(5, func, NULL, LINE, "json: %s, device: %d", json, device); 日志： [2024-11-12 14:24:22.380][1330][C][APP][main][53]: json: ./axcl.json, device: 129.

#### 2.1.1. 函数

```c
AXCL_EXPORT void axclAppLog(int32_t lv, const char *func, const char *file, uint32_t line, const char *fmt,...);
```

#### 2.1.2. 参数

| 名称 | 方向 | 说明                                                 |
| ---- | ---- | ---------------------------------------------------- |
| lv   | in   | 日志级别，参见 [axclSetLogLevel](#axclSetLogLevel)。 |
| func | in   | 函数名；如果设为 NULL，则不会打印函数名。            |
| file | in   | 文件名；如果设为 NULL，则不会打印文件名。            |
| line | in   | 行号                                                 |
| fmt  | in   | 日志消息的格式字符串，最大长度为 1024。              |

#### 2.1.3. 返回值

不适用

#### 2.1.4. 参考

[axclSetLogLevel](#axclSetLogLevel)

<br>

<a id="axclFinalize"></a>

### 2.2. axclFinalize

结束 axcl 运行时。

#### 2.2.1. 函数

```c
AXCL_EXPORT axclError axclFinalize();
```

#### 2.2.2. 参数

不适用

#### 2.2.3. 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

#### 2.2.4. 说明

[axclFinalize](#axclFinalize) 必须在退出前显式调用，否则会导致终止性 abort。
不要在析构函数中调用 [axclFinalize](#axclFinalize)。

#### 2.2.5. 参考

[axclInit](#axclInit)

<br>

<a id="axclGetLogLevel"></a>

### 2.3. axclGetLogLevel

获取 axcl 日志级别。

#### 2.3.1. 函数

```c
AXCL_EXPORT axclError axclGetLogLevel(int32_t *lv);
```

#### 2.3.2. 参数

| 名称 | 方向 | 说明     |
| ---- | ---- | -------- |
| lv   | out  | 日志级别 |

#### 2.3.3. 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

<br>

<a id="axclInit"></a>

### 2.4. axclInit

初始化 axcl 运行时。

#### 2.4.1. 函数

```c
AXCL_EXPORT axclError axclInit(const char *json);
```

#### 2.4.2. 参数

| 名称 | 方向 | 说明                                                                                             |
| ---- | ---- | ------------------------------------------------------------------------------------------------ |
| json | in   | 以下任意一种 JSON 配置：<br>JSON 配置文件路径。<br>JSON 配置内容字符串。<br>NULL，使用默认配置。 |

#### 2.4.3. 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

#### 2.4.4. 说明

[axclInit](#axclInit) 应在任何其他 API 之前调用。
[axclInit](#axclInit) 可以被多次调用，但只会使用第一次传入的配置参数。
[axclFinalize](#axclFinalize) 应与 [axclInit](#axclInit) 成对调用，例如：axclInit(NULL); axclInit(NULL); [axclFinalize](#axclFinalize)(); [axclFinalize](#axclFinalize)();
通常 [axclInit](#axclInit) 和 [axclFinalize](#axclFinalize) 会在应用的 main 函数中调用。

#### 2.4.5. 示例

```c
int main(int argc, char *argv[]) {
     axclInit(NULL);

     // TODO:

     axclFinalize();
     return 0;
}
```

<br>

<a id="axclSetLogLevel"></a>

### 2.5. axclSetLogLevel

设置 axcl 日志级别。

#### 2.5.1. 函数

```c
AXCL_EXPORT axclError axclSetLogLevel(int32_t lv);
```

#### 2.5.2. 参数

| 名称 | 方向 | 说明                                                                      |
| ---- | ---- | ------------------------------------------------------------------------- |
| lv   | in   | 日志级别：0 trace，1 debug，2 info，3 warning，4 error，5 critical，6 off |

#### 2.5.3. 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

<br>

<a id="axclrtGetErrorString"></a>

### 2.6. axclrtGetErrorString

获取错误码对应的错误字符串描述。

#### 2.6.1. 函数

```c
AXCL_EXPORT const char* axclrtGetErrorString(axclError error);
```

#### 2.6.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| error | in | 错误码。 |

#### 2.6.3. 返回值

- 错误描述字符串；未找到时返回 "unknown error"。

<br>

<a id="axclrtGetLastError"></a>

### 2.7. axclrtGetLastError

获取当前线程的最后一个错误码。

#### 2.7.1. 函数

```c
AXCL_EXPORT axclError axclrtGetLastError(void);
```

#### 2.7.2. 参数

不适用

#### 2.7.3. 返回值

- 最后一个错误码。

#### 2.7.4. 说明

该函数同时会将线程局部错误码清除为 AXCL_SUCC。

<br>

<a id="axclrtGetSocName"></a>

### 2.8. axclrtGetSocName

获取芯片名称。

#### 2.8.1. 函数

```c
AXCL_EXPORT const char* axclrtGetSocName();
```

#### 2.8.2. 参数

不适用

#### 2.8.3. 返回值

- 芯片名称字符串。

<br>

<a id="axclrtGetVersion"></a>

### 2.9. axclrtGetVersion

获取 axcl 版本。

#### 2.9.1. 函数

```c
AXCL_EXPORT axclError axclrtGetVersion(int32_t *major, int32_t *minor, int32_t *patch);
```

#### 2.9.2. 参数

| 名称  | 方向 | 说明         |
| ----- | ---- | ------------ |
| major | out  | 主版本号。   |
| minor | out  | 次版本号。   |
| patch | out  | 补丁版本号。 |

#### 2.9.3. 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

<br>

<a id="axclrtGetVersionStr"></a>

### 2.10. axclrtGetVersionStr

获取指定来源的版本字符串。

#### 2.10.1. 函数

```c
AXCL_EXPORT axclError axclrtGetVersionStr(const char *name, char *buf, uint32_t size);
```

#### 2.10.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| name | in | 版本来源，支持 "driver" 和 "firmware"。"driver" 返回 SDK 构建版本字符串，"firmware" 返回设备固件版本字符串。 |
| buf | out | 用于保存版本字符串的缓冲区。size > 0 时结果始终以 NUL 结尾。 |
| size | in | buf 的大小，单位为字节。如果缓冲区过小，输出会被截断以适配缓冲区。 |

#### 2.10.3. 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

<br>

<a id="axclrtPeekAtLastError"></a>

### 2.11. axclrtPeekAtLastError

查看最后一个错误码且不清除该错误码。

#### 2.11.1. 函数

```c
AXCL_EXPORT axclError axclrtPeekAtLastError(void);
```

#### 2.11.2. 参数

不适用

#### 2.11.3. 返回值

- 最后一个错误码。

<br>

<a id="axclrtSetLastError"></a>

### 2.12. axclrtSetLastError

设置当前线程的最后一个错误码。

#### 2.12.1. 函数

```c
AXCL_EXPORT void axclrtSetLastError(axclError error);
```

#### 2.12.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| error | in | 要设置的错误码。 |

#### 2.12.3. 返回值

不适用

