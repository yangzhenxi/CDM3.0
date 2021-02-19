
import { axios } from '@/utils/request'

export const Api = [
  { url: '/admin.v1.Lblet/List', title: '查询客户端' },
  { url: '/admin.v1.Lblet/List', title: '查询所有客户端' },
  { url: '/admin.v1.Lblet/Get', title: '获取客户端' },
  { url: '/admin.v1.Lblet/Register', title: '注册客户端', isPopup: true },
  { url: '/admin.v1.Lblet/Patch', title: '修改客户端', isPopup: true },
  { url: '/admin.v1.Lblet/Delete', title: '删除客户端', isPopup: true },
  { url: '/admin.v1.Lblet/GetUsers', title: '获取客户端的用户' },
  { url: '/admin.v1.Lblet/Applications', title: '获取客户端的应用' },
  { url: '/admin.v1.Lblet/UpdateIQN', title: '修改 ISCSI 协议', isPopup: true },
  { url: '/admin.v1.Lblet/UpdateWWN', title: '修改 FC 协议', isPopup: true },
  { url: '/admin.v1.Lblet/AllocateUsers', title: '分配用户 -> 客户端', isPopup: true },
  { url: '/admin.v1.Lblet/BindLabel', title: '绑定标签', isPopup: true }
]

/**
 * 查询所有客户端
 * @param Object data 传参
 */
export function getLbletList (data) {
  return axios.post('/admin.v1.Lblet/List', data)
}

/**
 * 查询所有客户端
 * @param Object data 传参
 */
export function getAllLblet (data) {
  return axios.post('/admin.v1.Lblet/List', {
    ...data,
    ps: -1
  })
}

/**
 * 获取客户端
 * @param Object data 传参
 */
export function getLblet (data) {
  return axios.post('/admin.v1.Lblet/Get', data)
}

/**
 * 注册客户端
 * @param Object data 传参
 */
export function registerLblet (data) {
  return axios.post('/admin.v1.Lblet/Register', data)
}

/**
 * 修改客户端
 * @param Object data 传参
 */
export function updateLblet (data) {
  return axios.post('/admin.v1.Lblet/Patch', data)
}

/**
 * 删除客户端
 * @param Object data 传参
 */
export function deleteLblet (data) {
  return axios.post('/admin.v1.Lblet/Delete', data)
}

/**
 * 获取客户端的用户
 * @param Object data 传参
 */
export function getLbletUser (data) {
  return axios.post('/admin.v1.Lblet/GetUsers', data)
}

/**
 * 获取客户端的应用
 * @param String data
 */
export function getLbletApplications (data) {
  return axios.post('/admin.v1.Lblet/Applications', data)
}

/**
 * 修改 ISCSI 协议
 * @param Object data 传参
 */
export function updateLbletProtocolIQN (data) {
  return axios.post('/admin.v1.Lblet/UpdateIQN', data)
}

/**
 * 修改 FC 协议
 * @param Object data 传参
 */
export function updateLbletProtocolWWN (data) {
  return axios.post('/admin.v1.Lblet/UpdateWWN', data)
}

/**
 * 分配用户 -> 客户端
 * @param Object data 传参
 */
export function allocateUser (data) {
  return axios.post('/admin.v1.Lblet/AllocateUsers', data)
}

/**
 * 绑定标签
 * @param Object data 传参
 */
export function bindLabel (data) {
  return axios.post('/admin.v1.Lblet/BindLabel', data)
}
