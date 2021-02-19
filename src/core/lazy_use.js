import Vue from 'vue'
import VueNativeSock from 'vue-native-websocket'
import ProLayout, { PageHeaderWrapper } from '@ant-design-vue/pro-layout'
import __prototype__ from '@/core/__prototype__'
import store from '@/store'
import { getWatchIp, watchHandle } from '@/utils/socketUtil'
import './directives'

import {
  ConfigProvider,
  Layout,
  Input,
  InputNumber,
  Button,
  Switch,
  Radio,
  Checkbox,
  Select,
  Slider,
  Card,
  Carousel,
  Form,
  FormModel,
  Row,
  Col,
  Modal,
  Table,
  Tabs,
  Icon,
  Badge,
  Popover,
  Dropdown,
  Empty,
  List,
  Avatar,
  Affix,
  Breadcrumb,
  Pagination,
  Steps,
  Spin,
  Menu,
  Drawer,
  Timeline,
  Tooltip,
  Tree,
  Alert,
  Tag,
  Divider,
  DatePicker,
  TimePicker,
  Transfer,
  TreeSelect,
  Upload,
  Progress,
  Skeleton,
  Popconfirm,
  PageHeader,
  Result,
  message,
  notification
} from 'ant-design-vue'

import {
  MButton,
  MSelect,
  MTable,
  MTag,
  Dialog,
  Cron,
  TimeInput,
  RTimeInput
} from '@/components'

import MultiTab from '@/components/framework/MultiTab'

Vue.use(ConfigProvider)
Vue.use(Layout)
Vue.use(Input)
Vue.use(InputNumber)
Vue.use(Button)
Vue.use(Switch)
Vue.use(Radio)
Vue.use(Checkbox)
Vue.use(Select)
Vue.use(Slider)
Vue.use(Card)
Vue.use(Carousel)
Vue.use(Form)
Vue.use(FormModel)
Vue.use(Row)
Vue.use(Col)
Vue.use(Modal)
Vue.use(Table)
Vue.use(Tabs)
Vue.use(Icon)
Vue.use(Badge)
Vue.use(Popover)
Vue.use(Dropdown)
Vue.use(Empty)
Vue.use(List)
Vue.use(Avatar)
Vue.use(Affix)
Vue.use(Breadcrumb)
Vue.use(Pagination)
Vue.use(Steps)
Vue.use(Spin)
Vue.use(Menu)
Vue.use(Drawer)
Vue.use(Timeline)
Vue.use(Tooltip)
Vue.use(Tree)
Vue.use(Alert)
Vue.use(Tag)
Vue.use(Divider)
Vue.use(DatePicker)
Vue.use(TimePicker)
Vue.use(Transfer)
Vue.use(TreeSelect)
Vue.use(Upload)
Vue.use(Progress)
Vue.use(Skeleton)
Vue.use(Popconfirm)
Vue.use(notification)
Vue.use(PageHeader)
Vue.use(Result)

Vue.prototype.$confirm = Modal.confirm
Vue.prototype.$message = message
Vue.prototype.$notification = notification
Vue.prototype.$info = Modal.info
Vue.prototype.$success = Modal.success
Vue.prototype.$error = Modal.error
Vue.prototype.$warning = Modal.warning
Vue.prototype.$Empty = Empty

Vue.component('pro-layout', ProLayout)
Vue.component('page-header-wrapper', PageHeaderWrapper)
Vue.component('m-button', MButton)
Vue.component('m-select', MSelect)
Vue.component('m-table', MTable)
Vue.component('m-tag', MTag)
Vue.component('cron', Cron)
Vue.component('time-input', TimeInput)
Vue.component('r-time-input', RTimeInput)

Vue.use(Dialog)
Vue.use(MultiTab)
Vue.use(__prototype__)
Vue.use(VueNativeSock, `ws://${getWatchIp()}`, {
  store,
  format: 'json',
  connectManually: true,
  // reconnection: true,
  // reconnectionAttempts: 5,
  // reconnectionDelay: 3000,
  passToStoreHandler: function (eventName, event) {
    return watchHandle(this, eventName, event)
  }
})

message.config({
  maxCount: 3
})

Spin.setDefaultIndicator({
  indicator: {
    render () {
      return <div id="loading-center-absolute-inline">
        <div class="object_inline" id="object_one_inline"></div>
        <div class="object_inline" id="object_two_inline"></div>
        <div class="object_inline" id="object_three_inline"></div>
        <div class="object_inline" id="object_four_inline"></div>
      </div>
    }
  }
})
