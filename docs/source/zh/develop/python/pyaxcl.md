# 概述

pyAXCL 是 AXCL 的 Python 接口封装，用于在 Python 环境中调用AXCL runtime、系统管理、内存池、模型推理、视频编解码、图像处理及 DMA 等能力。
安装包名为 `pyAXCL`，Python 导入名为 `axcl`。

## 1. 运行要求

- Linux 主机，支持的主机架构为 x86_64 或 AArch64。
- 64 位 CPython >= 3.10。
- 调用 AXCL API 前，需安装 AXCL SDK 提供的动态库及驱动；使用设备功能时，需连接可用的 AX8860 设备。

pyAXCL 所需的 AXCL 动态库由主控端 DEB/RPM 安装包提供，安装后位于
`/usr/local/axhelix/lib`，不包含在 Python Wheel 中。安装步骤见
[Linux 安装文档](../../basic/install/linux.md)。

## 2. Python wheel 编译

pyAXCL Wheel 输出路径为 `axcl/out/python/`。

使用Linux编译

```bash
cd axcl/python/build
make Wheel venv=always
```

## 3. 安装

从 SDK 的 `axcl/out/python/` 目录获取 Wheel 包，将以下命令中的路径和文件名替换为实际值。
推荐使用 venv 虚拟环境安装，以隔离 Python 包依赖。
Wheel 本身无第三方依赖，可在离线环境中安装本地 Wheel 文件。

### 3.1. 创建并激活虚拟环境

```bash
python3 --version
python3 -m venv ~/pyaxcl-venv
source ~/pyaxcl-venv/bin/activate
```

每次打开新的终端，使用前需先执行 `source ~/pyaxcl-venv/bin/activate`，无需重复创建。

### 3.2. 安装 Wheel

```bash
pip install pyaxcl-X.YY.Z-py3-none-any.whl
```

### 3.3. 验证安装

在已激活的虚拟环境中执行：

```bash
pip show pyAXCL
python -c "import axcl; print(axcl.__file__)"
```

确认 `pip show` 的 `Location` 和 `axcl.__file__` 均位于该虚拟环境目录下，且导入时无报错。

### 3.4. 卸载与退出虚拟环境

需要卸载时，在已激活的虚拟环境中执行：

```bash
pip uninstall pyAXCL -y
```

使用结束后，可退出虚拟环境：

```bash
deactivate
```

## 4. 模块说明

pyAXCL 提供 Runtime 接口和 Native 接口，主要模块与用途如下。

| 模块或入口 | 说明 |
| --- | --- |
| `axcl` | AXCL 初始化、去初始化、应用日志接口，以及公共类型和常量。 |
| `axcl.rt` | Runtime 接口，包括设备选择、线程 context、Host/Device 内存申请与拷贝、C2C DMA、userworker，以及 NPU 模型加载与推理。 |
| `axcl.sys` | SYS 系统接口，包括内存申请与释放、模块 link/unlink。 |
| `axcl.sys.ax_pool` | POOL 内存池接口，包括公共池和私有池的配置、创建、内存块申请与释放。 |
| `axcl.engine` | Native ENGINE 模型推理接口，包括模型加载、输入输出信息查询及推理执行。 |
| `axcl.vdec` | H.264/H.265 视频解码和 JPEG 解码接口。 |
| `axcl.venc` | 将 NV12 图像编码为 H.264/H.265 或 JPEG 的接口。 |
| `axcl.ivps` | IVPS 图像处理接口，包括色彩转换、裁剪缩放、旋转和 OSD。 |
| `axcl.dmadim` | DMADIM 接口，包括内存拷贝、memset、checksum 和 2D 拷贝。 |
| `axcl.ive` | IVE 图像处理接口，示例演示 IVE DMA 拷贝。 |
| `axcl.sample` | 随 Wheel 安装的示例程序，覆盖 runtime、内存、模型推理及媒体处理等场景。 |
| `axcl.utils` | Python 绑定内部使用的 `ctypes` 类型转换和结构体辅助模块。 |

## 5. 测试用例

以下命令在已安装 pyAXCL 的主控端终端中执行，需先安装 AXCL SDK 并连接可用设备。
执行前先激活安装 pyAXCL 的虚拟环境。示例中的 `-d 0` 表示选择设备 0。

### 5.1. Runtime 基础测试

测试 Runtime 初始化、设备选择，以及工作线程 context 的创建和销毁，无需准备输入文件。

```bash
axcl-sample-runtime --help
axcl-sample-runtime -d 0
```

也可通过 Python 模块方式运行同一用例，与上述命令等价，任选其一即可：

```bash
python -m axcl.sample.runtime.axcl_sample_runtime -d 0
```

**预期结果：** 初始化、设备选择及线程 context 操作成功，输出 `[OK] all tests passed`，

```bash
(pyaxcl-venv) root@ax8860:~# axcl-sample-runtime -d 0
============== AXCL runtime sample started ==============
device id: 0
  [OK] axclInit()
  [OK] axclrtGetDeviceCount(): 1 device(s)
  [OK] axclrtSetDevice(0)
  [OK] axclrtCreateContext() on device 0
device 0 firmware version: Ax_Version V0.2.0_20261009165849

  [OK] all tests passed
============== AXCL runtime sample exited ==============
```


### 5.2. IVE 图像拷贝测试

使用 SDK 自带的 640×480 Y400 灰度图像，测试将图像传入设备、执行 IVE DMA 拷贝，
再将结果保存到主控端，并与原始文件比较。

**准备资源：** 输入文件位于
`/usr/local/axhelix/data/image/640x480.y400`。

```bash
axcl-sample-ive --help
axcl-sample-ive -d 0 -i /usr/local/axhelix/data/image/640x480.y400 -w 640 -h 480 -t 0 -o /tmp/pyaxcl-ive/
```

也可通过 Python 模块方式运行同一用例，参数和输出相同：

```bash
python -m axcl.sample.native.ive.axcl_sample_ive -d 0 -i /usr/local/axhelix/data/image/640x480.y400 -w 640 -h 480 -t 0 -o /tmp/pyaxcl-ive/
```

| 参数 | 本用例取值 | 说明 |
| --- | --- | --- |
| `-d` | 0 | 设备编号。 |
| `-i` | `640x480.y400` | 输入图像路径。 |
| `-w`、`-h` | 640、480 | 图像宽度和高度。 |
| `-t` | 0 | Y400 灰度格式。 |
| `-o` | `/tmp/pyaxcl-ive/` | 输出目录。 |

**预期结果：** 生成
`/tmp/pyaxcl-ive/ive_dma_copy_640x480_stride_640.y400`。
```bash
(pyaxcl-venv) root@ax8860:~# python -m axcl.sample.native.ive.axcl_sample_ive -d 0 -i /usr/local/axhelix/data/image/640x480.y400 -w 640 -h 480 -t 0 -o /tmp/pyaxcl-ive/
============== AXCL ive sample started ==============
device id: 0
/tmp/pyaxcl-ive/ive_dma_copy_640x480_stride_640.y400 is saved
============== AXCL ive sample exited ==============
```

执行以下命令比较输入和输出：

```bash
cmp 640x480.y400 /tmp/pyaxcl-ive/ive_dma_copy_640x480_stride_640.y400
echo $?
```

`cmp` 无输出且退出码为 `0`，表示拷贝前后的数据完全一致。
