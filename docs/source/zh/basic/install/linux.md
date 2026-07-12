# Linux

本文说明如何在 Linux 主控端通过 AXCL 发布包安装、验证和卸载 AXCL 运行环境，适用于 `.deb` 和 `.rpm` 两类包。安装包会把 AXCL 用户态文件安装到系统目录，同时在安装阶段编译并安装主控端内核模块。

```{note}
本文以包名 `axhelix`、示例文件 `axhelix_linux_x64_gnu.deb` 和 `axhelix_linux_x64_gnu.rpm` 为例。实际文件名会随 host、libc、版本或发布配置变化，请以实际产物为准。
```

## 1. 硬件安装

安装驱动包前，请先确认主控已正确接入子卡硬件：

1. 关闭主控电源。
2. 将 M.2 模组或 PCIe 板卡安装到主控对应插槽，并确认固定牢靠。
3. 重新启动主控。
4. 使用 `lspci` 检查设备是否已被系统识别。

```bash
$ lspci
0000:01:00.0 Processing accelerators: Axera Semiconductor Co., Ltd Device 8860 (rev 01)
```

如果 `lspci` 输出中无法看到对应的设备，请先检查硬件安装、主控 BIOS/UEFI PCIe 配置、插槽供电和线缆连接，再继续安装软件包。

## 2. 安装包

请先确认已经拿到适配当前主控架构和 libc 的 AXCL 安装包。例如：

```bash
ls axhelix_linux_*_*.deb
ls axhelix_linux_*_*.rpm
```

包文件名通常包含以下信息：

| 字段 | 示例 | 说明 |
| ---- | ---- | ---- |
| 包名 | `axhelix` | AXCL 包管理器名称。 |
| 系统 | `linux` | 当前包面向 Linux 主控。 |
| host | `x64` | 主控 CPU 架构。常见值包括 `x64`、`aarch64`、`loongarch64`、`riscv64`。 |
| libc | `gnu` | 主控 libc 类型。 |

## 3. 安装环境

AXCL 包安装脚本会在当前运行内核上构建并安装内核驱动模块，因此主控系统需要具备：

- 可用的 C/C++ 构建工具，例如 `gcc`、`make`、`cmake`。
- `dkms`。安装脚本优先使用 DKMS；如果 DKMS 不可用或构建失败，会尝试回退到 native make 构建。
- 与 `uname -r` 完全匹配的内核头文件或 kernel-devel。
- `kmod` 工具集，提供 `depmod`、`modprobe` 等命令。

```{warning}
内核头文件版本必须与当前运行内核匹配。若 `/lib/modules/$(uname -r)/build` 不存在或不完整，安装阶段的内核模块构建会失败。
```

## 4. DEB

本节适用于 Ubuntu、Debian 等使用 APT/dpkg 的系统。以下命令以 Ubuntu 22.04 为例。

### 4.1. 环境

```bash
# 刷新 APT 包索引
sudo apt update

# 安装 gcc、make、cmake 和 DKMS
sudo apt install gcc make cmake dkms

# 安装与当前运行内核匹配的 headers
sudo apt install linux-headers-$(uname -r)
```

### 4.2. 安装

在安装包所在目录执行：

```bash
sudo apt install ./axhelix_linux_x64_gnu.deb
```

安装过程中，包脚本会完成以下工作：

1. 将 AXCL 文件安装到 `/usr/local/axhelix`。
2. 将驱动源码安装到 `/usr/src/axhelix-<version>`。
3. 通过 DKMS 或 native make 构建并安装内核模块。
4. 生成模块加载配置和模块依赖配置。
5. 写入动态链接器配置、shell 环境配置和 CMake package wrapper。
6. 按依赖顺序加载驱动。
7. 写入安装状态文件 `/var/lib/axhelix/install-state`。

```{note}
如果 `apt install ./xxx.deb` 提示 `_apt` 沙盒无法访问本地文件，通常是因为当前目录对 `_apt` 用户不可遍历。可先将 `.deb` 拷贝到 `/tmp` 等可访问目录后再安装，例如：`cp axhelix_linux_x64_gnu.deb /tmp/ && sudo apt install /tmp/axhelix_linux_x64_gnu.deb`。
```

:::{important}
安装完成后，请在当前 shell 执行一次以下命令，让 `/etc/profile.d/axhelix.sh` 中的 AXCL 环境配置立即生效：

```bash
source /etc/profile
```

后续新登录的 shell 会自动加载该配置。
:::

### 4.3. 验证

安装完成后，可使用以下命令检查包管理状态、安装状态、安装目录和模块加载情况：

```bash
# 查看 APT 包元数据
apt show axhelix

# 查看 dpkg 安装状态
dpkg -s axhelix

# 查看 AXCL 安装状态
cat /var/lib/axhelix/install-state

# 查看安装目录
ls /usr/local/axhelix

# 查看内核模块是否已加载
lsmod | grep -E '^ax_'
```

`/var/lib/axhelix/install-state` 中常见字段如下：

| 字段 | 说明 |
| ---- | ---- |
| `state` | 安装状态。`success` 表示安装和模块加载成功；`degraded-success` 表示模块构建成功但自动加载失败；`failure` 表示安装失败。 |
| `version` | 已安装的 AXCL 包版本。 |
| `method` | 内核模块构建方式，常见值为 `dkms` 或 `native-make`。 |
| `kernel` | 安装时使用的运行内核版本。 |
| `reason` | 状态原因，例如 `ok`、`modprobe-failed`、`native-make` 等。 |

```{note}
安装脚本会写入 `/etc/profile.d/axhelix.sh`。若当前 shell 无法直接找到 AXCL 命令或库路径，请先确认当前 shell 已执行过 `source /etc/profile`。
```

### 4.4. 卸载

如需卸载 AXCL 包内容，但保留包管理器配置文件（如果存在），执行：

```bash
sudo apt remove axhelix
```

如需彻底清理包内容和包管理器配置文件，执行：

```bash
sudo apt purge axhelix
```

卸载脚本会尝试清理 AXCL 安装阶段生成的 DKMS/native make 模块、驱动源码、模块配置、动态链接器配置、shell 环境配置、CMake package wrapper 和安装状态文件。

## 5. RPM

本节适用于 CentOS、openEuler 等使用 DNF/RPM 的系统。不同发行版的软件源和内核开发包命名可能略有差异，请以发行版实际包名为准。

### 5.1. 环境

```bash
# 安装 gcc、make、cmake 和 DKMS
sudo dnf install gcc make cmake dkms

# 安装与当前运行内核匹配的 kernel-devel 和 kernel-headers
sudo dnf install kernel-devel-$(uname -r) kernel-headers-$(uname -r)
```

### 5.2. 安装

在安装包所在目录执行：

```bash
sudo dnf install ./axhelix_linux_x64_gnu.rpm
```

RPM 安装脚本执行的系统侧配置与 DEB 包一致，包括安装 AXCL 文件、构建并安装内核模块、写入环境配置和记录安装状态。

:::{important}
安装完成后，请在当前 shell 执行一次以下命令，让 `/etc/profile.d/axhelix.sh` 中的 AXCL 环境配置立即生效：

```bash
source /etc/profile
```

后续新登录的 shell 会自动加载该配置。
:::

### 5.3. 验证

```bash
# 查看 DNF 包元数据
dnf info axhelix

# 查看 RPM 安装状态
rpm -qi axhelix

# 查看 AXCL 安装状态
cat /var/lib/axhelix/install-state

# 查看安装目录
ls /usr/local/axhelix

# 查看内核模块是否已加载
lsmod | grep -E '^ax_'
```

### 5.4. 卸载

推荐通过 DNF 卸载：

```bash
sudo dnf remove axhelix
```

也可以直接通过 RPM 卸载：

```bash
sudo rpm -e axhelix
```

## 6. 常见问题

### 6.1. 安装失败后如何定位原因？

优先查看包脚本日志和安装状态：

```bash
cat /var/lib/axhelix/install-state
sudo cat /var/log/axhelix/install.log
```

如果日志中提示内核 build tree 缺失，请确认 `/lib/modules/$(uname -r)/build` 存在，并安装与当前内核匹配的 headers 或 kernel-devel。

### 6.2. `state=degraded-success` 是否表示安装失败？

不是。`degraded-success` 表示内核模块已经构建并安装成功，但安装脚本自动加载驱动失败。此时可根据 `/var/log/axhelix/install.log` 中的错误信息排查设备、权限、Secure Boot 或模块依赖问题；处理完成后，可重新触发安装配置流程或按日志提示加载对应驱动，再通过 `lsmod` 查看 `ax_` 前缀的驱动模块：

```bash
lsmod | grep -E '^ax_'
```

### 6.3. 如何确认使用了 DKMS 还是 native make？

查看安装状态文件中的 `method` 字段：

```bash
grep '^method=' /var/lib/axhelix/install-state
```

`method=dkms` 表示通过 DKMS 构建和安装内核模块；`method=native-make` 表示通过驱动源码中的 Makefile 直接构建和安装。

### 6.4. 卸载后为什么当前 shell 仍然保留 AXCL 环境变量？

卸载脚本会删除 `/etc/profile.d/axhelix.sh`，但已经启动的 shell 不会自动撤销此前加载过的环境变量。请退出当前 shell 后重新登录，或新开一个 shell 再验证。

## 7. 高级说明

### 7.1. 安装后的系统路径

AXCL 包安装后会写入或使用以下系统路径。排查安装、运行或卸载问题时，可优先查看这些位置。

| 路径 | 说明 |
| ---- | ---- |
| `/usr/local/axhelix` | AXCL 默认安装目录，包含 `bin`、`lib`、`include`、`test` 等子目录。 |
| `/usr/local/axhelix/bin/axcl.json` | AXCL 包配置文件。 |
| `/usr/local/axhelix/src/drv` | 包内携带的驱动源码 payload。 |
| `/usr/src/axhelix-<version>` | 安装脚本展开后的驱动源码目录，用于 DKMS 或 native make 构建。 |
| `/lib/modules/$(uname -r)/extra/axhelix` | 当前内核下 AXCL 内核模块安装目录。 |
| `/var/lib/axhelix/install-state` | 安装状态记录。 |
| `/var/log/axhelix/install.log` | 安装日志。 |
| `/var/log/axhelix/uninstall.log` | 卸载日志。 |
| `/etc/profile.d/axhelix.sh` | shell 环境配置，设置 `PATH`、`LD_LIBRARY_PATH`、`CMAKE_PREFIX_PATH`。 |
| `/etc/ld.so.conf.d/axhelix.conf` | 动态链接器配置。 |
| `/etc/modules-load.d/axhelix.conf` | 开机模块加载配置。 |
| `/etc/modprobe.d/axhelix.conf` | 模块依赖配置。 |
| `/usr/lib/cmake/axcl`、`/usr/lib64/cmake/axcl` | 系统级 CMake package wrapper，便于下游工程 `find_package(axcl)`。 |
