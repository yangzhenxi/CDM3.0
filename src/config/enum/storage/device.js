/**
 * @description 设备管理
 */

export default {

  /**
   * @enum 磁盘类型
   */
  STORAGE_DEVICE_DISK_TYPE: [
    { key: 1, value: '磁盘块', icon: 'green' },
    { key: 2, value: '文件系统', icon: 'file' },
    { key: 3, value: '文件系统', icon: 'file' }
  ],

  /**
   * @enum 磁盘类型
   */
  STORAGE_DEVICE_DISK_KIND: [
    { key: 'WindowsFS', value: 'window' },
    { key: 'LinuxFS', value: 'linux' },
    { key: 'LinuxRaw', value: 'linux 裸设备' },
    { key: 'AIXFS', value: 'IBM-AIX' },
    { key: 'AIXRaw', value: 'IBM-AIX 裸设备' }
  ],

  /**
   * @enum 空闲
   */
  STORAGE_DEVICE_DISK_AVAILABLE: [
    { key: 1, value: '是', color: 'green' },
    { key: -1, value: '否', color: 'volcano' }
  ],

  /**
   * @enum 状态
   */
  STORAGE_DEVICE_DISK_STATE: [
    { key: 1, value: '正常', color: 'green' },
    { key: -1, value: '异常', color: 'red' }
  ]
}
