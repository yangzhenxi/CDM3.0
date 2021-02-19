<template>
  <div class="step-form-item">
    <form-builder ref="form" :items="items">
      <template #operator>
        <div class="step-form-item-operator">
          <a-button @click="prev">{{ $t('layouts.step.operator.prev') }}</a-button>
          <a-button type="primary" :loading="confirmLoading" @click="handleSubmit">{{ $t('layouts.step.operator.add') }}</a-button>
        </div>
      </template>
    </form-builder>
  </div>
</template>

<script>
import { pick } from 'lodash'
import { mapState } from 'vuex'
import { getAllDg, addDg } from '@/api/dg/oracle'
import { FormBuilder } from '@/components'
import { useStepFormItem } from '@/core/use/form'
import { deepGet, debounce } from '@/utils/util'
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
        }
      ],
      confirmLoading: false
    }
  },
  computed: {
    ...mapState({
      step2: state => state.dgOracle.step['step2'],
      step4: state => state.dgOracle.step['step4']
    })
  },
  methods: {
    async handleSubmit () {
      this.confirmLoading = true
      const { valid, values } = await this.$refs.form.validate()
      this.confirmLoading = valid
      if (valid) {
        try {
          await addDg({
            model: {
              name: values.name,
              kind: 1
            },
            instances: [
              ...this.step2.primaryPod.instances.map(u => pick(u, [
                'primary', 'ip', 'lbletId',
                'db', 'sid', 'user', 'home', 'listen', 'destNum'
              ])),
              ...this.step4.standbyPod.instances.map(u => pick(u, [
                'primary', 'ip', 'lbletId',
                'db', 'sid', 'user', 'home', 'listen', 'destNum'
              ]))
            ]
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
