<template>
  <div class="step-form-item">
    <form-builder ref="form" :items="items">
      <template #operator>
        <div class="step-form-item-operator">
          <a-button @click="back">取消新建</a-button>
          <a-button @click="prev">{{ $t('layouts.step.operator.prev') }}</a-button>
          <a-button type="primary" @click="nextStep">{{ $t('layouts.step.operator.next') }}</a-button>
        </div>
      </template>
    </form-builder>
  </div>
</template>

<script>
import { FormBuilder, MIcon } from '@/components'
import { useStepFormItem } from '@/core/use'
import { convert, enumToSelection } from '@/utils/util'

export default {
  name: 'Step2',
  components: {
    FormBuilder,
    MIcon
  },
  setup (props, context) {
    const {
      back,
      prev,
      next,
      setStepData
    } = useStepFormItem(props, context)
    return {
      back,
      prev,
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
      ]
    }
  },
  methods: {
    async nextStep () {
      const { valid, values } = await this.$refs.form.validate()
      if (valid) {
        this.setStepData({
          key: 'step1',
          data: {
            module: values.module
          }
        })
        this.next()
      }
    }
  }
}
</script>
