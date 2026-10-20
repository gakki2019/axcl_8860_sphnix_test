# axcl

## 1. 目录

- [axcl.init](#axcl.init): 初始化 AXCL runtime。
- [axcl.finalize](#axcl.finalize): 去初始化 AXCL runtime。
- [axcl.app_log](#axcl.app_log): 按指定格式记录应用日志。

<br>

## 2. API

<a id="axcl.init"></a>

### 2.1. axcl.init

初始化 AXCL runtime。

#### 2.1.1. 函数

**Python 调用**

```python
ret = axcl.init(json)
```

**C++ 原型**

```cpp
axclError axclInit(const char *json);
```

#### 2.1.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| json | str &#124; bytes &#124; None | JSON 配置文件路径或 JSON 内容字符串。为 NULL 或空字符串时使用默认配置。 |

#### 2.1.3. 返回值

- `ret`: *int* — 成功。失败。

#### 2.1.4. 说明

返回类型：`int`。

源码：`python/axcl/rt/axcl.py:116`。

#### 2.1.5. 示例

```python
ret = axcl.init(json)
```

<br>

<a id="axcl.finalize"></a>

### 2.2. axcl.finalize

去初始化 AXCL runtime。

#### 2.2.1. 函数

**Python 调用**

```python
ret = axcl.finalize()
```

**C++ 原型**

```cpp
axclError axclFinalize(void);
```

#### 2.2.2. 参数

不适用

#### 2.2.3. 返回值

- `ret`: *int* — 成功。失败。

#### 2.2.4. 说明

返回类型：`int`。

源码：`python/axcl/rt/axcl.py:147`。

#### 2.2.5. 示例

```python
ret = axcl.finalize()
```

<br>

<a id="axcl.app_log"></a>

### 2.3. axcl.app_log

按指定格式记录应用日志。

#### 2.3.1. 函数

**Python 调用**

```python
axcl.app_log(lv, func, file, line, fmt, *args)
```

**C++ 原型**

```cpp
void axclAppLog(int32_t lv, const char *func, const char *file, uint32_t line, const char *fmt, ...);
```

#### 2.3.2. 参数

| 名称 | 类型 | 说明 |
|---|---|---|
| lv | int | 日志级别。参见（源码未提供引用目标）。 |
| func | str &#124; bytes &#124; None | 函数名。为 NULL 时不打印函数名。 |
| file | str &#124; bytes &#124; None | 文件名。为 NULL 时不打印文件名。 |
| line | int | 行号。 |
| fmt | str &#124; bytes &#124; None | 非 NULL 的 `printf` 风格格式字符串。格式化后的消息存储在 1024 字节的内部缓冲区中，包括结尾的 NUL。超过 1023 字节的消息会被截断。格式说明符必须与参数匹配。 |
| args | object | 源码未提供参数说明。 |

#### 2.3.3. 返回值

- None

#### 2.3.4. 说明

返回类型：`None`。

源码：`python/axcl/rt/axcl.py:175`。

#### 2.3.5. 示例

```python
axcl.app_log(lv, func, file, line, fmt, *args)
```
