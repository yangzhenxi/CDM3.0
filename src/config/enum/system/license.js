/**
 * @description 授权管理
 */

export default {

  /**
   * @enum 模块
   */
  SYSTEM_LICENSE_MODULE: [
    { key: 'cdm', value: 'CDM' },
    { key: 'backup', value: '数据备份' },
    { key: 'storage', value: '存储管理' }
  ],

  /**
   * @enum 类型
   */
  SYSTEM_LICENSE_TYPE: [
    { key: 'oracle', value: 'Oracle', icon: 'oracle' },
    { key: 'mysql', value: 'MySQL', icon: 'mysql' },
    { key: 'mssql', value: 'SQLServer', icon: 'mssql' },
    { key: 'pgsql', value: 'PostgreSQL', icon: 'pgsql' },
    { key: 'file', value: '文件系统', icon: 'file' },
    { key: 'vmware', value: 'VMware', icon: 'vmware' },
    { key: 'hyperv', value: 'Hyper-V', icon: 'hyperv' },

    { key: 1, value: '快照池', icon: 'snapshot-pool' },
    { key: 'dedup', value: '压缩池', icon: 'dedup-pool' },
    { key: 'remote', value: '远端池', icon: 'remote-pool' },
    { key: 'cloud', value: '云端池', icon: 'cloud-pool' }
  ],

  /**
   * @enum 状态
   */
  SYSTEM_LICENSE_STATE: [
    { key: 'ready', value: '正常', color: 'green' },
    { key: 'notReady', value: '异常', color: 'red' }
  ]
}
