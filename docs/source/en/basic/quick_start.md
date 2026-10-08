# Quick Start

This page describes how to quickly verify that the runtime environment is available after driver installation on the host, and how to run a model benchmark or a basic sample for validation.

## 1. Environment Check

Taking a Linux host system as an example, confirm the following before you start:

1. Hardware installation, package installation, and driver loading have been completed according to the [Installation Guide](install/linux.md).
2. The current shell has loaded the environment variables:

   ```bash
   source /etc/profile
   ```

## 2. Query Device

Run `axcl-smi` to confirm that the host can find the device and read device information correctly:

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

## 3. Transfer Files with axcl-smi

`axcl-smi` can upload and download files between the Host and one selected Device through the Runtime file-transfer service:

```bash
axcl-smi push -d <device> <host_path> <device_path>
axcl-smi pull -d <device> <device_path> <host_path>
```

`-d` must select exactly one Device. `push` uploads a Host file to the Device and `pull` downloads a Device file to the Host:

```bash
# Upload a Host model to Device 0.
axcl-smi push -d 0 ./model.axmodel /tmp/model.axmodel

# Download a Device log from Device 0 to the Host.
axcl-smi pull -d 0 /tmp/runtime.log ./runtime.log
```

Use `-r` or `--recursive` explicitly for a directory tree:

```bash
axcl-smi push -d 0 -r ./assets /tmp/deploy
axcl-smi pull -d 0 --recursive /tmp/deploy/assets ./download
```

Destination semantics, the 4 GiB per-file limit, 32 MiB chunks, and errors follow the [File API](../develop/c/file_api.md). Without `-r`, `push` accepts only a regular Host file. The `pull` source is on the Device, so `-r` explicitly selects file or directory transfer. These commands do not start a Userworker and require matched Host Runtime and Device `slave_worker` versions.

## 4. Model Benchmark

`axcl_run_model` can be used to load a `.axmodel` model and collect inference latency statistics. Use `-m` to specify the model file and `-r` to specify the number of repeated runs:

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
