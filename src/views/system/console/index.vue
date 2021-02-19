<template>
  <page-header-wrapper :title="false">
    <div ref="terminal" />
  </page-header-wrapper>
</template>

<script>
import 'xterm/css/xterm.css'
import { Terminal } from 'xterm'
import { AttachAddon } from 'xterm-addon-attach'
import { FitAddon } from 'xterm-addon-fit'
import { SearchAddon } from 'xterm-addon-search'
import { WebLinksAddon } from 'xterm-addon-web-links'
import { mapActions } from 'vuex'

export default {
  name: 'SystemConsole',
  data () {
    return {
      term: null
    }
  },
  mounted () {
    this.termConnect()
    this.$watch('$store.state.socketTerm.socket', function (socket) {
      this.termInitSocket(socket)
    }, {
      deep: true
    })
  },
  methods: {
    ...mapActions(['termConnect', 'termSend', 'termResize']),
    onSend (data) {
      this.termSend(data)
    },
    onResize (data) {
      this.termResize(data)
    },
    termInitSocket (socket) {
      const { error } = socket
      const term = new Terminal({
        rendererType: 'canvas',
        rows: 50,
        convertEol: true,
        fontSize: 14,
        disableStdin: false,
        cursorStyle: 'underline',
        cursorBlink: !error,
        theme: {
          foreground: '#7e9192',
          background: '#002833',
          cursor: 'help',
          lineHeight: 16
        }
      })
      const fitAddon = new FitAddon()
      try {
        // XXX: 设置单向，默认双向（自动发送String）- -
        term.loadAddon(new AttachAddon(socket.target, { bidirectional: false }))
      } catch (error) {
        term.write(socket.error)
      }
      term.loadAddon(fitAddon)
      term.loadAddon(new SearchAddon())
      term.loadAddon(new WebLinksAddon())
      fitAddon.fit()
      term.open(this.$refs.terminal)
      term.focus()
      term.prompt = () => {
        term.write('\r\n$ ')
      }
      term.onData(key => {
        this.onSend(key)
      })
      term.onResize(size => {
        this.onResize({ rows: size.rows, cols: size.cols })
      })
      if (!socket.error) {
        term.prompt()
      }
      this.term = term
      this.$once('hook:beforeDestroy', () => {
        this.term && this.term.dispose()
      })
    }
  }
}
</script>
