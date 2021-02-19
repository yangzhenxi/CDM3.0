import { axios } from '@/utils/request'

export const Api = [
  { url: '/admin.v1.Pool/List', title: '查询存储池' },
  { url: '/admin.v1.Pool/List', title: '查询所有存储池' },
  { url: '/admin.v1.Pool/Get', title: '获取存储池' },
  { url: '/admin.v1.Pool/Add', title: '新建存储池', isPopup: true },
  { url: '/admin.v1.Pool/Patch', title: '修改存储池', isPopup: true },
  { url: '/admin.v1.Pool/Destroy', title: '删除存储池', isPopup: true },
  { url: '/admin.v1.Pool/Expand', title: '扩容存储池', isPopup: true },
  { url: '/admin.v1.Pool/Test', title: '测试存储池', isPopup: true },
  { url: '/admin.v1.Pool/GetIO', title: '获取存储池 IO' },
  { url: '/admin.v1.Pool/AllocateUsers', title: '分配用户 -> 存储池', isPopup: true }
]

/**
 * 查询存储池
 * @param Object data 传参
 */
export function getPoolList (data) {
  return axios.post('/admin.v1.Pool/List', data)
}

/**
 * 查询所有存储池
 * @param Object data 传参
 */
export function getAllPool (data) {
  return axios.post('/admin.v1.Pool/List', {
    ...data,
    ps: -1
  })
}

/**
 * 获取存储池
 * @param Object data 传参
 */
export function getPool (data) {
  return axios.post(`/admin.v1.Pool/Get`, data)
}

/**
 * 新建存储池
 * @param Object data 传参
 */
export function addPool (data) {
  return axios.post('/admin.v1.Pool/Add', data)
}

/**
 * 修改存储池
 * @param Object data 传参
 */
export function updatePool (data) {
  return axios.post(`/admin.v1.Pool/Patch`, data)
}

/**
 * 删除存储池
 * @param Object data 传参
 */
export function deletePool (data) {
  return axios.post(`/admin.v1.Pool/Destroy`, data)
}

/**
 * 扩容存储池
 * @param Object data 传参
 */
export function expandPool (data) {
  return axios.post(`/admin.v1.Pool/Expand`, data)
}

/**
 * 测试存储池
 * @param Object data 传参
 */
export function testPool (data) {
  return axios.post(`/admin.v1.Pool/Test`, data)
}

/**
 * 获取存储池 IO
 * @param Object data 传参
 */
export function getPoolMetric (data) {
  return axios.post(`/admin.v1.Pool/GetIO`, data)
}

/**
 * 分配用户 -> 存储池
 * @param Object data 传参
 */
export function allocateUser (data) {
  return axios.post(`/admin.v1.Pool/AllocateUsers`, data)
}
