import storage from 'store'
import NProgress from 'nprogress'
import notification from 'ant-design-vue/es/notification'
import router from './router'
import store from './store'
import { i18nRender } from '@/locales'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { setDocumentTitle, domTitle } from '@/utils/domUtil'
import { handleFetchErrorNotification, isEmpty } from '@/utils/util'

NProgress.configure({ showSpinner: false })

const allowList = ['login']
const loginRoutePath = '/user/login'
const defaultRoutePath = '/dashboard/workplace'

router.beforeEach((to, from, next) => {
  NProgress.start()
  to.meta && (typeof to.meta.title !== 'undefined' && setDocumentTitle(`${i18nRender(to.meta.title)} - ${domTitle}`))
  if (storage.get(ACCESS_TOKEN)) {
    if (to.path === loginRoutePath) {
      next({ path: defaultRoutePath })
      NProgress.done()
    } else {
      // 如果当前没有用户
      if (isEmpty(store.getters.role)) {
        store
          .dispatch('GetInfo')
          .then(() => {
            store.dispatch('GenerateRoutes', store.getters.role).then(() => {
              // 根据roles权限生成可访问的路由表
              // 动态添加可访问路由表
              const redirect = decodeURIComponent(from.query.redirect || to.path)
              if (to.path === redirect) {
                // hack方法 确保addRoutes已完成
                next({ ...to, replace: true })
              } else {
                // 跳转到目的路由
                next({ path: redirect })
              }
            })
          })
          .catch(error => {
            handleFetchErrorNotification(error)
            store.dispatch('Logout').then(() => {
              next({ path: loginRoutePath })
              NProgress.done()
            })
          })
      } else {
        next()
      }
    }
  } else {
    if (allowList.includes(to.name)) {
      // 在免登录名单，直接进入
      next()
    } else {
      notification.error({
        message: 401,
        description: h => {
          return (
            <span>token 已过期</span>
          )
        }
      })
      next({ path: loginRoutePath })
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
