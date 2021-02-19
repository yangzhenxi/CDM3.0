import Mock from 'mockjs2'
import { builder, getBaseUrl } from '../../util'

const baseUrl = getBaseUrl()

const list = {
  data: [
    {
      id: '1',
      name: 'lblet',
      ipAddr: '192.168.2.152',
      port: '',
      os: 1,
      memory: '8589402112',
      hostName: 'MCSWIN72-06',
      osVersion: 'Microsoft windows 7 Enterprise Pack 1 Standalone Workstation 6.1.7601 build 7601',
      version: '0.2.2',
      iqn: 'iqn.localhost.hostid.7f000001',
      wwn: 'iqn.localhost.hostid.7f000001',
      unique: '',
      uptime: 1622123213,
      createdAt: 1622123213,
      updatedAt: 1622123213,
      deletedAt: 1622123213,
      state: 1
    },
    {
      id: '2',
      name: 'lblet',
      ipAddr: '192.168.2.152',
      port: '',
      os: 2,
      version: '0.2.2',
      memory: '8589402112',
      hostName: 'MCSWIN72-06',
      osVersion: 'Microsoft windows 7 Enterprise Pack 1 Standalone Workstation 6.1.7601 build 7601',
      iqn: 'iqn.localhost.hostid.7f000001',
      wwn: 'iqn.localhost.hostid.7f000001',
      unique: '',
      uptime: 1622123213,
      createdAt: 1622123213,
      updatedAt: 1622123213,
      deletedAt: 1622123213,
      state: 2
    },
    {
      id: '3',
      name: 'lblet',
      ipAddr: '192.168.2.152',
      port: '',
      os: 3,
      version: '0.2.2',
      memory: '8589402112',
      hostName: 'MCSWIN72-06',
      osVersion: 'Microsoft windows 7 Enterprise Pack 1 Standalone Workstation 6.1.7601 build 7601',
      iqn: 'iqn.localhost.hostid.7f000001',
      wwn: 'iqn.localhost.hostid.7f000001',
      unique: '',
      uptime: 1622123213,
      createdAt: 1622123213,
      updatedAt: 1622123213,
      deletedAt: 1622123213,
      state: 3
    }
  ],
  total: 3
}

const get = (options) => {
  const params = JSON.parse(options.body)
  return builder(list.data.find(item => item.id === params?.id))
}

const applicationList = {
  data: [
    {
      id: '1',
      name: 'app',
      kind: 1,
      createdAt: 1622123213,
      state: 1
    }
  ],
  total: 1
}

Mock.mock(`${baseUrl}/admin.v1.Lblet/List`, 'post', list)
Mock.mock(`${baseUrl}/admin.v1.Lblet/Get`, 'post', get)
Mock.mock(`${baseUrl}/admin.v1.Lblet/Register`, 'post', {})
Mock.mock(`${baseUrl}/admin.v1.Lblet/Patch`, 'post', {})
Mock.mock(`${baseUrl}/admin.v1.Lblet/Delete`, 'post', {})
Mock.mock(`${baseUrl}/admin.v1.Lblet/GetUsers`, 'post', {})
Mock.mock(`${baseUrl}/admin.v1.Lblet/Applications`, 'post', applicationList)
Mock.mock(`${baseUrl}/admin.v1.Lblet/UpdateIQN`, 'post', {})
Mock.mock(`${baseUrl}/admin.v1.Lblet/UpdateWWN`, 'post', {})
Mock.mock(`${baseUrl}/admin.v1.Lblet/AllocateUsers`, 'post', {})
Mock.mock(`${baseUrl}/admin.v1.Lblet/BindLabel`, 'post', {})
