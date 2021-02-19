import { reactive, toRefs, watch } from '@vue/composition-api'
import { merge } from 'lodash'
import { isEmpty } from '@/utils/util'
import { transformComponentPlaceHolder } from '../_util/util'

function useForm (props, context) {
  const state = reactive({
    __props__: {
      labelCol: { span: 5 },
      wrapperCol: { span: 19 }
    },
    model: {}
  })

  const prepare = (value) => {
    let __props__ = {}
    const model = {}
    const items = value.items.map(item => {
      // warning(item.prop, 'FormBuilder', `prop is required for ${item.label}`)
      model[item.prop] = state.model[item.prop] || item.value
      item = merge({
        visible: true,
        component: {
          props: {
            allowClear: true,
            placeholder: transformComponentPlaceHolder(item.component)
          },
          slots: {}
        }
      }, item)
      return item
    })
    __props__ = merge(state.__props__, { ...props, items }, context.attrs)
    state.__props__ = __props__
    state.model = model
  }

  const reset = () => {
    Object.keys(state.model).map(u => {
      state.model[u] = undefined
    })
    context.emit('reset')
  }

  const validate = () => {
    return new Promise(async (resolve, reject) => {
      let res = {}
      context.refs.form.validate(async (valid, error) => {
        res = {
          valid: isEmpty(error),
          values: state.model,
          error
        }
        if (valid) {
          await props.submit(state.model)
        }
        resolve(res)
      })
    })
  }

  const validateField = (fields) => {
    return new Promise(async (resolve, reject) => {
      let res = {}
      context.refs.form.validateField(fields, (valid, error) => {
      // XXX: valid 存在 "" 的情况
        res = {
          valid: isEmpty(error),
          values: state.model,
          error
        }
        resolve(res)
      })
    })
  }

  prepare(props)

  watch(
    () => props,
    value => {
      prepare(value)
    }, {
      deep: true
    }
  )

  return {
    ...toRefs(state),
    reset,
    validate,
    validateField
  }
}

export { useForm }
