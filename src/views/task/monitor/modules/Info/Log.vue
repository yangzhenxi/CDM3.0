<template>
  <div>
    <h3 style="margin-bottom: 16px">{{ title }}</h3>
    <a-spin :spinning="loading">
      <empty-provider :isEmpty="isEmpty" :itemProps="empty" :minHeight="280" style="height: 280px; overflow-y: auto">
        <p v-for="(item, index) in log" :key="index">
          {{ item }}
        </p>
      </empty-provider>
    </a-spin>
  </div>
</template>

<script>
import { EmptyProvider } from '@/components'
import { deepGet, isEmpty } from '@/utils/util'
import events from '../events'

export default {
  components: {
    EmptyProvider
  },
  data () {
    return {
      title: '日志',
      log: [],
      isEmpty: true,
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
    },
    'o.selected' () {
      this.loadData()
    }
  },
  created () {
    this.id = this.$route.params.id
    this.loading = true
    events.$off(`refresh-log-${this.id}`)
    events.$on(`refresh-log-${this.id}`, () => {
      this.loading = true
      this.loadData()
    })
  },
  methods: {
    loadData () {
      this.log = deepGet(this.o.record, ['workflow', 'workUnits', this.o.selected.index, 'log'], '').split('\n')
      this.isEmpty = false
      this.loading = false
    },
    deepGet
  }
}

</script>
