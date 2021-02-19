<template>
  <div>
    <h3 style="margin-bottom: 16px">{{ title }}</h3>
    <div class="flex-row" style="margin-bottom: 16px">
      <div>
        <a-radio-group
          :value="availableType"
          buttonStyle="solid"
          size="small"
          @change="handleAvailableChange"
        >
          <a-radio-button v-for="item in available" :key="item.value" :value="item.value">
            {{ item.label }}
          </a-radio-button>
        </a-radio-group>
      </div>
    </div>
    <m-table
      :rowKey="rowKey"
      :loading="loading"
      :columns="columns"
      :dataSource="filterData"
      :scroll="scroll"
      :pagination="false"
      :emptyItemProps="empty"
    >
      <template slot="unitSize" slot-scope="text">
        {{ convert(text,'unitSize') }}
      </template>
      <template slot="more-popover" slot-scope="text">
        <div class="flex-row-default more-popover">
          <div>{{ deepGet(text, '0', EMPTY_VALUE) }}</div>
          <div v-if="text.length > 1">
            <a-popover placement="bottomRight" overlayClassName="more-popover-overlay">
              <template #content>
                <div v-for="u in text" :key="u">
                  <span class="label">{{ u }}</span>
                </div>
              </template>
              <div class="more-popover-icon">
                <a-icon type="down" @click.native.stop />
              </div>
            </a-popover>
          </div>
        </div>
      </template>
      <template slot="isHasApplication" slot-scope="text">
        <m-tag :color="toEnum(text, 'CDM_APPLICATION_EXIST').color">{{ text | convert('CDM_APPLICATION_EXIST') }}</m-tag>
      </template>
    </m-table>
  </div>
</template>

<script>
import { EMPTY_VALUE } from '@/config/constant.config'
import { useTableContext } from '@/core/use'
import { columnsBuild, convert, deepGet, handleFetchStateErrorDone, isEmpty, toEnum } from '@/utils/util'
import events from '../events'

export default {
  setup (props, context) {
    const columns = [
      {
        title: '名称',
        dataIndex: 'name',
        width: 100,
        ellipsis: true,
        modules: ['vmware', 'hyperv']
      },
      {
        title: '唯一标识',
        dataIndex: 'ref',
        width: 100,
        ellipsis: true,
        modules: ['vmware']
      },
      {
        title: 'IP',
        dataIndex: 'ips',
        width: 120,
        modules: ['vmware'],
        scopedSlots: { customRender: 'more-popover' }
      },
      {
        title: 'uuid',
        dataIndex: 'vmid',
        width: 100,
        ellipsis: true,
        modules: ['hyperv']
      },
      {
        title: '容量',
        dataIndex: 'capacity',
        width: 100,
        modules: ['hyperv'],
        scopedSlots: { customRender: 'unitSize' }
      },
      {
        title: '是否新建应用',
        dataIndex: 'isHasApplication',
        width: 80,
        modules: ['vmware', 'hyperv'],
        scopedSlots: { customRender: 'isHasApplication' }
      }
    ]
    const {
      rowKey,
      scroll
    } = useTableContext({
      columns,
      scroll: {
        y: 300
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
      title: '虚拟机信息',
      data: [],
      filterData: [],
      empty: {
        state: 'empty',
        data: null
      },
      availableType: 'all',
      available: [
        { value: 'all', label: '全部虚拟机' },
        { value: true, label: '可用虚拟机' }
      ],
      loading: false,
      EMPTY_VALUE,
      id: null,
      o: null
    }
  },
  created () {
    this.id = this.$route.params.id
    events.$off(`update-vm-${this.id}`)
    events.$on(`update-vm-${this.id}`, () => {
      this.o = events.data.find(u => u.id === this.id) || {}
      this.columns = columnsBuild(this.columns, convert(this.o?.record?.kind, 'R_VIRTUAL_MODULE'))
      this.loadData()
    })
  },
  methods: {
    async loadData () {
      try {
        this.loading = true
        this.empty.data = null
        this.data = this.o.record.data
        this.data = this.data.map((u, index) => ({
          ...u,
          id: index,
          ips: deepGet(u, 'ips', []),
          isHasApplication: u?.applicationID !== '-1'
        }))
        this.handleAvailableChange()
        if (!isEmpty(this.empty?.data)) {
          this.data = []
        }
        this.loading = false
      } catch (error) {
        this.empty = handleFetchStateErrorDone(error)
        this.loading = false
      }
    },
    handleAvailableChange (value) {
      if (value) {
        this.availableType = value.target.value
      }
      if (this.availableType === 'all') {
        this.filterData = this.data
      } else {
        this.filterData = this.data.filter(u => u?.isHasApplication)
      }
    },
    convert,
    deepGet,
    toEnum
  }
}

</script>
