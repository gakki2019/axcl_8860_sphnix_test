# 系统

## 1. 目录

- [axclFinalize](#axclFinalize)
- [axclInit](#axclInit)

<br>

## 2. API

<a id="axclFinalize"></a>

### 2.1. axclFinalize

去初始化运行时并释放其资源。

#### 2.1.1. 函数

```c
AXCL_EXPORT axclError axclFinalize();
```

#### 2.1.2. 参数

不适用

#### 2.1.3. 返回值

- `AXCL_SUCC`：成功。
- 其他错误：失败。

#### 2.1.4. 说明

- 必须在进程退出前显式调用 [axclFinalize](#axclFinalize)。每次成功调用 [axclInit](#axclInit) 都会增加内部引用计数，因此必须有一次对应的 [axclFinalize](#axclFinalize) 调用。失败的 [axclInit](#axclInit) 不需要配对调用。
- 不要在 C++ 静态或全局对象析构期间调用本接口，此时 AXCL 运行时依赖项可能已经被销毁。

#### 2.1.5. 参考

[axclInit](#axclInit)

<br>

<a id="axclInit"></a>

### 2.2. axclInit

初始化 AXCL 运行时。使用其他 AXCL API 之前必须先调用本接口。

#### 2.2.1. 函数

```c
AXCL_EXPORT axclError axclInit(const char *json);
```

#### 2.2.2. 参数

| 名称 | 方向 | 说明 |
|---|---|---|
| json | in | JSON 配置文件路径或 JSON 内容字符串。NULL 或空字符串表示使用默认配置。 |

#### 2.2.3. 返回值

- `AXCL_SUCC`：成功。
- 其他错误：失败。

#### 2.2.4. 示例

```c
 int main(int argc, char *argv[]) {
      axclInit("");

      // TODO:

      axclFinalize();
      return 0;
 }
```

#### 2.2.5. 说明

- 运行时通过引用计数管理生命周期：每次成功调用 [axclInit](#axclInit) 都会使引用计数加 1，[axclFinalize](#axclFinalize) 使引用计数减 1。只有引用计数降到 0 时才会释放资源。
- 失败的 [axclInit](#axclInit) 不会获取引用，也不需要与 [axclFinalize](#axclFinalize) 配对。
- 一个进程可以多次调用 [axclInit](#axclInit)，但每次成功调用都必须与 [axclFinalize](#axclFinalize)() 配对。例如：
  ```c
      axclInit("") -> axclFinalize() -> axclInit("") -> axclFinalize()
      axclInit("") -> axclInit("") -> axclFinalize() -> axclFinalize()
  ```
- [axclInit](#axclInit) 和 [axclFinalize](#axclFinalize) 是线程安全的，建议在主线程中完成初始化和清理。
- 进程退出前引用计数必须为 0，否则可连接的运行时线程可能在静态对象析构期间导致进程异常终止。
- 仅在引用计数为 0 时加载配置。调用成功后引用计数从 0 变为 1；在引用计数重新降到 0 之前，后续调用不会重新加载配置：

  ```c
      axclInit("config1.json") // 加载 config1.json
      axclInit("config2.json") // 不加载 config2.json
      axclFinalize()
      axclFinalize()
      axclInit("config3.json") // 加载 config3.json
      axclFinalize()
  ```
- JSON 字符串无效或配置文件路径不可读时返回 `AXCL_ERR_RT_FAIL`，不会尝试初始化运行时，引用计数保持为 0。

#### 2.2.6. JSON

- `log.host.level`：Host 日志级别，参见 [axclSetLogLevel](other_api.md#axclSetLogLevel)。
- `log.host.path`：Host 日志文件路径。在 Linux 上，如果 `AXCL_LOG_DIR` 已设置且非空，默认路径为 `${AXCL_LOG_DIR}/axcl_host.log`；否则为 `/tmp/axcl/axcl_host.log`。
- `log.device.level`：Device 日志级别。
- `log.host.path` 仅在进程启动时生效一次。调用 [axclFinalize](#axclFinalize) 后再次调用 [axclInit](#axclInit)，不会将已经创建的日志切换到新路径。

  ```json
  {
    "log": {
      "host": {
        "level": 2,
        "path": "/tmp/axcl/axcl_host.log"
      },
      "device": {
        "level": 2
      }
    }
  }
  ```
