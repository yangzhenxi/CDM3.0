import storage from 'store'
import { TOGGLE_MOCK } from '@/store/mutation-types'
import { isIE } from '@/utils/util'
// 判断环境不是 prod 或者 preview 是 true 时，加载 mock 服务
console.log(process.env.VUE_APP_PREVIEW)
if (process.env.VUE_APP_PREVIEW === 'true') {
  if (isIE()) {
    console.error('ERROR: `mockjs` NOT SUPPORT `IE` PLEASE DO NOT USE IN `production` ENV.')
  }

  // 使用同步加载依赖
  // 防止 vuex 中的 GetInfo 早于 mock 运行，导致无法 mock 请求返回结果
  console.log('mock mounting')
  const Mock = require('mockjs2')

  // 测试api
  if (storage.get(TOGGLE_MOCK)) {
    require('./services/module/oracle')
    require('./services/module/mssql')
    require('./services/module/mysql')
    require('./services/module/pgsql')
    require('./services/module/vmware')

    require('./services/dashboard/workplace')

    require('./services/resource/lblet')
    require('./services/resource/virtual')
    require('./services/resource/sla')

    require('./services/cdm/application')
    require('./services/cdm/instance')
    require('./services/cdm/goldenCopy')
    require('./services/cdm/virtualCopy')
    require('./services/cdm/protectionStrategy')
    require('./services/cdm/workflow')

    require('./services/dg/oracle')

    require('./services/task/monitor')

    require('./services/storage/class')
    require('./services/storage/pool')

    require('./services/log/alert')
    require('./services/log/user')

    require('./services/storage/pool')

    require('./services/system/alert')
    require('./services/system/component')
    require('./services/system/license')
    require('./services/system/role')
    require('./services/system/user')
  }
  require('./services/user')

  Mock.setup({
    timeout: 800 // setter delay time
  })
  console.log('mock mounted')
}
