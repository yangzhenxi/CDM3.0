<template>
  <page-header-wrapper :breadcrumb="false" @back="handleBack">
    <template #title>
      <span style="cursor: pointer" @click="handleBack">返回</span>
    </template>
    <template #extra>
      <div class="form-operator">
        <a-button type="primary" @click="handleUpdate">修改</a-button>
        <a-button type="danger" @click="handleDelete">删除</a-button>
      </div>
    </template>
    <a-row :gutter="[16, 16]">
      <a-col :md="8" :sm="24">
        <a-card :bordered="false" :bodyStyle="{ height: '400px' }">
          <detail />
        </a-card>
      </a-col>
      <a-col :md="16" :sm="24">
        <a-card :bordered="false" :bodyStyle="{ height: '400px' }">
          <history />
        </a-card>
      </a-col>
    </a-row>
  </page-header-wrapper>
</template>

<script>
import { getRecoveryStrategy, deleteRecoveryStrategy } from '@/api/cdm/workflow'
import { deepGet, handleFetchStateErrorDone, throttle, transformArray } from '@/utils/util'
import { Detail, History } from './index'
import Update from '../Update'
import events from '../events'

export default {
  name: 'CdmWorkflowInfo',
  components: {
    Detail,
    History
  },
  data () {
    return {
      deleteConfirm: null,
      id: null,
      o: {}
    }
  },
  created () {
    this.id = this.$route.params.id
    events.$off(`refresh-${this.id}`)
    events.$on(`refresh-${this.id}`, () => {
      this.loadData()
      events.$emit(`refresh-history-${this.id}`)
    })
    this.loadData()
  },
  methods: {
    async loadData () {
      const o = events.data.find(u => u.id === this.id) || {}
      try {
        o.id = this.id
        o.loading = true
        o.record = deepGet(await getRecoveryStrategy({ id: this.id }), 'data', {})
        o.record.statusLoading = false
        o.loading = false
        this.o = o
        transformArray(events.data, { id: this.id }, o)
        events.$emit(`update-detail-${this.id}`)
      } catch (error) {
        o.empty = handleFetchStateErrorDone(error)
        o.isEmpty = true
        o.loading = false
        transformArray(events.data, { id: this.id }, o)
        events.$emit(`update-detail-${this.id}`)
      }
    },
    handleUpdate: throttle(function () {
      this.$dialog(Update, {
        record: this.o.record,
        on: {
          ok: () => {
            events.$emit(`refresh-${this.id}`)
          }
        }
      }, { title: '修改工作流' })
    }),
    handleDelete: throttle(function () {
      this.deleteConfirm = undefined
      const onOk = async () => {
        if (this.deleteConfirm === 'YES') {
          await deleteRecoveryStrategy({ id: this.id })
          modal.destroy()
          this.$multiTab.close(this.$route.fullPath, { force: true })
          this.handleBack()
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
            </p>
            <a-input v-model={ this.deleteConfirm } placeholder="请输入" allowClear { ... { on: { pressEnter: onOk } }} />
          </div>
        ),
        maskClosable: true,
        destroyOnClose: true,
        onOk
      })
    }),
    handleBack () {
      this.$router.push({ name: 'CdmWorkflow' })
    }
  }
}
</script>
