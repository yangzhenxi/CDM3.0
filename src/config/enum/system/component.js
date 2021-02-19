/**
 * @description 组件管理
 */

export default {

  /**
   * @enum 组件类型
   */
  SYSTEM_COMPONENT_TYPE: [
    { key: 'scheduler', value: '调度组件', color: 'blue' },
    { key: 'controller', value: '控制组件', color: 'blue' }
  ],

  /**
   * @enum 组件状态
   */
  SYSTEM_COMPONENT_STATE: [
    { key: 'ready', value: '正常', color: 'green' },
    { key: 'notReady', value: '异常', color: 'red' }
  ]
}
