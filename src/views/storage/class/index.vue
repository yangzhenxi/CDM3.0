<template>
  <page-header-wrapper :title="false">
    <a-card :bordered="false">
      <search-form-builder ref="form" :items="searchFormItems" @refresh="$refs.table.refresh()" />
      <s-operator :config="operatorConfig"/>
      <s-table
        ref="table"
        :columns="columns"
        :fetchData="fetchData"
        :emptyItemProps="empty"
      >
        <template slot="state" slot-scope="text, record">
          <a-tooltip :title="deepGet(record, 'error')">
            <m-tag :color="toEnum(text, 'STORAGE_CLASS_STATE').color">{{ text | convert('STORAGE_CLASS_STATE') }}</m-tag>
          </a-tooltip>
        </template>
        <template slot="action" slot-scope="text, record">
          <div class="table-inline-operator">
            <a-button type="danger" size="small" @click.stop="handleDelete(record)">删除</a-button>
          </div>
        </template>
      </s-table>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { getClassList, deleteClass } from '@/api/storage/class'
import { SearchFormBuilder, SOperator, STable } from '@/components'
import { deepGet, handleFetchStateErrorDone, isEmpty, queryBuild, throttle, toEnum } from '@/utils/util'
import Add from './modules/Add'

export default {
  name: 'StorageClass',
  components: {
    SearchFormBuilder,
    SOperator,
    STable
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
              }, { title: '新建存储节点' })
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
                this.$router.push({ path: `/storage/class/${record?.id}`, query: { name: record?.name } })
              }
            }
          })
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
          width: 60,
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
          res = await getClassList(Object.assign(params, queryBuild(this.$refs.form.model)))
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
  methods: {
    handleDelete: throttle(function (record) {
      this.deleteConfirm = undefined
      const onOk = async () => {
        if (this.deleteConfirm === 'YES') {
          await deleteClass({ id: record?.id })
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
    deepGet,
    toEnum
  }
}
</script>
