<template>
  <div class="step-form-item">
    <a-result :title="title" :status="status">
      <template #extra>
        <a-button type="primary" @click="redo">{{ $t('layouts.step.operator.redo') }}</a-button>
        <a-button @click="back">{{ $t('layouts.step.operator.finish') }}</a-button>
      </template>
    </a-result>
  </div>
</template>

<script>
import { useStepFormItem } from '@/core/use/form'

export default {
  name: 'Step4',
  setup (props, context) {
    const {
      redo,
      back
    } = useStepFormItem(props, context)
    return {
      redo,
      back
    }
  },
  data () {
    return {
      title: '提交新建成功',
      status: 'success'
    }
  }
}
</script>
