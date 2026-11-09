# axcl.ive

## 1. 目录

- [axcl.ive.init](#axcl.ive.init): 初始化 IVE 模块。
- [axcl.ive.exit](#axcl.ive.exit): 退出 IVE 模块。
- [axcl.ive.query](#axcl.ive.query): 本接口使用被调用函数返回的 IveHandle，查询该函数的状态。阻塞模式下，系统等待被查询函数被调用。非阻塞模式下，仅查询当前状态，不执行其他操作。
- [axcl.ive.dma](#axcl.ive.dma): 直接内存访问（DMA）：1. 直接内存拷贝；2. 按字节间隔拷贝；3. 使用 3 字节填充内存；4. 使用 8 字节填充内存；
- [axcl.ive.add](#axcl.ive.add): 对两幅灰度图像执行加法操作。
- [axcl.ive.sub](#axcl.ive.sub): 对两幅灰度图像执行减法操作。
- [axcl.ive.and_](#axcl.ive.and_): 对二值图像执行与操作。
- [axcl.ive.or_](#axcl.ive.or_): 对两幅二值图像执行或操作。
- [axcl.ive.xor](#axcl.ive.xor): 对两幅二值图像执行异或操作。
- [axcl.ive.mse](#axcl.ive.mse): 对两幅灰度图像执行 Mse 操作。
- [axcl.ive.canny_hys_edge](#axcl.ive.canny_hys_edge): Canny 边缘检测的第一部分。包括以下步骤：梯度计算、幅值与角度计算、滞后阈值处理、NMS（非极大值抑制）。
- [axcl.ive.canny_edge](#axcl.ive.canny_edge): Canny 边缘检测的第二部分：通过弱边缘追踪强边缘。
- [axcl.ive.ccl](#axcl.ive.ccl): 连通域标记。仅支持 8 连通方式。
- [axcl.ive.erode](#axcl.ive.erode): 使用 5x5 模板执行腐蚀。仅支持 U8C1 二值图像输入，否则结果不正确。
- [axcl.ive.dilate](#axcl.ive.dilate): 使用 5x5 模板执行膨胀。仅支持 U8C1 二值图像输入，否则结果不符合预期。
- [axcl.ive.filter](#axcl.ive.filter): 使用 5x5 模板执行滤波。
- [axcl.ive.hist](#axcl.ive.hist): 计算输入灰度图像的直方图。
- [axcl.ive.equalize_hist](#axcl.ive.equalize_hist): 通过直方图均衡化增强输入图像的对比度。
- [axcl.ive.integ](#axcl.ive.integ): 计算输入灰度图像的积分图像。
- [axcl.ive.mag_and_ang](#axcl.ive.mag_and_ang): MagAndAng 用于提取边缘信息。
- [axcl.ive.sobel](#axcl.ive.sobel): SOBEL 用于提取梯度信息。
- [axcl.ive.gmm](#axcl.ive.gmm): 使用 GMM（高斯混合模型）方法分离前景和背景；支持灰度或 RGB GMM。
- [axcl.ive.gmm2](#axcl.ive.gmm2): 使用 GMM（高斯混合模型）方法分离前景和背景；支持灰度或 RGB GMM。
- [axcl.ive.thresh](#axcl.ive.thresh): 对输入图像执行阈值处理。
- [axcl.ive.func_16_bit_to8_bit](#axcl.ive.func_16_bit_to8_bit): 将输入的 16bit 数据缩放为输出的 8bit 数据。
- [axcl.ive.ncc](#axcl.ive.ncc): 计算两幅灰度图像的 NCC（归一化互相关）。

<br>

## 2. API

<a id="axcl.ive.init"></a>

### 2.1. axcl.ive.init

初始化 IVE 模块。

#### 2.1.1. 函数

**Python 调用**

```python
ret = axcl.ive.init()
```

**C++ 原型**

```cpp
AX_S32 AX_IVE_Init(void);
```

#### 2.1.2. 参数

不适用

#### 2.1.3. 返回值

- `ret`: *int* — 成功。失败；返回 IVE 错误码。

#### 2.1.4. 说明

返回类型：`int`。

#### 2.1.5. 示例

```python
ret = axcl.ive.init()
```

<br>

<a id="axcl.ive.exit"></a>

### 2.2. axcl.ive.exit

退出 IVE 模块。

#### 2.2.1. 函数

**Python 调用**

```python
axcl.ive.exit()
```

**C++ 原型**

```cpp
AX_VOID AX_IVE_Exit(void);
```

#### 2.2.2. 参数

不适用

#### 2.2.3. 返回值

- None

#### 2.2.4. 说明

返回类型：`None`。

#### 2.2.5. 示例

```python
axcl.ive.exit()
```

<br>

<a id="axcl.ive.query"></a>

### 2.3. axcl.ive.query

本接口使用被调用函数返回的 IveHandle，查询该函数的状态。阻塞模式下，系统等待被查询函数被调用。非阻塞模式下，仅查询当前状态，不执行其他操作。

#### 2.3.1. 函数

**Python 调用**

```python
pb_finish, ret = axcl.ive.query(ive_handle, block)
```

**C++ 原型**

```cpp
AX_S32 AX_IVE_Query(AX_IVE_HANDLE IveHandle, AX_BOOL *pbFinish, AX_BOOL bBlock);
```

#### 2.3.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| ive_handle | int | 被调用函数的 IveHandle。由用户输入。 |
| block | int | 指示阻塞或非阻塞模式的标志。 |

#### 2.3.3. 返回值

- `pb_finish`: *bool* — 返回的状态。
- `ret`: *int* — 成功。失败；返回 IVE 错误码。

#### 2.3.4. 说明

返回类型：`tuple[bool, int]`。

#### 2.3.5. 示例

```python
pb_finish, ret = axcl.ive.query(ive_handle, block)
```

<br>

<a id="axcl.ive.dma"></a>

### 2.4. axcl.ive.dma

直接内存访问（DMA）：1. 直接内存拷贝；2. 按字节间隔拷贝；3. 使用 3 字节填充内存；4. 使用 8 字节填充内存；

#### 2.4.1. 函数

**Python 调用**

```python
ive_handle, ret = axcl.ive.dma(src, dst, dma_ctrl, instant)
```

**C++ 原型**

```cpp
AX_S32 AX_IVE_DMA(AX_IVE_HANDLE *pIveHandle, AX_IVE_SRC_DATA_T *pstSrc, AX_IVE_DST_DATA_T *pstDst, AX_IVE_DMA_CTRL_T *pstDmaCtrl, AX_BOOL bInstant);
```

#### 2.4.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| src | dict &#124; None | 输入源数据。输入数据按 U8C1 数据处理。 |
| dst | dict &#124; None | 调用者提供的目标描述符，其地址和布局/容量字段作为输入。引用的数据区域接收输出。 |
| dma_ctrl | dict &#124; None | DMA 控制参数。 |
| instant | int | 指示是否产生中断的标志。 |

#### 2.4.3. 返回值

- `ive_handle`: *int* — 返回的任务句柄 ID。
- `ret`: *int* — 成功。失败；返回 IVE 错误码。

#### 2.4.4. 说明

返回类型：`tuple[int, int]`。

#### 2.4.5. 示例

```python
ive_handle, ret = axcl.ive.dma(src, dst, dma_ctrl, instant)
```

<br>

<a id="axcl.ive.add"></a>

### 2.5. axcl.ive.add

对两幅灰度图像执行加法操作。

#### 2.5.1. 函数

**Python 调用**

```python
ive_handle, ret = axcl.ive.add(src1, src2, dst, add_ctrl, instant)
```

**C++ 原型**

```cpp
AX_S32 AX_IVE_Add(AX_IVE_HANDLE *pIveHandle, AX_IVE_SRC_IMAGE_T *pstSrc1, AX_IVE_SRC_IMAGE_T *pstSrc2, AX_IVE_DST_IMAGE_T *pstDst, AX_IVE_ADD_CTRL_T *pstAddCtrl, AX_BOOL bInstant);
```

#### 2.5.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| src1 | dict &#124; None | 输入源中的被加数。仅支持 U8C1 输入格式。 |
| src2 | dict &#124; None | 输入源中的加数。仅支持 U8C1 输入格式。 |
| dst | dict &#124; None | 调用者提供的目标描述符，其地址和布局/容量字段作为输入。引用的数据区域接收输出。 |
| add_ctrl | dict &#124; None | 控制参数。 |
| instant | int | 详情参见 AX_IVE_DMA。 |

#### 2.5.3. 返回值

- `ive_handle`: *int* — 返回的任务句柄 ID。
- `ret`: *int* — 成功。失败；返回 IVE 错误码。

#### 2.5.4. 说明

返回类型：`tuple[int, int]`。

#### 2.5.5. 示例

```python
ive_handle, ret = axcl.ive.add(src1, src2, dst, add_ctrl, instant)
```

<br>

<a id="axcl.ive.sub"></a>

### 2.6. axcl.ive.sub

对两幅灰度图像执行减法操作。

#### 2.6.1. 函数

**Python 调用**

```python
ive_handle, ret = axcl.ive.sub(src1, src2, dst, sub_ctrl, instant)
```

**C++ 原型**

```cpp
AX_S32 AX_IVE_Sub(AX_IVE_HANDLE *pIveHandle, AX_IVE_SRC_IMAGE_T *pstSrc1, AX_IVE_SRC_IMAGE_T *pstSrc2, AX_IVE_DST_IMAGE_T *pstDst, AX_IVE_SUB_CTRL_T *pstSubCtrl, AX_BOOL bInstant);
```

#### 2.6.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| src1 | dict &#124; None | 输入源中的被减数。仅支持 U8C1 输入格式。 |
| src2 | dict &#124; None | 输入源中的减数。仅支持 U8C1 输入格式。 |
| dst | dict &#124; None | 调用者提供的目标描述符，其地址和布局/容量字段作为输入。引用的数据区域接收输出。 |
| sub_ctrl | dict &#124; None | 控制参数。 |
| instant | int | 详情参见 AX_IVE_DMA。 |

#### 2.6.3. 返回值

- `ive_handle`: *int* — 返回的任务句柄 ID。
- `ret`: *int* — 成功。失败；返回 IVE 错误码。

#### 2.6.4. 说明

返回类型：`tuple[int, int]`。

#### 2.6.5. 示例

```python
ive_handle, ret = axcl.ive.sub(src1, src2, dst, sub_ctrl, instant)
```

<br>

<a id="axcl.ive.and_"></a>

### 2.7. axcl.ive.and_

对二值图像执行与操作。

#### 2.7.1. 函数

**Python 调用**

```python
ive_handle, ret = axcl.ive.and_(src1, src2, dst, instant)
```

**C++ 原型**

```cpp
AX_S32 AX_IVE_And(AX_IVE_HANDLE *pIveHandle, AX_IVE_SRC_IMAGE_T *pstSrc1, AX_IVE_SRC_IMAGE_T *pstSrc2, AX_IVE_DST_IMAGE_T *pstDst, AX_BOOL bInstant);
```

#### 2.7.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| src1 | dict &#124; None | 输入源 source1。仅支持 U8C1 输入格式。 |
| src2 | dict &#124; None | 输入源 source2。仅支持 U8C1 输入格式。 |
| dst | dict &#124; None | 调用者提供的目标描述符，其地址和布局/容量字段作为输入。引用的数据区域接收输出。 |
| instant | int | 详情参见 AX_IVE_DMA。 |

#### 2.7.3. 返回值

- `ive_handle`: *int* — 返回的任务句柄 ID。
- `ret`: *int* — 成功。失败；返回 IVE 错误码。

#### 2.7.4. 说明

返回类型：`tuple[int, int]`。

#### 2.7.5. 示例

```python
ive_handle, ret = axcl.ive.and_(src1, src2, dst, instant)
```

<br>

<a id="axcl.ive.or_"></a>

### 2.8. axcl.ive.or_

对两幅二值图像执行或操作。

#### 2.8.1. 函数

**Python 调用**

```python
ive_handle, ret = axcl.ive.or_(src1, src2, dst, instant)
```

**C++ 原型**

```cpp
AX_S32 AX_IVE_Or(AX_IVE_HANDLE *pIveHandle, AX_IVE_SRC_IMAGE_T *pstSrc1, AX_IVE_SRC_IMAGE_T *pstSrc2, AX_IVE_DST_IMAGE_T *pstDst, AX_BOOL bInstant);
```

#### 2.8.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| src1 | dict &#124; None | 输入源 source1。仅支持 U8C1 输入格式。 |
| src2 | dict &#124; None | 输入源 source2。仅支持 U8C1 输入格式。 |
| dst | dict &#124; None | 调用者提供的目标描述符，其地址和布局/容量字段作为输入。引用的数据区域接收输出。 |
| instant | int | 详情参见 AX_IVE_DMA。 |

#### 2.8.3. 返回值

- `ive_handle`: *int* — 返回的任务句柄 ID。
- `ret`: *int* — 成功。失败；返回 IVE 错误码。

#### 2.8.4. 说明

返回类型：`tuple[int, int]`。

#### 2.8.5. 示例

```python
ive_handle, ret = axcl.ive.or_(src1, src2, dst, instant)
```

<br>

<a id="axcl.ive.xor"></a>

### 2.9. axcl.ive.xor

对两幅二值图像执行异或操作。

#### 2.9.1. 函数

**Python 调用**

```python
ive_handle, ret = axcl.ive.xor(src1, src2, dst, instant)
```

**C++ 原型**

```cpp
AX_S32 AX_IVE_Xor(AX_IVE_HANDLE *pIveHandle, AX_IVE_SRC_IMAGE_T *pstSrc1, AX_IVE_SRC_IMAGE_T *pstSrc2, AX_IVE_DST_IMAGE_T *pstDst, AX_BOOL bInstant);
```

#### 2.9.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| src1 | dict &#124; None | 输入源 source1。仅支持 U8C1 输入格式。 |
| src2 | dict &#124; None | 输入源 source2。 |
| dst | dict &#124; None | 调用者提供的目标描述符，其地址和布局/容量字段作为输入。引用的数据区域接收输出。 |
| instant | int | 详情参见 AX_IVE_DMA。 |

#### 2.9.3. 返回值

- `ive_handle`: *int* — 返回的任务句柄 ID。
- `ret`: *int* — 成功。失败；返回 IVE 错误码。

#### 2.9.4. 说明

返回类型：`tuple[int, int]`。

#### 2.9.5. 示例

```python
ive_handle, ret = axcl.ive.xor(src1, src2, dst, instant)
```

<br>

<a id="axcl.ive.mse"></a>

### 2.10. axcl.ive.mse

对两幅灰度图像执行 Mse 操作。

#### 2.10.1. 函数

**Python 调用**

```python
ive_handle, ret = axcl.ive.mse(src1, src2, dst, mse_ctrl, instant)
```

**C++ 原型**

```cpp
AX_S32 AX_IVE_Mse(AX_IVE_HANDLE *pIveHandle, AX_IVE_SRC_IMAGE_T *pstSrc1, AX_IVE_SRC_IMAGE_T *pstSrc2, AX_IVE_DST_IMAGE_T *pstDst, AX_IVE_MSE_CTRL_T *pstMseCtrl, AX_BOOL bInstant);
```

#### 2.10.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| src1 | dict &#124; None | 输入源中的被减数。仅支持 U8C1 输入格式。 |
| src2 | dict &#124; None | 输入源中的减数。仅支持 U8C1 输入格式。 |
| dst | dict &#124; None | 调用者提供的目标描述符，其地址和布局/容量字段作为输入。引用的数据区域接收输出。 |
| mse_ctrl | dict &#124; None | 控制参数。 |
| instant | int | 详情参见 AX_IVE_DMA。 |

#### 2.10.3. 返回值

- `ive_handle`: *int* — 返回的任务句柄 ID。
- `ret`: *int* — 成功。失败；返回 IVE 错误码。

#### 2.10.4. 说明

返回类型：`tuple[int, int]`。

#### 2.10.5. 示例

```python
ive_handle, ret = axcl.ive.mse(src1, src2, dst, mse_ctrl, instant)
```

<br>

<a id="axcl.ive.canny_hys_edge"></a>

### 2.11. axcl.ive.canny_hys_edge

Canny 边缘检测的第一部分。包括以下步骤：梯度计算、幅值与角度计算、滞后阈值处理、NMS（非极大值抑制）。

#### 2.11.1. 函数

**Python 调用**

```python
ive_handle, ret = axcl.ive.canny_hys_edge(src1, src2, dst, canny_hys_edge_ctrl, instant)
```

**C++ 原型**

```cpp
AX_S32 AX_IVE_CannyHysEdge(AX_IVE_HANDLE *pIveHandle, AX_IVE_SRC_IMAGE_T *pstSrc1, AX_IVE_SRC_IMAGE_T *pstSrc2, AX_IVE_DST_IMAGE_T *pstDst, AX_IVE_HYS_EDGE_CTRL_T *pstCannyHysEdgeCtrl, AX_BOOL bInstant);
```

#### 2.11.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| src1 | dict &#124; None | 输入源 source1。仅支持 U8C1 输入格式。 |
| src2 | dict &#124; None | 输入源 source2。仅支持 U16C1 输入格式。 |
| dst | dict &#124; None | 调用者提供的目标描述符，其地址和布局/容量字段作为输入。引用的数据区域接收输出。 |
| canny_hys_edge_ctrl | dict &#124; None | 输入参数。 |
| instant | int | 详情参见 AX_IVE_DMA。 |

#### 2.11.3. 返回值

- `ive_handle`: *int* — 返回的任务句柄 ID。
- `ret`: *int* — 成功。失败；返回 IVE 错误码。

#### 2.11.4. 说明

返回类型：`tuple[int, int]`。

#### 2.11.5. 示例

```python
ive_handle, ret = axcl.ive.canny_hys_edge(src1, src2, dst, canny_hys_edge_ctrl, instant)
```

<br>

<a id="axcl.ive.canny_edge"></a>

### 2.12. axcl.ive.canny_edge

Canny 边缘检测的第二部分：通过弱边缘追踪强边缘。

#### 2.12.1. 函数

**Python 调用**

```python
ive_handle, ret = axcl.ive.canny_edge(src, dst, canny_edge_ctrl, instant)
```

**C++ 原型**

```cpp
AX_S32 AX_IVE_CannyEdge(AX_IVE_HANDLE *pIveHandle, AX_IVE_SRC_IMAGE_T *pstSrc, AX_IVE_DST_IMAGE_T *pstDst, AX_IVE_CANNY_EDGE_CTRL_T *pstCannyEdgeCtrl, AX_BOOL bInstant);
```

#### 2.12.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| src | dict &#124; None | 输入源。仅支持 U8C1 格式。 |
| dst | dict &#124; None | 调用者提供的目标描述符，其地址和布局/容量字段作为输入。引用的数据区域接收输出。 |
| canny_edge_ctrl | dict &#124; None | 控制参数。 |
| instant | int | 详情参见 AX_IVE_DMA。 |

#### 2.12.3. 返回值

- `ive_handle`: *int* — 返回的任务句柄 ID。
- `ret`: *int* — 成功。失败；返回 IVE 错误码。

#### 2.12.4. 说明

返回类型：`tuple[int, int]`。

#### 2.12.5. 示例

```python
ive_handle, ret = axcl.ive.canny_edge(src, dst, canny_edge_ctrl, instant)
```

<br>

<a id="axcl.ive.ccl"></a>

### 2.13. axcl.ive.ccl

连通域标记。仅支持 8 连通方式。

#### 2.13.1. 函数

**Python 调用**

```python
ive_handle, ret = axcl.ive.ccl(src, dst, blob, ccl_ctrl, instant)
```

**C++ 原型**

```cpp
AX_S32 AX_IVE_CCL(AX_IVE_HANDLE *pIveHandle, AX_IVE_SRC_IMAGE_T *pstSrc, AX_IVE_DST_IMAGE_T *pstDst, AX_IVE_DST_MEM_INFO_T *pstBlob, AX_IVE_CCL_CTRL_T *pstCclCtrl, AX_BOOL bInstant);
```

#### 2.13.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| src | dict &#124; None | 输入源。 |
| dst | dict &#124; None | 调用者提供的目标描述符，其地址和布局/容量字段作为输入。引用的数据区域接收输出。 |
| blob | dict &#124; None | 调用者提供的目标描述符，其地址和布局/容量字段作为输入。引用的数据区域接收输出。 |
| ccl_ctrl | dict &#124; None | CCL 控制参数。 |
| instant | int | 详情参见 AX_IVE_DMA。 |

#### 2.13.3. 返回值

- `ive_handle`: *int* — 返回的任务句柄 ID。
- `ret`: *int* — 成功。失败；返回 IVE 错误码。

#### 2.13.4. 说明

返回类型：`tuple[int, int]`。

#### 2.13.5. 示例

```python
ive_handle, ret = axcl.ive.ccl(src, dst, blob, ccl_ctrl, instant)
```

<br>

<a id="axcl.ive.erode"></a>

### 2.14. axcl.ive.erode

使用 5x5 模板执行腐蚀。仅支持 U8C1 二值图像输入，否则结果不正确。

#### 2.14.1. 函数

**Python 调用**

```python
ive_handle, ret = axcl.ive.erode(src, dst, erode_ctrl, instant)
```

**C++ 原型**

```cpp
AX_S32 AX_IVE_Erode(AX_IVE_HANDLE *pIveHandle, AX_IVE_SRC_IMAGE_T *pstSrc, AX_IVE_DST_IMAGE_T *pstDst, AX_IVE_ERODE_CTRL_T *pstErodeCtrl, AX_BOOL bInstant);
```

#### 2.14.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| src | dict &#124; None | 输入二值图像，由 0 或 255 构成。仅支持 U8C1 图像格式。 |
| dst | dict &#124; None | 调用者提供的目标描述符，其地址和布局/容量字段作为输入。引用的数据区域接收输出。 |
| erode_ctrl | dict &#124; None | 控制参数。 |
| instant | int | 详情参见 AX_IVE_DMA。 |

#### 2.14.3. 返回值

- `ive_handle`: *int* — 返回的任务句柄 ID。
- `ret`: *int* — 成功。失败；返回 IVE 错误码。

#### 2.14.4. 说明

返回类型：`tuple[int, int]`。

#### 2.14.5. 示例

```python
ive_handle, ret = axcl.ive.erode(src, dst, erode_ctrl, instant)
```

<br>

<a id="axcl.ive.dilate"></a>

### 2.15. axcl.ive.dilate

使用 5x5 模板执行膨胀。仅支持 U8C1 二值图像输入，否则结果不符合预期。

#### 2.15.1. 函数

**Python 调用**

```python
ive_handle, ret = axcl.ive.dilate(src, dst, dilate_ctrl, instant)
```

**C++ 原型**

```cpp
AX_S32 AX_IVE_Dilate(AX_IVE_HANDLE *pIveHandle, AX_IVE_SRC_IMAGE_T *pstSrc, AX_IVE_DST_IMAGE_T *pstDst, AX_IVE_DILATE_CTRL_T *pstDilateCtrl, AX_BOOL bInstant);
```

#### 2.15.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| src | dict &#124; None | 输入二值图像，由 0 或 255 构成。 |
| dst | dict &#124; None | 调用者提供的目标描述符，其地址和布局/容量字段作为输入。引用的数据区域接收输出。 |
| dilate_ctrl | dict &#124; None | 控制参数。 |
| instant | int | 详情参见 AX_IVE_DMA。 |

#### 2.15.3. 返回值

- `ive_handle`: *int* — 返回的任务句柄 ID。
- `ret`: *int* — 成功。失败；返回 IVE 错误码。

#### 2.15.4. 说明

返回类型：`tuple[int, int]`。

#### 2.15.5. 示例

```python
ive_handle, ret = axcl.ive.dilate(src, dst, dilate_ctrl, instant)
```

<br>

<a id="axcl.ive.filter"></a>

### 2.16. axcl.ive.filter

使用 5x5 模板执行滤波。

#### 2.16.1. 函数

**Python 调用**

```python
ive_handle, ret = axcl.ive.filter(src, dst, flt_ctrl, instant)
```

**C++ 原型**

```cpp
AX_S32 AX_IVE_Filter(AX_IVE_HANDLE *pIveHandle, AX_IVE_SRC_IMAGE_T *pstSrc, AX_IVE_DST_IMAGE_T *pstDst, AX_IVE_FILTER_CTRL_T *pstFltCtrl, AX_BOOL bInstant);
```

#### 2.16.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| src | dict &#124; None | 输入源数据。支持 U8C1、YUV420SP 和 YUV422SP 输入格式。 |
| dst | dict &#124; None | 调用者提供的目标描述符，其地址和布局/容量字段作为输入。引用的数据区域接收输出。 |
| flt_ctrl | dict &#124; None | 滤波控制参数。 |
| instant | int | 详情参见 AX_IVE_DMA。 |

#### 2.16.3. 返回值

- `ive_handle`: *int* — 返回的任务句柄 ID。
- `ret`: *int* — 成功。失败；返回 IVE 错误码。

#### 2.16.4. 说明

返回类型：`tuple[int, int]`。

#### 2.16.5. 示例

```python
ive_handle, ret = axcl.ive.filter(src, dst, flt_ctrl, instant)
```

<br>

<a id="axcl.ive.hist"></a>

### 2.17. axcl.ive.hist

计算输入灰度图像的直方图。

#### 2.17.1. 函数

**Python 调用**

```python
ive_handle, ret = axcl.ive.hist(src, dst, instant)
```

**C++ 原型**

```cpp
AX_S32 AX_IVE_Hist(AX_IVE_HANDLE *pIveHandle, AX_IVE_SRC_IMAGE_T *pstSrc, AX_IVE_DST_MEM_INFO_T *pstDst, AX_BOOL bInstant);
```

#### 2.17.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| src | dict &#124; None | 输入源数据。仅支持 U8C1 输入格式。 |
| dst | dict &#124; None | 调用者提供的目标描述符，其地址和布局/容量字段作为输入。引用的数据区域接收输出。 |
| instant | int | 详情参见 AX_IVE_DMA。 |

#### 2.17.3. 返回值

- `ive_handle`: *int* — 返回的任务句柄 ID。
- `ret`: *int* — 成功。失败；返回 IVE 错误码。

#### 2.17.4. 说明

返回类型：`tuple[int, int]`。

#### 2.17.5. 示例

```python
ive_handle, ret = axcl.ive.hist(src, dst, instant)
```

<br>

<a id="axcl.ive.equalize_hist"></a>

### 2.18. axcl.ive.equalize_hist

通过直方图均衡化增强输入图像的对比度。

#### 2.18.1. 函数

**Python 调用**

```python
ive_handle, ret = axcl.ive.equalize_hist(src, dst, equalize_hist_ctrl, instant)
```

**C++ 原型**

```cpp
AX_S32 AX_IVE_EqualizeHist(AX_IVE_HANDLE *pIveHandle, AX_IVE_SRC_IMAGE_T *pstSrc, AX_IVE_DST_MEM_INFO_T *pstDst, AX_IVE_EQUALIZE_HIST_CTRL_T *pstEqualizeHistCtrl, AX_BOOL bInstant);
```

#### 2.18.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| src | dict &#124; None | 输入源。仅支持 U8C1 输入格式。 |
| dst | dict &#124; None | 调用者提供的目标描述符，其地址和布局/容量字段作为输入。引用的数据区域接收输出。 |
| equalize_hist_ctrl | dict &#124; None | EqualizeHist 控制参数。 |
| instant | int | 详情参见 AX_IVE_DMA。 |

#### 2.18.3. 返回值

- `ive_handle`: *int* — 返回的任务句柄 ID。
- `ret`: *int* — 成功。失败；返回 IVE 错误码。

#### 2.18.4. 说明

返回类型：`tuple[int, int]`。

#### 2.18.5. 示例

```python
ive_handle, ret = axcl.ive.equalize_hist(src, dst, equalize_hist_ctrl, instant)
```

<br>

<a id="axcl.ive.integ"></a>

### 2.19. axcl.ive.integ

计算输入灰度图像的积分图像。

#### 2.19.1. 函数

**Python 调用**

```python
ive_handle, ret = axcl.ive.integ(src, dst, integ_ctrl, instant)
```

**C++ 原型**

```cpp
AX_S32 AX_IVE_Integ(AX_IVE_HANDLE *pIveHandle, AX_IVE_SRC_IMAGE_T *pstSrc, AX_IVE_DST_IMAGE_T *pstDst, AX_IVE_INTEG_CTRL_T *pstIntegCtrl, AX_BOOL bInstant);
```

#### 2.19.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| src | dict &#124; None | 输入源数据。仅支持 U8C1 输入格式。 |
| dst | dict &#124; None | 调用者提供的目标描述符，其地址和布局/容量字段作为输入。引用的数据区域接收输出。 |
| integ_ctrl | dict &#124; None | Integ 控制参数。 |
| instant | int | 详情参见 AX_IVE_DMA。 |

#### 2.19.3. 返回值

- `ive_handle`: *int* — 返回的任务句柄 ID。
- `ret`: *int* — 成功。失败；返回 IVE 错误码。

#### 2.19.4. 说明

返回类型：`tuple[int, int]`。

#### 2.19.5. 示例

```python
ive_handle, ret = axcl.ive.integ(src, dst, integ_ctrl, instant)
```

<br>

<a id="axcl.ive.mag_and_ang"></a>

### 2.20. axcl.ive.mag_and_ang

MagAndAng 用于提取边缘信息。

#### 2.20.1. 函数

**Python 调用**

```python
ive_handle, ret = axcl.ive.mag_and_ang(src1, src2, dst_mag, dst_ang, instant)
```

**C++ 原型**

```cpp
AX_S32 AX_IVE_MagAndAng(AX_IVE_HANDLE *pIveHandle, AX_IVE_SRC_IMAGE_T *pstSrc1, AX_IVE_SRC_IMAGE_T *pstSrc2, AX_IVE_DST_IMAGE_T *pstDstMag, AX_IVE_DST_IMAGE_T *pstDstAng, AX_BOOL bInstant);
```

#### 2.20.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| src1 | dict &#124; None | 输入源 source1 数据。仅支持 U16C1 输入格式。 |
| src2 | dict &#124; None | 输入源 source2 数据。仅支持 U16C1 输入格式。 |
| dst_mag | dict &#124; None | 调用者提供的目标描述符，其地址和布局/容量字段作为输入。引用的数据区域接收输出。 |
| dst_ang | dict &#124; None | 调用者提供的目标描述符，其地址和布局/容量字段作为输入。引用的数据区域接收输出。 |
| instant | int | 详情参见 AX_IVE_DMA。 |

#### 2.20.3. 返回值

- `ive_handle`: *int* — 返回的任务句柄 ID。
- `ret`: *int* — 成功。失败；返回 IVE 错误码。

#### 2.20.4. 说明

返回类型：`tuple[int, int]`。

#### 2.20.5. 示例

```python
ive_handle, ret = axcl.ive.mag_and_ang(src1, src2, dst_mag, dst_ang, instant)
```

<br>

<a id="axcl.ive.sobel"></a>

### 2.21. axcl.ive.sobel

SOBEL 用于提取梯度信息。

#### 2.21.1. 函数

**Python 调用**

```python
ive_handle, ret = axcl.ive.sobel(src, dst, sobel_ctrl, instant)
```

**C++ 原型**

```cpp
AX_S32 AX_IVE_Sobel(AX_IVE_HANDLE *pIveHandle, AX_IVE_SRC_IMAGE_T *pstSrc, AX_IVE_DST_IMAGE_T *pstDst, AX_IVE_SOBEL_CTRL_T *pstSobelCtrl, AX_BOOL bInstant);
```

#### 2.21.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| src | dict &#124; None | 输入源数据。仅支持 U8C1 输入图像。 |
| dst | dict &#124; None | 调用者提供的目标描述符，其地址和布局/容量字段作为输入。引用的数据区域接收输出。 |
| sobel_ctrl | dict &#124; None | 控制参数。 |
| instant | int | 详情参见 AX_IVE_DMA。 |

#### 2.21.3. 返回值

- `ive_handle`: *int* — 返回的任务句柄 ID。
- `ret`: *int* — 成功。失败；返回 IVE 错误码。

#### 2.21.4. 说明

返回类型：`tuple[int, int]`。

#### 2.21.5. 示例

```python
ive_handle, ret = axcl.ive.sobel(src, dst, sobel_ctrl, instant)
```

<br>

<a id="axcl.ive.gmm"></a>

### 2.22. axcl.ive.gmm

使用 GMM（高斯混合模型）方法分离前景和背景；支持灰度或 RGB GMM。

#### 2.22.1. 函数

**Python 调用**

```python
ive_handle, ret = axcl.ive.gmm(src, fg, bg, model, gmm_ctrl, instant)
```

**C++ 原型**

```cpp
AX_S32 AX_IVE_GMM(AX_IVE_HANDLE *pIveHandle, AX_IVE_SRC_IMAGE_T *pstSrc, AX_IVE_DST_IMAGE_T *pstFg, AX_IVE_DST_IMAGE_T *pstBg, AX_IVE_MEM_INFO_T *pstModel, AX_IVE_GMM_CTRL_T *pstGmmCtrl, AX_BOOL bInstant);
```

#### 2.22.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| src | dict &#124; None | 输入源。仅支持 U8C1 或 U8C3_PACKAGE 输入。 |
| fg | dict &#124; None | 调用者提供的目标描述符，其地址和布局/容量字段作为输入。引用的数据区域接收输出。 |
| bg | dict &#124; None | 调用者提供的目标描述符，其地址和布局/容量字段作为输入。引用的数据区域接收输出。 |
| model | dict &#124; None | 模型数据。 |
| gmm_ctrl | dict &#124; None | 控制参数。 |
| instant | int | 详情参见 AX_IVE_DMA。 |

#### 2.22.3. 返回值

- `ive_handle`: *int* — 返回的任务句柄 ID。
- `ret`: *int* — 成功。失败；返回 IVE 错误码。

#### 2.22.4. 说明

返回类型：`tuple[int, int]`。

#### 2.22.5. 示例

```python
ive_handle, ret = axcl.ive.gmm(src, fg, bg, model, gmm_ctrl, instant)
```

<br>

<a id="axcl.ive.gmm2"></a>

### 2.23. axcl.ive.gmm2

使用 GMM（高斯混合模型）方法分离前景和背景；支持灰度或 RGB GMM。

#### 2.23.1. 函数

**Python 调用**

```python
ive_handle, ret = axcl.ive.gmm2(src, fg, bg, model, gmm2_ctrl, instant)
```

**C++ 原型**

```cpp
AX_S32 AX_IVE_GMM2(AX_IVE_HANDLE *pIveHandle, AX_IVE_SRC_IMAGE_T *pstSrc, AX_IVE_DST_IMAGE_T *pstFg, AX_IVE_DST_IMAGE_T *pstBg, AX_IVE_MEM_INFO_T *pstModel, AX_IVE_GMM2_CTRL_T *pstGmm2Ctrl, AX_BOOL bInstant);
```

#### 2.23.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| src | dict &#124; None | 仅支持 U8C1 或 U8C3_PACKAGE 输入。 |
| fg | dict &#124; None | 调用者提供的目标描述符，其地址和布局/容量字段作为输入。引用的数据区域接收输出。 |
| bg | dict &#124; None | 调用者提供的目标描述符，其地址和布局/容量字段作为输入。引用的数据区域接收输出。 |
| model | dict &#124; None | 模型数据。 |
| gmm2_ctrl | dict &#124; None | 控制参数。 |
| instant | int | 详情参见 AX_IVE_DMA。 |

#### 2.23.3. 返回值

- `ive_handle`: *int* — 返回的任务句柄 ID。
- `ret`: *int* — 成功。失败；返回 IVE 错误码。

#### 2.23.4. 说明

返回类型：`tuple[int, int]`。

#### 2.23.5. 示例

```python
ive_handle, ret = axcl.ive.gmm2(src, fg, bg, model, gmm2_ctrl, instant)
```

<br>

<a id="axcl.ive.thresh"></a>

### 2.24. axcl.ive.thresh

对输入图像执行阈值处理。

#### 2.24.1. 函数

**Python 调用**

```python
ive_handle, ret = axcl.ive.thresh(src, dst, thr_ctrl, instant)
```

**C++ 原型**

```cpp
AX_S32 AX_IVE_Thresh(AX_IVE_HANDLE *pIveHandle, AX_IVE_SRC_IMAGE_T *pstSrc, AX_IVE_DST_IMAGE_T *pstDst, AX_IVE_THRESH_CTRL_T *pstThrCtrl, AX_BOOL bInstant);
```

#### 2.24.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| src | dict &#124; None | 输入源数据。仅支持 U8C1 输入格式。 |
| dst | dict &#124; None | 调用者提供的目标描述符，其地址和布局/容量字段作为输入。引用的数据区域接收输出。 |
| thr_ctrl | dict &#124; None | 阈值控制参数。 |
| instant | int | 指示是否产生中断的标志。 |

#### 2.24.3. 返回值

- `ive_handle`: *int* — 返回的任务句柄 ID。
- `ret`: *int* — 成功。失败；返回 IVE 错误码。

#### 2.24.4. 说明

返回类型：`tuple[int, int]`。

#### 2.24.5. 示例

```python
ive_handle, ret = axcl.ive.thresh(src, dst, thr_ctrl, instant)
```

<br>

<a id="axcl.ive.func_16_bit_to8_bit"></a>

### 2.25. axcl.ive.func_16_bit_to8_bit

将输入的 16bit 数据缩放为输出的 8bit 数据。

#### 2.25.1. 函数

**Python 调用**

```python
ive_handle, ret = axcl.ive.func_16_bit_to8_bit(src, dst, v_16_bit_to8_bit_ctrl, instant)
```

**C++ 原型**

```cpp
AX_S32 AX_IVE_16BitTo8Bit(AX_IVE_HANDLE *pIveHandle, AX_IVE_SRC_IMAGE_T *pstSrc, AX_IVE_DST_IMAGE_T *pstDst, AX_IVE_16BIT_TO_8BIT_CTRL_T *pst16BitTo8BitCtrl, AX_BOOL bInstant);
```

#### 2.25.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| src | dict &#124; None | 输入源数据。仅支持 U16C1\S16C1 输入。 |
| dst | dict &#124; None | 调用者提供的目标描述符，其地址和布局/容量字段作为输入。引用的数据区域接收输出。 |
| v_16_bit_to8_bit_ctrl | dict &#124; None | 控制参数。 |
| instant | int | 详情参见 AX_IVE_DMA。 |

#### 2.25.3. 返回值

- `ive_handle`: *int* — 返回的任务句柄 ID。
- `ret`: *int* — 成功。失败；返回 IVE 错误码。

#### 2.25.4. 说明

返回类型：`tuple[int, int]`。

#### 2.25.5. 示例

```python
ive_handle, ret = axcl.ive.func_16_bit_to8_bit(src, dst, v_16_bit_to8_bit_ctrl, instant)
```

<br>

<a id="axcl.ive.ncc"></a>

### 2.26. axcl.ive.ncc

计算两幅灰度图像的 NCC（归一化互相关）。

#### 2.26.1. 函数

**Python 调用**

```python
ive_handle, ret = axcl.ive.ncc(src1, src2, dst, instant)
```

**C++ 原型**

```cpp
AX_S32 AX_IVE_NCC(AX_IVE_HANDLE *pIveHandle, AX_IVE_SRC_IMAGE_T *pstSrc1, AX_IVE_SRC_IMAGE_T *pstSrc2, AX_IVE_DST_MEM_INFO_T *pstDst, AX_BOOL bInstant);
```

#### 2.26.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| src1 | dict &#124; None | 输入源 source1。仅支持 S16C1 输入格式。 |
| src2 | dict &#124; None | 输入源 source2。仅支持 S16C1 输入格式，且类型和大小必须与 pstSrc1 相同。 |
| dst | dict &#124; None | 调用者提供的目标描述符，其地址和布局/容量字段作为输入。引用的数据区域接收输出。 |
| instant | int | 详情参见 AX_IVE_DMA。 |

#### 2.26.3. 返回值

- `ive_handle`: *int* — 返回的任务句柄 ID。
- `ret`: *int* — 成功。失败；返回 IVE 错误码。

#### 2.26.4. 说明

返回类型：`tuple[int, int]`。

#### 2.26.5. 示例

```python
ive_handle, ret = axcl.ive.ncc(src1, src2, dst, instant)
```
