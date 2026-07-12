# Structure

<a id="axclCrashDumpConfig"></a>

## axclCrashDumpConfig

Crash dump configuration structure.

```c
typedef struct {
    const char* dump_dir;   /**< Dump file output directory. */
    const char* dump_type;  /**< Reserved for compatibility. Ignored by the Breakpad minicoredump implementation. */
} axclCrashDumpConfig;
```

### Fields

| Name | Type | Description |
|---|---|---|
| dump_dir | const char * | Dump file output directory. |
| dump_type | const char * | Reserved for compatibility. Ignored by the Breakpad minicoredump implementation. |

<br>

<a id="axclrtEngineIODims"></a>

## axclrtEngineIODims

Tensor dimensions returned by engine shape query APIs.

```c
typedef struct axclrtEngineIODims {
    int32_t dimCount;                           /**< Number of valid dimensions in the shape. */
    int32_t dims[AXCLRT_ENGINE_MAX_DIM_CNT];    /**< Dimension values in logical tensor order. */
} axclrtEngineIODims;
```

### Fields

| Name | Type | Description |
|---|---|---|
| dimCount | int32_t | Number of valid dimensions in the shape. |
| dims | int32_t[AXCLRT_ENGINE_MAX_DIM_CNT] | Dimension values in logical tensor order. |

<br>

<a id="axclrtMemLocation"></a>

## axclrtMemLocation

Memory location information.

```c
typedef struct axclrtMemLocation {
    axclrtMemLocationType type;
    int32_t id;
} axclrtMemLocation;
```

### Fields

| Name | Type | Description |
|---|---|---|
| type | axclrtMemLocationType | - |
| id | int32_t | - |

<br>

<a id="axclrtPtrAttributes"></a>

## axclrtPtrAttributes

Pointer attributes returned by [axclrtPointerGetAttributes](../memory_api.md#axclrtPointerGetAttributes).

```c
typedef struct axclrtPtrAttributes {
    axclrtMemLocation location;
    uint32_t flags;
    uint32_t rsv[3];
} axclrtPtrAttributes;
```

### Fields

| Name | Type | Description |
|---|---|---|
| location | axclrtMemLocation | - |
| flags | uint32_t | - |
| rsv | uint32_t[3] | - |

<br>

<a id="mockAttr"></a>

## mockAttr

Mock pipeline attributes.

```c
typedef struct {
  uint32_t mode;    /**< Mock running mode. */
  uint32_t param_a; /**< Auxiliary parameter A. */
  uint32_t param_b; /**< Auxiliary parameter B. */
} mockAttr;
```

### Fields

| Name | Type | Description |
|---|---|---|
| mode | uint32_t | Mock running mode. |
| param_a | uint32_t | Auxiliary parameter A. |
| param_b | uint32_t | Auxiliary parameter B. |

<br>

<a id="axclError"></a>

## axclError

Public AXCL error code type.

```c
typedef int32_t axclError
```

<br>

<a id="axclrtContext"></a>

## axclrtContext

Runtime context handle.

```c
typedef void* axclrtContext
```

<br>

<a id="axclrtEngineIO"></a>

## axclrtEngineIO

Opaque handle used to bind engine input and output buffers.

```c
typedef void* axclrtEngineIO
```

<br>

<a id="axclrtEngineIOInfo"></a>

## axclrtEngineIOInfo

Opaque handle used to query engine input and output metadata.

```c
typedef void* axclrtEngineIOInfo
```

<br>

<a id="axclrtEngineSet"></a>

## axclrtEngineSet

Bitmask describing the engine core affinity set.

```c
typedef uint32_t axclrtEngineSet
```

<br>

<a id="axclrtEvent"></a>

## axclrtEvent

Runtime event handle.

```c
typedef void* axclrtEvent
```

<br>

<a id="axclrtStream"></a>

## axclrtStream

Runtime stream handle.

```c
typedef void* axclrtStream
```

<br>

<a id="mockCallbackAEx_t"></a>

## mockCallbackAEx_t

Callback invoked with a status code.

```c
typedef int32_t(* mockCallbackAEx_t) (int32_t statusCode)
```

<br>

<a id="mockCallbackA_t"></a>

## mockCallbackA_t

Callback invoked with a status code and user context.

```c
typedef int32_t(* mockCallbackA_t) (int32_t statusCode, void *userData)
```

<br>

<a id="mockCallbackBEx_t"></a>

## mockCallbackBEx_t

Callback invoked for group and frame notifications without user data.

```c
typedef int32_t(* mockCallbackBEx_t) (uint32_t grp, uint32_t frameIndex)
```

<br>

<a id="mockCallbackB_t"></a>

## mockCallbackB_t

Callback invoked for group and frame notifications.

```c
typedef int32_t(* mockCallbackB_t) (uint32_t grp, uint32_t frameIndex, void *userData)
```
