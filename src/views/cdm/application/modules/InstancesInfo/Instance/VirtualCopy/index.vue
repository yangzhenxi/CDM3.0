<template>
  <div>
    <s-table
      ref="table"
      :columns="columns"
      :fetchData="fetchData"
      :autoLoad="false"
      :emptyItemProps="empty"
    >
      <template slot="state" slot-scope="text,record">
        <a-tooltip>
          <template slot="title" v-if="record.message">
            <div v-for="item in uniq(record.message.split('&&'))" :key="item">
              {{ item }}
            </div>
          </template>
          <m-tag :color="toEnum(text, 'CDM_VIRTUALCOPY_STATE').color">
            {{ text | convert('CDM_VIRTUALCOPY_STATE') }}
            <a-icon v-if="record.message" type="question-circle" />
          </m-tag>
        </a-tooltip>
      </template>
      <template slot="action" slot-scope="text, record">
        <div class="table-inline-operator">
          <a-button size="small" :disabled="!record.completedAt" @click.stop="handleInfo(record)">详情</a-button>
          <a-button type="danger" size="small" :disabled="!record.completedAt" @click.stop="handleDelete(record)">删除</a-button>
        </div>
      </template>
    </s-table>
  </div>
</template>

<script>
import { getVirtualCopyList, deleteVirtualCopy } from '@/api/cdm/virtualCopy'
import { STable, MIcon } from '@/components'
import { deepGet, handleFetchStateErrorDone, isEmpty, throttle, toEnum, uniq, convert, columnsBuild } from '@/utils/util'
import Info from './Info'
import events from '../events'

export default {
  components: {
    STable,
    MIcon,
    Info
  },
  data () {
    return {
      columns: [
        {
          title: '名称',
          dataIndex: 'name',
          width: 100,
          ellipsis: true
        },
        {
          title: '客户端',
          dataIndex: 'lblet.name',
          width: 100,
          ellipsis: true
        },
        {
          title: 'IP',
          dataIndex: 'lblet.ipAddr',
          width: 152
        },
        {
          title: '实际容量',
          dataIndex: 'used',
          width: 80,
          scopedSlots: { customRender: 'unitSize' }
        },
        {
          title: '创建时间',
          dataIndex: 'backupStartAt',
          width: 175,
          modules: ['mssql'],
          scopedSlots: { customRender: 'unixToDate' }
        },
        {
          title: '创建时间',
          dataIndex: 'createdAt',
          width: 175,
          modules: ['vmware'],
          scopedSlots: { customRender: 'unixToDate' }
        },
        {
          title: '状态',
          dataIndex: 'state',
          width: 60,
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
          res = await getVirtualCopyList(Object.assign(params, { instanceID: +this.id }))
          res.data = deepGet(res, 'data', []).map(u => ({
            ...u,
            used: deepGet(u, 'persistentVolumes', []).reduce((pre, cur) => pre + deepGet(cur, 'used', 0), 0),
            lblet: deepGet(u, 'lblet', {})
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
      deleteConfirm: null,
      id: null,
      o: {}
    }
  },
  created () {
    this.id = this.$route.params.id
    console.log(this.$route)
    this.o = events.data.find(u => u.id === this.id) || {}
    events.$off(`refresh-VirtualCopy-${this.id}`)
    events.$on(`refresh-VirtualCopy-${this.id}`, () => {
      this.o = events.data.find(u => u.id === this.id) || {}
      this.columns = columnsBuild(this.columns, convert(this.o.app?.kind, 'CDM_APPLICATION_MODULE'))
      this.$refs.table.refresh()
    })
  },
  methods: {
    handleInfo: throttle(function (record) {
      this.$dialog(Info, {
        record: Object.assign(record, { kind: this.o.app?.kind })
      }, {
        width: 800,
        title: record?.name
      })
    }),
    handleDelete: throttle(function (record) {
      this.deleteConfirm = undefined
      const onOk = async () => {
        if (this.deleteConfirm === 'YES') {
          await deleteVirtualCopy({ id: record?.id })
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
    toEnum,
    uniq
  }
}
</script>
