<template>
  <div v-if="active.key" :class="['tab-wrapper', theme]">
    <div :class="['prev', localIndex === 0 ? 'disabled': '']" @click.stop="prev">
      <a-icon v-if="!$slots.prev" slot="prev" type="left"/>
      <slot name="prev"></slot>
    </div>
    <div class="tab-content">
      <div class="tab">
        <slot></slot>
      </div>
    </div>
    <div :class="['next', localIndex === children.length - 1 ? 'disabled': '']" @click.stop="next">
      <a-icon v-if="!$slots.next" slot="next" type="right"/>
      <slot name="next"></slot>
    </div>
  </div>
  <div v-else>
    <span v-if="!$slots.empty">暂无数据</span>
    <slot name="empty"></slot>
  </div>
</template>

<script>
import { filterEmpty } from '../_util/util'

const Item = {
  name: 'TabItem',
  props: {
    tab: {
      type: String,
      default: ''
    }
  },
  inject: ['active'],
  render () {
    return (
      <div class={{ 'tab-item': true, 'active': this.active.key === this.$vnode.key }}>{this.$props.tab}</div>
    )
  }
}

export default {
  name: 'STab',
  Item,
  model: {
    prop: 'activeKey',
    event: 'change'
  },
  props: {
    activeKey: {
      type: [String, Number],
      required: false,
      default () {
        return ''
      }
    },
    theme: {
      type: String,
      default: 'light'
    }
  },
  provide () {
    return {
      active: this.active
    }
  },
  data () {
    return {
      localIndex: 0,
      children: [],
      active: { // provide 响应性
        key: null
      }
    }
  },
  watch: {
    activeKey: {
      handler (key) {
        this.children = filterEmpty(this.$slots['default'])
        this.localIndex = this.children.findIndex(u => u.key === key)
        this.active.key = this.localIndex !== -1 ? key : this.children[0]?.key
      },
      immediate: true
    }
  },

  methods: {
    prev () {
      this.localIndex =
        this.localIndex - 1 >= 0
          ? this.localIndex - 1
          : this.localIndex
      this.active.key = this.children[this.localIndex].key
      this.$emit('change', this.active.key)
    },
    next () {
      this.localIndex =
        this.localIndex + 1 < this.children.length
          ? this.localIndex + 1
          : this.localIndex
      this.active.key = this.children[this.localIndex].key
      this.$emit('change', this.active.key)
    }
  }
}
</script>
<style lang='less' scoped>
  .tab-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    .tab-content {
      color: @heading-color;
      .tab {
        display: flex;
        align-items: center;
        justify-content: center;
        .tab-item {
          display: none;
          padding: 0 4px;
          &.active {
            display: block;
          }
        }
      }
    }
    .prev {
      margin-right: 8px;
    }
    .next {
      margin-left: 8px;
    }
    .prev,
    .next {
      cursor: pointer;
      &.disabled {
        opacity: 0.65;
        cursor: not-allowed;
      }
    }
    &.dark {
      .tab-content {
        .tab {
          .tab-item {
            color: rgba(255, 255, 255, 0.85);
          }
        }
      }
      .prev {
        color: rgba(255, 255, 255, 0.85);
      }
      .next {
        color: rgba(255, 255, 255, 0.85);
      }
    }
  }
</style>
