# File

## Index

- [axclrtTransferDirectory](#axclrtTransferDirectory): Recursively transfer one directory.
- [axclrtTransferFile](#axclrtTransferFile): Transfer one file or remove one Device file.

<br>

## API

<a id="axclrtTransferDirectory"></a>

### axclrtTransferDirectory

Recursively transfer one directory.

#### Function

```c
AXCL_EXPORT axclError axclrtTransferDirectory(const char *src_dir, const char *dst_dir, axclrtFileTransferPolicy policy);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| src_dir | in | Source directory. Must not be NULL or empty. A trailing "/." copies only its contents. |
| dst_dir | in | Destination directory path. Must not be NULL or empty. |
| policy | in | Directory transfer direction. Removing directories is not supported. |

#### Returns

- `AXCL_SUCC`: The directory was transferred successfully.
- `others`: Failure.

#### Note

- Host-to-Device, Device-to-Host, and Device-to-Device transfers are supported.
- The operation uses the Device associated with the calling thread's current Context.
- If `dst_dir` is an existing directory, `src_dir` is copied into it as a subdirectory with the same name, unless `src_dir` ends with "/.". If `dst_dir` does not exist, it is created; its parent directory must already exist.
- Source symbolic links are followed. Cycles in the current ancestor chain are rejected.
- Existing destination files are overwritten; extra destination entries are preserved.
- Each regular file must not exceed 4 GiB; empty files are copied. Special files are not supported.
- Each path must not exceed 4096 bytes. The directory tree must not be deeper than 64 levels or contain more than 100000 entries.
- For Device-to-Device transfers, the destination must not be the source directory or inside it.
- If the transfer fails, entries already copied are not removed.
- Newly created Device directories/files use mode 0755. Newly created Host directories/files use modes 0700/0600 respectively.

<br>

<a id="axclrtTransferFile"></a>

### axclrtTransferFile

Transfer one file or remove one Device file.

#### Function

```c
AXCL_EXPORT axclError axclrtTransferFile(const char *src_path, const char *dst_path, axclrtFileTransferPolicy policy);
```

#### Parameters

| Name | Direction | Description |
|---|---|---|
| src_path | in | Source path, or the Device path to remove. Must not be NULL or empty. |
| dst_path | in | Destination path. This parameter may be NULL only when `policy` is [FILE_TRANSFER_REMOVE_DEVICE_FILE](reference/enum.md#FILE_TRANSFER_REMOVE_DEVICE_FILE); otherwise it must not be NULL or empty. |
| policy | in | File transfer operation. |

#### Returns

- `AXCL_SUCC`: The requested operation completed successfully.
- `others`: Failure.

#### Note

- The operation uses the Device associated with the calling thread's current Context.
- Copy operations support only a single non-empty regular file. Use [axclrtTransferDirectory](#axclrtTransferDirectory) for recursive directory transfer. Removal unlinks a single Device path; recursive removal is not supported.
- For Host-to-Device and Device-to-Device transfers, the Device destination parent directory must already exist and the destination file mode is 0755.
- For Device-to-Host transfers, missing Host destination parent directories are created and the destination file mode is 0600.
- Device-to-Device source and destination paths must be different.
- Each path must not exceed 4096 bytes, and a copied file must not exceed 4 GiB.
- An existing destination file is replaced only after the copy completes; if the copy fails, it is left unchanged.
