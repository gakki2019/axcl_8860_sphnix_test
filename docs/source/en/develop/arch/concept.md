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
| Device | Selected by `deviceId` | Process-visible device | Device activation, resource root, cross-end connection entry | [axclrtSetDevice](../c/device_api.md#axclrtSetDevice), [axclrtResetDevice](../c/device_api.md#axclrtResetDevice) |
| Context | Yes, [axclrtContext](../c/reference/struct.md#axclrtContext) | Belongs to Device | Current thread execution environment; carries Stream, memory, inference, and other runtime resources | [axclrtCreateContext](../c/context_api.md#axclrtCreateContext), [axclrtDestroyContext](../c/context_api.md#axclrtDestroyContext) |
| Stream | Yes, [axclrtStream](../c/reference/struct.md#axclrtStream) | Belongs to Context | FIFO task queue; organizes asynchronous task ordering and concurrency | [axclrtCreateStream](../c/stream_api.md#axclrtCreateStream), [axclrtSynchronizeStream](../c/stream_api.md#axclrtSynchronizeStream) |
| Task | No, internal object | Belongs to Stream | Minimum work unit tracked and scheduled by runtime internally | Managed by runtime internally |
| Event | Yes, [axclrtEvent](../c/reference/struct.md#axclrtEvent) | Belongs to Device | Stream synchronization, Host waiting, elapsed-time measurement | [axclrtCreateEvent](../c/event_api.md#axclrtCreateEvent), [axclrtRecordEvent](../c/event_api.md#axclrtRecordEvent), [axclrtStreamWaitEvent](../c/event_api.md#axclrtStreamWaitEvent) |

<a id="DEVICE"></a>

## 2. Device

A Device is an AXERA AI compute device managed by AXCL runtime. A Host process can see one or more Devices and selects the target device by logical `deviceId`.

After a Device is activated, runtime establishes the runtime connection between Host and Device, and creates default execution resources for the Device:

1. Start the data channel for the Device.
2. The Device-side daemon starts the corresponding worker process.
3. Create the **default Context**.
4. Create the **default Stream** under the default Context.
5. Register the response, callback, and exception receive logic required by runtime internally.

```c
axclInit(NULL);

uint32_t count = 0;
axclrtGetDeviceCount(&count);
/* Assume the current process can see 4 logical Devices: count is 4, and deviceId ranges from 0 to 3. */

/* Activate logical Device 0 and bind the main thread to the default Context of Device 0. */
axclrtSetDevice(0);

...

/* Activate logical Device 1 and switch the main thread to the default Context of Device 1. */
axclrtSetDevice(1);

...

/* Deactivate logical Device 0. */
axclrtResetDevice(0);

/* Deactivate logical Device 1. */
axclrtResetDevice(1);

axclFinalize();
```

### 2.1. Device ID

AXCL exposes logical device IDs visible to the current process. Runtime maps each logical device ID to the physical device ID used by the driver and communication layer:

- **Physical device ID** comes from device information probed by runtime, and is the ID used by the driver and communication layer to identify a device.
- **Logical device ID** is the continuous ID exposed by AXCL to the current process, in the range `0` to `device count - 1`.
- Use [axclrtGetDeviceCount](../c/device_api.md#axclrtGetDeviceCount) to query the number of logical devices visible to the current process.

<a id="AXCL_VISIBLE_DEVICES"></a>

#### 2.1.1. AXCL_VISIBLE_DEVICES

AXCL uses the `AXCL_VISIBLE_DEVICES` environment variable to control the physical device set visible to the current process, and generates the mapping from logical device IDs to physical device IDs from that visible set. Set this environment variable before the application calls [axclInit](../c/system_api.md#axclInit). A common usage is:

```bash
# Let the current process see only physical devices 3 and 1
export AXCL_VISIBLE_DEVICES=3,1
./app
```

`AXCL_VISIBLE_DEVICES` is parsed as follows:

- If `AXCL_VISIBLE_DEVICES` is not set, runtime maps all probed physical devices to logical devices in probe order.
- If `AXCL_VISIBLE_DEVICES` is set to a comma-separated physical device ID list, runtime generates the logical device mapping in the list order.

Assume the system has 4 physical devices with physical device IDs `0`, `1`, `2`, and `3`. After setting `AXCL_VISIBLE_DEVICES=3,1`, the current process sees only two logical devices:

```{image} ../../asserts/visible_devices_3_1.svg
:alt: AXCL_VISIBLE_DEVICES=3,1 logical device mapping
:align: center
```

### 2.2. Lifecycle

Device activation is managed by reference counting:

- The first [axclrtSetDevice](../c/device_api.md#axclrtSetDevice) call that activates a Device makes runtime establish the connection and create the default Context / default Stream.
- Subsequent activations of the same Device only increase the Device reference count and bind the current thread to the Device's default Context.
- [axclrtCreateContext](../c/context_api.md#axclrtCreateContext) creates an explicit Context on the specified Device and holds an activation reference to that Device; [axclrtDestroyContext](../c/context_api.md#axclrtDestroyContext) destroys the explicit Context and releases the corresponding reference.
- Every Device activation through [axclrtSetDevice](../c/device_api.md#axclrtSetDevice) must be paired with one [axclrtResetDevice](../c/device_api.md#axclrtResetDevice) deactivation.
- Only the final deactivation that drops the reference count to 0 releases the Device's default Context / default Stream and cross-end connection resources.

Device and its child objects have lifecycle dependencies:

- An explicit Stream depends on its owning Context.
- An explicit Context depends on its owning Device.
- The default Context and default Stream are created automatically when the Device is first activated, and are released when the Device is finally deactivated.
- Before the Device is finally released, explicitly created Contexts / Streams must have been released; otherwise runtime rejects Device release.

```{important}
- Before finally deactivating and releasing a Device, users must first release explicitly created Streams and Contexts in this order: [axclrtDestroyStream](../c/stream_api.md#axclrtDestroyStream) → [axclrtDestroyContext](../c/context_api.md#axclrtDestroyContext) → [axclrtResetDevice](../c/device_api.md#axclrtResetDevice).
- If any explicitly created Context or Stream is still alive, runtime rejects Device release.
```

### 2.3. Device Synchronization

- [axclrtSynchronizeDevice](../c/device_api.md#axclrtSynchronizeDevice) waits for related submitted tasks on the Device corresponding to the Context bound to the current thread.
- [axclrtSynchronizeDeviceWithTimeout](../c/device_api.md#axclrtSynchronizeDeviceWithTimeout) supports timeout waiting. The `timeout` unit is milliseconds, and `-1` means waiting indefinitely.

<a id="CONTEXT"></a>

## 3. Context

A Context is an execution environment and resource scope within a Device. Each Context belongs to exactly one Device and automatically owns one default Stream when it is created.
Host threads determine the target Device and execution scope of subsequent runtime APIs by binding the current Context.

### 3.1. Default and Explicit Context

There are two types of Context:

| Type | Creation | Destruction | Description |
|---|---|---|---|
| Default Context | Created automatically on the first [axclrtSetDevice](../c/device_api.md#axclrtSetDevice) | Released when the Device is deactivated | Each activated Device has one default Context in the process, with fixed ID `0`; it cannot be explicitly destroyed by [axclrtDestroyContext](../c/context_api.md#axclrtDestroyContext) |
| Explicit Context | Created by [axclrtCreateContext](../c/context_api.md#axclrtCreateContext) | Destroyed by [axclrtDestroyContext](../c/context_api.md#axclrtDestroyContext) | Suitable for independent execution scopes or multi-thread Context switching |

If the user does not explicitly create a Context, [axclrtSetDevice](../c/device_api.md#axclrtSetDevice) can be used to activate a Device and bind the current thread to the Device's default Context.

```{important}
- The default Context is managed by runtime. Users cannot explicitly destroy it with [axclrtDestroyContext](../c/context_api.md#axclrtDestroyContext).
- The default Context is automatically released by runtime when its Device is finally deactivated.
- Before destroying an explicit Context, users need to destroy explicitly created Streams under that Context first.
```

### 3.2. Context and Thread Binding

Each Host thread has its own current Context binding:

- A thread needs to bind a Context before using Device resources.
- At most one Context is current in a thread at any time, and the Context already contains its owning Device information.
- [axclrtCreateContext](../c/context_api.md#axclrtCreateContext) creates an explicit Context on the specified Device and binds the current thread to the new Context.
- If the same thread creates multiple Contexts consecutively, the thread uses the most recently created Context by default.
- [axclrtSetCurrentContext](../c/context_api.md#axclrtSetCurrentContext) can bind an existing Context as the current Context of the current thread.
- [axclrtDestroyContext](../c/context_api.md#axclrtDestroyContext) destroys an explicit Context and removes that Context from thread binding records.

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

- Tasks in the same Stream enter the queue in submission order and are scheduled in FIFO order.
- Different Streams have independent task queues and, by default, do not guarantee execution ordering between each other.
- If different Streams need execution dependencies, use Event to insert record / wait nodes into Stream queues.
- A Stream is a logical execution queue under a Context. It describes task ordering and synchronization boundaries, and is not the same as a low-level physical data channel.
- A successful asynchronous API return usually means the request has been accepted by runtime or submitted to the corresponding Stream. It does not mean the task has completed. Task completion needs to be confirmed through Stream, Event, or Device synchronization APIs.

### 4.1. Default and Explicit Stream

There are two types of Stream:

| Type | Creation | Destruction | Description |
|---|---|---|---|
| Default Stream | Created automatically when the Context is created | Released with its owning Context | Each Context automatically owns one default Stream with ID `0`; the default Stream is managed by runtime and cannot be explicitly destroyed by users |
| Explicit Stream | Created by [axclrtCreateStream](../c/stream_api.md#axclrtCreateStream) | Destroyed by [axclrtDestroyStream](../c/stream_api.md#axclrtDestroyStream) | Belongs to the Context bound to the current thread at creation time |

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

- [axclrtSynchronizeStream](../c/stream_api.md#axclrtSynchronizeStream) waits for submitted tasks in the specified Stream to complete.
- [axclrtSynchronizeStreamWithTimeout](../c/stream_api.md#axclrtSynchronizeStreamWithTimeout) supports timeout waiting. The `timeout` unit is milliseconds, and `-1` means waiting indefinitely.

[axclrtStreamQuery](../c/stream_api.md#axclrtStreamQuery) is a non-blocking status query API used to get a snapshot of the current task status of a specified Stream:

- `AXCL_STREAM_STATUS_COMPLETE` means there is no unfinished task on the Stream at query time.
- `AXCL_STREAM_STATUS_NOT_READY` means there are still unfinished tasks at query time.

<a id="TASK"></a>

## 5. Task

Task is the minimum runtime-internal scheduling unit that describes one task execution, for example:

- Engine inference request.
- NATIVE SDK RPC request, such as media processing, image processing, or DMA.
- Asynchronous memory operation, such as asynchronous `memcpy`, `memset`, or `memcmp`.
- Event record / Event wait.
- Stream synchronization barrier.

A Task is submitted to a Stream for queued execution. Runtime uses tokens, response matching, and wait state tracking to track Task send, enqueue, and completion states.

From the user point of view, Task mainly matters in two ways:

1. **Ordering**: tasks in the same Stream execute in submission order.
2. **Completion boundary**: after an asynchronous API returns, the Task may only have been enqueued; real completion needs to be confirmed through Stream, Event, or Device synchronization APIs.

<a id="EVENT"></a>

## 6. Event

An Event is a Device-level synchronization object used to mark an execution point on a Stream and to synchronize tasks between different Streams on the same Device.

Event does not belong to a Context or Stream. It is managed by the Event manager of its owning Device. It supports one task waiting for one event, or multiple tasks waiting for the same event.

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
| [axclrtCreateEvent](../c/event_api.md#axclrtCreateEvent) | Create an Event on the Device bound to the current thread |
| [axclrtDestroyEvent](../c/event_api.md#axclrtDestroyEvent) | Destroy an Event |

```{important}
An Event belongs to the Device on which it is created, and can be used only within the same Device. Streams from different Devices cannot share the same Event.
```

### 6.2. Record, Wait, and Synchronize

Common Event synchronization semantics include record, wait, and synchronize:

| Operation | Semantics | Does Host wait for Event completion? |
|---|---|---|
| [axclrtRecordEvent](../c/event_api.md#axclrtRecordEvent) | Insert a record node into the specified Stream. When the Stream reaches this node, the Event becomes signaled | No. A successful return means the record request has been accepted |
| [axclrtStreamWaitEvent](../c/event_api.md#axclrtStreamWaitEvent) | Insert a wait barrier into the specified Stream. When the Stream reaches the barrier, it waits for the Event to become signaled, and then continues with subsequent tasks | No. A successful return means the wait request has been accepted |
| [axclrtSynchronizeEvent](../c/event_api.md#axclrtSynchronizeEvent) | The current Host thread waits for the Event to become signaled | Yes |

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
- [axclrtEventElapsedTime](../c/event_api.md#axclrtEventElapsedTime) requires the two Events to belong to the same Device. AXCL implementation also checks on the Worker side whether the two Events have been recorded, whether they have been signaled, and whether the last record of both Events was on the same Stream.
- The Event timestamp is captured when the Worker executes the record node, not when the Host calls [axclrtRecordEvent](../c/event_api.md#axclrtRecordEvent).

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
- Event record and Stream wait are asynchronous nodes in Stream FIFO. A successful API return does not mean the Event has completed.
- [axclrtSynchronizeEvent](../c/event_api.md#axclrtSynchronizeEvent) is a Host-side blocking wait API used to wait for Event signaled.
- Event state is managed by the Device-side Worker. The Host-side Event handle mainly stores Device ownership, event id, flags, and related information.
