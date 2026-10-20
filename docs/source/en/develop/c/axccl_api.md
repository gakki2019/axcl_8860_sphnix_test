# AXCCL

## Index

- [axCclAllGather](#axCclAllGather): AllGather: gather `sendcount` elements from every rank into `recvbuff` on every rank.
- [axCclAllReduce](#axCclAllReduce): AllReduce: element-wise `op` reduction of `sendbuff` across all ranks, result on all.
- [axCclAllToAll](#axCclAllToAll): AllToAll: uniform exchange. Rank i sends `count` elements to every rank j; `recvbuff` receives `count` elements from every rank.
- [axCclAllToAllV](#axCclAllToAllV): AllToAllV: variable-size exchange (maps to ProcessGroup.all_to_all_single).
- [axCclBarrier](#axCclBarrier)
- [axCclBroadcast](#axCclBroadcast): Broadcast: copy `count` elements from `root` to all ranks.
- [axCclCommAbort](#axCclCommAbort): Close admission and release a healthy domain whose work is proven complete.
- [axCclCommCount](#axCclCommCount)
- [axCclCommDeregister](#axCclCommDeregister)
- [axCclCommDestroy](#axCclCommDestroy)
- [axCclCommDevice](#axCclCommDevice)
- [axCclCommFinalize](#axCclCommFinalize): Finalize communicator resources and mark `comm` unusable.
- [axCclCommGetAsyncError](#axCclCommGetAsyncError): Read and consume this communicator's asynchronous error notification.
- [axCclCommInitAll](#axCclCommInitAll): Create one communicator per device within a single process (multi-device-per-thread).
- [axCclCommInitRank](#axCclCommInitRank): Create a single communicator by rank (NCCL-style convenience).
- [axCclCommInitRootInfo](#axCclCommInitRootInfo): Create a communicator from broadcasted root information (recommended bootstrap path).
- [axCclCommRank](#axCclCommRank)
- [axCclCommRegister](#axCclCommRegister): Register a device buffer for reuse of local device mapping resources.
- [axCclFinalize](#axCclFinalize): Deinitialize the CCL module and release module-wide resources.
- [axCclGather](#axCclGather): Gather `sendcount` elements from each rank onto `root` in logical-rank order.
- [axCclGetErrorString](#axCclGetErrorString): Description string for a CCL error code (covers CCL-module error ids). Thread-local.
- [axCclGetRootInfo](#axCclGetRootInfo): Generate bootstrap root information on rank 0.
- [axCclGetVersion](#axCclGetVersion)
- [axCclGroupEnd](#axCclGroupEnd)
- [axCclGroupStart](#axCclGroupStart): Collect coordinated rounds and matched Send/Recv calls on one Host thread.
- [axCclInit](#axCclInit): Initialize the CCL module.
- [axCclRecv](#axCclRecv)
- [axCclRedOpCreatePreMulSum](#axCclRedOpCreatePreMulSum): Create a "pre-multiplied sum" reduction operator: result = sum(scalar_i * x_i).
- [axCclRedOpDestroy](#axCclRedOpDestroy)
- [axCclReduce](#axCclReduce): Reduce: element-wise `op` reduction onto `root` only.
- [axCclReduceScatter](#axCclReduceScatter): ReduceScatter: reduce `op` across ranks, then scatter the result in equal slices.
- [axCclScatter](#axCclScatter): Scatter `recvcount-sized` slices from `root` in logical-rank order.
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

#### Note

Supports all declared storage types, 1..8 ranks, and sendcount >= 0. Results use logical rank order, regardless of physical ring order. Allocate worldSize * sendcount elements in recvbuff. With AX_CCL_IN_PLACE, input must already be at recvbuff + rank * sendcount * sizeof(dtype); passing that exact slice pointer is also supported. Other overlap is invalid. Use explicit GroupStart/End or one bare call per rank as for AllReduce; synchronize all participating streams before reading results. Bit patterns are copied unchanged (including NaNs and signed zeros).

#### Returns

N/A

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
| sendbuff | in | Source device buffer; exact alias with recvbuff is supported. |
| recvbuff | out | Result device buffer, `count` elements per rank. |
| count | in | Number of elements. |
| dtype | in | Element type. |
| op | in | Reduction operator. |
| comm | in | Communicator. |
| stream | in | Stream that receives the operation. |

#### Returns

N/A

<br>

<a id="axCclAllToAll"></a>

### axCclAllToAll

AllToAll: uniform exchange. Rank i sends `count` elements to every rank j; `recvbuff` receives `count` elements from every rank.

#### Function

```c
AX_CCL_EXPORT axclError axCclAllToAll(const void *sendbuff, void *recvbuff, size_t count, axCclDataType dtype, axCclComm comm, axclrtStream stream);
```

#### Parameters

N/A

#### Note

Supports all declared storage types in one 1..8-rank process. Provide worldSize * count elements per active buffer; count zero is valid. One descriptor per rank is collected by Group or bare calls; the last arrival validates and enqueues the complete exchange. Self segments use NeuLink local DMA, others use cached P2P channels. IN_PLACE resolves sendbuff to recvbuff. Overlapping send/receive ranges use Device snapshots before receive writes; receive ranges must not overlap each other. Temporary storage persists until safe domain cleanup. Stream rebinding requires the same Context and completion proof for prior work.

#### Returns

N/A

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

#### Note

Counts/displacements are Host arrays, copied during the call. Values must be nonnegative and every directed send count must match its peer's receive count. Zero segments and an all-zero exchange are valid; unused buffers may be NULL. Active receive ranges must not overlap each other. Send/receive overlap and IN_PLACE use the AllToAll Device snapshot path. With IN_PLACE all four arrays are still required and describe the send/receive layouts in recvbuff.

#### Returns

N/A

<br>

<a id="axCclBarrier"></a>

### axCclBarrier

@ : @ . Supports lazy InitRootInfo domains and matching rounds inside Group.

#### Function

```c
AX_CCL_EXPORT axclError axCclBarrier(axCclComm comm, axclrtStream stream);
```

#### Parameters

N/A

#### Returns

N/A

<br>

<a id="axCclBroadcast"></a>

### axCclBroadcast

Broadcast: copy `count` elements from `root` to all ranks.

#### Function

```c
AX_CCL_EXPORT axclError axCclBroadcast(const void *sendbuff, void *recvbuff, size_t count, axCclDataType dtype, int32_t root, axCclComm comm, axclrtStream stream);
```

#### Parameters

N/A

#### Note

On the root rank, `sendbuff` holds the data; on non-root ranks `sendbuff` is ignored and may be NULL. Every rank provides `recvbuff`. Pass [AX_CCL_IN_PLACE](reference/macro.md#AX_CCL_IN_PLACE) as `sendbuff` to use `recvbuff` in place on every rank.

#### Returns

N/A

<br>

<a id="axCclCommAbort"></a>

### axCclCommAbort

Close admission and release a healthy domain whose work is proven complete.

#### Function

```c
AX_CCL_EXPORT axclError axCclCommAbort(axCclComm comm);
```

#### Parameters

N/A

#### Note

Successful abort releases an idle or previously used domain after independent bounded queries prove every historical application stream is complete and healthy. Pending automatic bootstrap before Device launch may also be cancelled; Abort joins its worker before borrowed Contexts may be released. Destroy every rank's handle afterwards; Finalize is not required after a successful abort. Pending implicit descriptors are discarded. Running work or a concurrent submit lease returns UNSUPPORT and retains resources: no supported hardware stop fence is available. Admission stays closed. An uncertain or failed domain returns its persistent failure; keep streams, contexts and buffers alive for recovery. An active Group rejects Abort with INVALID_STATE. Abort does not stop an in-flight hardware task.

#### Returns

N/A

<br>

<a id="axCclCommCount"></a>

### axCclCommCount

@ ( ) @ .

#### Function

```c
AX_CCL_EXPORT axclError axCclCommCount(axCclComm comm, int32_t *count);
```

#### Parameters

N/A

#### Returns

N/A

<br>

<a id="axCclCommDeregister"></a>

### axCclCommDeregister

@ @ .

#### Function

```c
AX_CCL_EXPORT axclError axCclCommDeregister(axCclComm comm, void *handle);
```

#### Parameters

N/A

#### Note

Returns AXCL_ERR_CCL_INVALID_STATE while accepted work still uses the registration; retry after that work completes. Successful communicator Finalize and idle Abort release registrations owned by the domain.

#### Returns

N/A

<br>

<a id="axCclCommDestroy"></a>

### axCclCommDestroy

@ . not implicitly finalize `comm`.

#### Function

```c
AX_CCL_EXPORT axclError axCclCommDestroy(axCclComm comm);
```

#### Parameters

N/A

#### Returns

N/A

<br>

<a id="axCclCommDevice"></a>

### axCclCommDevice

@ @ .

#### Function

```c
AX_CCL_EXPORT axclError axCclCommDevice(axCclComm comm, int32_t *deviceId);
```

#### Parameters

N/A

#### Returns

N/A

<br>

<a id="axCclCommFinalize"></a>

### axCclCommFinalize

Finalize communicator resources and mark `comm` unusable.

For a grouped domain, the first finalize synchronizes ALL participating application streams, destroys completed executions and domain signals, and closes the entire domain to further collectives. Keep those streams, contexts and devices alive through this barrier. Finalize/destroy every communicator afterwards. Communicators that never participated in a grouped execution do not synchronize application streams. Calling finalize inside an unflushed group is rejected. Pending automatic bootstrap before Device launch can be cancelled; Finalize joins its worker before borrowed Contexts may be released. Ready IPC domains still require all ranks to finalize. A partial launch or uncertain completion returns an error and retains all peer resources; do not free buffers, destroy contexts, reset devices or tear down Runtime.

#### Function

```c
AX_CCL_EXPORT axclError axCclCommFinalize(axCclComm comm);
```

#### Parameters

N/A

#### Returns

N/A

<br>

<a id="axCclCommGetAsyncError"></a>

### axCclCommGetAsyncError

Read and consume this communicator's asynchronous error notification.

Returns AXCL_SUCC with `err` == AXCL_SUCC when no notification is pending. Pending automatic bootstrap is queried independently of membership waits; bootstrap failure is reported asynchronously. No error does not imply readiness. Queries all established collective and P2P application streams through an independent CCL control route, with a total 1000 ms query budget. A busy Host submission lock returns INVALID_STATE; a transport/query failure is returned as the function result. Worker CCL failures and skipped CCL tasks remain queryable after ordinary stream synchronization. The first observed error terminates the domain and blocks later launches. Each communicator reports that error once; consuming the notification does not clear the failed state or prove hardware completion. Compatible Host and Worker versions are required. Borrowed streams/contexts must stay alive through communicator finalization.

#### Function

```c
AX_CCL_EXPORT axclError axCclCommGetAsyncError(axCclComm comm, axclError *err);
```

#### Parameters

N/A

#### Returns

N/A

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
| comms | out | Array of length `count` that receives the communicators. |
| count | in | Number of communicators / devices. |
| deviceIds | in | Array of length `count` with the logical device id for each communicator. |

#### Note

Supports 2 to 8 distinct logical Device IDs in one Host process. Four devices are the primary current topology; the implementation accepts the full protocol range. Array order assigns logical ranks only; it does not declare a ring. For the bounded C2C AllReduce, Host orders participating ranks by their actual local chip_id ascending and validates each resulting directed C2C peer is online. This is a static rule, not hardware adjacency discovery. Caller context is unchanged. InitAll always uses the local route, even when the diagnostic AXCCL_MULTIPROCESS override is "1".

#### Returns

N/A

<br>

<a id="axCclCommInitRank"></a>

### axCclCommInitRank

Create a single communicator by rank (NCCL-style convenience).

Equivalent to [axCclCommInitRootInfo](#axCclCommInitRootInfo) when the caller already holds a per-rank unique id.

#### Function

```c
AX_CCL_EXPORT axclError axCclCommInitRank(axCclComm *comm, int32_t deviceId, const axCclRootInfo *uniqueId, int32_t worldSize, int32_t rank);
```

#### Parameters

N/A

#### Returns

N/A

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
| comm | out | Receives the communicator bound to `deviceId` as `rank`. |
| deviceId | in | Logical (virtual) device id visible to this process, range [0, [axclrtGetDeviceCount](device_api.md#axclrtGetDeviceCount)() - 1]. |
| rootInfo | in | Root info generated by rank 0 and broadcast to all ranks. |
| worldSize | in | Total number of ranks in the communicator. |
| rank | in | This communicator's rank, in [0, worldSize - 1]. |

#### Note

The calling thread must first activate `deviceId` with [axclrtSetDevice](device_api.md#axclrtSetDevice) and hold its original Context. The 128-byte RootInfo format is unchanged. Default Init registers this rank and borrows that Context without waiting for world membership; one thread may initialize ranks 0->1 or 1->0. Automatic mode requires every declared rank to register before data calls, GroupEnd, buffer registration or custom-op feature gates can become ready. Unrelated P2P ranks must initialize, then may stay idle for that transfer. Missing members or a timeout never imply a fallback to the local route. Background Unix SO_PEERCRED PID discovery selects the local route when all ranks share one PID, or same-Host IPC when every rank has a distinct PID. Mixed layouts with multiple local ranks across processes return UNSUPPORT before any LAUNCH. IPC topology initialization binds the borrowed original Context; keep it alive through Finalize/Abort and bootstrap worker joining. Data operations wait for readiness; Group members only collect descriptors, and the outermost GroupEnd waits. Query remains independent while pending and reports asynchronous bootstrap errors. Pending prelaunch bootstrap can be cancelled by Finalize/Abort, which join its worker before Context release. Linux IPC requires the same Host, effective UID, Unix network namespace, positive broker-visible peer PIDs, and one rank per process on distinct physical Devices. Rank 0 must see every Device; each P2P pair's lower global rank must see both pair Devices. Code supports up to 8 ranks; hardware acceptance covers two processes/Devices, not the full range. Built-in ring collectives, Send/Recv and one-domain groups are supported; AllToAll[V], registration, custom reductions and REARM overrides are not supported across processes. Same-process RootInfo retains local features. Each process's Group contains at most 32 calls on one Context/Stream. Pure P2P and pure collective Groups may be submitted separately; mixing P2P and collectives within the same multi-process Group is unsupported. Ready IPC domains require every rank to reach CommFinalize before releasing Stream/Context. Uncertain Device work retains existing resources. AXCCL_MULTIPROCESS unset or "auto" selects the default automatic route. Diagnostic "0" forces legacy local; "1" forces legacy synchronous IPC Init with one rank per process. Legacy partial-world local submission or P2P without initializing unrelated ranks requires explicit diagnostic "0". Ordinary complete-world applications require no override.

#### Returns

N/A

<br>

<a id="axCclCommRank"></a>

### axCclCommRank

@ @ .

#### Function

```c
AX_CCL_EXPORT axclError axCclCommRank(axCclComm comm, int32_t *rank);
```

#### Parameters

N/A

#### Returns

N/A

<br>

<a id="axCclCommRegister"></a>

### axCclCommRegister

Register a device buffer for reuse of local device mapping resources.

#### Function

```c
AX_CCL_EXPORT axclError axCclCommRegister(axCclComm comm, void *buff, size_t size, void **handle);
```

#### Parameters

N/A

#### Note

Requires a valid current Context; the implementation temporarily selects the communicator's device Context and restores the caller's Context. `buff` must belong to a tracked Device allocation on that device. The nonempty byte range must fit within the 39-bit physical address space and contain at most UINT32_MAX bytes. It must lie within that allocation, which the caller must keep alive until deregistration. Pointer attributes validate the endpoints but do not establish allocation extent or pin the allocation. Registrations are single-process, opaque, and handles are not reused. Overlapping ranges are rejected. This does not provide cross-process IPC or exported memory.

#### Returns

N/A

<br>

<a id="axCclFinalize"></a>

### axCclFinalize

Deinitialize the CCL module and release module-wide resources.

#### Function

```c
AX_CCL_EXPORT axclError axCclFinalize(void);
```

#### Parameters

N/A

#### Note

Destroy all communicators before the final [axCclFinalize](#axCclFinalize).

#### Returns

N/A

<br>

<a id="axCclGather"></a>

### axCclGather

Gather `sendcount` elements from each rank onto `root` in logical-rank order.

#### Function

```c
AX_CCL_EXPORT axclError axCclGather(const void *sendbuff, void *recvbuff, size_t sendcount, axCclDataType dtype, int32_t root, axCclComm comm, axclrtStream stream);
```

#### Parameters

N/A

#### Note

Only `root` writes `recvbuff`; it must hold worldSize * sendcount elements there. Non-root ranks may pass NULL for `recvbuff`. In-place is supported on root only.

#### Returns

N/A

<br>

<a id="axCclGetErrorString"></a>

### axCclGetErrorString

Description string for a CCL error code (covers CCL-module error ids). Thread-local.

#### Function

```c
AX_CCL_EXPORT const char* axCclGetErrorString(axclError error);
```

#### Parameters

N/A

#### Returns

N/A

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
| rootInfo | out | Receives the root info. The caller broadcasts these bytes to every rank. |

#### Returns

- `AXCL_SUCC`: success.
- `others`: failure.

<br>

<a id="axCclGetVersion"></a>

### axCclGetVersion

@ .

#### Function

```c
AX_CCL_EXPORT axclError axCclGetVersion(int32_t *major, int32_t *minor, int32_t *patch);
```

#### Parameters

N/A

#### Returns

N/A

<br>

<a id="axCclGroupEnd"></a>

### axCclGroupEnd

@ . The outermost GroupEnd waits for automatic bootstrap readiness before enqueue. A successful return does not imply execution completion. Synchronize all rank streams before reusing/freeing any peer-accessible buffer. Sessions persist between rounds; streams are drained at signal-window REARM and CommFinalize. Keep all participating streams/contexts alive through CommFinalize. On partial/uncertain launch the domain is terminal; its resources must remain alive for operator recovery, even after late completion. Failed or skipped CCL Run leaves a persistent error on its Worker stream so an earlier application synchronization cannot hide failure from the domain barrier. Keeping borrowed stream/context handles alive is mandatory; using freed handles violates Runtime API preconditions and is not detected by this interface.

#### Function

```c
AX_CCL_EXPORT axclError axCclGroupEnd(void);
```

#### Parameters

N/A

#### Returns

N/A

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

#### Note

Nested groups are supported; only the outermost GroupEnd prepares and enqueues. Each collective round needs one call per rank with matching shape/type/operator. Single-process mode supports multiple and mixed rounds, coordinated domains, and matched P2P calls. Calls collect descriptors without waiting for bootstrap; the outermost GroupEnd waits for readiness. Each domain/rank uses one context/stream; the whole Group is validated, including ordering cycles, before any enqueue. A P2P group instead matches each directed peer's Send/Recv calls in FIFO order; inactive ranks need not submit data after complete-world automatic bootstrap. They must still initialize. See axCclSend for restrictions. A validation error cancels the group. Use the same Host thread for subsequent rounds and finalization. Multi-process mode supports one-domain pure P2P or pure collective Groups, at most 32 calls per process on one Context/Stream. See axCclSend for peer matching and batch restrictions. Applications must serialize unrelated domains sharing a device/stream outside this coordinated Group; no automatic concurrent-domain scheduler is provided. A terminal domain blocks later launches.

#### Returns

N/A

<br>

<a id="axCclInit"></a>

### axCclInit

Initialize the CCL module.

May be called multiple times; each successful call must be paired with [axCclFinalize](#axCclFinalize). Safe to call after [axclInit](system_api.md#axclInit). Calling any CCL API before [axclInit](system_api.md#axclInit) is undefined.

#### Function

```c
AX_CCL_EXPORT axclError axCclInit(void);
```

#### Parameters

N/A

#### Returns

- `AXCL_SUCC`: success.
- `others`: failure.

<br>

<a id="axCclRecv"></a>

### axCclRecv

@ @ @ .

#### Function

```c
AX_CCL_EXPORT axclError axCclRecv(void *recvbuff, size_t count, axCclDataType dtype, int32_t peer, axCclComm comm, axclrtStream stream);
```

#### Parameters

N/A

#### Note

The matching, stream, lifecycle and initial size/type limits of axCclSend apply.

#### Returns

N/A

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

#### Note

Create requires a current Context for the communicator's device. Each rank may provide a different scalar values and residences. Each scalar type must match the collective dtype; collective kind, dtype, root and count must match. Host scalars are read at logical operation execution; Device scalars are read after preceding application-stream writes. FP32/FP16/BF16/FP8 multiply and accumulate in logical-rank order using FP32, then cast once. Integer products and sums retain all bits and saturate once at the final result. FP64 uses binary64 products and additions in logical-rank order with nearest-even rounding and gradual underflow. FP8 clamps infinities to finite endpoints and emits canonical NaNs (E4M3:0x7f, E5M2:0x7e); FP64 emits canonical 0x7ff8000000000000 for invalid results.

Pair every successful create with [axCclRedOpDestroy](#axCclRedOpDestroy) before destroying `comm`.

#### Returns

N/A

<br>

<a id="axCclRedOpDestroy"></a>

### axCclRedOpDestroy

@ @ .

#### Function

```c
AX_CCL_EXPORT axclError axCclRedOpDestroy(axCclComm comm, axCclRedOp op);
```

#### Parameters

N/A

#### Returns

N/A

<br>

<a id="axCclReduce"></a>

### axCclReduce

Reduce: element-wise `op` reduction onto `root` only.

#### Function

```c
AX_CCL_EXPORT axclError axCclReduce(const void *sendbuff, void *recvbuff, size_t count, axCclDataType dtype, axCclRedOp op, int32_t root, axCclComm comm, axclrtStream stream);
```

#### Parameters

N/A

#### Note

In-place on the root rank: use `sendbuff` == `recvbuff`. Non-root ranks only read `sendbuff`; their `recvbuff` is ignored.

#### Returns

N/A

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
| sendbuff | in | Source, `recvcount` * worldSize elements. Use [AX_CCL_IN_PLACE](reference/macro.md#AX_CCL_IN_PLACE). |
| recvbuff | out | Result, `recvcount` elements (this rank's slice). |

#### Returns

N/A

<br>

<a id="axCclScatter"></a>

### axCclScatter

Scatter `recvcount-sized` slices from `root` in logical-rank order.

#### Function

```c
AX_CCL_EXPORT axclError axCclScatter(const void *sendbuff, void *recvbuff, size_t recvcount, axCclDataType dtype, int32_t root, axCclComm comm, axclrtStream stream);
```

#### Parameters

N/A

#### Note

Root's `sendbuff` holds worldSize * recvcount elements. Non-root ranks may pass NULL for `sendbuff`. Root may pass IN_PLACE as recvbuff, or its exact logical-rank slice of sendbuff. The full root source remains unchanged. Other ranks provide recvbuff normally; other active partial overlaps are rejected.

#### Returns

N/A

<br>

<a id="axCclSend"></a>

### axCclSend

Send `count` elements to rank `peer` (matches a Recv on `peer`).

#### Function

```c
AX_CCL_EXPORT axclError axCclSend(const void *sendbuff, size_t count, axCclDataType dtype, int32_t peer, axCclComm comm, axclrtStream stream);
```

#### Parameters

N/A

#### Note

Single-process domains support 1..8 ranks, count zero, and all storage types. Self Send/Recv requires both matched sides in a Group and uses local DMA. Buffers are device addresses aligned to the element width; IN_PLACE is unsupported. Both peers must have registered communicators. Only these two peers execute; other ranks need not submit an operation. Use the context captured at CommInitRootInfo (the default context for CommInitAll). Rebinding to a different/default application stream requires the same Context and bounded proof that all prior parent/pair work is complete. A bare successful call has enqueued its own side. The caller must submit compatible opposite roles/counts/types in the same per-pair order before synchronizing; bare calls are not reordered or held on the Host. A P2P Group must contain both sides of each transfer; it may reorder jobs and supports reciprocal transfers with distinct buffers. On one device, no receive range may overlap any send or other receive in that group. An exact alias of one matched self-copy is permitted. Mixed P2P/collective Groups validate complete phases and ordering before enqueue. Complete previously unmatched bare submissions before submitting a P2P Group. At a signal-window boundary, unmatched submissions anywhere in this domain return INVALID_STATE without enqueue or drain: submit the missing peers and retry. Finalize with unmatched submissions instead makes the domain terminal and retains resources. Keep streams, contexts and buffers alive until completion; serialize other domains sharing these devices. In Linux multi-process mode, a bare call waits for the matching peer's single-call batch and both enqueue ACKs. A pure P2P Group collects at most 32 calls per process on one Context/Stream in the same domain. Each pair's batch cardinality must match across processes; opposite roles/counts/types match in per-direction FIFO order, with local interleaving allowed to differ. Only the participating pairs/component rendezvous for P2P submission. Automatic bootstrap first requires all declared parent ranks to initialize; nonparticipating ranks may then remain idle during the P2P transfer. Bare self-transfer is unsupported; grouped matched self-copy is supported. The group overlap rules above also apply. P2P and collectives must use separate multi-process Groups. Buffers must be producer-owned Runtime Token-VAs; original addresses and interior spans are validated by axclrtTokenVaResolve before IPC proof and launch. Finalize still requires every parent rank.

#### Returns

N/A
