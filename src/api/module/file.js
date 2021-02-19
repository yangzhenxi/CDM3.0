
import { axios } from '@/utils/request'

export const Api = [
  { url: '/admin.v1.File/GetFilePath', title: '获取文件路径' }
]

/**
 * 获取文件路径
 * @param Object data 传参
 */
export function getFilePath (data) {
  return axios.post('/admin.v1.File/GetFilePath', data)
}
