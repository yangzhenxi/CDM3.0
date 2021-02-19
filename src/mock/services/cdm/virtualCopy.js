import Mock from 'mockjs2'
import { builder, getBaseUrl } from '../../util'

const baseUrl = getBaseUrl()

const list = {
  data: [
    {
      id: '1',
      name: '名称',
      goldenCopyId: 1,
      applicationId: 1,
      lbletId: 1,
      recoverType: 'RECOVER_TYPE_DIRECT_MOUNT'
    },
    {
      id: '2',
      name: '名称',
      goldenCopyId: 1,
      applicationId: 1,
      lbletId: 1,
      recoverType: 'RECOVER_TYPE_DIRECT_RECOVER'
    },
    {
      id: '3',
      name: '名称',
      goldenCopyId: 1,
      applicationId: 1,
      lbletId: 1,
      completedAt: 10000000,
      recoverType: 'RECOVER_TYPE_EMERGENCY_MOUNT'
    }
  ],
  total: 3
}

const get = (options) => {
  const params = JSON.parse(options.body)
  return builder(list.data.find(item => item.id === params?.id))
}

Mock.mock(`${baseUrl}/admin.v1.VirtualCopy/List`, 'post', list)
Mock.mock(`${baseUrl}/admin.v1.VirtualCopy/Get`, 'post', get)
Mock.mock(`${baseUrl}/admin.v1.VirtualCopy/Add`, 'post', {})
Mock.mock(`${baseUrl}/admin.v1.VirtualCopy/Delete`, 'post', {})
Mock.mock(`${baseUrl}/admin.v1.VirtualCopy/BatchDelete`, 'post', {})
