# Minidump Analyzer

`analyze_minidump.sh` is an automated offline minidump analysis script provided by AXCL (located in the source repository at `axcl/scripts/minidump/analyze_minidump.sh`). It encapsulates the full workflow of extracting symbols archives, matching host architecture tools, invoking `minidump_stackwalk` for symbolic stack unwinding, and automatically cleaning up temporary extracted files. It rapidly parses a binary `.dmp` crash dump into a human-readable call stack report.

```{tip}
For detailed background on minidump generation, Breakpad symbols concepts, manual step-by-step analysis, or troubleshooting, see the FAQ guide: [How to analyze minidumps?](../../faq/minidump_analysis.md).
```

## 1. Prerequisites

Before analyzing a minidump, ensure you have prepared the following files:

1. **Crash minidump file**: e.g. `slave_worker_<pid>_<tid>_<timestamp>.dmp` or `axcl_<process>_<pid>_<tid>_<timestamp>.dmp`.
2. **Matching symbols archives from the same build**:
   - **Host symbols archive (Required)**: `axcl-host-minidump-symbols.tar.gz` (provides the `minidump_stackwalk` tool and host symbols).
   - **Device symbols archive (Required for device crashes)**: `axcl-device-pcie-minidump-symbols.tar.gz` or `axcl-device-minidump-symbols.tar.gz`.

```{important}
Symbols must come from the exact same build as the crashed binaries; otherwise, function names and source line numbers may not be resolved accurately.
```

## 2. Command-Line Options

```bash
analyze_minidump.sh [device|host] [options]
```

### Options Reference

| Option | Description | Required |
| :--- | :--- | :---: |
| `--dmp <FILE>` | Path to the `.dmp` crash dump file. (No short option) | **Yes** |
| `-H, --host-symbol-tar <FILE>` | Path to the host symbols archive (`.tar.gz`). Provides `minidump_stackwalk` and host symbols. | **Yes** |
| `-D, --device-symbol-tar <FILE>` | Path to the device symbols archive (`.tar.gz`). | **Required for device crash** |
| `device` \| `host` | Target side where the crash occurred (as the first positional argument, or via `-t, --type <TYPE>`). If omitted, auto-detected from the `--dmp` filename prefix (`slave_worker*` for device, `axcl_*` for host). | Optional |
| `-o, --output-dir <DIR>` | Directory where the output reports and temporary files reside. **Defaults to the directory where `analyze_minidump.sh` is located**. | Optional |
| `-k, --keep-symbols` | Keep the extracted temporary symbols directory after analysis. By default, temporary extracted symbols are automatically deleted. | Optional |
| `-h, --help` | Show the help message and usage examples. | Optional |

## 3. Usage Examples

### 3.1 Analyzing a Device-Side Crash (e.g. slave_worker)

Analyzing a device-side crash requires providing both `-H` and `-D`:

```bash
./analyze_minidump.sh device \
  -H axcl-host-minidump-symbols.tar.gz \
  -D axcl-device-pcie-minidump-symbols.tar.gz \
  --dmp slave_worker_773_804_20261008_043713.dmp
```

### 3.2 Analyzing a Host-Side Crash (e.g. axcl_sample_runtime)

Analyzing a host-side crash only requires the host symbols package:

```bash
./analyze_minidump.sh host \
  -H axcl-host-minidump-symbols.tar.gz \
  --dmp axcl_sample_run_2029764_2029764_20260712_102015.dmp
```

### 3.3 Auto-Detecting Target and Custom Output Directory

When the dump filename starts with standard prefixes such as `slave_worker`, the target type is automatically recognized. Use `-o` to save results to a dedicated directory:

```bash
./analyze_minidump.sh \
  -H /path/to/axcl-host-minidump-symbols.tar.gz \
  -D /path/to/axcl-device-pcie-minidump-symbols.tar.gz \
  --dmp /path/to/slave_worker_773_804.dmp \
  -o /path/to/output_dir
```

## 4. Output Files and Results

Upon execution, the script displays a highlighted summary in the console and creates two report files in the output directory:

1. **Dedicated persistent report**: `<output_dir>/<dmp_basename>_stackwalk.txt`
   - Named after the original minidump file (e.g. `slave_worker_773_804_20261008_043713_stackwalk.txt`), ensuring past analyses are never overwritten.
2. **Latest result copy**: `<output_dir>/stackwalk.txt`
   - Always updated with the most recent analysis report for quick inspection.

### Console Output Example

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

When you see `function_name [source_file.cpp : line]`, you can navigate directly to the responsible source code line to investigate the crash.
