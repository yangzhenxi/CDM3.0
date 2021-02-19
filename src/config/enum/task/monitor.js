/**
 * @description 任务监控
 */

export default {

  /**
   * @enum 类型
   */
  TASK_MONITOR_MODULE: [
    { key: '1', value: 'cdm', title: 'CDM' },
    { key: '2', value: 'backup', title: '数据备份' },
    { key: '3', value: 'dg', title: '容灾管理' }
  ],

  /**
   * @enum 类型
   */
  TASK_MONITOR_TYPE: [
    { key: 1, value: '新建应用', color: 'cyan' },
    { key: 2, value: '删除应用', color: 'red' },
    { key: 3, value: '备份', color: 'cyan' },
    { key: 4, value: '挂载', color: 'gold' },
    { key: 5, value: '应急拉起', color: 'gold' },
    { key: 6, value: '删除虚拟副本', color: 'red' },
    { key: 11, value: '创建 DG', color: 'cyan' },
    { key: 12, value: '销毁 DG', color: 'red' }
  ],

  /**
   * @enum 状态
   */
  TASK_MONITOR_STATE: [
    { key: 1, value: '运行中', color: 'volcano' },
    { key: 2, value: '成功', color: 'green' },
    { key: 3, value: '失败', color: 'red' }
  ],

  /**
   * @enum 状态
   */
  TASK_MONITOR_WORKFLOW_STATUS: [
    { key: 1, value: '正常', color: 'green' },
    { key: 2, value: '超时', color: 'volcano' },
    { key: 3, value: '失败', color: 'red' }
  ],

  /**
   * @enum 步骤状态
   */
  TASK_MONITOR_WORKFLOW_PHASE: [
    { key: 1, value: '准备中', state: 'wait', color: 'volcano', result: { processState: 'normal', icon: 'clock-circle', color: '#ff9c6e' } },
    { key: 2, value: '运行中', state: 'process', color: 'cyan', result: { processState: 'active', icon: 'play-circle', color: '#69c0ff' } },
    { key: 3, value: '已暂停', state: 'error', color: 'red', result: { processState: 'exception', icon: 'question-circle', color: '#ff7875' } },
    { key: 4, value: '已取消', state: 'error', color: 'red', result: { processState: 'exception', icon: 'question-circle', color: '#ff7875' } },
    { key: 5, value: '已完成', state: 'finish', color: 'green', result: { processState: 'success', icon: 'check-circle', color: '#95de64' } }
  ],

  /**
   * @enum 步骤状态
   */
  TASK_MONITOR_WORKFLOW_PHASE_STATUS: [
    { key: 1_1, value: '准备中', state: 'wait', color: 'volcano', result: { processState: 'normal', icon: 'clock-circle', color: '#ff9c6e' } },
    { key: 1_2, value: '准备超时', state: 'error', color: 'red', result: { processState: 'exception', icon: 'question-circle', color: '#ff7875' } },
    { key: 1_3, value: '准备失败', state: 'error', color: 'red', result: { processState: 'exception', icon: 'question-circle', color: '#ff7875' } },

    { key: 2_1, value: '运行中', state: 'process', color: 'cyan', result: { processState: 'active', icon: 'play-circle', color: '#69c0ff' } },
    { key: 2_2, value: '运行超时', state: 'error', color: 'red', result: { processState: 'exception', icon: 'close-circle', color: '#ff7875' } },
    { key: 2_3, value: '运行失败', state: 'error', color: 'red', result: { processState: 'exception', icon: 'close-circle', color: '#ff7875' } },

    { key: 3_1, value: '已暂停', state: 'error', color: 'red', result: { processState: 'exception', icon: 'close-circle', color: '#ff7875' } },
    { key: 3_2, value: '暂停超时', state: 'error', color: 'red', result: { processState: 'exception', icon: 'close-circle', color: '#ff7875' } },
    { key: 3_3, value: '暂停失败', state: 'error', color: 'red', result: { processState: 'exception', icon: 'close-circle', color: '#ff7875' } },

    { key: 4_1, value: '已取消', state: 'error', color: 'red', result: { processState: 'exception', icon: 'close-circle', color: '#ff7875' } },
    { key: 4_2, value: '取消超时', state: 'error', color: 'red', result: { processState: 'exception', icon: 'close-circle', color: '#ff7875' } },
    { key: 4_3, value: '取消失败', state: 'error', color: 'red', result: { processState: 'exception', icon: 'close-circle', color: '#ff7875' } },

    { key: 5_1, value: '已完成', state: 'finish', color: 'green', result: { processState: 'success', icon: 'check-circle', color: '#95de64' } },
    { key: 5_2, value: '超时', state: 'error', color: 'red', result: { processState: 'exception', icon: 'question-circle', color: '#ff7875' } },
    { key: 5_3, value: '失败', state: 'error', color: 'red', result: { processState: 'exception', icon: 'question-circle', color: '#ff7875' } }
  ]
}
