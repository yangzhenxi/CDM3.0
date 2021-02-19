<template>
  <a-spin :spinning="loading">
    <form-builder ref="form" :items="items" :config="{ footer: false }" />
  </a-spin>
</template>

<script>
import { FormBuilder } from '@/components'
import { updateRecoveryStrategy } from '@/api/cdm/workflow'
import { transformArray } from '@/utils/util'
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
      loading: false,
      items: [
        {
          label: '名称',
          prop: 'name',
          rules: { required: true, message: '请输入！' },
          component: {
            name: 'a-input'
          }
        },
        {
          label: 'cron表达式',
          prop: 'cronExpression',
          value: '0 0 0 * * ?',
          rules: { required: true, message: '请输入！' },
          component: {
            name: 'cron'
          }
        }
      ]
    }
  },
  mounted () {
    this.loadData()
  },
  methods: {
    loadData () {
      this.loading = true
      transformArray(this.items, { prop: 'name' }, { value: this.record.name })
      transformArray(this.items, { prop: 'cronExpression' }, { value: this.record.cronExpression })
      this.loading = false
    },
    onOk () {
      return new Promise(async (resolve, reject) => {
        const { valid, values, error } = await this.$refs.form.validate()
        if (valid) {
          await updateRecoveryStrategy({
            id: this.record.id,
            able: this.record.able,
            ...values
          })
          this.$message.success('修改成功！')

          resolve(true)
        } else {
          reject(error)
        }
      })
    }
  }
}
</script>
