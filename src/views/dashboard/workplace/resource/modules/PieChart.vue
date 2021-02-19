<template>
  <div :id="`resource_${this.data.key}`" style="height: 100px" />
</template>

<script>
import { Chart } from '@antv/g2'
import { deepGet, isEmpty } from '@/utils/util'
import events from '../../events'

const chart = {
  lblet: null,
  virtual: null,
  component: null
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
        lblet: ['#c2e2ff', '#043fbd'],
        component: ['#cfbeff', '#611fb1'],
        virtual: ['#a9f7ff', '#097581']
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
        { key: '正常', value: deepGet(this._, 'ready', 0) },
        { key: '异常', value: deepGet(this._, 'total', 0) - deepGet(this._, 'ready', 0) }
      ]
      const container = `resource_${this.data.key}`
      chart[container] && chart[container].destroy()
      chart[container] = new Chart({
        container,
        autoFit: true,
        height: 100
      })
      chart[container].data(data)
      chart[container].coordinate('theta', {
        radius: 1,
        innerRadius: 0.8
      })
      chart[container].tooltip(false)
        .legend(false)
      chart[container]
        .annotation()
        .text({
          position: ['50%', '50%'],
          content: '正常',
          style: {
            fontSize: 12,
            fill: 'rgba(255, 255, 255, .65)',
            textAlign: 'center'
          },
          offsetY: -10
        })
        .text({
          position: ['50%', '50%'],
          content: deepGet(this._, 'total', 0),
          style: {
            fontSize: 18,
            fill: 'rgba(255, 255, 255, .65)',
            textAlign: 'center'
          },
          offsetY: 10
        })
      chart[container]
        .interval()
        .adjust('stack')
        .position('value')
        .color('key', this.colors[this.data.key])
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
