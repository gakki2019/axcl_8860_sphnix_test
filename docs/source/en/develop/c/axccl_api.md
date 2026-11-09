# AXCCL

## Index

- [axCclAllGather](#axCclAllGather): AllGather: gather `sendcount` elements from every rank into `recvbuff` on every rank.
- [axCclAllReduce](#axCclAllReduce): AllReduce: element-wise `op` reduction of `sendbuff` across all ranks, result on all.
- [axCclAllToAll](#axCclAllToAll): AllToAll: uniform exchange. Rank i sends `count` elements to every rank j; `recvbuff` receives `count` elements from every rank.
- [axCclAllToAllV](#axCclAllToAllV): AllToAllV: variable-size exchange (maps to ProcessGroup.all_to_all_single).
- [axCclBarrier](#axCclBarrier): Barrier: blocks `stream` until every rank has reached it.
- [axCclBroadcast](#axCclBroadcast): Broadcast: copy `count` elements from `root` to all ranks.
- [axCclCommAbort](#axCclCommAbort): Close admission and release a healthy domain whose work is proven complete.
- [axCclCommCount](#axCclCommCount): Query the world size (number of ranks) of `comm`.
- [axCclCommDeregister](#axCclCommDeregister): Deregister a buffer registered with [axCclCommRegister](#axCclCommRegister).
- [axCclCommDestroy](#axCclCommDestroy): Release a finalized or aborted communicator handle. This function does not implicitly finalize `comm`.
- [axCclCommDevice](#axCclCommDevice): Query the logical device id bound to `comm`.
- [axCclCommFinalize](#axCclCommFinalize): Finalize communicator resources and mark `comm` unusable.
- [axCclCommGetAsyncError](#axCclCommGetAsyncError): Read and consume this communicator's asynchronous error notification.
- [axCclCommInitAll](#axCclCommInitAll): Create one communicator per device within a single process (multi-device-per-thread).
- [axCclCommInitRank](#axCclCommInitRank): Create a single communicator by rank (NCCL-style convenience).
- [axCclCommInitRootInfo](#axCclCommInitRootInfo): Create a communicator from broadcasted root information (recommended bootstrap path).
- [axCclCommRank](#axCclCommRank): Query the rank of `comm`.
- [axCclCommRegister](#axCclCommRegister): Register a device buffer for reuse of local device mapping resources.
- [axCclFinalize](#axCclFinalize): Deinitialize the CCL module and release module-wide resources.
- [axCclGather](#axCclGather): Gather `sendcount` elements from each rank onto `root` in logical-rank order.
- [axCclGetErrorString](#axCclGetErrorString): Description string for an error code returned by a CCL API.
- [axCclGetRootInfo](#axCclGetRootInfo): Generate bootstrap root information on rank 0.
- [axCclGetVersion](#axCclGetVersion): Return the CCL library build version.
- [axCclGroupEnd](#axCclGroupEnd): Prepare and enqueue every rank in the current group.
- [axCclGroupStart](#axCclGroupStart): Collect coordinated rounds and matched Send/Recv calls on one Host thread.
- [axCclInit](#axCclInit): Initialize the CCL module.
- [axCclRecv](#axCclRecv): Receive `count` elements from rank `peer`.
- [axCclRedOpCreatePreMulSum](#axCclRedOpCreatePreMulSum): Create a "pre-multiplied sum" reduction operator: result = sum(scalar_i * x_i).
- [axCclRedOpDestroy](#axCclRedOpDestroy): Destroy a custom reduction operator created by [axCclRedOpCreatePreMulSum](#axCclRedOpCreatePreMulSum).
- [axCclReduce](#axCclReduce): Reduce: element-wise `op` reduction onto `root` only.
- [axCclReduceScatter](#axCclReduceScatter): ReduceScatter: reduce `op` across ranks, then scatter the result in equal slices.
- [axCclScatter](#axCclScatter): Scatter slices of `recvcount` elements from `root` in logical-rank order.
- [axCclSend](#axCclSend): Send `count` elements to rank `peer` (matches a Recv on `peer`).

<br>

## API

<a id="axCclAllGather"></a>

### axCclAllGather

AllGather: gather `sendcount` elements from every rank into `recvbuff` on every rank.

#### Function

```c
AX_CCL_EXPORT axclError axCclAllGather(const void *sendbuff, void *recvbuff, size_t sendcount, axCclDataType dtype, axCclComm comm, axclrtStream stream);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| sendbuff | in | Source, `sendcount` elements. Use [AX_CCL_IN_PLACE](reference/macro.md#AX_CCL_IN_PLACE) to gather directly into the rank's slice of `recvbuff`. |
| recvbuff | out | Result, `sendcount` * worldSize elements, rank order. |
| sendcount | in | Elements contributed by this rank. |
| dtype | in | Element type. |
| comm | in | Communicator. |
| stream | in | Stream that receives the operation; NULL selects the default stream. |

#### Note

Supports all declared storage types, 1..8 ranks, and sendcount >= 0. Results use logical rank order, regardless of physical ring order. Allocate worldSize * sendcount elements in recvbuff. With AX_CCL_IN_PLACE, input must already be at recvbuff + rank * sendcount * sizeof(dtype); passing that exact slice pointer is also supported. Other overlap is invalid. Use explicit GroupStart/End or one bare call per rank as for AllReduce; synchronize all participating streams before reading results. Bit patterns are copied unchanged (including NaNs and signed zeros).

#### Returns

- `AXCL_SUCC`: The operation was accepted (collected in a group, recorded, or enqueued).
- `others`: Failure.

<br>

<a id="axCclAllReduce"></a>

### axCclAllReduce

AllReduce: element-wise `op` reduction of `sendbuff` across all ranks, result on all.

#### Function

```c
AX_CCL_EXPORT axclError axCclAllReduce(const void *sendbuff, void *recvbuff, size_t count, axCclDataType dtype, axCclRedOp op, axCclComm comm, axclrtStream stream);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| sendbuff | in | Source device buffer, `count` elements; exact alias with recvbuff or [AX_CCL_IN_PLACE](reference/macro.md#AX_CCL_IN_PLACE) is supported. |
| recvbuff | out | Result device buffer, `count` elements per rank. |
| count | in | Number of elements. |
| dtype | in | Element type. |
| op | in | Built-in reduction operator, or a handle from [axCclRedOpCreatePreMulSum](#axCclRedOpCreatePreMulSum). |
| comm | in | Communicator. |
| stream | in | Stream that receives the operation; NULL selects the default stream. |

#### Returns

- `AXCL_SUCC`: The operation was accepted (collected in a group, recorded, or enqueued).
- `others`: Failure.

#### Note

Use explicit [axCclGroupStart](#axCclGroupStart) / [axCclGroupEnd](#axCclGroupEnd), or one bare call per rank. A successful return only means the operation was accepted; synchronize every participating stream before reading `recvbuff`. Every rank must pass the same `count`, `dtype` and `op`, in the same call order. `sendbuff` and `recvbuff` are Device memory allocated with [axclrtMalloc](memory_api.md#axclrtMalloc) on the communicator's device, each span within one allocation, and must stay valid until the operation completes. In-place operation uses `sendbuff` == `recvbuff` or [AX_CCL_IN_PLACE](reference/macro.md#AX_CCL_IN_PLACE); partial overlap is rejected. A `count` of zero is valid.

<br>

<a id="axCclAllToAll"></a>

### axCclAllToAll

AllToAll: uniform exchange. Rank i sends `count` elements to every rank j; `recvbuff` receives `count` elements from every rank.

#### Function

```c
AX_CCL_EXPORT axclError axCclAllToAll(const void *sendbuff, void *recvbuff, size_t count, axCclDataType dtype, axCclComm comm, axclrtStream stream);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| sendbuff | in | Source device buffer, `count` * worldSize elements. [AX_CCL_IN_PLACE](reference/macro.md#AX_CCL_IN_PLACE) exchanges the data in `recvbuff`. |
| recvbuff | out | Result device buffer, `count` * worldSize elements. Must not be [AX_CCL_IN_PLACE](reference/macro.md#AX_CCL_IN_PLACE). |
| count | in | Elements this rank sends to, and receives from, each rank. |
| dtype | in | Element type. |
| comm | in | Communicator. |
| stream | in | Stream that receives the operation; NULL selects the default stream. |

#### Returns

- `AXCL_SUCC`: The operation was accepted (collected in a group, recorded, or enqueued).
- `others`: Failure.

#### Note

Supports all declared storage types in one 1..8-rank process; not supported on the multi-process route. Provide worldSize * count elements per active buffer; count zero is valid. One call per rank is collected by Group or bare calls; the last arrival validates and enqueues the complete exchange. Use the Context captured at communicator creation. IN_PLACE resolves sendbuff to recvbuff; IN_PLACE as recvbuff is rejected. Overlapping send/receive ranges are copied to temporary Device storage before receive writes; receive ranges must not overlap each other. Temporary storage persists until the communicator is finalized or aborted. Stream rebinding requires the same Context and completion proof for prior work.

<br>

<a id="axCclAllToAllV"></a>

### axCclAllToAllV

AllToAllV: variable-size exchange (maps to ProcessGroup.all_to_all_single).

#### Function

```c
AX_CCL_EXPORT axclError axCclAllToAllV(const void *sendbuff, const int64_t *sendCounts, const int64_t *sdispls, void *recvbuff, const int64_t *recvCounts, const int64_t *rdispls, axCclDataType dtype, axCclComm comm, axclrtStream stream);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| sendbuff | in | Source device buffer. |
| sendCounts | in | Per-rank element counts sent from this rank, length worldSize. |
| sdispls | in | Per-rank element offsets into `sendbuff`, length worldSize. |
| recvbuff | out | Destination device buffer. |
| recvCounts | in | Per-rank element counts received by this rank, length worldSize. |
| rdispls | in | Per-rank element offsets into `recvbuff`, length worldSize. |
| dtype | in | Element type. |
| comm | in | Communicator. |
| stream | in | Stream that receives the operation; NULL selects the default stream. |

#### Note

Counts/displacements are Host arrays, copied during the call. Values must be nonnegative and every directed send count must match its peer's receive count. Zero segments and an all-zero exchange are valid; unused buffers may be NULL. Active receive ranges must not overlap each other. Send/receive overlap and IN_PLACE use the same temporary-copy path as [axCclAllToAll](#axCclAllToAll). With IN_PLACE all four arrays are still required (non-NULL) and describe the send/receive layouts in recvbuff. Other restrictions of [axCclAllToAll](#axCclAllToAll) apply.

#### Returns

- `AXCL_SUCC`: The operation was accepted (collected in a group, recorded, or enqueued).
- `others`: Failure.

<br>

<a id="axCclBarrier"></a>

### axCclBarrier

Barrier: blocks `stream` until every rank has reached it.

Supports InitRootInfo communicators whose ring is not yet connected, and matching rounds inside a group. A successful return does not wait for the barrier to complete; synchronize `stream` to wait. On the multi-process route, a bare call returns only after every rank has submitted it.

#### Function

```c
AX_CCL_EXPORT axclError axCclBarrier(axCclComm comm, axclrtStream stream);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| comm | in | Communicator. |
| stream | in | Stream that receives the operation; NULL selects the default stream. |

#### Returns

- `AXCL_SUCC`: The operation was accepted (collected in a group, recorded, or enqueued).
- `others`: Failure.

<br>

<a id="axCclBroadcast"></a>

### axCclBroadcast

Broadcast: copy `count` elements from `root` to all ranks.

#### Function

```c
AX_CCL_EXPORT axclError axCclBroadcast(const void *sendbuff, void *recvbuff, size_t count, axCclDataType dtype, int32_t root, axCclComm comm, axclrtStream stream);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| sendbuff | in | Device buffer with the data on `root`, `count` elements. Ignored on non-root ranks and may be NULL there. [AX_CCL_IN_PLACE](reference/macro.md#AX_CCL_IN_PLACE) uses `recvbuff` in place on every rank. |
| recvbuff | out | Device buffer that receives the data on every rank, `count` elements. |
| count | in | Number of elements. |
| dtype | in | Element type. |
| root | in | Root rank, in [0, worldSize - 1]; the same on every rank. |
| comm | in | Communicator. |
| stream | in | Stream that receives the operation; NULL selects the default stream. |

#### Returns

- `AXCL_SUCC`: The operation was accepted (collected in a group, recorded, or enqueued).
- `others`: Failure.

#### Note

`root` must be in [0, worldSize - 1] and the same on every rank. On the root rank, `sendbuff` holds the data; on non-root ranks `sendbuff` is ignored and may be NULL. Every rank provides `recvbuff`. Pass [AX_CCL_IN_PLACE](reference/macro.md#AX_CCL_IN_PLACE) as `sendbuff` to use `recvbuff` in place on every rank.

<br>

<a id="axCclCommAbort"></a>

### axCclCommAbort

Close admission and release a healthy domain whose work is proven complete.

#### Function

```c
AX_CCL_EXPORT axclError axCclCommAbort(axCclComm comm);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| comm | in | Any communicator of the domain. |

#### Returns

- `AXCL_SUCC`: The domain was released; destroy every rank's handle.
- `others`: Failure.

#### Note

Successful abort releases an idle or previously used domain after bounded queries prove every historical application stream is complete and healthy; Abort itself does not wait for application streams. Pending automatic initialization may also be cancelled; Abort returns only after initialization has stopped using borrowed Contexts. Destroy every rank's handle afterwards; Finalize is not required after a successful abort. Bare calls still waiting for other ranks are discarded. Once Abort reaches the domain, admission stays closed even if Abort fails: the domain accepts no new operations. While work is still running or another thread is submitting, Abort fails and retains resources: no supported hardware stop fence is available. Synchronize the participating streams, then retry Abort or call [axCclCommFinalize](#axCclCommFinalize). On the multi-process route, Abort succeeds only before any work was submitted; afterwards it fails and the domain becomes failed. An uncertain or failed domain returns its persistent failure; keep streams, contexts and buffers alive for recovery. Cannot be called inside a group. Abort does not stop an in-flight hardware task.

<br>

<a id="axCclCommCount"></a>

### axCclCommCount

Query the world size (number of ranks) of `comm`.

#### Function

```c
AX_CCL_EXPORT axclError axCclCommCount(axCclComm comm, int32_t *count);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| comm | in | Communicator. |
| count | out | Receives the world size. Must not be NULL. |

#### Returns

- `AXCL_SUCC`: The world size was returned.
- `others`: Failure.

<br>

<a id="axCclCommDeregister"></a>

### axCclCommDeregister

Deregister a buffer registered with [axCclCommRegister](#axCclCommRegister).

#### Function

```c
AX_CCL_EXPORT axclError axCclCommDeregister(axCclComm comm, void *handle);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| comm | in | Communicator that owns the registration. |
| handle | in | Handle returned by [axCclCommRegister](#axCclCommRegister). Must not be NULL. |

#### Returns

- `AXCL_SUCC`: The registration was released.
- `others`: Failure.

#### Note

Returns AXCL_ERR_CCL_INVALID_STATE while accepted work still uses the registration; the registration stays valid; retry after that work completes. A successful [axCclCommFinalize](#axCclCommFinalize) or [axCclCommAbort](#axCclCommAbort) releases the registrations owned by the domain, so they need not be deregistered first. Cannot be called inside a group.

<br>

<a id="axCclCommDestroy"></a>

### axCclCommDestroy

Release a finalized or aborted communicator handle. This function does not implicitly finalize `comm`.

#### Function

```c
AX_CCL_EXPORT axclError axCclCommDestroy(axCclComm comm);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| comm | in | Communicator that was finalized, or whose domain was successfully aborted. |

#### Returns

- `AXCL_SUCC`: The handle was released; `comm` must not be used again.
- `others`: Failure.

#### Note

Destroy every custom reduction operator of `comm` with [axCclRedOpDestroy](#axCclRedOpDestroy) first. Cannot be called inside a group.

<br>

<a id="axCclCommDevice"></a>

### axCclCommDevice

Query the logical device id bound to `comm`.

#### Function

```c
AX_CCL_EXPORT axclError axCclCommDevice(axCclComm comm, int32_t *deviceId);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| comm | in | Communicator. |
| deviceId | out | Receives the logical device id. Must not be NULL. |

#### Returns

- `AXCL_SUCC`: The device id was returned.
- `others`: Failure.

<br>

<a id="axCclCommFinalize"></a>

### axCclCommFinalize

Finalize communicator resources and mark `comm` unusable.

For a domain that has executed work, the first finalize synchronizes ALL participating application streams of every rank, releases the domain's Device resources, and closes the entire domain to further operations. Keep those streams, contexts and devices alive through this barrier. Finalize/destroy every communicator afterwards. Communicators that never executed work do not synchronize application streams. Calling finalize inside a group is rejected. Bare calls still waiting for other ranks are discarded without being enqueued. Pending automatic initialization is cancelled; Finalize returns only after initialization has stopped using borrowed Contexts. On the multi-process route, every rank must call Finalize. A partial launch or uncertain completion returns an error and retains all peer resources; do not free buffers, destroy contexts, reset devices or tear down Runtime.

#### Function

```c
AX_CCL_EXPORT axclError axCclCommFinalize(axCclComm comm);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| comm | in | Communicator to finalize. |

#### Returns

- `AXCL_SUCC`: The communicator was finalized and may be destroyed.
- `others`: Failure.

<br>

<a id="axCclCommGetAsyncError"></a>

### axCclCommGetAsyncError

Read and consume this communicator's asynchronous error notification.

Returns AXCL_SUCC with `err` == AXCL_SUCC when no notification is pending. Pending automatic initialization is queried without waiting for the other ranks; initialization failure is reported here. No error does not imply readiness. Queries all collective and P2P application streams used by the domain without waiting behind their queued work, with a bounded total Device query budget of about 1000 ms (up to about 16 s on the multi-process route, which also queries the other processes). A query failure is returned as the function result, not in `err`. Device-side CCL failures and skipped CCL tasks remain queryable after ordinary stream synchronization. The first observed error terminates the domain and blocks later launches. Each communicator reports that error once; consuming the notification does not clear the failed state or prove hardware completion. Compatible Host and Device software versions are required. Borrowed streams/contexts must stay alive through communicator finalization.

#### Function

```c
AX_CCL_EXPORT axclError axCclCommGetAsyncError(axCclComm comm, axclError *err);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| comm | in | Communicator. |
| err | out | Receives the pending asynchronous error, or AXCL_SUCC. Must not be NULL. |

#### Returns

- `AXCL_SUCC`: The query completed; `err` holds the result.
- `others`: Failure.

#### Note

On failure, `err` is not meaningful. On the single-process route, if another thread is submitting to the same domain, the query returns AXCL_ERR_CCL_INVALID_STATE without querying; retry after that submission returns. Cannot be called inside a group.

<br>

<a id="axCclCommInitAll"></a>

### axCclCommInitAll

Create one communicator per device within a single process (multi-device-per-thread).

#### Function

```c
AX_CCL_EXPORT axclError axCclCommInitAll(axCclComm *comms, int32_t count, const int32_t *deviceIds);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| comms | out | Array of length `count` that receives the communicators. Must not be NULL; on failure no communicator is returned. |
| count | in | Number of communicators / devices, in [1, 8]. |
| deviceIds | in | Array of length `count` with the logical device id for each communicator. Must not be NULL; ids must be distinct and in [0, [axclrtGetDeviceCount](device_api.md#axclrtGetDeviceCount)() - 1]. |

#### Returns

- `AXCL_SUCC`: All communicators were created and connected.
- `others`: Failure.

#### Note

Supports 1 to 8 distinct logical Device IDs in one Host process. Four devices are the primary current topology; the implementation accepts the full protocol range. Activate every listed Device with [axclrtSetDevice](device_api.md#axclrtSetDevice) first; each communicator uses that Device's default Context. Array order assigns logical ranks only; it does not declare a ring. For ring collectives, ranks are ordered along the physical C2C chain reported by each Device's topology (its previous and next neighbor), not by array order or chip ID. The listed Devices must all be found on that chain, and the C2C link from each rank to the next, including from the last rank back to the first, must be online; otherwise this call fails. The ring is connected before return, so a bare collective of one rank does not wait for the other ranks to call. If the calling thread has a current Context, it is restored before return; otherwise the thread may be left bound to the default Context of a listed Device. InitAll always uses the single-process route, even when the diagnostic AXCCL_MULTIPROCESS override is "1". Cannot be called inside a group.

<br>

<a id="axCclCommInitRank"></a>

### axCclCommInitRank

Create a single communicator by rank (NCCL-style convenience).

Equivalent to [axCclCommInitRootInfo](#axCclCommInitRootInfo); `uniqueId` is the root info shared by all ranks. Parameters, return values and notes are the same as for [axCclCommInitRootInfo](#axCclCommInitRootInfo).

#### Function

```c
AX_CCL_EXPORT axclError axCclCommInitRank(axCclComm *comm, int32_t deviceId, const axCclRootInfo *uniqueId, int32_t worldSize, int32_t rank);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| comm | out | Receives the communicator. Same as in [axCclCommInitRootInfo](#axCclCommInitRootInfo). |
| deviceId | in | Logical (virtual) device id. Same as in [axCclCommInitRootInfo](#axCclCommInitRootInfo). |
| uniqueId | in | Root info shared by all ranks; the `rootInfo` of [axCclCommInitRootInfo](#axCclCommInitRootInfo). |
| worldSize | in | Total number of ranks, in [1, 8]. |
| rank | in | This communicator's rank, in [0, worldSize - 1]. |

#### Returns

- `AXCL_SUCC`: The rank was registered and `comm` is valid.
- `others`: Failure.

<br>

<a id="axCclCommInitRootInfo"></a>

### axCclCommInitRootInfo

Create a communicator from broadcasted root information (recommended bootstrap path).

#### Function

```c
AX_CCL_EXPORT axclError axCclCommInitRootInfo(axCclComm *comm, int32_t deviceId, const axCclRootInfo *rootInfo, int32_t worldSize, int32_t rank);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| comm | out | Receives the communicator bound to `deviceId` as `rank`. Must not be NULL; set to NULL on failure. |
| deviceId | in | Logical (virtual) device id visible to this process, range [0, [axclrtGetDeviceCount](device_api.md#axclrtGetDeviceCount)() - 1]. Must be the calling thread's current device. |
| rootInfo | in | Root info generated by [axCclGetRootInfo](#axCclGetRootInfo) and broadcast unchanged to all ranks. Must not be NULL. |
| worldSize | in | Total number of ranks in the communicator, in [1, 8]. Every rank must pass the same value. |
| rank | in | This communicator's rank, in [0, worldSize - 1]; each rank is used once. |

#### Returns

- `AXCL_SUCC`: The rank was registered and `comm` is valid.
- `others`: Failure.

#### Note

The calling thread's current Context must belong to `deviceId`, for example after [axclrtSetDevice](device_api.md#axclrtSetDevice) or [axclrtCreateContext](context_api.md#axclrtCreateContext). The communicator borrows that Context; keep it alive until [axCclCommFinalize](#axCclCommFinalize) or [axCclCommAbort](#axCclCommAbort) returns. This call registers the rank and returns without waiting for the other ranks; one thread may initialize several ranks in any order. Cannot be called inside a group. Every declared rank must call it before data calls, [axCclGroupEnd](#axCclGroupEnd), [axCclCommRegister](#axCclCommRegister) or [axCclRedOpCreatePreMulSum](#axCclRedOpCreatePreMulSum) can proceed; those calls wait until all ranks have joined. Ranks not involved in a P2P transfer must still initialize, then may stay idle for that transfer. Missing ranks or a timeout never cause a fallback to the single-process route. On Linux, the process layout is detected automatically: the single-process route is used when all ranks are in one process, and the multi-process route when every rank is in a distinct process. Other layouts (several ranks in some of several processes) fail. [axCclCommGetAsyncError](#axCclCommGetAsyncError) reports initialization failures that occur after this call returns. The multi-process route requires the same Host, effective UID and network namespace, one rank per process, and distinct physical Devices. Rank 0 must see every Device; for each P2P pair, the lower rank must see both Devices. Up to 8 ranks are supported; hardware validation covers two processes/Devices. Built-in ring collectives (AllReduce, Reduce, Broadcast, AllGather, ReduceScatter, Gather, Scatter, Barrier), Send/Recv and single-communicator groups are supported across processes; AllToAll[V], buffer registration and custom reductions are not. A single-process communicator keeps all features. Each process's group contains at most 32 calls on one Context/Stream, and contains either only P2P calls or only collectives. On the multi-process route every rank must reach [axCclCommFinalize](#axCclCommFinalize) before releasing its Stream/Context. Uncertain Device work retains existing resources. The diagnostic environment variable AXCCL_MULTIPROCESS selects automatic detection unless it is exactly "0" or "1". "0" forces the legacy single-process route; "1" forces the legacy multi-process route, whose initialization waits for all ranks. Legacy partial-world local submission or P2P without initializing unrelated ranks requires "0". Ordinary complete-world applications need no override.

<br>

<a id="axCclCommRank"></a>

### axCclCommRank

Query the rank of `comm`.

#### Function

```c
AX_CCL_EXPORT axclError axCclCommRank(axCclComm comm, int32_t *rank);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| comm | in | Communicator. |
| rank | out | Receives the rank. Must not be NULL. |

#### Returns

- `AXCL_SUCC`: The rank was returned.
- `others`: Failure.

<br>

<a id="axCclCommRegister"></a>

### axCclCommRegister

Register a device buffer for reuse of local device mapping resources.

#### Function

```c
AX_CCL_EXPORT axclError axCclCommRegister(axCclComm comm, void *buff, size_t size, void **handle);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| comm | in | Communicator. |
| buff | in | Start of the Device range. Must not be NULL. |
| size | in | Range size in bytes, in [1, UINT32_MAX]. |
| handle | out | Receives the registration handle. Must not be NULL; set to NULL on failure. |

#### Note

Requires a valid current Context; the implementation temporarily selects the communicator's device Context and restores the caller's Context. `buff` must belong to a tracked Device allocation on that device. The nonempty byte range must fit within the 39-bit physical address space and contain at most UINT32_MAX bytes. It must lie within that allocation, which the caller must keep alive until deregistration. Registration validates the range but does not pin the allocation. Registrations are single-process, opaque, and handles are not reused. Overlapping ranges are rejected. This does not provide cross-process IPC or exported memory. Not supported on the multi-process route; waits for automatic initialization. Later operations on this communicator whose buffer span lies within a registered range use the registration automatically. Cannot be called inside a group.

#### Returns

- `AXCL_SUCC`: The range was registered and `handle` is valid.
- `others`: Failure.

<br>

<a id="axCclFinalize"></a>

### axCclFinalize

Deinitialize the CCL module and release module-wide resources.

Each call releases one [axCclInit](#axCclInit) reference; only the final call releases module-wide resources.

#### Function

```c
AX_CCL_EXPORT axclError axCclFinalize(void);
```

#### Parameters

N/A

#### Returns

- `AXCL_SUCC`: One reference was released, or the module was deinitialized.
- `others`: Failure.

#### Note

Finalize and destroy all communicators before the final [axCclFinalize](#axCclFinalize); otherwise it fails and the module stays initialized. It cannot be called inside a group.

<br>

<a id="axCclGather"></a>

### axCclGather

Gather `sendcount` elements from each rank onto `root` in logical-rank order.

#### Function

```c
AX_CCL_EXPORT axclError axCclGather(const void *sendbuff, void *recvbuff, size_t sendcount, axCclDataType dtype, int32_t root, axCclComm comm, axclrtStream stream);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| sendbuff | in | Device buffer with this rank's contribution, `sendcount` elements. |
| recvbuff | out | Result device buffer on `root`, `sendcount` * worldSize elements. Ignored on non-root ranks and may be NULL there. |
| sendcount | in | Elements contributed by each rank. |
| dtype | in | Element type. |
| root | in | Root rank, in [0, worldSize - 1]; the same on every rank. |
| comm | in | Communicator. |
| stream | in | Stream that receives the operation; NULL selects the default stream. |

#### Returns

- `AXCL_SUCC`: The operation was accepted (collected in a group, recorded, or enqueued).
- `others`: Failure.

#### Note

`root` must be in [0, worldSize - 1] and the same on every rank. Only `root` writes `recvbuff`; it must hold worldSize * sendcount elements there. Non-root ranks may pass NULL for `recvbuff`. In-place is supported on root only: pass [AX_CCL_IN_PLACE](reference/macro.md#AX_CCL_IN_PLACE), or the root's exact slice of `recvbuff`, as `sendbuff`.

<br>

<a id="axCclGetErrorString"></a>

### axCclGetErrorString

Description string for an error code returned by a CCL API.

CCL-module error codes map to fixed strings; other codes are described by [axclrtGetErrorString](other_api.md#axclrtGetErrorString). Does not require [axCclInit](#axCclInit).

#### Function

```c
AX_CCL_EXPORT const char* axCclGetErrorString(axclError error);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| error | in | Error code. |

#### Returns

- Description string. Must not be freed or modified; a dynamically formatted description may be overwritten by a later call in the same thread.

<br>

<a id="axCclGetRootInfo"></a>

### axCclGetRootInfo

Generate bootstrap root information on rank 0.

#### Function

```c
AX_CCL_EXPORT axclError axCclGetRootInfo(axCclRootInfo *rootInfo);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| rootInfo | out | Receives the root info. Must not be NULL. The caller broadcasts these bytes unchanged to every rank. |

#### Returns

- `AXCL_SUCC`: The root info was generated.
- `others`: Failure.

#### Note

Requires a successful [axCclInit](#axCclInit). Each call generates a new communicator identity; all ranks of one communicator must use the bytes of the same call.

<br>

<a id="axCclGetVersion"></a>

### axCclGetVersion

Return the CCL library build version.

Does not require [axCclInit](#axCclInit).

#### Function

```c
AX_CCL_EXPORT axclError axCclGetVersion(int32_t *major, int32_t *minor, int32_t *patch);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| major | out | Receives the major version. May be NULL. |
| minor | out | Receives the minor version. May be NULL. |
| patch | out | Receives the patch version. May be NULL. |

#### Returns

- `AXCL_SUCC`: The version was returned.
- `others`: Failure.

<br>

<a id="axCclGroupEnd"></a>

### axCclGroupEnd

Prepare and enqueue every rank in the current group.

Only the outermost GroupEnd enqueues; it waits for automatic initialization readiness first. A successful return does not imply execution completion. Synchronize all rank streams before reusing/freeing any peer-accessible buffer. Device resources persist between rounds and are released by [axCclCommFinalize](#axCclCommFinalize), which synchronizes the participating streams. Keep all participating streams/contexts alive through CommFinalize. On partial/uncertain launch the domain is terminal; its resources must remain alive for operator recovery, even after late completion. A failed or skipped CCL task leaves a persistent error that later checks still report, even if the application already synchronized the stream. Keeping borrowed stream/context handles alive is mandatory; using freed handles violates Runtime API preconditions and is not detected by this interface.

#### Function

```c
AX_CCL_EXPORT axclError axCclGroupEnd(void);
```

#### Parameters

N/A

#### Returns

- `AXCL_SUCC`: An inner group was closed, or the outermost group was enqueued.
- `others`: Failure.

#### Note

An empty group, or a GroupEnd without a matching [axCclGroupStart](#axCclGroupStart), fails. A failed outermost GroupEnd discards the whole group.

<br>

<a id="axCclGroupStart"></a>

### axCclGroupStart

Collect coordinated rounds and matched Send/Recv calls on one Host thread.

#### Function

```c
AX_CCL_EXPORT axclError axCclGroupStart(void);
```

#### Parameters

N/A

#### Returns

- `AXCL_SUCC`: A group was opened, or the nesting depth was incremented.
- `others`: Failure.

#### Note

Group state is per Host thread. Requires a successful [axCclInit](#axCclInit). Nested groups are supported; only the outermost GroupEnd prepares and enqueues. Each collective round needs one call per rank with matching shape/type/operator. Single-process mode supports multiple and mixed rounds, multiple communicators, AllToAll[V], and matched P2P calls. Calls only validate and collect their arguments without waiting for initialization; the outermost GroupEnd waits for readiness. Each communicator/rank uses one context/stream; the whole Group is validated, including ordering cycles, before any enqueue. A P2P group instead matches each directed peer's Send/Recv calls in FIFO order; inactive ranks need not submit data after complete-world automatic initialization. They must still initialize. See axCclSend for restrictions. The first failing call inside the group is reported again by GroupEnd, and a validation error cancels the whole group. Use the same Host thread for subsequent rounds and finalization. Multi-process mode supports single-communicator pure P2P or pure collective Groups, at most 32 calls per process on one Context/Stream. See axCclSend for peer matching and batch restrictions. Module init/finalize, communicator creation/finalize/destroy/abort, [axCclCommGetAsyncError](#axCclCommGetAsyncError) and buffer registration cannot be called inside a group. Applications must serialize unrelated communicators sharing a device/stream outside this coordinated Group; no automatic concurrent-communicator scheduler is provided. A terminal domain blocks later launches.

<br>

<a id="axCclInit"></a>

### axCclInit

Initialize the CCL module.

May be called multiple times; each successful call must be paired with [axCclFinalize](#axCclFinalize). Call it after [axclInit](system_api.md#axclInit). Calling any CCL API before [axclInit](system_api.md#axclInit) is undefined. All other CCL APIs except [axCclGetVersion](#axCclGetVersion) and [axCclGetErrorString](#axCclGetErrorString) fail until this function succeeds. It cannot be called inside a group.

#### Function

```c
AX_CCL_EXPORT axclError axCclInit(void);
```

#### Parameters

N/A

#### Returns

- `AXCL_SUCC`: The CCL module was initialized, or its reference count was incremented.
- `others`: Failure.

<br>

<a id="axCclRecv"></a>

### axCclRecv

Receive `count` elements from rank `peer`.

#### Function

```c
AX_CCL_EXPORT axclError axCclRecv(void *recvbuff, size_t count, axCclDataType dtype, int32_t peer, axCclComm comm, axclrtStream stream);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| recvbuff | out | Destination device buffer, `count` elements. |
| count | in | Number of elements. |
| dtype | in | Element type. |
| peer | in | Sending rank, in [0, worldSize - 1]; must match the peer's [axCclSend](#axCclSend). |
| comm | in | Communicator. |
| stream | in | Stream that receives the operation; NULL selects the default stream. |

#### Returns

- `AXCL_SUCC`: The call was accepted (collected in a group or enqueued).
- `others`: Failure.

#### Note

The matching, stream, buffer and lifecycle rules of [axCclSend](#axCclSend) apply.

<br>

<a id="axCclRedOpCreatePreMulSum"></a>

### axCclRedOpCreatePreMulSum

Create a "pre-multiplied sum" reduction operator: result = sum(scalar_i * x_i).

#### Function

```c
AX_CCL_EXPORT axclError axCclRedOpCreatePreMulSum(axCclComm comm, axCclRedOp *op, const void *scalar, axCclDataType datatype, axCclScalarResidence residence);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| comm | in | Communicator that owns the operator. |
| op | out | Receives the custom operator handle. |
| scalar | in | Pointer to the scalar, interpreted according to `datatype`. Supported types include all fourteen declared dtypes. Its value is read once when the logical operation executes; all tiles use that value. Keep the pointed-to storage valid through completion of every participating Stream, even after destroying the operator. |
| datatype | in | Scalar type. |
| residence | in | Where `scalar` resides. |

#### Returns

- `AXCL_SUCC`: The operator was created and `op` holds its handle.
- `others`: Failure.

#### Note

Create requires a current Context for the communicator's device and waits for automatic initialization. Not supported on the multi-process route. The handle is valid only with `comm`, and only for [axCclAllReduce](#axCclAllReduce), [axCclReduce](#axCclReduce) and [axCclReduceScatter](#axCclReduceScatter). Each rank may provide different scalar values and residences. Each scalar type must match the collective dtype; collective kind, dtype, root and count must match. Host scalars are read at logical operation execution; Device scalars are read after preceding application-stream writes. FP32/FP16/BF16/FP8 multiply and accumulate in logical-rank order using FP32, then cast once. Integer products and sums retain all bits and saturate once at the final result. FP64 uses binary64 products and additions in logical-rank order with nearest-even rounding and gradual underflow. FP8 clamps infinities to finite endpoints and emits canonical NaNs (E4M3:0x7f, E5M2:0x7e); FP64 emits canonical 0x7ff8000000000000 for invalid results.

Pair every successful create with [axCclRedOpDestroy](#axCclRedOpDestroy) before destroying `comm`.

<br>

<a id="axCclRedOpDestroy"></a>

### axCclRedOpDestroy

Destroy a custom reduction operator created by [axCclRedOpCreatePreMulSum](#axCclRedOpCreatePreMulSum).

#### Function

```c
AX_CCL_EXPORT axclError axCclRedOpDestroy(axCclComm comm, axCclRedOp op);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| comm | in | Communicator that created `op`. |
| op | in | Custom operator handle. |

#### Returns

- `AXCL_SUCC`: The operator was destroyed; `op` must not be used in new calls.
- `others`: Failure.

#### Note

Operations already accepted with `op` still complete; keep the scalar storage valid until they finish.

<br>

<a id="axCclReduce"></a>

### axCclReduce

Reduce: element-wise `op` reduction onto `root` only.

`root` must be in [0, worldSize - 1] and the same on every rank. `op` may be a built-in operator or a handle from [axCclRedOpCreatePreMulSum](#axCclRedOpCreatePreMulSum).

#### Function

```c
AX_CCL_EXPORT axclError axCclReduce(const void *sendbuff, void *recvbuff, size_t count, axCclDataType dtype, axCclRedOp op, int32_t root, axCclComm comm, axclrtStream stream);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| sendbuff | in | Source device buffer, `count` elements. |
| recvbuff | out | Result device buffer on `root`, `count` elements. Ignored on non-root ranks and may be NULL there. |
| count | in | Number of elements. |
| dtype | in | Element type. |
| op | in | Built-in reduction operator, or a handle from [axCclRedOpCreatePreMulSum](#axCclRedOpCreatePreMulSum). |
| root | in | Root rank, in [0, worldSize - 1]; the same on every rank. |
| comm | in | Communicator. |
| stream | in | Stream that receives the operation; NULL selects the default stream. |

#### Returns

- `AXCL_SUCC`: The operation was accepted (collected in a group, recorded, or enqueued).
- `others`: Failure.

#### Note

In-place on the root rank: use `sendbuff` == `recvbuff` or [AX_CCL_IN_PLACE](reference/macro.md#AX_CCL_IN_PLACE). Non-root ranks only read `sendbuff`; their `recvbuff` is ignored and may be NULL (with [AX_CCL_IN_PLACE](reference/macro.md#AX_CCL_IN_PLACE), a non-root rank reads its input from `recvbuff`).

<br>

<a id="axCclReduceScatter"></a>

### axCclReduceScatter

ReduceScatter: reduce `op` across ranks, then scatter the result in equal slices.

#### Function

```c
AX_CCL_EXPORT axclError axCclReduceScatter(const void *sendbuff, void *recvbuff, size_t recvcount, axCclDataType dtype, axCclRedOp op, axCclComm comm, axclrtStream stream);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| sendbuff | in | Source, `recvcount` * worldSize elements. For in-place operation pass [AX_CCL_IN_PLACE](reference/macro.md#AX_CCL_IN_PLACE) or exactly `recvbuff`; any other overlap is rejected. |
| recvbuff | out | Result, `recvcount` elements (this rank's slice). In-place, it also holds the `recvcount` * worldSize input elements. |
| recvcount | in | Elements in each rank's result slice. |
| dtype | in | Element type. |
| op | in | Built-in reduction operator, or a handle from [axCclRedOpCreatePreMulSum](#axCclRedOpCreatePreMulSum). |
| comm | in | Communicator. |
| stream | in | Stream that receives the operation; NULL selects the default stream. |

#### Returns

- `AXCL_SUCC`: The operation was accepted (collected in a group, recorded, or enqueued).
- `others`: Failure.

#### Note

`op` may be a built-in operator or a handle from [axCclRedOpCreatePreMulSum](#axCclRedOpCreatePreMulSum).

With AX_CCL_IN_PLACE, recvbuff is the base of the complete input allocation; this rank's result occupies elements [rank * recvcount, (rank + 1) * recvcount) of that allocation, interpreted as dtype.

<br>

<a id="axCclScatter"></a>

### axCclScatter

Scatter slices of `recvcount` elements from `root` in logical-rank order.

#### Function

```c
AX_CCL_EXPORT axclError axCclScatter(const void *sendbuff, void *recvbuff, size_t recvcount, axCclDataType dtype, int32_t root, axCclComm comm, axclrtStream stream);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| sendbuff | in | Device buffer on `root` with all slices, `recvcount` * worldSize elements. Ignored on non-root ranks and may be NULL there. |
| recvbuff | out | Device buffer that receives this rank's slice, `recvcount` elements. |
| recvcount | in | Elements in each rank's slice. |
| dtype | in | Element type. |
| root | in | Root rank, in [0, worldSize - 1]; the same on every rank. |
| comm | in | Communicator. |
| stream | in | Stream that receives the operation; NULL selects the default stream. |

#### Note

Root's `sendbuff` holds worldSize * recvcount elements. Non-root ranks may pass NULL for `sendbuff`. Root may pass IN_PLACE as recvbuff, or its exact logical-rank slice of sendbuff. The full root source remains unchanged. Other ranks provide recvbuff normally; other active partial overlaps are rejected. IN_PLACE as sendbuff is rejected. `root` must be in [0, worldSize - 1] and the same on every rank.

#### Returns

- `AXCL_SUCC`: The operation was accepted (collected in a group, recorded, or enqueued).
- `others`: Failure.

<br>

<a id="axCclSend"></a>

### axCclSend

Send `count` elements to rank `peer` (matches a Recv on `peer`).

#### Function

```c
AX_CCL_EXPORT axclError axCclSend(const void *sendbuff, size_t count, axCclDataType dtype, int32_t peer, axCclComm comm, axclrtStream stream);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| sendbuff | in | Source device buffer, `count` elements. |
| count | in | Number of elements. |
| dtype | in | Element type. |
| peer | in | Receiving rank, in [0, worldSize - 1]; must match the peer's [axCclRecv](#axCclRecv). |
| comm | in | Communicator. |
| stream | in | Stream that receives the operation; NULL selects the default stream. |

#### Returns

- `AXCL_SUCC`: The call was accepted (collected in a group or enqueued).
- `others`: Failure.

#### Note

Single-process domains support 1..8 ranks, count zero, and all storage types. `peer` must be in [0, worldSize - 1]. Self Send/Recv (`peer` equal to this rank) requires both matched sides in a Group and copies locally on the Device. Buffers are device addresses aligned to the element width; IN_PLACE is unsupported. Both peers must have registered communicators. Only these two peers execute; other ranks need not submit an operation. Use the context captured at CommInitRootInfo (the default context for CommInitAll). Rebinding to a different/default application stream requires the same Context and bounded proof that all prior parent/pair work is complete. A bare successful call has enqueued its own side. The caller must submit compatible opposite roles/counts/types in the same per-pair order before synchronizing; bare calls are not reordered or held on the Host. A P2P Group must contain both sides of each transfer; it may reorder jobs and supports reciprocal transfers with distinct buffers. On one device, no receive range may overlap any send or other receive in that group. An exact alias of one matched self-copy is permitted. Mixed P2P/collective Groups validate complete phases and ordering before enqueue. Complete previously unmatched bare submissions before submitting a P2P Group; while any bare Send/Recv of the domain is unmatched, a Group or a stream change on its Devices returns AXCL_ERR_CCL_INVALID_STATE without enqueueing anything: submit the missing peer calls and retry. Finalize with unmatched submissions instead makes the domain terminal and retains resources. Keep streams, contexts and buffers alive until completion; serialize other domains sharing these devices. In Linux multi-process mode, a bare call waits until the matching peer's single call is submitted and both sides are enqueued. A pure P2P Group collects at most 32 calls per process on one Context/Stream in the same domain. Each pair's number of calls must match across processes; opposite roles/counts/types match in per-direction FIFO order, with local interleaving allowed to differ. Only the participating pairs (and ranks connected to them) synchronize for P2P submission. Automatic initialization first requires all declared ranks to initialize; nonparticipating ranks may then remain idle during the P2P transfer. Bare self-transfer is unsupported; grouped matched self-copy is supported. The group overlap rules above also apply. P2P and collectives must use separate multi-process Groups. Buffers must be Device memory allocated by the calling process with [axclrtMalloc](memory_api.md#axclrtMalloc) on the communicator's device; the whole span must lie in one allocation. Finalize still requires every rank.
