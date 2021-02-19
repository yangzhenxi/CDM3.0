<template>
  <a-spin :spinning="loading">
    <div ref="dashboard" :class="['dashboard-wrapper']">
      <a-row :gutter="[16, 16]" v-for="(value, key) in data" :key="key" :class="key">
        <a-col :sm="24" :xl="24 / value.length" v-for="item in value" :key="item.key">
          <component :is="item.component" :data="item" />
        </a-col>
      </a-row>
    </div>
  </a-spin>
</template>

<script>
import { getDashboard, getDashboardPool, getDashboardDG } from '@/api/dashboard/workplace'
import { deepGet } from '@/utils/util'
import Resource from './resource'
import Storage from './storage'
import Cdm from './cdm'
import Backup from './backup'
import Dg from './dg'
import Log from './log'
import events from './events'

export default {
  name: 'Workplace',
  components: {
    Resource,
    Storage,
    Cdm,
    Backup,
    Dg,
    Log
  },
  data () {
    return {
      data: {
        resource: [
          {
            key: 'lblet',
            title: '客户端',
            name: 'ResourceLblet',
            component: 'resource'
          },
          {
            key: 'virtual',
            title: '虚拟化',
            name: 'ResourceVirtual',
            component: 'resource'
          },
          {
            key: 'component',
            title: '组件',
            name: 'SystemComponent',
            component: 'resource'
          },
          {
            key: 'alert',
            title: '告警',
            name: 'LogAlert',
            component: 'resource'
          }
        ],
        storage: [
          {
            key: 'pool',
            title: '存储池',
            name: 'StoragePool',
            component: 'storage'
          },
          {
            key: 'io',
            title: '吞吐量',
            component: 'storage'
          },
          {
            key: 'iops',
            title: 'IOPS',
            component: 'storage'
          }
        ],
        cdm: [
          {
            key: 'application',
            title: '应用',
            type: 'CDM',
            component: 'cdm',
            icon: 'app'
          },
          {
            key: 'goldenCopy',
            title: '黄金副本',
            type: 'CDM',
            component: 'cdm',
            icon: 'copy'
          },
          {
            key: 'virtualCopy',
            title: '虚拟副本',
            type: 'CDM',
            component: 'cdm',
            icon: 'copy'
          },
          {
            key: 'sla',
            title: 'SLA',
            type: 'CDM',
            component: 'cdm',
            icon: 'sla'
          }
        ],
        backup: [
          {
            key: 'application',
            title: '应用',
            type: '数据备份',
            component: 'backup',
            icon: 'app'
          },
          {
            key: 'goldenCopy',
            title: '黄金副本',
            type: '数据备份',
            component: 'backup',
            icon: 'copy'
          },
          {
            key: 'virtualCopy',
            title: '虚拟副本',
            type: '数据备份',
            component: 'backup',
            icon: 'copy'
          }
        ],
        dg: [
          {
            key: 'ready',
            title: '容灾管理',
            state: 1,
            component: 'dg',
            icon: 'dg'
          },
          {
            key: 'unReady',
            title: '容灾管理',
            state: 2,
            component: 'dg',
            icon: 'dg'
          }
        ],
        log: [
          {
            key: 'user',
            title: '用户日志',
            name: 'LogUser',
            component: 'log'
          }
        ]
      },
      loading: false
    }
  },
  mounted () {
    this.loadData()
    this.loadPoolData()
    this.loadDGData()
  },
  methods: {
    async loadData () {
      try {
        this.loading = true
        events.data = deepGet(await getDashboard(), 'data', {})
        this.loading = false
      } catch (error) {
        this.loading = false
      }
    },
    async loadPoolData () {
      events.storage.poolList = deepGet(await getDashboardPool(), 'data', [])
      events.storage.selectedPoolKey = events.storage.poolList[0].name
    },
    async loadDGData () {
      events.data.dg = deepGet(await getDashboardDG(), 'data', {})
    }
  }
}
</script>

<style lang="less" scoped>
  .dashboard-wrapper {
    z-index: 5;
    .clip-path {
      position: absolute;
      width: 100%;
      height: 100%;
      background: @gray-1;
      @width: 2px;
      @edge: 16px;
      clip-path: polygon(
        @edge 0,
        calc(@edge + @width / sqrt(2)) @width,
        @width calc(@edge + @width / sqrt(2)),
        @width calc(100% - (@edge + @width / sqrt(2))),
        calc(@edge + @width / sqrt(2)) calc(100% - @width),
        calc(100% - @edge - @width / sqrt(2)) calc(100% - @width),
        calc(100% - @width) calc(100% - @edge - @width / sqrt(2)),
        calc(100% - @width)  calc(@edge + @width / sqrt(2)),
        calc(100% - @edge - @width / sqrt(2)) @width,
        calc(@edge + @width / sqrt(2)) @width,
        @edge 0,
        calc(100% - @edge)  0,
        100% @edge,
        100% calc(100% - @edge),
        calc(100% - @edge) 100%,
        @edge 100%,
        0 calc(100% - @edge),
        0 @edge
      );
    }
    .cdm {
      position: relative;
      margin: 16px 0px !important;
      background: linear-gradient(to bottom, @gray-4 0%, @gray-1 50%, @gray-4 100%);
      .col {
        padding: 24px !important;
      }
    }
    .backup {
      position: relative;
      margin: 16px 0px !important;
      background: linear-gradient(to bottom, @gray-4 0%, @gray-1 50%, @gray-4 100%);
      .col {
        padding: 24px !important;
      }
    }
    .dg {
      position: relative;
      margin: 16px 0px !important;
      background: linear-gradient(to bottom, @gray-4 0%, @gray-1 50%, @gray-4 100%);
      .col {
        padding: 24px !important;
      }
    }
  }

</style>
