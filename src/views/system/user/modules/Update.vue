<template>
  <a-spin :spinning="loading">
    <form-builder ref="form" :items="items" />
  </a-spin>
</template>

<script>
import { mapActions } from 'vuex'
import { getAllUser } from '@/api/system/user'
import { getAllRole } from '@/api/system/role'
import { FormBuilder } from '@/components'
import { debounce, deepGet, handleFetchStateErrorDone, transformArray } from '@/utils/util'
import { isAlpha, isAlphanumeric, isRepeat } from '@/utils/validator'

export default {
  components: {
    FormBuilder
  },
  props: {
    record: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      items: [
        {
          label: '名称',
          prop: 'nickname',
          value: this.record.nickname,
          component: {
            name: 'a-input'
          }
        },
        {
          label: '用户名',
          prop: 'username',
          value: this.record.username,
          rules: [
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
                },
                initialValue: value
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
          value: this.record.role,
          component: {
            name: 'm-select'
          }
        },
        {
          label: '邮箱',
          prop: 'email',
          value: this.record.email,
          rules: { type: 'email', message: '请输入正确的邮箱格式！' },
          component: {
            name: 'a-input'
          }
        }
      ],
      loading: false
    }
  },
  created () {
    this.loadData()
  },
  methods: {
    ...mapActions(['UpdateUser']),
    async loadData () {
      try {
        this.loading = true
        const roleList = deepGet(await getAllRole(), 'data', []).map(u => ({
          value: u?.id,
          label: u?.name
        }))
        transformArray(this.items, { prop: 'role' }, { component: { props: { options: roleList } } })
        this.loading = false
      } catch (error) {
        transformArray(this.items, { prop: 'role' }, { component: { props: { emptyItemProps: handleFetchStateErrorDone(error) } } })
        this.loading = false
      }
    },
    onOk () {
      return new Promise(async (resolve, reject) => {
        const { valid, values, error } = await this.$refs.form.validate()
        if (valid) {
          try {
            await this.UpdateUser({
              id: this.record.id,
              nickname: values.nickname,
              username: values.username,
              password: values.password,
              role: values.role,
              email: values.email,
              phone: undefined
            })
            this.$message.success('修改用户成功！')
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
