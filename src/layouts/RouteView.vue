<script>
export default {
  name: 'RouteView',
  props: {
    keepAlive: {
      type: Boolean,
      default: true
    }
  },
  render () {
    const { $route: { meta, fullPath }, $store: { state, getters } } = this
    const { multiTabActive = [] } = state.app
    const key = this.$route.params.t ? `${fullPath}&t=${this.$route.params.t}` : fullPath
    const inKeep = (
      <keep-alive include={ multiTabActive }>
        <router-view key={ key }/>
      </keep-alive>
    )
    const notKeep = (
      <router-view />
    )
    // 这里增加了 multiTab 的判断，当开启了 multiTab 时
    // 应当全部组件皆缓存，否则会导致切换页面后页面还原成原始状态
    // 若确实不需要，可改为 return meta.keepAlive ? inKeep : notKeep
    if (!getters.multiTab && !meta.keepAlive) {
      return notKeep
    }
    return this.keepAlive || getters.multiTab || meta.keepAlive ? inKeep : notKeep
  }
}
</script>
