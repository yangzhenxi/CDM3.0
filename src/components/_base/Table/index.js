import { EMPTY_VALUE } from '@/config/constant.config'
import { isEmpty } from '@/utils/util'
import EmptyStateItem from '../../EmptyProvider/Item/State'

export default {
  name: 'MTable',
  components: {
    EmptyStateItem
  },
  props: {
    emptyItemProps: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  render () {
    const transformCellText = ({ text, column, record, index }) => {
      // 展开行不需要设置
      if (column?.key === 'expand-icon-placeholder') {
        return text
      }
      return isEmpty(text) ? EMPTY_VALUE : text
    }
    return (
      <a-config-provider transformCellText={ transformCellText }>
        <template slot={ 'renderEmpty' }>
          <empty-state-item { ...{ props: this.emptyItemProps } }/>
        </template>
        <a-table
          { ...{
            props: this.$attrs,
            scopedSlots: { ...this.$scopedSlots },
            on: this.$listeners
          } }
        >
          { Object.keys(this.$slots).map(name => (<template slot={ name }>{ this.$slots[name] }</template>)) }
        </a-table>
      </a-config-provider>
    )
  }
}
