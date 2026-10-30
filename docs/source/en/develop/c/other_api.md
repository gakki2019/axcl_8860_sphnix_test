# Other

## Index

- [axclAppLog](#axclAppLog): Record an application log in the specified format.
- [axclrtGetErrorString](#axclrtGetErrorString): Get the description string for an error code.
- [axclrtGetLastError](#axclrtGetLastError): Get and clear the last error code for the current thread.
- [axclrtGetLogLevel](#axclrtGetLogLevel): Get the log level of a target component.
- [axclrtGetSocName](#axclrtGetSocName): Get the chip name string.
- [axclrtGetVersion](#axclrtGetVersion): Get the AXCL runtime library build version number.
- [axclrtGetVersionStr](#axclrtGetVersionStr): Get the version string for a specified source.
- [axclrtPeekAtLastError](#axclrtPeekAtLastError): Get the last error code for the current thread without clearing it.
- [axclrtSetLastError](#axclrtSetLastError): Set the last error code for the current thread.
- [axclrtSetLogLevel](#axclrtSetLogLevel): Set the log level of a target component at runtime.

<br>

## API

<a id="axclAppLog"></a>

### axclAppLog

Record an application log in the specified format.

#### Function

```c
AXCL_EXPORT void axclAppLog(int32_t lv, const char *func, const char *file, uint32_t line, const char *fmt, ...);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| lv | in | Log level. See [axclrtSetLogLevel](#axclrtSetLogLevel). |
| func | in | Function name. If NULL, the function name is not printed. |
| file | in | File name. If NULL, the file name is not printed. |
| line | in | Line number. |
| fmt | in | Non-NULL `printf`-style format string. The formatted message is stored in a 1024-byte internal buffer including the terminating NUL. Messages longer than 1023 bytes are truncated. Format specifiers must match the arguments. |

#### Note

- The message is written to the Host runtime file and console logs, filtered by the levels set with [axclrtSetLogLevel](#axclrtSetLogLevel). An empty formatted message is not logged.

#### Example

```c
  axclAppLog(5, __func__, NULL, __LINE__, "json: %s, device: %d", json, device);
  // [YYYY-MM-DD HH:MM:SS.mmm][tid][lv][APP][func][line]: message
  // [2026-07-12 14:24:22.380][1330][C][APP][main][53]: json: ./axcl.json, device: 1
```

#### Remark

- [axclrtSetLogLevel](#axclrtSetLogLevel)

#### Returns

N/A

<br>

<a id="axclrtGetErrorString"></a>

### axclrtGetErrorString

Get the description string for an error code.

#### Function

```c
AXCL_EXPORT const char* axclrtGetErrorString(axclError error);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| error | in | The error code. |

#### Returns

- Description string for the error. An AXCL error without a dedicated description, but with a known sub module and a generic error ID that has its own description, is formatted as `<Module>: <generic description>`, for example `Runtime: Native operation failed without detailed error information.` Remaining AXCL errors are formatted as `unknown error code 0xXXXXXXXX`. Errors owned by an external module include the raw error code and module ID. An AXCL error raised on the Device ([AXCL_ID_DEVICE](reference/macro.md#AXCL_ID_DEVICE) in bits [23:16]) returns the same description as the matching Host error code.

#### Note

- The returned pointer must not be freed or modified.
- Dynamically formatted descriptions use thread-local storage and may be overwritten by a subsequent call in the same thread.

<br>

<a id="axclrtGetLastError"></a>

### axclrtGetLastError

Get and clear the last error code for the current thread.

#### Function

```c
AXCL_EXPORT axclError axclrtGetLastError(void);
```

#### Parameters

N/A

#### Returns

- The last error code.

#### Note

- Unlike [axclrtPeekAtLastError](#axclrtPeekAtLastError), this function resets the current thread's error code to `AXCL_SUCC` after reading it.
- Many AXCL APIs also record their own result, including `AXCL_SUCC`, so read the code immediately after the call of interest.

#### Remark

- [axclrtPeekAtLastError](#axclrtPeekAtLastError)

<br>

<a id="axclrtGetLogLevel"></a>

### axclrtGetLogLevel

Get the log level of a target component.

#### Function

```c
AXCL_EXPORT axclError axclrtGetLogLevel(axclrtLogTarget target, int32_t *lv);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| target | in | Log target. See [axclrtLogTarget](reference/enum.md#axclrtLogTarget). Must not be [AXCL_LOG_TARGET_BUTT](reference/enum.md#AXCL_LOG_TARGET_BUTT). |
| lv | out | Non-NULL pointer that receives the log level. |

#### Returns

- `AXCL_SUCC`: The log level was returned successfully.
- `others`: Failure.

#### Remark

- [axclrtSetLogLevel](#axclrtSetLogLevel)

<br>

<a id="axclrtGetSocName"></a>

### axclrtGetSocName

Get the chip name string.

#### Function

```c
AXCL_EXPORT const char* axclrtGetSocName();
```

#### Parameters

N/A

#### Returns

- Runtime-owned chip name string. The returned pointer must not be freed or modified.

<br>

<a id="axclrtGetVersion"></a>

### axclrtGetVersion

Get the AXCL runtime library build version number.

#### Function

```c
AXCL_EXPORT axclError axclrtGetVersion(int32_t *major, int32_t *minor, int32_t *patch);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| major | out | Non-NULL pointer to receive the major version. |
| minor | out | Non-NULL pointer to receive the minor version. |
| patch | out | Non-NULL pointer to receive the patch version. |

#### Returns

- `AXCL_SUCC`: The version numbers were returned successfully.
- `others`: Failure.

#### Note

If the build version cannot be parsed, all three output values are set to zero and the function returns `AXCL_SUCC`. Components missing from the build version, such as the patch number, are set to zero.

<br>

<a id="axclrtGetVersionStr"></a>

### axclrtGetVersionStr

Get the version string for a specified source.

#### Function

```c
AXCL_EXPORT axclError axclrtGetVersionStr(const char *name, char *buf, uint32_t size);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| name | in | Non-NULL version source, supported values: `driver` and `firmware`. `driver` returns the SDK build version string. `firmware` returns the firmware version of the device associated with the current thread's bound runtime context. The thread must first bind a context to an active device, for example through [axclrtSetDevice](device_api.md#axclrtSetDevice) or [axclrtCreateContext](context_api.md#axclrtCreateContext). |
| buf | out | Non-NULL buffer used to store the version string. On success, the result is NUL-terminated. On failure, the buffer contents are unspecified. |
| size | in | Size of `buf` in bytes. Must be greater than zero. If the buffer is too small, a successful result is truncated to fit, including the terminating NUL. |

#### Returns

- `AXCL_SUCC`: The version string was written to `buf` successfully.
- `others`: Failure.

<br>

<a id="axclrtPeekAtLastError"></a>

### axclrtPeekAtLastError

Get the last error code for the current thread without clearing it.

#### Function

```c
AXCL_EXPORT axclError axclrtPeekAtLastError(void);
```

#### Parameters

N/A

#### Returns

- The last error code.

#### Note

Unlike [axclrtGetLastError](#axclrtGetLastError), this function does not reset the current thread's error code.

#### Remark

- [axclrtGetLastError](#axclrtGetLastError)

<br>

<a id="axclrtSetLastError"></a>

### axclrtSetLastError

Set the last error code for the current thread.

#### Function

```c
AXCL_EXPORT void axclrtSetLastError(axclError error);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| error | in | The error code to set. |

#### Note

This function is for internal use and is not recommended for direct use.

#### Returns

N/A

<br>

<a id="axclrtSetLogLevel"></a>

### axclrtSetLogLevel

Set the log level of a target component at runtime.

#### Function

```c
AXCL_EXPORT axclError axclrtSetLogLevel(axclrtLogTarget target, int32_t lv);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| target | in | Log target. See [axclrtLogTarget](reference/enum.md#axclrtLogTarget). Must not be [AXCL_LOG_TARGET_BUTT](reference/enum.md#AXCL_LOG_TARGET_BUTT). |
| lv | in | Log level: 0 trace, 1 debug, 2 info, 3 warning, 4 error, 5 critical, and 6 off. Values outside the range 0 to 6 are mapped to warning. |

#### Returns

- `AXCL_SUCC`: The log level was set successfully.
- `others`: Failure.

#### Example

```c
  axclrtSetLogLevel(AXCL_LOG_TARGET_HOST_RUNTIME_FILE,     2);   // Host file log -> info
  axclrtSetLogLevel(AXCL_LOG_TARGET_HOST_RUNTIME_CONSOLE,  0);   // Host console -> trace (debugging)
  axclrtSetDevice(0);
  axclrtSetLogLevel(AXCL_LOG_TARGET_DEVICE_WORKER_FILE,    2);   // device 0 worker file log -> info
  axclrtSetDevice(1);
  axclrtSetLogLevel(AXCL_LOG_TARGET_DEVICE_WORKER_CONSOLE, 4);   // device 1 worker console -> error
```
