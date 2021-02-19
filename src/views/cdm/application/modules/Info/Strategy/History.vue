<template>
  <s-table
    ref="table"
    :columns="columns"
    :fetchData="fetchData"
    :rowSelection="{}"
    :rowClick="true"
    :emptyItemProps="empty"
  >
    <template slot="type" slot-scope="text">
      <span>{{ text | convert('CDM_APPLICATION_BACKUP_TYPE') }}</span>
    </template>
    <template slot="state" slot-scope="text">
      <span>{{ text | convert('CDM_APPLICATION_BACKUP_HISTORY_STATE') }}</span>
    </template>
  </s-table>
</template>

<script>
import { getProtectionStrategyHistories } from '@/api/cdm/protectionStrategy'
import { STable } from '@/components'
import { handleFetchStateErrorDone, isEmpty } from '@/utils/util'
import events from '../../events'

export default {
  components: {
    STable
  },
  data () {
    return {
      columns: [
        {
          title: '备份类型',
          dataIndex: 'type',
          width: 108,
          scopedSlots: { customRender: 'type' }
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
        },
        {
          title: '创建时间',
          dataIndex: 'createdAt',
          width: 182,
          scopedSlots: { customRender: 'unixToDate' }
        },
        {
          title: '状态',
          dataIndex: 'state',
          width: 80,
          scopedSlots: { customRender: 'state' }
        }
      ],
      fetchData: async params => {
        this.id = this.$route.params.id
        this.o = events.data.find(u => u.id === this.id) || {}
        this.empty = {
          state: 'empty',
          data: null
        }
        let res = {}
        try {
          res = await getProtectionStrategyHistories(Object.assign(params, { id: this.o.strategy?.id }))
        } catch (error) {
          this.empty = handleFetchStateErrorDone(error)
        }
        return isEmpty(this.empty?.data) ? res : {}
      },
      empty: {
        state: 'empty',
        data: null
      },
      id: null,
      o: {}
    }
  }
}

</script>
