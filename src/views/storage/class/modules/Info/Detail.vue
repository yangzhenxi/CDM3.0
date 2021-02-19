<template>
  <div>
    <h3 style="margin-bottom: 16px"><m-icon type="node" />{{ title }}</h3>
    <a-spin :spinning="loading">
      <empty-provider :isEmpty="o.isEmpty" :itemProps="o.empty">
        <detail :data="data" justify="end" :colon="false">
          <template slot="state" slot-scope="text, record">
            <a-tooltip :title="deepGet(record, 'error')">
              <m-tag :color="toEnum(text, 'STORAGE_CLASS_STATE').color" style="margin-right: 0">{{ text | convert('STORAGE_CLASS_STATE') }}</m-tag>
            </a-tooltip>
          </template>
        </detail>
      </empty-provider>
    </a-spin>
  </div>
</template>

<script>
import { getClass } from '@/api/storage/class'
import { Detail, EmptyProvider, MIcon } from '@/components'
import { deepGet, handleFetchStateErrorDone, toEnum } from '@/utils/util'

export default {
  components: {
    Detail,
    EmptyProvider,
    MIcon
  },
  data () {
    return {
      title: '节点信息',
      data: [
        {
          key: 'name',
          title: '名称'
        },
        {
          key: 'ipAddr',
          title: 'IP'
        },
        {
          key: 'version',
          title: '版本'
        },
        {
          key: 'createdAt',
          title: '创建时间',
          filter: 'unixToDate'
        },
        {
          key: 'state',
          title: '状态',
          valueScopedSlots: { customRender: 'state' }
        },
        {
          key: 'fc',
          title: 'FC'
        },
        {
          key: 'remark',
          title: '备注'
        }
      ],
      loading: false,
      id: null,
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
        this.o.record = deepGet(await getClass({ id: this.id }), 'data', {})
        this.data = this.data.map(u => Object.assign(u, {
          value: deepGet(this.o.record, u.key)
        }))
        this.o.isEmpty = false
        this.loading = false
      } catch (error) {
        this.o.empty = handleFetchStateErrorDone(error)
        this.loading = false
      }
    },
    deepGet,
    toEnum
  }
}

</script>
