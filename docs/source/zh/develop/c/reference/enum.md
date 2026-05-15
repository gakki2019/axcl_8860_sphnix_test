# 枚举参考

<a id="AXCL_ERROR_E"></a>

## AXCL_ERROR_E

通用 AXCL 状态和通用错误标识符。

```c
typedef enum {
    AXCL_SUCC                   = 0x00,
    AXCL_FAIL                   = 0x01,
    AXCL_ERR_UNKNOWN            = AXCL_FAIL,
    AXCL_ERR_NULL_POINTER       = 0x02,
    AXCL_ERR_ILLEGAL_PARAM      = 0x03,
    AXCL_ERR_UNSUPPORT          = 0x04,
    AXCL_ERR_TIMEOUT            = 0x05,
    AXCL_ERR_BUSY               = 0x06,
    AXCL_ERR_NO_MEMORY          = 0x07,
    AXCL_ERR_ENCODE             = 0x08,
    AXCL_ERR_DECODE             = 0x09,
    AXCL_ERR_UNEXPECT_RESPONSE  = 0x0A,

    AXCL_ERR_MODULE_BASE        = 0x20,
    AXCL_ERR_BUTT               = 0x7F
} AXCL_ERROR_E;
```

### 取值

| 符号                                                              | 值        | 说明 |
| ----------------------------------------------------------------- | --------- | ---- |
| <a id="AXCL_SUCC"></a>AXCL_SUCC                                   | 0x00      | -    |
| <a id="AXCL_FAIL"></a>AXCL_FAIL                                   | 0x01      | -    |
| <a id="AXCL_ERR_UNKNOWN"></a>AXCL_ERR_UNKNOWN                     | AXCL_FAIL | -    |
| <a id="AXCL_ERR_NULL_POINTER"></a>AXCL_ERR_NULL_POINTER           | 0x02      | -    |
| <a id="AXCL_ERR_ILLEGAL_PARAM"></a>AXCL_ERR_ILLEGAL_PARAM         | 0x03      | -    |
| <a id="AXCL_ERR_UNSUPPORT"></a>AXCL_ERR_UNSUPPORT                 | 0x04      | -    |
| <a id="AXCL_ERR_TIMEOUT"></a>AXCL_ERR_TIMEOUT                     | 0x05      | -    |
| <a id="AXCL_ERR_BUSY"></a>AXCL_ERR_BUSY                           | 0x06      | -    |
| <a id="AXCL_ERR_NO_MEMORY"></a>AXCL_ERR_NO_MEMORY                 | 0x07      | -    |
| <a id="AXCL_ERR_ENCODE"></a>AXCL_ERR_ENCODE                       | 0x08      | -    |
| <a id="AXCL_ERR_DECODE"></a>AXCL_ERR_DECODE                       | 0x09      | -    |
| <a id="AXCL_ERR_UNEXPECT_RESPONSE"></a>AXCL_ERR_UNEXPECT_RESPONSE | 0x0A      | -    |
| <a id="AXCL_ERR_MODULE_BASE"></a>AXCL_ERR_MODULE_BASE             | 0x20      | -    |
| <a id="AXCL_ERR_BUTT"></a>AXCL_ERR_BUTT                           | 0x7F      | -    |

<br>

<a id="axclrtEngineDataLayout"></a>

## axclrtEngineDataLayout

张量布局定义。

```c
typedef enum axclrtEngineDataLayout {
    AXCL_DATA_LAYOUT_NONE = 0,
    AXCL_DATA_LAYOUT_NHWC = 1,
    AXCL_DATA_LAYOUT_NCHW = 2,
} axclrtEngineDataLayout;
```

### 取值

| 符号                                                    | 值  | 说明 |
| ------------------------------------------------------- | --- | ---- |
| <a id="AXCL_DATA_LAYOUT_NONE"></a>AXCL_DATA_LAYOUT_NONE | 0   | -    |
| <a id="AXCL_DATA_LAYOUT_NHWC"></a>AXCL_DATA_LAYOUT_NHWC | 1   | -    |
| <a id="AXCL_DATA_LAYOUT_NCHW"></a>AXCL_DATA_LAYOUT_NCHW | 2   | -    |

<br>

<a id="axclrtEngineDataType"></a>

## axclrtEngineDataType

张量数据类型定义。

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

### 取值

| 符号                                                    | 值  | 说明 |
| ------------------------------------------------------- | --- | ---- |
| <a id="AXCL_DATA_TYPE_NONE"></a>AXCL_DATA_TYPE_NONE     | 0   | -    |
| <a id="AXCL_DATA_TYPE_INT4"></a>AXCL_DATA_TYPE_INT4     | 1   | -    |
| <a id="AXCL_DATA_TYPE_UINT4"></a>AXCL_DATA_TYPE_UINT4   | 2   | -    |
| <a id="AXCL_DATA_TYPE_INT8"></a>AXCL_DATA_TYPE_INT8     | 3   | -    |
| <a id="AXCL_DATA_TYPE_UINT8"></a>AXCL_DATA_TYPE_UINT8   | 4   | -    |
| <a id="AXCL_DATA_TYPE_INT16"></a>AXCL_DATA_TYPE_INT16   | 5   | -    |
| <a id="AXCL_DATA_TYPE_UINT16"></a>AXCL_DATA_TYPE_UINT16 | 6   | -    |
| <a id="AXCL_DATA_TYPE_INT32"></a>AXCL_DATA_TYPE_INT32   | 7   | -    |
| <a id="AXCL_DATA_TYPE_UINT32"></a>AXCL_DATA_TYPE_UINT32 | 8   | -    |
| <a id="AXCL_DATA_TYPE_INT64"></a>AXCL_DATA_TYPE_INT64   | 9   | -    |
| <a id="AXCL_DATA_TYPE_UINT64"></a>AXCL_DATA_TYPE_UINT64 | 10  | -    |
| <a id="AXCL_DATA_TYPE_FP4"></a>AXCL_DATA_TYPE_FP4       | 11  | -    |
| <a id="AXCL_DATA_TYPE_FP8"></a>AXCL_DATA_TYPE_FP8       | 12  | -    |
| <a id="AXCL_DATA_TYPE_FP16"></a>AXCL_DATA_TYPE_FP16     | 13  | -    |
| <a id="AXCL_DATA_TYPE_BF16"></a>AXCL_DATA_TYPE_BF16     | 14  | -    |
| <a id="AXCL_DATA_TYPE_FP32"></a>AXCL_DATA_TYPE_FP32     | 15  | -    |
| <a id="AXCL_DATA_TYPE_FP64"></a>AXCL_DATA_TYPE_FP64     | 16  | -    |

<br>

<a id="axclrtEngineModelKind"></a>

## axclrtEngineModelKind

模型核心数量分类。

```c
typedef enum axclrtEngineModelKind {
    AXCL_MODEL_TYPE_1CORE = 0,
    AXCL_MODEL_TYPE_2CORE = 1,
    AXCL_MODEL_TYPE_3CORE = 2,
} axclrtEngineModelKind;
```

### 取值

| 符号                                                    | 值  | 说明 |
| ------------------------------------------------------- | --- | ---- |
| <a id="AXCL_MODEL_TYPE_1CORE"></a>AXCL_MODEL_TYPE_1CORE | 0   | -    |
| <a id="AXCL_MODEL_TYPE_2CORE"></a>AXCL_MODEL_TYPE_2CORE | 1   | -    |
| <a id="AXCL_MODEL_TYPE_3CORE"></a>AXCL_MODEL_TYPE_3CORE | 2   | -    |

<br>

<a id="axclrtEngineVNpuKind"></a>

## axclrtEngineVNpuKind

VNPU 调度模式。

```c
typedef enum axclrtEngineVNpuKind {
    AXCL_VNPU_DISABLE = 0,
    AXCL_VNPU_ENABLE = 1,
    AXCL_VNPU_BIG_LITTLE = 2,
    AXCL_VNPU_LITTLE_BIG = 3,
} axclrtEngineVNpuKind;
```

### 取值

| 符号                                                  | 值  | 说明 |
| ----------------------------------------------------- | --- | ---- |
| <a id="AXCL_VNPU_DISABLE"></a>AXCL_VNPU_DISABLE       | 0   | -    |
| <a id="AXCL_VNPU_ENABLE"></a>AXCL_VNPU_ENABLE         | 1   | -    |
| <a id="AXCL_VNPU_BIG_LITTLE"></a>AXCL_VNPU_BIG_LITTLE | 2   | -    |
| <a id="AXCL_VNPU_LITTLE_BIG"></a>AXCL_VNPU_LITTLE_BIG | 3   | -    |

<br>

<a id="axclrtFileTransferPolicy"></a>

## axclrtFileTransferPolicy

文件传输策略枚举。

```c
typedef enum axclrtFileTransferPolicy {
    AXCL_FILE_TRANSFER_FROM_HOST_TO_DEVICE   = 0,  /*!< 从主机向设备传输文件 */
    AXCL_FILE_TRANSFER_FROM_DEVICE_TO_HOST   = 1,  /*!< 从设备向主机传输文件 */
    AXCL_FILE_TRANSFER_FROM_DEVICE_TO_DEVICE = 2,  /*!< 从设备向设备传输文件 */
    AXCL_FILE_TRANSFER_REMOVE_DEVICE_FILE    = 3   /*!< 删除设备上的文件 */
} axclrtFileTransferPolicy;
```

### 取值

| 符号                                                                                          | 值  | 说明                   |
| --------------------------------------------------------------------------------------------- | --- | ---------------------- |
| <a id="AXCL_FILE_TRANSFER_FROM_HOST_TO_DEVICE"></a>AXCL_FILE_TRANSFER_FROM_HOST_TO_DEVICE     | 0   | 从主机向设备传输文件。 |
| <a id="AXCL_FILE_TRANSFER_FROM_DEVICE_TO_HOST"></a>AXCL_FILE_TRANSFER_FROM_DEVICE_TO_HOST     | 1   | 从设备向主机传输文件。 |
| <a id="AXCL_FILE_TRANSFER_FROM_DEVICE_TO_DEVICE"></a>AXCL_FILE_TRANSFER_FROM_DEVICE_TO_DEVICE | 2   | 从设备向设备传输文件。 |
| <a id="AXCL_FILE_TRANSFER_REMOVE_DEVICE_FILE"></a>AXCL_FILE_TRANSFER_REMOVE_DEVICE_FILE       | 3   | 删除设备上的文件。     |

<br>

<a id="axclrtMemMallocPolicy"></a>

## axclrtMemMallocPolicy

内存分配策略枚举。

```c
typedef enum axclrtMemMallocPolicy {
    AXCL_MEM_MALLOC_HUGE_FIRST      = 0,  /*!< 优先使用大页内存 */
    AXCL_MEM_MALLOC_HUGE_ONLY       = 1,  /*!< Huge only */
    AXCL_MEM_MALLOC_NORMAL_ONLY     = 2,  /*!< Normal only */
    AXCL_MEM_MALLOC_SIZE_ALIGN      = 3   /*!< Size aligned */
} axclrtMemMallocPolicy;
```

### 取值

| 符号                                                                | 值  | 说明               |
| ------------------------------------------------------------------- | --- | ------------------ |
| <a id="AXCL_MEM_MALLOC_HUGE_FIRST"></a>AXCL_MEM_MALLOC_HUGE_FIRST   | 0   | 优先使用大页内存。 |
| <a id="AXCL_MEM_MALLOC_HUGE_ONLY"></a>AXCL_MEM_MALLOC_HUGE_ONLY     | 1   | 仅使用大页内存。   |
| <a id="AXCL_MEM_MALLOC_NORMAL_ONLY"></a>AXCL_MEM_MALLOC_NORMAL_ONLY | 2   | 仅使用普通内存。   |
| <a id="AXCL_MEM_MALLOC_SIZE_ALIGN"></a>AXCL_MEM_MALLOC_SIZE_ALIGN   | 3   | 按大小对齐分配。   |

<br>

<a id="axclrtMemcpyKind"></a>

## axclrtMemcpyKind

Memcpy kind enum.

```c
typedef enum axclrtMemcpyKind {
    AXCL_MEMCPY_HOST_TO_HOST         = 0,   /*!< 主机虚拟内存到主机虚拟内存 */
    AXCL_MEMCPY_HOST_TO_DEVICE       = 1,   /*!< 主机虚拟内存到设备内存 */
    AXCL_MEMCPY_DEVICE_TO_HOST       = 2,   /*!< 设备内存到主机虚拟内存 */
    AXCL_MEMCPY_DEVICE_TO_DEVICE     = 3,   /*!< Device memory to device memory */
    AXCL_MEMCPY_HOST_PHY_TO_DEVICE   = 4,   /*!< Host physical memory to device memory */
    AXCL_MEMCPY_DEVICE_TO_HOST_PHY   = 5    /*!< Device memory to host physical memory */
} axclrtMemcpyKind;
```

### Values

| 符号                                                                      | 值  | 说明                         |
| ------------------------------------------------------------------------- | --- | ---------------------------- |
| <a id="AXCL_MEMCPY_HOST_TO_HOST"></a>AXCL_MEMCPY_HOST_TO_HOST             | 0   | 主机虚拟内存到主机虚拟内存。 |
| <a id="AXCL_MEMCPY_HOST_TO_DEVICE"></a>AXCL_MEMCPY_HOST_TO_DEVICE         | 1   | 主机虚拟内存到设备内存。     |
| <a id="AXCL_MEMCPY_DEVICE_TO_HOST"></a>AXCL_MEMCPY_DEVICE_TO_HOST         | 2   | 设备内存到主机虚拟内存。     |
| <a id="AXCL_MEMCPY_DEVICE_TO_DEVICE"></a>AXCL_MEMCPY_DEVICE_TO_DEVICE     | 3   | 设备内存到设备内存。         |
| <a id="AXCL_MEMCPY_HOST_PHY_TO_DEVICE"></a>AXCL_MEMCPY_HOST_PHY_TO_DEVICE | 4   | 主机物理内存到设备内存。     |
| <a id="AXCL_MEMCPY_DEVICE_TO_HOST_PHY"></a>AXCL_MEMCPY_DEVICE_TO_HOST_PHY | 5   | 设备内存到主机物理内存。     |
