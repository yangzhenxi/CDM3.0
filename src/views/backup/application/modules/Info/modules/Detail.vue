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
import events from './events'

export default {
  components: {
    Detail,
    EmptyProvider,
    MIcon
  },
  data () {
    return {
      title: '实例',
      moduleData: [
        {
          key: 'databaseName',
          title: '数据库名称',
          modules: ['mssql']
        },
        {
          key: 'spec.ip',
          title: 'IP',
          modules: ['mssql', 'mysql']
        },
        {
          key: 'dataSource',
          title: '数据源',
          modules: ['mssql']
        },
        {
          key: 'spec.port',
          title: '端口',
          modules: ['mssql']
        },
        {
          key: 'ldfCapacity',
          title: 'ldf容量',
          filter: 'unitSize',
          modules: ['mssql']
        },
        {
          key: 'mdfCapacity',
          title: 'mdf容量',
          filter: 'unitSize',
          modules: ['mssql']
        },
        {
          key: 'spec.spec',
          title: '数据库类型',
          modules: ['mysql']
        },
        {
          key: 'databaseName',
          title: '数据库',
          modules: ['mysql'],
          valueScopedSlots: { customRender: 'more-popover' }
        },
        {
          key: 'dbSize',
          title: '数据库大小',
          filter: 'unitSize',
          modules: ['mysql']
        },
        {
          key: 'databasePath',
          title: '数据库路径',
          modules: ['mysql']
        },
        {
          key: 'version',
          title: '版本',
          modules: ['mysql']
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
      this.data = columnsBuild(this.moduleData, convert(this.o.app?.kind, 'CDM_APPLICATION_MODULE'))
      this.data = this.data.map(u => Object.assign(u, {
        value: deepGet(this.o.instance, u.key)
      }))
    }
  }
}
</script>
