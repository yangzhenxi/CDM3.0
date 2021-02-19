/**
 * @description 用户日志
 */

export default {

  /**
   * @enum 类型
   */
  LOG_USER_TYPE: [
    { key: 1, value: '登录' },
    { key: 2, value: '创建' },
    { key: 3, value: '修改' },
    { key: 4, value: '删除' },
    { key: 5, value: '备份' },
    { key: 6, value: '恢复' },
    { key: 7, value: '检测' }
  ],

  /**
   * @enum 状态
   */
  LOG_USER_STATE: [
    { key: 1, value: '正常', color: 'green' },
    { key: 2, value: '异常', color: 'red' }
  ]
}
