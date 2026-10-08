# 文件

## 1. 目录

- [axclrtTransferDirectory](#axclrtTransferDirectory)：递归传输一个目录。
- [axclrtTransferFile](#axclrtTransferFile)：传输一个文件或删除一个 Device 文件。

<br>

## 2. API

<a id="axclrtTransferDirectory"></a>

### 2.1. axclrtTransferDirectory

递归传输一个目录。

#### 2.1.1. 函数

```c
AXCL_EXPORT axclError axclrtTransferDirectory(const char *src_dir, const char *dst_dir, axclrtFileTransferPolicy policy);
```

#### 2.1.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| src_dir | in | 源目录。路径末尾添加 `/.` 表示仅复制目录内容。 |
| dst_dir | in | 目标目录路径。 |
| policy | in | 目录传输方向。不支持删除目录。 |

#### 2.1.3. 返回值

- `AXCL_SUCC`：请求的操作执行成功。
- 其他错误：失败。

#### 2.1.4. 说明

- 支持 Host-to-Device、Device-to-Host 和 Device-to-Device 传输。
- 会跟随源符号链接；当前祖先链中的循环会被拒绝。
- 已存在的目标文件会被覆盖，目标目录中多余的条目会保留。
- 每个普通文件不得超过 4 GiB。不支持特殊文件。
- 新建的 Device 目录和文件权限为 `0755`；新建的 Host 目录和文件权限分别为 `0700` 和 `0600`。

<br>

<a id="axclrtTransferFile"></a>

### 2.2. axclrtTransferFile

传输一个文件或删除一个 Device 文件。

#### 2.2.1. 函数

```c
AXCL_EXPORT axclError axclrtTransferFile(const char *src_path, const char *dst_path, axclrtFileTransferPolicy policy);
```

#### 2.2.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| src_path | in | 源路径，或要删除的 Device 文件路径。 |
| dst_path | in | 目标路径。仅当 `policy` 为 [FILE_TRANSFER_REMOVE_DEVICE_FILE](reference/enum.md#FILE_TRANSFER_REMOVE_DEVICE_FILE) 时，本参数可以为 NULL。 |
| policy | in | 文件传输操作。 |

#### 2.2.3. 返回值

- `AXCL_SUCC`：请求的操作执行成功。
- 其他错误：失败。

#### 2.2.4. 说明

- 本操作使用调用线程当前 Context 所属的 Device。
- 仅支持单个非空普通文件。递归传输目录请使用 [axclrtTransferDirectory](#axclrtTransferDirectory)；不支持递归删除。
- 对于 Host-to-Device 和 Device-to-Device 传输，Device 目标文件的父目录必须已存在，目标文件权限为 `0755`。
- 对于 Device-to-Host 传输，如果 Host 目标文件的父目录不存在，则会自动创建，目标文件权限为 `0600`。
- Device-to-Device 传输的源路径和目标路径必须不同。
