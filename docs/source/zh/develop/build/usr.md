# 用户态

本文档描述如何编译 AXCL 主控端用户态组件、示例程序以及生成 deb/rpm 包。
本文路径均以 AXCL 根目录为基准描述，编译入口为 `build/Makefile`，因此 `make` 命令需在 `build/` 目录下执行。

```{note}
以下主控端编译环境以 `Ubuntu 22.04` 为例。
```

## 1. 环境依赖

| 工具  | 版本      | 备注             |
| ----- | --------- | -------------- |
| cmake | >= 3.24   |               |
| make  | >= 4.3    |               |
| ninja | >= 1.13.0 | 默认 generator |
| zig   | >= 0.15.2 | `x86`、`arm64` 使用 |
| GNU 交叉工具链 | arm-gnu-toolchain-13.3.rel1 | 仅 `host=ax8860` 使用，固定路径，不用 zig |
| python3 |         | `package` 时校验 `pac=` 文件 |
| dpkg-dev |        | 制作 deb 包     |
| rpm   |           | 制作 rpm 包     |

### 1.1. 安装

**基础工具**

```bash
sudo apt update
sudo apt install -y cmake make python3 dpkg-dev rpm
```

```{note}
- `dpkg-dev` 用于提供 deb 包制作相关工具。
- `rpm` 用于提供 rpm 包制作相关工具。
- Ubuntu 22.04 软件源中的 `cmake` 版本为 3.22，低于要求的 3.24，使用该版本时 CMake 配置会失败。请从其他渠道安装 CMake 3.24 或更高版本（例如 <https://cmake.org/download/>），并确保其在 `PATH` 中优先。
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

```{note}
`host=ax8860` 不使用 zig，固定使用 GNU 交叉工具链（见 [2.5. ax8860 目标](#build-ax8860)）。其余 host（包括 `host=all`）均需 zig；如果 `PATH` 中找不到 zig，`make` 会报错 `zig compiler not found in PATH` 并停止。`host=all` 不包含 `ax8860`。
```

**GNU 交叉工具链（仅 `host=ax8860`）**
1. 安装 arm-gnu-toolchain-13.3.rel1 到固定路径 `/usr/local/arm-gnu-toolchain-13.3.rel1-x86_64-aarch64-none-linux-gnu/`。
2. 确认 `/usr/local/arm-gnu-toolchain-13.3.rel1-x86_64-aarch64-none-linux-gnu/bin/aarch64-none-linux-gnu-gcc` 可执行。
3. 构建时始终使用该路径，无需加入 `PATH`。

## 2. 编译

### 2.1. 用法

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
  host=     arm64 | x86 | ax8860 | all (default: all)
  libc=     gnu                                               (default: see AXCL_HOST_LIBC)
  debug=    yes | no                                          (default: no -> Release)

Examples:
  make clean all install                       # build all linux hosts (matrix)
  make host=x86 clean all install package pac=/absolute/path/to/firmware.pac
  make host=arm64 clean all install            # aarch64
```

### 2.2. 编译选项

| 参数      | 可选项                                          | 默认值 | 参数说明 |
| --------- | ----------------------------------------------- | ------ | -------- |
| `host=`   | `arm64`、`x86`、`ax8860`、`all` | `all`  | 目标 host。`ax8860` 为 aarch64 glibc，固定用 GNU 交叉工具链（不用 zig），只能单独构建，见 [2.5. ax8860 目标](#build-ax8860)。`all` 启用多 host 矩阵（不包含 `ax8860`）。 |
| `libc=`   | `gnu`                                           | `gnu`  | C 库选择。`host=all` 下此参数被忽略并给出警告，libc 矩阵来自 `build/config.mk` 中的 `AXCL_HOST_LIBC_<arch>`。 |
| `debug=`  | `yes`、`no`                                     | `no`   | `yes` 时设置 `CMAKE_BUILD_TYPE=Debug`，`no` 时设置 `CMAKE_BUILD_TYPE=Release`。 |
| `pac=`    | PAC 文件路径                                    | 无     | Linux 下 `package` 和 `package-only` 必填，未指定时 `make` 会立即停止。文件必须是非空、可读的普通文件，且文件名以 `.pac` 结尾（区分大小写）。支持相对路径、空格和非 ASCII 字符（如中文）；不支持 `"`、`\`、`` ` ``、`$`、制表符和换行符。符号链接会解析到其目标文件，目标文件名同样必须以 `.pac` 结尾。 |

### 2.3. 高级参数

| 参数 | 作用 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `AXCL_BUILD_CPU_LIMIT_PERCENT` | 按在线 CPU 核数的百分比设置构建并发度。 | `80` | `host=all` 下该预算会在各构建任务之间分配。日常构建使用默认值即可；共享编译机或需要降低负载时可设为 `50` 或更低。 |
| `AXCL_ALL_HOSTS` | `host=all` 时构建的 host 列表。 | `x86 arm64` | 可在 `make` 命令行中传入，例如 `AXCL_ALL_HOSTS=x86`，也可修改 `build/config.mk` 中的默认值。不接受 `ax8860`。 |
| `AXCL_HOST_LIBC_<arch>` | `host=all` 下指定某个 arch 的 libc 构建矩阵，例如 `AXCL_HOST_LIBC_x64`、`AXCL_HOST_LIBC_aarch64`。 | `gnu` | 如需调整该矩阵，应修改 `build/config.mk`，不要通过环境变量或 `make` 参数覆盖。 |
| `AXCL_GLIBC_VERSION` | Zig gnu toolchain 使用的目标 glibc 版本。 | 由 `build/projects/axcl_linux_<arch>.mk` 定义 | 通常保持默认值即可，参见下文“[glibc / 动态链接器矩阵](#build-glibc-matrix)”。如需调整，应修改对应 `build/projects/axcl_linux_<arch>.mk`，不要通过环境变量或 `make` 参数覆盖；仅适用于 `libc=gnu`，不适用于 `host=ax8860`。 |
| `AXCL_PACKAGE_OUTPUT_DIR` | 覆盖 `.deb` 和 `.rpm` 最终复制目录。 | `out/axcl_linux_<host>_<libc>/package/` | 请使用绝对路径；相对路径以 `build/` 为基准解析。CI 或发布归档时可设置为统一输出目录。 |

通用格式：

```bash
make host=<host> <param>=<value> clean all install
```

典型示例：

```bash
# 限制本次构建最多使用约 50% 在线 CPU
make host=x86 AXCL_BUILD_CPU_LIMIT_PERCENT=50 clean all install

# 指定 package 输出目录
make host=x86 AXCL_PACKAGE_OUTPUT_DIR=/tmp/axcl-package clean all install package pac=/absolute/path/to/firmware.pac
```

```{note}
`host=all` 下，`libc=` 参数会被忽略，host 矩阵由 `AXCL_ALL_HOSTS` 决定，libc 矩阵由 `build/config.mk` 中的 `AXCL_HOST_LIBC_<arch>` 决定。
```

### 2.4. 示例

```bash
# 构建所有 linux host（矩阵）
make clean all install

# 仅构建并打包 x86，使用默认 libc
make host=x86 clean all install package pac=/absolute/path/to/firmware.pac

# 构建并打包 ax8860（GNU 交叉工具链，不用 zig）
make host=ax8860 clean all install package pac=/absolute/path/to/firmware.pac
```

<a id="build-ax8860"></a>

### 2.5. ax8860 目标

`host=ax8860` 固定使用以下 GNU 交叉工具链：

```text
/usr/local/arm-gnu-toolchain-13.3.rel1-x86_64-aarch64-none-linux-gnu/bin/aarch64-none-linux-gnu-
```

执行 `make host=ax8860` 时不需要安装 Zig。`ax8860` 不在 `host=all` 矩阵中，需要单独构建。

发布镜像中的该目标由 SDK 自动构建：在 SDK `build/` 目录中构建 Debian rootfs 时（例如执行 `make p=AX8860_emmc ROOTFS_FLAVOR=debian`，也支持 `AX8860_ssd` 和 `AX8860_ssd_m2`），会构建 AXCL 内核模块和 `host=ax8860` 用户态，并与系统配置一起编入镜像。用户只需烧写 AXP，无需安装 `axhelix-ax8860` package。`make host=ax8860` 用于研发单独构建与调试。

### 2.6. 清理与重建

- `make clean`：清理当前 host/libc 的 build 与 install 目录；`host=all` 时清理矩阵中每个 host/libc 的对应目录。
- 当配置异常或 CMake cache 失效时，可在 AXCL 根目录执行 `rm -rf build/out` 强制完全重建。

## 3. 包制作

```bash
# 构建、安装并打包当前 all-host 矩阵
make host=all clean all install package pac=/absolute/path/to/firmware.pac

# 仅构建、安装并打包 x86
make host=x86 clean all install package pac=/absolute/path/to/firmware.pac
```

每个 Linux DEB/RPM 只携带一个 PAC，无论输入文件名是什么，都会安装为 `/lib/firmware/axcl/ax8860_card.pac`。PAC 只进入安装包，`all` 和 `install` 不会将其复制到 `out/`。

包输出目录：
- 默认：`out/axcl_linux_<host>_<libc>/package/`
- 覆盖方式：设置 `AXCL_PACKAGE_OUTPUT_DIR=/绝对路径/目标目录`，即可把最终 `.deb` 与 `.rpm` 复制到其它目录。

包名按构建目标确定。版本号取自 SDK 版本（SDK `build/version.mak` 中的 `SDK_VERSION`，例如 `V0.5.0` → `0.5.0`），文件名遵循 Debian / RPM 惯例：

| 构建目标 | 包名 | DEB 示例 | RPM 示例 |
| ---- | ---- | ---- | ---- |
| `host=x86` / `arm64`，`libc=gnu` | `axhelix` | `axhelix_0.5.0-1_amd64.deb` | `axhelix-0.5.0-1.x86_64.rpm` |
| `host=ax8860` | `axhelix-ax8860` | `axhelix-ax8860_0.5.0-1_arm64.deb` | `axhelix-ax8860-0.5.0-1.aarch64.rpm` |

`axhelix` 与 `axhelix-ax8860` 互斥，只能安装其中一个。安装时，`axhelix-ax8860` 只能安装在启用 `CONFIG_AXERA_LOCAL_DEVICE=y` 的内核上，`axhelix` 只能安装在未启用该配置的内核上；否则安装失败，并提示应使用的包。包按工具链声明 glibc 最低版本：zig 构建取 `AXCL_GLIBC_VERSION`，`host=ax8860` 为 2.38。

## 4. 产物目录

```text
out/axcl_linux_<host>_<libc>/
├── bin/        # 可执行
├── data/       # 示例与测试数据（图像、视频）
├── etc/        # 配置
├── lib/        # AXCL 运行库、CMake package（cmake/axcl）和 pkg-config 文件（pkgconfig）
├── include/    # 对外头文件
├── package/    # .deb/.rpm 文件（未设置 AXCL_PACKAGE_OUTPUT_DIR 时）
├── test/       # gtest 测试程序
└── unstripped/ # strip 前的调试文件，用于生成 Breakpad symbols
```

路径说明：
- 面向用户的 `host=arm64` 对应 `out/axcl_linux_aarch64_<libc>/`。
- 面向用户的 `host=x86` 对应 `out/axcl_linux_x64_<libc>/`。
- `host=ax8860` 对应 `out/axcl_linux_ax8860_gnu/`。

<a id="minidump-symbols"></a>

## 5. Minidump

AXCL 使用 Breakpad 支持 minidump。进程异常崩溃时，Breakpad 可以生成轻量级 minidump 文件，用于记录崩溃现场的线程、寄存器、加载模块等信息，便于后续定位问题。

minidump 本身不包含完整调试符号。AXCL 的发布/安装产物通常会经过 strip，函数名、源文件、行号等调试信息需要单独保存并转换成 Breakpad symbols。分析 minidump 时，需要同时准备：

- 崩溃现场生成的 minidump 文件；
- 与崩溃二进制匹配的 Breakpad symbols；
- `minidump_stackwalk` 分析工具。

AXCL 提供 `scripts/minidump/collect_symbols.sh` 用于抽取 host/device Breakpad symbols，并生成归档文件。

使用前请先完成对应目标的构建和安装。`make install` 会安装已 strip 的 `bin`、`lib`、`test` 产物，并保留 `unstripped/**/*.debug` 调试文件；抽取脚本会扫描 `.debug` 文件，调用 `dump_syms` 生成 `symbols/**`，最后打包输出。`dump_syms` 和 `minidump_stackwalk` 在 `build/out/` 下构建生成，因此抽取前不要删除 `build/out`；如果缺少 `dump_syms`，脚本会打印警告并跳过符号生成。

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
- device symbols 来自 `<manifest-dir>/msp/out/arm64_glibc`，完成 SDK `msp` 编译后才会生成。

## 6. 常见问题

1.
   [Q] 切换选项后编译失败？<br>
   [A] 通常是 CMake cache 残留导致。先执行 `rm -rf build/out`，再重新编译。
2.
   [Q] 如何查看或修改某个 host 的默认 glibc 版本？<br>
   [A] 默认版本参见“[glibc / 动态链接器矩阵](#build-glibc-matrix)”；如确需修改，调整 `build/projects/axcl_linux_<arch>.mk` 中的 `AXCL_GLIBC_VERSION`。
3.
   [Q] 如何新增一个 libc？<br>
   [A]
    - 在 `build/config.mk` 的 `AXCL_SUPPORTED_LIBCS` 中加入新 libc 名。
    - 为每个待支持 host 新增 `build/cmake/toolchains/<arch>-linux-<新libc>-zig.cmake`（`<arch>` 例如 `x86_64` 或 `aarch64`），并在对应的 `build/projects/axcl_linux_<arch>.mk` 中选用该文件。
    - 如果希望它进入默认矩阵，再更新对应的 `AXCL_HOST_LIBC_<arch>` 默认值。
4.
   [Q] DEB 安装失败后如何清理残留？<br>
   [A] 虽然 DEB 安装失败时会尝试回滚，但 `postinst` 期间创建的日志、CMake wrapper，以及 DKMS 或内核模块这类系统侧副作用，在脚本中断、降级成功或包管理状态半配置时仍可能残留在系统中。

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
       "/usr/lib/modules-load.d/${PKG_NAME}.conf" \
       "/lib/modprobe.d/${PKG_NAME}.conf" \
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
   [Q] 为什么 `apt install ./axhelix_0.5.0-1_amd64.deb` 会出现 `_apt` 沙盒回退提示？<br>
   [A] 当本地 `.deb` 所在路径对 `_apt` 用户不可遍历时，就会出现该提示，例如 home 目录权限为 `750`。可先把包复制到 `/tmp/` 等 `_apt` 可访问路径，再执行安装，例如 `cp ~/Desktop/axhelix_0.5.0-1_amd64.deb /tmp/ && sudo apt install /tmp/axhelix_0.5.0-1_amd64.deb`。

## 7. 附录

<a id="build-glibc-matrix"></a>

### 7.1. glibc / 动态链接器矩阵

| host  | glibc | `.interp`                    |
| ----- | ----- | ---------------------------- |
| arm64 | 2.30  | `/lib/ld-linux-aarch64.so.1` |
| x86   | 2.30  | `/lib64/ld-linux-x86-64.so.2` |

### 7.2. 工具链文件索引

本表列出正式支持的 Linux 工具链文件。除 `ax8860` 外，其余 host 均使用 Zig 工具链；本表不列 Windows toolchain 及 `build/cmake/toolchains/` 下的其他文件。

| host × libc  | 工具链文件（位于 `build/cmake/toolchains/`） |
| ------------ | -------------------------------------------- |
| arm64 / gnu  | `aarch64-linux-gnu-zig.cmake`                |
| x86 / gnu    | `x86_64-linux-gnu-zig.cmake`                 |
| ax8860 / gnu | `ax8860-linux-gnu-gcc.cmake`（GNU 交叉工具链，不用 zig） |
