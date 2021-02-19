import storage from 'store'
import { login, logout, getUserInfo, updateUser } from '@/api/system/user'
import { EXPIRED } from '@/config/constant.config'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { deepGet } from '@/utils/util'
import { getRole } from '@/api/system/role'

const user = {
  state: {
    user: {}, // 用户详情
    role: [], // 角色
    token: null
  },
  mutations: {
    SET_USER: (state, user) => {
      state.user = user
    },
    SET_ROLE: (state, role) => {
      state.role = role
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_IS_LOGIN: (state, isLogin) => {
      state.isLogin = isLogin
    }
  },
  actions: {
    // 登录
    Login ({ commit, dispatch }, data) {
      return new Promise((resolve, reject) => {
        login(data).then(res => {
          const { data } = res
          commit('SET_TOKEN', data)
          storage.set(ACCESS_TOKEN, data, EXPIRED * 1000)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 获取用户信息
    GetInfo ({ commit, dispatch }) {
      return new Promise(async (resolve, reject) => {
        try {
          const user = deepGet(await getUserInfo(), 'data')
          commit('SET_USER', user)
          const role = deepGet(await getRole({ id: user?.role }), 'data')
          commit('SET_ROLE', role)
          resolve()
        } catch (error) {
          reject(error)
        }
      })
    },
    UpdateUser ({ commit, state, dispatch }, data) {
      return new Promise(async (resolve, reject) => {
        try {
          await updateUser(data)
          // 修改用户的角色后，获取用户新的权限
          if (data.role) {
            dispatch('SetUser')
          }
          resolve()
        } catch (error) {
          reject(error)
        }
      })
    },
    // 修改角色权限后，获取用户新的权限
    SetUser ({ commit, state, dispatch, getters }, name) {
      return new Promise(async (resolve, reject) => {
        try {
          // 修改用户的角色 || 修改当前用户的角色权限
          if (!name || state.role?.name === name) {
            const user = deepGet(await getUserInfo(), 'data')
            commit('SET_USER', user)
            const role = deepGet(await getRole({ id: user?.role }), 'data')
            commit('SET_ROLE', role)
            dispatch('GenerateRoutes', role)
            resolve()
          }
          resolve()
        } catch (error) {
          reject(error)
        }
      })
    },
    // 登出
    Logout ({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout().then(() => {
          if (state.token) {
            resolve()
          }
        }).catch(error => {
          reject(error)
        }).finally(() => {
          commit('SET_USER')
          commit('SET_ROLE')
          commit('SET_TOKEN')
          storage.remove(ACCESS_TOKEN)
        })
      })
    }
  }
}

export default user
