/**
 * @description DG oracle
 */

export default {

  /**
   * @enum 状态
   */
  DG_STATE: [
    { key: 1, value: '正常', color: 'green' },
    { key: 2, value: '异常', color: 'red' }
  ],

  /**
   * @enum 类型
   */
  DG_LBLET_PROTECT: [
    { key: true, value: '已创建DG', color: '#F8AC59' },
    { key: false, value: '未创建DG', color: '#1AB394' }
  ],
  /**
   * @enum 归档模式
   */
  DG_DB_ARCHIVELOG: [
    { key: 'ARCHIVELOG', value: '打开', color: '#1fd2c6' },
    { key: 'NOARCHIVELOG', value: '关闭', color: '#ED5565' }
  ],
  /**
   * @enum 强制日志
   */
  DG_DB_FORCELOG: [
    { key: 'YES', value: '打开', color: '#1fd2c6' },
    { key: 'NO', value: '关闭', color: '#ED5565' }
  ],
  /**
   * @enum 监听状态
   */
  DG_DB_LSNRCTLSTATE: [
    { key: 'Ready', value: '正常', color: 'green' },
    { key: 'NotRunning', value: '未启动', color: 'red' },
    { key: 'Blocked', value: '阻塞', color: 'volcano' },
    { key: 'Unregistered', value: '未注册', color: 'pink' }
  ],
  /**
   * @enum 打开状态
   */
  DG_DB_OPENMODE: [
    { key: 'read write', value: '读写', color: '#1fd2c6' },
    { key: 'read only', value: '只读', color: '#1fd2c6' },
    { key: 'read only with apply', value: '只读且归档打开', color: '#1fd2c6' },
    { key: 'mounted', value: '装载', color: '#1fd2c6' }
  ],
  /**
   * @enum 定时调度
   */
  DG_LOG_SCHEDULE: [
    { key: 'ACTIVE', value: '打开', color: '#1fd2c6' },
    { key: 'INACTIVE', value: '关闭', color: '#ED5565' },
    { key: 'PENDING', value: '待处理', color: '#F8AC59' },
    { key: 'LATENT', value: '延迟', color: '#F8AC59' }
  ],
  /**
   * @enum 日志状态
   */
  DG_LOG_ARCHIVER_DEST_STATE: [
    { key: 'VALID', value: '有效', color: 'green' },
    { key: 'INACTIVE', value: '无效', color: 'red' },
    { key: 'DEFERRED', value: '手动禁用', color: 'pink' },
    { key: 'ERROR', value: '错误', color: 'red' },
    { key: 'DISABLED', value: '禁用', color: 'red' },
    { key: 'BAD PARAM', value: '参数错误', color: 'volcano' },
    { key: 'ALTERNATE', value: '替代', color: 'volcano' },
    { key: 'FULL', value: '容量溢出', color: 'red' }
  ]
}
