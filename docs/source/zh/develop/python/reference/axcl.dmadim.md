# axcl.dmadim

## 1. 目录

- [axcl.dmadim.mem_copy](#axcl.dmadim.mem_copy): 执行一维（1D）DMA 内存拷贝。本接口将 u64Size 字节数据从源物理地址拷贝到目标物理地址。使用普通 DMA 模式，不启用一致性配置。
- [axcl.dmadim.mem_set](#axcl.dmadim.mem_set): 通过 DMA 初始化内存区域。本接口从目标物理地址开始，将 u64Size 字节填充为 u8InitVal。提交给硬件前，库会将 u8InitVal 扩展为重复的 64 位字节模式。
- [axcl.dmadim.mem_copy_xd](#axcl.dmadim.mem_copy_xd): 执行二维（2D）、三维（3D）或四维（4D）DMA 内存拷贝。应用通过 tDimDesc 描述源和目标物理地址、有效数据宽度，以及各维度的跨度和块数。
- [axcl.dmadim.check_sum](#axcl.dmadim.check_sum): 计算内存区域的 DMA 校验和。本接口从源物理地址开始，对 u64Size 字节计算 32 位累加校验和，并通过 pu32Result 返回结果。
- [axcl.dmadim.mem_copy_coherent](#axcl.dmadim.mem_copy_coherent): 执行一致性模式的一维（1D）DMA 内存拷贝。与 AX_DMA_MemCopy 相比，本接口启用 DMA snoop 和 split，适用于通过 CPU 缓存访问的内存区域。
- [axcl.dmadim.mem_set_coherent](#axcl.dmadim.mem_set_coherent): 通过一致性 DMA 模式初始化内存区域。填充值和长度约束与 AX_DMA_MemSet 相同，但本接口启用 DMA snoop 和 split。
- [axcl.dmadim.mem_copy_xd_coherent](#axcl.dmadim.mem_copy_xd_coherent): 执行一致性模式的二维（2D）、三维（3D）或四维（4D）DMA 内存拷贝。描述符和参数约束与 AX_DMA_MemCopyXD 相同，但本接口启用 DMA snoop 和 split。
- [axcl.dmadim.check_sum_coherent](#axcl.dmadim.check_sum_coherent): 在一致性模式下计算内存区域的 DMA 校验和。参数检查与 AX_DMA_CheckSum 相同，本接口启用 DMA snoop 和 split。

<br>

## 2. API

<a id="axcl.dmadim.mem_copy"></a>

### 2.1. axcl.dmadim.mem_copy

执行一维（1D）DMA 内存拷贝。本接口将 u64Size 字节数据从源物理地址拷贝到目标物理地址。使用普通 DMA 模式，不启用一致性配置。

#### 2.1.1. 函数

**Python 调用**

```python
ret = axcl.dmadim.mem_copy(phy_dst, phy_src, size)
```

**C++ 原型**

```cpp
AX_S32 AX_DMA_MemCopy(AX_U64 u64PhyDst, AX_U64 u64PhySrc, AX_U64 u64Size);
```

#### 2.1.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| phy_dst | int | 目标物理地址。 |
| phy_src | int | 源物理地址。 |
| size | int | 拷贝长度，单位为字节。 |

#### 2.1.3. 返回值

- `ret`: *int* — 成功。DMA 传输已完成。失败。参见 DMA 错误码。

#### 2.1.4. 说明

返回类型：`int`。

#### 2.1.5. 示例

```python
ret = axcl.dmadim.mem_copy(phy_dst, phy_src, size)
```

<br>

<a id="axcl.dmadim.mem_set"></a>

### 2.2. axcl.dmadim.mem_set

通过 DMA 初始化内存区域。本接口从目标物理地址开始，将 u64Size 字节填充为 u8InitVal。提交给硬件前，库会将 u8InitVal 扩展为重复的 64 位字节模式。

#### 2.2.1. 函数

**Python 调用**

```python
ret = axcl.dmadim.mem_set(phy_dst, init_val, size)
```

**C++ 原型**

```cpp
AX_S32 AX_DMA_MemSet(AX_U64 u64PhyDst, AX_U8 u8InitVal, AX_U64 u64Size);
```

#### 2.2.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| phy_dst | int | 目标物理地址。 |
| init_val | int | 填充值，范围为 0x00 至 0xFF。 |
| size | int | 初始化长度，单位为字节。必须按 8 字节对齐。 |

#### 2.2.3. 返回值

- `ret`: *int* — 成功。初始化已完成。失败。参见 DMA 错误码。

#### 2.2.4. 说明

返回类型：`int`。

#### 2.2.5. 示例

```python
ret = axcl.dmadim.mem_set(phy_dst, init_val, size)
```

<br>

<a id="axcl.dmadim.mem_copy_xd"></a>

### 2.3. axcl.dmadim.mem_copy_xd

执行二维（2D）、三维（3D）或四维（4D）DMA 内存拷贝。应用通过 tDimDesc 描述源和目标物理地址、有效数据宽度，以及各维度的跨度和块数。

#### 2.3.1. 函数

**Python 调用**

```python
ret = axcl.dmadim.mem_copy_xd(t_dim_desc, mode)
```

**C++ 原型**

```cpp
AX_S32 AX_DMA_MemCopyXD(AX_DMADIM_DESC_XD_T tDimDesc, AX_DMADIM_XFER_MODE_E eMode);
```

#### 2.3.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| t_dim_desc | dict | 多维传输描述符。参见 AX_DMADIM_DESC_XD_T。 |
| mode | int | 工作模式。必须为 AX_DMADIM_2D、AX_DMADIM_3D 或 AX_DMADIM_4D。 |

#### 2.3.3. 返回值

- `ret`: *int* — 成功。多维 DMA 传输已完成。失败。参见 DMA 错误码。

#### 2.3.4. 说明

返回类型：`int`。

#### 2.3.5. 示例

```python
ret = axcl.dmadim.mem_copy_xd(t_dim_desc, mode)
```

<br>

<a id="axcl.dmadim.check_sum"></a>

### 2.4. axcl.dmadim.check_sum

计算内存区域的 DMA 校验和。本接口从源物理地址开始，对 u64Size 字节计算 32 位累加校验和，并通过 pu32Result 返回结果。

#### 2.4.1. 函数

**Python 调用**

```python
result, ret = axcl.dmadim.check_sum(phy_src, size)
```

**C++ 原型**

```cpp
AX_S32 AX_DMA_CheckSum(AX_U32 *pu32Result, AX_U64 u64PhySrc, AX_U64 u64Size);
```

#### 2.4.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| phy_src | int | 源物理地址。必须按 4 字节对齐。 |
| size | int | 长度，单位为字节。必须按 8 字节对齐。 |

#### 2.4.3. 返回值

- `result`: *int* — 指向校验和结果的指针。不得为 NULL。
- `ret`: *int* — 成功。*pu32Result 保存校验和结果。失败。pu32Result 中的值无效。

#### 2.4.4. 说明

返回类型：`tuple[int, int]`。

#### 2.4.5. 示例

```python
result, ret = axcl.dmadim.check_sum(phy_src, size)
```

<br>

<a id="axcl.dmadim.mem_copy_coherent"></a>

### 2.5. axcl.dmadim.mem_copy_coherent

执行一致性模式的一维（1D）DMA 内存拷贝。与 AX_DMA_MemCopy 相比，本接口启用 DMA snoop 和 split，适用于通过 CPU 缓存访问的内存区域。

#### 2.5.1. 函数

**Python 调用**

```python
ret = axcl.dmadim.mem_copy_coherent(phy_dst, phy_src, size)
```

**C++ 原型**

```cpp
AX_S32 AX_DMA_MemCopyCoherent(AX_U64 u64PhyDst, AX_U64 u64PhySrc, AX_U64 u64Size);
```

#### 2.5.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| phy_dst | int | 目标物理地址。 |
| phy_src | int | 源物理地址。 |
| size | int | 拷贝长度，单位为字节。 |

#### 2.5.3. 返回值

- `ret`: *int* — 成功。DMA 传输已完成。失败。参见 DMA 错误码。

#### 2.5.4. 说明

返回类型：`int`。

#### 2.5.5. 示例

```python
ret = axcl.dmadim.mem_copy_coherent(phy_dst, phy_src, size)
```

<br>

<a id="axcl.dmadim.mem_set_coherent"></a>

### 2.6. axcl.dmadim.mem_set_coherent

通过一致性 DMA 模式初始化内存区域。填充值和长度约束与 AX_DMA_MemSet 相同，但本接口启用 DMA snoop 和 split。

#### 2.6.1. 函数

**Python 调用**

```python
ret = axcl.dmadim.mem_set_coherent(phy_dst, init_val, size)
```

**C++ 原型**

```cpp
AX_S32 AX_DMA_MemSetCoherent(AX_U64 u64PhyDst, AX_U8 u8InitVal, AX_U64 u64Size);
```

#### 2.6.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| phy_dst | int | 目标物理地址。 |
| init_val | int | 填充值，范围为 0x00 至 0xFF。 |
| size | int | 初始化长度，单位为字节。必须按 8 字节对齐。 |

#### 2.6.3. 返回值

- `ret`: *int* — 成功。初始化已完成。失败。参见 DMA 错误码。

#### 2.6.4. 说明

返回类型：`int`。

#### 2.6.5. 示例

```python
ret = axcl.dmadim.mem_set_coherent(phy_dst, init_val, size)
```

<br>

<a id="axcl.dmadim.mem_copy_xd_coherent"></a>

### 2.7. axcl.dmadim.mem_copy_xd_coherent

执行一致性模式的二维（2D）、三维（3D）或四维（4D）DMA 内存拷贝。描述符和参数约束与 AX_DMA_MemCopyXD 相同，但本接口启用 DMA snoop 和 split。

#### 2.7.1. 函数

**Python 调用**

```python
ret = axcl.dmadim.mem_copy_xd_coherent(t_dim_desc, mode)
```

**C++ 原型**

```cpp
AX_S32 AX_DMA_MemCopyXDCoherent(AX_DMADIM_DESC_XD_T tDimDesc, AX_DMADIM_XFER_MODE_E eMode);
```

#### 2.7.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| t_dim_desc | dict | 多维传输描述符。参见 AX_DMADIM_DESC_XD_T。 |
| mode | int | 工作模式。必须为 AX_DMADIM_2D、AX_DMADIM_3D 或 AX_DMADIM_4D。 |

#### 2.7.3. 返回值

- `ret`: *int* — 成功。多维 DMA 传输已完成。失败。参见 DMA 错误码。

#### 2.7.4. 说明

返回类型：`int`。

#### 2.7.5. 示例

```python
ret = axcl.dmadim.mem_copy_xd_coherent(t_dim_desc, mode)
```

<br>

<a id="axcl.dmadim.check_sum_coherent"></a>

### 2.8. axcl.dmadim.check_sum_coherent

在一致性模式下计算内存区域的 DMA 校验和。参数检查与 AX_DMA_CheckSum 相同，本接口启用 DMA snoop 和 split。

#### 2.8.1. 函数

**Python 调用**

```python
result, ret = axcl.dmadim.check_sum_coherent(phy_src, size)
```

**C++ 原型**

```cpp
AX_S32 AX_DMA_CheckSumCoherent(AX_U32 *pu32Result, AX_U64 u64PhySrc, AX_U64 u64Size);
```

#### 2.8.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| phy_src | int | 源物理地址。必须按 4 字节对齐。 |
| size | int | 长度，单位为字节。必须按 8 字节对齐。 |

#### 2.8.3. 返回值

- `result`: *int* — 指向校验和结果的指针。不得为 NULL。
- `ret`: *int* — 成功。*pu32Result 保存校验和结果。失败。pu32Result 中的值无效。

#### 2.8.4. 说明

返回类型：`tuple[int, int]`。

#### 2.8.5. 示例

```python
result, ret = axcl.dmadim.check_sum_coherent(phy_src, size)
```
