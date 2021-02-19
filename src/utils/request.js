import axios from 'axios'
import storage from 'store'
import store from '@/store'
import apiEnum from '@/api'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { VueAxios } from './axios'
import { getCookie, handleFetchErrorNotification, requestParamsBuild } from '@/utils/util'

const apiRoot = getCookie('apiRoot')

const baseURL = apiRoot ? `http://${apiRoot}` : ''

// 创建 axios 实例
const service = axios.create({
  baseURL: baseURL + process.env.VUE_APP_API_BASE_URL, // api base_url
  timeout: 5000 // 请求超时时间
})

const err = (error) => {
  if (error.response) {
    const token = storage.get(ACCESS_TOKEN)
    const { config, status } = error.response
    if (status === 401 && config.url !== '/User/login') {
      if (token) {
        store.dispatch('Logout').then(() => {
          handleFetchErrorNotification(error)
          setTimeout(() => {
            window.location.reload()
          }, 500)
        })
      }
    } else {
      if (status >= 400) {
        const api = apiEnum.filter(u => u.isPopup).find(u => u.url === config.url)
        if (api) {
          handleFetchErrorNotification(error)
        }
      }
    }
  }
  return Promise.reject(error)
}

service.interceptors.request.use(config => {
  if (config.method === 'get' && config.params) {
    config.sourceUrl = config.url
    config.url = requestParamsBuild(config.url, config.params)
    config.params = {}
  }
  const token = storage.get(ACCESS_TOKEN)
  config.headers.Authorization = 'Bearer ' + token // 让每个请求携带自定义 token 请根据实际情况自行修改
  return config
}, err)

service.interceptors.response.use((response) => {
  if (response.data.code > 201 && response.data.code < 300) {
    if (response.data.code === 202) { // 流程中

    } else {
    }
    return response.data
  } else {
    return response.data
  }
}, err)

const installer = {
  vm: {},
  install (Vue) {
    Vue.use(VueAxios, service)
  }
}

export {
  installer as VueAxios,
  service as axios
}
