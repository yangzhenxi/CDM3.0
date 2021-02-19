<template>
  <a-spin :spinning="o.loading">
    <h3 style="margin-bottom: 16px">
      <m-icon type="node" />
      {{ title }}
    </h3>
    <empty-provider :isEmpty="o.isEmpty" :itemProps="o.empty" :minHeight="150">
      <detail :data="data" justify="end" :colon="false" />
    </empty-provider>
  </a-spin>
</template>

<script>
import { Detail, EmptyProvider, MIcon } from '@/components'
import { convert, columnsBuild, deepGet } from '@/utils/util'
import events from '../events'

export default {
  components: {
    Detail,
    EmptyProvider,
    MIcon
  },
  data () {
    return {
      title: '应用信息',
      moduleData: [
        {
          key: 'spec.datacenter',
          title: '数据中心 ',
          modules: ['vmware']
        },
        {
          key: 'spec.vcenter.ipAddr',
          title: 'IP',
          modules: ['vmware']
        },
        {
          key: 'spec.vcenter.username',
          title: '用户',
          modules: ['vmware']
        },
        {
          key: 'dataSource',
          title: '数据源',
          modules: ['mssql']
        },
        {
          key: 'version',
          title: '版本',
          modules: ['mssql']
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
      this.data = columnsBuild(this.moduleData, convert(this.o.record?.kind, 'CDM_APPLICATION_MODULE'))
      this.data = this.data.map(u => Object.assign(u, {
        value: deepGet(this.o.record, u.key)
      }))
    }
  }
}
</script>
