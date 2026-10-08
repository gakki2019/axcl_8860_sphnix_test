# Macro

<a id="AXCLRT_ENGINE_MAX_DIM_CNT"></a>

## AXCLRT_ENGINE_MAX_DIM_CNT

Maximum number of dimensions supported by an engine tensor.

```c
#define AXCLRT_ENGINE_MAX_DIM_CNT 32
```

<br>

<a id="AXCL_CCL"></a>

## AXCL_CCL

Collective communication sub module ID.

```c
#define AXCL_CCL (0x5B)
```

<br>

<a id="AXCL_COMM"></a>

## AXCL_COMM

Communication sub module ID.

```c
#define AXCL_COMM (0x50)
```

<br>

<a id="AXCL_CTRL"></a>

## AXCL_CTRL

Control sub module ID.

```c
#define AXCL_CTRL (0x57)
```

<br>

<a id="AXCL_DAEMON"></a>

## AXCL_DAEMON

Daemon sub module ID.

```c
#define AXCL_DAEMON (0x55)
```

<br>

<a id="AXCL_DEF_CCL_ERR"></a>

## AXCL_DEF_CCL_ERR

Compose AXCL_CCL sub module error code.

```c
#define AXCL_DEF_CCL_ERR(errid) AXCL_DEF_ERR(AXCL_CCL, (errid))
```

<br>

<a id="AXCL_DEF_COMM_ERR"></a>

## AXCL_DEF_COMM_ERR

Compose AXCL_COMM sub module error code.

```c
#define AXCL_DEF_COMM_ERR(errid) AXCL_DEF_ERR(AXCL_COMM, (errid))
```

<br>

<a id="AXCL_DEF_CTRL_ERR"></a>

## AXCL_DEF_CTRL_ERR

Compose AXCL_CTRL sub module error code.

```c
#define AXCL_DEF_CTRL_ERR(errid) AXCL_DEF_ERR(AXCL_CTRL, (errid))
```

<br>

<a id="AXCL_DEF_DAEMON_ERR"></a>

## AXCL_DEF_DAEMON_ERR

Compose AXCL_DAEMON sub module error code.

```c
#define AXCL_DEF_DAEMON_ERR(errid) AXCL_DEF_ERR(AXCL_DAEMON, (errid))
```

<br>

<a id="AXCL_DEF_ENGINE_ERR"></a>

## AXCL_DEF_ENGINE_ERR

Compose AXCL_ENGINE sub module error code.

```c
#define AXCL_DEF_ENGINE_ERR(errid) AXCL_DEF_ERR(AXCL_ENGINE, (errid))
```

<br>

<a id="AXCL_DEF_ERR"></a>

## AXCL_DEF_ERR

Compose error code.

```text
-------------------------------------------------------------------------|
|1|      FIXED     |    AX_ID_AXCL   |  SUB_MODULE_ID  |     ERR_ID      |
|------------------------------------------------------------------------|
|1|<--- 7bits  --->|<---- 8bits ---->|<---- 8bits ---->|<---- 8bits ---->|
```

```c
#define AXCL_DEF_ERR(sub, errid) ((axclError)((0x80000000L) | ((AX_ID_AXCL) << 16 ) | ((sub) << 8) | (errid)))
```

<br>

<a id="AXCL_DEF_FILE_TRANSFER_ERR"></a>

## AXCL_DEF_FILE_TRANSFER_ERR

Compose AXCL_FILE_TRANSFER sub module error code.

```c
#define AXCL_DEF_FILE_TRANSFER_ERR(errid) AXCL_DEF_ERR(AXCL_FILE_TRANSFER, (errid))
```

<br>

<a id="AXCL_DEF_NATIVE_ERR"></a>

## AXCL_DEF_NATIVE_ERR

Compose AXCL_NATIVE sub module error code.

```c
#define AXCL_DEF_NATIVE_ERR(errid) AXCL_DEF_ERR(AXCL_NATIVE, (errid))
```

<br>

<a id="AXCL_DEF_PROTOCOL_ERR"></a>

## AXCL_DEF_PROTOCOL_ERR

Compose AXCL_PROTOCOL sub module error code.

```c
#define AXCL_DEF_PROTOCOL_ERR(errid) AXCL_DEF_ERR(AXCL_PROTOCOL, (errid))
```

<br>

<a id="AXCL_DEF_RT_ERR"></a>

## AXCL_DEF_RT_ERR

Compose AXCL_RUNTIME sub module error code.

```c
#define AXCL_DEF_RT_ERR(errid) AXCL_DEF_ERR(AXCL_RUNTIME, (errid))
```

<br>

<a id="AXCL_DEF_USRWORK_ERR"></a>

## AXCL_DEF_USRWORK_ERR

Compose AXCL_USRWORK sub module error code.

```c
#define AXCL_DEF_USRWORK_ERR(errid) AXCL_DEF_ERR(AXCL_USRWORK, (errid))
```

<br>

<a id="AXCL_DEF_WORKER_ERR"></a>

## AXCL_DEF_WORKER_ERR

Compose AXCL_WORKER sub module error code.

```c
#define AXCL_DEF_WORKER_ERR(errid) AXCL_DEF_ERR(AXCL_WORKER, (errid))
```

<br>

<a id="AXCL_ENGINE"></a>

## AXCL_ENGINE

Engine sub module ID.

```c
#define AXCL_ENGINE (0x58)
```

<br>

<a id="AXCL_EVENT_DEFAULT"></a>

## AXCL_EVENT_DEFAULT

Default event creation flag.

```c
#define AXCL_EVENT_DEFAULT 0x0
```

<br>

<a id="AXCL_EVENT_DISABLE_TIMING"></a>

## AXCL_EVENT_DISABLE_TIMING

Disable event timing flag.

```c
#define AXCL_EVENT_DISABLE_TIMING 0x2
```

<br>

<a id="AXCL_EXPORT"></a>

## AXCL_EXPORT

```c
#define AXCL_EXPORT
```

<br>

<a id="AXCL_FILE_TRANSFER"></a>

## AXCL_FILE_TRANSFER

File transfer sub module ID.

```c
#define AXCL_FILE_TRANSFER (0x59)
```

<br>

<a id="AXCL_ID_DEVICE"></a>

## AXCL_ID_DEVICE

AXCL DEVICE ID.

```c
#define AXCL_ID_DEVICE (0x31)
```

<br>

<a id="AXCL_ID_HOST"></a>

## AXCL_ID_HOST

AXCL HOST ID.

```c
#define AXCL_ID_HOST (0x30)
```

<br>

<a id="AXCL_IPC_EXPORT_FLAG_DEFAULT"></a>

## AXCL_IPC_EXPORT_FLAG_DEFAULT

```c
#define AXCL_IPC_EXPORT_FLAG_DEFAULT 0x0u
```

<br>

<a id="AXCL_IPC_EXPORT_FLAG_DISABLE_PID_VALIDATION"></a>

## AXCL_IPC_EXPORT_FLAG_DISABLE_PID_VALIDATION

```c
#define AXCL_IPC_EXPORT_FLAG_DISABLE_PID_VALIDATION 0x1u
```

<br>

<a id="AXCL_IPC_KEY_MAX_LEN"></a>

## AXCL_IPC_KEY_MAX_LEN

```c
#define AXCL_IPC_KEY_MAX_LEN 65
```

<br>

<a id="AXCL_IPC_MAX_TARGETS"></a>

## AXCL_IPC_MAX_TARGETS

```c
#define AXCL_IPC_MAX_TARGETS 64
```

<br>

<a id="AXCL_LITE"></a>

## AXCL_LITE

Lite sub module ID.

```c
#define AXCL_LITE (0x53)
```

<br>

<a id="AXCL_NATIVE"></a>

## AXCL_NATIVE

Native sub module ID.

```c
#define AXCL_NATIVE (0x54)
```

<br>

<a id="AXCL_PROTOCOL"></a>

## AXCL_PROTOCOL

Protocol sub module ID.

```c
#define AXCL_PROTOCOL (0x51)
```

<br>

<a id="AXCL_RUNTIME"></a>

## AXCL_RUNTIME

Runtime sub module ID.

```c
#define AXCL_RUNTIME (0x52)
```

<br>

<a id="AXCL_USRWORK"></a>

## AXCL_USRWORK

Userworker sub module ID.

```c
#define AXCL_USRWORK (0x5A)
```

<br>

<a id="AXCL_WORKER"></a>

## AXCL_WORKER

Worker sub module ID.

```c
#define AXCL_WORKER (0x56)
```

<br>

<a id="AX_CCL_EXPORT"></a>

## AX_CCL_EXPORT

```c
#define AX_CCL_EXPORT
```

<br>

<a id="AX_CCL_IN_PLACE"></a>

## AX_CCL_IN_PLACE

Sentinel passed as `sendbuff` for collectives that do not take a send buffer (e.g. in-place [axCclAllGather](../axccl_api.md#axCclAllGather) / [axCclReduceScatter](../axccl_api.md#axCclReduceScatter) / [axCclGather](../axccl_api.md#axCclGather) / [axCclScatter](../axccl_api.md#axCclScatter) / [axCclAllToAll](../axccl_api.md#axCclAllToAll)).

```c
#define AX_CCL_IN_PLACE ((const void *)(-1L))
```

<br>

<a id="AX_CCL_ROOT_INFO_BYTES"></a>

## AX_CCL_ROOT_INFO_BYTES

Size in bytes of the bootstrap root-info blob. A stable wire constant: it is part of the public ABI and is exchanged between ranks, so changing it is a breaking change (a new versioned struct would be required to grow it). Mirrors NCCL uniqueId.

```c
#define AX_CCL_ROOT_INFO_BYTES 128
```

<br>

<a id="AX_ID_AXCL"></a>

## AX_ID_AXCL

AXCL module ID.

```c
#define AX_ID_AXCL (0x30)
```

<br>

<a id="INVALID_AXCL_CONTEXT"></a>

## INVALID_AXCL_CONTEXT

Invalid runtime context handle.

```c
#define INVALID_AXCL_CONTEXT ((axclrtContext)0)
```

<br>

<a id="INVALID_AXCL_EVENT"></a>

## INVALID_AXCL_EVENT

Invalid runtime event handle.

```c
#define INVALID_AXCL_EVENT ((axclrtEvent )0)
```

<br>

<a id="INVALID_AXCL_STREAM"></a>

## INVALID_AXCL_STREAM

Invalid runtime stream handle.

```c
#define INVALID_AXCL_STREAM ((axclrtStream )0)
```

<br>

<a id="NO_TIMEOUT"></a>

## NO_TIMEOUT

Timeout value used to wait indefinitely.

```c
#define NO_TIMEOUT (-1)
```
