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

AXCL 提供 [axclrtMalloc](../c/memory_api.md#axclrtMalloc) 和 [axclrtMallocCached](../c/memory_api.md#axclrtMallocCached) 在 Device 侧分配内存，并通过 `devPtr` 返回给 Host。Host 侧将 `devPtr` 作为 Device 内存句柄传递给 AXCL runtime API。

| 操作 | API | 说明 |
|---|---|---|
| 分配 Device 内存 | [axclrtMalloc](../c/memory_api.md#axclrtMalloc) | 分配物理连续 Device 内存 |
| 分配 cached Device 内存 | [axclrtMallocCached](../c/memory_api.md#axclrtMallocCached) | 分配具有 cached 属性的 Device 内存，cached 属性可通过 `axclrtPointerGetAttributes` 查询 |
| 释放 Device 内存 | [axclrtFree](../c/memory_api.md#axclrtFree) | 释放 `axclrtMalloc` / `axclrtMallocCached` 分配的内存 |

```{important}
`devPtr` 不是 Host 进程中的有效可访问地址，不能在 Host 侧直接解引用。
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
```

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
| [AXCL_MEMCPY_HOST_PHY_TO_DEVICE](../c/reference/enum.md#AXCL_MEMCPY_HOST_PHY_TO_DEVICE) | Host 物理内存到 Device 物理内存 |
| [AXCL_MEMCPY_DEVICE_TO_HOST_PHY](../c/reference/enum.md#AXCL_MEMCPY_DEVICE_TO_HOST_PHY) | Device 物理内存到 Host 物理内存 |

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
| [axclrtMemcpy](../c/memory_api.md#axclrtMemcpy) | 同步拷贝 Host / Device 数据 | Host 内存、Device 内存 |
| [axclrtMemcpyAsync](../c/memory_api.md#axclrtMemcpyAsync) | 向 Stream 提交异步拷贝请求 | Host 内存、Device 内存 |
| [axclrtMemset](../c/memory_api.md#axclrtMemset) | 同步设置 Device 内存内容 | Device 内存 |
| [axclrtMemsetAsync](../c/memory_api.md#axclrtMemsetAsync) | 向 Stream 提交异步 Device 内存设置请求 | Device 内存 |
| [axclrtMemcmp](../c/memory_api.md#axclrtMemcmp) | 同步比较两段 Device 内存 | Device 内存 |
| [axclrtMemcmpAsync](../c/memory_api.md#axclrtMemcmpAsync) | 向 Stream 提交异步 Device 内存比较请求 | Device 内存 |
| [axclrtGetMemInfo](../c/memory_api.md#axclrtGetMemInfo) | 查询 Device 侧内存容量信息 | Device 内存 |
| [axclrtPointerGetAttributes](../c/memory_api.md#axclrtPointerGetAttributes) | 查询指针位置和 flags | Host 内存、Device 内存 |
