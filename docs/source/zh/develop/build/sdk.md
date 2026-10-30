# SDK 准备

## 1. 解压 SDK 包

1. 使用 `tar -xzvf` 解压 SDK 包。

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

2. 在解压目录中执行 `./sdk_unpack.sh`，释放全部 SDK 源码。

```{note}
`./sdk_unpack.sh` 会下载 kernel、U-Boot、OP-TEE、ATF 等开源组件的源码包，并打上 SDK 补丁，因此需要确保机器能够连接互联网。无法连接互联网时，请提前下载这些源码包，并通过 `-k`（kernel）、`-u`（U-Boot）、`-o`（OP-TEE）、`-a`（ATF）传入其绝对路径。文件名必须与脚本预期一致，可执行 `./sdk_unpack.sh -h` 查看。
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

`./sdk_unpack.sh` 执行完成后，SDK 目录如下所示：

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

## 3. axcl 目录

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

| 目录名    | 目录说明          |
| --------- | ----------------- |
| 3rdparty  | 第三方组件        |
| build     | 主控端编译入口（`build/Makefile`）及 CMake 配置 |
| component | 主控端与设备端共用的组件 |
| device    | 设备端源码        |
| drv       | 内核驱动源码及编译入口（`drv/build/Makefile`） |
| docs      | 文档源文件        |
| host      | 主控端源码，包括运行时库、工具、示例和测试 |
| include   | 对外及内部头文件  |
| python    | Python 绑定（pyAXCL） |
| scripts   | 打包、minidump 符号抽取等辅助脚本 |
