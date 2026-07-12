# 编程模型

本文介绍 AXCL runtime 中同步接口、异步接口、Stream、Event 和 Synchronize 类接口在程序执行流程中的作用，重点说明任务提交、执行顺序和同步等待的编程语义。

阅读本文前，建议先阅读 [系统架构](system.md)、[核心概念](concept.md) 和 [内存管理](memory.md)，了解 AXCL Host-Device 系统组成、Device / Context / Stream / Task / Event 对象关系，以及 Host / Device 内存和数据搬运模型。

## 1. 概述

一个 AXCL 程序通常包含以下阶段：

```text
axclInit
  -> axclrtSetDevice
  -> 创建 Stream / Event（按需）
  -> 分配 Host / Device 内存
  -> 准备输入数据
  -> 提交数据搬运和计算任务
  -> 等待任务完成
  -> 使用输出结果
  -> 释放内存 / Stream / Event
  -> axclrtResetDevice
  -> axclFinalize
```

其中，“提交任务”和“等待任务完成”是理解 AXCL 编程模型的关键：同步接口在操作完成后返回，异步接口通常先把任务提交到 Stream，再由同步接口确认任务完成。

## 2. 同步执行：先完成再返回

同步接口返回成功时，表示该接口对应的操作已经完成。同步执行方式直观，适合入门程序、调试流程和对并发要求不高的场景。

对于数据搬运、推理执行、Event record/wait 等会向 Stream 提交工作项的接口，通常可以通过接口是否包含 `axclrtStream stream` 参数理解同步/异步语义：不带 `axclrtStream stream` 参数的接口按同步语义理解，返回成功表示对应操作已经完成；带 `axclrtStream stream` 参数的接口按异步语义理解，返回成功表示工作已经提交到指定 Stream，完成状态由后续同步接口确认。Synchronize 和 Query 等控制类接口的语义以接口说明为准。

| 示例 API | 返回语义 |
|---|---|
| [axclrtMemcpy](../c/memory_api.md#axclrtMemcpy) | 返回成功表示本次拷贝完成 |
| [axclrtEngineExecute](../c/engine_api.md#axclrtEngineExecute) | 返回成功表示本次 Engine 推理完成 |
| [axclrtSynchronizeStream](../c/stream_api.md#axclrtSynchronizeStream) | 返回成功时目标 Stream 的前序任务已经完成；失败时返回错误 |
| [axclrtSynchronizeEvent](../c/event_api.md#axclrtSynchronizeEvent) | 返回成功时 Event 已置位；超时或失败时返回错误 |
| [axclrtSynchronizeDevice](../c/device_api.md#axclrtSynchronizeDevice) | 返回成功时当前 Device 上相关任务已经完成；失败时返回错误 |

同步拷贝示例：

```c
axclrtMemcpy(devPtr, hostPtr, size, AXCL_MEMCPY_HOST_TO_DEVICE);
/* 返回成功后，本次 H2D 拷贝已经完成。 */
```

```{note}
native SDK 接口（例如 `AX_XXX_YYYY` 类接口）通过 AXCL native RPC 暴露到 Host 侧时，对 Host 侧调用表现为同步语义：Host 侧调用会等待本次 AXCL RPC 请求完成并收到结果后返回。这里的同步语义只描述 RPC 接口的调用行为，和 native SDK 接口本身在 Device 侧采用同步还是异步实现没有关联。
```

## 3. 异步执行：先提交，后等待

异步接口返回成功时，只表示任务已经提交到 Stream，不表示 Device 侧任务已经执行完成。Host 在使用异步任务产生的输出前，需要通过 Stream、Event 或 Device 同步接口确认任务完成。

```{image} ../../asserts/async_flow.svg
:alt: 同步与异步返回边界示意图
:align: center
```

如上图所示，异步执行可以从 Host 提交、Stream FIFO 排队、Device 执行和 Host 同步等待四个阶段理解：

1. Host 侧依次提交 `1 H2D 拷贝`、`2 推理` 和 `3 D2H 拷贝`。这些异步接口在任务提交到 Stream 后返回，不等待 Device 侧执行完成；
2. 同一 Stream 中的任务进入 FIFO 后保持提交顺序，Device 侧按 FIFO 顺序依次执行对应任务；
3. `4 Sync 节点` 表示 Host 侧的同步等待点。Host 在这里调用 [axclrtSynchronizeStream](../c/stream_api.md#axclrtSynchronizeStream) 等待该 Stream 中前序 `1/2/3` 任务完成；
4. 等待成功返回后，异步 D2H 的输出才可以被 Host 安全使用，Host 才继续提交或执行 `5 后续任务`。

下表列出常见异步提交接口和配套同步等待接口的 Host 返回语义：

| 示例 API | Host 返回语义 |
|---|---|
| [axclrtMemcpyAsync](../c/memory_api.md#axclrtMemcpyAsync) | 拷贝工作提交到 Stream 后返回 |
| [axclrtMemsetAsync](../c/memory_api.md#axclrtMemsetAsync) | memset 工作提交到 Stream 后返回 |
| [axclrtEngineExecuteAsync](../c/engine_api.md#axclrtEngineExecuteAsync) | Engine 推理工作提交到 Stream 后返回 |
| [axclrtRecordEvent](../c/event_api.md#axclrtRecordEvent) | 在 Stream 中插入 Event record 点后返回 |
| [axclrtStreamWaitEvent](../c/event_api.md#axclrtStreamWaitEvent) | 在 Stream 中插入等待 Event 的节点后返回，不阻塞 Host 等待 Event 置位 |
| [axclrtSynchronizeStream](../c/stream_api.md#axclrtSynchronizeStream) | 阻塞 Host 调用线程，直到目标 Stream 的前序任务完成或返回错误 |

单 Stream 异步提交流程示例：

```c
/* 1. H2D 拷贝：Host 输入提交到 Device 输入 buffer。 */
axclrtMemcpyAsync(devIn, hostIn, size, AXCL_MEMCPY_HOST_TO_DEVICE, stream);

/* 2. 推理：提交到同一 stream，依赖前序 H2D 拷贝完成。 */
axclrtEngineExecuteAsync(modelId, contextId, group, io, stream);

/* 3. D2H 拷贝：提交到同一 stream，依赖前序推理完成。 */
axclrtMemcpyAsync(hostOut, devOut, size, AXCL_MEMCPY_DEVICE_TO_HOST, stream);

/* 4. Sync 节点：等待 stream 中前序 1/2/3 任务完成。 */
axclrtSynchronizeStream(stream);

/* 5. 后续任务：返回成功后，hostOut 中的异步输出可以被 Host 使用。 */
```

## 4. Stream：异步任务的执行顺序

Stream 是 Context 下的逻辑任务队列：

- 提交到同一 Stream 的任务按提交顺序执行，任务之间严格保序；
- 提交到不同 Stream 的任务之间默认没有顺序保证；
- 不同 Stream 之间需要建立明确顺序关系时，应使用 Event 等同步机制。

```{image} ../../asserts/stream_order.svg
:alt: Stream 顺序关系示意图
:align: center
```

如上图所示，Stream 的执行顺序可以按以下几点理解：

1. `stream0` 中的任务按 `H2D 拷贝 -> 推理任务 -> D2H 拷贝` 的顺序执行；
2. `stream1` 中的任务按 `task A -> task B` 的顺序执行；
3. `stream0` 和 `stream1` 之间默认没有顺序保证，不能根据 Host 侧提交先后推断两个 Stream 上任务的实际执行先后；
4. 如果 `stream1` 的某个任务依赖 `stream0` 的结果，需要通过 Event 等同步机制显式建立依赖关系。

## 5. Event：Stream 之间和 Host 与 Stream 之间的同步点

Event 是 Device 侧的同步对象，用于在 Stream 执行序列中标记一个可被等待的同步点。它通常用于表达跨 Stream 依赖，或让 Host 等待 Stream 中某个执行点完成。根据等待方不同，Event 的典型场景如下：

- **[一个 Stream 等待另一个 Stream 的执行点](#event-one-stream-wait)**：在被依赖的 Stream 中记录 Event，在依赖方 Stream 中调用 [axclrtStreamWaitEvent](../c/event_api.md#axclrtStreamWaitEvent) 等待该 Event；
- **[多个 Stream 等待同一个执行点](#event-multi-stream-wait)**：多个 Stream 可以等待同一个 Event，Event 置位后，各等待方继续执行各自的后续任务；
- **Host 等待 Stream 中的某个执行点**：在目标 Stream 中记录 Event 后，Host 调用 [axclrtSynchronizeEvent](../c/event_api.md#axclrtSynchronizeEvent) 等待该 Event 置位；
- **测量 Device 侧执行耗时**：使用两个启用 timing 的 Event 标记待测任务的起止执行点，再调用 [axclrtEventElapsedTime](../c/event_api.md#axclrtEventElapsedTime) 计算 Device 侧执行时间差。

<a id="event-one-stream-wait"></a>

### 5.1. 一个 Stream 等待另一个 Stream 中的 Event

```{image} ../../asserts/event_one_wait.svg
:alt: 一个任务等待一个事件示意图
:align: center
```

如上图所示，一个 Stream 等待另一个 Stream 中 Event 的过程可以按以下步骤理解：

1. `stream1` 中 `task1` 执行完成后到达 `Event Record` 节点，Event 被置位；
2. `stream2` 中的 `Event Wait` 节点等待该 Event 置位；
3. 等待完成后，`stream2` 才继续执行后续 `task2`；
4. 因此，Event 在两条 Stream 之间建立了明确的执行依赖，使 `task1 -> task2` 的跨 Stream 顺序关系成立。

<a id="event-multi-stream-wait"></a>

### 5.2. 多个 Stream 等待同一个 Event

```{image} ../../asserts/event_multi_wait.svg
:alt: 多个任务等待同一个事件示意图
:align: center
```

如上图所示，多个 Stream 等待同一个 Event 的过程可以按以下步骤理解：

1. `stream1` 中 `task1` 执行完成后到达 `Event Record` 节点，Event 被置位；
2. `stream2` 和 `stream3` 中的 `Event Wait` 节点都会等待该 Event 置位；
3. 等待完成后，`stream2` 和 `stream3` 才分别继续执行后续 `task2` 和 `task3`；
4. 因此，Event 在多条 Stream 之间建立了明确的执行依赖，使 `task1 -> task2` 和 `task1 -> task3` 的跨 Stream 顺序关系成立；但 `task2` 和 `task3` 之间没有额外顺序保证。

<a id="event-api-return-semantics"></a>

### 5.3. Event 相关接口

Event 相关接口的 Host 返回语义如下：

| API | 作用 | Host 返回语义 |
|---|---|---|
| [axclrtCreateEvent](../c/event_api.md#axclrtCreateEvent) / [axclrtCreateEventWithFlags](../c/event_api.md#axclrtCreateEventWithFlags) | 创建 Event 对象 | Event 对象创建完成后返回；此时 Event 尚未记录到任何 Stream，也不表示任何任务完成 |
| [axclrtRecordEvent](../c/event_api.md#axclrtRecordEvent) | 在指定 Stream 中记录 Event | Event record 节点提交到 Stream 后返回，不表示 Event 已经置位 |
| [axclrtStreamWaitEvent](../c/event_api.md#axclrtStreamWaitEvent) | 在指定 Stream 中等待 Event | Event wait 节点提交到 Stream 后返回，不阻塞 Host 等待 Event 置位；真正的等待发生在目标 Stream 的执行序列中 |
| [axclrtSynchronizeEvent](../c/event_api.md#axclrtSynchronizeEvent) | Host 等待 Event 置位 | 阻塞 Host 调用线程，直到 Event 置位、超时或返回错误 |
| [axclrtDestroyEvent](../c/event_api.md#axclrtDestroyEvent) | 销毁 Event 对象 | Event 对象销毁完成后返回；销毁前应确认相关 Stream 不再记录或等待该 Event |

## 6. Synchronize：等待任务完成

Synchronize 类接口用于在 Host 侧等待任务或执行点完成。不同同步接口的等待粒度不同：

| 等待目标 | API | 典型场景 |
|---|---|---|
| 等待某条 Stream 的前序任务完成 | [axclrtSynchronizeStream](../c/stream_api.md#axclrtSynchronizeStream) | 单 Stream 异步流程结束后等待输出 |
| 等待某个 Event 置位 | [axclrtSynchronizeEvent](../c/event_api.md#axclrtSynchronizeEvent) | Host 等待 Stream 中某个执行点 |
| 等待 Device 上相关任务完成 | [axclrtSynchronizeDevice](../c/device_api.md#axclrtSynchronizeDevice) | 简单程序整体同步或收尾 |
| 非阻塞查看 Stream 状态 | [axclrtStreamQuery](../c/stream_api.md#axclrtStreamQuery) | 轮询 Stream 是否完成，不替代同步等待 |

选择同步方式时，可以按等待范围理解：

- 只关心某条 Stream 的前序任务时，使用 Stream 同步；
- 只关心某个执行点时，使用 Event 同步；
- 简单程序整体收尾或需要等待 Device 上相关任务完成时，使用 Device 同步；
- 只想查看当前状态且不希望阻塞 Host 时，使用 [axclrtStreamQuery](../c/stream_api.md#axclrtStreamQuery)。

```{note}
[axclrtStreamQuery](../c/stream_api.md#axclrtStreamQuery) 是非阻塞查询接口，只读取当前状态；如果返回未完成，Host 逻辑需要稍后再次查询或使用同步接口等待。
```

## 7. 典型流程

### 7.1. 同步流程

同步流程按步骤提交并等待每个关键操作完成，逻辑简单：

```text
axclInit
  -> axclrtSetDevice
  -> 分配 Host / Device 内存
  -> Host 准备输入
  -> axclrtMemcpy(H2D)
  -> axclrtEngineExecute
  -> axclrtMemcpy(D2H)
  -> Host 使用输出
  -> 释放资源
  -> axclrtResetDevice
  -> axclFinalize
```

该方式适合入门、调试和简单任务串行执行场景。

### 7.2. 单 Stream 异步流程

单 Stream 异步流程把 H2D、推理和 D2H 放入同一 Stream，利用 Stream 顺序保证依赖关系：

```text
axclrtCreateStream
  -> axclrtMemcpyAsync(H2D, stream)
  -> axclrtEngineExecuteAsync(stream)
  -> axclrtMemcpyAsync(D2H, stream)
  -> axclrtSynchronizeStream(stream)
  -> Host 使用输出
  -> axclrtDestroyStream
```

在 [axclrtSynchronizeStream](../c/stream_api.md#axclrtSynchronizeStream) 返回成功之前，Host 侧尚不能使用异步 D2H 的输出结果。

### 7.3. 多 Stream + Event 依赖流程

多 Stream 适合表达可以并行推进的任务序列。存在跨 Stream 依赖时，通过 Event 建立顺序关系：

```{image} ../../asserts/multi_stream_event.svg
:alt: 多 Stream 通过 Event 建立依赖关系示意图
:align: center
```

如上图所示，跨 Stream 依赖可以按以下步骤理解：

1. Host 向 `s0` 提交 `task A`，并调用 [axclrtRecordEvent](../c/event_api.md#axclrtRecordEvent) 在 `task A` 后记录 Event `e`；Host 向 `s1` 提交 `independent task`，并调用 [axclrtStreamWaitEvent](../c/event_api.md#axclrtStreamWaitEvent) 插入等待节点；
2. [axclrtStreamWaitEvent](../c/event_api.md#axclrtStreamWaitEvent) 只向 `s1` 插入等待节点，不阻塞 Host 等待 Event 置位，Host 可以继续向 `s1` 提交后续 `task B`；
3. Device 执行时，`s1` 执行到 `WaitEvent(e)` 后会等待 `s0` 中 `RecordEvent(e)` 置位；
4. Event `e` 置位后，`s1` 才继续执行 `task B`。因此，Event 建立的是 `task A -> task B` 的跨 Stream 顺序关系。

## 8. 相关文档

- [系统架构](system.md)：介绍 AXCL Host-Device 系统组成；
- [核心概念](concept.md)：介绍 Device、Context、Stream、Task、Event 的层级关系；
- [内存管理](memory.md)：介绍 Host / Device 内存和同步/异步拷贝；
- [Device API](../c/device_api.md)：[axclrtSetDevice](../c/device_api.md#axclrtSetDevice)、[axclrtSynchronizeDevice](../c/device_api.md#axclrtSynchronizeDevice) 等接口；
- [Stream API](../c/stream_api.md)：Stream 创建、查询和同步接口；
- [Event API](../c/event_api.md)：Event 创建、记录、等待和计时接口；
- [Memory API](../c/memory_api.md)：同步/异步内存拷贝接口。
