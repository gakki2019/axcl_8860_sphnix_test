# 结构体

<a id="axclCrashDumpConfig"></a>

## 1. axclCrashDumpConfig

Crash dump 配置结构体。

```c
typedef struct {
    const char* dump_dir;   /**< Dump 文件输出目录。 */
    const char* dump_type;  /**< 兼容性保留字段；Breakpad minicoredump 实现会忽略该字段。 */
} axclCrashDumpConfig;
```

### 1.1. 字段

| 名称 | 类型 | 说明 |
|---|---|---|
| dump_dir | const char * | Dump 文件输出目录。 |
| dump_type | const char * | 兼容性保留字段；Breakpad minicoredump 实现会忽略该字段。 |

<br>

<a id="axclrtEngineIODims"></a>

## 2. axclrtEngineIODims

Engine Shape 查询 API 返回的 Tensor 维度。

```c
typedef struct axclrtEngineIODims {
    int32_t dimCount;                           /**< Shape 中有效维度的数量。 */
    int32_t dims[AXCLRT_ENGINE_MAX_DIM_CNT];    /**< 按逻辑 Tensor 顺序排列的维度值。 */
} axclrtEngineIODims;
```

### 2.1. 字段

| 名称 | 类型 | 说明 |
|---|---|---|
| dimCount | int32_t | Shape 中有效维度的数量。 |
| dims | int32_t[AXCLRT_ENGINE_MAX_DIM_CNT] | 按逻辑 Tensor 顺序排列的维度值。 |

<br>

<a id="axclrtMemLocation"></a>

## 3. axclrtMemLocation

内存位置信息。

```c
typedef struct axclrtMemLocation {
    axclrtMemLocationType type;
    int32_t id;
} axclrtMemLocation;
```

### 3.1. 字段

| 名称 | 类型 | 说明 |
|---|---|---|
| type | axclrtMemLocationType | - |
| id | int32_t | - |

<br>

<a id="axclrtPtrAttributes"></a>

## 4. axclrtPtrAttributes

[axclrtPointerGetAttributes](../memory_api.md#axclrtPointerGetAttributes) 返回的指针属性。

```c
typedef struct axclrtPtrAttributes {
    axclrtMemLocation location;
    uint32_t flags;
    uint32_t rsv[3];
} axclrtPtrAttributes;
```

### 4.1. 字段

| 名称 | 类型 | 说明 |
|---|---|---|
| location | axclrtMemLocation | - |
| flags | uint32_t | - |
| rsv | uint32_t[3] | - |

<br>

<a id="mockAttr"></a>

## 5. mockAttr

Mock pipeline 属性。

```c
typedef struct {
  uint32_t mode;    /**< Mock 运行模式。 */
  uint32_t param_a; /**< 辅助参数 A。 */
  uint32_t param_b; /**< 辅助参数 B。 */
} mockAttr;
```

### 5.1. 字段

| 名称 | 类型 | 说明 |
|---|---|---|
| mode | uint32_t | Mock 运行模式。 |
| param_a | uint32_t | 辅助参数 A。 |
| param_b | uint32_t | 辅助参数 B。 |

<br>

<a id="axclError"></a>

## 6. axclError

公开 AXCL 错误码类型。

```c
typedef int32_t axclError
```

<br>

<a id="axclrtContext"></a>

## 7. axclrtContext

Runtime Context 句柄。

```c
typedef void* axclrtContext
```

<br>

<a id="axclrtEngineIO"></a>

## 8. axclrtEngineIO

用于绑定 engine 输入/输出 Buffer 的不透明句柄。

```c
typedef void* axclrtEngineIO
```

<br>

<a id="axclrtEngineIOInfo"></a>

## 9. axclrtEngineIOInfo

用于查询 engine 输入/输出元数据的不透明句柄。

```c
typedef void* axclrtEngineIOInfo
```

<br>

<a id="axclrtEngineSet"></a>

## 10. axclrtEngineSet

描述 engine core affinity 集合的位掩码。

```c
typedef uint32_t axclrtEngineSet
```

<br>

<a id="axclrtEvent"></a>

## 11. axclrtEvent

Runtime Event 句柄。

```c
typedef void* axclrtEvent
```

<br>

<a id="axclrtStream"></a>

## 12. axclrtStream

Runtime Stream 句柄。

```c
typedef void* axclrtStream
```

<br>

<a id="mockCallbackAEx_t"></a>

## 13. mockCallbackAEx_t

携带状态码调用的回调。

```c
typedef int32_t(* mockCallbackAEx_t) (int32_t statusCode)
```

<br>

<a id="mockCallbackA_t"></a>

## 14. mockCallbackA_t

携带状态码和用户上下文调用的回调。

```c
typedef int32_t(* mockCallbackA_t) (int32_t statusCode, void *userData)
```

<br>

<a id="mockCallbackBEx_t"></a>

## 15. mockCallbackBEx_t

用于 group 和 frame 通知且不携带用户数据的回调。

```c
typedef int32_t(* mockCallbackBEx_t) (uint32_t grp, uint32_t frameIndex)
```

<br>

<a id="mockCallbackB_t"></a>

## 16. mockCallbackB_t

用于 group 和 frame 通知的回调。

```c
typedef int32_t(* mockCallbackB_t) (uint32_t grp, uint32_t frameIndex, void *userData)
```
