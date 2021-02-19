import Mock from 'mockjs2'
import { getBaseUrl } from '../../util'

const baseUrl = getBaseUrl()

const list = {
  data: [
    {
      id: '1',
      name: '名称',
      instanceId: 1,
      applicationId: 1,
      poolId: 1,
      expired: 12343234,
      backupStartAt: 1621251111,
      completedAt: 1621261111,
      optionStartTime: 1621251111,
      optionEndTime: 1621261111,
      createdAt: 1621261111
    },
    {
      id: '2',
      name: '名称',
      instance_id: 1,
      applicationId: 1,
      poolId: 1,
      expired: 12343234,
      backupStartAt: 1621251111,
      completedAt: 1621261111,
      optionStartTime: 1621251111,
      optionEndTime: 1621261111,
      createdAt: 1621261111
    },
    {
      id: '3',
      name: '名称',
      instance_id: 1,
      applicationId: 1,
      poolId: 1,
      state: 1,
      expired: 12343234,
      backupStartAt: 1621251111,
      completedAt: 1621261111,
      optionStartTime: 1621251111,
      optionEndTime: 1621261111,
      createdAt: 1621261111
    }
  ],
  total: 3
}

Mock.mock(`${baseUrl}/admin.v1.GoldenCopy/List`, 'post', list)
Mock.mock(`${baseUrl}/admin.v1.GoldenCopy/Delete`, 'post', {})
