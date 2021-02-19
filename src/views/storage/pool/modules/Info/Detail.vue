<template>
  <div>
    <h3 style="margin-bottom: 16px">
      <m-icon type="node" />
      {{ title }}
    </h3>
    <a-spin :spinning="loading">
      <empty-provider :isEmpty="o.isEmpty" :itemProps="o.empty">
        <detail :data="data" justify="end" :colon="false">
          <template slot="type" slot-scope="text">
            <m-icon :type="toEnum(text, 'STORAGE_POOL_TYPE').icon" :title="convert(text, 'STORAGE_POOL_TYPE')" style="font-size: 20px" />
          </template>
          <template slot="state" slot-scope="text, record">
            <a-tooltip :title="deepGet(record, 'error')">
              <m-tag :color="toEnum(text, 'STORAGE_POOL_STATE').color" style="margin-right: 0">{{ text | convert('STORAGE_POOL_STATE') }}</m-tag>
            </a-tooltip>
          </template>
        </detail>
      </empty-provider>
    </a-spin>
  </div>
</template>

<script>
import { Detail, EmptyProvider, MIcon } from '@/components'
import { convert, deepGet, handleFetchStateErrorDone, toEnum, transformArray } from '@/utils/util'
import events from '../events'
import { getPool } from '@/api/storage/pool'

export default {
  components: {
    Detail,
    EmptyProvider,
    MIcon
  },
  data () {
    return {
      title: '存储池信息',
      data: [
        {
          key: 'name',
          title: '名称'
        },
        {
          key: 'type',
          title: '类型',
          valueScopedSlots: { customRender: 'type' }
        },
        {
          key: 'raidLevel',
          title: 'RAID 级别',
          enum: 'STORAGE_POOL_RAID_LEVEL'
        },
        {
          key: 'compressRatio',
          title: '压缩比',
          filter: 'compressRatio'
        },
        {
          key: 'state',
          title: '状态',
          valueScopedSlots: { customRender: 'state' }
        }
      ],
      loading: false,
      o: {
        id: null,
        record: {},
        isEmpty: true,
        empty: {
          state: 'empty',
          data: null
        }
      }
    }
  },
  created () {
    this.id = this.$route.params.id
    events.$off(`refresh-detail-${this.id}`)
    events.$on(`refresh-detail-${this.id}`, () => {
      this.loadData()
    })
    this.loadData()
  },
  methods: {
    async loadData () {
      try {
        this.o = {
          id: this.id,
          record: {},
          isEmpty: true,
          empty: {
            state: 'empty',
            data: null
          }
        }
        this.loading = true
        this.o.record = deepGet(await getPool({ id: this.id }), 'data', {})
        this.data = this.data.map(u => Object.assign(u, {
          value: deepGet(this.o.record, u.key)
        }))
        this.o.isEmpty = false
        transformArray(events.data, { id: this.id }, this.o)
        this.loading = false
      } catch (error) {
        this.o.empty = handleFetchStateErrorDone(error)
        transformArray(events.data, { id: this.id }, this.o)
        this.loading = false
      }
    },
    convert,
    deepGet,
    toEnum
  }
}

</script>
