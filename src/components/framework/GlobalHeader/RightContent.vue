<template>
  <div :class="wrpCls">
    <!-- <server-time /> -->
    <!-- <notice :class="prefixCls" /> -->
    <user-menu :class="prefixCls" />
    <select-lang v-if="isPreview" :class="prefixCls" />
    <setting v-if="isPreview" :class="prefixCls" />
  </div>
</template>

<script>
import SelectLang from '@/components/framework/SelectLang'
import ServerTime from './ServerTime'
import Notice from './Notice'
import UserMenu from './UserMenu'
import Setting from './Setting'

export default {
  name: 'RightContent',
  components: {
    ServerTime,
    Notice,
    UserMenu,
    Setting,
    SelectLang
  },
  props: {
    prefixCls: {
      type: String,
      default: 'ant-pro-global-header-index-action'
    },
    isMobile: {
      type: Boolean,
      default: () => false
    },
    topMenu: {
      type: Boolean,
      required: true
    },
    theme: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      isPreview: process.env.VUE_APP_PREVIEW === 'true'
    }
  },
  computed: {
    wrpCls () {
      return {
        'ant-pro-global-header-index-right': true,
        [`ant-pro-global-header-index-${(this.isMobile || !this.topMenu) ? 'light' : this.theme}`]: true
      }
    }
  }
}
</script>
