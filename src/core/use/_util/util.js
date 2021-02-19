/**
 * 国际化 placeholder
 * // XXX: 在这里国际化 $t 在某些情况下显示错乱（还是未转换前的文本）
 * @param {*} component
 */
export const transformComponentPlaceHolder = component => {
  const placeholder = component?.props?.placeholder
  const name = component.name
  let _
  if (placeholder) {
    _ = placeholder
  } else {
    if (name === 'a-input') {
      _ = 'layouts.table.search.form.input.placeholder'
    } else if (name === 'm-select') {
      _ = 'layouts.table.search.form.select.placeholder'
    }
  }
  return _
}
