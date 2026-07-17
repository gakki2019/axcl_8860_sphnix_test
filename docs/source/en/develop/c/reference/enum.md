# Enum

<a id="AXCL_ERROR_E"></a>

## AXCL_ERROR_E

Generic error code.

```c
typedef enum {
    /**
     * @brief The operation completed successfully.
     */
    AXCL_SUCC                   = 0x00,

    /**
     * @brief A generic failure occurred.
     */
    AXCL_FAIL                   = 0x01,
    AXCL_ERR_UNKNOWN            = AXCL_FAIL,  /*!< Alias of @ref AXCL_FAIL for an unspecified error. */

    /**
     * @brief A null pointer was passed.
     */
    AXCL_ERR_NULL_POINTER       = 0x02,

    /**
     * @brief An invalid parameter was passed.
     */
    AXCL_ERR_ILLEGAL_PARAM      = 0x03,

    /**
     * @brief The requested operation is not supported.
     */
    AXCL_ERR_UNSUPPORT          = 0x04,

    /**
     * @brief The operation timed out.
     */
    AXCL_ERR_TIMEOUT            = 0x05,

    /**
     * @brief The module is busy.
     */
    AXCL_ERR_BUSY               = 0x06,

    /**
     * @brief Memory allocation failed.
     */
    AXCL_ERR_NO_MEMORY          = 0x07,

    /**
     * @brief Packet encoding failed.
     */
    AXCL_ERR_ENCODE             = 0x08,

    /**
     * @brief Packet decoding failed.
     */
    AXCL_ERR_DECODE             = 0x09,

    /**
     * @brief An unexpected response was received.
     */
    AXCL_ERR_UNEXPECT_RESPONSE  = 0x0A,

    /**
     * @brief Native operation failed without detailed error information.
     */
    AXCL_ERR_NATIVE_FAILED      = 0x0B,

    AXCL_ERR_MODULE_BASE        = 0x20,  /*!< First identifier reserved for module-specific errors. */
    AXCL_ERR_BUTT               = 0x7F  /*!< Upper boundary of the generic error identifier range. */
} AXCL_ERROR_E;
```

### Values

| Symbol | Value | Description |
|---|---|---|
| <a id="AXCL_SUCC"></a>AXCL_SUCC | 0x00 | The operation completed successfully. |
| <a id="AXCL_FAIL"></a>AXCL_FAIL | 0x01 | A generic failure occurred. |
| <a id="AXCL_ERR_UNKNOWN"></a>AXCL_ERR_UNKNOWN | AXCL_FAIL | Alias of [AXCL_FAIL](#AXCL_FAIL) for an unspecified error. |
| <a id="AXCL_ERR_NULL_POINTER"></a>AXCL_ERR_NULL_POINTER | 0x02 | A null pointer was passed. |
| <a id="AXCL_ERR_ILLEGAL_PARAM"></a>AXCL_ERR_ILLEGAL_PARAM | 0x03 | An invalid parameter was passed. |
| <a id="AXCL_ERR_UNSUPPORT"></a>AXCL_ERR_UNSUPPORT | 0x04 | The requested operation is not supported. |
| <a id="AXCL_ERR_TIMEOUT"></a>AXCL_ERR_TIMEOUT | 0x05 | The operation timed out. |
| <a id="AXCL_ERR_BUSY"></a>AXCL_ERR_BUSY | 0x06 | The module is busy. |
| <a id="AXCL_ERR_NO_MEMORY"></a>AXCL_ERR_NO_MEMORY | 0x07 | Memory allocation failed. |
| <a id="AXCL_ERR_ENCODE"></a>AXCL_ERR_ENCODE | 0x08 | Packet encoding failed. |
| <a id="AXCL_ERR_DECODE"></a>AXCL_ERR_DECODE | 0x09 | Packet decoding failed. |
| <a id="AXCL_ERR_UNEXPECT_RESPONSE"></a>AXCL_ERR_UNEXPECT_RESPONSE | 0x0A | An unexpected response was received. |
| <a id="AXCL_ERR_NATIVE_FAILED"></a>AXCL_ERR_NATIVE_FAILED | 0x0B | Native operation failed without detailed error information. |
| <a id="AXCL_ERR_MODULE_BASE"></a>AXCL_ERR_MODULE_BASE | 0x20 | First identifier reserved for module-specific errors. |
| <a id="AXCL_ERR_BUTT"></a>AXCL_ERR_BUTT | 0x7F | Upper boundary of the generic error identifier range. |

<br>

<a id="axclrtDevAttr"></a>

## axclrtDevAttr

Device attribute type for [axclrtGetDeviceInfo](../device_api.md#axclrtGetDeviceInfo).

```c
typedef enum axclrtDevAttr {
    AXCL_DEVICE_ATTR_PHYSICAL_DEVICE_ID = 0,  /*!< Physical device ID mapped from the virtual device ID. */
    AXCL_DEVICE_ATTR_TYPE,                    /*!< Device transport type: 0 local, 1 PCIe, or 2 USB. */
    AXCL_DEVICE_ATTR_UID,                     /*!< Device unique identifier; requires an active device. */
    AXCL_DEVICE_ATTR_PCIE_DOMAIN,             /*!< PCIe domain number. */
    AXCL_DEVICE_ATTR_PCIE_BUS,                /*!< PCIe bus number. */
    AXCL_DEVICE_ATTR_PCIE_DEV,                /*!< PCIe device number. */
    AXCL_DEVICE_ATTR_PCIE_FUNC,               /*!< PCIe function number. */
    AXCL_DEVICE_ATTR_BUTT                     /*!< Upper boundary of valid device attributes. */
} axclrtDevAttr;
```

### Values

| Symbol | Value | Description |
|---|---|---|
| <a id="AXCL_DEVICE_ATTR_PHYSICAL_DEVICE_ID"></a>AXCL_DEVICE_ATTR_PHYSICAL_DEVICE_ID | 0 | Physical device ID mapped from the virtual device ID. |
| <a id="AXCL_DEVICE_ATTR_TYPE"></a>AXCL_DEVICE_ATTR_TYPE | - | Device transport type: 0 local, 1 PCIe, or 2 USB. |
| <a id="AXCL_DEVICE_ATTR_UID"></a>AXCL_DEVICE_ATTR_UID | - | Device unique identifier; requires an active device. |
| <a id="AXCL_DEVICE_ATTR_PCIE_DOMAIN"></a>AXCL_DEVICE_ATTR_PCIE_DOMAIN | - | PCIe domain number. |
| <a id="AXCL_DEVICE_ATTR_PCIE_BUS"></a>AXCL_DEVICE_ATTR_PCIE_BUS | - | PCIe bus number. |
| <a id="AXCL_DEVICE_ATTR_PCIE_DEV"></a>AXCL_DEVICE_ATTR_PCIE_DEV | - | PCIe device number. |
| <a id="AXCL_DEVICE_ATTR_PCIE_FUNC"></a>AXCL_DEVICE_ATTR_PCIE_FUNC | - | PCIe function number. |
| <a id="AXCL_DEVICE_ATTR_BUTT"></a>AXCL_DEVICE_ATTR_BUTT | - | Upper boundary of valid device attributes. |

<br>

<a id="axclrtDeviceState"></a>

## axclrtDeviceState

Device state for [axclrtRegDeviceStateCallback](../device_api.md#axclrtRegDeviceStateCallback).

```c
typedef enum axclrtDeviceState {
    AXCL_RT_DEVICE_STATE_ONLINE = 0,   /*!< The device is online; currently not reported by the callback. */
    AXCL_RT_DEVICE_STATE_OFFLINE = 1,  /*!< The device has been detected offline. */
    AXCL_RT_DEVICE_STATE_BUTT          /*!< Upper boundary of valid device states. */
} axclrtDeviceState;
```

### Values

| Symbol | Value | Description |
|---|---|---|
| <a id="AXCL_RT_DEVICE_STATE_ONLINE"></a>AXCL_RT_DEVICE_STATE_ONLINE | 0 | The device is online; currently not reported by the callback. |
| <a id="AXCL_RT_DEVICE_STATE_OFFLINE"></a>AXCL_RT_DEVICE_STATE_OFFLINE | 1 | The device has been detected offline. |
| <a id="AXCL_RT_DEVICE_STATE_BUTT"></a>AXCL_RT_DEVICE_STATE_BUTT | - | Upper boundary of valid device states. |

<br>

<a id="axclrtDeviceStatus"></a>

## axclrtDeviceStatus

Device availability status for [axclrtQueryDeviceStatus](../device_api.md#axclrtQueryDeviceStatus).

```c
typedef enum axclrtDeviceStatus {
    AXCL_RT_DEVICE_STATUS_ABNORMAL = 0,  /*!< The device is not visible, does not exist, is not active, or is offline. */
    AXCL_RT_DEVICE_STATUS_NORMAL = 1,    /*!< The device is visible, exists, is active, and is not offline. */
} axclrtDeviceStatus;
```

### Values

| Symbol | Value | Description |
|---|---|---|
| <a id="AXCL_RT_DEVICE_STATUS_ABNORMAL"></a>AXCL_RT_DEVICE_STATUS_ABNORMAL | 0 | The device is not visible, does not exist, is not active, or is offline. |
| <a id="AXCL_RT_DEVICE_STATUS_NORMAL"></a>AXCL_RT_DEVICE_STATUS_NORMAL | 1 | The device is visible, exists, is active, and is not offline. |

<br>

<a id="axclrtEngineDataLayout"></a>

## axclrtEngineDataLayout

Tensor layout definition.

```c
typedef enum axclrtEngineDataLayout {
    AXCL_DATA_LAYOUT_NONE = 0,  /*!< Unspecified tensor layout. */
    AXCL_DATA_LAYOUT_NHWC = 1,  /*!< Batch, height, width, channel layout. */
    AXCL_DATA_LAYOUT_NCHW = 2,  /*!< Batch, channel, height, width layout. */
} axclrtEngineDataLayout;
```

### Values

| Symbol | Value | Description |
|---|---|---|
| <a id="AXCL_DATA_LAYOUT_NONE"></a>AXCL_DATA_LAYOUT_NONE | 0 | Unspecified tensor layout. |
| <a id="AXCL_DATA_LAYOUT_NHWC"></a>AXCL_DATA_LAYOUT_NHWC | 1 | Batch, height, width, channel layout. |
| <a id="AXCL_DATA_LAYOUT_NCHW"></a>AXCL_DATA_LAYOUT_NCHW | 2 | Batch, channel, height, width layout. |

<br>

<a id="axclrtEngineDataType"></a>

## axclrtEngineDataType

Tensor data type definition.

```c
typedef enum axclrtEngineDataType {
    AXCL_DATA_TYPE_NONE = 0,    /*!< Unspecified tensor data type. */
    AXCL_DATA_TYPE_INT4 = 1,    /*!< Signed 4-bit integer. */
    AXCL_DATA_TYPE_UINT4 = 2,   /*!< Unsigned 4-bit integer. */
    AXCL_DATA_TYPE_INT8 = 3,    /*!< Signed 8-bit integer. */
    AXCL_DATA_TYPE_UINT8 = 4,   /*!< Unsigned 8-bit integer. */
    AXCL_DATA_TYPE_INT16 = 5,   /*!< Signed 16-bit integer. */
    AXCL_DATA_TYPE_UINT16 = 6,  /*!< Unsigned 16-bit integer. */
    AXCL_DATA_TYPE_INT32 = 7,   /*!< Signed 32-bit integer. */
    AXCL_DATA_TYPE_UINT32 = 8,  /*!< Unsigned 32-bit integer. */
    AXCL_DATA_TYPE_INT64 = 9,   /*!< Signed 64-bit integer. */
    AXCL_DATA_TYPE_UINT64 = 10, /*!< Unsigned 64-bit integer. */
    AXCL_DATA_TYPE_FP4 = 11,    /*!< 4-bit floating-point value. */
    AXCL_DATA_TYPE_FP8 = 12,    /*!< 8-bit floating-point value. */
    AXCL_DATA_TYPE_FP16 = 13,   /*!< IEEE 754 half-precision floating-point value. */
    AXCL_DATA_TYPE_BF16 = 14,   /*!< Brain floating-point 16-bit value. */
    AXCL_DATA_TYPE_FP32 = 15,   /*!< IEEE 754 single-precision floating-point value. */
    AXCL_DATA_TYPE_FP64 = 16,   /*!< IEEE 754 double-precision floating-point value. */
} axclrtEngineDataType;
```

### Values

| Symbol | Value | Description |
|---|---|---|
| <a id="AXCL_DATA_TYPE_NONE"></a>AXCL_DATA_TYPE_NONE | 0 | Unspecified tensor data type. |
| <a id="AXCL_DATA_TYPE_INT4"></a>AXCL_DATA_TYPE_INT4 | 1 | Signed 4-bit integer. |
| <a id="AXCL_DATA_TYPE_UINT4"></a>AXCL_DATA_TYPE_UINT4 | 2 | Unsigned 4-bit integer. |
| <a id="AXCL_DATA_TYPE_INT8"></a>AXCL_DATA_TYPE_INT8 | 3 | Signed 8-bit integer. |
| <a id="AXCL_DATA_TYPE_UINT8"></a>AXCL_DATA_TYPE_UINT8 | 4 | Unsigned 8-bit integer. |
| <a id="AXCL_DATA_TYPE_INT16"></a>AXCL_DATA_TYPE_INT16 | 5 | Signed 16-bit integer. |
| <a id="AXCL_DATA_TYPE_UINT16"></a>AXCL_DATA_TYPE_UINT16 | 6 | Unsigned 16-bit integer. |
| <a id="AXCL_DATA_TYPE_INT32"></a>AXCL_DATA_TYPE_INT32 | 7 | Signed 32-bit integer. |
| <a id="AXCL_DATA_TYPE_UINT32"></a>AXCL_DATA_TYPE_UINT32 | 8 | Unsigned 32-bit integer. |
| <a id="AXCL_DATA_TYPE_INT64"></a>AXCL_DATA_TYPE_INT64 | 9 | Signed 64-bit integer. |
| <a id="AXCL_DATA_TYPE_UINT64"></a>AXCL_DATA_TYPE_UINT64 | 10 | Unsigned 64-bit integer. |
| <a id="AXCL_DATA_TYPE_FP4"></a>AXCL_DATA_TYPE_FP4 | 11 | 4-bit floating-point value. |
| <a id="AXCL_DATA_TYPE_FP8"></a>AXCL_DATA_TYPE_FP8 | 12 | 8-bit floating-point value. |
| <a id="AXCL_DATA_TYPE_FP16"></a>AXCL_DATA_TYPE_FP16 | 13 | IEEE 754 half-precision floating-point value. |
| <a id="AXCL_DATA_TYPE_BF16"></a>AXCL_DATA_TYPE_BF16 | 14 | Brain floating-point 16-bit value. |
| <a id="AXCL_DATA_TYPE_FP32"></a>AXCL_DATA_TYPE_FP32 | 15 | IEEE 754 single-precision floating-point value. |
| <a id="AXCL_DATA_TYPE_FP64"></a>AXCL_DATA_TYPE_FP64 | 16 | IEEE 754 double-precision floating-point value. |

<br>

<a id="axclrtEngineModelKind"></a>

## axclrtEngineModelKind

Model core-count classification.

```c
typedef enum axclrtEngineModelKind {
    AXCL_MODEL_TYPE_1CORE = 0,  /*!< Model compiled for one NPU core. */
    AXCL_MODEL_TYPE_2CORE = 1,  /*!< Model compiled for two NPU cores. */
    AXCL_MODEL_TYPE_3CORE = 2,  /*!< Model compiled for three NPU cores. */
} axclrtEngineModelKind;
```

### Values

| Symbol | Value | Description |
|---|---|---|
| <a id="AXCL_MODEL_TYPE_1CORE"></a>AXCL_MODEL_TYPE_1CORE | 0 | Model compiled for one NPU core. |
| <a id="AXCL_MODEL_TYPE_2CORE"></a>AXCL_MODEL_TYPE_2CORE | 1 | Model compiled for two NPU cores. |
| <a id="AXCL_MODEL_TYPE_3CORE"></a>AXCL_MODEL_TYPE_3CORE | 2 | Model compiled for three NPU cores. |

<br>

<a id="axclrtEngineVNpuKind"></a>

## axclrtEngineVNpuKind

VNPU scheduling mode.

```c
typedef enum axclrtEngineVNpuKind {
    AXCL_VNPU_DISABLE = 0,     /*!< Disable VNPU mode. */
    AXCL_VNPU_ENABLE = 1,      /*!< Enable VNPU mode. */
    AXCL_VNPU_BIG_LITTLE = 2,  /*!< Select the big-little VNPU mode. */
    AXCL_VNPU_LITTLE_BIG = 3,  /*!< Select the little-big VNPU mode. */
} axclrtEngineVNpuKind;
```

### Values

| Symbol | Value | Description |
|---|---|---|
| <a id="AXCL_VNPU_DISABLE"></a>AXCL_VNPU_DISABLE | 0 | Disable VNPU mode. |
| <a id="AXCL_VNPU_ENABLE"></a>AXCL_VNPU_ENABLE | 1 | Enable VNPU mode. |
| <a id="AXCL_VNPU_BIG_LITTLE"></a>AXCL_VNPU_BIG_LITTLE | 2 | Select the big-little VNPU mode. |
| <a id="AXCL_VNPU_LITTLE_BIG"></a>AXCL_VNPU_LITTLE_BIG | 3 | Select the little-big VNPU mode. |

<br>

<a id="axclrtMemAttr"></a>

## axclrtMemAttr

Memory information type for [axclrtGetMemInfo](../memory_api.md#axclrtGetMemInfo).

```c
typedef enum axclrtMemAttr {
    AXCL_DDR_CMM = 0,  /*!< Device contiguous memory manager pools. */
    AXCL_DDR_SYS = 1,  /*!< Device system memory reported by MemFree and MemTotal. */
} axclrtMemAttr;
```

### Values

| Symbol | Value | Description |
|---|---|---|
| <a id="AXCL_DDR_CMM"></a>AXCL_DDR_CMM | 0 | Device contiguous memory manager pools. |
| <a id="AXCL_DDR_SYS"></a>AXCL_DDR_SYS | 1 | Device system memory reported by MemFree and MemTotal. |

<br>

<a id="axclrtMemLocationType"></a>

## axclrtMemLocationType

Memory location type for [axclrtPointerGetAttributes](../memory_api.md#axclrtPointerGetAttributes).

```c
typedef enum axclrtMemLocationType {
    AXCL_MEM_LOCATION_TYPE_UNREGISTERED = 0,  /*!< Pointer is not tracked by the AXCL runtime. */
    AXCL_MEM_LOCATION_TYPE_HOST = 1,          /*!< Pointer refers to host memory. */
    AXCL_MEM_LOCATION_TYPE_DEVICE = 2,        /*!< Pointer refers to device memory. */
} axclrtMemLocationType;
```

### Values

| Symbol | Value | Description |
|---|---|---|
| <a id="AXCL_MEM_LOCATION_TYPE_UNREGISTERED"></a>AXCL_MEM_LOCATION_TYPE_UNREGISTERED | 0 | Pointer is not tracked by the AXCL runtime. |
| <a id="AXCL_MEM_LOCATION_TYPE_HOST"></a>AXCL_MEM_LOCATION_TYPE_HOST | 1 | Pointer refers to host memory. |
| <a id="AXCL_MEM_LOCATION_TYPE_DEVICE"></a>AXCL_MEM_LOCATION_TYPE_DEVICE | 2 | Pointer refers to device memory. |

<br>

<a id="axclrtMemMallocPolicy"></a>

## axclrtMemMallocPolicy

Mem malloc policy enum.

```c
typedef enum axclrtMemMallocPolicy {
    AXCL_MEM_MALLOC_HUGE_FIRST      = 0,  /*!< Huge first */
    AXCL_MEM_MALLOC_HUGE_ONLY       = 1,  /*!< Huge only */
    AXCL_MEM_MALLOC_NORMAL_ONLY     = 2,  /*!< Normal only */
    AXCL_MEM_MALLOC_SIZE_ALIGN      = 3   /*!< Size aligned */
} axclrtMemMallocPolicy;
```

### Values

| Symbol | Value | Description |
|---|---|---|
| <a id="AXCL_MEM_MALLOC_HUGE_FIRST"></a>AXCL_MEM_MALLOC_HUGE_FIRST | 0 | Huge first |
| <a id="AXCL_MEM_MALLOC_HUGE_ONLY"></a>AXCL_MEM_MALLOC_HUGE_ONLY | 1 | Huge only |
| <a id="AXCL_MEM_MALLOC_NORMAL_ONLY"></a>AXCL_MEM_MALLOC_NORMAL_ONLY | 2 | Normal only |
| <a id="AXCL_MEM_MALLOC_SIZE_ALIGN"></a>AXCL_MEM_MALLOC_SIZE_ALIGN | 3 | Size aligned |

<br>

<a id="axclrtMemcpyKind"></a>

## axclrtMemcpyKind

Memcpy kind enum.

```c
typedef enum axclrtMemcpyKind {
    AXCL_MEMCPY_HOST_TO_HOST         = 0,   /*!< Host virtual memory to host virtual memory */
    AXCL_MEMCPY_HOST_TO_DEVICE       = 1,   /*!< Host virtual memory to device memory */
    AXCL_MEMCPY_DEVICE_TO_HOST       = 2,   /*!< Device memory to host virtual memory */
    AXCL_MEMCPY_DEVICE_TO_DEVICE     = 3,   /*!< Device memory to device memory */
    AXCL_MEMCPY_HOST_PHY_TO_DEVICE   = 4,   /*!< Host physical memory to device memory */
    AXCL_MEMCPY_DEVICE_TO_HOST_PHY   = 5    /*!< Device memory to host physical memory */
} axclrtMemcpyKind;
```

### Values

| Symbol | Value | Description |
|---|---|---|
| <a id="AXCL_MEMCPY_HOST_TO_HOST"></a>AXCL_MEMCPY_HOST_TO_HOST | 0 | Host virtual memory to host virtual memory |
| <a id="AXCL_MEMCPY_HOST_TO_DEVICE"></a>AXCL_MEMCPY_HOST_TO_DEVICE | 1 | Host virtual memory to device memory |
| <a id="AXCL_MEMCPY_DEVICE_TO_HOST"></a>AXCL_MEMCPY_DEVICE_TO_HOST | 2 | Device memory to host virtual memory |
| <a id="AXCL_MEMCPY_DEVICE_TO_DEVICE"></a>AXCL_MEMCPY_DEVICE_TO_DEVICE | 3 | Device memory to device memory |
| <a id="AXCL_MEMCPY_HOST_PHY_TO_DEVICE"></a>AXCL_MEMCPY_HOST_PHY_TO_DEVICE | 4 | Host physical memory to device memory |
| <a id="AXCL_MEMCPY_DEVICE_TO_HOST_PHY"></a>AXCL_MEMCPY_DEVICE_TO_HOST_PHY | 5 | Device memory to host physical memory |

<br>

<a id="axclrtPointerAttributeFlag"></a>

## axclrtPointerAttributeFlag

Pointer attribute flags for [axclrtPointerGetAttributes](../memory_api.md#axclrtPointerGetAttributes).

```c
typedef enum axclrtPointerAttributeFlag {
    AXCL_POINTER_ATTRIBUTE_FLAG_NONE = 0,    /*!< No additional pointer attributes. */
    AXCL_POINTER_ATTRIBUTE_FLAG_CACHED = 1,  /*!< Device memory is mapped as cached memory. */
} axclrtPointerAttributeFlag;
```

### Values

| Symbol | Value | Description |
|---|---|---|
| <a id="AXCL_POINTER_ATTRIBUTE_FLAG_NONE"></a>AXCL_POINTER_ATTRIBUTE_FLAG_NONE | 0 | No additional pointer attributes. |
| <a id="AXCL_POINTER_ATTRIBUTE_FLAG_CACHED"></a>AXCL_POINTER_ATTRIBUTE_FLAG_CACHED | 1 | Device memory is mapped as cached memory. |

<br>

<a id="axclrtStreamStatus"></a>

## axclrtStreamStatus

Stream status enum.

```c
typedef enum axclrtStreamStatus {
    AXCL_STREAM_STATUS_COMPLETE  = 0,       /*!< All tasks on the stream have completed */
    AXCL_STREAM_STATUS_NOT_READY = 1,       /*!< At least one task on the stream has not completed */
    AXCL_STREAM_STATUS_RESERVED  = 0xFFFF,  /*!< Reserved; set when the query call itself fails */
} axclrtStreamStatus;
```

### Values

| Symbol | Value | Description |
|---|---|---|
| <a id="AXCL_STREAM_STATUS_COMPLETE"></a>AXCL_STREAM_STATUS_COMPLETE | 0 | All tasks on the stream have completed |
| <a id="AXCL_STREAM_STATUS_NOT_READY"></a>AXCL_STREAM_STATUS_NOT_READY | 1 | At least one task on the stream has not completed |
| <a id="AXCL_STREAM_STATUS_RESERVED"></a>AXCL_STREAM_STATUS_RESERVED | 0xFFFF | Reserved; set when the query call itself fails |
