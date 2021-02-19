<template>
  <page-header-wrapper :breadcrumb="false" @back="handleBack">
    <template #title>
      <span style="cursor: pointer" @click="handleBack">返回</span>
    </template>
    <template #extra>
      <div class="form-operator">
        <a-button type="primary" @click="handleBackup">备份</a-button>
        <a-button @click="handleTest">测试</a-button>
        <a-button type="danger" @click="handleDelete">删除</a-button>
      </div>
    </template>
    <a-row :gutter="[16, 16]">
      <a-col :md="16" :sm="24">
        <a-card :bordered="false" :bodyStyle="{ height: '700px' }">
          <instances />
        </a-card>
      </a-col>
      <a-col :md="8" :sm="24">
        <a-card :bordered="false" :bodyStyle="{ height: '214px' }">
          <detail />
        </a-card>
        <a-card :bordered="false" :bodyStyle="{ height: '230px' }" style="margin-top: 16px">
          <strategy />
        </a-card>
        <a-card :bordered="false" :bodyStyle="{ height: '224px' }" style="margin-top: 16px">
          <sla />
        </a-card>
      </a-col>
    </a-row>
  </page-header-wrapper>
</template>

<script>
import { merge } from 'lodash'
import { getApplication, deleteApplication } from '@/api/cdm/application'
import { getMssql } from '@/api/module/mssql'
import { convert, deepGet, handleFetchStateErrorDone, throttle, transformArray } from '@/utils/util'
import { Instances, Detail, Strategy, Sla } from './index'
import Backup from '../Backup'
import Test from '../Test'
import events from '../events'

export default {
  name: 'CdmApplicationInstancesInfo',
  components: {
    Instances,
    Detail,
    Strategy,
    Sla,
    Backup,
    Test
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
      events.$emit(`refresh-strategy-${this.id}`)
      events.$emit(`refresh-sla-${this.id}`)
    })
    this.loadData()
  },
  methods: {
    async loadData () {
      const o = events.data.find(u => u.id === this.id) || {}
      try {
        o.id = this.id
        o.loading = true
        let record = deepGet(await getApplication({ id: this.id }), 'data', {})
        // 根据应用类型 - 处理
        const module = convert(record.kind, 'CDM_APPLICATION_MODULE')
        const instances = deepGet(record, 'instances', [])
        record.spec = JSON.parse(deepGet(instances, '0.spec', '{}'))
        switch (module) {
        case 'mssql':
          const instance = instances[0]
          const mssql = await getMssql({ instanceId: instance?.id })
          record = merge(record, mssql)
          break
        }
        o.record = record
        o.loading = false
        this.o = o
        transformArray(events.data, { id: this.id }, o)
        events.$emit(`update-detail-${this.id}`)
        events.$emit(`update-instance-${this.id}`)
      } catch (error) {
        o.empty = handleFetchStateErrorDone(error)
        o.isEmpty = true
        o.loading = false
        transformArray(events.data, { id: this.id }, o)
        events.$emit(`update-detail-${this.id}`)
      }
    },
    handleBackup: throttle(function () {
      this.$dialog(Backup, {
        record: this.o.record,
        on: {
          ok: () => {
            events.$emit(`refresh-${this.id}`)
          }
        }
      }, { title: '备份' })
    }),
    handleTest: throttle(function () {
      this.$dialog(Test, {
        record: this.o.record,
        on: {
          ok: () => {
            events.$emit(`refresh-${this.id}`)
          }
        }
      }, { title: '测试' })
    }),
    handleDelete: throttle(function () {
      this.deleteConfirm = undefined
      const onOk = async () => {
        if (this.deleteConfirm === 'YES') {
          await deleteApplication({ id: this.id })
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
      this.$router.push({ name: 'CdmApplication' })
    }
  }
}
</script>
