# 如何解析 minidump?

本文说明 AXCL 用户态进程崩溃后，如何使用崩溃现场产生的 minidump 分析问题。

## 1. 背景

AXCL 使用 [Google Breakpad](https://github.com/google/breakpad) 在用户态进程崩溃时生成 minidump，用于保存崩溃现场并支持后续离线分析。

Breakpad 是用于进程崩溃捕获和离线分析的 crash reporting 组件。进程发生 `SIGSEGV` 等 fatal exception 时，Breakpad 在崩溃现场写出 minidump 文件。minidump 是轻量级崩溃转储，通常记录异常类型、崩溃地址、线程上下文、寄存器、调用栈地址、已加载模块等信息，文件后缀通常为 `.dmp`。

minidump 与 Linux core dump 不同。core dump 通常包含更完整的进程内存镜像，体积较大；minidump 只保存崩溃分析所需的关键现场信息，体积较小，便于在实际运行环境中收集和归档。

minidump 本身不包含完整调试信息。AXCL 的发布/安装产物通常经过 strip，崩溃栈中的地址依赖 Breakpad symbols 转换为函数名、源码文件和行号。`minidump_stackwalk` 负责读取 `.dmp`，再根据 symbol path 查找 `<module>/<breakpad-id>/<module>.sym`，最终输出可读调用栈。

AXCL 是主从架构：host 侧进程运行在主控端，device 侧 `slave_worker` / `slave_daemon` 运行在设备端。二者都可能产生 Breakpad minidump，分析流程相同；区别只在于根据崩溃进程选择对应的 symbol path。

```{important}
函数名、源码文件和行号依赖于匹配的 Breakpad symbols。symbols 应与崩溃二进制来自同一次构建；不同构建产出的 symbols 可能无法正确解析源码行号。
```

symbols 获取方式见 [用户态构建文档的 Minidump 章节](../develop/build/usr.md#minidump)。该章节已经说明如何生成 `axcl-host-minidump-symbols.tar.gz`、`axcl-device-minidump-symbols.tar.gz`、`axcl-all-minidump-symbols.tar.gz`，本文不重复 symbols 生成步骤。

## 2. 准备 minidump 和 symbols

分析前至少涉及以下文件或目录：

| 项目 | 说明 | 示例 |
| --- | --- | --- |
| minidump | 崩溃现场生成的 `.dmp` 文件 | `<process>_<pid>_<tid>_<YYYYmmdd_HHMMSS>.dmp` |
| symbols 归档 | 与崩溃二进制同一次构建生成的 symbols 包 | `axcl-all-minidump-symbols.tar.gz` |
| Linux 分析机 | 能运行 symbols 包内 `minidump_stackwalk` 的机器 | x86 Linux 构建机或分析机 |

## 3. 解压 symbols 包

如果只分析 host 进程 minidump，可以使用 `axcl-host-minidump-symbols.tar.gz`；如果不确定崩溃进程来源，或需要同时覆盖 host 和 device symbols，可以使用 `axcl-all-minidump-symbols.tar.gz`。

在 Linux 分析机上创建独立目录，并解压 symbols 归档：

```bash
mkdir -p /tmp/axcl-symbols
tar -xzf /path/to/axcl-all-minidump-symbols.tar.gz -C /tmp/axcl-symbols
```

解压后查看目录结构：

```bash
find /tmp/axcl-symbols -maxdepth 4 -type d | sort | head -80
```

常见目录如下：

```text
/tmp/axcl-symbols/host/axcl_linux_x64_gnu/symbols
/tmp/axcl-symbols/host/axcl_linux_x64_gnu/tools
/tmp/axcl-symbols/device/arm64_glibc/symbols
```

其中：

- `host/<variant>/tools/minidump_stackwalk` 是解析工具，后续 `STACKWALK` 变量指向该文件。
- `host/<variant>/symbols` 是 host 进程使用的 symbols。
- `device/arm64_glibc/symbols` 是 device 侧 `slave_worker` / `slave_daemon` 和 native SDK `.so` 使用的 symbols。

`minidump_stackwalk` 工具路径示例：

```text
/tmp/axcl-symbols/host/<variant>/tools/minidump_stackwalk
```

如果解压后没有 `host/<variant>/tools/minidump_stackwalk`，说明当前 symbols 包可能不是 `host` 或 `all` 模式产物。`axcl-device-minidump-symbols.tar.gz` 只包含 device symbols，解析时仍需要从 host 或 all symbols 包中取得 `minidump_stackwalk`。

host variant 名称可通过以下命令查看：

```bash
find /tmp/axcl-symbols/host -maxdepth 1 -mindepth 1 -type d -printf '%f\n'
```

输出的目录名对应 `/tmp/axcl-symbols/host/<variant>` 中的 `<variant>`。

## 4. 设置解析变量

解析流程统一使用 `DMP`、`STACKWALK` 和 `SYMBOL_PATHS` 三类变量。

### 4.1 使用 host symbols 的变量示例

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

### 4.2 使用 device symbols 的变量示例

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

### 4.3 文件和目录检查

```bash
test -f "$DMP" && echo "dmp ok"
test -x "$STACKWALK" && echo "minidump_stackwalk ok"
for path in "${SYMBOL_PATHS[@]}"; do
    test -d "$path" && echo "symbol path ok: $path"
done
```

## 5. 执行统一解析命令

无论 `.dmp` 来自 host 进程还是 device 进程，解析命令保持一致：

```bash
"$STACKWALK" "$DMP" "${SYMBOL_PATHS[@]}" > stackwalk.txt 2>&1
```

解析结束后的输出文件检查：

```bash
ls -lh stackwalk.txt
```

## 6. 从 stackwalk.txt 找到崩溃点

`stackwalk.txt` 内容较长，常用查看顺序如下。

### 6.1 查看崩溃原因

```bash
grep -nE "Crash reason|Crash address|Crash instruction" stackwalk.txt
```

常见输出示例：

```text
Crash reason:  SIGSEGV /SEGV_MAPERR
Crash address: 0x0
```

`Crash reason` 说明触发崩溃的信号或异常类型，例如 `SIGSEGV` 通常表示非法内存访问。

### 6.2 找到 crashed 线程

```bash
grep -n "(crashed)" stackwalk.txt
```

会看到类似：

```text
125:Thread 0 (crashed)
```

记录这一行的行号，并从这一行开始查看后续几十行。例如 crashed 线程在第 125 行：

```bash
LINE=125
sed -n "${LINE},$((LINE + 80))p" stackwalk.txt
```

### 6.3 判断是否解析到了有效符号

symbols 匹配时，AXCL 相关帧通常显示成下面形式：

```text
module!function [file.cpp : line + offset]
```

例如：

```text
axcl_sample_runtime!main [main.cpp : 25 + 0x0]
```

看到 `函数名 + 源码文件 + 行号`，说明当前 `.dmp`、symbols 和 symbol path 基本匹配，可以根据 crashed 线程中的源码位置继续定位问题。

只看到地址的示例：

```text
libaxcl.so + 0x123456
```

或者只有模块名、没有源码行号，通常与第 8 节中的符号检查项相关。

## 7. 反馈给研发的信息

用于离线分析的最小信息包括：

1. 原始 `.dmp` 文件。
2. 与崩溃二进制同一次构建生成的 symbols 包，或能够唯一对应到该 symbols 包的构建信息。

如果已经生成 `stackwalk.txt`，可以一并附上，用于快速查看已解析出的崩溃线程和调用栈。

## 8. 常见问题排查

### 8.1 `minidump_stackwalk` 找不到符号或只有地址

常见检查项：

1. `.dmp` 和 symbols 包是否来自同一次构建。
2. 崩溃进程所属侧是否与 `SYMBOL_PATHS` 一致。
3. host 进程对应的 symbol path：
   - `host/<variant>/symbols/bin`
   - `host/<variant>/symbols/lib`
   - `host/<variant>/symbols/test`
4. device 进程对应的 symbol path：
   - `device/arm64_glibc/symbols/bin/axclSlave`
   - `device/arm64_glibc/symbols/lib`
5. symbols 目录下 `.sym` 文件存在，目录结构类似：

   ```text
   <symbol-path>/<module>/<breakpad-id>/<module>.sym
   ```

以下命令用于快速查看 `.sym` 文件数量：

```bash
find /tmp/axcl-symbols -name '*.sym' | wc -l
find /tmp/axcl-symbols -name '*.sym' | head
```

`.sym` 数量为 0 时，通常表示 symbols 包不正确或解压目录不正确。

### 8.2 crashed 线程位于 native SDK `.so`

crashed 线程落在 native SDK `.so` 时，device symbols 中通常存在对应库的符号：

```bash
find /tmp/axcl-symbols/device/arm64_glibc/symbols/lib -maxdepth 3 -name '*.sym' | sort | head -50
```

`SYMBOL_PATHS` 中同时包含以下路径：

```text
/tmp/axcl-symbols/device/arm64_glibc/symbols/lib
```

### 8.3 symbols 包选择

- host 进程 `.dmp`：使用 `axcl-host-minidump-symbols.tar.gz` 或 `axcl-all-minidump-symbols.tar.gz`。
- device 进程 `.dmp`：通常使用 `axcl-all-minidump-symbols.tar.gz`，因为它同时包含 host `minidump_stackwalk` 和 device symbols。
- 只有 `axcl-device-minidump-symbols.tar.gz` 时，同时依赖 host symbols 包中的 `tools/minidump_stackwalk`。

## 附录 A：构建空指针 minidump 并分析的实例

本附录给出一个从构造崩溃到解析 minidump 的完整实例。示例进程为 `axcl_sample_runtime`，崩溃类型为空指针访问。示例仅用于验证 minidump 生成和解析链路，验证结束后恢复临时代码。

### A.1 构造空指针崩溃

示例通过在 `axcl/host/sample/runtime/main.cpp` 中加入由环境变量控制的空指针访问来构造崩溃。默认运行不触发崩溃，设置 `AXCL_SAMPLE_RUNTIME_NULL_DEREF=1` 时触发崩溃。

头文件区域的临时改动：

```cpp
#include <cstdlib>
```

`main()` 中 `axclInitializeMinidump(nullptr);` 后的临时改动：

```cpp
if (std::getenv("AXCL_SAMPLE_RUNTIME_NULL_DEREF")) {
    volatile int *null_ptr = nullptr;
    *null_ptr = 0;
}
```

临时代码对应的 diff 形态如下：

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

### A.2 完整编译安装

在 `axcl/build` 目录执行完整 host x86 编译安装：

```bash
cd axcl/build
make host=x86 clean all install
```

构建完成后，示例程序安装到：

```text
axcl/out/axcl_linux_x64_gnu/bin/axcl_sample_runtime
```

### A.3 提取 symbols

symbols 生成方式见 [用户态构建文档的 Minidump 章节](../develop/build/usr.md#minidump)。本实例使用 host symbols：

```bash
cd axcl
rm -rf /tmp/axcl-minidump-demo/symbols
./scripts/minidump/collect_symbols.sh host --output=/tmp/axcl-minidump-demo/symbols
```

生成的归档文件如下：

```text
/tmp/axcl-minidump-demo/symbols/axcl-host-minidump-symbols.tar.gz
```

### A.4 解压 symbols

```bash
rm -rf /tmp/axcl-minidump-demo/extracted
mkdir -p /tmp/axcl-minidump-demo/extracted
tar -xzf /tmp/axcl-minidump-demo/symbols/axcl-host-minidump-symbols.tar.gz \
  -C /tmp/axcl-minidump-demo/extracted
```

解压后用于本实例的目录：

```text
/tmp/axcl-minidump-demo/extracted/host/axcl_linux_x64_gnu/tools/minidump_stackwalk
/tmp/axcl-minidump-demo/extracted/host/axcl_linux_x64_gnu/symbols/bin
/tmp/axcl-minidump-demo/extracted/host/axcl_linux_x64_gnu/symbols/lib
/tmp/axcl-minidump-demo/extracted/host/axcl_linux_x64_gnu/symbols/test
```

### A.5 运行并生成 minidump

设置 [AXCL_DUMP_DIR](../appendix/environment_variables.md#AXCL_DUMP_DIR) 指定 `.dmp` 输出目录，同时设置 `AXCL_SAMPLE_RUNTIME_NULL_DEREF=1` 触发空指针访问：

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

一次实际运行输出如下：

```text
rc=139
/tmp/axcl-minidump-demo/dumps/axcl_sample_run_2029764_2029764_20260712_102015.dmp
```

`rc=139` 表示进程因 `SIGSEGV` 退出。文件名前缀为 `axcl_sample_run`，这是 `axcl_sample_runtime` 进程名被 Linux `/proc/self/comm` 长度限制截断后的结果。

### A.6 解析 minidump

```bash
DMP=$(find /tmp/axcl-minidump-demo/dumps -maxdepth 1 -type f -name '*.dmp' | head -1)
ROOT=/tmp/axcl-minidump-demo/extracted/host/axcl_linux_x64_gnu

"$ROOT/tools/minidump_stackwalk" "$DMP" \
  "$ROOT/symbols/bin" \
  "$ROOT/symbols/lib" \
  "$ROOT/symbols/test" \
  > /tmp/axcl-minidump-demo/stackwalk.txt 2>&1
```

输出文件示例：

```text
/tmp/axcl-minidump-demo/stackwalk.txt
```

### A.7 查看解析结果

```bash
grep -nE "Crash reason|Crash address|Thread [0-9]+ \(crashed\)|axcl_sample|main.cpp|libaxcl" \
  /tmp/axcl-minidump-demo/stackwalk.txt | head -80
```

一次实际解析输出中的关键行如下：

```text
121:Crash reason:  SIGSEGV /SEGV_MAPERR
122:Crash address: 0x0
125:Thread 0 (crashed)
126: 0  axcl_sample_runtime!main [main.cpp : 25 + 0x0]
```

上述结果表示：

- `Crash reason: SIGSEGV /SEGV_MAPERR`：非法内存访问。
- `Crash address: 0x0`：访问地址为空地址。
- `Thread 0 (crashed)`：崩溃线程为线程 0。
- `axcl_sample_runtime!main [main.cpp : 25 + 0x0]`：symbols 已经把崩溃地址解析到 `axcl_sample_runtime` 的 `main.cpp` 第 25 行，对应临时代码中的 `*null_ptr = 0;`。

### A.8 恢复临时代码

实例验证结束后恢复 `axcl/host/sample/runtime/main.cpp` 中用于触发崩溃的临时代码。源码仓库中可以使用以下命令恢复单个文件：

```bash
cd axcl
git checkout -- host/sample/runtime/main.cpp
```

恢复后检查该文件没有本地差异：

```bash
git diff -- host/sample/runtime/main.cpp
```
