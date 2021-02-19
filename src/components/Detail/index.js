import MIcon from '../Icon'
import { EMPTY_VALUE } from '@/config/constant.config'
import { convert, deepGet, deepSet, isEmpty, isFunction } from '@/utils/util'
import './index.less'

export default {
  name: 'Detail',
  components: {
    MIcon
  },
  props: {
    title: {
      type: String,
      required: false
    },
    data: {
      type: Array,
      required: true
    },
    colSpan: {
      type: Number,
      required: false,
      default: 1
    },
    size: {
      type: String,
      required: false
    },
    layout: {
      type: String,
      required: false,
      default: 'horizontal'
    },
    align: {
      type: String,
      default: 'start'
    },
    justify: {
      type: String,
      default: 'start'
    },
    colon: {
      type: Boolean,
      default: true
    },
    overlayClassName: {
      type: String,
      required: false
    }
  },
  data () {
    return {
      responsive: {
        1: { xs: 24 },
        2: { xs: 24, sm: 12 },
        3: { xs: 24, sm: 12, md: 8 },
        4: { xs: 24, sm: 12, md: 6 }
      }
    }
  },
  computed: {
    _ () {
      return this.data
    },
    record () {
      return this._.reduce((u, i) => deepSet(u, i.key, i.value), {})
    }
  },
  methods: {
    renderTitle () {
      return (
        this.$slots.title
          ? <div class="title">{ this.$slots.title }</div>
          : this.title
            ? <div class="title">{ this.title }</div>
            : ''
      )
    },
    renderItems () {
      return (
        <a-row class="row" gutter={[ 32 ]}>
          { this._.map((item, index) => this.renderItem(item, index)) }
        </a-row>
      )
    },
    renderItem (item = {}, index) {
      const value = convert(item.value, item.filter || item.enum, item.config)
      const valueDefaultRender = () => value
      let valueSlotRender = valueDefaultRender
      const valueRenderName = deepGet(item, 'valueScopedSlots.customRender')
      if (valueRenderName) {
        valueSlotRender = (isFunction(valueRenderName) ? valueRenderName : this.$scopedSlots[valueRenderName]) || valueDefaultRender
      }
      return (
        <a-col class={['col', `col-${this.align}`]} { ...{ props: this.responsive[this.colSpan] } }>
          <div class={['label', this.colon ? 'colon' : '']} title={ item.title }>
            { item.title || EMPTY_VALUE }
            { this.renderItemTooltip(item) }
          </div>
          <div class={['value', `value-${this.justify}`, 'value-overflow']}>
            {
              valueRenderName
                ? valueSlotRender(item.value, this.record, index, item)
                : <span title={ value }>
                  { valueSlotRender(item.value, this.record, index, item) }
                </span>
            }
          </div>
        </a-col>
      )
    },
    renderItemTooltip (item) {
      return (
        item.tooltip
          ? <a-tooltip>
            <template slot="title">
              { item.tooltip }
            </template>
            <a-icon type="question-circle" class="icon-question" />
          </a-tooltip> : ''
      )
    }
  },
  render () {
    this.$scopedSlots = Object.assign({}, {
      icon: text => !isEmpty(text) ? <m-icon type={text} /> : EMPTY_VALUE,
      labels: text => {
        const labels = Object.keys(deepGet(text, [], {})).filter(i => !this.$enum('SYSTEM_LABEL_BUILD_IN').includes(i)).map(i => {
          const label = this.$enum('SYSTEM_LABEL_LIST').find(o => deepGet(o, 'key') === i)
          return {
            value: deepGet(label, 'value'),
            color: deepGet(label, 'color')
          }
        })
        if (labels.length > 0) {
          return (
            <div class="label-wrapper">
              {
                labels.filter(u => u.value).map(u => {
                  return (
                    <m-tag color={ u.color }>
                      <div class="label" title={ u.value }>{ u.value }</div>
                    </m-tag>
                  )
                })
              }
            </div>
          )
        } else {
          return EMPTY_VALUE
        }
      },
      'more-popover': text => {
        if (text?.length > 0) {
          return (
            <div class={['more-popover']}>
              <span>{ text[0] }</span>
              {
                text.length > 1
                  ? <a-popover placement="bottomRight" overlayClassName="more-popover-overlay" scopedSlots={{
                    title: props => null,
                    content: props => {
                      return (
                        text.map(u => <div>{ u }</div>)
                      )
                    }
                  }}>
                    <span class="more-popover-icon">
                      <a-icon type="down" onClick={ event => event.stopPropagation() } />
                    </span>
                  </a-popover>
                  : ''
              }
            </div>
          )
        } else {
          return EMPTY_VALUE
        }
      },
      'more-split-comma': text => {
        if (text?.length > 0) {
          const textStr = text.join('，')
          return (
            <div title={ textStr }>{ textStr }</div>
          )
        } else {
          return EMPTY_VALUE
        }
      }
    }, this.$scopedSlots)
    return (
      <div class={['description-list', this.overlayClassName, this.size, this.layout]}>
        { this.renderTitle() }
        { this.renderItems() }
      </div>
    )
  }
}
