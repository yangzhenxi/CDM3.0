import Mock from 'mockjs2'
import { builder, getBaseUrl } from '../../util'

const baseUrl = getBaseUrl()

const roleList = {
  data: [
    {
      id: '1',
      name: '管理员',
      resources: [
        {
          id: '1',
          module: 'a',
          object: 'a',
          action: 'a'
        }
      ],
      status: 1,
      createdAt: '1608028069'

    },
    {
      id: '2',
      name: '巡检员',
      status: 2,
      resources: [
        {
          id: '1',
          module: 'resource',
          object: 'LbletService',
          action: 'List'
        }
      ],
      createdAt: '1608028069'
    },
    {
      id: '3',
      name: '审计员',
      status: 1,
      resources: [
        {
          id: '1',
          module: 'resource',
          object: 'LbletService',
          action: 'List'
        }
      ],
      createdAt: '1608028069'
    },
    {
      id: '4',
      name: '操作员',
      status: 2,
      resources: [
        {
          id: '1',
          module: 'resource',
          object: 'LbletService',
          action: 'List'
        }
      ],
      createdAt: '1608028069'
    }
  ],
  total: 4
}

const resourceList = {
  data: [
    {
      id: '1',
      module: 'resource',
      object: 'LbletService',
      action: 'List',
      name: '系统资源-客户端-列表'
    },
    {
      id: '2',
      module: 'resource',
      object: 'LbletService',
      action: 'Get',
      name: '系统资源-客户端-获取'
    },
    {
      id: '3',
      module: 'resource',
      object: 'LbletService',
      action: 'Patch',
      name: '系统资源-客户端-修改'
    },
    {
      id: '4',
      module: 'resource',
      object: 'LbletService',
      action: 'Register',
      name: '系统资源-客户端-注册'
    },
    {
      id: '5',
      module: 'resource',
      object: 'MysqlService',
      action: 'GetMysqlInfo',
      name: '系统资源-客户端-获取 mysql 实例'
    },
    {
      id: '6',
      module: 'resource',
      object: 'MssqlService',
      action: 'GetMssqlInfo',
      name: '系统资源-客户端-获取 mssql 实例'
    },
    {
      id: '7',
      module: 'system',
      object: 'UserService',
      action: 'List',
      name: '系统管理-用户-列表'
    }
  ],
  total: 6
}

const roleInfo = (options) => {
  const params = JSON.parse(options.body)
  return builder(roleList.data.find(item => item.id === params?.id))
}

const resourceInfo = (options) => {
  const params = JSON.parse(options.body)
  return builder(resourceList.data.find(item => item.id === params?.id))
}

Mock.mock(`${baseUrl}/admin.v1.Role/List`, 'post', roleList)
Mock.mock(`${baseUrl}/admin.v1.Role/Get`, 'post', roleInfo)
Mock.mock(`${baseUrl}/admin.v1.Role/Add`, 'post', {})
Mock.mock(`${baseUrl}/admin.v1.Role/Patch`, 'post', {})
Mock.mock(`${baseUrl}/admin.v1.Role/Delete`, 'post', {})
Mock.mock(`${baseUrl}/admin.v1.Resource/List`, 'post', resourceList)
Mock.mock(`${baseUrl}/admin.v1.Resource/Get`, 'post', resourceInfo)
