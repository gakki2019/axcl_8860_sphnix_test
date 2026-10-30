# Minidump 解析

`analyze_minidump.sh` 是 AXCL 提供的 Minidump 离线分析脚本，位于 AXCL 源码树的 `scripts/minidump/analyze_minidump.sh`。该脚本通过一条命令完成解包符号归档、选择与分析机匹配的 `minidump_stackwalk` 工具、结合符号还原调用栈以及删除临时解压文件，最终将 `.dmp` 崩溃转储文件解析为可读的调用栈报告。

```{tip}
如需详细了解 Minidump 生成机制、Breakpad 符号原理、手动逐步解析流程或常见故障排查，请参阅常见问题文档：[如何解析 minidump?](../../faq/minidump_analysis.md)。
```

## 1. 准备条件

在分析 Minidump 前，请确保准备好以下文件：

1. **崩溃现场生成的转储文件**：命名格式为 `<process>_<pid>_<tid>_<YYYYmmdd_HHMMSS>.dmp`，例如 Device 崩溃时的 `slave_worker_773_804_20261008_043713.dmp`，或 Host 崩溃时的 `axcl_sample_run_2029764_2029764_20260712_102015.dmp`。
2. **同版本构建归档的 Symbols 压缩包**：
   - **Host 侧符号包（必须）**：`axcl-host-minidump-symbols.tar.gz`（提供 `minidump_stackwalk` 工具及 Host 侧符号）。
   - **Device 侧符号包（分析 Device 崩溃时必须）**：`axcl-device-pcie-minidump-symbols.tar.gz` 或 `axcl-device-minidump-symbols.tar.gz`。
   - `axcl-all-minidump-symbols.tar.gz` 同时包含 Host 和 Device 侧符号，可同时传给 `-H` 和 `-D`。
3. **分析机**：安装有 `bash` 和 `tar` 的 Linux x86_64 或 aarch64 机器。

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
| `device` \| `host` | 指定崩溃所属侧（作为第一个位置参数，或通过 `-t, --type <TYPE>` 指定）。若未指定，脚本会根据 `--dmp` 文件名自动识别：`slave_worker*` 或 `slave_daemon*` 为 device，`axcl_*` 为 host。其他文件名需显式指定。 | 选填 |
| `-o, --output-dir <DIR>` | 指定输出目录，用于存放报告和临时文件，不存在时自动创建。**默认值为 `analyze_minidump.sh` 脚本所在目录**，此时该目录必须可写。 | 选填 |
| `-k, --keep-symbols` | 分析完成后将解压出的符号保留在 `<output_dir>/symbols_extracted`；下次使用 `-k` 运行时会覆盖该目录。默认情况下，脚本分析完成后会自动删除解压出的符号。 | 选填 |
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

若转储文件名以 `slave_worker`、`slave_daemon` 或 `axcl_` 开头，脚本可自动推导目标类型；通过 `-o` 可将分析结果统一输出至指定目录：

```bash
./analyze_minidump.sh \
  -H /path/to/axcl-host-minidump-symbols.tar.gz \
  -D /path/to/axcl-device-pcie-minidump-symbols.tar.gz \
  --dmp /path/to/slave_worker_773_804_20261008_043713.dmp \
  -o /path/to/output_dir
```

## 4. 输出产物与结果说明

分析完成后，终端会输出摘要信息（包含崩溃线程最多 15 帧调用栈），并在输出目录生成两份报告文件：

1. **专属持久化报告**：`<output_dir>/<dmp_basename>_stackwalk.txt`
   - 以转储文件名命名（如 `slave_worker_773_804_20261008_043713_stackwalk.txt`），不同转储文件的报告互不覆盖。
2. **最新结果副本**：`<output_dir>/stackwalk.txt`
   - 每次分析都会用最新报告覆盖该文件。

如果 `minidump_stackwalk` 执行失败，两份文件中仍会保存其错误输出，脚本以相同的非零状态码退出。

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

看到 `函数名 + 源码文件 + 行号`（如 `libax_engine.so!engine_force_crash [api_impl_get_io_info.c : 20]`）形式的帧，即可定位到需要排查的源码行。如果帧中只有 `module + offset`，请确认符号文件来自同一次构建，详见 [如何解析 minidump?](../../faq/minidump_analysis.md)。
