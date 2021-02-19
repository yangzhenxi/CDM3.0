<template>
  <page-header-wrapper :title="false">
    <a-card :body-style="{ padding: '24px 32px' }" :bordered="false">
      <step-form :step="step" :config="config">
        <component v-for="item in step" :key="item.dataKey" :is="item.component" :slot="item.component" />
      </step-form>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { StepForm } from '@/components'
import Step1 from './Step1'
import Step2 from './Step2'
import Step3 from './Step3'

export default {
  name: 'StoragePoolAdd',
  components: {
    StepForm,
    Step1,
    Step2,
    Step3
  },
  setup (props, context) {
    const step = [
      {
        title: '选择存储池',
        component: 'Step1',
        dataKey: 'step1'
      },
      {
        title: '选择磁盘',
        component: 'Step2',
        dataKey: 'step2'
      },
      {
        title: '完成',
        component: 'Step3',
        dataKey: 'step3'
      }
    ]
    const store = 'SET_STORAGE_POOL_STEP'
    const route = '/storage/pool'
    return {
      step,
      config: {
        store,
        route
      }
    }
  }
}

</script>
