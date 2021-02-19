<template>
  <form-builder ref="form" :items="items" />
</template>

<script>
import { bindLabel } from '@/api/resource/lblet'
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
          label: '标签',
          prop: 'label',
          rules: { required: true, message: '请选择！' },
          component: {
            name: 'm-select',
            props: {
              mode: 'multiple',
              options: [
                { value: 'Oracle', label: 'Oracle' },
                { value: 'MySQL', label: 'MySQL' },
                { value: 'SQLServer', label: 'SQLServer' },
                { value: 'PostgreSQL', label: 'PostgreSQL' },
                { value: 'file', label: 'file' },
                { value: 'VMware', label: 'VMware' },
                { value: 'Hyper-V', label: 'Hyper-V' },
                { value: '生产库', label: '生产库' }
              ]
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
            await bindLabel({
              id: this.record.id,
              name: values.label
            })
            this.$message.success('绑定客户端成功')
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
