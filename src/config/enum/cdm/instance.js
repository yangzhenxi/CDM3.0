/**
 * @description 应用实例
 */

export default {

  /**
		 * @enum 类型
		 */
  CDM_INSTANCE_STATE: [
    { key: 1, value: '正常', color: 'green' },
    { key: 2, value: '异常', color: 'volcano' },
    { key: 10, value: 'connector异常', color: 'volcano' },
    { key: 11, value: 'lblet异常', color: 'volcano' },
    { key: 20, value: '存储异常', color: 'volcano' },
    { key: 21, value: '存储池异常', color: 'volcano' },
    { key: 22, value: '磁盘卷异常', color: 'volcano' },
    { key: 30, value: '数据库异常', color: 'volcano' }
  ]
}
