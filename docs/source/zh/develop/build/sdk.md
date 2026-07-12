# SDK 准备

## 1. 解压 SDK 包

1. 使用 `tar -xzvf` 解压 SDK `tar.gz` 包。

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

2. 进入解压目录，执行 `./sdk_unpack.sh` 释放全部 SDK 源码。

```{note}
解压 SDK 包时会从网络拉取开源组件（比如 kernel、uboot、optee、atf 等），请确保编译服务器能够连接互联网，详细参阅 `./sdk_unpack.sh` 脚本。
```

```bash
root:~/sdk/AXHELIX_SDK_Vxxx$ ./sdk_unpack.sh
++ pwd
+ LOCAL_PATH=/xxx/AXHELIX_SDK_Vxxx
+ UBOOT_PACKAGE=u-boot-2026.01.tar.bz2
...
================= SDK unpack complete! ===================
```

## 2. SDK 目录

解压后的 SDK 目录如下所示：

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

## 3. axcl 目录

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

| 目录名    | 目录说明          |
| --------- | ----------------- |
| 3rdparty  | 第三方组件        |
| build     | 编译构建          |
| component | 功能组件          |
| device    | 设备端源码        |
| drv       | 驱动源码          |
| host      | 主控端源码        |
| include   | 头文件            |
| python    | Python 源码       |
| scripts   | 脚本              |
