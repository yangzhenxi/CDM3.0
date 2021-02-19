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
import { getCurrentInstance } from '@vue/composition-api'
import { StepForm } from '@/components'
import Step1 from './Step1'
import OracleStep1 from './oracle/Step1'
import OracleStep2 from './oracle/Step2'
import MysqlStep1 from './mysql/Step1'
import MysqlStep2 from './mysql/Step2'
import MysqlStep3 from './mysql/Step3'
import MssqlStep1 from './mssql/Step1'
import MssqlStep2 from './mssql/Step2'
import MssqlStep3 from './mssql/Step3'
import PgsqlStep1 from './pgsql/Step1'
import PgsqlStep2 from './pgsql/Step2'
import PgsqlStep3 from './pgsql/Step3'
import FileStep1 from './file/Step1'
import VmwareStep1 from './vmware/Step1'
import HypervStep1 from './hyperv/Step1'
import Step2 from './Step2'

export default {
  name: 'ResourceLbletAdd',
  components: {
    StepForm,
    Step1,
    OracleStep1,
    OracleStep2,
    MysqlStep1,
    MysqlStep2,
    MysqlStep3,
    MssqlStep1,
    MssqlStep2,
    MssqlStep3,
    PgsqlStep1,
    PgsqlStep2,
    PgsqlStep3,
    FileStep1,
    VmwareStep1,
    HypervStep1,
    Step2
  },
  setup (props, context) {
    const _ = getCurrentInstance().proxy
    const step = [
      {
        title: '应用类型',
        component: 'Step1',
        dataKey: 'step1'
      },
      {
        title: '选择实例',
        component: 'OracleStep1',
        dataKey: 'oracleStep1',
        modules: ['oracle']
      },
      {
        title: '设置参数',
        component: 'OracleStep2',
        dataKey: 'oracleStep2',
        modules: ['oracle']
      },
      {
        title: '验证数据库',
        component: 'MysqlStep1',
        dataKey: 'mysqlStep1',
        modules: ['mysql']
      },
      {
        title: '选择实例',
        component: 'MysqlStep2',
        dataKey: 'mysqlStep2',
        modules: ['mysql']
      },
      {
        title: '设置参数',
        component: 'MysqlStep3',
        dataKey: 'mysqlStep3',
        modules: ['mysql']
      },
      {
        title: '验证数据库',
        component: 'MssqlStep1',
        dataKey: 'mssqlStep1',
        modules: ['mssql']
      },
      {
        title: '选择实例',
        component: 'MssqlStep2',
        dataKey: 'mssqlStep2',
        modules: ['mssql']
      },
      {
        title: '设置参数',
        component: 'MssqlStep3',
        dataKey: 'mssqlStep3',
        modules: ['mssql']
      },
      {
        title: '验证数据库',
        component: 'PgsqlStep1',
        dataKey: 'pgsqlStep1',
        modules: ['pgsql']
      },
      {
        title: '选择实例',
        component: 'PgsqlStep2',
        dataKey: 'pgsqlStep2',
        modules: ['pgsql']
      },
      {
        title: '设置参数',
        component: 'PgsqlStep3',
        dataKey: 'pgsqlStep3',
        modules: ['pgsql']
      },
      {
        title: '设置参数',
        component: 'FileStep2',
        dataKey: 'fileStep2',
        modules: ['file']
      },
      {
        title: '选择虚拟机',
        component: 'VmwareStep1',
        dataKey: 'vmwareStep1',
        modules: ['vmware']
      },
      {
        title: '选择虚拟机',
        component: 'HypervStep1',
        dataKey: 'hypervStep1',
        modules: ['hyperv']
      },
      {
        title: '完成',
        component: 'Step2',
        dataKey: 'step2'
      }
    ]
    const store = 'SET_CDM_APPLICATION_STEP'
    const route = `/resource/lblet/${_.$route.params.id}?name=${_.$route.query.name}`
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
