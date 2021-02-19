
import { axios } from '@/utils/request'
export const Api = [
  { url: '/admin.v1.Virtual/List', title: '查询虚拟化' },
  { url: '/admin.v1.Virtual/List', title: '查询所有虚拟化' },
  { url: '/admin.v1.Virtual/Get', title: '获取虚拟化' },
  { url: '/admin.v1.Virtual/Add', title: '新建虚拟化', isPopup: true },
  { url: '/admin.v1.Virtual/Patch', title: '修改虚拟化', isPopup: true },
  { url: '/admin.v1.Virtual/Delete', title: '删除虚拟化', isPopup: true },
  { url: '/admin.v1.Virtual/BatchDelete', title: '批量删除虚拟化', isPopup: true },
  { url: '/admin.v1.Virtual/AllocateUsers', title: '分配用户 -> 虚拟化', isPopup: true }
]

/**
 * 查询虚拟化
 * @param Object data 传参
 */
export function getVirtualList (data) {
  return axios.post('/admin.v1.Virtual/List', data)
}

/**
 * 查询所有虚拟化
 * @param Object data 传参
 */
export function getAllVirtual (data) {
  return axios.post('/admin.v1.Virtual/List', {
    ...data,
    ps: -1
  })
}

/**
 * 获取虚拟化
 * @param Object data 传参
 */
export function getVirtual (data) {
  return axios.post('/admin.v1.Virtual/Get', data)
}

/**
 * 新建虚拟化
 * @param Object data 传参
 */
export function addVirtual (data) {
  return axios.post('/admin.v1.Virtual/Add', data)
}

/**
 * 修改虚拟化
 * @param Object data 传参
 */
export function updateVirtual (data) {
  return axios.post('/admin.v1.Virtual/Patch', data)
}

/**
 * 删除虚拟化
 * @param Object data 传参
 */
export function deleteVirtual (data) {
  return axios.post('/admin.v1.Virtual/Delete', data)
}

/**
 * 批量删除虚拟化
 * @param Object data 传参
 */
export function batchDeleteVirtual (data) {
  return axios.post('/admin.v1.Virtual/BatchDelete', data)
}

/**
 * 分配用户 -> 虚拟化
 * @param Object data 传参
 */
export function allocateUser (data) {
  return axios.post('/admin.v1.Virtual/AllocateUsers', data)
}
