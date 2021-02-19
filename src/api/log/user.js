import { axios } from '@/utils/request'

export const Api = [
  { url: '/admin.v1.UserLog/List', title: '查询用户日志' }
]

/**
 * 查询用户日志
 * @param Object data 传参
 */
export function getUserLogList (data) {
  return axios.post('/admin.v1.UserLog/List', data)
}
