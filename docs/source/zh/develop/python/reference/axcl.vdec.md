# axcl.vdec

## 1. 目录

- [axcl.vdec.init](#axcl.vdec.init): 初始化 VDEC 模块和硬件资源。本接口初始化 VDEC/JDEC 硬件模块并分配模块级公共资源。创建任何 VDEC 组前，必须先调用本接口。
- [axcl.vdec.deinit](#axcl.vdec.deinit): 去初始化 VDEC 模块并释放硬件资源。本接口释放模块级 VDEC/JDEC 资源并禁用硬件。
- [axcl.vdec.extract_stream_header_info](#axcl.vdec.extract_stream_header_info): 从压缩视频码流中提取基本头信息。本接口从 H.264/H.265 码流的 I 帧头（SPS）中提取参考帧数量、宽度和高度信息。
- [axcl.vdec.create_grp](#axcl.vdec.create_grp): 使用指定组 ID 创建 VDEC 组。本接口创建 VDEC 组并配置其静态组属性。组属性定义编解码类型、输入模式、最大图像大小、码流缓冲区、帧池所有权和参考帧数量。
- [axcl.vdec.create_grp_ex](#axcl.vdec.create_grp_ex): 创建 VDEC 组并自动分配组 ID。本接口创建 VDEC 组并自动分配可用组 ID。
- [axcl.vdec.destroy_grp](#axcl.vdec.destroy_grp): 销毁 VDEC 组。本接口销毁 VDEC 组并释放组级资源。
- [axcl.vdec.get_grp_attr](#axcl.vdec.get_grp_attr): 获取 VDEC 组的属性。本接口查询 VDEC 组的当前配置，包括编解码类型、输入模式、最大图像大小、码流缓冲区设置及其他组级属性。
- [axcl.vdec.set_grp_attr](#axcl.vdec.set_grp_attr): 设置 VDEC 组的属性。本接口修改已有 VDEC 组的特定静态属性。
- [axcl.vdec.start_recv_stream](#axcl.vdec.start_recv_stream): 启动 VDEC 组接收压缩码流。本接口将指定 VDEC 组切换到接收状态，以便后续调用（源码说明不完整）。
- [axcl.vdec.stop_recv_stream](#axcl.vdec.stop_recv_stream): 停止 VDEC 组接收压缩码流。本接口停止 VDEC 组接收新的压缩码流数据。解码器继续处理内部队列中的剩余数据。
- [axcl.vdec.query_status](#axcl.vdec.query_status): 查询 VDEC 组状态。本接口获取 VDEC 组当前运行状态，包括缓冲区使用情况、帧数和解码器状态信息。
- [axcl.vdec.reset_grp](#axcl.vdec.reset_grp): 将 VDEC 组复位为初始状态。本接口复位指定 VDEC 组，并清除所有已缓存的输入和输出数据。
- [axcl.vdec.set_grp_param](#axcl.vdec.set_grp_param): 设置 VDEC 组的高级参数。本接口更新 VDEC 组的组级解码参数。参数包括视频输出顺序、视频解码模式和源帧率。
- [axcl.vdec.get_grp_param](#axcl.vdec.get_grp_param): 获取 VDEC 组的高级参数。本接口获取 VDEC 组的当前高级配置，包括解码顺序、解码模式和源帧率。
- [axcl.vdec.set_grp_thread_bind](#axcl.vdec.set_grp_thread_bind): 为 VDEC 组分别设置 DEC 和 OUT 工作线程绑定策略。
- [axcl.vdec.get_grp_thread_bind](#axcl.vdec.get_grp_thread_bind): 获取 VDEC 组请求的 DEC 和 OUT 工作线程绑定策略。
- [axcl.vdec.select_grp](#axcl.vdec.select_grp): 检查哪些 VDEC 组当前有就绪的输出帧。本接口获取当前 VDEC 组集合的快照，返回输出队列中存在可用解码帧的组和通道。支持阻塞、非阻塞和超时模式。
- [axcl.vdec.send_stream](#axcl.vdec.send_stream): 向解码通道组发送码流数据。本接口向 VDEC 组提交压缩码流包。数据包内容和结束标志必须与所配置的输入模式匹配（源码未提供配置引用）。
- [axcl.vdec.get_chn_frame](#axcl.vdec.get_chn_frame): 从输出通道获取解码图像。本接口从指定 VDEC 组和通道获取一帧解码输出。返回的帧必须通过相应接口释放（源码未提供接口引用）。
- [axcl.vdec.release_chn_frame](#axcl.vdec.release_chn_frame): 释放解码输出通道图像缓冲区。本接口释放此前从 AX_VDEC_GetChnFrame 获取的帧缓冲区。
- [axcl.vdec.get_user_data](#axcl.vdec.get_user_data): 从解码码流中获取用户数据（SEI/COM）。本接口提取压缩码流中嵌入的用户数据。对于 H.264/H.265，获取 SEI（补充增强信息）消息。对于 JPEG/MJPEG，获取 COM（注释）标记。
- [axcl.vdec.release_user_data](#axcl.vdec.release_user_data): 释放从 VDEC 组获取的用户数据。本接口为兼容性保留，不执行内部释放操作。SDK 自动管理用户数据资源，应用无需调用本接口。
- [axcl.vdec.set_user_pic](#axcl.vdec.set_user_pic): 设置 VDEC 组的用户图像插入属性。本接口配置用户提供的图像属性，该图像可插入解码器输出流。用户图像通常在解码中断或首个有效帧到达前用作占位图像或默认图像。
- [axcl.vdec.enable_user_pic](#axcl.vdec.enable_user_pic): 启用 VDEC 组的用户图像插入。本接口启用 VDEC 组的用户图像输出。启用用户图像模式时，使用已配置的用户图像作为替代帧。调用本接口前（源码条件不完整）。
- [axcl.vdec.disable_user_pic](#axcl.vdec.disable_user_pic): 禁用 VDEC 组的用户图像插入。
- [axcl.vdec.set_display_mode](#axcl.vdec.set_display_mode): 设置 VDEC 组的显示模式。本接口配置 VDEC 组发送解码帧时与下游模块（如 IVPS）的交互方式。支持预览和回放两种模式，用于决定是否对解码器施加背压。
- [axcl.vdec.get_display_mode](#axcl.vdec.get_display_mode): 获取 VDEC 组的当前显示模式。本接口查询 VDEC 组的显示模式配置，以确定发送解码帧时与下游模块的交互方式。
- [axcl.vdec.attach_pool](#axcl.vdec.attach_pool): 将解码通道绑定到指定 VB（视频缓冲）池。本接口将用户创建的内存池挂载到 VDEC 输出通道。通道的解码帧缓冲区可从挂载的内存池分配。
- [axcl.vdec.detach_pool](#axcl.vdec.detach_pool): 将解码通道与指定 VB（视频缓冲）池解绑。本接口将此前挂载的内存池从 VDEC 输出通道解绑。解绑后，通道不再从该内存池分配输出帧缓冲区。
- [axcl.vdec.enable_chn](#axcl.vdec.enable_chn): 启用 VDEC 输出通道。本接口启用 VDEC 组内的指定输出通道，使其能够输出解码帧。默认禁用所有硬件输出通道。
- [axcl.vdec.disable_chn](#axcl.vdec.disable_chn): 禁用 VDEC 输出通道。本接口禁用 VDEC 组内的指定输出通道，使其不再输出解码帧。后续可通过相应接口重新启用通道（源码未提供接口引用）。
- [axcl.vdec.set_chn_attr](#axcl.vdec.set_chn_attr): 设置 VDEC 输出通道属性。本接口配置 VDEC 组内指定输出通道的属性，包括输出格式、分辨率、宽高比及其他显示参数。
- [axcl.vdec.get_chn_attr](#axcl.vdec.get_chn_attr): 获取 VDEC 通道属性。本接口查询 VDEC 组内指定通道的当前配置，包括输出格式、分辨率、宽高比及其他显示参数。返回的属性反映通道当前的运行时配置。
- [axcl.vdec.jpeg_decode_one_frame](#axcl.vdec.jpeg_decode_one_frame): 从调用者提供的物理连续缓冲区同步解码单个 JPEG 帧。本接口同步解码单幅 JPEG 图像，无需 VDEC 组或通道。适用于缩略图生成、快照提取或单次 JPEG 解码任务。
- [axcl.vdec.jpeg_decode_one_frame_ex](#axcl.vdec.jpeg_decode_one_frame_ex): 从普通进程内存中的已编码 JPEG 缓冲区解码 JPEG 图像，并在内部分配输出帧。本便捷接口解析 JPEG 分辨率，在内部分配所需输入和输出缓冲区，并同步解码图像。
- [axcl.vdec.jpeg_release_decode_frame_ex](#axcl.vdec.jpeg_release_decode_frame_ex): 释放 AX_VDEC_JpegDecodeOneFrameEx 返回的帧。
- [axcl.vdec.get_stream_buf_info](#axcl.vdec.get_stream_buf_info): 获取 VDEC 组的输入码流缓冲区信息。本接口查询指定 VDEC 组输入码流缓冲区的当前状态和配置，包括缓冲区大小、使用统计和队列深度信息。
- [axcl.vdec.get_vui_param](#axcl.vdec.get_vui_param): 从解码码流中获取 VUI（视频可用性信息）参数。本接口从指定 VDEC 组正在解码的 H.264/H.265 视频码流中提取 VUI 参数。VUI 包含视频特性的元数据，如宽高比、色彩原色、传递特性和矩阵系数。
- [axcl.vdec.get_pic_buffer_size](#axcl.vdec.get_pic_buffer_size): 计算解码图像的帧缓冲区大小。本接口根据指定尺寸、输出像素格式、可选 FBC 压缩配置和编解码载荷类型，计算存储一帧解码图像所需的字节数。配置解码通道时，使用返回值设置 AX_VDEC_CHN_ATTR_T 的 u32FrameBufSize 字段。
- [axcl.vdec.get_yuv_buffer_size](#axcl.vdec.get_yuv_buffer_size): 计算 JPEG 解码图像的 YUV 缓冲区大小。本接口按指定尺寸和输出格式，计算存储一帧 JPEG 解码图像所需的字节数，宽度和高度均按 16 对齐。

<br>

## 2. API

<a id="axcl.vdec.init"></a>

### 2.1. axcl.vdec.init

初始化 VDEC 模块和硬件资源。本接口初始化 VDEC/JDEC 硬件模块并分配模块级公共资源。创建任何 VDEC 组前，必须先调用本接口。

#### 2.1.1. 函数

**Python 调用**

```python
ret = axcl.vdec.init(mod_attr)
```

**C++ 原型**

```cpp
AX_S32 AX_VDEC_Init(const AX_VDEC_MOD_ATTR_T *pstModAttr);
```

#### 2.1.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| mod_attr | dict &#124; None | 指向模块属性的指针。为 NULL 时，SDK 启用所有可用解码硬件（VDEC 和 JDEC），使用最大通道数和默认的自适应工作线程策略。零初始化的对象（源码说明不完整）。 |

#### 2.1.3. 返回值

- `ret`: *int* — 成功。失败。参见 VDEC 错误码。

#### 2.1.4. 说明

返回类型：`int`。

#### 2.1.5. 示例

```python
ret = axcl.vdec.init(mod_attr)
```

<br>

<a id="axcl.vdec.deinit"></a>

### 2.2. axcl.vdec.deinit

去初始化 VDEC 模块并释放硬件资源。本接口释放模块级 VDEC/JDEC 资源并禁用硬件。

#### 2.2.1. 函数

**Python 调用**

```python
ret = axcl.vdec.deinit()
```

**C++ 原型**

```cpp
AX_S32 AX_VDEC_Deinit(void);
```

#### 2.2.2. 参数

不适用

#### 2.2.3. 返回值

- `ret`: *int* — 成功。失败。参见 VDEC 错误码。

#### 2.2.4. 说明

返回类型：`int`。

#### 2.2.5. 示例

```python
ret = axcl.vdec.deinit()
```

<br>

<a id="axcl.vdec.extract_stream_header_info"></a>

### 2.3. axcl.vdec.extract_stream_header_info

从压缩视频码流中提取基本头信息。本接口从 H.264/H.265 码流的 I 帧头（SPS）中提取参考帧数量、宽度和高度信息。

#### 2.3.1. 函数

**Python 调用**

```python
bit_stream_info, ret = axcl.vdec.extract_stream_header_info(stream_buf, video_type)
```

**C++ 原型**

```cpp
AX_S32 AX_VDEC_ExtractStreamHeaderInfo(const AX_VDEC_STREAM_T *pstStreamBuf, AX_PAYLOAD_TYPE_E enVideoType, AX_VDEC_BITSTREAM_INFO_T *pstBitStreamInfo);
```

#### 2.3.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| stream_buf | dict &#124; None | 指向输入码流缓冲区的指针。不得为 NULL。 |
| video_type | int | 输入码流类型仅支持 PT_H264 和 PT_H265。 |

#### 2.3.3. 返回值

- `bit_stream_info`: *dict* — 指向从 I 帧头获取的码流信息结构体的指针。不得为 NULL。
- `ret`: *int* — 成功。失败。参见 VDEC 错误码。

#### 2.3.4. 说明

返回类型：`tuple[dict, int]`。

#### 2.3.5. 示例

```python
bit_stream_info, ret = axcl.vdec.extract_stream_header_info(stream_buf, video_type)
```

<br>

<a id="axcl.vdec.create_grp"></a>

### 2.4. axcl.vdec.create_grp

使用指定组 ID 创建 VDEC 组。本接口创建 VDEC 组并配置其静态组属性。组属性定义编解码类型、输入模式、最大图像大小、码流缓冲区、帧池所有权和参考帧数量。

#### 2.4.1. 函数

**Python 调用**

```python
ret = axcl.vdec.create_grp(vd_grp, grp_attr)
```

**C++ 原型**

```cpp
AX_S32 AX_VDEC_CreateGrp(AX_VDEC_GRP VdGrp, const AX_VDEC_GRP_ATTR_T *pstGrpAttr);
```

#### 2.4.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| vd_grp | int | VDEC 组 ID。有效范围：[0,（源码未提供上限）。 |
| grp_attr | dict &#124; None | 指向组属性的指针。不得为 NULL。 |

#### 2.4.3. 返回值

- `ret`: *int* — 成功。失败。参见 VDEC 错误码。

#### 2.4.4. 说明

返回类型：`int`。

#### 2.4.5. 示例

```python
ret = axcl.vdec.create_grp(vd_grp, grp_attr)
```

<br>

<a id="axcl.vdec.create_grp_ex"></a>

### 2.5. axcl.vdec.create_grp_ex

创建 VDEC 组并自动分配组 ID。本接口创建 VDEC 组并自动分配可用组 ID。

#### 2.5.1. 函数

**Python 调用**

```python
vd_grp, ret = axcl.vdec.create_grp_ex(grp_attr)
```

**C++ 原型**

```cpp
AX_S32 AX_VDEC_CreateGrpEx(AX_VDEC_GRP *VdGrp, const AX_VDEC_GRP_ATTR_T *pstGrpAttr);
```

#### 2.5.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| grp_attr | dict &#124; None | 指向组属性的指针。不得为 NULL。 |

#### 2.5.3. 返回值

- `vd_grp`: *int* — 用于接收分配的组 ID 的指针。不得为 NULL。SDK 在内部分配并返回组 ID。
- `ret`: *int* — 成功。失败。参见 VDEC 错误码。

#### 2.5.4. 说明

返回类型：`tuple[int, int]`。

#### 2.5.5. 示例

```python
vd_grp, ret = axcl.vdec.create_grp_ex(grp_attr)
```

<br>

<a id="axcl.vdec.destroy_grp"></a>

### 2.6. axcl.vdec.destroy_grp

销毁 VDEC 组。本接口销毁 VDEC 组并释放组级资源。

#### 2.6.1. 函数

**Python 调用**

```python
ret = axcl.vdec.destroy_grp(vd_grp)
```

**C++ 原型**

```cpp
AX_S32 AX_VDEC_DestroyGrp(AX_VDEC_GRP VdGrp);
```

#### 2.6.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| vd_grp | int | VDEC 组 ID。有效范围：[0,（源码未提供上限）。 |

#### 2.6.3. 返回值

- `ret`: *int* — 成功。失败。参见 VDEC 错误码。

#### 2.6.4. 说明

返回类型：`int`。

#### 2.6.5. 示例

```python
ret = axcl.vdec.destroy_grp(vd_grp)
```

<br>

<a id="axcl.vdec.get_grp_attr"></a>

### 2.7. axcl.vdec.get_grp_attr

获取 VDEC 组的属性。本接口查询 VDEC 组的当前配置，包括编解码类型、输入模式、最大图像大小、码流缓冲区设置及其他组级属性。

#### 2.7.1. 函数

**Python 调用**

```python
grp_attr, ret = axcl.vdec.get_grp_attr(vd_grp)
```

**C++ 原型**

```cpp
AX_S32 AX_VDEC_GetGrpAttr(AX_VDEC_GRP VdGrp, AX_VDEC_GRP_ATTR_T *pstGrpAttr);
```

#### 2.7.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| vd_grp | int | VDEC 组 ID。有效范围：[0,（源码未提供上限）。 |

#### 2.7.3. 返回值

- `grp_attr`: *dict* — 指向组属性结构体的指针。不得为 NULL。成功时包含当前组配置。
- `ret`: *int* — 成功。失败。参见 VDEC 错误码。

#### 2.7.4. 说明

返回类型：`tuple[dict, int]`。

#### 2.7.5. 示例

```python
grp_attr, ret = axcl.vdec.get_grp_attr(vd_grp)
```

<br>

<a id="axcl.vdec.set_grp_attr"></a>

### 2.8. axcl.vdec.set_grp_attr

设置 VDEC 组的属性。本接口修改已有 VDEC 组的特定静态属性。

#### 2.8.1. 函数

**Python 调用**

```python
ret = axcl.vdec.set_grp_attr(vd_grp, grp_attr)
```

**C++ 原型**

```cpp
AX_S32 AX_VDEC_SetGrpAttr(AX_VDEC_GRP VdGrp, const AX_VDEC_GRP_ATTR_T *pstGrpAttr);
```

#### 2.8.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| vd_grp | int | VDEC 组 ID。有效范围：[0,（源码未提供上限）。 |
| grp_attr | dict &#124; None | 指向组属性的指针。不得为 NULL。 |

#### 2.8.3. 返回值

- `ret`: *int* — 成功。失败。参见 VDEC 错误码。

#### 2.8.4. 说明

返回类型：`int`。

#### 2.8.5. 示例

```python
ret = axcl.vdec.set_grp_attr(vd_grp, grp_attr)
```

<br>

<a id="axcl.vdec.start_recv_stream"></a>

### 2.9. axcl.vdec.start_recv_stream

启动 VDEC 组接收压缩码流。本接口将指定 VDEC 组切换到接收状态，以便后续调用（源码说明不完整）。

#### 2.9.1. 函数

**Python 调用**

```python
ret = axcl.vdec.start_recv_stream(vd_grp, recv_param)
```

**C++ 原型**

```cpp
AX_S32 AX_VDEC_StartRecvStream(AX_VDEC_GRP VdGrp, const AX_VDEC_RECV_PIC_PARAM_T *pstRecvParam);
```

#### 2.9.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| vd_grp | int | VDEC 组 ID。有效范围：[0,（源码未提供上限）。 |
| recv_param | dict &#124; None | 指向接收图像参数的指针。可为 NULL。 |

#### 2.9.3. 返回值

- `ret`: *int* — 成功。失败。参见 VDEC 错误码。

#### 2.9.4. 说明

返回类型：`int`。

#### 2.9.5. 示例

```python
ret = axcl.vdec.start_recv_stream(vd_grp, recv_param)
```

<br>

<a id="axcl.vdec.stop_recv_stream"></a>

### 2.10. axcl.vdec.stop_recv_stream

停止 VDEC 组接收压缩码流。本接口停止 VDEC 组接收新的压缩码流数据。解码器继续处理内部队列中的剩余数据。

#### 2.10.1. 函数

**Python 调用**

```python
ret = axcl.vdec.stop_recv_stream(vd_grp)
```

**C++ 原型**

```cpp
AX_S32 AX_VDEC_StopRecvStream(AX_VDEC_GRP VdGrp);
```

#### 2.10.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| vd_grp | int | VDEC 组 ID。有效范围：[0,（源码未提供上限）。 |

#### 2.10.3. 返回值

- `ret`: *int* — 成功。失败。参见 VDEC 错误码。

#### 2.10.4. 说明

返回类型：`int`。

#### 2.10.5. 示例

```python
ret = axcl.vdec.stop_recv_stream(vd_grp)
```

<br>

<a id="axcl.vdec.query_status"></a>

### 2.11. axcl.vdec.query_status

查询 VDEC 组状态。本接口获取 VDEC 组当前运行状态，包括缓冲区使用情况、帧数和解码器状态信息。

#### 2.11.1. 函数

**Python 调用**

```python
grp_status, ret = axcl.vdec.query_status(vd_grp)
```

**C++ 原型**

```cpp
AX_S32 AX_VDEC_QueryStatus(AX_VDEC_GRP VdGrp, AX_VDEC_GRP_STATUS_T *pstGrpStatus);
```

#### 2.11.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| vd_grp | int | VDEC 组 ID。有效范围：[0,（源码未提供上限）。 |

#### 2.11.3. 返回值

- `grp_status`: *dict* — 指向组状态结构体的指针。不得为 NULL。成功时包含当前组状态。
- `ret`: *int* — 成功。失败。参见 VDEC 错误码。

#### 2.11.4. 说明

返回类型：`tuple[dict, int]`。

#### 2.11.5. 示例

```python
grp_status, ret = axcl.vdec.query_status(vd_grp)
```

<br>

<a id="axcl.vdec.reset_grp"></a>

### 2.12. axcl.vdec.reset_grp

将 VDEC 组复位为初始状态。本接口复位指定 VDEC 组，并清除所有已缓存的输入和输出数据。

#### 2.12.1. 函数

**Python 调用**

```python
ret = axcl.vdec.reset_grp(vd_grp)
```

**C++ 原型**

```cpp
AX_S32 AX_VDEC_ResetGrp(AX_VDEC_GRP VdGrp);
```

#### 2.12.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| vd_grp | int | VDEC 组 ID。有效范围：[0,（源码未提供上限）。 |

#### 2.12.3. 返回值

- `ret`: *int* — 成功。失败。参见 VDEC 错误码。

#### 2.12.4. 说明

返回类型：`int`。

#### 2.12.5. 示例

```python
ret = axcl.vdec.reset_grp(vd_grp)
```

<br>

<a id="axcl.vdec.set_grp_param"></a>

### 2.13. axcl.vdec.set_grp_param

设置 VDEC 组的高级参数。本接口更新 VDEC 组的组级解码参数。参数包括视频输出顺序、视频解码模式和源帧率。

#### 2.13.1. 函数

**Python 调用**

```python
ret = axcl.vdec.set_grp_param(vd_grp, grp_param)
```

**C++ 原型**

```cpp
AX_S32 AX_VDEC_SetGrpParam(AX_VDEC_GRP VdGrp, const AX_VDEC_GRP_PARAM_T* pstGrpParam);
```

#### 2.13.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| vd_grp | int | VDEC 组 ID。有效范围：[0,（源码未提供上限）。 |
| grp_param | dict &#124; None | 指向组参数的指针。不得为 NULL。 |

#### 2.13.3. 返回值

- `ret`: *int* — 成功。失败。参见 VDEC 错误码。

#### 2.13.4. 说明

返回类型：`int`。

#### 2.13.5. 示例

```python
ret = axcl.vdec.set_grp_param(vd_grp, grp_param)
```

<br>

<a id="axcl.vdec.get_grp_param"></a>

### 2.14. axcl.vdec.get_grp_param

获取 VDEC 组的高级参数。本接口获取 VDEC 组的当前高级配置，包括解码顺序、解码模式和源帧率。

#### 2.14.1. 函数

**Python 调用**

```python
grp_param, ret = axcl.vdec.get_grp_param(vd_grp)
```

**C++ 原型**

```cpp
AX_S32 AX_VDEC_GetGrpParam(AX_VDEC_GRP VdGrp, AX_VDEC_GRP_PARAM_T* pstGrpParam);
```

#### 2.14.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| vd_grp | int | VDEC 组 ID。有效范围：[0,（源码未提供上限）。 |

#### 2.14.3. 返回值

- `grp_param`: *dict* — 指向组参数的指针。不得为 NULL。成功时包含当前组配置。
- `ret`: *int* — 成功。失败。参见 VDEC 错误码。

#### 2.14.4. 说明

返回类型：`tuple[dict, int]`。

#### 2.14.5. 示例

```python
grp_param, ret = axcl.vdec.get_grp_param(vd_grp)
```

<br>

<a id="axcl.vdec.set_grp_thread_bind"></a>

### 2.15. axcl.vdec.set_grp_thread_bind

为 VDEC 组分别设置 DEC 和 OUT 工作线程绑定策略。

#### 2.15.1. 函数

**Python 调用**

```python
ret = axcl.vdec.set_grp_thread_bind(vd_grp, thread_bind)
```

**C++ 原型**

```cpp
AX_S32 AX_VDEC_SetGrpThreadBind(AX_VDEC_GRP VdGrp, const AX_VDEC_GRP_THREAD_BIND_T *pstThreadBind);
```

#### 2.15.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| vd_grp | int | VDEC 组 ID。有效范围：[0,（源码未提供上限）。 |
| thread_bind | dict &#124; None | 指向 DEC/OUT 绑定策略的指针。不得为 NULL。 |

#### 2.15.3. 返回值

- `ret`: *int* — 成功。失败。参见 VDEC 错误码。

#### 2.15.4. 说明

返回类型：`int`。

#### 2.15.5. 示例

```python
ret = axcl.vdec.set_grp_thread_bind(vd_grp, thread_bind)
```

<br>

<a id="axcl.vdec.get_grp_thread_bind"></a>

### 2.16. axcl.vdec.get_grp_thread_bind

获取 VDEC 组请求的 DEC 和 OUT 工作线程绑定策略。

#### 2.16.1. 函数

**Python 调用**

```python
thread_bind, ret = axcl.vdec.get_grp_thread_bind(vd_grp)
```

**C++ 原型**

```cpp
AX_S32 AX_VDEC_GetGrpThreadBind(AX_VDEC_GRP VdGrp, AX_VDEC_GRP_THREAD_BIND_T *pstThreadBind);
```

#### 2.16.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| vd_grp | int | VDEC 组 ID。有效范围：[0,（源码未提供上限）。 |

#### 2.16.3. 返回值

- `thread_bind`: *dict* — 接收 DEC/OUT 绑定策略的指针。不得为 NULL。
- `ret`: *int* — 成功。失败。参见 VDEC 错误码。

#### 2.16.4. 说明

返回类型：`tuple[dict, int]`。

#### 2.16.5. 示例

```python
thread_bind, ret = axcl.vdec.get_grp_thread_bind(vd_grp)
```

<br>

<a id="axcl.vdec.select_grp"></a>

### 2.17. axcl.vdec.select_grp

检查哪些 VDEC 组当前有就绪的输出帧。本接口获取当前 VDEC 组集合的快照，返回输出队列中存在可用解码帧的组和通道。支持阻塞、非阻塞和超时模式。

#### 2.17.1. 函数

**Python 调用**

```python
grp_set, ret = axcl.vdec.select_grp(milli_sec)
```

**C++ 原型**

```cpp
AX_S32 AX_VDEC_SelectGrp(AX_VDEC_GRP_SET_INFO_T *pstGrpSet, AX_S32 s32MilliSec);
```

#### 2.17.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| milli_sec | int | 超时时间，单位为毫秒：-1 为阻塞模式；0 为非阻塞模式；>0 为超时模式。以毫秒为单位，无上限。 |

#### 2.17.3. 返回值

- `grp_set`: *dict* — 指向组集合信息结构体的指针。不得为 NULL。成功时包含当前选择快照。
- `ret`: *int* — 成功。失败。参见 VDEC 错误码。

#### 2.17.4. 说明

返回类型：`tuple[dict, int]`。

#### 2.17.5. 示例

```python
grp_set, ret = axcl.vdec.select_grp(milli_sec)
```

<br>

<a id="axcl.vdec.send_stream"></a>

### 2.18. axcl.vdec.send_stream

向解码通道组发送码流数据。本接口向 VDEC 组提交压缩码流包。数据包内容和结束标志必须与所配置的输入模式匹配（源码未提供配置引用）。

#### 2.18.1. 函数

**Python 调用**

```python
ret = axcl.vdec.send_stream(vd_grp, stream, milli_sec)
```

**C++ 原型**

```cpp
AX_S32 AX_VDEC_SendStream(AX_VDEC_GRP VdGrp, const AX_VDEC_STREAM_T *pstStream, AX_S32 s32MilliSec);
```

#### 2.18.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| vd_grp | int | VDEC 组 ID。 |
| stream | dict &#124; None | 指向码流信息的指针。不得为 NULL。 |
| milli_sec | int | 超时时间，单位为毫秒：-1 为阻塞模式；0 为非阻塞模式；>0 为超时模式。以毫秒为单位，无上限。 |

#### 2.18.3. 返回值

- `ret`: *int* — 成功。失败。参见 VDEC 错误码。

#### 2.18.4. 说明

返回类型：`int`。

#### 2.18.5. 示例

```python
ret = axcl.vdec.send_stream(vd_grp, stream, milli_sec)
```

<br>

<a id="axcl.vdec.get_chn_frame"></a>

### 2.19. axcl.vdec.get_chn_frame

从输出通道获取解码图像。本接口从指定 VDEC 组和通道获取一帧解码输出。返回的帧必须通过相应接口释放（源码未提供接口引用）。

#### 2.19.1. 函数

**Python 调用**

```python
frame_info, ret = axcl.vdec.get_chn_frame(vd_grp, vd_chn, milli_sec)
```

**C++ 原型**

```cpp
AX_S32 AX_VDEC_GetChnFrame(AX_VDEC_GRP VdGrp, AX_VDEC_CHN VdChn, AX_VIDEO_FRAME_INFO_T *pstFrameInfo, AX_S32 s32MilliSec);
```

#### 2.19.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| vd_grp | int | VDEC 组 ID。 |
| vd_chn | int | VDEC 通道 ID。有效范围取决于编解码类型。 |
| milli_sec | int | 超时时间，单位为毫秒：-1 为阻塞模式；0 为非阻塞模式；>0 为超时模式。以毫秒为单位，无上限。 |

#### 2.19.3. 返回值

- `frame_info`: *dict* — 指向输出帧信息的指针。不得为 NULL。
- `ret`: *int* — 成功。失败。参见 VDEC 错误码。

#### 2.19.4. 说明

返回类型：`tuple[dict, int]`。

#### 2.19.5. 示例

```python
frame_info, ret = axcl.vdec.get_chn_frame(vd_grp, vd_chn, milli_sec)
```

<br>

<a id="axcl.vdec.release_chn_frame"></a>

### 2.20. axcl.vdec.release_chn_frame

释放解码输出通道图像缓冲区。本接口释放此前从 AX_VDEC_GetChnFrame 获取的帧缓冲区。

#### 2.20.1. 函数

**Python 调用**

```python
ret = axcl.vdec.release_chn_frame(vd_grp, vd_chn, frame_info)
```

**C++ 原型**

```cpp
AX_S32 AX_VDEC_ReleaseChnFrame(AX_VDEC_GRP VdGrp, AX_VDEC_CHN VdChn, const AX_VIDEO_FRAME_INFO_T *pstFrameInfo);
```

#### 2.20.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| vd_grp | int | VDEC 组 ID。有效范围：[0,（源码未提供上限）。 |
| vd_chn | int | VDEC 通道 ID。有效范围：[0,（源码未提供上限）。 |
| frame_info | dict &#124; None | 指向 AX_VDEC_GetChnFrame 返回的帧信息结构体的指针。 |

#### 2.20.3. 返回值

- `ret`: *int* — 成功。失败。参见 VDEC 错误码。

#### 2.20.4. 说明

返回类型：`int`。

#### 2.20.5. 示例

```python
ret = axcl.vdec.release_chn_frame(vd_grp, vd_chn, frame_info)
```

<br>

<a id="axcl.vdec.get_user_data"></a>

### 2.21. axcl.vdec.get_user_data

从解码码流中获取用户数据（SEI/COM）。本接口提取压缩码流中嵌入的用户数据。对于 H.264/H.265，获取 SEI（补充增强信息）消息。对于 JPEG/MJPEG，获取 COM（注释）标记。

#### 2.21.1. 函数

**Python 调用**

```python
user_data, ret = axcl.vdec.get_user_data(vd_grp)
```

**C++ 原型**

```cpp
AX_S32 AX_VDEC_GetUserData(AX_VDEC_GRP VdGrp, AX_VDEC_USERDATA_T *pstUserData);
```

#### 2.21.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| vd_grp | int | VDEC 组 ID。有效范围：[0,（源码未提供上限）。 |

#### 2.21.3. 返回值

- `user_data`: *dict* — 指向用户数据结构体的指针。不得为 NULL。成功时包含获取的用户数据。
- `ret`: *int* — 成功。失败。参见 VDEC 错误码。

#### 2.21.4. 说明

返回类型：`tuple[dict, int]`。

#### 2.21.5. 示例

```python
user_data, ret = axcl.vdec.get_user_data(vd_grp)
```

<br>

<a id="axcl.vdec.release_user_data"></a>

### 2.22. axcl.vdec.release_user_data

释放从 VDEC 组获取的用户数据。本接口为兼容性保留，不执行内部释放操作。SDK 自动管理用户数据资源，应用无需调用本接口。

#### 2.22.1. 函数

**Python 调用**

```python
ret = axcl.vdec.release_user_data(vd_grp, user_data)
```

**C++ 原型**

```cpp
AX_S32 AX_VDEC_ReleaseUserData(AX_VDEC_GRP VdGrp, const AX_VDEC_USERDATA_T * pstUserData);
```

#### 2.22.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| vd_grp | int | VDEC 组 ID。有效范围：[0,（源码未提供上限）。 |
| user_data | dict &#124; None | 指向 AX_VDEC_GetUserData 返回的用户数据结构体的指针。 |

#### 2.22.3. 返回值

- `ret`: *int* — 成功。失败。参见 VDEC 错误码。

#### 2.22.4. 说明

返回类型：`int`。

#### 2.22.5. 示例

```python
ret = axcl.vdec.release_user_data(vd_grp, user_data)
```

<br>

<a id="axcl.vdec.set_user_pic"></a>

### 2.23. axcl.vdec.set_user_pic

设置 VDEC 组的用户图像插入属性。本接口配置用户提供的图像属性，该图像可插入解码器输出流。用户图像通常在解码中断或首个有效帧到达前用作占位图像或默认图像。

#### 2.23.1. 函数

**Python 调用**

```python
ret = axcl.vdec.set_user_pic(vd_grp, usr_pic)
```

**C++ 原型**

```cpp
AX_S32 AX_VDEC_SetUserPic(AX_VDEC_GRP VdGrp, const AX_VDEC_USRPIC_T *pstUsrPic);
```

#### 2.23.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| vd_grp | int | VDEC 组 ID。有效范围：[0,（源码未提供上限）。 |
| usr_pic | dict &#124; None | 指向用户图像属性的指针。不得为 NULL。使用前应将结构体零初始化。 |

#### 2.23.3. 返回值

- `ret`: *int* — 成功。失败。参见 VDEC 错误码。

#### 2.23.4. 说明

返回类型：`int`。

#### 2.23.5. 示例

```python
ret = axcl.vdec.set_user_pic(vd_grp, usr_pic)
```

<br>

<a id="axcl.vdec.enable_user_pic"></a>

### 2.24. axcl.vdec.enable_user_pic

启用 VDEC 组的用户图像插入。本接口启用 VDEC 组的用户图像输出。启用用户图像模式时，使用已配置的用户图像作为替代帧。调用本接口前（源码条件不完整）。

#### 2.24.1. 函数

**Python 调用**

```python
ret = axcl.vdec.enable_user_pic(vd_grp)
```

**C++ 原型**

```cpp
AX_S32 AX_VDEC_EnableUserPic(AX_VDEC_GRP VdGrp);
```

#### 2.24.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| vd_grp | int | VDEC 组 ID。有效范围：[0,（源码未提供上限）。 |

#### 2.24.3. 返回值

- `ret`: *int* — 成功。失败。参见 VDEC 错误码。

#### 2.24.4. 说明

返回类型：`int`。

#### 2.24.5. 示例

```python
ret = axcl.vdec.enable_user_pic(vd_grp)
```

<br>

<a id="axcl.vdec.disable_user_pic"></a>

### 2.25. axcl.vdec.disable_user_pic

禁用 VDEC 组的用户图像插入。

#### 2.25.1. 函数

**Python 调用**

```python
ret = axcl.vdec.disable_user_pic(vd_grp)
```

**C++ 原型**

```cpp
AX_S32 AX_VDEC_DisableUserPic(AX_VDEC_GRP VdGrp);
```

#### 2.25.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| vd_grp | int | VDEC 组 ID。 |

#### 2.25.3. 返回值

- `ret`: *int* — 成功。失败。参见 VDEC 错误码。

#### 2.25.4. 说明

返回类型：`int`。

#### 2.25.5. 示例

```python
ret = axcl.vdec.disable_user_pic(vd_grp)
```

<br>

<a id="axcl.vdec.set_display_mode"></a>

### 2.26. axcl.vdec.set_display_mode

设置 VDEC 组的显示模式。本接口配置 VDEC 组发送解码帧时与下游模块（如 IVPS）的交互方式。支持预览和回放两种模式，用于决定是否对解码器施加背压。

#### 2.26.1. 函数

**Python 调用**

```python
ret = axcl.vdec.set_display_mode(vd_grp, display_mode)
```

**C++ 原型**

```cpp
AX_S32 AX_VDEC_SetDisplayMode(AX_VDEC_GRP VdGrp, AX_VDEC_DISPLAY_MODE_E enDisplayMode);
```

#### 2.26.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| vd_grp | int | VDEC 组 ID。有效范围：[0,（源码未提供上限）。 |
| display_mode | int | 显示模式枚举。有效值：（源码未提供枚举列表）。 |

#### 2.26.3. 返回值

- `ret`: *int* — 成功。失败。参见 VDEC 错误码。

#### 2.26.4. 说明

返回类型：`int`。

#### 2.26.5. 示例

```python
ret = axcl.vdec.set_display_mode(vd_grp, display_mode)
```

<br>

<a id="axcl.vdec.get_display_mode"></a>

### 2.27. axcl.vdec.get_display_mode

获取 VDEC 组的当前显示模式。本接口查询 VDEC 组的显示模式配置，以确定发送解码帧时与下游模块的交互方式。

#### 2.27.1. 函数

**Python 调用**

```python
pen_display_mode, ret = axcl.vdec.get_display_mode(vd_grp)
```

**C++ 原型**

```cpp
AX_S32 AX_VDEC_GetDisplayMode(AX_VDEC_GRP VdGrp, AX_VDEC_DISPLAY_MODE_E *penDisplayMode);
```

#### 2.27.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| vd_grp | int | VDEC 组 ID。有效范围：[0,（源码未提供上限）。 |

#### 2.27.3. 返回值

- `pen_display_mode`: *int* — 指向显示模式枚举的指针。不得为 NULL。成功时包含当前显示模式。
- `ret`: *int* — 成功。失败。参见 VDEC 错误码。

#### 2.27.4. 说明

返回类型：`tuple[int, int]`。

#### 2.27.5. 示例

```python
pen_display_mode, ret = axcl.vdec.get_display_mode(vd_grp)
```

<br>

<a id="axcl.vdec.attach_pool"></a>

### 2.28. axcl.vdec.attach_pool

将解码通道绑定到指定 VB（视频缓冲）池。本接口将用户创建的内存池挂载到 VDEC 输出通道。通道的解码帧缓冲区可从挂载的内存池分配。

#### 2.28.1. 函数

**Python 调用**

```python
ret = axcl.vdec.attach_pool(vd_grp, vd_chn, pool_id)
```

**C++ 原型**

```cpp
AX_S32 AX_VDEC_AttachPool(AX_VDEC_GRP VdGrp, AX_VDEC_CHN VdChn, AX_POOL PoolId);
```

#### 2.28.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| vd_grp | int | VDEC 组 ID。 |
| vd_chn | int | VDEC 通道 ID。 |
| pool_id | int | 由 SYS/Pool 模块创建的内存池 ID。 |

#### 2.28.3. 返回值

- `ret`: *int* — 成功。失败。参见 VDEC 错误码。

#### 2.28.4. 说明

返回类型：`int`。

#### 2.28.5. 示例

```python
ret = axcl.vdec.attach_pool(vd_grp, vd_chn, pool_id)
```

<br>

<a id="axcl.vdec.detach_pool"></a>

### 2.29. axcl.vdec.detach_pool

将解码通道与指定 VB（视频缓冲）池解绑。本接口将此前挂载的内存池从 VDEC 输出通道解绑。解绑后，通道不再从该内存池分配输出帧缓冲区。

#### 2.29.1. 函数

**Python 调用**

```python
ret = axcl.vdec.detach_pool(vd_grp, vd_chn)
```

**C++ 原型**

```cpp
AX_S32 AX_VDEC_DetachPool(AX_VDEC_GRP VdGrp, AX_VDEC_CHN VdChn);
```

#### 2.29.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| vd_grp | int | VDEC 组 ID。有效范围：[0,（源码未提供上限）。 |
| vd_chn | int | VDEC 通道 ID。有效范围：[0,（源码未提供上限）。 |

#### 2.29.3. 返回值

- `ret`: *int* — 成功。失败。参见 VDEC 错误码。

#### 2.29.4. 说明

返回类型：`int`。

#### 2.29.5. 示例

```python
ret = axcl.vdec.detach_pool(vd_grp, vd_chn)
```

<br>

<a id="axcl.vdec.enable_chn"></a>

### 2.30. axcl.vdec.enable_chn

启用 VDEC 输出通道。本接口启用 VDEC 组内的指定输出通道，使其能够输出解码帧。默认禁用所有硬件输出通道。

#### 2.30.1. 函数

**Python 调用**

```python
ret = axcl.vdec.enable_chn(vd_grp, vd_chn)
```

**C++ 原型**

```cpp
AX_S32 AX_VDEC_EnableChn(AX_VDEC_GRP VdGrp, AX_VDEC_CHN VdChn);
```

#### 2.30.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| vd_grp | int | VDEC 组 ID。有效范围：[0,（源码未提供上限）。 |
| vd_chn | int | VDEC 通道 ID。有效范围：[0,（源码未提供上限）。 |

#### 2.30.3. 返回值

- `ret`: *int* — 成功。失败。参见 VDEC 错误码。

#### 2.30.4. 说明

返回类型：`int`。

#### 2.30.5. 示例

```python
ret = axcl.vdec.enable_chn(vd_grp, vd_chn)
```

<br>

<a id="axcl.vdec.disable_chn"></a>

### 2.31. axcl.vdec.disable_chn

禁用 VDEC 输出通道。本接口禁用 VDEC 组内的指定输出通道，使其不再输出解码帧。后续可通过相应接口重新启用通道（源码未提供接口引用）。

#### 2.31.1. 函数

**Python 调用**

```python
ret = axcl.vdec.disable_chn(vd_grp, vd_chn)
```

**C++ 原型**

```cpp
AX_S32 AX_VDEC_DisableChn(AX_VDEC_GRP VdGrp, AX_VDEC_CHN VdChn);
```

#### 2.31.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| vd_grp | int | VDEC 组 ID。有效范围：[0,（源码未提供上限）。 |
| vd_chn | int | VDEC 通道 ID。有效范围：[0,（源码未提供上限）。 |

#### 2.31.3. 返回值

- `ret`: *int* — 成功。失败。参见 VDEC 错误码。

#### 2.31.4. 说明

返回类型：`int`。

#### 2.31.5. 示例

```python
ret = axcl.vdec.disable_chn(vd_grp, vd_chn)
```

<br>

<a id="axcl.vdec.set_chn_attr"></a>

### 2.32. axcl.vdec.set_chn_attr

设置 VDEC 输出通道属性。本接口配置 VDEC 组内指定输出通道的属性，包括输出格式、分辨率、宽高比及其他显示参数。

#### 2.32.1. 函数

**Python 调用**

```python
ret = axcl.vdec.set_chn_attr(vd_grp, vd_chn, vd_chn_attr)
```

**C++ 原型**

```cpp
AX_S32 AX_VDEC_SetChnAttr(AX_VDEC_GRP VdGrp, AX_VDEC_CHN VdChn, const AX_VDEC_CHN_ATTR_T *pstVdChnAttr);
```

#### 2.32.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| vd_grp | int | VDEC 组 ID。有效范围：[0,（源码未提供上限）。 |
| vd_chn | int | VDEC 通道 ID。有效范围：[0,（源码未提供上限）。 |
| vd_chn_attr | dict &#124; None | 指向通道属性的指针。不得为 NULL。 |

#### 2.32.3. 返回值

- `ret`: *int* — 成功。失败。参见 VDEC 错误码。

#### 2.32.4. 说明

返回类型：`int`。

#### 2.32.5. 示例

```python
ret = axcl.vdec.set_chn_attr(vd_grp, vd_chn, vd_chn_attr)
```

<br>

<a id="axcl.vdec.get_chn_attr"></a>

### 2.33. axcl.vdec.get_chn_attr

获取 VDEC 通道属性。本接口查询 VDEC 组内指定通道的当前配置，包括输出格式、分辨率、宽高比及其他显示参数。返回的属性反映通道当前的运行时配置。

#### 2.33.1. 函数

**Python 调用**

```python
vd_chn_attr, ret = axcl.vdec.get_chn_attr(vd_grp, vd_chn)
```

**C++ 原型**

```cpp
AX_S32 AX_VDEC_GetChnAttr(AX_VDEC_GRP VdGrp, AX_VDEC_CHN VdChn, AX_VDEC_CHN_ATTR_T *pstVdChnAttr);
```

#### 2.33.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| vd_grp | int | VDEC 组 ID。有效范围：[0,（源码未提供上限）。 |
| vd_chn | int | VDEC 通道 ID。有效范围：[0,（源码未提供上限）。 |

#### 2.33.3. 返回值

- `vd_chn_attr`: *dict* — 指向通道属性的指针。不得为 NULL。成功时包含当前通道配置。
- `ret`: *int* — 成功。失败。参见 VDEC 错误码。

#### 2.33.4. 说明

返回类型：`tuple[dict, int]`。

#### 2.33.5. 示例

```python
vd_chn_attr, ret = axcl.vdec.get_chn_attr(vd_grp, vd_chn)
```

<br>

<a id="axcl.vdec.jpeg_decode_one_frame"></a>

### 2.34. axcl.vdec.jpeg_decode_one_frame

从调用者提供的物理连续缓冲区同步解码单个 JPEG 帧。本接口同步解码单幅 JPEG 图像，无需 VDEC 组或通道。适用于缩略图生成、快照提取或单次 JPEG 解码任务。

#### 2.34.1. 函数

**Python 调用**

```python
param, ret = axcl.vdec.jpeg_decode_one_frame(param)
```

**C++ 原型**

```cpp
AX_S32 AX_VDEC_JpegDecodeOneFrame(AX_VDEC_DEC_ONE_FRM_T *pstParam);
```

#### 2.34.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| param | dict &#124; None | 指向单帧解码参数的指针。不得为 NULL。同时包含输入（码流缓冲区）和输出（解码帧）信息。 |

#### 2.34.3. 返回值

- `param`: *dict* — 指向单帧解码参数的指针。不得为 NULL。同时包含输入（码流缓冲区）和输出（解码帧）信息。
- `ret`: *int* — 成功。失败。参见 VDEC 错误码。

#### 2.34.4. 说明

返回类型：`tuple[dict, int]`。

#### 2.34.5. 示例

```python
param, ret = axcl.vdec.jpeg_decode_one_frame(param)
```

<br>

<a id="axcl.vdec.jpeg_decode_one_frame_ex"></a>

### 2.35. axcl.vdec.jpeg_decode_one_frame_ex

从普通进程内存中的已编码 JPEG 缓冲区解码 JPEG 图像，并在内部分配输出帧。本便捷接口解析 JPEG 分辨率，在内部分配所需输入和输出缓冲区，并同步解码图像。

#### 2.35.1. 函数

**Python 调用**

```python
param, ret = axcl.vdec.jpeg_decode_one_frame_ex(param)
```

**C++ 原型**

```cpp
AX_S32 AX_VDEC_JpegDecodeOneFrameEx(AX_VDEC_DEC_ONE_FRM_T *pstParam);
```

#### 2.35.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| param | dict &#124; None | 指向单帧解码参数的指针。不得为 NULL。调用前设置 stStream.pu8Addr、stStream.u32StreamPackLen、enImgFormat、enOutputMode，以及使用相应模式时的 stFrame 裁剪字段（源码说明不完整）。 |

#### 2.35.3. 返回值

- `param`: *dict* — 指向单帧解码参数的指针。不得为 NULL。调用前设置 stStream.pu8Addr、stStream.u32StreamPackLen、enImgFormat、enOutputMode，以及使用相应模式时的 stFrame 裁剪字段（源码说明不完整）。
- `ret`: *int* — 成功。失败。参见 VDEC 错误码。

#### 2.35.4. 说明

返回类型：`tuple[dict, int]`。

#### 2.35.5. 示例

```python
param, ret = axcl.vdec.jpeg_decode_one_frame_ex(param)
```

<br>

<a id="axcl.vdec.jpeg_release_decode_frame_ex"></a>

### 2.36. axcl.vdec.jpeg_release_decode_frame_ex

释放 AX_VDEC_JpegDecodeOneFrameEx 返回的帧。

#### 2.36.1. 函数

**Python 调用**

```python
frame, ret = axcl.vdec.jpeg_release_decode_frame_ex(frame)
```

**C++ 原型**

```cpp
AX_S32 AX_VDEC_JpegReleaseDecodeFrameEx(AX_VIDEO_FRAME_T *pstFrame);
```

#### 2.36.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| frame | dict &#124; None | 指向 AX_VDEC_JpegDecodeOneFrameEx 返回帧的指针。 |

#### 2.36.3. 返回值

- `frame`: *dict* — 指向 AX_VDEC_JpegDecodeOneFrameEx 返回帧的指针。
- `ret`: *int* — 成功。失败。参见 VDEC 错误码。

#### 2.36.4. 说明

返回类型：`tuple[dict, int]`。

#### 2.36.5. 示例

```python
frame, ret = axcl.vdec.jpeg_release_decode_frame_ex(frame)
```

<br>

<a id="axcl.vdec.get_stream_buf_info"></a>

### 2.37. axcl.vdec.get_stream_buf_info

获取 VDEC 组的输入码流缓冲区信息。本接口查询指定 VDEC 组输入码流缓冲区的当前状态和配置，包括缓冲区大小、使用统计和队列深度信息。

#### 2.37.1. 函数

**Python 调用**

```python
stream_buf_info, ret = axcl.vdec.get_stream_buf_info(vd_grp)
```

**C++ 原型**

```cpp
AX_S32 AX_VDEC_GetStreamBufInfo(AX_VDEC_GRP VdGrp, AX_VDEC_STREAM_BUF_INFO_T *pstStreamBufInfo);
```

#### 2.37.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| vd_grp | int | VDEC 组 ID。有效范围：[0,（源码未提供上限）。 |

#### 2.37.3. 返回值

- `stream_buf_info`: *dict* — 指向码流缓冲区信息结构体的指针。不得为 NULL。成功时包含当前码流缓冲区状态。
- `ret`: *int* — 成功。失败。参见 VDEC 错误码。

#### 2.37.4. 说明

返回类型：`tuple[dict, int]`。

#### 2.37.5. 示例

```python
stream_buf_info, ret = axcl.vdec.get_stream_buf_info(vd_grp)
```

<br>

<a id="axcl.vdec.get_vui_param"></a>

### 2.38. axcl.vdec.get_vui_param

从解码码流中获取 VUI（视频可用性信息）参数。本接口从指定 VDEC 组正在解码的 H.264/H.265 视频码流中提取 VUI 参数。VUI 包含视频特性的元数据，如宽高比、色彩原色、传递特性和矩阵系数。

#### 2.38.1. 函数

**Python 调用**

```python
vui_param, ret = axcl.vdec.get_vui_param(vd_grp)
```

**C++ 原型**

```cpp
AX_S32 AX_VDEC_GetVuiParam(AX_VDEC_GRP VdGrp, AX_VDEC_VUI_PARAM_T *pstVuiParam);
```

#### 2.38.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| vd_grp | int | VDEC 组 ID。有效范围：[0,（源码未提供上限）。 |

#### 2.38.3. 返回值

- `vui_param`: *dict* — 指向 VUI 参数结构体的指针。不得为 NULL。成功时包含提取的 VUI 信息。
- `ret`: *int* — 成功。失败。参见 VDEC 错误码。

#### 2.38.4. 说明

返回类型：`tuple[dict, int]`。

#### 2.38.5. 示例

```python
vui_param, ret = axcl.vdec.get_vui_param(vd_grp)
```

<br>

<a id="axcl.vdec.get_pic_buffer_size"></a>

### 2.39. axcl.vdec.get_pic_buffer_size

计算解码图像的帧缓冲区大小。本接口根据指定尺寸、输出像素格式、可选 FBC 压缩配置和编解码载荷类型，计算存储一帧解码图像所需的字节数。配置解码通道时，使用返回值设置 AX_VDEC_CHN_ATTR_T 的 u32FrameBufSize 字段。

#### 2.39.1. 函数

**Python 调用**

```python
ret = axcl.vdec.get_pic_buffer_size(u_width, u_height, output_format, compress_info, type)
```

**C++ 原型**

```cpp
AX_U32 AX_VDEC_GetPicBufferSize(AX_U32 uWidth, AX_U32 uHeight, AX_IMG_FORMAT_E eOutputFormat, AX_FRAME_COMPRESS_INFO_T *pstCompressInfo, AX_PAYLOAD_TYPE_E enType);
```

#### 2.39.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| u_width | int | 图像宽度，单位为像素；调用者预先对齐亮度跨度时，则为配置的帧跨度，单位为字节。 |
| u_height | int | 图像高度，单位为像素。 |
| output_format | int | 输出图像格式。参见 AX_IMG_FORMAT_E。 |
| compress_info | dict &#124; None | 指向 FBC 压缩信息的可选指针。为 NULL 或（源码条件不完整）。 |
| type | int | 编解码载荷类型。仅支持 PT_H264、PT_H265、PT_JPEG 和 PT_MJPEG。 |

#### 2.39.3. 返回值

- `ret`: *int* — 所需的帧缓冲区大小，单位为字节。不支持此载荷类型。

#### 2.39.4. 说明

返回类型：`int`。

#### 2.39.5. 示例

```python
ret = axcl.vdec.get_pic_buffer_size(u_width, u_height, output_format, compress_info, type)
```

<br>

<a id="axcl.vdec.get_yuv_buffer_size"></a>

### 2.40. axcl.vdec.get_yuv_buffer_size

计算 JPEG 解码图像的 YUV 缓冲区大小。本接口按指定尺寸和输出格式，计算存储一帧 JPEG 解码图像所需的字节数，宽度和高度均按 16 对齐。

#### 2.40.1. 函数

**Python 调用**

```python
ret = axcl.vdec.get_yuv_buffer_size(u_width, u_height, output_format)
```

**C++ 原型**

```cpp
AX_U32 AX_JDEC_GetYuvBufferSize(AX_U32 uWidth, AX_U32 uHeight, AX_IMG_FORMAT_E eOutputFormat);
```

#### 2.40.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| u_width | int | 图像宽度，单位为像素。 |
| u_height | int | 图像高度，单位为像素。 |
| output_format | int | 输出图像格式。参见 AX_IMG_FORMAT_E。 |

#### 2.40.3. 返回值

- `ret`: *int* — 所需的 YUV 缓冲区大小，单位为字节。

#### 2.40.4. 说明

返回类型：`int`。

#### 2.40.5. 示例

```python
ret = axcl.vdec.get_yuv_buffer_size(u_width, u_height, output_format)
```
