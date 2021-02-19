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
import { checkMssql } from '@/api/module/mssql'
import { FormBuilder } from '@/components'
import { useStepFormItem } from '@/core/use/form'
import { transformArray, throttle } from '@/utils/util'

export default {
  name: 'MssqlStep1',
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
          label: '身份验证',
          prop: 'windows',
          value: 'true',
          rules: { required: true, message: '请选择！' },
          component: {
            name: 'm-select',
            props: {
              options: [
                { label: 'windows身份验证', value: 'false' },
                { label: 'SQL Server 身份验证', value: 'true' }
              ]
            },
            on: {
              select: e => {
                if (e === 'true') {
                  transformArray(this.items, { prop: 'user' }, { component: { props: { disabled: false } } })
                  transformArray(this.items, { prop: 'password' }, { component: { props: { disabled: false } } })
                  transformArray(this.items, { prop: 'database' }, { component: { props: { disabled: false } } })
                } else {
                  transformArray(this.items, { prop: 'user' }, { component: { props: { disabled: true } } })
                  transformArray(this.items, { prop: 'password' }, { component: { props: { disabled: true } } })
                  transformArray(this.items, { prop: 'database' }, { component: { props: { disabled: true } } })
                }
              }
            }
          }
        },
        {
          label: '数据源',
          prop: 'dataSource',
          value: '\\sqlexpress',
          rules: { required: true, message: '请输入！' },
          component: {
            name: 'a-input'
          }
        },
        {
          label: '用户名',
          prop: 'user',
          value: 'sa',
          rules: { required: true, message: '请输入！' },
          component: {
            name: 'a-input',
            props: {
              disabled: false
            }
          }
        },
        {
          label: '密码',
          prop: 'password',
          value: 'Howlink@1401',
          rules: { required: true, message: '请输入！' },
          component: {
            name: 'a-input',
            props: {
              type: 'password',
              disabled: false
            }
          }
        },
        {
          label: '数据库',
          prop: 'database',
          value: 'master',
          rules: { required: true, message: '请输入！' },
          component: {
            name: 'a-input',
            props: {
              disabled: false
            }
          }
        },
        {
          label: '端口',
          prop: 'port',
          value: 1456,
          visible: false,
          rules: { required: true, message: '请输入！' },
          component: {
            name: 'a-input'
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
      mssqlStep1: state => state.cdmWorkflow.step['mssqlStep1']
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
              ip: this.stpe3.lblet?.ipAddr,
              user: values.user,
              password: values.password,
              dataSource: values.dataSource,
              port: +values.port,
              database: values.database,
              windows: values.windows === 'true'
            }
            await checkMssql({
              id: this.stpe3.lblet?.id,
              mssqlInstance: this.spec
            })
            this.validatorLoading = false
            this.$message.success('验证成功！')
            this.disabled = false
            resolve()
          } catch (error) {
            this.validatorLoading = false
            this.$message.error('验证失败！')
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
