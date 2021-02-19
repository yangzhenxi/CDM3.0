<template>
  <a-spin :spinning="o.loading">
    <div class="flex-row" style="margin-bottom: 16px">
      <h3 style="margin-bottom: 0">
        <m-icon type="node" />
        {{ title }}
      </h3>
    </div>
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
      title: '应用信息',
      moduleData: [
        {
          key: 'dbName',
          title: 'dbName',
          modules: ['oracle', 'asm']
        },
        {
          key: 'spec.ip',
          title: 'IP',
          modules: ['mysql', 'pgsql']
        },
        {
          key: 'spec.spec',
          title: '数据库类型',
          modules: ['mysql']
        },
        {
          key: 'databaseName',
          title: '数据库',
          modules: ['mysql', 'pgsql'],
          valueScopedSlots: { customRender: 'more-popover' }
        },
        {
          key: 'dbSize',
          title: '数据库大小',
          filter: 'unitSize',
          modules: ['oracle', 'asm', 'mysql', 'pgsql']
        },
        {
          key: 'databasePath',
          title: '数据库路径',
          modules: ['mysql', 'pgsql']
        },
        {
          key: 'bct',
          title: 'BCT',
          modules: ['oracle', 'asm']
        },
        {
          key: 'archive',
          title: '归档',
          modules: ['oracle', 'asm']
        },
        {
          key: 'spec.uuid',
          title: '唯一标识',
          modules: ['hyperv']
        },
        {
          key: 'type',
          title: '类型',
          enum: 'CDM_APPLICATION_MODULE',
          modules: ['file']
        },
        {
          key: 'roots',
          title: '路径',
          modules: ['file']
        },
        {
          key: 'instances',
          title: '实例个数',
          modules: ['file']
        },
        {
          key: 'os',
          title: '操作系统',
          valueScopedSlots: { customRender: 'os' }
        },
        {
          key: 'version',
          title: '版本',
          modules: ['oracle', 'asm', 'mysql', 'pgsql']
        },
        {
          key: 'createdAt',
          title: '创建时间',
          filter: 'unixToDate'
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
    },
    deepGet,
    toEnum
  }
}
</script>
