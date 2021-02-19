import Mock from 'mockjs2'
import { builder, getBaseUrl } from '../../util'

const baseUrl = getBaseUrl()

const list = {
  data: [
    {
      id: '1',
      name: 'sdc',
      ipAddr: '192.168.112.112',
      type: 1,
      used: 256 * 1024 * 1024,
      available: 768 * 1024 * 1024,
      capacity: 1024 * 1024 * 1024,
      raidLevel: 1,
      compressRatio: 2,
      alertRatio: 60,
      quota: 60,
      devices: '/dev/sda',
      createdAt: '1608028069',
      state: 1
    },
    {
      id: '2',
      name: 'sdd',
      ipAddr: '192.168.112.112',
      type: 2,
      used: 512 * 1024 * 1024,
      available: 512 * 1024 * 1024,
      capacity: 1024 * 1024 * 1024,
      raidLevel: 1,
      compressRatio: 2,
      alertRatio: 60,
      quota: 60,
      devices: '/dev/sda',
      createdAt: '1608028069',
      state: 2,
      message: '错误信息&&错误信息&&错误信息2'
    },
    {
      id: '3',
      name: 'sde',
      ipAddr: '192.168.112.112',
      type: 1,
      used: 0 * 1024 * 1024,
      available: 1024 * 1024 * 1024,
      capacity: 1024 * 1024 * 1024,
      raidLevel: 1,
      compressRatio: 2,
      alertRatio: 60,
      quota: 60,
      devices: '/dev/sda',
      createdAt: '1608028069',
      state: 1
    },
    {
      id: '4',
      name: 'sdf',
      ipAddr: '192.168.112.112',
      type: 2,
      used: 768 * 1024 * 1024,
      available: 256 * 1024 * 1024,
      capacity: 1024 * 1024 * 1024,
      raidLevel: 5,
      compressRatio: 2,
      alertRatio: 60,
      quota: 60,
      devices: '/dev/sda',
      createdAt: '1608028069',
      state: 2,
      message: '错误信息'
    }
  ],
  total: 4
}

const get = (options) => {
  const params = JSON.parse(options.body)
  return builder(list.data.find(item => item.id === params?.id))
}

const metricList = {
  data: [
    {
      timestamp: '1608028069',
      bandWidthRead: 8,
      bandWidthWrite: 8,
      operationsRead: 8 * 256,
      operationsWrite: 8 * 128
    },
    {
      timestamp: '1608029069',
      bandWidthRead: 256,
      bandWidthWrite: 452 * 1024,
      operationsRead: 8 * 768,
      operationsWrite: 8 * 0
    },
    {
      timestamp: '1608030069',
      bandWidthRead: 1024 * 1024,
      bandWidthWrite: 768,
      operationsRead: 8 * 1024,
      operationsWrite: 8 * 487
    },
    {
      timestamp: '1608031069',
      bandWidthRead: 782,
      bandWidthWrite: 45,
      operationsRead: 8 * 546,
      operationsWrite: 8 * 134564
    },
    {
      timestamp: '1608032069',
      bandWidthRead: 4 * 1024,
      bandWidthWrite: 787 * 1024,
      operationsRead: 8 * 7845,
      operationsWrite: 8 * 15
    }
  ]
}

Mock.mock(`${baseUrl}/admin.v1.Pool/List`, 'post', list)
Mock.mock(`${baseUrl}/admin.v1.Pool/Get`, 'post', get)
Mock.mock(`${baseUrl}/admin.v1.Pool/Add`, 'post', {})
Mock.mock(`${baseUrl}/admin.v1.Pool/Patch`, 'post', {})
Mock.mock(`${baseUrl}/admin.v1.Pool/Destroy`, 'post', {})
Mock.mock(`${baseUrl}/admin.v1.Pool/Expand`, 'post', {})
Mock.mock(`${baseUrl}/admin.v1.Pool/Test`, 'post', {})
Mock.mock(`${baseUrl}/admin.v1.Pool/GetIO`, 'post', metricList)
Mock.mock(`${baseUrl}/admin.v1.Pool/AllocateUsers`, 'post', {})
