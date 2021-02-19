<template>
  <div class="footer">
    <div class="links">

    </div>
    <div class="copyright">
      Copyright
      <a-icon type="copyright" /> {{ moment().year() }}
      <span>{{ config.company }}</span>
      <p>{{ config.tel }}</p>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import config from '@/config/defaultSettings'

export default {
  name: 'GlobalFooter',
  data () {
    return {
      config: {
        company: config.company,
        tel: config.tel
      }
    }
  },
  methods: {
    moment
  }
}
</script>

<style lang="less" scoped>
  .footer {
    padding: 0 16px;
    margin: 48px 0 24px;
    text-align: center;
    .links {
      margin-bottom: 8px;

      a {
        color: rgba(0, 0, 0, 0.45);

        &:hover {
          color: @text-color;
        }

        &:not(:last-child) {
          margin-right: 40px;
        }
      }
    }
    .copyright {
      color: unset;
      font-size: 14px;
    }
  }
</style>
