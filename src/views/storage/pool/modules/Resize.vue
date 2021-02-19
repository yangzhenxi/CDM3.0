<template>
  <div>
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
      <div>
        <a-button size="small" icon="plus" style="margin-right: 8px" @click="handlePoolAdd">自定义磁盘</a-button>
        <a-icon type="sync" :spin="flushLoading" @click.native="handleFlushClassDevice" class="icon-default" />
      </div>
    </div>
    <m-table
      size="small"
      :rowKey="rowKey"
      :loading="loading"
      :columns="columns"
      :dataSource="filterData"
      :rowSelection="rowSelection"
      :customRow="customRow"
      :scroll="scroll"
      :pagination="false"
      :emptyItemProps="empty"
    >
      <template slot="path" slot-scope="text, r">
        <editable-cell
          :ref="`editable_path_${deepGet(r, 'id')}`"
          :item="getEditableItem(text, r, 'path')"
          @change="value => { r.path = value }"
        />
      </template>
      <template slot="capacity" slot-scope="text">
        {{ text | convert('unitSize') }}
      </template>
    </m-table>
  </div>
</template>

<script>
import { getClassDevices, flushClass } from '@/api/storage/class'
import { expandPool } from '@/api/storage/pool'
import { EditableCell } from '@/components'
import { useTableContext } from '@/core/use'
import { deepGet, handleFetchStateErrorDone } from '@/utils/util'

export default {
  components: {
    EditableCell
  },
  props: {
    record: {
      type: Object,
      default () {
        return {}
      }
    }
  },
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
        width: 200,
        ellipsis: true,
        scopedSlots: { customRender: 'path' }
      },
      {
        title: '容量',
        dataIndex: 'capacity',
        width: 80,
        scopedSlots: { customRender: 'capacity' }
      }
    ]
    const {
      rowKey,
      rowSelection,
      customRow,
      scroll
    } = useTableContext({
      columns,
      rowClick: true,
      scroll: {
        y: 300
      },
      rowSelection: { getCheckboxProps: record => ({
        props: {
          disabled: deepGet(record, 'available') === -1
        }
      }) }
    })
    return {
      rowKey,
      columns,
      rowSelection,
      customRow,
      scroll
    }
  },
  data () {
    return {
      loading: false,
      data: [],
      filterData: [],
      empty: {
        state: 'empty',
        data: null
      },
      availableType: true,
      available: [
        { value: 'all', label: '全部磁盘' },
        { value: true, label: '可用磁盘' }
      ],
      customDiskKey: 0,
      flushLoading: false
    }
  },
  created () {
    this.loadData()
  },
  methods: {
    async loadData () {
      try {
        this.loading = true
        this.data = deepGet(await getClassDevices({ storageId: this.record.storageId }), 'data', [])
        this.data = this.data.map((u, index) => ({
          ...u,
          id: index,
          disabled: u?.available === -1
        }))
        this.handleAvailableChange()
        this.loading = false
      } catch (error) {
        this.empty = handleFetchStateErrorDone(error)
        this.loading = false
      }
    },
    onOk () {
      return new Promise(async (resolve, reject) => {
        const { selectedRows } = this.rowSelection
        if (!selectedRows.length) {
          this.$message.info('请选择存储池关联的磁盘！')
          reject(new Error())
          return
        }
        let isValid = true
        await Promise.all(selectedRows.map((u, index) => {
          Object.keys(u).map(async i => {
            if (i.includes('editable')) {
              const { valid } = await this.$refs[`${i}_${u?.id}`].validate()
              if (!valid) {
                isValid = false
              }
            }
          })
        }))
        if (isValid) {
          try {
            await expandPool({
              id: this.record.id,
              devs: selectedRows.map(u => u?.path)
            })
            resolve(true)
          } catch (error) {
            reject(error)
          }
        } else {
          reject(new Error())
        }
      })
    },
    handlePoolAdd () {
      const device = {
        id: `disk-${this.customDiskKey}`,
        name: `disk-${this.customDiskKey}`,
        path: null,
        available: 1,
        editable_path: true
      }
      this.customDiskKey++
      this.data.push(device)
      this.handleAvailableChange()
    },
    handleAvailableChange (value) {
      if (value) {
        this.availableType = value.target.value
      }
      if (this.availableType === 'all') {
        this.filterData = this.data
      } else {
        this.filterData = this.data.filter(u => u?.available === 1)
      }
    },
    async handleFlushClassDevice () {
      try {
        this.flushLoading = true
        await flushClass({ storageId: this.record.storageId })
        this.loadData()
        this.$message.success('刷新成功！')
        this.flushLoading = false
      } catch (error) {
        this.flushLoading = false
      }
    },
    getEditableItem (value, record = {}, prop) {
      return {
        prop,
        value,
        rules: { required: true, message: '请输入！' },
        component: {
          name: 'a-input'
        },
        editable: record[`editable_${prop}`]
      }
    },
    deepGet

  }
}
</script>
