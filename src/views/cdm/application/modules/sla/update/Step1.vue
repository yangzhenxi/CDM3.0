<template>
  <div>
    <a-row type="flex" justify="center">
      <a-col :span="16">
        <a-transfer
          :dataSource="data"
          :targetKeys="targetKeys"
          :showSearch="true"
          @change="onChange"
          :filterOption="(inputValue, item) => item.title.indexOf(inputValue) !== -1"
          :leftColumns="leftColumns"
          :rightColumns="rightColumns"
          :showSelectAll="false">
          <template
            slot="children"
            slot-scope="{
              props: {
                direction,
                filteredItems,
                selectedKeys,
                disabled: listDisabled
              }, on: {
                itemSelectAll,
                itemSelect,
              }
            }">
            <a-table
              size="small"
              :columns="direction === 'left' ? leftColumns : rightColumns"
              :dataSource="filteredItems"
              :loading="direction === 'left' ? leftLoading : rightLoading"
              :rowSelection="getRowSelection({disabled: listDisabled, selectedKeys, itemSelectAll, itemSelect})"
              :customRow="({ key, disabled: itemDisabled }) => ({
                on: {
                  click: () => {
                    itemSelect(key, !itemDisabled && !selectedKeys.includes(key))
                  }
                }
              })">
              <template v-for="col in ['capacity']" :slot="col" slot-scope="text">
                <div :key="col">
                  {{ text | convert('unitSize') }}
                </div>
              </template>
            </a-table>
          </template>
        </a-transfer>
      </a-col>
    </a-row>
    <div class="step-form-item-operator">
      <a-button @click="back">取消新建</a-button>
      <a-button type="primary" :loading="confirmLoading" @click="nextStep">下一步</a-button>
    </div>
  </div>
</template>

<script>
import { difference } from 'lodash'
import { useStepFormItem } from '@/core/use/form'
import { deepGet } from '@/utils/util'
import { getAllPool } from '@/api/storage/pool'
import { mapState } from 'vuex'

export default {
  name: 'Step1',
  setup (props, context) {
    const { back, next } = useStepFormItem(props, context)
    return {
      back,
      next
    }
  },
  data () {
    return {
      confirmLoading: false,
      leftColumns: [
        {
          title: '压缩池名称',
          dataIndex: 'title'
        },
        {
          title: '总容量',
          dataIndex: 'capacity',
          scopedSlots: { customRender: 'capacity' }
        }
      ],
      rightColumns: [
        {
          title: '压缩池名称',
          dataIndex: 'title'
        },
        {
          title: '总容量',
          dataIndex: 'capacity',
          scopedSlots: { customRender: 'capacity' }
        }
      ],
      data: [],
      targetKeys: [],
      leftLoading: false,
      rightLoading: false,
      poolList: []
    }
  },
  computed: {
    ...mapState({
      redupPools: state => state.resourceSLA.step['step1'].redupPools
    })
  },
  created () {
    this.loadData()
  },
  methods: {
    async loadData () {
      this.leftLoading = true
      this.targetKeys = []
      this.dataSource = []
      this.poolList = deepGet(await getAllPool(), 'data.items', [])
      this.poolList.map((u, index) => {
        if (deepGet(u, 'type') !== 'localRedup') {
          this.data.push({
            key: deepGet(u, 'name'),
            title: deepGet(u, 'name'),
            capacity: deepGet(u, 'capacity')
          })
        }
      })
      this.targetKeys = this.redupPools
      this.leftLoading = false
    },
    nextStep () {
      const redupPools = this.data.filter(u => this.targetKeys.includes(u.key)).map(u => u.title)
      this.confirmLoading = true
      this.$emit('setStepData', {
        key: false,
        data: {
          redupPools,
          redupPoolList: this.poolList.filter(u => ['localRedup'].includes(deepGet(u, 'spec.type'))),
          remotePoolList: this.poolList.filter(u => ['remoteRedup', 'cloud'].includes(deepGet(u, 'spec.type')))
        }
      })
      this.confirmLoading = false
      this.next()
    },
    onChange (nextTargetKeys) {
      this.targetKeys = nextTargetKeys
    },
    getRowSelection ({ disabled, selectedKeys, itemSelectAll, itemSelect }) {
      return {
        getCheckboxProps: item => ({ props: { disabled: disabled || item.disabled } }),
        onSelectAll (selected, selectedRows) {
          const treeSelectedKeys = selectedRows
            .filter(item => !item.disabled)
            .map(({ key }) => key)
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
    }
  }
}
</script>

<style lang="less" scoped>
.btns {
	text-align: center;
	margin-top: 30px;
}
</style>
