# How to analyze minidumps?

This document describes how to use a minidump generated at an AXCL userspace process crash site to analyze the crash.

## 1. Background

AXCL uses [Google Breakpad](https://github.com/google/breakpad) to generate minidumps when userspace processes crash. The minidump preserves the crash-site state and supports later offline analysis.

Breakpad is a crash reporting component for process crash capture and offline analysis. When a process hits a fatal exception such as `SIGSEGV`, Breakpad writes a minidump at the crash site. A minidump is a lightweight crash dump that usually records the exception type, crash address, thread context, registers, stack addresses, loaded modules, and other key information. Its file extension is usually `.dmp`.

A minidump is different from a Linux core dump. A core dump usually contains a more complete process memory image and is larger; a minidump only stores the key crash-site information needed for analysis, so it is smaller and easier to collect and archive in real runtime environments.

A minidump does not contain full debug information. AXCL release/install outputs are usually stripped, so addresses in the crash stack depend on Breakpad symbols to resolve function names, source files, and line numbers. `minidump_stackwalk` reads the `.dmp`, looks up `<module>/<breakpad-id>/<module>.sym` under the symbol paths, and generates a readable stack trace.

AXCL uses a master-slave architecture: host-side processes run on the host, while device-side `slave_worker` / `slave_daemon` processes run on the device. Both may generate Breakpad minidumps. The analysis flow is the same; the only difference is selecting the corresponding symbol path according to the crashed process.

```{important}
Function names, source files, and line numbers depend on matching Breakpad symbols. The symbols should come from the same build as the crashed binaries; symbols from a different build may fail to resolve source line numbers correctly.
```

The method for obtaining symbols is described in the [Minidump section of the userspace build document](../develop/build/usr.md#minidump). That section already explains how to generate `axcl-host-minidump-symbols.tar.gz`, `axcl-device-minidump-symbols.tar.gz`, and `axcl-all-minidump-symbols.tar.gz`; this document does not repeat the symbol generation steps.

## 2. Prepare the minidump and symbols

The following files or directories are involved before analysis:

| Item | Description | Example |
| --- | --- | --- |
| minidump | `.dmp` file generated at the crash site | `<process>_<pid>_<tid>_<YYYYmmdd_HHMMSS>.dmp` |
| symbols archive | symbols package generated from the same build as the crashed binary | `axcl-all-minidump-symbols.tar.gz` |
| Linux analysis machine | machine that can run `minidump_stackwalk` from the symbols package | x86 Linux build or analysis machine |

## 3. Extract the symbols package

For host-process minidumps only, `axcl-host-minidump-symbols.tar.gz` can be used. If the crashed process source is uncertain, or both host and device symbols need to be covered, `axcl-all-minidump-symbols.tar.gz` can be used.

Create an isolated directory on the Linux analysis machine and extract the symbols archive:

```bash
mkdir -p /tmp/axcl-symbols
tar -xzf /path/to/axcl-all-minidump-symbols.tar.gz -C /tmp/axcl-symbols
```

Inspect the extracted directory structure:

```bash
find /tmp/axcl-symbols -maxdepth 4 -type d | sort | head -80
```

Common directories are:

```text
/tmp/axcl-symbols/host/axcl_linux_x64_gnu/symbols
/tmp/axcl-symbols/host/axcl_linux_x64_gnu/tools
/tmp/axcl-symbols/device/arm64_glibc/symbols
```

Where:

- `host/<variant>/tools/minidump_stackwalk` is the analysis tool. The later `STACKWALK` variable points to this file.
- `host/<variant>/symbols` contains symbols for host processes.
- `device/arm64_glibc/symbols` contains symbols for device-side `slave_worker` / `slave_daemon` and native SDK `.so` files.

Example `minidump_stackwalk` tool path:

```text
/tmp/axcl-symbols/host/<variant>/tools/minidump_stackwalk
```

If `host/<variant>/tools/minidump_stackwalk` is missing after extraction, the symbols package may not be a `host` or `all` mode output. `axcl-device-minidump-symbols.tar.gz` contains only device symbols; analysis still needs `minidump_stackwalk` from a host or all symbols package.

The host variant name can be listed with:

```bash
find /tmp/axcl-symbols/host -maxdepth 1 -mindepth 1 -type d -printf '%f\n'
```

The output directory name is the `<variant>` in `/tmp/axcl-symbols/host/<variant>`.

## 4. Set analysis variables

The unified analysis flow uses three types of variables: `DMP`, `STACKWALK`, and `SYMBOL_PATHS`.

### 4.1 Variable example using host symbols

```bash
DMP=/path/to/<process>_<pid>_<tid>_<YYYYmmdd_HHMMSS>.dmp
HOST_ROOT=/tmp/axcl-symbols/host/axcl_linux_x64_gnu
STACKWALK=$HOST_ROOT/tools/minidump_stackwalk
SYMBOL_PATHS=(
    "$HOST_ROOT/symbols/bin"
    "$HOST_ROOT/symbols/lib"
    "$HOST_ROOT/symbols/test"
)
```

### 4.2 Variable example using device symbols

```bash
DMP=/path/to/<process>_<pid>_<tid>_<YYYYmmdd_HHMMSS>.dmp
HOST_ROOT=/tmp/axcl-symbols/host/axcl_linux_x64_gnu
DEVICE_ROOT=/tmp/axcl-symbols/device/arm64_glibc
STACKWALK=$HOST_ROOT/tools/minidump_stackwalk
SYMBOL_PATHS=(
    "$DEVICE_ROOT/symbols/bin/axclSlave"
    "$DEVICE_ROOT/symbols/lib"
)
```

### 4.3 File and directory checks

```bash
test -f "$DMP" && echo "dmp ok"
test -x "$STACKWALK" && echo "minidump_stackwalk ok"
for path in "${SYMBOL_PATHS[@]}"; do
    test -d "$path" && echo "symbol path ok: $path"
done
```

## 5. Run the unified analysis command

The analysis command is the same whether the `.dmp` comes from a host process or a device process:

```bash
"$STACKWALK" "$DMP" "${SYMBOL_PATHS[@]}" > stackwalk.txt 2>&1
```

Check the output file after analysis:

```bash
ls -lh stackwalk.txt
```

## 6. Find the crash point in stackwalk.txt

`stackwalk.txt` can be long. A common reading order is as follows.

### 6.1 Check the crash reason

```bash
grep -nE "Crash reason|Crash address|Crash instruction" stackwalk.txt
```

Common output example:

```text
Crash reason:  SIGSEGV /SEGV_MAPERR
Crash address: 0x0
```

`Crash reason` shows the signal or exception type that triggered the crash. For example, `SIGSEGV` usually means an invalid memory access.

### 6.2 Find the crashed thread

```bash
grep -n "(crashed)" stackwalk.txt
```

The output is similar to:

```text
125:Thread 0 (crashed)
```

Record the line number and inspect the next several dozen lines. For example, if the crashed thread starts at line 125:

```bash
LINE=125
sed -n "${LINE},$((LINE + 80))p" stackwalk.txt
```

### 6.3 Check whether valid symbols are resolved

When symbols match, AXCL-related frames usually appear in the following form:

```text
module!function [file.cpp : line + offset]
```

For example:

```text
axcl_sample_runtime!main [main.cpp : 25 + 0x0]
```

Seeing `function name + source file + line number` indicates that the `.dmp`, symbols, and symbol paths basically match. The source location in the crashed thread can then be used to continue locating the issue.

An address-only example is:

```text
libaxcl.so + 0x123456
```

If only module names are shown and source line numbers are missing, see the symbol checks in section 8.

## 7. Information to provide for offline analysis

The minimum information for offline analysis is:

1. The original `.dmp` file.
2. The symbols package generated from the same build as the crashed binary, or build information that uniquely maps to that symbols package.

If `stackwalk.txt` has already been generated, it can be attached as well to quickly show the resolved crashed thread and stack trace.

## 8. Troubleshooting

### 8.1 `minidump_stackwalk` cannot find symbols or shows only addresses

Common checks:

1. Whether the `.dmp` and symbols package come from the same build.
2. Whether `SYMBOL_PATHS` matches the crashed process.
3. Symbol paths for host processes:
   - `host/<variant>/symbols/bin`
   - `host/<variant>/symbols/lib`
   - `host/<variant>/symbols/test`
4. Symbol paths for device processes:
   - `device/arm64_glibc/symbols/bin/axclSlave`
   - `device/arm64_glibc/symbols/lib`
5. `.sym` files exist under the symbols directory, with a structure similar to:

   ```text
   <symbol-path>/<module>/<breakpad-id>/<module>.sym
   ```

The following commands quickly check the number of `.sym` files:

```bash
find /tmp/axcl-symbols -name '*.sym' | wc -l
find /tmp/axcl-symbols -name '*.sym' | head
```

If the `.sym` count is 0, the symbols package or extracted directory is usually incorrect.

### 8.2 The crashed thread is in a native SDK `.so`

When the crashed thread is in a native SDK `.so`, the corresponding library symbols usually exist in device symbols:

```bash
find /tmp/axcl-symbols/device/arm64_glibc/symbols/lib -maxdepth 3 -name '*.sym' | sort | head -50
```

`SYMBOL_PATHS` includes the following path:

```text
/tmp/axcl-symbols/device/arm64_glibc/symbols/lib
```

### 8.3 Symbols package selection

- Host-process `.dmp`: use `axcl-host-minidump-symbols.tar.gz` or `axcl-all-minidump-symbols.tar.gz`.
- Device-process `.dmp`: usually use `axcl-all-minidump-symbols.tar.gz`, because it contains both host `minidump_stackwalk` and device symbols.
- If only `axcl-device-minidump-symbols.tar.gz` is available, `tools/minidump_stackwalk` from the host symbols package is still required.

## Appendix A: Example for constructing and analyzing a null-pointer minidump

This appendix gives a complete example from constructing a crash to analyzing the minidump. The sample process is `axcl_sample_runtime`, and the crash type is a null-pointer access. The example is only used to validate the minidump generation and analysis flow; the temporary code is restored after validation.

### A.1 Construct a null-pointer crash

The example constructs a crash by adding an environment-variable-controlled null-pointer access to `axcl/host/sample/runtime/main.cpp`. Default execution does not trigger the crash; setting `AXCL_SAMPLE_RUNTIME_NULL_DEREF=1` triggers it.

Temporary change in the include area:

```cpp
#include <cstdlib>
```

Temporary change after `axclInitializeMinidump(nullptr);` in `main()`:

```cpp
if (std::getenv("AXCL_SAMPLE_RUNTIME_NULL_DEREF")) {
    volatile int *null_ptr = nullptr;
    *null_ptr = 0;
}
```

The temporary code diff is as follows:

```diff
+#include <cstdlib>
 #include <thread>
 #include "axcl.h"
 #include "axcl_minidump.h"
@@
 int main(int argc, char *argv[]) {
     axclInitializeMinidump(nullptr);
+
+    if (std::getenv("AXCL_SAMPLE_RUNTIME_NULL_DEREF")) {
+        volatile int *null_ptr = nullptr;
+        *null_ptr = 0;
+    }

     cmdline::parser a;
```

### A.2 Full build and install

Run the full host x86 build and install from `axcl/build`:

```bash
cd axcl/build
make host=x86 clean all install
```

After the build completes, the sample program is installed to:

```text
axcl/out/axcl_linux_x64_gnu/bin/axcl_sample_runtime
```

### A.3 Collect symbols

Symbol generation is described in the [Minidump section of the userspace build document](../develop/build/usr.md#minidump). This example uses host symbols:

```bash
cd axcl
rm -rf /tmp/axcl-minidump-demo/symbols
./scripts/minidump/collect_symbols.sh host --output=/tmp/axcl-minidump-demo/symbols
```

Generated archive:

```text
/tmp/axcl-minidump-demo/symbols/axcl-host-minidump-symbols.tar.gz
```

### A.4 Extract symbols

```bash
rm -rf /tmp/axcl-minidump-demo/extracted
mkdir -p /tmp/axcl-minidump-demo/extracted
tar -xzf /tmp/axcl-minidump-demo/symbols/axcl-host-minidump-symbols.tar.gz \
  -C /tmp/axcl-minidump-demo/extracted
```

Directories used by this example after extraction:

```text
/tmp/axcl-minidump-demo/extracted/host/axcl_linux_x64_gnu/tools/minidump_stackwalk
/tmp/axcl-minidump-demo/extracted/host/axcl_linux_x64_gnu/symbols/bin
/tmp/axcl-minidump-demo/extracted/host/axcl_linux_x64_gnu/symbols/lib
/tmp/axcl-minidump-demo/extracted/host/axcl_linux_x64_gnu/symbols/test
```

### A.5 Run and generate a minidump

Set `AXCL_DUMP_DIR` to specify the `.dmp` output directory, and set `AXCL_SAMPLE_RUNTIME_NULL_DEREF=1` to trigger the null-pointer access:

```bash
cd axcl
DUMP_DIR=/tmp/axcl-minidump-demo/dumps
rm -rf "$DUMP_DIR"
mkdir -p "$DUMP_DIR"

set +e
AXCL_DUMP_DIR="$DUMP_DIR" AXCL_SAMPLE_RUNTIME_NULL_DEREF=1 \
  ./out/axcl_linux_x64_gnu/bin/axcl_sample_runtime -d 0 \
  > /tmp/axcl-minidump-demo/run.log 2>&1
rc=$?
set -e

echo "rc=$rc"
find "$DUMP_DIR" -maxdepth 1 -type f -name '*.dmp' -print
```

One actual run produced:

```text
rc=139
/tmp/axcl-minidump-demo/dumps/axcl_sample_run_2029764_2029764_20260712_102015.dmp
```

`rc=139` means the process exited because of `SIGSEGV`. The file prefix is `axcl_sample_run` because Linux `/proc/self/comm` truncates the `axcl_sample_runtime` process name.

### A.6 Analyze the minidump

```bash
DMP=$(find /tmp/axcl-minidump-demo/dumps -maxdepth 1 -type f -name '*.dmp' | head -1)
ROOT=/tmp/axcl-minidump-demo/extracted/host/axcl_linux_x64_gnu

"$ROOT/tools/minidump_stackwalk" "$DMP" \
  "$ROOT/symbols/bin" \
  "$ROOT/symbols/lib" \
  "$ROOT/symbols/test" \
  > /tmp/axcl-minidump-demo/stackwalk.txt 2>&1
```

Output file example:

```text
/tmp/axcl-minidump-demo/stackwalk.txt
```

### A.7 Inspect the analysis result

```bash
grep -nE "Crash reason|Crash address|Thread [0-9]+ \(crashed\)|axcl_sample|main.cpp|libaxcl" \
  /tmp/axcl-minidump-demo/stackwalk.txt | head -80
```

Key lines from one actual analysis:

```text
121:Crash reason:  SIGSEGV /SEGV_MAPERR
122:Crash address: 0x0
125:Thread 0 (crashed)
126: 0  axcl_sample_runtime!main [main.cpp : 25 + 0x0]
```

The result means:

- `Crash reason: SIGSEGV /SEGV_MAPERR`: invalid memory access.
- `Crash address: 0x0`: the accessed address is null.
- `Thread 0 (crashed)`: the crashed thread is thread 0.
- `axcl_sample_runtime!main [main.cpp : 25 + 0x0]`: symbols resolved the crash address to line 25 of `main.cpp` in `axcl_sample_runtime`, corresponding to `*null_ptr = 0;` in the temporary code.

### A.8 Restore the temporary code

After the example validation, restore the temporary crash-triggering code in `axcl/host/sample/runtime/main.cpp`. In the source repository, the single file can be restored with:

```bash
cd axcl
git checkout -- host/sample/runtime/main.cpp
```

Check that the file has no local diff after restoration:

```bash
git diff -- host/sample/runtime/main.cpp
```
