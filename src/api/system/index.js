import { axios } from '@/utils/request'

export const Api = [
  { url: '/Dashboard/time', title: '获取服务器时间' }
]

/**
 * 获取服务器时间
 */
export function getServerTime () {
  return axios.post('/Dashboard/time')
}
