<template>
  <div>
    <h3 style="margin-bottom: 16px">{{ title }}</h3>
    <m-table
      :rowKey="rowKey"
      :loading="loading"
      :columns="columns"
      :dataSource="data"
      :scroll="scroll"
      :pagination="false"
      :emptyItemProps="empty"
    >
      <template slot="capacity" slot-scope="text">
        {{ text | convert('unitSize') }}
      </template>
      <template slot="isNormal" slot-scope="text, record">
        <a-tooltip :title="deepGet(record, 'error')">
          <m-tag :color="toEnum(text, 'STORAGE_DEVICE_DISK_STATE').color">{{ text | convert('STORAGE_DEVICE_DISK_STATE') }}</m-tag>
        </a-tooltip>
      </template>
    </m-table>
  </div>
</template>

<script>
import { mergeWith } from 'lodash'
import { getClassDevice } from '@/api/storage/class'
import { useTableContext } from '@/core/use'
import { deepGet, handleFetchStateErrorDone, isEmpty, toEnum } from '@/utils/util'
import events from '../events'

export default {
  setup (props, context) {
    const columns = [
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
        scopedSlots: { customRender: 'capacity' }
      },
      {
        title: '状态',
        dataIndex: 'isNormal',
        width: 60,
        scopedSlots: { customRender: 'isNormal' }
      }
    ]
    const {
      rowKey,
      scroll
    } = useTableContext({
      columns,
      scroll: {
        y: 250
      }
    })
    return {
      rowKey,
      columns,
      scroll
    }
  },
  data () {
    return {
      title: '磁盘信息',
      data: [],
      empty: {
        state: 'empty',
        data: null
      },
      loading: false,
      id: null
    }
  },
  computed: {
    o () {
      return events.data.find(u => u?.id === this.id) || {}
    }
  },
  watch: {
    'o.record': {
      handler (value) {
        if (!isEmpty(value)) {
          this.loading = true
          this.loadData()
        } else {
          this.loading = false
        }
      },
      deep: true
    }
  },
  created () {
    this.id = this.$route.params.id
    this.loading = true
    events.$off(`refresh-device-${this.id}`)
    events.$on(`refresh-device-${this.id}`, () => {
      this.loading = true
      this.loadData()
    })
  },
  methods: {
    async loadData () {
      this.empty = {
        state: 'empty',
        data: null
      }
      let data = (await Promise.all(`${this.o.record?.devices}`.split(',').filter(u => u).map(u => getClassDevice({
        storageId: this.o.record?.storageId,
        path: u
      })).map(api => api.catch(error => {
        this.empty = mergeWith(this.empty, handleFetchStateErrorDone(error), (o, s) => {
          if (Array.isArray(o)) {
            return o.concat(s)
          }
          return s
        })
      })))).map(u => deepGet(u, 'data', {}))
      data = data.map((u, index) => ({
        ...u,
        id: index
      }))
      this.data = isEmpty(this.empty?.data) ? data : []
      this.loading = false
    },
    deepGet,
    toEnum
  }
}

</script>
