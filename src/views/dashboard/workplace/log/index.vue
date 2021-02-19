<template>
  <card
    :bodyStyle="{ padding: 0 }"
    :wrapperClass="data.key"
    :headerWrapperClass="`${data.key}-header`"
    :headerActionWrapperClass="`${data.key}-header-action`"
    :contentWrapperClass="`${data.key}-content`"
  >
    <span slot="title" class="title">{{ data.title }}</span>
    <span slot="action" class="action" @click="$router.push({ name: data.name })">查看所有</span>
    <m-table
      ref="table"
      :rowKey="rowKey"
      :loading="loading"
      :columns="columns"
      :dataSource="logData"
      :rowClassName="rowClassName"
      :scroll="scroll"
      :pagination="false"
      :emptyItemProps="empty"
    >
      <template slot="ellipsis" slot-scope="text">
        <a-tooltip placement="topLeft" :title="text">
          {{ text }}
        </a-tooltip>
      </template>
      <template slot="eventType" slot-scope="text">
        <span :color="toEnum(text, 'LOG_USER_TYPE').color">{{ text | convert('LOG_USER_TYPE') }}</span>
      </template>
      <template slot="unixToDate" slot-scope="text">
        {{ text | convert('unixToDate') }}
      </template>
      <template slot="state" slot-scope="text, record">
        <a-tooltip :title="deepGet(record, 'error')">
          <m-tag :color="toEnum(text, 'LOG_USER_STATE').color">{{ text | convert('LOG_USER_STATE') }}</m-tag>
        </a-tooltip>
      </template>
    </m-table>
  </card>
</template>

<script>
import { Card } from '@/components'
import { useTableContext } from '@/core/use'
import { deepGet, toEnum } from '@/utils/util'
import events from '../events'

export default {
  components: {
    Card
  },
  props: {
    data: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      loading: false,
      empty: {
        state: 'empty',
        data: null
      }
    }
  },
  setup (props, context) {
    const columns = [
      {
        title: 'IP',
        dataIndex: 'ip',
        width: 152
      },
      {
        title: '操作用户',
        dataIndex: 'user',
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
        dataIndex: 'startTime',
        width: 175,
        scopedSlots: { customRender: 'unixToDate' }
      },
      {
        title: '结束时间',
        dataIndex: 'endTime',
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
    ]
    const {
      rowKey,
      scroll,
      rowClassName
    } = useTableContext({
      columns
    })
    return {
      rowKey,
      columns,
      rowClassName,
      scroll
    }
  },
  computed: {
    logData () {
      return events.data.log
    }
  },
  methods: {
    deepGet,
    toEnum
  }
}

</script>

<style lang='less' scoped>
  .user {
    border: 1px solid @gray-1;
    box-shadow: 0 2px 8px rgba(0, 0, 0, .09);
    /deep/ .user-header {
      background: linear-gradient(to bottom, @gray-1, @gray-4);
      font-weight: bold;
      .title {
        margin-left: 16px;
        color: #3771cd;
      }
      .action {
        margin-right: 16px;
        opacity: 1;
        color: #3771cd;
        &:hover {
          opacity: .65;
        }
      }
      &:before, &:after {
        content: '';
        position: absolute;
        width: 12px;
        height: 12px;
      }
      &:before {
        top: -1px;
        left: -1px;
        border-top: 3px solid #42ccfb;
        border-left: 3px solid #42ccfb;
      }
      &:after {
        top: -1px;
        right: -1px;
        border-top: 3px solid #42ccfb;
        border-right: 3px solid #42ccfb;
      }
    }
    /deep/ .user-header-action {
      top: 50%;
      transform: translate(0, -50%);
    }
    /deep/ .user-content {
      margin: 0;
      /deep/ .ant-table-thead > tr > th {
        background: @gray-1;
        color: #3569b1;
        font-weight: bold;
      }
      &:before, &:after {
        content: '';
        position: absolute;
        width: 12px;
        height: 12px;
      }
      &:before {
        left: -1px;
        bottom: -1px;
        border-left: 2px solid #42ccfb;
        border-bottom: 2px solid #42ccfb;
      }
      &:after {
        right: -1px;
        bottom: -1px;
        border-right: 2px solid #42ccfb;
        border-bottom: 2px solid #42ccfb;
      }
    }
  }
</style>
