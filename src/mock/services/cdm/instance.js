import Mock from 'mockjs2'
import { builder, getBaseUrl } from '../../util'

const baseUrl = getBaseUrl()

const list = {
  data: [
    {
      id: 1,
      name: '应用实例',
      lbletId: '1',
      applicationId: 1,
      spec: '{}',
      createdAt: 1621261111,
      updatedAt: 1621261111,
      lblet: {
        id: '1',
        unique: '78cjkdjvd90asdjasdasd9asfasf',
        createdAt: 1621261111,
        updatedAt: 1621261111
      }
    }
  ],
  total: 8
}

const get = (options) => {
  const params = JSON.parse(options.body)
  return builder(list.data.find(item => item.id === params?.id))
}

Mock.mock(`${baseUrl}/admin.v1.Instance/List`, 'post', list)
Mock.mock(`${baseUrl}/admin.v1.Instance/Get`, 'post', get)
Mock.mock(`${baseUrl}/admin.v1.Instance/Backup`, 'post', {})
