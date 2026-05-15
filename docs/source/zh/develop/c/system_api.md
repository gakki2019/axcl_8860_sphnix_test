# 系统 API

## 目录

- [axclAppLog](#axclapplog)
- [axclFinalize](#axclfinalize)
- [axclGetLogLevel](#axclgetloglevel)
- [axclInit](#axclinit)
- [axclSetLogLevel](#axclsetloglevel)
- [axclrtGetSocName](#axclrtgetsocname)
- [axclrtGetVersion](#axclrtgetversion)
- [axclrtGetVersionStr](#axclrtgetversionstr)

<br>

## API

<a id="axclAppLog"></a>

### axclAppLog

按以下格式记录应用日志：[date time][tid][level][APP][function][file][line]: formatted message。示例：axclAppLog(5, func, NULL, LINE, "json: %s, device: %d", json, device); 日志： [2024-11-12 14:24:22.380][1330][C][APP][main][53]: json: ./axcl.json, device: 129.

#### 函数

```c
AXCL_EXPORT void axclAppLog(int32_t lv, const char *func, const char *file, uint32_t line, const char *fmt,...);
```

#### 参数

| 名称 | 方向 | 说明                                                 |
| ---- | ---- | ---------------------------------------------------- |
| lv   | in   | 日志级别，参见 [axclSetLogLevel](#axclSetLogLevel)。 |
| func | in   | 函数名；如果设为 NULL，则不会打印函数名。            |
| file | in   | 文件名；如果设为 NULL，则不会打印文件名。            |
| line | in   | 行号                                                 |
| fmt  | in   | 日志消息的格式字符串，最大长度为 1024。              |

#### 返回值

不适用

#### 参考

[axclSetLogLevel](#axclSetLogLevel)

<br>

<a id="axclFinalize"></a>

### axclFinalize

结束 axcl 运行时。

#### 函数

```c
AXCL_EXPORT axclError axclFinalize();
```

#### 参数

不适用

#### 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

#### 说明

[axclFinalize](#axclFinalize) 必须在退出前显式调用，否则会导致终止性 abort。
不要在析构函数中调用 [axclFinalize](#axclFinalize)。

#### 参考

[axclInit](#axclInit)

<br>

<a id="axclGetLogLevel"></a>

### axclGetLogLevel

获取 axcl 日志级别。

#### 函数

```c
AXCL_EXPORT axclError axclGetLogLevel(int32_t *lv);
```

#### 参数

| 名称 | 方向 | 说明     |
| ---- | ---- | -------- |
| lv   | out  | 日志级别 |

#### 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

<br>

<a id="axclInit"></a>

### axclInit

初始化 axcl 运行时。

#### 函数

```c
AXCL_EXPORT axclError axclInit(const char *json);
```

#### 参数

| 名称 | 方向 | 说明                                                                                             |
| ---- | ---- | ------------------------------------------------------------------------------------------------ |
| json | in   | 以下任意一种 JSON 配置：<br>JSON 配置文件路径。<br>JSON 配置内容字符串。<br>NULL，使用默认配置。 |

#### 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

#### 说明

[axclInit](#axclInit) 应在任何其他 API 之前调用。
[axclInit](#axclInit) 可以被多次调用，但只会使用第一次传入的配置参数。
[axclFinalize](#axclFinalize) 应与 [axclInit](#axclInit) 成对调用，例如：axclInit(NULL); axclInit(NULL); [axclFinalize](#axclFinalize)(); [axclFinalize](#axclFinalize)();
通常 [axclInit](#axclInit) 和 [axclFinalize](#axclFinalize) 会在应用的 main 函数中调用。

#### 示例

```c
int main(int argc, char *argv[]) {
     axclInit(NULL);

     // TODO:

     axclFinalize();
     return 0;
}
```

<br>

<a id="axclSetLogLevel"></a>

### axclSetLogLevel

设置 axcl 日志级别。

#### 函数

```c
AXCL_EXPORT axclError axclSetLogLevel(int32_t lv);
```

#### 参数

| 名称 | 方向 | 说明                                                                      |
| ---- | ---- | ------------------------------------------------------------------------- |
| lv   | in   | 日志级别：0 trace，1 debug，2 info，3 warning，4 error，5 critical，6 off |

#### 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

<br>

<a id="axclrtGetSocName"></a>

### axclrtGetSocName

获取芯片名称。

#### 函数

```c
AXCL_EXPORT const char* axclrtGetSocName();
```

#### 参数

不适用

#### 返回值

- 芯片名称字符串。

<br>

<a id="axclrtGetVersion"></a>

### axclrtGetVersion

获取 axcl 版本。

#### 函数

```c
AXCL_EXPORT axclError axclrtGetVersion(int32_t *major, int32_t *minor, int32_t *patch);
```

#### 参数

| 名称  | 方向 | 说明         |
| ----- | ---- | ------------ |
| major | out  | 主版本号。   |
| minor | out  | 次版本号。   |
| patch | out  | 补丁版本号。 |

#### 返回值

- `AXCL_SUCC`：成功。
- `others`：失败。

<br>

<a id="axclrtGetVersionStr"></a>

### axclrtGetVersionStr

获取 axcl 版本字符串。

#### 函数

```c
AXCL_EXPORT const char* axclrtGetVersionStr();
```

#### 参数

不适用

#### 返回值

- 版本字符串。