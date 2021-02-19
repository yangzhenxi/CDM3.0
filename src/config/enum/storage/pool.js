/**
 * @description 池管理
 */

export default {

  /**
   * @enum 池类型
   */
  STORAGE_POOL_TYPE: [
    { key: 1, value: '快照池', icon: 'snapshot-pool' },
    { key: 2, value: '压缩池', icon: 'dedup-pool' }
  ],

  /**
   * @enum 池位置
   */
  STORAGE_POOL_LOCATION: [
    { key: 1, value: '本地' },
    { key: 2, value: '云端' }
  ],

  /**
   * @enum raid 级别
   */
  STORAGE_POOL_RAID_LEVEL: [
    // { key: 1, value: '镜像' },
    { key: 2, value: 'raid0' },
    { key: 3, value: 'raid5' }
  ],

  /**
   * @enum 状态
   */
  STORAGE_POOL_STATE: [
    { key: 1, value: '在线', color: 'green' },
    { key: 2, value: '离线', color: 'volcano' },
    { key: 10, value: '存储离线', color: 'volcano' }
  ]
}
