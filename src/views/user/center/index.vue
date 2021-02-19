<template>
  <page-header-wrapper :title="false">
    <a-card :bordered="false" :bodyStyle="{ padding: '16px 0', height: '100%' }" :style="{ height: '100%' }">
      <div :class="['main', isMobile ? 'mobile' : '']">
        <div class="left">
          <a-menu
            :mode="isMobile ? 'horizontal' : 'inline'"
            :style="{ border: '0', width: isMobile ? '560px' : 'auto'}"
            :selectedKeys="selectedKeys"
            type="inner"
            @click="handleClick"
          >
            <a-menu-item v-for="menu in menus" :key="menu.key" :title="menu.title ">
              {{ menu.title }}
            </a-menu-item>
          </a-menu>
        </div>
        <div class="right">
          <component :is="selectedKeys[0]"></component>
        </div>
      </div>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { deviceMixin } from '@/store/device-mixin'
import { throttle } from '@/utils/util'
import Info from './Info/index'
import Security from './Security'

export default {
  name: 'UserCenter',
  components: {
    Info,
    Security
  },
  mixins: [deviceMixin],
  data () {
    return {
      menus: [
        { key: 'info', title: '基本设置' },
        { key: 'security', title: '安全设置' }
      ],
      selectedKeys: ['info']
    }
  },
  methods: {
    handleClick: throttle(function ({ key }) {
      this.selectedKeys = [ key ]
    })
  }
}
</script>

<style lang="less" scoped>
  .main {
    width: 100%;
    display: flex;
    height: 100%;
    overflow: auto;
    &.mobile {
      display: block;
      .left {
        border-right: unset;
        border-bottom: 1px solid @gray-4;
        width: 100%;
        height: 50px;
        overflow-x: auto;
        overflow-y: scroll;
      }
      .right {
        padding: 20px 40px;
      }
    }
    .left {
      border-right: 1px solid @gray-4;
      width: 224px;
    }
    .right {
      flex: 1 1;
      padding: 16px 40px;
    }
  }
</style>
