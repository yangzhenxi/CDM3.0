<template>
  <page-header-wrapper :breadcrumb="false" @back="handleBack">
    <template #title>
      <span style="cursor: pointer" @click="handleBack">返回</span>
    </template>
    <a-row :gutter="[16, 16]">
      <a-col :md="24" :sm="24">
        <a-card :bordered="false" :bodyStyle="{ height: '450px' }">
          <detail />
        </a-card>
      </a-col>
      <a-col :md="24" :sm="24">
        <a-card :bordered="false" :bodyStyle="{ height: '400px' }">
          <history />
        </a-card>
      </a-col>
    </a-row>
  </page-header-wrapper>
</template>

<script>
import { deepGet, handleFetchStateErrorDone, transformArray } from '@/utils/util'
import { Detail, History } from './index'
import events from '../events'
import { getApplication } from '@/api/cdm/application'

export default {
  name: 'CdmApplicationSLAInfo',
  components: {
    Detail,
    History
  },
  data () {
    return {
      applicationId: null,
      application: {},
      id: null,
      o: {}
    }
  },
  created () {
    this.id = this.$route.params.id
    this.applicationId = this.$route.params.applicationId
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
        this.application = deepGet(await getApplication({ id: this.applicationId }), 'data', {})
        o.id = this.id
        o.loading = true
        o.record = {
          id: '16',
          applicationId: '1',
          chain: {
            poolId: 1,
            keep: 6,
            targets: [
              {
                poolId: 4,
                keep: 5
              }
            ]
          }
        }
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
    handleBack () {
      console.log(this.application)
      let path = `/cdm/application/${this.applicationId}`
      if ([3, 6].includes(this.application?.kind)) {
        path = `/cdm/application/${this.applicationId}/instances`
      }
      this.$router.push({ path, query: { name: this.application?.name } })
    }
  }
}
</script>
