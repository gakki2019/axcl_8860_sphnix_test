# 宏

<a id="AXCLRT_ENGINE_MAX_DIM_CNT"></a>

## 1. AXCLRT_ENGINE_MAX_DIM_CNT

[axclrtEngineIODims](struct.md#axclrtEngineIODims) 中维度数组的容量。

```c
#define AXCLRT_ENGINE_MAX_DIM_CNT 32
```

<br>

<a id="AXCL_CCL"></a>

## 2. AXCL_CCL

集合通信子模块 ID。

```c
#define AXCL_CCL (0x5B)
```

<br>

<a id="AXCL_COMM"></a>

## 3. AXCL_COMM

通信子模块 ID。

```c
#define AXCL_COMM (0x50)
```

<br>

<a id="AXCL_CTRL"></a>

## 4. AXCL_CTRL

控制子模块 ID。

```c
#define AXCL_CTRL (0x57)
```

<br>

<a id="AXCL_DAEMON"></a>

## 5. AXCL_DAEMON

daemon 子模块 ID。

```c
#define AXCL_DAEMON (0x55)
```

<br>

<a id="AXCL_DEF_CCL_ERR"></a>

## 6. AXCL_DEF_CCL_ERR

组合 AXCL_CCL 子模块错误码。

```c
#define AXCL_DEF_CCL_ERR(errid) AXCL_DEF_ERR(AXCL_CCL, (errid))
```

<br>

<a id="AXCL_DEF_COMM_ERR"></a>

## 7. AXCL_DEF_COMM_ERR

组合 AXCL_COMM 子模块错误码。

```c
#define AXCL_DEF_COMM_ERR(errid) AXCL_DEF_ERR(AXCL_COMM, (errid))
```

<br>

<a id="AXCL_DEF_CTRL_ERR"></a>

## 8. AXCL_DEF_CTRL_ERR

组合 AXCL_CTRL 子模块错误码。

```c
#define AXCL_DEF_CTRL_ERR(errid) AXCL_DEF_ERR(AXCL_CTRL, (errid))
```

<br>

<a id="AXCL_DEF_DAEMON_ERR"></a>

## 9. AXCL_DEF_DAEMON_ERR

组合 AXCL_DAEMON 子模块错误码。

```c
#define AXCL_DEF_DAEMON_ERR(errid) AXCL_DEF_ERR(AXCL_DAEMON, (errid))
```

<br>

<a id="AXCL_DEF_ENGINE_ERR"></a>

## 10. AXCL_DEF_ENGINE_ERR

组合 AXCL_ENGINE 子模块错误码。

```c
#define AXCL_DEF_ENGINE_ERR(errid) AXCL_DEF_ERR(AXCL_ENGINE, (errid))
```

<br>

<a id="AXCL_DEF_ERR"></a>

## 11. AXCL_DEF_ERR

组合错误码。

```text
-------------------------------------------------------------------------|
|1|      FIXED     |    AX_ID_AXCL   |  SUB_MODULE_ID  |     ERR_ID      |
|------------------------------------------------------------------------|
|1|<--- 7bits  --->|<---- 8bits ---->|<---- 8bits ---->|<---- 8bits ---->|
```

第 31 位置 1，FIXED 位为 0。[AX_ID_AXCL](#AX_ID_AXCL) 在 Host 构建中为 [AXCL_ID_HOST](#AXCL_ID_HOST)，在 Device 构建中为 [AXCL_ID_DEVICE](#AXCL_ID_DEVICE)，因此同一错误在 Device 侧产生时，仅 [23:16] 位不同。

```c
#define AXCL_DEF_ERR(sub, errid) ((axclError)((0x80000000L) | ((AX_ID_AXCL) << 16 ) | ((sub) << 8) | (errid)))
```

<br>

<a id="AXCL_DEF_FILE_TRANSFER_ERR"></a>

## 12. AXCL_DEF_FILE_TRANSFER_ERR

组合 AXCL_FILE_TRANSFER 子模块错误码。

```c
#define AXCL_DEF_FILE_TRANSFER_ERR(errid) AXCL_DEF_ERR(AXCL_FILE_TRANSFER, (errid))
```

<br>

<a id="AXCL_DEF_NATIVE_ERR"></a>

## 13. AXCL_DEF_NATIVE_ERR

组合 AXCL_NATIVE 子模块错误码。

```c
#define AXCL_DEF_NATIVE_ERR(errid) AXCL_DEF_ERR(AXCL_NATIVE, (errid))
```

<br>

<a id="AXCL_DEF_PROTOCOL_ERR"></a>

## 14. AXCL_DEF_PROTOCOL_ERR

组合 AXCL_PROTOCOL 子模块错误码。

```c
#define AXCL_DEF_PROTOCOL_ERR(errid) AXCL_DEF_ERR(AXCL_PROTOCOL, (errid))
```

<br>

<a id="AXCL_DEF_RT_ERR"></a>

## 15. AXCL_DEF_RT_ERR

组合 AXCL_RUNTIME 子模块错误码。

```c
#define AXCL_DEF_RT_ERR(errid) AXCL_DEF_ERR(AXCL_RUNTIME, (errid))
```

<br>

<a id="AXCL_DEF_USRWORK_ERR"></a>

## 16. AXCL_DEF_USRWORK_ERR

组合 AXCL_USRWORK 子模块错误码。

```c
#define AXCL_DEF_USRWORK_ERR(errid) AXCL_DEF_ERR(AXCL_USRWORK, (errid))
```

<br>

<a id="AXCL_DEF_WORKER_ERR"></a>

## 17. AXCL_DEF_WORKER_ERR

组合 AXCL_WORKER 子模块错误码。

```c
#define AXCL_DEF_WORKER_ERR(errid) AXCL_DEF_ERR(AXCL_WORKER, (errid))
```

<br>

<a id="AXCL_ENGINE"></a>

## 18. AXCL_ENGINE

Engine 子模块 ID。

```c
#define AXCL_ENGINE (0x58)
```

<br>

<a id="AXCL_EVENT_DEFAULT"></a>

## 19. AXCL_EVENT_DEFAULT

默认 Event 创建标志。

```c
#define AXCL_EVENT_DEFAULT 0x0
```

<br>

<a id="AXCL_EVENT_DISABLE_TIMING"></a>

## 20. AXCL_EVENT_DISABLE_TIMING

禁用 Event timing 标志。

```c
#define AXCL_EVENT_DISABLE_TIMING 0x2
```

<br>

<a id="AXCL_EXPORT"></a>

## 21. AXCL_EXPORT

```c
#define AXCL_EXPORT
```

<br>

<a id="AXCL_FILE_TRANSFER"></a>

## 22. AXCL_FILE_TRANSFER

文件传输子模块 ID。

```c
#define AXCL_FILE_TRANSFER (0x59)
```

<br>

<a id="AXCL_ID_DEVICE"></a>

## 23. AXCL_ID_DEVICE

AXCL Device ID。

```c
#define AXCL_ID_DEVICE (0x31)
```

<br>

<a id="AXCL_ID_HOST"></a>

## 24. AXCL_ID_HOST

AXCL Host ID。

```c
#define AXCL_ID_HOST (0x30)
```

<br>

<a id="AXCL_IPC_EXPORT_FLAG_DEFAULT"></a>

## 25. AXCL_IPC_EXPORT_FLAG_DEFAULT

```c
#define AXCL_IPC_EXPORT_FLAG_DEFAULT 0x0u
```

<br>

<a id="AXCL_IPC_EXPORT_FLAG_DISABLE_PID_VALIDATION"></a>

## 26. AXCL_IPC_EXPORT_FLAG_DISABLE_PID_VALIDATION

```c
#define AXCL_IPC_EXPORT_FLAG_DISABLE_PID_VALIDATION 0x1u
```

<br>

<a id="AXCL_IPC_KEY_MAX_LEN"></a>

## 27. AXCL_IPC_KEY_MAX_LEN

```c
#define AXCL_IPC_KEY_MAX_LEN 65
```

<br>

<a id="AXCL_IPC_MAX_TARGETS"></a>

## 28. AXCL_IPC_MAX_TARGETS

```c
#define AXCL_IPC_MAX_TARGETS 64
```

<br>

<a id="AXCL_LITE"></a>

## 29. AXCL_LITE

Lite 子模块 ID。

```c
#define AXCL_LITE (0x53)
```

<br>

<a id="AXCL_NATIVE"></a>

## 30. AXCL_NATIVE

Native 子模块 ID。

```c
#define AXCL_NATIVE (0x54)
```

<br>

<a id="AXCL_PROTOCOL"></a>

## 31. AXCL_PROTOCOL

Protocol 子模块 ID。

```c
#define AXCL_PROTOCOL (0x51)
```

<br>

<a id="AXCL_RUNTIME"></a>

## 32. AXCL_RUNTIME

Runtime 子模块 ID。

```c
#define AXCL_RUNTIME (0x52)
```

<br>

<a id="AXCL_USRWORK"></a>

## 33. AXCL_USRWORK

userworker 子模块 ID。

```c
#define AXCL_USRWORK (0x5A)
```

<br>

<a id="AXCL_WORKER"></a>

## 34. AXCL_WORKER

worker 子模块 ID。

```c
#define AXCL_WORKER (0x56)
```

<br>

<a id="AX_CCL_EXPORT"></a>

## 35. AX_CCL_EXPORT

```c
#define AX_CCL_EXPORT
```

<br>

<a id="AX_CCL_IN_PLACE"></a>

## 36. AX_CCL_IN_PLACE

请求原地操作的哨兵值。

可作为 [axCclAllReduce](../axccl_api.md#axCclAllReduce)、[axCclReduce](../axccl_api.md#axCclReduce)、[axCclBroadcast](../axccl_api.md#axCclBroadcast)、[axCclAllGather](../axccl_api.md#axCclAllGather)、[axCclReduceScatter](../axccl_api.md#axCclReduceScatter)、[axCclGather](../axccl_api.md#axCclGather)（仅限 root）、[axCclAllToAll](../axccl_api.md#axCclAllToAll) 或 [axCclAllToAllV](../axccl_api.md#axCclAllToAllV) 的 `sendbuff` 传入；此时从 `recvbuff` 读取输入（AllGather/Gather 从 `recvbuff` 中本 rank 对应的片段读取）。对于 [axCclScatter](../axccl_api.md#axCclScatter)，只有 root 可以将其作为 `recvbuff` 传入。其他用法（包括 [axCclSend](../axccl_api.md#axCclSend) / [axCclRecv](../axccl_api.md#axCclRecv)）均会被拒绝。

```c
#define AX_CCL_IN_PLACE ((const void *)(-1L))
```

<br>

<a id="AX_CCL_ROOT_INFO_BYTES"></a>

## 37. AX_CCL_ROOT_INFO_BYTES

建链 root info 字节块的大小（字节）。这是稳定的传输格式常量：它属于公开 ABI，并在各 rank 之间交换，因此修改它属于不兼容变更（如需扩大，须新增带版本号的结构体）。对应 NCCL 的 uniqueId。

```c
#define AX_CCL_ROOT_INFO_BYTES 128
```

<br>

<a id="AX_ID_AXCL"></a>

## 38. AX_ID_AXCL

AXCL 模块 ID。

```c
#define AX_ID_AXCL (0x30)
```

<br>

<a id="INVALID_AXCL_CONTEXT"></a>

## 39. INVALID_AXCL_CONTEXT

无效的 Runtime Context 句柄。

```c
#define INVALID_AXCL_CONTEXT ((axclrtContext)0)
```

<br>

<a id="INVALID_AXCL_EVENT"></a>

## 40. INVALID_AXCL_EVENT

无效的 Runtime Event 句柄。

```c
#define INVALID_AXCL_EVENT ((axclrtEvent )0)
```

<br>

<a id="INVALID_AXCL_STREAM"></a>

## 41. INVALID_AXCL_STREAM

无效的 Runtime Stream 句柄。

```c
#define INVALID_AXCL_STREAM ((axclrtStream )0)
```

<br>

<a id="NO_TIMEOUT"></a>

## 42. NO_TIMEOUT

用于无限等待的超时值。

```c
#define NO_TIMEOUT (-1)
```
