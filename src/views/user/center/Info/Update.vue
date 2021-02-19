<template>
  <form-builder ref="form" :items="items" />
</template>

<script>
import { updateUser } from '@/api/system/user'
import { FormBuilder } from '@/components'

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
          label: '邮箱',
          prop: 'email',
          value: this.record.host,
          rules: { type: 'email', required: true, message: '请输入正确的邮箱格式！' },
          component: {
            name: 'a-input'
          }
        }
      ],
      loading: false
    }
  },
  methods: {
    onOk () {
      return new Promise(async (resolve, reject) => {
        const { valid, values, error } = await this.$refs.form.validate()
        if (valid) {
          try {
            await updateUser({
              id: this.record.id,
              email: values.host
            })
            this.$message.success('修改成功！')
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
