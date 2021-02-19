<template>
  <div>
    <search-form-builder ref="form" :items="searchFormItems" @refresh="$refs.table.refresh()" />
    <s-table
      ref="table"
      :columns="columns"
      :fetchData="fetchData"
      :rowSelection="{ type: 'radio', getCheckboxProps: record => ({
        props: {
          disabled: record.disabled
        }
      })}"
      :rowClick="true"
      :emptyItemProps="empty"
    >
      <template slot="os" slot-scope="text">
        <m-icon :type="toEnum(text, 'R_LBLET_OS').icon" style="font-size: 20px" />
      </template>
      <template slot="state" slot-scope="text">
        <m-tag :color="toEnum(text, 'R_LBLET_STATE').color">{{ text | convert('R_LBLET_STATE') }}</m-tag>
      </template>
    </s-table>
    <div class="step-form-item-operator">
      <a-button @click="back">返回</a-button>
      <a-button @click="prev">上一步</a-button>
      <a-button type="primary" :loading="confirmLoading" @click="nextStep">下一步</a-button>
    </div>
  </div>
</template>

<script>
import { mergeWith } from 'lodash'
import { getApplication } from '@/api/cdm/application'
import { getAllLblet } from '@/api/resource/lblet'
import { SearchFormBuilder, STable, MIcon } from '@/components'
import { useStepFormItem } from '@/core/use'
import { deepGet, isEmpty, handleFetchStateErrorDone, convert, queryBuild, toEnum } from '@/utils/util'

export default {
  name: 'Step1',
  components: {
    SearchFormBuilder,
    STable,
    MIcon
  },
  setup (props, context) {
    const { back, next, prev, setStepData, insertStep } = useStepFormItem(props, context)
    return {
      back,
      next,
      prev,
      setStepData,
      insertStep
    }
  },
  data () {
    return {
      kind: null,
      instances: [],
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
          prop: 'ip',
          component: {
            name: 'a-input'
          }
        },
        {
          label: '标签',
          prop: 'label',
          component: {
            name: 'm-select'
          }
        }
      ],
      columns: [
        {
          title: '名称',
          dataIndex: 'name',
          width: 100,
          ellipsis: true
        },
        {
          title: 'IP',
          dataIndex: 'ipAddr',
          width: 152
        },
        {
          title: '操作系统',
          dataIndex: 'os',
          width: 80,
          align: 'center',
          scopedSlots: { customRender: 'os' }
        },
        {
          title: '存储容量',
          dataIndex: 'memory',
          width: 108,
          scopedSlots: { customRender: 'unitSize' }
        },
        {
          title: '最后在线时间',
          dataIndex: 'uptime',
          width: 182,
          scopedSlots: { customRender: 'unixToDate' }
        },
        {
          title: '状态',
          dataIndex: 'state',
          width: 100,
          scopedSlots: { customRender: 'state' }
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
          getAllLblet(Object.assign(params, queryBuild(this.$refs.form.model))),
          getApplication({ id: this.$route.params.applicationId })
        ].map(api => api.catch(error => {
          this.empty = mergeWith(this.empty, handleFetchStateErrorDone(error), (o, s) => {
            if (Array.isArray(o)) {
              return o.concat(s)
            }
            return s
          })
        })))).map(u => deepGet(u, [], {}))
        const data = deepGet(res1, 'data')
        this.kind = deepGet(data, 'kind')
        this.instances = deepGet(data, 'instances', [])
        res0.data = res0.data.map(u => ({
          ...u,
          disabled: !u?.name || u.state !== 1
        }))
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
      confirmLoading: false
    }
  },
  methods: {
    async nextStep () {
      this.confirmLoading = true
      const { selectedRows } = this.$refs.table.localRowSelection
      if (!selectedRows.length) {
        this.$message.info('请先选择客户端！')
        this.confirmLoading = false
        return
      }
      // this.$emit('insertStep', 'mssql')
      this.$emit('insertStep', convert(this.kind, 'CDM_APPLICATION_MODULE'))
      // const instance = this.instances.map(u => u.id === this.$route.params.id)
      this.setStepData({
        data: {
          lblet: selectedRows[0],
          kind: this.kind
        }
      })
      this.confirmLoading = false
      this.next()
    },
    toEnum
  }
}
</script>
