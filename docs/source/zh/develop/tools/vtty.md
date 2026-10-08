# 虚拟终端

`ax_vtty` 为主控和设备之间提供虚拟终端。主控侧通过 `/dev/ttyAXV*` 连接设备终端，使用体验与串口终端类似。

`ax_vtty` 不连接物理 UART。`115200` 只是终端工具需要的兼容参数，不代表 AXCL 链路的实际速率。

## 1. 安装 `picocom`

主控侧推荐使用 `picocom` 连接虚拟终端。根据主控操作系统选择安装命令：

**Debian / Ubuntu：**

```bash
sudo apt update
sudo apt install -y picocom
```

**CentOS：**

```bash
sudo yum install -y picocom
```

安装完成后确认命令可用：

```bash
picocom --help
```

## 2. 使用前确认

`ax_vtty` 的加载方式取决于运行位置：

- **主控侧**：需要用户手动加载 `ax_vtty`。
- **设备侧**：系统启动时会自动加载 `ax_vtty`，一般不需要手动操作。

`axcl-smi sh` 可用来检查设备侧模块和节点。下面以 0 号设备为例：

```bash
# 检查设备侧模块
axcl-smi sh -d 0 "lsmod | grep -E 'ax_vtty'"

# 检查设备侧虚拟终端节点
axcl-smi sh -d 0 "ls -l /dev/ttyAXV*"
```

如果设备侧已正常加载，通常可以看到 `ax_vtty` 和 `/dev/ttyAXV0`。`axcl-smi sh` 只适合执行检查命令，不提供交互式 TTY；真正连接终端时应使用 `picocom`。

## 3. 主控侧加载驱动

主控侧只需要手动加载 `ax_vtty`：

```bash
sudo modprobe ax_vtty
```

`modprobe` 会按模块依赖自动处理，完成驱动加载。

加载后确认主控侧节点：

```bash
lsmod | grep ax_vtty
ls -l /dev/ttyAXV*
dmesg | grep 'vtty: /dev/'
```

日志会给出节点和设备 ID 的对应关系，例如：

```text
vtty: /dev/ttyAXV0 devid 3 port 80 ready, rx_pkts 1024 payload 1024
```

主控侧只加载一次即可。设备数量或设备 ID 发生变化后，需要重新加载主控侧模块，节点才会按新的设备列表创建。

## 4. 使用 `picocom` 连接终端

推荐使用 `picocom`。以主控侧的 `/dev/ttyAXV0` 为例：

```bash
sudo picocom -b 115200 --flow n /dev/ttyAXV0
```

常用终端参数如下：

| 参数 | 设置 |
| --- | --- |
| 波特率 | `115200` |
| 数据位 | `8` |
| 停止位 | `1` |
| 校验 | 无 |
| 硬件流控 | 关闭 |
| 软件流控 | 关闭 |

进入 `picocom` 后，如果设备侧已经启动 `getty`（默认会在子卡系统启动时拉起服务），会看到登录提示。请使用设备实际配置的账号和密码登录。

退出 `picocom`：

```text
Ctrl-A，然后 Ctrl-X
```

如果节点不是 `/dev/ttyAXV0`，以主控侧 `dmesg` 输出的节点名称为准：

```bash
sudo picocom -b 115200 --flow n /dev/ttyAXV1
```

同一个节点只能由一个终端程序独占。启动多个 `picocom`、`screen` 或 `minicom` 实例会导致输入被抢占或输出交错。

## 5. 一个完整使用示例

下面演示从检查设备到进入设备 shell 的完整流程。

### 5.1 检查设备侧

```bash
axcl-smi sh -d 0 "lsmod | grep -E 'ax_comm|ax_vtty'"
axcl-smi sh -d 0 "ls -l /dev/ttyAXV*"
```

如果设备侧没有 `ax_vtty`，先确认设备启动流程和内核日志；正常情况下不需要在设备侧手动 `insmod`。

### 5.2 加载主控侧

```bash
sudo modprobe ax_vtty
ls -l /dev/ttyAXV*
```

### 5.3 连接终端

```bash
sudo picocom -b 115200 --flow n /dev/ttyAXV0
```

进入终端后执行：

```text
cat /proc/ax_proc/version
```

## 6. 指定设备和节点名称

默认情况下，主控侧模块会为所有受支持设备创建节点。只连接指定设备时，在主控侧加载时传入 `devid`：

```bash
sudo modprobe ax_vtty devid=3
ls -l /dev/ttyAXV*
sudo picocom -b 115200 --flow n /dev/ttyAXV0
```

节点编号按模块加载时的枚举顺序分配，不一定等于 `devid`；应以 `dmesg | grep 'vtty: /dev/'` 的结果为准。

常用加载参数：

| 参数 | 默认值 | 说明 |
| --- | ---: | --- |
| `devid` | `-1` | `-1` 表示所有设备；非负值表示只绑定指定设备 ID。 |
| `port` | `80` | 虚拟终端通信端口。两端需要使用相同端口约定。 |
| `dev_name` | `ttyAXV` | 主控侧 TTY 节点名前缀。 |
| `payload_size` | `1024` | 单个通信包的最大载荷，允许范围为 `256` 到 `1024` 字节。 |
| `rx_buf_size` | `1048576` | 接收缓冲大小，最大为 `16777216` 字节。 |

参数只在加载时生效。修改参数前先退出 `picocom`，再卸载并重新加载：

```bash
sudo modprobe -r ax_vtty
sudo modprobe ax_vtty devid=3
```

`port` 和 `payload_size` 应与设备侧保持一致。设备侧通常由系统自动加载默认参数；如果主控侧使用了自定义值，请确认设备侧通信配置也匹配。


## 7. 故障排查

| 现象 | 检查方法 | 处理建议 |
| --- | --- | --- |
| 主控没有 `/dev/ttyAXV*` | `lsmod \| grep ax_vtty`、`dmesg \| grep vtty` | 在主控侧执行 `sudo modprobe ax_vtty`，让模块依赖自动处理通信模块。 |
| 设备侧没有 `ax_vtty` | `axcl-smi sh -d 0 "lsmod \| grep ax_vtty"` | 检查设备启动日志和模块文件；正常情况下设备侧应由系统自动加载。 |
| 设备侧没有 `/dev/ttyAXV*` | `axcl-smi sh -d 0 "ls -l /dev/ttyAXV*"` | 确认设备已枚举并且 devtmpfs 已挂载，必要时查看 `axcl-smi sh -d 0 "dmesg \| grep vtty"`。 |
| `picocom` 打开失败 | `ls -l /dev/ttyAXV*`、`dmesg \| grep vtty` | 使用实际存在的节点，并确认当前用户有读写权限。 |
| 节点存在但没有输出 | 检查两端 `port`、模块状态和终端进程 | 主控侧和设备侧使用相同 `port`；退出其他占用节点的程序后重试。 |
| 输出丢失或截断 | 查看 `dmesg \| grep vtty` 和设备侧日志 | 先打开 `picocom` 再启动业务，及时读取输出，必要时增大 `rx_buf_size`。 |

`axcl-smi sh` 只能检查设备侧状态，不能替代 `picocom` 提供交互式终端。
