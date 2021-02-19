<template>
  <page-header-wrapper :title="false">
    <a-card :bordered="false">
      <step-form :step="step" :config="config">
        <component v-for="item in step" :key="item.dataKey" :is="item.component" :slot="item.component"></component>
      </step-form>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { StepForm } from '@/components'
import { mapMutations } from 'vuex'
import { deepGet, uuid } from '@/utils/util'
import Step1 from './Step1'
import Step2 from './Step2'
import Step3 from './Step3'
export default {
  name: 'ResourceSLAUpdate',
  components: {
    StepForm,
    Step1,
    Step2,
    Step3
  },
  setup (props, context) {
    const step = [
      {
        key: null,
        title: '选择压缩池',
        component: 'Step1',
        dataKey: 'step1'
      },
      {
        key: null,
        title: '编辑SLA策略',
        component: 'Step2',
        dataKey: 'step2'
      },
      {
        key: null,
        title: '完成',
        component: 'Step3',
        dataKey: 'step3'
      }
    ]
    const store = 'SET_RESOURCE_SLA_STEP'
    const route = '/resource/sla'
    const record = {}
    return {
      step,
      config: {
        store,
        route
      },
      record
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
      this.init()
      this.setDefaultData()
    },
    setDefaultData () {
      // 赋值给vuex
      this.set({
        key: 'step0',
        data: this.record
      })
      this.set({
        key: 'step1',
        data: {
          redupPools: ['sdc1']
          // redupPools: deepGet(this.record, 'spec.tree', []).map((u) => deepGet(u, 'target.pool'))
        }
      })
      this.set({
        key: 'step2',
        data: {
          keepDays: deepGet(this.record, 'spec.KeepDays'),
          tree: deepGet(this.record, 'spec.tree', [])
        }
      })
    },
    init () {
      this.current = 0
      this.cache = []
      this.step.map((u) => {
        u.key = `${u.component}-${uuid()}`
        this.cache.push(u.component)
      })
    }
  }
}
</script>
