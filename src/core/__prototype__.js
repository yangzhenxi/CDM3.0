import ENUM from '@/config/enum'
import { deepGet } from '@/utils/util'

function plugin (Vue) {
  if (plugin.installed) {
    return
  }

  !Vue.prototype.$auth && Object.defineProperties(Vue.prototype, {
    $auth: {
      get () {
        const _this = this
        return rule => {
          const actions = deepGet(_this.$store.getters.role, 'resources', []).map(u => `${u?.module}-${u?.object}-${u?.action}`)
          return actions.findIndex(u => u === rule) > -1
        }
      }
    }
  })

  !Vue.prototype.$enum && Object.defineProperties(Vue.prototype, {
    $enum: {
      get () {
        return value => ENUM[value]
      }
    }
  })
}

export default plugin
