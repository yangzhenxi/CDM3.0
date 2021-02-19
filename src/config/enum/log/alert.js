/**
 * @description 告警日志
 */

export default {

  /**
   * @enum 类型
   */
  LOG_ALERT_TYPE: [
    { key: 'login', value: '登录' },
    { key: 'logout', value: '登出' },
    { key: 'password', value: '修改密码' },
    { key: 'resetPassword', value: '重置密码' },
    { key: 'lock', value: '锁定用户' },
    { key: 'unlock', value: '解锁用户' },
    { key: 'role', value: '修改角色' },
    { key: 'application:create', value: '新建应用' },
    { key: 'application:backup', value: '备份应用' }
  ],

  /**
   * @enum 级别
   */
  LOG_ALERT_LEVEL: [
    { key: 'info', value: '通知', color: 'green' },
    { key: 'warning', value: '警告', color: 'volcano' },
    { key: 'error', value: '紧急', color: 'red' }
  ],

  /**
   * @enum 状态
   */
  LOG_ALERT_READ_STATE: [
    { key: true, value: '已读', color: 'green' },
    { key: false, value: '未读', color: 'red' }
  ],

  /**
   * @enum 状态
   */
  LOG_ALERT_MAIL_STATE: [
    { key: true, value: '开启', color: 'green' },
    { key: false, value: '关闭', color: 'red' }
  ],
  /**
   * @enum 邮件发送状态
   */
  LOG_ALERT_MAIL_SEND_STATE: [
    { key: true, value: '已发送', color: 'green' },
    { key: false, value: '未发送', color: 'red' }
  ]
}
