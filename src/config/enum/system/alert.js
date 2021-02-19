/**
 * @description 告警
 */

export default {

  /**
   * @enum 邮件状态
   */
  SYSTEM_ALERT_EMAIL_ENABLE: [
    { key: 'ready', value: '正常', color: 'green' },
    { key: 'notReady', value: '异常', color: 'red' },
    { key: 'disabled', value: '不可用', color: 'red' }
  ],

  /**
   * @enum 邮件启用状态
   */
  SYSTEM_ALERT_EMAIL_STATE: [
    { key: 'ready', value: '启用', color: 'green' },
    { key: 'notReady', value: '禁用', color: 'red' }
  ],

  /**
   * @enum 任务规则
   */
  SYSTEM_ALERT_TASK_RULE: [
    { key: 'taskSuccess', value: '任务成功' },
    { key: 'taskFail', value: '任务失败' }
  ],

  /**
   * @enum 系统规则
   */
  SYSTEM_ALERT_SYSTEM_RULE: [
    { key: 'serverDown', value: '系统宕机' },
    { key: 'loginSuccess', value: '登录成功' },
    { key: 'loginFail', value: '登录失败' }
  ],

  /**
   * @enum 系统规则
   */
  SYSTEM_ALERT_NOTE_RULE: [
  ]
}
