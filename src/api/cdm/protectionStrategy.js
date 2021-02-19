
import { axios } from '@/utils/request'

export const Api = [
  { url: '/admin.v1.ProtectionStrategy/Get', title: '获取保护策略' },
  { url: '/admin.v1.ProtectionStrategy/Add', title: '新建保护策略', isPopup: true },
  { url: '/admin.v1.ProtectionStrategy/Patch', title: '修改保护策略', isPopup: true },
  { url: '/admin.v1.ProtectionStrategy/Histories', title: '查询历史记录' }
]

/**
 * 获取保护策略
 * @param Object data 传参
 */
export function getProtectionStrategy (data) {
  return axios.post('/admin.v1.ProtectionStrategy/Get', data)
}

/**
 * 新建保护策略
 * @param Object data 传参
 */
export function addProtectionStrategy (data) {
  return axios.post('/admin.v1.ProtectionStrategy/Add', data)
}

/**
 * 修改保护策略
 * @param Object data 传参
 */
export function updateProtectionStrategy (data) {
  return axios.post('/admin.v1.ProtectionStrategy/Patch', data)
}

/**
 * 查询历史记录
 * @param Object data 传参
 */
export function getProtectionStrategyHistories (data) {
  return axios.post('/admin.v1.ProtectionStrategy/Histories', data)
}
