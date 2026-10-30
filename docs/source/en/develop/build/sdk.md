# SDK Preparation

## 1. Extract the SDK Package

1. Extract the SDK package with `tar -xzvf`.

```bash
root:~/sdk$ tar -xzvf ./AXHELIX_SDK_Vxxx.tar.gz
AXHELIX_SDK_Vxxx/
AXHELIX_SDK_Vxxx/sdk_unpack.sh
AXHELIX_SDK_Vxxx/sdk_clean.sh
AXHELIX_SDK_Vxxx/package/
AXHELIX_SDK_Vxxx/package/rootfs.tar.gz
AXHELIX_SDK_Vxxx/package/boot.tar.gz
AXHELIX_SDK_Vxxx/package/build.tar.gz
AXHELIX_SDK_Vxxx/package/axcl.tar.gz
AXHELIX_SDK_Vxxx/package/app.tar.gz
AXHELIX_SDK_Vxxx/package/kernel.tar.gz
AXHELIX_SDK_Vxxx/package/knowledge-base.tar.gz
AXHELIX_SDK_Vxxx/package/third-party.tar.gz
AXHELIX_SDK_Vxxx/package/msp.tar.gz
AXHELIX_SDK_Vxxx/package/tools.tar.gz
```

2. In the extracted directory, run `./sdk_unpack.sh` to unpack the full SDK source tree.

```{note}
`./sdk_unpack.sh` downloads the open-source kernel, U-Boot, OP-TEE, and ATF source archives and applies the SDK patches to them, so the machine needs Internet access. Without Internet access, download the archives in advance and pass their absolute paths with `-k` (kernel), `-u` (U-Boot), `-o` (OP-TEE), and `-a` (ATF). The file names must match the ones the script expects; run `./sdk_unpack.sh -h` to see them.
```

```bash
root:~/sdk/AXHELIX_SDK_Vxxx$ ./sdk_unpack.sh
++ pwd
+ LOCAL_PATH=/xxx/AXHELIX_SDK_Vxxx
+ UBOOT_PACKAGE=u-boot-2026.01.tar.bz2
...
================= SDK unpack complete! ===================
```

## 2. SDK Directory

SDK directory after `./sdk_unpack.sh` completes:

```bash
AXHELIX_SDK_Vxxx/
├── app/
├── axcl/
├── boot/
├── build/
├── kernel/
├── knowledge-base/
├── msp/
├── package/
├── rootfs/
├── sdk_clean.sh
├── sdk_unpack.sh
├── third-party/
└── tools/
```

## 3. axcl Directory

```bash
axcl/
├── 3rdparty/
├── build/
├── component/
├── device/
├── docs/
├── drv/
├── host/
├── include/
├── python/
└── scripts/
```

| Directory | Description |
| --- | --- |
| 3rdparty | Third-party components |
| build | Host-side build entry (`build/Makefile`) and CMake configuration |
| component | Components shared by Host and device |
| device | Device-side source code |
| drv | Kernel driver source code and build entry (`drv/build/Makefile`) |
| docs | Documentation source |
| host | Host-side source code, including runtime libraries, tools, samples, and tests |
| include | Public and internal headers |
| python | Python bindings (pyAXCL) |
| scripts | Packaging, minidump symbol collection, and other helper scripts |
