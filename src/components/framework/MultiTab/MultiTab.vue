<script>
import Sortable from 'sortablejs'
import { mapState, mapMutations } from 'vuex'
import events from './events'
import { TOGGLE_MULTI_TAB_VISITED, TOGGLE_MULTI_TAB_ACTIVE } from '@/store/mutation-types'
import { triggerWindowResizeEvent, uniq } from '@/utils/util'
import './index.less'

// NOTE MultiTab
/**
 * 路由缓存
 * 参考自 element ui， 使用 include（组件名）
 * 注意事项：
 *   1、vuex 维护2个数据组 visited[已访问的路由], active[已访问的路由名]
 *      tab 维护 pages[已访问的路由]，fullPathList[路径组，作为比较的 key]
 *   2、路由的name必须和组件的名称相同
 *   3、嵌套路由，同上，且必须存入 keep-alive 下的所有组件 name
 *   4、由于 include name 限制， 刷新操作实际为替换 route key，缓存不会消失
 */

export default {
  name: 'MultiTab',
  data () {
    return {
      fullPathList: [],
      pages: [],
      activeKey: '',
      newTabIndex: 0,
      affixTabs: [],
      sortable: null
    }
  },
  computed: {
    ...mapState({
      multiTabVisited: (state) => state.app.multiTabVisited,
      multiTabActive: (state) => state.app.multiTabActive
    })
  },
  created () {
    // bind event
    events.$on('open', value => {
      if (!value) {
        throw new Error(`multi-tab: open tab ${value} err`)
      }
      this.activeKey = value
    }).$on('close', (value, config) => {
      if (!value) {
        this.close(this.activeKey, config)
        return
      }
      this.close(value, config)
    }).$on('rename', ({ key, name }) => {
      try {
        const item = this.pages.find(item => item.path === key)
        item.meta.customTitle = name
        this.$forceUpdate()
      } catch (error) {}
    })
    if (this.multiTabVisited.findIndex(tab => tab.name === this.$route.name) === -1) {
      this.setTabVisited([...this.multiTabVisited, this.$route])
    }
    if (this.multiTabActive.findIndex(tab => tab === this.$route.name) === -1) {
      this.setTabActive(uniq([...this.multiTabActive, ...this.getAllTabActive(this.$route)]))
    }
    this.pages = this.multiTabVisited
    this.fullPathList = this.pages.map(tab => tab.fullPath)
    this.activeKey = this.$route.fullPath
  },
  mounted () {
    this.setSort()
  },
  watch: {
    '$route': function (newVal) {
      this.activeKey = newVal.fullPath
      const index = this.fullPathList.indexOf(newVal.fullPath)
      if (newVal.name) {
        if (index === -1) {
          this.pages.push(newVal)
          this.fullPathList.push(newVal.fullPath)
        } else {
          // XXX: 刷新时fullPath相同，但是需要记录 t， params: { t }
          this.pages.splice(index, 1, newVal)
        }
        this.setTabVisited(this.pages)
        this.setTabActive(uniq(this.pages.map(page => this.getAllTabActive(page)).flat()))
      }
      triggerWindowResizeEvent()
    },
    activeKey: function (newPathKey) {
      const route = this.pages.find(u => u.fullPath === newPathKey)
      if (route?.name) {
        this.$router.push({ name: route.name, params: route?.params, query: route?.query })
      } else {
        this.$router.push({ path: newPathKey })
      }
    }
  },
  methods: {
    ...mapMutations({
      setTabVisited: TOGGLE_MULTI_TAB_VISITED,
      setTabActive: TOGGLE_MULTI_TAB_ACTIVE
    }),
    onEdit (targetKey, action) {
      this[action](targetKey)
    },
    remove (targetKey) {
      this.affixTabs = this.affixTabs.filter(tab => tab !== targetKey)
      this.pages = this.pages.filter(page => page.fullPath !== targetKey)
      this.fullPathList = this.pages.map(tab => tab.fullPath)
      this.setTabVisited(this.pages)
      this.setTabActive(uniq(this.pages.map(page => this.getAllTabActive(page)).flat()))
      // 判断当前标签是否关闭，若关闭则跳转到最后一个还存在的标签页
      if (!this.fullPathList.includes(this.activeKey)) {
        this.selectedLastPath()
      }
    },
    selectedLastPath () {
      if (this.fullPathList.length > 0) {
        this.activeKey = this.fullPathList[this.fullPathList.length - 1]
      }
    },
    getAllTabActive (route) {
      // 在嵌套路由时，需要获取所有 route-view 下的 name
      const routeViewIndex = route.matched.findIndex(u => u.components.default.name === 'RouteView')
      const routes = route.matched.slice(routeViewIndex + 1, route.matched.length)
      const res = routes.filter(u => this.multiTabVisited.indexOf(u.name) === -1).map(u => u.name)
      return res
    },
    refresh (e) {
      this.setTabActive(uniq(this.pages.filter(page => page.fullPath !== e).map(page => this.getAllTabActive(page)).flat()))
      this.$nextTick(() => {
        this.$router.replace({
          // 重定向使用 name + params
          path: '/redirect' + e, query: this.pages.find(page => page.fullPath === e)
        })
      })
    },
    close (e, config = { force: false }) {
      // 判断是否为最后一个标签页，如果是最后一个，则无法被关闭
      if (config.force || this.fullPathList.length > 1) {
        this.remove(e)
      } else {
        this.$message.info('这是最后一个标签了, 无法被关闭')
      }
    },
    closeLeft (e) {
      const currentIndex = this.fullPathList.indexOf(e)
      if (currentIndex > 0) {
        this.fullPathList.forEach((item, index) => {
          if (index < currentIndex && this.affixTabs.indexOf(item) === -1) {
            this.remove(item)
          }
        })
      } else {
        this.$message.info('左侧没有标签')
      }
    },
    closeRight (e) {
      const currentIndex = this.fullPathList.indexOf(e)
      if (currentIndex < (this.fullPathList.length - 1)) {
        this.fullPathList.forEach((item, index) => {
          if (index > currentIndex && this.affixTabs.indexOf(item) === -1) {
            this.remove(item)
          }
        })
      } else {
        this.$message.info('右侧没有标签')
      }
    },
    closeAll (e) {
      const currentIndex = this.fullPathList.indexOf(e)
      this.fullPathList.forEach((item, index) => {
        if (index !== currentIndex && this.affixTabs.indexOf(item) === -1) {
          this.remove(item)
        }
      })
    },
    affix (e, index) {
      if (this.affixTabs.indexOf(e) === -1) {
        // 移动tab事件，index > -1 即固定数大于拖拽的新位置，把这个tab固定
        // 更新 pages 操作在移动事件里了
        if (index > -1) {
          this.affixTabs.splice(index, 0, e)
        } else { // 固定事件，index 无
          this.affixTabs.push(e)
          const oldIndex = this.fullPathList.indexOf(e)
          const target = this.pages.splice(oldIndex, 1)[0]
          this.pages.splice(this.affixTabs.length - 1, 0, target)
          this.fullPathList = this.pages.map(tab => tab.fullPath)
          this.setTabVisited(this.pages)
        }
      }
    },
    unAffix (e, index) {
      if (this.affixTabs.indexOf(e) !== -1) {
        // 移动tab事件，index > -1 即固定数小于等于拖拽的新位置，把这个tab解除固定
        // 更新 pages 操作在移动事件里了
        if (index > -1) {
          this.affixTabs.splice(this.affixTabs.indexOf(e), 1)
        } else { // 解除固定事件，index 无
          this.affixTabs.splice(this.affixTabs.indexOf(e), 1)
          const oldIndex = this.fullPathList.indexOf(e)
          const target = this.pages.splice(oldIndex, 1)[0]
          this.pages.splice(this.affixTabs.length, 0, target)
          this.fullPathList = this.pages.map(tab => tab.fullPath)
          this.setTabVisited(this.pages)
        }
      }
    },
    closeMenuClick (key, route) {
      this[key](route)
    },
    setSort () {
      const el = this.$refs.tabs.$el.querySelectorAll('.ant-tabs-nav > div')[0]
      this.sortable = Sortable.create(el, {
        ghostClass: 'sortable-ghost',
        setData: function (dataTransfer) {
          dataTransfer.setData('Text', '')
          // to avoid Firefox bug
          // Detail see : https://github.com/RubaXa/Sortable/issues/1012
        },
        onEnd: evt => {
          const target = this.pages.splice(evt.oldIndex, 1)[0]
          this.pages.splice(evt.newIndex, 0, target)
          this.fullPathList = this.pages.map(tab => tab.fullPath)
          this.setTabVisited(this.pages)
          if (evt.newIndex < this.affixTabs.length) {
            this.affix(target.fullPath, evt.newIndex)
          } else {
            this.unAffix(target.fullPath, evt.newIndex)
          }
        }
      })
    },
    renderTabPaneMenu (e) {
      return (
        <a-menu {...{ on: { click: ({ key, item, domEvent }) => { this.closeMenuClick(key, e) } } }}>
          <a-menu-item key="refresh">{ this.$t('layouts.multiTab.operator.refresh') }</a-menu-item>
          <a-menu-item key="close">{ this.$t('layouts.multiTab.operator.close') }</a-menu-item>
          <a-menu-item key="closeLeft">{ this.$t('layouts.multiTab.operator.closeLeft') }</a-menu-item>
          <a-menu-item key="closeRight">{ this.$t('layouts.multiTab.operator.closeRight') }</a-menu-item>
          <a-menu-item key="closeAll">{ this.$t('layouts.multiTab.operator.closeAll') }</a-menu-item>
          <a-menu-divider />
          {
            this.affixTabs.indexOf(e) === -1
              ? <a-menu-item key="affix">{ this.$t('layouts.multiTab.operator.affix') }</a-menu-item>
              : <a-menu-item key="unAffix">{ this.$t('layouts.multiTab.operator.unAffix') }</a-menu-item>
          }
        </a-menu>
      )
    },
    renderTabPane (title, page, pages) {
      const menu = this.renderTabPaneMenu(page.fullPath)
      const affix = e => {
        e.stopPropagation()
        this.affixTabs.splice(this.affixTabs.indexOf(page.fullPath), 1)
      }
      const close = e => {
        e.stopPropagation()
        this.close(page.fullPath)
      }
      return (
        <a-dropdown overlay={ menu } trigger={['contextmenu']}>
          <span class={'dropdown-item'} style={{ userSelect: 'none' }}>
            { title }
            {
              this.affixTabs.indexOf(page.fullPath) !== -1
                ? <a-icon type="pushpin" tabIndex={-1} class={'icon-affix'} {...{ on: { click: affix } }}/>
                : pages.length > 1
                  ? <a-icon type="close" tabIndex={-1} class={'icon-close'} {...{ on: { click: close } }}/>
                  : ''
            }
          </span>
        </a-dropdown>
      )
    }
  },
  render () {
    const { onEdit, $data: { pages } } = this
    const panes = pages.map(page => {
      const name = page?.query?.name || page?.params?.id
      let title = page.meta.customTitle || page.meta.title
      if (name) {
        title = `${title}：${name}`
      }
      return (
        <a-tab-pane
          style={{ height: 0 }}
          tab={this.renderTabPane(title, page, pages)}
          key={page.fullPath}
          closable={false}
        >
        </a-tab-pane>
      )
    })
    return (
      <div class="multitab">
        <div class="multitab-wrapper">
          <a-tabs
            ref={'tabs'}
            hideAdd
            type={'editable-card'}
            v-model={this.activeKey}
            tabBarStyle={{ margin: 0, border: 'none' }}
            {...{ on: { edit: onEdit } }}>
            { panes }
          </a-tabs>
        </div>
      </div>
    )
  }
}
</script>
