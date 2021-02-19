import storage from 'store'
import { loadLanguageAsync } from '@/locales'
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
  TOGGLE_MULTI_TAB_VISITED,
  TOGGLE_MULTI_TAB_ACTIVE,
  TOGGLE_LANG,
  TOGGLE_MOCK,
  TOGGLE_MOBILE_TYPE
} from '@/store/mutation-types'

const app = {
  state: {
    theme: 'light',
    primaryColor: '#1890ff',
    layout: 'sidemenu',
    weak: false,
    collapsedMenu: true,
    fixedMenu: true,
    menuTheme: 'dark',
    fixedHeader: true,
    autoHideHeader: true,
    multiTab: true,
    contentWidth: 'Fixed',

    multiTabVisited: [], // 展示tab
    multiTabActive: [], // tab 缓存 include

    lang: 'zh-CN',
    _antLocale: {},
    mock: true,

    isMobile: false
  },
  mutations: {
    [TOGGLE_THEME]: (state, theme) => {
      state.theme = theme
      storage.set(TOGGLE_THEME, theme)
    },
    [TOGGLE_COLOR]: (state, color) => {
      state.primaryColor = color
      storage.set(TOGGLE_COLOR, color)
    },
    [TOGGLE_LAYOUT]: (state, layout) => {
      state.layout = layout
      storage.set(TOGGLE_LAYOUT, layout)
    },
    [TOGGLE_WEAK]: (state, weak) => {
      state.weak = weak
      storage.set(TOGGLE_WEAK, weak)
    },
    [TOGGLE_COLLAPSED_MENU]: (state, collapsed) => {
      state.collapsedMenu = collapsed
      storage.set(TOGGLE_COLLAPSED_MENU, collapsed)
    },
    [TOGGLE_FIXED_MENU]: (state, mode) => {
      state.fixedMenu = mode
      storage.set(TOGGLE_FIXED_MENU, mode)
    },
    [TOGGLE_MENU_THEME]: (state, theme) => {
      state.menuTheme = theme
      storage.set(TOGGLE_MENU_THEME, theme)
    },
    [TOGGLE_FIXED_HEADER]: (state, mode) => {
      state.fixedHeader = mode
      storage.set(TOGGLE_FIXED_HEADER, mode)
    },
    [TOGGLE_FIXED_HEADER_HIDDEN]: (state, mode) => {
      state.autoHideHeader = mode
      storage.set(TOGGLE_FIXED_HEADER_HIDDEN, mode)
    },
    [TOGGLE_CONTENT_WIDTH]: (state, type) => {
      state.contentWidth = type
      storage.set(TOGGLE_CONTENT_WIDTH, type)
    },
    [TOGGLE_MULTI_TAB]: (state, bool) => {
      state.multiTab = bool
      storage.set(TOGGLE_MULTI_TAB, bool)
    },
    [TOGGLE_MULTI_TAB_VISITED]: (state, visited) => {
      state.multiTabVisited = visited
    },
    [TOGGLE_MULTI_TAB_ACTIVE]: (state, active) => {
      state.multiTabActive = active
    },
    [TOGGLE_LANG]: (state, lang, antd = {}) => {
      state.lang = lang
      state._antLocale = antd
      storage.set(TOGGLE_LANG, lang)
    },
    [TOGGLE_MOCK]: (state, mock) => {
      state.mock = mock
      storage.set(TOGGLE_MOCK, mock)
    },
    [TOGGLE_MOBILE_TYPE]: (state, isMobile) => {
      state.isMobile = isMobile
    }
  },
  actions: {
    setLang ({ commit }, lang) {
      return new Promise((resolve, reject) => {
        commit(TOGGLE_LANG, lang)
        loadLanguageAsync(lang).then(() => {
          resolve()
        }).catch((e) => {
          reject(e)
        })
      })
    }
  }
}

export default app
