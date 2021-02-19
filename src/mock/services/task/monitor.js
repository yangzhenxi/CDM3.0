import Mock from 'mockjs2'
import { builder, getBaseUrl } from '../../util'

const baseUrl = getBaseUrl()

const list = {
  data: [
    {
      id: '1',
      name: 'task1',
      type: 1,
      module: 1,
      belong: 'app',
      objectId: '1',
      workflowId: '1',
      createdAt: '1608028069',
      updatedAt: '1608028069',
      state: 1,
      workflow: {
        id: '1',
        phase: 1,
        status: 1,
        executed: 2,
        total: 3,
        createdAt: '1608028069',
        updatedAt: '1608028069',
        completedAt: '1608029069',
        workUnits: [
          {
            id: '1',
            desc: '事件1',
            name: 'xxxx',
            phase: 5,
            status: 1,
            percent: 100,
            log: '日志信息1',
            createdAt: '1608028069',
            updatedAt: '1608028069',
            completedAt: '1608028069'
          },
          {
            id: '2',
            desc: '事件2',
            name: 'xxxx',
            phase: 1,
            status: 1,
            percent: 50,
            log: '日志信息2',
            error: '错误信息',
            createdAt: '1608028069',
            updatedAt: '1608028069',
            completedAt: '1608028069'
          },
          {
            id: '3',
            desc: '事件3',
            name: 'xxxx',
            phase: 3,
            status: 3,
            log: '日志信息3',
            createdAt: '1608028069',
            updatedAt: '1608028069',
            completedAt: '1608028069'
          },
          {
            id: '4',
            desc: '事件4',
            name: 'xxxx',
            phase: 2,
            status: 2,
            log: '日志信息4',
            createdAt: '1608028069',
            updatedAt: '1608028069',
            completedAt: '1608028069'
          },
          {
            id: '5',
            desc: '事件5',
            name: 'xxxx',
            phase: 1,
            status: 1,
            log: '日志信息5',
            createdAt: '1608028069',
            updatedAt: '1608028069',
            completedAt: '1608028069'
          }
        ]
      }
    },
    {
      id: '2',
      name: 'task2',
      type: 2,
      module: 1,
      belong: 'app',
      objectId: '2',
      workflowId: '2',
      createdAt: '1608028069',
      updatedAt: '1608028069',
      state: 2,
      workflow: {
        id: '2',
        phase: 2,
        status: 2,
        executed: 1,
        total: 3,
        createdAt: '1608028069',
        updatedAt: '1608028069',
        completedAt: '1608038069',
        workUnits: [
          {
            id: '1',
            desc: '事件1',
            name: 'xxxx',
            phase: 5,
            status: 1,
            percent: 100,
            log: '日志信息1',
            createdAt: '1608028069',
            updatedAt: '1608028069',
            completedAt: '1608028069'
          },
          {
            id: '2',
            desc: '事件2',
            name: 'xxxx',
            phase: 2,
            status: 1,
            percent: 50,
            log: '日志信息2',
            error: '错误信息',
            createdAt: '1608028069',
            updatedAt: '1608028069',
            completedAt: '1608028069'
          },
          {
            id: '3',
            desc: '事件3',
            name: 'xxxx',
            phase: 3,
            status: 3,
            log: '日志信息3',
            createdAt: '1608028069',
            updatedAt: '1608028069',
            completedAt: '1608028069'
          },
          {
            id: '4',
            desc: '事件4',
            name: 'xxxx',
            phase: 2,
            status: 2,
            log: '日志信息4',
            createdAt: '1608028069',
            updatedAt: '1608028069',
            completedAt: '1608028069'
          },
          {
            id: '5',
            desc: '事件5',
            name: 'xxxx',
            phase: 1,
            status: 1,
            log: '日志信息5',
            createdAt: '1608028069',
            updatedAt: '1608028069',
            completedAt: '1608028069'
          }
        ]
      }
    },
    {
      id: '3',
      name: 'task3',
      type: 3,
      module: 1,
      belong: 'app',
      objectId: '3',
      workflowId: '3',
      createdAt: '1608028069',
      updatedAt: '1608028069',
      state: 3,
      workflow: {
        id: '2',
        phase: 3,
        status: 2,
        executed: 3,
        total: 3,
        createdAt: '1608028069',
        updatedAt: '1608028069',
        completedAt: '1608028169',
        workUnits: [
          {
            id: '1',
            desc: '事件1',
            name: 'xxxx',
            phase: 5,
            status: 1,
            percent: 100,
            log: '日志信息1',
            createdAt: '1608028069',
            updatedAt: '1608028069',
            completedAt: '1608028069'
          },
          {
            id: '2',
            desc: '事件2',
            name: 'xxxx',
            phase: 2,
            status: 1,
            percent: 50,
            log: '日志信息2',
            error: '错误信息',
            createdAt: '1608028069',
            updatedAt: '1608028069',
            completedAt: '1608028069'
          },
          {
            id: '3',
            desc: '事件3',
            name: 'xxxx',
            phase: 3,
            status: 3,
            log: '日志信息3',
            createdAt: '1608028069',
            updatedAt: '1608028069',
            completedAt: '1608028069'
          },
          {
            id: '4',
            desc: '事件4',
            name: 'xxxx',
            phase: 2,
            status: 2,
            log: '日志信息4',
            createdAt: '1608028069',
            updatedAt: '1608028069',
            completedAt: '1608028069'
          },
          {
            id: '5',
            desc: '事件5',
            name: 'xxxx',
            phase: 1,
            status: 1,
            log: '日志信息5',
            createdAt: '1608028069',
            updatedAt: '1608028069',
            completedAt: '1608028069'
          }
        ]
      }
    },
    {
      id: '4',
      name: 'task4',
      type: 4,
      module: 1,
      belong: 'app',
      objectId: '4',
      workflowId: '4',
      createdAt: '1608028069',
      updatedAt: '1608028069',
      state: 3,
      workflow: {
        id: '4',
        phase: 4,
        status: 3,
        executed: 2,
        total: 3,
        createdAt: '1608028069',
        updatedAt: '1608028069',
        completedAt: '1608032069',
        workUnits: [
          {
            id: '1',
            desc: '事件1',
            name: 'xxxx',
            phase: 5,
            status: 1,
            percent: 100,
            log: '日志信息1',
            createdAt: '1608028069',
            updatedAt: '1608028069',
            completedAt: '1608028069'
          },
          {
            id: '2',
            desc: '事件2',
            name: 'xxxx',
            phase: 2,
            status: 1,
            percent: 50,
            log: '日志信息2',
            error: '错误信息',
            createdAt: '1608028069',
            updatedAt: '1608028069',
            completedAt: '1608028069'
          },
          {
            id: '3',
            desc: '事件3',
            name: 'xxxx',
            phase: 3,
            status: 3,
            log: '日志信息3',
            createdAt: '1608028069',
            updatedAt: '1608028069',
            completedAt: '1608028069'
          },
          {
            id: '4',
            desc: '事件4',
            name: 'xxxx',
            phase: 2,
            status: 2,
            log: '日志信息4',
            createdAt: '1608028069',
            updatedAt: '1608028069',
            completedAt: '1608028069'
          },
          {
            id: '5',
            desc: '事件5',
            name: 'xxxx',
            phase: 1,
            status: 1,
            log: '日志信息5',
            createdAt: '1608028069',
            updatedAt: '1608028069',
            completedAt: '1608028069'
          }
        ]
      }
    }
  ],
  total: 4
}

const get = (options) => {
  const params = JSON.parse(options.body)
  return builder(list.data.find(item => item.id === params?.id))
}

Mock.mock(`${baseUrl}/admin.v1.Event/List`, 'post', list)
Mock.mock(`${baseUrl}/admin.v1.Event/Get`, 'post', get)
Mock.mock(`${baseUrl}/admin.v1.Event/Patch`, 'post', {})
Mock.mock(`${baseUrl}/admin.v1.Event/Delete`, 'post', {})
Mock.mock(`${baseUrl}/admin.v1.Event/BatchDelete`, 'post', {})
