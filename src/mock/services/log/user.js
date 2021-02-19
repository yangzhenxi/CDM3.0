import Mock from 'mockjs2'
import { getBaseUrl } from '../../util'

const baseUrl = getBaseUrl()

const list = {
  data: [
    {
      id: '1',
      ip: '192.168.112.112',
      user: {
        nickname: 'admin'
      },
      eventType: 'login',
      event: 'admin 登录系统',
      startTime: '1608028069',
      endTime: '1608028069',
      state: 'ready'
    },
    {
      id: '2',
      ip: '192.168.112.112',
      user: {
        nickname: 'admin'
      },
      eventType: 'application:create',
      event: 'admin 创建了 xxx 应用（xxxxxxxxxxxxxxxxxxxxxxxxxxxx）',
      startTime: '1608028069',
      endTime: '1608028069',
      state: 'notReady',
      error: '异常信息'
    }
  ]
}

Mock.mock(`${baseUrl}/admin.v1.UserLog/List`, 'post', list)
