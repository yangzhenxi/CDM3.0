import Mock from 'mockjs2'
import { builder, getBaseUrl } from '../../util'

const baseUrl = getBaseUrl()

const list = {
  data: [
    {
      id: '1',
      name: 'RecoveryStrategy',
      type: 1,
      module: 1,
      phase: 1,
      status: 1,
      executed: 150,
      total: 3,
      able: true,
      cronExpression: '0 0 * * ?',
      upTime: '1608028069',
      createdAt: '1608028069',
      updatedAt: '1608028069',
      completedAt: '1608028069',
      appKind: 1,
      application: {
        id: '1',
        desc: '事件1',
        name: 'xxxx',
        phase: 5,
        createdAt: '1608028069',
        updatedAt: '1608028069'
      },
      lblet: {
        name: 'lblet'
      }
    }
  ]
}

const get = (options) => {
  return builder(list.data[0])
}

Mock.mock(`${baseUrl}/admin.v1.RecoveryStrategy/List`, 'post', list)
Mock.mock(`${baseUrl}/admin.v1.RecoveryStrategy/Get`, 'post', get)
Mock.mock(`${baseUrl}/admin.v1.RecoveryStrategy/Add`, 'post', {})
Mock.mock(`${baseUrl}/admin.v1.RecoveryStrategy/Patch`, 'post', {})
Mock.mock(`${baseUrl}/admin.v1.RecoveryStrategy/Delete`, 'post', {})
Mock.mock(`${baseUrl}/admin.v1.RecoveryStrategy/BatchDelete`, 'post', {})
Mock.mock(`${baseUrl}/admin.v1.RecoveryStrategy/Histories`, 'post', {})
