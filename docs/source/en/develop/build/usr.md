# User Space

This document describes how to build AXCL host-side components, sample programs, and deb/rpm packages.
Paths below are relative to the AXCL root directory. The build entry is `build/Makefile`, so run the `make` commands in `build/`.

```{note}
The following host-side build environment uses `Ubuntu 22.04` as an example.
```

## 1. Environment Dependencies

| Tool | Version | Notes |
| --- | --- | --- |
| cmake | >= 3.24 | |
| make | >= 4.3 | |
| ninja | >= 1.13.0 | Default generator |
| zig | >= 0.15.2 | Used by `x86`, `arm64` |
| GNU cross toolchain | arm-gnu-toolchain-13.3.rel1 | Used only by `host=ax8860`; fixed path, no zig |
| python3 | | Validates the `pac=` file for `package` |
| dpkg-dev | | Generates deb packages |
| rpm | | Generates rpm packages |

### 1.1. Installation

**Base tools**

```bash
sudo apt update
sudo apt install -y cmake make python3 dpkg-dev rpm
```

```{note}
- `dpkg-dev` provides tools for creating deb packages.
- `rpm` provides tools for creating rpm packages.
- The `cmake` package in the Ubuntu 22.04 archive is 3.22, which is older than the required 3.24, and CMake configuration fails with it. Install CMake 3.24 or later from another source, for example <https://cmake.org/download/>, and make sure it comes first in `PATH`.
```

**Ninja**
1. Download Ninja from <https://github.com/ninja-build/ninja/releases/>.
2. Put the `ninja` executable in a directory visible from `PATH`, for example `/usr/local/bin`.
3. Verify the installation with `ninja --version`.

**Zig**
1. Download Zig from <https://ziglang.org/download/>.
2. Extract it to a local tool directory.
3. Add the directory that contains `zig` to `PATH`.
4. Verify the installation with `zig version`.

```{note}
`host=ax8860` does not use zig; it always uses the GNU cross toolchain (see [2.5. ax8860 target](#build-ax8860)). All other hosts, including `host=all`, require zig; if zig is not in `PATH`, `make` stops with `zig compiler not found in PATH`. `host=all` does not include `ax8860`.
```

**GNU cross toolchain (only for `host=ax8860`)**
1. Install arm-gnu-toolchain-13.3.rel1 to the fixed path `/usr/local/arm-gnu-toolchain-13.3.rel1-x86_64-aarch64-none-linux-gnu/`.
2. Verify that `/usr/local/arm-gnu-toolchain-13.3.rel1-x86_64-aarch64-none-linux-gnu/bin/aarch64-none-linux-gnu-gcc` is executable.
3. The build always uses this path, so it does not need to be added to `PATH`.

## 2. Build

### 2.1. Usage

```text
Usage: make [target] [host=<host>] [libc=<libc>[,<libc>...]] [debug=yes]

Targets:
  all       (default) configure + build
  install   install to axcl/out/axcl_<os>_<host>[_<libc>]/
  package   generate .deb/.rpm, keep build/out/.../axcl as staging, and copy deliverables to out/.../package/
  clean     remove the current build & install dir
  scan      static analysis (tscancode)
  help      show this message

Options:
  host=     arm64 | x86 | ax8860 | all (default: all)
  libc=     gnu                                               (default: see AXCL_HOST_LIBC)
  debug=    yes | no                                          (default: no -> Release)

Examples:
  make clean all install                       # build all linux hosts (matrix)
  make host=x86 clean all install package pac=/absolute/path/to/firmware.pac
  make host=arm64 clean all install            # aarch64
```

### 2.2. Build Options

| Parameter | Values | Default | Description |
| --- | --- | --- | --- |
| `host=` | `arm64`, `x86`, `ax8860`, `all` | `all` | Target host. `ax8860` is an aarch64 glibc target built with the fixed GNU cross toolchain (no zig) and can only be built on its own; see [2.5. ax8860 target](#build-ax8860). `all` enables the multi-host matrix (which does not include `ax8860`). |
| `libc=` | `gnu` | `gnu` | C library selection. Under `host=all`, this parameter is ignored with a warning, and the libc matrix comes from `AXCL_HOST_LIBC_<arch>` in `build/config.mk`. |
| `debug=` | `yes`, `no` | `no` | `yes` sets `CMAKE_BUILD_TYPE=Debug`; `no` sets `CMAKE_BUILD_TYPE=Release`. |
| `pac=` | PAC file path | None | Required by `package` and `package-only` on Linux; without it, `make` stops immediately. The file must be a non-empty, readable regular file whose name ends with `.pac` (case-sensitive). Relative paths, spaces, and non-ASCII characters are supported; `"`, `\`, `` ` ``, `$`, tabs, and line breaks are not. A symbolic link is resolved to its target, and the target name must also end with `.pac`. |

### 2.3. Advanced Parameters

| Parameter | Purpose | Default | Description |
| --- | --- | --- | --- |
| `AXCL_BUILD_CPU_LIMIT_PERCENT` | Sets the build parallelism as a percentage of online CPU cores. | `80` | Under `host=all`, the budget is split among the build tasks. Keep the default for daily builds; on shared build machines or to reduce load, set it to `50` or lower. |
| `AXCL_ALL_HOSTS` | Host list built by `host=all`. | `x86 arm64` | Pass it on the `make` command line, for example `AXCL_ALL_HOSTS=x86`, or change the default in `build/config.mk`. `ax8860` is not accepted. |
| `AXCL_HOST_LIBC_<arch>` | libc build matrix for one arch under `host=all`, for example `AXCL_HOST_LIBC_x64` or `AXCL_HOST_LIBC_aarch64`. | `gnu` | To change the matrix, modify `build/config.mk`; do not override it through an environment variable or a `make` parameter. |
| `AXCL_GLIBC_VERSION` | Target glibc version for the Zig gnu toolchain. | Defined by `build/projects/axcl_linux_<arch>.mk` | Usually keep the default; see [glibc / dynamic linker matrix](#build-glibc-matrix). To change it, modify the matching `build/projects/axcl_linux_<arch>.mk`; do not override it through an environment variable or a `make` parameter. It applies only to `libc=gnu` and does not apply to `host=ax8860`. |
| `AXCL_PACKAGE_OUTPUT_DIR` | Overrides the final copy directory for `.deb` and `.rpm` files. | `out/axcl_linux_<host>_<libc>/package/` | Use an absolute path; a relative path is resolved against `build/`. Useful as a unified output directory for CI or release archiving. |

Generic format:

```bash
make host=<host> <param>=<value> clean all install
```

Typical examples:

```bash
# Limit this build to about 50% of online CPUs
make host=x86 AXCL_BUILD_CPU_LIMIT_PERCENT=50 clean all install

# Specify the package output directory
make host=x86 AXCL_PACKAGE_OUTPUT_DIR=/tmp/axcl-package clean all install package pac=/absolute/path/to/firmware.pac
```

```{note}
Under `host=all`, the `libc=` parameter is ignored. The host matrix is controlled by `AXCL_ALL_HOSTS`, and the libc matrix by `AXCL_HOST_LIBC_<arch>` in `build/config.mk`.
```

### 2.4. Examples

```bash
# Build all linux hosts (matrix)
make clean all install

# Build and package x86 only with the default libc
make host=x86 clean all install package pac=/absolute/path/to/firmware.pac

# Build and package ax8860 (GNU cross toolchain, no zig)
make host=ax8860 clean all install package pac=/absolute/path/to/firmware.pac
```

<a id="build-ax8860"></a>

### 2.5. ax8860 Target

`host=ax8860` always uses the following GNU cross toolchain:

```text
/usr/local/arm-gnu-toolchain-13.3.rel1-x86_64-aarch64-none-linux-gnu/bin/aarch64-none-linux-gnu-
```

`make host=ax8860` does not require Zig. `ax8860` is not part of the `host=all` matrix and must be built on its own.

For release images, the SDK builds this target for you: when you build a Debian rootfs in the SDK `build/` directory, for example with `make p=AX8860_emmc ROOTFS_FLAVOR=debian` (`AX8860_ssd` and `AX8860_ssd_m2` are also supported), it builds the AXCL kernel modules and the `host=ax8860` user space, and bundles them with the system configuration into the image. You only flash the AXP and do not need to install the `axhelix-ax8860` package. Use `make host=ax8860` for standalone development builds and debugging.

### 2.6. Clean and Rebuild

- `make clean`: removes the build and install directories for the current host/libc; with `host=all`, for every host/libc in the matrix.
- If the configuration is inconsistent or the CMake cache is stale, run `rm -rf build/out` in the AXCL root directory to force a full rebuild.

## 3. Package Generation

```bash
# Build, install, and package the current all-host matrix
make host=all clean all install package pac=/absolute/path/to/firmware.pac

# Build, install, and package x86 only
make host=x86 clean all install package pac=/absolute/path/to/firmware.pac
```

Each Linux DEB/RPM contains exactly one PAC, installed as `/lib/firmware/axcl/ax8860_card.pac` regardless of the input file name. The PAC goes only into the packages; `all` and `install` do not copy it into `out/`.

Package output directory:
- Default: `out/axcl_linux_<host>_<libc>/package/`
- Override: set `AXCL_PACKAGE_OUTPUT_DIR=/absolute/path/to/output` to copy the final `.deb` and `.rpm` files to another directory.

The package name depends on the build target. The version comes from the SDK version (`SDK_VERSION` in the SDK `build/version.mak`, for example `V0.5.0` → `0.5.0`), and file names follow the Debian / RPM conventions:

| Build target | Package | DEB example | RPM example |
| ---- | ---- | ---- | ---- |
| `host=x86` / `arm64`, `libc=gnu` | `axhelix` | `axhelix_0.5.0-1_amd64.deb` | `axhelix-0.5.0-1.x86_64.rpm` |
| `host=ax8860` | `axhelix-ax8860` | `axhelix-ax8860_0.5.0-1_arm64.deb` | `axhelix-ax8860-0.5.0-1.aarch64.rpm` |

`axhelix` and `axhelix-ax8860` conflict with each other, so only one of them can be installed. At install time, `axhelix-ax8860` installs only on a kernel with `CONFIG_AXERA_LOCAL_DEVICE=y`, and `axhelix` only on a kernel without it; otherwise installation fails and names the package to use. Packages declare a minimum glibc version that follows the toolchain: zig builds use `AXCL_GLIBC_VERSION`, and `host=ax8860` uses 2.38.

## 4. Output Directory

```text
out/axcl_linux_<host>_<libc>/
├── bin/        # Executables
├── data/       # Sample and test data (images, video)
├── etc/        # Configuration
├── lib/        # AXCL runtime libraries, CMake package (cmake/axcl) and pkg-config files (pkgconfig)
├── include/    # Public headers
├── package/    # .deb/.rpm files (when AXCL_PACKAGE_OUTPUT_DIR is not set)
├── test/       # gtest test programs
└── unstripped/ # Pre-strip debug files used to generate Breakpad symbols
```

Path notes:
- User-facing `host=arm64` maps to `out/axcl_linux_aarch64_<libc>/`.
- User-facing `host=x86` maps to `out/axcl_linux_x64_<libc>/`.
- `host=ax8860` maps to `out/axcl_linux_ax8860_gnu/`.

<a id="minidump-symbols"></a>

## 5. Minidump

AXCL uses Breakpad to support minidump generation. When a process crashes abnormally, Breakpad can generate a lightweight minidump file that records crash-site information such as threads, registers, and loaded modules for later debugging.

A minidump does not contain full debug symbols. AXCL release/install outputs are usually stripped, so debug information such as function names, source files, and line numbers must be preserved separately and converted to Breakpad symbols. To analyze a minidump, prepare:

- The minidump file generated at the crash site;
- Breakpad symbols that match the crashed binaries;
- The `minidump_stackwalk` analysis tool.

AXCL provides `scripts/minidump/collect_symbols.sh` to collect host/device Breakpad symbols and generate archives.

Before running the script, complete the corresponding build and install. `make install` installs stripped `bin`, `lib`, and `test` outputs, and keeps debug files under `unstripped/**/*.debug`. The script scans the `.debug` files, runs `dump_syms` to generate `symbols/**`, and then creates an archive. `dump_syms` and `minidump_stackwalk` are built under `build/out/`, so do not delete `build/out` before collecting; if `dump_syms` is missing, the script prints a warning and skips symbol generation.

```bash
# Collect host symbols only
./scripts/minidump/collect_symbols.sh host --output=/tmp/axcl-minidump-symbols

# Collect device symbols only
./scripts/minidump/collect_symbols.sh device --output=/tmp/axcl-minidump-symbols

# Collect both host and device symbols
./scripts/minidump/collect_symbols.sh all --output=/tmp/axcl-minidump-symbols
```

Common parameters:

| Parameter | Description |
| --- | --- |
| `host`, `device`, `all` | Collection mode. The default is `all`. |
| `--output=<dir>` | Required. Output directory for symbols and archives. Use a dedicated empty directory. |
| `--axcl-dir=<dir>` | AXCL repository root. By default, it is auto-detected from the script path. |
| `--manifest-dir=<dir>` | Manifest workspace root. The default is `<axcl-dir>/..`. |

Archive names:

| Mode | Output file |
| --- | --- |
| `host` | `axcl-host-minidump-symbols.tar.gz` |
| `device` | `axcl-device-minidump-symbols.tar.gz` |
| `all` | `axcl-all-minidump-symbols.tar.gz` |

The output directory preserves original variant directory names, for example:

```text
<output_dir>/host/axcl_linux_x64_gnu/symbols/
<output_dir>/host/axcl_linux_x64_gnu/unstripped/lib/
<output_dir>/host/axcl_linux_x64_gnu/tools/minidump_stackwalk
<output_dir>/host/axcl_linux_x64_gnu/tools/dump_syms
<output_dir>/device/arm64_glibc/symbols/
```

Notes:
- Use a dedicated directory for `--output`. The script cleans existing output directories only when the `.axcl-symbols-output` marker is present.
- Host symbols come from `axcl/out/axcl_linux_*`.
- Device symbols come from `<manifest-dir>/msp/out/arm64_glibc`, which exists after the SDK `msp` build.

## 6. FAQ

1.
   [Q] Build fails after switching options?<br>
   [A] This is usually caused by stale CMake cache. Run `rm -rf build/out` first, then build again.
2.
   [Q] How do I check or change the default glibc version for a host?<br>
   [A] See [glibc / dynamic linker matrix](#build-glibc-matrix) for default versions. If you really need to change it, adjust `AXCL_GLIBC_VERSION` in `build/projects/axcl_linux_<arch>.mk`.
3.
   [Q] How do I add a new libc?<br>
   [A]
    - Add the new libc name to `AXCL_SUPPORTED_LIBCS` in `build/config.mk`.
    - Add `build/cmake/toolchains/<arch>-linux-<new-libc>-zig.cmake` (for example `x86_64` or `aarch64`) for each host that should support it, and select it in the matching `build/projects/axcl_linux_<arch>.mk`.
    - If it should be part of the default matrix, update the corresponding `AXCL_HOST_LIBC_<arch>` default.
4.
   [Q] How do I clean up leftovers after a failed DEB installation?<br>
   [A] A failed DEB installation attempts to roll back, but side effects created during `postinst`, such as logs, CMake wrappers, DKMS state, or kernel modules, may remain if a script is interrupted, a downgrade succeeds, or the package manager stays in a half-configured state.

    Run the following script as root to clean up these leftovers:

    ```bash
    #!/usr/bin/env bash
    set -euo pipefail

    if [[ ${EUID} -ne 0 ]]; then
       echo "Please run as root" >&2
       exit 1
    fi

    PKG_NAME="axhelix"
    KERNEL_RELEASE="$(uname -r)"
    MARKER="# Managed by ${PKG_NAME} package"

    remove_managed_cmake_wrapper_dir() {
       local wrapper_dir="$1"

       [[ -d "$wrapper_dir" ]] || return 0

       for wrapper_file in \
          "$wrapper_dir/axclConfig.cmake" \
          "$wrapper_dir/axclConfigVersion.cmake"
       do
          if [[ -f "$wrapper_file" ]] && grep -Fq "$MARKER" "$wrapper_file" 2>/dev/null; then
             rm -f "$wrapper_file"
          fi
       done

       rmdir "$wrapper_dir" >/dev/null 2>&1 || true
    }

    dpkg --configure -a || true
    apt remove --purge -y "$PKG_NAME" || true

    for src_dir in /usr/src/${PKG_NAME}-*; do
       [[ -d "$src_dir" ]] || continue
       version="${src_dir#/usr/src/${PKG_NAME}-}"
       if command -v dkms >/dev/null 2>&1; then
          dkms remove -m "$PKG_NAME" -v "$version" --all >/dev/null 2>&1 || true
       fi
       rm -rf "$src_dir"
    done

    rm -rf \
       "/var/log/${PKG_NAME}" \
       "/var/lib/${PKG_NAME}" \
       "/lib/modules/${KERNEL_RELEASE}/extra/${PKG_NAME}"

    rm -f \
       "/etc/profile.d/${PKG_NAME}.sh" \
       "/etc/ld.so.conf.d/${PKG_NAME}.conf" \
       "/usr/lib/modules-load.d/${PKG_NAME}.conf" \
       "/lib/modprobe.d/${PKG_NAME}.conf" \
       "/etc/modules-load.d/${PKG_NAME}.conf" \
       "/etc/modprobe.d/${PKG_NAME}.conf"

    remove_managed_cmake_wrapper_dir "/usr/lib/cmake/axcl"
    remove_managed_cmake_wrapper_dir "/usr/lib64/cmake/axcl"

    if command -v ldconfig >/dev/null 2>&1; then
       ldconfig || true
    fi

    if command -v depmod >/dev/null 2>&1; then
       depmod -a "$KERNEL_RELEASE" || true
    fi
    ```
5.
   [Q] Why does `apt install ./axhelix_0.5.0-1_amd64.deb` show an `_apt` sandbox fallback message?<br>
   [A] This happens when the `_apt` user cannot traverse the local `.deb` path, for example when the home directory permission is `750`. Copy the package to a path that `_apt` can access, such as `/tmp/`, and install it from there. For example: `cp ~/Desktop/axhelix_0.5.0-1_amd64.deb /tmp/ && sudo apt install /tmp/axhelix_0.5.0-1_amd64.deb`.

## 7. Appendix

<a id="build-glibc-matrix"></a>

### 7.1. glibc / dynamic linker matrix

| host | glibc | `.interp` |
| --- | --- | --- |
| arm64 | 2.30 | `/lib/ld-linux-aarch64.so.1` |
| x86 | 2.30 | `/lib64/ld-linux-x86-64.so.2` |

### 7.2. Toolchain File Index

This table lists the officially supported Linux toolchain files. Every host except `ax8860` uses a Zig toolchain. Windows toolchains and other files under `build/cmake/toolchains/` are not listed.

| host × libc | Toolchain file under `build/cmake/toolchains/` |
| --- | --- |
| arm64 / gnu | `aarch64-linux-gnu-zig.cmake` |
| x86 / gnu | `x86_64-linux-gnu-zig.cmake` |
| ax8860 / gnu | `ax8860-linux-gnu-gcc.cmake` (GNU cross toolchain, no zig) |
