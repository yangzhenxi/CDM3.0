import Mock from 'mockjs2'
import { builder, getBaseUrl } from '../../util'

const baseUrl = getBaseUrl()

const list = () => {
  return builder({
    items: [
      {
        id: '1',
        module: 'cdm',
        type: 'oracle',
        createdAt: '1608028069',
        expireDate: '1608028069',
        state: 'ready',
        company: 'howlink',
        capacity: 1024 * 1024 * 1024 * 1024
      },
      {
        id: '2',
        module: 'backup',
        type: 'mysql',
        createdAt: '1608028069',
        expireDate: '1608028069',
        state: 'notReady',
        error: '异常信息',
        company: 'howlink',
        capacity: 1024 * 1024 * 1024 * 1024
      },
      {
        id: '3',
        module: 'storage',
        type: 1,
        name: 'sdc',
        createdAt: '1608028069',
        expireDate: '1608028069',
        state: 'ready',
        company: 'howlink',
        capacity: 1024 * 1024 * 1024 * 1024,
        location: 'local',
        used: 256 * 1024 * 1024 * 1024
      }
    ]
  })
}

Mock.mock(`${baseUrl}/License`, 'post', list)
