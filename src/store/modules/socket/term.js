import Vue from 'vue'
import { termWatch } from '@/utils/socketUtil'
import {
  ACCESS_TOKEN,
  SOCKET_TERM_ONOPEN,
  SOCKET_TERM_ONCLOSE,
  SOCKET_TERM_ONERROR,
  SOCKET_TERM_ONMESSAGE,
  SOCKET_TERM_RECONNECT,
  SOCKET_TERM_RECONNECT_ERROR
} from '../../mutation-types'

export default {
  state: {
    socket: {
      isConnected: false,
      reconnectError: false,
      target: null, // 实例
      error: null
    }
  },
  mutations: {
    [SOCKET_TERM_ONOPEN] (state, event) {
      this.$socketTerm = event.currentTarget
      state.socket.target = event.currentTarget
      state.socket.isConnected = true
    },
    [SOCKET_TERM_ONCLOSE] (state, event) {
      state.socket.isConnected = false
    },
    [SOCKET_TERM_ONERROR] (state, event) {
      state.socket.error = null
      state.socket.error = `WebSocket error`
    },
    [SOCKET_TERM_ONMESSAGE] (state, message) {
    },
    [SOCKET_TERM_RECONNECT] (state, count) {
      console.info(state, count)
    },
    [SOCKET_TERM_RECONNECT_ERROR] (state) {
      state.socket.reconnectError = true
    }
  },
  actions: {
    termConnect: function ({ getters }) {
      Vue.prototype.$connect(termWatch() + `?${ACCESS_TOKEN}=${getters.token.data}`)
    },
    termSend: function (context, data) {
      this.$socketTerm && this.$socketTerm.send(new TextEncoder().encode('\x00' + data))
    },
    termResize: function (context, data) {
      this.$socketTerm && this.$socketTerm.send(new TextEncoder().encode('\x01' + JSON.stringify({ rows: data.rows, cols: data.cols })))
    }
  }
}
