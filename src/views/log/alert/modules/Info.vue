<template>
  <a-result
    ref="info"
    title="xxx 错误"
    :subTitle="deepGet(record, 'event')"
    :status="deepGet(record, 'eventLevel')"
    class="info-result"
  >
    <template #extra>
      <a-button type="primary" @click="$root.handleOk()">
        {{ $t('layouts.modal.submit') }}
      </a-button>
    </template>
  </a-result>
</template>

<script>
import { deepGet } from '@/utils/util'

export default {
  props: {
    record: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  methods: {
    deepGet
  }
}
</script>

<style lang="less" scoped>
  .info-result {
    padding: 16px 0 0 0;
  }
</style>
