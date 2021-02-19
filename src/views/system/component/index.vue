<template>
  <page-header-wrapper :title="false">
    <a-card :bordered="false">
      <s-table
        ref="table"
        :columns="columns"
        :fetchData="fetchData"
        :emptyItemProps="empty"
      >
        <template slot="type" slot-scope="text">
          <m-tag :color="toEnum(text, 'SYSTEM_COMPONENT_TYPE').color">{{ text | convert('SYSTEM_COMPONENT_TYPE') }}</m-tag>
        </template>
        <template slot="state" slot-scope="text, record">
          <a-tooltip :title="deepGet(record, 'error')">
            <m-tag :color="toEnum(text, 'SYSTEM_COMPONENT_STATE').color">{{ text | convert('SYSTEM_COMPONENT_STATE') }}</m-tag>
          </a-tooltip>
        </template>
      </s-table>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { mergeWith } from 'lodash'
import { getAllScheduler, getAllControllerManager } from '@/api/system/component'
import { STable } from '@/components'
import { deepGet, handleFetchStateErrorDone, isEmpty, toEnum } from '@/utils/util'

export default {
  name: 'SystemComponent',
  components: {
    STable
  },
  data () {
    return {
      columns: [
        {
          title: '名称',
          dataIndex: 'name',
          width: 100,
          ellipsis: true,
          scopedSlots: { customRender: 'ellipsis' }
        },
        {
          title: 'IP',
          dataIndex: 'ip',
          width: 152
        },
        {
          title: '类型',
          dataIndex: 'type',
          width: 80,
          scopedSlots: { customRender: 'type' }
        },
        {
          title: '版本',
          dataIndex: 'version',
          width: 80,
          ellipsis: true,
          scopedSlots: { customRender: 'ellipsis' }
        },
        {
          title: '创建时间',
          dataIndex: 'createdAt',
          width: 175,
          scopedSlots: { customRender: 'unixToDate' }
        },
        {
          title: '更新时间',
          dataIndex: 'updateTimestamp',
          width: 175,
          scopedSlots: { customRender: 'unixToDate' }
        },
        {
          title: '状态',
          dataIndex: 'state',
          width: 60,
          fixed: 'right',
          scopedSlots: { customRender: 'state' }
        }
      ],
      fetchData: async params => {
        this.empty = {
          state: 'empty',
          data: null
        }
        const [
          scheduler,
          controller
        ] = (await Promise.all([
          getAllScheduler(),
          getAllControllerManager()
        ].map(api => api.catch(error => {
          this.empty = mergeWith(this.empty, handleFetchStateErrorDone(error), (o, s) => {
            if (Array.isArray(o)) {
              return o.concat(s)
            }
            return s
          })
        })))).map(u => deepGet(u, 'data.items', []))
        if (isEmpty(this.empty?.data)) {
          return {
            data: [
              ...scheduler.map(u => Object.assign(u, {
                type: 'scheduler'
              })),
              ...controller.map(u => Object.assign(u, {
                type: 'controller'
              }))
            ]
          }
        } else {
          return {}
        }
      },
      empty: {
        state: 'empty',
        data: null
      }
    }
  },
  methods: {
    deepGet,
    toEnum
  }
}
</script>
