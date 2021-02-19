import antd from 'ant-design-vue/es/locale-provider/zh_CN'
import momentCN from 'moment/locale/zh-cn'

const components = {
  antLocale: antd,
  momentName: 'zh-cn',
  momentLocale: momentCN
}

const locale = {

  'layouts.fetch.error': '接口错误',

  'layouts.multiTab.operator.refresh': '刷新',
  'layouts.multiTab.operator.close': '关闭',
  'layouts.multiTab.operator.closeLeft': '关闭左侧',
  'layouts.multiTab.operator.closeRight': '关闭右侧',
  'layouts.multiTab.operator.closeAll': '关闭全部',
  'layouts.multiTab.operator.affix': '固定',
  'layouts.multiTab.operator.unAffix': '取消固定',

  'layouts.table.search.form.input.placeholder': '请输入',
  'layouts.table.search.form.select.placeholder': '请选择',
  'layouts.table.search.query': '查询',
  'layouts.table.search.reset': '重置',
  'layouts.table.search.advancedOn': '收起',
  'layouts.table.search.advancedOff': '展开',

  'layouts.table.operator.query': '查询',
  'layouts.table.operator.new': '新建',
  'layouts.table.operator.add': '添加',
  'layouts.table.operator.update': '修改',
  'layouts.table.operator.delete': '删除',
  'layouts.table.operator.batDelete': '批量删除',
  'layouts.table.operator.allocateUsers': '分配',
  'layouts.table.operator.bindTag': '绑定标签',

  'layouts.step.operator.back': '返回',
  'layouts.step.operator.prev': '上一步',
  'layouts.step.operator.next': '下一步',
  'layouts.step.operator.new': '新建',
  'layouts.step.operator.add': '添加',
  'layouts.step.operator.create': '创建',
  'layouts.step.operator.update': '修改',
  'layouts.step.operator.redo': '再次操作',
  'layouts.step.operator.finish': '完成',

  'layouts.userMenu.logout.modal.title': '登出提示',
  'layouts.userMenu.logout.modal.content': '真的要注销登录吗 ?',

  'layouts.modal.submit': '确认',
  'layouts.modal.cancel': '取消',
  'layouts.modal.close': '关闭',

  'layouts.form.submit': '确认',
  'layouts.form.return': '取消',

  'layouts.empty.error-tooltip.title': '接口错误',
  'layouts.empty.error-popover.title': '接口错误',
  'layouts.empty.error-popover.content': '暂无错误数据返回',
  'layouts.empty.error-modal.title': '接口错误',
  'layouts.empty.error-modal.content': '暂无错误数据返回',

  'layouts.empty.empty-state.data': '暂无数据',
  'layouts.empty.error-state.data': '接口错误',
  'layouts.empty.prompt-state.data': '提示信息'
}

export default {
  ...components,
  ...locale
}
