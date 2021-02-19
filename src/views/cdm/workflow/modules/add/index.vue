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
import OracleStep1 from './oracle/Step1'
import MysqlStep1 from './mysql/Step1'
import MysqlStep2 from './mysql/Step2'
import MssqlStep1 from './mssql/Step1'
import MssqlStep2 from './mssql/Step2'
import PgsqlStep1 from './pgsql/Step1'
import PgsqlStep2 from './pgsql/Step2'
import VmwareStep1 from './vmware/Step1'
import Step3 from './Step3'
import Step4 from './Step4'

export default {
  name: 'CdmWorkflowAdd',
  components: {
    StepForm,
    Step1,
    Step2,
    OracleStep1,
    MysqlStep1,
    MysqlStep2,
    MssqlStep1,
    MssqlStep2,
    PgsqlStep1,
    PgsqlStep2,
    VmwareStep1,
    Step3,
    Step4
  },
  setup (props, context) {
    const step = [
      {
        title: '选择应用',
        component: 'Step1',
        dataKey: 'step1'
      },
      {
        title: '选择实例',
        component: 'Step2',
        dataKey: 'step2'
      },
      {
        title: '选择目标端',
        component: 'Step3',
        dataKey: 'step3'
      },
      {
        title: '工作流设置',
        modules: 'oracle',
        component: 'OracleStep1',
        dataKey: 'oracleStep1'
      },
      {
        title: '验证数据库',
        modules: 'mysql',
        component: 'MysqlStep1',
        dataKey: 'mysqlStep1'
      },
      {
        title: '工作流设置',
        modules: 'mysql',
        component: 'MysqlStep2',
        dataKey: 'mysqlStep2'
      },
      {
        title: '验证数据库',
        modules: 'mssql',
        component: 'MssqlStep1',
        dataKey: 'mssqlStep1'
      },
      {
        title: '工作流设置',
        modules: 'mssql',
        component: 'MssqlStep2',
        dataKey: 'mssqlStep2'
      },
      {
        title: '验证数据库',
        modules: 'pgsql',
        component: 'PgsqlStep1',
        dataKey: 'pgsqlStep1'
      },
      {
        title: '工作流设置',
        modules: 'pgsql',
        component: 'PgsqlStep2',
        dataKey: 'pgsqlStep2'
      },
      {
        title: '工作流设置',
        modules: 'vmware',
        component: 'VmwareStep1',
        dataKey: 'vmwareStep1'
      },
      {
        title: '完成',
        component: 'Step4',
        dataKey: 'step4'
      }
    ]
    const store = 'SET_CDM_WORKFLOW_STEP'
    const route = `/cdm/workflow`
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
