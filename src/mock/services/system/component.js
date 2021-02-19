import Mock from 'mockjs2'
import { builder, getBaseUrl } from '../../util'

const baseUrl = getBaseUrl()

const schedulerList = () => {
  return builder({
    items: [
      {
        id: '1',
        name: 'scheduler-111111',
        ip: '192.168.112.112',
        type: 'scheduler',
        version: '3.0.12322',
        createdAt: '1608028069',
        updateTimestamp: '1608028069',
        state: 'notReady',
        error: '异常信息'
      }
    ]
  })
}

const controllerList = () => {
  return builder({
    items: [
      {
        id: '2',
        name: 'controller',
        ip: '192.168.112.112',
        type: 'controller',
        version: '3.0.0',
        createdAt: '1608028069',
        updateTimestamp: '1608028069',
        state: 'ready'
      }
    ]
  })
}

Mock.mock(`${baseUrl}/Scheduler`, 'post', schedulerList)
Mock.mock(`${baseUrl}/ControllerManager`, 'post', controllerList)
