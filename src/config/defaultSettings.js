/**
 * 项目默认配置项
 * theme theme ['dark', 'light'] 两种主题
 * primaryColor - 默认主题色, 如果修改颜色不生效，请清理 localStorage
 * layout - 整体布局方式 ['sidemenu', 'topmenu'] 两种布局
 * weak - 色盲模式
 * collapsedMenu - menu 默认展开
 * fixedMenu - 固定左侧菜单栏 ： boolean
 * menuTheme - menu ['dark', 'light'] 两种主题
 * fixedHeader - 固定 Header : boolean
 * autoHideHeader - 向下滚动时，隐藏 Header : boolean
 * multiTab: - tab 页
 * contentWidth - 内容区布局： 流式 |  固定
 *
 * lang: 语言 ['zh-CN', 'en-US']
 */

export default {
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
  menu: {
    locale: true
  },
  pwa: false,
  iconfontUrl: '',
  lang: 'zh-CN',
  mock: false,

  domTitle: 'CDM',
  logTitle: '灵备CDM系统',
  title: '豪联灵备CDM一体机',
  subTitle: '第二数据管理平台',
  company: 'Howlink',
  tel: '400-050-6320'
}
