<template>
  <div :id="`storage_metric_${this.data.key}`" style="height: 200px" />
</template>

<script>
import { Chart } from '@antv/g2'
import { convert, deepGet, DouglasPeucker } from '@/utils/util'
import events from '../../events'

const chart = {
  storage_metric_io: null,
  storage_metric_iops: null
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
      events
    }
  },
  watch: {
    'events.storage.selectedPoolKey' () {
      const container = `storage_metric_${this.data.key}`
      chart[container].data(this.getData())
      chart[container].render(true)
    }
  },
  mounted () {
    this.loadData()
  },
  methods: {
    loadData () {
      const container = `storage_metric_${this.data.key}`
      chart[container] && chart[container].destroy()
      chart[container] = new Chart({
        container,
        autoFit: true,
        height: 200
      })
      chart[container].data(this.getData())
      chart[container].tooltip({
        showCrosshairs: true,
        shared: true
      })
      chart[container]
        .scale({
          key: {
            formatter: value => convert(value, 'unixToDate')
          },
          value: {
            type: 'quantize',
            formatter: value => convert(value, this.data.key === 'io' ? 'unitSize' : 'unitSpeed')
          }
        })
        .axis('key', {
          label: {
            autoRotate: false
          }
        })
      chart[container]
        .line()
        .position('key*value')
        .color('type', type => type === '读' ? this.data.key === 'io' ? '#c8a6f9' : '#fca055' : '#72bbff')
        .shape('smooth')
      chart[container]
        .area()
        .position('key*value')
        .color('type', type => type === '读' ? this.data.key === 'io'
          ? 'l(100) 0:#c8a6f9 1:#fff'
          : 'l(100) 0:#fca055 1:#fff'
          : 'l(100) 0:#72bbff 1:#fff'
        )
        .shape('smooth')
        .tooltip(false)
      chart[container].render()
    },
    getData () {
      const pool = events.storage.poolList.find(u => u?.name === events.storage.selectedPoolKey)
      const readKey = this.data.key === 'io' ? 'bandWidthRead' : 'operationsRead'
      const writeKey = this.data.key === 'io' ? 'bandWidthWrite' : 'operationsWrite'
      let read = []
      let write = []
      pool.metric.map(u => {
        read.push({
          key: u?.timestamp,
          type: '读',
          value: deepGet(u, readKey, 0)
        })
        write.push({
          key: u?.timestamp,
          type: '写',
          value: deepGet(u, writeKey, 0)
        })
      })
      read = DouglasPeucker(read)
      write = DouglasPeucker(write)
      return [...read, ...write]
    }
  }
}
</script>
