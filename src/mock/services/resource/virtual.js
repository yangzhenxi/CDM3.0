import Mock from 'mockjs2'
import { builder, getBaseUrl } from '../../util'

const baseUrl = getBaseUrl()

const list = {
  data: [
    {
      id: '1',
      name: 'vmware',
      lbletId: '1',
      kind: 1,
      vCenter: {
        ipAddr: '192.168.2.53',
        username: '管理员',
        password: '1111',
        datacenter: ''
      },
      state: 1,
      createdAt: 1622123213,
      updatedAt: 1622123213
    }
  ],
  total: 1
}

const get = (options) => {
  const params = JSON.parse(options.body)
  return builder(list.data.find(item => item.id === params?.id))
}

Mock.mock(`${baseUrl}/admin.v1.Virtual/List`, 'post', list)
Mock.mock(`${baseUrl}/admin.v1.Virtual/Get`, 'post', get)
Mock.mock(`${baseUrl}/admin.v1.Virtual/Add`, 'post', {})
Mock.mock(`${baseUrl}/admin.v1.Virtual/Patch`, 'post', {})
Mock.mock(`${baseUrl}/admin.v1.Virtual/Delete`, 'post', {})
Mock.mock(`${baseUrl}/admin.v1.Virtual/BatchDelete`, 'post', {})
Mock.mock(`${baseUrl}/admin.v1.Virtual/AllocateUsers`, 'post', {})
