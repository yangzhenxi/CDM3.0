<template>
  <card
    :bodyStyle="{ padding: 0 }"
    :wrapperClass="data.key"
    :headerWrapperClass="`${data.key}-header`"
    :contentWrapperClass="`${data.key}-content`"
    @click.native="$router.push({ name: data.name })"
  >
    <span slot="title" class="title">{{ data.title }}</span>
    <a-row type="flex" align="middle" justify="space-between">
      <a-col :sm="12" :md="12" style="cursor: auto" @click.stop>
        <pie-chart v-if="data.key !== 'alert'" :data="{ key: data.key }" />
        <stack-bar-chart v-else :data="{ key: data.key }" />
      </a-col>
      <a-col :sm="10" :md="10">
        <div class="total">
          <div class="value"><span :class="[setTotalClass()]">{{ total > overflowCount ? overflowCount : total }}</span></div>
          <div class="title">总数</div>
        </div>
      </a-col>
    </a-row>
  </card>
</template>

<script>
import { Card } from '@/components'
import { deepGet } from '@/utils/util'
import { PieChart, StackBarChart } from './modules'
import events from '../events'

export default {
  components: {
    Card,
    PieChart,
    StackBarChart
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
      return deepGet(events.data, [this.data.key, 'total'], 0)
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
  .lblet {
    border: 2px transparent solid;
    box-shadow: 0 2px 8px #5f97f922;
    border-image: linear-gradient(135deg, #4678ed, #5f97f9) 1 10;
    &:hover {
      cursor: pointer;
      box-shadow: 3px 3px 8px 0px #5f97f966;
    }
    /deep/ .lblet-header {
      background: linear-gradient(to right, #4e82f2, #4779ee);
      .title {
        .before-border(#86c8ff);
      }
    }
    /deep/ .lblet-content {
      margin: 0;
      padding: 16px 4px;
      background: linear-gradient(135deg, #6aa7ff 0%, #558bf6 50%, #4476ec 100%);
    }
  }
  .virtual {
    border: 2px transparent solid;
    box-shadow: 0 2px 8px #72ced322;
    border-image: linear-gradient(135deg, #86d3d6, #72ced3) 1 10;
    &:hover {
      cursor: pointer;
      box-shadow: 3px 3px 8px 0px #72ced366;
    }
    /deep/ .virtual-header {
      background: linear-gradient(to right, #38c6d7, #32c5d7);
      .title {
        .before-border(#c5fcff);
      }
    }
    /deep/ .virtual-content {
      margin: 0;
      padding: 16px 4px;
      background: linear-gradient(135deg, #9ad8d8 0%, #45c2ce 50%, #00aec6 100%);
    }
  }
  .component {
    border: 2px transparent solid;
    box-shadow: 0 2px 8px #ad9aeb22;
    border-image: linear-gradient(135deg, #8b6af7, #ad9aeb) 1 10;
    &:hover {
      cursor: pointer;
      box-shadow: 3px 3px 8px 0px #ad9aeb66;
    }
    /deep/ .component-header {
      background: linear-gradient(to right, #865afc, #814ffc);
      .title {
        .before-border(#f7d9ff);
      }
    }
    /deep/ .component-content {
      margin: 0;
      padding: 16px 4px;
      background: linear-gradient(135deg, #bba8ec 0%, #9773f7 50%, #7a46ff 100%);
    }
  }
  .alert {
    border: 2px transparent solid;
    box-shadow: 0 2px 8px #fb5e4f22;
    border-image: linear-gradient(135deg, #f96152, #fb5e4f) 1 10;
    &:hover {
      cursor: pointer;
      box-shadow: 3px 3px 8px 0px #fb5e4f66;
    }
    /deep/ .alert-header {
      background: linear-gradient(to right, #f15c4d, #eb5b4d);
      .title {
        .before-border(#ffe2e2);
      }
    }
    /deep/ .alert-content {
      margin: 0;
      padding: 16px 4px;
      background: linear-gradient(135deg, #ff7e79 0%, #fc6d62 50%, #fa5d4e 100%);
    }
  }
  .total {
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
      color: rgba(255, 255, 255, .95);
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
    color: rgba(255, 255, 255, .85);
    padding-left: 16px;
    font-size: 16px;
    letter-spacing: 2px;
    &:before {
      content: '';
      position: absolute;
      top: 50%;
      left: 0;
      width: 3px;
      height: 14px;
      transform: translate(0, -50%);
      border-right: 3px solid @color;
      border-radius: 25%;
    }
  }
</style>
