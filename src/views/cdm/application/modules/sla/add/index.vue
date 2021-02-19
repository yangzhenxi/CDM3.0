<template>
  <page-header-wrapper :title="false">
    <a-card :bordered="false">
      <step-form :step="step" :config="config">
        <component v-for="item in step" :key="item.dataKey" :is="item.component" :slot="item.component" ></component>
      </step-form>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { mapMutations } from 'vuex'
import { StepForm } from '@/components'
import Step1 from './Step1'
import Step2 from './Step2'

export default {
  components: {
    StepForm,
    Step1,
    Step2
  },
  setup (props, context) {
    const step = [
      {
        key: null,
        title: '编辑SLA策略',
        component: 'Step1',
        dataKey: 'step1'
      },
      {
        key: null,
        title: '完成',
        component: 'Step2',
        dataKey: 'step2'
      }
    ]
    const store = 'SET_RESOURCE_SLA_STEP'
    const route = '/resource/sla'
    const current = 0
    const cache = 0
    return {
      step,
      cache,
      current,
      config: {
        store,
        route
      }
    }
  },
  created () {
    this.loadData()
  },
  methods: {
    ...mapMutations({
      set: 'SET_RESOURCE_SLA_STEP'
    }),
    async loadData () {
      this.set({
        key: 'step0',
        data: { applicationId: this.$route.params.applicationId }
      })
    }
  }
}

</script>
