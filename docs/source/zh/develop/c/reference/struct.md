# 结构体

<a id="axclMinidumpConfig"></a>

## 1. axclMinidumpConfig

Minidump 配置结构体。

所有字段均为可选字段，可以为 NULL。

```c
typedef struct {
    const char* dump_dir;   /**< Preferred dump directory. An environment-configured directory takes precedence. */
    const char* dump_type;  /**< Reserved for future use. Currently ignored. */
} axclMinidumpConfig;
```

### 1.1. 字段

| 名称 | 类型 | 说明 |
|---|---|---|
| dump_dir | const char * | 首选 Dump 目录。通过环境变量配置的目录优先。 |
| dump_type | const char * | 保留供将来使用，当前忽略。 |

<br>

<a id="axclrtEngineIODims"></a>

## 2. axclrtEngineIODims

Engine shape 查询 API 返回的 Tensor 维度。

```c
typedef struct axclrtEngineIODims {
    int32_t dimCount;                           /**< Number of valid dimensions in the shape. */
    int32_t dims[AXCLRT_ENGINE_MAX_DIM_CNT];    /**< Dimension values in logical tensor order. */
} axclrtEngineIODims;
```

### 2.1. 字段

| 名称 | 类型 | 说明 |
|---|---|---|
| dimCount | int32_t | Shape 中有效维度的数量。 |
| dims | int32_t[AXCLRT_ENGINE_MAX_DIM_CNT] | 按逻辑 Tensor 顺序排列的维度值。 |

<br>

<a id="axclrtMemLocation"></a>

## 3. axclrtMemLocation

内存位置信息。

```c
typedef struct axclrtMemLocation {
    axclrtMemLocationType type;  /**< Memory location type. */
    int32_t id;                  /**< Virtual device ID for device memory; otherwise -1. */
} axclrtMemLocation;
```

### 3.1. 字段

| 名称 | 类型 | 说明 |
|---|---|---|
| type | axclrtMemLocationType | 内存位置类型。 |
| id | int32_t | 对于 Device 内存，表示虚拟 Device ID；其他情况为 -1。 |

<br>

<a id="axclrtPtrAttributes"></a>

## 4. axclrtPtrAttributes

[axclrtPointerGetAttributes](../memory_api.md#axclrtPointerGetAttributes) 返回的指针属性。

```c
typedef struct axclrtPtrAttributes {
    axclrtMemLocation location;  /**< Pointer location information. */
    uint32_t flags;              /**< Bitwise combination of @ref axclrtPointerAttributeFlag values. */
    uint32_t rsv[3];             /**< Reserved for future use. */
} axclrtPtrAttributes;
```

### 4.1. 字段

| 名称 | 类型 | 说明 |
|---|---|---|
| location | axclrtMemLocation | 指针位置信息。 |
| flags | uint32_t | [axclrtPointerAttributeFlag](enum.md#axclrtPointerAttributeFlag) 值的按位组合。 |
| rsv | uint32_t[3] | 保留供将来使用。 |

<br>

<a id="axclError"></a>

## 5. axclError

```c
typedef int32_t axclError
```

<br>

<a id="axclrtContext"></a>

## 6. axclrtContext

```c
typedef void* axclrtContext
```

<br>

<a id="axclrtDeviceStateCallback"></a>

## 7. axclrtDeviceStateCallback

Device 状态回调。

```c
typedef void(* axclrtDeviceStateCallback) (uint32_t deviceId, axclrtDeviceState state, void *args)
```

<br>

<a id="axclrtEngineIO"></a>

## 8. axclrtEngineIO

```c
typedef void* axclrtEngineIO
```

<br>

<a id="axclrtEngineIOInfo"></a>

## 9. axclrtEngineIOInfo

```c
typedef void* axclrtEngineIOInfo
```

<br>

<a id="axclrtEngineSet"></a>

## 10. axclrtEngineSet

```c
typedef uint32_t axclrtEngineSet
```

<br>

<a id="axclrtEvent"></a>

## 11. axclrtEvent

```c
typedef void* axclrtEvent
```

<br>

<a id="axclrtStream"></a>

## 12. axclrtStream

```c
typedef void* axclrtStream
```
