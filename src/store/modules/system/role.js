import { updateRole } from '@/api/system/role'

const user = {
  state: {
  },
  actions: {
    // 修改角色权限
    UpdateRole ({ commit, dispatch }, data) {
      return new Promise(async (resolve, reject) => {
        try {
          await updateRole(data)
          dispatch('SetUser', data?.name)
          resolve()
        } catch (error) {
          reject(error)
        }
      })
    }
  }
}

export default user
