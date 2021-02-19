<template>
  <form-builder ref="form" :items="items" />
</template>

<script>
import { addRole } from '@/api/system/role'
import { FormBuilder } from '@/components'

export default {
  components: {
    FormBuilder
  },
  data () {
    return {
      items: [
        {
          label: '角色',
          prop: 'name',
          rules: { required: true, message: '请选择！' },
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
            await addRole({
              name: values.name
            })
            this.$message.success('新建角色成功！')
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
