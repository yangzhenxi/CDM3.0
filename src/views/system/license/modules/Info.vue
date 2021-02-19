<template>
  <div class="info-wrapper">
    <detail :data="data" justify="end">
      <template #title>
        {{ record.module | convert('SYSTEM_LICENSE_MODULE') }}
      </template>
    </detail>
    <div style="margin-top: 16px">
      <a-button type="primary" @click="$root.handleOk()">
        {{ $t('layouts.modal.submit') }}
      </a-button>
    </div>
  </div>
</template>

<script>
import { Detail } from '@/components'

export default {
  components: {
    Detail
  },
  props: {
    record: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      data: [
        {
          key: 'createdAt',
          title: '授权时间',
          filter: 'unixToDate'
        },
        {
          key: 'expireDate',
          title: '过期时间',
          filter: 'unixToDate'
        },
        {
          key: 'company',
          title: '授权单位'
        },
        {
          key: 'capacity',
          title: '授权容量',
          filter: 'unitSize'
        }
      ]
    }
  },
  created () {
    this.loadData()
  },
  methods: {
    loadData () {
      this.data = this.data.map(u => Object.assign(u, {
        value: this.record[u.key]
      }))
    }
  }
}
</script>

<style lang="less" scoped>
  .info-wrapper {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }
</style>
