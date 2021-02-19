<template>
  <div>
    <h3 style="margin-bottom: 16px">{{ title }}</h3>
    <s-table
      ref="table"
      :columns="columns"
      :fetchData="fetchData"
      :scroll="{ y: 200 }"
      :emptyItemProps="empty"
    >
      <template slot="available" slot-scope="text, record">
        <a-tooltip :title="text ? '' : `存储池：${deepGet(record, 'occupy')}`">
          <m-tag :color="toEnum(text, 'STORAGE_DEVICE_DISK_AVAILABLE').color">{{ text | convert('STORAGE_DEVICE_DISK_AVAILABLE') }}</m-tag>
        </a-tooltip>
      </template>
      <template slot="isNormal" slot-scope="text, record">
        <a-tooltip :title="deepGet(record, 'error')">
          <m-tag :color="toEnum(text, 'STORAGE_DEVICE_DISK_STATE').color">{{ text | convert('STORAGE_DEVICE_DISK_STATE') }}</m-tag>
        </a-tooltip>
      </template>
    </s-table>
  </div>
</template>

<script>
import { getClassDevices } from '@/api/storage/class'
import { STable } from '@/components'
import { deepGet, handleFetchStateErrorDone, isEmpty, toEnum } from '@/utils/util'

export default {
  components: {
    STable
  },
  data () {
    return {
      title: '磁盘信息',
      columns: [
        {
          title: '名称',
          dataIndex: 'name',
          width: 100,
          ellipsis: true
        },
        {
          title: '路径',
          dataIndex: 'path',
          width: 100,
          ellipsis: true
        },
        {
          title: '容量',
          dataIndex: 'capacity',
          width: 80,
          scopedSlots: { customRender: 'unitSize' }
        },
        {
          title: '是否空闲',
          dataIndex: 'available',
          width: 80,
          scopedSlots: { customRender: 'available' }
        },
        {
          title: '状态',
          dataIndex: 'isNormal',
          width: 60,
          scopedSlots: { customRender: 'isNormal' }
        }
      ],
      fetchData: async params => {
        this.empty = {
          state: 'empty',
          data: null
        }
        this.id = this.$route.params.id
        let res = {}
        try {
          res = await getClassDevices({ storageId: this.id })
          res.data = deepGet(res, 'data', []).map((u, index) => ({
            ...u,
            id: index
          }))
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
  methods: {
    deepGet,
    toEnum
  }
}

</script>
