<template>
  <pro-layout
    :menus="menus"
    :collapsed="collapsed"
    :mediaQuery="query"
    :isMobile="isMobile"
    :handleMediaQuery="handleMediaQuery"
    :handleCollapse="handleCollapse"
    :i18nRender="i18nRender"
    v-bind="settings"
  >
    <template #menuHeaderRender>
      <div>
        <logo />
        <h1>{{ title }}</h1>
      </div>
    </template>
    <template #menuRender>
      <m-menu
        :menus="menus"
        :collapsed="collapsed"
        :theme="settings.theme"
        :i18nRender="i18nRender"
      />
    </template>
    <template #rightContentRender>
      <right-content :top-menu="settings.layout === 'topmenu'" :is-mobile="isMobile" :theme="settings.theme" />
    </template>
    <template #footerRender>
      <global-footer />
    </template>
    <multi-tab v-if="multiTab"></multi-tab>
    <router-view />
  </pro-layout>
</template>

<script>
import Logo from '@/components/framework/Logo'
import MultiTab from '@/components/framework/MultiTab'
import RightContent from '@/components/framework/GlobalHeader/RightContent'
import MMenu from '@/components/framework/Menu'
import GlobalFooter from '@/components/framework/GlobalFooter'
import { i18nRender } from '@/locales'
import { mapState } from 'vuex'
import { CONTENT_WIDTH_TYPE, TOGGLE_COLLAPSED_MENU, TOGGLE_MOBILE_TYPE } from '@/store/mutation-types'
import defaultSettings from '@/config/defaultSettings'

export default {
  name: 'BasicLayout',
  components: {
    Logo,
    MultiTab,
    RightContent,
    MMenu,
    GlobalFooter
  },
  data () {
    return {
      // base
      menus: [],
      // 侧栏收起状态
      collapsed: false,
      title: defaultSettings.logTitle,
      settings: {
        // 主色调
        primaryColor: defaultSettings.primaryColor,
        // 布局类型
        layout: defaultSettings.layout, // 'sidemenu', 'topmenu'
        colorWeak: defaultSettings.weak,
        // 主题 'dark' | 'light'
        theme: defaultSettings.menuTheme,
        fixSiderbar: defaultSettings.fixedMenu,
        fixedHeader: defaultSettings.fixedHeader,
        // CONTENT_WIDTH_TYPE
        contentWidth: defaultSettings.layout === 'sidemenu' ? CONTENT_WIDTH_TYPE.Fluid : defaultSettings.contentWidth,

        hideHintAlert: false,
        hideCopyButton: false
      },
      // 媒体查询
      query: {},

      // 是否手机模式
      isMobile: false
    }
  },
  computed: {
    ...mapState({
      // 动态主路由
      mainMenu: state => state.permission.addRouters,
      multiTab: (state) => state.app.multiTab
    })
  },
  created () {
    const routes = this.mainMenu.find(item => item.path === '/')
    this.menus = (routes && routes.children) || []
    // 处理侧栏收起状态
    this.$watch('collapsed', () => {
      this.$store.commit(TOGGLE_COLLAPSED_MENU, this.collapsed)
    })
    this.$watch('isMobile', () => {
      this.$store.commit(TOGGLE_MOBILE_TYPE, this.isMobile)
    })
  },
  mounted () {
    const userAgent = navigator.userAgent
    if (userAgent.indexOf('Edge') > -1) {
      this.$nextTick(() => {
        this.collapsed = !this.collapsed
        setTimeout(() => {
          this.collapsed = !this.collapsed
        }, 16)
      })
    }
  },
  methods: {
    i18nRender,
    handleMediaQuery (val) {
      this.query = val
      if (this.isMobile && !val['screen-xs']) {
        this.isMobile = false
        return
      }
      if (!this.isMobile && val['screen-xs']) {
        this.isMobile = true
        this.collapsed = false
        this.settings.contentWidth = CONTENT_WIDTH_TYPE.Fluid
        // this.settings.fixSiderbar = false
      }
    },
    handleCollapse (val) {
      this.collapsed = val
    }
  }
}
</script>

<style lang="less">
@import "./BasicLayout.less";
</style>
