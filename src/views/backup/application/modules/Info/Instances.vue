<template>
  <div>
    <div class="flex-row" style="margin-bottom: 16px">
      <h3 style="margin-bottom: 0">
        <m-icon type="node" />
        {{ title }}
      </h3>
      <div class="form-operator">
        <a-input-search
          v-model="queryParams.name"
          :placeholder="$t('layouts.table.search.form.input.placeholder')"
          enter-button
          @search="$refs.table.refresh()"
        />
      </div>
    </div>
    <a-spin :spinning="o.loading">
      <v-table
        ref="table"
        :columns="columns"
        :fetchData="fetchData"
        :autoLoad="false"
        :emptyItemProps="empty"
      >
        <template slot="state" slot-scope="text, record">
          <a-tooltip>
            <template slot="title" v-if="record.message">
              <div v-for="item in uniq(record.message.split('&&'))" :key="item">
                {{ item }}
              </div>
            </template>
            <m-tag :color="toEnum(text, 'CDM_INSTANCE_STATE').color">
              {{ text | convert('CDM_INSTANCE_STATE') }}
              <a-icon v-if="record.message" type="question-circle" />
            </m-tag>
          </a-tooltip>
        </template>
        <template slot="action" slot-scope="text, record">
          <a-button type="primary" size="small" @click.stop="handleBackup(record)">备份</a-button>
        </template>
      </v-table>
    </a-spin>
  </div>
</template>

<script>
import { mergeWith } from 'lodash'
import { getAllGoldenCopy } from '@/api/cdm/goldenCopy'
import { getAllVirtualCopy } from '@/api/cdm/virtualCopy'
import { VTable, MIcon } from '@/components'
import { convert, columnsBuild, deepGet, handleFetchStateErrorDone, throttle, toEnum, uniq } from '@/utils/util'
import Backup from '../Backup'
import events from '../events'

export default {
  components: {
    VTable,
    MIcon
  },
  data () {
    return {
      title: '应用实例',
      queryParams: {
        name
      },
      moduleColumns: [
        {
          title: '名称',
          dataIndex: 'name',
          width: 100,
          ellipsis: true,
          scopedSlots: { customRender: 'name' },
          customCell: (record, index) => ({
            style: {
              color: '#1890ff',
              cursor: 'pointer'
            },
            on: {
              click: e => {
                e.stopPropagation()
                this.$router.push({ path: `/backup/application/${this.id}/instances/${record?.id}`, query: { applicationName: this.o.record?.name, name: record?.name } })
              }
            }
          })
        },
        {
          title: '唯一标识',
          dataIndex: 'spec.ref',
          width: 80,
          ellipsis: true,
          modules: ['vmware']
        },
        {
          title: 'IP',
          dataIndex: 'spec.ips',
          width: 152,
          modules: ['vmware'],
          scopedSlots: { customRender: 'more-popover' }
        },
        {
          title: '数据库',
          dataIndex: 'spec.backupDatabase',
          width: 100,
          ellipsis: true,
          modules: ['mssql']
        },
        {
          title: 'IP',
          dataIndex: 'spec.ip',
          width: 152,
          modules: ['mssql']
        },
        {
          title: '黄金副本数量',
          dataIndex: 'goldenCopyNum',
          width: 100
        },
        {
          title: '虚拟副本数量',
          dataIndex: 'virtualCopyNum',
          width: 100
        },
        {
          title: '状态',
          dataIndex: 'state',
          width: 90,
          scopedSlots: { customRender: 'state' }
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: 120,
          fixed: 'right',
          scopedSlots: { customRender: 'action' }
        }
      ],
      columns: [],
      fetchData: async () => {
        this.empty = {
          state: 'empty',
          data: null
        }
        this.columns = columnsBuild(this.moduleColumns, convert(this.o.record?.kind, 'CDM_APPLICATION_MODULE'))
        const data = await Promise.all(deepGet(this.o.record, 'instances', []).map(async u => {
          const [
            goldenCopyNum,
            virtualCopyNum
          ] = (await Promise.all([
            getAllGoldenCopy({ instanceID: +u.id }),
            getAllVirtualCopy({ instanceID: +u.id })
          ].map(api => api.catch(error => {
            this.empty = mergeWith(this.empty, handleFetchStateErrorDone(error), (o, s) => {
              if (Array.isArray(o)) {
                return o.concat(s)
              }
              return s
            })
          })))).map(u => deepGet(u, 'quantity', 0))
          return {
            ...u,
            spec: JSON.parse(deepGet(u, 'spec', '{}')),
            goldenCopyNum,
            virtualCopyNum
          }
        }))
        return {
          data,
          queryParams: this.queryParams
        }
      },
      empty: {
        state: 'empty',
        data: []
      },
      id: null,
      o: {
        loading: true
      }
    }
  },
  created () {
    this.id = this.$route.params.id
    this.o = events.data.find(u => u.id === this.id) || {}
    events.$off(`update-instance-${this.id}`)
    events.$on(`update-instance-${this.id}`, () => {
      this.o = events.data.find(u => u.id === this.id) || {}
      this.loadData()
    })
  },
  methods: {
    loadData () {
      this.$refs.table.refresh()
    },
    handleBackup: throttle(function (record) {
      this.$dialog(Backup, {
        record: {
          ...record,
          type: 'instance'
        },
        on: {
          ok: () => {
            events.$emit(`refresh-${this.id}`)
          }
        }
      }, { title: '备份' })
    }),
    toEnum,
    uniq
  }
}

</script>
