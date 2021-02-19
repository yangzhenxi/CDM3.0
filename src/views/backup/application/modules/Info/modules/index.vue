<template>
  <page-header-wrapper :breadcrumb="false" @back="handleBack">
    <template #title>
      <span style="cursor: pointer" @click="handleBack">返回</span>
    </template>
    <a-row :gutter="[16, 16]">
      <a-col :md="8" :sm="24">
        <a-card :bordered="false" :bodyStyle="{ height: '350px' }">
          <detail />
        </a-card>
      </a-col>
      <a-col :md="16" :sm="24">
        <a-card :bordered="false" :bodyStyle="{ height: '350px' }">
          <storage />
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
import { getApplication } from '@/api/cdm/application'
import { getMysql, getAllMysqlDatabase } from '@/api/module/mysql'
import { getMssqlDatabase, getMssql } from '@/api/module/mssql'
import { convert, deepGet, handleFetchStateErrorDone, transformArray } from '@/utils/util'
import { Detail, Storage, GoldenCopy, VirtualCopy } from './index'
import events from './events'

export default {
  name: 'BackupApplicationInstanceInfo',
  components: {
    Detail,
    Storage,
    GoldenCopy,
    VirtualCopy
  },
  data () {
    return {
      tabs: [
        {
          key: 'GoldenCopy',
          title: '黄金副本'
        },
        {
          key: 'VirtualCopy',
          title: '虚拟副本'
        }
      ],
      activeKey: 'GoldenCopy',
      applicationId: null,
      id: null,
      o: {}
    }
  },
  created () {
    this.id = this.$route.params.id
    this.applicationId = this.$route.params?.applicationId
    events.$off(`refresh-${this.id}`)
    events.$on(`refresh-${this.id}`, () => {
      this.loadData()
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
        const app = deepGet(await getApplication({ id: this.applicationId }), 'data', {})
        // 根据应用类型 - 处理
        const module = convert(app.kind, 'CDM_APPLICATION_MODULE')
        let instance = deepGet(app, 'instances', []).find(u => u.id === this.id) || {}
        instance.spec = JSON.parse(deepGet(instance, 'spec', '{}'))
        switch (module) {
        case 'mssql':
          const [
            res0,
            res1
          ] = await Promise.all([
            getMssql({ instanceId: instance.id }),
            getMssqlDatabase({ instanceId: instance.id })
          ].map(api => api.catch(error => {
            this.empty = mergeWith(this.empty, handleFetchStateErrorDone(error), (o, s) => {
              if (Array.isArray(o)) {
                return o.concat(s)
              }
              return s
            })
          })))
          res0.ldfCapacity = deepGet(res1, 'ldf', []).reduce((pre, cur) => +deepGet(cur, 'size', 0) + pre, 0)
          res0.mdfCapacity = deepGet(res1, 'mdf', []).reduce((pre, cur) => +deepGet(cur, 'size', 0) + pre, 0)
          instance = merge(instance, res0, res1)
          break
        case 'mysql':
          const [mysql0, mysql1] = await Promise.all(
            [getMysql({ instanceId: +instance?.id }), getAllMysqlDatabase({ instanceId: +instance?.id })].map(api =>
              api.catch(error => {
                this.empty = mergeWith(this.empty, handleFetchStateErrorDone(error), (o, s) => {
                  if (Array.isArray(o)) {
                    return o.concat(s)
                  }
                  return s
                })
              })
            )
          )
          instance = merge(instance, mysql0, mysql1)
          break
        }
        // 存储信息
        const pv = deepGet(instance, 'persistentVolumes', [])
        if (pv.length) {
          const compressRatio = (pv.reduce((pre, cur) => pre + +deepGet(cur, 'compressRatio', 0), 0) / pv.length).toFixed(2)
          instance.storage = {
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
        o.app = app
        o.instance = instance
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
    handleBack () {
      this.$router.push({ path: `/cdm/application/${this.applicationId}/instances`, query: { name: this.o.app?.name } })
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
