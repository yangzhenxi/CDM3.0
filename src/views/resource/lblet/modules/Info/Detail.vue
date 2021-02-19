<template>
  <a-spin :spinning="o.loading">
    <h2 style="margin-bottom: 16px">
      <m-icon :type="toEnum(deepGet(o,'record.os','-'), 'R_LBLET_OS').icon" style="font-size: 30px" />
      {{ deepGet(o,'record.name','-') }}
    </h2>
    <empty-provider :isEmpty="o.isEmpty" :itemProps="o.empty">
      <detail :data="data" justify="end" :colon="false">
        <template slot="os" slot-scope="text">
          <m-icon :type="toEnum(text, 'R_LBLET_OS').icon" style="font-size: 20px" />
        </template>
      </detail>
    </empty-provider>
  </a-spin>
</template>

<script>
import { Detail, EmptyProvider, MIcon } from '@/components'
import { deepGet, toEnum } from '@/utils/util'
import events from '../events'

export default {
  components: {
    Detail,
    EmptyProvider,
    MIcon
  },
  data () {
    return {
      title: '客户端信息',
      data: [
        {
          key: 'hostName',
          title: '主机信息'
        },
        {
          key: 'os',
          title: '操作系统',
          valueScopedSlots: { customRender: 'os' }
        },
        {
          key: 'ipAddr',
          title: 'IP'
        },
        {
          key: 'memory',
          title: '内存',
          filter: 'unitSize'
        },
        {
          key: 'version',
          title: '版本'
        },
        {
          key: 'label',
          title: '标签'
        },
        {
          key: 'user',
          title: '分配用户'
        },
        {
          key: 'createdAt',
          title: '创建时间',
          filter: 'unixToDate'
        },
        {
          key: 'remark',
          title: '备注'
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
    events.$off(`update-detail-${this.id}`)
    events.$on(`update-detail-${this.id}`, () => {
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
    toEnum,
    deepGet
  }
}

</script>
