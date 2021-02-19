/**
 * @description 虚拟化
 */

export default {

  /**
   * @enum 类型
   */
  R_VIRTUAL_MODULE: [
    { key: 1, value: 'vmware', title: 'VMware', icon: 'vmware' },
    { key: 2, value: 'hyperv', title: 'Hyperv', icon: 'hyperv' }
  ],

  /**
   * @enum 状态
   */
  R_VIRTUAL_STATE: [
    { key: '1', value: '正常', color: 'green' },
    { key: '-1', value: '异常', color: 'red' },
    { key: '2', value: 'lblet 断开', color: 'red' },
    { key: '3', value: 'vc 断开', color: 'red' }
  ]
}
