# Minidump

## Index

- [axclInitializeMinidump](#axclInitializeMinidump): Enable minidump.
- [axclUninitializeMinidump](#axclUninitializeMinidump): Disable minidump.

<br>

## API

<a id="axclInitializeMinidump"></a>

### axclInitializeMinidump

Enable minidump.

After this function returns `true`, a `.dmp` file is generated if the process crashes.

#### Function

```c
AXCL_EXPORT bool axclInitializeMinidump(const axclMinidumpConfig *config);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| config | in | Minidump configuration. May be NULL to use the environment variable or platform default. |

#### Dump directory

The selected directory must be writable. If it does not exist, this function creates it together with any missing parent directories. The first non-empty value in the following order is used:

1. The [AXCL_DUMP_DIR](../../appendix/environment_variables.md#AXCL_DUMP_DIR) environment variable.
2. `config->dump_dir`.
3. The platform default: `/tmp` on Linux.

#### Note

- If minidump is already enabled, this function returns `true` without changing the current dump directory.
- Call [axclUninitializeMinidump](#axclUninitializeMinidump) before initializing again with a different configuration.
- The dump file name includes the process name, process ID, thread ID, and UTC timestamp.

#### Returns

- `true`: Minidump is enabled.
- `false`: Minidump could not be enabled, typically because the selected dump directory could not be created or is not writable.

#### Remark

- [Minidump](../../faq/minidump_analysis.md)

<br>

<a id="axclUninitializeMinidump"></a>

### axclUninitializeMinidump

Disable minidump.

#### Function

```c
AXCL_EXPORT void axclUninitializeMinidump(void);
```

#### Parameters

N/A

#### Note

Minidump-related resources are automatically released when the process exits even if this function is not called. It is recommended to use this function together with [axclInitializeMinidump](#axclInitializeMinidump).

#### Returns

N/A
