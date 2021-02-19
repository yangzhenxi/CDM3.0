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
        <template slot="kind" slot-scope="text">
          <m-icon :type="toEnum(text, 'R_VIRTUAL_MODULE').icon" style="font-size: 20px" />
        </template>
        <template slot="state" slot-scope="text">
          <m-tag :color="toEnum(text, 'R_VIRTUAL_STATE').color">{{ text | convert('R_VIRTUAL_STATE') }}</m-tag>
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
import { mergeWith } from 'lodash'
import { getAllLblet } from '@/api/resource/lblet'
import { getVirtualList, deleteVirtual, batchDeleteVirtual } from '@/api/resource/virtual'
import { deepGet, enumToSelection, handleFetchStateErrorDone, isEmpty, queryBuild, throttle, toEnum } from '@/utils/util'
import { SearchFormBuilder, SOperator, STable, MIcon } from '@/components'
import Add from './modules/Add'
import Update from './modules/Update'
import Allocate from './modules/Allocate'
import events from './modules/events'

export default {
  name: 'ResourceVirtual',
  components: {
    SearchFormBuilder,
    SOperator,
    STable,
    MIcon
  },
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
          label: '类型',
          prop: 'kind',
          component: {
            name: 'm-select',
            props: {
              optionLabelProp: 'title',
              options: enumToSelection('R_VIRTUAL_MODULE', u => ({
                value: u.key,
                label: <span><m-icon type={ u.icon } style="margin-right:4px;font-size: 20px;"/>{ u.title }</span>,
                title: u.title
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
              this.$dialog(Add, {
                on: {
                  ok: () => {
                    this.$refs.table.refresh()
                  }
                }
              }, { title: '新建虚拟化' })
            })
          },
          {
            key: 'layouts.table.operator.allocateUsers',
            props: {
              icon: 'apartment'
            },
            onClick: throttle(() => {
              const { selectedRows } = this.$refs.table?.localRowSelection
              if (!selectedRows.length) {
                this.$message.info('请先选择需要分配用户的行！')
                return
              }
              if (selectedRows.length > 1) {
                this.$message.info('只能选择一行分配用户！')
                return
              }
              this.$dialog(Allocate, { record: selectedRows[0] }, { title: '分配用户' })
            })
          },
          {
            key: '批量删除',
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
                this.$router.push({ path: `/resource/virtual/${record?.id}`, query: { name: record?.name } })
              }
            }
          })
        },
        {
          title: '类型',
          dataIndex: 'kind',
          width: 80,
          scopedSlots: { customRender: 'kind' }
        },
        {
          title: '客户端',
          dataIndex: 'lblet.name',
          width: 100,
          ellipsis: true
        },
        {
          title: 'IP',
          dataIndex: 'ipAddr',
          width: 152
        },
        {
          title: '创建时间',
          dataIndex: 'createdAt',
          width: 175,
          scopedSlots: { customRender: 'unixToDate' }
        },
        {
          title: '状态',
          dataIndex: 'state',
          width: 80,
          fixed: 'right',
          scopedSlots: { customRender: 'state' }
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: 115,
          fixed: 'right',
          scopedSlots: { customRender: 'action' }
        }
      ],
      fetchData: async params => {
        this.empty = {
          state: 'empty',
          data: null
        }
        const [
          res0 = {},
          res1
        ] = (await Promise.all([
          getVirtualList(Object.assign(params, queryBuild(this.$refs.form.model))),
          getAllLblet()
        ].map(api => api.catch(error => {
          this.empty = mergeWith(this.empty, handleFetchStateErrorDone(error), (o, s) => {
            if (Array.isArray(o)) {
              return o.concat(s)
            }
            return s
          })
        })))).map(u => deepGet(u, [], {}))
        res0.data = deepGet(res0, 'data', []).map(u => {
          let ipAddr = null
          const lblet = deepGet(res1, 'data', []).find(i => i?.id === u?.lbletId)
          u.kind === 2 ? ipAddr = lblet?.ipAddr : ipAddr = u?.vCenter?.ipAddr
          return {
            ...u,
            ipAddr,
            lblet
          }
        })
        if (isEmpty(this.empty?.data)) {
          return res0
        } else {
          return {}
        }
      },
      empty: {
        state: 'empty',
        data: null
      },
      deleteConfirm: null
    }
  },
  created () {
    events.$off('refresh')
    events.$on('refresh', () => {
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
      }, { title: '修改虚拟化' })
    }),
    handleDelete: throttle(function (record) {
      this.deleteConfirm = undefined
      const onOk = async () => {
        if (this.deleteConfirm === 'YES') {
          await deleteVirtual({ id: record?.id })
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
          await batchDeleteVirtual()
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
