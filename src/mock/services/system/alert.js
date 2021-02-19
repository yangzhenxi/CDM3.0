import Mock from 'mockjs2'
import { builder, getBaseUrl } from '../../util'

const baseUrl = getBaseUrl()

const smtp = () => {
  const data = {
    host: 'xxx.com',
    port: '192.168.112.112',
    username: 'admin',
    password: '123456',
    code: 'ready',
    state: 'ready',
    createdAt: '1608028069'
  }
  return builder(data)
}

const conf = () => {
  const data = {
    loginFail: { panel: true, mail: false, sms: false },
    loginSuccess: { panel: false, mail: false, sms: false },
    serverDown: { panel: true, mail: false, sms: false },
    taskFail: { panel: true, mail: false, sms: false },
    taskSuccess: { panel: true, mail: false, sms: false }
  }
  return builder(data)
}

Mock.mock(`${baseUrl}/SMTP`, 'post', smtp)
Mock.mock(`${baseUrl}/Notify/config`, 'post', conf)
