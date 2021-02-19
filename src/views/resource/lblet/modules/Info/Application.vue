<template>
  <div>
    <h3 style="margin-bottom: 16px">{{ title }}</h3>
    <s-table
      ref="table"
      :columns="columns"
      :fetchData="fetchData"
      :emptyItemProps="empty"
    >
      <template slot="kind" slot-scope="text">
        <m-icon :type="toEnum(text, 'CDM_APPLICATION_MODULE').icon" style="font-size: 20px" />
      </template>
      <template slot="state" slot-scope="text">
        <m-tag :color="toEnum(text, 'CDM_APPLICATION_STATE').color">{{ text | convert('CDM_APPLICATION_STATE') }}</m-tag>
      </template>
    </s-table>
  </div>
</template>

<script>
import { getLbletApplications } from '@/api/resource/lblet'
import { STable, MIcon } from '@/components'
import { handleFetchStateErrorDone, isEmpty, toEnum } from '@/utils/util'
import events from '../events'

export default {
  components: {
    STable,
    MIcon
  },
  data () {
    return {
      title: '应用信息',
      columns: [
        {
          title: '名称',
          dataIndex: 'name',
          width: 100,
          ellipsis: true
        },
        {
          title: '类型',
          dataIndex: 'kind',
          width: 80,
          scopedSlots: { customRender: 'kind' }
        },
        {
          title: '创建时间',
          dataIndex: 'createdAt',
          width: 175,
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
        this.empty = {
          state: 'empty',
          data: null
        }
        let res = {}
        try {
          res = await getLbletApplications({ id: this.id })
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
    events.$off(`refresh-application-${this.id}`)
    events.$on(`refresh-application-${this.id}`, () => {
      this.$refs.table.refresh()
    })
  },
  methods: {
    toEnum
  }
}

</script>
