# Minidump Analyzer

`analyze_minidump.sh` is the AXCL offline minidump analysis script, located at `scripts/minidump/analyze_minidump.sh` in the AXCL source tree. In one command, it extracts the symbols archives, selects the `minidump_stackwalk` tool that matches the analysis machine, unwinds the stack with symbols, and removes the temporary extracted files. The result is a readable call stack report for a `.dmp` crash dump.

```{tip}
For detailed background on minidump generation, Breakpad symbols concepts, manual step-by-step analysis, or troubleshooting, see the FAQ guide: [How to analyze minidumps?](../../faq/minidump_analysis.md).
```

## 1. Prerequisites

Before analyzing a minidump, ensure you have prepared the following files:

1. **Crash minidump file**: named `<process>_<pid>_<tid>_<YYYYmmdd_HHMMSS>.dmp`, for example `slave_worker_773_804_20261008_043713.dmp` for a device crash or `axcl_sample_run_2029764_2029764_20260712_102015.dmp` for a host crash.
2. **Matching symbols archives from the same build**:
   - **Host symbols archive (Required)**: `axcl-host-minidump-symbols.tar.gz` (provides the `minidump_stackwalk` tool and host symbols).
   - **Device symbols archive (Required for device crashes)**: `axcl-device-pcie-minidump-symbols.tar.gz` or `axcl-device-minidump-symbols.tar.gz`.
   - `axcl-all-minidump-symbols.tar.gz` contains both host and device symbols and can be passed to both `-H` and `-D`.
3. **Analysis machine**: Linux x86_64 or aarch64 with `bash` and `tar`.

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
| `device` \| `host` | Target side where the crash occurred (as the first positional argument, or via `-t, --type <TYPE>`). If omitted, it is detected from the `--dmp` file name: `slave_worker*` or `slave_daemon*` means device, and `axcl_*` means host. For any other file name, specify it explicitly. | Optional |
| `-o, --output-dir <DIR>` | Directory for the reports and temporary files; it is created if it does not exist. **Defaults to the directory where `analyze_minidump.sh` is located**, which must then be writable. | Optional |
| `-k, --keep-symbols` | Keep the extracted symbols in `<output_dir>/symbols_extracted` after analysis; the directory is overwritten on the next run with `-k`. By default, the extracted symbols are deleted. | Optional |
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

When the dump file name starts with `slave_worker`, `slave_daemon`, or `axcl_`, the target type is detected automatically. Use `-o` to save the results to a dedicated directory:

```bash
./analyze_minidump.sh \
  -H /path/to/axcl-host-minidump-symbols.tar.gz \
  -D /path/to/axcl-device-pcie-minidump-symbols.tar.gz \
  --dmp /path/to/slave_worker_773_804_20261008_043713.dmp \
  -o /path/to/output_dir
```

## 4. Output Files and Results

After the analysis, the script prints a summary with up to 15 frames of the crashed thread and writes two report files to the output directory:

1. **Dedicated persistent report**: `<output_dir>/<dmp_basename>_stackwalk.txt`
   - Named after the minidump file (e.g. `slave_worker_773_804_20261008_043713_stackwalk.txt`), so reports of different dumps do not overwrite each other.
2. **Latest result copy**: `<output_dir>/stackwalk.txt`
   - Overwritten by every analysis with the latest report.

If `minidump_stackwalk` fails, both files still hold its error output, and the script exits with the same non-zero status.

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

A frame in the form `function_name [source_file.cpp : line]` points to the source line to investigate. If frames show only `module + offset`, check that the symbols come from the same build; see [How to analyze minidumps?](../../faq/minidump_analysis.md).
