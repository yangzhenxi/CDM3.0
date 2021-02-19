
import { axios } from '@/utils/request'

export const Api = [
  { url: '/admin.v1.SLA/Get', title: '获取 SLA' },
  { url: '/admin.v1.SLA/Add', title: '新建 SLA', isPopup: true },
  { url: '/admin.v1.SLA/Patch', title: '修改 SLA', isPopup: true },
  { url: '/admin.v1.SLA/Delete', title: '删除 SLA', isPopup: true },
  { url: '/admin.v1.SLA/Histories', title: '查询历史记录' }
]

/**
 * 获取 SLA
 * @param Object data 传参
 */
export function getSLA (data) {
  return axios.post('/admin.v1.SLA/Get', data)
}

/**
 * 新建 SLA
 * @param Object data 传参
 */
export function addSLA (data) {
  return axios.post('/admin.v1.SLA/Add', data)
}

/**
 * 修改 SLA
 * @param Object data 传参
 */
export function updateSLA (data) {
  return axios.post('/admin.v1.SLA/Patch', data)
}

/**
 * 删除 SLA
 * @param Object data 传参
 */
export function deleteSLA (data) {
  return axios.post('/admin.v1.SLA/Delete', data)
}

/**
 * 查询历史记录
 * @param Object data 传参
 */
export function getSLAHistories (data) {
  return axios.post('/admin.v1.SLA/Histories', data)
}
