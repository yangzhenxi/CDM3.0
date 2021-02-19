import { asyncRouterMap, constantRouterMap } from '@/config/router.config'
import router, { resetRouter } from '@/router'
import { deepGet } from '@/utils/util'

/**
 * 过滤账户是否拥有某一个权限，并将菜单从加载列表移除
 *
 * @param route
 * @param rules
 * @returns {boolean}
 */
function hasPermission (route, actions) {
  const action = deepGet(route, 'meta.action', [])
  if (!action.length) {
    return true
  } else {
    return actions.some(u => action.every(i => u.includes(i)))
  }
}

function filterAsyncRouter (routerMap, actions) {
  const accessedRouters = routerMap.filter(route => {
    if (hasPermission(route, actions)) {
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children, actions)
      }
      return true
    }
    return false
  })
  return accessedRouters
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
      resetRouter()
      router.addRoutes(routers)
    }
  },
  actions: {
    GenerateRoutes ({ commit }, role) {
      return new Promise(resolve => {
        const actions = deepGet(role, 'resources', []).map(u => `${u?.module}-${u?.object}-${u?.action}`)
        if (actions.includes('*-*-*')) {
          commit('SET_ROUTERS', asyncRouterMap)
        } else {
          const accessedRouters = filterAsyncRouter(asyncRouterMap, actions)
          commit('SET_ROUTERS', accessedRouters)
        }
        resolve()
      })
    }
  }
}

export default permission
