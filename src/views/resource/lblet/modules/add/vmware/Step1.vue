<template>
  <div class="step-form-item">
    <form-builder ref="form" :items="items">
      <template #operator>
        <a-col :span="24">
          <a-transfer
            v-if="transfer"
            :dataSource="dataSource"
            :targetKeys="targetKeys"
            :showSearch="true"
            @change="onChange"
            :filter-option="filterOption"
            :leftColumns="leftColumns"
            :rightColumns="rightColumns"
            :showSelectAll="false"
          >
            <template
              slot="children"
              slot-scope="{
                props: { direction, filteredItems, selectedKeys, disabled: listDisabled },
                on: { itemSelectAll, itemSelect }
              }"
            >
              <a-table
                size="small"
                :columns="direction === 'left' ? leftColumns : rightColumns"
                :dataSource="filteredItems"
                :loading="direction === 'left' ? leftLoading : rightLoading"
                :rowSelection="getRowSelection({ disabled: listDisabled, selectedKeys, itemSelectAll, itemSelect })"
                :customRow="
                  ({ key, disabled: itemDisabled }) => ({
                    on: {
                      click: () => {
                        itemSelect(key, !itemDisabled && !selectedKeys.includes(key))
                      }
                    }
                  })
                "
              >
                <template slot="disabled" slot-scope="text">
                  <span :style="{ color: text > -0 ? '#F8AC59' :'#1AB394' }">
                    {{ text >0?'已创建应用':'未创建应用' }}
                  </span>
                </template>
                <template slot="capacity" slot-scope="text, record">
                  <a-input-number
                    :value="text"
                    :min="record.capacity"
                    :precision="0"
                    style="width: 100%"
                    @change="value => handleCapacityChange(value, record.key, 'capacity')"
                  />
                </template>
              </a-table>
            </template>
          </a-transfer>
        </a-col>
        <a-col :span="24" class="step-form-item-operator">
          <a-button @click="back">取消新建</a-button>
          <a-button @click="prev">上一步</a-button>
          <a-button type="primary" :loading="confirmLoading" :disabled="!targetKeys.length > 0" @click="nextStep">新建</a-button>
        </a-col>
      </template>
    </form-builder>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { difference } from 'lodash'
import { getAllVirtual } from '@/api/resource/virtual'
import { addApplication, getAllApplication } from '@/api/cdm/application'
import { getAllPool } from '@/api/storage/pool'
import { getDataCenter, getVMsByDataCenter } from '@/api/module/vmware'
import { MIcon, FormBuilder } from '@/components'
import { useStepFormItem } from '@/core/use/form'
import { convert, deepGet, handleFetchStateErrorDone, transformArray, toEnum, debounce } from '@/utils/util'
import { isRepeat } from '@/utils/validator'

export default {
  name: 'VmwareStep1',
  components: {
    FormBuilder,
    MIcon
  },
  setup (props, context) {
    const {
      back,
      prev,
      next
    } = useStepFormItem(props, context)
    return {
      back,
      prev,
      next
    }
  },
  data () {
    return {
      items: [
        {
          label: '应用名称',
          prop: 'name',
          rules: [
            { required: true, message: '请输入！' },
            { validator: debounce(async function (rule, value, callback) {
              const { valid, error } = await isRepeat(value, {
                fetchData: async () => {
                  try {
                    const data = deepGet(await getAllApplication({ name: value }), 'data', [])
                    return data
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
          label: '数据中心',
          prop: 'datacenter',
          rules: { required: true, message: '请选择！' },
          component: {
            name: 'm-select',
            on: {
              select: value => {
                this.handleDataCenterChange(value)
                value ? (this.transfer = true) : (this.transfer = false)
              }
            }
          }
        },
        {
          label: '快照池',
          prop: 'poolID',
          rules: { required: true, message: '请选择！' },
          component: {
            name: 'm-select',
            props: {
              optionLabelProp: 'title'
            }
          }
        }
      ],
      dataSource: [],
      targetKeys: [],
      selectedRowKeys: [],
      spec: null,
      transfer: false,
      leftLoading: false,
      rightLoading: false,
      rightLoaded: false,
      empty: {
        data: null
      },
      leftColumns: [
        {
          title: '名称',
          dataIndex: 'title',
          ellipsis: true
        },
        {
          title: '是否新建应用',
          dataIndex: 'disabled',
          scopedSlots: { customRender: 'disabled' }
        }
      ],
      rightColumns: [
        {
          title: '名称',
          dataIndex: 'title',
          ellipsis: true
        },
        {
          title: '容量（GB）',
          dataIndex: 'capacity',
          scopedSlots: { customRender: 'capacity' }
        }
      ],
      confirmLoading: false
    }
  },
  computed: {
    ...mapState({
      step1: state => state.cdmApplication.step['step1']
    })
  },
  methods: {
    async nextStep () {
      this.confirmLoading = true
      const { valid, values } = await this.$refs.form.validate()
      if (valid) {
        if (!this.targetKeys.length) {
          this.$message.info('请先选择虚拟机！')
          return
        }
        this.confirmLoading = true
        const arr = this.dataSource.filter(u => this.targetKeys.includes(u.ref))
        const instances = []
        arr.forEach(u => {
          const Obj = {
            vcenter: this.spec,
            datacenter: values.datacenter,
            vm_name: u.vm_name,
            ref: u.key,
            ips: u.ips,
            os: u.os,
            capacity: `${convert(u.capacity, 'unitSize', { unit: ['GB', 'B'] }).split(' ')[0]}`
          }
          instances.push({
            name: u.name,
            lbletId: this.step1.lblet.id,
            type: 1,
            kind: this.step1.module,
            spec: JSON.stringify(Obj)
          })
        })
        const params = {
          name: values.name,
          poolID: values.poolID,
          kind: this.step1.module,
          type: 1,
          virtualID: this.virId,
          instanceRelation: 1,
          instances
        }
        await addApplication(params)
        this.confirmLoading = false
        this.next()
      } else {
        this.confirmLoading = false
      }
    },
    async wakeData () {
      try {
        const data = deepGet(await getAllVirtual(), 'data', [])
        const virtual = data.find(u => u?.lbletId === this.step1.lblet?.id)
        this.spec = JSON.parse(deepGet(virtual, 'spec', '{}'))
        this.virId = virtual?.id
        this._getDataCenter()
        this._getAllPool()
      } catch (error) {}
    },
    async _getDataCenter () {
      try {
        this.datacenterList = deepGet(await getDataCenter({ virtualID: this.virId }), 'data', []).map(u => ({
          value: u.string,
          label: u.string
        }))
        transformArray(this.items, { prop: 'datacenter' }, { component: { props: { options: this.datacenterList } } })
      } catch (error) {
        transformArray(this.items, { prop: 'datacenter' }, { component: { props: { emptyItemProps: handleFetchStateErrorDone(error) } } })
      }
    },
    filterOption (inputValue, option) {
      return option.title.indexOf(inputValue) > -1
    },
    async _getAllPool () {
      try {
        const poolList = deepGet(await getAllPool({ type: 1 }), 'data', []).map(pool => ({
          value: pool?.id,
          label: (
            <div class="storage-pool">
              <div class="flex-row">
                <div>
                  <m-icon type={ toEnum(pool?.type, 'STORAGE_POOL_TYPE').icon } class="storage-pool-icon" />
                  { pool?.name }
                </div>
                <div>{ convert(pool?.free, 'unitSize') } / { convert(pool?.capacity, 'unitSize') }</div>
              </div>
              <div class="progress">
                <a-progress class="storage-pool-progress" strokeColor="#12bd5e" strokeWidth={ 12 } percent={pool?.free / pool?.capacity * 100 } showInfo={ false }/>
              </div>
            </div>
          ),
          title: pool?.name
        }))
        transformArray(this.items, { prop: 'poolID' }, { component: { props: { options: poolList } } })
      } catch (error) {
        transformArray(this.items, { prop: 'poolID' }, { component: { props: { emptyItemProps: handleFetchStateErrorDone(error) } } })
      }
    },
    async handleDataCenterChange (value) {
      this.dataSource = []
      this.targetKeys = []
      if (value) {
        try {
          this.leftLoading = true
          const GetVMs = deepGet(
            await getVMsByDataCenter({
              virId: this.virId,
              datacenter: value
            }), 'virtualMachines', [])
          this.dataSource = GetVMs.map(i =>
            Object.assign(i, {
              key: deepGet(i, 'ref'),
              title: deepGet(i, 'name'),
              ref: deepGet(i, 'ref'),
              vm_name: deepGet(i, 'name'),
              ips: deepGet(i, 'ips'),
              os: deepGet(i, 'os'),
              capacity: convert(deepGet(i, 'capacity'), 'unitSize', { unit: 'KB' }).split(' ')[0] * 1.5,
              disabled: deepGet(i, 'application_id', false)
            })
          )
          this.leftLoading = false
        } catch (error) {
          this.leftLoading = false
        }
      }
    },
    async onChange (nextTargetKeys, direction, moveKeys) {
      try {
        this.rightLoading = true
        this.rightLoaded = false
        this.targetKeys = nextTargetKeys
        this.rightLoading = false
      } catch (error) {
        this.rightLoading = false
      }
    },
    handleCapacityChange (value, key, column) {
      const newData = [...this.dataSource]
      const target = newData.filter(item => key === item.key)[0]
      if (target) {
        target[column] = value
        this.dataSource = newData
      }
    },
    getRowSelection ({ disabled, selectedKeys, itemSelectAll, itemSelect }) {
      return {
        getCheckboxProps: item => ({ props: { disabled: disabled || item.disabled } }),
        onSelectAll (selected, selectedRows) {
          const treeSelectedKeys = selectedRows.filter(item => !item.disabled).map(({ key }) => key)
          const diffKeys = selected
            ? difference(treeSelectedKeys, selectedKeys)
            : difference(selectedKeys, treeSelectedKeys)
          itemSelectAll(diffKeys, selected)
        },
        onSelect ({ key }, selected) {
          itemSelect(key, selected)
        },
        selectedRowKeys: selectedKeys
      }
    },
    toEnum,
    convert
  }
}
</script>

<style lang="less" scoped>
  .step-form-content {
    .step-form-item {
      max-width: 700px;
    }
  }
</style>
