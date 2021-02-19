import { useForm } from '@/core/use/form'

export default {
  name: 'FormBuilder',
  props: {
    config: {
      type: Object,
      default () {
        return {
          span: 1
        }
      }
    },
    /**
		 * 表单item数据
		 * 例如：
		 * [
		 *   {
		 *     label: 'name',
		 *     prop: 'name',
		 *     component: {
		 *       name: 'a-input'
		 *     }
		 *   }
		 * ]
		 */
    items: {
      type: Array,
      default () {
        return []
      }
    },
    submit: {
      type: Function,
      default: () => {}
    }
  },
  setup (props, context) {
    const {
      __props__,
      model,
      reset,
      validate,
      validateField
    } = useForm(props, context)
    return {
      __props__,
      model,
      reset,
      validate,
      validateField
    }
  },
  render () {
    return (
      <a-form-model ref="form" { ...{ props: { ...this.$attrs, ...this.__props__, model: this.model } } } >
        <a-row gutter={ 16 }>
          {
            this.__props__.items.filter(item => item.visible).map(item => {
              const placeholder = this.$t(item.component.props.placeholder)
              return (
                <a-col md={ 24 / (item.span || this.config.span) } sm={ 24 }>
                  <a-form-model-item { ...{ props: item } }>
                    <component
                      v-model={ this.model[item.prop] }
                      { ...{ is: item.component?.name, props: { ...item.component?.props, placeholder }, on: item.component?.on } }
                      style={ item.component?.style }
                    >
                      { Object.keys(item.component?.slots).map(name => (<template slot={ name }>{ item.component?.slots[name] }</template>)) }
                    </component>
                  </a-form-model-item>
                </a-col>
              )
            })
          }
          { this.$slots.operator }
        </a-row>
      </a-form-model>
    )
  }
}
