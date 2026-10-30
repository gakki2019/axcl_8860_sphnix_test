# Core Concepts

AXCL runtime uses **Device, Context, Stream, Task, and Event** to organize the execution relationship between Host-side applications and AXERA AI devices. Understanding object ownership, lifecycle, and synchronization boundaries is the foundation for using AXCL runtime APIs correctly.

```{image} ../../asserts/concept.png
:alt: AXCL core concepts
:align: center
```

- **Device** represents an AXERA AI compute device visible to the current process.
- **Context** is an execution environment and resource scope within a Device.
- **Stream** is a logical FIFO task stream under a Context.
- **Task** is a work unit submitted to a Stream for queued execution.
- **Event** is a Device-level synchronization object used to establish ordering dependencies between Streams on the same Device, or to let the Host wait for an execution point to complete.

## 1. Hierarchy

| Object | Direct user handle | Ownership | Main purpose | Typical APIs |
|---|---|---|---|---|
| Device | Selected by `deviceId` | Process-visible device | Device activation, resource root, connection to the Device | [axclrtSetDevice](../c/device_api.md#axclrtSetDevice), [axclrtResetDevice](../c/device_api.md#axclrtResetDevice) |
| Context | Yes, [axclrtContext](../c/reference/struct.md#axclrtContext) | Belongs to Device | Execution environment of the current thread; owns Streams and scopes memory, inference, and other runtime resources | [axclrtCreateContext](../c/context_api.md#axclrtCreateContext), [axclrtDestroyContext](../c/context_api.md#axclrtDestroyContext) |
| Stream | Yes, [axclrtStream](../c/reference/struct.md#axclrtStream) | Belongs to Context | FIFO task queue; orders asynchronous tasks and separates independent work | [axclrtCreateStream](../c/stream_api.md#axclrtCreateStream), [axclrtSynchronizeStream](../c/stream_api.md#axclrtSynchronizeStream) |
| Task | No, created implicitly | Belongs to Stream | Unit of work that an API call submits to a Stream | Created by the APIs that submit work |
| Event | Yes, [axclrtEvent](../c/reference/struct.md#axclrtEvent) | Belongs to Device | Stream synchronization, Host waiting, elapsed-time measurement | [axclrtCreateEvent](../c/event_api.md#axclrtCreateEvent), [axclrtRecordEvent](../c/event_api.md#axclrtRecordEvent), [axclrtStreamWaitEvent](../c/event_api.md#axclrtStreamWaitEvent) |

<a id="DEVICE"></a>

## 2. Device

A Device is an AXERA AI compute device managed by AXCL runtime. A Host process can see one or more Devices and selects the target device by logical `deviceId`.

The first activation of a Device in a process, by [axclrtSetDevice](../c/device_api.md#axclrtSetDevice) or [axclrtCreateContext](../c/context_api.md#axclrtCreateContext), connects the process to the Device and creates its default execution resources:

1. The Device-side daemon starts a worker process that serves this Host process.
2. Runtime opens the communication channel between the Host process and that worker.
3. Runtime creates the **default Context**.
4. Runtime creates the **default Stream** under the default Context.
5. Runtime starts monitoring the Device. If the Device or its worker becomes unavailable, runtime marks the Device offline, fails unfinished tasks, and notifies the callback registered by [axclrtRegDeviceStateCallback](../c/device_api.md#axclrtRegDeviceStateCallback).

```c
axclInit(NULL);

uint32_t count = 0;
axclrtGetDeviceCount(&count);
/* Assume the current process can see 4 logical Devices: count is 4, and deviceId ranges from 0 to 3. */

/* Activate logical Device 0 and bind the main thread to the default Context of Device 0. */
axclrtSetDevice(0);

...

/* Activate logical Device 1 and bind the main thread to the default Context of Device 1 instead. */
axclrtSetDevice(1);

...

/* Deactivate logical Device 0. */
axclrtResetDevice(0);

/* Deactivate logical Device 1. */
axclrtResetDevice(1);

axclFinalize();
```

### 2.1. Device ID

All AXCL APIs take logical device IDs, which the API reference also calls virtual device IDs. Runtime maps each logical device ID to a physical device ID:

- **Physical device ID** identifies a device detected by the driver. [axclrtGetDeviceInfo](../c/device_api.md#axclrtGetDeviceInfo) with `AXCL_DEVICE_ATTR_PHYSICAL_DEVICE_ID` returns the physical ID of a logical device.
- **Logical device ID** is the contiguous ID that AXCL exposes to the current process, in the range `0` to `device count - 1`.
- Use [axclrtGetDeviceCount](../c/device_api.md#axclrtGetDeviceCount) to query the number of logical devices visible to the current process.

<a id="AXCL_VISIBLE_DEVICES"></a>

#### 2.1.1. AXCL_VISIBLE_DEVICES

The `AXCL_VISIBLE_DEVICES` environment variable selects the physical devices visible to the current process and defines how logical device IDs map to them. It is read once per process, no later than [axclInit](../c/system_api.md#axclInit), so set it before the process starts or before that call. For example:

```bash
# Let the current process see only physical devices 3 and 1
export AXCL_VISIBLE_DEVICES=3,1
./app
```

`AXCL_VISIBLE_DEVICES` is parsed as follows:

- If `AXCL_VISIBLE_DEVICES` is not set, all detected physical devices are visible, numbered in detection order.
- If it is set to a comma-separated list of physical device IDs, logical IDs are assigned in list order.
- If it is set to an empty string, no device is visible.
- Invalid and duplicate entries are skipped. Parsing stops at the first ID that does not match a detected physical device, so the entries after it are ignored.

Assume the system has 4 physical devices with physical device IDs `0`, `1`, `2`, and `3`. After setting `AXCL_VISIBLE_DEVICES=3,1`, the current process sees only two logical devices:

```{image} ../../asserts/visible_devices_3_1.svg
:alt: AXCL_VISIBLE_DEVICES=3,1 logical device mapping
:align: center
```

### 2.2. Lifecycle

Device activation is managed by reference counting:

- The first activation of a Device in the process connects to the Device and creates the default Context and default Stream.
- Each later [axclrtSetDevice](../c/device_api.md#axclrtSetDevice) call on the same Device increases its reference count and binds the calling thread to the Device's default Context.
- [axclrtCreateContext](../c/context_api.md#axclrtCreateContext) also takes an activation reference on the specified Device; [axclrtDestroyContext](../c/context_api.md#axclrtDestroyContext) releases it.
- Pair every successful [axclrtSetDevice](../c/device_api.md#axclrtSetDevice) with one [axclrtResetDevice](../c/device_api.md#axclrtResetDevice).
- The reference count is per process, not per thread. Only the release that drops it to 0 waits for the default Stream to finish, then releases the default Context, the default Stream, and the connection to the Device.
- [axclrtResetDeviceForce](../c/device_api.md#axclrtResetDeviceForce) releases the Device whatever its reference count. It still waits for the default Stream, and fails if explicit Contexts or Streams remain.

Device and its child objects have lifecycle dependencies:

- An explicit Stream depends on its owning Context.
- An explicit Context depends on its owning Device.
- The default Context and default Stream are created automatically when the Device is first activated, and are released when the Device is finally deactivated.
- Release explicitly created Contexts and Streams before the Device is finally released; otherwise the release fails.

```{important}
- Before the final release of a Device, release explicitly created Streams and Contexts in this order: [axclrtDestroyStream](../c/stream_api.md#axclrtDestroyStream) → [axclrtDestroyContext](../c/context_api.md#axclrtDestroyContext) → [axclrtResetDevice](../c/device_api.md#axclrtResetDevice).
- If an explicitly created Context, or an explicitly created Stream in any Context of the Device, is still alive, the final [axclrtResetDevice](../c/device_api.md#axclrtResetDevice), [axclrtResetDeviceForce](../c/device_api.md#axclrtResetDeviceForce), and [axclFinalize](../c/system_api.md#axclFinalize) fail.
```

### 2.3. Device Synchronization

- [axclrtSynchronizeDevice](../c/device_api.md#axclrtSynchronizeDevice) waits for the Device that owns the calling thread's current Context. It synchronizes every Stream in every Context of that Device in the process, including Streams used by other threads, and stops at the first Stream that reports an error.
- [axclrtSynchronizeDeviceWithTimeout](../c/device_api.md#axclrtSynchronizeDeviceWithTimeout) adds a timeout in milliseconds; a negative value such as `-1` waits indefinitely. The timeout applies to each Stream, so the total wait can be longer. A timeout does not cancel submitted work.

<a id="CONTEXT"></a>

## 3. Context

A Context is an execution environment and resource scope within a Device. Each Context belongs to exactly one Device and owns one default Stream, created with the Context.
The current Context of a Host thread determines the target Device and execution scope of the runtime APIs that the thread calls.

### 3.1. Default and Explicit Context

There are two types of Context:

| Type | Creation | Destruction | Description |
|---|---|---|---|
| Default Context | Created automatically on the first activation of the Device | Released on the final release of the Device | Each active Device has one default Context in the process, with ID `0`, shared by every thread that calls [axclrtSetDevice](../c/device_api.md#axclrtSetDevice) for that Device; it cannot be destroyed by [axclrtDestroyContext](../c/context_api.md#axclrtDestroyContext) |
| Explicit Context | Created by [axclrtCreateContext](../c/context_api.md#axclrtCreateContext) | Destroyed by [axclrtDestroyContext](../c/context_api.md#axclrtDestroyContext) | Suitable for independent execution scopes or multi-thread Context switching |

An application that does not need explicit Contexts can call [axclrtSetDevice](../c/device_api.md#axclrtSetDevice) to activate a Device and bind the current thread to the Device's default Context.

```{important}
- The default Context is managed by runtime and cannot be destroyed with [axclrtDestroyContext](../c/context_api.md#axclrtDestroyContext).
- Runtime releases the default Context on the final release of its Device.
- Destroy the explicitly created Streams of an explicit Context before destroying the Context; otherwise [axclrtDestroyContext](../c/context_api.md#axclrtDestroyContext) fails.
```

### 3.2. Context and Thread Binding

Each Host thread has its own current Context binding:

- A thread must have a current Context before it calls APIs that use Device resources; otherwise those APIs fail.
- At most one Context is current in a thread at any time. Its owning Device is the thread's current Device.
- [axclrtCreateContext](../c/context_api.md#axclrtCreateContext) creates an explicit Context on the specified Device and binds the current thread to the new Context.
- If the same thread creates multiple Contexts consecutively, the thread uses the most recently created Context by default.
- [axclrtSetCurrentContext](../c/context_api.md#axclrtSetCurrentContext) can bind an existing Context as the current Context of the current thread.
- [axclrtCreateContext](../c/context_api.md#axclrtCreateContext), [axclrtSetCurrentContext](../c/context_api.md#axclrtSetCurrentContext), and [axclrtSetDevice](../c/device_api.md#axclrtSetDevice) replace each other: the Context set by the most recent successful call is current, and the runtime does not keep earlier bindings.
- [axclrtDestroyContext](../c/context_api.md#axclrtDestroyContext) destroys an explicit Context and removes it from the bindings of all threads. A thread whose current Context is destroyed becomes unbound; it does not fall back to an earlier Context or the default Context.
- The final release of a Device destroys its default Context, and threads bound to it become unbound.
- Bindings are released when the thread exits, so a new thread that reuses the thread ID starts unbound.

```c
void worker_thread(void) {
    axclrtContext ctx;

    /* Create an explicit Context on Device 0 in the worker thread, and bind it as this thread's current Context. */
    axclrtCreateContext(&ctx, 0);

    /* Subsequent APIs based on the current Context in the worker thread use ctx as the execution environment. */
    ...

    /* Destroy the explicitly created Context before the worker thread exits. */
    axclrtDestroyContext(ctx);
}

int main(void) {
    axclInit(NULL);

    /* Activate Device 0 in the main thread and bind it to the default Context of Device 0. */
    axclrtSetDevice(0);

    /* Start the worker thread; it creates an explicit Context on the same Device 0. */
    start_worker_thread(worker_thread);
    join_worker_thread();

    /* After the worker thread releases the explicit Context, the main thread deactivates Device 0. */
    axclrtResetDevice(0);

    axclFinalize();
    return 0;
}
```

### 3.3. Context Switching

The same thread can hold multiple explicit Contexts, but only one Context is current at a time.
When multiple Contexts are created, the current thread is bound to the most recently created Context by default.
To switch the execution environment, call [axclrtSetCurrentContext](../c/context_api.md#axclrtSetCurrentContext) to bind a specified Context as the current Context of the current thread.
Contexts are not stacked. To restore the previous Context after a temporary switch, save it with [axclrtGetCurrentContext](../c/context_api.md#axclrtGetCurrentContext) and set it again with [axclrtSetCurrentContext](../c/context_api.md#axclrtSetCurrentContext) afterwards.

The following example creates two explicit Contexts on the same Device and switches between them:

```c
int main(void) {
    axclrtContext ctx0;
    axclrtContext ctx1;

    axclInit(NULL);

    /* Activate Device 0 in the main thread and bind it to the default Context of Device 0. */
    axclrtSetDevice(0);

    /* Create the first explicit Context. After creation succeeds, ctx0 becomes the main thread's current Context. */
    axclrtCreateContext(&ctx0, 0);

    /* Create the second explicit Context. After creation succeeds, ctx1 becomes the main thread's current Context. */
    axclrtCreateContext(&ctx1, 0);

    /* Switch the main thread's current Context back to ctx0. */
    axclrtSetCurrentContext(ctx0);

    /* Subsequent runtime APIs based on the current Context use ctx0 as the execution environment. */
    ...

    /* Switch the main thread's current Context to ctx1 again. */
    axclrtSetCurrentContext(ctx1);

    /* Subsequent runtime APIs based on the current Context use ctx1 as the execution environment. */
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

A Stream is a logical task stream under a Context. It is used to organize task ordering and is a core object in the AXCL asynchronous execution model.

Key Stream semantics:

- Tasks in the same Stream execute in submission order (FIFO).
- Different Streams have independent task queues. By default, the execution order of tasks in different Streams is not guaranteed.
- To create a dependency between Streams, use Event to insert record and wait points into the Streams.
- A Stream is a logical queue under a Context that defines task ordering and synchronization boundaries. It does not correspond to a physical data channel.
- A successful return from an asynchronous API means the task was submitted to the Stream, not that the Device accepted or completed it. Confirm completion with Stream, Event, or Device synchronization APIs.
- Errors of asynchronous tasks, including a task the Device rejects because the Stream task queue is full, are returned by the next synchronization of the Stream (for example [axclrtSynchronizeStream](../c/stream_api.md#axclrtSynchronizeStream), [axclrtSynchronizeDevice](../c/device_api.md#axclrtSynchronizeDevice), or [axclrtDestroyStream](../c/stream_api.md#axclrtDestroyStream)), not by the submitting call. After an error, tasks in the Stream that have not started are skipped until the error is returned; Event record and wait points still run. Errors detected while submitting, such as a failed [axclrtStreamWaitEvent](../c/event_api.md#axclrtStreamWaitEvent), are returned by the submitting call.

### 4.1. Default and Explicit Stream

There are two types of Stream:

| Type | Creation | Destruction | Description |
|---|---|---|---|
| Default Stream | Created automatically when the Context is created | Released with its owning Context | Each Context owns one default Stream with ID `0`; it is managed by runtime and cannot be destroyed by users |
| Explicit Stream | Created by [axclrtCreateStream](../c/stream_api.md#axclrtCreateStream) | Destroyed by [axclrtDestroyStream](../c/stream_api.md#axclrtDestroyStream), which waits for submitted tasks first, or by [axclrtDestroyStreamForce](../c/stream_api.md#axclrtDestroyStreamForce), which does not wait | Belongs to the current Context of the calling thread at creation time |

```c
axclInit(NULL);

axclrtStream stream;

axclrtSetDevice(0);

/* Create an explicit Stream under the current default Context. */
axclrtCreateStream(&stream);

/* The following asynchronous tasks are submitted to the same stream and execute in FIFO order within that stream. */
axclrtEngineExecuteAsync(..., stream);
axclrtMemcpyAsync(..., stream);

/* Wait for submitted tasks in stream to complete, and then destroy the explicit Stream. */
axclrtSynchronizeStream(stream);
axclrtDestroyStream(stream);

axclrtResetDevice(0);
axclFinalize();
```

### 4.2. Stream Synchronization and Query

- [axclrtSynchronizeStream](../c/stream_api.md#axclrtSynchronizeStream) waits for the tasks submitted to the Stream before the call to complete, and returns the first asynchronous task error recorded on the Stream. The error is cleared once returned.
- [axclrtSynchronizeStreamWithTimeout](../c/stream_api.md#axclrtSynchronizeStreamWithTimeout) adds a timeout in milliseconds; a negative value such as `-1` waits indefinitely. A timeout does not cancel submitted tasks.

[axclrtStreamQuery](../c/stream_api.md#axclrtStreamQuery) returns a snapshot of the Stream's task status without blocking:

- `AXCL_STREAM_STATUS_COMPLETE` means all tasks submitted to the Stream had completed at query time.
- `AXCL_STREAM_STATUS_NOT_READY` means at least one task had not completed at query time.

[axclrtStreamQuery](../c/stream_api.md#axclrtStreamQuery) does not report asynchronous task errors; synchronize the Stream to get them.

<a id="TASK"></a>

## 5. Task

A Task is one unit of work that an API call submits to a Stream, for example:

- An Engine inference request.
- A NATIVE SDK call, such as media processing, image processing, or DMA. These calls run on the default Stream of the calling thread's current Context.
- A memory operation, such as `memcpy`, `memset`, or `memcmp`.
- An Event record point or wait point.

Tasks are created implicitly; there is no Task handle. Runtime tracks each Task from submission to completion.

From the user point of view, Task mainly matters in two ways:

1. **Ordering**: tasks in the same Stream execute in submission order.
2. **Completion boundary**: when an asynchronous API returns, the Task has only been submitted; confirm completion, and get any execution error, through Stream, Event, or Device synchronization APIs.

<a id="EVENT"></a>

## 6. Event

An Event is a Device-level synchronization object used to mark an execution point on a Stream and to synchronize tasks between different Streams on the same Device.

An Event belongs to its Device, not to a Context or Stream. One task can wait for one Event, and multiple tasks can wait for the same Event.

The relationship where one task waits for one event is shown below:

```{image} ../../asserts/event_one_wait.svg
:alt: One task waits for one Event
:align: center
```

The relationship where multiple tasks wait for the same event is shown below:

```{image} ../../asserts/event_multi_wait.svg
:alt: Multiple tasks wait for the same Event
:align: center
```

### 6.1. Creation and Destruction

| Operation | Description |
|---|---|
| [axclrtCreateEvent](../c/event_api.md#axclrtCreateEvent) | Create a timing-enabled Event on the Device of the calling thread's current Context. [axclrtCreateEventWithFlags](../c/event_api.md#axclrtCreateEventWithFlags) selects the timing flag |
| [axclrtDestroyEvent](../c/event_api.md#axclrtDestroyEvent) | Destroy an Event. It does not wait: record and wait points already submitted complete as usual |

```{important}
- An Event belongs to the Device on which it is created and can be used only on that Device. Recording or waiting for it on a Stream of another Device fails.
- A process can hold at most 1024 undestroyed Events per Device, counted across all Contexts of that Device.
- Destroy Events before the final release of their Device. After the Device is released, all its Event handles are invalid.
```

### 6.2. Record, Wait, and Synchronize

Event synchronization uses three operations: record, wait, and synchronize. Each record point becomes the Event's latest record; wait and synchronize always refer to the latest record at the time they are called:

| Operation | Semantics | Does Host wait for Event completion? |
|---|---|---|
| [axclrtRecordEvent](../c/event_api.md#axclrtRecordEvent) | Insert a record point into the specified Stream. It captures the tasks submitted to the Stream before it, and the Event becomes signaled when the Stream reaches it. Recording again replaces the latest record | No. A successful return means the record point was submitted |
| [axclrtStreamWaitEvent](../c/event_api.md#axclrtStreamWaitEvent) | Insert a wait point into the specified Stream. When the Stream reaches it, the Stream waits until the Event's latest record at submission time is signaled, then continues with subsequent tasks. No wait point is inserted if the Event has never been recorded, its latest record has already completed, or that record is on the same Stream | No. A successful return means the wait point was submitted |
| [axclrtSynchronizeEvent](../c/event_api.md#axclrtSynchronizeEvent) | The calling Host thread waits until the Event's latest record is signaled. It returns immediately if the Event has never been recorded | Yes |

The following example shows synchronization control where `stream2` waits for model inference in `stream1` to complete before performing memory copy:

```c
axclInit(NULL);

axclrtStream stream1;
axclrtStream stream2;
axclrtEvent event;

axclrtSetDevice(0);

axclrtCreateStream(&stream1);
axclrtCreateStream(&stream2);

/* Create an Event. */
axclrtCreateEvent(&event);

axclrtEngineExecuteAsync(..., stream1);

/* Record an execution point in stream1. */
axclrtRecordEvent(event, stream1);

/* stream2 waits for the execution point in stream1 to complete. */
axclrtStreamWaitEvent(stream2, event);

/* stream2 executes axclrtMemcpyAsync only after axclrtEngineExecuteAsync in stream1 completes. */
axclrtMemcpyAsync(..., stream2);

/* Wait for tasks in stream2, including Event Wait, to complete. */
axclrtSynchronizeStream(stream2);

axclrtDestroyEvent(event);
axclrtDestroyStream(stream2);
axclrtDestroyStream(stream1);
axclrtResetDevice(0);

axclFinalize();
```

### 6.3. Elapsed-time Measurement

Event can be used to measure the time difference between two execution points:

- Events created by [axclrtCreateEvent](../c/event_api.md#axclrtCreateEvent), or by [axclrtCreateEventWithFlags](../c/event_api.md#axclrtCreateEventWithFlags) with [AXCL_EVENT_DEFAULT](../c/reference/macro.md#AXCL_EVENT_DEFAULT), support timing by default.
- Events created with [AXCL_EVENT_DISABLE_TIMING](../c/reference/macro.md#AXCL_EVENT_DISABLE_TIMING) do not collect timestamps and cannot be used with [axclrtEventElapsedTime](../c/event_api.md#axclrtEventElapsedTime).
- [axclrtEventElapsedTime](../c/event_api.md#axclrtEventElapsedTime) requires both Events to have timing enabled and to belong to the same Device. Their latest records must have completed; they may be on different Streams of that Device.
- [axclrtEventElapsedTime](../c/event_api.md#axclrtEventElapsedTime) does not wait. If either latest record has not completed, it fails; synchronize the Events first, as in the example below. It also fails if either Event has never been recorded.
- The timestamp is taken on the Device when the Stream executes the record point, not when the Host calls [axclrtRecordEvent](../c/event_api.md#axclrtRecordEvent). The result is the end timestamp minus the start timestamp, in milliseconds.

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

### 6.4. Ownership and Restrictions

- Event is a Device-level object and does not belong to a Context or Stream.
- Streams in different Contexts on the same Device can establish synchronization through Event.
- Different Devices cannot establish synchronization through Event.
- Event record and wait points are asynchronous tasks in the Stream FIFO. A successful API return does not mean the Event has been signaled.
- [axclrtSynchronizeEvent](../c/event_api.md#axclrtSynchronizeEvent) blocks the calling Host thread until the Event is signaled; [axclrtEventQuery](../c/event_api.md#axclrtEventQuery) checks the status without blocking.
- If the Device rejects a record point, for example because the Stream task queue is full, the record still ends and releases its waiters. The error is reported by the next synchronization of the recording Stream, not by the waiting Stream.
- Event state is kept on the Device. The Host-side handle only identifies the Event.
