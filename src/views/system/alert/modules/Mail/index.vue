<template>
  <div class="mail-wrapper">
    <h3>
      {{ title }}
      <a-icon type="form" class="icon-primary" @click.native="handleUpdate" />
    </h3>
    <a-spin :spinning="loading">
      <empty-provider :isEmpty="isEmpty" :itemProps="empty">
        <detail :data="data">
          <template slot="code" slot-scope="text, r">
            <a-tooltip :title="deepGet(r, 'error')">
              <m-tag :color="toEnum(text, 'SYSTEM_ALERT_EMAIL_ENABLE').color">{{ text | convert('SYSTEM_ALERT_EMAIL_ENABLE') }}</m-tag>
            </a-tooltip>
            <a-tooltip title="异常信息">
              <m-tag color="red">异常</m-tag>
            </a-tooltip>
            <a-tooltip title="异常信息">
              <m-tag color="red">不可用</m-tag>
            </a-tooltip>
          </template>
          <template slot="state" slot-scope="text">
            <a-switch
              :checked="text === 'ready'"
              :loading="stateLoading"
              checkedChildren="启用"
              unCheckedChildren="禁用"
              @change="handleStateChange(text)"
            />
          </template>
        </detail>
      </empty-provider>
    </a-spin>
  </div>
</template>

<script>
import { getAlertSmtp, enableAlertSmtp, unableAlertSmtp } from '@/api/system/alert'
import { Detail, EmptyProvider, FormBuilder } from '@/components'
import { deepGet, handleFetchStateErrorDone, throttle, toEnum } from '@/utils/util'
import Update from './Update'

export default {
  name: 'SystemAlertEmail',
  components: {
    Detail,
    EmptyProvider,
    FormBuilder
  },
  data () {
    return {
      title: '配置信息',
      data: [
        {
          key: 'host',
          title: '域名'
        },
        {
          key: 'port',
          title: '端口'
        },
        {
          key: 'username',
          title: '用户名'
        },
        {
          key: 'password',
          title: '密码',
          filter: 'textTo',
          config: {
            type: 'password'
          }
        },
        {
          key: 'code',
          title: '状态',
          valueScopedSlots: { customRender: 'code' }
        },
        {
          key: 'state',
          title: '启用状态',
          valueScopedSlots: { customRender: 'state' }
        },
        {
          key: 'createdAt',
          title: '创建时间',
          filter: 'unixToDate'
        }
      ],
      record: {},
      isEmpty: true,
      empty: {
        state: 'empty',
        data: []
      },
      loading: false,
      stateLoading: false
    }
  },
  created () {
    this.loadData()
  },
  methods: {
    async loadData () {
      try {
        this.loading = true
        this.record = deepGet(await getAlertSmtp(), 'data')
        this.data = this.data.map(u => Object.assign(u, {
          value: deepGet(this.record, u.key)
        }))
        this.isEmpty = false
        this.loading = false
      } catch (error) {
        this.empty = handleFetchStateErrorDone(error)
        this.loading = false
      }
    },
    handleUpdate: throttle(function () {
      this.$dialog(Update, {
        record: this.record,
        on: {
          ok: () => {
            this.loadData()
          }
        }
      }, { title: '修改邮件配置' })
    }),
    handleStateChange: throttle(async function (value) {
      try {
        this.stateLoading = true
        if (value !== 'ready') {
          const data = deepGet(await enableAlertSmtp(), 'data')
          if (deepGet(data, 'state') === 'ready') {
            this.$message.success('启用成功！')
            this.loadData()
          } else {
            this.$message.error('启用失败, 邮件服务器不可用！')
          }
        } else {
          const data = deepGet(await unableAlertSmtp(), 'data')
          if (deepGet(data, 'state') === 'notReady') {
            this.$message.success('禁用成功！')
            this.loadData()
          } else {
            this.$message.error('禁用失败, 邮件服务器不可用！')
          }
        }
        this.stateLoading = false
      } catch (error) {
        this.stateLoading = false
      }
    }),
    deepGet,
    toEnum
  }
}
</script>
