# Other

## Index

- [axclAppLog](#axclAppLog)
- [axclGetLogLevel](#axclGetLogLevel)
- [axclSetLogLevel](#axclSetLogLevel)
- [axclrtGetErrorString](#axclrtGetErrorString)
- [axclrtGetLastError](#axclrtGetLastError)
- [axclrtGetSocName](#axclrtGetSocName)
- [axclrtGetVersion](#axclrtGetVersion)
- [axclrtGetVersionStr](#axclrtGetVersionStr)
- [axclrtPeekAtLastError](#axclrtPeekAtLastError)
- [axclrtSetLastError](#axclrtSetLastError)

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
| lv | in | Log level. See [axclSetLogLevel](#axclSetLogLevel). |
| func | in | Function name. If NULL, the function name is not printed. |
| file | in | File name. If NULL, the file name is not printed. |
| line | in | Line number. |
| fmt | in | Non-NULL `printf`-style format string. The formatted message is stored in a 1024-byte internal buffer including the terminating NUL. Messages longer than 1023 bytes are truncated. Format specifiers must match the arguments. |

#### Example

```c
  axclAppLog(5, __func__, NULL, __LINE__, "json: %s, device: %d", json, device);
  // [YYYY-MM-DD HH:MM:SS.mmm][tid][lv][APP][func][line]: message
  // [2026-07-12 14:24:22.380][1330][C][APP][main][53]: json: ./axcl.json, device: 1
```

#### Remark

[axclSetLogLevel](#axclSetLogLevel)

#### Returns

N/A

<br>

<a id="axclGetLogLevel"></a>

### axclGetLogLevel

Get the Host log level.

#### Function

```c
AXCL_EXPORT axclError axclGetLogLevel(int32_t *lv);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| lv | out | Optional pointer to receive the log level. If NULL, no value is written. |

#### Returns

- `AXCL_SUCC`: Success.

#### Remark

[axclSetLogLevel](#axclSetLogLevel)

<br>

<a id="axclSetLogLevel"></a>

### axclSetLogLevel

Set the Host log level.

#### Function

```c
AXCL_EXPORT axclError axclSetLogLevel(int32_t lv);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| lv | in | Log level: 0 trace, 1 debug, 2 info, 3 warning, 4 error, 5 critical, and 6 off. Values outside the range 0 to 6 are mapped to warning. |

#### Returns

- `AXCL_SUCC`: Success.

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

- Description string for the error. Unknown AXCL errors are formatted as `unknown error code 0xXXXXXXXX`. Errors owned by an external module include the raw error code and module ID.

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

Unlike [axclrtPeekAtLastError](#axclrtPeekAtLastError), this function resets the current thread's error code to `AXCL_SUCC` after reading it.

#### Remark

[axclrtPeekAtLastError](#axclrtPeekAtLastError)

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

- `AXCL_SUCC`: Success.
- `others`: Failure.

#### Note

If the build version cannot be parsed, all three output values are set to zero and the function returns `AXCL_SUCC`.

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
| name | in | Version source, supported values: `driver` and `firmware`. `driver` returns the SDK build version string. `firmware` returns the firmware version of the device associated with the current thread's bound runtime context. The thread must first bind a context to an active device, for example through [axclrtSetDevice](device_api.md#axclrtSetDevice) or [axclrtCreateContext](context_api.md#axclrtCreateContext). |
| buf | out | Buffer used to store the version string. On success, the result is NUL-terminated. On failure, the buffer contents are unspecified. |
| size | in | Size of `buf` in bytes. Must be greater than zero. If the buffer is too small, a successful result is truncated to fit, including the terminating NUL. |

#### Returns

- `AXCL_SUCC`: Success.
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

[axclrtGetLastError](#axclrtGetLastError)

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
