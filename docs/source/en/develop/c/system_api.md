# System

## Index

- [axclFinalize](#axclFinalize): Deinitialize the AXCL runtime.
- [axclInit](#axclInit): Initialize the AXCL runtime.

<br>

## API

<a id="axclFinalize"></a>

### axclFinalize

Deinitialize the AXCL runtime.

#### Function

```c
AXCL_EXPORT axclError axclFinalize();
```

#### Parameters

N/A

#### Returns

- `AXCL_SUCC`: Success.
- `others`: Failure.

#### Note

- [axclFinalize](#axclFinalize) must be called explicitly before process exit. Every successful call to [axclInit](#axclInit) increments the internal reference count and must have a matching call to [axclFinalize](#axclFinalize). A failed [axclInit](#axclInit) does not require a matching call.
- Do not call this function during C++ static or global object destruction, where AXCL runtime dependencies may already have been destroyed.

#### Remark

- [axclInit](#axclInit)

<br>

<a id="axclInit"></a>

### axclInit

Initialize the AXCL runtime.

#### Function

```c
AXCL_EXPORT axclError axclInit(const char *json);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| json | in | JSON configuration file path or JSON content string. NULL or an empty string uses the default configuration. |

#### Returns

- `AXCL_SUCC`: Success.
- `others`: Failure.

#### Example

```c
 int main(int argc, char *argv[]) {
      axclInit("");

      // TODO:

      axclFinalize();
      return 0;
 }
```

#### Note

- This function must be called before using other AXCL APIs.
- The runtime lifecycle is reference-counted: each successful [axclInit](#axclInit) increments the reference count and [axclFinalize](#axclFinalize) decrements it. Resources are released only when the count reaches zero.
- A failed [axclInit](#axclInit) does not acquire a reference and must not be paired with [axclFinalize](#axclFinalize).
- A process may call [axclInit](#axclInit) multiple times, but each successful call must be paired with [axclFinalize](#axclFinalize)(). For example:

  ```c
      axclInit("") -> axclFinalize() -> axclInit("") -> axclFinalize()
      axclInit("") -> axclInit("") -> axclFinalize() -> axclFinalize()
  ```
- [axclInit](#axclInit) and [axclFinalize](#axclFinalize) are thread-safe. Initialization and cleanup in the main thread are recommended.
- The reference count must be zero before process exit; otherwise, a joinable runtime thread may cause abnormal process termination during static object destruction.
- Configuration is loaded only while the reference count is zero. A successful call changes the count from zero to one; later calls do not reload configuration until the count returns to zero:

  ```c
      axclInit("config1.json") // Loads config1.json
      axclInit("config2.json") // Does not load config2.json
      axclFinalize()
      axclFinalize()
      axclInit("config3.json") // Loads config3.json
      axclFinalize()
  ```
- An invalid JSON string or an unreadable configuration path returns `AXCL_ERR_RT_FAIL`. Runtime initialization is not attempted, and the reference count remains zero.

#### JSON

- `log.host.level`: Host log level. See [axclSetLogLevel](other_api.md#axclSetLogLevel).
- `log.host.path`: Host log file path. On Linux, the default is `${AXCL_LOG_DIR}/axcl_host.log` when [AXCL_LOG_DIR](../../appendix/environment_variables.md#AXCL_LOG_DIR) is set and non-empty; otherwise it is `/tmp/axcl/axcl_host.log`.
- `log.device.level`: Device log level.
- `log.host.path` takes effect only once during process startup. Calling [axclFinalize](#axclFinalize) and then [axclInit](#axclInit) again does not switch the existing log output to a new path.

  ```json
   {
    "log": {
   		"host": {
   			"level": 2,
   			"path": "/tmp/axcl/axcl_host.log"
   		},
   		"device": {
   			"level": 2
   		}
   	}
   }
  ```
