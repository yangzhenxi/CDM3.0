import { EMPTY_VALUE } from '@/config/constant.config'

export default {
  name: 'MTag',
  render () {
    const PresetColorTypes = ['pink', 'red', 'yellow', 'orange', 'cyan', 'green', 'blue', 'purple', 'geekblue', 'magenta', 'volcano', 'gold', 'lime']
    // 在index.less 添加对应的颜色 class
    return (
      PresetColorTypes.includes(this.$attrs.color)
        ? <a-tag
          { ...{ props: this.$attrs, on: this.$listeners } } >
          { this.$slots.default }
        </a-tag>
        : <span>{ EMPTY_VALUE }</span>
    )
  }
}
