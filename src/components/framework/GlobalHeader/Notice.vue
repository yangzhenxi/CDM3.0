<template>
  <a-popover
    v-model="visible"
    trigger="click"
    placement="bottomRight"
    overlayClassName="header-notice-wrapper"
    :getPopupContainer="() => $refs.noticeRef.parentElement"
    :autoAdjustOverflow="true"
    :arrowPointAtCenter="true"
    :overlayStyle="{ width: '350px', top: '50px' }"
  >
    <template #content>
      <a-spin :spinning="loading">
        <a-tabs v-model="activeKey" @change="handleTabChange">
          <a-tab-pane key="alertTask">
            <template #tab>
              <a-badge :count="alertTaskReadCount" :overflowCount="overflowCount">任务告警</a-badge>
            </template>
            <a-list>
              <a-list-item v-for="item in alertTaskList" :key="deepGet(item, 'metadata.uid')">
                <a-list-item-meta
                  :description="fromNow(convert(deepGet(item, 'metadata.createdAt'), 'unix'))">
                  <template #title>
                    <span class="event">{{ deepGet(item, 'event') }}</span>
                  </template>
                </a-list-item-meta>
                <template #extra>
                  <div :style="{ marginRight: '4px', borderBottom: '1px solid', borderBottomColor: toEnum(deepGet(item, 'spec.level'), 'LOG_ALERT_LEVEL').color }">
                    <a-badge :dot="convert(deepGet(item, 'status.read'), 'LOG_ALERT_PANEL_STATE') === '未读'">{{ deepGet(item, 'spec.level') | convert('LOG_ALERT_LEVEL') }}</a-badge>
                  </div>
                </template>
              </a-list-item>
            </a-list>
            <div style="text-align: center">
              <router-link :to="{ name: 'logAlert', params: { name: 'task' } }"><span>查看所有</span></router-link>
            </div>
          </a-tab-pane>
          <a-tab-pane key="alertSystem">
            <template #tab>
              <a-badge :count="alertSystemReadCount" :overflowCount="overflowCount">系统告警</a-badge>
            </template>
            <a-list>
              <a-list-item v-for="item in alertSystemList" :key="deepGet(item, 'metadata.uid')">
                <a-list-item-meta
                  :description="fromNow(convert(deepGet(item, 'metadata.createdAt'), 'unix'))">
                  <template #title>
                    <span class="user">{{ deepGet(item, 'spec.system.name') }}</span>
                    -
                    <span class="event">{{ deepGet(item, 'spec.system.server') }}</span>
                  </template>
                </a-list-item-meta>
                <template #extra>
                  <div :style="{ marginRight: '4px', borderBottom: '1px solid', borderBottomColor: toEnum(deepGet(item, 'spec.level'), 'LOG_ALERT_LEVEL').color }">
                    <a-badge :dot="convert(deepGet(item, 'status.read'), 'LOG_ALERT_PANEL_STATE') === '未读'">{{ deepGet(item, 'spec.level') | convert('LOG_ALERT_LEVEL') }}</a-badge>
                  </div>
                </template>
              </a-list-item>
            </a-list>
            <div style="text-align: center">
              <router-link :to="{ name: 'logAlert', params: { name: 'system' } }"><span>查看所有</span></router-link>
            </div>
          </a-tab-pane>
        </a-tabs>
      </a-spin>
    </template>
    <span @click="fetchNotice" class="header-notice" ref="noticeRef" style="padding: 0 18px">
      <a-badge :count="alertTaskReadCount + alertSystemReadCount" :overflowCount="overflowCount">
        <a-icon style="font-size: 16px; padding: 4px" type="bell" />
      </a-badge>
    </span>
  </a-popover>
</template>

<script>
import { deepGet, fromNow, convert, toEnum, debounce } from '@/utils/util'

export default {
  name: 'HeaderNotice',
  data () {
    return {
      activeKey: 'alertTask',
      alertTaskList: [],
      alertSystemList: [],
      alertTaskReadCount: 0,
      alertSystemReadCount: 0,
      overflowCount: 999,
      loading: false,
      visible: false
    }
  },
  watch: {
    '$store.state.logAlert': {
      handler (alert) {
        this._getAlertTaskList(alert.alertTaskList)
        this._getAlertSystemList(alert.alertSystemList)
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    fetchNotice () {
      let timer = null
      if (!this.visible) {
        this.visible = !this.visible
        timer = setTimeout(() => {
          this.handleTabChange(this.activeKey)
        }, 200)
      } else {
        this.visible = !this.visible
        clearTimeout(timer)
      }
    },
    async _getAlertTaskList (data) {
      this.loading = true
      this.alertTaskReadCount = data.length
      this.alertTaskList = data.slice(0, 5).map(u => {
        if (deepGet(u, 'spec.task.event.metadata.creator')) {
          const user = convert(deepGet(u, 'spec.task.event.metadata.creator'), 'SYSTEM_USER_ALIAS_LIST')
          const kind = convert(deepGet(u, 'spec.task.event.spec.kind'), 'LOG_EVENT_KIND')
          const ekind = convert(deepGet(u, 'spec.task.event.spec.target.kind'), 'LOG_EVENT_TARGET_KIND')
          const name = deepGet(u, 'spec.task.event.spec.target.name')
          u.event = `[${user}]:${kind}-[${ekind}:${name}]`
        }
        return u
      })
      this.loading = false
    },
    async _getAlertSystemList (data) {
      this.loading = true
      this.alertSystemReadCount = data.length
      this.alertSystemList = data.slice(0, 5)
      this.loading = false
    },
    handleTabChange: debounce(function (activeKey) {
      this.activeKey = activeKey
      switch (activeKey) {
      case 'alertTask':
        this._getAlertTaskList()
        break
      case 'alertSystem':
        this._getAlertSystemList()
        break
      }
    }),
    deepGet,
    fromNow,
    convert,
    toEnum
  }
}
</script>

<style lang="less" scoped>
  .header-notice-wrapper {
      top: 50px !important;
      .user {
        border-bottom: 1px solid #23c6c8;
      }
      .event {
        border-bottom: 1px solid #F8AC59;
      }
      .header-notice {
        display: inline-block;
        transition: all 0.3s;
        span {
          vertical-align: initial;
        }
      }
  }
</style>
