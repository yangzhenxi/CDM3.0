import Mock from 'mockjs2'
import { builder, getBaseUrl } from '../../util'

const baseUrl = getBaseUrl()

const login = () => {
  return builder({
    data: 'token',
    expire: 3 * 24 * 60 * 60
  })
}

const user = () => {
  return builder({
    id: '1',
    username: 'admin',
    nickname: 'admin',
    role: '1',
    email: 'xxx@xx.com',
    status: 1,
    createdAt: '1608028069'
  })
}

Mock.mock(`${baseUrl}/admin.v1.User/Login`, 'post', login)
Mock.mock(`${baseUrl}/admin.v1.User/Logout`, 'post', {})
Mock.mock(`${baseUrl}/admin.v1.User/UserInfo`, 'post', user)
