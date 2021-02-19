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
      <template slot="newDatabaseName" slot-scope="text, r">
        <div>
          <editable-cell
            :ref="`editable_newDatabaseName`"
            :item="getEditableItem(text, r, 'newDatabaseName')"
            @change="
              value => {
                r['newDatabaseName'] = value
              }
            "
          />
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
import { deepGet, debounce } from '@/utils/util'
import { isRepeat } from '@/utils/validator'

export default {
  name: 'MssqlStep2',
  components: {
    EditableCell
  },
  setup (props, context) {
    const { back, prev, next, setStepData } = useStepFormItem(props, context)
    const columns = [
      {
        title: '新库名',
        dataIndex: 'newDatabaseName',
        width: 100,
        ellipsis: true,
        scopedSlots: { customRender: 'newDatabaseName' }
      },
      {
        title: '数据库名',
        dataIndex: 'backupDatabase',
        width: 80,
        ellipsis: true
      },
      {
        title: 'IP',
        dataIndex: 'ip',
        width: 152
      },
      {
        title: '数据源',
        dataIndex: 'dataSource',
        width: 100,
        ellipsis: true
      },
      {
        title: 'user',
        dataIndex: 'user',
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
      mssqlStep1: state => state.cdmCloneSet.recover.step['mssqlStep1']
    })
  },
  methods: {
    async nextStep () {
      this.confirmLoading = true
      const newDatabaseName = []
      let isValid = true
      await Promise.all(
        ['editable_newDatabaseName'].map(async u => {
          const { valid, values } = await this.$refs[u].validate()
          newDatabaseName.push(deepGet(values, 'newDatabaseName'))
          if (!valid) {
            isValid = false
          }
        })
      )
      if (isValid) {
        this.setStepData({
          data: {
            newDatabaseName: newDatabaseName[0]
          }
        })
        this.confirmLoading = false
        this.next()
      } else {
        this.confirmLoading = false
      }
    },
    wakeData () {
      const spec = deepGet(this.mssqlStep1, 'spec')
      this.data = [
        {
          newDatabaseName: null,
          ip: spec.ip,
          port: spec.port,
          user: spec.user,
          backupDatabase: spec.backupDatabase,
          dataSource: spec.dataSource,
          editable_newDatabaseName: true
        }
      ]
    },
    getEditableItem (value, record = {}, prop) {
      const databases = deepGet(this.mssqlStep1, 'databases')
      const rules = {
        newDatabaseName: [
          { required: true, message: '请输入！' },
          {
            validator: debounce(async function (rule, value, callback) {
              const { valid, error } = await isRepeat(value, {
                fetchData: async () => {
                  try {
                    let data = []
                    databases.includes(value) ? data = ['1'] : data = []
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
            })
          }
        ]
      }
      const item = {
        prop,
        value,
        rules: rules[prop],
        editable: record[`editable_${prop}`],
        component: {
          name: 'a-input'
        }
      }
      return item
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
