
import { axios } from '@/utils/request'

export const Api = [
  { url: '/admin.v1.Pgsql/GetPgsqlInfo', title: '获取 Pgsql' },
  { url: '/admin.v1.Pgsql/CheckPgsqlDatabase', title: '检测 Pgsql 连接', isPopup: true }
]

/**
 * 获取 Pgsql
 * @param Object data 传参
 */
export function getPgsql (data) {
  return axios.post('/admin.v1.Pgsql/GetPgsqlInfo', data)
}

/**
 * 检测 Pgsql 连接
 * @param Object data 传参
 */
export function checkPgsql (data) {
  return axios.post('/admin.v1.Pgsql/CheckPgsqlDatabase', data)
}
