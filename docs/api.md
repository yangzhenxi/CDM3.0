界面

```ecmascript 6

├── 系统概况                                 （界面 0%； 接口 0%）
├── 系统资源
├── ├── 客户端                               （界面 80%； 接口 40%）
├── ├── 虚拟化                               （界面 80%； 接口 40%）
├── └── SLA                                 （界面 80%； 接口 0%）
├── CDM
├── ├── 应用管理                             （界面 80%； 接口 15%）
├── └── 工作流                               （界面 80%； 接口 0%）
├── 数据备份
├── └── 应用管理                             （界面 80%； 接口 0%）
├── 容灾管理
├── ├── oracle                              （界面 80%； 接口 0%）
├── └── └── dg                              （界面 80%； 接口 0%）
├── 任务监控                                 （界面 80%； 接口 0%）
├── └── 任务详情                             （界面 80%； 接口 0%）
├── 存储管理
├── ├── 节点管理                             （界面 80%； 接口 80%）
├── ├── └── 节点详情                         （界面 80%； 接口 80%）
├── ├── 存储池管理                           （界面 80%； 接口 80%）
├── └── └── 节点详情                         （界面 80%； 接口 80%）
├── 日志
├── ├── 用户日志                             （界面 80%； 接口 0%）
├── └── 告警信息                             （界面 80%； 接口 0%）
├── 系统管理
├── ├── 用户管理                             （界面 80%； 接口 0%）
├── ├── 角色管理                             （界面 80%； 接口 0%）
├── ├── 授权管理                             （界面 80%； 接口 0%）
├── ├── 告警配置                             （界面 80%； 接口 0%）
├── ├── 组件管理                             （界面 80%； 接口 0%）
├── └── 控制台                               （界面 80%； 接口 0%）
├── 组件
├── └── ...
├── 其他
├── └── ...
...

```

```ecmascript 6

/**
  * 接口
  *
  */

系统

  查询服务器时间

系统概况

  获取

系统资源

  1. 客户端

    查询列表 /admin.v1.Lblet/List

    获取 /admin.v1.Lblet/Get

    修改 /admin.v1.Lblet/Patch

    注册 /admin.v1.Lblet/Register

    分配用户

    查询 oracle 实例

    查询 oracle 环境

    查询 oracle 参数

    查询 mysql 实例 /admin.v1.Mysql/GetMysqlInfo

    查询 mssql 实例 /admin.v1.Mssql/GetMssqlInfo

    查询 pgsql 实例 /admin.v1.Pgsql/GetPgsqlInfo

    查询文件路径信息

    查询客户端下的应用

  2. 虚拟化

    查询列表 /admin.v1.Virtual/List

    获取 /admin.v1.Virtual/Get

    新建 /admin.v1.Virtual/Add

    修改 /admin.v1.Virtual/Patch

    删除 /admin.v1.Virtual/Delete

    分配用户

    查询主机列表 /admin.v1.Virtual/GetVcenterInfo

    根据 datacenter 查询主机 /admin.v1.Virtual/GetVMsByDatacenter

    查询 VC 列表

    根据 datacenter 查询 VC

    获取 VC

    获取 VC 容量

    获取 VC lblet

    查询 VC datacenter 列表 /admin.v1.Virtual/GetDatacenter

    查询 hyperv 列表

    获取 VC lblet

  3. SLA

    查询列表

    获取

    新建

    修改

    删除

    查询历史记录列表

    查询应用引用列表

    新建应用引用

    删除应用引用

  4. Node

    获取 [查询lblet容量]

CDM

  1. 应用管理

    查询列表 /admin.v1.Application/List

    获取 /admin.v1.Application/Get

    新建

    删除

    新建测试

    获取测试

  2. pod

    查询列表

    获取

    新建

    新建 oracle 集群

  3. 保护策略

  	查询列表

    获取  /admin.v1.ProtectionStrategy/Get

    新建 /admin.v1.ProtectionStrategy/Add

    修改 /admin.v1.ProtectionStrategy/Patch

    删除

    查询应用引用列表

    新建应用引用

    修改应用引用

    删除应用引用

    查询历史记录

  4. 备份

    查询列表

    新建

  5. 黄金副本

    查询列表

    获取

    删除

  6. 挂载

    查询列表

    获取

    新建

    删除

  7. 快照

    获取

  8. 工作流

    查询列表

    获取

    新建

    删除

    查询历史记录

数据备份

  1. 应用管理

    查询列表

    获取

    新建

    删除

    新建测试

    获取测试

  2. pod

    查询列表

    获取

    新建

  3. 保护策略

    查询列表

    获取

    新建

    修改

    删除

    查询应用引用列表

    新建应用引用

    修改应用引用

    删除应用引用

    查询历史记录

  4. 备份

    查询列表

    新建

  5. 黄金副本

    查询列表

    获取

    删除

  6. 挂载

    查询列表

    获取

    新建

    删除

  7. 快照

    获取

  8. 工作流

    查询列表

    获取

    新建

    删除

    查询历史记录

容灾管理

  1. oracle

    查询列表 /api/admin.v1.DataGuard/List

    添加 /api/admin.v1.DataGuard/Add

    创建 /api/admin.v1.DataGuard/Create

    删除 /api/admin.v1.DataGuard/Delete

    销毁 /api/admin.v1.DataGuard/Destroy

    详情 /api/admin.v1.DataGuard/QueryInfo

任务监控

  查询列表

  获取

  删除

  获取日志

存储管理

  1. 节点管理

  查询列表 /admin.v1.Storage/List

  获取 /admin.v1.Storage/Get

  新建 /admin.v1.Storage/Add

  删除 /admin.v1.Storage/Delete

  查询存储设备 /admin.v1.Storage/GetDevices

  获取存储设备 /admin.v1.Storage/GetDevice

  刷新存储节点 /admin.v1.Storage/FlushScsi

  2. 存储池管理

  查询列表 /admin.v1.Pool/List

  获取 /admin.v1.Pool/Get

  新建 /admin.v1.Pool/Add

  修改 /admin.v1.Pool/Patch

  删除 /admin.v1.Pool/Destroy

  扩容存储池 /admin.v1.Pool/Expand

  获取存储池 IO /admin.v1.Pool/GetIO

  分配用户

日志

  1. 用户日志

    查询列表

  2. 告警信息

    查询列表

    设置已读

    查询告警配置

    修改告警配置

系统管理

  1. 用户管理

    查询列表 /admin.v1.User/List

    获取 /admin.v1.User/Get

    新建 /admin.v1.User/Add

    修改 /admin.v1.User/Patch

    删除 /admin.v1.User/Delete

    获取当前用户 /admin.v1.User/UserInfo

    登录 /admin.v1.User/Login

    登出 /admin.v1.User/Logout

  2. 角色管理

    查询列表 /admin.v1.Role/List

    获取 /admin.v1.Role/Get

    新建 /admin.v1.Role/Add

    修改 /admin.v1.Role/Patch

    删除 /admin.v1.Role/Delete

    查询资源列表 /admin.v1.Resource/List

    获取资源 /admin.v1.Resource/Get

  3. 授权管理

    查询列表

    新建

    绑定

    上传

  4. 告警配置

    获取

    新建

    *启用

    *禁用

  5. 组件管理

    查询列表

  6. 控制台

    term websocket

  *7. 标签

    查询列表

    新建

    绑定

    解绑

    删除

```