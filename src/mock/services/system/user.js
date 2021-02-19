import Mock from 'mockjs2'
import { builder, getBaseUrl } from '../../util'

const baseUrl = getBaseUrl()

const list = {
  data: [
    {
      id: '1',
      username: 'admin',
      nickname: 'admin',
      role: '1',
      email: 'xxx@xx.com',
      status: 1,
      createdAt: '1608028069'
    },
    {
      id: '2',
      username: 'riadmin',
      nickname: 'riadmin',
      role: '2',
      email: 'xxx@xx.com',
      status: 2,
      createdAt: '1608028069'
    },
    {
      id: '3',
      username: 'audit',
      nickname: 'audit',
      role: '3',
      email: 'xxx@xx.com',
      status: 1,
      createdAt: '1608028069'
    },
    {
      id: '4',
      username: 'operator',
      nickname: 'operator',
      role: '4',
      email: 'xxx@xx.com',
      status: 2,
      createdAt: '1608028069'
    }
  ],
  total: 4
}

const get = (options) => {
  const params = JSON.parse(options.body)
  return builder(list.data.find(item => item.id === params?.id))
}

Mock.mock(`${baseUrl}/admin.v1.User/List`, 'post', list)
Mock.mock(`${baseUrl}/admin.v1.User/Get`, 'post', get)
Mock.mock(`${baseUrl}/admin.v1.User/Add`, 'post', {})
Mock.mock(`${baseUrl}/admin.v1.User/Patch`, 'post', {})
Mock.mock(`${baseUrl}/admin.v1.User/Delete`, 'post', {})
