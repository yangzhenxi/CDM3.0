r<template>
  <form-builder ref="form" :items="items" />
</template>

<script>
import { getAllClass, addClass } from '@/api/storage/class'
import { FormBuilder } from '@/components'
import { debounce, deepGet } from '@/utils/util'
import { isIP, isRepeat } from '@/utils/validator'

export default {
  components: {
    FormBuilder
  },
  data () {
    return {
      items: [
        {
          label: '名称',
          prop: 'name',
          rules: [
            { required: true, message: '请输入！' },
            { validator: debounce(async function (rule, value, callback) {
              const { valid, error } = await isRepeat(value, {
                fetchData: async () => {
                  try {
                    const data = deepGet(await getAllClass({
                      name: value
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
          label: 'IP',
          prop: 'ipAddr',
          rules: [
            { required: true, message: '请输入！' },
            { validator: async (rule, value, callback) => {
              const { valid, error } = isIP(value)
              if (!valid) {
                throw new Error(error)
              }
            } }
          ],
          component: {
            name: 'a-input'
          }
        },
        {
          label: '端口',
          prop: 'port',
          rules: { required: true, message: '请输入！' },
          component: {
            name: 'a-input-number',
            props: {
              min: 1,
              max: 65535,
              precision: 0
            },
            style: {
              width: '100%'
            }
          }
        }
      ]
    }
  },
  methods: {
    onOk () {
      return new Promise(async (resolve, reject) => {
        const { valid, values, error } = await this.$refs.form.validate()
        if (valid) {
          try {
            await addClass({
              name: values.name,
              ipAddr: values.ipAddr,
              port: values.port
            })
            this.$message.success('新建存储节点成功！')
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
