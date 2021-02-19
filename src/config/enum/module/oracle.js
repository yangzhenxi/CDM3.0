/**
 * @description oracle
 */

export default {
  /**
   * @enum 恢复类型
   */
  ORACLE_RECOVER_OP: [
    { key: 'mount', value: '挂载磁盘' },
    { key: 'recover', value: '挂载数据库' }
  ],
  /**
   * @enum 归档日志状态
   */
  ORACLE_ARCHIVE: [
    { key: 'ARCHIVELOG', value: '开启' },
    { key: 'NOARCHIVELOG', value: '关闭' }
  ],
  /**
   * @enum BCT 状态
   */
  ORACLE_BCT: [
    { key: 'ABLE', value: '启用' },
    { key: 'DISABLED', value: '禁用' }
  ]
}
