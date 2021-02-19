<template>
  <div id="userLayout" :class="['user-layout-wrapper', isMobile && 'mobile']">
    <div class="container">
      <div class="top">
        <div class="header">
          <div>
            <img src="~@/assets/img/logo.png" class="logo" alt="logo">
          </div>
          <div>
            <div class="title">{{ config.title }}</div>
            <div class="sub">{{ config.subTitle }}</div>
          </div>

        </div>
        <div class="desc">
        </div>
      </div>
      <div class="main">
        <div class="title">
          <span class="value">用户登录</span>
          <span>UserLogin</span>
        </div>
        <router-view />
      </div>
      <global-footer />
    </div>
  </div>
</template>

<script>
import GlobalFooter from '@/components/framework/GlobalFooter'
import { deviceMixin } from '@/store/device-mixin'
import config from '@/config/defaultSettings'

export default {
  name: 'UserLayout',
  mixins: [deviceMixin],
  components: {
    GlobalFooter
  },
  data () {
    return {
      config: {
        title: config.title,
        subTitle: config.subTitle
      }
    }
  },
  mounted () {
    document.body.classList.add('userLayout')
  },
  beforeDestroy () {
    document.body.classList.remove('userLayout')
  }
}
</script>

<style lang="less" scoped>
  #userLayout.user-layout-wrapper {
    height: 100%;
    &.mobile {
      .container {
        .main {
          max-width: 420px;
          width: 98%;
          padding: 24px 16px;
        }
      }
    }
    .container {
      width: 100%;
      min-height: 100%;
      background: @gray-1 url(~@/assets/img/background.jpg) no-repeat 50%;
      background-size: 100% 100%;
      padding: 110px 0 144px;
      position: relative;
      a {
        text-decoration: none;
      }
      .top {
        text-align: center;
        .header {
          display: flex;
          align-items: center;
          justify-content: center;
          .logo {
            height: 100px;
            vertical-align: top;
            margin-right: 16px;
            border-style: none;
          }
          .title {
            font-size: 33px;
            color: @heading-color;
            font-family: Avenir, 'Helvetica Neue', Arial, Helvetica, sans-serif;
            font-weight: 600;
            letter-spacing: 4px;
            position: relative;
            top: 2px;
          }
          .sub {
            font-size: 26px;
            color: rgba(0, 0, 0, .75);
            font-family: Avenir, 'Helvetica Neue', Arial, Helvetica, sans-serif;
            font-weight: 400;
            letter-spacing: 16px;
            position: relative;
            top: 2px;
          }
        }
        .desc {
          font-size: 14px;
          color: rgba(0, 0, 0, 0.45);
          margin-top: 12px;
          margin-bottom: 40px;
        }
      }
      .main {
        min-width: 260px;
        width: 420px;
        margin: 0 auto;
        padding: 48px 16px;
        background: #fff;
        border-radius: 5px;
        box-shadow: 0 0 12px #ddd;
        .title {
          margin-bottom: 24px;
          .value {
            font-size: 20px;
            font-weight: 600;
            color: rgba(0, 0, 0, 0.75);
            margin-bottom: 20px;
            & + span {
              font-size: 16x;
              color: rgba(0, 0, 0, 0.55);
              margin-left: 8px;
            }
          }
        }
      }
      .footer {
        position: absolute;
        width: 100%;
        bottom: 0;
        padding: 0 16px;
        margin: 48px 0 24px;
        text-align: center;

        .links {
          margin-bottom: 8px;
          font-size: 14px;
          a {
            color: rgba(0, 0, 0, 0.45);
            transition: all 0.3s;
            &:not(:last-child) {
              margin-right: 40px;
            }
          }
        }
        .copyright {
          color: rgba(0, 0, 0, 0.45);
          font-size: 14px;
        }
      }
    }
  }
</style>
