import { convert, deepGet, isFunction } from '@/utils/util'
import './index.less'

export default {
  name: 'Conf',
  props: {
    columns: {
      type: Array,
      required: true
    },
    data: {
      type: Array,
      default () {
        return []
      }
    }
  },
  methods: {
    renderTitle () {
      return (
        <a-row class="conf-header">
          {
            this.columns.map(column => {
              return (
                <a-col { ...{ props: column?.props } }>
                  <b>{ column.title }</b>
                </a-col>
              )
            })
          }
        </a-row>
      )
    },
    renderItems () {
      return (
        this.data.map((item, index) => {
          return (
            <a-row class="conf-item">
              {this.renderItem(item, index) }
            </a-row>
          )
        })
      )
    },
    renderItem (item, index) {
      return (
        this.columns.map(column => {
          let valueRender = null
          const valueSlotRender = deepGet(column, 'valueScopedSlots.customRender')
          if (valueSlotRender) {
            valueRender = (isFunction(valueSlotRender) ? valueSlotRender : this.$scopedSlots[valueSlotRender])
          }
          const value = convert(item[column.key], item.filter || item.enum, item.config)
          return (
            <a-col { ...{ props: column?.props } }>
              <div title={ value }>
                {
                  valueRender
                    ? valueRender(item[column.key], item, index)
                    : value
                }
              </div>
            </a-col>
          )
        })
      )
    }
  },
  render () {
    this.$scopedSlots = Object.assign({}, {

    }, this.$scopedSlots)
    return (
      <div class='conf-list'>
        { this.renderTitle() }
        { this.renderItems() }
      </div>
    )
  }
}
