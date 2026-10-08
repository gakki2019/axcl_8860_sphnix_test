# 枚举

<a id="AXCL_ERROR_E"></a>

## 1. AXCL_ERROR_E

通用错误码。

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

### 1.1. 取值

| 符号 | 值 | 说明 |
|---|---|---|
| <a id="AXCL_SUCC"></a>AXCL_SUCC | 0x00 | 操作成功完成。 |
| <a id="AXCL_FAIL"></a>AXCL_FAIL | 0x01 | 发生通用失败。 |
| <a id="AXCL_ERR_UNKNOWN"></a>AXCL_ERR_UNKNOWN | AXCL_FAIL | [AXCL_FAIL](#AXCL_FAIL) 的别名，表示未指定的错误。 |
| <a id="AXCL_ERR_NULL_POINTER"></a>AXCL_ERR_NULL_POINTER | 0x02 | 传入空指针。 |
| <a id="AXCL_ERR_ILLEGAL_PARAM"></a>AXCL_ERR_ILLEGAL_PARAM | 0x03 | 传入非法参数。 |
| <a id="AXCL_ERR_UNSUPPORT"></a>AXCL_ERR_UNSUPPORT | 0x04 | 请求的操作不支持。 |
| <a id="AXCL_ERR_TIMEOUT"></a>AXCL_ERR_TIMEOUT | 0x05 | 操作超时。 |
| <a id="AXCL_ERR_BUSY"></a>AXCL_ERR_BUSY | 0x06 | 模块忙。 |
| <a id="AXCL_ERR_NO_MEMORY"></a>AXCL_ERR_NO_MEMORY | 0x07 | 内存分配失败。 |
| <a id="AXCL_ERR_ENCODE"></a>AXCL_ERR_ENCODE | 0x08 | 报文编码失败。 |
| <a id="AXCL_ERR_DECODE"></a>AXCL_ERR_DECODE | 0x09 | 报文解码失败。 |
| <a id="AXCL_ERR_UNEXPECT_RESPONSE"></a>AXCL_ERR_UNEXPECT_RESPONSE | 0x0A | 收到非预期响应。 |
| <a id="AXCL_ERR_NATIVE_FAILED"></a>AXCL_ERR_NATIVE_FAILED | 0x0B | Native 操作失败且无详细错误信息。 |
| <a id="AXCL_ERR_MODULE_BASE"></a>AXCL_ERR_MODULE_BASE | 0x20 | 为模块特定错误保留的第一个标识符。 |
| <a id="AXCL_ERR_BUTT"></a>AXCL_ERR_BUTT | 0x7F | 通用错误标识符范围的上边界。 |

<br>

<a id="axclrtDevAttr"></a>

## 2. axclrtDevAttr

[axclrtGetDeviceInfo](../device_api.md#axclrtGetDeviceInfo) 使用的 Device 属性类型。

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

### 3.1. 取值

| 符号 | 值 | 说明 |
|---|---|---|
| <a id="AXCL_DEVICE_ATTR_PHYSICAL_DEVICE_ID"></a>AXCL_DEVICE_ATTR_PHYSICAL_DEVICE_ID | 0 | 虚拟 Device ID 映射到的物理 Device ID。 |
| <a id="AXCL_DEVICE_ATTR_TYPE"></a>AXCL_DEVICE_ATTR_TYPE | - | Device 传输类型：0 表示本地，1 表示 PCIe，2 表示 USB。 |
| <a id="AXCL_DEVICE_ATTR_UID"></a>AXCL_DEVICE_ATTR_UID | - | Device 唯一标识符；要求 Device 已激活。 |
| <a id="AXCL_DEVICE_ATTR_PCIE_DOMAIN"></a>AXCL_DEVICE_ATTR_PCIE_DOMAIN | - | PCIe domain 编号。 |
| <a id="AXCL_DEVICE_ATTR_PCIE_BUS"></a>AXCL_DEVICE_ATTR_PCIE_BUS | - | PCIe bus 编号。 |
| <a id="AXCL_DEVICE_ATTR_PCIE_DEV"></a>AXCL_DEVICE_ATTR_PCIE_DEV | - | PCIe device 编号。 |
| <a id="AXCL_DEVICE_ATTR_PCIE_FUNC"></a>AXCL_DEVICE_ATTR_PCIE_FUNC | - | PCIe function 编号。 |
| <a id="AXCL_DEVICE_ATTR_BUTT"></a>AXCL_DEVICE_ATTR_BUTT | - | 有效 Device 属性的上边界。 |

<br>

<a id="axclrtDeviceState"></a>

## 3. axclrtDeviceState

[axclrtRegDeviceStateCallback](../device_api.md#axclrtRegDeviceStateCallback) 使用的 Device 状态。

```c
typedef enum axclrtDeviceState {
    AXCL_RT_DEVICE_STATE_ONLINE = 0,   /*!< The device is online; currently not reported by the callback. */
    AXCL_RT_DEVICE_STATE_OFFLINE = 1,  /*!< The device has been detected offline. */
    AXCL_RT_DEVICE_STATE_BUTT          /*!< Upper boundary of valid device states. */
} axclrtDeviceState;
```

### 4.1. 取值

| 符号 | 值 | 说明 |
|---|---|---|
| <a id="AXCL_RT_DEVICE_STATE_ONLINE"></a>AXCL_RT_DEVICE_STATE_ONLINE | 0 | Device 在线；当前回调不会报告此状态。 |
| <a id="AXCL_RT_DEVICE_STATE_OFFLINE"></a>AXCL_RT_DEVICE_STATE_OFFLINE | 1 | 检测到 Device 离线。 |
| <a id="AXCL_RT_DEVICE_STATE_BUTT"></a>AXCL_RT_DEVICE_STATE_BUTT | - | 有效 Device 状态的上边界。 |

<br>

<a id="axclrtDeviceStatus"></a>

## 4. axclrtDeviceStatus

[axclrtQueryDeviceStatus](../device_api.md#axclrtQueryDeviceStatus) 使用的 Device 可用状态。

```c
typedef enum axclrtDeviceStatus {
    AXCL_RT_DEVICE_STATUS_ABNORMAL = 0,  /*!< The device is visible and exists, but is not active or is offline. */
    AXCL_RT_DEVICE_STATUS_NORMAL = 1,    /*!< The device is visible, exists, is active, and is not offline. */
} axclrtDeviceStatus;
```

### 5.1. 取值

| 符号 | 值 | 说明 |
|---|---|---|
| <a id="AXCL_RT_DEVICE_STATUS_ABNORMAL"></a>AXCL_RT_DEVICE_STATUS_ABNORMAL | 0 | Device 可见且存在，但未激活或已离线。 |
| <a id="AXCL_RT_DEVICE_STATUS_NORMAL"></a>AXCL_RT_DEVICE_STATUS_NORMAL | 1 | Device 可见、存在、已激活且未离线。 |

<br>

<a id="axclrtEngineDataLayout"></a>

## 5. axclrtEngineDataLayout

Tensor 布局定义。

```c
typedef enum axclrtEngineDataLayout {
    AXCL_DATA_LAYOUT_NONE = 0,  /*!< Unspecified tensor layout. */
    AXCL_DATA_LAYOUT_NHWC = 1,  /*!< Batch, height, width, channel layout. */
    AXCL_DATA_LAYOUT_NCHW = 2,  /*!< Batch, channel, height, width layout. */
} axclrtEngineDataLayout;
```

### 6.1. 取值

| 符号 | 值 | 说明 |
|---|---|---|
| <a id="AXCL_DATA_LAYOUT_NONE"></a>AXCL_DATA_LAYOUT_NONE | 0 | 未指定 Tensor 布局。 |
| <a id="AXCL_DATA_LAYOUT_NHWC"></a>AXCL_DATA_LAYOUT_NHWC | 1 | Batch、height、width、channel 布局。 |
| <a id="AXCL_DATA_LAYOUT_NCHW"></a>AXCL_DATA_LAYOUT_NCHW | 2 | Batch、channel、height、width 布局。 |

<br>

<a id="axclrtEngineDataType"></a>

## 6. axclrtEngineDataType

Tensor 数据类型定义。

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

### 7.1. 取值

| 符号 | 值 | 说明 |
|---|---|---|
| <a id="AXCL_DATA_TYPE_NONE"></a>AXCL_DATA_TYPE_NONE | 0 | 未指定 Tensor 数据类型。 |
| <a id="AXCL_DATA_TYPE_INT4"></a>AXCL_DATA_TYPE_INT4 | 1 | 有符号 4 位整数。 |
| <a id="AXCL_DATA_TYPE_UINT4"></a>AXCL_DATA_TYPE_UINT4 | 2 | 无符号 4 位整数。 |
| <a id="AXCL_DATA_TYPE_INT8"></a>AXCL_DATA_TYPE_INT8 | 3 | 有符号 8 位整数。 |
| <a id="AXCL_DATA_TYPE_UINT8"></a>AXCL_DATA_TYPE_UINT8 | 4 | 无符号 8 位整数。 |
| <a id="AXCL_DATA_TYPE_INT16"></a>AXCL_DATA_TYPE_INT16 | 5 | 有符号 16 位整数。 |
| <a id="AXCL_DATA_TYPE_UINT16"></a>AXCL_DATA_TYPE_UINT16 | 6 | 无符号 16 位整数。 |
| <a id="AXCL_DATA_TYPE_INT32"></a>AXCL_DATA_TYPE_INT32 | 7 | 有符号 32 位整数。 |
| <a id="AXCL_DATA_TYPE_UINT32"></a>AXCL_DATA_TYPE_UINT32 | 8 | 无符号 32 位整数。 |
| <a id="AXCL_DATA_TYPE_INT64"></a>AXCL_DATA_TYPE_INT64 | 9 | 有符号 64 位整数。 |
| <a id="AXCL_DATA_TYPE_UINT64"></a>AXCL_DATA_TYPE_UINT64 | 10 | 无符号 64 位整数。 |
| <a id="AXCL_DATA_TYPE_FP4"></a>AXCL_DATA_TYPE_FP4 | 11 | 4 位浮点值。 |
| <a id="AXCL_DATA_TYPE_FP8"></a>AXCL_DATA_TYPE_FP8 | 12 | 8 位浮点值。 |
| <a id="AXCL_DATA_TYPE_FP16"></a>AXCL_DATA_TYPE_FP16 | 13 | IEEE 754 半精度浮点值。 |
| <a id="AXCL_DATA_TYPE_BF16"></a>AXCL_DATA_TYPE_BF16 | 14 | 16 位 Brain Floating Point 值。 |
| <a id="AXCL_DATA_TYPE_FP32"></a>AXCL_DATA_TYPE_FP32 | 15 | IEEE 754 单精度浮点值。 |
| <a id="AXCL_DATA_TYPE_FP64"></a>AXCL_DATA_TYPE_FP64 | 16 | IEEE 754 双精度浮点值。 |

<br>

<a id="axclrtEngineModelKind"></a>

## 7. axclrtEngineModelKind

模型 NPU core 数量分类。

```c
typedef enum axclrtEngineModelKind {
    AXCL_MODEL_TYPE_1CORE = 0,  /*!< Model compiled for one NPU core. */
    AXCL_MODEL_TYPE_2CORE = 1,  /*!< Model compiled for two NPU cores. */
    AXCL_MODEL_TYPE_3CORE = 2,  /*!< Model compiled for three NPU cores. */
} axclrtEngineModelKind;
```

### 8.1. 取值

| 符号 | 值 | 说明 |
|---|---|---|
| <a id="AXCL_MODEL_TYPE_1CORE"></a>AXCL_MODEL_TYPE_1CORE | 0 | 为一个 NPU core 编译的模型。 |
| <a id="AXCL_MODEL_TYPE_2CORE"></a>AXCL_MODEL_TYPE_2CORE | 1 | 为两个 NPU core 编译的模型。 |
| <a id="AXCL_MODEL_TYPE_3CORE"></a>AXCL_MODEL_TYPE_3CORE | 2 | 为三个 NPU core 编译的模型。 |

<br>

<a id="axclrtEngineVNpuKind"></a>

## 8. axclrtEngineVNpuKind

VNPU 调度模式。

```c
typedef enum axclrtEngineVNpuKind {
    AXCL_VNPU_DISABLE = 0,     /*!< Disable VNPU mode. */
    AXCL_VNPU_ENABLE = 1,      /*!< Enable VNPU mode. */
    AXCL_VNPU_BIG_LITTLE = 2,  /*!< Select the big-little VNPU mode. */
    AXCL_VNPU_LITTLE_BIG = 3,  /*!< Select the little-big VNPU mode. */
} axclrtEngineVNpuKind;
```

### 9.1. 取值

| 符号 | 值 | 说明 |
|---|---|---|
| <a id="AXCL_VNPU_DISABLE"></a>AXCL_VNPU_DISABLE | 0 | 禁用 VNPU 模式。 |
| <a id="AXCL_VNPU_ENABLE"></a>AXCL_VNPU_ENABLE | 1 | 启用 VNPU 模式。 |
| <a id="AXCL_VNPU_BIG_LITTLE"></a>AXCL_VNPU_BIG_LITTLE | 2 | 选择 big-little VNPU 模式。 |
| <a id="AXCL_VNPU_LITTLE_BIG"></a>AXCL_VNPU_LITTLE_BIG | 3 | 选择 little-big VNPU 模式。 |

<br>

<a id="axclrtFileTransferPolicy"></a>

## 9. axclrtFileTransferPolicy

文件传输操作。

```c
typedef enum axclrtFileTransferPolicy {
    FILE_TRANSFER_FROM_HOST_TO_DEVICE = 0,    /*!< Copy a Host file to the Device. */
    FILE_TRANSFER_FROM_DEVICE_TO_HOST = 1,    /*!< Copy a Device file to the Host. */
    FILE_TRANSFER_FROM_DEVICE_TO_DEVICE = 2,  /*!< Copy a file within the Device. */
    FILE_TRANSFER_REMOVE_DEVICE_FILE = 3,     /*!< Remove a Device file. */
} axclrtFileTransferPolicy;
```

### 10.1. 取值

| 符号 | 值 | 说明 |
|---|---|---|
| <a id="FILE_TRANSFER_FROM_HOST_TO_DEVICE"></a>FILE_TRANSFER_FROM_HOST_TO_DEVICE | 0 | 将 Host 文件复制到 Device。 |
| <a id="FILE_TRANSFER_FROM_DEVICE_TO_HOST"></a>FILE_TRANSFER_FROM_DEVICE_TO_HOST | 1 | 将 Device 文件复制到 Host。 |
| <a id="FILE_TRANSFER_FROM_DEVICE_TO_DEVICE"></a>FILE_TRANSFER_FROM_DEVICE_TO_DEVICE | 2 | 在 Device 内复制文件。 |
| <a id="FILE_TRANSFER_REMOVE_DEVICE_FILE"></a>FILE_TRANSFER_REMOVE_DEVICE_FILE | 3 | 删除 Device 文件。 |

<br>

<a id="axclrtMemAttr"></a>

## 10. axclrtMemAttr

[axclrtGetMemInfo](../memory_api.md#axclrtGetMemInfo) 使用的内存信息类型。

```c
typedef enum axclrtMemAttr {
    AXCL_DDR_CMM = 0,  /*!< Device contiguous memory manager pools. */
    AXCL_DDR_SYS = 1,  /*!< Device system memory reported by MemFree and MemTotal. */
} axclrtMemAttr;
```

### 11.1. 取值

| 符号 | 值 | 说明 |
|---|---|---|
| <a id="AXCL_DDR_CMM"></a>AXCL_DDR_CMM | 0 | Device 连续内存管理器内存池。 |
| <a id="AXCL_DDR_SYS"></a>AXCL_DDR_SYS | 1 | 由 MemFree 和 MemTotal 报告的 Device 系统内存。 |

<br>

<a id="axclrtMemLocationType"></a>

## 11. axclrtMemLocationType

[axclrtPointerGetAttributes](../memory_api.md#axclrtPointerGetAttributes) 使用的内存位置类型。

```c
typedef enum axclrtMemLocationType {
    AXCL_MEM_LOCATION_TYPE_UNREGISTERED = 0,  /*!< Pointer is not tracked by the AXCL runtime. */
    AXCL_MEM_LOCATION_TYPE_HOST = 1,          /*!< Pointer refers to host memory. */
    AXCL_MEM_LOCATION_TYPE_DEVICE = 2,        /*!< Pointer refers to device memory. */
} axclrtMemLocationType;
```

### 12.1. 取值

| 符号 | 值 | 说明 |
|---|---|---|
| <a id="AXCL_MEM_LOCATION_TYPE_UNREGISTERED"></a>AXCL_MEM_LOCATION_TYPE_UNREGISTERED | 0 | 指针未被 AXCL Runtime 跟踪。 |
| <a id="AXCL_MEM_LOCATION_TYPE_HOST"></a>AXCL_MEM_LOCATION_TYPE_HOST | 1 | 指针指向 Host 内存。 |
| <a id="AXCL_MEM_LOCATION_TYPE_DEVICE"></a>AXCL_MEM_LOCATION_TYPE_DEVICE | 2 | 指针指向 Device 内存。 |

<br>

<a id="axclrtMemMallocPolicy"></a>

## 12. axclrtMemMallocPolicy

内存分配策略枚举。

```c
typedef enum axclrtMemMallocPolicy {
    AXCL_MEM_MALLOC_HUGE_FIRST      = 0,  /*!< Huge first */
    AXCL_MEM_MALLOC_HUGE_ONLY       = 1,  /*!< Huge only */
    AXCL_MEM_MALLOC_NORMAL_ONLY     = 2,  /*!< Normal only */
    AXCL_MEM_MALLOC_SIZE_ALIGN      = 3   /*!< Size aligned */
} axclrtMemMallocPolicy;
```

### 13.1. 取值

| 符号 | 值 | 说明 |
|---|---|---|
| <a id="AXCL_MEM_MALLOC_HUGE_FIRST"></a>AXCL_MEM_MALLOC_HUGE_FIRST | 0 | 优先使用大页内存。 |
| <a id="AXCL_MEM_MALLOC_HUGE_ONLY"></a>AXCL_MEM_MALLOC_HUGE_ONLY | 1 | 仅使用大页内存。 |
| <a id="AXCL_MEM_MALLOC_NORMAL_ONLY"></a>AXCL_MEM_MALLOC_NORMAL_ONLY | 2 | 仅使用普通内存。 |
| <a id="AXCL_MEM_MALLOC_SIZE_ALIGN"></a>AXCL_MEM_MALLOC_SIZE_ALIGN | 3 | 按大小对齐。 |

<br>

<a id="axclrtMemcpyKind"></a>

## 13. axclrtMemcpyKind

Memcpy 类型枚举。

```c
typedef enum axclrtMemcpyKind {
    AXCL_MEMCPY_HOST_TO_HOST         = 0,   /*!< Host virtual memory to host virtual memory */
    AXCL_MEMCPY_HOST_TO_DEVICE       = 1,   /*!< Host virtual memory to device memory */
    AXCL_MEMCPY_DEVICE_TO_HOST       = 2,   /*!< Device memory to host virtual memory */
    AXCL_MEMCPY_DEVICE_TO_DEVICE     = 3    /*!< Device memory to device memory */
} axclrtMemcpyKind;
```

### 14.1. 取值

| 符号 | 值 | 说明 |
|---|---|---|
| <a id="AXCL_MEMCPY_HOST_TO_HOST"></a>AXCL_MEMCPY_HOST_TO_HOST | 0 | Host 虚拟内存到 Host 虚拟内存。 |
| <a id="AXCL_MEMCPY_HOST_TO_DEVICE"></a>AXCL_MEMCPY_HOST_TO_DEVICE | 1 | Host 虚拟内存到 Device 内存。 |
| <a id="AXCL_MEMCPY_DEVICE_TO_HOST"></a>AXCL_MEMCPY_DEVICE_TO_HOST | 2 | Device 内存到 Host 虚拟内存。 |
| <a id="AXCL_MEMCPY_DEVICE_TO_DEVICE"></a>AXCL_MEMCPY_DEVICE_TO_DEVICE | 3 | Device 内存到 Device 内存。 |

<br>

<a id="axclrtPointerAttributeFlag"></a>

## 14. axclrtPointerAttributeFlag

[axclrtPointerGetAttributes](../memory_api.md#axclrtPointerGetAttributes) 使用的指针属性标志。

```c
typedef enum axclrtPointerAttributeFlag {
    AXCL_POINTER_ATTRIBUTE_FLAG_NONE = 0,    /*!< No additional pointer attributes. */
    AXCL_POINTER_ATTRIBUTE_FLAG_CACHED = 1,  /*!< Device memory is mapped as cached memory. */
} axclrtPointerAttributeFlag;
```

### 15.1. 取值

| 符号 | 值 | 说明 |
|---|---|---|
| <a id="AXCL_POINTER_ATTRIBUTE_FLAG_NONE"></a>AXCL_POINTER_ATTRIBUTE_FLAG_NONE | 0 | 无附加指针属性。 |
| <a id="AXCL_POINTER_ATTRIBUTE_FLAG_CACHED"></a>AXCL_POINTER_ATTRIBUTE_FLAG_CACHED | 1 | Device 内存映射为 cached 内存。 |

<br>

<a id="axclrtStreamStatus"></a>

## 15. axclrtStreamStatus

Stream 状态枚举。

```c
typedef enum axclrtStreamStatus {
    AXCL_STREAM_STATUS_COMPLETE  = 0,       /*!< All tasks on the stream have completed */
    AXCL_STREAM_STATUS_NOT_READY = 1,       /*!< At least one task on the stream has not completed */
    AXCL_STREAM_STATUS_RESERVED  = 0xFFFF,  /*!< Reserved; set when the query call itself fails */
} axclrtStreamStatus;
```

### 16.1. 取值

| 符号 | 值 | 说明 |
|---|---|---|
| <a id="AXCL_STREAM_STATUS_COMPLETE"></a>AXCL_STREAM_STATUS_COMPLETE | 0 | Stream 上的所有 Task 均已完成。 |
| <a id="AXCL_STREAM_STATUS_NOT_READY"></a>AXCL_STREAM_STATUS_NOT_READY | 1 | Stream 上至少有一个 Task 尚未完成。 |
| <a id="AXCL_STREAM_STATUS_RESERVED"></a>AXCL_STREAM_STATUS_RESERVED | 0xFFFF | 保留值；查询调用本身失败时设置。 |

<br>

<a id="axclrtLogTarget"></a>

## 16. axclrtLogTarget

[axclrtSetLogLevel](../other_api.md#axclrtSetLogLevel) 和 [axclrtGetLogLevel](../other_api.md#axclrtGetLogLevel) 的日志级别目标。

```c
typedef enum {
    AXCL_LOG_TARGET_HOST_RUNTIME_FILE = 0,    /*!< Host runtime file logger (asynchronous). */
    AXCL_LOG_TARGET_HOST_RUNTIME_CONSOLE,     /*!< Host runtime console logger (synchronous). Off by default. */
    AXCL_LOG_TARGET_DEVICE_WORKER_FILE,       /*!< Device worker file logger of the current thread's active Device.
                                                   Requires an active Device on the current thread; call
                                                   @ref axclrtSetDevice or @ref axclrtCreateContext first. */
    AXCL_LOG_TARGET_DEVICE_WORKER_CONSOLE,    /*!< Device worker console logger of the current thread's active Device.
                                                   Off by default. Requires an active Device on the current thread; call
                                                   @ref axclrtSetDevice or @ref axclrtCreateContext first. */
    AXCL_LOG_TARGET_BUTT,                     /*!< Invalid target; boundary value only. */
} axclrtLogTarget;
```

### 16.1. 取值

| 符号 | 值 | 说明 |
|---|---|---|
| <a id="AXCL_LOG_TARGET_HOST_RUNTIME_FILE"></a>AXCL_LOG_TARGET_HOST_RUNTIME_FILE | 0 | Host 运行时文件日志（异步）。 |
| <a id="AXCL_LOG_TARGET_HOST_RUNTIME_CONSOLE"></a>AXCL_LOG_TARGET_HOST_RUNTIME_CONSOLE | 1 | Host 运行时控制台日志（同步）。默认关闭。 |
| <a id="AXCL_LOG_TARGET_DEVICE_WORKER_FILE"></a>AXCL_LOG_TARGET_DEVICE_WORKER_FILE | 2 | 当前线程已激活 Device 的 device worker 文件日志。需要当前线程已激活 Device；请先调用 [axclrtSetDevice](../device_api.md#axclrtSetDevice) 或 [axclrtCreateContext](../context_api.md#axclrtCreateContext)。 |
| <a id="AXCL_LOG_TARGET_DEVICE_WORKER_CONSOLE"></a>AXCL_LOG_TARGET_DEVICE_WORKER_CONSOLE | 3 | 当前线程已激活 Device 的 device worker 控制台日志（同步）。默认关闭。需要当前线程已激活 Device；请先调用 [axclrtSetDevice](../device_api.md#axclrtSetDevice) 或 [axclrtCreateContext](../context_api.md#axclrtCreateContext)。 |
| <a id="AXCL_LOG_TARGET_BUTT"></a>AXCL_LOG_TARGET_BUTT | - | 无效目标，仅作为边界值。 |
