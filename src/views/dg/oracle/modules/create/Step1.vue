<template>
  <div class="step-form-item">
    <search-form-builder ref="form" :items="searchFormItems" @refresh="$refs.table.refresh()" />
    <s-table
      ref="table"
      :columns="columns"
      :fetchData="fetchData"
      :showPagination="false"
      :rowSelection="{ type: 'radio' }"
      :rowClick="true"
      :emptyItemProps="empty"
    >
      <template slot="os" slot-scope="text">
        <m-icon :type="toEnum(text, 'R_LBLET_OS').icon" style="font-size: 20px" />
      </template>
      <template slot="labels" slot-scope="text">
        {{ text }}
      </template>
      <template slot="state" slot-scope="text, record">
        <a-tooltip :title="deepGet(record, 'error')">
          <m-tag :color="toEnum(text, 'R_LBLET_STATE').color">{{ text | convert('R_LBLET_STATE') }}</m-tag>
        </a-tooltip>
      </template>
    </s-table>
    <div class="step-form-item-operator" style="margin-top: 16px">
      <a-button @click="back">{{ $t('layouts.step.operator.back') }}</a-button>
      <a-button type="primary" @click="nextStep">{{ $t('layouts.step.operator.next') }}</a-button>
    </div>
  </div>
</template>

<script>
import { getAllLblet } from '@/api/resource/lblet'
import { MIcon, SearchFormBuilder, STable } from '@/components'
import { useStepFormItem } from '@/core/use/form'
import { convert, deepGet, handleFetchStateErrorDone, isEmpty, queryBuild, toEnum } from '@/utils/util'

export default {
  name: 'Step1',
  components: {
    MIcon,
    SearchFormBuilder,
    STable
  },
  setup (props, context) {
    const {
      back,
      next,
      setStepData
    } = useStepFormItem(props, context)
    return {
      back,
      next,
      setStepData
    }
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
          prop: 'ip',
          component: {
            name: 'a-input'
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
          title: '标签',
          dataIndex: 'labels',
          width: 80,
          scopedSlots: { customRender: 'labels' }
        },
        {
          title: '最后在线时间',
          dataIndex: 'updatedAt',
          width: 182,
          scopedSlots: { customRender: 'unixToDate' }
        },
        {
          title: '状态',
          dataIndex: 'state',
          width: 80,
          scopedSlots: { customRender: 'state' }
        }
      ],
      fetchData: async params => {
        this.empty = {
          state: 'empty',
          data: null
        }
        let res = {}
        try {
          res = await getAllLblet(Object.assign(params, queryBuild(this.$refs.form.model)))
        } catch (error) {
          this.empty = handleFetchStateErrorDone(error)
        }
        return isEmpty(this.empty?.data) ? res : {}
      },
      empty: {
        state: 'empty',
        data: null
      }
    }
  },
  methods: {
    nextStep () {
      const { selectedRows } = this.$refs.table.localRowSelection
      if (!selectedRows.length) {
        this.$message.info('请先选择客户端！')
        return
      }
      this.setStepData({
        data: {
          primaryPod: {
            lblets: selectedRows
          }
        }
      })
      this.next()
    },
    convert,
    deepGet,
    toEnum
  }
}
</script>

<style lang="less" scoped>
  .step-form-content {
    .step-form-item {
      max-width: 100%;
    }
  }
</style>
