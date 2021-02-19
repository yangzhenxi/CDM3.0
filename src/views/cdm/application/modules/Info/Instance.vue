<template>
  <a-spin :spinning="o.loading">
    <empty-provider :isEmpty="o.isEmpty" :itemProps="o.empty" :min-height="190">
      <div v-if="instances.length === 1">
        <a-spin :spinning="o.loading">
          <empty-provider :isEmpty="o.isEmpty" :itemProps="o.empty">
            <detail :data="data" :colSpan="3" justify="end" :colon="false" />
          </empty-provider>
        </a-spin>
      </div>
      <div v-else-if="instances.length > 1">
        <s-table
          ref="table"
          :columns="columns"
          :fetchData="fetchData"
          :autoLoad="false"
          :emptyItemProps="empty"
        >
          <template slot="state" slot-scope="text">
            <m-tag :color="toEnum(text, 'CDM_INSTANCE_STATE').color">{{ text | convert('CDM_INSTANCE_STATE') }}</m-tag>
          </template>
          <template slot="expandedRowRender" slot-scope="text">
            <detail :data="text.expand" :colSpan="3" justify="end" :colon="false" />
          </template>
          <template slot="action" slot-scope="text, record">
            <div class="table-inline-operator">
              <a-button type="primary" size="small" @click.stop="handleBackup(record)">备份</a-button>
            </div>
          </template>
        </s-table>
      </div>
    </empty-provider>
  </a-spin>
</template>

<script>
import { mergeWith } from 'lodash'
import { getLbletUser } from '@/api/resource/lblet'
import { backupInstance } from '@/api/cdm/instance'
import { Detail, EmptyProvider, STable } from '@/components'
import { convert, columnsBuild, deepGet, handleFetchStateErrorDone, toEnum, throttle } from '@/utils/util'
import Backup from '../Backup'
import events from '../events'

export default {
  components: {
    Detail,
    EmptyProvider,
    STable
  },
  data () {
    return {
      moduleData: [
        {
          key: 'name',
          title: '名称',
          modules: ['oracle', 'mysql', 'mssql', 'pgsql', 'file', 'vmware', 'hyperv']
        },
        {
          key: 'protocol',
          title: '协议类型',
          enum: 'CDM_APPLICATION_PROTOCOL',
          modules: ['oracle', 'mysql', 'mssql', 'pgsql', 'file', 'vmware', 'hyperv']
        },
        {
          key: 'user',
          title: '用户',
          modules: ['oracle', 'mysql', 'mssql', 'pgsql', 'file', 'vmware', 'hyperv']
        },
        {
          key: 'lblet.name',
          title: '客户端',
          modules: ['oracle', 'mysql', 'mssql', 'pgsql', 'file', 'vmware', 'hyperv']
        },
        {
          key: 'mountPath',
          title: '磁盘路径',
          modules: ['oracle', 'mysql', 'mssql', 'pgsql', 'file', 'vmware', 'hyperv']
        },
        {
          key: 'home',
          title: 'Home',
          modules: ['oracle']
        },
        {
          key: 'lblet.ipAddr',
          title: 'IP',
          modules: ['oracle', 'mysql', 'mssql', 'pgsql', 'file', 'vmware', 'hyperv']
        },
        {
          key: 'lblet.iqn',
          title: 'IQN',
          modules: ['oracle', 'mysql', 'mssql', 'pgsql', 'file', 'vmware', 'hyperv']
        },
        {
          key: 'address',
          title: '监听地址',
          modules: ['oracle']
        },
        {
          key: 'state',
          title: '运行状态',
          enum: 'CDM_INSTANCE_STATE',
          modules: ['oracle', 'mysql', 'mssql', 'pgsql', 'file', 'vmware', 'hyperv']
        },
        {
          key: 'createdAt',
          title: '创建时间',
          filter: 'unixToDate',
          modules: ['oracle', 'mysql', 'mssql', 'pgsql', 'file', 'vmware', 'hyperv']
        }
      ],
      data: [],
      columns: [
        {
          title: '名称',
          dataIndex: 'name',
          width: 100,
          ellipsis: true
        },
        {
          title: '客户端',
          dataIndex: 'lblet.name',
          width: 100,
          ellipsis: true,
          scopedSlots: { customRender: 'lbletName' }
        },
        {
          title: 'IP',
          dataIndex: 'lblet.ipAddr',
          width: 152
        },
        {
          title: '创建时间',
          dataIndex: 'createdAt',
          width: 181,
          scopedSlots: { customRender: 'unixToDate' }
        },
        {
          title: '状态',
          dataIndex: 'state',
          width: 80,
          scopedSlots: { customRender: 'state' }
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: 80,
          fixed: 'right',
          scopedSlots: { customRender: 'action' }
        }
      ],
      fetchData: async params => {
        this.empty = {
          state: 'empty',
          data: null
        }
        const res = {}
        const instances = deepGet(this.o.record, 'instances', [])
        const users = (await Promise.all(
          instances.map(u => getLbletUser({ lbletId: u?.lbletId }))
            .map(api => api.catch(error => {
              console.log(error)
              this.empty = mergeWith(this.empty, handleFetchStateErrorDone(error), (o, s) => {
                if (Array.isArray(o)) {
                  return o.concat(s)
                }
                return s
              })
            })))).map(u => deepGet(u, 'data', []))
        res.data = instances.map((u, index) => {
          u.username = users[index].map(u => u?.username)
          u.mountPath = deepGet(u, 'pvClaim', []).map(o => o?.mountPath)
          u.protocol = deepGet(u, ['pvClaim', 0, 'protocol'])
          return {
            ...u,
            expand: [
              {
                key: 'name',
                title: '磁盘名称'
              },
              {
                key: 'protocol',
                title: '协议类型',
                enum: 'CDM_APPLICATION_PROTOCOL'
              },
              {
                key: 'username',
                title: '用户',
                valueScopedSlots: { customRender: 'more-popover' }
              },
              {
                key: 'lblet.name',
                title: '客户端'
              },
              {
                key: 'mountPath',
                title: '磁盘路径',
                valueScopedSlots: { customRender: 'more-popover' }
              },
              {
                key: 'home',
                title: 'Home'
              },
              {
                key: 'lblet.ipAddr',
                title: 'IP'
              },
              {
                key: 'lblet.iqn',
                title: 'IQN'
              },
              {
                key: 'address',
                title: '监听地址'
              },
              {
                title: '运行状态',
                key: 'state',
                enum: 'CDM_INSTANCE_STATE'
              },
              {
                title: '创建时间',
                key: 'createdAt',
                filter: 'unixToDate'
              }
            ].map(o => Object.assign(o, {
              value: convert(deepGet(u, o.key), o.filter)
            }))
          }
        })
        return res
      },
      empty: {
        state: 'empty',
        data: null
      },
      instances: [],
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
    events.$off(`refresh-Instance-${this.id}`)
    events.$on(`refresh-Instance-${this.id}`, () => {
      this.o = { ...this.o, ...events.data.find(u => u.id === this.id) }
      this.loadData()
      this.o.isEmpty = false
    })
  },
  methods: {
    async loadData () {
      this.instances = deepGet(this.o.record, 'instances', [])
      if (this.instances.length === 1) {
        let users = []
        try {
          users = deepGet(await getLbletUser({ lbletID: +deepGet(this.instances[0], 'lblet.id') }), 'data', [])
        } catch (error) {
        }
        this.data = columnsBuild(this.moduleData, convert(this.o.record?.kind, 'CDM_APPLICATION_MODULE'))
        this.instances[0].user = users.map(u => u.username)
        this.instances[0].protocol = deepGet(this.instances, '0.pvClaim.0.protocol', [])
        this.instances[0].mountPath = deepGet(this.instances, '0.pvClaim', []).map(o => o.mountPath)
        this.data = this.data.map(u => Object.assign(u, {
          value: deepGet(this.instances[0], u.key)
        }))
      } else if (this.instances.length > 1) {
        this.$nextTick(() => {
          this.$refs.table.refresh()
        })
      }
    },
    handleBackup: throttle(function (record) {
      if ([1, 4].includes(record?.kind)) {
        this.$dialog(Backup, {
          record,
          on: {
            ok: () => {
              events.$emit(`refresh-${this.id}`)
            }
          }
        }, { title: '备份' })
      } else {
        this.$confirm({
          title: `确定要备份`,
          content: '点击确定即可备份',
          onOk: async () => {
            try {
              await backupInstance({ id: record.id, type: 1 })
              this.$message.success('提交备份成功！')
              events.$emit(`refresh-${this.id}`)
            } catch (error) {}
          }
        })
      }
    }),
    deepGet,
    toEnum
  }
}
</script>
