import T from 'ant-design-vue/es/table/Table'
import { EmptyStateItem } from '@/components'
import { EMPTY_VALUE } from '@/config/constant.config'
import { useTableProps } from '@/core/use'
import { convert, deepGet, isPromise, throttle, uniq } from '@/utils/util'

export default {
  components: {
    EmptyStateItem
  },
  props: Object.assign({}, T.props, {
    fetchData: {
      type: Function,
      required: true
    },
    pageNum: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: 10
    },
    showSizeChanger: {
      type: Boolean,
      default: true
    },
    showPagination: {
      type: Boolean,
      default: true
    },
    autoLoad: {
      type: Boolean,
      default: true
    },
    emptyItemProps: {
      type: Object,
      default () {
        return {}
      }
    }
  }),
  setup (props, context) {
    const {
      rowKey,
      rowSelection,
      rowClassName,
      customRow,
      scroll
    } = useTableProps(props, context)
    const clearSelected = () => {
      if (rowSelection.value) {
        rowSelection.value.onChange([], [])
      }
    }
    return {
      localRowKey: rowKey,
      localRowSelection: rowSelection,
      localRowClassName: rowClassName,
      localCustomRow: customRow,
      localScroll: scroll,
      clearSelected
    }
  },
  data () {
    return {
      localLoading: false,
      showLoading: true,
      localDataSource: [],
      localPagination: false
    }
  },
  created () {
    this.localPagination = this.showPagination && Object.assign({}, this.localPagination, {
      current: this.pageNum,
      pageSize: this.pageSize,
      pageSizeOptions: ['10', '20', '30', '40'],
      showSizeChanger: this.showSizeChanger,
      showTotal: true
    }) || false
    this.showLoading = true
    this.clearSelected()
    this.autoLoad && this.loadData()
  },
  methods: {
    refresh: throttle(function (bool = true) {
      if (bool) {
        this.localPagination = this.showPagination && Object.assign({}, this.localPagination, {
          current: 1,
          pageSize: this.localPagination.pageSize || this.pageSize
        }) || false
      }
      this.showLoading = bool
      this.clearSelected()
      this.loadData()
    }),
    async loadData (pagination, filters, sorter) {
      this.localLoading = this.showLoading
      const params = {
        pn: pagination?.current || this.showPagination && this.localPagination.current || this.pageNum,
        ps: pagination?.pageSize || this.showPagination && this.localPagination.pageSize || this.pageSize
      }
      const fetchData = this.fetchData(params)
      if (isPromise(fetchData)) {
        const { data = [], total } = await fetchData
        // NOTE: 在某些情况下， columns 在 请求时确定
        this.localScroll.x = this.columns.reduce((pre, cur) => pre + (deepGet(cur, 'width', 0) || deepGet(cur, 'presetWidth', 0)), 0)
        this.localPagination = this.showPagination && Object.assign({}, this.localPagination, {
          current: params.pn,
          pageSize: params.ps,
          total: +total,
          showTotal: total => `共 ${total} 条数据`
        }) || false
        this.localDataSource = data
      }
      this.localLoading = false
    }
  },
  render () {
    const props = {}
    // BUG: 编译后 $data 里的数据没了 orz，ref 类型 VueComponent -> a ?
    const localKeys = uniq([
      ...Object.keys(this.$data),
      'localRowKey',
      'localRowSelection',
      'localRowClassName',
      'localCustomRow',
      'localScroll'
    ])
    Object.keys(T.props).forEach(k => {
      const localKey = `local${k.substring(0, 1).toUpperCase()}${k.substring(1)}`
      if (localKeys.includes(localKey)) {
        props[k] = this[localKey]
        return props[k]
      }
      this[k] && (props[k] = this[k])
      return props[k]
    })
    this.$scopedSlots = Object.assign({}, {
      unixToDate: text => convert(text, 'unixToDate'),
      unitSize: text => convert(text, 'unitSize'),
      ellipsis: text => (
        <a-tooltip placement="topLeft" title={ text }>
          {text}
        </a-tooltip>
      ),
      name: text => <span class="hover-default" title={ text } >{ text }</span>,
      'more-popover': text => {
        if (text?.length > 0) {
          return (
            <div class={['flex-row-default', 'more-popover']}>
              <div>{ text[0] }</div>
              {
                text.length > 1
                  ? <a-popover placement="bottomRight" overlayClassName="more-popover-overlay" getPopupContainer={ trigger => trigger.parentNode } scopedSlots={{
                    title: props => null,
                    content: props => {
                      return (
                        text.map(u => <div>{ u }</div>)
                      )
                    }
                  }}>
                    <div class="more-popover-icon">
                      <a-icon type="down" onClick={ event => event.stopPropagation() } />
                    </div>
                  </a-popover>
                  : ''
              }
            </div>
          )
        } else {
          return EMPTY_VALUE
        }
      }
    }, this.$scopedSlots)
    const empty = this.$slots.emptyData
      ? (
        <div slot={ 'emptyData' }>
          { this.$slots.emptyData }
        </div>
      ) : ''
    return (
      <div class="table-wrapper">
        <a-config-provider>
          {
            <template slot={ 'renderEmpty' }>
              <empty-state-item { ...{ props: this.emptyItemProps } }>
                { empty }
              </empty-state-item>
            </template>
          }
          <a-table {...{ props, scopedSlots: { ...this.$scopedSlots } }} onChange={ this.loadData } onExpand={ (expanded, record) => { this.$emit('expand', expanded, record) } }>
            { Object.keys(this.$slots).map(name => (<template slot={ name }>{ this.$slots[name] }</template>)) }
          </a-table>
        </a-config-provider>
      </div>
    )
  }
}
