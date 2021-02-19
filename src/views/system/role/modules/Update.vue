<template>
  <form-builder ref="form" :items="items" />
</template>

<script>
import { updateRole } from '@/api/system/role'
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
          label: '名称',
          prop: 'name',
          value: this.record?.name,
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
            await updateRole({
              id: this.record?.id,
              name: values.name
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
