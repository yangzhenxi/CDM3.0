<template>
  <div class="step-form-item">
    <form-builder ref="form" :items="items">
      <template #operator>
        <div class="step-form-item-operator">
          <a-button @click="back">取消新建</a-button>
          <a-button @click="prev">上一步</a-button>
          <a-button type="primary" :loading="confirmLoading" @click="nextStep">新建</a-button>
        </div>
      </template>
    </form-builder>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { addRecoveryStrategy } from '@/api/cdm/workflow'
import { FormBuilder } from '@/components'
import { useStepFormItem } from '@/core/use/form'

export default {
  name: 'Step3',
  components: {
    FormBuilder
  },
  setup (props, context) {
    const { back, prev, next } = useStepFormItem(props, context)
    return {
      back,
      prev,
      next
    }
  },
  data () {
    return {
      confirmLoading: false,
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
        },
        {
          label: '恢复类型',
          prop: 'recoverType',
          rules: { required: true, message: '请选择！' },
          component: {
            name: 'm-select',
            props: {
              options: this.$enum('CDM_WORKFLOW_RECOVER_TYPE').map(u => ({
                value: u.key,
                label: <span>{u.value}</span>,
                disabled: u.disabled
              }))
            }
          }
        }
      ]
    }
  },
  computed: {
    ...mapState({
      step1: state => state.cdmWorkflow.step['step1'],
      step2: state => state.cdmWorkflow.step['step2'],
      step3: state => state.cdmWorkflow.step['step3'],
      mssqlStep1: state => state.cdmWorkflow.step['mssqlStep1']
    })
  },
  methods: {
    nextStep () {
      return new Promise(async (resolve, reject) => {
        const { valid, values } = await this.$refs.form.validate()
        if (valid) {
          try {
            const params = {
              spec: JSON.stringify(this.mssqlStep1?.spec),
              instanceID: +this.step2?.instanceID,
              lbletID: +this.step3.lblet?.id,
              ...values
            }
            this.confirmLoading = true
            await addRecoveryStrategy(params)
            resolve()
            this.next()
          } catch (error) {
            this.$message.error('创建失败！')
            this.validatorLoading = false
            reject(error)
          }
        }
      })
    }
  }
}
</script>
