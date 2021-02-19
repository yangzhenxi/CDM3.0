import { axios } from '@/utils/request'

export const Api = [
  { url: '/admin.v1.Event/List', title: '查询任务' },
  { url: '/admin.v1.Event/Get', title: '获取任务' }
]

/**
 * 查询任务
 * @param Object data 传参
 */
export function getTaskList (data) {
  return axios.post('/admin.v1.Event/List', data)
}

/**
 * 获取任务
 * @param Object data 传参
 */
export function getTask (data) {
  return axios.post('/admin.v1.Event/Get', data)
}
