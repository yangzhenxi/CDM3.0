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
            <template slot="readState" slot-scope="text">
              <m-icon :type="`mail-${text ? 'read' : 'unread'}`" style="font-size: 24px;color: #fa8c16" />
            </template>
            <template slot="eventType" slot-scope="text">
              <span class="hover-default">{{ text | convert('LOG_ALERT_TYPE') }}</span>
            </template>
            <template slot="eventLevel" slot-scope="text">
              <m-tag :color="toEnum(text, 'LOG_ALERT_LEVEL').color">{{ text | convert('LOG_ALERT_LEVEL') }}</m-tag>
            </template>
            <template slot="mailSendState" slot-scope="text">
              <m-tag :color="toEnum(text, 'LOG_ALERT_MAIL_SEND_STATE').color">{{ text | convert('LOG_ALERT_MAIL_SEND_STATE') }}</m-tag>
            </template>
            <template slot="mailState" slot-scope="text">
              <m-tag :color="toEnum(text, 'LOG_ALERT_MAIL_STATE').color">{{ text | convert('LOG_ALERT_MAIL_STATE') }}</m-tag>
            </template>
            <template slot="state" slot-scope="text, record">
              <a-tooltip :title="deepGet(record, 'error')">
                <m-tag :color="toEnum(text, 'LOG_USER_STATE').color">{{ text | convert('LOG_USER_STATE') }}</m-tag>
              </a-tooltip>
            </template>
          </s-table>
        </a-card>
      </a-tab-pane>
    </a-tabs>
  </page-header-wrapper>
</template>

<script>
import { getAlertLogList, getAllAlertLog, updateAlertRead } from '@/api/log/alert'
import { MIcon, SearchFormBuilder, SOperator, STable } from '@/components'
import { deepGet, enumToSelection, handleFetchStateErrorDone, isEmpty, queryBuild, throttle, toEnum } from '@/utils/util'
import Info from './modules/Info'

export default {
  name: 'LogAlert',
  components: {
    MIcon,
    SearchFormBuilder,
    SOperator,
    STable
  },
  data () {
    return {
      searchFormItems: [
        {
          label: '级别',
          prop: 'eventLevel',
          component: {
            name: 'm-select',
            props: {
              options: enumToSelection('LOG_ALERT_LEVEL')
            }
          }
        },
        {
          label: '状态',
          prop: 'readState',
          component: {
            name: 'm-select',
            props: {
              options: enumToSelection('LOG_ALERT_READ_STATE')
            }
          }
        },
        {
          label: '邮件状态',
          prop: 'mailSendState',
          component: {
            name: 'm-select',
            props: {
              options: enumToSelection('LOG_ALERT_MAIL_SEND_STATE')
            }
          }
        },
        {
          label: '告警时间',
          prop: 'createdAt',
          component: {
            name: 'a-date-picker'
          }
        }
      ],
      operatorConfig: {
        fields: [
          {
            key: '标记已读',
            props: {
              type: 'primary',
              icon: 'eye'
            },
            onClick: throttle(() => {
              this.handleRead()
            })
          },
          {
            key: '全部标记已读',
            props: {
              type: 'primary',
              icon: 'eye'
            },
            onClick: throttle(() => {
              this.handleAllRead()
            })
          }
        ]
      },
      columns: [
        {
          dataIndex: 'readState',
          width: 50,
          scopedSlots: { customRender: 'readState' }
        },
        {
          title: '事件',
          dataIndex: 'eventType',
          width: 100,

          scopedSlots: { customRender: 'eventType' },
          customCell: (record, index) => ({
            style: {
              color: '#1890ff',
              cursor: 'pointer'
            },
            on: {
              click: async e => {
                e.stopPropagation()
                this.$dialog(Info, { record }, {
                  width: 400,
                  footer: false
                })
                if (!deepGet(record, 'readState')) {
                  try {
                    await updateAlertRead(record)
                  } catch (error) {}
                }
              }
            }
          })
        },
        {
          title: '级别',
          dataIndex: 'eventLevel',
          width: 80,
          scopedSlots: { customRender: 'eventLevel' }
        },
        {
          title: '详情',
          dataIndex: 'event',
          width: 150,
          ellipsis: true,
          scopedSlots: { customRender: 'ellipsis' }
        },
        {
          title: '邮件告警',
          dataIndex: 'mailSendState',
          width: 80,
          scopedSlots: { customRender: 'mailSendState' }
        },
        {
          title: '邮件状态',
          dataIndex: 'mailState',
          width: 80,
          scopedSlots: { customRender: 'mailState' }
        },
        {
          title: '告警时间',
          dataIndex: 'createdAt',
          width: 175,
          scopedSlots: { customRender: 'unixToDate' }
        }
      ],
      fetchData: async params => {
        this.empty = {
          state: 'empty',
          data: null
        }
        let res = {}
        try {
          res = await getAlertLogList(Object.assign(params, { type: this.activeKey }, queryBuild(this.$refs[`form-${this.activeKey}`][0].model)))
        } catch (error) {
          this.empty = handleFetchStateErrorDone(error)
        }
        return isEmpty(this.empty?.data) ? res : {}
      },
      empty: {
        state: 'empty',
        data: null
      },
      tabs: [
        {
          key: 'task',
          title: '任务告警'
        },
        {
          key: 'system',
          title: '系统告警'
        }
      ],
      activeKey: 'task'
    }
  },
  mounted () {
    this.handleTabsChange(this.activeKey)
  },
  methods: {
    handleTabsChange (activeKey) {
      this.$nextTick(() => {
        this.activeKey = activeKey
        if (this.$refs[`table-${this.activeKey}`][0]?.localDataSource?.length) {
          this.$refs[`table-${this.activeKey}`][0].refresh()
        }
      })
    },
    handleRead: throttle(function () {
      const { selectedRows } = this.$refs.table[0]?.localRowSelection
      const rows = selectedRows.filter(u => !deepGet(u, 'readState'))
      if (rows.length) {
        this.$confirm({
          title: '是否设置已读',
          content: `点击确认设置已读`,
          maskClosable: true,
          onOk: async () => {
            await updateAlertRead({ rows })
            this.$message.success('设置已读成功！')
            this.handleOk()
          }
        })
      } else {
        this.$message.info('请先选择需要设置已读的行！')
      }
    }),
    handleAllRead: throttle(async function () {
      const data = deepGet(await getAllAlertLog(), 'data.items', [])
      const rows = data.filter(u => !deepGet(u, 'readState'))
      if (rows.length) {
        this.$confirm({
          title: '是否设置已读',
          content: `点击确认设置已读`,
          maskClosable: true,
          onOk: async () => {
            await updateAlertRead({ rows })
            this.$message.success('设置已读成功！')
            this.handleOk()
          }
        })
      } else {
        this.$message.info('请先选择需要设置已读的行！')
      }
    }),
    deepGet,
    toEnum
  }
}
</script>
