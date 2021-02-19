<template>
  <div class="conf-wrapper">
    <a-spin :spinning="loading">
      <empty-provider :isEmpty="isEmpty" :itemProps="empty">
        <conf :columns="columns" :data="data"/>
      </empty-provider>
    </a-spin>
  </div>
</template>

<script>
import { pick } from 'lodash'
import { getAlert, updateAlert } from '@/api/system/alert'
import { EmptyProvider } from '@/components'
import { convert, deepGet, handleFetchStateErrorDone, throttle } from '@/utils/util'
import Conf from '../components/Conf'
import events from '../events'

export default {
  name: 'SystemAlertConf',
  components: {
    EmptyProvider,
    Conf
  },
  data () {
    return {
      columns: [
        {
          key: 'name',
          title: '规则名',
          props: {
            span: 4
          }
        },
        {
          key: 'panel',
          title: '告警',
          props: {
            span: 4,
            offset: 12
          },
          valueScopedSlots: { customRender: (text, item) => {
            const change = () => {
              this.handleRuleChange(item, 'panel')
            }
            return (
              <a-switch
                checked={ item.panel }
                loading={ item.panelLoading }
                checkedChildren="开"
                unCheckedChildren="关"
                { ...{ on: { change } } }
              />
            )
          } }
        },
        {
          key: 'mail',
          title: '邮件告警',
          props: {
            span: 4
          },
          valueScopedSlots: { customRender: (text, item) => {
            const change = () => {
              this.handleRuleChange(item, 'mail')
            }
            return (
              <a-switch
                checked={ item.mail }
                loading={ item.emailLoading }
                checkedChildren="开"
                unCheckedChildren="关"
                { ...{ on: { change } } }
              />
            )
          } }
        }
      ],
      data: [],
      isEmpty: true,
      empty: {
        state: 'empty',
        data: []
      },
      loading: false
    }
  },
  created () {
    this.loadData()
  },
  methods: {
    async loadData () {
      try {
        this.loading = true
        const res = deepGet(await getAlert(), 'data')
        const taskKeys = pick(res, this.$enum('SYSTEM_ALERT_TASK_RULE').map(u => u.key))
        const systemKeys = pick(res, this.$enum('SYSTEM_ALERT_SYSTEM_RULE').map(u => u.key))
        const task = Object.keys(taskKeys).map(u => ({
          key: u,
          name: convert(u, 'SYSTEM_ALERT_TASK_RULE'),
          panel: taskKeys[u].panel,
          mail: taskKeys[u].mail,
          panelLoading: false,
          mailLoading: false
        }))
        const system = Object.keys(systemKeys).map(u => ({
          key: u,
          name: convert(u, 'SYSTEM_ALERT_SYSTEM_RULE'),
          panel: systemKeys[u].panel,
          mail: systemKeys[u].mail,
          panelLoading: false,
          mailLoading: false
        }))
        const note = []
        const conf = {
          task,
          system,
          note
        }
        this.data = conf[events.selectedKeys[0]]
        this.isEmpty = false
        this.loading = false
      } catch (error) {
        this.empty = handleFetchStateErrorDone(error)
        this.loading = false
      }
    },
    handleRuleChange: throttle(async function (item, key) {
      switch (key) {
      case 'panel':
        try {
          item.panelLoading = true
          await updateAlert({
            spec: {
              ...deepGet(this.conf, 'spec'),
              [item.key]: {
                ...deepGet(this.conf, ['spec', item.key]),
                panel: !item.panel
              }
            }
          })
          item.panel = !item.panel
          if (item.panel) {
            this.$message.success(`${item.name}规则 告警规则启用成功！`)
          } else {
            this.$message.success(`${item.name}规则 告警规则禁用成功！`)
          }
          item.panelLoading = false
        } catch (error) {
          item.panelLoading = false
        }
        break
      case 'mail':
        try {
          item.mailLoading = true
          await updateAlert({
            spec: {
              ...deepGet(this.conf, 'spec'),
              [item.key]: {
                ...deepGet(this.conf, ['spec', item.key]),
                mail: !item.mail
              }
            }
          })
          item.mail = !item.mail
          if (item.mail) {
            this.$message.success(`${item.name}规则 告警规则启用成功！`)
          } else {
            this.$message.success(`${item.name}规则 告警规则禁用成功！`)
          }
          item.mailLoading = false
        } catch (error) {
          item.mailLoading = false
        }
        break
      }
    })
  }
}

</script>
