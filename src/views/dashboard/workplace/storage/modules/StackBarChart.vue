<template>
  <div id="storage_pool" style="height: 200px" />
</template>

<script>
import { Chart } from '@antv/g2'
import { convert, deepGet } from '@/utils/util'
import events from '../../events'

const chart = {
  storage_pool: null
}

export default {
  props: {
    data: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  mounted () {
    this.loadData()
  },
  methods: {
    loadData () {
      const data = events.storage.poolList.map(u => ([
        {
          key: u?.name,
          type: '空闲容量',
          value: deepGet(u, 'free', 0)
        },
        {
          key: u?.name,
          type: '已用容量',
          value: deepGet(u, 'available', 0)
        }
      ])).flat()
      const container = 'storage_pool'
      chart[container] && chart[container].destroy()
      chart[container] = new Chart({
        container,
        autoFit: true,
        height: 200
      })
      chart[container].data(data)
      chart[container].axis(false)
      chart[container]
        .scale({
          value: {
            type: 'quantize',
            formatter: value => convert(value, 'unitSize')
          }
        })
        .axis('key', {
          label: {
            autoRotate: false
          }
        })
      chart[container]
        .interval()
        .position('key*value')
        .color('type', ['#e2e2e2', '#72bbff'])
        .adjust('stack')
        .style('key', key => {
          return {
            cursor: 'pointer',
            lineWidth: events.storage.selectedPoolKey === key ? 1 : 0,
            shadowColor: events.storage.selectedPoolKey === key ? 'rgba(0, 0, 0, .15)' : '',
            shadow: 'rgba(0, 0, 0, .15)',
            shadowBlur: 12,
            shadowOffsetX: 2,
            shadowOffsetY: 8,
            stroke: 'r(0.5, 0.5, 0.1) 0:#72bbff44 .5:#72bbff66  1:#72bbff44'
          }
        })
      chart[container].on('element:click', (ev) => {
        events.storage.selectedPoolKey = ev.data.data.key
        chart[container].render(true)
      })
      chart[container].render()
    }
  }
}
</script>
