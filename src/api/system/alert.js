import { axios } from '@/utils/request'

export const Api = [
  { url: '/SMTP', title: '获取smtp配置' },
  { url: '/SMTP1', title: '修改smtp配置', isPopup: true },
  { url: '/SMTP/able', title: '启用smtp服务', isPopup: true },
  { url: '/SMTP/unable', title: '禁用smtp服务', isPopup: true },
  { url: '/Notify/config', title: '获取告警配置' },
  { url: '/Notify/config1', title: '修改告警配置', isPopup: true }
]

/**
 * 获取smtp配置
 * @param Object data 传参
 */
export function getAlertSmtp (data) {
  return axios.post('/SMTP', data)
}

/**
 * 修改smtp配置
 * @param Object data 传参
 */
export function updateAlertSmtp (data) {
  return axios.post('/SMTP1', data)
}

/**
 * 启用smtp服务
 * @param Object data 传参
 */
export function enableAlertSmtp (data) {
  return axios.post('/SMTP/able', data)
}

/**
 * 禁用smtp服务
 * @param Object data 传参
 */
export function unableAlertSmtp (data) {
  return axios.post('/SMTP/unable', data)
}

/**
 * 获取告警配置
 * @param Object data 传参
 */
export function getAlert (data) {
  return axios.post('/Notify/config', data)
}

/**
 * 修改告警配置
 * @param Object data 传参
 */
export function updateAlert (data) {
  return axios.post('/Notify/config', data)
}
