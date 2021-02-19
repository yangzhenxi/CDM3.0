import { axios } from '@/utils/request'

export const Api = [
  { url: '/Notify', title: '查询告警日志' },
  { url: '/Notify', title: '查询所有告警日志' },
  { url: '/Notify/read', title: '设置告警已读', isPopup: true }
]

/**
 * 查询告警日志
 * @param Object data 传参
 */
export function getAlertLogList (data) {
  return axios.post('/Notify', data)
}

/**
 * 查询全部告警日志
 * @param Object data 传参
 */
export function getAllAlertLog (data) {
  return axios.post('/Notify', data)
}

/**
 * 设置告警已读
 * @param Object data 传参
 */
export function updateAlertRead (data) {
  return axios.post(`/Notify/read`, data)
}
