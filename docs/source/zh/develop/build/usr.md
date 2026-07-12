# 用户态

本文档描述如何编译 AXCL 主控端用户态组件、示例程序以及生成 deb/rpm 包。
本文路径均以 AXCL 根目录为基准描述，编译入口为 `build/Makefile`。

```{note}
以下主控端编译环境以 `Ubuntu 22.04` 为例。
```

## 1. 环境依赖

| 工具  | 版本      | 备注             |
| ----- | --------- | -------------- |
| cmake | >= 3.20   |               |
| make  | >= 4.3    |               |
| ninja | >= 1.13.0 | 默认 generator |
| zig   | >= 0.15.2 |                |
| deb   |           | 制作 deb 包     |
| rpm   |           | 制作 rpm 包     |

### 1.1. 安装

**基础工具**

```bash
sudo apt update
sudo apt install -y cmake make dpkg-dev rpm
```

```{note}
- `dpkg-dev` 用于提供 deb 包制作相关工具。
- `rpm` 用于提供 rpm 包制作相关工具。
```

**Ninja**
1. 从 <https://github.com/ninja-build/ninja/releases/> 下载 Ninja。
2. 将 `ninja` 可执行文件放到 `PATH` 可见目录，例如 `/usr/local/bin`。
3. 通过 `ninja --version` 验证安装结果。

**Zig**
1. 从 <https://ziglang.org/download/> 下载 Zig。
2. 解压到本地工具目录。
3. 将包含 `zig` 的目录加入 `PATH`。
4. 通过 `zig version` 验证安装结果。

## 2. 编译

### 2.1. Usage

```text
Usage: make [target] [host=<host>] [libc=<libc>[,<libc>...]] [debug=yes]

Targets:
  all       (default) configure + build
  install   install to axcl/out/axcl_<os>_<host>[_<libc>]/
  package   generate .deb/.rpm, keep build/out/.../axcl as staging, and copy deliverables to out/.../package/
  clean     remove the current build & install dir
  scan      static analysis (tscancode)
  help      show this message

Options:
  host=     arm64 | x86 | loongarch64 | riscv64 | all         (default: all)
  libc=     gnu | musl | gnu,musl | "gnu musl"                (default: see AXCL_HOST_LIBC)
  debug=    yes | no                                          (default: no -> Release)

Examples:
  make clean all install                       # build all linux hosts (matrix)
  make host=x86 clean all install package      # x86 only, default libc set
  make host=arm64 libc=musl clean all install  # aarch64 + musl
```

### 2.2. 编译选项

| 参数      | 可选项                                          | 默认值 | 参数说明 |
| --------- | ----------------------------------------------- | ------ | -------- |
| `host=`   | `arm64`、`x86`、`loongarch64`、`riscv64`、`all` | `all`  | 目标 host。`all` 启用多 host 矩阵。 |
| `libc=`   | `gnu`、`musl`，可逗号或空格组合                 | 以 `build/config.mk` 当前默认值为准 | C 库选择。当前所有 linux host 默认都为 `gnu`。多值会按 libc 拆分子构建。`host=all` 下此参数被忽略，实际矩阵来自 `build/config.mk`。 |
| `debug=`  | `yes`、`no`                                     | `no`   | `yes` 时设置 `CMAKE_BUILD_TYPE=Debug`，`no` 时设置 `CMAKE_BUILD_TYPE=Release`。 |

### 2.3. 高级参数

| 参数 | 作用 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `AXCL_BUILD_CPU_LIMIT_PERCENT` | 控制内部构建并发预算占在线 CPU 核数的百分比。 | `80` | 日常构建使用默认值即可；共享编译机或需要降低负载时可设为 `50` 或更低。 |
| `AXCL_ALL_HOSTS` | `host=all` 时实际展开的 host 列表。 | `x86 arm64` | 修改 `axcl/build/config.mk` |
| `AXCL_HOST_LIBC_<arch>` | `host=all` 下指定某个 arch 的 libc 构建矩阵，例如 `AXCL_HOST_LIBC_x64`、`AXCL_HOST_LIBC_aarch64`。 | `gnu` | 默认构建 `gnu`。如需调整默认 libc 矩阵，应修改 `build/config.mk`，不要通过环境变量或 `make` 参数覆盖。 |
| `AXCL_GLIBC_VERSION` | 指定 gnu libc 目标版本，传递给 Zig gnu toolchain。 | 由 `build/projects/axcl_linux_<arch>.mk` 定义 | 通常不建议修改；默认版本参见下文“[glibc / 动态链接器矩阵](#zh-build-glibc-dynamic-linker-matrix)”。如确需调整，应修改对应 `build/projects/axcl_linux_<arch>.mk`，不要通过环境变量或 `make` 参数覆盖；仅适用于 `libc=gnu`。 |
| `AXCL_PACKAGE_OUTPUT_DIR` | 覆盖 `.deb` 和 `.rpm` 最终复制目录。 | `out/axcl_linux_<host>_<libc>/package/` | CI 或发布归档时可设置为统一输出目录。 |

通用格式：

```bash
make host=<host> <param>=<value> clean all install
```

典型示例：

```bash
# 限制本次构建最多使用约 50% 在线 CPU
make host=x86 AXCL_BUILD_CPU_LIMIT_PERCENT=50 clean all install

# 指定 package 输出目录
make host=x86 AXCL_PACKAGE_OUTPUT_DIR=/tmp/axcl-package clean all install package
```

```{note}
- 对单个 Linux host，`libc=gnu,musl` 或 `libc="gnu musl"` 会按每个 libc 拆分子构建。
- `host=all` 下，`libc=` 参数会被忽略，实际 host 矩阵由 `AXCL_ALL_HOSTS` 决定，实际 libc 矩阵由 `build/config.mk` 中的 `AXCL_HOST_LIBC_<arch>` 决定。
```

### 2.4. 示例

```bash
# 构建所有 linux host（矩阵）
make clean all install

# 仅构建 x86，并使用默认 libc 集合
make host=x86 clean all install package
```

### 2.5. 清理与重建

- `make clean`：清理当前 host/libc 的 build 与 install 目录。
- 当配置异常或 CMake cache 卡住时，可直接执行 `rm -rf build/out` 强制重建。

## 3. 包制作

```bash
# 构建、安装并打包当前 all-host 矩阵
make host=all clean all install package

# 通过顶层 Makefile 构建、安装并打包 x86 入口
make host=x86 clean all install package
```

包输出目录：
- 默认：`out/axcl_linux_<host>_<libc>/package/`
- 覆盖方式：设置 `AXCL_PACKAGE_OUTPUT_DIR=/绝对路径/目标目录`，即可把最终 `.deb` 与 `.rpm` 复制到其它目录。

## 4. 产物目录

```text
out/axcl_linux_<host>_<libc>/
├── bin/        # 可执行
├── data/       # 包数据载荷（含 foreign/<arch>/）
├── etc/        # 本地 install tree 配置
├── lib/        # AXCL 运行库
├── include/    # 对外头文件
├── package/    # 最终 .deb/.rpm 交付目录
├── test/       # gtest 测试程序
└── unstripped/ # strip 前的调试文件，用于生成 Breakpad symbols
```

## 5. Minidump

AXCL 使用 Breakpad 支持 minidump。进程异常崩溃时，Breakpad 可以生成轻量级 minidump 文件，用于记录崩溃现场的线程、寄存器、加载模块等信息，便于后续定位问题。

minidump 本身不包含完整调试符号。AXCL 的发布/安装产物通常会经过 strip，函数名、源文件、行号等调试信息需要单独保存并转换成 Breakpad symbols。分析 minidump 时，需要同时准备：

- 崩溃现场生成的 minidump 文件；
- 与崩溃二进制匹配的 Breakpad symbols；
- `minidump_stackwalk` 分析工具。

AXCL 提供 `scripts/minidump/collect_symbols.sh` 用于抽取 host/device Breakpad symbols，并生成归档文件。

使用前请先完成对应目标的构建和安装。`make install` 会安装已 strip 的 `bin`、`lib`、`test` 产物，并保留 `unstripped/**/*.debug` 调试文件；抽取脚本会扫描 `.debug` 文件，调用 `dump_syms` 生成 `symbols/**`，最后打包输出。

```bash
# 仅抽取 host symbols
./scripts/minidump/collect_symbols.sh host --output=/tmp/axcl-minidump-symbols

# 仅抽取 device symbols
./scripts/minidump/collect_symbols.sh device --output=/tmp/axcl-minidump-symbols

# 抽取 host 和 device symbols
./scripts/minidump/collect_symbols.sh all --output=/tmp/axcl-minidump-symbols
```

常用参数：

| 参数 | 说明 |
| --- | --- |
| `host`、`device`、`all` | 抽取模式。默认是 `all`。 |
| `--output=<dir>` | 必填。symbols 和压缩包输出目录，建议使用专用空目录。 |
| `--axcl-dir=<dir>` | AXCL 仓库根目录，默认由脚本路径自动识别。 |
| `--manifest-dir=<dir>` | manifest workspace 根目录，默认是 `<axcl-dir>/..`。 |

输出归档名称：

| 模式 | 输出文件 |
| --- | --- |
| `host` | `axcl-host-minidump-symbols.tar.gz` |
| `device` | `axcl-device-minidump-symbols.tar.gz` |
| `all` | `axcl-all-minidump-symbols.tar.gz` |

输出目录会保留原始 variant 目录名，例如：

```text
<output_dir>/host/axcl_linux_x64_gnu/symbols/
<output_dir>/host/axcl_linux_x64_gnu/unstripped/lib/
<output_dir>/host/axcl_linux_x64_gnu/tools/minidump_stackwalk
<output_dir>/host/axcl_linux_x64_gnu/tools/dump_syms
<output_dir>/device/arm64_glibc/symbols/
```

注意：
- `--output` 建议指定专用空目录。脚本只会清理带有 `.axcl-symbols-output` marker 的既有输出目录。
- host symbols 来自 `axcl/out/axcl_linux_*`。
- device symbols 来自 `<manifest-dir>/msp/out/arm64_glibc`。

## 6. 常见问题

1.
   [Q] 切换选项后编译失败？<br>
   [A] 通常是 CMake cache 残留导致。先执行 `rm -rf build/out`，再重新编译。
2.
   [Q] 如何查看或修改某个 host 的默认 glibc 版本？<br>
   [A] 默认版本参见“[glibc / 动态链接器矩阵](#zh-build-glibc-dynamic-linker-matrix)”；如确需修改，调整 `build/projects/axcl_linux_<arch>.mk` 中的 `AXCL_GLIBC_VERSION`。
3.
   [Q] 如何新增一个 libc？<br>
   [A]
    - 在 `build/config.mk` 的 `AXCL_SUPPORTED_LIBCS` 中加入新 libc 名。
    - 为每个待支持 host 新增 `build/cmake/toolchains/<host>-linux-<新libc>-zig.cmake`。
    - 如果希望它进入默认矩阵，再更新对应的 `AXCL_HOST_LIBC_<arch>` 默认值。
4.
   [Q] DEB 安装失败后如何清理残留？<br>
   [A] 虽然 DEB 安装失败时会尝试回滚，但 `postinst` 期间创建的日志、profile 片段、动态链接器配置、CMake wrapper，以及 DKMS 或内核模块这类系统侧副作用，在脚本中断、降级成功或包管理状态半配置时仍可能残留在系统中。

    以 root 身份执行下面的脚本即可统一清理这些残留：

    ```bash
    #!/usr/bin/env bash
    set -euo pipefail

    if [[ ${EUID} -ne 0 ]]; then
       echo "请以 root 身份运行" >&2
       exit 1
    fi

    PKG_NAME="axhelix"
    KERNEL_RELEASE="$(uname -r)"
    MARKER="# Managed by ${PKG_NAME} package"

    remove_managed_cmake_wrapper_dir() {
       local wrapper_dir="$1"

       [[ -d "$wrapper_dir" ]] || return 0

       for wrapper_file in \
          "$wrapper_dir/axclConfig.cmake" \
          "$wrapper_dir/axclConfigVersion.cmake"
       do
          if [[ -f "$wrapper_file" ]] && grep -Fq "$MARKER" "$wrapper_file" 2>/dev/null; then
             rm -f "$wrapper_file"
          fi
       done

       rmdir "$wrapper_dir" >/dev/null 2>&1 || true
    }

    dpkg --configure -a || true
    apt remove --purge -y "$PKG_NAME" || true

    for src_dir in /usr/src/${PKG_NAME}-*; do
       [[ -d "$src_dir" ]] || continue
       version="${src_dir#/usr/src/${PKG_NAME}-}"
       if command -v dkms >/dev/null 2>&1; then
          dkms remove -m "$PKG_NAME" -v "$version" --all >/dev/null 2>&1 || true
       fi
       rm -rf "$src_dir"
    done

    rm -rf \
       "/var/log/${PKG_NAME}" \
       "/var/lib/${PKG_NAME}" \
       "/lib/modules/${KERNEL_RELEASE}/extra/${PKG_NAME}"

    rm -f \
       "/etc/profile.d/${PKG_NAME}.sh" \
       "/etc/ld.so.conf.d/${PKG_NAME}.conf" \
       "/etc/modules-load.d/${PKG_NAME}.conf" \
       "/etc/modprobe.d/${PKG_NAME}.conf"

    remove_managed_cmake_wrapper_dir "/usr/lib/cmake/axcl"
    remove_managed_cmake_wrapper_dir "/usr/lib64/cmake/axcl"

    if command -v ldconfig >/dev/null 2>&1; then
       ldconfig || true
    fi

    if command -v depmod >/dev/null 2>&1; then
       depmod -a "$KERNEL_RELEASE" || true
    fi
    ```
5.
   [Q] 为什么 `apt install ./axhelix_linux_x64_gnu.deb` 会出现 `_apt` 沙盒回退提示？<br>
   [A] 当本地 `.deb` 所在路径对 `_apt` 用户不可遍历时，就会出现该提示，例如 home 目录权限为 `750`。可先把包移动到 `/tmp/` 等 `_apt` 可访问路径，再执行安装，例如 `cp ~/Desktop/axhelix_linux_x64_gnu.deb /tmp/ && sudo apt install /tmp/axhelix_linux_x64_gnu.deb`。

## 7. 附录

(zh-build-glibc-dynamic-linker-matrix)=
### 7.1. glibc / 动态链接器矩阵

| host        | gnu glibc | gnu `.interp`                          | musl `.interp`                  |
| ----------- | --------- | -------------------------------------- | ------------------------------- |
| arm64       | 2.30      | `/lib/ld-linux-aarch64.so.1`           | `/lib/ld-musl-aarch64.so.1`     |
| x86         | 2.30      | `/lib64/ld-linux-x86-64.so.2`          | `/lib/ld-musl-x86_64.so.1`      |
| loongarch64 | 2.40      | `/lib64/ld-linux-loongarch-lp64d.so.1` | `/lib/ld-musl-loongarch64.so.1` |
| riscv64     | 2.39      | `/lib/ld-linux-riscv64-lp64d.so.1`     | `/lib/ld-musl-riscv64.so.1`¹    |

¹ `riscv64 + musl` 当前仍受 Zig 0.15.2 `libzigc.a` 的 PIC 限制阻塞，链接阶段会报 `R_RISCV_HI20`。

### 7.2. 工具链文件索引

本表只列正式支持的 Linux Zig 工具链文件，故意排除了 `*-gcc.cmake`、Windows toolchain 以及 `build/cmake/toolchains/` 下的子目录项。

| host × libc        | 工具链文件（位于 `build/cmake/toolchains/`） |
| ------------------ | -------------------------------------------- |
| arm64 / gnu        | `aarch64-linux-gnu-zig.cmake`                |
| arm64 / musl       | `aarch64-linux-musl-zig.cmake`               |
| x86 / gnu          | `x86_64-linux-gnu-zig.cmake`                 |
| x86 / musl         | `x86_64-linux-musl-zig.cmake`                |
| loongarch64 / gnu  | `loongarch64-linux-gnu-zig.cmake`            |
| loongarch64 / musl | `loongarch64-linux-musl-zig.cmake`           |
| riscv64 / gnu      | `riscv64-linux-gnu-zig.cmake`                |
| riscv64 / musl     | `riscv64-linux-musl-zig.cmake`               |
