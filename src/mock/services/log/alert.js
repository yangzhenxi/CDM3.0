import Mock from 'mockjs2'
import { builder, getBaseUrl } from '../../util'

const baseUrl = getBaseUrl()

const list = () => {
  return builder({
    items: [
      {
        id: '1',
        eventType: 'login',
        eventLevel: 'error',
        event: 'admin 登录系统失败（xxxxxxxxxxxxxxxxxxxxxxxxxxxx）',
        mailState: true,
        mailSendState: true,
        readState: true,
        createdAt: '1608028069'
      },
      {
        id: '2',
        eventType: 'application:create',
        eventLevel: 'warning',
        event: 'admin 创建了 xxx 应用（xxxxxxxxxxxxxxxxxxxxxxxxxxxx）',
        mailState: true,
        mailSendState: false,
        readState: false,
        createdAt: '1608028069'
      },
      {
        id: '3',
        eventType: 'application:backup',
        eventLevel: 'info',
        event: 'admin 对 xxx 应用进行了备份操作（xxxxxxxxxxxxxxxxxxxxxxxxxxxx）',
        mailState: false,
        mailSendState: false,
        readState: false,
        createdAt: '1608028069'
      }
    ]
  })
}

Mock.mock(`${baseUrl}/Notify`, 'post', list)
