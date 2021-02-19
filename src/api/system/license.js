import { axios } from '@/utils/request'

export const Api = [
  { url: '/License', title: '查询证书' },
  { url: '/License/pool', title: '绑定池', isPopup: true },
  { url: '/License1', title: '上传证书', isPopup: true }
]

/**
 * 查询证书
 * @param Object data 传参
 */
export function getLicenseList (data) {
  return axios.post('/License', { data: {
    limit: -1,
    ...data
  } })
}

/**
 * 绑定池
 * @param Object data 传参
 */
export function bindPool (name, data) {
  return axios.post(`/License/pool`, data)
}

/**
 * 上传许可
 * @param Object data 传参
 */
export function uploadLicense (data) {
  return axios.post(`/License1`, data)
}
