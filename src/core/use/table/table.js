/* eslint-disable no-const-assign */
import { toRefs, reactive, onMounted } from '@vue/composition-api'
import { deepGet, isPromise, queryBuild, throttle } from '@/utils/util'
import { merge } from 'lodash'

function useTable (props, context, options = {}) {
  const {
    loading = false,
    queryParams = {},
    dataSource = [],
    rowSelection = undefined,
    pagination = {
      current: 1,
      pageSize: 10,
      total: 0,
      pageSizeOptions: ['10', '20', '30', '40'],
      showSizeChanger: true,
      showTotal: true
    }
  } = props
  const { fetchData = () => {}, showPagination = true, showRowSelection = false } = options
  if (showRowSelection) {
    rowSelection = {
      selectedRowKeys: [],
      selectedRows: [],
      onChange: (selectedRowKeys, selectedRows) => {
        state.rowSelection.selectedRowKeys = selectedRowKeys
        state.rowSelection.selectedRows = selectedRows
      }
    }
  }
  const state = reactive({
    loading,
    showLoading: false,
    dataSource,
    rowSelection: showRowSelection ? rowSelection : undefined,
    pagination: showPagination && pagination
  })

  const loadData = async (pagination, filters, sorter) => {
    state.loading = state.showLoading
    const params = {
      pageNo: pagination?.current || state?.pagination.current,
      pageSize: pagination?.pageSize || state?.pagination.pageSize,
      sortField: sorter?.field,
      sortOrder: sorter?.order,
      ...filters,
      ...queryBuild(queryParams)
    }
    console.log(params)
    const _fetchData = fetchData(params)
    if (isPromise(_fetchData)) {
      const res = deepGet(await _fetchData, [], {})
      state.dataSource = res.data
      state.pagination = showPagination && {
        ...pagination,
        current: res.pageNo,
        pageSize: res.pageSize,
        total: res.data.length,
        showTotal: total => `共 ${total} 条数据`
      }
    }
    state.loading = false
  }

  onMounted(() => {
    clearSelected()
    loadData()
  })

  const setData = (data) => {
    state.dataSource = data
  }

  const clearSelected = () => {
    if (rowSelection) {
      rowSelection.onChange([], [])
    }
  }

  const refresh = throttle((showLoading) => {
    state.showLoading = showLoading
    clearSelected()
    loadData()
  })

  return {
    ...toRefs(state),
    loadData,
    setData,
    refresh
  }
}

function useTableProps (props, context, options = {}) {
  const rowKey = 'id'
  const rowSelection = props.rowSelection && merge({
    selectedRowKeys: [],
    selectedRows: [],
    type: 'checkbox',
    onChange: (selectedRowKeys, selectedRows) => {
      state.rowSelection.selectedRowKeys = selectedRowKeys
      state.rowSelection.selectedRows = selectedRows
    }
  }, props.rowSelection)
  const rowClassName = props.rowClassName || ((record, index) => index % 2 !== 0 ? 'table-row-odd' : '')
  const scroll = Object.assign({
    // Ant Design 1.6.5 已修改，但是实际还有这种情况
    // Ant Design 1.7.0 固定列 ellipsis，超出省略，但是实际宽度会无限拉伸
    // 2020-11-05
    // BUG: 当屏幕足够大已致表格列宽度超出预设的宽度时(表格整体宽度放大)，列文本可能会从换行变为不换行，而固定列表格的列高度还是原来的，其他列的高度随屏幕的拉伸而变化，从而产生了高度不统一的现象
    x: props.columns.reduce((pre, cur) => pre + (deepGet(cur, 'width', 0) || deepGet(cur, 'presetWidth', 0)), 0),
    y: 450
  }, props.scroll)
  const customRow = context.attrs.rowClick && ((record, index) => ({
    on: {
      click: () => {
        const { selectedRowKeys, selectedRows, type } = state.rowSelection
        const index = selectedRowKeys.findIndex(u => u === record?.id)
        if (!record?.disabled) {
          if (type === 'radio') {
            if (index !== -1) {
              selectedRowKeys.splice(index, 1)
              selectedRows.splice(index, 1)
            } else {
              selectedRowKeys.splice(index, 1, record?.id)
              selectedRows.splice(index, 1, record)
            }
          } else {
            if (index !== -1) {
              selectedRowKeys.splice(index, 1)
              selectedRows.splice(index, 1)
            } else {
              selectedRowKeys.push(record?.id)
              selectedRows.push(record)
            }
          }
        }
      }
    }
  }))
  const state = reactive({
    rowKey,
    rowSelection,
    rowClassName,
    scroll,
    customRow
  })

  return {
    ...toRefs(state)
  }
}

function useTableContext (options = {}) {
  const rowKey = options.rowKey || 'id'
  const rowSelection = options.rowSelection && merge({
    selectedRowKeys: [],
    selectedRows: [],
    type: 'checkbox',
    onChange: (selectedRowKeys, selectedRows) => {
      state.rowSelection.selectedRowKeys = selectedRowKeys
      state.rowSelection.selectedRows = selectedRows
    }
  }, options.rowSelection)
  const rowClassName = options.rowClassName || ((record, index) => index % 2 !== 0 ? 'table-row-odd' : '')
  options.columns = options.columns || []
  const scroll = Object.assign({
    // Ant Design 1.6.5 已修改，但是实际还有这种情况
    // Ant Design 1.7.0 固定列 ellipsis，超出省略，但是实际宽度会无限拉伸
    // 2020-11-05
    // BUG: 当屏幕足够大已致表格列宽度超出预设的宽度时(表格整体宽度放大)，列文本可能会从换行变为不换行，而固定列表格的列高度还是原来的，其他列的高度随屏幕的拉伸而变化，从而产生了高度不统一的现象
    x: options.columns.reduce((pre, cur) => pre + (deepGet(cur, 'width', 0) || deepGet(cur, 'presetWidth', 0)), 0),
    y: 450
  }, options.scroll)
  const customRow = options.rowClick && ((record, index) => ({
    on: {
      click: () => {
        const { selectedRowKeys, selectedRows, type } = state.rowSelection
        const index = selectedRowKeys.findIndex(u => u === record?.id)
        if (!record?.disabled) {
          if (type === 'radio') {
            if (index !== -1) {
              selectedRowKeys.splice(index, 1)
              selectedRows.splice(index, 1)
            } else {
              selectedRowKeys.splice(index, 1, record?.id)
              selectedRows.splice(index, 1, record)
            }
          } else {
            if (index !== -1) {
              selectedRowKeys.splice(index, 1)
              selectedRows.splice(index, 1)
            } else {
              selectedRowKeys.push(record?.id)
              selectedRows.push(record)
            }
          }
        }
      }
    }
  }))
  const state = reactive({
    rowKey,
    rowSelection,
    rowClassName,
    scroll,
    customRow
  })

  return {
    ...toRefs(state)
  }
}

export { useTable, useTableProps, useTableContext }
