/**
 * @description 客户端
 */

export default {

  /**
	 * @enum 操作系统内核
	 */
  R_LBLET_OS: [
    { key: 1, value: 'linux', icon: 'linux' },
    { key: 2, value: 'windows', icon: 'windows' },
    { key: 3, value: 'aix', icon: 'aix' }
  ],

  /**
	 * @enum 协议
	 */
  R_PROTOCOL: [
    { key: 1, value: 'ISCSI', disabled: false, support: '不支持' },
    { key: 2, value: 'FC', disabled: false, support: '不支持' }
  ],

  /**
	 * @enum 注册状态
	 */
  R_LBLET_REGISTER_STATE: [
    { key: true, value: '已注册', color: 'green' },
    { key: false, value: '未注册', color: 'volcano' }
  ],

  /**
	 * @enum 状态
	 */
  R_LBLET_STATE: [
    { key: 1, value: '在线', color: 'green' },
    { key: 2, value: '离线', color: 'red' }
    // { key: 3, value: 'Connector 离线', color: 'red' }
  ],

  /**
	 * @enum 应用保护状态
	 */
  R_LBLET_OF_APP_PROTECT: [
    { key: true, value: '已创建应用', color: '#F8AC59' },
    { key: false, value: '未创建应用', color: '#1AB394' }
  ],

  /**
   * @enum 策略保护状态
   */
  R_LBLET_OF_ANT_PROTECT: [
    { key: true, value: '已拥有策略', color: '#F8AC59' },
    { key: false, value: '未拥有策略', color: '#1AB394' }
  ]
}
