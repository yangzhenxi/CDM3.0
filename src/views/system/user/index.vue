<template>
  <page-header-wrapper :title="false">
    <a-card :bordered="false">
      <search-form-builder ref="form" :items="searchFormItems" @refresh="$refs.table.refresh()" />
      <s-operator :config="operatorConfig"/>
      <s-table
        ref="table"
        :columns="columns"
        :fetchData="fetchData"
        :rowSelection="{}"
        :rowClick="true"
        :emptyItemProps="empty"
      >
        <template slot="status" slot-scope="text, record">
          <a-switch
            :checked="text === 1"
            :loading="record.stateLoading"
            checkedChildren="启用"
            unCheckedChildren="禁用"
            @change="handleStateChange(record)"
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
import { getUserList, updateUser, deleteUser } from '@/api/system/user'
import { getAllRole } from '@/api/system/role'
import { SearchFormBuilder, SOperator, STable } from '@/components'
import { deepGet, enumToSelection, handleFetchStateErrorDone, isEmpty, queryBuild, throttle, transformArray, toEnum } from '@/utils/util'
import Add from './modules/Add'
import Update from './modules/Update'

export default {
  name: 'SystemUser',
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
          prop: 'nickname',
          component: {
            name: 'a-input'
          }
        },
        {
          label: '用户名',
          prop: 'username',
          component: {
            name: 'a-input'
          }
        },
        {
          label: '角色',
          prop: 'role',
          component: {
            name: 'm-select'
          }
        },
        {
          label: '状态',
          prop: 'status',
          component: {
            name: 'm-select',
            props: {
              options: enumToSelection('SYSTEM_USER_STATE')
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
              }, { title: '新建用户' })
            })
          }
        ]
      },
      columns: [
        {
          title: '名称',
          dataIndex: 'nickname',
          width: 100,
          ellipsis: true
        },
        {
          title: '用户名',
          dataIndex: 'username',
          width: 100,
          ellipsis: true
        },
        {
          title: '角色',
          dataIndex: 'roleName',
          width: 100,
          ellipsis: true
        },
        {
          title: '邮箱',
          dataIndex: 'email',
          width: 130,
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
          dataIndex: 'status',
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
        const [
          res0 = {},
          res1
        ] = (await Promise.all([
          getUserList(Object.assign(params, queryBuild(this.$refs.form.model))),
          getAllRole()
        ].map((api, index) => api.catch(error => {
          if (index === 0) {
            this.empty = handleFetchStateErrorDone(error)
          } else {
            transformArray(this.searchFormItems, { prop: 'role' }, { component: { props: { emptyItemProps: handleFetchStateErrorDone(error) } } })
          }
        }))))
        this.roleList = deepGet(res1, 'data', [])
        transformArray(this.searchFormItems, { prop: 'role' }, { component: { props: { options: this.roleList.map(u => ({
          value: u?.id,
          label: u?.name
        })) } } })
        res0.data = deepGet(res0, 'data', []).map(u => ({
          ...u,
          roleName: this.roleList.find(i => u?.role === i.id)?.name,
          stateLoading: false
        }))
        return isEmpty(this.empty?.data) ? res0 : {}
      },
      empty: {
        state: 'empty',
        data: null
      },
      roleList: [],
      deleteConfirm: null
    }
  },
  methods: {
    handleReset: throttle(async function (record) {
      this.$confirm({
        title: '是否重置密码',
        content: h => <span>点击确认重置 <b>{record?.nockname}</b> 的密码</span>,
        maskClosable: true,
        onOk: async () => {
          try {
            await updateUser({
              id: record?.id,
              password: 'howlink'
            })
            this.$message.success('重置密码成功！')
          } catch (error) {}
        }
      })
    }),
    handleUpdate: throttle(function (record) {
      this.$dialog(Update, {
        record,
        on: {
          ok: () => {
            this.$refs.table.refresh()
          }
        }
      }, { title: h => <span>修改用户：{ record?.nickname }</span> })
    }),
    handleStateChange: throttle(async function (record) {
      try {
        record.stateLoading = true
        const status = record?.status === 1 ? 2 : 1
        await updateUser({
          id: record?.id,
          status
        })
        this.$message.success('修改成功！')
        record.status = status
        record.stateLoading = false
      } catch (error) {
        record.stateLoading = false
      }
    }),
    handleDelete: throttle(function (record) {
      this.deleteConfirm = undefined
      const onOk = async () => {
        if (this.deleteConfirm === 'YES') {
          await deleteUser({ id: record?.id })
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
