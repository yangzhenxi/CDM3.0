import Mock from 'mockjs2'
import { builder, getBaseUrl } from '../../util'

const baseUrl = getBaseUrl()

const list = {
  data: [
    {
      id: '1',
      name: 'zfs1',
      ipAddr: '192.168.112.112',
      version: 'v3.0.000',
      fc: '',
      remark: '备注xxxxxxxxxxxxx',
      createdAt: '1608028069',
      state: 1
    },
    {
      id: '2',
      name: 'zfs2',
      ipAddr: '192.168.112.112',
      version: 'v3.0.002',
      createdAt: '1608028069',
      state: 2,
      error: '错误信息'
    }
  ],
  total: 2
}

const get = (options) => {
  const params = JSON.parse(options.body)
  return builder(list.data.find(item => item.id === params?.id))
}

const deviceList = {
  data: [
    {
      id: '1',
      name: 'zfs:sdc',
      path: '/dev/sdc',
      capacity: 1024 * 1024 * 1024,
      available: 1,
      isNormal: 1
    },
    {
      id: '2',
      name: 'zfs:sdd',
      path: '/dev/sdd',
      capacity: 1024 * 1024 * 1024,
      available: -1,
      occupy: 'pool',
      isNormal: 1
    },
    {
      id: '3',
      name: 'zfs:sde',
      path: '/dev/sde',
      capacity: 1024 * 1024 * 1024,
      available: 1,
      isNormal: -1
    }
  ]
}

Mock.mock(`${baseUrl}/admin.v1.Storage/List`, 'post', list)
Mock.mock(`${baseUrl}/admin.v1.Storage/Get`, 'post', get)
Mock.mock(`${baseUrl}/admin.v1.Storage/Add`, 'post', {})
Mock.mock(`${baseUrl}/admin.v1.Storage/Patch`, 'post', {})
Mock.mock(`${baseUrl}/admin.v1.Storage/Delete`, 'post', {})
Mock.mock(`${baseUrl}/admin.v1.Storage/GetDevices`, 'post', deviceList)
Mock.mock(`${baseUrl}/admin.v1.Storage/GetDevice`, 'post', { data: deviceList.data[0] })
Mock.mock(`${baseUrl}/admin.v1.Storage/FlushScsi`, 'post', {})
