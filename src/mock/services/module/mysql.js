import Mock from 'mockjs2'
import { getBaseUrl } from '../../util'

const baseUrl = getBaseUrl()

const list = {
  databases: [
    { id: '1' }
  ]
}

Mock.mock(`${baseUrl}/admin.v1.Mysql/GetMysqlDatabase`, 'post', list)
Mock.mock(`${baseUrl}/admin.v1.Mysql/GetOneMysqlDatabase`, 'post', list.databases[0])
Mock.mock(`${baseUrl}/admin.v1.Mysql/GetMysqlInfo`, 'post', {})
Mock.mock(`${baseUrl}/admin.v1.Mysql/CheckMysqlDatabase`, 'post', {})
