r<template>
  <form-builder ref="form" :items="items" />
</template>

<script>
import { getAllRole } from '@/api/system/role'
import { getAllUser, addUser } from '@/api/system/user'
import { FormBuilder } from '@/components'
import { debounce, deepGet, handleFetchStateErrorDone, transformArray } from '@/utils/util'
import { isAlpha, isAlphanumeric, isRepeat } from '@/utils/validator'

export default {
  components: {
    FormBuilder
  },
  data () {
    return {
      items: [
        {
          label: '名称',
          prop: 'nickname',
          rules: { required: true, message: '请输入！' },
          component: {
            name: 'a-input'
          }
        },
        {
          label: '用户名',
          prop: 'username',
          rules: [
            { required: true, message: '请输入！' },
            { validator: async (rule, value, callback) => {
              if (value === 'admin') {
                throw new Error('名称已存在，请重新输入！')
              }
            } },
            { validator: async (rule, value, callback) => {
              const { valid, error } = isAlpha(value, { min: 5 })
              if (!valid) {
                throw new Error(error)
              }
            } },
            { validator: debounce(async function (rule, value, callback) {
              const { valid, error } = await isRepeat(value, {
                fetchData: async () => {
                  try {
                    const data = deepGet(await getAllUser({
                      username: value
                    }), 'data', [])
                    return data
                  } catch (error) {
                    return []
                  }
                }
              })
              if (!valid) {
                callback(error)
              }
              callback()
            }) }
          ],
          component: {
            name: 'a-input'
          }
        },
        {
          label: '密码',
          prop: 'password',
          rules: [
            { required: true, message: '请输入！' },
            { validator: async (rule, value, callback) => {
              const { valid, error } = isAlphanumeric(value, { min: 6 })
              if (!valid) {
                throw new Error(error)
              }
            } }
          ],
          component: {
            name: 'a-input',
            props: {
              type: 'password'
            }
          }
        },
        {
          label: '角色',
          prop: 'role',
          rules: { required: true, message: '请选择！' },
          component: {
            name: 'm-select'
          }
        },
        {
          label: '邮箱',
          prop: 'email',
          rules: { type: 'email', required: true, message: '请输入正确的邮箱格式！' },
          component: {
            name: 'a-input'
          }
        }
      ],
      roleEmpty: {
        state: 'empty',
        data: null
      }
    }
  },
  created () {
    this.loadData()
  },
  methods: {
    async loadData () {
      try {
        const roleList = deepGet(await getAllRole(), 'data', []).map(u => ({
          value: u?.id,
          label: u?.name
        }))
        transformArray(this.items, { prop: 'role' }, { component: { props: { options: roleList } } })
      } catch (error) {
        transformArray(this.items, { prop: 'role' }, { component: { props: { emptyItemProps: handleFetchStateErrorDone(error) } } })
      }
    },
    onOk () {
      return new Promise(async (resolve, reject) => {
        const { valid, values, error } = await this.$refs.form.validate()
        if (valid) {
          try {
            await addUser({
              nickname: values.nickname,
              username: values.username,
              password: values.password,
              role: values.role,
              status: 1,
              email: values.email,
              phone: undefined
            })
            this.$message.success('新建用户成功！')
            resolve(true)
          } catch (error) {
            reject(error)
          }
        } else {
          reject(error)
        }
      })
    }
  }
}
</script>
