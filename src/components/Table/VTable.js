import T from 'ant-design-vue/es/table/Table'
import { cloneDeep, merge } from 'lodash'
import { EmptyStateItem } from '@/components'
import { EMPTY_VALUE } from '@/config/constant.config'
import { useTableProps } from '@/core/use'
import { convert, deepGet, isEmpty, isArray, isPromise, throttle, uniq } from '@/utils/util'

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
      localFirstDataSource: [],
      showLoading: true,
      localDataSource: [],
      localPagination: false,
      localParams: {
        pagination: {
          current: 1,
          pageSize: 10
        },
        sorter: {
          field: '',
          order: null
        },
        queryParams: {}
      },
      defaultSorter: {
        field: '',
        order: null
      },
      sorter: {
        field: '',
        order: null
      }
    }
  },
  created () {
    if (this.showPagination) {
      this.localPagination = Object.assign({}, this.localPagination, {
        current: this.pageNum,
        pageSize: this.pageSize,
        pageSizeOptions: ['10', '20', '30', '40'],
        showSizeChanger: this.showSizeChanger,
        showTotal: true
      })
      this.localParams = {
        pagination: {
          current: this.pageNum,
          pageSize: this.pageSize
        }
      }
    }
    this.showLoading = true
    this.clearSelected()
    this.autoLoad && this.loadData()
  },
  methods: {
    refresh: throttle(function (bool = true) {
      if (this.showPagination) {
        this.localPagination = Object.assign({}, this.localPagination, {
          current: 1,
          pageSize: this.localPagination.pageSize || this.pageSize
        })
        this.localParams = merge(this.localParams, {
          pagination: {
            current: 1,
            pageSize: this.localParams.pagination.pageSize || this.pageSize
          }
        })
      }
      this.showLoading = bool
      this.clearSelected()
      this.loadData()
    }),
    async loadData () {
      this.localLoading = this.showLoading
      const fetchData = this.fetchData({})
      if (isPromise(fetchData)) {
        const { pageNo = this.pageNum, pageSize = this.pageSize, data = [], queryParams, sorter } = await fetchData
        // NOTE: 在某些情况下， columns 在 请求时确定
        this.localScroll.x = this.columns.reduce((pre, cur) => pre + (deepGet(cur, 'width', 0) || deepGet(cur, 'presetWidth', 0)), 0)
        if (this.showPagination) {
          this.localPagination = Object.assign({}, this.localPagination, {
            current: pageNo,
            pageSize,
            total: data.length,
            showTotal: total => `共 ${total} 条数据`
          })
          this.defaultSorter = sorter
        }
        this.localParams = Object.assign({}, this.localParams, {
          queryParams,
          sorter
        })
        this.localFirstDataSource = data // 总数据
        this.localDataSource = this.calculate(this.localParams)
      }
      this.localLoading = false
    },
    changeData (pagination, filters, sorter) {
      this.localLoading = this.showLoading
      // 列的 sortOrder 显示处理
      if (sorter.order) {
        // 重置前一次排序的 sortOrder
        if (this.sorter.field && this.sorter.field !== sorter.columnKey) {
          this.columns.find(c => c.dataIndex === this.sorter.field).sortOrder = false
        }
        this.columns.find(c => c.dataIndex === sorter.columnKey).sortOrder = sorter.order
        this.sorter = {
          field: sorter.columnKey,
          order: sorter.order
        }
      } else {
        // 重置前一次排序的 sortOrder
        if (this.sorter.field) {
          this.columns.find(c => c.dataIndex === this.sorter.field).sortOrder = false
        }
        this.sorter = {}
      }
      if (this.showPagination) {
        this.localPagination = Object.assign({}, this.localPagination, {
          current: pagination?.current,
          pageSize: pagination?.pageSize
        })
        this.localParams = Object.assign({}, this.localParams, { pagination })
      }
      this.localParams = Object.assign({}, this.localParams, {
        sorter: {
          ...this.defaultSorter,
          ...this.sorter
        },
        ...filters
      })
      this.localDataSource = this.calculate(this.localParams)
      this.localLoading = false
    },
    calculate (localParams) {
      const { pagination, sorter, queryParams } = localParams
      let data = cloneDeep(this.localFirstDataSource)
      // 查询
      if (!isEmpty(queryParams)) {
        data = data.filter(u => Object.keys(queryParams).every(i => {
          const value = deepGet(u, i)
          if (isArray(value)) {
            return value.some(o => `${o}`.indexOf(queryParams[i]) !== -1)
          } else {
            return `${value}`.indexOf(queryParams[i]) !== -1
          }
        }))
        this.localPagination = this.showPagination && Object.assign({}, this.localPagination, {
          total: data.length
        }) || false
      }
      // 排序
      if (!isEmpty(sorter)) {
        data = data.sort((e1, e2) => {
          const s1 = deepGet(e1, sorter.field)
          const s2 = deepGet(e2, sorter.field)
          if (sorter.order === 'ascend') {
            if (s1 > s2 || (s1 && !s2)) {
              return 1
            } else if (s1 < s2 || (!s1 && s2)) {
              return -1
            }
          } else {
            if (s1 < s2 || (!s1 && s2)) {
              return 1
            } else if (s1 > s2 || (s1 && !s2)) {
              return -1
            }
          }
        })
      }
      // 分页
      if (!isEmpty(pagination)) {
        const { current, pageSize } = pagination
        if (current && pageSize) {
          data = data.filter((u, index) => index >= (current - 1) * pageSize && index < current * pageSize)
        }
      }
      return data
    }
  },
  render () {
    const props = {}
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
          <a-table {...{ props, scopedSlots: { ...this.$scopedSlots } }} onChange={ this.changeData } onExpand={ (expanded, record) => { this.$emit('expand', expanded, record) } }>
            { Object.keys(this.$slots).map(name => (<template slot={ name }>{ this.$slots[name] }</template>)) }
          </a-table>
        </a-config-provider>
      </div>
    )
  }
}
