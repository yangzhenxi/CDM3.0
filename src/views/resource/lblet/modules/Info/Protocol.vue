<template>
  <a-spin :spinning="o.loading">
    <div class="flex-row" style="margin-bottom: 16px">
      <h3 style="margin-bottom: 0">
        <a-icon type="bulb" />
        {{ title }}
      </h3>
      <div class="form-operator">
        <a-button type="primary" size="small" @click="handleConfig">配置</a-button>
      </div>
    </div>
    <empty-provider :isEmpty="o.isEmpty" :itemProps="o.empty">
      <detail :data="data" justify="end" :colon="false" />
    </empty-provider>
  </a-spin>
</template>

<script>
import { Detail, EmptyProvider } from '@/components'
import { deepGet, throttle } from '@/utils/util'
import Protocol from '../Protocol'
import events from '../events'

export default {
  components: {
    Detail,
    EmptyProvider
  },
  data () {
    return {
      title: '协议配置',
      data: [
        {
          key: 'iqn',
          title: 'IQN'
        }
      ],
      id: null,
      o: {
        loading: false,
        isEmpty: false,
        empty: {
          state: 'empty',
          data: null
        }
      }
    }
  },
  created () {
    this.id = this.$route.params.id
    events.$off(`update-protocol-${this.id}`)
    events.$on(`update-protocol-${this.id}`, () => {
      this.o = { ...this.o, ...events.data.find(u => u.id === this.id) }
      this.loadData()
    })
  },
  methods: {
    loadData () {
      this.data = this.data.map(u => Object.assign(u, {
        value: deepGet(this.o.record, u.key)
      }))
    },
    handleConfig: throttle(function () {
      this.$dialog(Protocol, {
        record: this.o.record,
        on: {
          ok: () => {
            events.$emit('refresh')
            events.$emit(`refresh-${this.id}`)
          }
        }
      }, { title: '配置协议' })
    })
  }
}

</script>
