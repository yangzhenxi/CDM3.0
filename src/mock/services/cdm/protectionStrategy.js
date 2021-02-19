import Mock from 'mockjs2'
import { builder, getBaseUrl } from '../../util'

const baseUrl = getBaseUrl()

const get = () => {
  return builder(
    {
      id: '1',
      applicationId: '1',
      createdAt: 1621261111,
      updatedAt: 1621261111,
      state: 1
    }
  )
}

Mock.mock(`${baseUrl}/admin.v1.ProtectionStrategy/Get`, 'post', get)
Mock.mock(`${baseUrl}/admin.v1.ProtectionStrategy/Add`, 'post', {})
Mock.mock(`${baseUrl}/admin.v1.ProtectionStrategy/Patch`, 'post', {})
Mock.mock(`${baseUrl}/admin.v1.ProtectionStrategy/Histories`, 'post', {})
