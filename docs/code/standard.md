## 目录 ⛩
----

```ecmascript 6
.
├── docs/                                # 说明文件
│   └── ...
├── public/                                # 纯静态资源，该目录下的文件不会被webpack处理，该目录会被拷贝到输出目录
│   ├── ├── css/                           # css
│   ├── ├── fonts/                         # 字体
│   ├── ├── img/                           # 图片
│   ├── ├── js/                            # js
│   └── index.html                         # 入口文件
├── src/
│   ├── api/                               # 接口
│   ├── └── ...
│   ├── assets/                            # 存放项目共用的代码以外的资源，如：图片、图标、视频 等
│   ├── ├── css/                           # css
│   ├── ├── fonts/                         # 字体
│   ├── ├── img/                           # 图片
│   ├── └── js/                            # js
│   ├── components/                        # 公共组件
│   ├── ├── ...
│   ├── └── Dialog.js                      # 封装 Modal
│   ├── config/                            # 配置文件
│   ├── ├── constant.config.js             # 公共常量，如：默认显示的空值
│   ├── ├── defaultSettings.js             # 环境常量
│   ├── ├── router.config.js               # 静态路由
│   ├── ├── theme.config.js                # 主题配置
│   ├── ├── enum/                          # 枚举
│   ├── └── ...
│   ├── core/                              # 存放项目依赖加载，启动配置
│   ├── ├── directives                     # Vue 指令
│   ├── ├── use                            # use store
│   ├── ├── └── ...
│   ├── ├── __prototype_.js                # Vue 挂载实例
│   ├── ├── boostrap.js                    # 存放项目启动配置，如：环境配置
│   ├── ├── lazy_use.js                    # 懒加载
│   ├── └── ...
│   ├── layouts/                           # 布局，使用pro-layout
│   ├── └── ...
│   ├── locales/                           # 语言配置，默认 zh_CH 简体中文
│   ├── └── lang
│   ├── mock/                              # mock
│   ├── └── service                        # 模拟接口
│   ├── router/                            # 存放项目路由，vue-router
│   ├── └── index.js
│   ├── store/                             # 状态管理
│   ├── ├── modules                        # 状态模块
│   ├── ├── ├── app.js                     # 应用环境模块，设置默认环境
│   ├── ├── ├── permission.js              # 静态路由模块，根据权限筛选路由
│   ├── ├── └── ...
│   ├── ├── app-mixin.js                   # 应用环境混入
│   ├── ├── device-mixin.js                # 设备类型混入
│   ├── ├── getters.js
│   ├── ├── i18n-mixin.js
│   ├── ├── index.js
│   ├── └── mutation-types.js              # mutation 方法名
│   ├── theme/                             # 主题
│   ├── ├── default/                       # 默认
│   │   ├── ├── .../
│   │   ├── ├── antd.less/                 # UI 框架全局样式替换
│   │   ├── ├── style.less/                # 公共全局样式
│   │   ├── ├── util.less/                 # less 工具函数
│   ├── utils/                             # 自己封装的或者引用的库
│   ├── ├── axios.js                       # axios install
│   ├── ├── domUtil.js                     # 页标签 title
│   ├── ├── filter.js                      # Vue filter
│   ├── ├── mixin.js                       # Vue mixin
│   ├── ├── request.js                     # axios 封装
│   ├── ├── util.js                        # 工具函数
│   ├── ├── validator.js                   # 验证函数
│   ├── └── warning.js                     # 异常处理
│   ├── views/                             # 视图
│   ├── └── ...
│   ├── App.vue                            # 应用入口文件
│   ├── main.js                            # webpack 入口文件
│   ├── permission.js                      # 路由权限拦截
├── test/                                  # 测试
│   ├── unit/                              # 单元测试
│   │   ├── specs/                         # test spec files
│   │   ├── karma.conf.js                  # Karma的配置文件
│   │   └── setup.js                       # 在Jest之前运行的启动文件
│   └── e2e/                               # e2e 测试
│       ├── specs/                         # test spec files
│       ├── custom-assertions/             # 自定义的断言
│       ├── runner.js                      # test runner 脚本
│       └── nightwatch.conf.js             # test runner 的配置文件
├── .browserslistrc                        # 浏览器兼容
├── .editorconfig                          # 编码风格
├── .env                                   # 生产环境
├── .env.development                       # 开发环境
├── .env.preview                           # 预览环境
├── .eslintrc.js                           # Eslint 配置
├── .gitignore                             # git的忽略配置文件
├── .prettierrc                            # Prettier 配置
├── .versionrc                             # standard-version 配置
├── babel.config.js                        # babel 配置
├── jest.config.js                         # jest 配置
├── jsconfig.json                          # js 配置
├── package.json                           # 包说明
├── postcss.config.js                      # postcss 配置
├── vue.config.js                          # Vue-cli 配置
└── webstorm.config.js                     # webstorm 支持

```

## 规范 🙏
----

[@Vue](https://cn.vuejs.org/v2/style-guide)

### 命名
----

`PascalCase`

`camelCase`

`kebab-case`


### 顺序
----

```ecmascript 6
/**
 * 引用顺序按目录顺序
 *
 * npm包
 * api
 * component
 * config
 * enum
 * layout
 * router
 * store
 * utils
 */
 import Vue from 'vue'
 import { login } from '@/system/user'
 import { table } from '@/components'
 import config from '@/config/defaultSettings'
 import Enum from '@/config/enum'
 import { RouteView } from '@/layouts'
 import router from '@/router'
 import store from '@/store'
 import { get } from '@/utils/util'

 // 空一行
 export default {
   el?,

   name,
   parent?,

   functional?,

   delimiters?,
   comments?,

   components,
   directives?,
   filters?,

   extends?,
   mixins,

   inheritAttrs?,
   model?,
   props,

   setup?,

   data,
   computed,

   watch,
   beforeCreate?,
   created?,
   beforeMount?,
   mounted?,
   beforeUpdate?,
   updated?,
   activated?,
   deactivated?,
   beforeDestroy?,
   destroyed?,

   methods,

   template / render
   renderError
 }
```

### api
----

```ecmascript 6

/**
  * Api
  * key `PascalCase`
  */

const Api = {
  Login: '/user/login',
  ...
}

export function login(params) {
  return axios.post(Api.Login, { params })
}

```

### store
----

调用 `state` `mutations` `actions` `getter`

```ecmascript 6
import { mapState, mapMutations, mapActions, mapGetters } from 'vuex'

computed: {
  ...mapState({
    _: state => state.MODULE._
  }),
  ...mapGetters(['_']),
},
methods: {
  ...mapMutations({
    _: Mutation
  }),
  ...mapActions(['_'])
}
```

### utils
----

`deepGet`

```ecmascript 6

/**
  * 取值，在不确定值是否能取到的情况，一律使用以下方式
  */

const a = {
  b: 1,
  c: { a: 1, b: 2 },
  d: [1, { a: 1, b: 2 }],
  f: function,
  g: symbol
}

_ = deepGet(a, 'c.a.f.d.s', defaultValue)
_ = deepGet(a, 'd.0.s.d.f.s', defaultValue)
_ = deepGet(a, [d, 's', t], defaultValue)

_ = a?.b?.c?.s || defaultValue

```

`isFalsy`  `isEmpty`  `isEmptyOfUN`  `isXXX`

```ecmascript 6

/**
  * 判断类型，使用isXXX
  */

isFalsy `false +0 -0 '' undefined null NaN`
isEmpty `'' undefined null [] {}`
isEmptyOfUN undefined null

```
