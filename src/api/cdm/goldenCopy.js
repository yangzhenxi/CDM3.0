
import { axios } from '@/utils/request'

export const Api = [
  { url: '/admin.v1.GoldenCopy/List', title: '查询黄金副本' },
  { url: '/admin.v1.GoldenCopy/List', title: '查询所有黄金副本' },
  { url: '/admin.v1.GoldenCopy/Delete', title: '删除黄金副本', isPopup: true }
]

/**
 *  查询黄金副本
 * @param Object data 传参
 */
export function getGoldenCopyList (data) {
  return axios.post('/admin.v1.GoldenCopy/List', data)
}

/**
 *  查询所有黄金副本
 * @param Object data 传参
 */
export function getAllGoldenCopy (data) {
  return axios.post('/admin.v1.GoldenCopy/List', {
    ...data,
    ps: -1
  })
}

/**
 * 删除黄金副本
 * @param Object data 传参
 */
export function deleteGoldenCopy (data) {
  return axios.post('/admin.v1.GoldenCopy/Delete', data)
}
