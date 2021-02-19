import { merge } from 'lodash'
import moment from 'moment'
import 'moment/locale/zh-cn'
import notification from 'ant-design-vue/es/notification'
import message from 'ant-design-vue/es/message'
import apiEnum from '@/api'
import ENUM from '@/config/enum'
import { EMPTY_VALUE, FETCH_CODE } from '@/config/constant.config'
import { $t } from '@/locales'
import store from '../store'
moment.locale('zh-cn')

/**
 * 是否为空 '', undefined，null, [], {}
 * @param { any } object 对象
 */
export function isEmpty (object) {
  const type = TYPE(object)
  switch (type) {
  case 'String':
    return object === ''
  case 'Undefined':
    return true
  case 'Null':
    return true
  case 'Array':
    return object.length === 0
  case 'Object':
    return Object.keys(object).length === 0
  default:
    return false
  }
}

/**
 * 是否为 undefined，null
 * @param { undefined || null } object
 */
export function isEmptyOfUN (o) {
  return isUndefined(undefined ?? o) || isNull(null ?? o)
}

/**
 * 是否为布尔类型
 * @param { Boolean } object
 */
export function isBoolean (object) {
  return TYPE(object) === 'Boolean'
}

/**
 * 是否为数字类型
 * @param { Number } object
 */
export function isNumber (object) {
  return TYPE(object) === 'Number'
}

/**
 * 是否为字符串类型
 * @param { String } object
 */
export function isString (object) {
  return TYPE(object) === 'String'
}

/**
 * 是否为 Undefined 类型
 * @param { Undefined } object
 */
export function isUndefined (object) {
  return TYPE(object) === 'Undefined'
}

/**
 * 是否为 Null 类型
 * @param { Null } object
 */
export function isNull (object) {
  return TYPE(object) === 'Null'
}

/**
 * 是否为数组类型
 * @param { Array } object
 */
export function isArray (object) {
  return Array.isArray(object) || TYPE(object) === 'Array'
}

/**
 * 是否为对象类型
 * @param { Object } object
 */
export function isObject (object) {
  return TYPE(object) === 'Object'
}

/**
 * 是否为函数类型
 * @param { Function } object
 */
export function isFunction (object) {
  return TYPE(object) === 'Function'
}

/**
 * 是否为 Symbol 类型
 * @param { Object } object
 */
export function isSymbol (object) {
  return TYPE(object) === 'Symbol'
}

/**
 * 获取类型
 * @param { Object } object
 */
function TYPE (object) {
  return Function.prototype.call.bind(Object.prototype.toString)(object).match(/\[object (.+?)\]/)[1]
}

/**
 * 是否为 Promise 类型
 * @param { Promise } object
 */
export function isPromise (object) {
  return (typeof object === 'object' || typeof object === 'function') && typeof object.then === 'function'
}

/**
 * 时间格式转换
 * @param { any } date 时间
 * @param { String } pattern 格式
 */
export function formatDate (date, pattern = 'YYYY-MM-DD HH:mm:ss') {
  return date ? moment(date).format(pattern) : moment().format(pattern)
}

/**
 * 一段时间
 * @param { String } pattern 格式
 */
export function duringDate (pattern) {
  return [moment().startOf(pattern), moment().endOf(pattern)]
}

/**
 * 相对时间
 * @param { any } date 时间
 * @param { String } pattern 格式
 */
export function fromNow (date, suffix = false) {
  return moment(date).fromNow(suffix)
}

/**
 * unix 时间戳转换
 * @param { unix } unix 时间戳
 * @param { String } pattern 格式
 */
export function unixToDate (unix, pattern = 'YYYY-MM-DD HH:mm:ss') {
  return moment.unix(`${unix}`.substring(0, 10)).format(pattern)
}

/**
 * unix 时差
 * @param { unix } unix 时间戳
 * @param { String } unit 单位
 */
export function unixDiff (unix, unit = 'seconds') {
  unix = parseInt(unix)
  if (isNaN(unix)) {
    return { unix }
  }
  const unitCN = {
    years: '年',
    months: '月',
    days: '天',
    hours: '小时',
    minutes: '分钟',
    seconds: '秒',
    milliseconds: '毫秒'
  }
  const du = moment.duration(unix, unit) // 做差
  const date = {
    years: du.get('years'),
    months: du.get('months'),
    days: du.get('days'),
    hours: du.get('hours'),
    minutes: du.get('minutes'),
    seconds: du.get('seconds'),
    milliseconds: du.get('milliseconds')
  }
  let result = ''
  Object.keys(date).map(u => {
    if (date[u] > 0) {
      result += date[u] + ` ${unitCN[u]} `
    }
  })
  if (!result) {
    result = `0 ${unitCN[unit]}`
  }
  return result
}

/**
 * unix 时间戳转换
 * @param { any } date 时间
 * @param { String } pattern 格式
 */
export function dateToUnix (date) {
  return moment(date).unix()
}

/**
 * 时间 ADD
 * @param { date } date 时间
 * @param { Number } n 天数
 * @param { String } unit 单位
 */
export function addDate (date, n, unit = 'd') {
  return moment(date).add(n, unit)
}

/**
 * 字典转换
 * @param { String } value 值
 * @param { String } filter 过滤器
 */
export function toEnum (value, filter) {
  if (ENUM[filter]) {
    return ENUM[filter].find(e => e.key === value) || {}
  }
  return ENUM.notFound[0]
}

/**
 * 过滤器
 * @param { String } value 值
 * @param { String } filter 过滤器
 * @param { Object } config 过滤器参数
 */
export function convert (value, filter, config = {}) {
  if (isEmpty(value)) {
    return EMPTY_VALUE
  }
  if (isEmpty(filter)) {
    return value
  }
  if (ENUM[filter]) {
    if (Array.isArray(value)) {
      const data = []
      value.forEach(u => {
        data.push(deepGet(ENUM[filter].find(e => e.key === u), 'value', config.default || ENUM.notFound[0].value))
      })
      return data
    } else {
      return deepGet(ENUM[filter].find(e => e.key === value), 'value', config.default || ENUM.notFound[0].value)
    }
  } else {
    switch (filter) {
    // 文本
    case 'textTo':
      return textTo(value, config)
      // 小数
    case 'decimalTo':
      return decimalTo(value, config)
      // 时间戳
    case 'unixToDate':
      return unixToDate(value, config.pattern)
      // 时间戳
    case 'dateToUnix':
      return dateToUnix(value, config.pattern)
      // 时间差
    case 'unixDiff':
      return unixDiff(value, config.unit)
      // 压缩比
    case 'compressRatio':
      return `${value} : 1`
      // + 单位
    case 'unit':
      return `${value} ${config.unit}`
      // 容量大小
    case 'unitSize':
      const size = unitSize(value, config)
      if (!isEmpty(size)) {
        return `${size.value} ${size.unit}`
      } else {
        return EMPTY_VALUE
      }
      // 速率大小
    case 'unitSpeed':
      const speed = unitSpeed(value, config)
      if (!isEmpty(speed)) {
        return `${speed.value} ${speed.unit}`
      } else {
        return EMPTY_VALUE
      }
    default:
      return value
    }
  }
}

/**
 * 文本转换
 * @param { String } value 度量
 * @param { Object } config
 */
export function textTo (value, config = { type: '' }) {
  switch (config.type) {
  case 'password':
    return `${value}`.replace(/./g, '*')
  default:
    return value
  }
}

/**
 * 小数转换
 * @param { Number } value 小数
 * @param { Object } config
 */
export function decimalTo (value, config = { digits: 2 }) {
  if (isNaN(+value)) {
    return value
  }
  return +(+value).toFixed(config.digits)
}

const measureList = [
  {
    key: 'size',
    unitList: ['B', 'KB', 'MB', 'GB', 'TB', 'PB'],
    mul: 1024
  },
  {
    key: 'speed',
    unitList: ['B/s', 'KB/s', 'MB/s', 'GB/s'],
    mul: 1000
  }
]

/**
 * 度量转换
 * @param { Number } value 度量
 * @param { Object } config
 */
function unitTo (value, config) {
  if (isNaN(+value)) {
    return {}
  }
  const { unit } = config
  const measure = measureList.find(u => u.key === config.key)
  const { unitList, mul } = measure
  let targetUnit = []
  // u1 -> u2 || value < mul
  if (isArray(unit)) {
    const u2 = unit[1] || unit[0]
    const u1 = unit[0] || unitList[0]
    let i1 = unitList.findIndex(u => u === u1)
    let i2 = unitList.findIndex(u => u === u2)
    i1 = i1 !== -1 ? i1 : 0
    i2 = i2 !== -1 ? i2 : i1
    targetUnit = [i1, i2]
    const diff = targetUnit[1] - targetUnit[0]
    value = diff > 0 ? value / Math.pow(mul, diff) : diff === 0 ? value : value * Math.pow(mul, Math.abs(diff))
  } else {
    let i1 = unitList.findIndex(u => u === unit)
    let i2 = i1
    i1 = i1 !== -1 ? i1 : 0
    i2 = i1
    // 为了排除显示上的0.XXX，即结果需要不为小数
    if (parseInt(value) > 0) {
      while (parseInt(value / mul) > 0 && i2 < unitList.length - 1) {
        value = value / mul
        i2++
      }
    } else {
      while (parseInt(value * mul) > 0 && i2 > 0) {
        value = value * mul
        i2--
      }
    }
    targetUnit = [i1, i2]
  }
  return {
    value: +(+value).toFixed(2),
    unit: unitList[targetUnit[1]]
  }
}

/**
 * 容量转换(默认是B)
 * @param { Number } size 容量
 * @param { Object } config
 */
export function unitSize (value, config = {}) {
  if (isNaN(+value)) {
    return {}
  }
  const res = unitTo(value, { key: 'size', ...config })
  return {
    value: res.value,
    unit: res.unit
  }
}

/**
 * 速率转换(默认是B/s)
 * @param { Number } speed 速率
 * @param { Object } config
 */
export function unitSpeed (value, config = {}) {
  if (isNaN(+value)) {
    return EMPTY_VALUE
  }
  const res = unitTo(value, { key: 'speed', ...config })
  return {
    value: res.value,
    unit: res.unit
  }
}

/**
 * 查询条件重构
 * @param { Object } params 查询条件
 */
export function queryBuild (params) {
  return removeEmptyField(params)
}

/**
 * 表格项构建
 * @param { Array } columns 项
 * @param { String | Array } modules 类型
 */
export function columnsBuild (columns, modules = 'default') {
  if (!isArray(modules) && !isEmpty(modules)) {
    modules = [modules]
  }
  return columns.filter(u => {
    const _ = deepGet(u, 'modules', [])
    if (isEmpty(_)) {
      return true
    } else {
      return !modules.filter(i => !_.includes(i)).length
    }
  })
}

/**
 * get请求参数重构
 * @param { String } url
 * @param { Object } params 查询条件
 */
export function requestParamsBuild (url, params) {
  const keys = Object.keys(removeEmptyField(params))
  url += '?'
  for (const key of keys) {
    url += `${key}=${encodeURIComponent(params[key])}&`
  }
  url = url.substring(0, url.length - 1)
  return url
}

/**
 * 对象查找
 * @param { Object } object 对象
 * @param { String | Array } path 路径
 * @param { any } defaultValue 默认值
 */
export function deepGet (object, path, defaultValue) {
  const s = (!isArray(path) ? path.replace(/\[/g, '.').replace(/\]/g, '').split('.') : path)
    .reduce((o, k) => (o || {})[k], object)
  return isEmptyOfUN(s) ? defaultValue : s
}

/**
 * 对象属性设置
 * @param { Object } object 对象
 * @param { String | Array } path 路径
 * @param { any } defaultValue 默认值
 */
export function deepSet (object, path, defaultValue) {
  if (!isArray(object) && !isObject(object)) {
    object = {}
  }
  path = !isArray(path) ? path.replace(/\[/g, '.').replace(/\]/g, '').split('.') : path
  let nested = object
  path.map((u, index) => {
    if (index === path.length - 1) {
      nested[u] = defaultValue
    } else {
      const value = nested[u]
      if (isObject(value) || isArray(value)) {
        nested[u] = value
      } else {
        // .0 .a 判断数组或对象
        nested[u] = /^(?:0|[1-9]\d*)$/.test(+path[index + 1]) ? [] : {}
      }
    }
    nested = nested[u]
  })
  return object
}

/**
 * 取值
 * @param { Object || Array } array
 * @param { String | Array } path 路径
 * @param { any } defaultValue 默认值
 */
export function deepGetFromArray (array, path, defaultValue) {
  if (!isArray(array)) {
    return deepGet(array, path, defaultValue)
  } else {
    let res
    const _ = array.some(u => {
      res = deepGet(u, path)
      return !isEmptyOfUN(res)
    })
    return _ ? res : defaultValue
  }
}

/**
 * 去掉对象或数组中的空值
 * @param { object } object 对象
 */
export function removeEmptyField (object) {
  if (!isArray(object) && !isObject(object)) {
    return object
  }
  const res = {}
  Object.keys(object).map(key => {
    if (!isEmpty(object[key])) {
      if (isArray(object[key]) || isObject(object[key])) {
        res[key] = removeEmptyField(object[key])
      } else {
        res[key] = object[key]
      }
    }
  })
  return res
}

/**
 * uuid
 */
export function uuid (length = 15) {
  var chars = 'abcdefghijklmnopqrstuvwxyz'.split('')
  var uuid = new Array(length)
  var rnd = 0
  var r
  for (var i = 0; i < length; i++) {
    if (i === 8 || i === 13 || i === 18 || i === 23) {
      uuid[i] = '-'
    } else {
      if (rnd <= 0x02) { rnd = 0x2000000 + (Math.random() * 0x1000000) | 0 }
      r = rnd & 0xf
      rnd = rnd >> 4
      uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r]
    }
  }
  return uuid.join('').replace(/-/gm, '').toLowerCase()
}

/**
 * 数组去重
 * @param { Array } array 数组
 * @param { Array } config 去重时的唯一值
 */
export function uniq (array, config = []) {
  if (config.length) {
    for (let i = 0; i < array.length; i++) {
      for (let j = i + 1; j < array.length; j++) {
        if (config.map(field => array[i].hasOwnProperty(field) && array[j].hasOwnProperty(field) && array[i][field] === array[j][field])
          .reduce((prev, next) => prev || next)) {
          array.splice(j, 1)
          j--
        }
      }
    }
    return array
  } else {
    return [...new Set(array)]
  }
}

/**
 * 合并表格行
 * @param { Array } data 源数组
 * @param { Number } index 序号
 */
export function getRowSpanCount (data, index) {
  let preValue = data[0]
  const res = [
    [preValue]
  ]
  let i = 0
  for (let j = 1; j < data.length; j++) {
    if (data[j] === preValue) {
      res[i].push(data[j])
    } else {
      i += 1
      res[i] = []
      res[i].push(data[j])
      preValue = data[j]
    }
  };
  const result = []
  res.map(u => {
    u.map((_, p) => {
      result.push(p === 0 ? u.length : 0)
    })
  })
  return result[index]
}

/**
 * 数组设置
 * @param { Array } data 源数组
 * @param { Object } kv
 * @param { Object } o 赋值
 */
export function transformArray (data, kv, o) {
  const index = data.findIndex(u => Object.keys(kv).every(k => u[k] === kv[k]))
  if (index !== -1) {
    if (o) {
      data.splice(index, 1, merge(data[index], o))
      return {
        o: data[index],
        data,
        index
      }
    } else {
      data.splice(index, 1)
      return {
        data,
        index
      }
    }
  } else {
    if (o) {
      data.push(o)
      return {
        o,
        data,
        index: data.length - 1
      }
    }
  }
}

/**
 * 防抖
 * @param { Function } func
 * @param { Number } wait
 */
export function debounce (func, wait = 500) {
  let timer = null
  return function () {
    const context = this
    timer && clearTimeout(timer)
    timer = setTimeout(() => {
      func.apply(context, arguments)
    }, wait)
  }
}

/**
 * 限流
 * @param { Function } func
 * @param { Number } wait
 */
export function throttle (func, wait = 500) {
  let lastTime = new Date().getTime()
  return function () {
    const context = this
    const now = new Date().getTime()
    if (now - lastTime > wait) {
      func.apply(context, arguments)
      lastTime = now
    }
  }
}

/**
 * 触发 window.resize
 */
export function triggerWindowResizeEvent () {
  const event = document.createEvent('HTMLEvents')
  event.initEvent('resize', true, true)
  event.eventType = 'message'
  window.dispatchEvent(event)
}

export function handleScrollHeader (callback) {
  let timer = 0

  let beforeScrollTop = window.pageYOffset
  callback = callback || function () { }
  window.addEventListener(
    'scroll',
    event => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        let direction = 'up'
        const afterScrollTop = window.pageYOffset
        const delta = afterScrollTop - beforeScrollTop
        if (delta === 0) {
          return false
        }
        direction = delta > 0 ? 'down' : 'up'
        callback(direction)
        beforeScrollTop = afterScrollTop
      }, 50)
    },
    false
  )
}

export function isIE () {
  const bw = window.navigator.userAgent
  const compare = (s) => bw.indexOf(s) >= 0
  const ie11 = (() => 'ActiveXObject' in window)()
  return compare('MSIE') || ie11
}

/**
 * 退出登录
 */
export function timeoutLogout () {
  var lastTime = new Date().getTime()
  var currentTime = new Date().getTime()
  var timeOut = 24 * 60 * 60 * 1000
  document.onmousemove = () => {
    lastTime = new Date().getTime()
  }
  function testTime () {
    currentTime = new Date().getTime()
    if (currentTime - lastTime > timeOut) {
      store.dispatch('Logout').then(() => {
        message.info('由于未进行操作，系统即将退出登录！')
        setTimeout(() => {
          window.location.reload()
        }, 1000)
      }).catch(() => {
        currentTime = new Date().getTime()
      }).finally(() => {
        clearInterval(timer)
        document.onmousemove = null
      })
    }
  }
  const timer = setInterval(testTime, 5000)
}

// 异常处理方法

/**
 * 接口异常处理
 * @param { Error } error
 */
export function handleFetchStateErrorDone (error) {
  if (error?.response) {
    const { data, config, status } = error.response
    const key = apiEnum.find(api => api.url === config.url)?.title || config.url
    return {
      state: 'error',
      data: [{
        key,
        message: deepGet(data, 'detail') || FETCH_CODE[status]
      }]
    }
  }
}

/**
 * 接口异常处理
 * @param { Error } error
 */
export function handleFetchTextErrorDone (error) {
  if (error?.response) {
    const { data, status } = error.response
    return deepGet(data, 'detail') || FETCH_CODE[status]
  }
}

/**
 * 接口异常处理
 * @param { Error } error
 */
export function handleFetchErrorNotification (error) {
  const { data, config, status } = error.response
  const api = apiEnum.find(u => u.url === config.url)
  if (api) {
    const title = api?.title || config.url
    notification.error({
      message: $t('layouts.fetch.error'),
      description: h => {
        return (
          <span>
            <m-tag color='cyan'>{ title }</m-tag>
            { deepGet(data, 'detail') || FETCH_CODE[status] }
          </span>
        )
      }
    })
  }
}

/**
 * enum 转化
 * @param { Enum } e
 * @param { Function } func
 */
export function enumToSelection (e, func) {
  let res = []
  if (isFunction(func)) {
    res = ENUM[e].map(u => func(u))
  } else {
    res = ENUM[e].map(u => ({
      value: u.key,
      label: u.value
    }))
  }
  return res
}

/**
 * 曲线抽稀
 * @param { Array } list 曲线数据
 * @param { Number } epsilon 距离
 */
export function DouglasPeucker (list, epsilon = 1) {
  const distance = (p1, p2) => {
    const x1 = p1.key
    const y1 = p1.value
    const x2 = p2.key
    const y2 = p2.value
    return Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2))
  }
  const H = (p, p1, p2) => {
    const pp1 = distance(p, p1)
    const pp2 = distance(p, p2)
    const p1p2 = distance(p1, p2)
    const s = helen(pp1, pp2, p1p2)
    return 2 * s / p1p2
  }
  const helen = (pp1, pp2, p1p2) => {
    const p = (pp1 + pp2 + p1p2) / 2
    return Math.sqrt(p * (p - pp1) * (p - pp2) * (p - p1p2))
  }
  let maxH = 0
  let index = 0
  for (let i = 0; i < list.length - 1; i++) {
    const h = H(list[i], list[0], list[list.length - 1])
    if (h > maxH) {
      maxH = h
      index = i
    }
  }

  let res = []

  if (maxH > epsilon) {
    const left = []
    const right = []
    for (let i = 0; i < list.length; i++) {
      if (i <= index) {
        left.push(list[i])
        if (i === index) {
          right.push(list[i])
        }
      } else {
        right.push(list[i])
      }
    }

    const leftRes = DouglasPeucker(left, epsilon)
    const rightRes = DouglasPeucker(right, epsilon)
    rightRes.shift()
    leftRes.push(...rightRes)
    res = uniq([...leftRes, ...rightRes], ['key', 'value'])
  } else {
    res = [list[0], list[list.length - 1]]
  }
  return res
}

/**
 * 写 Cookie
 * @param { String } name
 * @param { String } value 值
 * @param { String } expire 过期时间
 */
export function setCookie (name, value, expire) {
  var date = new Date()
  date.setSeconds(date.getSeconds() + expire)
  document.cookie = name + '=' + escape(value) + '; expires=' + date.toGMTString()
}

/**
 * 读 Cookie
 * @param { String } name
 */
export function getCookie (name) {
  if (document.cookie.length > 0) {
    let s = document.cookie.indexOf(name + '=')
    if (s !== -1) {
      s = s + name.length + 1
      let e = document.cookie.indexOf(';', s)
      if (e === -1) e = document.cookie.length
      return unescape(document.cookie.substring(s, e))
    }
  }
  return ''
}
