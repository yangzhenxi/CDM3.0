<template>
  <page-header-wrapper :title="false">
    <a-card :body-style="{ padding: '24px 32px' }" :bordered="false">
      {{ module }}
      <step-form ref="form" :step="step" :config="config" >
        <empty-provider v-if="isEmpty" :isEmpty="isEmpty" :minHeight="180"/>
        <component v-else v-for="item in step" :key="item.dataKey" :is="item.component" :slot="item.component" ></component>
      </step-form>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { EmptyProvider, StepForm } from '@/components'
import OracleStep1 from './oracle/Step1'
import PgsqlStep1 from './pgsql/Step1'
import PgsqlStep2 from './pgsql/Step2'
import Step1 from './Step1'

export default {
  name: 'CdmApplicationAdd',
  components: {
    EmptyProvider,
    StepForm,
    OracleStep1,
    PgsqlStep1,
    PgsqlStep2,
    Step1
  },
  setup (props, context) {
    const step = [
      {
        key: null,
        title: '选择客户端',
        component: 'Step1',
        dataKey: 'step1'
      },
      {
        key: null,
        title: '设置参数',
        modules: ['oracle'],
        component: 'OracleStep1',
        dataKey: 'oracleStep1'
      },
      {
        key: null,
        title: '验证数据库',
        modules: ['pgsql'],
        component: 'PgsqlStep1',
        dataKey: 'pgsqlStep1'
      },
      {
        key: null,
        title: '设置参数',
        modules: ['pgsql'],
        component: 'PgsqlStep2',
        dataKey: 'pgsqlStep2'
      },
      {
        key: null,
        title: '完成',
        component: 'Step2',
        dataKey: 'step2'
      }
    ]
    const store = 'SET_CDM_CLONESET_POLLUP_STEP'
    const route = '/task/monitor'
    return {
      step,
      config: {
        store,
        route
      }
    }
  },
  data () {
    return {
      module: '',
      loading: false,
      isEmpty: false,
      empty: {
        state: 'empty',
        data: []
      }
    }
  }
}
</script>

<style lang="less" scoped>
.steps {
  max-width: 750px;
  margin: 16px auto;
}
.content {
  margin-top: 40px;
}
</style>
