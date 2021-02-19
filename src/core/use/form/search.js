import { reactive, toRefs, watch } from '@vue/composition-api'
import { merge } from 'lodash'
import { transformComponentPlaceHolder } from '../_util/util'

function useSearchForm (props, context) {
  const state = reactive({
    __props__: {
      layout: 'inline',
      labelCol: { span: 5 },
      wrapperCol: { span: 19 }
    },
    model: {},
    advanced: false,
    toggleAdvanced: () => {
      state.advanced = !state.advanced
    }
  })

  const refresh = () => {
    context.emit('refresh', state.model)
  }

  const reset = () => {
    Object.keys(state.model).map(u => {
      state.model[u] = undefined
    })
    context.emit('reset')
  }

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
          on: {
            pressEnter: refresh
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
    refresh,
    reset
  }
}

export { useSearchForm }
