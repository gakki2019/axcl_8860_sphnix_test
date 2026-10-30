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
| Device | 使用 `deviceId` 选择 | 进程可见设备 | 设备激活、资源根对象、与 Device 的连接 | [axclrtSetDevice](../c/device_api.md#axclrtSetDevice)、[axclrtResetDevice](../c/device_api.md#axclrtResetDevice) |
| Context | 是，[axclrtContext](../c/reference/struct.md#axclrtContext) | 隶属于 Device | 当前线程的执行环境；拥有 Stream，并界定内存、推理等运行资源的作用域 | [axclrtCreateContext](../c/context_api.md#axclrtCreateContext)、[axclrtDestroyContext](../c/context_api.md#axclrtDestroyContext) |
| Stream | 是，[axclrtStream](../c/reference/struct.md#axclrtStream) | 隶属于 Context | FIFO 任务队列；为异步任务排序，并隔离彼此独立的工作 | [axclrtCreateStream](../c/stream_api.md#axclrtCreateStream)、[axclrtSynchronizeStream](../c/stream_api.md#axclrtSynchronizeStream) |
| Task | 否，隐式创建 | 隶属于 Stream | API 调用提交到 Stream 的工作单元 | 由提交工作的 API 创建 |
| Event | 是，[axclrtEvent](../c/reference/struct.md#axclrtEvent) | 隶属于 Device | Stream 间同步、Host 等待、耗时测量 | [axclrtCreateEvent](../c/event_api.md#axclrtCreateEvent)、[axclrtRecordEvent](../c/event_api.md#axclrtRecordEvent)、[axclrtStreamWaitEvent](../c/event_api.md#axclrtStreamWaitEvent) |

<a id="DEVICE"></a>

## 2. Device

Device 是 AXCL runtime 管理的 AXERA AI 计算设备。Host 进程可以看到一个或多个 Device，并通过逻辑 `deviceId` 选择目标设备。

进程内首次通过 [axclrtSetDevice](../c/device_api.md#axclrtSetDevice) 或 [axclrtCreateContext](../c/context_api.md#axclrtCreateContext) 激活某个 Device 时，进程会连接到该 Device，并创建其默认执行资源：

1. Device 侧 daemon 守护进程拉起一个为该 Host 进程服务的 worker 工作进程；
2. runtime 打开 Host 进程与该 worker 之间的通信通道；
3. runtime 创建 **默认 Context**；
4. runtime 在默认 Context 下创建 **默认 Stream**；
5. runtime 开始监控该 Device。如果 Device 或其 worker 变为不可用，runtime 会将该 Device 标记为离线，使未完成的任务失败，并通知通过 [axclrtRegDeviceStateCallback](../c/device_api.md#axclrtRegDeviceStateCallback) 注册的回调。

```c
axclInit(NULL);

uint32_t count = 0;
axclrtGetDeviceCount(&count);
/* 假设当前进程可见 4 个逻辑 Device，则 count 为 4，deviceId 范围为 0 到 3 */

/* 激活逻辑 Device 0，并把主线程绑定到 Device 0 的默认 Context */
axclrtSetDevice(0);

...

/* 激活逻辑 Device 1，并把主线程改为绑定到 Device 1 的默认 Context */
axclrtSetDevice(1);

...

/* 去激活设备 0 */
axclrtResetDevice(0);

/* 去激活设备 1 */
axclrtResetDevice(1);

axclFinalize();
```

### 2.1. 设备编号

所有 AXCL API 使用的都是逻辑设备 ID，API 参考中也称为虚拟设备 ID。runtime 把每个逻辑设备 ID 映射到一个物理设备 ID：

- **物理设备 ID** 标识驱动检测到的设备。调用 [axclrtGetDeviceInfo](../c/device_api.md#axclrtGetDeviceInfo) 并指定 `AXCL_DEVICE_ATTR_PHYSICAL_DEVICE_ID`，可获取某个逻辑设备的物理设备 ID；
- **逻辑设备 ID** 是 AXCL 暴露给当前进程使用的连续编号，取值范围为 `0` 到 `device count - 1`；
- 通过 [axclrtGetDeviceCount](../c/device_api.md#axclrtGetDeviceCount) 查询当前进程可见的逻辑设备个数。

<a id="AXCL_VISIBLE_DEVICES"></a>

#### 2.1.1. AXCL_VISIBLE_DEVICES

环境变量 `AXCL_VISIBLE_DEVICES` 用于选择当前进程可见的物理设备，并定义逻辑设备 ID 到这些物理设备的映射。该变量每个进程只读取一次，最晚在 [axclInit](../c/system_api.md#axclInit) 中读取，因此需在进程启动前或调用该接口前设置。示例如下：

```bash
# 仅让当前进程看到物理设备 3 和 1
export AXCL_VISIBLE_DEVICES=3,1
./app
```

`AXCL_VISIBLE_DEVICES` 的解析规则如下：

- 当 `AXCL_VISIBLE_DEVICES` 未设置时，检测到的全部物理设备均可见，并按检测顺序编号；
- 当其设置为逗号分隔的物理设备 ID 列表时，按列表顺序分配逻辑设备 ID；
- 当其设置为空字符串时，没有可见设备；
- 无效项和重复项会被跳过。解析在遇到第一个与已检测物理设备不匹配的 ID 时停止，其后的各项均被忽略。

假设系统中一共有 4 个物理设备，物理设备 ID 分别为 `0`、`1`、`2`、`3`，设置 `AXCL_VISIBLE_DEVICES=3,1` 后，当前进程只看到两个逻辑设备：

```{image} ../../asserts/visible_devices_3_1.svg
:alt: AXCL_VISIBLE_DEVICES=3,1 逻辑设备映射示意图
:align: center
```

### 2.2. 生命周期

Device 使用引用计数管理激活状态：

- 进程内首次激活 Device 时，runtime 连接到该 Device 并创建默认 Context 和默认 Stream；
- 之后每次对同一 Device 调用 [axclrtSetDevice](../c/device_api.md#axclrtSetDevice)，都会增加其引用计数，并把调用线程绑定到该 Device 的默认 Context；
- [axclrtCreateContext](../c/context_api.md#axclrtCreateContext) 同样会持有指定 Device 的一个激活引用，[axclrtDestroyContext](../c/context_api.md#axclrtDestroyContext) 释放该引用；
- 每次成功调用 [axclrtSetDevice](../c/device_api.md#axclrtSetDevice)，都需要对应一次 [axclrtResetDevice](../c/device_api.md#axclrtResetDevice)；
- 引用计数按进程统计，而不是按线程统计。只有使引用计数降为 0 的那次释放，才会等待默认 Stream 执行完成，然后释放默认 Context、默认 Stream 以及与该 Device 的连接；
- [axclrtResetDeviceForce](../c/device_api.md#axclrtResetDeviceForce) 会释放 Device，不论其引用计数为多少。它仍会等待默认 Stream 完成；如果仍存在显式 Context 或 Stream，则调用失败。

Device 与其下对象存在生命周期依赖：

- 显式 Stream 依赖所属 Context；
- 显式 Context 依赖所属 Device；
- 默认 Context 和默认 Stream 在 Device 首次激活时自动创建，在 Device 最终去激活时释放；
- 最终释放 Device 前，需先释放显式创建的 Context 和 Stream，否则释放会失败。

```{important}
- 最终释放 Device 前，需先按以下顺序释放显式创建的 Stream 和 Context：[axclrtDestroyStream](../c/stream_api.md#axclrtDestroyStream) → [axclrtDestroyContext](../c/context_api.md#axclrtDestroyContext) → [axclrtResetDevice](../c/device_api.md#axclrtResetDevice)。
- 如果仍存在未释放的显式 Context，或该 Device 任一 Context 下仍存在未释放的显式 Stream，最终的 [axclrtResetDevice](../c/device_api.md#axclrtResetDevice)、[axclrtResetDeviceForce](../c/device_api.md#axclrtResetDeviceForce) 以及 [axclFinalize](../c/system_api.md#axclFinalize) 都会失败。
```

### 2.3. 设备同步

- [axclrtSynchronizeDevice](../c/device_api.md#axclrtSynchronizeDevice) 等待调用线程当前 Context 所属的 Device。它会同步本进程中该 Device 所有 Context 下的所有 Stream（包括其他线程使用的 Stream），并在第一个报告错误的 Stream 处停止。
- [axclrtSynchronizeDeviceWithTimeout](../c/device_api.md#axclrtSynchronizeDeviceWithTimeout) 增加了以毫秒为单位的超时时间；取负值（如 `-1`）表示无限等待。超时时间按每个 Stream 分别计算，因此总等待时间可能更长。超时不会取消已提交的工作。

<a id="CONTEXT"></a>

## 3. Context

Context 是 Device 内的执行环境和资源作用域，每个 Context 只隶属于一个 Device，并拥有一个随 Context 一同创建的默认 Stream。
Host 线程的当前 Context 决定该线程所调用 runtime API 的目标 Device 和执行作用域。

### 3.1. 默认与显式 Context

Context 分为两类：

| 类型 | 创建方式 | 销毁方式 | 说明 |
|---|---|---|---|
| 默认 Context | Device 首次激活时自动创建 | Device 最终释放时释放 | 每个已激活 Device 在进程内有一个默认 Context，ID 为 `0`，由所有对该 Device 调用 [axclrtSetDevice](../c/device_api.md#axclrtSetDevice) 的线程共享；不能通过 [axclrtDestroyContext](../c/context_api.md#axclrtDestroyContext) 销毁 |
| 显式 Context | 调用 [axclrtCreateContext](../c/context_api.md#axclrtCreateContext) 创建 | 调用 [axclrtDestroyContext](../c/context_api.md#axclrtDestroyContext) 销毁 | 适合需要独立执行作用域或多线程切换 Context 的场景 |

不需要显式 Context 的应用，可以调用 [axclrtSetDevice](../c/device_api.md#axclrtSetDevice) 激活 Device，并将当前线程绑定到该 Device 的默认 Context。

```{important}
- 默认 Context 由 runtime 管理，不能通过 [axclrtDestroyContext](../c/context_api.md#axclrtDestroyContext) 销毁。
- runtime 在所属 Device 最终释放时释放默认 Context。
- 销毁显式 Context 前，需要先销毁该 Context 下显式创建的 Stream，否则 [axclrtDestroyContext](../c/context_api.md#axclrtDestroyContext) 会失败。
```

### 3.2. Context 与线程绑定

每个 Host 线程都有独立的当前 Context 绑定关系：

- 线程调用使用 Device 资源的 API 前，必须已有当前 Context，否则这些 API 会失败；
- 同一线程同一时刻最多有一个当前 Context，该 Context 所属的 Device 即为该线程的当前 Device；
- [axclrtCreateContext](../c/context_api.md#axclrtCreateContext) 会在指定 Device 上创建显式 Context，并把当前线程绑定到新 Context；
- 如果同一线程连续创建多个 Context，当前线程默认使用最后一次创建的 Context；
- 可以通过 [axclrtSetCurrentContext](../c/context_api.md#axclrtSetCurrentContext) 将已有 Context 绑定为当前线程的当前 Context；
- [axclrtCreateContext](../c/context_api.md#axclrtCreateContext)、[axclrtSetCurrentContext](../c/context_api.md#axclrtSetCurrentContext) 与 [axclrtSetDevice](../c/device_api.md#axclrtSetDevice) 互相替换：最后一次成功调用设置的 Context 即为当前 Context，runtime 不保存之前的绑定；
- [axclrtDestroyContext](../c/context_api.md#axclrtDestroyContext) 销毁显式 Context，并解除该 Context 在各线程中的绑定。当前 Context 被销毁的线程变为未绑定状态，不会回退到之前的 Context 或默认 Context；
- Device 最终释放时销毁其默认 Context，绑定该默认 Context 的线程变为未绑定状态；
- 绑定随线程退出而释放，之后复用同一线程 ID 的新线程从未绑定状态开始。

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
Context 不按栈保存，临时切换后需要恢复时，先用 [axclrtGetCurrentContext](../c/context_api.md#axclrtGetCurrentContext) 保存原 Context，切换结束后再用 [axclrtSetCurrentContext](../c/context_api.md#axclrtSetCurrentContext) 设置回去。

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

- 同一 Stream 内的 Task 按提交顺序（FIFO）执行；
- 不同 Stream 拥有各自独立的任务队列，默认不保证不同 Stream 中任务的执行先后顺序；
- 如果需要在不同 Stream 之间建立依赖，应使用 Event 在这些 Stream 中插入 record 点和 wait 点；
- Stream 是 Context 下的逻辑队列，用于定义任务顺序和同步边界，不对应物理数据通道；
- 异步 API 成功返回表示任务已提交到 Stream，并不表示 Device 已经接受或执行完成该任务；需要通过 Stream、Event 或 Device 同步接口确认任务完成；
- 异步任务的错误（包括 Stream 任务队列已满而被 Device 拒绝的任务）不由提交调用返回，而由该 Stream 的下一次同步返回（例如 [axclrtSynchronizeStream](../c/stream_api.md#axclrtSynchronizeStream)、[axclrtSynchronizeDevice](../c/device_api.md#axclrtSynchronizeDevice) 或 [axclrtDestroyStream](../c/stream_api.md#axclrtDestroyStream)）。发生错误后，该 Stream 中尚未开始的任务都会被跳过，直到该错误被返回；Event 的记录点和等待点仍会执行。提交时即可检测到的错误（例如 [axclrtStreamWaitEvent](../c/event_api.md#axclrtStreamWaitEvent) 失败）由提交调用直接返回。

### 4.1. 默认与显式 Stream

Stream 分为两类：

| 类型 | 创建方式 | 销毁方式 | 说明 |
|---|---|---|---|
| 默认 Stream | Context 创建时自动创建 | 随所属 Context 销毁 | 每个 Context 拥有一个默认 Stream，ID 为 `0`；它由 runtime 管理，用户不能销毁 |
| 显式 Stream | 调用 [axclrtCreateStream](../c/stream_api.md#axclrtCreateStream) 创建 | 调用 [axclrtDestroyStream](../c/stream_api.md#axclrtDestroyStream) 销毁（先等待已提交任务完成），或调用 [axclrtDestroyStreamForce](../c/stream_api.md#axclrtDestroyStreamForce) 销毁（不等待） | 创建时归属于调用线程的当前 Context |

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

- [axclrtSynchronizeStream](../c/stream_api.md#axclrtSynchronizeStream) 等待调用前已提交到该 Stream 的任务完成，并返回该 Stream 上记录的第一个异步任务错误。该错误返回后即被清除。
- [axclrtSynchronizeStreamWithTimeout](../c/stream_api.md#axclrtSynchronizeStreamWithTimeout) 增加了以毫秒为单位的超时时间；取负值（如 `-1`）表示无限等待。超时不会取消已提交的任务。

[axclrtStreamQuery](../c/stream_api.md#axclrtStreamQuery) 以非阻塞方式返回该 Stream 任务状态的快照：
- `AXCL_STREAM_STATUS_COMPLETE` 表示查询时刻已提交到该 Stream 的任务全部完成；
- `AXCL_STREAM_STATUS_NOT_READY` 表示查询时刻至少还有一个任务未完成。

[axclrtStreamQuery](../c/stream_api.md#axclrtStreamQuery) 不报告异步任务错误；需同步该 Stream 才能获取这些错误。

<a id="TASK"></a>

## 5. Task

Task 是一次 API 调用提交到 Stream 的一个工作单元，比如：

- Engine 推理请求；
- NATIVE SDK 调用，如媒体处理、图像处理、DMA 等。这类调用在调用线程当前 Context 的默认 Stream 上执行；
- 内存操作，如 `memcpy`、`memset`、`memcmp`；
- Event record 点或 wait 点。

Task 是隐式创建的，没有 Task 句柄。runtime 跟踪每个 Task 从提交到完成的过程。

从用户视角看，Task 的意义主要体现在两点：

1. **顺序性**：同一 Stream 内的 Task 按提交顺序执行。
2. **完成边界**：异步 API 返回时，Task 只是已提交；需要通过 Stream、Event 或 Device 同步接口确认任务完成，并获取执行错误（如有）。

<a id="EVENT"></a>

## 6. Event

Event 是 Device 级同步对象，用于标记某个 Stream 上的执行点，用于同一 Device 内、不同 Stream 之间的任务同步。

Event 隶属于所属 Device，不隶属于 Context 或 Stream。一个任务可以等待一个 Event，多个任务也可以等待同一个 Event。

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
| [axclrtCreateEvent](../c/event_api.md#axclrtCreateEvent) | 在调用线程当前 Context 所属的 Device 上创建启用 timing 的 Event。[axclrtCreateEventWithFlags](../c/event_api.md#axclrtCreateEventWithFlags) 可选择 timing flag |
| [axclrtDestroyEvent](../c/event_api.md#axclrtDestroyEvent) | 销毁 Event。该接口不等待：已提交的 record 点和 wait 点照常完成 |

```{important}
- Event 属于创建它的 Device，只能在该 Device 上使用。在其他 Device 的 Stream 上 record 或等待该 Event 会失败。
- 一个进程在每个 Device 上最多持有 1024 个未销毁的 Event，按该 Device 的所有 Context 合计。
- 需在所属 Device 最终释放前销毁 Event。Device 释放后，其所有 Event 句柄均失效。
```

### 6.2. Record、Wait 和 Synchronize

Event 同步使用 record、wait 和 synchronize 三种操作。每个 record 点都会成为 Event 的最近一次记录；wait 和 synchronize 总是针对调用时 Event 的最近一次记录：

| 操作 | 语义 | Host 是否等待 Event 完成 |
|---|---|---|
| [axclrtRecordEvent](../c/event_api.md#axclrtRecordEvent) | 在指定 Stream 中插入 record 点。它涵盖在其之前提交到该 Stream 的任务，该 Stream 执行到该点时 Event 变为 signaled。再次 record 会替换最近一次记录 | 否，成功返回表示 record 点已提交 |
| [axclrtStreamWaitEvent](../c/event_api.md#axclrtStreamWaitEvent) | 在指定 Stream 中插入 wait 点。该 Stream 执行到该点时，会等待提交时 Event 的最近一次记录变为 signaled，之后再继续执行后续任务。如果 Event 从未被记录、其最近一次记录已经完成，或该记录位于同一 Stream，则不插入 wait 点 | 否，成功返回表示 wait 点已提交 |
| [axclrtSynchronizeEvent](../c/event_api.md#axclrtSynchronizeEvent) | Host 调用线程等待 Event 的最近一次记录变为 signaled。如果 Event 从未被记录，则立即返回 | 是 |


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
- [axclrtEventElapsedTime](../c/event_api.md#axclrtEventElapsedTime) 要求两个 Event 都启用 timing 并属于同一 Device，且各自最近一次记录都已完成；两次记录可以位于该 Device 的不同 Stream；
- [axclrtEventElapsedTime](../c/event_api.md#axclrtEventElapsedTime) 不等待。任一 Event 的最近一次记录尚未完成时，调用失败，需先同步这些 Event（如下例所示）。任一 Event 从未被记录时，调用同样失败；
- 时间戳在 Stream 执行 record 点时于 Device 侧采集，不是 Host 调用 [axclrtRecordEvent](../c/event_api.md#axclrtRecordEvent) 的时刻。结果为结束时间戳减去起始时间戳，单位为毫秒。

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
- Event record 点和 wait 点都是 Stream FIFO 中的异步任务，API 成功返回不表示 Event 已经变为 signaled；
- [axclrtSynchronizeEvent](../c/event_api.md#axclrtSynchronizeEvent) 会阻塞 Host 调用线程，直到 Event 变为 signaled；[axclrtEventQuery](../c/event_api.md#axclrtEventQuery) 以非阻塞方式查询其状态；
- 如果 Device 拒绝某个 record 点（例如 Stream 任务队列已满），该次记录仍会结束并释放其等待方。错误由执行 record 的 Stream 的下一次同步报告，而不是由等待方 Stream 报告；
- Event 的状态保存在 Device 侧，Host 侧句柄仅用于标识该 Event。
