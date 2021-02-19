import Mock from 'mockjs2'
import { builder, getBaseUrl } from '../../util'

const baseUrl = getBaseUrl()

const list = {
  data: [
    {
      id: '1',
      model: {
        name: 'dg',
        kind: 1
      },
      instances: [
        {
          lbletId: 'lblet',
          ip: '192.168.112.112',
          primary: true,
          db: 'db',
          sid: 'sid',
          user: 'sid',
          home: 'sid',
          listen: 'sid',
          destNum: '2',
          username: 'username'
        },
        {
          lbletId: 'lblet',
          ip: '192.168.112.112',
          primary: false,
          db: 'db',
          sid: 'sid',
          user: 'sid',
          home: 'sid',
          listen: 'sid',
          destNum: '2',
          username: 'username'
        }
      ]
    },
    {
      id: '2',
      model: {
        name: 'dg',
        kind: 2
      },
      instances: [
        {
          lbletId: 'lblet',
          ip: '192.168.112.112',
          primary: true,
          db: 'db',
          sid: 'sid',
          user: 'sid',
          home: 'sid',
          listen: 'sid',
          destNum: '2',
          username: 'username'
        },
        {
          lbletId: 'lblet',
          ip: '192.168.112.112',
          primary: true,
          db: 'db',
          sid: 'sid',
          user: 'sid',
          home: 'sid',
          listen: 'sid',
          destNum: '2',
          username: 'username'
        },
        {
          lbletId: 'lblet',
          ip: '192.168.112.112',
          primary: false,
          db: 'db',
          sid: 'sid',
          user: 'sid',
          home: 'sid',
          listen: 'sid',
          destNum: '2',
          username: 'username'
        }
      ]
    },
    {
      id: '3',
      model: {
        name: 'dg',
        kind: 2
      },
      instances: [
        {
          lbletId: 'lblet',
          ip: '192.168.112.112',
          primary: true,
          db: 'db',
          sid: 'sid',
          user: 'sid',
          home: 'sid',
          listen: 'sid',
          destNum: '2',
          username: 'username'
        },
        {
          lbletId: 'lblet',
          ip: '192.168.112.112',
          primary: true,
          db: 'db',
          sid: 'sid',
          user: 'sid',
          home: 'sid',
          listen: 'sid',
          destNum: '2',
          username: 'username'
        },
        {
          lbletId: 'lblet',
          ip: '192.168.112.112',
          primary: false,
          db: 'db',
          sid: 'sid',
          user: 'sid',
          home: 'sid',
          listen: 'sid',
          destNum: '2',
          username: 'username'
        }
      ]
    }
  ],
  total: 3
}

const dgInfo = () => {
  return builder({
    redoSize: 1024,
    filePath: 'filePath',
    logPath: 'logPath',
    oracleBase: 'oracleBase',
    oracleGroup: 'oracleGroup',
    lsnrctlStatus: 'Ready',
    archDestStatus: 'VALID'
  })
}

Mock.mock(`${baseUrl}/admin.v1.DataGuard/List`, 'post', list)
Mock.mock(`${baseUrl}/admin.v1.DataGuard/Add`, 'post', {})
Mock.mock(`${baseUrl}/admin.v1.DataGuard/Create`, 'post', {})
Mock.mock(`${baseUrl}/admin.v1.DataGuard/Delete`, 'post', {})
Mock.mock(`${baseUrl}/admin.v1.DataGuard/Destroy`, 'post', {})
Mock.mock(`${baseUrl}/admin.v1.DataGuard/QueryInfo`, 'post', dgInfo)
