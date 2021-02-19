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
        <template slot="type" slot-scope="text">
          <m-icon :type="toEnum(text, 'STORAGE_POOL_TYPE').icon" :title="convert(text, 'STORAGE_POOL_TYPE')" style="font-size: 20px" />
        </template>
        <template slot="compressRatio" slot-scope="text">
          {{ text | convert('compressRatio') }}
        </template>
        <template slot="state" slot-scope="text, record">
          <a-tooltip>
            <template #title>
              <div v-for="item in uniq(deepGet(record, 'message', ' ').split('&&'))" :key="item">
                {{ item }}
              </div>
            </template>
            <m-tag :color="toEnum(text, 'STORAGE_POOL_STATE').color">{{ text | convert('STORAGE_POOL_STATE') }}</m-tag>
          </a-tooltip>
        </template>
        <template slot="action" slot-scope="text, record">
          <div class="table-inline-operator">
            <a-button type="primary" size="small" @click.stop="handleResize(record)">扩容</a-button>
            <a-button type="danger" size="small" @click.stop="handleDelete(record)">删除</a-button>
          </div>
        </template>
      </s-table>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { getPoolList, deletePool } from '@/api/storage/pool'
import { MIcon, SearchFormBuilder, SOperator, STable } from '@/components'
import { convert, deepGet, enumToSelection, handleFetchStateErrorDone, isEmpty, queryBuild, throttle, toEnum, uniq } from '@/utils/util'
import Allocate from './modules/Allocate'
import Resize from './modules/Resize'
import events from './modules/events'

export default {
  name: 'StoragePool',
  components: {
    MIcon,
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
          label: '类型',
          prop: 'type',
          component: {
            name: 'm-select',
            props: {
              optionLabelProp: 'title',
              options: enumToSelection('STORAGE_POOL_TYPE', u => ({
                value: u.key,
                label: <span><m-icon type={ u.icon } style="margin-right: 4px" />{ u.value }</span>,
                title: u.value
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
              this.$router.push({ path: `/storage/pool/add` })
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
                this.$router.push({ path: `/storage/pool/${record?.id}`, query: { name: record?.name } })
              }
            }
          })
        },
        {
          title: '类型',
          dataIndex: 'type',
          width: 80,
          align: 'center',
          scopedSlots: { customRender: 'type' }
        },
        {
          title: '总容量',
          dataIndex: 'capacity',
          width: 80,
          scopedSlots: { customRender: 'unitSize' }
        },
        {
          title: '可用容量',
          dataIndex: 'available',
          width: 80,
          scopedSlots: { customRender: 'unitSize' }
        },
        {
          title: '已用容量',
          dataIndex: 'used',
          width: 80,
          scopedSlots: { customRender: 'unitSize' }
        },
        {
          title: '压缩比',
          dataIndex: 'compressRatio',
          width: 80,
          scopedSlots: { customRender: 'compressRatio' }
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
          res = await getPoolList(Object.assign(params, queryBuild(this.$refs.form.model)))
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
    handleResize: throttle(function (record) {
      this.$dialog(Resize, {
        record,
        on: {
          ok: () => {
            this.$refs.table.refresh()
          }
        }
      }, { title: '扩容' })
    }),
    handleDelete: throttle(function (record) {
      this.deleteConfirm = undefined
      const onOk = async () => {
        if (this.deleteConfirm === 'YES') {
          await deletePool({ id: record?.id })
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
    convert,
    deepGet,
    toEnum,
    uniq
  }
}
</script>
