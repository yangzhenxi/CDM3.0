<template>
  <div class="step-form-item">
    <form-builder ref="form" :items="items">
      <template #operator>
        <div class="step-form-item-operator">
          <a-button @click="back">取消新建</a-button>
          <a-button @click="prev">上一步</a-button>
          <a-button :loading="validatorLoading" @click="handleValidator">验证</a-button>
          <a-button type="primary" :loading="confirmLoading" :disabled="disabled" @click="nextStep">下一步</a-button>
        </div>
      </template>
    </form-builder>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { checkPgsql } from '@/api/module/pgsql'
import { FormBuilder } from '@/components'
import { useStepFormItem } from '@/core/use/form'
import { throttle } from '@/utils/util'

export default {
  name: 'PgsqlStep2',
  components: {
    FormBuilder
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
          label: '用户名',
          prop: 'user',
          value: 'postgres',
          rules: { required: true, message: '请输入！' },
          component: {
            name: 'a-input'
          }
        },
        {
          label: '密码',
          prop: 'password',
          value: '123',
          rules: { required: true, message: '请输入！' },
          component: {
            name: 'a-input-password'
          }
        },
        {
          label: '端口',
          prop: 'port',
          value: 5432,
          rules: { required: true, message: '请输入！' },
          component: {
            name: 'a-input'
          }
        },
        {
          label: 'sslMode',
          prop: 'sslMode',
          value: 'disable',
          rules: { required: true, message: '请输入！' },
          component: {
            name: 'a-input'
          }
        },
        {
          label: 'dbName',
          prop: 'dbName',
          value: 'postgres',
          rules: { required: true, message: '请输入！' },
          component: {
            name: 'a-input',
            props: {}
          }
        }
      ],
      spec: null,
      validatorLoading: false,
      confirmLoading: false,
      model: {},
      disabled: true
    }
  },
  watch: {
    model: {
      handler () {
        this.disabled = true
      },
      deep: true
    }
  },
  computed: {
    ...mapState({
      stpe3: state => state.cdmWorkflow.step['step3'],
      pgsqlStep1: state => state.cdmWorkflow.step['pgsqlStep1']
    })
  },
  mounted () {
    this.model = this.$refs.form.model
  },
  methods: {
    async nextStep () {
      try {
        this.confirmLoading = true
        this.setStepData({
          data: {
            spec: this.spec
          }
        })
        this.confirmLoading = false
        this.next()
      } catch (error) {
        this.confirmLoading = false
      }
    },
    handleValidator: throttle(function () {
      return new Promise(async (resolve, reject) => {
        this.validatorLoading = true
        const { valid, values } = await this.$refs.form.validate()
        if (valid) {
          try {
            this.spec = {
              ip: this.step3?.lblet?.ipAddr,
              user: values.user,
              sslMode: values.sslMode,
              password: values.password,
              port: +values.port,
              dbName: values.dbName
            }
            await checkPgsql({
              id: +this.step3?.lblet?.id,
              pgsqlInstance: this.spec
            })
            this.$message.success('验证成功！')
            this.disabled = false
            this.validatorLoading = false
            resolve()
          } catch (error) {
            this.$message.error('验证失败！')
            this.validatorLoading = false
            reject(error)
          }
        } else {
          this.validatorLoading = false
        }
      })
    })
  }
}
</script>
