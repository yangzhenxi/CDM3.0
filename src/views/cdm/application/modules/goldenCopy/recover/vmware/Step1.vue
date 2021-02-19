<template>
  <div class="step-form-item">
    <form-builder ref="form" :items="items">
      <template #operator>
        <div class="step-form-item-operator">
          <a-button @click="back">返回</a-button>
          <a-button type="primary" :loading="confirmLoading" @click="nextStep">下一步</a-button>
        </div>
      </template>
    </form-builder>
  </div>
</template>

<script>
import { FormBuilder } from '@/components'
import { useStepFormItem } from '@/core/use/form'
import { enumToSelection, formatDate } from '@/utils/util'

export default {
  name: 'VmwareStep1',
  components: {
    FormBuilder
  },
  setup (props, context) {
    const { back, next, setStepData } = useStepFormItem(props, context)
    return {
      back,
      next,
      setStepData
    }
  },
  data () {
    return {
      items: [
        {
          label: '应用类型',
          prop: 'op',
          rules: { required: true, message: '请选择！' },
          component: {
            name: 'm-select',
            props: {
              options: enumToSelection('VMWARE_RECOVER_OP', u => ({
                value: u.key,
                label: u.value,
                disabled: u.disabled
              }))
            },
            on: {
              select: value => {
                this.$emit('insertStep', `vmware${value.substring(0, 1).toUpperCase()}${value.substring(1)}`)
              }
            }
          }
        },
        {
          label: '挂载名称',
          prop: 'name',
          value: `挂载:${formatDate(new Date(), 'MMDDHHmmss')}`,
          rules: { required: true, message: '请选择！' },
          component: {
            name: 'a-input'
          }
        }
      ],
      confirmLoading: false
    }
  },
  methods: {
    async nextStep () {
      this.confirmLoading = true
      const { valid, values } = await this.$refs.form.validate()
      this.confirmLoading = valid
      if (valid) {
        try {
          this.setStepData({
            data: {
              ...values
            }
          })
          this.confirmLoading = false
          this.next()
        } catch (error) {
          this.confirmLoading = false
        }
      }
    }
  }
}
</script>
