/* eslint-disable prefer-const */
import { reactive, toRefs, watch } from '@vue/composition-api'
import { merge } from 'lodash'
import { transformComponentPlaceHolder } from '../_util/util'

function useEditableCell (props, context) {
  const state = reactive({
    __props__: {},
    model: {}
  })

  const prepare = (value) => {
    let { item } = value
    let __props__ = {}
    const model = {}
    // warning(item.prop, 'FormBuilder', `prop is required for ${item.label}`)
    model[item.prop] = state.model[item.prop] || item.value
    item = merge({
      component: {
        props: {
          // 触发 blur 事件，影响编辑单元格
          // allowClear: true
          placeholder: transformComponentPlaceHolder(item.component)
        },
        slots: {}
      },
      editing: !!state.__props__?.item?.editing
    }, item)
    __props__ = merge({}, state.__props__, { item }, context.attrs)
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
    ...toRefs(state)
  }
}

export { useEditableCell }
