# axcl.ivps

## 1. 目录

- [axcl.ivps.init](#axcl.ivps.init): 初始化 IVPS 模块。初始化 IVPS 资源和设备句柄。创建 IVPS 组或使用任何 IVPS 处理接口前，需调用本接口。
- [axcl.ivps.deinit](#axcl.ivps.deinit): 去初始化 IVPS 模块。所有组、通道和未释放的帧均已停止或释放后，释放 IVPS 资源和设备句柄。
- [axcl.ivps.create_grp](#axcl.ivps.create_grp): 使用指定的组 ID 创建 IVPS 组。创建组并记录其输入 FIFO 配置。组 ID 在已有 IVPS 组中必须唯一。
- [axcl.ivps.create_grp_ex](#axcl.ivps.create_grp_ex): 创建 IVPS 组并自动分配组 ID。查找未使用的组 ID，创建组，并通过 IvpsGrp 返回分配的 ID。
- [axcl.ivps.destroy_grp](#axcl.ivps.destroy_grp): 销毁 IVPS 组。销毁指定组并释放组相关资源。
- [axcl.ivps.start_grp](#axcl.ivps.start_grp): 启动 IVPS 组。启动组，使其能够接收和处理输入帧。
- [axcl.ivps.stop_grp](#axcl.ivps.stop_grp): 停止 IVPS 组。停止指定组的帧处理。
- [axcl.ivps.send_frame](#axcl.ivps.send_frame): 向 IVPS 组发送输入帧。将 ptFrame 加入队列，由指定组处理。
- [axcl.ivps.get_chn_frame](#axcl.ivps.get_chn_frame): 从 IVPS 通道输出队列获取帧。从指定通道获取下一个可用输出帧。
- [axcl.ivps.release_chn_frame](#axcl.ivps.release_chn_frame): 释放从 IVPS 通道获取的帧。处理完成后，将帧缓冲区归还给 IVPS 资源池。
- [axcl.ivps.enable_chn](#axcl.ivps.enable_chn): 启用 IVPS 通道。启用指定通道的输出处理。
- [axcl.ivps.disable_chn](#axcl.ivps.disable_chn): 禁用 IVPS 通道。停止指定通道的输出处理。
- [axcl.ivps.get_chn_fd](#axcl.ivps.get_chn_fd): 获取 IVPS 通道的文件描述符。返回可用于 poll/select 式事件处理的文件描述符。
- [axcl.ivps.close_all_fd](#axcl.ivps.close_all_fd): 关闭所有 IVPS 文件描述符。关闭为 IVPS 通道事件处理而打开的文件描述符。
- [axcl.ivps.set_grp_attr](#axcl.ivps.set_grp_attr): 设置组属性。更新 IVPS 组的相关属性。
- [axcl.ivps.get_grp_attr](#axcl.ivps.get_grp_attr): 获取组属性。返回 IVPS 组的相关属性。
- [axcl.ivps.set_chn_attr](#axcl.ivps.set_chn_attr): 设置通道属性。更新 IVPS 通道的输出大小、格式、帧率、缓冲区、缩放及相关属性。
- [axcl.ivps.get_chn_attr](#axcl.ivps.get_chn_attr): 获取通道属性。返回 IVPS 通道已配置的属性。
- [axcl.ivps.set_grp_crop](#axcl.ivps.set_grp_crop): 设置 IVPS 组的裁剪配置。配置输入裁剪使能状态、坐标模式和裁剪矩形。
- [axcl.ivps.get_grp_crop](#axcl.ivps.get_grp_crop): 获取 IVPS 组的裁剪配置。
- [axcl.ivps.set_chn_crop](#axcl.ivps.set_chn_crop): 设置 IVPS 通道的裁剪配置。
- [axcl.ivps.get_chn_crop](#axcl.ivps.get_chn_crop): 获取 IVPS 通道的裁剪配置。
- [axcl.ivps.set_chn_cascade](#axcl.ivps.set_chn_cascade): 配置通道级联处理。
- [axcl.ivps.set_scale_coef_level](#axcl.ivps.set_scale_coef_level): 为缩放范围配置缩放系数等级。
- [axcl.ivps.get_scale_coef_level](#axcl.ivps.get_scale_coef_level): 获取缩放范围对应的缩放系数等级。
- [axcl.ivps.set_palette_table](#axcl.ivps.set_palette_table): 设置 IVPS 调色板表。
- [axcl.ivps.get_palette_table](#axcl.ivps.get_palette_table): 获取 IVPS 调色板表。
- [axcl.ivps.draw_line](#axcl.ivps.draw_line): 在画布上绘制线条。使用指定的图形属性绘制直线或连续线段。
- [axcl.ivps.draw_polygon](#axcl.ivps.draw_polygon): 在画布上绘制多边形。绘制由所提供的点数组定义的多边形。
- [axcl.ivps.draw_rect](#axcl.ivps.draw_rect): 在画布上绘制矩形。
- [axcl.ivps.csc](#axcl.ivps.csc): 转换视频帧的色彩空间。使用选定的 IVPS 引擎，将 ptSrc 转换为 ptDst 描述的格式和布局。
- [axcl.ivps.crop_resize](#axcl.ivps.crop_resize): 裁剪并缩放视频帧。根据宽高比、缩放、alpha 和压缩属性，将源帧裁剪并缩放到目标帧。
- [axcl.ivps.crop_resize_v2](#axcl.ivps.crop_resize_v2): 针对多个任务裁剪并缩放视频帧。根据宽高比、缩放、alpha 和压缩属性，将源帧裁剪并缩放到目标帧。
- [axcl.ivps.alpha_blending](#axcl.ivps.alpha_blending): 将叠加帧通过 alpha 混合到源帧上。使用 ptAlpha 中的 alpha 来源和权重配置，在 tOffset 位置将 ptOverlay 混合到 ptSrc 上，并将结果写入 ptDst。
- [axcl.ivps.draw_osd](#axcl.ivps.draw_osd): 在视频帧上绘制 OSD 位图。使用所选引擎，将指定的位图属性叠加到 ptSrc 上。
- [axcl.ivps.draw_mosaic](#axcl.ivps.draw_mosaic): 在视频帧上绘制马赛克区域。对 tMosaic 描述的区域执行马赛克处理。
- [axcl.ivps.rotation](#axcl.ivps.rotation): 旋转、翻转或镜像视频帧。对 ptSrc 执行所请求的旋转和方向变换，并将结果写入 ptDst。
- [axcl.ivps.get_buffer_size](#axcl.ivps.get_buffer_size): 获取指定尺寸和格式的图像所需的缓冲区大小。
- [axcl.ivps.create](#axcl.ivps.create): 创建 Region 句柄。分配并初始化 Region 句柄。执行任何 Region 操作（挂载、更新、解绑、销毁）前，必须先创建句柄。
- [axcl.ivps.destroy](#axcl.ivps.destroy): 销毁 Region 句柄。释放指定 Region 句柄关联的资源。调用本函数前，必须先将句柄从所有通道解绑。
- [axcl.ivps.attach_to_chn](#axcl.ivps.attach_to_chn): 将 Region 句柄挂载到目标模块通道。将 Region 句柄与指定模块/通道的输出路径关联。挂载后，处理过程中会将 Region 内容（OSD、线条、多边形、马赛克等）叠加到目标通道的输出上。
- [axcl.ivps.detach_from_chn](#axcl.ivps.detach_from_chn): 将 Region 句柄从目标模块通道解绑。解除 Region 句柄与指定模块/通道输出路径之间的关联。解绑后，Region 内容不再出现在通道输出中。
- [axcl.ivps.update](#axcl.ivps.update): 更新 Region 句柄的显示内容。更新指定 Region 句柄的叠加内容（OSD、线条、多边形、矩形、马赛克或角矩形）。更新从已挂载通道处理的下一帧开始生效。

<br>

## 2. API

<a id="axcl.ivps.init"></a>

### 2.1. axcl.ivps.init

初始化 IVPS 模块。初始化 IVPS 资源和设备句柄。创建 IVPS 组或使用任何 IVPS 处理接口前，需调用本接口。

#### 2.1.1. 函数

**Python 调用**

```python
ret = axcl.ivps.init()
```

**C++ 原型**

```cpp
AX_S32 AX_IVPS_Init(void);
```

#### 2.1.2. 参数

不适用

#### 2.1.3. 返回值

- `ret`: *int* — 成功。IVPS 模块已初始化，或初始化失败。所需的 IVPS 驱动或服务尚未就绪。失败；返回 IVPS 错误码。

#### 2.1.4. 说明

返回类型：`int`。

源码：`python/axcl/ivps/ax_ivps.py:1329`。

#### 2.1.5. 示例

```python
ret = axcl.ivps.init()
```

<br>

<a id="axcl.ivps.deinit"></a>

### 2.2. axcl.ivps.deinit

去初始化 IVPS 模块。所有组、通道和未释放的帧均已停止或释放后，释放 IVPS 资源和设备句柄。

#### 2.2.1. 函数

**Python 调用**

```python
ret = axcl.ivps.deinit()
```

**C++ 原型**

```cpp
AX_S32 AX_IVPS_Deinit(void);
```

#### 2.2.2. 参数

不适用

#### 2.2.3. 返回值

- `ret`: *int* — 成功。组、通道或已获取的帧仍在使用中。IVPS 模块尚未初始化。失败；返回 IVPS 错误码。

#### 2.2.4. 说明

返回类型：`int`。

源码：`python/axcl/ivps/ax_ivps.py:1357`。

#### 2.2.5. 示例

```python
ret = axcl.ivps.deinit()
```

<br>

<a id="axcl.ivps.create_grp"></a>

### 2.3. axcl.ivps.create_grp

使用指定的组 ID 创建 IVPS 组。创建组并记录其输入 FIFO 配置。组 ID 在已有 IVPS 组中必须唯一。

#### 2.3.1. 函数

**Python 调用**

```python
ret = axcl.ivps.create_grp(ivps_grp, pt_grp_attr)
```

**C++ 原型**

```cpp
AX_S32 AX_IVPS_CreateGrp(IVPS_GRP IvpsGrp, const AX_IVPS_GRP_ATTR_T *ptGrpAttr);
```

#### 2.3.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| ivps_grp | int | IVPS 组 ID。有效值范围为 [0,（源码未提供上限）。 |
| pt_grp_attr | dict &#124; None | 指向组属性的指针。不得为 NULL。 |

#### 2.3.3. 返回值

- `ret`: *int* — 成功。ptGrpAttr 为 NULL。IvpsGrp 已存在。组属性无效。IVPS 模块尚未初始化。失败；返回 IVPS 错误码。

#### 2.3.4. 说明

返回类型：`int`。

源码：`python/axcl/ivps/ax_ivps.py:1385`。

#### 2.3.5. 示例

```python
ret = axcl.ivps.create_grp(ivps_grp, pt_grp_attr)
```

<br>

<a id="axcl.ivps.create_grp_ex"></a>

### 2.4. axcl.ivps.create_grp_ex

创建 IVPS 组并自动分配组 ID。查找未使用的组 ID，创建组，并通过 IvpsGrp 返回分配的 ID。

#### 2.4.1. 函数

**Python 调用**

```python
ivps_grp, ret = axcl.ivps.create_grp_ex(pt_grp_attr)
```

**C++ 原型**

```cpp
AX_S32 AX_IVPS_CreateGrpEx(IVPS_GRP *IvpsGrp, const AX_IVPS_GRP_ATTR_T *ptGrpAttr);
```

#### 2.4.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| pt_grp_attr | dict &#124; None | 指向组属性的指针。不得为 NULL。 |

#### 2.4.3. 返回值

- `ivps_grp`: *int* — 指向输出组 ID 的指针。不得为 NULL。
- `ret`: *int* — 成功。IvpsGrp 或 ptGrpAttr 为 NULL。没有可用的组 ID 或所需资源。组属性无效。IVPS 模块尚未初始化。失败；返回 IVPS 错误码。

#### 2.4.4. 说明

返回类型：`tuple[int, int]`。

源码：`python/axcl/ivps/ax_ivps.py:1418`。

#### 2.4.5. 示例

```python
ivps_grp, ret = axcl.ivps.create_grp_ex(pt_grp_attr)
```

<br>

<a id="axcl.ivps.destroy_grp"></a>

### 2.5. axcl.ivps.destroy_grp

销毁 IVPS 组。销毁指定组并释放组相关资源。

#### 2.5.1. 函数

**Python 调用**

```python
ret = axcl.ivps.destroy_grp(ivps_grp)
```

**C++ 原型**

```cpp
AX_S32 AX_IVPS_DestroyGrp(IVPS_GRP IvpsGrp);
```

#### 2.5.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| ivps_grp | int | IVPS 组 ID。 |

#### 2.5.3. 返回值

- `ret`: *int* — 成功。IvpsGrp 无效或不存在。组仍在运行，或仍有未释放的资源。失败；返回 IVPS 错误码。

#### 2.5.4. 说明

返回类型：`int`。

源码：`python/axcl/ivps/ax_ivps.py:1452`。

#### 2.5.5. 示例

```python
ret = axcl.ivps.destroy_grp(ivps_grp)
```

<br>

<a id="axcl.ivps.start_grp"></a>

### 2.6. axcl.ivps.start_grp

启动 IVPS 组。启动组，使其能够接收和处理输入帧。

#### 2.6.1. 函数

**Python 调用**

```python
ret = axcl.ivps.start_grp(ivps_grp)
```

**C++ 原型**

```cpp
AX_S32 AX_IVPS_StartGrp(IVPS_GRP IvpsGrp);
```

#### 2.6.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| ivps_grp | int | IVPS 组 ID。 |

#### 2.6.3. 返回值

- `ret`: *int* — 成功。IvpsGrp 无效。尚未配置组属性或所需的通道属性。组已在运行或不可用。失败；返回 IVPS 错误码。

#### 2.6.4. 说明

返回类型：`int`。

源码：`python/axcl/ivps/ax_ivps.py:1483`。

#### 2.6.5. 示例

```python
ret = axcl.ivps.start_grp(ivps_grp)
```

<br>

<a id="axcl.ivps.stop_grp"></a>

### 2.7. axcl.ivps.stop_grp

停止 IVPS 组。停止指定组的帧处理。

#### 2.7.1. 函数

**Python 调用**

```python
ret = axcl.ivps.stop_grp(ivps_grp)
```

**C++ 原型**

```cpp
AX_S32 AX_IVPS_StopGrp(IVPS_GRP IvpsGrp);
```

#### 2.7.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| ivps_grp | int | IVPS 组 ID。 |

#### 2.7.3. 返回值

- `ret`: *int* — 成功。IvpsGrp 无效。失败；返回 IVPS 错误码。

#### 2.7.4. 说明

返回类型：`int`。

源码：`python/axcl/ivps/ax_ivps.py:1514`。

#### 2.7.5. 示例

```python
ret = axcl.ivps.stop_grp(ivps_grp)
```

<br>

<a id="axcl.ivps.send_frame"></a>

### 2.8. axcl.ivps.send_frame

向 IVPS 组发送输入帧。将 ptFrame 加入队列，由指定组处理。

#### 2.8.1. 函数

**Python 调用**

```python
ret = axcl.ivps.send_frame(ivps_grp, pt_frame, milli_sec)
```

**C++ 原型**

```cpp
AX_S32 AX_IVPS_SendFrame(IVPS_GRP IvpsGrp, const AX_VIDEO_FRAME_T *ptFrame, AX_S32 nMilliSec);
```

#### 2.8.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| ivps_grp | int | IVPS 组 ID。 |
| pt_frame | dict &#124; None | 指向输入视频帧的指针。不得为 NULL。 |
| milli_sec | int | 超时时间，单位为毫秒。负值表示阻塞等待。 |

#### 2.8.3. 返回值

- `ret`: *int* — 成功。ptFrame 为 NULL。输入队列已满。操作超时。IVPS 模块尚未初始化。失败；返回 IVPS 错误码。

#### 2.8.4. 说明

返回类型：`int`。

源码：`python/axcl/ivps/ax_ivps.py:1545`。

#### 2.8.5. 示例

```python
ret = axcl.ivps.send_frame(ivps_grp, pt_frame, milli_sec)
```

<br>

<a id="axcl.ivps.get_chn_frame"></a>

### 2.9. axcl.ivps.get_chn_frame

从 IVPS 通道输出队列获取帧。从指定通道获取下一个可用输出帧。

#### 2.9.1. 函数

**Python 调用**

```python
pt_frame, ret = axcl.ivps.get_chn_frame(ivps_grp, ivps_chn, milli_sec)
```

**C++ 原型**

```cpp
AX_S32 AX_IVPS_GetChnFrame(IVPS_GRP IvpsGrp, IVPS_CHN IvpsChn, AX_VIDEO_FRAME_T *ptFrame, AX_S32 nMilliSec);
```

#### 2.9.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| ivps_grp | int | IVPS 组 ID。 |
| ivps_chn | int | IVPS 通道 ID。 |
| milli_sec | int | 超时时间，单位为毫秒。负值表示阻塞等待。 |

#### 2.9.3. 返回值

- `pt_frame`: *dict* — 指向输出帧结构体的指针。不得为 NULL。
- `ret`: *int* — 成功。ptFrame 为 NULL。组 ID 或通道 ID 无效。通道输出队列为空。操作超时。失败；返回 IVPS 错误码。

#### 2.9.4. 说明

返回类型：`tuple[dict, int]`。

源码：`python/axcl/ivps/ax_ivps.py:1580`。

#### 2.9.5. 示例

```python
pt_frame, ret = axcl.ivps.get_chn_frame(ivps_grp, ivps_chn, milli_sec)
```

<br>

<a id="axcl.ivps.release_chn_frame"></a>

### 2.10. axcl.ivps.release_chn_frame

释放从 IVPS 通道获取的帧。处理完成后，将帧缓冲区归还给 IVPS 资源池。

#### 2.10.1. 函数

**Python 调用**

```python
ret = axcl.ivps.release_chn_frame(ivps_grp, ivps_chn, pt_frame)
```

**C++ 原型**

```cpp
AX_S32 AX_IVPS_ReleaseChnFrame(IVPS_GRP IvpsGrp, IVPS_CHN IvpsChn, const AX_VIDEO_FRAME_T *ptFrame);
```

#### 2.10.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| ivps_grp | int | IVPS 组 ID。 |
| ivps_chn | int | IVPS 通道 ID。 |
| pt_frame | dict &#124; None | 指向 AX_IVPS_GetChnFrame() 返回帧的指针。 |

#### 2.10.3. 返回值

- `ret`: *int* — 成功。ptFrame 为 NULL。组 ID 或通道 ID 无效。失败；返回 IVPS 错误码。

#### 2.10.4. 说明

返回类型：`int`。

源码：`python/axcl/ivps/ax_ivps.py:1618`。

#### 2.10.5. 示例

```python
ret = axcl.ivps.release_chn_frame(ivps_grp, ivps_chn, pt_frame)
```

<br>

<a id="axcl.ivps.enable_chn"></a>

### 2.11. axcl.ivps.enable_chn

启用 IVPS 通道。启用指定通道的输出处理。

#### 2.11.1. 函数

**Python 调用**

```python
ret = axcl.ivps.enable_chn(ivps_grp, ivps_chn)
```

**C++ 原型**

```cpp
AX_S32 AX_IVPS_EnableChn(IVPS_GRP IvpsGrp, IVPS_CHN IvpsChn);
```

#### 2.11.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| ivps_grp | int | IVPS 组 ID。 |
| ivps_chn | int | IVPS 通道 ID。 |

#### 2.11.3. 返回值

- `ret`: *int* — 成功。组 ID 或通道 ID 无效。尚未配置通道属性。失败；返回 IVPS 错误码。

#### 2.11.4. 说明

返回类型：`int`。

源码：`python/axcl/ivps/ax_ivps.py:1653`。

#### 2.11.5. 示例

```python
ret = axcl.ivps.enable_chn(ivps_grp, ivps_chn)
```

<br>

<a id="axcl.ivps.disable_chn"></a>

### 2.12. axcl.ivps.disable_chn

禁用 IVPS 通道。停止指定通道的输出处理。

#### 2.12.1. 函数

**Python 调用**

```python
ret = axcl.ivps.disable_chn(ivps_grp, ivps_chn)
```

**C++ 原型**

```cpp
AX_S32 AX_IVPS_DisableChn(IVPS_GRP IvpsGrp, IVPS_CHN IvpsChn);
```

#### 2.12.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| ivps_grp | int | IVPS 组 ID。 |
| ivps_chn | int | IVPS 通道 ID。 |

#### 2.12.3. 返回值

- `ret`: *int* — 成功。组 ID 或通道 ID 无效。失败；返回 IVPS 错误码。

#### 2.12.4. 说明

返回类型：`int`。

源码：`python/axcl/ivps/ax_ivps.py:1686`。

#### 2.12.5. 示例

```python
ret = axcl.ivps.disable_chn(ivps_grp, ivps_chn)
```

<br>

<a id="axcl.ivps.get_chn_fd"></a>

### 2.13. axcl.ivps.get_chn_fd

获取 IVPS 通道的文件描述符。返回可用于 poll/select 式事件处理的文件描述符。

#### 2.13.1. 函数

**Python 调用**

```python
ret = axcl.ivps.get_chn_fd(ivps_grp, ivps_chn)
```

**C++ 原型**

```cpp
AX_S32 AX_IVPS_GetChnFd(IVPS_GRP IvpsGrp, IVPS_CHN IvpsChn);
```

#### 2.13.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| ivps_grp | int | IVPS 组 ID。 |
| ivps_chn | int | IVPS 通道 ID。 |

#### 2.13.3. 返回值

- `ret`: *int* — 有效的文件描述符。组 ID 或通道 ID 无效。失败；返回 IVPS 错误码。

#### 2.13.4. 说明

返回类型：`int`。

源码：`python/axcl/ivps/ax_ivps.py:1719`。

#### 2.13.5. 示例

```python
ret = axcl.ivps.get_chn_fd(ivps_grp, ivps_chn)
```

<br>

<a id="axcl.ivps.close_all_fd"></a>

### 2.14. axcl.ivps.close_all_fd

关闭所有 IVPS 文件描述符。关闭为 IVPS 通道事件处理而打开的文件描述符。

#### 2.14.1. 函数

**Python 调用**

```python
ret = axcl.ivps.close_all_fd()
```

**C++ 原型**

```cpp
AX_S32 AX_IVPS_CloseAllFd(void);
```

#### 2.14.2. 参数

不适用

#### 2.14.3. 返回值

- `ret`: *int* — 成功。失败；返回 IVPS 错误码。

#### 2.14.4. 说明

返回类型：`int`。

源码：`python/axcl/ivps/ax_ivps.py:1752`。

#### 2.14.5. 示例

```python
ret = axcl.ivps.close_all_fd()
```

<br>

<a id="axcl.ivps.set_grp_attr"></a>

### 2.15. axcl.ivps.set_grp_attr

设置组属性。更新 IVPS 组的相关属性。

#### 2.15.1. 函数

**Python 调用**

```python
ret = axcl.ivps.set_grp_attr(ivps_grp, pt_grp_attr)
```

**C++ 原型**

```cpp
AX_S32 AX_IVPS_SetGrpAttr(IVPS_GRP IvpsGrp, const AX_IVPS_GRP_ATTR_T *ptGrpAttr);
```

#### 2.15.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| ivps_grp | int | IVPS 组 ID。 |
| pt_grp_attr | dict &#124; None | 指向组属性的指针。不得为 NULL。 |

#### 2.15.3. 返回值

- `ret`: *int* — 成功。ptGrpAttr 为 NULL。失败；返回 IVPS 错误码。

#### 2.15.4. 说明

返回类型：`int`。

源码：`python/axcl/ivps/ax_ivps.py:1780`。

#### 2.15.5. 示例

```python
ret = axcl.ivps.set_grp_attr(ivps_grp, pt_grp_attr)
```

<br>

<a id="axcl.ivps.get_grp_attr"></a>

### 2.16. axcl.ivps.get_grp_attr

获取组属性。返回 IVPS 组的相关属性。

#### 2.16.1. 函数

**Python 调用**

```python
pt_grp_attr, ret = axcl.ivps.get_grp_attr(ivps_grp)
```

**C++ 原型**

```cpp
AX_S32 AX_IVPS_GetGrpAttr(IVPS_GRP IvpsGrp, AX_IVPS_GRP_ATTR_T *ptGrpAttr);
```

#### 2.16.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| ivps_grp | int | IVPS 组 ID。 |

#### 2.16.3. 返回值

- `pt_grp_attr`: *dict* — 指向输出组属性的指针。不得为 NULL。
- `ret`: *int* — 成功。ptGrpAttr 为 NULL。失败；返回 IVPS 错误码。

#### 2.16.4. 说明

返回类型：`tuple[dict, int]`。

源码：`python/axcl/ivps/ax_ivps.py:1813`。

#### 2.16.5. 示例

```python
pt_grp_attr, ret = axcl.ivps.get_grp_attr(ivps_grp)
```

<br>

<a id="axcl.ivps.set_chn_attr"></a>

### 2.17. axcl.ivps.set_chn_attr

设置通道属性。更新 IVPS 通道的输出大小、格式、帧率、缓冲区、缩放及相关属性。

#### 2.17.1. 函数

**Python 调用**

```python
ret = axcl.ivps.set_chn_attr(ivps_grp, ivps_chn, pt_chn_attr)
```

**C++ 原型**

```cpp
AX_S32 AX_IVPS_SetChnAttr(IVPS_GRP IvpsGrp, IVPS_CHN IvpsChn, const AX_IVPS_CHN_ATTR_T *ptChnAttr);
```

#### 2.17.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| ivps_grp | int | IVPS 组 ID。 |
| ivps_chn | int | IVPS 通道 ID。 |
| pt_chn_attr | dict &#124; None | 指向通道属性的指针。不得为 NULL。 |

#### 2.17.3. 返回值

- `ret`: *int* — 成功。ptChnAttr 为 NULL。失败；返回 IVPS 错误码。

#### 2.17.4. 说明

返回类型：`int`。

源码：`python/axcl/ivps/ax_ivps.py:1847`。

#### 2.17.5. 示例

```python
ret = axcl.ivps.set_chn_attr(ivps_grp, ivps_chn, pt_chn_attr)
```

<br>

<a id="axcl.ivps.get_chn_attr"></a>

### 2.18. axcl.ivps.get_chn_attr

获取通道属性。返回 IVPS 通道已配置的属性。

#### 2.18.1. 函数

**Python 调用**

```python
pt_chn_attr, ret = axcl.ivps.get_chn_attr(ivps_grp, ivps_chn)
```

**C++ 原型**

```cpp
AX_S32 AX_IVPS_GetChnAttr(IVPS_GRP IvpsGrp, IVPS_CHN IvpsChn, AX_IVPS_CHN_ATTR_T *ptChnAttr);
```

#### 2.18.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| ivps_grp | int | IVPS 组 ID。 |
| ivps_chn | int | IVPS 通道 ID。 |

#### 2.18.3. 返回值

- `pt_chn_attr`: *dict* — 指向输出通道属性的指针。不得为 NULL。
- `ret`: *int* — 成功。ptChnAttr 为 NULL。失败；返回 IVPS 错误码。

#### 2.18.4. 说明

返回类型：`tuple[dict, int]`。

源码：`python/axcl/ivps/ax_ivps.py:1882`。

#### 2.18.5. 示例

```python
pt_chn_attr, ret = axcl.ivps.get_chn_attr(ivps_grp, ivps_chn)
```

<br>

<a id="axcl.ivps.set_grp_crop"></a>

### 2.19. axcl.ivps.set_grp_crop

设置 IVPS 组的裁剪配置。配置输入裁剪使能状态、坐标模式和裁剪矩形。

#### 2.19.1. 函数

**Python 调用**

```python
ret = axcl.ivps.set_grp_crop(ivps_grp, pt_crop_info)
```

**C++ 原型**

```cpp
AX_S32 AX_IVPS_SetGrpCrop(IVPS_GRP IvpsGrp, const AX_IVPS_CROP_INFO_T *ptCropInfo);
```

#### 2.19.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| ivps_grp | int | IVPS 组 ID。 |
| pt_crop_info | dict &#124; None | 指向裁剪配置的指针。不得为 NULL。 |

#### 2.19.3. 返回值

- `ret`: *int* — 成功。ptCropInfo 为 NULL。裁剪配置无效。失败；返回 IVPS 错误码。

#### 2.19.4. 说明

返回类型：`int`。

源码：`python/axcl/ivps/ax_ivps.py:1918`。

#### 2.19.5. 示例

```python
ret = axcl.ivps.set_grp_crop(ivps_grp, pt_crop_info)
```

<br>

<a id="axcl.ivps.get_grp_crop"></a>

### 2.20. axcl.ivps.get_grp_crop

获取 IVPS 组的裁剪配置。

#### 2.20.1. 函数

**Python 调用**

```python
pt_crop_info, ret = axcl.ivps.get_grp_crop(ivps_grp)
```

**C++ 原型**

```cpp
AX_S32 AX_IVPS_GetGrpCrop(IVPS_GRP IvpsGrp, AX_IVPS_CROP_INFO_T *ptCropInfo);
```

#### 2.20.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| ivps_grp | int | IVPS 组 ID。 |

#### 2.20.3. 返回值

- `pt_crop_info`: *dict* — 指向输出裁剪配置的指针。不得为 NULL。
- `ret`: *int* — 成功。ptCropInfo 为 NULL。失败；返回 IVPS 错误码。

#### 2.20.4. 说明

返回类型：`tuple[dict, int]`。

源码：`python/axcl/ivps/ax_ivps.py:1951`。

#### 2.20.5. 示例

```python
pt_crop_info, ret = axcl.ivps.get_grp_crop(ivps_grp)
```

<br>

<a id="axcl.ivps.set_chn_crop"></a>

### 2.21. axcl.ivps.set_chn_crop

设置 IVPS 通道的裁剪配置。

#### 2.21.1. 函数

**Python 调用**

```python
ret = axcl.ivps.set_chn_crop(ivps_grp, ivps_chn, pt_crop_info)
```

**C++ 原型**

```cpp
AX_S32 AX_IVPS_SetChnCrop(IVPS_GRP IvpsGrp, IVPS_CHN IvpsChn, const AX_IVPS_CROP_INFO_T *ptCropInfo);
```

#### 2.21.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| ivps_grp | int | IVPS 组 ID。 |
| ivps_chn | int | IVPS 通道 ID。 |
| pt_crop_info | dict &#124; None | 指向裁剪配置的指针。不得为 NULL。 |

#### 2.21.3. 返回值

- `ret`: *int* — 成功。ptCropInfo 为 NULL。IvpsChn 超出支持的输出通道范围。失败；返回 IVPS 错误码。

#### 2.21.4. 说明

返回类型：`int`。

源码：`python/axcl/ivps/ax_ivps.py:1985`。

#### 2.21.5. 示例

```python
ret = axcl.ivps.set_chn_crop(ivps_grp, ivps_chn, pt_crop_info)
```

<br>

<a id="axcl.ivps.get_chn_crop"></a>

### 2.22. axcl.ivps.get_chn_crop

获取 IVPS 通道的裁剪配置。

#### 2.22.1. 函数

**Python 调用**

```python
pt_crop_info, ret = axcl.ivps.get_chn_crop(ivps_grp, ivps_chn)
```

**C++ 原型**

```cpp
AX_S32 AX_IVPS_GetChnCrop(IVPS_GRP IvpsGrp, IVPS_CHN IvpsChn, AX_IVPS_CROP_INFO_T *ptCropInfo);
```

#### 2.22.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| ivps_grp | int | IVPS 组 ID。 |
| ivps_chn | int | IVPS 通道 ID。 |

#### 2.22.3. 返回值

- `pt_crop_info`: *dict* — 指向输出裁剪配置的指针。不得为 NULL。
- `ret`: *int* — 成功。ptCropInfo 为 NULL。IvpsChn 超出支持的输出通道范围。失败；返回 IVPS 错误码。

#### 2.22.4. 说明

返回类型：`tuple[dict, int]`。

源码：`python/axcl/ivps/ax_ivps.py:2020`。

#### 2.22.5. 示例

```python
pt_crop_info, ret = axcl.ivps.get_chn_crop(ivps_grp, ivps_chn)
```

<br>

<a id="axcl.ivps.set_chn_cascade"></a>

### 2.23. axcl.ivps.set_chn_cascade

配置通道级联处理。

#### 2.23.1. 函数

**Python 调用**

```python
ret = axcl.ivps.set_chn_cascade(ivps_grp, ivps_chn, cascade)
```

**C++ 原型**

```cpp
AX_S32 AX_IVPS_SetChnCascade(IVPS_GRP IvpsGrp, IVPS_CHN IvpsChn, AX_BOOL bCascade);
```

#### 2.23.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| ivps_grp | int | IVPS 组 ID。 |
| ivps_chn | int | IVPS 通道 ID。 |
| cascade | int | AX_TRUE 启用级联处理；AX_FALSE 禁用级联处理。 |

#### 2.23.3. 返回值

- `ret`: *int* — 成功。IvpsChn 超出支持的输出通道范围。失败；返回 IVPS 错误码。

#### 2.23.4. 说明

返回类型：`int`。

源码：`python/axcl/ivps/ax_ivps.py:2056`。

#### 2.23.5. 示例

```python
ret = axcl.ivps.set_chn_cascade(ivps_grp, ivps_chn, cascade)
```

<br>

<a id="axcl.ivps.set_scale_coef_level"></a>

### 2.24. axcl.ivps.set_scale_coef_level

为缩放范围配置缩放系数等级。

#### 2.24.1. 函数

**Python 调用**

```python
ret = axcl.ivps.set_scale_coef_level(pt_scale_range, pt_coef_level)
```

**C++ 原型**

```cpp
AX_S32 AX_IVPS_SetScaleCoefLevel(const AX_IVPS_SCALE_RANGE_T *ptScaleRange, const AX_IVPS_SCALE_COEF_LEVEL_T *ptCoefLevel);
```

#### 2.24.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| pt_scale_range | dict &#124; None | 指向水平和垂直缩放范围的指针。 |
| pt_coef_level | dict &#124; None | 指向系数等级配置的指针。 |

#### 2.24.3. 返回值

- `ret`: *int* — 成功。输入指针为 NULL。缩放范围或系数等级无效。失败；返回 IVPS 错误码。

#### 2.24.4. 说明

返回类型：`int`。

源码：`python/axcl/ivps/ax_ivps.py:2091`。

#### 2.24.5. 示例

```python
ret = axcl.ivps.set_scale_coef_level(pt_scale_range, pt_coef_level)
```

<br>

<a id="axcl.ivps.get_scale_coef_level"></a>

### 2.25. axcl.ivps.get_scale_coef_level

获取缩放范围对应的缩放系数等级。

#### 2.25.1. 函数

**Python 调用**

```python
pt_coef_level, ret = axcl.ivps.get_scale_coef_level(pt_scale_range)
```

**C++ 原型**

```cpp
AX_S32 AX_IVPS_GetScaleCoefLevel(const AX_IVPS_SCALE_RANGE_T *ptScaleRange, AX_IVPS_SCALE_COEF_LEVEL_T *ptCoefLevel);
```

#### 2.25.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| pt_scale_range | dict &#124; None | 指向水平和垂直缩放范围的指针。 |

#### 2.25.3. 返回值

- `pt_coef_level`: *dict* — 指向输出系数等级配置的指针。
- `ret`: *int* — 成功。输入指针为 NULL。缩放范围无效。失败；返回 IVPS 错误码。

#### 2.25.4. 说明

返回类型：`tuple[dict, int]`。

源码：`python/axcl/ivps/ax_ivps.py:2124`。

#### 2.25.5. 示例

```python
pt_coef_level, ret = axcl.ivps.get_scale_coef_level(pt_scale_range)
```

<br>

<a id="axcl.ivps.set_palette_table"></a>

### 2.26. axcl.ivps.set_palette_table

设置 IVPS 调色板表。

#### 2.26.1. 函数

**Python 调用**

```python
ret = axcl.ivps.set_palette_table(pt_palette_table)
```

**C++ 原型**

```cpp
AX_S32 AX_IVPS_SetPaletteTable(const AX_IVPS_PALETTE_TABLE_T *ptPaletteTable);
```

#### 2.26.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| pt_palette_table | dict &#124; None | 指向调色板表的指针，其最大容量为（源码说明不完整）。 |

#### 2.26.3. 返回值

- `ret`: *int* — 成功。ptPaletteTable 为 NULL。失败；返回 IVPS 错误码。

#### 2.26.4. 说明

返回类型：`int`。

源码：`python/axcl/ivps/ax_ivps.py:2158`。

#### 2.26.5. 示例

```python
ret = axcl.ivps.set_palette_table(pt_palette_table)
```

<br>

<a id="axcl.ivps.get_palette_table"></a>

### 2.27. axcl.ivps.get_palette_table

获取 IVPS 调色板表。

#### 2.27.1. 函数

**Python 调用**

```python
pt_palette_table, ret = axcl.ivps.get_palette_table()
```

**C++ 原型**

```cpp
AX_S32 AX_IVPS_GetPaletteTable(AX_IVPS_PALETTE_TABLE_T *ptPaletteTable);
```

#### 2.27.2. 参数

不适用

#### 2.27.3. 返回值

- `pt_palette_table`: *dict* — 指向输出调色板表的指针。不得为 NULL。
- `ret`: *int* — 成功。ptPaletteTable 为 NULL。失败；返回 IVPS 错误码。

#### 2.27.4. 说明

返回类型：`tuple[dict, int]`。

源码：`python/axcl/ivps/ax_ivps.py:2189`。

#### 2.27.5. 示例

```python
pt_palette_table, ret = axcl.ivps.get_palette_table()
```

<br>

<a id="axcl.ivps.draw_line"></a>

### 2.28. axcl.ivps.draw_line

在画布上绘制线条。使用指定的图形属性绘制直线或连续线段。

#### 2.28.1. 函数

**Python 调用**

```python
ret = axcl.ivps.draw_line(pt_canvas, t_attr, t_point, point_num)
```

**C++ 原型**

```cpp
AX_S32 AX_IVPS_DrawLine(const AX_IVPS_RGN_CANVAS_INFO_T *ptCanvas, AX_IVPS_GDI_ATTR_T tAttr, const AX_IVPS_POINT_T tPoint[], AX_U32 nPointNum);
```

#### 2.28.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| pt_canvas | dict &#124; None | 画布信息，包括地址、格式、跨度和大小。 |
| t_attr | dict | 图形属性，如线宽、alpha、颜色和坐标模式。 |
| t_point | list | 定义线条的点数组。 |
| point_num | int | tPoint 中的点数。 |

#### 2.28.3. 返回值

- `ret`: *int* — 成功。ptCanvas 或 tPoint 为 NULL。画布、点数组或图形属性无效。失败；返回 IVPS 错误码。

#### 2.28.4. 说明

返回类型：`int`。

源码：`python/axcl/ivps/ax_ivps.py:2220`。

#### 2.28.5. 示例

```python
ret = axcl.ivps.draw_line(pt_canvas, t_attr, t_point, point_num)
```

<br>

<a id="axcl.ivps.draw_polygon"></a>

### 2.29. axcl.ivps.draw_polygon

在画布上绘制多边形。绘制由所提供的点数组定义的多边形。

#### 2.29.1. 函数

**Python 调用**

```python
ret = axcl.ivps.draw_polygon(pt_canvas, t_attr, t_point, point_num)
```

**C++ 原型**

```cpp
AX_S32 AX_IVPS_DrawPolygon(const AX_IVPS_RGN_CANVAS_INFO_T *ptCanvas, AX_IVPS_GDI_ATTR_T tAttr, const AX_IVPS_POINT_T tPoint[], AX_U32 nPointNum);
```

#### 2.29.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| pt_canvas | dict &#124; None | 画布信息，包括地址、格式、跨度和大小。 |
| t_attr | dict | 图形属性，如线宽、alpha、颜色和填充模式。 |
| t_point | list | 多边形顶点数组。 |
| point_num | int | tPoint 中的顶点数。 |

#### 2.29.3. 返回值

- `ret`: *int* — 成功。ptCanvas 或 tPoint 为 NULL。画布、顶点数组或顶点数无效。失败；返回 IVPS 错误码。

#### 2.29.4. 说明

返回类型：`int`。

源码：`python/axcl/ivps/ax_ivps.py:2260`。

#### 2.29.5. 示例

```python
ret = axcl.ivps.draw_polygon(pt_canvas, t_attr, t_point, point_num)
```

<br>

<a id="axcl.ivps.draw_rect"></a>

### 2.30. axcl.ivps.draw_rect

在画布上绘制矩形。

#### 2.30.1. 函数

**Python 调用**

```python
ret = axcl.ivps.draw_rect(pt_canvas, t_attr, t_rect)
```

**C++ 原型**

```cpp
AX_S32 AX_IVPS_DrawRect(const AX_IVPS_RGN_CANVAS_INFO_T *ptCanvas, AX_IVPS_GDI_ATTR_T tAttr, AX_IVPS_RECT_T tRect);
```

#### 2.30.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| pt_canvas | dict &#124; None | 画布信息，包括地址、格式、跨度和大小。 |
| t_attr | dict | 图形属性，如线宽、alpha、颜色和填充模式。 |
| t_rect | dict | 要绘制的矩形。 |

#### 2.30.3. 返回值

- `ret`: *int* — 成功。ptCanvas 为 NULL。画布、矩形或图形属性无效。失败；返回 IVPS 错误码。

#### 2.30.4. 说明

返回类型：`int`。

源码：`python/axcl/ivps/ax_ivps.py:2300`。

#### 2.30.5. 示例

```python
ret = axcl.ivps.draw_rect(pt_canvas, t_attr, t_rect)
```

<br>

<a id="axcl.ivps.csc"></a>

### 2.31. axcl.ivps.csc

转换视频帧的色彩空间。使用选定的 IVPS 引擎，将 ptSrc 转换为 ptDst 描述的格式和布局。

#### 2.31.1. 函数

**Python 调用**

```python
ret = axcl.ivps.csc(engine, pt_src, pt_dst, pt_param)
```

**C++ 原型**

```cpp
AX_S32 AX_IVPS_Csc(AX_IVPS_ENGINE_E eEngine, const AX_VIDEO_FRAME_T *ptSrc, AX_VIDEO_FRAME_T *ptDst, const AX_CSC_PARAM_T *ptParam);
```

#### 2.31.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| engine | int | 处理引擎。有效值为（源码说明不完整）。 |
| pt_src | dict &#124; None | 源视频帧。不得为 NULL。 |
| pt_dst | dict &#124; None | 调用者提供的目标描述符，其地址和布局/容量字段作为输入。引用的数据区域接收输出。 |
| pt_param | dict &#124; None | 色彩空间转换参数。不得为 NULL。 |

#### 2.31.3. 返回值

- `ret`: *int* — 成功。ptSrc、ptDst 或 ptParam 为 NULL。引擎、帧格式、地址、跨度或 CSC 参数无效。不支持所选引擎或转换方式。失败；返回 IVPS 错误码。

#### 2.31.4. 说明

返回类型：`int`。

源码：`python/axcl/ivps/ax_ivps.py:2335`。

#### 2.31.5. 示例

```python
ret = axcl.ivps.csc(engine, pt_src, pt_dst, pt_param)
```

<br>

<a id="axcl.ivps.crop_resize"></a>

### 2.32. axcl.ivps.crop_resize

裁剪并缩放视频帧。根据宽高比、缩放、alpha 和压缩属性，将源帧裁剪并缩放到目标帧。

#### 2.32.1. 函数

**Python 调用**

```python
ret = axcl.ivps.crop_resize(engine, pt_src, pt_dst, pt_attr)
```

**C++ 原型**

```cpp
AX_S32 AX_IVPS_CropResize(AX_IVPS_ENGINE_E eEngine, const AX_VIDEO_FRAME_T *ptSrc, AX_VIDEO_FRAME_T *ptDst, const AX_IVPS_CROP_RESIZE_ATTR_T *ptAttr);
```

#### 2.32.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| engine | int | 处理引擎。当前 AXHELIX 实现支持（源码说明不完整）。 |
| pt_src | dict &#124; None | 源视频帧。不得为 NULL。 |
| pt_dst | dict &#124; None | 调用者提供的目标描述符，其地址和布局/容量字段作为输入。引用的数据区域接收输出。 |
| pt_attr | dict &#124; None | 裁剪缩放属性。不得为 NULL。 |

#### 2.32.3. 返回值

- `ret`: *int* — 成功。ptSrc、ptDst 或 ptAttr 为 NULL。eEngine 不为（源码说明不完整）。不支持所选引擎或缩放路径。失败；返回 IVPS 错误码。

#### 2.32.4. 说明

返回类型：`int`。

源码：`python/axcl/ivps/ax_ivps.py:2372`。

#### 2.32.5. 示例

```python
ret = axcl.ivps.crop_resize(engine, pt_src, pt_dst, pt_attr)
```

<br>

<a id="axcl.ivps.crop_resize_v2"></a>

### 2.33. axcl.ivps.crop_resize_v2

针对多个任务裁剪并缩放视频帧。根据宽高比、缩放、alpha 和压缩属性，将源帧裁剪并缩放到目标帧。

#### 2.33.1. 函数

**Python 调用**

```python
ret = axcl.ivps.crop_resize_v2(engine, pt_src, crop_num, t_box, pt_dst, pt_attr)
```

**C++ 原型**

```cpp
AX_S32 AX_IVPS_CropResizeV2(AX_IVPS_ENGINE_E eEngine, const AX_VIDEO_FRAME_T *ptSrc, AX_U8 nCropNum, const AX_IVPS_RECT_T tBox[], AX_VIDEO_FRAME_T ptDst[], const AX_IVPS_CROP_RESIZE_ATTR_T *ptAttr);
```

#### 2.33.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| engine | int | 处理引擎。当前 AXHELIX 实现支持（源码说明不完整）。 |
| pt_src | dict &#124; None | 源视频帧。不得为 NULL。帧裁剪未使用。 |
| crop_num | int | 裁剪缩放任务数，范围为 [1,（源码未提供上限）。 |
| t_box | list | 各任务的裁剪矩形。 |
| pt_dst | list | 调用者提供的目标描述符数组，其地址和布局/容量字段作为输入。引用的数据区域接收输出。 |
| pt_attr | dict &#124; None | 裁剪缩放属性。不得为 NULL。 |

#### 2.33.3. 返回值

- `ret`: *int* — 成功。ptSrc、tBox、ptDst 或 ptAttr 为 NULL。eEngine 不为（源码说明不完整）。不支持所选引擎或缩放路径。失败；返回 IVPS 错误码。

#### 2.33.4. 说明

返回类型：`int`。

源码：`python/axcl/ivps/ax_ivps.py:2409`。

#### 2.33.5. 示例

```python
ret = axcl.ivps.crop_resize_v2(engine, pt_src, crop_num, t_box, pt_dst, pt_attr)
```

<br>

<a id="axcl.ivps.alpha_blending"></a>

### 2.34. axcl.ivps.alpha_blending

将叠加帧通过 alpha 混合到源帧上。使用 ptAlpha 中的 alpha 来源和权重配置，在 tOffset 位置将 ptOverlay 混合到 ptSrc 上，并将结果写入 ptDst。

#### 2.34.1. 函数

**Python 调用**

```python
ret = axcl.ivps.alpha_blending(engine, pt_src, pt_overlay, t_offset, pt_alpha, pt_dst)
```

**C++ 原型**

```cpp
AX_S32 AX_IVPS_AlphaBlending(AX_IVPS_ENGINE_E eEngine, const AX_VIDEO_FRAME_T *ptSrc, const AX_VIDEO_FRAME_T *ptOverlay, const AX_IVPS_POINT_T tOffset, const AX_IVPS_ALPHA_T *ptAlpha, AX_VIDEO_FRAME_T *ptDst);
```

#### 2.34.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| engine | int | 处理引擎。当前 AXHELIX 实现支持（源码说明不完整）。 |
| pt_src | dict &#124; None | 背景帧/源帧。不得为 NULL。 |
| pt_overlay | dict &#124; None | 叠加帧。不得为 NULL。 |
| t_offset | dict | 目标坐标系中的叠加位置。 |
| pt_alpha | dict &#124; None | 指向 alpha 来源和权重配置的指针。不得为 NULL。 |
| pt_dst | dict &#124; None | 调用者提供的目标描述符，其地址和布局/容量字段作为输入。引用的数据区域接收输出。 |

#### 2.34.3. 返回值

- `ret`: *int* — 成功。必需的指针为 NULL。eEngine 不为（源码说明不完整）。不支持所选引擎或混合路径。失败；返回 IVPS 错误码。

#### 2.34.4. 说明

返回类型：`int`。

源码：`python/axcl/ivps/ax_ivps.py:2456`。

#### 2.34.5. 示例

```python
ret = axcl.ivps.alpha_blending(engine, pt_src, pt_overlay, t_offset, pt_alpha, pt_dst)
```

<br>

<a id="axcl.ivps.draw_osd"></a>

### 2.35. axcl.ivps.draw_osd

在视频帧上绘制 OSD 位图。使用所选引擎，将指定的位图属性叠加到 ptSrc 上。

#### 2.35.1. 函数

**Python 调用**

```python
ret = axcl.ivps.draw_osd(engine, pt_src, arr_bmp, num)
```

**C++ 原型**

```cpp
AX_S32 AX_IVPS_DrawOsd(AX_IVPS_ENGINE_E eEngine, const AX_VIDEO_FRAME_T *ptSrc, const AX_OSD_BMP_ATTR_T arrBmp[], AX_U32 nNum);
```

#### 2.35.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| engine | int | 处理引擎。当前 AXHELIX 实现支持（源码说明不完整）。 |
| pt_src | dict &#124; None | 源视频帧。不得为 NULL。 |
| arr_bmp | list | OSD 位图属性数组。nNum 非零时不得为 NULL。 |
| num | int | arrBmp 中的 OSD 位图条目数。 |

#### 2.35.3. 返回值

- `ret`: *int* — 成功。必需的指针为 NULL。eEngine 不为（源码说明不完整）。不支持所选引擎或 OSD 路径。失败；返回 IVPS 错误码。

#### 2.35.4. 说明

返回类型：`int`。

源码：`python/axcl/ivps/ax_ivps.py:2499`。

#### 2.35.5. 示例

```python
ret = axcl.ivps.draw_osd(engine, pt_src, arr_bmp, num)
```

<br>

<a id="axcl.ivps.draw_mosaic"></a>

### 2.36. axcl.ivps.draw_mosaic

在视频帧上绘制马赛克区域。对 tMosaic 描述的区域执行马赛克处理。

#### 2.36.1. 函数

**Python 调用**

```python
ret = axcl.ivps.draw_mosaic(engine, pt_src, t_mosaic, num)
```

**C++ 原型**

```cpp
AX_S32 AX_IVPS_DrawMosaic(AX_IVPS_ENGINE_E eEngine, const AX_VIDEO_FRAME_T *ptSrc, AX_RGN_MOSAIC_T tMosaic[], AX_U32 nNum);
```

#### 2.36.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| engine | int | 处理引擎。当前 AXHELIX 实现支持（源码说明不完整）。 |
| pt_src | dict &#124; None | 源视频帧。不得为 NULL。 |
| t_mosaic | list | 马赛克区域属性数组。nNum 非零时不得为 NULL。 |
| num | int | tMosaic 中的马赛克区域数。 |

#### 2.36.3. 返回值

- `ret`: *int* — 成功。必需的指针为 NULL。eEngine 既不是（源码说明不完整）。不支持所选引擎或马赛克路径。失败；返回 IVPS 错误码。

#### 2.36.4. 说明

返回类型：`int`。

源码：`python/axcl/ivps/ax_ivps.py:2539`。

#### 2.36.5. 示例

```python
ret = axcl.ivps.draw_mosaic(engine, pt_src, t_mosaic, num)
```

<br>

<a id="axcl.ivps.rotation"></a>

### 2.37. axcl.ivps.rotation

旋转、翻转或镜像视频帧。对 ptSrc 执行所请求的旋转和方向变换，并将结果写入 ptDst。

#### 2.37.1. 函数

**Python 调用**

```python
ret = axcl.ivps.rotation(engine, pt_src, pt_dst, rotation, flip, mirror)
```

**C++ 原型**

```cpp
AX_S32 AX_IVPS_Rotation(AX_IVPS_ENGINE_E eEngine, const AX_VIDEO_FRAME_T *ptSrc, AX_VIDEO_FRAME_T *ptDst, AX_IVPS_ROTATION_E eRotation, AX_BOOL bFlip, AX_BOOL bMirror);
```

#### 2.37.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| engine | int | 处理引擎。当前 AXHELIX 实现支持（源码说明不完整）。 |
| pt_src | dict &#124; None | 源视频帧。不得为 NULL。 |
| pt_dst | dict &#124; None | 调用者提供的目标描述符，其地址和布局/容量字段作为输入。引用的数据区域接收输出。 |
| rotation | int | 旋转角度。参见（源码未提供引用目标）。 |
| flip | int | AX_TRUE 启用垂直翻转；AX_FALSE 禁用垂直翻转。 |
| mirror | int | AX_TRUE 启用水平镜像；AX_FALSE 禁用水平镜像。 |

#### 2.37.3. 返回值

- `ret`: *int* — 成功。eEngine 不为（源码说明不完整）。失败；返回 IVPS 错误码。

#### 2.37.4. 说明

返回类型：`int`。

源码：`python/axcl/ivps/ax_ivps.py:2579`。

#### 2.37.5. 示例

```python
ret = axcl.ivps.rotation(engine, pt_src, pt_dst, rotation, flip, mirror)
```

<br>

<a id="axcl.ivps.get_buffer_size"></a>

### 2.38. axcl.ivps.get_buffer_size

获取指定尺寸和格式的图像所需的缓冲区大小。

#### 2.38.1. 函数

**Python 调用**

```python
ret = axcl.ivps.get_buffer_size(u_width, u_height, format)
```

**C++ 原型**

```cpp
AX_U64 AX_IVPS_GetBufferSize(AX_U16 uWidth, AX_U16 uHeight, AX_IMG_FORMAT_E eFormat);
```

#### 2.38.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| u_width | int | 图像宽度，单位为像素。 |
| u_height | int | 图像高度，单位为像素。 |
| format | int | 图像格式。参见 AX_IMG_FORMAT_E。 |

#### 2.38.3. 返回值

- `ret`: *int* — 所需的缓冲区大小，单位为字节。

#### 2.38.4. 说明

返回类型：`int`。

源码：`python/axcl/ivps/ax_ivps.py:2620`。

#### 2.38.5. 示例

```python
ret = axcl.ivps.get_buffer_size(u_width, u_height, format)
```

<br>

<a id="axcl.ivps.create"></a>

### 2.39. axcl.ivps.create

创建 Region 句柄。分配并初始化 Region 句柄。执行任何 Region 操作（挂载、更新、解绑、销毁）前，必须先创建句柄。

#### 2.39.1. 函数

**Python 调用**

```python
h_region, ret = axcl.ivps.create()
```

**C++ 原型**

```cpp
AX_S32 AX_RGN_Create(AX_RGN_HANDLE *hRegion);
```

#### 2.39.2. 参数

不适用

#### 2.39.3. 返回值

- `h_region`: *int* — 指向待创建 Region 句柄的指针。不得为 NULL。
- `ret`: *int* — 成功。失败；返回表示原因的 IVPS 错误码。

#### 2.39.4. 说明

返回类型：`tuple[int, int]`。

源码：`python/axcl/ivps/ax_rgn.py:151`。

#### 2.39.5. 示例

```python
h_region, ret = axcl.ivps.create()
```

<br>

<a id="axcl.ivps.destroy"></a>

### 2.40. axcl.ivps.destroy

销毁 Region 句柄。释放指定 Region 句柄关联的资源。调用本函数前，必须先将句柄从所有通道解绑。

#### 2.40.1. 函数

**Python 调用**

```python
ret = axcl.ivps.destroy(h_region)
```

**C++ 原型**

```cpp
AX_S32 AX_RGN_Destroy(AX_RGN_HANDLE hRegion);
```

#### 2.40.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| h_region | int | 待销毁的 Region 句柄。必须为通过以下方式创建的有效句柄（源码说明不完整）。 |

#### 2.40.3. 返回值

- `ret`: *int* — 成功。失败；返回 IVPS 错误码。

#### 2.40.4. 说明

返回类型：`int`。

源码：`python/axcl/ivps/ax_rgn.py:182`。

#### 2.40.5. 示例

```python
ret = axcl.ivps.destroy(h_region)
```

<br>

<a id="axcl.ivps.attach_to_chn"></a>

### 2.41. axcl.ivps.attach_to_chn

将 Region 句柄挂载到目标模块通道。将 Region 句柄与指定模块/通道的输出路径关联。挂载后，处理过程中会将 Region 内容（OSD、线条、多边形、马赛克等）叠加到目标通道的输出上。

#### 2.41.1. 函数

**Python 调用**

```python
ret = axcl.ivps.attach_to_chn(h_region, pt_rgn_chn)
```

**C++ 原型**

```cpp
AX_S32 AX_RGN_AttachToChn(AX_RGN_HANDLE hRegion, const AX_MOD_CHN_T *ptRgnChn);
```

#### 2.41.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| h_region | int | 待挂载的 Region 句柄。必须为通过以下方式创建的有效句柄（源码说明不完整）。 |
| pt_rgn_chn | dict &#124; None | 指向目标模块和通道标识的指针。s32ChnId 为 -1 时，Region 挂载在组级别。目标为 IVPS 输出时，此参数指向 IVPS 输出通道路径。 |

#### 2.41.3. 返回值

- `ret`: *int* — 成功。失败；返回 IVPS 错误码。

#### 2.41.4. 说明

返回类型：`int`。

源码：`python/axcl/ivps/ax_rgn.py:213`。

#### 2.41.5. 示例

```python
ret = axcl.ivps.attach_to_chn(h_region, pt_rgn_chn)
```

<br>

<a id="axcl.ivps.detach_from_chn"></a>

### 2.42. axcl.ivps.detach_from_chn

将 Region 句柄从目标模块通道解绑。解除 Region 句柄与指定模块/通道输出路径之间的关联。解绑后，Region 内容不再出现在通道输出中。

#### 2.42.1. 函数

**Python 调用**

```python
ret = axcl.ivps.detach_from_chn(h_region, rgn_chn)
```

**C++ 原型**

```cpp
AX_S32 AX_RGN_DetachFromChn(AX_RGN_HANDLE hRegion, const AX_MOD_CHN_T *pRgnChn);
```

#### 2.42.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| h_region | int | 待解绑的 Region 句柄。必须为通过以下方式创建的有效句柄（源码说明不完整）。 |
| rgn_chn | dict &#124; None | 指向目标模块和通道标识的指针。必须与对应操作所用的值一致（源码说明不完整）。 |

#### 2.42.3. 返回值

- `ret`: *int* — 成功。失败；返回 IVPS 错误码。

#### 2.42.4. 说明

返回类型：`int`。

源码：`python/axcl/ivps/ax_rgn.py:246`。

#### 2.42.5. 示例

```python
ret = axcl.ivps.detach_from_chn(h_region, rgn_chn)
```

<br>

<a id="axcl.ivps.update"></a>

### 2.43. axcl.ivps.update

更新 Region 句柄的显示内容。更新指定 Region 句柄的叠加内容（OSD、线条、多边形、矩形、马赛克或角矩形）。更新从已挂载通道处理的下一帧开始生效。

#### 2.43.1. 函数

**Python 调用**

```python
ret = axcl.ivps.update(h_region, pt_disp)
```

**C++ 原型**

```cpp
AX_S32 AX_RGN_Update(AX_RGN_HANDLE hRegion, const AX_RGN_DISP_GROUP_T *ptDisp);
```

#### 2.43.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| h_region | int | 待更新的 Region 句柄。必须为通过以下方式创建的有效句柄（源码说明不完整）。 |
| pt_disp | dict &#124; None | 指向显示组描述符的指针（源码说明不完整）。 |

#### 2.43.3. 返回值

- `ret`: *int* — 成功。失败；返回 IVPS 错误码。

#### 2.43.4. 说明

返回类型：`int`。

源码：`python/axcl/ivps/ax_rgn.py:279`。

#### 2.43.5. 示例

```python
ret = axcl.ivps.update(h_region, pt_disp)
```
