
import { axios } from '@/utils/request'

export const Api = [
  { url: `/admin.v1.Mysql/GetMysqlDatabase`, title: '获取所有 Mysql 数据库' },
  { url: `/admin.v1.Mysql/GetOneMysqlDatabase`, title: '获取 Mysql 数据库' },
  { url: `/admin.v1.Mysql/GetMysqlInfo`, title: '获取 Mysql', isPopup: true },
  { url: `/admin.v1.Mysql/CheckMysqlDatabase`, title: '检测 Mysql 连接', isPopup: true }
]

/**
 * 获取所有 Mysql 数据库
 * @param Object data 传参
 */
export function getAllMysqlDatabase (data) {
  return axios.post(`/admin.v1.Mysql/GetMysqlDatabase`, data)
}

/**
 * 获取 Mysql数据库
 * @param Object data 传参
 */

export function getMysqlDatabase (data) {
  return axios.post(`/admin.v1.Mysql/GetOneMysqlDatabase`, data)
}

/**
 * 获取 Mysql
 * @param Object data 传参
 */

export function getMysql (data) {
  return axios.post(`/admin.v1.Mysql/GetMysqlInfo`, data)
}

/**
 * 检测 Mysql 连接
 * @param Object data 传参
 */
export function checkMysql (data) {
  return axios.post(`/admin.v1.Mysql/CheckMysqlDatabase`, data)
}
