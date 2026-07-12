# Kernel Space

This document describes how to build the out-of-tree kernel modules under `axcl/drv/`.

Current top-level default modules:
- `ax_comm`
- `axcl_rt`

## 1. Environment Dependencies

Requirements:
- `make`
- C compiler toolchain
- Prepared kernel build directory
- `readelf`, `strings`, and `strip`

Default kernel build directory:

```text
/lib/modules/$(uname -r)/build
```

For integrated cross-compilation inside the repository, `KERNEL_DIR` must point to the kernel build output directory. The following examples use paths relative to `axcl/drv/build`.

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

## 3. Native Build

Build and install for the currently running kernel:

```bash
cd axcl/drv/build
make clean && make all install
```

The `all` target only generates modules under `drv/build/out/...`; the `install` target copies `.ko` files to `drv/build/ko/...`.

## 4. Cross Compilation

Build and install against the in-repository arm64 kernel build output:

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
- `KERNEL_DIR` is interpreted relative to the current working directory.
- `KERNEL_VER` first reads `$(KERNEL_DIR)/include/config/kernel.release`.
- When building from a single module subdirectory, pass the kernel build output path relative to that subdirectory.
```

For example, from `axcl/drv/src/comm`:

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

## 5. Output Directory

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

The `debug/` directory stores unstripped modules, and the `release/` directory stores modules after `strip --strip-debug`.
