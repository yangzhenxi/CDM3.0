<template>
  <a-dropdown v-if="this.user" placement="bottomRight">
    <span class="ant-pro-account-avatar">
      <span>{{ deepGet(this.user, 'nickname') }}</span>
    </span>
    <template #overlay>
      <a-menu class="ant-pro-drop-down menu" :selected-keys="[]">
        <a-menu-item key="center">
          <router-link :to="{ name: 'UserCenter' }">
            <a-icon type="user"/>
            <span>个人中心</span>
          </router-link>
        </a-menu-item>
        <a-menu-divider />
        <a-menu-item key="logout">
          <a href="javascript:;" @click="handleLogout">
            <a-icon type="logout"/>
            <span>退出登录</span>
          </a>
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
  <span v-else>
    <a-spin size="small" :style="{ marginLeft: 8, marginRight: 8 }" />
  </span>
</template>

<script>
import { Modal } from 'ant-design-vue'
import { mapGetters } from 'vuex'
import { deepGet } from '@/utils/util'

export default {
  name: 'UserMenu',
  computed: {
    ...mapGetters(['user'])
  },
  methods: {
    handleLogout (e) {
      Modal.confirm({
        title: this.$t('layouts.userMenu.logout.modal.title'),
        content: this.$t('layouts.userMenu.logout.modal.content'),
        onOk: () => {
          return this.$store.dispatch('Logout').then(() => {
            setTimeout(() => {
              window.location.reload()
            }, 16)
          })
        },
        onCancel () {}
      })
    },
    deepGet
  }
}
</script>

<style lang="less" scoped>
  .ant-pro-drop-down {
    /deep/ .action {
      margin-right: 8px;
    }
    /deep/ .ant-dropdown-menu-item {
      min-width: 160px;
    }
  }
</style>
