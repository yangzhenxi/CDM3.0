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
      :emptyItemProps="empty">
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
              <detail :key="index" :data="item" justify="end" :colon="false" style="width: 180px" />
            </template>
          </template>
          <m-tag :color="toEnum(text, 'CDM_APPLICATION_STATE').color">{{ text | convert('CDM_APPLICATION_STATE') }}</m-tag>
        </a-tooltip>
      </template>
    </s-table>
    <div class="step-form-item-operator">
      <a-button @click="back">返回</a-button>
      <a-button type="primary" :loading="confirmLoading" @click="nextStep">下一步</a-button>
    </div>
  </div>
</template>

<script>
import { MIcon, SearchFormBuilder, STable } from '@/components'
import { useStepFormItem } from '@/core/use/form'
import { deepGet, handleFetchStateErrorDone, queryBuild, toEnum, convert, enumToSelection } from '@/utils/util'
import { getAllApplication } from '@/api/cdm/application'
export default {
  name: 'Step1',
  components: {
    SearchFormBuilder,
    STable,
    MIcon
  },
  setup (props, context) {
    const { back, next, insertStep, setStepData } = useStepFormItem(props, context)
    return {
      back,
      next,
      insertStep,
      setStepData
    }
  },
  data () {
    return {
      confirmLoading: false,
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
              options: enumToSelection('CDM_APPLICATION_MODULE', u => ({
                value: u.key,
                label: <span><m-icon type={ u.icon } style="margin-right: 4px; font-size: 20px;"/>{ u.title }</span>
              }))
            }
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
          width: 182,
          scopedSlots: { customRender: 'unixToDate' }
        },
        {
          title: '状态',
          dataIndex: 'state',
          width: 80,
          fixed: 'right',
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
          res = await getAllApplication(Object.assign(params, queryBuild(this.$refs.form.model)))
          res.data = res.data.map(u => ({
            ...u,
            disabled: u.state !== 3
          }))
        } catch (error) {
          this.empty = handleFetchStateErrorDone(error)
        }
        return res
      },
      empty: {
        state: 'empty',
        data: null
      }
    }
  },
  methods: {
    nextStep () {
      this.confirmLoading = true
      const { selectedRows } = this.$refs.table.localRowSelection
      const module = convert(deepGet(selectedRows[0], 'kind'), 'CDM_APPLICATION_MODULE')
      if (selectedRows.length === 0) {
        this.$message.info('请先选择应用！')
        this.confirmLoading = false
        return false
      }
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          this.$emit('insertStep', module)
          this.setStepData({
            data: {
              app: selectedRows[0]
            }
          })
          resolve()
          this.confirmLoading = false
          this.next()
        }, 1000)
      })
    },
    toEnum
  }
}
</script>
