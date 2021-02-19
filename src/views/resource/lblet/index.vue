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
        <template slot="os" slot-scope="text,record">
          <a-tooltip>
            <template slot="title">
              <span>{{ record.osVersion }}</span>
            </template>
            <m-icon :type="toEnum(text, 'R_LBLET_OS').icon" style="font-size: 20px; cursor: pointer" />
          </a-tooltip>
        </template>
        <template slot="register" slot-scope="text,record">
          <m-tag :color="toEnum(!!record.name, 'R_LBLET_REGISTER_STATE').color">{{ !!record.name | convert('R_LBLET_REGISTER_STATE') }}</m-tag>
        </template>
        <template slot="state" slot-scope="text">
          <m-tag :color="toEnum(text, 'R_LBLET_STATE').color">{{ text | convert('R_LBLET_STATE') }}</m-tag>
        </template>
        <template slot="action" slot-scope="text, record">
          <div class="table-inline-operator">
            <a-button v-if="!record.name" size="small" @click.stop="handleRegister(record)">注册</a-button>
            <a-button v-if="record.name" type="primary" size="small" @click.stop="handleUpdate(record)">修改</a-button>
            <a-button v-if="record.name" type="danger" size="small" @click.stop="handleDelete(record)">删除</a-button>
          </div>
        </template>
      </s-table>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { getLbletList, deleteLblet } from '@/api/resource/lblet'
import { SearchFormBuilder, SOperator, STable, MIcon, MTag } from '@/components'
import { handleFetchStateErrorDone, isEmpty, queryBuild, throttle, toEnum } from '@/utils/util'
import Allocate from './modules/Allocate'
import Bind from './modules/Bind'
import Register from './modules/Register'
import Update from './modules/Update'
import events from './modules/events'

export default {
  name: 'ResourceLblet',
  components: {
    SearchFormBuilder,
    SOperator,
    STable,
    MIcon,
    MTag,
    Allocate,
    Bind
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
          label: 'IP',
          prop: 'ipAddr',
          component: {
            name: 'a-input'
          }
        }
      ],
      operatorConfig: {
        fields: [
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
            key: 'layouts.table.operator.bindTag',
            props: {
              icon: 'tag'
            },
            onClick: throttle(() => {
              const { selectedRows } = this.$refs.table.localRowSelection
              if (isEmpty(selectedRows)) {
                this.$message.info('请先选中需要进行绑定标签的客户端！')
                return
              }
              if (selectedRows && selectedRows.length > 1) {
                this.$message.info('只能选择一个客户端！')
                return
              }
              this.$dialog(Bind, {
                record: selectedRows[0],
                on: {
                  ok: () => {
                    this.$refs.table.refresh()
                  }
                }
              }, { title: '绑定标签' })
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
          customCell: (record, index) => {
            if (record?.name) {
              return {
                style: {
                  color: '#1890ff',
                  cursor: 'pointer'
                },
                on: {
                  click: e => {
                    e.stopPropagation()
                    this.$router.push({ path: `/resource/lblet/${record?.id}`, query: { name: record?.name } })
                  }
                }
              }
            }
          }
        },
        {
          title: '操作系统',
          dataIndex: 'os',
          width: 80,
          align: 'center',
          scopedSlots: { customRender: 'os' }
        },
        {
          title: 'IP',
          dataIndex: 'ipAddr',
          width: 152
        },
        {
          title: '版本',
          dataIndex: 'version',
          width: 80,
          ellipsis: true
        },
        {
          title: '标签',
          dataIndex: 'labels',
          width: 80,
          ellipsis: true,
          scopedSlots: { customRender: 'labels' }
        },
        {
          title: '最后在线时间',
          dataIndex: 'uptime',
          width: 175,
          scopedSlots: { customRender: 'unixToDate' }
        },
        {
          title: '注册状态',
          width: 80,
          fixed: 'right',
          scopedSlots: { customRender: 'register' }
        },
        {
          title: '状态',
          dataIndex: 'state',
          width: 60,
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
        let res = {}
        try {
          res = await getLbletList(Object.assign(params, queryBuild(this.$refs.form.model)))
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
    events.$off('refresh')
    events.$on('refresh', () => {
      this.$refs.table.refresh()
    })
  },
  methods: {
    handleRegister: throttle(function (record) {
      this.$dialog(Register, {
        record,
        on: {
          ok: () => {
            this.$refs.table.refresh()
          }
        }
      }, { title: '注册客户端' })
    }),
    handleUpdate: throttle(function (record) {
      this.$dialog(Update, {
        record,
        on: {
          ok: () => {
            this.$refs.table.refresh()
          }
        }
      }, { title: '修改客户端' })
    }),
    handleDelete: throttle(function (record) {
      this.deleteConfirm = undefined
      const onOk = async () => {
        if (this.deleteConfirm === 'YES') {
          await deleteLblet({ id: record?.id })
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
    toEnum
  }
}
</script>
