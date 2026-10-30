# Quick Start

This page shows how to check that the runtime environment works after the package is installed on the host, how to transfer files to a device, and how to run a model benchmark.

## 1. Environment Check

Taking a Linux host system as an example, confirm the following before you start:

1. Hardware installation, package installation, and driver loading have been completed according to the [Installation Guide](install/linux.md).
2. The current shell has loaded the environment variables:

   ```bash
   source /etc/profile
   ```

## 2. Query Device

Run `axcl-smi` to confirm that the host finds the device and can read its information. Without a command, `axcl-smi` prints the status of all devices once:

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

## 3. Transfer Files with axcl-smi

`axcl-smi` can upload files to and download files from one Device:

```bash
axcl-smi push -d <device> <host_path> <device_path>
axcl-smi pull -d <device> <device_path> <host_path>
```

`-d` selects the Device and is required. `push` uploads from the Host to the Device, and `pull` downloads from the Device to the Host:

```bash
# Upload a Host model to Device 0.
axcl-smi push -d 0 ./model.axmodel /tmp/model.axmodel

# Download a Device log from Device 0 to the Host.
axcl-smi pull -d 0 /tmp/runtime.log ./runtime.log
```

To transfer a directory tree, add `-r` or `--recursive`:

```bash
axcl-smi push -d 0 -r ./assets /tmp/deploy
axcl-smi pull -d 0 --recursive /tmp/deploy/assets ./download
```

Without `-r`, the source must be a single non-empty regular file; with `-r`, it must be a directory. `push` checks the Host source before transferring. `pull` cannot check the Device source in advance, so add `-r` whenever the Device source is a directory. For a single file, if the destination ends with `/` or is an existing directory, the file is placed in it under its source name. Each file must not exceed 4 GiB. For the other destination rules and the error codes, see the [File API](../develop/c/file_api.md). The Host and the Device must run software from the same AXCL release.

## 4. Model Benchmark

`axcl_run_model` loads a `.axmodel` model, runs it repeatedly, and reports inference latency statistics. `-m` specifies the model file and `-r` the number of runs (default `1`). One warm-up run is performed first by default; change it with `-w`:

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
