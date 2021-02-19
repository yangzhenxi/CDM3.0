<template>
  <div class="pool-wrapper">
    <div class="clip-path" />
    <card
      :bodyStyle="{ padding: 0 }"
      :wrapperClass="data.key"
      :headerWrapperClass="`${data.key}-header`"
      :headerActionWrapperClass="`${data.key}-header-action`"
      :contentWrapperClass="`${data.key}-content`"
      @click.native="$router.push({ name: data.name })"
    >
      <span slot="title" class="title">{{ data.title }}</span>
      <div v-if="['io', 'iops'].includes(data.key)" slot="action" class="action">
        <s-tab v-model="events.storage.selectedPoolKey" @change="handlePoolChange">
          <s-tab-item v-for="i in events.storage.poolList" :key="i.name" :tab="i.name" />
        </s-tab>
      </div>
      <empty-provider :isEmpty="!events.storage.poolList.length" :minHeight="200">
        <div style="margin-top: 16px">
          <a-row type="flex" align="middle" justify="space-between">
            <a-col :sm="24" :md="24" style="cursor: auto" @click.stop>
              <stack-bar-chart v-if="data.key === 'pool'" :data="{ key: data.key }" @change="handlePoolChange"/>
              <line-chart v-else :data="{ key: data.key }"/>
            </a-col>
          </a-row>
        </div>
      </empty-provider>
    </card>
  </div>
</template>

<script>
import { Card, EmptyProvider, MIcon, STab } from '@/components'
import { LineChart, StackBarChart } from './modules'
import events from '../events'
const STabItem = STab.Item

export default {
  components: {
    Card,
    EmptyProvider,
    MIcon,
    STab,
    STabItem,
    LineChart,
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
      events
    }
  },
  methods: {
    handlePoolChange (value) {
      events.storage.selectedPoolKey = value
    }
  }
}
</script>

<style lang='less' scoped>
  .pool-wrapper {
    position: relative;
    border-radius: 28px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, .09);
    transition: .3s all;
    &:hover {
      cursor: pointer;
      background: rgba(0, 0, 0, 0);
      border-color: rgba(0, 0, 0, .09);
      box-shadow: 0 4px 8px rgba(0, 0, 0, .2);
    }
    .clip-path {
      position: absolute;
      width: 100%;
      height: 100%;
      background: @gray-1;
      @width: 2px;
      @edge: 16px;
      clip-path: polygon(
        @edge 0,
        calc(@edge + @width / sqrt(2)) @width,
        @width calc(@edge + @width / sqrt(2)),
        @width calc(100% - (@edge + @width / sqrt(2))),
        calc(@edge + @width / sqrt(2)) calc(100% - @width),
        calc(100% - @edge - @width / sqrt(2)) calc(100% - @width),
        calc(100% - @width) calc(100% - @edge - @width / sqrt(2)),
        calc(100% - @width)  calc(@edge + @width / sqrt(2)),
        calc(100% - @edge - @width / sqrt(2)) @width,

        calc(100% / 3 * 2 + @width) @width,
        calc(100% / 3 * 2 ) calc(@width * 2),
        calc(100% / 3) calc(@width * 2),
        calc(100% / 3 - @width) @width,

        calc(@edge + @width / sqrt(2)) @width,
        @edge 0,

        calc(100% / 3) 0,
        calc(100% / 3 + @width) @width,
        calc(100% / 3 * 2 - @width) @width,
        calc(100% / 3 * 2) 0,

        calc(100% - @edge)  0,
        100% @edge,
        100% calc(100% - @edge),
        calc(100% - @edge) 100%,
        @edge 100%,
        0 calc(100% - @edge),
        0 @edge
      );
      z-index: 2;
    }
    .pool {
      padding: 2px;
      background: rgba(0, 0, 0, 0);
      /deep/ .pool-header {
        border-radius: 18px 18px 0 0;
        background: linear-gradient(to bottom, @gray-1, @gray-4);
        z-index: 1;
        .title {
          margin-left: 16px;
          color: #3771cd;
        }
      }
      /deep/ .pool-content {
        margin: 0;
        border-radius: 0 0 18px 18px;
        background: linear-gradient(to bottom, @gray-1, @gray-4);
        z-index: 1;
      }
    }
    .io {
      padding: 2px;
      background: rgba(0, 0, 0, 0);
      /deep/ .io-header {
        border-radius: 18px 18px 0 0;
        background: linear-gradient(to bottom, @gray-1, @gray-4);
        z-index: 1;
        .title {
          margin-left: 16px;
          color: #3771cd;
        }
        .action {
          margin-right: 16px;
          color: #3771cd;
        }
      }
      /deep/ .io-header-action {
        top: 50%;
        transform: translate(0, -50%);
      }
      /deep/ .io-content {
        margin: 0;
        border-radius: 0 0 18px 18px;
        background: linear-gradient(to bottom, @gray-1, @gray-4);
        z-index: 1;
      }
    }
    .iops {
      padding: 2px;
      background: rgba(0, 0, 0, 0);
      /deep/ .iops-header {
        border-radius: 18px 18px 0 0;
        background: linear-gradient(to bottom, @gray-1, @gray-4);
        z-index: 1;
        .title {
          margin-left: 16px;
          color: #3771cd;
        }
         .action {
          margin-right: 16px;
          color: #3771cd;
        }
      }
      /deep/ .iops-header-action {
        top: 50%;
        transform: translate(0, -50%);
      }
      /deep/ .iops-content {
        margin: 0;
        border-radius: 0 0 18px 18px;
        background: linear-gradient(to bottom, @gray-1, @gray-4);
        z-index: 1;
      }
    }
  }
  /deep/ .ant-tabs-bar {
    border-bottom: none;
  }
  /deep/ .ant-tabs .ant-tabs-small-bar .ant-tabs-tab {
    padding: 4px 16px;
  }
  /deep/ .ant-tabs-ink-bar {
    background-color: #ffffff00;
  }

</style>
