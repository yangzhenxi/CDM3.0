/* eslint-disable no-undef */
import storage from 'store'
import config from '@/config/defaultSettings'
import store from '@/store'
import {
  TOGGLE_THEME,
  TOGGLE_COLOR,
  TOGGLE_LAYOUT,
  TOGGLE_WEAK,
  TOGGLE_COLLAPSED_MENU,
  TOGGLE_FIXED_MENU,
  TOGGLE_MENU_THEME,
  TOGGLE_FIXED_HEADER,
  TOGGLE_FIXED_HEADER_HIDDEN,
  TOGGLE_CONTENT_WIDTH,
  TOGGLE_MULTI_TAB,
  TOGGLE_LANG,
  TOGGLE_MOCK,
  ACCESS_TOKEN
} from '@/store/mutation-types'
import { timeoutLogout } from '@/utils/util'

export default function Initializer () {
  store.commit(TOGGLE_THEME, storage.get(TOGGLE_THEME, config.theme))
  store.commit(TOGGLE_COLOR, storage.get(TOGGLE_COLOR, config.primaryColor))
  store.commit(TOGGLE_LAYOUT, storage.get(TOGGLE_LAYOUT, config.layout))
  store.commit(TOGGLE_WEAK, storage.get(TOGGLE_WEAK, config.weak))
  store.commit(TOGGLE_COLLAPSED_MENU, storage.get(TOGGLE_COLLAPSED_MENU, config.collapsedMenu))
  store.commit(TOGGLE_FIXED_MENU, storage.get(TOGGLE_FIXED_MENU, config.fixedMenu))
  store.commit(TOGGLE_MENU_THEME, storage.get(TOGGLE_MENU_THEME, config.menuTheme))
  store.commit(TOGGLE_FIXED_HEADER, storage.get(TOGGLE_FIXED_HEADER, config.fixedHeader))
  store.commit(TOGGLE_FIXED_HEADER_HIDDEN, storage.get(TOGGLE_FIXED_HEADER_HIDDEN, config.autoHideHeader))
  store.commit(TOGGLE_CONTENT_WIDTH, storage.get(TOGGLE_CONTENT_WIDTH, config.contentWidth))
  store.commit(TOGGLE_MULTI_TAB, storage.get(TOGGLE_MULTI_TAB, config.multiTab))

  store.dispatch('setLang', storage.get(TOGGLE_LANG, config.lang))

  store.commit(TOGGLE_MOCK, storage.get(TOGGLE_MOCK, config.mock))

  store.commit('SET_TOKEN', storage.get(ACCESS_TOKEN))

  storage.set('version', APP_VERSION)
  storage.set('git_hash', GIT_HASH)
  storage.set('build_date', BUILD_DATE)

  init()
}

function init () {
  timeoutLogout()
}
