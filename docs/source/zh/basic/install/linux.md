# Linux

本文说明如何在 Linux 主控端通过 AXCL 发布包安装、验证和卸载 AXCL 运行环境，适用于 `.deb` 和 `.rpm` 两类包。安装包会把 AXCL 用户态文件安装到系统目录，同时在安装阶段编译并安装主控端内核模块。

```{note}
本文以包名 `axhelix`、示例文件 `axhelix_0.2.0-1_amd64.deb` 和 `axhelix-0.2.0-1.x86_64.rpm` 为例。实际包名、版本和架构以实际产物为准；使用 `axhelix-ax8860` 时，将命令中的包名替换为对应包名。
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

请先确认已经拿到适配当前主控的 AXCL 安装包。例如：

```bash
ls axhelix*.deb
ls axhelix*.rpm
```

包文件名按 Debian / RPM 惯例命名：

- DEB：`<包名>_<版本>-<修订>_<架构>.deb`，例如 `axhelix_0.2.0-1_amd64.deb`
- RPM：`<包名>-<版本>-<release>.<架构>.rpm`，例如 `axhelix-0.2.0-1.x86_64.rpm`

按主控选择要安装的包：

| 主控 | DEB | RPM |
| ---- | --- | --- |
| x86_64（`uname -m` 显示 `x86_64`） | `axhelix_<版本>_amd64.deb` | `axhelix-<版本>.x86_64.rpm` |
| ARM64 通用主控（`uname -m` 显示 `aarch64`），通过 PCIe 连接 AX8860 加速卡 | `axhelix_<版本>_arm64.deb` | `axhelix-<版本>.aarch64.rpm` |
| 主控本身是 AX8860 芯片 | 直接下载 AXP | 直接下载 AXP |

```{note}
DEB 与 RPM 对同一 CPU 架构的写法不同：x86_64 在 DEB 中记作 `amd64`，ARM64 记作 `arm64`。`uname -m` 输出的是 CPU 名称（`x86_64`、`aarch64`），不是包文件名中的架构字段。

通用 ARM64 主控与 AX8860 芯片主控的 `uname -m` 都是 `aarch64`，按主控本身是不是 AX8860 芯片区分：主控本身是 AX8860 时，驱动、用户态库和配置已随 rootfs 提供，直接烧写对应版本的 AXP 即可，无需安装 AXCL 包。
```

| 字段 | 示例 | 说明 |
| ---- | ---- | ---- |
| 包名 | `axhelix` | AXCL 包管理器名称，按主控类型区分，见下表。 |
| 版本 | `0.2.0-1` | 软件版本与打包修订号。 |
| 架构 | `amd64` / `x86_64` | 主控 CPU 架构，DEB 为 `amd64` 或 `arm64`，RPM 为 `x86_64` 或 `aarch64`。 |

请按实际主控选择包名：

| 包名 | 适用主控 | libc 依赖 |
| ---- | ---- | ---- |
| `axhelix` | 通用 x86_64 / ARM64 主控，通过 PCIe 连接 AX8860 加速卡 | glibc ≥ 2.30 |
| `axhelix-ax8860` | 主控本身是 AX8860 芯片，由该芯片自己驱动板上的设备侧 | glibc ≥ 2.38 |

```{important}
两个包互斥，同一台主控只能安装其中一个。`axhelix` 与 `axhelix-ax8860` 的 ARM64 包架构相同，装错时安装脚本会拒绝安装并提示应使用哪个包，不会解包或修改系统配置。

AX8860 的 SDK 支持把 host 直接编进 debian rootfs（`make p=AX8860_emmc ROOTFS_FLAVOR=debian`）。这种情况下烧写 AXP 后驱动、用户态库和配置都已就位，无需再安装 `axhelix-ax8860` 包；如仍安装，安装脚本会接管同路径的文件。

两个包的安装路径、日志、状态文件和内核模块名都相同（`/usr/local/axhelix`、`/var/log/axhelix`、`axhelix` 等），下文命令中只有包名需要替换。
```

## 3. 安装环境

AXCL 包安装脚本会在当前运行内核上构建并安装内核驱动模块，因此主控系统需要具备：

- 可用的 C/C++ 构建工具，例如 `gcc`、`make`、`cmake`。
- `dkms`。安装脚本优先使用 DKMS；如果 DKMS 不可用或构建失败，会尝试回退到 native make 构建。native make 构建的模块不会在内核升级后自动重建。包以弱依赖声明 `dkms`（DEB `Recommends`、RPM `Recommends`），`apt` / `dnf` 默认会在软件源提供 `dkms` 时一并安装；RHEL / CentOS / Rocky 等系统的 `dkms` 位于 EPEL。
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
sudo apt install ./axhelix_0.2.0-1_amd64.deb
```

安装过程中，包脚本会完成以下工作：

1. 将 AXCL 文件安装到 `/usr/local/axhelix`。
2. 将构包时传入的 PAC 固件安装到 `/lib/firmware/axcl/ax8860_card.pac`。
3. 将驱动源码安装到 `/usr/src/axhelix-<version>`。
4. 通过 DKMS 或 native make 构建并安装内核模块。
5. 刷新动态链接器缓存（`ldconfig`），并写入 CMake package wrapper。
6. 按依赖顺序加载驱动。
7. 写入安装状态文件 `/var/lib/axhelix/install-state`。

模块加载配置、模块参数配置、动态链接器配置和 shell 环境配置随包安装，归包管理器所有，可用 `dpkg -S` 或 `rpm -qf` 查询所属的包。

```{note}
如果 `apt install ./xxx.deb` 提示 `_apt` 沙盒无法访问本地文件，通常是因为当前目录对 `_apt` 用户不可遍历。可先将 `.deb` 拷贝到 `/tmp` 等可访问目录后再安装，例如：`cp axhelix_0.2.0-1_amd64.deb /tmp/ && sudo apt install /tmp/axhelix_0.2.0-1_amd64.deb`。
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
lsmod | grep -E '^ax'
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
`/etc/profile.d/axhelix.sh` 随包安装。若当前 shell 无法直接找到 AXCL 命令，请先确认当前 shell 已执行过 `source /etc/profile`。
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

随包安装的模块配置、动态链接器配置和 shell 环境配置由包管理器删除；卸载脚本清理安装阶段生成的 DKMS/native make 模块、驱动源码、CMake package wrapper 和安装状态文件。AXCL 包不声明 conffile，`apt remove` 与 `apt purge` 删除的系统配置相同。

卸载还会删除 `/lib/firmware/axcl/ax8860_card.pac`，并仅在 `/lib/firmware/axcl` 为空时删除该目录。安装前已存在但未受 package manager 管理的同名文件会被 payload 覆盖，不备份、不恢复。AXCL package 不支持原位升级或重装；请先卸载旧 package，再安装新 package。

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
sudo dnf install ./axhelix-0.2.0-1.x86_64.rpm
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
lsmod | grep -E '^ax'
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
lsmod | grep -E '^ax'
```

### 6.3. 如何确认使用了 DKMS 还是 native make？

查看安装状态文件中的 `method` 字段：

```bash
grep '^method=' /var/lib/axhelix/install-state
```

`method=dkms` 表示通过 DKMS 构建和安装内核模块；`method=native-make` 表示通过驱动源码中的 Makefile 直接构建和安装。

### 6.4. 卸载后为什么当前 shell 仍然保留 AXCL 环境变量？

卸载时包管理器会删除 `/etc/profile.d/axhelix.sh`，但已经启动的 shell 不会自动撤销此前加载过的环境变量。请退出当前 shell 后重新登录，或新开一个 shell 再验证。

### 6.5. 提示 "package targets ... hosts but kernel ... is ..." 怎么办？

说明安装包与当前主控不匹配。按提示换包即可：

| 提示 | 含义 | 处理 |
| ---- | ---- | ---- |
| `install the generic axhelix package instead` | 装了 `axhelix-ax8860`，但主控不是 AX8860 芯片 | 改装 `axhelix` |
| `install the axhelix-ax8860 package instead` | 装了 `axhelix`，但主控是 AX8860 芯片 | 改装 `axhelix-ax8860` |

如果看到 `cannot read kernel configuration: ...`，说明内核配置文件
`include/config/auto.conf` 缺失或不可读，安装脚本无法判断主控类型，因此拒绝安装。
请重新安装与当前内核匹配的 headers 或 kernel-devel 后重试。

该检查在解包前完成，不会安装任何文件、不会修改系统配置，也不会写入安装状态，直接重新安装正确的包即可。

```{note}
拒装前脚本已经初始化了日志，因此 `/var/log/axhelix/install.log` 会被创建或覆盖，上一轮的日志被轮转为 `install.log.prev`。如果需要保留之前的安装日志用于排查，请先备份再重试安装。
```

### 6.6. 如何在已安装的主控上更换包？

两个包互斥，例如在 AX8860 主控上误装了 `axhelix` 需要换成 `axhelix-ax8860`。

DEB 系统直接安装新包即可，APT 会先完整卸载冲突的旧包，再安装新包：

```bash
sudo apt install ./axhelix-ax8860_<version>_arm64.deb
```

RPM 系统必须先卸载、再安装，分两条命令执行：

```bash
sudo dnf remove axhelix
sudo dnf install ./axhelix-ax8860-<version>.aarch64.rpm
```

```{warning}
RPM 系统不要使用 `dnf swap` 或 `dnf install --allowerasing` 一步切换。RPM 在同一事务中先安装新包，再执行旧包的卸载脚本，旧包会删除新包刚生成的内核模块、驱动源码、CMake package wrapper 和安装状态文件。
```

### 6.7. 安装时提示 `ldconfig failed` 或 `ldconfig not found` 怎么办？

AXCL 库位于 `/usr/local/axhelix/lib`，不在系统默认搜索路径中。包内的 AXCL 程序通过 RUNPATH 找到这些库，不受影响；但按库名加载的程序（例如 `ffmpeg` 通过 `dlopen` 加载 `libaxcl_*.so`）以及用户自行编译、链接 AXCL 的程序，依赖安装脚本执行 `ldconfig` 刷新的缓存。

安装脚本执行 `ldconfig` 失败时不会中止安装，只会在安装结束时提示。按提示排除原因（例如根文件系统只读或磁盘已满）后，手动执行：

```bash
sudo ldconfig
ldconfig -p | grep /usr/local/axhelix/lib
```

第二条命令能列出 `libaxcl_rt.so` 等库即表示已恢复。

### 6.8. 开机日志出现 `Failed to find module 'ax_...'` 怎么办？

`/usr/lib/modules-load.d/axhelix.conf` 随包安装，开机时 `systemd-modules-load` 按其中的列表加载驱动。当前内核下没有对应模块时，系统记录该日志，不影响开机。systemd 245 及以上版本中 `systemd-modules-load` 服务状态仍为成功；更早的版本（如 RHEL/openEuler 8 系列的 systemd 239）会将该服务标记为 failed。常见原因：

- 安装未完成（例如安装脚本失败后包处于半配置状态）：按 6.1 排查。DEB 系统修复后执行 `sudo dpkg --configure -a`；RPM 系统先用 `sudo dnf remove` 卸载该包，修复后重新安装。
- 升级内核后未安装新内核的 headers，DKMS 无法为新内核构建模块：安装与当前内核匹配的 headers 或 kernel-devel 后执行 `sudo dkms autoinstall`。

## 7. 高级说明

### 7.1. 安装后的系统路径

AXCL 包安装后会写入或使用以下系统路径。排查安装、运行或卸载问题时，可优先查看这些位置。

| 路径 | 说明 |
| ---- | ---- |
| `/usr/local/axhelix` | AXCL 默认安装目录，包含 `bin`、`lib`、`include`、`test` 等子目录。 |
| `/lib/firmware/axcl/ax8860_card.pac` | package 管理的设备 PAC 固件，固定路径和文件名。 |
| `/usr/local/axhelix/bin/axcl.json` | AXCL 包配置文件。 |
| `/usr/local/axhelix/src/drv` | 包内携带的驱动源码 payload。 |
| `/usr/src/axhelix-<version>` | 安装脚本展开后的驱动源码目录，用于 DKMS 或 native make 构建。 |
| `/lib/modules/$(uname -r)/extra/axhelix` | 当前内核下 AXCL 内核模块安装目录。 |
| `/var/lib/axhelix/install-state` | 安装状态记录。 |
| `/var/log/axhelix/install.log` | 安装日志。 |
| `/var/log/axhelix/uninstall.log` | 卸载日志。 |
| `/etc/profile.d/axhelix.sh` | 随包安装的 shell 环境配置，设置 `PATH`、`CMAKE_PREFIX_PATH`、`PKG_CONFIG_PATH`。 |
| `/etc/ld.so.conf.d/axhelix.conf` | 随包安装的动态链接器配置。 |
| `/usr/lib/modules-load.d/axhelix.conf` | 随包安装的开机模块加载配置。如需调整，在 `/etc/modules-load.d/` 下放置同名文件覆盖，升级不会修改该文件。 |
| `/lib/modprobe.d/axhelix.conf` | 随包安装的模块参数配置。如需调整，在 `/etc/modprobe.d/` 下放置同名文件覆盖。 |
| `/usr/lib/cmake/axcl`、`/usr/lib64/cmake/axcl` | 系统级 CMake package wrapper，便于下游工程 `find_package(axcl)`。 |
