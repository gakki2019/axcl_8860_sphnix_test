# Programming Model

This document introduces the role of synchronous APIs, asynchronous APIs, Stream, Event, and Synchronize APIs in AXCL runtime program execution, focusing on task submission, execution ordering, and synchronization semantics.

Before reading this document, read [System Architecture](system.md), [Core Concepts](concept.md), and [Memory Management](memory.md) first to understand the AXCL Host-Device system components, the relationships among Device / Context / Stream / Task / Event objects, and the Host / Device memory and data transfer model.

## 1. Overview

An AXCL program usually contains the following stages:

```text
axclInit
  -> axclrtSetDevice
  -> Create Stream / Event (as needed)
  -> Allocate Host / Device memory
  -> Prepare input data
  -> Submit data transfer and compute tasks
  -> Wait for tasks to complete
  -> Use output results
  -> Release memory / Stream / Event
  -> axclrtResetDevice
  -> axclFinalize
```

In this flow, “submitting tasks” and “waiting for tasks to complete” are the key points for understanding the AXCL programming model: synchronous APIs return after the operation completes, while asynchronous APIs usually submit tasks to a Stream first, and completion is confirmed later through synchronization APIs.

## 2. Synchronous execution: complete before return

When a synchronous API returns success, the operation corresponding to that API has completed. Synchronous execution is straightforward and is suitable for getting started, debugging, and scenarios that do not require high concurrency.

For APIs that submit work items to a Stream, such as data transfer, inference execution, and Event record/wait APIs, synchronous/asynchronous semantics can usually be understood by checking whether the API contains the `axclrtStream stream` parameter: APIs without the `axclrtStream stream` parameter are understood as synchronous APIs, and returning success means the corresponding operation has completed; APIs with the `axclrtStream stream` parameter are understood as asynchronous APIs, and returning success means the work has been submitted to the specified Stream, with completion confirmed by subsequent synchronization APIs. For control APIs such as Synchronize and Query, follow the semantics described by the API documentation.

| Example API | Return semantics |
|---|---|
| [axclrtMemcpy](../c/memory_api.md#axclrtMemcpy) | Returning success means this copy has completed |
| [axclrtEngineExecute](../c/engine_api.md#axclrtEngineExecute) | Returning success means this Engine inference has completed |
| [axclrtSynchronizeStream](../c/stream_api.md#axclrtSynchronizeStream) | Returning success means preceding tasks in the target Stream have completed; failures return an error |
| [axclrtSynchronizeEvent](../c/event_api.md#axclrtSynchronizeEvent) | Returning success means the Event has been set; timeout or failure returns an error |
| [axclrtSynchronizeDevice](../c/device_api.md#axclrtSynchronizeDevice) | Returning success means related tasks on the current Device have completed; failures return an error |

Synchronous copy example:

```c
axclrtMemcpy(devPtr, hostPtr, size, AXCL_MEMCPY_HOST_TO_DEVICE);
/* After success is returned, this H2D copy has completed. */
```

```{note}
native SDK APIs, such as `AX_XXX_YYYY` APIs, are exposed to the Host side through AXCL native RPC. From the Host caller's perspective, they have synchronous semantics: the Host call waits for the current AXCL RPC request to complete and receive a result before returning. This synchronous semantics only describes the RPC call behavior, and is not related to whether the native SDK API itself uses a synchronous or asynchronous implementation on the Device side.
```

## 3. Asynchronous execution: submit first, wait later

When an asynchronous API returns success, it only means the task has been submitted to the Stream; it does not mean the Device-side task has completed. Before the Host uses outputs produced by asynchronous tasks, it must confirm task completion through Stream, Event, or Device synchronization APIs.

```{image} ../../asserts/async_flow.svg
:alt: Synchronous and asynchronous return boundary diagram
:align: center
```

As shown in the figure above, asynchronous execution can be understood from four stages: Host submission, Stream FIFO queuing, Device execution, and Host synchronization wait:

1. The Host submits `1 H2D copy`, `2 inference`, and `3 D2H copy` in order. These asynchronous APIs return after the tasks are submitted to the Stream, without waiting for Device-side execution to complete;
2. Tasks in the same Stream keep their submission order after entering the FIFO, and the Device executes the corresponding tasks in FIFO order;
3. `4 Sync node` represents the Host-side synchronization wait point. Here the Host calls [axclrtSynchronizeStream](../c/stream_api.md#axclrtSynchronizeStream) to wait for preceding tasks `1/2/3` in the Stream to complete;
4. After the wait returns successfully, the output of the asynchronous D2H copy can be safely used by the Host, and the Host can continue to submit or execute `5 subsequent task`.

The following table lists Host return semantics for common asynchronous submission APIs and the matching synchronization wait API:

| Example API | Host return semantics |
|---|---|
| [axclrtMemcpyAsync](../c/memory_api.md#axclrtMemcpyAsync) | Returns after the copy work is submitted to the Stream |
| [axclrtMemsetAsync](../c/memory_api.md#axclrtMemsetAsync) | Returns after the memset work is submitted to the Stream |
| [axclrtEngineExecuteAsync](../c/engine_api.md#axclrtEngineExecuteAsync) | Returns after the Engine inference work is submitted to the Stream |
| [axclrtRecordEvent](../c/event_api.md#axclrtRecordEvent) | Returns after an Event record point is inserted into the Stream |
| [axclrtStreamWaitEvent](../c/event_api.md#axclrtStreamWaitEvent) | Returns after a node that waits for the Event is inserted into the Stream; it does not block the Host waiting for the Event to be set |
| [axclrtSynchronizeStream](../c/stream_api.md#axclrtSynchronizeStream) | Blocks the Host calling thread until preceding tasks in the target Stream complete or an error is returned |

Single-Stream asynchronous submission example:

```c
/* 1. H2D copy: submit Host input to the Device input buffer. */
axclrtMemcpyAsync(devIn, hostIn, size, AXCL_MEMCPY_HOST_TO_DEVICE, stream);

/* 2. Inference: submit to the same stream; depends on preceding H2D copy completion. */
axclrtEngineExecuteAsync(modelId, contextId, group, io, stream);

/* 3. D2H copy: submit to the same stream; depends on preceding inference completion. */
axclrtMemcpyAsync(hostOut, devOut, size, AXCL_MEMCPY_DEVICE_TO_HOST, stream);

/* 4. Sync node: wait for preceding tasks 1/2/3 in the stream to complete. */
axclrtSynchronizeStream(stream);

/* 5. Subsequent task: after success is returned, asynchronous output in hostOut can be used by the Host. */
```

## 4. Stream: execution order of asynchronous tasks

A Stream is a logical task queue under a Context:

- Tasks submitted to the same Stream are executed in submission order and are strictly ordered;
- Tasks submitted to different Streams have no ordering guarantee by default;
- If an explicit ordering relationship is required between different Streams, use synchronization mechanisms such as Event.

```{image} ../../asserts/stream_order.svg
:alt: Stream ordering relationship diagram
:align: center
```

As shown in the figure above, Stream execution order can be understood as follows:

1. Tasks in `stream0` are executed in the order `H2D copy -> inference task -> D2H copy`;
2. Tasks in `stream1` are executed in the order `task A -> task B`;
3. There is no ordering guarantee between `stream0` and `stream1` by default. Do not infer the actual execution order of tasks on two Streams from the Host-side submission order;
4. If a task in `stream1` depends on the result from `stream0`, use synchronization mechanisms such as Event to explicitly establish the dependency.

## 5. Event: synchronization points between Streams and between Host and Stream

Event is a Device-side synchronization object used to mark a waitable synchronization point in a Stream execution sequence. It is usually used to express cross-Stream dependencies, or to let the Host wait for an execution point in a Stream to complete. Depending on the waiting side, typical Event scenarios are as follows:

- **[One Stream waits for an execution point in another Stream](#event-one-stream-wait)**: record an Event in the depended-on Stream, and call [axclrtStreamWaitEvent](../c/event_api.md#axclrtStreamWaitEvent) in the dependent Stream to wait for that Event;
- **[Multiple Streams wait for the same execution point](#event-multi-stream-wait)**: multiple Streams can wait for the same Event. After the Event is set, each waiting Stream continues executing its own subsequent tasks;
- **Host waits for an execution point in a Stream**: after recording an Event in the target Stream, the Host calls [axclrtSynchronizeEvent](../c/event_api.md#axclrtSynchronizeEvent) to wait for that Event to be set;
- **Measure Device-side execution time**: use two timing-enabled Events to mark the start and end execution points of the target task, then call [axclrtEventElapsedTime](../c/event_api.md#axclrtEventElapsedTime) to calculate the Device-side execution time difference.

<a id="event-one-stream-wait"></a>

### 5.1. One Stream waits for an Event in another Stream

```{image} ../../asserts/event_one_wait.svg
:alt: One task waits for one event diagram
:align: center
```

As shown in the figure above, the process where one Stream waits for an Event in another Stream can be understood as follows:

1. After `task1` in `stream1` completes, execution reaches the `Event Record` node and the Event is set;
2. The `Event Wait` node in `stream2` waits for that Event to be set;
3. After the wait completes, `stream2` continues to execute the following `task2`;
4. Therefore, Event establishes an explicit execution dependency between the two Streams, making the cross-Stream ordering relationship `task1 -> task2` valid.

<a id="event-multi-stream-wait"></a>

### 5.2. Multiple Streams wait for the same Event

```{image} ../../asserts/event_multi_wait.svg
:alt: Multiple tasks wait for the same event diagram
:align: center
```

As shown in the figure above, the process where multiple Streams wait for the same Event can be understood as follows:

1. After `task1` in `stream1` completes, execution reaches the `Event Record` node and the Event is set;
2. The `Event Wait` nodes in `stream2` and `stream3` both wait for that Event to be set;
3. After the wait completes, `stream2` and `stream3` continue to execute the following `task2` and `task3`, respectively;
4. Therefore, Event establishes explicit execution dependencies among multiple Streams, making the cross-Stream ordering relationships `task1 -> task2` and `task1 -> task3` valid; however, there is no additional ordering guarantee between `task2` and `task3`.

<a id="event-api-return-semantics"></a>

### 5.3. Event-related APIs

The Host return semantics of Event-related APIs are as follows:

| API | Purpose | Host return semantics |
|---|---|---|
| [axclrtCreateEvent](../c/event_api.md#axclrtCreateEvent) / [axclrtCreateEventWithFlags](../c/event_api.md#axclrtCreateEventWithFlags) | Create an Event object | Returns after the Event object is created. At this time, the Event has not been recorded into any Stream and does not indicate that any task has completed |
| [axclrtRecordEvent](../c/event_api.md#axclrtRecordEvent) | Record an Event in the specified Stream | Returns after the Event record node is submitted to the Stream; it does not indicate that the Event has been set |
| [axclrtStreamWaitEvent](../c/event_api.md#axclrtStreamWaitEvent) | Wait for an Event in the specified Stream | Returns after the Event wait node is submitted to the Stream, and does not block the Host waiting for the Event to be set; the actual wait happens in the execution sequence of the target Stream |
| [axclrtSynchronizeEvent](../c/event_api.md#axclrtSynchronizeEvent) | Host waits for an Event to be set | Blocks the Host calling thread until the Event is set, timeout occurs, or an error is returned |
| [axclrtDestroyEvent](../c/event_api.md#axclrtDestroyEvent) | Destroy an Event object | Returns after the Event object is destroyed. Before destroying it, confirm that related Streams no longer record or wait for this Event |

## 6. Synchronize: wait for tasks to complete

Synchronize APIs are used on the Host side to wait for tasks or execution points to complete. Different synchronization APIs have different waiting granularities:

| Wait target | API | Typical scenario |
|---|---|---|
| Wait for preceding tasks in a Stream to complete | [axclrtSynchronizeStream](../c/stream_api.md#axclrtSynchronizeStream) | Wait for output after a Single-Stream asynchronous flow |
| Wait for an Event to be set | [axclrtSynchronizeEvent](../c/event_api.md#axclrtSynchronizeEvent) | Host waits for an execution point in a Stream |
| Wait for related tasks on the Device to complete | [axclrtSynchronizeDevice](../c/device_api.md#axclrtSynchronizeDevice) | Overall synchronization or shutdown in simple programs |
| Non-blocking query of Stream status | [axclrtStreamQuery](../c/stream_api.md#axclrtStreamQuery) | Poll whether a Stream has completed; it does not replace synchronization wait |

When choosing a synchronization method, consider the wait scope:

- Use Stream synchronization when only preceding tasks in one Stream matter;
- Use Event synchronization when only one execution point matters;
- Use Device synchronization for overall shutdown in simple programs or when related tasks on the Device need to be completed;
- Use [axclrtStreamQuery](../c/stream_api.md#axclrtStreamQuery) when only checking the current status and Host blocking is not desired.

```{note}
[axclrtStreamQuery](../c/stream_api.md#axclrtStreamQuery) is a non-blocking query API that only reads the current status. If it returns not completed, Host logic needs to query again later or use a synchronization API to wait.
```

## 7. Typical flows

### 7.1. Synchronous flow

A synchronous flow submits each key operation step by step and waits for it to complete. The logic is simple:

```text
axclInit
  -> axclrtSetDevice
  -> Allocate Host / Device memory
  -> Host prepares input
  -> axclrtMemcpy(H2D)
  -> axclrtEngineExecute
  -> axclrtMemcpy(D2H)
  -> Host uses output
  -> Release resources
  -> axclrtResetDevice
  -> axclFinalize
```

This approach is suitable for getting started, debugging, and simple serial task execution.

### 7.2. Single-Stream asynchronous flow

A Single-Stream asynchronous flow puts H2D, inference, and D2H into the same Stream, using Stream ordering to guarantee dependencies:

```text
axclrtCreateStream
  -> axclrtMemcpyAsync(H2D, stream)
  -> axclrtEngineExecuteAsync(stream)
  -> axclrtMemcpyAsync(D2H, stream)
  -> axclrtSynchronizeStream(stream)
  -> Host uses output
  -> axclrtDestroyStream
```

Before [axclrtSynchronizeStream](../c/stream_api.md#axclrtSynchronizeStream) returns success, the Host cannot use the asynchronous D2H output result.

### 7.3. Multi-Stream + Event dependency flow

Multiple Streams are suitable for expressing task sequences that can make progress in parallel. When there are cross-Stream dependencies, use Event to establish ordering relationships:

```{image} ../../asserts/multi_stream_event.svg
:alt: Multi-Stream dependency relationship through Event diagram
:align: center
```

As shown in the figure above, cross-Stream dependencies can be understood as follows:

1. The Host submits `task A` to `s0`, and calls [axclrtRecordEvent](../c/event_api.md#axclrtRecordEvent) to record Event `e` after `task A`; the Host submits `independent task` to `s1`, and calls [axclrtStreamWaitEvent](../c/event_api.md#axclrtStreamWaitEvent) to insert a wait node;
2. [axclrtStreamWaitEvent](../c/event_api.md#axclrtStreamWaitEvent) only inserts a wait node into `s1`; it does not block the Host waiting for the Event to be set, so the Host can continue submitting the following `task B` to `s1`;
3. During Device execution, when `s1` reaches `WaitEvent(e)`, it waits for `RecordEvent(e)` in `s0` to be set;
4. After Event `e` is set, `s1` continues to execute `task B`. Therefore, Event establishes the cross-Stream ordering relationship `task A -> task B`.

## 8. Related documents

- [System Architecture](system.md): introduces AXCL Host-Device system components;
- [Core Concepts](concept.md): introduces the hierarchy of Device, Context, Stream, Task, and Event;
- [Memory Management](memory.md): introduces Host / Device memory and synchronous/asynchronous copy;
- [Device API](../c/device_api.md): [axclrtSetDevice](../c/device_api.md#axclrtSetDevice), [axclrtSynchronizeDevice](../c/device_api.md#axclrtSynchronizeDevice), and related APIs;
- [Stream API](../c/stream_api.md): Stream creation, query, and synchronization APIs;
- [Event API](../c/event_api.md): Event creation, record, wait, and timing APIs;
- [Memory API](../c/memory_api.md): synchronous/asynchronous memory copy APIs.
