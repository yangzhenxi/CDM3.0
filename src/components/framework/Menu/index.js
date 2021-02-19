import Menu from 'ant-design-vue/es/menu'
import { MIcon } from '@/components'

const { Item, SubMenu } = Menu

export default {
  name: 'Menu',
  props: {
    menus: {
      type: Array,
      required: true
    },
    theme: {
      type: String,
      required: false,
      default: 'dark'
    },
    mode: {
      type: String,
      required: false,
      default: 'inline'
    },
    collapsed: {
      type: Boolean,
      required: false,
      default: false
    },
    i18nRender: {
      type: [Function || Boolean],
      required: false,
      default: false
    }
  },
  data () {
    return {
      openKeys: [],
      selectedKeys: [],
      cachedOpenKeys: []
    }
  },
  computed: {
    rootSubmenuKeys: vm => {
      const keys = []
      vm.menus.forEach(item => keys.push(item.path))
      return keys
    }
  },
  created () {
    this.updateMenu()
  },
  watch: {
    collapsed (value) {
      if (value) {
        this.cachedOpenKeys = this.openKeys.concat()
        this.openKeys = []
      } else {
        this.openKeys = this.cachedOpenKeys
      }
    },
    $route: function () {
      this.updateMenu()
    }
  },
  methods: {
    // select menus item
    onOpenChange (openKeys) {
      // 在水平模式下时执行，并且不再执行后续
      if (this.mode === 'horizontal') {
        this.openKeys = openKeys
        return
      }
      // 非水平模式时
      const latestOpenKey = openKeys.find(key => !this.openKeys.includes(key))
      if (!this.rootSubmenuKeys.includes(latestOpenKey)) {
        this.openKeys = openKeys
      } else {
        this.openKeys = latestOpenKey ? [latestOpenKey] : []
      }
    },
    updateMenu () {
      const routes = this.$route.matched.concat()
      const { hidden } = this.$route.meta
      if (routes.length >= 3 && hidden) {
        routes.pop()
        this.selectedKeys = [routes[routes.length - 1].path]
      } else {
        this.selectedKeys = [routes.pop().path]
      }
      const openKeys = []
      if (this.mode === 'inline') {
        routes.forEach(item => {
          openKeys.push(item.path)
        })
      }

      this.collapsed ? (this.cachedOpenKeys = openKeys) : (this.openKeys = openKeys)
    },
    renderItem (menu, i18nRender) {
      if (!menu.meta?.hidden) {
        if (menu.children && !menu.hideChildrenInMenu) {
          // XXX: 实现 keepalive, 所有组件置于route-view下，需要隐藏概况的父级菜单
          if (menu.meta?.hiddenSub) {
            return this.renderMenuItem(menu.children[0], i18nRender)
          }
          return this.renderSubMenu(menu, i18nRender)
        } else {
          return this.renderMenuItem(menu, i18nRender)
        }
      }
      return null
    },
    renderMenuItem (menu, i18nRender) {
      const target = menu.meta?.target || null
      const tag = target && 'a' || 'router-link'
      const props = { to: { name: menu.name } }
      const attrs = { href: menu.path, target: menu.meta?.target }
      if (menu.children && menu.hideChildrenInMenu) {
        // 把有子菜单的 并且 父菜单是要隐藏子菜单的
        // 都给子菜单增加一个 hidden 属性
        // 用来给刷新页面时， selectedKeys 做控制用
        menu.children.forEach(item => {
          item.meta = Object.assign(item.meta, { hidden: true })
        })
      }
      return (
        <Item {...{ key: menu.path, title: menu.meta?.title, disabled: true }}>
          <tag {...{ props, attrs }}>
            {this.renderIcon(menu.meta?.icon)}
            {this.renderTitle(menu.meta?.title, i18nRender)}
          </tag>
        </Item>
      )
    },
    renderSubMenu (menu, i18nRender) {
      const itemArr = []
      if (!menu.hideChildrenInMenu) {
        menu.children.forEach(item => itemArr.push(this.renderItem(item, i18nRender)))
      }
      return (
        <SubMenu {...{ key: menu.path }}>
          <span slot="title">
            {this.renderIcon(menu.meta?.icon)}
            {this.renderTitle(menu.meta?.title, i18nRender)}
          </span>
          {itemArr}
        </SubMenu>
      )
    },
    renderTitle (title, i18nRender) {
      return (
        <span> {i18nRender ? i18nRender(title) : title} </span>
      )
    },
    renderIcon (icon) {
      if (icon === 'none' || icon === undefined) {
        return null
      }
      const props = {}
      typeof icon === 'object' ? (props.component = icon) : (props.type = icon)
      return <MIcon {...{ props }} />
    }
  },

  render () {
    const { mode, theme, menus, i18nRender } = this
    const props = {
      mode: mode,
      theme: theme,
      openKeys: this.openKeys
    }
    const on = {
      select: obj => {
        this.selectedKeys = obj.selectedKeys
        this.$emit('select', obj)
      },
      openChange: this.onOpenChange
    }

    const menuTree = menus.map(item => {
      if (item.meta?.hidden) {
        return null
      }
      return this.renderItem(item, i18nRender)
    })
    return (
      <Menu vModel={this.selectedKeys} {...{ props, on: on }}>
        {menuTree}
      </Menu>
    )
  }
}
