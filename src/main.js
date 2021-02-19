// with polyfills
import 'core-js/stable'
import 'regenerator-runtime/runtime'

import Vue from 'vue'
import VueCompositionApi from '@vue/composition-api'
import App from './App.vue'
import router from './router'
import store from './store'
import i18n from './locales'
import { VueAxios } from './utils/request'

import './mock'

import bootstrap from './core/bootstrap'
import './core/lazy_use'
import './permission'
import './utils/filter'

Vue.config.productionTip = false

Vue.use(VueCompositionApi)
Vue.use(VueAxios)

new Vue({
  router,
  store,
  i18n,
  created: bootstrap,
  render: h => h(App)
}).$mount('#app')
