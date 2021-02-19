<template>
  <page-header-wrapper :breadcrumb="false" @back="handleBack">
    <template #title>
      <span style="cursor: pointer" @click="handleBack">返回</span>
    </template>
    <a-row :gutter="[16, 16]">
      <a-col :md="8" :sm="24">
        <a-card :bordered="false">
          <detail />
        </a-card>
        <a-card :bordered="false" :bodyStyle="{ marginTop: '16px' }">
          <protocol />
        </a-card>
      </a-col>
      <a-col :md="16" :sm="24">
        <operator />
        <a-card :bordered="false">
          <application />
        </a-card>
      </a-col>
    </a-row>
  </page-header-wrapper>
</template>

<script>
import { getLblet } from '@/api/resource/lblet'
import { deepGet, handleFetchStateErrorDone, transformArray } from '@/utils/util'
import { Detail, Protocol, Operator, Application } from './index'
import events from '../events'

export default {
  name: 'ResourceLbletInfo',
  components: {
    Detail,
    Protocol,
    Operator,
    Application
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
      events.$emit(`refresh-application-${this.id}`)
    })
    this.loadData()
  },
  methods: {
    async loadData () {
      const o = events.data.find(u => u.id === this.id) || {}
      try {
        o.id = this.id
        o.loading = true
        o.record = deepGet(await getLblet({ id: this.id }), 'data', {})
        o.loading = false
        this.o = o
        transformArray(events.data, { id: this.id }, o)
        events.$emit(`update-detail-${this.id}`)
        events.$emit(`update-operator-${this.id}`)
        events.$emit(`update-protocol-${this.id}`)
      } catch (error) {
        o.empty = handleFetchStateErrorDone(error)
        o.isEmpty = true
        o.loading = false
        transformArray(events.data, { id: this.id }, o)
        events.$emit(`update-detail-${this.id}`)
        events.$emit(`update-protocol-${this.id}`)
      }
    },
    handleBack () {
      this.$router.push({ name: 'ResourceLblet' })
    }
  }
}
</script>
