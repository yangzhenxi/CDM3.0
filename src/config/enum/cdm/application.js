/**
 * @description 应用管理
 */

export default {

  /**
   * @enum 类型
   */
  CDM_APPLICATION_MODULE: [
    { key: 1, value: 'oracle', title: 'Oracle', icon: 'oracle' },
    { key: 2, value: 'mysql', title: 'MySQL', icon: 'mysql' },
    { key: 3, value: 'mssql', title: 'SQLServer', icon: 'mssql' },
    { key: 4, value: 'pgsql', title: 'PostgreSQL', icon: 'pgsql' },
    { key: 5, value: 'file', title: '文件', icon: 'file' },
    { key: 6, value: 'vmware', title: 'VMware', icon: 'vmware' },
    { key: 7, value: 'hyperv', title: 'Hyper-V', icon: 'hyperv' }
  ],

  /**
   * @enum 状态
   */
  CDM_APPLICATION_STATE: [
    { key: 1, value: '新建中', color: 'green' },
    { key: 2, value: '新建失败', color: 'volcano' },
    { key: 3, value: '正常', color: 'green' },
    { key: 4, value: '异常', color: 'volcano' },
    { key: 5, value: '删除中', color: 'green' },
    { key: 6, value: '删除失败', color: 'volcano' },
    { key: 7, value: '删除完成', color: 'green' }
  ],

  /**
   * @enum 协议类型
   */
  CDM_APPLICATION_PROTOCOL: [
    { key: 1, value: 'ISCSI' },
    { key: 2, value: 'NFS' },
    { key: 3, value: 'FC' }
  ],

  /**
   * @enum 是否存在保护应用
   */
  CDM_APPLICATION_EXIST: [
    { key: false, value: '未创建', color: 'red' },
    { key: true, value: '已创建', color: 'green' }
  ],

  /**
   * @enum 历史记录 备份状态
   */
  CDM_APPLICATION_BACKUP_HISTORY_STATE: [
    { key: 1, value: '正常' },
    { key: 0, value: '异常' }
  ],

  /**
   * @enum 备份类型
   */
  CDM_APPLICATION_BACKUP_TYPE: [
    { key: 1, value: '数据备份' },
    { key: 2, value: '日志备份' }
  ]
}
