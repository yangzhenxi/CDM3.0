import { axios } from '@/utils/request'

export const Api = [
  { url: '/admin.v1.DataGuard/List', title: '查询 DG' },
  { url: '/admin.v1.DataGuard/List', title: '查询所有 DG' },
  { url: '/admin.v1.DataGuard/Add', title: '添加 DG', isPopup: true },
  { url: '/admin.v1.DataGuard/Create', title: '创建 DG', isPopup: true },
  { url: '/admin.v1.DataGuard/Delete', title: '删除 DG', isPopup: true },
  { url: '/admin.v1.DataGuard/Destroy', title: '销毁 DG', isPopup: true },
  { url: '/admin.v1.DataGuard/QueryInfo', title: '获取 DG 详情' }
]

/**
 * 查询 DG
 * @param Object data 传参
 */
export function getDgList (data) {
  return axios.post('/admin.v1.DataGuard/List', data)
}

/**
 * 查询所有 DG
 * @param Object data 传参
 */
export function getAllDg (data) {
  return axios.post('/admin.v1.DataGuard/List', {
    ...data,
    ps: -1
  })
}

/**
 * 添加 DG
 * @param Object data 传参
 */
export function addDg (data) {
  return axios.post('/admin.v1.DataGuard/Add', data)
}

/**
 * 创建 DG
 * @param Object data 传参
 */
export function createDg (data) {
  return axios.post('/admin.v1.DataGuard/Create', data)
}

/**
 * 删除 DG
 * @param Object data 传参
 */
export function deleteDg (data) {
  return axios.post(`/admin.v1.DataGuard/Delete`, data)
}

/**
 * 销毁 DG
 * @param Object data 传参
 */
export function destroyDg (data) {
  return axios.post(`/admin.v1.DataGuard/Destroy`, data)
}

/**
 * 获取 dg 详情
 * @param Object data 传参
 */
export function getDGInfo (data) {
  return axios.post(`/admin.v1.DataGuard/QueryInfo`, data)
}
