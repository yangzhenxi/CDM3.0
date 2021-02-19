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
      <a-button type="primary" :loading="confirmLoading" @click="nextStep">下一步</a-button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { EditableCell } from '@/components'
import { EMPTY_VALUE } from '@/config/constant.config'
import { useStepFormItem, useTableContext } from '@/core/use'
import { convert, deepGet } from '@/utils/util'

export default {
  name: 'MssqlStep2',
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
        width: 100,
        ellipsis: true,
        scopedSlots: { customRender: 'instanceName' }
      },
      {
        title: '数据库名',
        dataIndex: 'databaseName',
        width: 80,
        ellipsis: true
      },
      {
        title: 'IP',
        dataIndex: 'ip',
        width: 152
      },
      {
        title: '总容量',
        dataIndex: 'size',
        width: 80,
        scopedSlots: { customRender: 'size' }
      },
      {
        title: 'mdfPath',
        dataIndex: 'mdfpaths',
        width: 100,
        ellipsis: true,
        scopedSlots: { customRender: 'more-popover' }
      },
      {
        title: 'ldfPath',
        dataIndex: 'ldfpaths',
        width: 100,
        ellipsis: true,
        scopedSlots: { customRender: 'more-popover' }
      },
      {
        title: '保护容量（GB）',
        width: 120,
        dataIndex: 'sizeDB',
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
      step1: state => state.cdmApplication.step['step1'],
      mssqlStep1: state => state.cdmApplication.step['mssqlStep1']
    })
  },
  methods: {
    async nextStep () {
      const { selectedRows } = this.rowSelection
      if (!selectedRows.length) {
        this.$message.info('请先选择数据库！')
        return
      }
      this.confirmLoading = true
      const instances = []
      let isValid = true
      await Promise.all(selectedRows.map(u => {
        Object.keys(u).map(async i => {
          if (i.includes('editable')) {
            const { valid } = await this.$refs[`${i}_${u?.id}`][0].validate()
            if (!valid) {
              isValid = false
            }
          }
        })
        this.mssqlStep1.spec.sizeDB = `${convert(deepGet(u, 'sizeDB', ''), 'unitSize', { unit: ['GB', 'B'] }).split(' ')[0]}`
        this.mssqlStep1.spec.backupDatabase = deepGet(u, 'databaseName')
        const type = +deepGet(this.$route.query, 'type', 1)
        instances.push({
          name: deepGet(u, 'instanceName'),
          kind: +this.step1.module,
          type,
          lbletId: +this.step1.lblet?.id,
          spec: JSON.stringify(this.mssqlStep1.spec)
        })
      }))
      if (isValid) {
        this.setStepData({
          data: {
            instances
          }
        })
        this.confirmLoading = false
        this.next()
      } else {
        this.confirmLoading = false
      }
    },
    wakeData () {
      this.data = this.mssqlStep1.databaseList.map((u, index) => {
        const mdfpaths = deepGet(u, 'mdf', []).map(u => u?.mdfPath)
        const ldfpaths = deepGet(u, 'ldf', []).map(u => u?.ldfPath)
        const size = [...deepGet(u, 'mdf', []), ...deepGet(u, 'ldf', [])].reduce((pre, cur) => pre + +deepGet(cur, 'size', 0), 0)
        return {
          id: index,
          ip: u?.ip,
          databaseName: u?.databaseName,
          size,
          mdfpaths,
          ldfpaths,
          sizeDB: u?.sizeDB,
          instanceName: u?.databaseName,
          editable_sizeDB: true,
          editable_instanceName: true,
          disabled: false
        }
      })
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
