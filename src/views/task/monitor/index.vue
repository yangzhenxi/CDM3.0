<template>
  <page-header-wrapper :title="false">
    <a-tabs type="card" v-model="activeKey" @change="handleTabsChange">
      <a-tab-pane v-for="item in tabs" :key="item.key" :tab="item.title">
        <a-card :bordered="false">
          <search-form-builder :ref="`form-${item.key}`" :items="searchFormItems" @refresh="$refs[`table-${activeKey}`][0].refresh()" />
          <s-operator :config="operatorConfig"/>
          <s-table
            :ref="`table-${item.key}`"
            :columns="columns"
            :fetchData="fetchData"
            :rowSelection="{}"
            :rowClick="true"
            :emptyItemProps="empty"
          >
            <template slot="type" slot-scope="text">
              <div>
                <m-tag :color="toEnum(text, 'TASK_MONITOR_TYPE').color">{{ text | convert('TASK_MONITOR_TYPE') }}</m-tag>
              </div>
            </template>
            <template slot="percent" slot-scope="text, record">
              <a-progress
                :percent="text"
                size="small"
                :status="deepGet(toEnum(record.phase_status, 'TASK_MONITOR_WORKFLOW_PHASE_STATUS'), 'result.processState')"
              />
            </template>
            <template slot="state" slot-scope="text, record">
              <a-tooltip :title="deepGet(record, 'error')">
                <m-tag :color="toEnum(text, 'TASK_MONITOR_STATE').color">{{ text | convert('TASK_MONITOR_STATE') }}</m-tag>
              </a-tooltip>
            </template>
          </s-table>
        </a-card>
      </a-tab-pane>
    </a-tabs>
  </page-header-wrapper>
</template>

<script>
import { getTaskList } from '@/api/task/monitor'
import { SearchFormBuilder, SOperator, STable } from '@/components'
import { deepGet, enumToSelection, handleFetchStateErrorDone, isEmpty, queryBuild, throttle, toEnum, transformArray } from '@/utils/util'

export default {
  name: 'TaskMonitor',
  components: {
    SearchFormBuilder,
    SOperator,
    STable
  },
  data () {
    return {
      searchFormItems: [
        {
          label: '类型',
          prop: 'type',
          component: {
            name: 'm-select',
            props: {
              options: enumToSelection('TASK_MONITOR_TYPE')
            }
          }
        },
        {
          label: '状态',
          prop: 'state',
          component: {
            name: 'm-select',
            props: {
              options: enumToSelection('TASK_MONITOR_STATE')
            }
          }
        }
      ],
      operatorConfig: {
        fields: [
          {
            key: 'layouts.table.operator.batDelete',
            props: {
              type: 'danger',
              icon: 'close'
            },
            onClick: throttle(() => {
              this.handleBatchDelete()
            })
          }
        ]
      },
      columns: [
        {
          title: 'ID',
          dataIndex: 'id',
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
                this.$router.push({ path: `/task/monitor/${record?.id}`, query: { name: record?.name } })
              }
            }
          })
        },
        {
          title: '类型',
          dataIndex: 'type',
          width: 100,
          scopedSlots: { customRender: 'type' }
        },
        {
          title: '所属应用',
          dataIndex: 'app',
          width: 100,
          ellipsis: true
        },
        {
          title: '进度',
          dataIndex: 'percent',
          width: 220,
          scopedSlots: { customRender: 'percent' }
        },
        {
          title: '开始时间',
          dataIndex: 'workflow.createdAt',
          width: 175,
          scopedSlots: { customRender: 'unixToDate' }
        },
        {
          title: '结束时间',
          dataIndex: 'workflow.completedAt',
          width: 175,
          scopedSlots: { customRender: 'unixToDate' }
        },
        {
          title: '状态',
          dataIndex: 'state',
          width: 80,
          fixed: 'right',
          scopedSlots: { customRender: 'state' }
        }
      ],
      fetchData: async params => {
        this.empty = {
          state: 'empty',
          data: null
        }
        let res = {}
        try {
          res = await getTaskList(Object.assign(params, { module: this.activeKey }, queryBuild(this.$refs[`form-${this.activeKey}`][0].model)))
          res.data = res.data.map(u => {
            u.app = deepGet(u, 'belong', '').split(' ').shift()
            u.percent = +(deepGet(u, 'workflow.executed', 0) / deepGet(u, 'workflow.total', 1) * 100).toFixed(0)
            u.phase_status = +`${u?.workflow?.phase}${u?.workflow?.status}`
            if (u?.state === 1) {
              this.refresh = true
            }
            return u
          })
        } catch (error) {
          this.empty = handleFetchStateErrorDone(error)
        }
        this.handleRefresh()
        return isEmpty(this.empty?.data) ? res : {}
      },
      empty: {
        state: 'empty',
        data: null
      },
      deleteConfirm: null,
      tabs: enumToSelection('TASK_MONITOR_MODULE', u => ({
        key: u.key,
        title: u.title
      })),
      activeKey: '1',
      refresh: false,
      timer: null
    }
  },
  mounted () {
    this.handleTabsChange(this.activeKey)
  },
  activated () {
    this.handleRefresh()
  },
  deactivated () {
    this.clear()
  },
  methods: {
    handleTabsChange (activeKey) {
      this.$nextTick(() => {
        this.activeKey = activeKey
        transformArray(this.searchFormItems, { prop: 'type' }, { visible: this.activeKey !== '3' })
        if (this.$refs[`table-${this.activeKey}`][0]?.localDataSource?.length) {
          this.$refs[`table-${this.activeKey}`][0].refresh()
        }
      })
    },
    handleRefresh () {
      if (this.refresh) {
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.$refs[`table-${this.activeKey}`][0].refresh(false)
        }, 5000)
        this.$once('hook:beforeDestroy', () => {
          this.clear()
        })
      } else {
        this.clear()
      }
    },
    clear () {
      clearTimeout(this.timer)
    },
    deepGet,
    toEnum
  }
}
</script>
