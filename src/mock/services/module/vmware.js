import Mock from 'mockjs2'
import { getBaseUrl } from '../../util'

const baseUrl = getBaseUrl()

const vc = {
  vcinfo: {
    version: '7.0',
    host: [
      {
        ip: '192.168.2.152'
      },
      {
        ip: '192.168.2.152'
      }
    ],
    vm: [
      {
        name: 'howlink-soft-server1',
        ips: ['192.168.245.123', '139.232.12.1'],
        ref: 'vm-704',
        applicationID: '-1',
        os: 'linux 3.10.0-957.x86'
      },
      {
        name: 'howlink-soft-server1',
        ips: ['192.168.222.123', '139.232.12.1'],
        ref: 'vm-704',
        applicationID: '1',
        os: 'linux 3.10.0-957.x86'
      },
      {
        name: 'howlink-soft-server1',
        ips: ['192.168.222.123', '139.232.12.1'],
        ref: 'vm-704',
        applicationID: '2',
        os: 'linux 3.10.0-957.x86'
      }
    ]
  }
}

const dataCenter = {
  data: [
    {
      string: 'dataCenter'
    },
    {
      string: 'dataCenters'
    }
  ]
}

const vmList = {
  virtualMachines: [
    {
      key: 1,
      title: 'title',
      ref: 'ref',
      vm_name: 'name',
      ips: 'ips',
      os: 1,
      capacity: '98988999',
      application_id: true
    },
    {
      key: 12,
      title: 'titl2e',
      ref: 're2f',
      vm_name: 'na2me',
      ips: 'ip2s',
      os: 12,
      capacity: '989889929',
      application_id: false
    },
    {
      key: 3,
      title: 'title3',
      ref: 'ref3',
      vm_name: 'name3',
      ips: 'ip3s',
      os: 3,
      capacity: '989828999',
      application_id: false
    }
  ]
}

const clusterAndHost = {
  cluster_and_host: [
    {
      path: 'cluster',
      ips: ['192.168.221.2', '192.231.232.12']
    },
    {
      path: '192.168.2.122'
    }
  ]
}

Mock.mock(`${baseUrl}/admin.v1.Virtual/GetVcenterInfo`, 'post', vc)
Mock.mock(`${baseUrl}/admin.v1.Virtual/GetDatacenter`, 'post', dataCenter)
Mock.mock(`${baseUrl}/admin.v1.Virtual/GetVMsByDatacenter`, 'post', vmList)
Mock.mock(`${baseUrl}/admin.v1.Virtual/GetClusterAndHost`, 'post', clusterAndHost)
