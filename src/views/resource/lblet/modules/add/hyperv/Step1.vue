<template>
  <div class="step-form-item">
    <form-builder ref="form" :items="items">
      <template #operator>
        <a-col :span="24">
          <a-transfer
            :dataSource="dataSource"
            :targetKeys="targetKeys"
            :showSearch="true"
            @change="onChange"
            :filterOption="
              (inputValue, item) => {
                return (
                  deepGet(item, 'spec.vmname').indexOf(inputValue) !== -1 ||
                  convert(item.disabled, 'R_LBLET_OF_APP_PROTECT').indexOf(inputValue) !== -1
                )
              }
            "
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
                <template v-for="col in ['capacity']" :slot="col" slot-scope="text, record">
                  <div :key="col">
                    <a-input-number
                      :value="text"
                      :min="record.minCap"
                      :precision="0"
                      style="width: 100%"
                      @change="value => handleCapacityChange(value, record.key, col)"
                    />
                  </div>
                </template>
              </a-table>
            </template>
          </a-transfer>
        </a-col>
        <a-col :span="24" class="step-form-item-operator">
          <a-button @click="back">取消创建</a-button>
          <a-button @click="prev">上一步</a-button>
          <a-button type="primary" :loading="confirmLoading" :disabled="!targetKeys.length>0" @click="nextStep">创建</a-button>
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
import { getHyperVVCList } from '@/api/module/hyperv'
import { MIcon, FormBuilder } from '@/components'
import { useStepFormItem } from '@/core/use/form'
import { convert, deepGet, handleFetchStateErrorDone, transformArray, toEnum, debounce } from '@/utils/util'
import { isRepeat } from '@/utils/validator'

export default {
  name: 'HypervStep1',
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
      leftLoading: false,
      rightLoading: false,
      rightLoaded: false,
      empty: {
        state: 'empty',
        data: null
      },
      leftColumns: [
        {
          title: '名称',
          dataIndex: 'vm_name',
          ellipsis: true
        },
        {
          title: '是否创建应用',
          dataIndex: 'disabled',
          scopedSlots: { customRender: 'disabled' }
        }
      ],
      rightColumns: [
        {
          title: '名称',
          dataIndex: 'vm_name',
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
          this.confirmLoading = false
          return
        }
        const arr = this.dataSource.filter(u => this.targetKeys.includes(u.key))
        const instances = []
        arr.forEach(u => {
          const Obj = {
            vm_name: u.vm_name,
            uuid: u.key,
            capacity: `${convert(u.capacity, 'unitSize', { unit: ['GB', 'B'] }).split(' ')[0] * 1.5}`
          }
          instances.push({
            name: u.vm_name,
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
        try {
          await addApplication(params)
          this.confirmLoading = false
          this.next()
        } catch (error) {
          this.confirmLoading = false
        }
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
        this._getAllPool()
        this._gethyperV()
      } catch (error) {}
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
    async _gethyperV () {
      this.dataSource = []
      this.targetKeys = []
      try {
        this.leftLoading = true
        const GetVMs = deepGet(
          await getHyperVVCList({
            virtualID: this.virId
          }), 'virtualMachines', [])
        this.dataSource = GetVMs.map(i =>
          Object.assign(i, {
            key: deepGet(i, 'vmid'),
            vm_name: deepGet(i, 'name'),
            capacity: convert(deepGet(i, 'capacity'), 'unitSize', { unit: 'KB' }).split(' ')[0],
            disabled: deepGet(i, 'application_id', false)
          })
        )
        this.leftLoading = false
      } catch (error) {
        this.empty = handleFetchStateErrorDone(error)
        this.leftLoading = false
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
