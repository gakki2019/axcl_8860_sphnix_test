# AXCCL

## Index

- [axCclAllGather](#axCclAllGather): AllGather: gather `sendcount` elements from every rank into `recvbuff` on every rank.
- [axCclAllReduce](#axCclAllReduce): AllReduce: element-wise `op` reduction of `sendbuff` across all ranks, result on all.
- [axCclAllToAll](#axCclAllToAll): AllToAll: uniform exchange. Rank i sends `count` elements to every rank j; `recvbuff` receives `count` elements from every rank.
- [axCclAllToAllV](#axCclAllToAllV): AllToAllV: variable-size exchange (maps to ProcessGroup.all_to_all_single).
- [axCclBarrier](#axCclBarrier)
- [axCclBroadcast](#axCclBroadcast): Broadcast: copy `count` elements from `root` to all ranks.
- [axCclCommAbort](#axCclCommAbort): Abort a communicator immediately. Used for fault containment; outstanding operations may be discarded. The handle still must be freed with [axCclCommDestroy](#axCclCommDestroy).
- [axCclCommCount](#axCclCommCount)
- [axCclCommDeregister](#axCclCommDeregister)
- [axCclCommDestroy](#axCclCommDestroy)
- [axCclCommDevice](#axCclCommDevice)
- [axCclCommFinalize](#axCclCommFinalize): Finalize communicator resources and mark `comm` unusable.
- [axCclCommGetAsyncError](#axCclCommGetAsyncError): Read and clear the asynchronous error state of `comm`.
- [axCclCommInitAll](#axCclCommInitAll): Create one communicator per device within a single process (multi-device-per-thread).
- [axCclCommInitRank](#axCclCommInitRank): Create a single communicator by rank (NCCL-style convenience).
- [axCclCommInitRootInfo](#axCclCommInitRootInfo): Create a communicator from broadcasted root information (recommended bootstrap path).
- [axCclCommRank](#axCclCommRank)
- [axCclCommRegister](#axCclCommRegister): Register a device buffer for optimized access across ranks/processes. Optional; safe to skip. Returns an opaque handle usable with future local-access primitives.
- [axCclFinalize](#axCclFinalize): Deinitialize the CCL module and release module-wide resources.
- [axCclGather](#axCclGather)
- [axCclGetErrorString](#axCclGetErrorString): Description string for a CCL error code (covers CCL-module error ids). Thread-local.
- [axCclGetRootInfo](#axCclGetRootInfo): Generate bootstrap root information on rank 0.
- [axCclGetVersion](#axCclGetVersion)
- [axCclGroupEnd](#axCclGroupEnd)
- [axCclGroupStart](#axCclGroupStart): Collect one AllReduce per participating rank on a single Host thread.
- [axCclInit](#axCclInit): Initialize the CCL module.
- [axCclRecv](#axCclRecv)
- [axCclRedOpCreatePreMulSum](#axCclRedOpCreatePreMulSum): Create a "pre-multiplied sum" reduction operator: result = sum(scalar_i * x_i).
- [axCclRedOpDestroy](#axCclRedOpDestroy)
- [axCclReduce](#axCclReduce): Reduce: element-wise `op` reduction onto `root` only.
- [axCclReduceScatter](#axCclReduceScatter): ReduceScatter: reduce `op` across ranks, then scatter the result in equal slices.
- [axCclScatter](#axCclScatter)
- [axCclSend](#axCclSend)

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
| sendbuff | in | Source device buffer, distinct from recvbuff in grouped mode. |
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

#### Returns

N/A

<br>

<a id="axCclBarrier"></a>

### axCclBarrier

@ : @ .

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

On the root rank, `sendbuff` holds the data; on non-root ranks `sendbuff` is ignored and `recvbuff` receives the data. Pass [AX_CCL_IN_PLACE](reference/macro.md#AX_CCL_IN_PLACE) as `sendbuff` to use `recvbuff` in place on every rank.

#### Returns

N/A

<br>

<a id="axCclCommAbort"></a>

### axCclCommAbort

Abort a communicator immediately. Used for fault containment; outstanding operations may be discarded. The handle still must be freed with [axCclCommDestroy](#axCclCommDestroy).

#### Function

```c
AX_CCL_EXPORT axclError axCclCommAbort(axCclComm comm);
```

#### Parameters

N/A

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

For a grouped domain, the first finalize synchronizes ALL participating application streams, destroys completed executions and domain signals, and closes the entire domain to further collectives. Keep those streams, contexts and devices alive through this barrier. Finalize/destroy every communicator afterwards. Communicators that never participated in a grouped execution do not synchronize application streams. Calling finalize inside an unflushed group is rejected. A partial launch or uncertain completion returns an error and retains all peer resources; do not free buffers, destroy contexts, reset devices or tear down Runtime.

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

Read and clear the asynchronous error state of `comm`.

Returns AXCL_SUCC with `err` == AXCL_SUCC when no async error is pending. On error, `err` receives the error code and the communicator enters a failed state (use [axCclCommAbort](#axCclCommAbort)).

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

Supports 2 to 8 distinct logical Device IDs in one Host process. Four devices are the primary current topology; the implementation accepts the full protocol range. Array order assigns logical ranks only; it does not declare a ring. For the bounded C2C AllReduce, Host orders participating ranks by their actual local chip_id ascending and validates each resulting directed C2C peer is online. This is a static rule, not hardware adjacency discovery. Caller context is unchanged.

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

This call blocks until all ranks have reached it. The calling thread must first activate `deviceId` with [axclrtSetDevice](device_api.md#axclrtSetDevice).

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

Register a device buffer for optimized access across ranks/processes. Optional; safe to skip. Returns an opaque handle usable with future local-access primitives.

#### Function

```c
AX_CCL_EXPORT axclError axCclCommRegister(axCclComm comm, void *buff, size_t size, void **handle);
```

#### Parameters

N/A

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

@ : @ @ .

#### Function

```c
AX_CCL_EXPORT axclError axCclGather(const void *sendbuff, void *recvbuff, size_t sendcount, axCclDataType dtype, int32_t root, axCclComm comm, axclrtStream stream);
```

#### Parameters

N/A

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

@ . A successful return does not imply execution completion. Synchronize all rank streams before reusing/freeing any peer-accessible buffer. Before another round, this function first synchronizes all previous streams, destroys previous executions, and resets all persistent signals. Keep participating streams/contexts alive until that barrier or CommFinalize. On partial/uncertain launch the domain is terminal; its resources must remain alive for operator recovery, even after late completion. Failed or skipped CCL Run leaves a persistent error on its Worker stream so an earlier application synchronization cannot hide failure from the domain barrier. Keeping borrowed stream/context handles alive is mandatory; using freed handles violates Runtime API preconditions and is not detected by this interface.

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

Collect one AllReduce per participating rank on a single Host thread.

#### Function

```c
AX_CCL_EXPORT axclError axCclGroupStart(void);
```

#### Parameters

N/A

#### Note

Calls must use the same RootInfo domain, one call per rank, matching shape, FP32 SUM and one explicit stream per device. Calls only collect descriptors; GroupEnd prepares/binds all ranks before submitting all four executions. A validation error cancels the group. Nested groups, other operations and multiple collectives per group are unsupported. Use the same Host thread for subsequent rounds and finalization. No multi-process rendezvous is provided. Only one collective may be in flight in the Host process. Switching domains drains the previous domain before launching the next; its signals remain owned until finalization. A terminal domain blocks all subsequent launches.

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
| scalar | in | Pointer to the scalar, interpreted according to `datatype`. The pointer value is read (and, for device residence, dereferenced) at execution time. |
| datatype | in | Scalar type. |
| residence | in | Where `scalar` resides. |

#### Note

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

@ : @ @ .

#### Function

```c
AX_CCL_EXPORT axclError axCclScatter(const void *sendbuff, void *recvbuff, size_t recvcount, axCclDataType dtype, int32_t root, axCclComm comm, axclrtStream stream);
```

#### Parameters

N/A

#### Returns

N/A

<br>

<a id="axCclSend"></a>

### axCclSend

@ @ @ ( @ ).

#### Function

```c
AX_CCL_EXPORT axclError axCclSend(const void *sendbuff, size_t count, axCclDataType dtype, int32_t peer, axCclComm comm, axclrtStream stream);
```

#### Parameters

N/A

#### Returns

N/A
