import { axios } from '@/utils/request'

export const Api = [
  { url: '/admin.v1.Dashboard/Get', title: '获取仪表盘' },
  { url: '/admin.v1.Dashboard/GetPool', title: '获取仪表盘 - 存储池' },
  { url: '/admin.v1.Dashboard/GetDG', title: '获取仪表盘 - DG' }
]

/**
 * 获取仪表盘
 * @param Object data 传参
 */
export function getDashboard (data) {
  return axios.post('/admin.v1.Dashboard/Get', data)
}

/**
 * 获取仪表盘 - 存储池
 * @param Object data 传参
 */
export function getDashboardPool (data) {
  return axios.post('/admin.v1.Dashboard/GetPool', data)
}

/**
 * 获取仪表盘 - DG
 * @param Object data 传参
 */
export function getDashboardDG (data) {
  return axios.post('/admin.v1.Dashboard/GetDG', data)
}
