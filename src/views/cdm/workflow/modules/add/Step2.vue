<template>
  <div class="step-form-item">
    <s-table
      ref="table"
      :columns="columns"
      :fetchData="fetchData"
      :rowSelection="{ type: 'radio'}"
      :rowClick="true"
    >
      <template slot="kind" slot-scope="text">
        <m-icon :type="toEnum(text, 'CDM_APPLICATION_MODULE').icon" style="font-size: 24px" />
      </template>
      <template slot="state" slot-scope="text">
        <m-tag :color="toEnum(text, 'CDM_APPLICATION_STATE').color">{{ text | convert('CDM_INSTANCE_STATE') }}</m-tag>
      </template>
    </s-table>
    <div class="step-form-item-operator" style="margin-top: 16px">
      <a-button @click="back">取消新建</a-button>
      <a-button @click="prev">上一步</a-button>
      <a-button type="primary" :loading="confirmLoading" @click="nextStep">下一步</a-button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { STable, MIcon } from '@/components'
import { useStepFormItem, useTableContext } from '@/core/use'
import { toEnum } from '@/utils/util'

export default {
  name: 'Step2',
  components: {
    STable,
    MIcon
  },
  setup (props, context) {
    const { back, next, prev, setStepData } = useStepFormItem(props, context)
    const columns = [
      {
        title: '实例名',
        dataIndex: 'name',
        width: 100,
        ellipsis: true
      },
      {
        title: '类型',
        dataIndex: 'kind',
        width: 80,
        scopedSlots: { customRender: 'kind' }
      },
      {
        title: 'IP',
        dataIndex: 'spec.ip',
        width: 152,
        scopedSlots: { customRender: 'os' }
      },
      {
        title: '存储容量',
        dataIndex: 'spec.sizeDB',
        width: 108,
        scopedSlots: { customRender: 'unitSize' }
      },
      {
        title: '创建时间',
        dataIndex: 'createdAt',
        width: 182,
        scopedSlots: { customRender: 'unixToDate' }
      },
      {
        title: '状态',
        dataIndex: 'state',
        width: 100,
        scopedSlots: { customRender: 'state' }
      }
    ]
    const {
      rowKey,
      rowSelection,
      scroll,
      rowClassName
    } = useTableContext({
      columns,
      rowSelection: {}
    })
    return {
      back,
      next,
      prev,
      setStepData,
      rowKey,
      columns,
      rowClassName,
      rowSelection,
      scroll
    }
  },
  data () {
    return {
      fetchData: async params => {
        let data = this.step1.app.instances
        data = data.map(u => {
          u.spec = JSON.parse(u.spec)
          return u
        })
        return {
          data
        }
      },
      confirmLoading: false
    }
  },
  computed: {
    ...mapState({
      step1: state => state.cdmWorkflow.step['step1']
    })
  },
  methods: {
    nextStep () {
      this.confirmLoading = true
      const { selectedRows } = this.$refs.table.localRowSelection
      if (!selectedRows.length) {
        this.$message.info('请先选择实例！')
        this.confirmLoading = false
        return
      }
      this.confirmLoading = true
      setTimeout(() => {
        this.setStepData({
          data: {
            instanceID: selectedRows[0].id
          }
        })
        this.confirmLoading = false
        this.next()
      }, 1000)
    },
    toEnum
  }
}
</script>

<style lang="less" scoped>
  .step-form-content {
    .step-form-item {
      max-width: 100%;
    }
  }
</style>
