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
import MysqlStep1 from '@/views/resource/lblet/modules/add/mysql/Step1'
import MysqlStep2 from '@/views/resource/lblet/modules/add/mysql/Step2'
import MysqlStep3 from '@/views/resource/lblet/modules/add/mysql/Step3'
import MssqlStep1 from '@/views/resource/lblet/modules/add/mssql/Step1'
import MssqlStep2 from '@/views/resource/lblet/modules/add/mssql/Step2'
import MssqlStep3 from '@/views/resource/lblet/modules/add/mssql/Step3'
import Step2 from './Step2'
import Step3 from './Step3'

export default {
  name: 'CdmApplicationAdd',
  components: {
    StepForm,
    Step1,
    MysqlStep1,
    MysqlStep2,
    MysqlStep3,
    MssqlStep1,
    MssqlStep2,
    MssqlStep3,
    Step2,
    Step3
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
        title: '应用类型',
        component: 'Step2',
        dataKey: 'step2'
      },
      {
        key: null,
        title: '验证数据库',
        modules: ['mysql'],
        component: 'MysqlStep1',
        dataKey: 'mysqlStep1'
      },
      {
        key: null,
        title: '选择实例',
        modules: ['mysql'],
        component: 'MysqlStep2',
        dataKey: 'mysqlStep2'
      },
      {
        key: null,
        title: '设置参数',
        modules: ['mysql'],
        component: 'MysqlStep3',
        dataKey: 'mysqlStep3'
      },
      {
        key: null,
        title: '验证数据库',
        modules: ['mssql'],
        component: 'MssqlStep1',
        dataKey: 'mssqlStep1'
      },
      {
        key: null,
        title: '选择实例',
        modules: ['mssql'],
        component: 'MssqlStep2',
        dataKey: 'mssqlStep2'
      },
      {
        key: null,
        title: '设置参数',
        modules: ['mssql'],
        component: 'MssqlStep3',
        dataKey: 'mssqlStep3'
      },
      {
        key: null,
        title: '完成',
        component: 'Step3',
        dataKey: 'step3'
      }
    ]
    const store = 'SET_CDM_APPLICATION_STEP'
    const route = `/backup/application`
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
