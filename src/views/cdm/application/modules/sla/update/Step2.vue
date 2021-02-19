<template>
  <div class="content-wrapper">
    <form-builder ref="form" :items="items" style="max-width: 500px; margin: 0 auto;">
    </form-builder>
    <a-divider />
    <s-operator :config="operatorConfig" />
    <a-form :form="form">
      <a-table
        :loading="loading"
        :columns="columns"
        :dataSource="data"
        :pagination="false"
        :scroll="{ y: 350 }"
        :rowSelection="{selectedRowKeys, type, onChange: onSelectChange}"
        :rowClassName="rowClassName">
        <template slot="redupPool" slot-scope="text, record, index">
          <editable-cell
            :defaultEditable="record[`editable_redupPool_${index}`]"
            :decoratorOptions="rules['redupPool']"
            formType="select"
            placeholder="请选择"
            :value="`redupPool_${index}`"
            :text="text"
            @click="value => record[`editable_${value}`] = true"
            @blur="value => record[`editable_${value}`] = !text"
            @valueChange="onCellChange(record.key, 'redupPool', $event)">
            <a-select-option v-for="(item, j) in redupPoolList" :key="`redup-${j}`" :value="deepGet(item, 'metadata.name')" :disabled="item.disabled">{{ deepGet(item, 'metadata.name') }}
            </a-select-option>
          </editable-cell>
        </template>
        <template slot="remotePool" slot-scope="text, record, index">
          <editable-cell
            :defaultEditable="record[`editable_remotePool_${index}`]"
            :decoratorOptions="rules['remotePool']"
            formType="select"
            placeholder="请选择"
            :value="`remotePool_${index}`"
            :text="text"
            @click="value => record[`editable_${value}`] = true"
            @blur="value => record[`editable_${value}`] = !text"
            @valueChange="onCellChange(record.key, 'remotePool', $event)">
            <a-select-option v-for="(item, j) in remotePoolList" :key="`remote-${j}`" :value="deepGet(item, 'metadata.name')" :disabled="item.disabled">{{ deepGet(item, 'metadata.name') }}
            </a-select-option>
          </editable-cell>
        </template>
        <template v-for="col in ['redupKeepDays', 'remoteKeepDays']" :slot="col" slot-scope="text, record, index">
          <div :key="col">
            <editable-cell
              :defaultEditable="record[`editable_${col}_${index}`]"
              :decoratorOptions="rules[col]"
              formType="input-number"
              :value="`${col}_${index}`"
              :text="text"
              @click="value => record[`editable_${value}`] = true"
              @blur="value => record[`editable_${value}`] = !text"
              @valueChange="onCellChange(record.key, col, $event)" />
          </div>
        </template>
      </a-table>
    </a-form>
    <div class="step-form-item-operator">
      <a-button @click="back">取消新建</a-button>
      <a-button @click="prevStep" style="margin-right: 8px">上一步</a-button>
      <a-button type="primary" :loading="confirmLoading" @click="nextStep">新建</a-button>
    </div>
  </div>
</template>

<script>
import { MIcon, FormBuilder, SOperator, EditableCell, STable } from '@/components'
import { isEmpty, deepGet, throttle } from '@/utils/util'
import { useStepFormItem } from '@/core/use/form'
import { mapState } from 'vuex'
export default {
  name: 'Step2',
  components: {
    EditableCell,
    FormBuilder,
    SOperator,
    STable,
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
      data: [],
      loading: false,
      confirmLoading: false,
      type: 'checkbox',
      redupPoolList: [],
      remotePoolList: [],
      selectedRows: [],
      selectedRowKeys: [],
      rules: {
        redupPool: {
          rules: { required: true, message: '请选择！' }
        },
        redupKeepDays: {
          rules: { required: true, message: '请输入！' }
        }
      },
      form: this.$form.createForm(this),
      items: [
        {
          label: 'SLA名称',
          prop: 'name',
          rules: { required: true, message: '请输入！' },
          component: {
            name: 'a-input'
          }
        },
        {
          label: '原池保留时间 （天）',
          prop: 'keep',
          rules: { required: true, message: '请输入！' },
          component: {
            name: 'a-input-number',
            props: {
              min: 0,
              precision: 0
            },
            style: {
              width: '100%'
            }
          }
        }
      ],
      columns: [
        {
          title: '压缩池',
          dataIndex: 'redupPool',
          scopedSlots: { customRender: 'redupPool' }
        },
        {
          title: '保留天数（天）',
          dataIndex: 'redupKeepDays',
          scopedSlots: { customRender: 'redupKeepDays' }
        },
        {
          title: '远端池',
          dataIndex: 'remotePool',
          scopedSlots: { customRender: 'remotePool' }
        },
        {
          title: '保留天数（天）',
          dataIndex: 'remoteKeepDays',
          scopedSlots: { customRender: 'remoteKeepDays' }
        }
      ],
      operatorConfig: {
        fields: [
          {
            key: 'layouts.table.operator.new',
            props: {
              type: '',
              icon: 'plus'
            },
            onClick: throttle(() => {
              this.handleAdd()
            })
          },
          {
            key: '批量删除',
            props: {
              type: 'danger',
              icon: 'delete'
            },
            onClick: throttle(() => {
              this.handleDelete()
            })
          }
        ]
      },
      rowClassName: (record, index) =>
        record.disabled ? 'table-row-disabled' : index % 2 !== 0 ? 'table-row-odd' : ''
    }
  },
  computed: {
    ...mapState({
      record: (state) => state.resourceSLA.step['step0'],
      redupPools: (state) => state.resourceSLA.step['step1'].redupPools,
      _redupPoolList: (state) => state.resourceSLA.step['step1'].redupPoolList,
      _remotePoolList: (state) => state.resourceSLA.step['step1'].remotePoolList,
      keepDays: (state) => state.resourceSLA.step['step2'].keepDays,
      tree: (state) => state.resourceSLA.step['step2'].tree
    })
  },
  created () {
    this.loadData()
  },
  methods: {
    loadData () {
      this.$nextTick(() => {
        setTimeout(() => {
          this.form.setFieldsValue({
            keepDays: this.keepDays
          })
        })
      })
      this.tree.map((u) => {
        const pool = {
          key: this.data.length,
          redupPool: deepGet(u, 'target.pool'),
          redupKeepDays: deepGet(u, 'target.KeepDays'),
          remotePool: deepGet(u, 'next.target.pool'),
          remoteKeepDays: deepGet(u, 'next.target.KeepDays')
        };
        ['redupPool', 'redupKeepDays', 'remotePool', 'remoteKeepDays'].map((u) => {
          pool[`editable_${u}_${this.data.length}`] = false
        })
        this.data.push(pool)
      })

      // 当没有选择压缩池时，置空
      if (this.redupPools.length === 0) {
        this.data = []
      }
      // 取压缩池并集
      const rowsRedupPool = [
        ...this.redupPools.map(u => {
          const e = this.data.find(i => i.redupPool === u)
          if (e) {
            return e
          } else {
            return {
              redupPool: u
            }
          }
        })
        // 保留自己添加的或者是修改之前的源数据
        // ...this.data.filter(u => !this.redupPools.includes(u.redupPool))
      ]
      this.data = rowsRedupPool.map((u, index) => {
        // 是否已经有该压缩池行
        let pool = {}
        if (!isEmpty(u.key)) {
          pool = {
            key: index,
            redupPool: u.redupPool,
            redupKeepDays: u.redupKeepDays,
            remotePool: u.remotePool,
            remoteKeepDays: u.remoteKeepDays
          }
        } else {
          pool = {
            key: index,
            redupPool: u.redupPool,
            redupKeepDays: '',
            remotePool: '',
            remoteKeepDays: ''
          }
        };
        ['redupPool', 'redupKeepDays', 'remotePool', 'remoteKeepDays'].map(i => {
          pool[`editable_${i}_${index}`] = false
        })
        return pool
      })
      // 重新排序，获得实际序号上的值
      this.data.map((u, index) => {
        const fields = {};
        ['redupPool', 'redupKeepDays', 'remotePool', 'remoteKeepDays'].map(i => {
          fields[`${i}_${index}`] = u[i] // 清空原来的数据，否则 form-item value 会传递下来
        })
        this.$nextTick(() => {
          setTimeout(() => {
            this.form.setFieldsValue(fields)
          })
        })
      })
      this.setPoolList()
    },
    async nextStep () {
      this.confirmLoading = true
      const { valid } = await this.$refs.form.validate()
      this.form.validateFields(async (err, TableForm) => {
        if (!err && valid) {
          try {
            this.next()
            this.confirmLoading = false
          } catch (error) {
            console.log(error)
            this.confirmLoading = false
          }
        } else {
          this.confirmLoading = false
          Object.keys(err).map((u) => {
            const _u = u.split('_')
            if (['redupPool', 'redupKeepDays', 'remotePool', 'remoteKeepDays'].includes(_u[0])) {
              const index = _u[1]
              this.data[index][`editable_${u}`] = true
            }
          })
        }
      })
    },
    prevStep () {
      this.sinkData()
      this.prev()
    },
    setPoolList () {
      // 遍历池的选择情况，🚫 已选的
      this.redupPoolList = this._redupPoolList.map((u) =>
        Object.assign(u, {
          disabled: this.data.map((u) => u.redupPool).includes(deepGet(u, 'metadata.name'))
        })
      )
      this.remotePoolList = this._remotePoolList.map((u) =>
        Object.assign(u, {
          disabled: this.data.map((u) => u.remotePool).includes(deepGet(u, 'metadata.name'))
        })
      )
    },
    handleAdd () {
      const pool = {
        key: this.data.length,
        redupPool: '',
        redupKeepDays: '',
        remotePool: '',
        remoteKeepDays: ''
      }
      ;['redupPool', 'redupKeepDays', 'remotePool', 'remoteKeepDays'].map((u) => {
        pool[`editable_${u}_${this.data.length}`] = false
      })
      this.data.push(pool)
    },
    handleDelete () {
      if (this.selectedRowKeys && this.selectedRowKeys.length > 0) {
        this.$confirm({
          title: '是否批量删除',
          content: `点击确认批量删除`,
          maskClosable: true,
          onOk: async () => {
            this.deleteLoading = true
            this.selectedRowKeys.map((u) => {
              this.data.splice(
                this.data.findIndex((i) => i.key === u),
                1
              )
            })
            // 重新排序，获得实际序号上的值
            this.data.map((u, index) => {
              const fields = {}
              const key = u.key
              ;['redupPool', 'redupKeepDays', 'remotePool', 'remoteKeepDays'].map((i) => {
                u[`editable_${i}_${index}`] = u[`editable_${i}_${key}`]
                delete u[`editable_${i}_${key}`]
                fields[`${i}_${index}`] = u[i] // 清空原来的数据，否则 form-item value 会传递下来
              })
              u.key = index
              this.form.setFieldsValue(fields)
            })
            this.setPoolList()
            this.selectedRowKeys = []
            this.selectedRows = []
            this.$message.success('批量删除成功！')
            this.deleteLoading = false
          }
        })
      } else {
        this.$message.info('请先选中需要批量删除的行！')
      }
    },
    onCellChange (key, dataIndex, value) {
      const data = [...this.data]
      const target = data.find((u) => u.key === key)
      if (target) {
        target[dataIndex] = value
        this.data = data
      }
      this.setPoolList()
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    }
  }
}
</script>

<style lang="less" scoped>
.content-wrapper {
  margin: 16px auto;
}
.btns {
  text-align: center;
  margin-top: 30px;
}
</style>
