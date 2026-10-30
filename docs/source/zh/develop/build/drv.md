# 内核态

本文档说明如何编译 `axcl/drv/` 下的 out-of-tree 内核模块。

在 `axcl/drv/build` 中执行 `make` 时构建以下模块（每个模块在其依赖模块之后构建）：
- `ax_pcieh_core`
- `ax_pcieh_xfer`
- `ax_pcieh_dbg`
- `ax_pcieh_vnet`
- `ax_comm`
- `axcl_rt`
- `ax_vtty`

如果目标内核启用了 `CONFIG_AXERA_LOCAL_DEVICE=y`（例如 `AX8860_emmc` SDK 工程的内核），还会构建 `axcl_dev` 和 `axcl_wk_monitor`。

## 1. 环境依赖

要求：
- `make`
- 与目标内核匹配的 C 编译工具链
- 已完成配置和编译的内核 build 目录，需提供 `Module.symvers`，通常也提供 `include/config/kernel.release`
- `strip`，供 `install` 使用（设置 `CROSS_COMPILE` 时使用 `<CROSS_COMPILE>strip`）

默认内核 build 目录：

```text
/lib/modules/$(uname -r)/build
```

本机编译时，需要安装与当前运行内核匹配的内核头文件，使该目录存在（例如 Ubuntu 上的 `linux-headers-$(uname -r)`）。

交叉编译时，需要将 `KERNEL_DIR` 设置为内核 build output 目录。在 SDK 中，该目录为 `build/out/<project>_glibc/objs/kernel/linux/linux-<version>`，完成 SDK 内核编译后才会生成。下面示例使用的是相对于 `axcl/drv/build` 的相对路径。

## 2. 用法

```text
Usage: make [target] [ARCH=<arch>] [CROSS_COMPILE=<prefix>] [KERNEL_DIR=<path>]

Targets:
  all                          Build module outputs under drv/build/out/<arch>-<kernel>/
  install                      Copy ko files into drv/build/ko/<arch>-<kernel>/{debug,release}/
  clean                        Remove outputs for the current <arch>-<kernel>
  distclean                    Remove drv/build/out/<arch>-<kernel> and drv/build/ko/<arch>-<kernel>
  help                         Show help

Options:
  ARCH=<arch>                  Target arch (e.g., arm64)
  CROSS_COMPILE=<prefix>       Cross toolchain prefix (e.g., aarch64-linux-gnu-)
  KERNEL_DIR=<path>            Path to kernel build tree

Example:
  1. make clean && make all install
  2. make ARCH=arm64 CROSS_COMPILE=aarch64-linux-gnu- KERNEL_DIR=/path/to/kernel clean && make ARCH=arm64 CROSS_COMPILE=aarch64-linux-gnu- KERNEL_DIR=/path/to/kernel all install
```

输出路径中的 `<arch>` 为 `ARCH` 的值（未设置 `ARCH` 时为 `uname -m`），`<kernel>` 为 `KERNEL_DIR` 对应内核的版本号。

## 3. 本机编译

对当前运行内核执行构建和安装：

```bash
cd axcl/drv/build
make clean && make all install
```

其中 `all` 在 `drv/build/out/...` 下构建模块；`install` 会在需要时先构建模块，再把 `.ko` 复制到 `drv/build/ko/...`。

## 4. 交叉编译

针对 SDK 的 arm64 内核 build output（本例为 `AX8860_emmc` 项目）进行构建和安装：

```bash
cd axcl/drv/build
make ARCH=arm64 \
  CROSS_COMPILE=/usr/local/arm-gnu-toolchain-13.3.rel1-x86_64-aarch64-none-linux-gnu/bin/aarch64-none-linux-gnu- \
  KERNEL_DIR=../../../build/out/AX8860_emmc_glibc/objs/kernel/linux/linux-6.18.33 \
  clean && \
make ARCH=arm64 \
  CROSS_COMPILE=/usr/local/arm-gnu-toolchain-13.3.rel1-x86_64-aarch64-none-linux-gnu/bin/aarch64-none-linux-gnu- \
  KERNEL_DIR=../../../build/out/AX8860_emmc_glibc/objs/kernel/linux/linux-6.18.33 \
  all install
```

```{note}
- 相对路径形式的 `KERNEL_DIR` 以执行 `make` 的目录为基准解析。
- 输出路径中的 `<kernel>` 从 `$(KERNEL_DIR)/include/config/kernel.release` 读取；该文件不存在时使用 `uname -r`。
- 也可以在 `axcl/drv/src/` 下的单个模块目录中执行 `make`。由于需要链接 `drv/build/out/` 下依赖模块的 `Module.symvers`，其依赖模块必须已针对相同的 `<arch>-<kernel>` 完成构建。例如，`ax_comm` 依赖 `ax_pcieh_core` 和 `ax_pcieh_xfer`。`distclean` 仅在 `axcl/drv/build` 和 `axcl/drv/src` 中可用。
- 各模块目录到内核 build output 的相对层级不同（例如 `axcl/drv/src/comm` 比 `axcl/drv/src/pcie/host/core` 浅两层）。建议使用绝对 `KERNEL_DIR`，同一取值即可在任意模块目录下使用。
```

例如从 `axcl/drv/src/comm` 执行，使用绝对 `KERNEL_DIR`：

```bash
cd axcl/drv/src/comm
KDIR=$(realpath ../../../../build/out/AX8860_emmc_glibc/objs/kernel/linux/linux-6.18.33)
make ARCH=arm64 \
  CROSS_COMPILE=/usr/local/arm-gnu-toolchain-13.3.rel1-x86_64-aarch64-none-linux-gnu/bin/aarch64-none-linux-gnu- \
  KERNEL_DIR=$KDIR \
  clean && \
make ARCH=arm64 \
  CROSS_COMPILE=/usr/local/arm-gnu-toolchain-13.3.rel1-x86_64-aarch64-none-linux-gnu/bin/aarch64-none-linux-gnu- \
  KERNEL_DIR=$KDIR \
  all install
```

同一 `KDIR` 取值在更深的模块目录（如 `axcl/drv/src/pcie/host/core`）下同样可用，而相对路径在那里需写成 `../../../../../../build/...`。

## 5. 输出目录

```text
axcl/drv/build/
├── out/<arch>-<kernel>/
│   ├── ax_pcieh_core/
│   │   └── ax_pcieh_core.ko
│   ├── ax_pcieh_xfer/
│   │   └── ax_pcieh_xfer.ko
│   ├── ax_pcieh_dbg/
│   │   └── ax_pcieh_dbg.ko
│   ├── ax_pcieh_vnet/
│   │   └── ax_pcieh_vnet.ko
│   ├── ax_comm/
│   │   └── ax_comm.ko
│   ├── axcl_rt/
│   │   └── axcl_rt.ko
│   └── ax_vtty/
│       └── ax_vtty.ko
└── ko/<arch>-<kernel>/
    ├── debug/
    │   ├── ax_pcieh_core.ko
    │   ├── ax_pcieh_xfer.ko
    │   ├── ax_pcieh_dbg.ko
    │   ├── ax_pcieh_vnet.ko
    │   ├── ax_comm.ko
    │   ├── axcl_rt.ko
    │   └── ax_vtty.ko
    └── release/
        ├── ax_pcieh_core.ko
        ├── ax_pcieh_xfer.ko
        ├── ax_pcieh_dbg.ko
        ├── ax_pcieh_vnet.ko
        ├── ax_comm.ko
        ├── axcl_rt.ko
        └── ax_vtty.ko
```

`debug/` 目录保存构建生成的原始模块，`release/` 目录保存同一批模块执行 `strip --strip-debug` 后的版本。构建了 `axcl_dev` 和 `axcl_wk_monitor` 时，它们也会出现在相同位置。
