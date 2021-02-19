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
        <template slot="lbletName" slot-scope="text, record">
          <span>{{ deepGet(record, ['instances', 0, 'lblet', 'name'], '-') }}</span>
        </template>
        <template slot="kind" slot-scope="text">
          <m-icon :type="toEnum(text, 'CDM_APPLICATION_MODULE').icon" style="font-size: 24px" />
        </template>
        <template slot="os" slot-scope="text">
          <m-icon :type="text | convert('R_LBLET_OS')" style="font-size: 20px" />
        </template>
        <template slot="state" slot-scope="text,record">
          <a-tooltip>
            <template slot="title">
              <template v-for="(item, index) in record.instance" >
                <detail :key="index" :data="item" justify="end" :colon="false" style="width: 200px" />
              </template>
            </template>
            <m-tag :color="toEnum(text, 'CDM_APPLICATION_STATE').color">{{ text | convert('CDM_APPLICATION_STATE') }}</m-tag>
          </a-tooltip>
        </template>
        <template slot="action" slot-scope="text, record">
          <div class="table-inline-operator">
            <a-button size="small" @click.stop="handleTest(record)">测试</a-button>
            <a-button type="primary" size="small" @click.stop="handleBackup(record)">备份</a-button>
            <a-button type="danger" size="small" @click.stop="handleDelete(record)">删除</a-button>
          </div>
        </template>
      </s-table>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { getApplicationList, deleteApplication, batchDeleteApplication } from '@/api/cdm/application'
import { SearchFormBuilder, SOperator, STable, MIcon, Detail } from '@/components'
import { deepGet, handleFetchStateErrorDone, isEmpty, queryBuild, throttle, toEnum, convert, enumToSelection } from '@/utils/util'
import Test from './modules/Test'
import Backup from './modules/Backup'
import Delete from './modules/Delete'
import events from './modules/events'

export default {
  name: 'BackupApplication',
  components: {
    SearchFormBuilder,
    SOperator,
    STable,
    Detail,
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
          label: '类型',
          prop: 'kind',
          component: {
            name: 'm-select',
            props: {
              options: enumToSelection('CDM_APPLICATION_MODULE', u => ({
                value: u.key,
                label: <span><m-icon type={ u.icon } style="margin-right: 4px; font-size: 20px;"/>{ u.title }</span>
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
              this.$router.push({ path: '/backup/application/add', query: { type: 2 } })
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
                const path = `/backup/application/${record?.id}`
                this.$router.push({ path, query: { name: record?.name } })
              }
            }
          })
        },
        {
          title: '客户端',
          width: 100,
          ellipsis: true,
          scopedSlots: { customRender: 'lbletName' }
        },
        {
          title: '类型',
          dataIndex: 'kind',
          width: 80,
          align: 'center',
          scopedSlots: { customRender: 'kind' }
        },
        {
          title: '操作系统',
          dataIndex: 'os',
          width: 80,
          align: 'center',
          scopedSlots: { customRender: 'os' }
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
          width: 180,
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
          res = await getApplicationList(Object.assign(params, { type: 2 }, queryBuild(this.$refs.form.model)))
          res.data = res.data.map(u => {
            u.instance = u.instances.map(o => ([{
              title: `实例名：${o?.name}`,
              value: `状态：${convert(deepGet(o, 'state'), 'CDM_INSTANCE_STATE')}`,
              key: o?.name
            }]))
            return u
          })
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
    handleTest: throttle(function (record) {
      this.$dialog(Test, {
        record,
        on: {
          ok: () => {
            this.$refs.table.refresh()
          }
        }
      }, { title: '应用测试' })
    }),
    handleBackup: throttle(function (record) {
      this.$dialog(Backup, {
        record: {
          ...record,
          type: 'application'
        },
        on: {
          ok: () => {
            this.$refs.table.refresh()
          }
        }
      }, { title: '备份' })
    }),
    handleDelete: throttle(function (record) {
      this.$dialog(Delete, {
        record,
        on: {
          ok: () => {
            this.deleteConfirm = undefined
            const onOk = async () => {
              if (this.deleteConfirm === 'YES') {
                await deleteApplication({ id: record?.id })
                this.$refs.table.refresh()
                modal.destroy()
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
          }
        }
      }, { title: '删除应用' })
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
          await batchDeleteApplication()
          this.$refs.table.refresh()
          this.$message.success('提交删除成功！')
        } else {
          this.$message.error('提交删除失败！')
        }
      }
      this.$confirm({
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
    toEnum,
    deepGet
  }
}
</script>
