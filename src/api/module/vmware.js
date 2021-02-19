
import { axios } from '@/utils/request'

export const Api = [
  { url: '/admin.v1.Virtual/GetVcenterInfo', title: '获取 vc' },
  { url: '/admin.v1.Virtual/GetDatacenter', title: '获取数据中心' },
  { url: '/admin.v1.Virtual/GetVMsByDatacenter', title: '根据数据中心获取虚拟机' },
  { url: '/admin.v1.Virtual/GetClusterAndHost', title: '根据数据中心获取集群和主机' }
]

/**
 * 获取 vc
 * @param Object data 传参
 */
export function getVCenter (data) {
  return axios.post('/admin.v1.Virtual/GetVcenterInfo', data)
}

/**
 * 获取数据中心
 * @param Object data 传参
 */
export function getDataCenter (data) {
  return axios.post('/admin.v1.Virtual/GetDatacenter', data)
}

/**
 * 根据数据中心获取虚拟机
 * @param Object data 传参
 */
export function getVMsByDataCenter (data) {
  return axios.post('/admin.v1.Virtual/GetVMsByDatacenter', data)
}

/**
 * 根据数据中心获取集群和主机
 * @param Object data 传参
 */
export function getClusterAndHost (data) {
  return axios.post('/admin.v1.Virtual/GetClusterAndHost', data)
}
