# User Space

This document describes how to build AXCL host-side components, sample programs, and deb/rpm packages.
All paths below are relative to the AXCL root directory. The build entry is `build/Makefile`.

```{note}
The following host-side build environment uses `Ubuntu 22.04` as an example.
```

## 1. Environment Dependencies

| Tool | Version | Notes |
| --- | --- | --- |
| cmake | >= 3.20 | |
| make | >= 4.3 | |
| ninja | >= 1.13.0 | Default generator |
| zig | >= 0.15.2 | |
| deb | | Generate deb packages |
| rpm | | Generate rpm packages |

### 1.1. Installation

**Base tools**

```bash
sudo apt update
sudo apt install -y cmake make dpkg-dev rpm
```

```{note}
- `dpkg-dev` provides tools for creating deb packages.
- `rpm` provides tools for creating rpm packages.
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
  host=     arm64 | x86 | loongarch64 | riscv64 | all         (default: all)
  libc=     gnu | musl | gnu,musl | "gnu musl"                (default: see AXCL_HOST_LIBC)
  debug=    yes | no                                          (default: no -> Release)

Examples:
  make clean all install                       # build all linux hosts (matrix)
  make host=x86 clean all install package      # x86 only, default libc set
  make host=arm64 libc=musl clean all install  # aarch64 + musl
```

### 2.2. Build Options

| Parameter | Values | Default | Description |
| --- | --- | --- | --- |
| `host=` | `arm64`, `x86`, `loongarch64`, `riscv64`, `all` | `all` | Target host. `all` enables the multi-host matrix. |
| `libc=` | `gnu`, `musl`; comma- or space-separated combinations are supported | Depends on the current default in `build/config.mk` | C library selection. All current Linux hosts default to `gnu`. Multiple values are split into per-libc sub-builds. Under `host=all`, this parameter is ignored, and the actual matrix comes from `build/config.mk`. |
| `debug=` | `yes`, `no` | `no` | `yes` sets `CMAKE_BUILD_TYPE=Debug`; `no` sets `CMAKE_BUILD_TYPE=Release`. |

### 2.3. Advanced Parameters

| Parameter | Purpose | Default | Description |
| --- | --- | --- | --- |
| `AXCL_BUILD_CPU_LIMIT_PERCENT` | Controls the internal build parallelism budget as a percentage of online CPU cores. | `80` | Keep the default for daily builds. On shared build machines or when reducing load, set it to `50` or lower. |
| `AXCL_ALL_HOSTS` | Host list expanded when `host=all`. | `x86 arm64` | Modify `axcl/build/config.mk`. |
| `AXCL_HOST_LIBC_<arch>` | libc build matrix for one arch under `host=all`, for example `AXCL_HOST_LIBC_x64` or `AXCL_HOST_LIBC_aarch64`. | `gnu` | Defaults to `gnu`. If the default libc matrix must be changed, modify `build/config.mk`; do not override it through an environment variable or a `make` parameter. |
| `AXCL_GLIBC_VERSION` | Specifies the target gnu libc version and passes it to the Zig gnu toolchain. | Defined by `build/projects/axcl_linux_<arch>.mk` | Usually do not modify it. See [glibc / dynamic linker matrix](#en-build-glibc-dynamic-linker-matrix) for default versions. If it must be adjusted, modify the matching `build/projects/axcl_linux_<arch>.mk`; do not override it through an environment variable or a `make` parameter. It applies only to `libc=gnu`. |
| `AXCL_PACKAGE_OUTPUT_DIR` | Overrides the final copy directory for `.deb` and `.rpm` files. | `out/axcl_linux_<host>_<libc>/package/` | Set it to a unified output directory for CI or release archiving. |

Generic format:

```bash
make host=<host> <param>=<value> clean all install
```

Typical examples:

```bash
# Limit this build to about 50% of online CPUs
make host=x86 AXCL_BUILD_CPU_LIMIT_PERCENT=50 clean all install

# Specify the package output directory
make host=x86 AXCL_PACKAGE_OUTPUT_DIR=/tmp/axcl-package clean all install package
```

```{note}
- For a single Linux host, `libc=gnu,musl` or `libc="gnu musl"` is split into one sub-build per libc.
- Under `host=all`, the `libc=` parameter is ignored. The actual host matrix is controlled by `AXCL_ALL_HOSTS`, and the actual libc matrix is controlled by `AXCL_HOST_LIBC_<arch>` in `build/config.mk`.
```

### 2.4. Examples

```bash
# Build all linux hosts (matrix)
make clean all install

# Build x86 only with the default libc set
make host=x86 clean all install package
```

### 2.5. Clean and Rebuild

- `make clean`: removes the build and install directories for the current host/libc.
- If the configuration is inconsistent or the CMake cache is stuck, run `rm -rf build/out` to force a rebuild.

## 3. Package Generation

```bash
# Build, install, and package the current all-host matrix
make host=all clean all install package

# Build, install, and package the x86 entry through the top-level Makefile
make host=x86 clean all install package
```

Package output directory:
- Default: `out/axcl_linux_<host>_<libc>/package/`
- Override: set `AXCL_PACKAGE_OUTPUT_DIR=/absolute/path/to/output` to copy the final `.deb` and `.rpm` files to another directory.

## 4. Output Directory

```text
out/axcl_linux_<host>_<libc>/
├── bin/        # Executables
├── data/       # Package data payload, including foreign/<arch>/
├── etc/        # Local install-tree configuration
├── lib/        # AXCL runtime libraries
├── include/    # Public headers
├── package/    # Final .deb/.rpm delivery directory
├── test/       # gtest test programs
└── unstripped/ # Pre-strip debug files used to generate Breakpad symbols
```

Path notes:
- User-facing `host=arm64` maps to `out/axcl_linux_aarch64_<libc>/`.
- User-facing `host=x86` maps to `out/axcl_linux_x64_<libc>/`.

## 5. Minidump

AXCL uses Breakpad to support minidump generation. When a process crashes abnormally, Breakpad can generate a lightweight minidump file that records crash-site information such as threads, registers, and loaded modules for later debugging.

A minidump does not contain full debug symbols. AXCL release/install outputs are usually stripped, so debug information such as function names, source files, and line numbers must be preserved separately and converted to Breakpad symbols. To analyze a minidump, prepare:

- The minidump file generated at the crash site;
- Breakpad symbols that match the crashed binaries;
- The `minidump_stackwalk` analysis tool.

AXCL provides `scripts/minidump/collect_symbols.sh` to collect host/device Breakpad symbols and generate archives.

Before running the script, complete the corresponding build and install first. `make install` installs stripped `bin`, `lib`, and `test` outputs, and keeps debug files under `unstripped/**/*.debug`. The collection script scans `.debug` files, runs `dump_syms` to generate `symbols/**`, and then creates an archive.

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
- Device symbols come from `<manifest-dir>/msp/out/arm64_glibc`.

## 6. FAQ

1.
   [Q] Build fails after switching options?<br>
   [A] This is usually caused by stale CMake cache. Run `rm -rf build/out` first, then build again.
2.
   [Q] How do I check or change the default glibc version for a host?<br>
   [A] See [glibc / dynamic linker matrix](#en-build-glibc-dynamic-linker-matrix) for default versions. If you really need to change it, adjust `AXCL_GLIBC_VERSION` in `build/projects/axcl_linux_<arch>.mk`.
3.
   [Q] How do I add a new libc?<br>
   [A]
    - Add the new libc name to `AXCL_SUPPORTED_LIBCS` in `build/config.mk`.
    - Add `build/cmake/toolchains/<host>-linux-<new-libc>-zig.cmake` for each host that should support it.
    - If it should be part of the default matrix, update the corresponding `AXCL_HOST_LIBC_<arch>` default.
4.
   [Q] How do I clean up leftovers after a failed DEB installation?<br>
   [A] Although a failed DEB installation attempts to roll back, side effects created during `postinst`, such as logs, profile snippets, dynamic linker configuration, CMake wrappers, DKMS state, or kernel modules, may remain if scripts are interrupted, downgrade succeeds, or the package manager stays in a half-configured state.

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
   [Q] Why does `apt install ./axhelix_linux_x64_gnu.deb` show an `_apt` sandbox fallback message?<br>
   [A] This happens when the local `.deb` path cannot be traversed by the `_apt` user, for example when the home directory permission is `750`. Move the package to a path accessible by `_apt`, such as `/tmp/`, and install it from there. For example: `cp ~/Desktop/axhelix_linux_x64_gnu.deb /tmp/ && sudo apt install /tmp/axhelix_linux_x64_gnu.deb`.

## 7. Appendix

(en-build-glibc-dynamic-linker-matrix)=
### 7.1. glibc / dynamic linker matrix

| host | gnu glibc | gnu `.interp` | musl `.interp` |
| --- | --- | --- | --- |
| arm64 | 2.30 | `/lib/ld-linux-aarch64.so.1` | `/lib/ld-musl-aarch64.so.1` |
| x86 | 2.30 | `/lib64/ld-linux-x86-64.so.2` | `/lib/ld-musl-x86_64.so.1` |
| loongarch64 | 2.40 | `/lib64/ld-linux-loongarch-lp64d.so.1` | `/lib/ld-musl-loongarch64.so.1` |
| riscv64 | 2.39 | `/lib/ld-linux-riscv64-lp64d.so.1` | `/lib/ld-musl-riscv64.so.1`¹ |

¹ `riscv64 + musl` is currently still blocked by the PIC limitation of Zig 0.15.2 `libzigc.a`; the link stage reports `R_RISCV_HI20`.

### 7.2. Toolchain File Index

This table lists only officially supported Linux Zig toolchain files. It intentionally excludes `*-gcc.cmake`, Windows toolchains, and subdirectories under `build/cmake/toolchains/`.

| host × libc | Toolchain file under `build/cmake/toolchains/` |
| --- | --- |
| arm64 / gnu | `aarch64-linux-gnu-zig.cmake` |
| arm64 / musl | `aarch64-linux-musl-zig.cmake` |
| x86 / gnu | `x86_64-linux-gnu-zig.cmake` |
| x86 / musl | `x86_64-linux-musl-zig.cmake` |
| loongarch64 / gnu | `loongarch64-linux-gnu-zig.cmake` |
| loongarch64 / musl | `loongarch64-linux-musl-zig.cmake` |
| riscv64 / gnu | `riscv64-linux-gnu-zig.cmake` |
| riscv64 / musl | `riscv64-linux-musl-zig.cmake` |
