# 内核态

本文档说明如何编译 `axcl/drv/` 下的 out-of-tree 内核模块。

当前顶层默认模块：
- `ax_comm`
- `axcl_rt`

## 1. 环境依赖

要求：
- `make`
- C 编译工具链
- 已准备好的内核 build 目录
- `readelf`、`strings`、`strip`

默认内核 build 目录：

```text
/lib/modules/$(uname -r)/build
```

仓库内集成交叉编译场景下，`KERNEL_DIR` 需要指向内核 build output 目录。下面示例使用的是相对于 `axcl/drv/build` 的相对路径。

## 2. Usage

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

## 3. 本机编译

对当前运行内核执行构建和安装：

```bash
cd axcl/drv/build
make clean && make all install
```

其中 `all` 只会在 `drv/build/out/...` 下生成模块，`install` 才会把 `.ko` 安装到 `drv/build/ko/...`。

## 4. 交叉编译

针对仓库内 arm64 内核 build output 进行构建和安装：

```bash
cd axcl/drv/build
make ARCH=arm64 \
  CROSS_COMPILE=/usr/local/gcc-linaro-14.0.0-2023.06-x86_64_aarch64-linux-gnu/bin/aarch64-linux-gnu- \
  KERNEL_DIR=../../../build/out/AX8860_emmc_glibc/objs/kernel/linux/linux-6.6.105 \
  clean && \
make ARCH=arm64 \
  CROSS_COMPILE=/usr/local/gcc-linaro-14.0.0-2023.06-x86_64_aarch64-linux-gnu/bin/aarch64-linux-gnu- \
  KERNEL_DIR=../../../build/out/AX8860_emmc_glibc/objs/kernel/linux/linux-6.6.105 \
  all install
```

```{note}
- `KERNEL_DIR` 是相对于当前工作目录解释的。
- `KERNEL_VER` 会优先读取 `$(KERNEL_DIR)/include/config/kernel.release`。
- 单模块子目录构建时，需要传入相对于该子目录的内核 build output 路径。
```

例如从 `axcl/drv/src/comm` 执行：

```bash
cd axcl/drv/src/comm
make ARCH=arm64 \
  CROSS_COMPILE=/usr/local/gcc-linaro-14.0.0-2023.06-x86_64_aarch64-linux-gnu/bin/aarch64-linux-gnu- \
  KERNEL_DIR=../../../../build/out/AX8860_emmc_glibc/objs/kernel/linux/linux-6.6.105 \
  clean && \
make ARCH=arm64 \
  CROSS_COMPILE=/usr/local/gcc-linaro-14.0.0-2023.06-x86_64_aarch64-linux-gnu/bin/aarch64-linux-gnu- \
  KERNEL_DIR=../../../../build/out/AX8860_emmc_glibc/objs/kernel/linux/linux-6.6.105 \
  all install
```

## 5. 输出目录

```text
axcl/drv/build/
├── out/<arch>-<kernel>/
│   ├── ax_comm/
│   │   └── ax_comm.ko
│   └── axcl_rt/
│       └── axcl_rt.ko
└── ko/<arch>-<kernel>/
    ├── debug/
    │   ├── ax_comm.ko
    │   └── axcl_rt.ko
    └── release/
        ├── ax_comm.ko
        └── axcl_rt.ko
```

`debug/` 目录保存未 strip 的模块，`release/` 目录保存执行 `strip --strip-debug` 后的模块。
