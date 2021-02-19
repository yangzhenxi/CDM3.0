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
import { getCurrentInstance } from '@vue/composition-api'
import OracleStep1 from './oracle/Step1'
import MysqlStep1 from './mysql/Step1'
import MysqlStep2 from './mysql/cdm/Step2'
import BackupMysqlStep2 from './mysql/backup/Step2'
import BackupMysqlStep3 from './mysql/backup/Step3'
import MssqlStep1 from './mssql/Step1'
import MssqlStep2 from './mssql/Step2'
import MssqlStep3 from './mssql/Step3'
import PgsqlStep1 from './pgsql/Step1'
import PgsqlStep2 from './pgsql/Step2'
import FileStep1 from './file/Step1'
import FileStep2 from './file/Step2'
import VmwareStep1 from './vmware/Step1'
import VmwareMountStep2 from './vmware/mount/Step2'
import VmwareMountStep3 from './vmware/mount/Step3'
import VmwareStep2 from './vmware/recover/Step2'
import HypervStep1 from './hyperv/Step1'
import HypervStep2 from './hyperv/Step2'
import Step1 from './Step1'
import Step2 from './Step2'
import Step3 from './Step3'

export default {
  name: 'CdmApplicationAdd',
  components: {
    EmptyProvider,
    StepForm,
    OracleStep1,
    MysqlStep1,
    MysqlStep2,
    BackupMysqlStep2,
    BackupMysqlStep3,
    MssqlStep1,
    MssqlStep2,
    MssqlStep3,
    PgsqlStep1,
    PgsqlStep2,
    FileStep1,
    FileStep2,
    VmwareStep1,
    VmwareMountStep2,
    VmwareMountStep3,
    VmwareStep2,
    HypervStep1,
    HypervStep2,
    Step1,
    Step2,
    Step3
  },
  setup (props, context) {
    const _ = getCurrentInstance().proxy
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
        modules: ['mysql', 'BackupMysqlStep'],
        component: 'MysqlStep1',
        dataKey: 'mysqlStep1'
      },
      {
        key: null,
        title: '设置新库名',
        modules: ['BackupMysqlStep'],
        component: 'BackupMysqlStep2',
        dataKey: 'backupmysqlStep2'
      },
      {
        key: null,
        title: '设置参数',
        modules: ['BackupMysqlStep'],
        component: 'BackupMysqlStep3',
        dataKey: 'backupmysqlStep3'
      },
      {
        key: null,
        title: '设置参数',
        modules: ['mysql'],
        component: 'MysqlStep2',
        dataKey: 'MysqlStep2'
      },
      {
        key: null,
        title: '数据库验证',
        modules: ['mssql'],
        component: 'mssqlStep1',
        dataKey: 'mssqlStep1'
      },
      {
        key: null,
        title: '设置新库名',
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
        title: '设置参数',
        modules: ['file'],
        component: 'FileStep2',
        dataKey: 'fileStep2'
      },
      {
        key: null,
        title: '选择挂载方式',
        modules: ['vmware', 'vmwareRecover', 'vmwareMount'],
        component: 'VmwareStep1',
        dataKey: 'vmwareStep1'
      },
      {
        key: null,
        title: '设置参数',
        modules: ['vmwareRecover'],
        component: 'VmwareStep2',
        dataKey: 'vmwareStep2'
      },
      {
        key: null,
        title: '设置参数',
        modules: ['vmwareMount'],
        component: 'VmwareMountStep3',
        dataKey: 'vmwareMountStep3'
      },
      {
        key: null,
        title: '设置参数',
        modules: ['hyperv'],
        component: 'HypervStep2',
        dataKey: 'hypervStep2'
      },
      {
        key: null,
        title: '完成',
        component: 'Step3',
        dataKey: 'step3'
      }
    ]
    const store = 'SET_CDM_CLONESET_STEP'
    const route = '/task/monitor'
    console.log(_.$route)
    // if (+_.$route.query.kind === 3 || +_.$route.query.kind === 6) {
    //   route = `/cdm/application/${_.$route.params.applicationId}/instances/${_.$route.query.instance.id}?applicationName =${_.$route.query.application.name}?name=${_.$route.query.instance.name}`
    // } else {
    //   route = `/cdm/application/${_.$route.params.applicationId}?name=${_.$route.query.application.name}`
    // }
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
