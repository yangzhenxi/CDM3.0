<template>
  <div>
    <h3 style="margin-bottom: 16px">{{ title }}</h3>
    <s-table
      style="min-height: 400px;max-height:400px;"
      ref="table"
      :columns="columns"
      :fetchData="fetchData"
      :emptyItemProps="empty">
    </s-table>
  </div>
</template>

<script>
import { getSLAHistories } from '@/api/resource/sla'
import { STable } from '@/components'
import { handleFetchStateErrorDone, isEmpty } from '@/utils/util'

export default {
  components: {
    STable
  },
  data () {
    return {
      title: '历史记录',
      columns: [
        {
          title: '源池',
          dataIndex: 'sourcePoolName',
          width: 100,
          ellipsis: true
        },
        {
          title: '目标池',
          dataIndex: 'targetPoolName',
          width: 100,
          ellipsis: true
        },
        {
          title: '黄金副本',
          dataIndex: 'goldenCopyName',
          width: 100,
          ellipsis: true
        },
        {
          title: '开始时间',
          dataIndex: 'createdAt',
          width: 162,
          scopedSlots: { customRender: 'unixToDate' }
        },
        {
          title: '更新时间',
          dataIndex: 'updatedAt',
          width: 162,
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
          res = await getSLAHistories(params)
        } catch (error) {
          this.empty = handleFetchStateErrorDone(error)
        }
        return isEmpty(this.empty?.data) ? res : {}
      },
      empty: {
        state: 'empty',
        data: null
      }
    }
  }
}
</script>
