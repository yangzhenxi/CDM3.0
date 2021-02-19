<template>
  <div class="step-form-item">
    <m-table
      :rowKey="rowKey"
      :columns="columns"
      :dataSource="data"
      :rowSelection="rowSelection"
      :rowClassName="rowClassName"
      :scroll="scroll"
      :pagination="false"
    >
      <template slot="dbSize" slot-scope="text">
        {{ text | convert('unitSize') }}
      </template>
      <template slot="instanceName" slot-scope="text, r">
        <editable-cell
          :ref="`editable_instanceName_${deepGet(r, 'id')}`"
          :item="getEditableItem(text, r, 'instanceName')"
          @change="value => { r['instanceName'] = value }"
        />
      </template>
    </m-table>
    <div class="step-form-item-operator" style="margin-top: 16px">
      <a-button @click="back">取消新建</a-button>
      <a-button @click="prev">上一步</a-button>
      <a-button type="primary" @click="nextStep">下一步</a-button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { useStepFormItem, useTableContext } from '@/core/use'
import { EditableCell } from '@/components'
import { deepGet } from '@/utils/util'

export default {
  name: 'PgsqlStep2',
  components: {
    EditableCell
  },
  setup (props, context) {
    const {
      back,
      prev,
      next,
      setStepData
    } = useStepFormItem(props, context)
    const columns = [
      {
        title: '实例名',
        dataIndex: 'instanceName',
        width: 70,
        ellipsis: true,
        scopedSlots: { customRender: 'instanceName' }
      },
      {
        title: '数据库',
        dataIndex: 'dbName',
        width: 100,
        ellipsis: true
      },
      {
        title: 'IP',
        dataIndex: 'ipAddr',
        width: 152
      },
      {
        title: '数据库路径',
        dataIndex: 'databasePath',
        width: 100,
        ellipsis: true
      },
      {
        title: '数据库大小',
        dataIndex: 'dbSize',
        width: 100,
        scopedSlots: { customRender: 'dbSize' }
      },
      {
        title: '版本',
        dataIndex: 'version',
        width: 100,
        ellipsis: true
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
      rowSelection,
      rowClassName,
      scroll
    }
  },
  data () {
    return {
      data: []
    }
  },
  computed: {
    ...mapState({
      step1: state => state.cdmApplication.step['step1'],
      pgsqlStep1: state => state.cdmApplication.step['pgsqlStep1']
    })
  },
  methods: {
    async nextStep () {
      this.confirmLoading = true
      const { selectedRows } = this.rowSelection
      if (!selectedRows.length) {
        this.$message.info('请先选择数据库！')
        this.confirmLoading = false
        return
      }
      let isValid = true
      const { valid } = await this.$refs[`editable_instanceName_0`].validate()
      if (!valid) {
        isValid = false
      }
      if (isValid) {
        this.setStepData({
          data: {
            instance: {
              name: selectedRows[0].instanceName,
              type: 1,
              kind: this.step1.module,
              lbletId: +this.step1.lblet?.id,
              spec: this.pgsqlStep1.spec
            }
          }
        })
        this.next()
      }
      this.confirmLoading = false
    },
    getEditableItem (value, record = {}, prop) {
      const rules = {
        instanceName: [{ required: true, message: '请输入！' }]
      }
      const item = {
        prop,
        value,
        rules: rules[prop],
        editable: record[`editable_${prop}`]
      }
      switch (prop) {
      case 'instanceName':
        item.component = {
          name: 'a-input'
        }
        break
      }
      return item
    },
    wakeData () {
      this.data = [{
        id: 0,
        instanceName: this.pgsqlStep1.databaseList[0].dbName,
        editable_instanceName: true,
        ...this.pgsqlStep1.databaseList[0]
      }]
    },
    deepGet
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
