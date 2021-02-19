import os from 'os'
import {
  SOCKET_TERM_PREFIX,
  SOCKET_TERM_URL
} from '@/store/mutation-types'

/**
 * 获取本机ip
 */
export function getIP () {
  return os.hostname()
}

/**
 * 获取watch
 */
export function getWatchIp () {
  return process.env.VUE_APP_WEBSOCKET ? process.env.VUE_APP_WEBSOCKET : `ws://${getIP()}`
}

/**
 * 告警 socket 地址
 */
export function termWatch () {
  return process.env.VUE_APP_WEBSOCKET_TERM ? process.env.VUE_APP_WEBSOCKET_TERM : `ws://${getIP()}${process.env.VUE_APP_API_BASE_URL}/${SOCKET_TERM_URL}`
}

/**
 * socket store 配置
 */
export function watchHandle (self, eventName, event) {
  if (!eventName.startsWith('SOCKET_')) { return }
  const method = 'commit'
  let target = null
  let type = null
  const url = event.target.url.split('/').slice(4).join('/').split('?')[0]
  switch (url) {
  case SOCKET_TERM_URL:
    target = `${SOCKET_TERM_PREFIX}_ON${event.type.toUpperCase()}`
    type = 'term'
    break
  }
  let msg = event
  if (self.format === 'json' && event.data) {
    // term blob(row, col) ArrayBuffer(数据)
    if (type === 'term') {
      if (event.data instanceof ArrayBuffer) {
        msg = String.fromCharCode.apply(null, new Uint8Array(event.data))
      } else {
        msg = null
      }
    } else {
      msg = JSON.parse(event.data)
    }
  }
  if (msg) {
    self.store[method](target, msg)
  }
}
