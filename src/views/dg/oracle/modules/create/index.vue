<template>
  <page-header-wrapper :title="false">
    <a-card :body-style="{ padding: '24px 32px' }" :bordered="false">
      <step-form :step="step" :config="config" class="step-form-wrapper">
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
import Step4 from './Step4'
import Step5 from './Step5'
import Step6 from './Step6'

export default {
  name: 'StoragePoolAdd',
  components: {
    StepForm,
    Step1,
    Step2,
    Step3,
    Step4,
    Step5,
    Step6
  },
  setup (props, context) {
    const step = [
      {
        title: '选择主库客户端',
        component: 'Step1',
        dataKey: 'step1'
      },
      {
        title: '选择主库实例',
        component: 'Step2',
        dataKey: 'step2'
      },
      {
        title: '选择从库客户端',
        component: 'Step3',
        dataKey: 'step3'
      },
      {
        title: '选择从库实例',
        component: 'Step4',
        dataKey: 'step4'
      },
      {
        title: '确定容灾组',
        component: 'Step5',
        dataKey: 'step5'
      },
      {
        title: '完成',
        component: 'Step6',
        dataKey: 'step6'
      }
    ]
    const store = 'SET_DG_ORACLE_STEP'
    const route = '/dg/oracle'
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

<style lang="less" scoped>
  .step-form-wrapper {
    /deep/ .step-form {
      max-width: 100%;
    }
  }
</style>
