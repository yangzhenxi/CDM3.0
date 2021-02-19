<template>
  <header class="header-wrapper">
    <div class="header">
      <span class="title">{{ title }}</span>
      <div class="time">
        <span class="text">{{ date }}</span>
      </div>
    </div>
  </header>
</template>

<script>
import { formatDate } from '@/utils/util'
export default {
  name: 'DgHeader',
  props: {
    title: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      date: null
    }
  },
  created () {
    const timer = setInterval(() => {
      this.date = formatDate(false, 'MMM Do a hh:mm')
    })
    this.$once('hook:beforeDestroy', () => {
      clearInterval(timer)
    })
  }
}

</script>
<style lang='less' scoped>
.header-wrapper {
  .bg('header', 'jpg');
  .header {
    height: 100%;
    text-align: center;
    position: relative;
    .title {
      position: absolute;
      top: .2em;
      transform: translate(-50%, 0);
      font-size: .4em;
      letter-spacing: .1em;
      color: #85e0ff;
    }
    .time {
      position: absolute;
      top: .02em;
      right: .2em;
      width: 2em;
      height: .4em;
      .bg('headerTime');
      .text {
        position: absolute;
        top: .6em;
        right: 1em;
        font-size: .1em;
        color: #1995cb;
      }
    }
  }
}
.bg(@url, @format: 'svg') {
  background: #00000000 ~"url(~@/assets/img/dg/@{url}.@{format})" no-repeat;
  background-size: 100% 100%;
}
</style>
