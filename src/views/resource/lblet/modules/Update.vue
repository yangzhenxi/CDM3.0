<template>
  <form-builder ref="form" :items="items" />
</template>

<script>
import { getAllLblet, updateLblet } from '@/api/resource/lblet'
import { FormBuilder } from '@/components'
import { debounce, deepGet } from '@/utils/util'
import { isAlphanumeric, isRepeat } from '@/utils/validator'

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
          prop: 'name',
          value: this.record.name,
          rules: [
            { required: true, message: '请输入！' },
            { validator: async (rule, value, callback) => {
              const { valid, error } = isAlphanumeric(value)
              if (!valid) {
                throw new Error(error)
              }
            } },
            { validator: debounce(async function (rule, value, callback) {
              const { valid, error } = await isRepeat(value, {
                fetchData: async () => {
                  try {
                    const data = deepGet(await getAllLblet({
                      name: value
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
            await updateLblet({
              id: this.record.id,
              name: values.name
            })
            this.$message.success('修改客户端成功')
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
