<template>
  <span v-if="date" class="time"><a-icon type="clock-circle" />{{ date }}</span>
</template>

<script>
import { formatDate, dateToUnix, unixToDate } from '@/utils/util'
export default {
  data () {
    return {
      date: null
    }
  },
  created () {
    this.loadData()
  },
  methods: {
    async loadData () {
      let timer = null
      try {
        let date = dateToUnix()
        timer = setInterval(() => {
          this.date = unixToDate(++date, 'MMM Do dddd a hh:mm')
        }, 1000)
        this.$once('hook:beforeDestroy', () => {
          clearInterval(timer)
        })
      } catch (error) {
        timer = setInterval(() => {
          this.date = formatDate(false, 'MMM Do dddd a hh:mm')
        })
      }
      this.$once('hook:beforeDestroy', () => {
        clearInterval(timer)
      })
    }
  }
}

</script>

<style lang="less" scoped>
  .time {
    border-radius: 16px;
    box-shadow: inset 0 2px 8px rgba(0, 0, 0, .15);
    padding: 4px 8px;
    .anticon {
      margin-right: 8px;
    }
  }
</style>
