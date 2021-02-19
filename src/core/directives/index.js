import Vue from 'vue'
import store from '@/store'
import { deepGet, isEmpty } from '@/utils/util'

const action = Vue.directive('action', {
  inserted: function (el, binding, vnode) {
    const { arg, value } = binding
    const action = value || arg
    const actions = deepGet(store.getters.role, 'resources', []).map(u => `${u?.module}-${u?.object}-${u?.action}`)
    if (!isEmpty(action) && actions.findIndex(u => u === action) === -1) {
      el.parentNode && el.parentNode.removeChild(el) || (el.style.display = 'none')
    }
  }
})

export {
  action
}
