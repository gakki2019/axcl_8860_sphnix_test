# Minidump 解析

`analyze_minidump.sh` 是 AXCL 提供的 Minidump 离线分析自动化脚本（位于源码仓库 `axcl/scripts/minidump/analyze_minidump.sh`）。该脚本封装了解包符号归档、自适应匹配架构工具、调用 `minidump_stackwalk` 进行符号化还原以及临时解压目录自动清理的完整流程，能够快速将二进制 `.dmp` 崩溃转储文件解析为可读的调用栈报告。

```{tip}
如需详细了解 Minidump 生成机制、Breakpad 符号原理、手动逐步解析流程或常见故障排查，请参阅常见问题文档：[如何解析 minidump?](../../faq/minidump_analysis.md)。
```

## 1. 准备条件

在分析 Minidump 前，请确保准备好以下文件：

1. **崩溃现场生成的转储文件**：如 `slave_worker_<pid>_<tid>_<timestamp>.dmp` 或 `axcl_<process>_<pid>_<tid>_<timestamp>.dmp`。
2. **同版本构建归档的 Symbols 压缩包**：
   - **Host 侧符号包（必须）**：`axcl-host-minidump-symbols.tar.gz`（提供 `minidump_stackwalk` 工具及 Host 侧符号）。
   - **Device 侧符号包（分析 Device 崩溃时必须）**：`axcl-device-pcie-minidump-symbols.tar.gz` 或 `axcl-device-minidump-symbols.tar.gz`。

```{important}
符号文件必须与产生崩溃的二进制文件来自同一次构建，否则可能无法正确还原函数名与源码行号。
```

## 2. 命令行参数

```bash
analyze_minidump.sh [device|host] [选项]
```

### 参数说明

| 参数项 | 说明 | 是否必填 |
| :--- | :--- | :---: |
| `--dmp <FILE>` | 指定待分析的 `.dmp` 文件路径（无简写选项）。 | **必填** |
| `-H, --host-symbol-tar <FILE>` | 指定 Host 符号压缩包路径（`.tar.gz`），用于提供 `minidump_stackwalk` 工具及 Host 侧符号。 | **必填** |
| `-D, --device-symbol-tar <FILE>` | 指定 Device 符号压缩包路径（`.tar.gz`）。 | **Device 崩溃时必填** |
| `device` \| `host` | 指定崩溃所属侧（作为第一个位置参数，或通过 `-t, --type <TYPE>` 指定）。若未指定，脚本会根据 `--dmp` 文件名前缀自动识别（`slave_worker*` 为 device，`axcl_*` 为 host）。 | 选填 |
| `-o, --output-dir <DIR>` | 指定输出目录。报告文件将存放在该目录中。**默认值为 `analyze_minidump.sh` 脚本所在当前目录**。 | 选填 |
| `-k, --keep-symbols` | 保留解压后的临时符号目录。默认情况下，脚本分析完成后会自动清理删除临时解压文件。 | 选填 |
| `-h, --help` | 显示帮助手册与用法示例。 | 选填 |

## 3. 使用示例

### 3.1 分析设备侧崩溃（如 slave_worker）

分析 Device 侧进程崩溃需要同时提供 `-H` 和 `-D`：

```bash
./analyze_minidump.sh device \
  -H axcl-host-minidump-symbols.tar.gz \
  -D axcl-device-pcie-minidump-symbols.tar.gz \
  --dmp slave_worker_773_804_20261008_043713.dmp
```

### 3.2 分析主控端进程崩溃（如 axcl_sample_runtime）

分析 Host 侧进程崩溃时，只需传入 Host 符号包：

```bash
./analyze_minidump.sh host \
  -H axcl-host-minidump-symbols.tar.gz \
  --dmp axcl_sample_run_2029764_2029764_20260712_102015.dmp
```

### 3.3 自动推导目标类型与指定输出目录

若转储文件名包含标准前缀（如 `slave_worker`），脚本可自动推导为 `device`；通过 `-o` 可将分析报告统一输出至指定目录：

```bash
./analyze_minidump.sh \
  -H /path/to/axcl-host-minidump-symbols.tar.gz \
  -D /path/to/axcl-device-pcie-minidump-symbols.tar.gz \
  --dmp /path/to/slave_worker_773_804.dmp \
  -o /path/to/output_dir
```

## 4. 输出产物与结果说明

执行脚本后，终端会直接输出高亮的核心摘要信息，并在输出目录生成两份报告文件：

1. **专属持久化报告**：`<output_dir>/<dmp_basename>_stackwalk.txt`
   - 以原始转储文件名命名（如 `slave_worker_773_804_20261008_043713_stackwalk.txt`），多次执行绝不覆盖历史记录。
2. **最新结果副本**：`<output_dir>/stackwalk.txt`
   - 始终同步最新一次的分析报告，方便快捷查看。

### 终端输出示例

```text
================================================================================
                    AXCL Minidump Analysis Summary
================================================================================
  Target Type:     device
  Minidump File:   slave_worker_773_804_20261008_043713.dmp
  Crash Reason:    SIGSEGV /SEGV_MAPERR
  Crash Address:   0x0
  Crashed Thread:  Thread 12 (crashed)
--------------------------------------------------------------------------------
  Call Stack (Crashed Thread):
--------------------------------------------------------------------------------
   0  libax_engine.so!engine_force_crash [api_impl_get_io_info.c : 20 + 0x0]
   1  libax_engine.so!AX_ENGINE_GetIOInfo [api_impl_get_io_info.c : 34 + 0x4]
   2  slave_worker!axcl::worker::RuntimeEngineHandler::handle_GetInfo(...) [engine.cpp : 266 + 0x0]
   3  slave_worker!axcl::worker::HandlerBase<...>::handle(...) [invoke.h : 74 + 0xc]
   4  slave_worker!axcl::worker::Stream::handle_biz_api(...) [stream.cpp : 326 + 0x8]
   5  slave_worker!axcl::worker::Stream::consumer_func() [stream.cpp : 415 + 0x14]
   6  slave_worker!axcl::threadx::entry(axcl::event*) [std_function.h : 591 + 0x4]
   7  libstdc++.so.6 + 0xde2f8
================================================================================
Report saved to: /path/to/slave_worker_773_804_20261008_043713_stackwalk.txt
Latest copy:  /path/to/stackwalk.txt
```

看到 `函数名 + 源码文件 + 行号`（如 `libax_engine.so!engine_force_crash [api_impl_get_io_info.c : 20]`），即可直接定位到引发崩溃的代码位置。
