import Mock from 'mockjs2'
import { builder, getBaseUrl } from '../../util'

const baseUrl = getBaseUrl()

const list = {
  data: [
    {
      id: '1',
      name: 'oracle',
      os: 1,
      kind: 1,
      lbletId: '1',
      poolId: '1',
      instanceRelationship: 1,
      state: 3,
      createdAt: 1621261111,
      updatedAt: 1621261111,
      instances: [
        {
          id: '1',
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
          },
          persistentVolumes: [
            {
              id: '1',
              name: 'pv',
              pool: 'pool',
              capacity: 1024 * 1024,
              mountPath: '/',
              state: 1
            }
          ]
        }
      ]
    },
    {
      id: '2',
      name: 'asm',
      os: 1,
      kind: 1,
      lbletId: '1',
      poolId: '1',
      instanceRelationship: 1,
      state: 1,
      createdAt: 1621261111,
      updatedAt: 1621261111,
      instances: [
        {
          id: '1',
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
          },
          persistentVolumes: [
            {
              id: '1',
              name: 'pv',
              pool: 'pool',
              capacity: 1024 * 1024,
              mountPath: '/',
              state: 1
            },
            {
              id: '2',
              name: 'pv',
              pool: 'pool',
              capacity: 1024 * 1024,
              mountPath: '/',
              state: 1
            }
          ]
        },
        {
          id: '2',
          name: 'test_instance',
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
      ]
    },
    {
      id: '3',
      name: 'mysql',
      os: 1,
      kind: 2,
      lbletId: '1',
      poolId: '1',
      instanceRelationship: 1,
      state: 3,
      createdAt: 1621261111,
      updatedAt: 1621261111,
      instances: [
        {
          id: '1',
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
          },
          persistentVolumes: [
            {
              id: '1',
              name: 'pv',
              pool: 'pool',
              capacity: 1024 * 1024,
              mountPath: '/',
              state: 1
            }
          ]
        },
        {
          id: '2',
          name: 'test_instance',
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
          },
          persistentVolumes: [
            {
              id: '1',
              name: 'pv',
              pool: 'pool',
              capacity: 1024 * 1024,
              mountPath: '/',
              state: 1
            }
          ]
        }
      ]
    },
    {
      id: '4',
      name: 'mssql',
      os: 1,
      kind: 3,
      lbletId: '1',
      poolId: '1',
      instanceRelationship: 1,
      state: 3,
      createdAt: 1621261111,
      updatedAt: 1621261111,
      instances: [
        {
          id: '1',
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
          },
          persistentVolumes: [
            {
              id: '1',
              name: 'pv',
              pool: 'pool',
              capacity: 1024 * 1024,
              mountPath: '/',
              state: 1
            }
          ]
        },
        {
          id: '2',
          name: 'test_instance',
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
          },
          persistentVolumes: [
            {
              id: '1',
              name: 'pv',
              pool: 'pool',
              capacity: 1024 * 1024,
              mountPath: '/',
              state: 1
            }
          ]
        }
      ]
    },
    {
      id: '5',
      name: 'pgsql',
      os: 1,
      kind: 4,
      lbletId: '1',
      poolId: '1',
      instanceRelationship: 1,
      state: 3,
      createdAt: 1621261111,
      updatedAt: 1621261111,
      instances: [
        {
          id: '1',
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
          },
          persistentVolumes: [
            {
              id: '1',
              name: 'pv',
              pool: 'pool',
              capacity: 1024 * 1024,
              mountPath: '/',
              state: 1
            }
          ]
        },
        {
          id: '2',
          name: 'test_instance',
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
          },
          persistentVolumes: [
            {
              id: '1',
              name: 'pv',
              pool: 'pool',
              capacity: 1024 * 1024,
              mountPath: '/',
              state: 1
            }
          ]
        }
      ]
    },
    {
      id: '6',
      name: 'vmware',
      os: 1,
      kind: 6,
      lbletId: '1',
      poolId: '1',
      instanceRelationship: 1,
      state: 3,
      createdAt: 1621261111,
      updatedAt: 1621261111,
      instances: [
        {
          id: '1',
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
          },
          persistentVolumes: [
            {
              id: '1',
              name: 'pv',
              pool: 'pool',
              capacity: 1024 * 1024,
              mountPath: '/',
              state: 1
            }
          ]
        },
        {
          id: '2',
          name: 'test_instance',
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
          },
          persistentVolumes: [
            {
              id: '1',
              name: 'pv',
              pool: 'pool',
              capacity: 1024 * 1024,
              mountPath: '/',
              state: 1
            }
          ]
        }
      ]
    },
    {
      id: '7',
      name: 'hyperv',
      os: 'hyperv',
      kind: 7,
      lbletId: '1',
      poolId: '1',
      instanceRelationship: 1,
      state: 3,
      createdAt: 1621261111,
      updatedAt: 1621261111,
      instances: [
        {
          id: '1',
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
          },
          persistentVolumes: [
            {
              id: '1',
              name: 'pv',
              pool: 'pool',
              capacity: 1024 * 1024,
              mountPath: '/',
              state: 1
            }
          ]
        },
        {
          id: '2',
          name: 'test_instance',
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
          },
          persistentVolumes: [
            {
              id: '1',
              name: 'pv',
              pool: 'pool',
              capacity: 1024 * 1024,
              mountPath: '/',
              state: 1
            }
          ]
        }
      ]
    },
    {
      id: '8',
      name: 'file',
      os: 1,
      kind: 5,
      lbletId: '1',
      poolId: '1',
      instanceRelationship: 1,
      state: 2,
      createdAt: 1621261111,
      updatedAt: 1621261111,
      instances: [
        {
          id: '1',
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
          },
          persistentVolumes: [
            {
              id: '1',
              name: 'pv',
              pool: 'pool',
              capacity: 1024 * 1024,
              mountPath: '/',
              state: 1
            }
          ]
        },
        {
          id: '2',
          name: 'test_instance',
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
          },
          persistentVolumes: [
            {
              id: '1',
              name: 'pv',
              pool: 'pool',
              capacity: 1024 * 1024,
              mountPath: '/',
              state: 1
            }
          ]
        }
      ]
    }
  ],
  total: 8
}

const get = (options) => {
  const params = JSON.parse(options.body)
  return builder(list.data.find(item => item.id === params?.id))
}

Mock.mock(`${baseUrl}/admin.v1.Application/List`, 'post', list)
Mock.mock(`${baseUrl}/admin.v1.Application/Get`, 'post', get)
Mock.mock(`${baseUrl}/admin.v1.Application/Add`, 'post', {})
Mock.mock(`${baseUrl}/admin.v1.Application/Patch`, 'post', {})
Mock.mock(`${baseUrl}/admin.v1.Application/Delete`, 'post', {})
Mock.mock(`${baseUrl}/admin.v1.Application/BatchDelete`, 'post', {})
Mock.mock(`${baseUrl}/admin.v1.Application/Test`, 'post', {})
Mock.mock(`${baseUrl}/admin.v1.Application/Backup`, 'post', {})
