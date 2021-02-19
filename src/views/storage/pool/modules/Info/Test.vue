<template>
  <detail :data="data" justify="end" />
</template>

<script>
import { testPool } from '@/api/storage/pool'
import { Detail } from '@/components'
import { deepGet } from '@/utils/util'

export default {
  components: {
    Detail
  },
  data () {
    return {
      data: [
        {
          key: 'bandWidthRead',
          title: 'IO 读',
          value: 0,
          filter: 'unitSize'
        },
        {
          key: 'bandWidthWrite',
          title: 'IO 写',
          value: 0,
          filter: 'unitSize'
        },
        {
          key: 'operationsRead',
          title: 'IOPS 读',
          value: 0,
          filter: 'unitSize'
        },
        {
          key: 'operationsWrite',
          title: 'IOPS 写',
          value: 0,
          filter: 'unitSize'
        }
      ],
      id: null
    }
  },
  created () {
    this.id = this.$route.params.id
    this.loadData()
  },
  methods: {
    async loadData () {
      const test = deepGet(await testPool({
        id: this.id
      }), 'data', {})
      this.data = this.data.map(u => Object.assign(u, {
        value: deepGet(test, u.key, 0)
      }))
    },
    onOk () {
      return new Promise(async (resolve, reject) => {
        resolve(true)
      })
    }
  }
}
</script>
