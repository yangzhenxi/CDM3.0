
import { axios } from '@/utils/request'

export const Api = [
  { url: `/admin.v1.Mssql/GetAllMssqlDatabase`, title: '获取所有 Mssql 数据库' },
  { url: `/admin.v1.Mssql/GetOneMssqlDatabase`, title: '获取 Mssql 数据库' },
  { url: `/admin.v1.Mssql/GetMssqlInfo`, title: '获取 Mssql' },
  { url: `/admin.v1.Mssql/CheckMssqlDatabase`, title: '检测 Mssql 连接', isPopup: true }
]

/**
 * 获取所有 Mssql 数据库
 * @param Object data 传参
 */
export function getAllMssqlDatabase (data) {
  return axios.post(`/admin.v1.Mssql/GetAllMssqlDatabase`, data)
}

/**
 * 获取 Mssql 数据库
 * @param Object data 传参
 */
export function getMssqlDatabase (data) {
  return axios.post(`/admin.v1.Mssql/GetOneMssqlDatabase`, data)
}

/**
 * 获取 Mssql
 * @param Object data 传参
 */

export function getMssql (data) {
  return axios.post(`/admin.v1.Mssql/GetMssqlInfo`, data)
}

/**
 * 检测 Mssql 连接
 * @param Object data 传参
 */
export function checkMssql (data) {
  return axios.post(`/admin.v1.Mssql/CheckMssqlDatabase`, data)
}
