import { axios } from '@/utils/request'

export const Api = [
  { url: '/admin.v1.Role/List', title: '查询所有角色' },
  { url: '/admin.v1.Role/Get', title: '获取角色' },
  { url: '/admin.v1.Role/Add', title: '新建角色', isPopup: true },
  { url: '/admin.v1.Role/Patch', title: '修改角色', isPopup: true },
  { url: '/admin.v1.Role/Delete', title: '删除角色', isPopup: true },
  { url: '/admin.v1.Resource/List', title: '查询所有资源' },
  { url: '/admin.v1.Resource/Get', title: '获取资源' }
]

/**
 * 查询角色
 * @param Object data 传参
 */
export function getAllRole (data) {
  return axios.post('/admin.v1.Role/List', {
    ...data,
    ps: -1
  })
}

/**
 * 获取角色
 * @param Object data 传参
 */
export function getRole (data) {
  return axios.post(`/admin.v1.Role/Get`, data)
}

/**
 * 新建角色
 * @param Object data 传参
 */
export function addRole (data) {
  return axios.post(`/admin.v1.Role/Add`, data)
}

/**
 * 修改角色
 * @param Object data 传参
 */
export function updateRole (data) {
  return axios.post(`/admin.v1.Role/Patch`, data)
}

/**
 * 删除角色
 * @param Object data 传参
 */
export function deleteRole (data) {
  return axios.post(`/admin.v1.Role/Delete`, data)
}

/**
 * 查询资源
 * @param Object data 传参
 */
export function getAllResource (data) {
  return axios.post(`/admin.v1.Resource/List`, {
    ...data,
    ps: -1
  })
}

/**
 * 获取资源
 * @param Object data 传参
 */
export function getResource (data) {
  return axios.post(`/admin.v1.Resource/Get`, data)
}
