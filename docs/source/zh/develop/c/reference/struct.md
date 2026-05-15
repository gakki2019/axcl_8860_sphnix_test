# 结构体参考

<a id="axclCrashDumpConfig"></a>

## axclCrashDumpConfig

崩溃转储配置结构体。

```c
typedef struct {
    const char* dump_dir;   /**< Dump file output directory. */
    const char* dump_type;  /**< Dump type or level such as "Normal" or "FullMemory". */
} axclCrashDumpConfig;
```

### Fields

| 名称      | 类型         | 说明                                            |
| --------- | ------------ | ----------------------------------------------- |
| dump_dir  | const char * | 转储文件输出目录。                              |
| dump_type | const char * | 转储类型或级别，例如 "Normal" 或 "FullMemory"。 |

<br>

<a id="axclrtEngineIODims"></a>

## axclrtEngineIODims

由引擎形状查询 API 返回的张量维度。

```c
typedef struct axclrtEngineIODims {
    int32_t dimCount;                           /**< Number of valid dimensions in the shape. */
    int32_t dims[AXCLRT_ENGINE_MAX_DIM_CNT];    /**< Dimension values in logical tensor order. */
} axclrtEngineIODims;
```

### Fields

| 名称     | 类型                               | 说明                         |
| -------- | ---------------------------------- | ---------------------------- |
| dimCount | int32_t                            | 形状中有效维度的数量。       |
| dims     | int32_t[AXCLRT_ENGINE_MAX_DIM_CNT] | 按逻辑张量顺序排列的维度值。 |

<br>

<a id="mockAttr"></a>

## mockAttr

Mock 管道属性。

```c
typedef struct {
  uint32_t mode;    /**< Mock running mode. */
  uint32_t param_a; /**< Auxiliary parameter A. */
  uint32_t param_b; /**< Auxiliary parameter B. */
} mockAttr;
```

### Fields

| 名称    | 类型     | 说明            |
| ------- | -------- | --------------- |
| mode    | uint32_t | Mock 运行模式。 |
| param_a | uint32_t | 辅助参数 A。    |
| param_b | uint32_t | 辅助参数 B。    |

<br>

<a id="axclError"></a>

## axclError

公开的 AXCL 错误码类型。

```c
typedef int32_t axclError
```

<br>

<a id="axclrtContext"></a>

## axclrtContext

运行时上下文句柄。

```c
typedef void* axclrtContext
```

<br>

<a id="axclrtEngineIO"></a>

## axclrtEngineIO

用于绑定引擎输入和输出缓冲区的不透明句柄。

```c
typedef void* axclrtEngineIO
```

<br>

<a id="axclrtEngineIOInfo"></a>

## axclrtEngineIOInfo

用于查询引擎输入和输出元数据的不透明句柄。

```c
typedef void* axclrtEngineIOInfo
```

<br>

<a id="axclrtEngineSet"></a>

## axclrtEngineSet

描述引擎核亲和性集合的位掩码。

```c
typedef uint32_t axclrtEngineSet
```

<br>

<a id="axclrtEvent"></a>

## axclrtEvent

运行时事件句柄。

```c
typedef void* axclrtEvent
```

<br>

<a id="axclrtStream"></a>

## axclrtStream

运行时流句柄。

```c
typedef void* axclrtStream
```

<br>

<a id="mockCallbackAEx_t"></a>

## mockCallbackAEx_t

带状态码回调的函数指针类型。

```c
typedef int32_t(* mockCallbackAEx_t) (int32_t statusCode)
```

<br>

<a id="mockCallbackA_t"></a>

## mockCallbackA_t

带状态码和用户上下文回调的函数指针类型。

```c
typedef int32_t(* mockCallbackA_t) (int32_t statusCode, void *userData)
```

<br>

<a id="mockCallbackBEx_t"></a>

## mockCallbackBEx_t

不带用户数据的组和帧通知回调函数指针类型。

```c
typedef int32_t(* mockCallbackBEx_t) (uint32_t grp, uint32_t frameIndex)
```

<br>

<a id="mockCallbackB_t"></a>

## mockCallbackB_t

组和帧通知回调函数指针类型。

```c
typedef int32_t(* mockCallbackB_t) (uint32_t grp, uint32_t frameIndex, void *userData)
```
