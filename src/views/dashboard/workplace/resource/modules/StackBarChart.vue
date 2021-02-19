<template>
  <div :id="`resource_${this.data.key}`" style="height: 100px" />
</template>

<script>
import { Chart } from '@antv/g2'
import { deepGet, isEmpty } from '@/utils/util'
import events from '../../events'

const chart = {
  alert: null
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
  data () {
    return {
      colors: {
        alert: ['#fb4f3b', '#df3327']
      }
    }
  },
  computed: {
    _ () {
      return events.data[this.data.key]
    }
  },
  watch: {
    _: {
      handler (value) {
        this.loadData()
      },
      deep: true
    }
  },
  methods: {
    loadData () {
      const data = [
        { key: '任务', value: deepGet(this._, 'taskTotal', 0) },
        { key: '系统', value: deepGet(this._, 'systemTotal', 0) }
      ]
      const container = `resource_${this.data.key}`
      chart[container] && chart[container].destroy()
      chart[container] = new Chart({
        container,
        autoFit: true,
        height: 100
      })
      chart[container].data(data)
      chart[container].tooltip(false)
        .legend(false)
        .axis(false)
      chart[container]
        .interval()
        .position('key*value')
        .color('key', this.colors[this.data.key])
        .label('value', val => {
          return {
            position: 'bottom',
            offset: 8,
            content: originData => originData.value + '\n' + originData.key,
            style: {
              fill: 'rgba(255, 255, 255, .65)'
            }
          }
        })
        .style({
          lineWidth: 0,
          shadowColor: 'rgba(0, 0, 0, .1)',
          shadowBlur: 8,
          shadowOffsetX: 4,
          shadowOffsetY: 4,
          stroke: 'r(0.5, 0.5, 0.1) 0:#ffffff .5:#ededed  1:#ffffff'
        })
      chart[container].render()
    },
    isEmpty
  }

}
</script>
