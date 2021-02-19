
import { axios } from '@/utils/request'

export const Api = [
  { url: '/admin.v1.Virtual/GetHyperVList', title: '获取 hyperv 虚拟机' }
]

/**
 * 获取 hyperv 虚拟机
 * @param Object data 传参
 */
export function getHyperVVCList (data) {
  return axios.post('/admin.v1.Virtual/GetHyperVList', data)
}
