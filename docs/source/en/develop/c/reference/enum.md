# Enum

<a id="AXCL_ERROR_E"></a>

## AXCL_ERROR_E

Common AXCL status and generic error identifiers.

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
    AXCL_ERR_UNKNOWN            = AXCL_FAIL,

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

    AXCL_ERR_MODULE_BASE        = 0x20,
    AXCL_ERR_BUTT               = 0x7F
} AXCL_ERROR_E;
```

### Values

| Symbol | Value | Description |
|---|---|---|
| <a id="AXCL_SUCC"></a>AXCL_SUCC | 0x00 | The operation completed successfully. |
| <a id="AXCL_FAIL"></a>AXCL_FAIL | 0x01 | A generic failure occurred. |
| <a id="AXCL_ERR_UNKNOWN"></a>AXCL_ERR_UNKNOWN | AXCL_FAIL | - |
| <a id="AXCL_ERR_NULL_POINTER"></a>AXCL_ERR_NULL_POINTER | 0x02 | A null pointer was passed. |
| <a id="AXCL_ERR_ILLEGAL_PARAM"></a>AXCL_ERR_ILLEGAL_PARAM | 0x03 | An invalid parameter was passed. |
| <a id="AXCL_ERR_UNSUPPORT"></a>AXCL_ERR_UNSUPPORT | 0x04 | The requested operation is not supported. |
| <a id="AXCL_ERR_TIMEOUT"></a>AXCL_ERR_TIMEOUT | 0x05 | The operation timed out. |
| <a id="AXCL_ERR_BUSY"></a>AXCL_ERR_BUSY | 0x06 | The module is busy. |
| <a id="AXCL_ERR_NO_MEMORY"></a>AXCL_ERR_NO_MEMORY | 0x07 | Memory allocation failed. |
| <a id="AXCL_ERR_ENCODE"></a>AXCL_ERR_ENCODE | 0x08 | Packet encoding failed. |
| <a id="AXCL_ERR_DECODE"></a>AXCL_ERR_DECODE | 0x09 | Packet decoding failed. |
| <a id="AXCL_ERR_UNEXPECT_RESPONSE"></a>AXCL_ERR_UNEXPECT_RESPONSE | 0x0A | An unexpected response was received. |
| <a id="AXCL_ERR_MODULE_BASE"></a>AXCL_ERR_MODULE_BASE | 0x20 | - |
| <a id="AXCL_ERR_BUTT"></a>AXCL_ERR_BUTT | 0x7F | - |

<br>

<a id="axclrtEngineDataLayout"></a>

## axclrtEngineDataLayout

Tensor layout definition.

```c
typedef enum axclrtEngineDataLayout {
    AXCL_DATA_LAYOUT_NONE = 0,
    AXCL_DATA_LAYOUT_NHWC = 1,
    AXCL_DATA_LAYOUT_NCHW = 2,
} axclrtEngineDataLayout;
```

### Values

| Symbol | Value | Description |
|---|---|---|
| <a id="AXCL_DATA_LAYOUT_NONE"></a>AXCL_DATA_LAYOUT_NONE | 0 | - |
| <a id="AXCL_DATA_LAYOUT_NHWC"></a>AXCL_DATA_LAYOUT_NHWC | 1 | - |
| <a id="AXCL_DATA_LAYOUT_NCHW"></a>AXCL_DATA_LAYOUT_NCHW | 2 | - |

<br>

<a id="axclrtEngineDataType"></a>

## axclrtEngineDataType

Tensor data type definition.

```c
typedef enum axclrtEngineDataType {
    AXCL_DATA_TYPE_NONE = 0,
    AXCL_DATA_TYPE_INT4 = 1,
    AXCL_DATA_TYPE_UINT4 = 2,
    AXCL_DATA_TYPE_INT8 = 3,
    AXCL_DATA_TYPE_UINT8 = 4,
    AXCL_DATA_TYPE_INT16 = 5,
    AXCL_DATA_TYPE_UINT16 = 6,
    AXCL_DATA_TYPE_INT32 = 7,
    AXCL_DATA_TYPE_UINT32 = 8,
    AXCL_DATA_TYPE_INT64 = 9,
    AXCL_DATA_TYPE_UINT64 = 10,
    AXCL_DATA_TYPE_FP4 = 11,
    AXCL_DATA_TYPE_FP8 = 12,
    AXCL_DATA_TYPE_FP16 = 13,
    AXCL_DATA_TYPE_BF16 = 14,
    AXCL_DATA_TYPE_FP32 = 15,
    AXCL_DATA_TYPE_FP64 = 16,
} axclrtEngineDataType;
```

### Values

| Symbol | Value | Description |
|---|---|---|
| <a id="AXCL_DATA_TYPE_NONE"></a>AXCL_DATA_TYPE_NONE | 0 | - |
| <a id="AXCL_DATA_TYPE_INT4"></a>AXCL_DATA_TYPE_INT4 | 1 | - |
| <a id="AXCL_DATA_TYPE_UINT4"></a>AXCL_DATA_TYPE_UINT4 | 2 | - |
| <a id="AXCL_DATA_TYPE_INT8"></a>AXCL_DATA_TYPE_INT8 | 3 | - |
| <a id="AXCL_DATA_TYPE_UINT8"></a>AXCL_DATA_TYPE_UINT8 | 4 | - |
| <a id="AXCL_DATA_TYPE_INT16"></a>AXCL_DATA_TYPE_INT16 | 5 | - |
| <a id="AXCL_DATA_TYPE_UINT16"></a>AXCL_DATA_TYPE_UINT16 | 6 | - |
| <a id="AXCL_DATA_TYPE_INT32"></a>AXCL_DATA_TYPE_INT32 | 7 | - |
| <a id="AXCL_DATA_TYPE_UINT32"></a>AXCL_DATA_TYPE_UINT32 | 8 | - |
| <a id="AXCL_DATA_TYPE_INT64"></a>AXCL_DATA_TYPE_INT64 | 9 | - |
| <a id="AXCL_DATA_TYPE_UINT64"></a>AXCL_DATA_TYPE_UINT64 | 10 | - |
| <a id="AXCL_DATA_TYPE_FP4"></a>AXCL_DATA_TYPE_FP4 | 11 | - |
| <a id="AXCL_DATA_TYPE_FP8"></a>AXCL_DATA_TYPE_FP8 | 12 | - |
| <a id="AXCL_DATA_TYPE_FP16"></a>AXCL_DATA_TYPE_FP16 | 13 | - |
| <a id="AXCL_DATA_TYPE_BF16"></a>AXCL_DATA_TYPE_BF16 | 14 | - |
| <a id="AXCL_DATA_TYPE_FP32"></a>AXCL_DATA_TYPE_FP32 | 15 | - |
| <a id="AXCL_DATA_TYPE_FP64"></a>AXCL_DATA_TYPE_FP64 | 16 | - |

<br>

<a id="axclrtEngineModelKind"></a>

## axclrtEngineModelKind

Model core-count classification.

```c
typedef enum axclrtEngineModelKind {
    AXCL_MODEL_TYPE_1CORE = 0,
    AXCL_MODEL_TYPE_2CORE = 1,
    AXCL_MODEL_TYPE_3CORE = 2,
} axclrtEngineModelKind;
```

### Values

| Symbol | Value | Description |
|---|---|---|
| <a id="AXCL_MODEL_TYPE_1CORE"></a>AXCL_MODEL_TYPE_1CORE | 0 | - |
| <a id="AXCL_MODEL_TYPE_2CORE"></a>AXCL_MODEL_TYPE_2CORE | 1 | - |
| <a id="AXCL_MODEL_TYPE_3CORE"></a>AXCL_MODEL_TYPE_3CORE | 2 | - |

<br>

<a id="axclrtEngineVNpuKind"></a>

## axclrtEngineVNpuKind

VNPU scheduling mode.

```c
typedef enum axclrtEngineVNpuKind {
    AXCL_VNPU_DISABLE = 0,
    AXCL_VNPU_ENABLE = 1,
    AXCL_VNPU_BIG_LITTLE = 2,
    AXCL_VNPU_LITTLE_BIG = 3,
} axclrtEngineVNpuKind;
```

### Values

| Symbol | Value | Description |
|---|---|---|
| <a id="AXCL_VNPU_DISABLE"></a>AXCL_VNPU_DISABLE | 0 | - |
| <a id="AXCL_VNPU_ENABLE"></a>AXCL_VNPU_ENABLE | 1 | - |
| <a id="AXCL_VNPU_BIG_LITTLE"></a>AXCL_VNPU_BIG_LITTLE | 2 | - |
| <a id="AXCL_VNPU_LITTLE_BIG"></a>AXCL_VNPU_LITTLE_BIG | 3 | - |

<br>

<a id="axclrtFileTransferPolicy"></a>

## axclrtFileTransferPolicy

File transfer policy enum.

```c
typedef enum axclrtFileTransferPolicy {
    AXCL_FILE_TRANSFER_FROM_HOST_TO_DEVICE   = 0,  /*!< Transfer file from host to device */
    AXCL_FILE_TRANSFER_FROM_DEVICE_TO_HOST   = 1,  /*!< Transfer file from device to host */
    AXCL_FILE_TRANSFER_FROM_DEVICE_TO_DEVICE = 2,  /*!< Transfer file from device to device */
    AXCL_FILE_TRANSFER_REMOVE_DEVICE_FILE    = 3   /*!< Remove file from device */
} axclrtFileTransferPolicy;
```

### Values

| Symbol | Value | Description |
|---|---|---|
| <a id="AXCL_FILE_TRANSFER_FROM_HOST_TO_DEVICE"></a>AXCL_FILE_TRANSFER_FROM_HOST_TO_DEVICE | 0 | Transfer file from host to device |
| <a id="AXCL_FILE_TRANSFER_FROM_DEVICE_TO_HOST"></a>AXCL_FILE_TRANSFER_FROM_DEVICE_TO_HOST | 1 | Transfer file from device to host |
| <a id="AXCL_FILE_TRANSFER_FROM_DEVICE_TO_DEVICE"></a>AXCL_FILE_TRANSFER_FROM_DEVICE_TO_DEVICE | 2 | Transfer file from device to device |
| <a id="AXCL_FILE_TRANSFER_REMOVE_DEVICE_FILE"></a>AXCL_FILE_TRANSFER_REMOVE_DEVICE_FILE | 3 | Remove file from device |

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
