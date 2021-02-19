<template>
  <div class="info-wrapper">
    <div class="flex-row">
      <detail :data="data" justify="end">
        <template #title>
          {{ record.module | convert('SYSTEM_LICENSE_MODULE') }}
        </template>
      </detail>
      <a-divider type="vertical" class="divider-vertical" />
      <detail :title="record.name" :data="poolData" justify="end" />
    </div>
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
      ],
      poolData: [
        {
          key: 'type',
          title: '池类型',
          enum: 'STORAGE_POOL_TYPE'
        },
        {
          key: 'location',
          title: '池位置',
          enum: 'STORAGE_POOL_LOCATION'
        },
        {
          key: 'capacity',
          title: '池容量',
          filter: 'unitSize'
        },
        {
          key: 'used',
          title: '已用容量',
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
      this.poolData = this.poolData.map(u => Object.assign(u, {
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
  .divider-vertical {
    margin: 0 40px;
    height: 120px;
    transform: translateY(16px);
  }
</style>
