import Mock from 'mockjs2'
import { builder, getBaseUrl } from '../../util'

const baseUrl = getBaseUrl()

const workflow = (options) => {
  return builder({
    lblet: {
      ready: 10,
      total: 16
    },
    virtual: {
      ready: 2,
      total: 10
    },
    component: {
      ready: 8,
      total: 16
    },
    alert: {
      total: 26,
      taskTotal: 10,
      systemTotal: 16
    },
    cdm: {
      application: {
        total: 10
      },
      goldenCopy: {
        total: 10
      },
      virtualCopy: {
        total: 10
      },
      sla: {
        total: 10
      }
    },
    backup: {
      application: {
        total: 10
      },
      goldenCopy: {
        total: 10
      },
      virtualCopy: {
        total: 10
      }
    },
    log: [{
      id: '1'
    }]
  })
}

const pool = (options) => {
  return builder([
    {
      name: 'pool',
      free: 512 * 1024 * 1024,
      available: 512 * 1024 * 1024,
      capacity: 1024 * 1024 * 1024,
      metric: [
        {
          timestamp: '1608028069',
          bandWidthRead: 8,
          bandWidthWrite: 4,
          operationsRead: 8 * 256,
          operationsWrite: 4432 * 128
        },
        {
          timestamp: '1608029069',
          bandWidthRead: 256,
          bandWidthWrite: 452 * 1024,
          operationsRead: 8 * 768,
          operationsWrite: 38 * 0
        },
        {
          timestamp: '1608030069',
          bandWidthRead: 1024 * 1024,
          bandWidthWrite: 1024 * 213,
          operationsRead: 8 * 1024,
          operationsWrite: 83 * 487
        },
        {
          timestamp: '1608031069',
          bandWidthRead: 34,
          bandWidthWrite: 45,
          operationsRead: 0 * 546,
          operationsWrite: 82 * 134564
        },
        {
          timestamp: '1608032069',
          bandWidthRead: 4 * 1024,
          bandWidthWrite: 12 * 1024,
          operationsRead: 238 * 7845,
          operationsWrite: 28 * 15
        }
      ]
    },
    {
      name: 'dedup',
      free: 512 * 1024 * 1024,
      available: 512 * 1024 * 1024,
      capacity: 1024 * 1024 * 1024,
      metric: [
        {
          timestamp: '1608028069',
          bandWidthRead: 8 * 1024,
          bandWidthWrite: 8 * 1024,
          operationsRead: 12 * 256,
          operationsWrite: 122 * 128
        },
        {
          timestamp: '1608029069',
          bandWidthRead: 256,
          bandWidthWrite: 452 * 1024,
          operationsRead: 8 * 768,
          operationsWrite: 33 * 0
        },
        {
          timestamp: '1608030069',
          bandWidthRead: 1024 * 1024,
          bandWidthWrite: 768,
          operationsRead: 8 * 1024,
          operationsWrite: 122 * 487
        },
        {
          timestamp: '1608031069',
          bandWidthRead: 782,
          bandWidthWrite: 45,
          operationsRead: 84 * 546,
          operationsWrite: 8 * 134564
        },
        {
          timestamp: '1608032069',
          bandWidthRead: 4 * 1024,
          bandWidthWrite: 787 * 1024,
          operationsRead: 8 * 7845,
          operationsWrite: 23 * 15
        }
      ]
    },
    {
      name: 'cloud',
      free: 512 * 1024 * 1024,
      available: 512 * 1024 * 1024,
      capacity: 1024 * 1024 * 1024,
      metric: [
        {
          timestamp: '1608028069',
          bandWidthRead: 8,
          bandWidthWrite: 2,
          operationsRead: 4 * 256,
          operationsWrite: 238 * 128
        },
        {
          timestamp: '1608029069',
          bandWidthRead: 256,
          bandWidthWrite: 0 * 1024,
          operationsRead: 48 * 768,
          operationsWrite: 2 * 0
        },
        {
          timestamp: '1608030069',
          bandWidthRead: 1024 * 1024,
          bandWidthWrite: 768,
          operationsRead: 42 * 1024,
          operationsWrite: 8 * 487
        },
        {
          timestamp: '1608031069',
          bandWidthRead: 782,
          bandWidthWrite: 45,
          operationsRead: 48 * 546,
          operationsWrite: 82 * 134564
        },
        {
          timestamp: '1608032069',
          bandWidthRead: 4 * 1024,
          bandWidthWrite: 787 * 1024,
          operationsRead: 8 * 7845,
          operationsWrite: 0 * 15
        }
      ]
    }
  ])
}

const dg = (options) => {
  return builder({
    dg: {
      ready: 10,
      unReady: 16
    }
  })
}

Mock.mock(`${baseUrl}/admin.v1.Dashboard/Get`, 'post', workflow)
Mock.mock(`${baseUrl}/admin.v1.Dashboard/GetPool`, 'post', pool)
Mock.mock(`${baseUrl}/admin.v1.Dashboard/GetDG`, 'post', dg)
