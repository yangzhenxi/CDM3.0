<template>
  <div class="content-wrapper">
    <form-builder ref="form" :items="items" style="width:500px;margin:0px auto;" />
    <a-divider />
    <s-operator :config="operatorConfig" />
    <m-table
      ref="table"
      :rowKey="rowKey"
      :loading="loading"
      :columns="columns"
      :dataSource="filterData"
      :rowSelection="rowSelection"
      :rowClassName="rowClassName"
      :scroll="scroll"
      :pagination="false"
      :emptyItemProps="empty"
    >
      <template slot="poolId" slot-scope="text, record">
        <editable-cell
          :ref="`editable_poolId_${deepGet(record, 'id')}`"
          :item="getEditableItem(text, record, 'poolId')"
          @change="
            value => {
              record['poolId'] = value
            }
          "
        />
      </template>
      <template slot="keep" slot-scope="text, record,index">
        <editable-cell
          :ref="`editable_keep_${index}`"
          :item="getEditableItem(text, record, 'keep')"
          @change="
            value => {
              record['keep'] = value
            }
          "
        />
      </template>
    </m-table>
    <div class="btns">
      <a-button @click="back" style="margin-right: 8px">取消新建</a-button>
      <a-button type="primary" :loading="confirmLoading" @click="nextStep">新建</a-button>
    </div>
  </div>
</template>

<script>
import { addSLA } from '@/api/resource/sla'
import { getPoolList } from '@/api/storage/pool'
import { MIcon, FormBuilder, SOperator, EditableCell, STable } from '@/components'
import { useTableContext, useStepFormItem } from '@/core/use'
import { mapState } from 'vuex'
import { deepGet, throttle } from '@/utils/util'

export default {
  name: 'Step1',
  components: {
    EditableCell,
    FormBuilder,
    SOperator,
    STable,
    MIcon
  },
  setup (props, context) {
    const columns = [
      {
        title: '目标池',
        dataIndex: 'poolId',
        scopedSlots: { customRender: 'poolId' }
      },
      {
        title: '保留天数（天）',
        dataIndex: 'keep',
        scopedSlots: { customRender: 'keep' }
      }
    ]
    const { back, next, prev } = useStepFormItem(props, context)
    const { rowKey, rowSelection, scroll, rowClassName } = useTableContext({
      columns,
      rowSelection: {
        type: 'checkbox',
        getCheckboxProps: record => ({
          props: {
            disabled: record.disabled,
            name: record.target
          }
        })
      }
    })
    const clearSelected = () => {
      if (rowSelection.value) {
        rowSelection.value.onChange([], [])
      }
    }
    return {
      prev,
      back,
      next,
      rowKey,
      scroll,
      columns,
      rowSelection,
      clearSelected,
      rowClassName
    }
  },
  data () {
    return {
      options: [],
      loading: false,
      deleteLoading: false,
      confirmLoading: false,
      items: [
        // {
        //   label: 'SLA名称',
        //   prop: 'name',
        //   rules: {
        //     required: true,
        //     message: '请输入SLA名称'
        //   },
        //   component: {
        //     name: 'a-input',
        //   }
        // },
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
      operatorConfig: {
        fields: [
          {
            key: 'layouts.table.operator.add',
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
              this.AllDelete()
            })
          }
        ]
      },
      filterData: [{ id: 1, pool: null, keep: null }],
      empty: {
        state: 'empty',
        data: null
      }
    }
  },
  computed: {
    ...mapState({
      applicationId: state => state.resourceSLA.step['step0'].applicationId
    })
  },
  async created () {
    const options = deepGet(await getPoolList(), 'data', [])
    this.options = options.map(u => {
      return {
        value: u.id,
        label: u.name
      }
    })
  },
  methods: {
    async nextStep () {
      this.confirmLoading = true
      const { valid, values } = await this.$refs.form.validate()
      this.confirmLoading = valid
      if (valid) {
        const { selectedRowKeys, selectedRows } = this.rowSelection
        if (!selectedRowKeys.length) {
          this.$message.info('请选择池')
          this.confirmLoading = false
          return
        }
        let isValid = true
        await Promise.all(selectedRows.map((u, index) => {
          Object.keys(u).map(async i => {
            if (i.includes('editable')) {
              const { valid } = await this.$refs[`${i}_${u?.id}`].validate()
              if (!valid) {
                isValid = false
              }
            }
          })
        }))
        if (isValid) {
          const targets = selectedRows.map(u => {
            return {
              keep: u.keep,
              poolId: u.poolId
            }
          })
          const obj = {
            applicationId: this.applicationId,
            root: {
              keep: values.keep,
              targets
            }
          }
          try {
            await addSLA(obj)
            this.next()
          } catch (error) {
            this.confirmLoading = false
          }
        }
        this.confirmLoading = false
      }
    },
    getEditableItem (value, record = {}, prop) {
      const rules = {
        poolId: [{ required: true, message: '请选择池名称！' }],
        keep: [{ required: true, message: '请输入！' }]
      }
      const item = {
        prop,
        value,
        rules: rules[prop],
        component: {},
        editing: true,
        editable: true
      }
      switch (prop) {
      case 'poolId':

        item.component = {
          name: 'm-select',
          props: {
            options: this.options
          }
        }
        break
      case 'keep':
        item.component = {
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
      return item
    },

    AllDelete () {
      const { selectedRowKeys } = this.rowSelection
      if (!selectedRowKeys.length) {
        this.$message.info('请先选中需要批量删除的行！')
        return
      }
      this.$confirm({
        title: '是否批量删除',
        content: `点击确认批量删除`,
        maskClosable: true,
        onOk: async () => {
          this.deleteLoading = true
          selectedRowKeys.map(u => {
            this.filterData.splice(
              this.filterData.findIndex(i => i.id === u - 1),
              1
            )
          })
          this.$message.success('批量删除成功！')
          this.deleteLoading = false
        }
      })
    },
    handleAdd () {
      const pool = { id: this.filterData.length, pool: null, keep: null }
      this.filterData.push(pool)
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
