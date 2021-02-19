<template>
  <card
    :hover="Boolean(data.name)"
    :bodyStyle="{ padding: 0 }"
    :showHeader="false"
    :wrapperClass="`dg-${data.key}`"
    :headerWrapperClass="`dg-${data.key}-header`"
    :headerActionWrapperClass="`dg-${data.key}-header-action`"
    :contentWrapperClass="`dg-${data.key}-content`"
    @click.native="$router.push({ name: data.name })"
  >
    <span slot="title" class="title">{{ data.title }}</span>
    <span slot="action" class="action">{{ data.type }}</span>
    <div style="margin-top: 16px">
      <span class="title-inline">{{ data.title }}</span>
      <a-row type="flex" align="middle" justify="space-between">
        <a-col :sm="24" :md="8" style="margin-top: 16px">
          <div :class="[`dg-${data.key}-icon`]">
            <m-icon :type="data.icon" class="icon" />
          </div>
        </a-col>
        <a-col :sm="24" :md="10">
          <div v-for="i in 4" :key="`border_${i}`" :class="setBorderClass(i)" />
          <div class="total-wrapper">
            <div class="value"><span :class="[setTotalClass(data.key)]">{{ total > overflowCount ? overflowCount : total }}</span></div>
            <div class="title">{{ data.state | convert('DG_STATE') }}</div>
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
      return deepGet(events.data, ['dg', this.data.key], 0)
    }
  },
  methods: {
    setTotalClass (key) {
      if (this.total >= 0 && this.total < 100) {
        return {
          [key]: true
        }
      } else if (this.total >= 100 && this.total <= this.overflowCount) {
        return {
          [key]: true,
          hundred: true
        }
      } else if (this.total > this.overflowCount) {
        return {
          [key]: true,
          overflow: true
        }
      }
    },
    setBorderClass (width) {
      return {
        [`border-${width}`]: true
      }
    }
  }
}

</script>

<style lang='less' scoped>
  .dg-ready, .dg-unReady {
    .box-wrapper;
    box-shadow: 0 2px 8px rgba(0, 0, 0, .09);
    /deep/ .dg-ready-header, .dg-unReady-header {
      .title {
        .before-border(#0dc0e8);
      }
      .action {
        margin-right: 16px;
        color: rgba(255, 255, 255, .65);
      }
    }
    /deep/ .dg-ready-header-action, .dg-unReady-header-action {
      top: 50%;
      transform: translate(0, -50%);
    }
    /deep/ .dg-ready-content,.dg-unReady-content {
      padding-left: 16px;
      .title-inline {
        position: absolute;
        top: 8px;
        left: 8px;
        .before-border(#0dc0e8);
      }
    }
    /deep/ .dg-ready-icon, .dg-unReady-icon {
      .icon-wrapper(#40c5ec, #00b1e6, #40c5ec66);
    }
  }
  .box-wrapper {
    position: relative;
    overflow: hidden;
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
      .ready {
        color: #00b847;
      }
      .unReady {
        color: #de4f4c;
      }
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
  .border-1 {
    .border-num(1)
  }
  .border-2 {
    .border-num(2)
  }
  .border-3 {
    .border-num(3)
  }
  .border-4 {
    .border-num(4)
  }
  @width: 200px;
  .border-num(@num) {
    position: absolute;
    top: 50%;
    left: 50%;
    width: calc(@width - @width / 10 * @num);
    height: calc(@width - @width / 10 * @num);
    transform: translate(-50%, -50%);
    border: 3px - 3px / 5 * @num dashed #e2e2e2;
    border-radius: 50%;
    overflow: hidden;
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
</style>
