<template>
  <page-header-wrapper :breadcrumb="false" @back="handleBack">
    <template #title>
      <span style="cursor: pointer" @click="handleBack">返回</span>
    </template>
    <a-row :gutter="[16, 16]">
      <a-col :md="16" :sm="24">
        <a-card :bordered="false" :bodyStyle="{ minHeight: '450px' }">
          <result />
        </a-card>
        <a-card :bordered="false" :bodyStyle="{ marginTop: '16px', height: '350px' }">
          <log />
        </a-card>
      </a-col>
      <a-col :md="8" :sm="24">
        <a-affix :offsetTop="80">
          <a-card :bordered="false" :bodyStyle="{ minHeight: '350px', maxHeight: '667px'}">
            <step />
          </a-card>
        </a-affix>
      </a-col>
    </a-row>
  </page-header-wrapper>
</template>

<script>
import { EmptyProvider } from '@/components'
import { transformArray } from '@/utils/util'
import { Result, Step, Log } from './index'
import events from '../events'

export default {
  name: 'TaskMonitorInfo',
  components: {
    EmptyProvider,
    Result,
    Step,
    Log
  },
  data () {
    return {
      title: '任务日志',
      deleteConfirm: null,
      id: null
    }
  },
  computed: {
    o: {
      get () {
        return events.data.find(u => u?.id === this.id) || {}
      },
      set (value) {
        return value
      }
    }
  },
  created () {
    this.id = this.$route.params.id
    transformArray(events.data, { id: this.id }, false)
    events.$off(`refresh-${this.id}`)
    events.$on(`refresh-${this.id}`, ({ isRefresh }) => {
      events.$emit(`refresh-detail-${this.id}`)
    })
  },
  methods: {
    handleBack () {
      this.$router.push({ name: 'TaskMonitor' })
    }
  }
}
</script>
