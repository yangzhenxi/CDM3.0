
import { axios } from '@/utils/request'

export const Api = [
  { url: '/admin.v1.RecoveryStrategy/List', title: '查询工作流' },
  { url: '/admin.v1.RecoveryStrategy/List', title: '查询所有工作流' },
  { url: '/admin.v1.RecoveryStrategy/Get', title: '获取工作流' },
  { url: '/admin.v1.RecoveryStrategy/Add', title: '新建工作流', isPopup: true },
  { url: '/admin.v1.RecoveryStrategy/Patch', title: '修改工作流', isPopup: true },
  { url: '/admin.v1.RecoveryStrategy/Delete', title: '删除工作流', isPopup: true },
  { url: '/admin.v1.RecoveryStrategy/BatchDelete', title: '批量删除工作流', isPopup: true },
  { url: '/admin.v1.RecoveryStrategy/Histories', title: '查询历史记录' }
]

/**
 * 查询全部
 * @param Object data 传参
 */
export function getRecoveryStrategyList (data) {
  return axios.post('/admin.v1.RecoveryStrategy/List', data)
}

/**
 * 查询所有工作流
 * @param Object data 传参
 */
export function getAllRecoveryStrategy (data) {
  return axios.post('/admin.v1.RecoveryStrategy/List', {
    ...data,
    ps: -1
  })
}

/**
 * 获取工作流
 * @param Object data 传参
 */
export function getRecoveryStrategy (data) {
  return axios.post('/admin.v1.RecoveryStrategy/Get', data)
}

/**
 * 新建工作流
 * @param Object data 传参
 */
export function addRecoveryStrategy (data) {
  return axios.post('/admin.v1.RecoveryStrategy/Add', data)
}

/**
 * 修改工作流
 * @param Object data 传参
 */
export function updateRecoveryStrategy (data) {
  return axios.post('/admin.v1.RecoveryStrategy/Patch', data)
}

/**
 * 删除工作流
 * @param Object data 传参
 */
export function deleteRecoveryStrategy (data) {
  return axios.post('/admin.v1.RecoveryStrategy/Delete', data)
}

/**
 * 批量删除工作流
 * @param Object data 传参
 */
export function batchDeleteRecoveryStrategy (data) {
  return axios.post('/admin.v1.RecoveryStrategy/BatchDelete', data)
}

/**
 * 查询历史记录
 * @param Object data 传参
 */
export function getRecoveryStrategyHistories (data) {
  return axios.post('/admin.v1.RecoveryStrategy/Histories', data)
}
