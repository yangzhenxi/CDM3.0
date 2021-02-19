<template>
  <div>
    <h3 style="margin-bottom: 16px">{{ title }}</h3>
    <s-table
      ref="table"
      :columns="columns"
      :fetchData="fetchData"
      :emptyItemProps="empty"
    />
  </div>
</template>

<script>
import { getRecoveryStrategyHistories } from '@/api/cdm/workflow'
import { STable } from '@/components'
import { handleFetchStateErrorDone, isEmpty } from '@/utils/util'
import events from '../events'

export default {
  components: {
    STable
  },
  data () {
    return {
      title: '历史记录',
      columns: [
        {
          title: '黄金副本',
          dataIndex: 'gold',
          width: 108,
          ellipsis: true
        },
        {
          title: '虚拟副本',
          dataIndex: 'virtual',
          width: 108,
          ellipsis: true
        },
        {
          title: '最后一次虚拟副本',
          dataIndex: 'oldvirtual',
          width: 150,
          ellipsis: true
        },
        {
          title: '开始时间',
          dataIndex: 'startTime',
          width: 182,
          scopedSlots: { customRender: 'unixToDate' }
        },
        {
          title: '结束时间',
          dataIndex: 'endTime',
          width: 182,
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
          res = await getRecoveryStrategyHistories({ workflowId: this.id })
        } catch (error) {
          this.empty = handleFetchStateErrorDone(error)
        }
        return isEmpty(this.empty?.data) ? res : {}
      },
      empty: {
        state: 'empty',
        data: null
      },
      id: null
    }
  },
  created () {
    this.id = this.$route.params.id
    events.$off(`refresh-history-${this.id}`)
    events.$on(`refresh-history-${this.id}`, () => {
      this.$refs.table.refresh()
    })
  }
}

</script>
