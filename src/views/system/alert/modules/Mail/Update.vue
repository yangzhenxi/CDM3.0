<template>
  <form-builder ref="form" :items="items" />
</template>

<script>
import { updateAlertSmtp } from '@/api/system/alert'
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
          label: '域名',
          prop: 'host',
          value: this.record.host,
          component: {
            name: 'a-input'
          }
        },
        {
          label: '用户名',
          prop: 'username',
          value: this.record.username,
          component: {
            name: 'a-input'
          }
        },
        {
          label: '密码',
          prop: 'password',
          value: this.record.password,
          component: {
            name: 'a-input-password'
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
            await updateAlertSmtp({
              id: this.record.id,
              host: values.host,
              username: values.username,
              password: values.password
            })
            this.$message.success('配置邮件成功！')
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
