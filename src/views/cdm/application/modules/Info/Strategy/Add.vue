<template>
  <form-builder ref="form" :items="items" />
</template>

<script>
import { addProtectionStrategy } from '@/api/cdm/protectionStrategy'
import { FormBuilder } from '@/components'
import { convert, transformArray } from '@/utils/util'
import events from '../../events'

export default {
  components: {
    FormBuilder
  },
  data () {
    return {
      items: [
        {
          label: 'cron表达式',
          prop: 'cronExpression',
          value: '0 0 * * ?',
          rules: { required: true, message: '请输入！' },
          component: {
            name: 'cron'
          }
        },
        {
          label: '间隔时间（分）',
          prop: 'logDuration',
          visible: false,
          rules: { required: true, message: '请输入！' },
          component: {
            name: 'a-input-number',
            props: {
              min: 0,
              precision: 0
            },
            style: {
              width: '100%'
            }
          }
        }
      ],
      id: null,
      o: {}
    }
  },
  created () {
    this.id = this.$route.params.id
    this.o = events.data.find(u => u.id === this.id) || {}
    this.loadData()
  },
  methods: {
    loadData () {
      if (['oracle', 'pgsql'].includes(convert(this.o.record?.kind, 'CDM_APPLICATION_MODULE'))) {
        transformArray(this.items, { prop: 'logDuration' }, { visible: true })
      }
    },
    onOK () {
      return new Promise(async (resolve, reject) => {
        const { valid, values, error } = await this.$refs.form.validate()
        if (valid) {
          try {
            await addProtectionStrategy({
              applicationID: this.id,
              cronExpression: values.cronExpression,
              logDuration: values.logDuration
            })
            this.$message.success('新建保护策略成功！')
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

<style></style>
