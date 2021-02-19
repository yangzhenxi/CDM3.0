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
      <a-col :md="8" :sm="24">
        <a-card :bordered="false" :bodyStyle="{ height: '470px' }">
          <detail />
        </a-card>
      </a-col>
      <a-col :md="8" :sm="24">
        <a-card :bordered="false" :bodyStyle="{ height: '470px' }">
          <storage />
        </a-card>
      </a-col>
      <a-col :md="8" :sm="24">
        <a-card :bordered="false" :bodyStyle="{ height: '240px' }">
          <strategy />
        </a-card>
        <a-card :bordered="false" :bodyStyle="{ height: '214px' }" style="margin-top: 16px">
          <sla />
        </a-card>
      </a-col>
    </a-row>
    <a-row style="margin-top: 16px">
      <a-tabs type="card" :activeKey="activeKey" @tabClick="handleTabChange">
        <a-tab-pane v-for="item in tabs" :key="item.key" :tab="item.title">
          <a-card :bordered="false">
            <component :is="item.key" />
          </a-card>
        </a-tab-pane>
      </a-tabs>
    </a-row>
  </page-header-wrapper>
</template>

<script>
import { merge, mergeWith } from 'lodash'
import { getApplication, deleteApplication } from '@/api/cdm/application'
import { getMysql, getAllMysqlDatabase } from '@/api/module/mysql'
import { getPgsql } from '@/api/module/pgsql'
import { STable, MIcon } from '@/components'
import { convert, deepGet, handleFetchStateErrorDone, throttle, transformArray } from '@/utils/util'
import { Detail, Storage, Strategy, Sla, Instance, GoldenCopy, VirtualCopy } from './index'
import Backup from '../Backup'
import Test from '../Test'
import events from '../events'

export default {
  name: 'CdmApplicationInfo',
  components: {
    STable,
    MIcon,
    Detail,
    Storage,
    Strategy,
    Sla,
    Instance,
    GoldenCopy,
    VirtualCopy
  },
  data () {
    return {
      tabs: [
        {
          key: 'Instance',
          title: '实例'
        },
        {
          key: 'GoldenCopy',
          title: '黄金副本'
        },
        {
          key: 'VirtualCopy',
          title: '虚拟副本'
        }
      ],
      activeKey: 'Instance',
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
      events.$emit(`refresh-${this.activeKey}-${this.id}`)
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
        const instance = instances[0]
        record.spec = JSON.parse(deepGet(instance, 'spec', '{}'))
        switch (module) {
        case 'mysql':
          const [
            res0,
            res1
          ] = await Promise.all([
            getMysql({ instanceId: +instance?.id }),
            getAllMysqlDatabase({ instanceId: +instance?.id })
          ].map(api => api.catch(error => {
            this.empty = mergeWith(this.empty, handleFetchStateErrorDone(error), (o, s) => {
              if (Array.isArray(o)) {
                return o.concat(s)
              }
              return s
            })
          })))
          record = merge(record, res0, res1)
          break
        case 'pgsql':
          const pgsql = await getPgsql({ instanceId: +instance?.id })
          record.databaseName = [record.spec.dbName]
          record = merge(record, pgsql)
          break
        case 'oracle':
          record.dbSize = record.spec.sizeDB
          break
        }
        // 存储磁盘
        const pv = record.instances.map(u => u?.persistentVolumes).flat()
        if (pv.length) {
          const compressRatio = (pv.reduce((pre, cur) => pre + +deepGet(cur, 'compressRatio', 0), 0) / pv.length).toFixed(2)
          record.storage = {
            pool: deepGet(pv, '0.pool'),
            presetSize: pv.reduce((pre, cur) => pre + +deepGet(cur, 'capacity', 0), 0),
            phyUsedSize: pv.reduce((pre, cur) => pre + +deepGet(cur, 'used', 0), 0) * compressRatio,
            usedSize: pv.reduce((pre, cur) => pre + +deepGet(cur, 'used', 0), 0),
            protocol: deepGet(pv, '0.protocol'),
            compressRatio: compressRatio > 0 ? compressRatio : undefined,
            disk: pv.map((u, index) => ({
              id: index,
              name: u?.name,
              capacity: u?.capacity,
              mountPath: u?.mountPath,
              state: u?.state
            }))
          }
        }
        o.record = record
        o.loading = false
        this.o = o
        transformArray(events.data, { id: this.id }, o)
        events.$emit(`update-detail-${this.id}`)
        events.$emit(`update-storage-${this.id}`)
        events.$emit(`refresh-${this.activeKey}-${this.id}`)
      } catch (error) {
        o.empty = handleFetchStateErrorDone(error)
        o.isEmpty = true
        o.loading = false
        transformArray(events.data, { id: this.id }, o)
        events.$emit(`update-detail-${this.id}`)
        events.$emit(`update-storage-${this.id}`)
        events.$emit(`refresh-${this.activeKey}-${this.id}`)
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
    },
    handleTabChange (activeKey) {
      this.activeKey = activeKey
      this.$nextTick(() => {
        events.$emit(`refresh-${this.activeKey}-${this.id}`)
      })
    }
  }
}
</script>
