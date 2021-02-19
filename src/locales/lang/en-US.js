import antdEnUS from 'ant-design-vue/es/locale-provider/en_US'
import momentEU from 'moment/locale/eu'

const components = {
  antLocale: antdEnUS,
  momentName: 'eu',
  momentLocale: momentEU
}

const locale = {

  'layouts.fetch.error': 'interface error',

  'layouts.multiTab.operator.refresh': 'refresh',
  'layouts.multiTab.operator.close': 'close',
  'layouts.multiTab.operator.closeLeft': 'closeLeft',
  'layouts.multiTab.operator.closeRight': 'closeRight',
  'layouts.multiTab.operator.closeAll': 'closeAll',
  'layouts.multiTab.operator.affix': 'affix',
  'layouts.multiTab.operator.unAffix': 'unAffix',

  'layouts.table.search.form.input.placeholder': 'Please enter',
  'layouts.table.search.form.select.placeholder': 'Please Select',
  'layouts.table.search.query': 'query',
  'layouts.table.search.reset': 'reset',
  'layouts.table.search.advancedOn': 'collapse',
  'layouts.table.search.advancedOff': 'expand',

  'layouts.table.operator.query': 'query',
  'layouts.table.operator.new': 'new',
  'layouts.table.operator.add': 'add',
  'layouts.table.operator.update': 'update',
  'layouts.table.operator.delete': 'delete',
  'layouts.table.operator.batDelete': 'batDelete',
  'layouts.table.operator.allocateUsers': 'allocate',
  'layouts.table.operator.bindTag': 'bind tag',

  'layouts.step.operator.back': 'back',
  'layouts.step.operator.prev': 'prev',
  'layouts.step.operator.next': 'next',
  'layouts.step.operator.new': 'new',
  'layouts.step.operator.add': 'add',
  'layouts.step.operator.create': 'create',
  'layouts.step.operator.update': 'update',
  'layouts.step.operator.redo': 'redo',
  'layouts.step.operator.finish': 'finish',

  'layouts.userMenu.logout.modal.title': 'logout',
  'layouts.userMenu.logout.modal.content': 'Do you really want to log out ?',

  'layouts.modal.submit': 'submit',
  'layouts.modal.cancel': 'cancel',
  'layouts.modal.close': 'close',

  'layouts.form.submit': 'submit',
  'layouts.form.return': 'return',

  'layouts.empty.error-tooltip.title': 'interface error',
  'layouts.empty.error-popover.title': 'interface error',
  'layouts.empty.error-popover.content': 'no error data returned',
  'layouts.empty.error-modal.title': 'interface error',
  'layouts.empty.error-modal.content': 'no error data returned',

  'layouts.empty.empty-state.data': 'no data',
  'layouts.empty.error-state.data': 'interface error',
  'layouts.empty.prompt-state.data': 'prompting message'
}

export default {
  ...components,
  ...locale
}
