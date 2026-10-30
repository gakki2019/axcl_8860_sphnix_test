# 快速开始

本文说明在主控上完成软件包安装后，如何确认运行环境可用、如何向设备传输文件，以及如何执行模型跑分。

## 1. 环境确认

以 Linux 主控系统为例，开始前请确认已经完成以下准备：

1. 已按 [安装指南](install/linux.md) 完成硬件安装、软件包安装和驱动加载。
2. 当前 shell 已加载环境变量：

   ```bash
   source /etc/profile
   ```

## 2. 查询设备

执行 `axcl-smi`，确认主控能够找到设备并读取设备信息。不带命令执行时，`axcl-smi` 会输出一次所有设备的状态：

```bash
$ axcl-smi
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

`axcl-smi` 可以向一个 Device 上传文件，或从该 Device 下载文件：

```bash
axcl-smi push -d <device> <host_path> <device_path>
axcl-smi pull -d <device> <device_path> <host_path>
```

`-d` 用于选择 Device，且必须指定。`push` 从主控上传到 Device，`pull` 从 Device 下载到主控：

```bash
# 将 Host 的模型上传到 0 号 Device。
axcl-smi push -d 0 ./model.axmodel /tmp/model.axmodel

# 将 0 号 Device 的日志下载到 Host。
axcl-smi pull -d 0 /tmp/runtime.log ./runtime.log
```

传输目录树时，请添加 `-r` 或 `--recursive`：

```bash
axcl-smi push -d 0 -r ./assets /tmp/deploy
axcl-smi pull -d 0 --recursive /tmp/deploy/assets ./download
```

不加 `-r` 时，源路径必须是单个非空普通文件；加 `-r` 时，源路径必须是目录。`push` 会在传输前检查 Host 上的源路径；`pull` 无法预先检查 Device 上的源路径，因此 Device 上的源路径是目录时必须添加 `-r`。传输单个文件时，如果目标路径以 `/` 结尾或是已存在的目录，文件会以源文件名放入该目录。每个文件都不得超过 4 GiB。其他目标路径规则和错误码请参见[文件接口](../develop/c/file_api.md)。Host 与 Device 必须运行同一 AXCL 发布版本的软件。

## 4. 模型跑分

`axcl_run_model` 用于加载 `.axmodel` 模型，重复运行并统计推理耗时。`-m` 指定模型文件，`-r` 指定运行次数（默认 `1`）。默认先执行一次预热运行，可通过 `-w` 修改：

```bash
$ axcl_run_model -m yolov5s.axmodel -r 100
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
