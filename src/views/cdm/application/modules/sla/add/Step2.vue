<template>
  <div class="step-form-item">
    <a-result :title="title" :status="status">
      <template #extra>
        <a-button type="primary" @click="redo">{{ $t('layouts.step.operator.redo') }}</a-button>
        <a-button @click="nextBack">{{ $t('layouts.step.operator.finish') }}</a-button>
      </template>
    </a-result>
  </div>
</template>

<script>
import { useStepFormItem } from '@/core/use/form'
import events from '../events'

export default {
  name: 'Step2',
  setup (props, context) {
    const { redo, back } = useStepFormItem(props, context)
    return {
      redo,
      back
    }
  },
  data () {
    return {
      title: '新建SLA成功',
      status: 'success'
    }
  },
  methods: {
    _redo () {
      events.$emit(`refresh-${this.$route.params.id}`)
      this.redo()
    },
    _back () {
      events.$emit(`refresh-${this.$route.params.id}`)
      this.back()
    }
  }
}
</script>
