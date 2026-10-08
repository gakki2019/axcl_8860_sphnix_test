# 内存管理

本文介绍 AXCL 在主从架构下的内存模型，以及内存分配、数据搬运和同步边界相关的 runtime API。

在单 SoC 场景中，应用通常面对本地操作系统、本地进程地址空间和本地设备内存层次。AXCL 面向主从架构，Host 侧运行应用和 AXCL runtime，Device 侧提供 AI 计算、媒体处理等硬件能力；两侧地址空间不同，跨端数据访问由 AXCL runtime API 完成。

与单 SoC 场景相比，AXCL 的内存管理更强调 Host 和 Device 之间的边界。Host 虚拟地址、Host 物理地址和 Device 地址具有不同语义，`devPtr` 是传递给 AXCL API 的 Device 内存句柄。

AXCL 提供同步和异步两类拷贝接口，用于在 Host / Device 之间搬运数据。同步拷贝接口返回时，本次拷贝已经完成；异步拷贝接口返回时，只表示拷贝请求已经提交，数据是否可用还需要通过对应的 Stream、Event 或同步接口确认。

```{image} ../../asserts/memory.svg
:alt: AXCL Host-Device 内存关系示意图
:align: center
```

上图展示 AXCL 主从架构下的基本内存访问边界：

- Host 应用只能直接访问 Host buffer；
- Device memory 不能在 Host 中直接解引用，需要通过 AXCL runtime API 完成 Host / Device 数据搬运。

## 1. 内存对象

### 1.1. Device 内存

AXCL 提供 [axclrtMalloc](../c/memory_api.md#axclrtMalloc) 和 [axclrtMallocCached](../c/memory_api.md#axclrtMallocCached) 在 Device 侧分配内存，并通过 `devPtr` 返回给 Host。Host 侧将 `devPtr` 作为 Device 内存句柄传递给 AXCL runtime API。`devPtr` 的值不是 Device 物理地址，不能直接传给 NATIVE SDK 接口。

| 操作 | API | 说明 |
|---|---|---|
| 分配 Device 内存 | [axclrtMalloc](../c/memory_api.md#axclrtMalloc) | 分配物理连续 Device 内存 |
| 分配 cached Device 内存 | [axclrtMallocCached](../c/memory_api.md#axclrtMallocCached) | 分配具有 cached 属性的 Device 内存，cached 属性可通过 `axclrtPointerGetAttributes` 查询 |
| 释放 Device 内存 | [axclrtFree](../c/memory_api.md#axclrtFree) | 释放 `axclrtMalloc` / `axclrtMallocCached` 分配的内存 |

```{important}
- `devPtr` 不是 Host 进程中的有效可访问地址，不能在 Host 侧直接解引用。
- [axclrtFree](../c/memory_api.md#axclrtFree) 必须传入 [axclrtMalloc](../c/memory_api.md#axclrtMalloc) / [axclrtMallocCached](../c/memory_api.md#axclrtMallocCached) 返回的基地址，不接受偏移后的指针。
```

### 1.2. Host 内存

AXCL 提供 [axclrtMallocHost](../c/memory_api.md#axclrtMallocHost) 在 Host 侧分配内存，并由 Host 应用直接读写。

| 操作 | API | 说明 |
|---|---|---|
| 分配 Host 虚拟内存 | [axclrtMallocHost](../c/memory_api.md#axclrtMallocHost) | 功能类似标准 `malloc` |
| 释放 Host 虚拟内存 | [axclrtFreeHost](../c/memory_api.md#axclrtFreeHost) | 释放 `axclrtMallocHost` 分配的内存 |

```{note}
1. 支持使用标准库 `malloc` 分配的内存用于 Host ↔ Device 拷贝，但推荐使用 [axclrtMallocHost](../c/memory_api.md#axclrtMallocHost)。[axclrtMallocHost](../c/memory_api.md#axclrtMallocHost) 分配的内存性能更优，且可通过 [axclrtPointerGetAttributes](../c/memory_api.md#axclrtPointerGetAttributes) 查询属性。
2. Host 内存需要按分配接口配对释放：[axclrtMallocHost](../c/memory_api.md#axclrtMallocHost) 分配的内存使用 [axclrtFreeHost](../c/memory_api.md#axclrtFreeHost) 释放；标准库 `malloc` 分配的内存使用标准库 `free` 释放。两类分配和释放接口不能混用。
3. [axclrtMallocHost](../c/memory_api.md#axclrtMallocHost) 分配的内存属于进程级 DMA 会话，分配和释放时都不需要设置当前 Context，但进程内至少需要有一个已打开且可用的设备。该内存可用于进程内任意已打开的设备，在被释放或进程内最后一个已打开的设备被 reset 之前一直有效。
```

```{important}
- 调用 [axclrtFreeHost](../c/memory_api.md#axclrtFreeHost) 前，必须确保所有使用该内存的异步操作已经完成。
- [axclrtMallocHost](../c/memory_api.md#axclrtMallocHost) / [axclrtFreeHost](../c/memory_api.md#axclrtFreeHost) 需要与关闭设备的操作以及 [axclFinalize](../c/system_api.md#axclFinalize) 串行调用。关闭设备的操作包括 [axclrtResetDevice](../c/device_api.md#axclrtResetDevice)、[axclrtResetDeviceForce](../c/device_api.md#axclrtResetDeviceForce)，以及释放设备最后一个激活引用的 [axclrtDestroyContext](../c/context_api.md#axclrtDestroyContext)。
```

### 1.3. 外部 Device 内存

NATIVE SDK 接口（例如 `AX_XXX_YYYY` 类接口）使用 Device 物理地址和 Device 虚拟地址描述内存，与 AXCL 的 `devPtr` 句柄不同。AXCL 提供以下接口，在两者之间转换同一块 Device 内存，使 NATIVE SDK 接口和 AXCL runtime API 可以配合使用。地址和大小通过 [axclrtDevMemDesc](../c/reference/struct.md#axclrtDevMemDesc) 传递。

| 操作 | API | 说明 |
|---|---|---|
| 导出 Device 地址 | [axclrtMemGetDevAddr](../c/memory_api.md#axclrtMemGetDevAddr) | 由 `devPtr` 导出 Device 物理地址和虚拟地址，供 NATIVE SDK 接口使用 |
| 注册外部 Device 内存 | [axclrtMemMapDevAddr](../c/memory_api.md#axclrtMemMapDevAddr) | 将 NATIVE SDK 接口返回的 Device 物理地址和虚拟地址注册为 `devPtr` 句柄 |
| 注销外部 Device 内存 | [axclrtMemUnmapDevAddr](../c/memory_api.md#axclrtMemUnmapDevAddr) | 注销由 `axclrtMemMapDevAddr` 注册的 `devPtr` 句柄 |
| 查询地址范围 | [axclrtMemGetAddressRange](../c/memory_api.md#axclrtMemGetAddressRange) | 查询 `devPtr` 所属分配或注册的基地址句柄和总大小 |

```{important}
- [axclrtMemMapDevAddr](../c/memory_api.md#axclrtMemMapDevAddr) 只创建 `devPtr` 句柄，不创建 NATIVE 虚拟地址映射，也不接管外部内存的所有权。传入的物理地址必须是 Device 物理地址，不能是 `devPtr`；调用者需要保证物理地址和虚拟地址对应同一块有效内存。
- [axclrtMemUnmapDevAddr](../c/memory_api.md#axclrtMemUnmapDevAddr) 只注销该句柄，不释放 NATIVE 内存。外部内存需要在所有使用该句柄的操作完成后，通过对应的 NATIVE SDK 接口释放。
- 设备被 reset 后，该设备上已注册的句柄全部失效，不能再使用，也不能再传给 [axclrtMemUnmapDevAddr](../c/memory_api.md#axclrtMemUnmapDevAddr)。
```

典型调用流程参见 [外部 Device 内存互操作](memory.md#memory-external-device-memory)。

### 1.4. 跨进程共享内存

AXCL 提供以下接口，在多个进程之间共享同一块 Device 内存。分配内存的进程（Producer）导出 IPC Key，其他进程（Consumer）凭 IPC Key 导入，得到本进程内可用的 `devPtr` 句柄。双方访问的是同一块 Device 内存，不需要拷贝数据。

| 操作 | API | 说明 |
|---|---|---|
| 导出 | [axclrtIpcMemGetExportKey](../c/memory_api.md#axclrtIpcMemGetExportKey) | Producer 导出本进程分配的 Device 内存基地址，得到 IPC Key |
| 设置导入白名单 | [axclrtIpcMemSetImportPid](../c/memory_api.md#axclrtIpcMemSetImportPid) | Producer 设置允许导入该 IPC Key 的进程（Host TGID） |
| 查询 Host TGID | [axclrtDeviceGetBareTgid](../c/device_api.md#axclrtDeviceGetBareTgid) | Consumer 查询自身在初始 PID 命名空间中的 TGID，供 Producer 设置白名单 |
| 导入 | [axclrtIpcMemImportByKey](../c/memory_api.md#axclrtIpcMemImportByKey) | Consumer 凭 IPC Key 导入，得到本进程的 `devPtr` 句柄 |
| 关闭 | [axclrtIpcMemClose](../c/memory_api.md#axclrtIpcMemClose) | Producer 和 Consumer 各自释放 IPC 引用 |

```{important}
- 共享内存的生命周期由 Producer 决定。Producer 必须保证内存在所有 Consumer 使用结束前不被释放，否则 Consumer 的硬件访问结果未定义；Consumer 关闭 IPC Key 或释放自己的句柄，不会延长 Producer 内存的生命周期。
- 对同一个 IPC Key，所有 Consumer 应先于 Producer 调用 [axclrtIpcMemClose](../c/memory_api.md#axclrtIpcMemClose)。
- Consumer 调用 [axclrtFree](../c/memory_api.md#axclrtFree) 只释放本进程的映射，不释放 Device 物理内存。
- 在 Docker、Kubernetes 等容器环境中，白名单必须使用 [axclrtDeviceGetBareTgid](../c/device_api.md#axclrtDeviceGetBareTgid) 返回的 Host TGID，不能使用 `getpid` 返回的容器内 PID。
```

典型调用流程参见 [跨进程共享内存](memory.md#memory-ipc-shared-memory)。

## 2. 数据搬运

典型任务流程通常包含 Host 准备输入、Host-to-Device 拷贝、Device 侧任务执行、Device-to-Host 拷贝四个阶段。

以 CNN 检测模型为例，Host 将输入图像拷贝到 Device，Device 完成推理后，再将检测结果拷贝回 Host。

```{image} ../../asserts/memory_cnn_flow.svg
:alt: CNN 检测模型 Host-Device 数据搬运示意图
:align: center
```

### 2.1. 拷贝方向

AXCL 使用 [axclrtMemcpyKind](../c/reference/enum.md#axclrtMemcpyKind) 描述拷贝方向：

| 拷贝类型 | 方向 |
|---|---|
| [AXCL_MEMCPY_HOST_TO_HOST](../c/reference/enum.md#AXCL_MEMCPY_HOST_TO_HOST) | Host 虚拟内存到 Host 虚拟内存 |
| [AXCL_MEMCPY_HOST_TO_DEVICE](../c/reference/enum.md#AXCL_MEMCPY_HOST_TO_DEVICE) | Host 虚拟内存到 Device 物理内存 |
| [AXCL_MEMCPY_DEVICE_TO_HOST](../c/reference/enum.md#AXCL_MEMCPY_DEVICE_TO_HOST) | Device 物理内存到 Host 虚拟内存 |
| [AXCL_MEMCPY_DEVICE_TO_DEVICE](../c/reference/enum.md#AXCL_MEMCPY_DEVICE_TO_DEVICE) | Device 物理内存到 Device 物理内存 |

<a id="memory-synchronous-copy"></a>

### 2.2. 同步拷贝

[axclrtMemcpy](../c/memory_api.md#axclrtMemcpy) 是同步拷贝接口。对于 Host ↔ Device 拷贝，调用返回表示本次同步拷贝已经完成。

以下示例展示核心调用顺序，省略 [axclInit](../c/system_api.md#axclInit) / [axclFinalize](../c/system_api.md#axclFinalize) 和错误码检查。

```c
void *hostMem = NULL;
void *devMem = NULL;
size_t size = 1024 * 1024;

axclrtSetDevice(0);

axclrtMallocHost(&hostMem, size);
axclrtMalloc(&devMem, size, AXCL_MEM_MALLOC_HUGE_FIRST);

/* Host 侧填充 hostMem 后，同步拷贝到 Device。 */
axclrtMemcpy(devMem, hostMem, size, AXCL_MEMCPY_HOST_TO_DEVICE);

axclrtFree(devMem);
axclrtFreeHost(hostMem);
axclrtResetDevice(0);
```

<a id="memory-asynchronous-copy"></a>

### 2.3. 异步拷贝

[axclrtMemcpyAsync](../c/memory_api.md#axclrtMemcpyAsync) 会把拷贝请求与指定 [axclrtStream](../c/reference/struct.md#axclrtStream) 关联，使拷贝和同一 Stream 中的其他 Task 按提交顺序执行。

```c
axclrtStream stream;
void *hostIn = NULL;
void *hostOut = NULL;
void *devIn = NULL;
void *devOut = NULL;
size_t size = 1024 * 1024;

axclrtSetDevice(0);
axclrtCreateStream(&stream);

axclrtMallocHost(&hostIn, size);
axclrtMallocHost(&hostOut, size);
axclrtMalloc(&devIn, size, AXCL_MEM_MALLOC_HUGE_FIRST);
axclrtMalloc(&devOut, size, AXCL_MEM_MALLOC_HUGE_FIRST);

/* H2D 拷贝进入 stream。 */
axclrtMemcpyAsync(devIn, hostIn, size, AXCL_MEMCPY_HOST_TO_DEVICE, stream);

/* 同一 stream 中后续推理会在 H2D 拷贝之后执行，并写入 devOut。 */
axclrtEngineExecuteAsync(..., stream);

/* D2H 拷贝会在前序推理写入 devOut 之后执行。 */
axclrtMemcpyAsync(hostOut, devOut, size, AXCL_MEMCPY_DEVICE_TO_HOST, stream);

/* 等待 stream 中所有已提交任务完成。 */
axclrtSynchronizeStream(stream);

axclrtFree(devOut);
axclrtFree(devIn);
axclrtFreeHost(hostOut);
axclrtFreeHost(hostIn);
axclrtDestroyStream(stream);
axclrtResetDevice(0);
```

```{important}
- [axclrtMemcpyAsync](../c/memory_api.md#axclrtMemcpyAsync) 成功返回时，拷贝只是提交到了指定 Stream，并不表示数据已经拷贝完成。异步拷贝的完成状态可通过同步该 Stream、等待记录在该 Stream 上的 Event，或使用 Device 级同步接口确认。
```

<a id="memory-inter-device-copy"></a>

### 2.4. 设备间拷贝

以下示例演示将 Device 0 上的内存复制到 Device 1。调用者需要先确认两个设备之间支持 Peer Access，再分别开启两个方向的访问权限。以下代码省略错误处理。

```c
axclInit(NULL);

int32_t canAccessPeer = 0;
axclrtDeviceCanAccessPeer(&canAccessPeer, 0, 1);
if (canAccessPeer == 1) {
    uint32_t reserved = 0U;

    axclrtSetDevice(0);
    axclrtDeviceEnablePeerAccess(1, reserved);

    void *dev0Mem = NULL;
    axclrtMalloc(&dev0Mem, 10, AXCL_MEM_MALLOC_NORMAL_ONLY);

    axclrtSetDevice(1);
    axclrtDeviceEnablePeerAccess(0, reserved);

    void *dev1Mem = NULL;
    axclrtMalloc(&dev1Mem, 10, AXCL_MEM_MALLOC_NORMAL_ONLY);

    /* 将 Device 0 上的数据复制到 Device 1。 */
    axclrtMemcpy(dev1Mem, dev0Mem, 10, AXCL_MEMCPY_DEVICE_TO_DEVICE);

    axclrtDeviceDisablePeerAccess(0);
    axclrtFree(dev1Mem);
    axclrtResetDevice(1);

    axclrtSetDevice(0);
    axclrtDeviceDisablePeerAccess(1);
    axclrtFree(dev0Mem);
    axclrtResetDeviceForce(0);
}

axclFinalize();
```

<a id="memory-external-device-memory"></a>

### 2.5. 外部 Device 内存互操作

以下示例展示 AXCL 内存与 NATIVE SDK 接口之间互相传递内存的两个方向，`AX_XXX_YYYY` 表示 NATIVE SDK 接口。以下代码省略错误码检查。

AXCL 分配的内存传给 NATIVE SDK 接口：

```c
void *devMem = NULL;
axclrtDevMemDesc desc = {0};
size_t size = 1024 * 1024;

axclrtSetDevice(0);
axclrtMalloc(&devMem, size, AXCL_MEM_MALLOC_HUGE_FIRST);

/* 导出 devMem 对应的 Device 物理地址和虚拟地址。access_size 为 0 表示导出到该分配末尾。 */
axclrtMemGetDevAddr(devMem, 0, &desc);

/* 将 Device 地址传给 NATIVE SDK 接口。接口执行期间，devMem 必须保持有效。 */
AX_XXX_YYYY(..., desc.device_pa, desc.device_va, ...);

axclrtFree(devMem);
axclrtResetDevice(0);
```

NATIVE SDK 接口输出的内存交给 AXCL 使用：

```c
void *hostMem = NULL;
void *devMem = NULL;
axclrtDevMemDesc desc = {0};
uint64_t phyAddr = 0;
uint64_t virAddr = 0;
size_t size = 1024 * 1024;

axclrtSetDevice(0);
axclrtMallocHost(&hostMem, size);

/* NATIVE SDK 接口输出一块内存，得到 Device 物理地址 phyAddr 和虚拟地址 virAddr。virAddr 可以为 0。 */
AX_XXX_YYYY(..., &phyAddr, &virAddr, ...);

desc.device_id = 0;
desc.device_pa = phyAddr;
desc.device_va = virAddr;
desc.size = size;

/* 将这块内存注册为 devPtr 句柄，之后可传给 AXCL runtime API。 */
axclrtMemMapDevAddr(&desc, &devMem);
axclrtMemcpy(hostMem, devMem, size, AXCL_MEMCPY_DEVICE_TO_HOST);

/* 先注销句柄，再通过 NATIVE SDK 接口释放这块内存。 */
axclrtMemUnmapDevAddr(devMem);
AX_XXX_YYYY_Release(...);

axclrtFreeHost(hostMem);
axclrtResetDevice(0);
```

<a id="memory-ipc-shared-memory"></a>

### 2.6. 跨进程共享内存

以下示例展示 Producer 进程分配内存，Consumer 进程导入并读取。两个进程之间传递 TGID 和 IPC Key 的方式由应用自行选择，示例中用 `send_to_xxx` / `receive_from_xxx` 表示。以下代码省略错误码检查。

Producer 进程：

```c
void *devMem = NULL;
char key[AXCL_IPC_KEY_MAX_LEN];
int32_t consumerTgid = 0;
size_t size = 1024 * 1024;

axclrtSetDevice(0);
axclrtMalloc(&devMem, size, AXCL_MEM_MALLOC_HUGE_FIRST);

/* 导出 devMem，得到 IPC Key。 */
axclrtIpcMemGetExportKey(devMem, key, sizeof(key), AXCL_IPC_EXPORT_FLAG_DEFAULT);

/* 获取 Consumer 的 Host TGID，并设置为允许导入该 IPC Key 的进程。 */
receive_from_consumer(&consumerTgid);
axclrtIpcMemSetImportPid(key, &consumerTgid, 1);

/* 将 IPC Key 传给 Consumer，等待所有 Consumer 使用结束。 */
send_to_consumer(key);
wait_for_consumer_done();

axclrtIpcMemClose(key);
axclrtFree(devMem);
axclrtResetDevice(0);
```

Consumer 进程：

```c
void *hostMem = NULL;
void *devMem = NULL;
char key[AXCL_IPC_KEY_MAX_LEN];
int32_t bareTgid = 0;
size_t size = 1024 * 1024;

axclrtSetDevice(0);
axclrtMallocHost(&hostMem, size);

/* 获取本进程的 Host TGID，并通知 Producer。容器环境中必须使用该接口，不能使用 getpid。 */
axclrtDeviceGetBareTgid(&bareTgid);
send_to_producer(bareTgid);

/* 收到 IPC Key 后导入，得到本进程可用的 devPtr 句柄。 */
receive_from_producer(key);
axclrtIpcMemImportByKey(&devMem, key);

axclrtMemcpy(hostMem, devMem, size, AXCL_MEMCPY_DEVICE_TO_HOST);

/* 先关闭 IPC Key，再释放本进程的映射，最后通知 Producer。 */
axclrtIpcMemClose(key);
axclrtFree(devMem);
notify_producer_done();

axclrtFreeHost(hostMem);
axclrtResetDevice(0);
```

## 3. 其他内存操作

AXCL 还提供 Device 内存置位和比较接口：

| 操作 | 同步 API | 异步 API | 说明 |
|---|---|---|---|
| Device 内存置位 | [axclrtMemset](../c/memory_api.md#axclrtMemset) | [axclrtMemsetAsync](../c/memory_api.md#axclrtMemsetAsync) | `axclrtMemset` 仅支持 Device 内存 |
| Device 内存比较 | [axclrtMemcmp](../c/memory_api.md#axclrtMemcmp) | [axclrtMemcmpAsync](../c/memory_api.md#axclrtMemcmpAsync) | 用于比较两段 Device 内存；同步接口在内容相同时返回 `AXCL_SUCC` |

## 4. 重要API

| API | 功能 | 内存对象 |
|---|---|---|
| [axclrtMalloc](../c/memory_api.md#axclrtMalloc) | 分配 Device 内存 | Device 内存 |
| [axclrtMallocCached](../c/memory_api.md#axclrtMallocCached) | 分配具有 cached 属性的 Device 内存 | Device 内存 |
| [axclrtFree](../c/memory_api.md#axclrtFree) | 释放 `axclrtMalloc` / `axclrtMallocCached` 分配的内存 | Device 内存 |
| [axclrtMallocHost](../c/memory_api.md#axclrtMallocHost) | 分配 Host 虚拟内存 | Host 内存 |
| [axclrtFreeHost](../c/memory_api.md#axclrtFreeHost) | 释放 `axclrtMallocHost` 分配的内存 | Host 内存 |
| [axclrtMemGetAddressRange](../c/memory_api.md#axclrtMemGetAddressRange) | 查询 `devPtr` 所属分配或注册的基地址句柄和总大小 | Device 内存 |
| [axclrtMemGetDevAddr](../c/memory_api.md#axclrtMemGetDevAddr) | 由 `devPtr` 导出 Device 物理地址和虚拟地址 | Device 内存 |
| [axclrtMemMapDevAddr](../c/memory_api.md#axclrtMemMapDevAddr) | 将外部 Device 内存注册为 `devPtr` 句柄 | Device 内存 |
| [axclrtMemUnmapDevAddr](../c/memory_api.md#axclrtMemUnmapDevAddr) | 注销由 `axclrtMemMapDevAddr` 注册的句柄 | Device 内存 |
| [axclrtIpcMemGetExportKey](../c/memory_api.md#axclrtIpcMemGetExportKey) | 导出 Device 内存并获取 IPC Key | Device 内存 |
| [axclrtIpcMemSetImportPid](../c/memory_api.md#axclrtIpcMemSetImportPid) | 设置允许导入 IPC Key 的进程白名单 | Device 内存 |
| [axclrtIpcMemImportByKey](../c/memory_api.md#axclrtIpcMemImportByKey) | 凭 IPC Key 导入共享 Device 内存 | Device 内存 |
| [axclrtIpcMemClose](../c/memory_api.md#axclrtIpcMemClose) | 关闭 IPC Key 并释放 IPC 引用 | Device 内存 |
| [axclrtMemcpy](../c/memory_api.md#axclrtMemcpy) | 同步拷贝 Host / Device 数据 | Host 内存、Device 内存 |
| [axclrtMemcpyAsync](../c/memory_api.md#axclrtMemcpyAsync) | 向 Stream 提交异步拷贝请求 | Host 内存、Device 内存 |
| [axclrtMemset](../c/memory_api.md#axclrtMemset) | 同步设置 Device 内存内容 | Device 内存 |
| [axclrtMemsetAsync](../c/memory_api.md#axclrtMemsetAsync) | 向 Stream 提交异步 Device 内存设置请求 | Device 内存 |
| [axclrtMemcmp](../c/memory_api.md#axclrtMemcmp) | 同步比较两段 Device 内存 | Device 内存 |
| [axclrtMemcmpAsync](../c/memory_api.md#axclrtMemcmpAsync) | 向 Stream 提交异步 Device 内存比较请求 | Device 内存 |
| [axclrtGetMemInfo](../c/memory_api.md#axclrtGetMemInfo) | 查询 Device 侧内存容量信息 | Device 内存 |
| [axclrtPointerGetAttributes](../c/memory_api.md#axclrtPointerGetAttributes) | 查询指针位置和 flags | Host 内存、Device 内存 |
