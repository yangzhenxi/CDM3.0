<template>
  <div>
    <search-form-builder ref="form" :items="searchFormItems" />
    <s-table
      :rowKey="(record,index)=> {return index}"
      ref="table"
      :columns="columns"
      :fetchData="fetchData"
      :showRowSelection="true"
      rowSelectionType="radio"
      :emptyItemProps="empty">
      <template slot="os" slot-scope="text">
        <m-icon :type="toEnum(text, 'R_LBLET_OS').icon" style="font-size: 20px" />
      </template>
      <template slot="status" slot-scope="">
        TODO
      </template>
    </s-table>
    <div class="step-form-item-operator">
      <a-button @click="back">取消新建</a-button>
      <a-button type="primary" style="margin-right: 8px" @click="prev">上一步</a-button>
      <a-button type="primary" :loading="confirmLoading" @click="nextStep">下一步</a-button>
    </div>
  </div>
</template>

<script>
import { MIcon, SearchFormBuilder, STable } from '@/components'
import { deepGet, handleFetchStateErrorDone, isEmpty, queryBuild } from '@/utils/util'
import { useStepFormItem } from '@/core/use/form'
import { getAllLblet } from '@/api/resource/lblet'
export default {
  name: 'Step1',
  components: {
    SearchFormBuilder,
    STable,
    MIcon
  },
  setup (props, context) {
    const {
      back,
      prev,
      next
    } = useStepFormItem(props, context)
    return {
      back,
      next,
      prev
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
          label: 'IP',
          prop: 'IP',
          component: {
            name: 'a-input'
          }
        },
        {
          label: '标签',
          prop: 'type',
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
          ellipsis: true,
          scopedSlots: { customRender: 'name' }
        },
        {
          title: 'IP',
          dataIndex: 'ip_addr',
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
          title: '最后在线时间',
          dataIndex: 'uptime',
          width: 182,
          scopedSlots: { customRender: 'time' }
        },
        {
          title: '状态',
          dataIndex: 'status',
          width: 100,
          scopedSlots: { customRender: 'statue' }
        }
      ],
      fetchData: async params => {
        this.empty = {
          state: 'empty',
          data: null
        }
        let data = []
        try {
          data = deepGet(await getAllLblet(Object.assign(queryBuild(this.$refs.form.model))), 'data', [])
        } catch (error) {
          this.empty = handleFetchStateErrorDone(error)
        }
        return {
          data
        }
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
      const selectedRows = this.$refs.table.localRowSelection.selectedRows
      if (!isEmpty(selectedRows)) {
        this.$emit('setStepData', {
          data: {
            lblet: selectedRows
          }
        })
        this.confirmLoading = false
        this.next()
      } else {
        this.$message.info('请先选择客户端！')
        this.confirmLoading = false
      }
    }
  }
}
</script>

<style lang="less" scoped>
.content-wrapper {
  max-width: 750px;
  margin: 16px auto;
}

</style>
