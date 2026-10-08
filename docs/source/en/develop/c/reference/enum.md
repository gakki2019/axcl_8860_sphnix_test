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

<a id="axCclDataType"></a>

## axCclDataType

Collective data types. Coverage follows what frameworks actually emit.

```c
typedef enum axCclDataType {
    AX_CCL_DT_INT8       = 0,
    AX_CCL_DT_UINT8      = 1,
    AX_CCL_DT_INT16      = 2,   /* reserved */
    AX_CCL_DT_UINT16     = 3,   /* reserved */
    AX_CCL_DT_INT32      = 4,
    AX_CCL_DT_UINT32     = 5,
    AX_CCL_DT_INT64      = 6,
    AX_CCL_DT_UINT64     = 7,
    AX_CCL_DT_FP16       = 8,
    AX_CCL_DT_FP32       = 9,
    AX_CCL_DT_FP64       = 10,
    AX_CCL_DT_BF16       = 11,
    AX_CCL_DT_FP8_E4M3   = 12,
    AX_CCL_DT_FP8_E5M2   = 13,
    AX_CCL_DT_BUTT
} axCclDataType;
```

### Values

| Symbol | Value | Description |
|---|---|---|
| <a id="AX_CCL_DT_INT8"></a>AX_CCL_DT_INT8 | 0 | - |
| <a id="AX_CCL_DT_UINT8"></a>AX_CCL_DT_UINT8 | 1 | - |
| <a id="AX_CCL_DT_INT16"></a>AX_CCL_DT_INT16 | 2 | - |
| <a id="AX_CCL_DT_UINT16"></a>AX_CCL_DT_UINT16 | 3 | - |
| <a id="AX_CCL_DT_INT32"></a>AX_CCL_DT_INT32 | 4 | - |
| <a id="AX_CCL_DT_UINT32"></a>AX_CCL_DT_UINT32 | 5 | - |
| <a id="AX_CCL_DT_INT64"></a>AX_CCL_DT_INT64 | 6 | - |
| <a id="AX_CCL_DT_UINT64"></a>AX_CCL_DT_UINT64 | 7 | - |
| <a id="AX_CCL_DT_FP16"></a>AX_CCL_DT_FP16 | 8 | - |
| <a id="AX_CCL_DT_FP32"></a>AX_CCL_DT_FP32 | 9 | - |
| <a id="AX_CCL_DT_FP64"></a>AX_CCL_DT_FP64 | 10 | - |
| <a id="AX_CCL_DT_BF16"></a>AX_CCL_DT_BF16 | 11 | - |
| <a id="AX_CCL_DT_FP8_E4M3"></a>AX_CCL_DT_FP8_E4M3 | 12 | - |
| <a id="AX_CCL_DT_FP8_E5M2"></a>AX_CCL_DT_FP8_E5M2 | 13 | - |
| <a id="AX_CCL_DT_BUTT"></a>AX_CCL_DT_BUTT | - | - |

<br>

<a id="axCclRedOp"></a>

## axCclRedOp

Built-in reduction operators.

```c
typedef enum axCclRedOp {
    AX_CCL_OP_SUM  = 0,
    AX_CCL_OP_PROD = 1,
    AX_CCL_OP_MIN  = 2,
    AX_CCL_OP_MAX  = 3,
    AX_CCL_OP_AVG  = 4,
    AX_CCL_OP_BUTT
} axCclRedOp;
```

### Values

| Symbol | Value | Description |
|---|---|---|
| <a id="AX_CCL_OP_SUM"></a>AX_CCL_OP_SUM | 0 | - |
| <a id="AX_CCL_OP_PROD"></a>AX_CCL_OP_PROD | 1 | - |
| <a id="AX_CCL_OP_MIN"></a>AX_CCL_OP_MIN | 2 | - |
| <a id="AX_CCL_OP_MAX"></a>AX_CCL_OP_MAX | 3 | - |
| <a id="AX_CCL_OP_AVG"></a>AX_CCL_OP_AVG | 4 | - |
| <a id="AX_CCL_OP_BUTT"></a>AX_CCL_OP_BUTT | - | - |

<br>

<a id="axCclScalarResidence"></a>

## axCclScalarResidence

Where a reduction pre-multiplier scalar resides, for [axCclRedOpCreatePreMulSum](../axccl_api.md#axCclRedOpCreatePreMulSum).

```c
typedef enum axCclScalarResidence {
    AX_CCL_RES_HOST   = 0,  /*!< Scalar points to Host-accessible memory. */
    AX_CCL_RES_DEVICE = 1,  /*!< Scalar points to Device memory. */
} axCclScalarResidence;
```

### Values

| Symbol | Value | Description |
|---|---|---|
| <a id="AX_CCL_RES_HOST"></a>AX_CCL_RES_HOST | 0 | Scalar points to Host-accessible memory. |
| <a id="AX_CCL_RES_DEVICE"></a>AX_CCL_RES_DEVICE | 1 | Scalar points to Device memory. |

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
    AXCL_DEVICE_ATTR_PCIE_VENDOR_ID,          /*!< PCIe Vendor ID. */
    AXCL_DEVICE_ATTR_PCIE_DEVICE_ID,          /*!< PCIe Device ID. */
    AXCL_DEVICE_ATTR_PCIE_SUB_VENDOR_ID,      /*!< PCIe Subsystem Vendor ID. */
    AXCL_DEVICE_ATTR_PCIE_SUB_DEVICE_ID,      /*!< PCIe Subsystem Device ID. */
    AXCL_DEVICE_ATTR_PCIE_MAX_SPEED,          /*!< PCIe maximum link speed in MT/s (e.g. 32000 for 32.0 GT/s). */
    AXCL_DEVICE_ATTR_PCIE_MAX_WIDTH,          /*!< PCIe maximum link width (e.g. 8 for x8). */
    AXCL_DEVICE_ATTR_PCIE_CUR_SPEED,          /*!< PCIe current link speed in MT/s (e.g. 8000 for 8.0 GT/s). */
    AXCL_DEVICE_ATTR_PCIE_CUR_WIDTH,          /*!< PCIe current link width (e.g. 4 for x4). */
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
| <a id="AXCL_DEVICE_ATTR_PCIE_VENDOR_ID"></a>AXCL_DEVICE_ATTR_PCIE_VENDOR_ID | - | PCIe Vendor ID. |
| <a id="AXCL_DEVICE_ATTR_PCIE_DEVICE_ID"></a>AXCL_DEVICE_ATTR_PCIE_DEVICE_ID | - | PCIe Device ID. |
| <a id="AXCL_DEVICE_ATTR_PCIE_SUB_VENDOR_ID"></a>AXCL_DEVICE_ATTR_PCIE_SUB_VENDOR_ID | - | PCIe Subsystem Vendor ID. |
| <a id="AXCL_DEVICE_ATTR_PCIE_SUB_DEVICE_ID"></a>AXCL_DEVICE_ATTR_PCIE_SUB_DEVICE_ID | - | PCIe Subsystem Device ID. |
| <a id="AXCL_DEVICE_ATTR_PCIE_MAX_SPEED"></a>AXCL_DEVICE_ATTR_PCIE_MAX_SPEED | - | PCIe maximum link speed in MT/s (e.g. 32000 for 32.0 GT/s). |
| <a id="AXCL_DEVICE_ATTR_PCIE_MAX_WIDTH"></a>AXCL_DEVICE_ATTR_PCIE_MAX_WIDTH | - | PCIe maximum link width (e.g. 8 for x8). |
| <a id="AXCL_DEVICE_ATTR_PCIE_CUR_SPEED"></a>AXCL_DEVICE_ATTR_PCIE_CUR_SPEED | - | PCIe current link speed in MT/s (e.g. 8000 for 8.0 GT/s). |
| <a id="AXCL_DEVICE_ATTR_PCIE_CUR_WIDTH"></a>AXCL_DEVICE_ATTR_PCIE_CUR_WIDTH | - | PCIe current link width (e.g. 4 for x4). |
| <a id="AXCL_DEVICE_ATTR_BUTT"></a>AXCL_DEVICE_ATTR_BUTT | - | Upper boundary of valid device attributes. |

<br>

<a id="axclrtDeviceState"></a>

## axclrtDeviceState

Device state for [axclrtRegDeviceStateCallback](../device_api.md#axclrtRegDeviceStateCallback).

```c
typedef enum axclrtDeviceState {
    AXCL_RT_DEVICE_STATE_ONLINE = 0,   /*!< The device is online; currently not reported by the callback. */
    AXCL_RT_DEVICE_STATE_OFFLINE = 1,  /*!< The device, or the worker process serving this process on it, has become unavailable. */
    AXCL_RT_DEVICE_STATE_BUTT          /*!< Upper boundary of valid device states. */
} axclrtDeviceState;
```

### Values

| Symbol | Value | Description |
|---|---|---|
| <a id="AXCL_RT_DEVICE_STATE_ONLINE"></a>AXCL_RT_DEVICE_STATE_ONLINE | 0 | The device is online; currently not reported by the callback. |
| <a id="AXCL_RT_DEVICE_STATE_OFFLINE"></a>AXCL_RT_DEVICE_STATE_OFFLINE | 1 | The device, or the worker process serving this process on it, has become unavailable. |
| <a id="AXCL_RT_DEVICE_STATE_BUTT"></a>AXCL_RT_DEVICE_STATE_BUTT | - | Upper boundary of valid device states. |

<br>

<a id="axclrtDeviceStatus"></a>

## axclrtDeviceStatus

Device availability status for [axclrtQueryDeviceStatus](../device_api.md#axclrtQueryDeviceStatus).

```c
typedef enum axclrtDeviceStatus {
    AXCL_RT_DEVICE_STATUS_ABNORMAL = 0,  /*!< The device is visible and exists, but is not active or is offline. */
    AXCL_RT_DEVICE_STATUS_NORMAL = 1,    /*!< The device is visible, exists, is active, and is not offline. */
} axclrtDeviceStatus;
```

### Values

| Symbol | Value | Description |
|---|---|---|
| <a id="AXCL_RT_DEVICE_STATUS_ABNORMAL"></a>AXCL_RT_DEVICE_STATUS_ABNORMAL | 0 | The device is visible and exists, but is not active or is offline. |
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

<a id="axclrtEventStatus"></a>

## axclrtEventStatus

Event status enum.

```c
typedef enum axclrtEventStatus {
    AXCL_EVENT_STATUS_COMPLETE  = 0,       /*!< All tasks captured by the event have completed */
    AXCL_EVENT_STATUS_NOT_READY = 1,       /*!< At least one task captured by the event has not completed */
    AXCL_EVENT_STATUS_RESERVED  = 0xFFFF,  /*!< Reserved; set when the query call itself fails */
} axclrtEventStatus;
```

### Values

| Symbol | Value | Description |
|---|---|---|
| <a id="AXCL_EVENT_STATUS_COMPLETE"></a>AXCL_EVENT_STATUS_COMPLETE | 0 | All tasks captured by the event have completed |
| <a id="AXCL_EVENT_STATUS_NOT_READY"></a>AXCL_EVENT_STATUS_NOT_READY | 1 | At least one task captured by the event has not completed |
| <a id="AXCL_EVENT_STATUS_RESERVED"></a>AXCL_EVENT_STATUS_RESERVED | 0xFFFF | Reserved; set when the query call itself fails |

<br>

<a id="axclrtFileTransferPolicy"></a>

## axclrtFileTransferPolicy

File transfer operation.

```c
typedef enum axclrtFileTransferPolicy {
    FILE_TRANSFER_FROM_HOST_TO_DEVICE = 0,    /*!< Copy a Host file to the Device. */
    FILE_TRANSFER_FROM_DEVICE_TO_HOST = 1,    /*!< Copy a Device file to the Host. */
    FILE_TRANSFER_FROM_DEVICE_TO_DEVICE = 2,  /*!< Copy a file within the Device. */
    FILE_TRANSFER_REMOVE_DEVICE_FILE = 3,     /*!< Remove a Device file. */
} axclrtFileTransferPolicy;
```

### Values

| Symbol | Value | Description |
|---|---|---|
| <a id="FILE_TRANSFER_FROM_HOST_TO_DEVICE"></a>FILE_TRANSFER_FROM_HOST_TO_DEVICE | 0 | Copy a Host file to the Device. |
| <a id="FILE_TRANSFER_FROM_DEVICE_TO_HOST"></a>FILE_TRANSFER_FROM_DEVICE_TO_HOST | 1 | Copy a Device file to the Host. |
| <a id="FILE_TRANSFER_FROM_DEVICE_TO_DEVICE"></a>FILE_TRANSFER_FROM_DEVICE_TO_DEVICE | 2 | Copy a file within the Device. |
| <a id="FILE_TRANSFER_REMOVE_DEVICE_FILE"></a>FILE_TRANSFER_REMOVE_DEVICE_FILE | 3 | Remove a Device file. |

<br>

<a id="axclrtLogTarget"></a>

## axclrtLogTarget

Log level target for [axclrtSetLogLevel](../other_api.md#axclrtSetLogLevel) and [axclrtGetLogLevel](../other_api.md#axclrtGetLogLevel).

```c
typedef enum {
    AXCL_LOG_TARGET_HOST_RUNTIME_FILE = 0,    /*!< Host runtime file logger (asynchronous). */
    AXCL_LOG_TARGET_HOST_RUNTIME_CONSOLE,     /*!< Host runtime console logger (synchronous). */
    AXCL_LOG_TARGET_DEVICE_WORKER_FILE,       /*!< Device worker file logger of the current thread's active Device.
                                                   Requires an active Device on the current thread; call
                                                   @ref axclrtSetDevice or @ref axclrtCreateContext first. */
    AXCL_LOG_TARGET_DEVICE_WORKER_CONSOLE,    /*!< Device worker console logger of the current thread's active Device.
                                                   Requires an active Device on the current thread; call
                                                   @ref axclrtSetDevice or @ref axclrtCreateContext first. */
    AXCL_LOG_TARGET_BUTT,                     /*!< Invalid target; boundary value only. */
} axclrtLogTarget;
```

### Values

| Symbol | Value | Description |
|---|---|---|
| <a id="AXCL_LOG_TARGET_HOST_RUNTIME_FILE"></a>AXCL_LOG_TARGET_HOST_RUNTIME_FILE | 0 | Host runtime file logger (asynchronous). |
| <a id="AXCL_LOG_TARGET_HOST_RUNTIME_CONSOLE"></a>AXCL_LOG_TARGET_HOST_RUNTIME_CONSOLE | - | Host runtime console logger (synchronous). |
| <a id="AXCL_LOG_TARGET_DEVICE_WORKER_FILE"></a>AXCL_LOG_TARGET_DEVICE_WORKER_FILE | - | Device worker file logger of the current thread's active Device. Requires an active Device on the current thread; call [axclrtSetDevice](../device_api.md#axclrtSetDevice) or [axclrtCreateContext](../context_api.md#axclrtCreateContext) first. |
| <a id="AXCL_LOG_TARGET_DEVICE_WORKER_CONSOLE"></a>AXCL_LOG_TARGET_DEVICE_WORKER_CONSOLE | - | Device worker console logger of the current thread's active Device. Requires an active Device on the current thread; call [axclrtSetDevice](../device_api.md#axclrtSetDevice) or [axclrtCreateContext](../context_api.md#axclrtCreateContext) first. |
| <a id="AXCL_LOG_TARGET_BUTT"></a>AXCL_LOG_TARGET_BUTT | - | Invalid target; boundary value only. |

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
    AXCL_MEMCPY_DEVICE_TO_DEVICE     = 3    /*!< Device memory to device memory */
} axclrtMemcpyKind;
```

### Values

| Symbol | Value | Description |
|---|---|---|
| <a id="AXCL_MEMCPY_HOST_TO_HOST"></a>AXCL_MEMCPY_HOST_TO_HOST | 0 | Host virtual memory to host virtual memory |
| <a id="AXCL_MEMCPY_HOST_TO_DEVICE"></a>AXCL_MEMCPY_HOST_TO_DEVICE | 1 | Host virtual memory to device memory |
| <a id="AXCL_MEMCPY_DEVICE_TO_HOST"></a>AXCL_MEMCPY_DEVICE_TO_HOST | 2 | Device memory to host virtual memory |
| <a id="AXCL_MEMCPY_DEVICE_TO_DEVICE"></a>AXCL_MEMCPY_DEVICE_TO_DEVICE | 3 | Device memory to device memory |

<br>

<a id="axclrtPointerAttributeFlag"></a>

## axclrtPointerAttributeFlag

Pointer attribute flags for [axclrtPointerGetAttributes](../memory_api.md#axclrtPointerGetAttributes).

```c
typedef enum axclrtPointerAttributeFlag {
    AXCL_POINTER_ATTRIBUTE_FLAG_NONE = 0,      /*!< No additional pointer attributes. */
    AXCL_POINTER_ATTRIBUTE_FLAG_CACHED = 1,    /*!< Device memory is mapped as cached memory. */
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
