import { axios } from '@/utils/request'

export const Api = [
  { url: '/Scheduler', title: '查询调度组件' },
  { url: '/ControllerManager', title: '查询控制组件' }
]

/**
 * 查询调度组件
 * @param Object data 传参
 */
export function getAllScheduler (data) {
  return axios.post('/Scheduler', {
    ...data,
    ps: -1
  })
}

/**
 * 查询控制组件
 * @param Object data 传参
 */
export function getAllControllerManager (data) {
  return axios.post('/ControllerManager', {
    ...data,
    ps: -1
  })
}
