# 错误码参考

## COMM

| 符号                                                                    | Host Hex   | Host Int32  | Device Hex | Device Int32 | 说明                                 |
| ----------------------------------------------------------------------- | ---------- | ----------- | ---------- | ------------ | ------------------------------------ |
| <a id="AXCL_ERR_COMM_ALREADY_OPEN"></a>AXCL_ERR_COMM_ALREADY_OPEN       | 0x80305022 | -2144317406 | 0x80315022 | -2144251870  | 公共通道已打开。                     |
| <a id="AXCL_ERR_COMM_BUSY"></a>AXCL_ERR_COMM_BUSY                       | 0x80305006 | -2144317434 | 0x80315006 | -2144251898  | 模块正忙。                           |
| <a id="AXCL_ERR_COMM_CANCELED"></a>AXCL_ERR_COMM_CANCELED               | 0x8030502B | -2144317397 | 0x8031502B | -2144251861  | 操作已取消。                         |
| <a id="AXCL_ERR_COMM_CLOSED"></a>AXCL_ERR_COMM_CLOSED                   | 0x80305024 | -2144317404 | 0x80315024 | -2144251868  | 公共通道已关闭。                     |
| <a id="AXCL_ERR_COMM_FAIL"></a>AXCL_ERR_COMM_FAIL                       | 0x80305020 | -2144317408 | 0x80315020 | -2144251872  | 公共模块发生通用失败。               |
| <a id="AXCL_ERR_COMM_ILLEGAL_PARAM"></a>AXCL_ERR_COMM_ILLEGAL_PARAM     | 0x80305003 | -2144317437 | 0x80315003 | -2144251901  | 传入了无效参数。                     |
| <a id="AXCL_ERR_COMM_INIT_FAILED"></a>AXCL_ERR_COMM_INIT_FAILED         | 0x80305025 | -2144317403 | 0x80315025 | -2144251867  | 初始化失败。                         |
| <a id="AXCL_ERR_COMM_INTERRUPTED"></a>AXCL_ERR_COMM_INTERRUPTED         | 0x8030502C | -2144317396 | 0x8031502C | -2144251860  | 操作被中断。                         |
| <a id="AXCL_ERR_COMM_INVALID_STATE"></a>AXCL_ERR_COMM_INVALID_STATE     | 0x8030502A | -2144317398 | 0x8031502A | -2144251862  | 模块处于不适合执行此操作的无效状态。 |
| <a id="AXCL_ERR_COMM_IO"></a>AXCL_ERR_COMM_IO                           | 0x80305023 | -2144317405 | 0x80315023 | -2144251869  | 发生 I/O 错误。                      |
| <a id="AXCL_ERR_COMM_NOT_FOUND"></a>AXCL_ERR_COMM_NOT_FOUND             | 0x80305026 | -2144317402 | 0x80315026 | -2144251866  | 未找到请求的资源。                   |
| <a id="AXCL_ERR_COMM_NOT_OPEN"></a>AXCL_ERR_COMM_NOT_OPEN               | 0x80305021 | -2144317407 | 0x80315021 | -2144251871  | 公共通道未打开。                     |
| <a id="AXCL_ERR_COMM_NO_MEMORY"></a>AXCL_ERR_COMM_NO_MEMORY             | 0x80305007 | -2144317433 | 0x80315007 | -2144251897  | 内存分配失败。                       |
| <a id="AXCL_ERR_COMM_NULL_POINTER"></a>AXCL_ERR_COMM_NULL_POINTER       | 0x80305002 | -2144317438 | 0x80315002 | -2144251902  | 传入了空指针。                       |
| <a id="AXCL_ERR_COMM_PROTO_VIOLATION"></a>AXCL_ERR_COMM_PROTO_VIOLATION | 0x80305029 | -2144317399 | 0x80315029 | -2144251863  | 检测到协议违规。                     |
| <a id="AXCL_ERR_COMM_SESSION_EXPIRED"></a>AXCL_ERR_COMM_SESSION_EXPIRED | 0x80305028 | -2144317400 | 0x80315028 | -2144251864  | 会话已过期。                         |
| <a id="AXCL_ERR_COMM_STALE_PACKET"></a>AXCL_ERR_COMM_STALE_PACKET       | 0x80305027 | -2144317401 | 0x80315027 | -2144251865  | 检测到过期数据包。                   |
| <a id="AXCL_ERR_COMM_TIMEOUT"></a>AXCL_ERR_COMM_TIMEOUT                 | 0x80305005 | -2144317435 | 0x80315005 | -2144251899  | 操作超时。                           |
| <a id="AXCL_ERR_COMM_UNSUPPORT"></a>AXCL_ERR_COMM_UNSUPPORT             | 0x80305004 | -2144317436 | 0x80315004 | -2144251900  | 不支持请求的操作。                   |

<br>

## CTRL

| 符号                                                                | Host Hex   | Host Int32  | Device Hex | Device Int32 | 说明                   |
| ------------------------------------------------------------------- | ---------- | ----------- | ---------- | ------------ | ---------------------- |
| <a id="AXCL_ERR_CTRL_BUSY"></a>AXCL_ERR_CTRL_BUSY                   | 0x80305706 | -2144315642 | 0x80315706 | -2144250106  | 模块正忙。             |
| <a id="AXCL_ERR_CTRL_CLOSED"></a>AXCL_ERR_CTRL_CLOSED               | 0x80305721 | -2144315615 | 0x80315721 | -2144250079  | 控制通道未连接。       |
| <a id="AXCL_ERR_CTRL_FAIL"></a>AXCL_ERR_CTRL_FAIL                   | 0x80305720 | -2144315616 | 0x80315720 | -2144250080  | 控制模块发生通用失败。 |
| <a id="AXCL_ERR_CTRL_ILLEGAL_PARAM"></a>AXCL_ERR_CTRL_ILLEGAL_PARAM | 0x80305703 | -2144315645 | 0x80315703 | -2144250109  | 传入了无效参数。       |
| <a id="AXCL_ERR_CTRL_INTERRUPTED"></a>AXCL_ERR_CTRL_INTERRUPTED     | 0x80305723 | -2144315613 | 0x80315723 | -2144250077  | 控制操作被中断。       |
| <a id="AXCL_ERR_CTRL_IO"></a>AXCL_ERR_CTRL_IO                       | 0x80305722 | -2144315614 | 0x80315722 | -2144250078  | 发生 I/O 错误。        |
| <a id="AXCL_ERR_CTRL_NO_MEMORY"></a>AXCL_ERR_CTRL_NO_MEMORY         | 0x80305707 | -2144315641 | 0x80315707 | -2144250105  | 内存分配失败。         |
| <a id="AXCL_ERR_CTRL_TIMEOUT"></a>AXCL_ERR_CTRL_TIMEOUT             | 0x80305705 | -2144315643 | 0x80315705 | -2144250107  | 操作超时。             |
| <a id="AXCL_ERR_CTRL_UNSUPPORT"></a>AXCL_ERR_CTRL_UNSUPPORT         | 0x80305704 | -2144315644 | 0x80315704 | -2144250108  | 不支持请求的操作。     |

<br>

## DAEMON

| 符号                                                                        | Host Hex   | Host Int32  | Device Hex | Device Int32 | 说明                         |
| --------------------------------------------------------------------------- | ---------- | ----------- | ---------- | ------------ | ---------------------------- |
| <a id="AXCL_ERR_DAEMON_ALREADY_RUNNING"></a>AXCL_ERR_DAEMON_ALREADY_RUNNING | 0x80305521 | -2144316127 | 0x80315521 | -2144250591  | 另一个 daemon 实例已在运行。 |
| <a id="AXCL_ERR_DAEMON_BUSY"></a>AXCL_ERR_DAEMON_BUSY                       | 0x80305506 | -2144316154 | 0x80315506 | -2144250618  | daemon 正忙。                |
| <a id="AXCL_ERR_DAEMON_ILLEGAL_PARAM"></a>AXCL_ERR_DAEMON_ILLEGAL_PARAM     | 0x80305503 | -2144316157 | 0x80315503 | -2144250621  | 传入了无效参数。             |
| <a id="AXCL_ERR_DAEMON_INIT_CONTROL"></a>AXCL_ERR_DAEMON_INIT_CONTROL       | 0x80305520 | -2144316128 | 0x80315520 | -2144250592  | 控制接口初始化失败。         |
| <a id="AXCL_ERR_DAEMON_KILL_WORKER"></a>AXCL_ERR_DAEMON_KILL_WORKER         | 0x80305524 | -2144316124 | 0x80315524 | -2144250588  | 终止 worker 进程失败。       |
| <a id="AXCL_ERR_DAEMON_LAUNCH_WORKER"></a>AXCL_ERR_DAEMON_LAUNCH_WORKER     | 0x80305523 | -2144316125 | 0x80315523 | -2144250589  | 启动 worker 进程失败。       |
| <a id="AXCL_ERR_DAEMON_NULL_POINTER"></a>AXCL_ERR_DAEMON_NULL_POINTER       | 0x80305502 | -2144316158 | 0x80315502 | -2144250622  | 传入了空指针。               |
| <a id="AXCL_ERR_DAEMON_SEND_RESPONSE"></a>AXCL_ERR_DAEMON_SEND_RESPONSE     | 0x80305526 | -2144316122 | 0x80315526 | -2144250586  | 将响应回传到主机失败。       |
| <a id="AXCL_ERR_DAEMON_SINGLETON"></a>AXCL_ERR_DAEMON_SINGLETON             | 0x80305527 | -2144316121 | 0x80315527 | -2144250585  | 另一个 daemon 实例已在运行。 |
| <a id="AXCL_ERR_DAEMON_TIMEOUT"></a>AXCL_ERR_DAEMON_TIMEOUT                 | 0x80305505 | -2144316155 | 0x80315505 | -2144250619  | 操作超时。                   |
| <a id="AXCL_ERR_DAEMON_WORKER_LIMIT"></a>AXCL_ERR_DAEMON_WORKER_LIMIT       | 0x80305522 | -2144316126 | 0x80315522 | -2144250590  | 已达到 worker 上限。         |
| <a id="AXCL_ERR_DAEMON_WORKER_LOST"></a>AXCL_ERR_DAEMON_WORKER_LOST         | 0x80305525 | -2144316123 | 0x80315525 | -2144250587  | worker 进程意外退出。        |

<br>

## ENGINE

| 符号                                                                            | Host Hex   | Host Int32  | Device Hex | Device Int32 | 说明                       |
| ------------------------------------------------------------------------------- | ---------- | ----------- | ---------- | ------------ | -------------------------- |
| <a id="AXCL_ERR_ENGINE_AXCL_UNSUPPORTED"></a>AXCL_ERR_ENGINE_AXCL_UNSUPPORTED   | 0x80301D04 | -2144330492 | 0x80311D04 | -2144264956  | 不支持请求的引擎操作。     |
| <a id="AXCL_ERR_ENGINE_BUSY"></a>AXCL_ERR_ENGINE_BUSY                           | 0x80301D06 | -2144330490 | 0x80311D06 | -2144264954  | 引擎正忙。                 |
| <a id="AXCL_ERR_ENGINE_DECODE"></a>AXCL_ERR_ENGINE_DECODE                       | 0x80301D09 | -2144330487 | 0x80311D09 | -2144264951  | 引擎响应包解码失败。       |
| <a id="AXCL_ERR_ENGINE_ENCODE"></a>AXCL_ERR_ENGINE_ENCODE                       | 0x80301D08 | -2144330488 | 0x80311D08 | -2144264952  | 引擎请求包编码失败。       |
| <a id="AXCL_ERR_ENGINE_EXECUTE_FAIL"></a>AXCL_ERR_ENGINE_EXECUTE_FAIL           | 0x80301D23 | -2144330461 | 0x80311D23 | -2144264925  | 引擎请求失败。             |
| <a id="AXCL_ERR_ENGINE_ILLEGAL_PARAM"></a>AXCL_ERR_ENGINE_ILLEGAL_PARAM         | 0x80301D03 | -2144330493 | 0x80311D03 | -2144264957  | 传入了无效参数。           |
| <a id="AXCL_ERR_ENGINE_INVALID_INDEX"></a>AXCL_ERR_ENGINE_INVALID_INDEX         | 0x80301D21 | -2144330463 | 0x80311D21 | -2144264927  | 请求的索引或分组超出范围。 |
| <a id="AXCL_ERR_ENGINE_LOAD_FAIL"></a>AXCL_ERR_ENGINE_LOAD_FAIL                 | 0x80301D22 | -2144330462 | 0x80311D22 | -2144264926  | 模型加载失败。             |
| <a id="AXCL_ERR_ENGINE_NO_MEMORY"></a>AXCL_ERR_ENGINE_NO_MEMORY                 | 0x80301D07 | -2144330489 | 0x80311D07 | -2144264953  | 内存分配失败。             |
| <a id="AXCL_ERR_ENGINE_NULL_POINTER"></a>AXCL_ERR_ENGINE_NULL_POINTER           | 0x80301D02 | -2144330494 | 0x80311D02 | -2144264958  | 传入了空指针。             |
| <a id="AXCL_ERR_ENGINE_TIMEOUT"></a>AXCL_ERR_ENGINE_TIMEOUT                     | 0x80301D05 | -2144330491 | 0x80311D05 | -2144264955  | 操作超时。                 |
| <a id="AXCL_ERR_ENGINE_UNEXPECT_RESPONSE"></a>AXCL_ERR_ENGINE_UNEXPECT_RESPONSE | 0x80301D0A | -2144330486 | 0x80311D0A | -2144264950  | 引擎返回了意外的响应状态。 |

<br>

## PROTOCOL

| 符号                                                                        | Host Hex   | Host Int32  | Device Hex | Device Int32 | 说明                   |
| --------------------------------------------------------------------------- | ---------- | ----------- | ---------- | ------------ | ---------------------- |
| <a id="AXCL_ERR_PROTOCOL_FAIL"></a>AXCL_ERR_PROTOCOL_FAIL                   | 0x80305120 | -2144317152 | 0x80315120 | -2144251616  | 协议模块发生通用失败。 |
| <a id="AXCL_ERR_PROTOCOL_ILLEGAL_PARAM"></a>AXCL_ERR_PROTOCOL_ILLEGAL_PARAM | 0x80305103 | -2144317181 | 0x80315103 | -2144251645  | 传入了无效参数。       |
| <a id="AXCL_ERR_PROTOCOL_NULL_POINTER"></a>AXCL_ERR_PROTOCOL_NULL_POINTER   | 0x80305102 | -2144317182 | 0x80315102 | -2144251646  | 传入了空指针。         |
| <a id="AXCL_ERR_PROTOCOL_UNSUPPORT"></a>AXCL_ERR_PROTOCOL_UNSUPPORT         | 0x80305104 | -2144317180 | 0x80315104 | -2144251644  | 不支持请求的操作。     |

<br>

## RT

| 符号                                                                                    | Host Hex   | Host Int32  | Device Hex | Device Int32 | 说明                     |
| --------------------------------------------------------------------------------------- | ---------- | ----------- | ---------- | ------------ | ------------------------ |
| <a id="AXCL_ERR_RT_BUSY"></a>AXCL_ERR_RT_BUSY                                           | 0x80305206 | -2144316922 | 0x80315206 | -2144251386  | 模块正忙。               |
| <a id="AXCL_ERR_RT_CONTEXT_NOT_DESTROYED"></a>AXCL_ERR_RT_CONTEXT_NOT_DESTROYED         | 0x8030522C | -2144316884 | 0x8031522C | -2144251348  | context 未销毁。         |
| <a id="AXCL_ERR_RT_CONTEXT_NOT_EXIST"></a>AXCL_ERR_RT_CONTEXT_NOT_EXIST                 | 0x80305224 | -2144316892 | 0x80315224 | -2144251356  | context 不存在。         |
| <a id="AXCL_ERR_RT_CREATE_CONTEXT"></a>AXCL_ERR_RT_CREATE_CONTEXT                       | 0x80305225 | -2144316891 | 0x80315225 | -2144251355  | 创建 context 失败。      |
| <a id="AXCL_ERR_RT_CREATE_EVENT"></a>AXCL_ERR_RT_CREATE_EVENT                           | 0x8030522F | -2144316881 | 0x8031522F | -2144251345  | 创建 event 失败。        |
| <a id="AXCL_ERR_RT_CREATE_STREAM"></a>AXCL_ERR_RT_CREATE_STREAM                         | 0x80305226 | -2144316890 | 0x80315226 | -2144251354  | 创建 stream 失败。       |
| <a id="AXCL_ERR_RT_DECODE"></a>AXCL_ERR_RT_DECODE                                       | 0x80305209 | -2144316919 | 0x80315209 | -2144251383  | 包解码失败。             |
| <a id="AXCL_ERR_RT_DEFAULT_CONTEXT_NOT_EXIST"></a>AXCL_ERR_RT_DEFAULT_CONTEXT_NOT_EXIST | 0x80305229 | -2144316887 | 0x80315229 | -2144251351  | 默认 context 不存在。    |
| <a id="AXCL_ERR_RT_DESTROY_DEFAULT_CONTEXT"></a>AXCL_ERR_RT_DESTROY_DEFAULT_CONTEXT     | 0x80305221 | -2144316895 | 0x80315221 | -2144251359  | 销毁默认 context 失败。  |
| <a id="AXCL_ERR_RT_DESTROY_DEFAULT_STREAM"></a>AXCL_ERR_RT_DESTROY_DEFAULT_STREAM       | 0x80305222 | -2144316894 | 0x80315222 | -2144251358  | 销毁默认 stream 失败。   |
| <a id="AXCL_ERR_RT_DEVICE_NOT_ACTIVE"></a>AXCL_ERR_RT_DEVICE_NOT_ACTIVE                 | 0x80305228 | -2144316888 | 0x80315228 | -2144251352  | 设备未激活。             |
| <a id="AXCL_ERR_RT_DEVICE_NOT_EXIST"></a>AXCL_ERR_RT_DEVICE_NOT_EXIST                   | 0x8030522A | -2144316886 | 0x8031522A | -2144251350  | 设备不存在。             |
| <a id="AXCL_ERR_RT_ENCODE"></a>AXCL_ERR_RT_ENCODE                                       | 0x80305208 | -2144316920 | 0x80315208 | -2144251384  | 包编码失败。             |
| <a id="AXCL_ERR_RT_EVENT_NOT_EXIST"></a>AXCL_ERR_RT_EVENT_NOT_EXIST                     | 0x8030522E | -2144316882 | 0x8031522E | -2144251346  | event 不存在。           |
| <a id="AXCL_ERR_RT_FAIL"></a>AXCL_ERR_RT_FAIL                                           | 0x80305220 | -2144316896 | 0x80315220 | -2144251360  | 运行时模块发生通用失败。 |
| <a id="AXCL_ERR_RT_ILLEGAL_PARAM"></a>AXCL_ERR_RT_ILLEGAL_PARAM                         | 0x80305203 | -2144316925 | 0x80315203 | -2144251389  | 传入了无效参数。         |
| <a id="AXCL_ERR_RT_NO_MEMORY"></a>AXCL_ERR_RT_NO_MEMORY                                 | 0x80305207 | -2144316921 | 0x80315207 | -2144251385  | 内存分配失败。           |
| <a id="AXCL_ERR_RT_NULL_POINTER"></a>AXCL_ERR_RT_NULL_POINTER                           | 0x80305202 | -2144316926 | 0x80315202 | -2144251390  | 传入了空指针。           |
| <a id="AXCL_ERR_RT_STREAM_NOT_DESTROYED"></a>AXCL_ERR_RT_STREAM_NOT_DESTROYED           | 0x8030522D | -2144316883 | 0x8031522D | -2144251347  | stream 未销毁。          |
| <a id="AXCL_ERR_RT_STREAM_NOT_EXIST"></a>AXCL_ERR_RT_STREAM_NOT_EXIST                   | 0x80305223 | -2144316893 | 0x80315223 | -2144251357  | stream 不存在。          |
| <a id="AXCL_ERR_RT_SUBMIT_TASK"></a>AXCL_ERR_RT_SUBMIT_TASK                             | 0x8030522B | -2144316885 | 0x8031522B | -2144251349  | 提交任务失败。           |
| <a id="AXCL_ERR_RT_THREAD_NOT_BIND_CONTEXT"></a>AXCL_ERR_RT_THREAD_NOT_BIND_CONTEXT     | 0x80305227 | -2144316889 | 0x80315227 | -2144251353  | 线程未绑定 context。     |
| <a id="AXCL_ERR_RT_TIMEOUT"></a>AXCL_ERR_RT_TIMEOUT                                     | 0x80305205 | -2144316923 | 0x80315205 | -2144251387  | 操作超时。               |
| <a id="AXCL_ERR_RT_UNEXPECT_RESPONSE"></a>AXCL_ERR_RT_UNEXPECT_RESPONSE                 | 0x8030520A | -2144316918 | 0x8031520A | -2144251382  | 运行时收到了意外响应。   |
| <a id="AXCL_ERR_RT_UNSUPPORT"></a>AXCL_ERR_RT_UNSUPPORT                                 | 0x80305204 | -2144316924 | 0x80315204 | -2144251388  | 不支持请求的操作。       |

<br>

## WORKER

| 符号                                                                                        | Host Hex   | Host Int32  | Device Hex | Device Int32 | 说明                                   |
| ------------------------------------------------------------------------------------------- | ---------- | ----------- | ---------- | ------------ | -------------------------------------- |
| <a id="AXCL_ERR_WORKER_ABORTED"></a>AXCL_ERR_WORKER_ABORTED                                 | 0x80305690 | -2144315760 | 0x80315690 | -2144250224  | 关机过程中操作被中止。                 |
| <a id="AXCL_ERR_WORKER_ALREADY_EXISTS"></a>AXCL_ERR_WORKER_ALREADY_EXISTS                   | 0x80305625 | -2144315867 | 0x80315625 | -2144250331  | worker 资源已存在。                    |
| <a id="AXCL_ERR_WORKER_ALREADY_INIT"></a>AXCL_ERR_WORKER_ALREADY_INIT                       | 0x80305621 | -2144315871 | 0x80315621 | -2144250335  | worker 已初始化。                      |
| <a id="AXCL_ERR_WORKER_BUSY"></a>AXCL_ERR_WORKER_BUSY                                       | 0x80305606 | -2144315898 | 0x80315606 | -2144250362  | worker 正忙。                          |
| <a id="AXCL_ERR_WORKER_COMM_OPEN"></a>AXCL_ERR_WORKER_COMM_OPEN                             | 0x80305623 | -2144315869 | 0x80315623 | -2144250333  | 打开通信通道失败。                     |
| <a id="AXCL_ERR_WORKER_CTX_CREATE"></a>AXCL_ERR_WORKER_CTX_CREATE                           | 0x80305630 | -2144315856 | 0x80315630 | -2144250320  | 创建 context 失败。                    |
| <a id="AXCL_ERR_WORKER_CTX_DESTROY_DEFAULT"></a>AXCL_ERR_WORKER_CTX_DESTROY_DEFAULT         | 0x80305633 | -2144315853 | 0x80315633 | -2144250317  | 默认 context 不能销毁。                |
| <a id="AXCL_ERR_WORKER_CTX_LIMIT"></a>AXCL_ERR_WORKER_CTX_LIMIT                             | 0x80305632 | -2144315854 | 0x80315632 | -2144250318  | 已超过 context 上限。                  |
| <a id="AXCL_ERR_WORKER_CTX_NOT_FOUND"></a>AXCL_ERR_WORKER_CTX_NOT_FOUND                     | 0x80305631 | -2144315855 | 0x80315631 | -2144250319  | 未找到 context。                       |
| <a id="AXCL_ERR_WORKER_DECODE"></a>AXCL_ERR_WORKER_DECODE                                   | 0x80305663 | -2144315805 | 0x80315663 | -2144250269  | 包解码失败。                           |
| <a id="AXCL_ERR_WORKER_DISPATCH"></a>AXCL_ERR_WORKER_DISPATCH                               | 0x80305660 | -2144315808 | 0x80315660 | -2144250272  | 派发失败。                             |
| <a id="AXCL_ERR_WORKER_ENCODE"></a>AXCL_ERR_WORKER_ENCODE                                   | 0x80305664 | -2144315804 | 0x80315664 | -2144250268  | 响应编码失败。                         |
| <a id="AXCL_ERR_WORKER_ENQUEUE"></a>AXCL_ERR_WORKER_ENQUEUE                                 | 0x80305670 | -2144315792 | 0x80315670 | -2144250256  | 任务入队失败。                         |
| <a id="AXCL_ERR_WORKER_EVENT_ALREADY_RECORDING"></a>AXCL_ERR_WORKER_EVENT_ALREADY_RECORDING | 0x80305656 | -2144315818 | 0x80315656 | -2144250282  | 拒绝了重叠的 Record 请求。             |
| <a id="AXCL_ERR_WORKER_EVENT_CREATE"></a>AXCL_ERR_WORKER_EVENT_CREATE                       | 0x80305650 | -2144315824 | 0x80315650 | -2144250288  | 创建事件失败。                         |
| <a id="AXCL_ERR_WORKER_EVENT_DESTROYED"></a>AXCL_ERR_WORKER_EVENT_DESTROYED                 | 0x80305654 | -2144315820 | 0x80315654 | -2144250284  | 等待期间事件被销毁。                   |
| <a id="AXCL_ERR_WORKER_EVENT_LIMIT"></a>AXCL_ERR_WORKER_EVENT_LIMIT                         | 0x80305652 | -2144315822 | 0x80315652 | -2144250286  | 已超过事件上限。                       |
| <a id="AXCL_ERR_WORKER_EVENT_NOT_FOUND"></a>AXCL_ERR_WORKER_EVENT_NOT_FOUND                 | 0x80305651 | -2144315823 | 0x80315651 | -2144250287  | 未找到事件。                           |
| <a id="AXCL_ERR_WORKER_EVENT_SYNC_IN_PROGRESS"></a>AXCL_ERR_WORKER_EVENT_SYNC_IN_PROGRESS   | 0x80305655 | -2144315819 | 0x80315655 | -2144250283  | 拒绝了并发的 SyncEvent 请求。          |
| <a id="AXCL_ERR_WORKER_EVENT_WAIT_TIMEOUT"></a>AXCL_ERR_WORKER_EVENT_WAIT_TIMEOUT           | 0x80305653 | -2144315821 | 0x80315653 | -2144250285  | 等待事件超时。                         |
| <a id="AXCL_ERR_WORKER_EXECUTE"></a>AXCL_ERR_WORKER_EXECUTE                                 | 0x80305665 | -2144315803 | 0x80315665 | -2144250267  | 处理程序执行失败。                     |
| <a id="AXCL_ERR_WORKER_ILLEGAL_PARAM"></a>AXCL_ERR_WORKER_ILLEGAL_PARAM                     | 0x80305603 | -2144315901 | 0x80315603 | -2144250365  | 传入了无效参数。                       |
| <a id="AXCL_ERR_WORKER_INIT"></a>AXCL_ERR_WORKER_INIT                                       | 0x80305620 | -2144315872 | 0x80315620 | -2144250336  | worker 初始化失败。                    |
| <a id="AXCL_ERR_WORKER_INTERRUPTED"></a>AXCL_ERR_WORKER_INTERRUPTED                         | 0x80305680 | -2144315776 | 0x80315680 | -2144250240  | 通信被中断。                           |
| <a id="AXCL_ERR_WORKER_NOT_FOUND"></a>AXCL_ERR_WORKER_NOT_FOUND                             | 0x80305624 | -2144315868 | 0x80315624 | -2144250332  | 未找到请求的 worker 资源。             |
| <a id="AXCL_ERR_WORKER_NOT_INIT"></a>AXCL_ERR_WORKER_NOT_INIT                               | 0x80305622 | -2144315870 | 0x80315622 | -2144250334  | worker 尚未初始化。                    |
| <a id="AXCL_ERR_WORKER_NO_MEMORY"></a>AXCL_ERR_WORKER_NO_MEMORY                             | 0x80305607 | -2144315897 | 0x80315607 | -2144250361  | 内存分配失败。                         |
| <a id="AXCL_ERR_WORKER_NULL_POINTER"></a>AXCL_ERR_WORKER_NULL_POINTER                       | 0x80305602 | -2144315902 | 0x80315602 | -2144250366  | 传入了空指针。                         |
| <a id="AXCL_ERR_WORKER_RECV_ERROR"></a>AXCL_ERR_WORKER_RECV_ERROR                           | 0x80305681 | -2144315775 | 0x80315681 | -2144250239  | 连续发生接收错误。                     |
| <a id="AXCL_ERR_WORKER_SDK_API"></a>AXCL_ERR_WORKER_SDK_API                                 | 0x80305682 | -2144315774 | 0x80315682 | -2144250238  | AX SDK API 调用失败。                  |
| <a id="AXCL_ERR_WORKER_STREAM_CREATE"></a>AXCL_ERR_WORKER_STREAM_CREATE                     | 0x80305640 | -2144315840 | 0x80315640 | -2144250304  | 创建 stream 失败。                     |
| <a id="AXCL_ERR_WORKER_STREAM_DESTROYED"></a>AXCL_ERR_WORKER_STREAM_DESTROYED               | 0x80305646 | -2144315834 | 0x80315646 | -2144250298  | 等待期间 stream 被销毁。               |
| <a id="AXCL_ERR_WORKER_STREAM_DESTROY_DEFAULT"></a>AXCL_ERR_WORKER_STREAM_DESTROY_DEFAULT   | 0x80305644 | -2144315836 | 0x80315644 | -2144250300  | 默认 stream 不能销毁。                 |
| <a id="AXCL_ERR_WORKER_STREAM_LIMIT"></a>AXCL_ERR_WORKER_STREAM_LIMIT                       | 0x80305642 | -2144315838 | 0x80315642 | -2144250302  | 已超过 stream 上限。                   |
| <a id="AXCL_ERR_WORKER_STREAM_NOT_FOUND"></a>AXCL_ERR_WORKER_STREAM_NOT_FOUND               | 0x80305641 | -2144315839 | 0x80315641 | -2144250303  | 未找到 stream。                        |
| <a id="AXCL_ERR_WORKER_STREAM_STICKY_ERROR"></a>AXCL_ERR_WORKER_STREAM_STICKY_ERROR         | 0x80305647 | -2144315833 | 0x80315647 | -2144250297  | 由于 stream 具有粘性错误，任务被跳过。 |
| <a id="AXCL_ERR_WORKER_STREAM_SYNC"></a>AXCL_ERR_WORKER_STREAM_SYNC                         | 0x80305643 | -2144315837 | 0x80315643 | -2144250301  | stream 同步失败。                      |
| <a id="AXCL_ERR_WORKER_STREAM_SYNC_IN_PROGRESS"></a>AXCL_ERR_WORKER_STREAM_SYNC_IN_PROGRESS | 0x80305645 | -2144315835 | 0x80315645 | -2144250299  | 拒绝了并发的 SyncStream 请求。         |
| <a id="AXCL_ERR_WORKER_TASK_CANCELLED"></a>AXCL_ERR_WORKER_TASK_CANCELLED                   | 0x80305671 | -2144315791 | 0x80315671 | -2144250255  | 任务已取消。                           |
| <a id="AXCL_ERR_WORKER_TIMEOUT"></a>AXCL_ERR_WORKER_TIMEOUT                                 | 0x80305605 | -2144315899 | 0x80315605 | -2144250363  | 操作超时。                             |
| <a id="AXCL_ERR_WORKER_UNKNOWN_API"></a>AXCL_ERR_WORKER_UNKNOWN_API                         | 0x80305662 | -2144315806 | 0x80315662 | -2144250270  | API ID 未知。                          |
| <a id="AXCL_ERR_WORKER_UNKNOWN_MODULE"></a>AXCL_ERR_WORKER_UNKNOWN_MODULE                   | 0x80305661 | -2144315807 | 0x80315661 | -2144250271  | 模块 ID 未知。                         |
