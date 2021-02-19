<template>
  <card
    :hover="Boolean(data.name)"
    :bodyStyle="{ padding: 0 }"
    :wrapperClass="data.key"
    :headerWrapperClass="`${data.key}-header`"
    :headerActionWrapperClass="`${data.key}-header-action`"
    :contentWrapperClass="`${data.key}-content`"
    @click.native="$router.push({ name: data.name })"
  >
    <span slot="title" class="title">{{ data.title }}</span>
    <span slot="action" class="action">{{ data.type }}</span>
    <div style="margin-top: 16px">
      <a-row type="flex" align="middle" justify="space-between">
        <a-col :sm="10" :md="8">
          <div :class="[`${data.key}-icon`]">
            <m-icon :type="data.icon" class="icon" />
          </div>
        </a-col>
        <a-col :sm="2" :md="2" >
          <div class="divider" />
        </a-col>
        <a-col :sm="10" :md="10">
          <div class="total-wrapper">
            <div class="value"><span :class="[setTotalClass()]">{{ total > overflowCount ? overflowCount : total }}</span></div>
            <div class="title">总数</div>
          </div>
        </a-col>
      </a-row>
    </div>
  </card>
</template>

<script>
import { Card, MIcon } from '@/components'
import { deepGet } from '@/utils/util'
import events from '../events'

export default {
  components: {
    Card,
    MIcon
  },
  props: {
    data: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      overflowCount: 999
    }
  },
  computed: {
    total () {
      return deepGet(events.data, ['backup', this.data.key, 'total'], 0)
    }
  },
  methods: {
    setTotalClass () {
      if (this.total >= 0 && this.total < 100) {
        return {}
      } else if (this.total >= 100 && this.total <= this.overflowCount) {
        return {
          hundred: true
        }
      } else if (this.total > this.overflowCount) {
        return {
          overflow: true
        }
      }
    }
  }
}

</script>
<style lang='less' scoped>
  .application {
    .box-wrapper;
    box-shadow: 0 2px 8px rgba(0, 0, 0, .09);
    /deep/ .application-header {
      .title {
        .before-border(#0dc0e8);
      }
      .action {
        margin-right: 16px;
        color: rgba(255, 255, 255, .65);
      }
    }
    /deep/ .application-header-action {
      top: 50%;
      transform: translate(0, -50%);
    }
    /deep/ .application-content {
      padding-left: 16px;
    }
    /deep/ .application-icon {
      .icon-wrapper(#40c5ec, #00b1e6, #40c5ec66);
    }
  }
  .goldenCopy {
   .box-wrapper;
    /deep/ .goldenCopy-header {
      .title {
        .before-border(#0dc0e8);
      }
      .action {
        margin-right: 16px;
        color: rgba(255, 255, 255, .65);
      }
    }
    /deep/ .goldenCopy-header-action {
      top: 50%;
      transform: translate(0, -50%);
    }
    /deep/ .goldenCopy-content {
      padding-left: 16px;
    }
    /deep/ .goldenCopy-icon {
      .icon-wrapper(#f9aa40, #f89a00, #f9aa4066);
    }
  }
  .virtualCopy {
    .box-wrapper;
    /deep/ .virtualCopy-header {
      .title {
        .before-border(#0dc0e8);
      }
      .action {
        margin-right: 16px;
        color: rgba(255, 255, 255, .65);
      }
    }
    /deep/ .virtualCopy-header-action {
      top: 50%;
      transform: translate(0, -50%);
    }
    /deep/ .virtualCopy-content {
      padding-left: 16px;
    }
    /deep/ .virtualCopy-icon {
      .icon-wrapper(#61d0bd, #28c1a7, #61d0bd66);
    }
  }
  .box-wrapper {
    border-radius: 6px;
    background: linear-gradient(to right, #326dcf, #276dcf);
    transition: .3s;
  }
  .icon-wrapper(@grad1, @grad2, @border) {
    position: relative;
    width: 72px;
    height: 72px;
    margin: 0 auto;
    border: 2px solid @border;
    box-shadow: 0 3px 8px @border;
    border-radius: 50%;
    background: linear-gradient(to bottom, @grad1, @grad2);
    background-clip: padding-box;
    .icon {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 48px;
      color: rgba(255, 255, 255, .85);
    }
  }
  .total-wrapper {
    text-align: center;
    margin-right: 8px;
    .title {
      text-align: center;
      font-size: 24px;
      margin-bottom: 8px;
      color: rgba(255, 255, 255, .85);
    }
    .value {
      text-align: center;
      font-size: 48px;
      line-height: 1;
      margin-bottom: 8px;
      color: rgba(35, 239, 255, .95);
      .hundred {
        font-size: 40px;
      }
      .overflow {
        font-size: 32px;
        position: relative;
        &:after {
          content: '+';
          position: absolute;
          top: -6px;
          right: -12px;
          width: 16px;
          height: 16px;
          font-size: 16px;
          line-height: 1;
        }
      }
    }
  }
  .before-border(@color) {
    color: rgba(255, 255, 255, .85);;
    padding-left: 24px;
    font-size: 16px;
    letter-spacing: 2px;
    &:before {
      content: '';
      position: absolute;
      top: 50%;
      left: 8px;
      width: 3px;
      height: 14px;
      transform: translate(0, -50%);
      border-right: 3px solid @color;
      border-radius: 25%;
    }
  }
  .divider {
    width: 5px;
    height: 60px;
    margin: 0 auto;
    border-radius: 4px;
    background: radial-gradient(
      hsl(190, 100%, 63%) -24%,
      hsla(190, 100%, 53%, 0.825) 0%,
      hsla(190, 100%, 43%, 0.525) 30%,
      hsla(190, 100%, 33%, 0.375) 50%,
      hsla(190, 100%, 33%, 0.125) 70%,
      hsla(190, 100%, 33%, 0.025) 90%,
      hsla(190, 100%, 63%, 0) 100%
    );
  }
</style>
