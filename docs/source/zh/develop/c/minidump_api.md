# 小型转储

## 1. 目录

- [axclInitializeMinidump](#axclInitializeMinidump)
- [axclUninitializeMinidump](#axclUninitializeMinidump)

<br>

## 2. API

<a id="axclInitializeMinidump"></a>

### 2.1. axclInitializeMinidump

启用 minidump 功能。

本函数返回成功后，进程崩溃时会生成 `.dmp` 文件。

#### 2.1.1. 函数

```c
AXCL_EXPORT bool axclInitializeMinidump(const axclMinidumpConfig *config);
```

#### 2.1.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| config | in | Minidump 配置。可以为 NULL，表示使用环境变量或平台默认值。 |

#### 2.1.3. Dump 目录

选定的目录必须可写。如果目录不存在，本函数会同时创建缺失的父目录。按以下顺序使用第一个非空值：

1. `AXCL_DUMP_DIR` 环境变量。
2. `config->dump_dir`。
3. 平台默认目录：Linux 上为 `/tmp`。

#### 2.1.4. 说明

- 如果 minidump 已启用，本函数直接返回 `true`，不会修改当前 Dump 目录。
- 如需使用不同配置重新初始化，必须先调用 [axclUninitializeMinidump](#axclUninitializeMinidump)。
- Dump 文件名包含进程名、进程 ID、线程 ID 和 UTC 时间戳。

#### 2.1.5. 返回值

- `true`：minidump 功能已启用。
- `false`：启用失败，通常原因是无法创建选定的 Dump 目录，或该目录不可写。

#### 2.1.6. 参考

如需了解更多 minidump 信息，参阅 [Minidump](../../faq/minidump_analysis.md)。

<br>

<a id="axclUninitializeMinidump"></a>

### 2.2. axclUninitializeMinidump

禁用 minidump 功能。

#### 2.2.1. 函数

```c
AXCL_EXPORT void axclUninitializeMinidump(void);
```

#### 2.2.2. 参数

不适用

#### 2.2.3. 说明

进程退出时，即使不调用本函数，minidump 相关资源也会自动释放，推荐和 [axclInitializeMinidump](#axclInitializeMinidump) 成对调用。

#### 2.2.4. 返回值

不适用
