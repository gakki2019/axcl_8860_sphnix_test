# Linux

This page describes how to install, verify, and uninstall the AXCL runtime environment on a Linux host by using AXCL release packages. It applies to `.deb` and `.rpm` packages. The package installs AXCL user-space files into system directories and builds the host-side kernel driver modules during installation.

```{note}
This page uses package name `axhelix` and example files `axhelix_0.2.0-1_amd64.deb` and `axhelix-0.2.0-1.x86_64.rpm`. Use the package name, version, and architecture of your release. When you use `axhelix-ax8860`, replace the package name in the commands accordingly.
```

## 1. Hardware installation

Before installing the driver package, confirm that the host is correctly connected to the accelerator card hardware:

1. Power off the host.
2. Install the M.2 module or PCIe card into the corresponding host slot, and make sure it is firmly seated and secured.
3. Restart the host.
4. Use `lspci` to check whether the device is recognized by the system.

```bash
$ lspci
0000:01:00.0 Processing accelerators: Axera Semiconductor Co., Ltd Device 8860 (rev 01)
```

If the corresponding device does not appear in the `lspci` output, check the hardware installation, host BIOS/UEFI PCIe configuration, slot power supply, and cable connection before continuing with package installation.

## 2. Package

First confirm that you have an AXCL package that matches the current host. For example:

```bash
ls axhelix*.deb
ls axhelix*.rpm
```

Package files follow the Debian / RPM naming conventions:

- DEB: `<package>_<version>-<revision>_<arch>.deb`, for example `axhelix_0.2.0-1_amd64.deb`
- RPM: `<package>-<version>-<release>.<arch>.rpm`, for example `axhelix-0.2.0-1.x86_64.rpm`

Choose the package file for your host:

| Host | DEB | RPM |
| ---- | --- | --- |
| x86_64 (`uname -m` reports `x86_64`) | `axhelix_<version>_amd64.deb` | `axhelix-<version>.x86_64.rpm` |
| Generic ARM64 host (`uname -m` reports `aarch64`) with an AX8860 accelerator card attached over PCIe | `axhelix_<version>_arm64.deb` | `axhelix-<version>.aarch64.rpm` |
| The host itself is an AX8860 chip | Download the AXP instead | Download the AXP instead |

```{note}
DEB and RPM spell the same CPU architecture differently: x86_64 is `amd64` in DEB, and ARM64 is `arm64`. `uname -m` reports the CPU name (`x86_64`, `aarch64`), not the architecture field in the package file name.

A generic ARM64 host and a host whose own SoC is AX8860 both report `aarch64` from `uname -m`. Tell them apart by whether the host itself is the AX8860 chip: when it is, the drivers, user-space libraries and configuration already come with the rootfs, so flash the matching AXP instead of installing an AXCL package.
```

| Field | Example | Description |
| ---- | ---- | ---- |
| Package name | `axhelix` | AXCL package-manager name, chosen by host type; see the table below. |
| Version | `0.2.0-1` | Software version and packaging revision. |
| Architecture | `amd64` / `x86_64` | Host CPU architecture: `amd64` or `arm64` for DEB, `x86_64` or `aarch64` for RPM. |

Pick the package that matches your host:

| Package | Host | libc requirement |
| ---- | ---- | ---- |
| `axhelix` | Generic x86_64 / ARM64 host with an AX8860 accelerator card attached over PCIe | glibc ≥ 2.30 |
| `axhelix-ax8860` | The host itself is an AX8860 chip driving its own on-board device side | glibc ≥ 2.38 |

```{important}
The two packages conflict with each other; install only one of them on a host. The ARM64 `axhelix` and `axhelix-ax8860` packages share one package architecture. If you pick the wrong one, the install script refuses the installation and tells you which package to use; nothing is unpacked and no system configuration is changed.

The AX8860 SDK can build the host straight into the Debian rootfs
(`make p=AX8860_emmc ROOTFS_FLAVOR=debian`). In that case the drivers, user-space
libraries and configuration are already in place after flashing the AXP, so
`axhelix-ax8860` does not need to be installed; installing it anyway makes the
maintainer scripts take over the same paths.

Both packages use the same install paths, logs, state file, and kernel module name (`/usr/local/axhelix`, `/var/log/axhelix`, `axhelix`, and so on), so only the package name changes in the commands below.
```

## 3. Installation environment

The AXCL package installation script builds and installs kernel driver modules for the currently running kernel. The host system therefore needs:

- Available C/C++ build tools, such as `gcc`, `make`, and `cmake`.
- `dkms`. The installation script prefers DKMS; if DKMS is unavailable or the DKMS build fails, it tries to fall back to a native make build. Modules built with native make are not rebuilt automatically after a kernel update. The package declares `dkms` as a weak dependency (DEB `Recommends`, RPM `Recommends`), so `apt` / `dnf` install it by default when a configured repository provides it; on RHEL / CentOS / Rocky and similar systems, `dkms` comes from EPEL.
- Kernel headers or kernel-devel that exactly match `uname -r`.
- The `kmod` toolset, which provides commands such as `depmod` and `modprobe`.

```{warning}
The kernel header version must match the currently running kernel. If `/lib/modules/$(uname -r)/build` is missing or incomplete, kernel module build during installation will fail.
```

## 4. DEB

This section applies to Ubuntu, Debian, and other systems that use APT/dpkg. The commands below use Ubuntu 22.04 as an example.

### 4.1. Environment

```bash
# Refresh the APT package index
sudo apt update

# Install gcc, make, cmake, and DKMS
sudo apt install gcc make cmake dkms

# Install headers that match the currently running kernel
sudo apt install linux-headers-$(uname -r)
```

### 4.2. Install

Run the following command in the directory that contains the package:

```bash
sudo apt install ./axhelix_0.2.0-1_amd64.deb
```

During installation, the package scripts perform the following operations:

1. Install AXCL files to `/usr/local/axhelix`.
2. Install the PAC firmware supplied at package build time to `/lib/firmware/axcl/ax8860_card.pac`.
3. Install driver sources to `/usr/src/axhelix-<version>`.
4. Build and install kernel modules through DKMS or native make.
5. Refresh the dynamic linker cache (`ldconfig`) and write CMake package wrappers.
6. Load drivers in dependency order.
7. Write the installation status file `/var/lib/axhelix/install-state`.

The module loading configuration, module parameter configuration, dynamic linker configuration, and shell environment configuration are installed with the package and owned by the package manager; `dpkg -S` or `rpm -qf` reports the owning package.

```{note}
If `apt install ./xxx.deb` reports that the `_apt` sandbox cannot access the local file, the current directory is usually not traversable by the `_apt` user. Copy the `.deb` file to an accessible directory such as `/tmp` and install it from there, for example: `cp axhelix_0.2.0-1_amd64.deb /tmp/ && sudo apt install /tmp/axhelix_0.2.0-1_amd64.deb`.
```

:::{important}
After installation completes, run the following command once in the current shell so that the AXCL environment configuration in `/etc/profile.d/axhelix.sh` takes effect immediately:

```bash
source /etc/profile
```

New login shells will load this configuration automatically.
:::

### 4.3. Verify

After installation completes, use the following commands to check package-manager status, installation status, the installation directory, and module loading status:

```bash
# Show APT package metadata
apt show axhelix

# Show dpkg installation status
dpkg -s axhelix

# Show AXCL installation status
cat /var/lib/axhelix/install-state

# Show the installation directory
ls /usr/local/axhelix

# Check whether kernel modules are loaded
lsmod | grep -E '^ax'
```

Common fields in `/var/lib/axhelix/install-state` are listed below:

| Field | Description |
| ---- | ---- |
| `state` | Installation state. `success` means installation and module loading succeeded; `degraded-success` means module build succeeded but automatic loading failed; `failure` means installation failed. |
| `version` | Installed AXCL package version. |
| `method` | Kernel module build method. Common values are `dkms` and `native-make`. |
| `kernel` | Running kernel version used during installation. |
| `reason` | State reason, such as `ok`, `modprobe-failed`, or `native-make`. |

```{note}
`/etc/profile.d/axhelix.sh` is installed with the package. If the current shell cannot find AXCL commands, first confirm that `source /etc/profile` has been run in the current shell.
```

### 4.4. Uninstall

To uninstall AXCL package contents while keeping package-manager configuration files if any exist, run:

```bash
sudo apt remove axhelix
```

To fully remove package contents and package-manager configuration files, run:

```bash
sudo apt purge axhelix
```

The package manager removes the packaged module configuration, dynamic linker configuration, and shell environment configuration; the uninstall script cleans up DKMS/native make modules generated during AXCL installation, driver sources, CMake package wrappers, and the installation status file. The AXCL package declares no conffiles, so `apt remove` and `apt purge` remove the same system configuration.

Uninstall also removes `/lib/firmware/axcl/ax8860_card.pac` and removes `/lib/firmware/axcl` only when the directory is empty. A pre-existing unmanaged file at the fixed PAC path is overwritten by a fresh install and is not backed up or restored. In-place upgrade and reinstall are not supported; remove the installed package before installing a new package.

## 5. RPM

This section applies to CentOS, openEuler, and other systems that use DNF/RPM. Software repositories and kernel development package names may vary by distribution. Use the actual package names for your distribution.

### 5.1. Environment

```bash
# Install gcc, make, cmake, and DKMS
sudo dnf install gcc make cmake dkms

# Install kernel-devel and kernel-headers that match the currently running kernel
sudo dnf install kernel-devel-$(uname -r) kernel-headers-$(uname -r)
```

### 5.2. Install

Run the following command in the directory that contains the package:

```bash
sudo dnf install ./axhelix-0.2.0-1.x86_64.rpm
```

The RPM installation script performs the same system-side configuration as the DEB package, including installing AXCL files, building and installing kernel modules, writing environment configuration, and recording installation status.

:::{important}
After installation completes, run the following command once in the current shell so that the AXCL environment configuration in `/etc/profile.d/axhelix.sh` takes effect immediately:

```bash
source /etc/profile
```

New login shells will load this configuration automatically.
:::

### 5.3. Verify

```bash
# Show DNF package metadata
dnf info axhelix

# Show RPM installation status
rpm -qi axhelix

# Show AXCL installation status
cat /var/lib/axhelix/install-state

# Show the installation directory
ls /usr/local/axhelix

# Check whether kernel modules are loaded
lsmod | grep -E '^ax'
```

### 5.4. Uninstall

The recommended way is to uninstall through DNF:

```bash
sudo dnf remove axhelix
```

You can also uninstall directly through RPM:

```bash
sudo rpm -e axhelix
```

## 6. FAQ

### 6.1. How do I diagnose an installation failure?

First check the package script log and installation status:

```bash
cat /var/lib/axhelix/install-state
sudo cat /var/log/axhelix/install.log
```

If the log reports a missing kernel build tree, confirm that `/lib/modules/$(uname -r)/build` exists and install headers or kernel-devel that match the currently running kernel.

### 6.2. Does `state=degraded-success` mean installation failed?

No. `degraded-success` means kernel modules were built and installed successfully, but the installation script failed to load the driver automatically. In this case, use the error information in `/var/log/axhelix/install.log` to check the device, permissions, Secure Boot, or module dependency issue. After fixing the issue, rerun the installation configuration flow or load the corresponding driver as indicated by the log, then use `lsmod` to check driver modules with the `ax_` prefix:

```bash
lsmod | grep -E '^ax'
```

### 6.3. How do I check whether DKMS or native make was used?

Check the `method` field in the installation status file:

```bash
grep '^method=' /var/lib/axhelix/install-state
```

`method=dkms` means the kernel modules were built and installed through DKMS. `method=native-make` means they were built and installed directly through the Makefile in the driver source tree.

### 6.4. Why does the current shell still keep AXCL environment variables after uninstall?

The package manager removes `/etc/profile.d/axhelix.sh` on uninstall, but an already running shell does not automatically undo environment variables that were previously loaded. Exit the current shell and log in again, or open a new shell before verifying.

### 6.5. What should I do about "package targets ... hosts but kernel ... is ..."?

The package does not match the current host. Switch to the package named in the
message:

| Message | Meaning | Action |
| ---- | ---- | ---- |
| `install the generic axhelix package instead` | `axhelix-ax8860` on a host that is not an AX8860 chip | Install `axhelix` |
| `install the axhelix-ax8860 package instead` | `axhelix` on an AX8860 host | Install `axhelix-ax8860` |

If you see `cannot read kernel configuration: ...`, the kernel configuration file
`include/config/auto.conf` is missing or unreadable, so the install script cannot
decide the host type and refuses to continue. Reinstall the kernel headers or
kernel-devel matching the running kernel and retry.

The check runs before anything is unpacked: no files are installed, no system
configuration is changed, and no install state is recorded. Just install the
correct package.

```{note}
The log is initialised before the check runs, so `/var/log/axhelix/install.log`
is still created or overwritten and any previous log is rotated to
`install.log.prev`. Back up the earlier log first if you need it for
troubleshooting.
```

### 6.6. How do I switch to another package on an installed host?

The two packages conflict with each other. For example, an AX8860 host has `axhelix` installed by mistake and needs `axhelix-ax8860` instead.

On DEB systems, install the new package directly. APT fully removes the conflicting package first and then installs the new one:

```bash
sudo apt install ./axhelix-ax8860_<version>_arm64.deb
```

On RPM systems, remove first and then install, as two separate commands:

```bash
sudo dnf remove axhelix
sudo dnf install ./axhelix-ax8860-<version>.aarch64.rpm
```

```{warning}
On RPM systems, do not switch in one step with `dnf swap` or `dnf install --allowerasing`. RPM installs the new package first and then runs the old package's uninstall scripts in the same transaction, so the old package deletes the kernel modules, driver sources, CMake package wrappers, and installation status file the new package has just generated.
```

### 6.7. What should I do about `ldconfig failed` or `ldconfig not found` during installation?

AXCL libraries live in `/usr/local/axhelix/lib`, which is not on the default search path. AXCL programs in the package find them through RUNPATH and are not affected, but programs that load libraries by name (for example `ffmpeg`, which `dlopen`s `libaxcl_*.so`) and user programs linked against AXCL rely on the cache that the installation script refreshes with `ldconfig`.

A failed `ldconfig` does not abort the installation; the installation script reports it at the end. After fixing the cause (for example a read-only root filesystem or a full disk), run:

```bash
sudo ldconfig
ldconfig -p | grep /usr/local/axhelix/lib
```

The cache is restored when the second command lists libraries such as `libaxcl_rt.so`.

### 6.8. What should I do about `Failed to find module 'ax_...'` in the boot log?

`/usr/lib/modules-load.d/axhelix.conf` is installed with the package, and `systemd-modules-load` loads the drivers it lists at boot. When the running kernel has no matching module, the system logs this message and boot is not affected. With systemd 245 or later the `systemd-modules-load` service still succeeds; older versions (for example systemd 239 on RHEL/openEuler 8 series) mark the service as failed. Common causes:

- The installation did not finish (for example the package is half-configured after a maintainer script failure): diagnose it as described in 6.1. On DEB systems run `sudo dpkg --configure -a` after fixing it; on RPM systems remove the package with `sudo dnf remove`, fix the cause, and install it again.
- The kernel was upgraded without headers for the new kernel, so DKMS could not build the modules for it: install headers or kernel-devel that match the running kernel, then run `sudo dkms autoinstall`.

## 7. Advanced notes

### 7.1. Installed system paths

After installation, the AXCL package writes or uses the following system paths. Check these locations first when diagnosing installation, runtime, or uninstall issues.

| Path | Description |
| ---- | ---- |
| `/usr/local/axhelix` | Default AXCL installation directory. It contains subdirectories such as `bin`, `lib`, `include`, and `test`. |
| `/usr/local/axhelix/bin/axcl.json` | AXCL package configuration file. |
| `/lib/firmware/axcl/ax8860_card.pac` | Package-managed device PAC firmware at the fixed loader path. |
| `/usr/local/axhelix/src/drv` | Driver source payload included in the package. |
| `/usr/src/axhelix-<version>` | Driver source directory expanded by the installation script, used by DKMS or native make builds. |
| `/lib/modules/$(uname -r)/extra/axhelix` | AXCL kernel module installation directory for the current kernel. |
| `/var/lib/axhelix/install-state` | Installation status record. |
| `/var/log/axhelix/install.log` | Installation log. |
| `/var/log/axhelix/uninstall.log` | Uninstall log. |
| `/etc/profile.d/axhelix.sh` | Packaged shell environment configuration that sets `PATH`, `CMAKE_PREFIX_PATH`, and `PKG_CONFIG_PATH`. |
| `/etc/ld.so.conf.d/axhelix.conf` | Packaged dynamic linker configuration. |
| `/usr/lib/modules-load.d/axhelix.conf` | Packaged boot-time module loading configuration. To change it, place a file with the same name in `/etc/modules-load.d/`; upgrades do not modify that file. |
| `/lib/modprobe.d/axhelix.conf` | Packaged module parameter configuration. To change it, place a file with the same name in `/etc/modprobe.d/`. |
| `/usr/lib/cmake/axcl`, `/usr/lib64/cmake/axcl` | System-level CMake package wrappers for downstream `find_package(axcl)`. |
