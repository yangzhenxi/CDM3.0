<template>
  <page-header-wrapper :title="false">
    <a-card :bordered="false">
      <search-form-builder ref="form" :items="searchFormItems" @refresh="$refs.table.refresh()" />
      <s-table
        ref="table"
        :columns="columns"
        :fetchData="fetchData"
        :emptyItemProps="empty"
      >
        <template slot="eventType" slot-scope="text">
          <span :color="toEnum(text, 'LOG_USER_TYPE').color">{{ text | convert('LOG_USER_TYPE') }}</span>
        </template>
        <template slot="state" slot-scope="text, record">
          <a-tooltip :title="deepGet(record, 'error')">
            <m-tag :color="toEnum(text, 'LOG_USER_STATE').color">{{ text | convert('LOG_USER_STATE') }}</m-tag>
          </a-tooltip>
        </template>
      </s-table>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { getUserLogList } from '@/api/log/user'
import { getAllUser } from '@/api/system/user'
import { SearchFormBuilder, STable } from '@/components'
import { deepGet, enumToSelection, handleFetchStateErrorDone, isEmpty, queryBuild, transformArray, toEnum } from '@/utils/util'

export default {
  name: 'LogUser',
  components: {
    SearchFormBuilder,
    STable
  },
  data () {
    return {
      searchFormItems: [
        {
          label: '用户',
          prop: 'userID',
          component: {
            name: 'm-select'
          }
        },
        {
          label: '事件类型',
          prop: 'eventType',
          component: {
            name: 'm-select',
            props: {
              options: enumToSelection('LOG_USER_TYPE'),
              showSearch: true
            }
          }
        }
      ],
      columns: [
        {
          title: 'IP',
          dataIndex: 'ip',
          width: 152
        },
        {
          title: '用户',
          dataIndex: 'user.nickname',
          width: 100,
          ellipsis: true
        },
        {
          title: '事件类型',
          dataIndex: 'eventType',
          width: 80,
          scopedSlots: { customRender: 'eventType' }
        },
        {
          title: '事件详情',
          dataIndex: 'event',
          width: 150,
          ellipsis: true,
          scopedSlots: { customRender: 'ellipsis' }
        },
        {
          title: '开始时间',
          dataIndex: 'createdAt',
          width: 175,
          scopedSlots: { customRender: 'unixToDate' }
        },
        {
          title: '结束时间',
          dataIndex: 'updatedAt',
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
          res = await getUserLogList(Object.assign(params, queryBuild(this.$refs.form.model)))
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
  },
  created () {
    this.loadData()
  },
  methods: {
    async loadData () {
      try {
        const userList = deepGet(await getAllUser(), 'data', []).map(user => ({
          value: deepGet(user, 'id'),
          label: deepGet(user, 'nickname')
        }))
        transformArray(this.searchFormItems, { prop: 'userID' }, { component: { props: { options: userList } } })
      } catch (error) {
        transformArray(this.searchFormItems, { prop: 'userID' }, { component: { props: { emptyItemProps: handleFetchStateErrorDone(error) } } })
      }
    },
    deepGet,
    toEnum
  }
}
</script>
