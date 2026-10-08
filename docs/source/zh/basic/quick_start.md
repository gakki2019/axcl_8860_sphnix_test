# 快速开始

本文说明在主控上完成驱动安装后，如何快速确认运行环境可用，执行模型跑分或基础示例验证。

## 1. 环境确认

以 Linux 主控系统为例，开始前请确认已经完成以下准备：

1. 已按 [安装指南](install/linux.md) 完成硬件安装、软件包安装和驱动加载。
2. 当前 shell 已加载环境变量：

   ```bash
   source /etc/profile
   ```

## 2. 查询设备

执行 `axcl-smi`，确认主控能够找到设备，并能正常读取设备信息：

```bash
root:/# axcl-smi
+------------------------------------------------------------------------------------------------+
| AXCL-SMI  V1.0.0                                                              Driver  V1.0.0   |
+-----------------------------------------+--------------+---------------------------------------+
| Card  Name                     Firmware | Bus-Id       |                          Memory-Usage |
| Fan   Temp                Pwr:Usage/Cap | CPU      NPU |                             CMM-Usage |
|=========================================+==============+=======================================|
|    0  AX8860                     V1.0.0 | 0001:81:00.0 |                181 MiB /      954 MiB |
|   --   52C                      -- / -- | 3%        0% |                 22 MiB /     3072 MiB |
+-----------------------------------------+--------------+---------------------------------------+

+------------------------------------------------------------------------------------------------+
| Processes:                                                                                     |
| Card      PID  Process Name                                                   NPU Memory Usage |
|================================================================================================|
```

## 3. 使用 axcl-smi 传输文件

`axcl-smi` 可以通过 Runtime 文件传输服务在主控和指定 Device 之间上传或下载文件：

```bash
axcl-smi push -d <device> <host_path> <device_path>
axcl-smi pull -d <device> <device_path> <host_path>
```

`-d` 必须指定唯一的 Device 编号。`push` 将主控文件上传到 Device，`pull` 将 Device 文件下载到主控：

```bash
# 将 Host 的模型上传到 0 号 Device。
axcl-smi push -d 0 ./model.axmodel /tmp/model.axmodel

# 将 0 号 Device 的日志下载到 Host。
axcl-smi pull -d 0 /tmp/runtime.log ./runtime.log
```

递归传输目录时必须显式添加 `-r` 或 `--recursive`：

```bash
axcl-smi push -d 0 -r ./assets /tmp/deploy
axcl-smi pull -d 0 --recursive /tmp/deploy/assets ./download
```

目录目标路径、单文件 4 GiB 上限、32 MiB 分片和错误处理遵循[文件接口](../develop/c/file_api.md)。`push` 未添加 `-r` 时只接受 Host 普通文件；`pull` 的源路径位于 Device，由 `-r` 明确选择文件或目录传输。该命令不启动 Userworker，要求 Host Runtime 与 Device `slave_worker` 使用配套版本。

## 4. 模型跑分

`axcl_run_model` 可用于加载 `.axmodel` 模型并统计推理耗时，其中 `-m` 指定模型文件，`-r` 指定重复运行次数：

```bash
root:/# axcl_run_model -m yolov5s.axmodel -r 100
   Run AxModel:
         model: yolov5s.axmodel
          type: 1 Core
          vnpu: Disable
        warmup: 1
        repeat: 100
         batch: { auto: 1 }
    axclrt ver: 1.0.0
   pulsar2 ver: 1.2-patch2 7e6b2b5f
      tool ver: 0.0.1
      cmm size: 12730188 Bytes
  ---------------------------------------------------------------------------
  min =   7.793 ms   max =   7.929 ms   avg =   7.804 ms  median =   7.799 ms
   5% =   7.796 ms   90% =   7.808 ms   95% =   7.832 ms     99% =   7.929 ms
  ---------------------------------------------------------------------------
```
