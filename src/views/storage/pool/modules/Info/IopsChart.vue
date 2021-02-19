<template>
  <div>
    <h3 style="margin-bottom: 16px">{{ title }}</h3>
    <a-spin :spinning="loading">
      <empty-provider :isEmpty="isEmpty" :itemProps="empty" :minHeight="150">
        <div :id="`pool_iops_${id}`" style="height: 150px" />
      </empty-provider>
    </a-spin>
  </div>
</template>

<script>
import { Chart } from '@antv/g2'
import { EmptyProvider, MIcon } from '@/components'
import { convert, deepGet, DouglasPeucker, isEmpty } from '@/utils/util'
import events from '../events'

const charts = {}

export default {
  components: {
    EmptyProvider,
    MIcon
  },
  data () {
    return {
      title: 'IOPS 情况',
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
    'o.metric.data': {
      handler (value) {
        if (!isEmpty(value)) {
          this.loading = true
          this.loadData()
        } else {
          this.loading = false
          this.isEmpty = deepGet(this.o.metric, 'isEmpty')
          this.empty = deepGet(this.o.metric, 'empty')
        }
      },
      deep: true
    }
  },
  mounted () {
    this.id = this.$route.params.id
    this.loading = true
    events.$off(`refresh-metric-iops-${this.id}`)
    events.$on(`refresh-metric-iops-${this.id}`, () => {
      this.loading = true
      this.loadData()
    })
  },
  methods: {
    loadData () {
      let read = []
      let write = []
      deepGet(this.o.metric, 'data', []).map(u => {
        read.push({
          key: deepGet(u, 'timestamp'),
          type: '读',
          value: deepGet(u, 'operationsRead', 0)
        })
        write.push({
          key: deepGet(u, 'timestamp'),
          type: '写',
          value: deepGet(u, 'operationsWrite', 0)
        })
      })
      read = DouglasPeucker(read)
      write = DouglasPeucker(write)
      const container = `pool_iops_${this.id}`
      charts[container] && charts[container].destroy()
      delete charts[container]
      charts[container] = new Chart({
        container,
        autoFit: true,
        height: 150
      })
      charts[container].data([...read, ...write])
      charts[container].tooltip({
        showCrosshairs: true,
        shared: true
      })
      charts[container]
        .scale({
          key: {
            formatter: value => convert(value, 'unixToDate')
          },
          value: {
            type: 'quantize',
            formatter: value => convert(value, 'unitSpeed')
          }
        })
        .axis('key', {
          label: {
            autoRotate: false
          }
        })
      charts[container]
        .line()
        .position('key*value')
        .color('type')
        .shape('smooth')
      charts[container].render()
      this.loading = false
    }
  }
}
</script>
