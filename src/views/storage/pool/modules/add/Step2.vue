<template>
  <div class="step-form-item">
    <form-builder ref="form" :items="items" />
    <a-divider />
    <div class="flex-row" style="margin-bottom: 16px">
      <div>
        <a-radio-group
          :value="poolAvailableType"
          buttonStyle="solid"
          size="small"
          @change="handlePoolChange"
        >
          <a-radio-button v-for="item in poolAvailable" :key="item.value" :value="item.value">
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
          @change="value => { r.path = value }" />
      </template>
      <template slot="capacity" slot-scope="text">
        {{ text | convert('unitSize') }}
      </template>
    </m-table>
    <div class="step-form-item-operator" style="margin-top: 16px">
      <a-button @click="prev">{{ $t('layouts.step.operator.prev') }}</a-button>
      <a-button type="primary" :loading="confirmLoading" @click="handleSubmit">{{ $t('layouts.step.operator.new') }}</a-button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getClassDevices, flushClass } from '@/api/storage/class'
import { addPool, getAllPool } from '@/api/storage/pool'
import { EditableCell, FormBuilder } from '@/components'
import { useStepFormItem, useTableContext } from '@/core/use'
import { deepGet, debounce, handleFetchStateErrorDone, transformArray, enumToSelection } from '@/utils/util'
import { isAlphanumericWithAlphaBegin, isRepeat } from '@/utils/validator'

export default {
  name: 'Step2',
  components: {
    EditableCell,
    FormBuilder
  },
  setup (props, context) {
    const {
      prev,
      next
    } = useStepFormItem(props, context)
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
      prev,
      next,
      rowKey,
      columns,
      rowSelection,
      customRow,
      scroll
    }
  },
  data () {
    return {
      items: [
        {
          label: '名称',
          prop: 'name',
          rules: [
            { required: true, message: '请输入！' },
            { validator: async (rule, value, callback) => {
              const { valid, error } = isAlphanumericWithAlphaBegin(value)
              if (!valid) {
                throw new Error(error)
              }
            } },
            { validator: debounce(async (rule, value, callback) => {
              const { valid, error } = await isRepeat(value, {
                fetchData: async () => {
                  try {
                    const data = deepGet(await getAllPool({
                      name: value
                    }), 'data', [])
                    console.log(data)
                    return []
                  } catch (error) {
                    return []
                  }
                }
              })
              if (!valid) {
                callback(error)
              }
              callback()
            }) }
          ],
          component: {
            name: 'a-input'
          }
        },
        {
          label: 'raid 级别',
          prop: 'raidLevel',
          rules: [
            { required: true, message: '请选择！' },
            { validator: async (rule, value, callback) => {
              if (value === 3) {
                const { selectedRows } = this.rowSelection
                if (selectedRows?.length < 2) {
                  throw new Error('选择磁盘数必须大于等于 2！')
                }
              }
            } }
          ],
          component: {
            name: 'm-select',
            props: {
              options: enumToSelection('STORAGE_POOL_RAID_LEVEL')
            }
          }
        },
        {
          label: '压缩等级',
          prop: 'compression',
          visible: false,
          value: 6,
          rules: { required: true, message: '请选择！' },
          component: {
            name: 'm-select',
            props: {
              options: Array.from({ length: 9 }, (v, k) => ({ value: k + 1, label: k + 1 }))
            }
          }
        },
        {
          label: '告警值',
          prop: 'alertRatio',
          value: 80,
          component: {
            name: 'a-slider',
            props: {
              min: 1,
              tipFormatter: value => `${value} %`
            }
          }
        },
        {
          label: '使用限额',
          prop: 'quota',
          value: 90,
          component: {
            name: 'a-slider',
            props: {
              min: 1,
              tipFormatter: value => `${value} %`
            }
          }
        }
      ],
      loading: false,
      data: [],
      filterData: [],
      empty: {
        state: 'empty',
        data: null
      },
      poolAvailableType: true,
      poolAvailable: [
        { value: 'all', label: '全部磁盘' },
        { value: true, label: '可用磁盘' }
      ],
      customDiskKey: 0,
      flushLoading: false,
      confirmLoading: false
    }
  },
  computed: {
    ...mapState({
      step1: state => state.storagePool.step['step1']
    })
  },
  methods: {
    async handleSubmit () {
      this.confirmLoading = true
      const { valid, values } = await this.$refs.form.validate()
      this.confirmLoading = valid
      if (valid) {
        const { selectedRows } = this.rowSelection
        if (!selectedRows.length) {
          this.$message.info('请选择存储池关联的磁盘！')
          this.confirmLoading = false
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
            await addPool({
              storageId: this.step1.pool.classId,
              type: this.step1.pool.type,
              name: values.name,
              raidLevel: values.raidLevel,
              compression: this.step1.pool.type === 2 ? values.compression : undefined,
              quota: values.quota,
              alertRatio: values.alertRatio,
              devices: selectedRows.map(u => u?.path),
              poolLocation: 1
            })
            this.next()
          } catch (error) {
            this.confirmLoading = false
          }
        }
        this.confirmLoading = false
      }
    },
    wakeData () {
      // 压缩池
      if (this.step1.pool.type === 2) {
        transformArray(this.items, { prop: 'compression' }, { visible: true })
      }
      this._getClassDevices()
    },
    async _getClassDevices () {
      try {
        this.loading = true
        this.data = deepGet(await getClassDevices({ storageId: this.step1.pool.classId }), 'data', [])
        this.data = this.data.map((u, index) => ({
          ...u,
          id: index
        }))
        this.handlePoolChange()
        this.loading = false
      } catch (error) {
        this.empty = handleFetchStateErrorDone(error)
        this.loading = false
      }
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
      this.handlePoolChange()
    },
    handlePoolChange (value) {
      if (value) {
        this.poolAvailableType = value.target.value
      }
      if (this.poolAvailableType === 'all') {
        this.filterData = this.data
      } else {
        this.filterData = this.data.filter(u => u?.available === 1)
      }
    },
    async handleFlushClassDevice () {
      try {
        this.flushLoading = true
        await flushClass({ storageId: this.step1.pool.classId })
        this._getClassDevices()
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
