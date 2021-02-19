import Mock from 'mockjs2'
import { getBaseUrl } from '../../util'

const baseUrl = getBaseUrl()

Mock.mock(`${baseUrl}/admin.v1.Pgsql/GetPgsqlInfo`, 'post', {})
Mock.mock(`${baseUrl}/admin.v1.Pgsql/CheckPgsqlDatabase`, 'post', {})
