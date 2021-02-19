/**
 * @description 角色
 */

export default {

  /**
   * @enum 角色类型
   */
  SYSTEM_ROLE_TYPE: [
    { key: 'admin', value: '管理员', color: 'blue' },
    { key: 'riadmin', value: '巡检员', color: 'cyan' },
    { key: 'audit', value: '审计员', color: 'volcano' },
    { key: 'operator', value: '操作员', color: 'green' }
  ],

  /**
   * @enum 角色状态
   */
  SYSTEM_ROLE_STATE: [
    { key: 1, value: '正常', color: 'blue' },
    { key: 2, value: '异常', color: 'red' }
  ]
}
