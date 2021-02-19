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
      <template v-for="u in ['instanceName', 'sizeDB']" :slot="u" slot-scope="text, r">
        <div :key="u">
          <editable-cell
            :ref="`editable_${u}_${deepGet(r, 'id')}`"
            :item="getEditableItem(text, r, u)"
            @change="value => { r[u] = value }"
          />
        </div>
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
import { columnsBuild, deepGet, convert } from '@/utils/util'

export default {
  name: 'MysqlStep2',
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
        modules: ['cdm', 'backup'],
        scopedSlots: { customRender: 'instanceName' }
      },
      {
        title: '数据库名',
        dataIndex: 'databaseName',
        width: 100,
        modules: ['backup']
      },
      {
        title: '数据库类型',
        dataIndex: 'service',
        width: 100,
        modules: ['cdm', 'backup']
      },
      {
        title: 'IP',
        dataIndex: 'ipAddr',
        width: 152,
        modules: ['cdm', 'backup']
      },
      {
        title: 'binlog',
        dataIndex: 'binlog',
        width: 150,
        ellipsis: true,
        modules: ['cdm', 'backup']
      },
      {
        title: '数据库路径',
        dataIndex: 'databasePath',
        width: 150,
        ellipsis: true,
        modules: ['cdm', 'backup']
      },
      {
        title: '版本',
        dataIndex: 'version',
        width: 100,
        ellipsis: true,
        modules: ['cdm', 'backup']
      },
      {
        title: '数据库大小',
        dataIndex: 'dbSize',
        width: 100,
        modules: ['cdm'],
        scopedSlots: { customRender: 'dbSize' }
      },
      {
        title: '数据库大小(GB)',
        dataIndex: 'sizeDB',
        width: 100,
        modules: ['backup'],
        scopedSlots: { customRender: 'sizeDB' }
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
      mysqlStep1: state => state.cdmApplication.step['mysqlStep1']
    })
  },
  methods: {
    async  nextStep () {
      this.confirmLoading = true
      const { selectedRows } = this.rowSelection
      if (!selectedRows.length) {
        this.$message.info('请先选择数据库！')
        this.confirmLoading = false
        return
      }
      let isValid = true
      const instance = []
      await Promise.all(selectedRows.map(u => {
        const type = +deepGet(this.$route.query, 'type', 1)
        Object.keys(u).map(async i => {
          if (i.includes('editable')) {
            const { valid } = await this.$refs[`${i}_${u?.id}`][0].validate()
            if (!valid) {
              isValid = false
            }
          }
        })
        const spec = this.mysqlStep1.spec
        if (+type === 2) {
          spec.sizeDB = `${convert(u?.sizeDB, 'unitSize', { unit: ['GB', 'B'] }).split(' ')[0]}`
          spec.backupDatabase = deepGet(u, 'databaseName')
        }
        instance.push({
          name: u.instanceName,
          type,
          kind: this.step1.module,
          lbletId: +this.step1.lblet?.id,
          spec: +type === 2 ? JSON.stringify(spec) : spec
        })
      }))
      if (isValid) {
        this.setStepData({
          data: {
            instance
          }
        })
        this.next()
      }
      this.confirmLoading = false
    },
    getEditableItem (value, record = {}, prop) {
      const rules = {
        instanceName: { required: true, message: '请输入！' },
        sizeDB: { required: true, message: '请输入！' }
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
      case 'sizeDB':
        item.component = {
          name: 'a-input-number',
          props: {
            min: 1,
            max: 30,
            precision: 0
          },
          style: {
            width: '100%'
          }
        }
        break
      }
      return item
    },
    wakeData () {
      const type = +deepGet(this.$route.query, 'type', 1)
      if (type === 2) {
        this.columns = columnsBuild(this.columns, 'backup')
        this.rowSelection.type = 'checkbox'
      } else {
        this.columns = columnsBuild(this.columns, 'cdm')
        this.rowSelection.type = 'radio'
      }
      this.data = this.mysqlStep1.databaseList.map((u, index) => {
        let sizeDB = +convert(u?.sizeDB, 'unitSize', { unit: ['B', 'GB'] }).split(' ')[0]
        if (type === 2) {
          sizeDB = +sizeDB[0] > 10 ? +sizeDB[0] : 10
        }
        return {
          ...u,
          id: index,
          sizeDB,
          instanceName: u?.service,
          editable_sizeDB: true,
          editable_instanceName: true
        }
      })
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
