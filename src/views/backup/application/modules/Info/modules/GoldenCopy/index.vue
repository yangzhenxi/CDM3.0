<template>
  <a-spin :spinning="o.loading">
    <s-table
      ref="table"
      :columns="columns"
      :fetchData="fetchData"
      :autoLoad="false"
      :emptyItemProps="empty"
    >
      <template slot="state" slot-scope="text,record">
        <span v-if="!record.completedAt"><m-tag color="green">创建中</m-tag></span>
        <a-tooltip v-else>
          <template slot="title" v-if="record.message">
            <div v-for="item in uniq(record.message.split('&&'))" :key="item">
              {{ item }}
            </div>
          </template>
          <m-tag :color="toEnum(text, 'CDM_GOLDENCOPY_STATE').color">
            {{ text | convert('CDM_GOLDENCOPY_STATE') }}
            <a-icon v-if="record.message" type="question-circle" />
          </m-tag>
        </a-tooltip>
      </template>
      <template slot="optionTime" slot-scope="text,record">
        {{ record.optionStartTime | convert('unixToDate') }}   --   {{ record.optionEndTime | convert('unixToDate') }}
      </template>

      <template slot="consuming" slot-scope="text,record">
        {{ (`${deepGet(record, 'completedAt', 0)}`.substring(0, 10) - `${deepGet(record, 'backupStartAt', 0)}`.substring(0, 10)) | convert('unixDiff') }}
      </template>
      <template slot="action" slot-scope="text, record">
        <div class="table-inline-operator">
          <a-button type="primary" size="small" :disabled="record.state !== 1 || !record.completedAt" @click.stop="handleRecover(record)">挂载</a-button>
          <a-button size="small" :disabled="!record.completedAt" @click.stop="handleInfo(record)">详情</a-button>
          <a-button type="danger" size="small" :disabled="!record.completedAt" @click.stop="handleDelete(record)">删除</a-button>
        </div>
      </template>
    </s-table>
  </a-spin>
</template>

<script>
import { getGoldenCopyList, deleteGoldenCopy } from '@/api/cdm/goldenCopy'
import { STable } from '@/components'
import { convert, deepGet, handleFetchStateErrorDone, isEmpty, throttle, toEnum, uniq } from '@/utils/util'
import Info from './Info'
import events from '../events'

export default {
  components: {
    STable,
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
          title: '实际容量',
          dataIndex: 'used',
          width: 80,
          scopedSlots: { customRender: 'unitSize' }
        },
        {
          title: '耗时',
          dataIndex: 'takeTime',
          width: 165,
          ellipsis: true
        },
        {
          title: '可选时间',
          dataIndex: 'optionTime',
          width: 380
        },
        {
          title: '状态',
          dataIndex: 'state',
          width: 60,
          scopedSlots: { customRender: 'state' }
        },
        {
          title: '可选时间',
          width: 265,
          scopedSlots: { customRender: 'optionTime' }
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: 195,
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
          res = await getGoldenCopyList(Object.assign(params, { instanceID: +this.id }))
          res.data = res.data.map(u => ({
            ...u,
            used: deepGet(u, 'snapshots', []).reduce((pre, cur) => pre + deepGet(cur, 'used', 0), 0),
            takeTime: convert(`${deepGet(u, 'completedAt', 0)}`.substring(0, 10) - `${deepGet(u, 'backupStartAt', 0)}`.substring(0, 10), 'unixDiff'),
            optionTime: `${convert(deepGet(u, 'optionStartTime', 0), 'unixToDate')} - ${convert(deepGet(u, 'optionEndTime', 0), 'unixToDate')}`
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
      o: {
        loading: true
      }
    }
  },
  created () {
    this.id = this.$route.params.id
    this.o = events.data.find(u => u.id === this.id) || {}
    events.$off(`refresh-GoldenCopy-${this.id}`)
    events.$on(`refresh-GoldenCopy-${this.id}`, () => {
      this.o = events.data.find(u => u.id === this.id) || {}
      this.$refs.table.refresh()
    })
  },
  methods: {
    handleRecover: throttle(function (record) {
      this.$router.push({ path: `/cdm/application/${record?.applicationId}/goldenCopy/recover/${record?.id}`, query: { name: record?.name, instanceId: this.o.instance.id, type: 2 } })
    }),
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
          await deleteGoldenCopy({ id: record?.id })
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
    uniq,
    deepGet
  }
}
</script>
