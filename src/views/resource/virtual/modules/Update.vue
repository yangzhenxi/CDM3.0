<template>
  <form-builder ref="form" :items="items" />
</template>

<script>
import { getVirtualList, updateVirtual } from '@/api/resource/virtual'
import { FormBuilder } from '@/components'
import { transformArray, debounce, deepGet } from '@/utils/util'
import { isRepeat } from '@/utils/validator'

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
          label: '客户端',
          prop: 'lblet',
          value: this.record.lblet?.name,
          rules: { required: true, message: '请选择！' },
          component: {
            name: 'm-select',
            mode: 'multiple',
            props: {
              disabled: true
            }
          }
        },
        {
          label: '名称',
          prop: 'name',
          value: this.record.name,
          rules: [
            { required: true, message: '请输入！' },
            {
              validator: debounce(async function (rule, value, callback) {
                const { valid, error } = await isRepeat(value, {
                  fetchData: async () => {
                    try {
                      const data = deepGet(await getVirtualList({ name: value }), 'data', [])
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
              })
            }
          ],
          component: {
            name: 'a-input'
          }
        },
        {
          label: '用户名',
          prop: 'username',
          rules: { required: true, message: '请输入！' },
          component: {
            name: 'a-input',
            on: {
              change: () => {
                this.$refs.form.model.password = ''
              }
            }
          }
        },
        {
          label: '密码',
          prop: 'password',
          rules: { required: true, message: '请输入！' },
          component: {
            name: 'a-input-password'
          }
        }
      ]
    }
  },
  created () {
    this.loadData()
  },
  methods: {
    loadData () {
      if (this.record.kind === 1) {
        transformArray(this.items, { prop: 'username' }, { visible: true, value: this.record.vCenter?.username })
        transformArray(this.items, { prop: 'password' }, { visible: true, value: this.record.vCenter?.password })
      } else {
        transformArray(this.items, { prop: 'username' }, { visible: false })
        transformArray(this.items, { prop: 'password' }, { visible: false })
      }
    },
    onOk () {
      return new Promise(async (resolve, reject) => {
        const { valid, values, error } = await this.$refs.form.validate()
        if (valid) {
          try {
            const params = {
              id: this.record.id,
              name: values.name,
              vcenter: {
                ipAddr: this.record.vCenter.ipAddr
              }
            }
            if (this.record.kind === 1) {
              params.vcenter.username = values.username
            }
            if (values.username !== this.record.vCenter?.username || values.password !== this.record.vCenter?.password) {
              params.vcenter.password = values.password
            }
            await updateVirtual(params)
            this.$message.success('修改虚拟化成功！')
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
