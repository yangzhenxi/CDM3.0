import { columnsBuild, deepGet, isFunction, isString } from '@/utils/util'
import './index.less'

export default {
  name: 'List',
  props: {
    groups: {
      type: Array,
      required: true
    },
    columns: {
      type: Array,
      required: true
    },
    data: {
      type: Array,
      required: true
    },
    showPagination: {
      type: Boolean,
      default: true
    },
    row: {
      type: Function,
      default () {
        return () => {}
      }
    }
  },
  data () {
    return {
      filterData: [],
      pageSize: 5,
      pageSizeOptions: ['5', '10', '15', '20'],
      current: 1,
      total: 0
    }
  },
  created () {
    this.total = this.data.length
    this.onPageChange(this.current, this.pageSize)
  },
  methods: {
    setGroupClass (key) {
      switch (key) {
      case 'primaryPod':
        return {
          group: true,
          primaryPod: true
        }
      case 'status':
        return {
          status: true
        }
      case 'standbyPod':
        return {
          group: true,
          standbyPod: true
        }
      }
    },
    onPageChange (page, pageSize) {
      this.filterData = this.data.filter((u, index) => index >= (page - 1) * pageSize && index < page * pageSize)
    },
    onShowSizeChange (current, pageSize) {
      this.filterData = this.data.filter((u, index) => index >= (current - 1) * pageSize && index < current * pageSize)
    },
    columnsBuild,
    deepGet,
    renderHeader () {
      return (
        <a-row
          type="flex"
          justify="space-between"
          align="middle"
          class="table-header-group">
          {
            this.groups.map(group => {
              const columns = columnsBuild(this.columns, group.key)
              return (
                <a-col span={ group.span } class="group">
                  <a-row type="flex" justify="space-between" align="middle">
                    {
                      columns.map(column => {
                        return (
                          <a-col span={ column.span } class="header-group-item">
                            <div class="title" title={ column.title }>
                              { column.title }
                            </div>
                          </a-col>
                        )
                      })
                    }
                  </a-row>
                </a-col>
              )
            })
          }
        </a-row>
      )
    },
    renderContent () {
      return (
        <div class="table-content">
          {
            this.filterData.map((u, index) => {
              return (
                <div { ...this.row(u, index) }>
                  <a-row
                    type="flex"
                    justify="space-between"
                    align="middle"
                    class="table-content-record"
                  >
                    {
                      this.groups.map(group => {
                        const columns = columnsBuild(this.columns, group.key)
                        return (
                          <a-col span={ group.span } class={ this.setGroupClass(group.key) }>
                            <a-row type="flex" justify="space-between" align="middle">
                              {
                                columns.map(column => {
                                  const value = deepGet(u, [group.key, column.key])
                                  let valueRender = () => value
                                  const valueSlotRender = deepGet(column, 'valueScopedSlots.customRender')
                                  if (valueSlotRender) {
                                    valueRender = (isFunction(valueSlotRender) ? valueSlotRender : this.$scopedSlots[valueSlotRender]) || valueRender
                                  }
                                  return (
                                    <a-col span={ column.span } class="header-group-item">
                                      {
                                        column.key === 'status'
                                          ? <div class="status">
                                            <div class="link">
                                              { this.$scopedSlots.status(value, u, index) }
                                            </div>
                                            <div class="list-inline-operator">
                                              { this.$scopedSlots.operator(value, u, index) }
                                            </div>
                                          </div>
                                          : <div class="value" title={ isString(value) ? value : '' }>
                                            { valueRender(value, u, index) }
                                          </div>
                                      }
                                    </a-col>
                                  )
                                })
                              }
                            </a-row>
                          </a-col>
                        )
                      })
                    }
                  </a-row>
                </div>
              )
            })
          }
        </div>

      )
    },
    renderPagination () {
      return (
        this.data.length
          ? <a-row type="flex" justify="end" style="margin: 40px 0 16px 0;">
            <a-pagination
              v-model={ this.current }
              total={ this.total }
              defaultPageSize={ 5 }
              pageSizeOptions={ this.pageSizeOptions }
              showTotal={ total => `共 ${total} 条数据` }
              showSizeChanger
              { ... { on: {
                change: this.onPageChange,
                showSizeChange: this.onShowSizeChange
              } } }
            />
          </a-row>
          : ''
      )
    }
  },
  render () {
    this.$scopedSlots = Object.assign({}, {
      array: text => <div title={ text }>
        {
          text.map(u => {
            return <div class="value">
              { u }
            </div>
          })
        }
      </div>
    }, this.$scopedSlots)
    return (
      <div ref="table" class="table-wrapper">
        <div style="overflow-x: scroll">
          { this.renderHeader() }
          { this.renderContent() }
        </div>
        { this.renderPagination() }
      </div>
    )
  }
}
