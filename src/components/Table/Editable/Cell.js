import { useEditableCell } from '@/core/use/table'
import { deepGet, isEmpty } from '@/utils/util'
import './index.less'

export default {
  name: 'EditTableCell',
  props: {
    item: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  setup (props, context) {
    const {
      __props__,
      model
    } = useEditableCell(props, context)
    return {
      __props__,
      model
    }
  },
  data () {
    return {
      error: null,
      errorVisible: false
    }
  },
  computed: {
    prop () {
      return this.model[this.__props__.item.prop]
    }
  },
  watch: {
    prop: {
      handler (value, old) {
        if (value !== old) {
          this.$refs.editableForm.validate((valid, error) => {
            this.errorVisible = !valid
            this.error = deepGet(error, [this.__props__.item.prop, 0, 'message'])
          })
        }
      },
      deep: true
    }
  },
  methods: {
    validate () {
      if (!this.__props__.item.editing) {
        this.__props__.item.editing = true
      }
      return new Promise(async (resolve, reject) => {
        let res = {}
        this.$refs.editableForm.validate(async (valid, error) => {
          res = {
            valid: isEmpty(error),
            values: this.model,
            error
          }
          this.errorVisible = false
          this.__props__.item.editing = !valid
          this.error = deepGet(error, [this.__props__.item.prop, 0, 'message'])
          resolve(res)
        })
      })
    },
    renderItemEditComponent () {
      const submit = e => {
        e.stopPropagation()
        if (!this.error) {
          this.__props__.item.editing = false
        } else {
          this.errorVisible = false
        }
        this.$emit('change', this.model[this.__props__.item.prop])
      }
      const focus = e => {
        e.stopPropagation()
        this.errorVisible = !!this.error
      }
      const componentOn = {
        focus,
        blur: submit,
        pressEnter: submit
      }
      const placeholder = this.$t(this.__props__.item.component.props.placeholder)
      return (
        <div class="flex-row editable-cell-form" style={{ display: this.__props__.item.editing ? 'flex' : 'none' }} onClick={ e => { e.stopPropagation() } } >
          <a-tooltip visible={ this.errorVisible } getPopupContainer={trigger => trigger.parentNode} placement="topLeft" >
            <template slot="title">
              <span class="error" style="color: #f5222d">{ this.error }</span>
            </template>
            <a-form-model-item { ...{ props: this.__props__.item } }>
              <component
                ref="editableFormItem"
                v-model={ this.model[this.__props__.item.prop] }
                { ...{ is: this.__props__.item.component?.name, props: { ...this.__props__.item.component?.props, placeholder }, on: { ...componentOn, ...this.__props__.item.component?.on } } }
                style={ this.__props__.item.component?.style }
              >
                { Object.keys(this.__props__.item.component?.slots).map(name => (<template slot={ name }>{ this.__props__.item.component?.slots[name] }</template>)) }
              </component>
            </a-form-model-item>
          </a-tooltip>
        </div>
      )
    },
    renderItemEditText () {
      const on = {
        click: e => {
          e.stopPropagation()
          this.__props__.item.editing = true
          this.$refs.editableFormItem.focus()
        }
      }
      return (
        <div class="flex-row editable-cell-text" style={{ display: this.__props__.item.editing ? 'none' : 'flex' }} { ... { on } }>
          <span class="value">{ this.model[this.__props__.item.prop] }</span>
          <div class="editable-cell-text-operator">
            <span class="icon-operator operator">
              <a-icon type="edit" class="icon-primary" { ... { on } } />
            </span>
          </div>
        </div>
      )
    },
    renderItemText () {
      return (
        <div class="text">
          <span class="value">{ this.model[this.__props__.item.prop] }</span>
        </div>
      )
    }
  },
  render () {
    return (
      <div class="editable-cell">
        {
          this.__props__.item.editable
            ? <a-form-model ref="editableForm" { ...{ props: { ...this.$attrs, model: this.model } } }>
              { this.renderItemEditComponent() }
              { this.renderItemEditText()}
            </a-form-model>
            : this.renderItemText()
        }
      </div>
    )
  }
}
