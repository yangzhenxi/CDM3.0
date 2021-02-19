export default {
  name: 'MButton',
  render () {
    const PresetColorTypes = ['primary', 'dashed', 'danger', 'link']
    // 在index.less 添加对应的颜色 class
    return (
      <a-button
        class={[PresetColorTypes.indexOf(this.$attrs.type) === -1 ? `btn-${this.$attrs.type}-inverse` : '']}
        { ...{ props: this.$attrs, on: this.$listeners } } >
        { this.$slots.default }
      </a-button>
    )
  }
}
