# Linux

This page describes how to install, verify, and uninstall the AXCL runtime environment on a Linux host by using AXCL release packages. It applies to `.deb` and `.rpm` packages. The package installs the AXCL libraries, tools, and firmware, and builds the host kernel driver modules for the running kernel during installation.

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

The AX8860 SDK can build AXCL straight into the Debian rootfs
(`make p=AX8860_emmc ROOTFS_FLAVOR=debian`). In that case the drivers, user-space
libraries and configuration are already in place after flashing the AXP, so
`axhelix-ax8860` does not need to be installed; if you install it anyway, the
package takes over the same paths.

Both packages use the same install paths, logs, state file, and DKMS module name (`/usr/local/axhelix`, `/var/log/axhelix`, `axhelix`, and so on), so only the package name changes in the commands below.
```

## 3. Installation environment

The installation script builds and installs the kernel driver modules for the running kernel. The host therefore needs:

- `gcc` and `make`. The package depends on them, so `apt` / `dnf` install them automatically.
- `dkms`. The installation script prefers DKMS; if DKMS is not installed or the DKMS build fails, it falls back to a native make build. Modules built with native make are not rebuilt automatically after a kernel update. The package recommends `dkms` (DEB and RPM `Recommends`), so `apt` / `dnf` install it by default when a configured repository provides it; on RHEL / CentOS / Rocky and similar systems, `dkms` comes from EPEL.
- Kernel headers or kernel-devel that exactly match `uname -r`.
- `kmod`, which provides `depmod` and `modprobe`. The package depends on it.

```{warning}
The kernel headers must match the running kernel. If `/lib/modules/$(uname -r)/build` is missing, the installation stops with `kernel build tree missing` before any file is installed. If the headers are incomplete, the module build fails.
```

## 4. DEB

This section applies to Ubuntu, Debian, and other systems that use APT/dpkg. The commands below use Ubuntu 22.04 as an example.

### 4.1. Environment

```bash
# Refresh the APT package index
sudo apt update

# Install gcc, make, and DKMS
sudo apt install gcc make dkms

# Install headers that match the currently running kernel
sudo apt install linux-headers-$(uname -r)
```

### 4.2. Install

Run the following command in the directory that contains the package:

```bash
sudo apt install ./axhelix_0.2.0-1_amd64.deb
```

During installation, the package performs the following operations:

1. Install AXCL files to `/usr/local/axhelix`.
2. Install the device firmware to `/lib/firmware/axcl/ax8860_card.pac`.
3. Install driver sources to `/usr/src/axhelix-<version>`.
4. Build and install kernel modules through DKMS or native make.
5. Refresh the dynamic linker cache (`ldconfig`) and install the system CMake package files for `find_package(axcl)`.
6. Load the drivers.
7. Write the installation status file `/var/lib/axhelix/install-state`.

The module loading, module parameter, dynamic linker, and shell environment configuration files are part of the package and owned by the package manager; `dpkg -S` or `rpm -qf` reports the owning package.

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
| `state` | Installation state. `success` means installation succeeded; `degraded-success` means the modules were built and installed but loading them failed; `failure` means installation failed. |
| `version` | Installed AXCL package version. |
| `method` | Kernel module build method: `dkms` or `native-make`. `unknown` means installation failed before any module build succeeded. |
| `kernel` | Running kernel version used during installation. |
| `reason` | State reason. With `state=success`: `ok`, or `reboot-required`, which means the previous driver was in use and could not be unloaded, so the new driver is loaded after a reboot (see section 4.5). With `state=degraded-success`: `modprobe-failed`. With `state=failure`: `native-make` or `dkms-fallback` (DKMS failed and native make was tried) when the failure happened on the native make path; otherwise it is usually `unknown`. |

```{note}
`/etc/profile.d/axhelix.sh` is part of the package. If the current shell cannot find AXCL commands, run `source /etc/profile` in it first.
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

The package manager removes the packaged module, dynamic linker, and shell environment configuration files. The uninstall script removes the kernel modules built by DKMS or native make, the driver sources, the system CMake package files, and the installation status file. The package declares no conffiles, so `apt remove` and `apt purge` remove the same files.

Uninstall also removes `/lib/firmware/axcl/ax8860_card.pac`, and removes `/lib/firmware/axcl` if it is then empty. A file that already exists at this path before installation is overwritten, and is not backed up or restored.

Uninstall unloads the AXCL kernel modules. `axhelix-ax8860` first stops the `axcl-slave-daemon` service if it is running, because the service keeps the device open, and starts it again after the modules are unloaded; the service then waits for the driver to be installed again. If a program still uses an AXCL device, its modules cannot be unloaded; uninstall still completes, the terminal shows `WARNING: AXCL kernel modules are still loaded`, and the modules stay loaded. Stop those programs and unload the modules manually, or reboot. Details are in `/var/log/axhelix/uninstall.log`.

### 4.5. Upgrade and reinstall

To upgrade, reinstall the same version, or downgrade, install the target package directly:

```bash
# Upgrade from the repository
sudo apt update && sudo apt upgrade

# Upgrade or downgrade with a local package
sudo apt install ./axhelix_<version>_amd64.deb

# Reinstall the current version
sudo apt install --reinstall axhelix
```

The install script first builds and installs the new modules without loading them, and only then removes the previous version's modules and driver sources. If the build fails during an upgrade or downgrade, the previous driver installation is kept. After a successful build, if the previous driver is loaded, the install script checks whether an AXCL device is still in use (`axhelix-ax8860` first stops the `axcl-slave-daemon` service if it is running):

- If no program has an AXCL device open, the install script unloads the previous driver and loads the new one; the device resets and loads the new firmware, and `install-state` records `reason=ok`. No reboot is needed. `ax_vtty`, which is only loaded by hand, is not loaded again, the same as after a reboot.
- If a program still uses an AXCL device, the previous driver keeps running, the terminal shows `ACTION REQUIRED: reboot to load the new AXCL driver`, and `install-state` records `state=success` and `reason=reboot-required`. The same applies when a program opens a device while the modules are being unloaded and some of them stay loaded. Reboot to load the new driver, and do not run AXCL programs before that: the new libraries may not work with the previous driver. Alternatively, stop the programs using the device and reinstall the package to avoid the reboot.

If no AXCL module was loaded, the install script loads the new driver directly and no reboot is needed.

## 5. RPM

This section applies to CentOS, openEuler, and other systems that use DNF/RPM. Software repositories and kernel development package names may vary by distribution. Use the actual package names for your distribution.

### 5.1. Environment

```bash
# Install gcc, make, and DKMS
sudo dnf install gcc make dkms

# Install kernel-devel and kernel-headers that match the currently running kernel
sudo dnf install kernel-devel-$(uname -r) kernel-headers-$(uname -r)
```

### 5.2. Install

Run the following command in the directory that contains the package:

```bash
sudo dnf install ./axhelix-0.2.0-1.x86_64.rpm
```

The RPM package performs the same installation steps as the DEB package (see section 4.2).

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

Module unloading and warnings during uninstall are the same as in section 4.4.

### 5.5. Upgrade and reinstall

```bash
# Upgrade from the repository
sudo dnf upgrade axhelix

# Upgrade with a local package
sudo dnf upgrade ./axhelix-<version>.x86_64.rpm

# Downgrade with a local package
sudo dnf downgrade ./axhelix-<version>.x86_64.rpm

# Reinstall the current version
sudo dnf reinstall axhelix
```

Whether a reboot is needed after upgrade or reinstall is the same as in section 4.5.

## 6. FAQ

### 6.1. How do I diagnose an installation failure?

First check the package script log and installation status:

```bash
cat /var/lib/axhelix/install-state
sudo cat /var/log/axhelix/install.log
```

If the log reports `kernel build tree missing`, install headers or kernel-devel that match the running kernel so that `/lib/modules/$(uname -r)/build` exists, then install again. If the DKMS build for the running kernel fails, its build log is saved to `/var/log/axhelix/dkms-make.log`; check the file time, because the file is not removed by later installations.

### 6.2. Does `state=degraded-success` mean installation failed?

No. `degraded-success` means the kernel modules were built and installed, but the installation script could not load them. Use the errors in `/var/log/axhelix/install.log` to check the device, Secure Boot (the log records its state), or module dependencies. After fixing the cause, reinstall the package (for example `sudo apt install --reinstall axhelix` or `sudo dnf reinstall axhelix`) or reboot, then check that the modules `ax_pcieh_core`, `ax_pcieh_xfer`, `ax_pcieh_dbg`, `ax_comm`, and `axcl_rt` are loaded (`axhelix-ax8860` also loads `axcl_dev` and `axcl_wk_monitor`):

```bash
lsmod | grep -E '^ax'
```

### 6.3. How do I check whether DKMS or native make was used?

Check the `method` field in the installation status file:

```bash
grep '^method=' /var/lib/axhelix/install-state
```

`method=dkms` means the kernel modules were built and installed through DKMS and are rebuilt by DKMS for new kernels. `method=native-make` means they were built directly from the driver sources for the running kernel only.

### 6.4. Why does the current shell still keep AXCL environment variables after uninstall?

The package manager removes `/etc/profile.d/axhelix.sh` on uninstall, but a running shell keeps the environment variables it has already loaded. Log in again or open a new shell.

### 6.5. What should I do about "package targets ... hosts but kernel ... is ..."?

The package does not match the current host. Switch to the package named in the
message:

| Message | Meaning | Action |
| ---- | ---- | ---- |
| `install the generic axhelix package instead` | `axhelix-ax8860` on a host that is not an AX8860 chip | Install `axhelix` |
| `install the axhelix-ax8860 package instead` | `axhelix` on an AX8860 host | Install `axhelix-ax8860` |

If you see `cannot read kernel configuration: ...`, the kernel configuration file
`include/config/auto.conf` in the kernel build tree is missing or unreadable, so
the install script cannot determine the host type and stops. Reinstall the kernel
headers or kernel-devel matching the running kernel and retry.

The check runs before anything is unpacked: no files are installed, no system
configuration is changed, and no install state is recorded. Install the correct
package.

```{note}
The log is started before the check runs, so `/var/log/axhelix/install.log`
is still created, and the previous log is moved to `install.log.prev`, replacing
any older one. Back up the earlier log first if you need it for troubleshooting.
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
On RPM systems, do not switch in one step with `dnf swap` or `dnf install --allowerasing`. RPM installs the new package first and then runs the old package's uninstall scripts in the same transaction, so the old package deletes the kernel modules, driver sources, system CMake package files, and installation status file the new package has just created.
```

### 6.7. What should I do about `ldconfig failed` or `ldconfig not found` during installation?

AXCL libraries are in `/usr/local/axhelix/lib`, which is not on the default library search path. The AXCL programs in the package find them without the cache and are not affected. Programs that load the libraries by name (for example `ffmpeg`, which loads `libaxcl_*.so` at runtime) and your own programs linked against AXCL need the cache that the installation script refreshes with `ldconfig`.

A failed `ldconfig` does not stop the installation; the installation script reports it at the end. After fixing the cause (for example a read-only root filesystem or a full disk), run:

```bash
sudo ldconfig
ldconfig -p | grep /usr/local/axhelix/lib
```

The cache is restored when the second command lists libraries such as `libaxcl_rt.so`.

### 6.8. What should I do about `Failed to find module 'ax_...'` in the boot log?

`/usr/lib/modules-load.d/axhelix.conf` is part of the package, and `systemd-modules-load` loads the drivers it lists at boot. When the running kernel has no matching module, the system logs this message; boot continues normally. With systemd 245 or later the `systemd-modules-load` service still succeeds; older versions (for example systemd 239 on RHEL/openEuler 8 series) mark the service as failed. Common causes:

- The installation did not finish (for example the package is half-configured after a maintainer script failure): diagnose it as described in 6.1. On DEB systems run `sudo dpkg --configure -a` after fixing it; on RPM systems remove the package with `sudo dnf remove`, fix the cause, and install it again.
- The kernel was upgraded without headers for the new kernel, so DKMS could not build the modules for it: install headers or kernel-devel that match the running kernel, then run `sudo dkms autoinstall`.

## 7. Advanced notes

### 7.1. Installed system paths

After installation, the AXCL package writes or uses the following system paths. Check these locations first when diagnosing installation, runtime, or uninstall issues.

| Path | Description |
| ---- | ---- |
| `/usr/local/axhelix` | Default AXCL installation directory. It contains subdirectories such as `bin`, `lib`, `include`, and `test`. |
| `/usr/local/axhelix/bin/axcl.json` | AXCL package configuration file. |
| `/lib/firmware/axcl/ax8860_card.pac` | Device firmware loaded by the driver. |
| `/usr/local/axhelix/src/drv` | Driver sources shipped in the package. |
| `/usr/src/axhelix-<version>` | Driver source directory created by the installation script and used by DKMS or native make builds. |
| `/lib/modules/$(uname -r)/extra/axhelix` | AXCL kernel module installation directory for the current kernel. |
| `/var/lib/axhelix/install-state` | Installation status record. |
| `/var/log/axhelix/install.log` | Installation log. The previous log is kept as `install.log.prev`. |
| `/var/log/axhelix/uninstall.log` | Uninstall log. The previous log is kept as `uninstall.log.prev`. |
| `/etc/profile.d/axhelix.sh` | Packaged shell environment configuration that sets `PATH`, `CMAKE_PREFIX_PATH`, and `PKG_CONFIG_PATH`. |
| `/etc/ld.so.conf.d/axhelix.conf` | Packaged dynamic linker configuration. |
| `/usr/lib/modules-load.d/axhelix.conf` | Packaged boot-time module loading configuration. To change it, place a file with the same name in `/etc/modules-load.d/`; upgrades do not modify that file. |
| `/lib/modprobe.d/axhelix.conf` | Packaged module parameter configuration. To change it, place a file with the same name in `/etc/modprobe.d/`. |
| `/usr/lib/cmake/axcl`, `/usr/lib64/cmake/axcl` | System CMake package files that let `find_package(axcl)` find AXCL without setting `CMAKE_PREFIX_PATH`. `/usr/lib64/cmake/axcl` is created only if `/usr/lib64` exists. |
