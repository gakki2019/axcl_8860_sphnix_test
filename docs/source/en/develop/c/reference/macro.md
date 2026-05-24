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

```c
#define AXCL_COMM (0x50)
```

<br>

<a id="AXCL_CTRL"></a>

## AXCL_CTRL

```c
#define AXCL_CTRL (0x57)
```

<br>

<a id="AXCL_DAEMON"></a>

## AXCL_DAEMON

```c
#define AXCL_DAEMON (0x55)
```

<br>

<a id="AXCL_DEF_COMM_ERR"></a>

## AXCL_DEF_COMM_ERR

```c
#define AXCL_DEF_COMM_ERR AXCL_DEF_ERR(AXCL_COMM, (errid))
```

<br>

<a id="AXCL_DEF_CTRL_ERR"></a>

## AXCL_DEF_CTRL_ERR

```c
#define AXCL_DEF_CTRL_ERR AXCL_DEF_ERR(AXCL_CTRL, (errid))
```

<br>

<a id="AXCL_DEF_DAEMON_ERR"></a>

## AXCL_DEF_DAEMON_ERR

```c
#define AXCL_DEF_DAEMON_ERR AXCL_DEF_ERR(AXCL_DAEMON, (errid))
```

<br>

<a id="AXCL_DEF_ENGINE_ERR"></a>

## AXCL_DEF_ENGINE_ERR

```c
#define AXCL_DEF_ENGINE_ERR AXCL_DEF_ERR(AXCL_ENGINE, (errid))
```

<br>

<a id="AXCL_DEF_ERR"></a>

## AXCL_DEF_ERR

Compose a module-specific AXCL error code.

```c
#define AXCL_DEF_ERR ((axclError)((0x80000000L) | ((AX_ID_AXCL) << 16 ) | ((sub) << 8) | (errid)))
```

<br>

<a id="AXCL_DEF_NATIVE_ERR"></a>

## AXCL_DEF_NATIVE_ERR

```c
#define AXCL_DEF_NATIVE_ERR AXCL_DEF_ERR(AXCL_NATIVE, (errid))
```

<br>

<a id="AXCL_DEF_PROTOCOL_ERR"></a>

## AXCL_DEF_PROTOCOL_ERR

```c
#define AXCL_DEF_PROTOCOL_ERR AXCL_DEF_ERR(AXCL_PROTOCOL, (errid))
```

<br>

<a id="AXCL_DEF_RT_ERR"></a>

## AXCL_DEF_RT_ERR

```c
#define AXCL_DEF_RT_ERR AXCL_DEF_ERR(AXCL_RUNTIME, (errid))
```

<br>

<a id="AXCL_DEF_WORKER_ERR"></a>

## AXCL_DEF_WORKER_ERR

```c
#define AXCL_DEF_WORKER_ERR AXCL_DEF_ERR(AXCL_WORKER, (errid))
```

<br>

<a id="AXCL_ENGINE"></a>

## AXCL_ENGINE

```c
#define AXCL_ENGINE (0x58)
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

```c
#define AXCL_ID_DEVICE (0x31)
```

<br>

<a id="AXCL_ID_HOST"></a>

## AXCL_ID_HOST

```c
#define AXCL_ID_HOST (0x30)
```

<br>

<a id="AXCL_LITE"></a>

## AXCL_LITE

```c
#define AXCL_LITE (0x53)
```

<br>

<a id="AXCL_NATIVE"></a>

## AXCL_NATIVE

```c
#define AXCL_NATIVE (0x54)
```

<br>

<a id="AXCL_PROTOCOL"></a>

## AXCL_PROTOCOL

```c
#define AXCL_PROTOCOL (0x51)
```

<br>

<a id="AXCL_RUNTIME"></a>

## AXCL_RUNTIME

```c
#define AXCL_RUNTIME (0x52)
```

<br>

<a id="AXCL_WORKER"></a>

## AXCL_WORKER

```c
#define AXCL_WORKER (0x56)
```

<br>

<a id="AX_ID_AXCL"></a>

## AX_ID_AXCL

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
