
import { axios } from '@/utils/request'

export const Api = [
  { url: '/admin.v1.Instance/Backup', title: '备份实例', isPopup: true },
  { url: '/admin.v1.Instance/Get', title: '获取实例' }
]

/**
 * 备份实例
 * @param Object data 传参
 */
export function backupInstance (data) {
  return axios.post('/admin.v1.Instance/Backup', data)
}

/**
 * 获取实例
 * @param Object data 传参
 */
export function getInstance (data) {
  return axios.post('/admin.v1.Instance/Get', data)
}
