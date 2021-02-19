<template>
  <div>
    <h3 style="margin-bottom: 16px">
      <m-icon type="node" />
      {{ title }}
    </h3>
    <a-spin :spinning="loading">
      <empty-provider :isEmpty="isEmpty" :itemProps="empty">
        <div :id="`pool_capacity_${id}`" style="height: 300px"/>
      </empty-provider>
    </a-spin>
  </div>
</template>

<script>
import { Chart, Util } from '@antv/g2'
import { EmptyProvider, MIcon } from '@/components'
import { convert, deepGet, isEmpty } from '@/utils/util'
import events from '../events'

const charts = {}

export default {
  components: {
    EmptyProvider,
    MIcon
  },
  data () {
    return {
      title: '容量使用情况',
      isEmpty: false,
      empty: {
        state: 'empty',
        data: null
      },
      loading: false,
      id: null
    }
  },
  computed: {
    o () {
      return events.data.find(u => u?.id === this.id) || {}
    }
  },
  watch: {
    'o.record': {
      handler (value) {
        if (!isEmpty(value)) {
          this.loading = true
          this.loadData()
        } else {
          this.loading = false
          this.isEmpty = this.o.isEmpty
          this.empty = this.o.empty
        }
      },
      deep: true
    }
  },
  mounted () {
    this.id = this.$route.params.id
    this.loading = true
    events.$off(`refresh-capacity-${this.id}`)
    events.$on(`refresh-capacity-${this.id}`, () => {
      this.loading = true
      this.loadData()
    })
  },
  methods: {
    loadData () {
      const data = [
        { key: '已使用', value: +(deepGet(this.o.record, 'capacity', 0) - deepGet(this.o.record, 'free', 0)) },
        { key: '未使用', value: +deepGet(this.o.record, 'free', 0) }
      ]
      const container = `pool_capacity_${this.id}`
      charts[container] && charts[container].destroy()
      delete charts[container]
      charts[container] = new Chart({
        container,
        autoFit: true,
        height: 300
      })
      charts[container].data(data)
      charts[container].scale('value', {
        formatter: (val) => convert(val, 'unitSize')
      })
      charts[container].coordinate('theta', {
        radius: 0.75,
        innerRadius: 0.6
      })
      charts[container].tooltip({
        showTitle: false,
        showMarkers: false
      })
      charts[container]
        .annotation()
        .text({
          position: ['50%', '50%'],
          content: '容量',
          style: {
            fontSize: 14,
            fill: '#8c8c8c',
            textAlign: 'center'
          },
          offsetY: -20
        })
        .text({
          position: ['50%', '50%'],
          content: convert(deepGet(this.o.record, 'capacity', 0), 'unitSize'),
          style: {
            fontSize: 16,
            fill: '#8c8c8c',
            textAlign: 'center'
          },
          offsetY: 20
        })
      charts[container]
        .interval()
        .adjust('stack')
        .position('value')
        .color('key', ['#ddd', '#12bd5e'])
        .label('value', (value) => {
          return {
            content: (data) => {
              return `${data.key}: ${convert(value, 'unitSize')}`
            }
          }
        })
        .state({
          active: {
            style: (element) => {
              const shape = element.shape
              return {
                matrix: Util.zoom(shape, 1.0)
              }
            }
          }
        })
      charts[container].interaction('element-single-selected')
      charts[container].render()
      this.loading = false
    }
  }
}
</script>
