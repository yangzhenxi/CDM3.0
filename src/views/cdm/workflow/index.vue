<template>
  <page-header-wrapper :title="false">
    <a-card :bordered="false">
      <search-form-builder ref="form" :items="searchFormItems" @refresh="$refs.table.refresh()" />
      <s-operator :config="operatorConfig" />
      <s-table
        ref="table"
        :columns="columns"
        :fetchData="fetchData"
        :rowSelection="{}"
        :rowClick="true"
        :emptyItemProps="empty"
      >
        <template slot="module" slot-scope="text">
          <m-icon :type="toEnum(text, 'CDM_APPLICATION_MODULE').icon" style="font-size: 20px" />
        </template>
        <template slot="status" slot-scope="text, record">
          <a-switch
            :checked="text"
            :loading="record.statusLoading"
            checkedChildren="启用"
            unCheckedChildren="禁用"
            @change="handleStatusChange(record)"
            @click.native.stop
          />
        </template>
        <template slot="action" slot-scope="text, record">
          <div class="table-inline-operator">
            <a-button type="primary" size="small" @click.stop="handleUpdate(record)">修改</a-button>
            <a-button type="danger" size="small" @click.stop="handleDelete(record)">删除</a-button>
          </div>
        </template>
      </s-table>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { getRecoveryStrategyList, deleteRecoveryStrategy, batchDeleteRecoveryStrategy, updateRecoveryStrategy } from '@/api/cdm/workflow'
import { SearchFormBuilder, SOperator, STable, MIcon } from '@/components'
import { deepGet, enumToSelection, handleFetchStateErrorDone, isEmpty, queryBuild, throttle, toEnum } from '@/utils/util'
import Update from './modules/Update'
import events from './modules/events'

export default {
  name: 'CdmWorkflow',
  components: {
    SearchFormBuilder,
    SOperator,
    STable,
    MIcon
  },
  props: {},
  data () {
    return {
      searchFormItems: [
        {
          label: '名称',
          prop: 'name',
          component: {
            name: 'a-input'
          }
        },
        {
          label: '应用类型',
          prop: 'appKind',
          component: {
            name: 'm-select',
            props: {
              options: enumToSelection('CDM_APPLICATION_MODULE', u => ({
                value: u.key,
                label: <div class="flex-row-default">
                  <m-icon type={ u.icon } style="margin-right:4px; font-size: 20px"/>
                  <span>{ u.title }</span>
                </div>
              }))
            }
          }
        }
      ],
      operatorConfig: {
        fields: [
          {
            key: 'layouts.table.operator.new',
            props: {
              type: 'primary',
              icon: 'plus'
            },
            onClick: throttle(() => {
              this.$router.push({ path: '/cdm/workflow/add' })
            })
          },
          {
            key: 'layouts.table.operator.batDelete',
            props: {
              type: 'danger',
              icon: 'delete'
            },
            onClick: throttle(() => {
              this.handleBatchDelete()
            })
          }
        ]
      },
      columns: [
        {
          title: '名称',
          dataIndex: 'name',
          width: 100,
          ellipsis: true,
          scopedSlots: { customRender: 'name' },
          customCell: (record, index) => ({
            style: {
              color: '#1890ff',
              cursor: 'pointer'
            },
            on: {
              click: e => {
                e.stopPropagation()
                this.$router.push({ path: `/cdm/workflow/${record?.id}`, query: { name: record?.name } })
              }
            }
          })
        },
        {
          title: '应用名称',
          dataIndex: 'application.name',
          width: 100,
          ellipsis: true
        },
        {
          title: '应用类型',
          dataIndex: 'appKind',
          width: 80,
          scopedSlots: { customRender: 'module' }
        },
        {
          title: '目标主机',
          dataIndex: 'lblet.name',
          width: 80,
          ellipsis: true
        },
        {
          title: '执行时间',
          dataIndex: 'cronExpression',
          width: 182
        },
        {
          title: '创建时间',
          dataIndex: 'createdAt',
          width: 182,
          scopedSlots: { customRender: 'unixToDate' }
        },
        {
          title: '状态',
          dataIndex: 'able',
          width: 80,
          fixed: 'right',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: 120,
          fixed: 'right',
          scopedSlots: { customRender: 'action' }
        }
      ],
      fetchData: async params => {
        this.empty = {
          state: 'empty',
          data: null
        }
        let res = {}
        try {
          res = await getRecoveryStrategyList(Object.assign(params, queryBuild(this.$refs.form.model)))
          res.data = deepGet(res, 'data', []).map(u => ({
            ...u,
            statusLoading: false
          }))
        } catch (error) {
          this.empty = handleFetchStateErrorDone(error)
        }
        return isEmpty(this.empty?.data) ? res : {}
      },
      empty: {
        state: 'empty',
        data: null
      },
      deleteConfirm: null
    }
  },
  created () {
    events.$off('refresh-table')
    events.$on('refresh-table', () => {
      this.$refs.table.refresh()
    })
  },
  methods: {
    handleUpdate: throttle(function (record) {
      this.$dialog(Update, {
        record,
        on: {
          ok: () => {
            this.$refs.table.refresh()
          }
        }
      }, { title: '修改工作流' })
    }),
    handleStatusChange: throttle(async function (record) {
      try {
        record.statusLoading = true
        await updateRecoveryStrategy({
          id: record?.id,
          able: !record.able,
          name: record.name,
          cronExpression: record.cronExpression
        })
        this.$message.success('修改成功！')
        record.able = !record.able
        record.statusLoading = false
      } catch (error) {
        record.statusLoading = false
      }
    }),
    handleDelete: throttle(function (record) {
      this.deleteConfirm = undefined
      const onOk = async () => {
        if (this.deleteConfirm === 'YES') {
          try {
            await deleteRecoveryStrategy({ id: record?.id })
            modal.destroy()
            this.$refs.table.refresh()
            this.$message.success('提交删除成功！')
          } catch (error) {
            this.$message.error('提交删除失败！')
          }
        } else {
          this.$message.error('提交删除失败！')
        }
      }
      const modal = this.$confirm({
        title: '是否删除',
        content: h => (
          <div>
            <p>
              请在输入 <m-tag color={'green'}>YES</m-tag>后确认删除
              <b style="margin-left: 4px">{ record?.name }</b>
            </p>
            <a-input v-model={ this.deleteConfirm } placeholder="请输入" allowClear { ... { on: { pressEnter: onOk } }} />
          </div>
        ),
        maskClosable: true,
        destroyOnClose: true,
        onOk
      })
    }),
    handleBatchDelete: throttle(function () {
      this.deleteConfirm = undefined
      const { selectedRows } = this.$refs.table?.localRowSelection
      if (!selectedRows.length) {
        this.$message.info('请先选择需要删除的行！')
        return
      }
      const onOk = async () => {
        if (this.deleteConfirm === 'YES') {
          await batchDeleteRecoveryStrategy()
          modal.destroy()
          this.$refs.table.refresh()
          this.$message.success('提交删除成功！')
        } else {
          this.$message.error('提交删除失败！')
        }
      }
      const modal = this.$confirm({
        title: '是否删除',
        content: h => (
          <div>
            <p>
              请在输入 <m-tag color={'green'}>YES</m-tag>后确认删除
            </p>
            <a-input v-model={ this.deleteConfirm } placeholder="请输入" allowClear { ... { on: { pressEnter: onOk } }} />
          </div>
        ),
        maskClosable: true,
        destroyOnClose: true,
        onOk
      })
    }),
    toEnum
  }
}
</script>
