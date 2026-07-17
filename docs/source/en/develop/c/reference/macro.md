# Macro

<a id="AXCLRT_ENGINE_MAX_DIM_CNT"></a>

## AXCLRT_ENGINE_MAX_DIM_CNT

Maximum number of dimensions supported by an engine tensor.

```c
#define AXCLRT_ENGINE_MAX_DIM_CNT 32
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

<a id="AXCL_DEF_COMM_ERR"></a>

## AXCL_DEF_COMM_ERR

Compose AXCL_COMM sub module error code.

```c
#define AXCL_DEF_COMM_ERR AXCL_DEF_ERR(AXCL_COMM, (errid))
```

<br>

<a id="AXCL_DEF_CTRL_ERR"></a>

## AXCL_DEF_CTRL_ERR

Compose AXCL_CTRL sub module error code.

```c
#define AXCL_DEF_CTRL_ERR AXCL_DEF_ERR(AXCL_CTRL, (errid))
```

<br>

<a id="AXCL_DEF_DAEMON_ERR"></a>

## AXCL_DEF_DAEMON_ERR

Compose AXCL_DAEMON sub module error code.

```c
#define AXCL_DEF_DAEMON_ERR AXCL_DEF_ERR(AXCL_DAEMON, (errid))
```

<br>

<a id="AXCL_DEF_ENGINE_ERR"></a>

## AXCL_DEF_ENGINE_ERR

Compose AXCL_ENGINE sub module error code.

```c
#define AXCL_DEF_ENGINE_ERR AXCL_DEF_ERR(AXCL_ENGINE, (errid))
```

<br>

<a id="AXCL_DEF_ERR"></a>

## AXCL_DEF_ERR

Compose error code. ----------------------------------------------------------------------| |1| FIXED | AX_ID_AXCL | SUB_MODULE_ID | ERR_ID | |---------------------------------------------------------------------| |1|< 7bits >|<- 8bits ->|<- 8bits ->|<- 8bits ->|.

```c
#define AXCL_DEF_ERR ((axclError)((0x80000000L) | ((AX_ID_AXCL) << 16 ) | ((sub) << 8) | (errid)))
```

<br>

<a id="AXCL_DEF_NATIVE_ERR"></a>

## AXCL_DEF_NATIVE_ERR

Compose AXCL_NATIVE sub module error code.

```c
#define AXCL_DEF_NATIVE_ERR AXCL_DEF_ERR(AXCL_NATIVE, (errid))
```

<br>

<a id="AXCL_DEF_PROTOCOL_ERR"></a>

## AXCL_DEF_PROTOCOL_ERR

Compose AXCL_PROTOCOL sub module error code.

```c
#define AXCL_DEF_PROTOCOL_ERR AXCL_DEF_ERR(AXCL_PROTOCOL, (errid))
```

<br>

<a id="AXCL_DEF_RT_ERR"></a>

## AXCL_DEF_RT_ERR

Compose AXCL_RUNTIME sub module error code.

```c
#define AXCL_DEF_RT_ERR AXCL_DEF_ERR(AXCL_RUNTIME, (errid))
```

<br>

<a id="AXCL_DEF_WORKER_ERR"></a>

## AXCL_DEF_WORKER_ERR

Compose AXCL_WORKER sub module error code.

```c
#define AXCL_DEF_WORKER_ERR AXCL_DEF_ERR(AXCL_WORKER, (errid))
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

<a id="AXCL_WORKER"></a>

## AXCL_WORKER

Worker sub module ID.

```c
#define AXCL_WORKER (0x56)
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
