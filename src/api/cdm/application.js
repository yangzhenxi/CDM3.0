
import { axios } from '@/utils/request'

export const Api = [
  { url: '/admin.v1.Application/List', title: '查询应用' },
  { url: '/admin.v1.Application/List', title: '查询所有应用' },
  { url: '/admin.v1.Application/Get', title: '获取应用' },
  { url: '/admin.v1.Application/Add', title: '新建应用', isPopup: true },
  { url: '/admin.v1.Application/Patch', title: '修改应用', isPopup: true },
  { url: '/admin.v1.Application/Delete', title: '删除应用', isPopup: true },
  { url: '/admin.v1.Application/BatchDelete', title: '批量删除应用', isPopup: true },
  { url: '/admin.v1.Application/Test', title: '测试应用', isPopup: true },
  { url: '/admin.v1.Application/Backup', title: '备份应用', isPopup: true }
]

/**
 * 查询应用
 * @param Object data 传参
 */
export function getApplicationList (data) {
  return axios.post('/admin.v1.Application/List', data)
}

/**
 * 查询所有应用
 * @param Object data 传参
 */
export function getAllApplication (data) {
  return axios.post('/admin.v1.Application/List', {
    ...data,
    ps: -1
  })
}
/**
 * 获取应用
 * @param String data 传参
 */
export function getApplication (data) {
  return axios.post('/admin.v1.Application/Get', data)
}

/**
 * 新建应用
 * @param Object data 传参
 */
export function addApplication (data) {
  return axios.post('/admin.v1.Application/Add', data)
}

/**
 * 修改应用
 * @param Object data 传参
 */
export function updateApplication (data) {
  return axios.post('/admin.v1.Application/Patch', data)
}

/**
 * 删除应用
 * @param Object data 传参
 */
export function deleteApplication (data) {
  return axios.post('/admin.v1.Application/Delete', data)
}

/**
 * 批量删除应用
 * @param Object data 传参
 */
export function batchDeleteApplication (data) {
  return axios.post('/admin.v1.Application/BatchDelete', data)
}

/**
 * 测试应用
 * @param Object data 传参
 */
export function testApplication (data) {
  return axios.post('/admin.v1.Application/Test', data)
}

/**
 * 备份应用
 * @param Object data 传参
 */
export function backupApplication (data) {
  return axios.post('/admin.v1.Application/Backup', data)
}
