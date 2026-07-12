# SDK Preparation

## 1. Extract the SDK Package

1. Extract the SDK `tar.gz` package with `tar -xzvf`.

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
AXHELIX_SDK_Vxxx/package/third-party.tar.gz
AXHELIX_SDK_Vxxx/package/msp.tar.gz
AXHELIX_SDK_Vxxx/package/tools.tar.gz
```

2. Enter the extracted directory and run `./sdk_unpack.sh` to unpack the full SDK source tree.

```{note}
When unpacking the SDK package, the script fetches open-source components from the network, such as kernel, uboot, optee, and atf. Make sure the machine can access the Internet. For details, see the `./sdk_unpack.sh` script.
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

Extracted SDK directory:

```bash
AXHELIX_SDK_Vxxx/
├── app/
├── axcl/
├── boot/
├── build/
├── kernel/
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
├── drv/
├── host/
├── include/
├── python/
└── scripts/
```

| Directory | Description |
| --- | --- |
| 3rdparty | Third-party components |
| build | Build system |
| component | Functional components |
| device | Device-side source code |
| drv | Driver source code |
| host | Host-side source code |
| include | Headers |
| python | Python source code |
| scripts | Scripts |
