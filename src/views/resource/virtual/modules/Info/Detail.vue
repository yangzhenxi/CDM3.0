<template>
  <a-spin :spinning="o.loading">
    <h2 style="margin-bottom: 16px">
      <m-icon :type="toEnum(deepGet(o,'record.kind'), 'R_VIRTUAL_MODULE').icon" style="font-size: 30px" />
      {{ deepGet(o,'record.name','-') }}
    </h2>
    <empty-provider :isEmpty="o.isEmpty" :itemProps="o.empty">
      <detail :data="data" justify="end" :colon="false">
        <template slot="kind" slot-scope="text">
          <m-icon :type="toEnum(text, 'R_VIRTUAL_MODULE').icon" style="font-size: 20px" />
        </template>
      </detail>
    </empty-provider>
  </a-spin>
</template>

<script>
import { Detail, EmptyProvider, MIcon } from '@/components'
import { convert, columnsBuild, deepGet, toEnum } from '@/utils/util'
import events from '../events'

export default {
  components: {
    Detail,
    EmptyProvider,
    MIcon
  },
  data () {
    return {
      title: '存储池信息',
      moduleData: [
        {
          key: 'lblet',
          title: '客户端',
          modules: ['vmware', 'hyperv']
        },
        {
          key: 'ipAddr',
          title: 'IP',
          modules: ['vmware', 'hyperv']
        },
        {
          key: 'kind',
          title: '类型',
          modules: ['vmware', 'hyperv'],
          valueScopedSlots: { customRender: 'kind' }
        },
        {
          key: 'hostSize',
          title: '主机数量',
          modules: ['vmware']
        },
        {
          key: 'vmSize',
          title: '虚拟机数量',
          modules: ['vmware', 'hyperv']
        },
        {
          key: 'vCenter.username',
          title: '用户名',
          modules: ['vmware']
        },
        {
          key: 'version',
          title: '版本',
          modules: ['vmware']
        },
        {
          key: 'user',
          title: '分配用户',
          modules: ['vmware', 'hyperv']
        },
        {
          key: 'createdAt',
          title: '创建时间',
          filter: 'unixToDate',
          modules: ['vmware', 'hyperv']
        },
        {
          key: 'remark',
          title: '备注',
          modules: ['vmware', 'hyperv']
        }
      ],
      data: [],
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
      this.data = columnsBuild(this.moduleData, convert(this.o?.record?.kind, 'R_VIRTUAL_MODULE'))
      this.data = this.data.map(u => Object.assign(u, {
        value: deepGet(this.o.record, u.key)
      }))
    },
    toEnum,
    deepGet
  }
}

</script>
