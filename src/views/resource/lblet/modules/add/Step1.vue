<template>
  <div class="step-form-item">
    <form-builder ref="form" :items="items">
      <template #operator>
        <div class="step-form-item-operator">
          <a-button @click="back">{{ $t('layouts.step.operator.back') }}</a-button>
          <a-button type="primary" :loading="confirmLoading" @click="nextStep">{{ $t('layouts.step.operator.next') }}</a-button>
        </div>
      </template>
    </form-builder>
  </div>
</template>

<script>
import { getLblet } from '@/api/resource/lblet'
import { FormBuilder, MIcon } from '@/components'
import { useStepFormItem } from '@/core/use'
import { convert, deepGet, enumToSelection } from '@/utils/util'

export default {
  name: 'Step1',
  components: {
    FormBuilder,
    MIcon
  },
  setup (props, context) {
    const {
      back,
      next,
      setStepData
    } = useStepFormItem(props, context)
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
          prop: 'module',
          rules: { required: true, message: '请选择！' },
          component: {
            name: 'm-select',
            props: {
              options: enumToSelection('CDM_APPLICATION_MODULE', u => ({
                value: u.key,
                label: <div class="flex-row-default">
                  <m-icon type={ u.icon } style="margin-right:4px; font-size: 20px"/>
                  <span>{ u.title }</span>
                </div>
              }))
            },
            on: {
              select: value => {
                this.$emit('insertStep', convert(value, 'CDM_APPLICATION_MODULE'))
              }
            }
          }
        }
      ],
      confirmLoading: false
    }
  },
  methods: {
    async nextStep () {
      const { valid, values } = await this.$refs.form.validate()
      if (valid) {
        this.confirmLoading = true
        try {
          const lblet = deepGet(await getLblet({ id: this.$route.params?.id }), 'data')
          this.setStepData({
            data: {
              module: values.module,
              lblet: lblet
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
