import { axios } from '@/utils/request'

export const Api = [
  { url: '/admin.v1.Storage/List', title: '查询存储节点' },
  { url: '/admin.v1.Storage/List', title: '查询所有存储节点' },
  { url: '/admin.v1.Storage/Get', title: '获取存储节点' },
  { url: '/admin.v1.Storage/Add', title: '新建存储节点', isPopup: true },
  { url: '/admin.v1.Storage/Patch', title: '修改存储节点', isPopup: true },
  { url: '/admin.v1.Storage/Delete', title: '删除存储节点', isPopup: true },
  { url: '/admin.v1.Storage/GetDevices', title: '查询存储节点下的所有设备' },
  { url: '/admin.v1.Storage/GetDevice', title: '查询存储节点下的设备' },
  { url: '/admin.v1.Storage/FlushScsi', title: '刷新存储节点', isPopup: true }
]

/**
 * 查询存储节点
 * @param Object data 传参
 */
export function getClassList (data) {
  return axios.post('/admin.v1.Storage/List', data)
}

/**
 * 获取存储节点
 * @param Object data 传参
 */
export function getAllClass (data) {
  return axios.post('/admin.v1.Storage/List', {
    ...data,
    ps: -1
  })
}

/**
 * 获取存储节点
 * @param String name
 * @param Object data 传参
 */
export function getClass (data) {
  return axios.post(`/admin.v1.Storage/Get`, data)
}

/**
 * 添加存储节点
 * @param Object data 传参
 */
export function addClass (data) {
  return axios.post('/admin.v1.Storage/Add', data)
}

/**
 * 修改存储节点
 * @param Object data 传参
 */
export function updateClass (data) {
  return axios.post(`/admin.v1.Storage/Patch`, data)
}

/**
 * 删除存储节点
 * @param Object data 传参
 */
export function deleteClass (data) {
  return axios.post(`/admin.v1.Storage/Delete`, data)
}

/**
 * 查询存储节点下的设备
 * @param Object data 传参
 */
export function getClassDevices (data) {
  return axios.post(`/admin.v1.Storage/GetDevices`, data)
}

/**
 * 查询存储节点下的设备
 * @param Object data 传参
 */
export function getClassDevice (data) {
  return axios.post(`/admin.v1.Storage/GetDevice`, data)
}

/**
 * 刷新存储节点
 * @param Object data 传参
 */
export function flushClass (data) {
  return axios.post(`/admin.v1.Storage/FlushScsi`, data)
}
