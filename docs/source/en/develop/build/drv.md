# Kernel Space

This document describes how to build the out-of-tree kernel modules under `axcl/drv/`.

Modules built by `make` in `axcl/drv/build` (each module is built after the modules it depends on):
- `ax_pcieh_core`
- `ax_pcieh_xfer`
- `ax_pcieh_dbg`
- `ax_pcieh_vnet`
- `ax_comm`
- `axcl_rt`
- `ax_vtty`

If the target kernel enables `CONFIG_AXERA_LOCAL_DEVICE=y` (for example, the `AX8860_emmc` SDK project kernel), `axcl_dev` and `axcl_wk_monitor` are also built.

## 1. Environment Dependencies

Requirements:
- `make`
- A C compiler toolchain that matches the target kernel
- A configured and built kernel build directory, which provides `Module.symvers` and usually `include/config/kernel.release`
- `strip`, used by `install` (with `CROSS_COMPILE` set, `<CROSS_COMPILE>strip` is used)

Default kernel build directory:

```text
/lib/modules/$(uname -r)/build
```

For native builds, install the kernel headers that match the running kernel so that this directory exists (for example, `linux-headers-$(uname -r)` on Ubuntu).

For cross compilation, set `KERNEL_DIR` to the kernel build output directory. In the SDK, it is `build/out/<project>_glibc/objs/kernel/linux/linux-<version>`, which exists after the SDK kernel has been built. The following examples use paths relative to `axcl/drv/build`.

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

In the output paths, `<arch>` is the `ARCH` value (`uname -m` when `ARCH` is not set), and `<kernel>` is the kernel release of `KERNEL_DIR`.

## 3. Native Build

Build and install for the currently running kernel:

```bash
cd axcl/drv/build
make clean && make all install
```

The `all` target builds the modules under `drv/build/out/...`; the `install` target builds them if needed and copies the `.ko` files to `drv/build/ko/...`.

## 4. Cross Compilation

Build and install against the arm64 kernel build output of the SDK (`AX8860_emmc` project in this example):

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
- A relative `KERNEL_DIR` is resolved against the directory where `make` runs.
- `<kernel>` in the output path is read from `$(KERNEL_DIR)/include/config/kernel.release`; if the file does not exist, `uname -r` is used.
- You can also run `make` in a single module directory under `axcl/drv/src/`. The modules it depends on must already be built for the same `<arch>-<kernel>`, because it links against their `Module.symvers` under `drv/build/out/`. For example, `ax_comm` needs `ax_pcieh_core` and `ax_pcieh_xfer`. `distclean` is only available in `axcl/drv/build` and `axcl/drv/src`.
- The relative depth to the kernel build output differs per module directory (for example, `axcl/drv/src/comm` is two levels shallower than `axcl/drv/src/pcie/host/core`). Prefer an absolute `KERNEL_DIR` so the same value works in any module directory.
```

For example, from `axcl/drv/src/comm`, using an absolute `KERNEL_DIR`:

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

The same `KDIR` value also works in a deeper module directory such as `axcl/drv/src/pcie/host/core`, whereas a relative path there would need `../../../../../../build/...` instead.

## 5. Output Directory

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

The `debug/` directory stores the modules as built, and the `release/` directory stores the same modules after `strip --strip-debug`. When `axcl_dev` and `axcl_wk_monitor` are built, they appear in the same places.
