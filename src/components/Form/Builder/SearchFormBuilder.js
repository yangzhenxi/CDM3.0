import { useSearchForm } from '@/core/use/form'

export default {
  name: 'SearchFormBuilder',
  props: {
    config: {
      type: Object,
      default () {
        return {
          span: 3,
          fieldLimit: 2
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
    }
  },
  setup (props, context) {
    const {
      __props__,
      model,
      advanced,
      toggleAdvanced,
      refresh,
      reset
    } = useSearchForm(props, context)
    return {
      __props__,
      model,
      advanced,
      toggleAdvanced,
      refresh,
      reset
    }
  },
  render () {
    return (
      <div class="table-page-search-wrapper">
        <a-form-model ref="form" { ...{ props: { ...this.$attrs, ...this.__props__, model: this.model } } } >
          <a-row gutter={ 48 }>
            {
              this.__props__.items.filter(item => item.visible).map((item, index) => {
                const placeholder = this.$t(item.component.props.placeholder)
                return (
                  (this.advanced || index < this.config.fieldLimit)
                    ? <a-col md={ 24 / this.config.span } sm={ 24 }>
                      <a-form-model-item { ...{ props: item } }>
                        <component
                          { ...{ is: item.component?.name, props: { ...item.component?.props, placeholder }, on: item.component?.on } }
                          v-model={ this.model[item.prop] }
                          style={ item.component?.style }
                        >
                          { Object.keys(item.component?.slots).map(name => (<template slot={ name }>{ item.component?.slots[name] }</template>)) }
                        </component>
                      </a-form-model-item>
                    </a-col>
                    : ''
                )
              })
            }
            {
              this.$slots.operator
                ? this.$slots.operator
                : <a-col md={ !this.advanced && 8 || 24 } sm={ 24 }>
                  <span class="table-page-search-submitButtons" style={ this.advanced && { float: 'right', overflow: 'hidden' } || {} }>
                    <a-button type="primary" {...{ on: { click: this.refresh } }}>
                      { this.$t('layouts.table.search.query') }
                    </a-button>
                    <a-button style="margin-left: 8px" {...{ on: { click: this.reset } }}>
                      {this.$t('layouts.table.search.reset') }
                    </a-button>
                    {
                      this.__props__.items.filter(item => item.visible).length > this.config.fieldLimit
                        ? <a {...{ on: { click: this.toggleAdvanced } }} style="margin: 0 8px">
                          { this.advanced
                            ? this.$t('layouts.table.search.advancedOn')
                            : this.$t('layouts.table.search.advancedOff') }
                          <a-icon type={this.advanced ? 'up' : 'down'}/>
                        </a>
                        : ''
                    }
                  </span>
                </a-col>
            }
          </a-row>
        </a-form-model>
      </div>
    )
  }
}
