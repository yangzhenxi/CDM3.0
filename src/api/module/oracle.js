
import { axios } from '@/utils/request'

export const Api = [
  { url: '/admin.v1.Oracle/GetOracleInstances', title: '获取 Oracle 实例' },
  { url: '/admin.v1.Oracle/GetOracleEnv', title: '获取 Oracle 环境' }
]

/**
 * 获取 Oracle 实例
 * data: { lbletID: '' }
 * @param Object data 传参
 */
export function getOracleInstances (data) {
  return axios.post(`/admin.v1.Oracle/GetOracleInstances`, data)
}

/**
 * 获取 Oracle 环境
 * data: { lbletID: '' }
 * @param Object data 传参
 */
export function getOracleEnv (data) {
  return axios.post(`/admin.v1.Oracle/GetOracleEnv`, data)
}
