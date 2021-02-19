const getters = {
  theme: state => state.app.theme,
  color: state => state.app.color,
  menuTheme: state => state.app.menuTheme,
  multiTab: state => state.app.multiTab,
  token: state => state.user.token,
  isMobile: state => state.app.isMobile,
  lang: state => state.app.lang,
  mock: state => state.app.mock,

  addRouters: state => state.permission.addRouters,
  role: state => state.user.role,
  user: state => state.user.user
}

export default getters
