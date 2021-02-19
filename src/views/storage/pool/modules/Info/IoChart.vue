<template>
  <div>
    <h3 style="margin-bottom: 16px">{{ title }}</h3>
    <a-spin :spinning="loading">
      <empty-provider :isEmpty="o.metric.isEmpty" :itemProps="o.metric.empty" :minHeight="150">
        <div :id="`pool_io_${id}`" style="height: 150px" />
      </empty-provider>
    </a-spin>
  </div>
</template>

<script>
import { Chart } from '@antv/g2'
import { getPoolMetric } from '@/api/storage/pool'
import { EmptyProvider, MIcon } from '@/components'
import { convert, dateToUnix, deepGet, DouglasPeucker, handleFetchStateErrorDone, transformArray } from '@/utils/util'
import events from '../events'

const charts = {}

export default {
  components: {
    EmptyProvider,
    MIcon
  },
  data () {
    return {
      title: '读写情况',
      loading: false,
      id: null,
      o: {
        metric: {
          data: [],
          isEmpty: false,
          empty: {
            state: 'empty',
            data: null
          }
        }
      }
    }
  },
  mounted () {
    this.id = this.$route.params.id
    events.$off(`refresh-metric-io-${this.id}`)
    events.$on(`refresh-metric-io-${this.id}`, () => {
      this.loadData()
    })
    this.loadData()
  },
  methods: {
    async loadData () {
      try {
        this.o = {
          id: this.id,
          metric: {
            data: [],
            isEmpty: false,
            empty: {
              state: 'empty',
              data: null
            }
          }
        }
        this.loading = true
        let read = []
        let write = []
        this.o.metric.data = deepGet(await getPoolMetric({
          id: this.id,
          startAt: dateToUnix() - 60 * 60 * 24,
          endAt: dateToUnix()
        }), 'data', [])
        transformArray(events.data, { id: this.id }, this.o)
        this.o.metric.data.map(u => {
          read.push({
            key: deepGet(u, 'timestamp'),
            type: '读',
            value: deepGet(u, 'bandWidthRead', 0)
          })
          write.push({
            key: deepGet(u, 'timestamp'),
            type: '写',
            value: deepGet(u, 'bandWidthWrite', 0)
          })
        })
        read = DouglasPeucker(read)
        write = DouglasPeucker(write)
        const container = `pool_io_${this.id}`
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
              formatter: value => convert(value, 'unitSize')
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
      } catch (error) {
        this.o.metric.isEmpty = true
        this.o.metric.empty = handleFetchStateErrorDone(error)
        transformArray(events.data, { id: this.id }, this.o)
        this.loading = false
      }
    }
  }
}
</script>
