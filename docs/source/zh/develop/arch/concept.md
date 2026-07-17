# 核心概念

AXCL runtime 使用 **Device、Context、Stream、Task、Event** 这几类核心对象组织 Host 侧应用与 AXERA AI 设备之间的执行关系。理解这些对象的归属、生命周期和同步边界，是正确使用 AXCL runtime API 的基础。

```{image} ../../asserts/concept.png
:alt: AXCL 核心概念
:align: center
```

- **Device** 表示当前进程可见的一个 AXERA AI 计算设备。
- **Context** 是 Device 内的执行环境和资源作用域。
- **Stream** 是 Context 下的逻辑 FIFO 任务流。
- **Task** 是提交到 Stream 中排队执行的工作单元。
- **Event** 是 Device 级同步对象，用于在同一 Device 内建立 Stream 间的顺序依赖或让 Host 等待某个执行点完成。

## 1. 层级关系

| 对象 | 用户是否直接持有句柄 | 隶属关系 | 主要作用 | 典型 API |
|---|---|---|---|---|
| Device | 使用 `deviceId` 选择 | 进程可见设备 | 设备激活、资源根对象、跨端连接入口 | [axclrtSetDevice](../c/device_api.md#axclrtSetDevice)、[axclrtResetDevice](../c/device_api.md#axclrtResetDevice) |
| Context | 是，[axclrtContext](../c/reference/struct.md#axclrtContext) | 隶属于 Device | 线程当前执行环境；承载 Stream、内存、推理等运行资源 | [axclrtCreateContext](../c/context_api.md#axclrtCreateContext)、[axclrtDestroyContext](../c/context_api.md#axclrtDestroyContext) |
| Stream | 是，[axclrtStream](../c/reference/struct.md#axclrtStream) | 隶属于 Context | FIFO 任务队列；组织异步任务顺序与并发 | [axclrtCreateStream](../c/stream_api.md#axclrtCreateStream)、[axclrtSynchronizeStream](../c/stream_api.md#axclrtSynchronizeStream) |
| Task | 否，内部对象 | 隶属于 Stream | runtime 内部调度和等待的最小工作单元 | runtime 内部管理 |
| Event | 是，[axclrtEvent](../c/reference/struct.md#axclrtEvent) | 隶属于 Device | Stream 间同步、Host 等待、耗时测量 | [axclrtCreateEvent](../c/event_api.md#axclrtCreateEvent)、[axclrtRecordEvent](../c/event_api.md#axclrtRecordEvent)、[axclrtStreamWaitEvent](../c/event_api.md#axclrtStreamWaitEvent) |

<a id="DEVICE"></a>

## 2. Device

Device 是 AXCL runtime 管理的 AXERA AI 计算设备。Host 进程可以看到一个或多个 Device，并通过逻辑 `deviceId` 选择目标设备。

Device 被激活后，runtime 会建立 Host 与 Device 之间的运行连接，并为该 Device 创建默认执行资源：

1. 启动该 Device 对应的数据通道；
2. Device 侧由 daemon 守护进程拉起对应 worker 工作进程；
3. 创建 **默认 Context**；
4. 在默认 Context 下创建 **默认 Stream**；
5. 注册 runtime 内部需要的响应、回调和异常接收逻辑。

```c
axclInit(NULL);

uint32_t count = 0;
axclrtGetDeviceCount(&count);
/* 假设当前进程可见 4 个逻辑 Device，则 count 为 4，deviceId 范围为 0 到 3 */

/* 激活逻辑 Device 0，并把主线程绑定到 Device 0 的默认 Context */
axclrtSetDevice(0);

...

/* 激活逻辑 Device 1，并把主线程切换到 Device 1 的默认 Context */
axclrtSetDevice(1);

...

/* 去激活设备 0 */
axclrtResetDevice(0);

/* 去激活设备 1 */
axclrtResetDevice(1);

axclFinalize();
```

### 2.1. 设备编号

AXCL 对外使用的是当前进程可见的逻辑设备 ID，runtime 内部再把逻辑设备 ID 映射到驱动和通信层使用的物理设备 ID：

- **物理设备 ID** 来自 runtime 探测到的设备信息，是驱动和通信层识别设备时使用的 ID；
- **逻辑设备 ID** 是 AXCL 暴露给当前进程使用的连续编号，取值范围为 `0` 到 `device count - 1`；
- 通过 [axclrtGetDeviceCount](../c/device_api.md#axclrtGetDeviceCount) 查询当前进程可见的逻辑设备个数。

<a id="AXCL_VISIBLE_DEVICES"></a>

#### 2.1.1. AXCL_VISIBLE_DEVICES

AXCL 使用环境变量 `AXCL_VISIBLE_DEVICES` 控制当前进程可见的物理设备集合，并按照可见设备集合生成逻辑设备 ID 到物理设备 ID 的映射关系。该环境变量应在应用调用 [axclInit](../c/system_api.md#axclInit) 前设置，常见用法如下：

```bash
# 仅让当前进程看到物理设备 3 和 1
export AXCL_VISIBLE_DEVICES=3,1
./app
```

`AXCL_VISIBLE_DEVICES` 的解析规则如下：

- 当 `AXCL_VISIBLE_DEVICES` 未设置时，runtime 将探测到的全部物理设备按探测顺序映射为逻辑设备；
- 当 `AXCL_VISIBLE_DEVICES` 设置为逗号分隔的物理设备 ID 列表时，runtime 按列表顺序生成逻辑设备映射。

假设系统中一共有 4 个物理设备，物理设备 ID 分别为 `0`、`1`、`2`、`3`，设置 `AXCL_VISIBLE_DEVICES=3,1` 后，当前进程只看到两个逻辑设备：

```{image} ../../asserts/visible_devices_3_1.svg
:alt: AXCL_VISIBLE_DEVICES=3,1 逻辑设备映射示意图
:align: center
```

### 2.2. 生命周期

Device 使用引用计数管理激活状态：

- 首次调用 [axclrtSetDevice](../c/device_api.md#axclrtSetDevice) 激活 Device 时，runtime 建立连接并创建默认 Context / 默认 Stream；
- 后续再次激活同一个 Device 时，runtime 只增加该 Device 的引用计数，并把当前线程绑定到该 Device 的默认 Context；
- [axclrtCreateContext](../c/context_api.md#axclrtCreateContext) 会在指定 Device 上创建显式 Context，并持有该 Device 的激活引用；[axclrtDestroyContext](../c/context_api.md#axclrtDestroyContext) 会销毁显式 Context 并释放对应引用；
- 每次通过 [axclrtSetDevice](../c/device_api.md#axclrtSetDevice) 激活 Device，都需要对应一次 [axclrtResetDevice](../c/device_api.md#axclrtResetDevice) 去激活；
- 只有引用计数降为 0 的最后一次去激活，runtime 才会释放该 Device 的默认 Context / 默认 Stream 和跨端连接资源。

Device 与其下对象存在生命周期依赖：

- 显式 Stream 依赖所属 Context；
- 显式 Context 依赖所属 Device；
- 默认 Context 和默认 Stream 在 Device 首次激活时自动创建，在 Device 最终去激活时释放；
- 最终释放 Device 前，显式创建的 Context / Stream 必须已经释放，否则 runtime 会拒绝释放 Device。

```{important}
- 最终去激活并释放 Device 前，用户必须先释放自己显式创建的 Stream 和 Context，释放顺序为 [axclrtDestroyStream](../c/stream_api.md#axclrtDestroyStream) → [axclrtDestroyContext](../c/context_api.md#axclrtDestroyContext) → [axclrtResetDevice](../c/device_api.md#axclrtResetDevice)。
- 如果仍存在未释放的显式 Context 或 Stream，runtime 会拒绝释放 Device。
```

### 2.3. 设备同步

- [axclrtSynchronizeDevice](../c/device_api.md#axclrtSynchronizeDevice) 会等待当前线程所绑定 Context 对应 Device 上已提交的相关任务完成。
- [axclrtSynchronizeDeviceWithTimeout](../c/device_api.md#axclrtSynchronizeDeviceWithTimeout) 支持超时等待， `timeout` 单位为毫秒，`-1` 表示无限等待。

<a id="CONTEXT"></a>

## 3. Context

Context 是 Device 内的执行环境和资源作用域，每个 Context 只隶属于一个 Device，并在创建时自动拥有一个默认 Stream 对象。
Host 线程通过绑定当前 Context 来确定后续 runtime API 的目标 Device 和执行作用域。

### 3.1. 默认与显式 Context

Context 分为两类：

| 类型 | 创建方式 | 销毁方式 | 说明 |
|---|---|---|---|
| 默认 Context | 首次 [axclrtSetDevice](../c/device_api.md#axclrtSetDevice) 时自动创建 | 随 Device 去激活释放 | 每个已激活 Device 在进程内有一个默认 Context，ID 固定为 `0`；不能通过 [axclrtDestroyContext](../c/context_api.md#axclrtDestroyContext) 显式销毁 |
| 显式 Context | 调用 [axclrtCreateContext](../c/context_api.md#axclrtCreateContext) 创建 | 调用 [axclrtDestroyContext](../c/context_api.md#axclrtDestroyContext) 销毁 | 适合需要独立执行作用域或多线程切换 Context 的场景 |

用户不显式创建 Context 时，可以通过 [axclrtSetDevice](../c/device_api.md#axclrtSetDevice) 激活 Device，并将当前线程绑定到该 Device 的默认 Context。

```{important}
- 默认 Context 由 runtime 管理，用户不能通过 [axclrtDestroyContext](../c/context_api.md#axclrtDestroyContext) 显式销毁。
- 默认 Context 会在所属 Device 最终去激活时由 runtime 自动释放。
- 销毁显式 Context 前，需要先销毁该 Context 下显式创建的 Stream。
```

### 3.2. Context 与线程绑定

每个 Host 线程都有独立的当前 Context 绑定关系：

- 线程使用设备资源前，需要先绑定一个 Context；
- 同一线程同一时刻最多绑定一个当前 Context，Context 中已经包含所属 Device 信息；
- [axclrtCreateContext](../c/context_api.md#axclrtCreateContext) 会在指定 Device 上创建显式 Context，并把当前线程绑定到新 Context；
- 如果同一线程连续创建多个 Context，当前线程默认使用最后一次创建的 Context；
- 可以通过 [axclrtSetCurrentContext](../c/context_api.md#axclrtSetCurrentContext) 将已有 Context 绑定为当前线程的当前 Context；
- [axclrtDestroyContext](../c/context_api.md#axclrtDestroyContext) 销毁显式 Context，并解除该 Context 在各线程中的绑定记录。

```c
void worker_thread(void) {
    axclrtContext ctx;

    /* 工作线程在 Device 0 上创建显式 Context，并将该 Context 绑定为本线程的当前 Context */
    axclrtCreateContext(&ctx, 0);

    /* 工作线程后续基于当前 Context 的 API 会以 ctx 作为执行环境 */
    ...

    /* 工作线程退出前，销毁显式创建的 Context */
    axclrtDestroyContext(ctx);
}

int main(void) {
    axclInit(NULL);

    /* 主线程激活 Device 0，并绑定到 Device 0 的默认 Context */
    axclrtSetDevice(0);

    /* 启动工作线程；工作线程会在同一个 Device 0 上创建显式 Context */
    start_worker_thread(worker_thread);
    join_worker_thread();

    /* 工作线程释放显式 Context 后，主线程再去激活 Device 0 */
    axclrtResetDevice(0);

    axclFinalize();
    return 0;
}
```

### 3.3. Context 切换

同一线程可以持有多个显式 Context，但同一时刻只有一个 Context 作为当前 Context。
创建多个 Context 时，当前线程默认绑定到最后一次创建的 Context。
需要切换执行环境时，可以调用 [axclrtSetCurrentContext](../c/context_api.md#axclrtSetCurrentContext) 将指定 Context 绑定为当前线程的当前 Context。

下面示例在同一个 Device 上创建两个显式 Context，并在两个 Context 之间切换：

```c
int main(void) {
    axclrtContext ctx0;
    axclrtContext ctx1;

    axclInit(NULL);

    /* 主线程激活 Device 0，并绑定到 Device 0 的默认 Context */
    axclrtSetDevice(0);

    /* 创建第一个显式 Context；创建成功后，ctx0 成为主线程的当前 Context */
    axclrtCreateContext(&ctx0, 0);

    /* 创建第二个显式 Context；创建成功后，ctx1 成为主线程的当前 Context */
    axclrtCreateContext(&ctx1, 0);

    /* 将主线程的当前 Context 切换回 ctx0 */
    axclrtSetCurrentContext(ctx0);

    /* 后续基于当前 Context 的 runtime API 会以 ctx0 作为执行环境 */
    ...

    /* 再将主线程的当前 Context 切换到 ctx1 */
    axclrtSetCurrentContext(ctx1);

    /* 后续基于当前 Context 的 runtime API 会以 ctx1 作为执行环境 */
    ...

    axclrtDestroyContext(ctx0);
    axclrtDestroyContext(ctx1);
    axclrtResetDevice(0);

    axclFinalize();
    return 0;
}
```

<a id="STREAM"></a>

## 4. Stream

Stream 是 Context 下的逻辑任务流。它用于组织任务顺序，是 AXCL 异步执行模型的核心对象。

Stream 的关键语义是：

- 同一 Stream 内的 Task 按提交顺序进入队列，并按 FIFO 顺序调度执行；
- 不同 Stream 拥有各自独立的任务队列，默认不保证彼此之间的执行先后关系；
- 如果不同 Stream 之间需要建立执行依赖，应使用 Event 在 Stream 队列中插入 record / wait 节点；
- Stream 是 Context 下的逻辑执行队列，用于描述任务顺序和同步边界，不等同于底层物理数据通道；
- 异步 API 成功返回通常表示请求已被 runtime 接受或已提交到对应 Stream，并不表示任务已经执行完成；任务完成需要通过 Stream、Event 或 Device 同步接口确认。

### 4.1. 默认与显式 Stream

Stream 分为两类：

| 类型 | 创建方式 | 销毁方式 | 说明 |
|---|---|---|---|
| 默认 Stream | Context 创建时自动创建 | 随所属 Context 销毁 | 每个 Context 自动拥有一个默认 Stream，ID 为 `0`；默认 Stream 由 runtime 管理，用户不能显式销毁 |
| 显式 Stream | 调用 [axclrtCreateStream](../c/stream_api.md#axclrtCreateStream) 创建 | 调用 [axclrtDestroyStream](../c/stream_api.md#axclrtDestroyStream) 销毁 | 创建时归属于当前线程绑定的 Context |

```c
axclInit(NULL);

axclrtStream stream;

axclrtSetDevice(0);

/* 在当前默认 Context 下创建显式 Stream */
axclrtCreateStream(&stream);

/* 以下异步任务都会提交到同一个 stream，并在该 stream 内按 FIFO 顺序执行 */
axclrtEngineExecuteAsync(..., stream);
axclrtMemcpyAsync(..., stream);

/* 等待 stream 中已提交的任务完成，再销毁该显式 Stream */
axclrtSynchronizeStream(stream);
axclrtDestroyStream(stream);

axclrtResetDevice(0);
axclFinalize();
```

### 4.2. Stream 同步与查询

- [axclrtSynchronizeStream](../c/stream_api.md#axclrtSynchronizeStream) 会等待指定 Stream 中已提交的任务完成。
- [axclrtSynchronizeStreamWithTimeout](../c/stream_api.md#axclrtSynchronizeStreamWithTimeout) 支持超时等待，`timeout` 单位为毫秒，`-1` 表示无限等待。

[axclrtStreamQuery](../c/stream_api.md#axclrtStreamQuery) 是非阻塞状态查询接口，用于获取指定 Stream 当前任务状态快照：
- `AXCL_STREAM_STATUS_COMPLETE` 表示查询时刻 Stream 上没有未完成任务；
- `AXCL_STREAM_STATUS_NOT_READY` 表示查询时刻仍有任务未完成；

<a id="TASK"></a>

## 5. Task

Task 是 AXCL runtime 内部用于描述一次任务执行的最小调度单元，比如：

- Engine 推理请求；
- NATIVE SDK RPC 请求，如媒体处理、图像处理、DMA 等；
- 异步内存操作，如 `memcpy`、`memset`、`memcmp` 的异步形式；
- Event record / Event wait；
- Stream 同步栅栏；

Task 会被提交到某一条 Stream 中排队执行。runtime 使用 token、响应匹配和等待状态跟踪 Task 的发送、入队和完成状态。

从用户视角看，Task 的意义主要体现在两点：

1. **顺序性**：同一 Stream 内的 Task 按提交顺序执行。
2. **完成边界**：异步 API 返回后，Task 可能只是已入队；真正完成需要通过 Stream、Event 或 Device 同步接口确认。

<a id="EVENT"></a>

## 6. Event

Event 是 Device 级同步对象，用于标记某个 Stream 上的执行点，用于同一 Device 内、不同 Stream 之间的任务同步。

Event 不隶属于 Context 或 Stream，而是由所属 Device 的 Event 管理器统一管理。支持一个任务等待一个事件或者多个任务等待同一个事件。

一个任务等待一个事件的关系如下：

```{image} ../../asserts/event_one_wait.svg
:alt: 一个任务等待一个 Event 的同步关系示意图
:align: center
```

多个任务等待同一个事件的关系如下：

```{image} ../../asserts/event_multi_wait.svg
:alt: 多个任务等待同一个 Event 的同步关系示意图
:align: center
```

### 6.1. 创建与销毁

| 操作 | 说明 |
|---|---|
| [axclrtCreateEvent](../c/event_api.md#axclrtCreateEvent) | 在当前线程绑定的 Device 上创建 Event |
| [axclrtDestroyEvent](../c/event_api.md#axclrtDestroyEvent) | 销毁 Event |

```{important}
Event 属于创建它的 Device，只能在同一 Device 内使用。不同 Device 的 Stream 不能共享同一个 Event。
```

### 6.2. Record、Wait 和 Synchronize

Event 的常用同步语义包括 record、wait 和 synchronize：

| 操作 | 语义 | Host 是否等待 Event 完成 |
|---|---|---|
| [axclrtRecordEvent](../c/event_api.md#axclrtRecordEvent) | 在指定 Stream 中插入 record 节点；该 Stream 执行到该节点时，Event 变为 signaled | 否，成功返回表示 record 请求已被接受 |
| [axclrtStreamWaitEvent](../c/event_api.md#axclrtStreamWaitEvent) | 在指定 Stream 中插入 wait barrier；该 Stream 执行到该 barrier 时等待 Event signaled，之后再继续执行后续任务 | 否，成功返回表示 wait 请求已被接受 |
| [axclrtSynchronizeEvent](../c/event_api.md#axclrtSynchronizeEvent) | Host 当前线程等待 Event signaled | 是 |


下面的示例演示了 `stream2` 等待 `stream1` 的模型推理完成后再进行内存搬运的同步执行控制：

```c
axclInit(NULL);

axclrtStream stream1;
axclrtStream stream2;
axclrtEvent event;

axclrtSetDevice(0);

axclrtCreateStream(&stream1);
axclrtCreateStream(&stream2);

/* 创建事件 */
axclrtCreateEvent(&event);

axclrtEngineExecuteAsync(..., stream1);

/* 在 stream1 中记录执行点 */
axclrtRecordEvent(event, stream1);

/* stream2 等待 stream1 的执行点完成 */
axclrtStreamWaitEvent(stream2, event);

/* stream2 在 stream1 axclrtEngineExecuteAsync 完成后才执行 axclrtMemcpyAsync */
axclrtMemcpyAsync(..., stream2);

/* 等待 stream2 中包含 Event Wait 在内的任务完成 */
axclrtSynchronizeStream(stream2);

axclrtDestroyEvent(event);
axclrtDestroyStream(stream2);
axclrtDestroyStream(stream1);
axclrtResetDevice(0);

axclFinalize();
```

### 6.3. 耗时测量

Event 可用于测量两个执行点之间的时间差：

- 使用 [axclrtCreateEvent](../c/event_api.md#axclrtCreateEvent) 或 [axclrtCreateEventWithFlags](../c/event_api.md#axclrtCreateEventWithFlags) 配合 [AXCL_EVENT_DEFAULT](../c/reference/macro.md#AXCL_EVENT_DEFAULT) 创建的 Event 默认支持 timing；
- 使用 [AXCL_EVENT_DISABLE_TIMING](../c/reference/macro.md#AXCL_EVENT_DISABLE_TIMING) 创建的 Event 不采集时间戳，不能用于 [axclrtEventElapsedTime](../c/event_api.md#axclrtEventElapsedTime)；
- [axclrtEventElapsedTime](../c/event_api.md#axclrtEventElapsedTime) 要求两个 Event 属于同一 Device；AXCL 实现还会在 Worker 侧检查两个 Event 是否已经 record、是否已经 signaled，以及最后一次 record 是否位于同一 Stream；
- Event 的时间戳在 Worker 执行 record 节点时采集，不是 Host 调用 [axclrtRecordEvent](../c/event_api.md#axclrtRecordEvent) 的时刻。

```c
axclrtEvent start;
axclrtEvent end;
float elapsedMs = 0.0f;

axclrtCreateEvent(&start);
axclrtCreateEvent(&end);

axclrtRecordEvent(start, stream);
axclrtEngineExecuteAsync(..., stream);
axclrtRecordEvent(end, stream);

axclrtSynchronizeEvent(end);
axclrtEventElapsedTime(&elapsedMs, start, end);

axclrtDestroyEvent(end);
axclrtDestroyEvent(start);
```

### 6.4. 归属与限制

- Event 是 Device 级对象，不属于 Context 或 Stream；
- 同一 Device 内，不同 Context 的 Stream 可以通过 Event 建立同步关系；
- 不同 Device 之间不能通过 Event 建立同步关系；
- Event record 和 Stream wait 都是 Stream FIFO 中的异步节点，API 成功返回不表示 Event 已经完成；
- [axclrtSynchronizeEvent](../c/event_api.md#axclrtSynchronizeEvent) 是 Host 侧阻塞等待接口，用于等待 Event signaled；
- Event 的状态由 Device 侧 Worker 管理，Host 侧 Event 句柄主要保存 Device 归属、event id 和 flags 等信息。
