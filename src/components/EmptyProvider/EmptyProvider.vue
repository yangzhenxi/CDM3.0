<template>
  <div class="empty-provider">
    <div v-if="isEmpty" :style="{ minHeight: `${minHeight}px` }">
      <div v-if="!$slots.empty" class="empty-item">
        <component :is="component" v-bind="itemProps"></component>
      </div>
      <slot name="empty"></slot>
    </div>
    <template v-else>
      <slot></slot>
    </template>
  </div>
</template>

<script>
import { State } from './Item'

export default {
  name: 'EmptyProvider',
  components: {
    State
  },
  props: {
    isEmpty: {
      type: Boolean,
      default: false
    },
    component: {
      type: String,
      default: 'state'
    },
    itemProps: {
      type: Object,
      default () {
        return {}
      }
    },
    minHeight: {
      type: Number,
      default: 256
    }
  }
}

</script>

<style lang="less" scoped>
  .empty-provider {
    position: relative;
    width: 100%;
    .empty-item {
      position: absolute;
      top: 50%;
      left: 50%;
      margin: 0;
      transform: translate(-50%, -50%);
    }
  }
</style>
