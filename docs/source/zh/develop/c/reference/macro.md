# 宏

<a id="AXCLRT_ENGINE_MAX_DIM_CNT"></a>

## 1. AXCLRT_ENGINE_MAX_DIM_CNT

Engine Tensor 支持的最大维度数。

```c
#define AXCLRT_ENGINE_MAX_DIM_CNT 32
```

<br>

<a id="AXCL_COMM"></a>

## 2. AXCL_COMM

```c
#define AXCL_COMM (0x50)
```

<br>

<a id="AXCL_CTRL"></a>

## 3. AXCL_CTRL

```c
#define AXCL_CTRL (0x57)
```

<br>

<a id="AXCL_DAEMON"></a>

## 4. AXCL_DAEMON

```c
#define AXCL_DAEMON (0x55)
```

<br>

<a id="AXCL_DEF_COMM_ERR"></a>

## 5. AXCL_DEF_COMM_ERR

```c
#define AXCL_DEF_COMM_ERR AXCL_DEF_ERR(AXCL_COMM, (errid))
```

<br>

<a id="AXCL_DEF_CTRL_ERR"></a>

## 6. AXCL_DEF_CTRL_ERR

```c
#define AXCL_DEF_CTRL_ERR AXCL_DEF_ERR(AXCL_CTRL, (errid))
```

<br>

<a id="AXCL_DEF_DAEMON_ERR"></a>

## 7. AXCL_DEF_DAEMON_ERR

```c
#define AXCL_DEF_DAEMON_ERR AXCL_DEF_ERR(AXCL_DAEMON, (errid))
```

<br>

<a id="AXCL_DEF_ENGINE_ERR"></a>

## 8. AXCL_DEF_ENGINE_ERR

```c
#define AXCL_DEF_ENGINE_ERR AXCL_DEF_ERR(AXCL_ENGINE, (errid))
```

<br>

<a id="AXCL_DEF_ERR"></a>

## 9. AXCL_DEF_ERR

组合模块特定的 AXCL 错误码。

```c
#define AXCL_DEF_ERR ((axclError)((0x80000000L) | ((AX_ID_AXCL) << 16 ) | ((sub) << 8) | (errid)))
```

<br>

<a id="AXCL_DEF_NATIVE_ERR"></a>

## 10. AXCL_DEF_NATIVE_ERR

```c
#define AXCL_DEF_NATIVE_ERR AXCL_DEF_ERR(AXCL_NATIVE, (errid))
```

<br>

<a id="AXCL_DEF_PROTOCOL_ERR"></a>

## 11. AXCL_DEF_PROTOCOL_ERR

```c
#define AXCL_DEF_PROTOCOL_ERR AXCL_DEF_ERR(AXCL_PROTOCOL, (errid))
```

<br>

<a id="AXCL_DEF_RT_ERR"></a>

## 12. AXCL_DEF_RT_ERR

```c
#define AXCL_DEF_RT_ERR AXCL_DEF_ERR(AXCL_RUNTIME, (errid))
```

<br>

<a id="AXCL_DEF_WORKER_ERR"></a>

## 13. AXCL_DEF_WORKER_ERR

```c
#define AXCL_DEF_WORKER_ERR AXCL_DEF_ERR(AXCL_WORKER, (errid))
```

<br>

<a id="AXCL_ENGINE"></a>

## 14. AXCL_ENGINE

```c
#define AXCL_ENGINE (0x58)
```

<br>

<a id="AXCL_EVENT_DEFAULT"></a>

## 15. AXCL_EVENT_DEFAULT

默认 Event 创建标志。

```c
#define AXCL_EVENT_DEFAULT 0x0
```

<br>

<a id="AXCL_EVENT_DISABLE_TIMING"></a>

## 16. AXCL_EVENT_DISABLE_TIMING

禁用 Event timing 标志。

```c
#define AXCL_EVENT_DISABLE_TIMING 0x2
```

<br>

<a id="AXCL_EXPORT"></a>

## 17. AXCL_EXPORT

```c
#define AXCL_EXPORT
```

<br>

<a id="AXCL_ID_DEVICE"></a>

## 18. AXCL_ID_DEVICE

```c
#define AXCL_ID_DEVICE (0x31)
```

<br>

<a id="AXCL_ID_HOST"></a>

## 19. AXCL_ID_HOST

```c
#define AXCL_ID_HOST (0x30)
```

<br>

<a id="AXCL_LITE"></a>

## 20. AXCL_LITE

```c
#define AXCL_LITE (0x53)
```

<br>

<a id="AXCL_NATIVE"></a>

## 21. AXCL_NATIVE

```c
#define AXCL_NATIVE (0x54)
```

<br>

<a id="AXCL_PROTOCOL"></a>

## 22. AXCL_PROTOCOL

```c
#define AXCL_PROTOCOL (0x51)
```

<br>

<a id="AXCL_RUNTIME"></a>

## 23. AXCL_RUNTIME

```c
#define AXCL_RUNTIME (0x52)
```

<br>

<a id="AXCL_WORKER"></a>

## 24. AXCL_WORKER

```c
#define AXCL_WORKER (0x56)
```

<br>

<a id="AX_ID_AXCL"></a>

## 25. AX_ID_AXCL

```c
#define AX_ID_AXCL (0x30)
```

<br>

<a id="INVALID_AXCL_CONTEXT"></a>

## 26. INVALID_AXCL_CONTEXT

非法 runtime Context 句柄。

```c
#define INVALID_AXCL_CONTEXT ((axclrtContext)0)
```

<br>

<a id="INVALID_AXCL_EVENT"></a>

## 27. INVALID_AXCL_EVENT

非法 runtime Event 句柄。

```c
#define INVALID_AXCL_EVENT ((axclrtEvent )0)
```

<br>

<a id="INVALID_AXCL_STREAM"></a>

## 28. INVALID_AXCL_STREAM

非法 runtime Stream 句柄。

```c
#define INVALID_AXCL_STREAM ((axclrtStream )0)
```

<br>

<a id="NO_TIMEOUT"></a>

## 29. NO_TIMEOUT

用于无限等待的超时值。

```c
#define NO_TIMEOUT (-1)
```
