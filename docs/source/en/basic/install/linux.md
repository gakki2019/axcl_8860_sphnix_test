# Linux

This page describes how to install, verify, and uninstall the AXCL runtime environment on a Linux host by using AXCL release packages. It applies to `.deb` and `.rpm` packages. The package installs AXCL user-space files into system directories and builds the host-side kernel driver modules during installation.

```{note}
This page uses package name `axhelix` and example files `axhelix_linux_x64_gnu.deb` and `axhelix_linux_x64_gnu.rpm`. Actual file names may vary by host, libc, version, or release configuration. Use the package files from your release.
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

First confirm that you have an AXCL package that matches the current host architecture and libc. For example:

```bash
ls axhelix_linux_*_*.deb
ls axhelix_linux_*_*.rpm
```

Package file names usually contain the following fields:

| Field | Example | Description |
| ---- | ---- | ---- |
| Package name | `axhelix` | AXCL package-manager name. |
| System | `linux` | The package targets a Linux host. |
| host | `x64` | Host CPU architecture. Common values include `x64`, `aarch64`, `loongarch64`, and `riscv64`. |
| libc | `gnu` | Host libc type. |

## 3. Installation environment

The AXCL package installation script builds and installs kernel driver modules for the currently running kernel. The host system therefore needs:

- Available C/C++ build tools, such as `gcc`, `make`, and `cmake`.
- `dkms`. The installation script prefers DKMS; if DKMS is unavailable or the DKMS build fails, it tries to fall back to a native make build.
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
sudo apt install ./axhelix_linux_x64_gnu.deb
```

During installation, the package scripts perform the following operations:

1. Install AXCL files to `/usr/local/axhelix`.
2. Install driver sources to `/usr/src/axhelix-<version>`.
3. Build and install kernel modules through DKMS or native make.
4. Generate module loading configuration and module dependency configuration.
5. Write dynamic linker configuration, shell environment configuration, and CMake package wrappers.
6. Load drivers in dependency order.
7. Write the installation status file `/var/lib/axhelix/install-state`.

```{note}
If `apt install ./xxx.deb` reports that the `_apt` sandbox cannot access the local file, the current directory is usually not traversable by the `_apt` user. Copy the `.deb` file to an accessible directory such as `/tmp` and install it from there, for example: `cp axhelix_linux_x64_gnu.deb /tmp/ && sudo apt install /tmp/axhelix_linux_x64_gnu.deb`.
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
lsmod | grep -E '^ax_'
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
The installation script writes `/etc/profile.d/axhelix.sh`. If the current shell cannot find AXCL commands or library paths, first confirm that `source /etc/profile` has been run in the current shell.
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

The uninstall script tries to clean up DKMS/native make modules generated during AXCL installation, driver sources, module configuration, dynamic linker configuration, shell environment configuration, CMake package wrappers, and the installation status file.

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
sudo dnf install ./axhelix_linux_x64_gnu.rpm
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
lsmod | grep -E '^ax_'
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
lsmod | grep -E '^ax_'
```

### 6.3. How do I check whether DKMS or native make was used?

Check the `method` field in the installation status file:

```bash
grep '^method=' /var/lib/axhelix/install-state
```

`method=dkms` means the kernel modules were built and installed through DKMS. `method=native-make` means they were built and installed directly through the Makefile in the driver source tree.

### 6.4. Why does the current shell still keep AXCL environment variables after uninstall?

The uninstall script removes `/etc/profile.d/axhelix.sh`, but an already running shell does not automatically undo environment variables that were previously loaded. Exit the current shell and log in again, or open a new shell before verifying.

## 7. Advanced notes

### 7.1. Installed system paths

After installation, the AXCL package writes or uses the following system paths. Check these locations first when diagnosing installation, runtime, or uninstall issues.

| Path | Description |
| ---- | ---- |
| `/usr/local/axhelix` | Default AXCL installation directory. It contains subdirectories such as `bin`, `lib`, `include`, and `test`. |
| `/usr/local/axhelix/bin/axcl.json` | AXCL package configuration file. |
| `/usr/local/axhelix/src/drv` | Driver source payload included in the package. |
| `/usr/src/axhelix-<version>` | Driver source directory expanded by the installation script, used by DKMS or native make builds. |
| `/lib/modules/$(uname -r)/extra/axhelix` | AXCL kernel module installation directory for the current kernel. |
| `/var/lib/axhelix/install-state` | Installation status record. |
| `/var/log/axhelix/install.log` | Installation log. |
| `/var/log/axhelix/uninstall.log` | Uninstall log. |
| `/etc/profile.d/axhelix.sh` | Shell environment configuration that sets `PATH`, `LD_LIBRARY_PATH`, and `CMAKE_PREFIX_PATH`. |
| `/etc/ld.so.conf.d/axhelix.conf` | Dynamic linker configuration. |
| `/etc/modules-load.d/axhelix.conf` | Boot-time module loading configuration. |
| `/etc/modprobe.d/axhelix.conf` | Module dependency configuration. |
| `/usr/lib/cmake/axcl`, `/usr/lib64/cmake/axcl` | System-level CMake package wrappers for downstream `find_package(axcl)`. |
