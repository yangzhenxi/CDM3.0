
import { axios } from '@/utils/request'

export const Api = [
  { url: '/admin.v1.VirtualCopy/List', title: '查询虚拟副本' },
  { url: '/admin.v1.VirtualCopy/List', title: '查询所有虚拟副本' },
  { url: '/admin.v1.VirtualCopy/Get', title: '获取虚拟副本' },
  { url: '/admin.v1.VirtualCopy/Add', title: '恢复虚拟副本', isPopup: true },
  { url: '/admin.v1.VirtualCopy/Delete', title: '删除虚拟副本', isPopup: true }
]

/**
 * 查询虚拟副本
 * @param Object data 传参
 */
export function getVirtualCopyList (data) {
  return axios.post('/admin.v1.VirtualCopy/List', data)
}

/**
 * 查询所有虚拟副本
 * @param Object data 传参
 */
export function getAllVirtualCopy (data) {
  return axios.post('/admin.v1.VirtualCopy/List', {
    ...data,
    ps: -1
  })
}

/**
 * 获取虚拟副本
 * @param Object data 传参
 */
export function getVirtualCopy (data) {
  return axios.post('/admin.v1.VirtualCopy/Get', data)
}

/**
 * 恢复虚拟副本
 * @param Object data 传参
 */
export function addVirtualCopy (data) {
  return axios.post('/admin.v1.VirtualCopy/Add', data)
}

/**
 * 删除虚拟副本
 * @param Object data 传参
 */
export function deleteVirtualCopy (data) {
  return axios.post('/admin.v1.VirtualCopy/Delete', data)
}
