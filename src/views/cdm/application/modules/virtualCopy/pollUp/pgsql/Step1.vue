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
  name: 'PgsqlStep1',
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
      Pgsql: null,
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
      step1: state => state.cdmApplication.step['step1']
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
            Pgsql: this.Pgsql
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
            this.Pgsql = {
              ip: this.step1?.lblet?.ipAddr,
              user: values.user,
              sslMode: values.sslMode,
              password: values.password,
              port: +values.port,
              dbName: values.dbName
            }
            await checkPgsql({
              id: +this.step1?.lblet?.id,
              pgsqlInstance: this.Pgsql
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
