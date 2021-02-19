import Mock from 'mockjs2'
import { builder, getBaseUrl } from '../../util'

const baseUrl = getBaseUrl()

const list = {
  data: [
    {
      id: '1',
      name: 'sla',
      root: {
        poolId: 1,
        keep: 2,
        targets: [
          {
            poolId: 1,
            keep: 2,
            pool: '池',
            targets: []
          }
        ],
        pool: '池'
      },
      cronExpression: '1+1',
      createdAt: 1622123213,
      applications: 'TODO'
    },
    {
      id: '2',
      name: 'sla',
      root: {
        poolId: 1,
        keep: 2,
        targets: [
          {
            poolId: 1,
            keep: 2,
            pool: '池',
            targets: []
          }
        ],
        pool: '池'
      },
      cronExpression: '1+1',
      createdAt: 1622123213,
      applications: 'TODO'
    },
    {
      id: '3',
      name: 'sla',
      root: {
        poolId: 1,
        keep: 2,
        targets: [
          {
            poolId: 1,
            keep: 2,
            pool: '池',
            targets: []
          }
        ],
        pool: '池'
      },
      cronExpression: '1+1',
      createdAt: 1622123213,
      applications: 'TODO'
    },
    {
      id: '4',
      name: 'sla',
      root: {
        poolId: 1,
        keep: 2,
        targets: [
          {
            poolId: 1,
            keep: 2,
            pool: '池',
            targets: []
          }
        ],
        pool: '池'
      },
      cronExpression: '1+1',
      createdAt: 1622123213,
      applications: 'TODO'
    }
  ],
  total: 4
}

const get = () => {
  return builder(list.data[0])
}

const history = {
  data: [
    {
      id: 1,
      app: 'SLA',
      srcPool: '源池+1',
      dstPool: '目标池',
      srcGoldenCopy: '源黄金副本',
      dstGoldenCopy: '目标黄金副本',
      startTime: 1622123213
    },
    {
      id: 2,
      app: 'SLA',
      srcPool: '源池+1',
      dstPool: '目标池',
      srcGoldenCopy: '源黄金副本',
      dstGoldenCopy: '目标黄金副本',
      startTime: 1622123213
    },
    {
      id: 3,
      app: 'SLA',
      srcPool: '源池+1',
      dstPool: '目标池',
      srcGoldenCopy: '源黄金副本',
      dstGoldenCopy: '目标黄金副本',
      startTime: 1622123213
    }
  ],
  total: 3
}

Mock.mock(`${baseUrl}/admin.v1.SLA/List`, 'post', list)
Mock.mock(`${baseUrl}/admin.v1.SLA/Get`, 'post', get)
Mock.mock(`${baseUrl}/admin.v1.SLA/Add`, 'post', {})
Mock.mock(`${baseUrl}/admin.v1.SLA/Patch`, 'post', {})
Mock.mock(`${baseUrl}/admin.v1.SLA/Delete`, 'post', {})
Mock.mock(`${baseUrl}/admin.v1.SLA/Histories`, 'post', history)
