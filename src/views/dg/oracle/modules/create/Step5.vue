<template>
  <div class="step-form-item">
    <form-builder ref="form" :items="items">
      <template #operator>
        <div class="step-form-item-operator">
          <a-button @click="prev">{{ $t('layouts.step.operator.prev') }}</a-button>
          <a-button :loading="checkLoading" @click="handleCheck">验证</a-button>
          <a-button type="primary" :loading="confirmLoading" @click="handleSubmit">{{ $t('layouts.step.operator.create') }}</a-button>
        </div>
      </template>
    </form-builder>
  </div>
</template>

<script>
import { pick } from 'lodash'
import { mapState } from 'vuex'
import { getAllDg, getDGInfo, createDg } from '@/api/dg/oracle'
import { FormBuilder } from '@/components'
import { useStepFormItem } from '@/core/use/form'
import { deepGet, debounce, handleFetchErrorNotification } from '@/utils/util'
import { isAlphanumeric, isRepeat } from '@/utils/validator'

export default {
  name: 'Step5',
  components: {
    FormBuilder
  },
  setup (props, context) {
    const {
      prev,
      next
    } = useStepFormItem(props, context)
    return {
      prev,
      next
    }
  },
  data () {
    return {
      items: [
        {
          label: '容灾组名称',
          prop: 'name',
          rules: [
            { required: true, message: '请输入！' },
            { validator: async (rule, value, callback) => {
              const { valid, error } = isAlphanumeric(value)
              if (!valid) {
                throw new Error(error)
              }
            } },
            { validator: debounce(async function (rule, value, callback) {
              const { valid, error } = await isRepeat(value, {
                fetchData: async () => {
                  try {
                    const data = deepGet(await getAllDg({
                      name: value
                    }), 'data', [])
                    console.log(data)
                    return []
                  } catch (error) {
                    return []
                  }
                }
              })
              if (!valid) {
                callback(error)
              }
              callback()
            }) }
          ],
          component: {
            name: 'a-input'
          }
        },
        {
          label: '用户名',
          prop: 'username',
          rules: { required: true, message: '请输入！' },
          component: {
            name: 'a-input'
          }
        },
        {
          label: '密码',
          prop: 'password',
          rules: { required: true, message: '请输入！' },
          component: {
            name: 'a-input',
            props: {
              type: 'password'
            }
          }
        }
      ],
      checkLoading: false,
      confirmLoading: false

    }
  },
  computed: {
    ...mapState({
      step1: state => state.dgOracle.step['step1'],
      step2: state => state.dgOracle.step['step2'],
      step3: state => state.dgOracle.step['step3'],
      step4: state => state.dgOracle.step['step4']
    })
  },
  methods: {
    handleSubmit () {
      this.handleCheck().then(async () => {
        const { valid, values } = await this.$refs.form.validate()
        if (valid) {
          try {
            this.confirmLoading = true
            await createDg({
              model: {
                name: values.name,
                kind: 2
              },
              primaryInstance: {
                username: values.username,
                password: values.password,
                ...this.step2.primaryPod.instances.map(u =>
                  pick(u, [
                    'primary', 'ip', 'lbletID',
                    'db', 'sid', 'user', 'home', 'listen', 'destNum',
                    'redoSize', 'filePath', 'logPath'
                  ]))[0]
              },
              standbyInstance: this.step4.standbyPod.instances.map(u =>
                pick(u, [
                  'primary', 'ip', 'lbletID',
                  'db', 'sid', 'user', 'home', 'listen', 'destNum',
                  'oracleBase', 'oracleGroup', 'filePath', 'logPath'
                ]))[0]
            })
            this.confirmLoading = false
            this.next()
          } catch (error) {
            this.confirmLoading = false
          }
        }
      })
    },
    handleCheck () {
      return new Promise(async (resolve, reject) => {
        const { valid, values } = await this.$refs.form.validateField(['username', 'password'])
        if (valid) {
          try {
            this.checkLoading = true
            const data = deepGet(await getDGInfo({
              lbletID: deepGet(this.step1.primaryPod.lblets, [0, 'id']),
              typename: 'verifyDbPasswd',
              instance: {
                sid: deepGet(this.step2.primaryPod.instances, [0, 'sid']),
                listen: deepGet(this.step2.primaryPod.instances, [0, 'listen']),
                home: deepGet(this.step2.primaryPod.instances, [0, 'home']),
                user: deepGet(this.step2.primaryPod.instances, [0, 'user'])
              },
              username: values.username,
              password: values.password
            }), 'data.result')
            if (data === 'True') {
              this.$message.success('用户验证成功！')
              resolve()
              this.checkLoading = false
            } else {
              this.$message.error('用户验证失败！')
              reject(new Error('用户验证失败！'))
              this.checkLoading = false
            }
          } catch (error) {
            handleFetchErrorNotification(error)
            this.checkLoading = false
          }
        }
      })
    }
  }
}
</script>
