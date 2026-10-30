# 结构体

<a id="axCclRootInfo"></a>

## 1. axCclRootInfo

由 rank 0 生成并广播给所有 rank 的建链信息。

其内容是不透明字节块，不含指针或 Host 句柄，可以安全地通过带外通道（例如 PyTorch 的分布式 store，TCPStore / env://）交换。

```c
typedef struct axCclRootInfo {
    uint8_t internal[AX_CCL_ROOT_INFO_BYTES];
} axCclRootInfo;
```

### 1.1. 字段

| 名称 | 类型 | 说明 |
|---|---|---|
| internal | uint8_t[AX_CCL_ROOT_INFO_BYTES] | - |

<br>

<a id="axclMinidumpConfig"></a>

## 2. axclMinidumpConfig

Minidump 配置结构体。

所有字段均为可选字段，可以为 NULL。

```c
typedef struct {
    const char* dump_dir;   /**< Preferred dump directory. An environment-configured directory takes precedence. */
    const char* dump_type;  /**< Reserved for future use. Currently ignored. */
} axclMinidumpConfig;
```

### 2.1. 字段

| 名称 | 类型 | 说明 |
|---|---|---|
| dump_dir | const char * | 首选 Dump 目录。通过环境变量配置的目录优先。 |
| dump_type | const char * | 保留供将来使用，当前忽略。 |

<br>

<a id="axclrtDevMemDesc"></a>

## 3. axclrtDevMemDesc

用于互操作的外部硬件设备内存描述符。

```c
typedef struct axclrtDevMemDesc {
    int32_t device_id;     /**< Virtual device ID (0, 1, ...). */
    uint32_t flags;        /**< Reserved; must be 0 on input and is set to 0 on output. */
    uint64_t device_pa;    /**< Device PA of the described interval's first byte (must not be 0 or a device memory handle returned by AXCL). */
    uint64_t device_va;    /**< Corresponding Native Device VA, or 0 when no VA is available. Never a Host pointer or a device memory handle returned by AXCL. */
    uint64_t size;         /**< Byte length starting at device_pa/device_va (must be > 0). */
} axclrtDevMemDesc;
```

### 3.1. 字段

| 名称 | 类型 | 说明 |
|---|---|---|
| device_id | int32_t | 虚拟设备 ID（0、1、...）。 |
| flags | uint32_t | 保留字段；输入时必须为 0，输出时置为 0。 |
| device_pa | uint64_t | 所描述区间首字节的 Device 物理地址（不能为 0，也不能是 AXCL 返回的设备内存句柄）。 |
| device_va | uint64_t | 对应的 Native Device 虚拟地址；无可用虚拟地址时为 0。不能是 Host 指针或 AXCL 返回的设备内存句柄。 |
| size | uint64_t | 从 device_pa/device_va 开始的字节长度（必须大于 0）。 |

<br>

<a id="axclrtEngineIODims"></a>

## 4. axclrtEngineIODims

Engine shape 查询 API 返回的 Tensor 维度。

```c
typedef struct axclrtEngineIODims {
    int32_t dimCount;                           /**< Number of valid dimensions in the shape. */
    int32_t dims[AXCLRT_ENGINE_MAX_DIM_CNT];    /**< Dimension values in logical tensor order. */
} axclrtEngineIODims;
```

### 4.1. 字段

| 名称 | 类型 | 说明 |
|---|---|---|
| dimCount | int32_t | Shape 中有效维度的数量。 |
| dims | int32_t[AXCLRT_ENGINE_MAX_DIM_CNT] | 按逻辑 Tensor 顺序排列的维度值。 |

<br>

<a id="axclrtMemLocation"></a>

## 5. axclrtMemLocation

内存位置信息。

```c
typedef struct axclrtMemLocation {
    axclrtMemLocationType type;  /**< Memory location type. */
    int32_t id;                  /**< Virtual device ID for device memory; otherwise -1. */
} axclrtMemLocation;
```

### 5.1. 字段

| 名称 | 类型 | 说明 |
|---|---|---|
| type | axclrtMemLocationType | 内存位置类型。 |
| id | int32_t | 对于 Device 内存，表示虚拟 Device ID；其他情况为 -1。 |

<br>

<a id="axclrtPtrAttributes"></a>

## 6. axclrtPtrAttributes

[axclrtPointerGetAttributes](../memory_api.md#axclrtPointerGetAttributes) 返回的指针属性。

```c
typedef struct axclrtPtrAttributes {
    axclrtMemLocation location;  /**< Pointer location information. */
    uint32_t flags;              /**< Bitwise combination of @ref axclrtPointerAttributeFlag values. */
    uint32_t rsv[3];             /**< Reserved for future use. */
} axclrtPtrAttributes;
```

### 6.1. 字段

| 名称 | 类型 | 说明 |
|---|---|---|
| location | axclrtMemLocation | 指针位置信息。 |
| flags | uint32_t | [axclrtPointerAttributeFlag](enum.md#axclrtPointerAttributeFlag) 值的按位组合。 |
| rsv | uint32_t[3] | 保留供将来使用。 |

<br>

<a id="axCclComm"></a>

## 7. axCclComm

不透明的 communicator 句柄。一个 communicator 将一个逻辑设备绑定到一个 rank。

```c
typedef struct axCclCommRec* axCclComm
```

<br>

<a id="axclError"></a>

## 8. axclError

```c
typedef int32_t axclError
```

<br>

<a id="axclrtContext"></a>

## 9. axclrtContext

```c
typedef void* axclrtContext
```

<br>

<a id="axclrtDeviceStateCallback"></a>

## 10. axclrtDeviceStateCallback

Device 状态回调。

```c
typedef void(* axclrtDeviceStateCallback) (uint32_t deviceId, axclrtDeviceState state, void *args)
```

<br>

<a id="axclrtEngineIO"></a>

## 11. axclrtEngineIO

```c
typedef void* axclrtEngineIO
```

<br>

<a id="axclrtEngineIOInfo"></a>

## 12. axclrtEngineIOInfo

```c
typedef void* axclrtEngineIOInfo
```

<br>

<a id="axclrtEngineSet"></a>

## 13. axclrtEngineSet

```c
typedef uint32_t axclrtEngineSet
```

<br>

<a id="axclrtEvent"></a>

## 14. axclrtEvent

```c
typedef void* axclrtEvent
```

<br>

<a id="axclrtStream"></a>

## 15. axclrtStream

```c
typedef void* axclrtStream
```
