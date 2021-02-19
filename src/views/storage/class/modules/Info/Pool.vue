<template>
  <div>
    <h3 style="margin-bottom: 16px">{{ title }}</h3>
    <s-table
      ref="table"
      :columns="columns"
      :fetchData="fetchData"
      :emptyItemProps="empty"
    >
      <template slot="type" slot-scope="text">
        <m-icon :type="toEnum(text, 'STORAGE_POOL_TYPE').icon" :title="convert(text, 'STORAGE_POOL_TYPE')" style="font-size: 20px" />
      </template>
      <template slot="compressRatio" slot-scope="text">
        {{ text | convert('compressRatio') }}
      </template>
      <template slot="state" slot-scope="text, record">
        <a-tooltip :title="deepGet(record, 'error')">
          <m-tag :color="toEnum(text, 'STORAGE_POOL_STATE').color">{{ text | convert('STORAGE_POOL_STATE') }}</m-tag>
        </a-tooltip>
      </template>
    </s-table>
  </div>
</template>

<script>
import { getAllPool } from '@/api/storage/pool'
import { MIcon, STable } from '@/components'
import { convert, deepGet, handleFetchStateErrorDone, isEmpty, toEnum } from '@/utils/util'

export default {
  components: {
    MIcon,
    STable
  },
  data () {
    return {
      title: '存储池信息',
      columns: [
        {
          title: '名称',
          dataIndex: 'name',
          width: 100,
          ellipsis: true
        },
        {
          title: '类型',
          dataIndex: 'type',
          width: 100,
          align: 'center',
          scopedSlots: { customRender: 'type' }
        },
        {
          title: '总容量',
          dataIndex: 'capacity',
          width: 80,
          scopedSlots: { customRender: 'unitSize' }
        },
        {
          title: '可用容量',
          dataIndex: 'available',
          width: 80,
          scopedSlots: { customRender: 'unitSize' }
        },
        {
          title: '已用容量',
          dataIndex: 'used',
          width: 80,
          scopedSlots: { customRender: 'unitSize' }
        },
        {
          title: '压缩比',
          dataIndex: 'compressRatio',
          width: 80,
          scopedSlots: { customRender: 'compressRatio' }
        },
        {
          title: '状态',
          dataIndex: 'state',
          width: 60,
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
          res = await getAllPool()
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
  methods: {
    convert,
    deepGet,
    toEnum
  }
}

</script>
