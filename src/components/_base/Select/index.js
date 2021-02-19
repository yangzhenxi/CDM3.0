import EmptyStateItem from '../../EmptyProvider/Item/State'

export default {
  name: 'MSelect',
  model: {
    prop: 'value',
    event: 'change'
  },
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
    return (
      <a-config-provider>
        <template slot={ 'renderEmpty' }>
          <empty-state-item { ...{ props: this.emptyItemProps } }/>
        </template>
        <a-select { ...{ props: { ...this.$vnode.data.props, ...this.$attrs }, on: this.$listeners } } >
          { this.$slots.default }
        </a-select>
      </a-config-provider>
    )
  }
}
