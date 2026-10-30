# Overview

pyAXCL is the Python binding for AXCL. It provides access to AXCL runtime, system management, memory pools, model inference, video encoding and decoding, image processing, and DMA from Python.
The package name is `pyAXCL`, and the Python import name is `axcl`.

## 1. Runtime Requirements

- A Linux host with an x86_64 or AArch64 architecture.
- 64-bit CPython >= 3.10.
- Install the shared libraries and drivers provided by the AXCL SDK before calling AXCL APIs. Connect an available AX8860 device to use device functions.

The AXCL shared libraries required by pyAXCL are provided by the host DEB/RPM packages and installed in
`/usr/local/axhelix/lib`. They are not included in the Python Wheel. For installation instructions, see
[Linux Installation](../../basic/install/linux.md).

## 2. Building the Python Wheel

The pyAXCL Wheel output directory is `axcl/out/python/`.

Build on Linux:

```bash
cd axcl/python/build
make Wheel venv=always
```

## 3. Installation

Obtain the Wheel package from the SDK's `axcl/out/python/` directory, and replace the paths and filenames in the following commands with the actual values.
We recommend installing it in a venv virtual environment to isolate Python package dependencies.
The Wheel has no third-party dependencies, so a local Wheel file can be installed offline.

### 3.1. Creating and Activating a Virtual Environment

```bash
python3 --version
python3 -m venv ~/pyaxcl-venv
source ~/pyaxcl-venv/bin/activate
```

In each new terminal, run `source ~/pyaxcl-venv/bin/activate` before use. You do not need to create the environment again.

### 3.2. Installing the Wheel

```bash
pip install pyaxcl-X.YY.Z-py3-none-any.whl
```

### 3.3. Verifying the Installation

Run the following commands in the activated virtual environment:

```bash
pip show pyAXCL
python -c "import axcl; print(axcl.__file__)"
```

Confirm that both the `Location` shown by `pip show` and `axcl.__file__` point to the virtual environment directory, and that the import succeeds without errors.

### 3.4. Uninstalling and Deactivating the Virtual Environment

To uninstall, run the following command in the activated virtual environment:

```bash
pip uninstall pyAXCL -y
```

When finished, you can deactivate the virtual environment:

```bash
deactivate
```

## 4. Modules

pyAXCL provides Runtime and Native interfaces. The main modules and their purposes are listed below.

| Module or Entry Point | Description |
| --- | --- |
| `axcl` | AXCL initialization, deinitialization, application logging, and common types and constants. |
| `axcl.rt` | Runtime interfaces, including device selection, thread contexts, Host/Device memory allocation and copying, C2C DMA, userworker, and NPU model loading and inference. |
| `axcl.sys` | SYS interfaces, including memory allocation and release and module link/unlink operations. |
| `axcl.pool` | POOL interfaces, including configuration, creation, block allocation, and block release for common and private pools. |
| `axcl.engine` | Native ENGINE model inference interfaces, including model loading, input/output information queries, and inference execution. |
| `axcl.vdec` | H.264/H.265 video decoding and JPEG decoding interfaces. |
| `axcl.venc` | Interfaces for encoding NV12 images into H.264/H.265 or JPEG. |
| `axcl.ivps` | IVPS image processing interfaces, including color conversion, cropping and resizing, rotation, and OSD. |
| `axcl.dmadim` | DMADIM interfaces, including memory copying, memset, checksum, and 2D copying. |
| `axcl.ive` | IVE image processing interfaces; the sample demonstrates IVE DMA copying. |
| `axcl.sample` | Sample programs installed with the Wheel, covering runtime, memory, model inference, and media processing. |
| `axcl.utils` | Internal `ctypes` conversion and structure helpers used by the Python bindings. |

## 5. Test Cases

Run the following commands in a terminal on a host with pyAXCL installed. Install the AXCL SDK and connect an available device first.
Activate the virtual environment containing pyAXCL before running the commands. In the examples, `-d 0` selects device 0.

### 5.1. Runtime

Test Runtime initialization, device selection, and creation and destruction of worker-thread contexts. No input file is required.

```bash
axcl-sample-runtime --help
axcl-sample-runtime -d 0
```

Alternatively, run the same test as a Python module. It is equivalent to the command above; use either form:

```bash
python -m axcl.sample.runtime.axcl_sample_runtime -d 0
```

**Expected result:** Initialization, device selection, and thread context operations succeed, and the output includes `[OK] all tests passed`.

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

### 5.2. IVE Image Copy Test

Use the 640×480 Y400 grayscale image supplied with the SDK to test transferring an image to the device, performing an IVE DMA copy,
saving the result on the host, and comparing it with the original file.

**Required resource:** The input file is located at
`/usr/local/axhelix/data/image/640x480.y400`.

```bash
axcl-sample-ive --help
axcl-sample-ive -d 0 -i /usr/local/axhelix/data/image/640x480.y400 -w 640 -h 480 -t 0 -o /tmp/pyaxcl-ive/
```

You can also run the same test as a Python module, with the same arguments and output:

```bash
python -m axcl.sample.native.ive.axcl_sample_ive -d 0 -i /usr/local/axhelix/data/image/640x480.y400 -w 640 -h 480 -t 0 -o /tmp/pyaxcl-ive/
```

| Argument | Value in This Test | Description |
| --- | --- | --- |
| `-d` | 0 | Device ID. |
| `-i` | `640x480.y400` | Input image path. |
| `-w`, `-h` | 640, 480 | Image width and height. |
| `-t` | 0 | Y400 grayscale format. |
| `-o` | `/tmp/pyaxcl-ive/` | Output directory. |

**Expected result:** The following file is generated:
`/tmp/pyaxcl-ive/ive_dma_copy_640x480_stride_640.y400`.

```bash
(pyaxcl-venv) root@ax8860:~# python -m axcl.sample.native.ive.axcl_sample_ive -d 0 -i /usr/local/axhelix/data/image/640x480.y400 -w 640 -h 480 -t 0 -o /tmp/pyaxcl-ive/
============== AXCL ive sample started ==============
device id: 0
/tmp/pyaxcl-ive/ive_dma_copy_640x480_stride_640.y400 is saved
============== AXCL ive sample exited ==============
```

Compare the input and output with the following commands:

```bash
cmp 640x480.y400 /tmp/pyaxcl-ive/ive_dma_copy_640x480_stride_640.y400
echo $?
```

If `cmp` produces no output and exits with code `0`, the data is identical before and after the copy.
