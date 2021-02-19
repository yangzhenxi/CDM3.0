import { axios } from '@/utils/request'

export const Api = [
  { url: '/admin.v1.User/List', title: '查询用户' },
  { url: '/admin.v1.User/List', title: '查询所有用户' },
  { url: '/admin.v1.User/Get', title: '获取用户' },
  { url: '/admin.v1.User/UserInfo', title: '获取当前用户' },
  { url: '/admin.v1.User/Add', title: '新建用户', isPopup: true },
  { url: '/admin.v1.User/Patch', title: '修改用户', isPopup: true },
  { url: '/admin.v1.User/Delete', title: '删除用户', isPopup: true },
  { url: '/admin.v1.User/Login', title: '登录' },
  { url: '/admin.v1.User/Logout', title: '登出' }
]

/**
 * 查询用户
 * @param Object data 传参
 */
export function getUserList (data) {
  return axios.post('/admin.v1.User/List', data)
}

/**
 * 查询所有用户
 * @param Object data 传参
 */
export function getAllUser (data) {
  return axios.post('/admin.v1.User/List', {
    ...data,
    ps: -1
  })
}

/**
 * 获取用户
 * @param Object data 传参
 */
export function getUser (data) {
  return axios.post('/admin.v1.User/Get', data)
}

/**
 * 获取当前用户
 * @param Object data 传参
 */
export function getUserInfo (data) {
  return axios.post('/admin.v1.User/UserInfo', data)
}

/**
 * 新建用户
 * @param Object data 传参
 */
export function addUser (data) {
  return axios.post('/admin.v1.User/Add', data)
}

/**
 * 修改用户
 * @param Object data 传参
 */
export function updateUser (data) {
  return axios.post('/admin.v1.User/Patch', data)
}

/**
 * 删除用户
 * @param Object data 传参
 */
export function deleteUser (data) {
  return axios.post('/admin.v1.User/Delete', data)
}

/**
 * 登录
 * @param Object data 传参
 */
export function login (data) {
  return axios.post('/admin.v1.User/Login', data)
}

/**
 * 登出
 * @param Object data 传参
 */
export function logout (data) {
  return axios.post('/admin.v1.User/Logout', data)
}
