<template>
  <div class="step-form-item">
    <m-table
      :rowKey="rowKey"
      :columns="columns"
      :dataSource="data"
      :rowClassName="rowClassName"
      :scroll="scroll"
      :pagination="false"
    >
      <template slot="size" slot-scope="text">
        {{ text | convert('unitSize') }}
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
    </m-table>
    <div class="step-form-item-operator" style="margin-top: 16px">
      <a-button @click="back">取消新建</a-button>
      <a-button @click="prev">上一步</a-button>
      <a-button type="primary" :loading="confirmLoading" @click="nextStep">下一步</a-button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { EditableCell } from '@/components'
import { EMPTY_VALUE } from '@/config/constant.config'
import { useStepFormItem, useTableContext } from '@/core/use'
import { deepGet } from '@/utils/util'

export default {
  name: 'MssqlStep2',
  components: {
    EditableCell
  },
  setup (props, context) {
    const { back, prev, next, setStepData } = useStepFormItem(props, context)
    const columns = [
      {
        title: '数据库类型',
        dataIndex: 'server',
        width: 80,
        ellipsis: true
      },
      {
        title: '数据库名',
        dataIndex: 'databaseName',
        width: 80,
        ellipsis: true
      },
      {
        title: 'IP',
        dataIndex: 'ipAddr',
        width: 152
      },
      {
        title: 'binlog',
        dataIndex: 'binlog',
        width: 150,
        ellipsis: true
      },
      {
        title: '数据库路径',
        dataIndex: 'databasePath',
        width: 150,
        ellipsis: true
      },
      {
        title: '版本',
        dataIndex: 'version',
        width: 100,
        ellipsis: true
      }
    ]
    const { rowKey, rowSelection, scroll, rowClassName } = useTableContext({
      columns,
      rowSelection: {
        getCheckboxProps: record => ({
          props: {
            disabled: record.disabled
          }
        })
      }
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
      data: [],
      confirmLoading: false,
      EMPTY_VALUE
    }
  },
  computed: {
    ...mapState({
      step1: state => state.cdmCloneSet.recover.step['step1'],
      mysqlStep1: state => state.cdmCloneSet.recover.step['mysqlStep1']
    })
  },
  methods: {
    async nextStep () {
      this.confirmLoading = true
      this.next()
      this.confirmLoading = false
    },
    wakeData () {
      const mysqlInfo = deepGet(this.mysqlStep1, 'mysqlInfo')
      const Mysql = deepGet(this.mysqlStep1, 'Mysql')
      const lblet = deepGet(this.step1, 'lblet')
      this.data = [
        {
          binlog: mysqlInfo?.binlog,
          databasePath: mysqlInfo?.databasePath,
          version: mysqlInfo?.version,
          ipAddr: lblet?.ipAddr,
          server: Mysql.spec,
          databaseName: Mysql.database
        }
      ]
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
