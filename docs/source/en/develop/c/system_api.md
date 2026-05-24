# System

## Index

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

## API

<a id="axclAppLog"></a>

### axclAppLog

Record an application log in the following format. [date time][tid][level][APP][function][file][line]: formatted message Example: axclAppLog(5, func, NULL, LINE, "json: %s, device: %d", json, device); log: [2024-11-12 14:24:22.380][1330][C][APP][main][53]: json: ./axcl.json, device: 129.

#### Function

```c
AXCL_EXPORT void axclAppLog(int32_t lv, const char *func, const char *file, uint32_t line, const char *fmt,...);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| lv | in | log level, refer to [axclSetLogLevel](#axclSetLogLevel). |
| func | in | function name; if set to NULL, the function name will not be printed. |
| file | in | file name; if set to NULL, the file name will not be printed. |
| line | in | line number |
| fmt | in | format string for the log message, max. length is 1024. |

#### Returns

N/A

#### Remark

[axclSetLogLevel](#axclSetLogLevel)

<br>

<a id="axclFinalize"></a>

### axclFinalize

Finalize axcl runtime.

#### Function

```c
AXCL_EXPORT axclError axclFinalize();
```

#### Parameters

N/A

#### Returns

- `AXCL_SUCC`: success.
- `others`: failure.

#### Note

[axclFinalize](#axclFinalize) must be called explicitly before quit, otherwise causes terminated abort.
Do not call [axclFinalize](#axclFinalize) in destructor.

#### Remark

[axclInit](#axclInit)

<br>

<a id="axclGetLogLevel"></a>

### axclGetLogLevel

Get axcl log level.

#### Function

```c
AXCL_EXPORT axclError axclGetLogLevel(int32_t *lv);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| lv | out | log level |

#### Returns

- `AXCL_SUCC`: success.
- `others`: failure.

<br>

<a id="axclInit"></a>

### axclInit

Initialize axcl runtime.

#### Function

```c
AXCL_EXPORT axclError axclInit(const char *json);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| json | in | json config of the following:<br>json config file path.<br>json config content string.<br>NULL, use default config. |

#### Returns

- `AXCL_SUCC`: success.
- `others`: failure.

#### Note

[axclInit](#axclInit) should be callled before any other APIs.
[axclInit](#axclInit) can be called multiple times, but only the first call of config parameter will be used.
[axclFinalize](#axclFinalize) should be called in pair with [axclInit](#axclInit), for example: axclInit(NULL); axclInit(NULL); [axclFinalize](#axclFinalize)(); [axclFinalize](#axclFinalize)();
Usually [axclInit](#axclInit) and [axclFinalize](#axclFinalize) are called in the main function of the application.

#### Example

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

### axclSetLogLevel

Set axcl log level.

#### Function

```c
AXCL_EXPORT axclError axclSetLogLevel(int32_t lv);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| lv | in | log level 0: trace 1: debug 2: info 3: warning 4: error 5: critical 6: off |

#### Returns

- `AXCL_SUCC`: success.
- `others`: failure.

<br>

<a id="axclrtGetErrorString"></a>

### axclrtGetErrorString

Get the error string description for an error code.

#### Function

```c
AXCL_EXPORT const char* axclrtGetErrorString(axclError error);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| error | in | The error code. |

#### Returns

- The error description string, or "unknown error" if not found.

<br>

<a id="axclrtGetLastError"></a>

### axclrtGetLastError

Get the last error code in the current thread.

#### Function

```c
AXCL_EXPORT axclError axclrtGetLastError(void);
```

#### Parameters

N/A

#### Returns

- The last error code.

#### Note

This function also clears the thread-local error to AXCL_SUCC.

<br>

<a id="axclrtGetSocName"></a>

### axclrtGetSocName

Get chip name.

#### Function

```c
AXCL_EXPORT const char* axclrtGetSocName();
```

#### Parameters

N/A

#### Returns

- Chip name string.

<br>

<a id="axclrtGetVersion"></a>

### axclrtGetVersion

Get axcl version.

#### Function

```c
AXCL_EXPORT axclError axclrtGetVersion(int32_t *major, int32_t *minor, int32_t *patch);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| major | out | major version. |
| minor | out | minor version. |
| patch | out | patch version. |

#### Returns

- `AXCL_SUCC`: success.
- `others`: failure.

<br>

<a id="axclrtGetVersionStr"></a>

### axclrtGetVersionStr

Get axcl version string.

#### Function

```c
AXCL_EXPORT const char* axclrtGetVersionStr();
```

#### Parameters

N/A

#### Returns

- Version string.

<br>

<a id="axclrtPeekAtLastError"></a>

### axclrtPeekAtLastError

Peek at the last error code without clearing it.

#### Function

```c
AXCL_EXPORT axclError axclrtPeekAtLastError(void);
```

#### Parameters

N/A

#### Returns

- The last error code.

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

#### Returns

N/A
