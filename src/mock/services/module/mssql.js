import Mock from 'mockjs2'
import { getBaseUrl } from '../../util'

const baseUrl = getBaseUrl()

const list = {
  databases: [
    { id: '1' }
  ]
}

const get = (options) => {
  return list.databases[0]
}

Mock.mock(`${baseUrl}/admin.v1.Mssql/GetAllMssqlDatabase`, 'post', list)
Mock.mock(`${baseUrl}/admin.v1.Mssql/GetOneMssqlDatabase`, 'post', get)
Mock.mock(`${baseUrl}/admin.v1.Mssql/GetMssqlInfo`, 'post', {})
Mock.mock(`${baseUrl}/admin.v1.Mssql/CheckMssqlDatabase`, 'post', {})
