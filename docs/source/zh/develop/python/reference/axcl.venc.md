# axcl.venc

## 1. 目录

- [axcl.venc.init](#axcl.venc.init): 初始化 VENC 模块。本接口初始化 VENC 硬件编码模块并分配模块级资源。创建任何 VENC 通道前，必须先调用本接口。初始化时配置编码器类型（H.264/H.265、JPEG/MJPEG 或两者）和线程调度属性。
- [axcl.venc.deinit](#axcl.venc.deinit): 去初始化 VENC 模块。本接口释放 VENC 模块资源，并使编码器不可用，直到（源码条件不完整）。
- [axcl.venc.create_chn](#axcl.venc.create_chn): 使用指定通道 ID 创建 VENC 通道。本接口创建 VENC 通道并配置其属性。
- [axcl.venc.create_chn_ex](#axcl.venc.create_chn_ex): 创建 VENC 通道并自动分配通道 ID。本接口创建 VENC 通道并自动分配可用通道 ID。配置的属性与相应接口相同（源码未提供接口引用）。
- [axcl.venc.destroy_chn](#axcl.venc.destroy_chn): 销毁 VENC 通道。本接口销毁 VENC 通道，并释放所有通道级资源，包括码流缓冲区、输入输出队列和硬件上下文。
- [axcl.venc.send_frame](#axcl.venc.send_frame): 向编码器缓冲队列发送原始图像帧信息。本接口向编码器输入队列提交原始视频帧。帧采用异步编码，编码码流可通过相应接口获取（源码未提供接口引用）。
- [axcl.venc.send_frame_ex](#axcl.venc.send_frame_ex): 向 VENC 通道发送带用户元数据的输入帧。本接口提交帧及用户 RC、QPMap、标志映射和 EXIF 元数据。用于调用者需要额外逐帧控制的场景（源码未说明对照接口）。
- [axcl.venc.set_chn_thread_bind](#axcl.venc.set_chn_thread_bind): 为 VENC 通道设置独立的 ENC 工作线程绑定策略。
- [axcl.venc.get_chn_thread_bind](#axcl.venc.get_chn_thread_bind): 获取 VENC 通道请求的 ENC 绑定策略。
- [axcl.venc.select_grp](#axcl.venc.select_grp): 查询指定组中的编码通道是否有码流输出。
- [axcl.venc.select_clear_grp](#axcl.venc.select_clear_grp): 清除 select 组参数。本接口仅重置指定 select 组的成员关系。不会销毁组本身、停止任何通道或释放通道资源。
- [axcl.venc.select_grp_add_chn](#axcl.venc.select_grp_add_chn): 向 VENC select 组添加编码通道。
- [axcl.venc.select_grp_delete_chn](#axcl.venc.select_grp_delete_chn): 从 VENC select 组移除编码通道。
- [axcl.venc.select_grp_query](#axcl.venc.select_grp_query): 查询 VENC select 组配置。
- [axcl.venc.get_fd](#axcl.venc.get_fd): 获取 VENC 通道的文件描述符。本接口返回与指定 VENC 通道关联的设备文件描述符。返回的 fd 可与 select()、poll() 或 epoll() 配合使用，以监控编码码流是否可用。
- [axcl.venc.get_stream](#axcl.venc.get_stream): 从 VENC 通道获取编码码流。本接口从指定 VENC 通道获取一份编码码流。返回的码流必须通过相应接口释放（源码未提供接口引用）。
- [axcl.venc.release_stream](#axcl.venc.release_stream): 释放从 VENC 通道获取的编码码流。本接口释放已获取的码流缓冲区（源码未提供获取接口引用）。
- [axcl.venc.get_stream_buf_info](#axcl.venc.get_stream_buf_info): 获取 VENC 通道的码流缓冲区信息。本接口获取为指定 VENC 编码通道分配的码流缓冲区物理地址和大小。该信息可用于调试、内存管理或直接访问缓冲区的场景。
- [axcl.venc.start_recv_frame](#axcl.venc.start_recv_frame): 使编码通道能够接收输入图像。本接口成功返回后，通道可编码来自相应来源的输入帧（源码说明不完整）。
- [axcl.venc.stop_recv_frame](#axcl.venc.stop_recv_frame): 停止 VENC 通道接收输入帧。本接口停止 VENC 通道接收新的输入帧。编码器继续处理内部队列中的剩余帧。
- [axcl.venc.reset_chn](#axcl.venc.reset_chn): 复位 VENC 通道，清除输入和输出缓冲区。本接口复位指定 VENC 编码通道，从内部缓冲区清除所有待处理输入帧和已编码输出码流。通道恢复为已清空状态，复位后可重新启动。
- [axcl.venc.set_roi_attr](#axcl.venc.set_roi_attr): 设置 H.264/H.265 VENC 通道的 ROI（感兴趣区域）属性。本接口配置 H.264/H.265 通道的 ROI 编码参数，使编码帧内的指定区域可使用不同的质量等级。每个通道最多可配置 8 个 ROI 区域，并分别设置 QP。
- [axcl.venc.get_roi_attr](#axcl.venc.get_roi_attr): 获取 H.264/H.265 VENC 通道的 ROI（感兴趣区域）属性。本接口查询 H.264/H.265 编码通道中指定 ROI 区域索引的当前 ROI 配置。
- [axcl.venc.set_rc_param](#axcl.venc.set_rc_param): 设置 VENC 通道的码率控制参数。本接口配置 H.264/H.265 和 MJPEG 编码通道的码率控制（RC）参数。H.264/H.265 支持 CBR、VBR、AVBR、CVBR、FIXQP 和 QPMAP 码率控制模式；MJPEG 支持 CBR、VBR 和 FIXQP。
- [axcl.venc.get_rc_param](#axcl.venc.get_rc_param): 获取 VENC 通道的码率控制参数。本接口获取 H.264/H.265 和 MJPEG 编码通道的码率控制参数。
- [axcl.venc.set_mod_param](#axcl.venc.set_mod_param): 设置编码模块属性。本接口配置指定编码器类型（H.264 或 H.265）的全局模块参数。这些参数影响使用同一编码器类型的所有通道，通常包括硬件频率设置。
- [axcl.venc.get_mod_param](#axcl.venc.get_mod_param): 获取编码模块属性。本接口查询指定编码器类型（H.264 或 H.265）的当前全局模块参数，包括硬件频率及其他模块级设置。
- [axcl.venc.set_vui_param](#axcl.venc.set_vui_param): 设置 VENC 通道的 VUI（视频可用性信息）参数。本接口配置编码通道的 VUI 参数。VUI 包含宽高比、色彩原色、传递特性和矩阵系数等视频特性元数据，帮助解码器正确解释和显示编码视频。
- [axcl.venc.get_vui_param](#axcl.venc.get_vui_param): 获取 VENC 通道的 VUI（视频可用性信息）参数。本接口查询编码通道的当前 VUI 配置。VUI 参数包含视频特性元数据，帮助解码器正确解释和显示编码视频。
- [axcl.venc.set_chn_attr](#axcl.venc.set_chn_attr): 设置 VENC 通道属性。本接口更新 VENC 通道属性。字段能否动态修改取决于通道状态和字段定义。
- [axcl.venc.get_chn_attr](#axcl.venc.get_chn_attr): 获取 VENC 通道属性。本接口获取 VENC 通道的当前配置，包括编码协议、分辨率、profile、level、码率控制模式、GOP 结构、link 模式、FIFO 深度和码流缓冲区大小。
- [axcl.venc.set_rate_jam_strategy](#axcl.venc.set_rate_jam_strategy): 设置编码通道在瞬时码率超过阈值时的丢帧策略。本接口配置编码器在瞬时码率超过配置阈值时的处理方式。支持两种策略：丢帧或编码 P-skip 帧。这有助于在产生过多数据的复杂场景中维持码率控制。
- [axcl.venc.get_rate_jam_strategy](#axcl.venc.get_rate_jam_strategy): 获取编码通道在瞬时码率超过阈值时的丢帧策略。本接口查询当前码率拥塞策略配置，该配置决定编码器在瞬时码率超过配置阈值时的处理方式。
- [axcl.venc.set_super_frame_strategy](#axcl.venc.set_super_frame_strategy): 设置 VENC 通道的超大帧重编码策略。本接口配置超大帧重编码策略，用于处理超过配置大小阈值的帧。检测到“超大帧”（超过阈值）时，编码器可调整参数并重新编码，以减小帧大小。这有助于避免超大帧引起的网络拥塞和缓冲区溢出。
- [axcl.venc.get_super_frame_strategy](#axcl.venc.get_super_frame_strategy): 获取 VENC 通道的超大帧重编码策略配置。本接口查询当前超大帧重编码策略配置，该配置决定编码器如何处理超过配置大小阈值的帧。
- [axcl.venc.set_intra_refresh](#axcl.venc.set_intra_refresh): 设置 VENC 通道的 GDR（渐进式解码刷新）帧内刷新属性。本接口配置编码通道的渐进式解码刷新（GDR）参数。GDR 使 P 帧周期性地以 I Slice 刷新，无需完整 IDR 帧即可逐步从错误中恢复。
- [axcl.venc.get_intra_refresh](#axcl.venc.get_intra_refresh): 获取 VENC 通道的 GDR（渐进式解码刷新）帧内刷新属性。本接口查询编码通道的当前 GDR 配置，包括刷新模式、刷新间隔和所需的 I 帧 QP 设置。
- [axcl.venc.set_usr_data](#axcl.venc.set_usr_data): 向 VENC 通道的编码码流插入用户数据。本接口配置将嵌入编码码流的自定义用户数据。
- [axcl.venc.get_usr_data](#axcl.venc.get_usr_data): 获取 VENC 通道的用户数据配置。本接口查询编码通道的当前用户数据配置，包括使能状态、数据指针和数据大小。
- [axcl.venc.set_slice_split](#axcl.venc.set_slice_split): 配置 VENC 通道的 Slice 分割属性。本接口设置编码通道的 Slice 分割配置。Slice 分割将每个编码帧划分为多个 Slice，可用于并行处理、容错或低延迟流媒体应用。
- [axcl.venc.get_slice_split](#axcl.venc.get_slice_split): 获取 VENC 通道的 Slice 分割属性。本接口查询编码通道的当前 Slice 分割配置，包括使能状态和 LCU 行数设置。
- [axcl.venc.request_idr](#axcl.venc.request_idr): 请求 VENC 通道生成 IDR（即时解码刷新）帧。本接口触发编码器生成 IDR 帧，复位解码器状态并开始新的 GOP（图像组）。IDR 帧对于视频流同步、错误恢复和随机访问点至关重要。
- [axcl.venc.query_status](#axcl.venc.query_status): 查询 VENC 通道当前状态。本接口获取 VENC 编码通道的当前运行状态，包括待编码帧数、输出缓冲区占用及其他运行指标。状态信息可用于监控编码器性能、发现瓶颈和实现流量控制。
- [axcl.venc.set_jpeg_param](#axcl.venc.set_jpeg_param): 更新 VENC 通道的 JPEG 编码参数。本接口更新 JPEG/MJPEG 通道参数，包括量化表、Qfactor、ROI 配置、MCU-per-ECS 和去块滤波。常见用法是调用（源码未提供接口引用）。
- [axcl.venc.get_jpeg_param](#axcl.venc.get_jpeg_param): 获取 VENC 通道的 JPEG 编码参数。本接口查询通道的当前 JPEG 编码参数，包括量化表、质量因子、ROI 配置及其他编码设置。
- [axcl.venc.jpeg_encode_one_frame](#axcl.venc.jpeg_encode_one_frame): 同步编码单个 JPEG 帧。本接口根据已保存的设置，将一帧输入编码为 JPEG 码流（源码未说明设置存储位置）。
- [axcl.venc.jpeg_get_thumbnail](#axcl.venc.jpeg_get_thumbnail): 从 JPEG 编码码流中提取缩略图数据。本接口从启用缩略图支持而编码生成的 JPEG 码流中提取嵌入的缩略图数据。缩略图必须由相应接口生成（源码未提供接口引用）。
- [axcl.venc.set_dblk_attr](#axcl.venc.set_dblk_attr): 更新 VENC 通道的去块滤波属性。本接口更新 H.264/H.265 编码通道的去块滤波设置。使用与当前通道类型匹配的编解码专用成员：H.264 使用 stH264Dblk，H.265 使用 stH265Dblk。常见用法是调用（源码未提供接口引用）。
- [axcl.venc.get_dblk_attr](#axcl.venc.get_dblk_attr): 获取 VENC 通道的去块滤波属性。本接口获取 H.264 或 H.265 通道的当前去块滤波配置。
- [axcl.venc.set_h265_sao](#axcl.venc.set_h265_sao): 更新 H.265 VENC 通道的 SAO（采样自适应偏移）参数。本接口启用或禁用 H.265/HEVC 通道的 SAO。常见用法是调用（源码未提供接口引用）。
- [axcl.venc.get_h265_sao](#axcl.venc.get_h265_sao): 获取 H.265 VENC 通道的 SAO（采样自适应偏移）参数。本接口获取 H.265/HEVC 通道的当前 SAO 配置。常见用法是调用（源码未提供接口引用）。
- [axcl.venc.set_de_breath_effect](#axcl.venc.set_de_breath_effect): 更新 VENC 通道的去呼吸效应参数。本接口启用或禁用 H.264/H.265 通道的去呼吸效应，并设置编码器使用的强度等级。
- [axcl.venc.get_de_breath_effect](#axcl.venc.get_de_breath_effect): 获取 VENC 通道的去呼吸效应参数。本接口查询编码通道的当前去呼吸效应配置，包括使能状态和强度等级设置。
- [axcl.venc.set_skin_detect_attr](#axcl.venc.set_skin_detect_attr): 设置 VENC 通道的肤色检测属性。本接口更新 H.264/H.265 通道中与肤色检测相关的编码器参数。控制编码器使用的使能标志、QP 差值和 Y/Cb/Cr 阈值。常见用法是调用（源码未提供接口引用）。
- [axcl.venc.get_skin_detect_attr](#axcl.venc.get_skin_detect_attr): 获取 VENC 通道的肤色检测属性。本接口获取 H.264/H.265 通道的当前肤色检测设置。常见用法是调用（源码未提供接口引用）。
- [axcl.venc.set_chroma_protect_attr](#axcl.venc.set_chroma_protect_attr): 设置 VENC 通道的色度保护属性。本接口更新 H.264/H.265 通道中与色度保护相关的编码器参数。常见用法是调用（源码未提供接口引用）。
- [axcl.venc.get_chroma_protect_attr](#axcl.venc.get_chroma_protect_attr): 获取 VENC 通道的色度保护属性。本接口获取 H.264/H.265 通道的当前色度保护设置。常见用法是调用（源码未提供接口引用）。
- [axcl.venc.set_trail_detect_attr](#axcl.venc.set_trail_detect_attr): 设置 VENC 通道的拖尾检测属性。本接口更新 H.264/H.265 通道中与拖尾检测相关的编码器参数。常见用法是调用（源码未提供接口引用）。
- [axcl.venc.get_trail_detect_attr](#axcl.venc.get_trail_detect_attr): 获取 VENC 通道的拖尾检测属性。本接口获取 H.264/H.265 通道的当前拖尾检测设置。
- [axcl.venc.set_srd_param](#axcl.venc.set_srd_param): 更新 VENC 通道的 SRD（静态区域检测）参数。本接口更新 H.264/H.265 通道中与 SRD 相关的编码器设置。常见用法是调用（源码未提供接口引用）。
- [axcl.venc.get_srd_param](#axcl.venc.get_srd_param): 获取 VENC 通道的 SRD（静态区域检测）参数。本接口获取 H.264/H.265 通道的当前 SRD 设置。常见用法是调用（源码未提供接口引用）。
- [axcl.venc.set_adv_enc_map_param](#axcl.venc.set_adv_enc_map_param): 更新 VENC 通道的高级编码映射参数。本接口更新 H.264/H.265 通道中 RDO 用于 CU 类型选择、CU 大小选择和帧内预测模式选择的编码器偏置映射。常见用法是调用（源码未提供接口引用）。
- [axcl.venc.get_adv_enc_map_param](#axcl.venc.get_adv_enc_map_param): 获取 VENC 通道的高级编码映射参数。本接口获取 H.264/H.265 通道的当前高级编码映射设置。常见用法是调用（源码未提供接口引用）。
- [axcl.venc.set_adv_param](#axcl.venc.set_adv_param): 设置 VENC 通道的高级编码参数。本接口配置编码通道的高级编码参数，如运动估计垂直搜索范围。
- [axcl.venc.get_adv_param](#axcl.venc.get_adv_param): 获取 VENC 通道的高级编码参数。本接口查询编码通道的当前高级编码参数，如运动估计垂直搜索范围。
- [axcl.venc.set_cir_param](#axcl.venc.set_cir_param): 设置 VENC 通道的 CIR（循环帧内刷新）参数。本接口配置编码通道的循环帧内刷新参数。CIR 周期性地将选定 MB 或 CTB 刷新为帧内编码块，有助于在不插入完整 I 帧的情况下提高容错能力。
- [axcl.venc.get_cir_param](#axcl.venc.get_cir_param): 获取 VENC 通道的 CIR（循环帧内刷新）参数。本接口查询编码通道的当前循环帧内刷新参数，包括起始 MB 或 CTB 索引和刷新间隔。

<br>

## 2. API

<a id="axcl.venc.init"></a>

### 2.1. axcl.venc.init

初始化 VENC 模块。本接口初始化 VENC 硬件编码模块并分配模块级资源。创建任何 VENC 通道前，必须先调用本接口。初始化时配置编码器类型（H.264/H.265、JPEG/MJPEG 或两者）和线程调度属性。

#### 2.1.1. 函数

**Python 调用**

```python
ret = axcl.venc.init(mod_attr)
```

**C++ 原型**

```cpp
AX_S32 AX_VENC_Init(const AX_VENC_MOD_ATTR_T *pstModAttr);
```

#### 2.1.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| mod_attr | dict &#124; None | 指向模块属性结构体的指针。为 NULL 时，SDK 使用默认属性（源码说明不完整）。 |

#### 2.1.3. 返回值

- `ret`: *int* — 成功。失败。参见 VENC 错误码。

#### 2.1.4. 说明

返回类型：`int`。

源码：`python/axcl/venc/ax_venc.py:1824`。

#### 2.1.5. 示例

```python
ret = axcl.venc.init(mod_attr)
```

<br>

<a id="axcl.venc.deinit"></a>

### 2.2. axcl.venc.deinit

去初始化 VENC 模块。本接口释放 VENC 模块资源，并使编码器不可用，直到（源码条件不完整）。

#### 2.2.1. 函数

**Python 调用**

```python
ret = axcl.venc.deinit()
```

**C++ 原型**

```cpp
AX_S32 AX_VENC_Deinit(void);
```

#### 2.2.2. 参数

不适用

#### 2.2.3. 返回值

- `ret`: *int* — 成功。失败。参见 VENC 错误码。

#### 2.2.4. 说明

返回类型：`int`。

源码：`python/axcl/venc/ax_venc.py:1855`。

#### 2.2.5. 示例

```python
ret = axcl.venc.deinit()
```

<br>

<a id="axcl.venc.create_chn"></a>

### 2.3. axcl.venc.create_chn

使用指定通道 ID 创建 VENC 通道。本接口创建 VENC 通道并配置其属性。

#### 2.3.1. 函数

**Python 调用**

```python
ret = axcl.venc.create_chn(ve_chn, attr)
```

**C++ 原型**

```cpp
AX_S32 AX_VENC_CreateChn(VENC_CHN VeChn, const AX_VENC_CHN_ATTR_T *pstAttr);
```

#### 2.3.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| ve_chn | int | VENC 通道 ID。有效范围：[0,（源码未提供上限）。 |
| attr | dict &#124; None | 指向通道属性的指针。不得为 NULL。 |

#### 2.3.3. 返回值

- `ret`: *int* — 成功。失败。参见 VENC 错误码。

#### 2.3.4. 说明

返回类型：`int`。

源码：`python/axcl/venc/ax_venc.py:1883`。

#### 2.3.5. 示例

```python
ret = axcl.venc.create_chn(ve_chn, attr)
```

<br>

<a id="axcl.venc.create_chn_ex"></a>

### 2.4. axcl.venc.create_chn_ex

创建 VENC 通道并自动分配通道 ID。本接口创建 VENC 通道并自动分配可用通道 ID。配置的属性与相应接口相同（源码未提供接口引用）。

#### 2.4.1. 函数

**Python 调用**

```python
ve_chn, ret = axcl.venc.create_chn_ex(attr)
```

**C++ 原型**

```cpp
AX_S32 AX_VENC_CreateChnEx(VENC_CHN *pVeChn, const AX_VENC_CHN_ATTR_T *pstAttr);
```

#### 2.4.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| attr | dict &#124; None | 指向通道属性结构体的指针。不得为 NULL。包含编码器配置，如编解码类型、分辨率、profile、level、码率控制、GOP 及其他参数。 |

#### 2.4.3. 返回值

- `ve_chn`: *int* — 用于接收分配的通道 ID 的指针。不得为 NULL。成功时包含分配的通道 ID。有效范围：[0,（源码未提供上限）。
- `ret`: *int* — 成功。通过 pVeChn 返回通道 ID。失败。参见 VENC 错误码。

#### 2.4.4. 说明

返回类型：`tuple[int, int]`。

源码：`python/axcl/venc/ax_venc.py:1916`。

#### 2.4.5. 示例

```python
ve_chn, ret = axcl.venc.create_chn_ex(attr)
```

<br>

<a id="axcl.venc.destroy_chn"></a>

### 2.5. axcl.venc.destroy_chn

销毁 VENC 通道。本接口销毁 VENC 通道，并释放所有通道级资源，包括码流缓冲区、输入输出队列和硬件上下文。

#### 2.5.1. 函数

**Python 调用**

```python
ret = axcl.venc.destroy_chn(ve_chn)
```

**C++ 原型**

```cpp
AX_S32 AX_VENC_DestroyChn(VENC_CHN VeChn);
```

#### 2.5.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| ve_chn | int | VENC 通道 ID。有效范围：[0,（源码未提供上限）。 |

#### 2.5.3. 返回值

- `ret`: *int* — 成功。失败。参见 VENC 错误码。

#### 2.5.4. 说明

返回类型：`int`。

源码：`python/axcl/venc/ax_venc.py:1950`。

#### 2.5.5. 示例

```python
ret = axcl.venc.destroy_chn(ve_chn)
```

<br>

<a id="axcl.venc.send_frame"></a>

### 2.6. axcl.venc.send_frame

向编码器缓冲队列发送原始图像帧信息。本接口向编码器输入队列提交原始视频帧。帧采用异步编码，编码码流可通过相应接口获取（源码未提供接口引用）。

#### 2.6.1. 函数

**Python 调用**

```python
ret = axcl.venc.send_frame(ve_chn, frame, milli_sec)
```

**C++ 原型**

```cpp
AX_S32 AX_VENC_SendFrame(VENC_CHN VeChn, const AX_VIDEO_FRAME_INFO_T *pstFrame, AX_S32 s32MilliSec);
```

#### 2.6.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| ve_chn | int | VENC 通道 ID。有效范围：[0,（源码未提供上限）。 |
| frame | dict &#124; None | 指向视频帧信息的指针。不得为 NULL。 |
| milli_sec | int | 超时时间，单位为毫秒：-1 为阻塞模式。等待帧发送完成；0 为非阻塞模式。发送失败时立即返回；>0 为超时模式。在超时时间内重试发送。 |

#### 2.6.3. 返回值

- `ret`: *int* — 成功。失败。参见 VENC 错误码。

#### 2.6.4. 说明

返回类型：`int`。

源码：`python/axcl/venc/ax_venc.py:1981`。

#### 2.6.5. 示例

```python
ret = axcl.venc.send_frame(ve_chn, frame, milli_sec)
```

<br>

<a id="axcl.venc.send_frame_ex"></a>

### 2.7. axcl.venc.send_frame_ex

向 VENC 通道发送带用户元数据的输入帧。本接口提交帧及用户 RC、QPMap、标志映射和 EXIF 元数据。用于调用者需要额外逐帧控制的场景（源码未说明对照接口）。

#### 2.7.1. 函数

**Python 调用**

```python
ret = axcl.venc.send_frame_ex(ve_chn, frame, milli_sec)
```

**C++ 原型**

```cpp
AX_S32 AX_VENC_SendFrameEx(VENC_CHN VeChn, const AX_USER_FRAME_INFO_T *pstFrame, AX_S32 s32MilliSec);
```

#### 2.7.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| ve_chn | int | VENC 通道 ID。 |
| frame | dict &#124; None | 指向用户帧信息的指针。不得为 NULL。 |
| milli_sec | int | 超时时间，单位为毫秒。 |

#### 2.7.3. 返回值

- `ret`: *int* — 成功。失败。参见 VENC 错误码。

#### 2.7.4. 说明

返回类型：`int`。

源码：`python/axcl/venc/ax_venc.py:2016`。

#### 2.7.5. 示例

```python
ret = axcl.venc.send_frame_ex(ve_chn, frame, milli_sec)
```

<br>

<a id="axcl.venc.set_chn_thread_bind"></a>

### 2.8. axcl.venc.set_chn_thread_bind

为 VENC 通道设置独立的 ENC 工作线程绑定策略。

#### 2.8.1. 函数

**Python 调用**

```python
ret = axcl.venc.set_chn_thread_bind(ve_chn, thread_bind)
```

**C++ 原型**

```cpp
AX_S32 AX_VENC_SetChnThreadBind(VENC_CHN VeChn, const AX_VENC_CHN_THREAD_BIND_T *pstThreadBind);
```

#### 2.8.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| ve_chn | int | VENC 通道 ID。有效范围：[0,（源码未提供上限）。 |
| thread_bind | dict &#124; None | 指向 ENC 绑定策略的指针。不得为 NULL。 |

#### 2.8.3. 返回值

- `ret`: *int* — 成功。失败。参见 VENC 错误码。

#### 2.8.4. 说明

返回类型：`int`。

源码：`python/axcl/venc/ax_venc.py:2051`。

#### 2.8.5. 示例

```python
ret = axcl.venc.set_chn_thread_bind(ve_chn, thread_bind)
```

<br>

<a id="axcl.venc.get_chn_thread_bind"></a>

### 2.9. axcl.venc.get_chn_thread_bind

获取 VENC 通道请求的 ENC 绑定策略。

#### 2.9.1. 函数

**Python 调用**

```python
thread_bind, ret = axcl.venc.get_chn_thread_bind(ve_chn)
```

**C++ 原型**

```cpp
AX_S32 AX_VENC_GetChnThreadBind(VENC_CHN VeChn, AX_VENC_CHN_THREAD_BIND_T *pstThreadBind);
```

#### 2.9.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| ve_chn | int | VENC 通道 ID。有效范围：[0,（源码未提供上限）。 |

#### 2.9.3. 返回值

- `thread_bind`: *dict* — 接收 ENC 绑定策略的指针。不得为 NULL。
- `ret`: *int* — 成功。失败。参见 VENC 错误码。

#### 2.9.4. 说明

返回类型：`tuple[dict, int]`。

源码：`python/axcl/venc/ax_venc.py:2084`。

#### 2.9.5. 示例

```python
thread_bind, ret = axcl.venc.get_chn_thread_bind(ve_chn)
```

<br>

<a id="axcl.venc.select_grp"></a>

### 2.10. axcl.venc.select_grp

查询指定组中的编码通道是否有码流输出。

#### 2.10.1. 函数

**Python 调用**

```python
chn_strm_state, ret = axcl.venc.select_grp(grp_id, milli_sec)
```

**C++ 原型**

```cpp
AX_S32 AX_VENC_SelectGrp(VENC_GRP grpId, AX_CHN_STREAM_STATUS_T *pstChnStrmState, AX_S32 s32MilliSec);
```

#### 2.10.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| grp_id | int | VENC select 组 ID。 |
| milli_sec | int | 超时时间，单位为毫秒：-1 为阻塞模式；0 为非阻塞模式；>0 为超时模式。 |

#### 2.10.3. 返回值

- `chn_strm_state`: *dict* — 指向通道码流状态的指针。不得为 NULL。
- `ret`: *int* — 成功。失败。参见 VENC 错误码。

#### 2.10.4. 说明

返回类型：`tuple[dict, int]`。

源码：`python/axcl/venc/ax_venc.py:2118`。

#### 2.10.5. 示例

```python
chn_strm_state, ret = axcl.venc.select_grp(grp_id, milli_sec)
```

<br>

<a id="axcl.venc.select_clear_grp"></a>

### 2.11. axcl.venc.select_clear_grp

清除 select 组参数。本接口仅重置指定 select 组的成员关系。不会销毁组本身、停止任何通道或释放通道资源。

#### 2.11.1. 函数

**Python 调用**

```python
ret = axcl.venc.select_clear_grp(grp_id)
```

**C++ 原型**

```cpp
AX_S32 AX_VENC_SelectClearGrp(VENC_GRP grpId);
```

#### 2.11.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| grp_id | int | VENC select 组 ID。有效范围：[0,（源码未提供上限）。 |

#### 2.11.3. 返回值

- `ret`: *int* — 成功。失败。参见 VENC 错误码。

#### 2.11.4. 说明

返回类型：`int`。

源码：`python/axcl/venc/ax_venc.py:2154`。

#### 2.11.5. 示例

```python
ret = axcl.venc.select_clear_grp(grp_id)
```

<br>

<a id="axcl.venc.select_grp_add_chn"></a>

### 2.12. axcl.venc.select_grp_add_chn

向 VENC select 组添加编码通道。

#### 2.12.1. 函数

**Python 调用**

```python
ret = axcl.venc.select_grp_add_chn(grp_id, ve_chn)
```

**C++ 原型**

```cpp
AX_S32 AX_VENC_SelectGrpAddChn(VENC_GRP grpId, VENC_CHN VeChn);
```

#### 2.12.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| grp_id | int | VENC select 组 ID。有效范围：[0,（源码未提供上限）。 |
| ve_chn | int | 要添加的 VENC 通道 ID。有效范围：[0,（源码未提供上限）。 |

#### 2.12.3. 返回值

- `ret`: *int* — 成功。失败。参见 VENC 错误码。

#### 2.12.4. 说明

返回类型：`int`。

源码：`python/axcl/venc/ax_venc.py:2185`。

#### 2.12.5. 示例

```python
ret = axcl.venc.select_grp_add_chn(grp_id, ve_chn)
```

<br>

<a id="axcl.venc.select_grp_delete_chn"></a>

### 2.13. axcl.venc.select_grp_delete_chn

从 VENC select 组移除编码通道。

#### 2.13.1. 函数

**Python 调用**

```python
ret = axcl.venc.select_grp_delete_chn(grp_id, ve_chn)
```

**C++ 原型**

```cpp
AX_S32 AX_VENC_SelectGrpDeleteChn(VENC_GRP grpId, VENC_CHN VeChn);
```

#### 2.13.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| grp_id | int | VENC select 组 ID。有效范围：[0,（源码未提供上限）。 |
| ve_chn | int | 要移除的 VENC 通道 ID。有效范围：[0,（源码未提供上限）。 |

#### 2.13.3. 返回值

- `ret`: *int* — 成功。失败。参见 VENC 错误码。

#### 2.13.4. 说明

返回类型：`int`。

源码：`python/axcl/venc/ax_venc.py:2218`。

#### 2.13.5. 示例

```python
ret = axcl.venc.select_grp_delete_chn(grp_id, ve_chn)
```

<br>

<a id="axcl.venc.select_grp_query"></a>

### 2.14. axcl.venc.select_grp_query

查询 VENC select 组配置。

#### 2.14.1. 函数

**Python 调用**

```python
grp_info, ret = axcl.venc.select_grp_query(grp_id)
```

**C++ 原型**

```cpp
AX_S32 AX_VENC_SelectGrpQuery(VENC_GRP grpId, AX_VENC_SELECT_GRP_PARAM_T *pstGrpInfo);
```

#### 2.14.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| grp_id | int | VENC select 组 ID。有效范围：[0,（源码未提供上限）。 |

#### 2.14.3. 返回值

- `grp_info`: *dict* — 指向组信息结构体的指针。
- `ret`: *int* — 成功。失败。参见 VENC 错误码。

#### 2.14.4. 说明

返回类型：`tuple[dict, int]`。

源码：`python/axcl/venc/ax_venc.py:2251`。

#### 2.14.5. 示例

```python
grp_info, ret = axcl.venc.select_grp_query(grp_id)
```

<br>

<a id="axcl.venc.get_fd"></a>

### 2.15. axcl.venc.get_fd

获取 VENC 通道的文件描述符。本接口返回与指定 VENC 通道关联的设备文件描述符。返回的 fd 可与 select()、poll() 或 epoll() 配合使用，以监控编码码流是否可用。

#### 2.15.1. 函数

**Python 调用**

```python
ret = axcl.venc.get_fd(ve_chn)
```

**C++ 原型**

```cpp
AX_S32 AX_VENC_GetFd(VENC_CHN VeChn);
```

#### 2.15.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| ve_chn | int | VENC 通道 ID。有效范围：[0,（源码未提供上限）。 |

#### 2.15.3. 返回值

- `ret`: *int* — 成功时返回非负文件描述符。失败时返回负值。

#### 2.15.4. 说明

返回类型：`int`。

源码：`python/axcl/venc/ax_venc.py:2285`。

#### 2.15.5. 示例

```python
ret = axcl.venc.get_fd(ve_chn)
```

<br>

<a id="axcl.venc.get_stream"></a>

### 2.16. axcl.venc.get_stream

从 VENC 通道获取编码码流。本接口从指定 VENC 通道获取一份编码码流。返回的码流必须通过相应接口释放（源码未提供接口引用）。

#### 2.16.1. 函数

**Python 调用**

```python
stream, ret = axcl.venc.get_stream(ve_chn, milli_sec)
```

**C++ 原型**

```cpp
AX_S32 AX_VENC_GetStream(VENC_CHN VeChn, AX_VENC_STREAM_T *pstStream, AX_S32 s32MilliSec);
```

#### 2.16.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| ve_chn | int | VENC 通道 ID。 |
| milli_sec | int | 超时时间，单位为毫秒：-1 为阻塞模式；0 为非阻塞模式；>0 为超时模式。 |

#### 2.16.3. 返回值

- `stream`: *dict* — 指向编码码流信息的指针。不得为 NULL。
- `ret`: *int* — 成功。失败。参见 VENC 错误码。

#### 2.16.4. 说明

返回类型：`tuple[dict, int]`。

源码：`python/axcl/venc/ax_venc.py:2316`。

#### 2.16.5. 示例

```python
stream, ret = axcl.venc.get_stream(ve_chn, milli_sec)
```

<br>

<a id="axcl.venc.release_stream"></a>

### 2.17. axcl.venc.release_stream

释放从 VENC 通道获取的编码码流。本接口释放已获取的码流缓冲区（源码未提供获取接口引用）。

#### 2.17.1. 函数

**Python 调用**

```python
ret = axcl.venc.release_stream(ve_chn, stream)
```

**C++ 原型**

```cpp
AX_S32 AX_VENC_ReleaseStream(VENC_CHN VeChn, const AX_VENC_STREAM_T *pstStream);
```

#### 2.17.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| ve_chn | int | VENC 通道 ID。有效范围：[0,（源码未提供上限）。 |
| stream | dict &#124; None | 指向返回的码流信息的指针（源码未提供接口引用）。 |

#### 2.17.3. 返回值

- `ret`: *int* — 成功。失败。参见 VENC 错误码。

#### 2.17.4. 说明

返回类型：`int`。

源码：`python/axcl/venc/ax_venc.py:2352`。

#### 2.17.5. 示例

```python
ret = axcl.venc.release_stream(ve_chn, stream)
```

<br>

<a id="axcl.venc.get_stream_buf_info"></a>

### 2.18. axcl.venc.get_stream_buf_info

获取 VENC 通道的码流缓冲区信息。本接口获取为指定 VENC 编码通道分配的码流缓冲区物理地址和大小。该信息可用于调试、内存管理或直接访问缓冲区的场景。

#### 2.18.1. 函数

**Python 调用**

```python
stream_buf_info, ret = axcl.venc.get_stream_buf_info(ve_chn)
```

**C++ 原型**

```cpp
AX_S32 AX_VENC_GetStreamBufInfo(VENC_CHN VeChn, AX_VENC_STREAM_BUF_INFO_T *pstStreamBufInfo);
```

#### 2.18.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| ve_chn | int | VENC 通道 ID。有效范围：[0,（源码未提供上限）。 |

#### 2.18.3. 返回值

- `stream_buf_info`: *dict* — 指向码流缓冲区信息结构体的指针。不得为 NULL。成功时包含码流缓冲区的物理地址和大小。
- `ret`: *int* — 成功。失败。参见 VENC 错误码。

#### 2.18.4. 说明

返回类型：`tuple[dict, int]`。

源码：`python/axcl/venc/ax_venc.py:2385`。

#### 2.18.5. 示例

```python
stream_buf_info, ret = axcl.venc.get_stream_buf_info(ve_chn)
```

<br>

<a id="axcl.venc.start_recv_frame"></a>

### 2.19. axcl.venc.start_recv_frame

使编码通道能够接收输入图像。本接口成功返回后，通道可编码来自相应来源的输入帧（源码说明不完整）。

#### 2.19.1. 函数

**Python 调用**

```python
ret = axcl.venc.start_recv_frame(ve_chn, recv_param)
```

**C++ 原型**

```cpp
AX_S32 AX_VENC_StartRecvFrame(VENC_CHN VeChn, const AX_VENC_RECV_PIC_PARAM_T *pstRecvParam);
```

#### 2.19.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| ve_chn | int | VENC 通道 ID。有效范围：[0,（源码未提供上限）。 |
| recv_param | dict &#124; None | 指向接收图像参数的指针。不得为 NULL。 |

#### 2.19.3. 返回值

- `ret`: *int* — 成功。失败。参见 VENC 错误码。

#### 2.19.4. 说明

返回类型：`int`。

源码：`python/axcl/venc/ax_venc.py:2419`。

#### 2.19.5. 示例

```python
ret = axcl.venc.start_recv_frame(ve_chn, recv_param)
```

<br>

<a id="axcl.venc.stop_recv_frame"></a>

### 2.20. axcl.venc.stop_recv_frame

停止 VENC 通道接收输入帧。本接口停止 VENC 通道接收新的输入帧。编码器继续处理内部队列中的剩余帧。

#### 2.20.1. 函数

**Python 调用**

```python
ret = axcl.venc.stop_recv_frame(ve_chn)
```

**C++ 原型**

```cpp
AX_S32 AX_VENC_StopRecvFrame(VENC_CHN VeChn);
```

#### 2.20.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| ve_chn | int | VENC 通道 ID。有效范围：[0,（源码未提供上限）。 |

#### 2.20.3. 返回值

- `ret`: *int* — 成功。失败。参见 VENC 错误码。

#### 2.20.4. 说明

返回类型：`int`。

源码：`python/axcl/venc/ax_venc.py:2452`。

#### 2.20.5. 示例

```python
ret = axcl.venc.stop_recv_frame(ve_chn)
```

<br>

<a id="axcl.venc.reset_chn"></a>

### 2.21. axcl.venc.reset_chn

复位 VENC 通道，清除输入和输出缓冲区。本接口复位指定 VENC 编码通道，从内部缓冲区清除所有待处理输入帧和已编码输出码流。通道恢复为已清空状态，复位后可重新启动。

#### 2.21.1. 函数

**Python 调用**

```python
ret = axcl.venc.reset_chn(ve_chn)
```

**C++ 原型**

```cpp
AX_S32 AX_VENC_ResetChn(VENC_CHN VeChn);
```

#### 2.21.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| ve_chn | int | VENC 通道 ID。有效范围：[0,（源码未提供上限）。 |

#### 2.21.3. 返回值

- `ret`: *int* — 成功。失败。参见 VENC 错误码。

#### 2.21.4. 说明

返回类型：`int`。

源码：`python/axcl/venc/ax_venc.py:2483`。

#### 2.21.5. 示例

```python
ret = axcl.venc.reset_chn(ve_chn)
```

<br>

<a id="axcl.venc.set_roi_attr"></a>

### 2.22. axcl.venc.set_roi_attr

设置 H.264/H.265 VENC 通道的 ROI（感兴趣区域）属性。本接口配置 H.264/H.265 通道的 ROI 编码参数，使编码帧内的指定区域可使用不同的质量等级。每个通道最多可配置 8 个 ROI 区域，并分别设置 QP。

#### 2.22.1. 函数

**Python 调用**

```python
ret = axcl.venc.set_roi_attr(ve_chn, roi_attr)
```

**C++ 原型**

```cpp
AX_S32 AX_VENC_SetRoiAttr(VENC_CHN VeChn, const AX_VENC_ROI_ATTR_T *pstRoiAttr);
```

#### 2.22.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| ve_chn | int | VENC 通道 ID。有效范围：[0,（源码未提供上限）。 |
| roi_attr | dict &#124; None | 指向 ROI 属性结构体的指针。不得为 NULL。包含 ROI 索引、使能标志、QP 模式、区域坐标和 QP 值。 |

#### 2.22.3. 返回值

- `ret`: *int* — 成功。失败。参见 VENC 错误码。

#### 2.22.4. 说明

返回类型：`int`。

源码：`python/axcl/venc/ax_venc.py:2514`。

#### 2.22.5. 示例

```python
ret = axcl.venc.set_roi_attr(ve_chn, roi_attr)
```

<br>

<a id="axcl.venc.get_roi_attr"></a>

### 2.23. axcl.venc.get_roi_attr

获取 H.264/H.265 VENC 通道的 ROI（感兴趣区域）属性。本接口查询 H.264/H.265 编码通道中指定 ROI 区域索引的当前 ROI 配置。

#### 2.23.1. 函数

**Python 调用**

```python
roi_attr, ret = axcl.venc.get_roi_attr(ve_chn, index)
```

**C++ 原型**

```cpp
AX_S32 AX_VENC_GetRoiAttr(VENC_CHN VeChn, AX_U32 u32Index, AX_VENC_ROI_ATTR_T *pstRoiAttr);
```

#### 2.23.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| ve_chn | int | VENC 通道 ID。有效范围：[0,（源码未提供上限）。 |
| index | int | ROI 区域索引。有效范围：[0, 7]。 |

#### 2.23.3. 返回值

- `roi_attr`: *dict* — 指向 ROI 属性结构体的指针。不得为 NULL。成功时包含指定索引对应的当前 ROI 配置。
- `ret`: *int* — 成功。失败。参见 VENC 错误码。

#### 2.23.4. 说明

返回类型：`tuple[dict, int]`。

源码：`python/axcl/venc/ax_venc.py:2547`。

#### 2.23.5. 示例

```python
roi_attr, ret = axcl.venc.get_roi_attr(ve_chn, index)
```

<br>

<a id="axcl.venc.set_rc_param"></a>

### 2.24. axcl.venc.set_rc_param

设置 VENC 通道的码率控制参数。本接口配置 H.264/H.265 和 MJPEG 编码通道的码率控制（RC）参数。H.264/H.265 支持 CBR、VBR、AVBR、CVBR、FIXQP 和 QPMAP 码率控制模式；MJPEG 支持 CBR、VBR 和 FIXQP。

#### 2.24.1. 函数

**Python 调用**

```python
ret = axcl.venc.set_rc_param(ve_chn, rc_param)
```

**C++ 原型**

```cpp
AX_S32 AX_VENC_SetRcParam(VENC_CHN VeChn, const AX_VENC_RC_PARAM_T *pstRcParam);
```

#### 2.24.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| ve_chn | int | VENC 通道 ID。有效范围：[0,（源码未提供上限）。 |
| rc_param | dict &#124; None | 指向码率控制参数的指针。不得为 NULL。 |

#### 2.24.3. 返回值

- `ret`: *int* — 成功。失败。参见 VENC 错误码。

#### 2.24.4. 说明

返回类型：`int`。

源码：`python/axcl/venc/ax_venc.py:2583`。

#### 2.24.5. 示例

```python
ret = axcl.venc.set_rc_param(ve_chn, rc_param)
```

<br>

<a id="axcl.venc.get_rc_param"></a>

### 2.25. axcl.venc.get_rc_param

获取 VENC 通道的码率控制参数。本接口获取 H.264/H.265 和 MJPEG 编码通道的码率控制参数。

#### 2.25.1. 函数

**Python 调用**

```python
rc_param, ret = axcl.venc.get_rc_param(ve_chn)
```

**C++ 原型**

```cpp
AX_S32 AX_VENC_GetRcParam(VENC_CHN VeChn, AX_VENC_RC_PARAM_T *pstRcParam);
```

#### 2.25.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| ve_chn | int | VENC 通道 ID。 |

#### 2.25.3. 返回值

- `rc_param`: *dict* — 指向码率控制参数的指针。不得为 NULL。
- `ret`: *int* — 成功。失败。参见 VENC 错误码。

#### 2.25.4. 说明

返回类型：`tuple[dict, int]`。

源码：`python/axcl/venc/ax_venc.py:2616`。

#### 2.25.5. 示例

```python
rc_param, ret = axcl.venc.get_rc_param(ve_chn)
```

<br>

<a id="axcl.venc.set_mod_param"></a>

### 2.26. axcl.venc.set_mod_param

设置编码模块属性。本接口配置指定编码器类型（H.264 或 H.265）的全局模块参数。这些参数影响使用同一编码器类型的所有通道，通常包括硬件频率设置。

#### 2.26.1. 函数

**Python 调用**

```python
ret = axcl.venc.set_mod_param(venc_type, mod_param)
```

**C++ 原型**

```cpp
AX_S32 AX_VENC_SetModParam(AX_VENC_ENCODER_TYPE_E enVencType, const AX_VENC_MOD_PARAM_T *pstModParam);
```

#### 2.26.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| venc_type | int | 编码器类型（如 H.264、H.265）。 |
| mod_param | dict &#124; None | 指向模块参数的指针。不得为 NULL。包含硬件频率及其他模块级设置。 |

#### 2.26.3. 返回值

- `ret`: *int* — 成功。失败。参见 VENC 错误码。

#### 2.26.4. 说明

返回类型：`int`。

源码：`python/axcl/venc/ax_venc.py:2650`。

#### 2.26.5. 示例

```python
ret = axcl.venc.set_mod_param(venc_type, mod_param)
```

<br>

<a id="axcl.venc.get_mod_param"></a>

### 2.27. axcl.venc.get_mod_param

获取编码模块属性。本接口查询指定编码器类型（H.264 或 H.265）的当前全局模块参数，包括硬件频率及其他模块级设置。

#### 2.27.1. 函数

**Python 调用**

```python
mod_param, ret = axcl.venc.get_mod_param(venc_type)
```

**C++ 原型**

```cpp
AX_S32 AX_VENC_GetModParam(AX_VENC_ENCODER_TYPE_E enVencType, AX_VENC_MOD_PARAM_T *pstModParam);
```

#### 2.27.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| venc_type | int | 编码器类型（如 H.264、H.265）。 |

#### 2.27.3. 返回值

- `mod_param`: *dict* — 指向模块参数的指针。不得为 NULL。成功时包含当前模块配置。
- `ret`: *int* — 成功。失败。参见 VENC 错误码。

#### 2.27.4. 说明

返回类型：`tuple[dict, int]`。

源码：`python/axcl/venc/ax_venc.py:2683`。

#### 2.27.5. 示例

```python
mod_param, ret = axcl.venc.get_mod_param(venc_type)
```

<br>

<a id="axcl.venc.set_vui_param"></a>

### 2.28. axcl.venc.set_vui_param

设置 VENC 通道的 VUI（视频可用性信息）参数。本接口配置编码通道的 VUI 参数。VUI 包含宽高比、色彩原色、传递特性和矩阵系数等视频特性元数据，帮助解码器正确解释和显示编码视频。

#### 2.28.1. 函数

**Python 调用**

```python
ret = axcl.venc.set_vui_param(ve_chn, vui_param)
```

**C++ 原型**

```cpp
AX_S32 AX_VENC_SetVuiParam(VENC_CHN VeChn, const AX_VENC_VUI_PARAM_T *pstVuiParam);
```

#### 2.28.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| ve_chn | int | VENC 通道 ID。有效范围：[0,（源码未提供上限）。 |
| vui_param | dict &#124; None | 指向 VUI 参数结构体的指针。不得为 NULL。包含宽高比、时序信息和色彩空间参数等 VUI 配置。 |

#### 2.28.3. 返回值

- `ret`: *int* — 成功。失败。参见 VENC 错误码。

#### 2.28.4. 说明

返回类型：`int`。

源码：`python/axcl/venc/ax_venc.py:2717`。

#### 2.28.5. 示例

```python
ret = axcl.venc.set_vui_param(ve_chn, vui_param)
```

<br>

<a id="axcl.venc.get_vui_param"></a>

### 2.29. axcl.venc.get_vui_param

获取 VENC 通道的 VUI（视频可用性信息）参数。本接口查询编码通道的当前 VUI 配置。VUI 参数包含视频特性元数据，帮助解码器正确解释和显示编码视频。

#### 2.29.1. 函数

**Python 调用**

```python
vui_param, ret = axcl.venc.get_vui_param(ve_chn)
```

**C++ 原型**

```cpp
AX_S32 AX_VENC_GetVuiParam(VENC_CHN VeChn, AX_VENC_VUI_PARAM_T *pstVuiParam);
```

#### 2.29.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| ve_chn | int | VENC 通道 ID。有效范围：[0,（源码未提供上限）。 |

#### 2.29.3. 返回值

- `vui_param`: *dict* — 指向 VUI 参数结构体的指针。不得为 NULL。成功时包含当前 VUI 配置。
- `ret`: *int* — 成功。失败。参见 VENC 错误码。

#### 2.29.4. 说明

返回类型：`tuple[dict, int]`。

源码：`python/axcl/venc/ax_venc.py:2750`。

#### 2.29.5. 示例

```python
vui_param, ret = axcl.venc.get_vui_param(ve_chn)
```

<br>

<a id="axcl.venc.set_chn_attr"></a>

### 2.30. axcl.venc.set_chn_attr

设置 VENC 通道属性。本接口更新 VENC 通道属性。字段能否动态修改取决于通道状态和字段定义。

#### 2.30.1. 函数

**Python 调用**

```python
ret = axcl.venc.set_chn_attr(ve_chn, chn_attr)
```

**C++ 原型**

```cpp
AX_S32 AX_VENC_SetChnAttr(VENC_CHN VeChn, const AX_VENC_CHN_ATTR_T *pstChnAttr);
```

#### 2.30.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| ve_chn | int | VENC 通道 ID。有效范围：[0,（源码未提供上限）。 |
| chn_attr | dict &#124; None | 指向通道属性的指针。不得为 NULL。包含新的通道配置，包括编码协议、分辨率、profile、level、码率控制模式、GOP 结构、link 模式、FIFO 深度和码流缓冲区大小。 |

#### 2.30.3. 返回值

- `ret`: *int* — 成功。失败。参见 VENC 错误码。

#### 2.30.4. 说明

返回类型：`int`。

源码：`python/axcl/venc/ax_venc.py:2784`。

#### 2.30.5. 示例

```python
ret = axcl.venc.set_chn_attr(ve_chn, chn_attr)
```

<br>

<a id="axcl.venc.get_chn_attr"></a>

### 2.31. axcl.venc.get_chn_attr

获取 VENC 通道属性。本接口获取 VENC 通道的当前配置，包括编码协议、分辨率、profile、level、码率控制模式、GOP 结构、link 模式、FIFO 深度和码流缓冲区大小。

#### 2.31.1. 函数

**Python 调用**

```python
chn_attr, ret = axcl.venc.get_chn_attr(ve_chn)
```

**C++ 原型**

```cpp
AX_S32 AX_VENC_GetChnAttr(VENC_CHN VeChn, AX_VENC_CHN_ATTR_T *pstChnAttr);
```

#### 2.31.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| ve_chn | int | VENC 通道 ID。有效范围：[0,（源码未提供上限）。 |

#### 2.31.3. 返回值

- `chn_attr`: *dict* — 指向通道属性的指针。不得为 NULL。成功时包含当前通道配置。
- `ret`: *int* — 成功。失败。参见 VENC 错误码。

#### 2.31.4. 说明

返回类型：`tuple[dict, int]`。

源码：`python/axcl/venc/ax_venc.py:2817`。

#### 2.31.5. 示例

```python
chn_attr, ret = axcl.venc.get_chn_attr(ve_chn)
```

<br>

<a id="axcl.venc.set_rate_jam_strategy"></a>

### 2.32. axcl.venc.set_rate_jam_strategy

设置编码通道在瞬时码率超过阈值时的丢帧策略。本接口配置编码器在瞬时码率超过配置阈值时的处理方式。支持两种策略：丢帧或编码 P-skip 帧。这有助于在产生过多数据的复杂场景中维持码率控制。

#### 2.32.1. 函数

**Python 调用**

```python
ret = axcl.venc.set_rate_jam_strategy(ve_chn, rate_jam_param)
```

**C++ 原型**

```cpp
AX_S32 AX_VENC_SetRateJamStrategy(VENC_CHN VeChn, const AX_VENC_RATE_JAM_CFG_T *pstRateJamParam);
```

#### 2.32.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| ve_chn | int | VENC 通道 ID。有效范围：[0,（源码未提供上限）。 |
| rate_jam_param | dict &#124; None | 指向码率拥塞配置参数的指针。不得为 NULL。包含策略类型和阈值设置。 |

#### 2.32.3. 返回值

- `ret`: *int* — 成功。失败。参见 VENC 错误码。

#### 2.32.4. 说明

返回类型：`int`。

源码：`python/axcl/venc/ax_venc.py:2851`。

#### 2.32.5. 示例

```python
ret = axcl.venc.set_rate_jam_strategy(ve_chn, rate_jam_param)
```

<br>

<a id="axcl.venc.get_rate_jam_strategy"></a>

### 2.33. axcl.venc.get_rate_jam_strategy

获取编码通道在瞬时码率超过阈值时的丢帧策略。本接口查询当前码率拥塞策略配置，该配置决定编码器在瞬时码率超过配置阈值时的处理方式。

#### 2.33.1. 函数

**Python 调用**

```python
rate_jam_param, ret = axcl.venc.get_rate_jam_strategy(ve_chn)
```

**C++ 原型**

```cpp
AX_S32 AX_VENC_GetRateJamStrategy(VENC_CHN VeChn, AX_VENC_RATE_JAM_CFG_T *pstRateJamParam);
```

#### 2.33.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| ve_chn | int | VENC 通道 ID。有效范围：[0,（源码未提供上限）。 |

#### 2.33.3. 返回值

- `rate_jam_param`: *dict* — 指向码率拥塞配置参数的指针。不得为 NULL。成功时包含当前策略配置。
- `ret`: *int* — 成功。失败。参见 VENC 错误码。

#### 2.33.4. 说明

返回类型：`tuple[dict, int]`。

源码：`python/axcl/venc/ax_venc.py:2884`。

#### 2.33.5. 示例

```python
rate_jam_param, ret = axcl.venc.get_rate_jam_strategy(ve_chn)
```

<br>

<a id="axcl.venc.set_super_frame_strategy"></a>

### 2.34. axcl.venc.set_super_frame_strategy

设置 VENC 通道的超大帧重编码策略。本接口配置超大帧重编码策略，用于处理超过配置大小阈值的帧。检测到“超大帧”（超过阈值）时，编码器可调整参数并重新编码，以减小帧大小。这有助于避免超大帧引起的网络拥塞和缓冲区溢出。

#### 2.34.1. 函数

**Python 调用**

```python
ret = axcl.venc.set_super_frame_strategy(ve_chn, super_frame_cfg)
```

**C++ 原型**

```cpp
AX_S32 AX_VENC_SetSuperFrameStrategy(VENC_CHN VeChn, const AX_VENC_SUPERFRAME_CFG_T *pstSuperFrameCfg);
```

#### 2.34.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| ve_chn | int | VENC 通道 ID。有效范围：[0,（源码未提供上限）。 |
| super_frame_cfg | dict &#124; None | 指向超大帧配置参数的指针。不得为 NULL。包含阈值设置和重编码策略参数。 |

#### 2.34.3. 返回值

- `ret`: *int* — 成功。失败。参见 VENC 错误码。

#### 2.34.4. 说明

返回类型：`int`。

源码：`python/axcl/venc/ax_venc.py:2918`。

#### 2.34.5. 示例

```python
ret = axcl.venc.set_super_frame_strategy(ve_chn, super_frame_cfg)
```

<br>

<a id="axcl.venc.get_super_frame_strategy"></a>

### 2.35. axcl.venc.get_super_frame_strategy

获取 VENC 通道的超大帧重编码策略配置。本接口查询当前超大帧重编码策略配置，该配置决定编码器如何处理超过配置大小阈值的帧。

#### 2.35.1. 函数

**Python 调用**

```python
super_frame_cfg, ret = axcl.venc.get_super_frame_strategy(ve_chn)
```

**C++ 原型**

```cpp
AX_S32 AX_VENC_GetSuperFrameStrategy(VENC_CHN VeChn, AX_VENC_SUPERFRAME_CFG_T *pstSuperFrameCfg);
```

#### 2.35.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| ve_chn | int | VENC 通道 ID。有效范围：[0,（源码未提供上限）。 |

#### 2.35.3. 返回值

- `super_frame_cfg`: *dict* — 指向超大帧配置参数的指针。不得为 NULL。成功时包含当前超大帧策略配置。
- `ret`: *int* — 成功。失败。参见 VENC 错误码。

#### 2.35.4. 说明

返回类型：`tuple[dict, int]`。

源码：`python/axcl/venc/ax_venc.py:2951`。

#### 2.35.5. 示例

```python
super_frame_cfg, ret = axcl.venc.get_super_frame_strategy(ve_chn)
```

<br>

<a id="axcl.venc.set_intra_refresh"></a>

### 2.36. axcl.venc.set_intra_refresh

设置 VENC 通道的 GDR（渐进式解码刷新）帧内刷新属性。本接口配置编码通道的渐进式解码刷新（GDR）参数。GDR 使 P 帧周期性地以 I Slice 刷新，无需完整 IDR 帧即可逐步从错误中恢复。

#### 2.36.1. 函数

**Python 调用**

```python
ret = axcl.venc.set_intra_refresh(ve_chn, intra_refresh)
```

**C++ 原型**

```cpp
AX_S32 AX_VENC_SetIntraRefresh(VENC_CHN VeChn, const AX_VENC_INTRA_REFRESH_T *pstIntraRefresh);
```

#### 2.36.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| ve_chn | int | VENC 通道 ID。有效范围：[0,（源码未提供上限）。 |
| intra_refresh | dict &#124; None | 指向帧内刷新配置参数的指针。不得为 NULL。包含刷新模式、刷新间隔和所需的 I 帧 QP 设置。 |

#### 2.36.3. 返回值

- `ret`: *int* — 成功。失败。参见 VENC 错误码。

#### 2.36.4. 说明

返回类型：`int`。

源码：`python/axcl/venc/ax_venc.py:2985`。

#### 2.36.5. 示例

```python
ret = axcl.venc.set_intra_refresh(ve_chn, intra_refresh)
```

<br>

<a id="axcl.venc.get_intra_refresh"></a>

### 2.37. axcl.venc.get_intra_refresh

获取 VENC 通道的 GDR（渐进式解码刷新）帧内刷新属性。本接口查询编码通道的当前 GDR 配置，包括刷新模式、刷新间隔和所需的 I 帧 QP 设置。

#### 2.37.1. 函数

**Python 调用**

```python
intra_refresh, ret = axcl.venc.get_intra_refresh(ve_chn)
```

**C++ 原型**

```cpp
AX_S32 AX_VENC_GetIntraRefresh(VENC_CHN VeChn, AX_VENC_INTRA_REFRESH_T *pstIntraRefresh);
```

#### 2.37.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| ve_chn | int | VENC 通道 ID。有效范围：[0,（源码未提供上限）。 |

#### 2.37.3. 返回值

- `intra_refresh`: *dict* — 指向帧内刷新配置参数的指针。不得为 NULL。成功时包含当前 GDR 设置。
- `ret`: *int* — 成功。失败。参见 VENC 错误码。

#### 2.37.4. 说明

返回类型：`tuple[dict, int]`。

源码：`python/axcl/venc/ax_venc.py:3018`。

#### 2.37.5. 示例

```python
intra_refresh, ret = axcl.venc.get_intra_refresh(ve_chn)
```

<br>

<a id="axcl.venc.set_usr_data"></a>

### 2.38. axcl.venc.set_usr_data

向 VENC 通道的编码码流插入用户数据。本接口配置将嵌入编码码流的自定义用户数据。

#### 2.38.1. 函数

**Python 调用**

```python
ret = axcl.venc.set_usr_data(ve_chn, usr_data)
```

**C++ 原型**

```cpp
AX_S32 AX_VENC_SetUsrData(VENC_CHN VeChn, const AX_VENC_USR_DATA_T *pstUsrData);
```

#### 2.38.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| ve_chn | int | VENC 通道 ID。有效范围：[0,（源码未提供上限）。 |
| usr_data | dict &#124; None | 指向用户数据配置的指针。不得为 NULL。包含使能标志、数据指针和数据大小。 |

#### 2.38.3. 返回值

- `ret`: *int* — 成功。失败。参见 VENC 错误码。

#### 2.38.4. 说明

返回类型：`int`。

源码：`python/axcl/venc/ax_venc.py:3052`。

#### 2.38.5. 示例

```python
ret = axcl.venc.set_usr_data(ve_chn, usr_data)
```

<br>

<a id="axcl.venc.get_usr_data"></a>

### 2.39. axcl.venc.get_usr_data

获取 VENC 通道的用户数据配置。本接口查询编码通道的当前用户数据配置，包括使能状态、数据指针和数据大小。

#### 2.39.1. 函数

**Python 调用**

```python
usr_data, ret = axcl.venc.get_usr_data(ve_chn, usr_data)
```

**C++ 原型**

```cpp
AX_S32 AX_VENC_GetUsrData(VENC_CHN VeChn, AX_VENC_USR_DATA_T *pstUsrData);
```

#### 2.39.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| ve_chn | int | VENC 通道 ID。有效范围：[0,（源码未提供上限）。 |
| usr_data | dict &#124; None | 输入缓冲区地址和请求字节数；返回更新后的使能状态和长度。 |

#### 2.39.3. 返回值

- `usr_data`: *dict* — 指向用户数据配置结构体的指针。不得为 NULL。成功时包含当前用户数据设置。
- `ret`: *int* — 成功。失败。参见 VENC 错误码。

#### 2.39.4. 说明

返回类型：`tuple[dict, int]`。

源码：`python/axcl/venc/ax_venc.py:3085`。

#### 2.39.5. 示例

```python
usr_data, ret = axcl.venc.get_usr_data(ve_chn, usr_data)
```

<br>

<a id="axcl.venc.set_slice_split"></a>

### 2.40. axcl.venc.set_slice_split

配置 VENC 通道的 Slice 分割属性。本接口设置编码通道的 Slice 分割配置。Slice 分割将每个编码帧划分为多个 Slice，可用于并行处理、容错或低延迟流媒体应用。

#### 2.40.1. 函数

**Python 调用**

```python
ret = axcl.venc.set_slice_split(ve_chn, slice_split)
```

**C++ 原型**

```cpp
AX_S32 AX_VENC_SetSliceSplit(VENC_CHN VeChn, const AX_VENC_SLICE_SPLIT_T *pstSliceSplit);
```

#### 2.40.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| ve_chn | int | VENC 通道 ID。有效范围：[0,（源码未提供上限）。 |
| slice_split | dict &#124; None | 指向 Slice 分割参数的指针。不得为 NULL。包含使能标志和 LCU 行数配置。 |

#### 2.40.3. 返回值

- `ret`: *int* — 成功。失败。参见 VENC 错误码。

#### 2.40.4. 说明

返回类型：`int`。

源码：`python/axcl/venc/ax_venc.py:3121`。

#### 2.40.5. 示例

```python
ret = axcl.venc.set_slice_split(ve_chn, slice_split)
```

<br>

<a id="axcl.venc.get_slice_split"></a>

### 2.41. axcl.venc.get_slice_split

获取 VENC 通道的 Slice 分割属性。本接口查询编码通道的当前 Slice 分割配置，包括使能状态和 LCU 行数设置。

#### 2.41.1. 函数

**Python 调用**

```python
slice_split, ret = axcl.venc.get_slice_split(ve_chn)
```

**C++ 原型**

```cpp
AX_S32 AX_VENC_GetSliceSplit(VENC_CHN VeChn, AX_VENC_SLICE_SPLIT_T *pstSliceSplit);
```

#### 2.41.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| ve_chn | int | VENC 通道 ID。有效范围：[0,（源码未提供上限）。 |

#### 2.41.3. 返回值

- `slice_split`: *dict* — 指向 Slice 分割参数结构体的指针。不得为 NULL。成功时包含当前 Slice 分割配置。
- `ret`: *int* — 成功。失败。参见 VENC 错误码。

#### 2.41.4. 说明

返回类型：`tuple[dict, int]`。

源码：`python/axcl/venc/ax_venc.py:3154`。

#### 2.41.5. 示例

```python
slice_split, ret = axcl.venc.get_slice_split(ve_chn)
```

<br>

<a id="axcl.venc.request_idr"></a>

### 2.42. axcl.venc.request_idr

请求 VENC 通道生成 IDR（即时解码刷新）帧。本接口触发编码器生成 IDR 帧，复位解码器状态并开始新的 GOP（图像组）。IDR 帧对于视频流同步、错误恢复和随机访问点至关重要。

#### 2.42.1. 函数

**Python 调用**

```python
ret = axcl.venc.request_idr(ve_chn, instant)
```

**C++ 原型**

```cpp
AX_S32 AX_VENC_RequestIDR(VENC_CHN VeChn, AX_BOOL bInstant);
```

#### 2.42.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| ve_chn | int | VENC 通道 ID。有效范围：[0,（源码未提供上限）。 |
| instant | int | 控制 IDR 帧的编码时机：AX_FALSE（0）表示在下一个帧时隙编码 IDR 帧；AX_TRUE（1）表示立即编码 IDR 帧。 |

#### 2.42.3. 返回值

- `ret`: *int* — 成功。失败。参见 VENC 错误码。

#### 2.42.4. 说明

返回类型：`int`。

源码：`python/axcl/venc/ax_venc.py:3188`。

#### 2.42.5. 示例

```python
ret = axcl.venc.request_idr(ve_chn, instant)
```

<br>

<a id="axcl.venc.query_status"></a>

### 2.43. axcl.venc.query_status

查询 VENC 通道当前状态。本接口获取 VENC 编码通道的当前运行状态，包括待编码帧数、输出缓冲区占用及其他运行指标。状态信息可用于监控编码器性能、发现瓶颈和实现流量控制。

#### 2.43.1. 函数

**Python 调用**

```python
status, ret = axcl.venc.query_status(ve_chn)
```

**C++ 原型**

```cpp
AX_S32 AX_VENC_QueryStatus(VENC_CHN VeChn, AX_VENC_CHN_STATUS_T *pstStatus);
```

#### 2.43.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| ve_chn | int | VENC 通道 ID。有效范围：[0,（源码未提供上限）。 |

#### 2.43.3. 返回值

- `status`: *dict* — 指向通道状态结构体的指针。不得为 NULL。成功时填入当前通道状态快照。
- `ret`: *int* — 成功。失败。参见 VENC 错误码。

#### 2.43.4. 说明

返回类型：`tuple[dict, int]`。

源码：`python/axcl/venc/ax_venc.py:3221`。

#### 2.43.5. 示例

```python
status, ret = axcl.venc.query_status(ve_chn)
```

<br>

<a id="axcl.venc.set_jpeg_param"></a>

### 2.44. axcl.venc.set_jpeg_param

更新 VENC 通道的 JPEG 编码参数。本接口更新 JPEG/MJPEG 通道参数，包括量化表、Qfactor、ROI 配置、MCU-per-ECS 和去块滤波。常见用法是调用（源码未提供接口引用）。

#### 2.44.1. 函数

**Python 调用**

```python
ret = axcl.venc.set_jpeg_param(ve_chn, jpeg_param)
```

**C++ 原型**

```cpp
AX_S32 AX_VENC_SetJpegParam(VENC_CHN VeChn, const AX_VENC_JPEG_PARAM_T *pstJpegParam);
```

#### 2.44.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| ve_chn | int | VENC 通道 ID。有效范围：[0,（源码未提供上限）。 |
| jpeg_param | dict &#124; None | 指向 JPEG 参数结构体的指针。不得为 NULL。对于不修改的字段，保留相应接口返回的值（源码未提供接口引用）。 |

#### 2.44.3. 返回值

- `ret`: *int* — 成功。失败。参见 VENC 错误码。

#### 2.44.4. 说明

返回类型：`int`。

源码：`python/axcl/venc/ax_venc.py:3255`。

#### 2.44.5. 示例

```python
ret = axcl.venc.set_jpeg_param(ve_chn, jpeg_param)
```

<br>

<a id="axcl.venc.get_jpeg_param"></a>

### 2.45. axcl.venc.get_jpeg_param

获取 VENC 通道的 JPEG 编码参数。本接口查询通道的当前 JPEG 编码参数，包括量化表、质量因子、ROI 配置及其他编码设置。

#### 2.45.1. 函数

**Python 调用**

```python
jpeg_param, ret = axcl.venc.get_jpeg_param(ve_chn)
```

**C++ 原型**

```cpp
AX_S32 AX_VENC_GetJpegParam(VENC_CHN VeChn, AX_VENC_JPEG_PARAM_T *pstJpegParam);
```

#### 2.45.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| ve_chn | int | VENC 通道 ID。有效范围：[0,（源码未提供上限）。 |

#### 2.45.3. 返回值

- `jpeg_param`: *dict* — 指向 JPEG 参数结构体的指针。不得为 NULL。成功时包含当前 JPEG 编码参数。
- `ret`: *int* — 成功。失败。参见 VENC 错误码。

#### 2.45.4. 说明

返回类型：`tuple[dict, int]`。

源码：`python/axcl/venc/ax_venc.py:3288`。

#### 2.45.5. 示例

```python
jpeg_param, ret = axcl.venc.get_jpeg_param(ve_chn)
```

<br>

<a id="axcl.venc.jpeg_encode_one_frame"></a>

### 2.46. axcl.venc.jpeg_encode_one_frame

同步编码单个 JPEG 帧。本接口根据已保存的设置，将一帧输入编码为 JPEG 码流（源码未说明设置存储位置）。

#### 2.46.1. 函数

**Python 调用**

```python
jpeg_param, ret = axcl.venc.jpeg_encode_one_frame(jpeg_param)
```

**C++ 原型**

```cpp
AX_S32 AX_VENC_JpegEncodeOneFrame(AX_JPEG_ENCODE_ONCE_PARAMS_T *pstJpegParam);
```

#### 2.46.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| jpeg_param | dict &#124; None | 指向 JPEG 单次编码参数的指针。调用前必须配置输入帧字段、输出码流缓冲区字段、JPEG 参数和缩略图字段。u32Len 在输入时指定输出缓冲区大小，成功时更新为编码码流长度。 |

#### 2.46.3. 返回值

- `jpeg_param`: *dict* — 指向 JPEG 单次编码参数的指针。调用前必须配置输入帧字段、输出码流缓冲区字段、JPEG 参数和缩略图字段。u32Len 在输入时指定输出缓冲区大小，成功时更新为编码码流长度。
- `ret`: *int* — 成功。失败。参见 VENC 错误码。

#### 2.46.4. 说明

返回类型：`tuple[dict, int]`。

源码：`python/axcl/venc/ax_venc.py:3322`。

#### 2.46.5. 示例

```python
jpeg_param, ret = axcl.venc.jpeg_encode_one_frame(jpeg_param)
```

<br>

<a id="axcl.venc.jpeg_get_thumbnail"></a>

### 2.47. axcl.venc.jpeg_get_thumbnail

从 JPEG 编码码流中提取缩略图数据。本接口从启用缩略图支持而编码生成的 JPEG 码流中提取嵌入的缩略图数据。缩略图必须由相应接口生成（源码未提供接口引用）。

#### 2.47.1. 函数

**Python 调用**

```python
thumb_size, ret = axcl.venc.jpeg_get_thumbnail(raw_data, raw_data_size, thumb_data, thumb_size)
```

**C++ 原型**

```cpp
AX_S32 AX_VENC_JpegGetThumbnail(const AX_VOID *pRawData, AX_U32 u32RawDataSize, AX_VOID *pThumbData, AX_U32 *pThumbSize);
```

#### 2.47.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| raw_data | int | 指向包含缩略图的原始 JPEG 码流数据的指针。不得为 NULL，且必须包含带嵌入缩略图的有效 JPEG 数据。 |
| raw_data_size | int | 原始 JPEG 码流数据大小，单位为字节。 |
| thumb_data | int | 调用者持有的 Host 输出地址或可写缓冲区。在整个调用期间必须保持有效，且至少能容纳 thumb_size 字节。 |
| thumb_size | int | 传给 Host API 的输出缓冲区容量，单位为字节，必须为正值。 |

#### 2.47.3. 返回值

- `thumb_size`: *int* — 成功时返回实际缩略图长度。输出字节写入 thumb_data；本绑定不返回或分配该缓冲区。
- `ret`: *int* — 成功。失败。参见 VENC 错误码。

#### 2.47.4. 说明

返回类型：`tuple[int, int]`。

源码：`python/axcl/venc/ax_venc.py:3355`。

#### 2.47.5. 示例

```python
thumb_size, ret = axcl.venc.jpeg_get_thumbnail(raw_data, raw_data_size, thumb_data, thumb_size)
```

<br>

<a id="axcl.venc.set_dblk_attr"></a>

### 2.48. axcl.venc.set_dblk_attr

更新 VENC 通道的去块滤波属性。本接口更新 H.264/H.265 编码通道的去块滤波设置。使用与当前通道类型匹配的编解码专用成员：H.264 使用 stH264Dblk，H.265 使用 stH265Dblk。常见用法是调用（源码未提供接口引用）。

#### 2.48.1. 函数

**Python 调用**

```python
ret = axcl.venc.set_dblk_attr(ve_chn, dblk_attr)
```

**C++ 原型**

```cpp
AX_S32 AX_VENC_SetDblkAttr(VENC_CHN VeChn, const AX_VENC_DBLK_ATTR_T *pstDblkAttr);
```

#### 2.48.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| ve_chn | int | VENC 通道 ID。有效范围：[0,（源码未提供上限）。 |
| dblk_attr | dict &#124; None | 指向去块滤波属性结构体的指针。不得为 NULL。 |

#### 2.48.3. 返回值

- `ret`: *int* — 成功。失败。参见 VENC 错误码。

#### 2.48.4. 说明

返回类型：`int`。

源码：`python/axcl/venc/ax_venc.py:3398`。

#### 2.48.5. 示例

```python
ret = axcl.venc.set_dblk_attr(ve_chn, dblk_attr)
```

<br>

<a id="axcl.venc.get_dblk_attr"></a>

### 2.49. axcl.venc.get_dblk_attr

获取 VENC 通道的去块滤波属性。本接口获取 H.264 或 H.265 通道的当前去块滤波配置。

#### 2.49.1. 函数

**Python 调用**

```python
dblk_attr, ret = axcl.venc.get_dblk_attr(ve_chn)
```

**C++ 原型**

```cpp
AX_S32 AX_VENC_GetDblkAttr(VENC_CHN VeChn, AX_VENC_DBLK_ATTR_T *pstDblkAttr);
```

#### 2.49.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| ve_chn | int | VENC 通道 ID。有效范围：[0,（源码未提供上限）。 |

#### 2.49.3. 返回值

- `dblk_attr`: *dict* — 指向去块滤波属性结构体的指针。不得为 NULL。成功时接收当前设置。
- `ret`: *int* — 成功。失败。参见 VENC 错误码。

#### 2.49.4. 说明

返回类型：`tuple[dict, int]`。

源码：`python/axcl/venc/ax_venc.py:3431`。

#### 2.49.5. 示例

```python
dblk_attr, ret = axcl.venc.get_dblk_attr(ve_chn)
```

<br>

<a id="axcl.venc.set_h265_sao"></a>

### 2.50. axcl.venc.set_h265_sao

更新 H.265 VENC 通道的 SAO（采样自适应偏移）参数。本接口启用或禁用 H.265/HEVC 通道的 SAO。常见用法是调用（源码未提供接口引用）。

#### 2.50.1. 函数

**Python 调用**

```python
ret = axcl.venc.set_h265_sao(ve_chn, sao_param)
```

**C++ 原型**

```cpp
AX_S32 AX_VENC_SetH265Sao(VENC_CHN VeChn, const AX_VENC_SAO_PARAM_T *pstSaoParam);
```

#### 2.50.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| ve_chn | int | VENC 通道 ID。有效范围：[0,（源码未提供上限）。 |
| sao_param | dict &#124; None | 指向 SAO 参数结构体的指针。不得为 NULL。bEnableSao 控制是否启用 SAO。 |

#### 2.50.3. 返回值

- `ret`: *int* — 成功。失败。参见 VENC 错误码。

#### 2.50.4. 说明

返回类型：`int`。

源码：`python/axcl/venc/ax_venc.py:3465`。

#### 2.50.5. 示例

```python
ret = axcl.venc.set_h265_sao(ve_chn, sao_param)
```

<br>

<a id="axcl.venc.get_h265_sao"></a>

### 2.51. axcl.venc.get_h265_sao

获取 H.265 VENC 通道的 SAO（采样自适应偏移）参数。本接口获取 H.265/HEVC 通道的当前 SAO 配置。常见用法是调用（源码未提供接口引用）。

#### 2.51.1. 函数

**Python 调用**

```python
sao_param, ret = axcl.venc.get_h265_sao(ve_chn)
```

**C++ 原型**

```cpp
AX_S32 AX_VENC_GetH265Sao(VENC_CHN VeChn, AX_VENC_SAO_PARAM_T *pstSaoParam);
```

#### 2.51.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| ve_chn | int | VENC 通道 ID。有效范围：[0,（源码未提供上限）。 |

#### 2.51.3. 返回值

- `sao_param`: *dict* — 指向 SAO 参数结构体的指针。不得为 NULL。成功时接收当前 SAO 设置。
- `ret`: *int* — 成功。失败。参见 VENC 错误码。

#### 2.51.4. 说明

返回类型：`tuple[dict, int]`。

源码：`python/axcl/venc/ax_venc.py:3498`。

#### 2.51.5. 示例

```python
sao_param, ret = axcl.venc.get_h265_sao(ve_chn)
```

<br>

<a id="axcl.venc.set_de_breath_effect"></a>

### 2.52. axcl.venc.set_de_breath_effect

更新 VENC 通道的去呼吸效应参数。本接口启用或禁用 H.264/H.265 通道的去呼吸效应，并设置编码器使用的强度等级。

#### 2.52.1. 函数

**Python 调用**

```python
ret = axcl.venc.set_de_breath_effect(ve_chn, de_breath_effect)
```

**C++ 原型**

```cpp
AX_S32 AX_VENC_SetDeBreathEffect(VENC_CHN VeChn, const AX_VENC_DEBREATH_EFFECT_T *pstDeBreathEffect);
```

#### 2.52.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| ve_chn | int | VENC 通道 ID。有效范围：[0,（源码未提供上限）。 |
| de_breath_effect | dict &#124; None | 指向去呼吸效应参数结构体的指针。不得为 NULL。包含使能标志和强度等级。 |

#### 2.52.3. 返回值

- `ret`: *int* — 成功。失败。参见 VENC 错误码。

#### 2.52.4. 说明

返回类型：`int`。

源码：`python/axcl/venc/ax_venc.py:3532`。

#### 2.52.5. 示例

```python
ret = axcl.venc.set_de_breath_effect(ve_chn, de_breath_effect)
```

<br>

<a id="axcl.venc.get_de_breath_effect"></a>

### 2.53. axcl.venc.get_de_breath_effect

获取 VENC 通道的去呼吸效应参数。本接口查询编码通道的当前去呼吸效应配置，包括使能状态和强度等级设置。

#### 2.53.1. 函数

**Python 调用**

```python
de_breath_effect, ret = axcl.venc.get_de_breath_effect(ve_chn)
```

**C++ 原型**

```cpp
AX_S32 AX_VENC_GetDeBreathEffect(VENC_CHN VeChn, AX_VENC_DEBREATH_EFFECT_T *pstDeBreathEffect);
```

#### 2.53.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| ve_chn | int | VENC 通道 ID。有效范围：[0,（源码未提供上限）。 |

#### 2.53.3. 返回值

- `de_breath_effect`: *dict* — 指向去呼吸效应参数结构体的指针。不得为 NULL。成功时包含当前去呼吸效应配置。
- `ret`: *int* — 成功。失败。参见 VENC 错误码。

#### 2.53.4. 说明

返回类型：`tuple[dict, int]`。

源码：`python/axcl/venc/ax_venc.py:3565`。

#### 2.53.5. 示例

```python
de_breath_effect, ret = axcl.venc.get_de_breath_effect(ve_chn)
```

<br>

<a id="axcl.venc.set_skin_detect_attr"></a>

### 2.54. axcl.venc.set_skin_detect_attr

设置 VENC 通道的肤色检测属性。本接口更新 H.264/H.265 通道中与肤色检测相关的编码器参数。控制编码器使用的使能标志、QP 差值和 Y/Cb/Cr 阈值。常见用法是调用（源码未提供接口引用）。

#### 2.54.1. 函数

**Python 调用**

```python
ret = axcl.venc.set_skin_detect_attr(ve_chn, skin_detect_attr)
```

**C++ 原型**

```cpp
AX_S32 AX_VENC_SetSkinDetectAttr(VENC_CHN VeChn, const AX_VENC_SKIN_DETECT_ATTR_T *pstSkinDetectAttr);
```

#### 2.54.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| ve_chn | int | VENC 通道 ID。有效范围：[0,（源码未提供上限）。 |
| skin_detect_attr | dict &#124; None | 指向肤色检测属性结构体的指针。不得为 NULL。包含使能标志、QP 差值设置和 Y/Cb/Cr 阈值。 |

#### 2.54.3. 返回值

- `ret`: *int* — 成功。失败。参见 VENC 错误码。

#### 2.54.4. 说明

返回类型：`int`。

源码：`python/axcl/venc/ax_venc.py:3599`。

#### 2.54.5. 示例

```python
ret = axcl.venc.set_skin_detect_attr(ve_chn, skin_detect_attr)
```

<br>

<a id="axcl.venc.get_skin_detect_attr"></a>

### 2.55. axcl.venc.get_skin_detect_attr

获取 VENC 通道的肤色检测属性。本接口获取 H.264/H.265 通道的当前肤色检测设置。常见用法是调用（源码未提供接口引用）。

#### 2.55.1. 函数

**Python 调用**

```python
skin_detect_attr, ret = axcl.venc.get_skin_detect_attr(ve_chn)
```

**C++ 原型**

```cpp
AX_S32 AX_VENC_GetSkinDetectAttr(VENC_CHN VeChn, AX_VENC_SKIN_DETECT_ATTR_T *pstSkinDetectAttr);
```

#### 2.55.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| ve_chn | int | VENC 通道 ID。有效范围：[0,（源码未提供上限）。 |

#### 2.55.3. 返回值

- `skin_detect_attr`: *dict* — 指向肤色检测属性结构体的指针。不得为 NULL。成功时接收当前肤色检测设置。
- `ret`: *int* — 成功。失败。参见 VENC 错误码。

#### 2.55.4. 说明

返回类型：`tuple[dict, int]`。

源码：`python/axcl/venc/ax_venc.py:3632`。

#### 2.55.5. 示例

```python
skin_detect_attr, ret = axcl.venc.get_skin_detect_attr(ve_chn)
```

<br>

<a id="axcl.venc.set_chroma_protect_attr"></a>

### 2.56. axcl.venc.set_chroma_protect_attr

设置 VENC 通道的色度保护属性。本接口更新 H.264/H.265 通道中与色度保护相关的编码器参数。常见用法是调用（源码未提供接口引用）。

#### 2.56.1. 函数

**Python 调用**

```python
ret = axcl.venc.set_chroma_protect_attr(ve_chn, chr_prot_attr)
```

**C++ 原型**

```cpp
AX_S32 AX_VENC_SetChromaProtectAttr(VENC_CHN VeChn, const AX_VENC_CHROMA_PROTECT_ATTR_T *pstChrProtAttr);
```

#### 2.56.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| ve_chn | int | VENC 通道 ID。有效范围：[0,（源码未提供上限）。 |
| chr_prot_attr | dict &#124; None | 指向色度保护属性结构体的指针。不得为 NULL。包含使能标志、强度和 QP 系数设置。 |

#### 2.56.3. 返回值

- `ret`: *int* — 成功。失败。参见 VENC 错误码。

#### 2.56.4. 说明

返回类型：`int`。

源码：`python/axcl/venc/ax_venc.py:3666`。

#### 2.56.5. 示例

```python
ret = axcl.venc.set_chroma_protect_attr(ve_chn, chr_prot_attr)
```

<br>

<a id="axcl.venc.get_chroma_protect_attr"></a>

### 2.57. axcl.venc.get_chroma_protect_attr

获取 VENC 通道的色度保护属性。本接口获取 H.264/H.265 通道的当前色度保护设置。常见用法是调用（源码未提供接口引用）。

#### 2.57.1. 函数

**Python 调用**

```python
chr_prot_attr, ret = axcl.venc.get_chroma_protect_attr(ve_chn)
```

**C++ 原型**

```cpp
AX_S32 AX_VENC_GetChromaProtectAttr(VENC_CHN VeChn, AX_VENC_CHROMA_PROTECT_ATTR_T *pstChrProtAttr);
```

#### 2.57.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| ve_chn | int | VENC 通道 ID。有效范围：[0,（源码未提供上限）。 |

#### 2.57.3. 返回值

- `chr_prot_attr`: *dict* — 指向色度保护属性结构体的指针。不得为 NULL。成功时接收当前色度保护设置。
- `ret`: *int* — 成功。失败。参见 VENC 错误码。

#### 2.57.4. 说明

返回类型：`tuple[dict, int]`。

源码：`python/axcl/venc/ax_venc.py:3699`。

#### 2.57.5. 示例

```python
chr_prot_attr, ret = axcl.venc.get_chroma_protect_attr(ve_chn)
```

<br>

<a id="axcl.venc.set_trail_detect_attr"></a>

### 2.58. axcl.venc.set_trail_detect_attr

设置 VENC 通道的拖尾检测属性。本接口更新 H.264/H.265 通道中与拖尾检测相关的编码器参数。常见用法是调用（源码未提供接口引用）。

#### 2.58.1. 函数

**Python 调用**

```python
ret = axcl.venc.set_trail_detect_attr(ve_chn, trail_detect_attr)
```

**C++ 原型**

```cpp
AX_S32 AX_VENC_SetTrailDetectAttr(VENC_CHN VeChn, const AX_VENC_TRAIL_DETECT_ATTR_T *pstTrailDetectAttr);
```

#### 2.58.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| ve_chn | int | VENC 通道 ID。有效范围：[0,（源码未提供上限）。 |
| trail_detect_attr | dict &#124; None | 指向拖尾检测属性结构体的指针。不得为 NULL。包含使能标志、检测强度和 QP 差值设置。 |

#### 2.58.3. 返回值

- `ret`: *int* — 成功。失败。参见 VENC 错误码。

#### 2.58.4. 说明

返回类型：`int`。

源码：`python/axcl/venc/ax_venc.py:3733`。

#### 2.58.5. 示例

```python
ret = axcl.venc.set_trail_detect_attr(ve_chn, trail_detect_attr)
```

<br>

<a id="axcl.venc.get_trail_detect_attr"></a>

### 2.59. axcl.venc.get_trail_detect_attr

获取 VENC 通道的拖尾检测属性。本接口获取 H.264/H.265 通道的当前拖尾检测设置。

#### 2.59.1. 函数

**Python 调用**

```python
trail_detect_attr, ret = axcl.venc.get_trail_detect_attr(ve_chn)
```

**C++ 原型**

```cpp
AX_S32 AX_VENC_GetTrailDetectAttr(VENC_CHN VeChn, AX_VENC_TRAIL_DETECT_ATTR_T *pstTrailDetectAttr);
```

#### 2.59.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| ve_chn | int | VENC 通道 ID。有效范围：[0,（源码未提供上限）。 |

#### 2.59.3. 返回值

- `trail_detect_attr`: *dict* — 指向拖尾检测属性结构体的指针。不得为 NULL。成功时接收当前拖尾检测设置。
- `ret`: *int* — 成功。失败。参见 VENC 错误码。

#### 2.59.4. 说明

返回类型：`tuple[dict, int]`。

源码：`python/axcl/venc/ax_venc.py:3768`。

#### 2.59.5. 示例

```python
trail_detect_attr, ret = axcl.venc.get_trail_detect_attr(ve_chn)
```

<br>

<a id="axcl.venc.set_srd_param"></a>

### 2.60. axcl.venc.set_srd_param

更新 VENC 通道的 SRD（静态区域检测）参数。本接口更新 H.264/H.265 通道中与 SRD 相关的编码器设置。常见用法是调用（源码未提供接口引用）。

#### 2.60.1. 函数

**Python 调用**

```python
ret = axcl.venc.set_srd_param(ve_chn, srd_param)
```

**C++ 原型**

```cpp
AX_S32 AX_VENC_SetSrdParam(VENC_CHN VeChn, const AX_VENC_SRD_PARAM_T *pstSrdParam);
```

#### 2.60.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| ve_chn | int | VENC 通道 ID。有效范围：[0,（源码未提供上限）。 |
| srd_param | dict &#124; None | 指向 SRD 参数结构体的指针。不得为 NULL。包含使能模式、阈值、前景/背景 QP 差值和初始化间隔。 |

#### 2.60.3. 返回值

- `ret`: *int* — 成功。失败。参见 VENC 错误码。

#### 2.60.4. 说明

返回类型：`int`。

源码：`python/axcl/venc/ax_venc.py:3802`。

#### 2.60.5. 示例

```python
ret = axcl.venc.set_srd_param(ve_chn, srd_param)
```

<br>

<a id="axcl.venc.get_srd_param"></a>

### 2.61. axcl.venc.get_srd_param

获取 VENC 通道的 SRD（静态区域检测）参数。本接口获取 H.264/H.265 通道的当前 SRD 设置。常见用法是调用（源码未提供接口引用）。

#### 2.61.1. 函数

**Python 调用**

```python
srd_param, ret = axcl.venc.get_srd_param(ve_chn)
```

**C++ 原型**

```cpp
AX_S32 AX_VENC_GetSrdParam(VENC_CHN VeChn, AX_VENC_SRD_PARAM_T *pstSrdParam);
```

#### 2.61.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| ve_chn | int | VENC 通道 ID。有效范围：[0,（源码未提供上限）。 |

#### 2.61.3. 返回值

- `srd_param`: *dict* — 指向 SRD 参数结构体的指针。不得为 NULL。成功时接收当前 SRD 设置。
- `ret`: *int* — 成功。失败。参见 VENC 错误码。

#### 2.61.4. 说明

返回类型：`tuple[dict, int]`。

源码：`python/axcl/venc/ax_venc.py:3835`。

#### 2.61.5. 示例

```python
srd_param, ret = axcl.venc.get_srd_param(ve_chn)
```

<br>

<a id="axcl.venc.set_adv_enc_map_param"></a>

### 2.62. axcl.venc.set_adv_enc_map_param

更新 VENC 通道的高级编码映射参数。本接口更新 H.264/H.265 通道中 RDO 用于 CU 类型选择、CU 大小选择和帧内预测模式选择的编码器偏置映射。常见用法是调用（源码未提供接口引用）。

#### 2.62.1. 函数

**Python 调用**

```python
ret = axcl.venc.set_adv_enc_map_param(ve_chn, adv_enc_map_param)
```

**C++ 原型**

```cpp
AX_S32 AX_VENC_SetAdvEncMapParam(VENC_CHN VeChn, const AX_VENC_ADV_ENC_MAP_PARAM_T *pstAdvEncMapParam);
```

#### 2.62.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| ve_chn | int | VENC 通道 ID。有效范围：[0,（源码未提供上限）。 |
| adv_enc_map_param | dict &#124; None | 指向高级编码映射参数结构体的指针。不得为 NULL。 |

#### 2.62.3. 返回值

- `ret`: *int* — 成功。失败。参见 VENC 错误码。

#### 2.62.4. 说明

返回类型：`int`。

源码：`python/axcl/venc/ax_venc.py:3869`。

#### 2.62.5. 示例

```python
ret = axcl.venc.set_adv_enc_map_param(ve_chn, adv_enc_map_param)
```

<br>

<a id="axcl.venc.get_adv_enc_map_param"></a>

### 2.63. axcl.venc.get_adv_enc_map_param

获取 VENC 通道的高级编码映射参数。本接口获取 H.264/H.265 通道的当前高级编码映射设置。常见用法是调用（源码未提供接口引用）。

#### 2.63.1. 函数

**Python 调用**

```python
adv_enc_map_param, ret = axcl.venc.get_adv_enc_map_param(ve_chn)
```

**C++ 原型**

```cpp
AX_S32 AX_VENC_GetAdvEncMapParam(VENC_CHN VeChn, AX_VENC_ADV_ENC_MAP_PARAM_T *pstAdvEncMapParam);
```

#### 2.63.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| ve_chn | int | VENC 通道 ID。有效范围：[0,（源码未提供上限）。 |

#### 2.63.3. 返回值

- `adv_enc_map_param`: *dict* — 指向高级编码映射参数结构体的指针。不得为 NULL。成功时接收当前高级编码映射设置。
- `ret`: *int* — 成功。失败。参见 VENC 错误码。

#### 2.63.4. 说明

返回类型：`tuple[dict, int]`。

源码：`python/axcl/venc/ax_venc.py:3904`。

#### 2.63.5. 示例

```python
adv_enc_map_param, ret = axcl.venc.get_adv_enc_map_param(ve_chn)
```

<br>

<a id="axcl.venc.set_adv_param"></a>

### 2.64. axcl.venc.set_adv_param

设置 VENC 通道的高级编码参数。本接口配置编码通道的高级编码参数，如运动估计垂直搜索范围。

#### 2.64.1. 函数

**Python 调用**

```python
ret = axcl.venc.set_adv_param(ve_chn, adv_param)
```

**C++ 原型**

```cpp
AX_S32 AX_VENC_SetAdvParam(VENC_CHN VeChn, const AX_VENC_ADV_PARAM_T *pstAdvParam);
```

#### 2.64.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| ve_chn | int | VENC 通道 ID。有效范围：[0,（源码未提供上限）。 |
| adv_param | dict &#124; None | 指向高级参数结构体的指针。不得为 NULL。包含高级编码器配置。 |

#### 2.64.3. 返回值

- `ret`: *int* — 成功。失败。参见 VENC 错误码。

#### 2.64.4. 说明

返回类型：`int`。

源码：`python/axcl/venc/ax_venc.py:3938`。

#### 2.64.5. 示例

```python
ret = axcl.venc.set_adv_param(ve_chn, adv_param)
```

<br>

<a id="axcl.venc.get_adv_param"></a>

### 2.65. axcl.venc.get_adv_param

获取 VENC 通道的高级编码参数。本接口查询编码通道的当前高级编码参数，如运动估计垂直搜索范围。

#### 2.65.1. 函数

**Python 调用**

```python
adv_param, ret = axcl.venc.get_adv_param(ve_chn)
```

**C++ 原型**

```cpp
AX_S32 AX_VENC_GetAdvParam(VENC_CHN VeChn, AX_VENC_ADV_PARAM_T *pstAdvParam);
```

#### 2.65.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| ve_chn | int | VENC 通道 ID。有效范围：[0,（源码未提供上限）。 |

#### 2.65.3. 返回值

- `adv_param`: *dict* — 指向高级参数结构体的指针。不得为 NULL。成功时包含当前高级编码器配置。
- `ret`: *int* — 成功。失败。参见 VENC 错误码。

#### 2.65.4. 说明

返回类型：`tuple[dict, int]`。

源码：`python/axcl/venc/ax_venc.py:3971`。

#### 2.65.5. 示例

```python
adv_param, ret = axcl.venc.get_adv_param(ve_chn)
```

<br>

<a id="axcl.venc.set_cir_param"></a>

### 2.66. axcl.venc.set_cir_param

设置 VENC 通道的 CIR（循环帧内刷新）参数。本接口配置编码通道的循环帧内刷新参数。CIR 周期性地将选定 MB 或 CTB 刷新为帧内编码块，有助于在不插入完整 I 帧的情况下提高容错能力。

#### 2.66.1. 函数

**Python 调用**

```python
ret = axcl.venc.set_cir_param(ve_chn, cir_param)
```

**C++ 原型**

```cpp
AX_S32 AX_VENC_SetCirParam(VENC_CHN VeChn, const AX_VENC_CIR_PARAM_T *pstCirParam);
```

#### 2.66.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| ve_chn | int | VENC 通道 ID。有效范围：[0,（源码未提供上限）。 |
| cir_param | dict &#124; None | 指向 CIR 参数结构体的指针。不得为 NULL。包含 CIR 起始位置和间隔。 |

#### 2.66.3. 返回值

- `ret`: *int* — 成功。失败。参见 VENC 错误码。

#### 2.66.4. 说明

返回类型：`int`。

源码：`python/axcl/venc/ax_venc.py:4005`。

#### 2.66.5. 示例

```python
ret = axcl.venc.set_cir_param(ve_chn, cir_param)
```

<br>

<a id="axcl.venc.get_cir_param"></a>

### 2.67. axcl.venc.get_cir_param

获取 VENC 通道的 CIR（循环帧内刷新）参数。本接口查询编码通道的当前循环帧内刷新参数，包括起始 MB 或 CTB 索引和刷新间隔。

#### 2.67.1. 函数

**Python 调用**

```python
cir_param, ret = axcl.venc.get_cir_param(ve_chn)
```

**C++ 原型**

```cpp
AX_S32 AX_VENC_GetCirParam(VENC_CHN VeChn, AX_VENC_CIR_PARAM_T *pstCirParam);
```

#### 2.67.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| ve_chn | int | VENC 通道 ID。有效范围：[0,（源码未提供上限）。 |

#### 2.67.3. 返回值

- `cir_param`: *dict* — 指向 CIR 参数结构体的指针。不得为 NULL。成功时包含当前 CIR 配置。
- `ret`: *int* — 成功。失败。参见 VENC 错误码。

#### 2.67.4. 说明

返回类型：`tuple[dict, int]`。

源码：`python/axcl/venc/ax_venc.py:4038`。

#### 2.67.5. 示例

```python
cir_param, ret = axcl.venc.get_cir_param(ve_chn)
```
