<template>
  <a-card
    :loading="loading"
    :bodyStyle="bodyStyle"
    :class="[wrapperClass, hover ? 'card-hover' : '']"
    :bordered="false"
  >
    <div v-if="showHeader" :class="['card-header', headerWrapperClass]">
      <div class="meta">
        <span class="card-title">
          <slot name="title">
            {{ title }}
          </slot>
        </span>
        <span class="card-extra">
          <slot name="extra"></slot>
        </span>
        <span :class="['card-action', headerActionWrapperClass]">
          <slot name="action"></slot>
        </span>
      </div>
    </div>
    <div :class="['card-content', contentWrapperClass]">
      <slot></slot>
    </div>
    <div v-if="$slots && $slots.footer" class="card-footer">
      <div class="field">
        <slot name="footer"></slot>
      </div>
    </div>
  </a-card>
</template>

<script>
export default {
  name: 'Card',
  props: {
    title: {
      type: String,
      default: ''
    },
    loading: {
      type: Boolean,
      default: false
    },
    hover: {
      type: Boolean,
      default: false
    },
    bodyStyle: {
      type: Object,
      default () {
        return { padding: '20px 24px 8px' }
      }
    },
    showHeader: {
      type: Boolean,
      default: true
    },
    wrapperClass: {
      type: String,
      default: ''
    },
    headerWrapperClass: {
      type: String,
      default: ''
    },
    headerActionWrapperClass: {
      type: String,
      default: ''
    },
    contentWrapperClass: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="less" scoped>
  .card-hover {
    translate: .3s all;
    &:hover {
      cursor: pointer;
      border-color: rgba(0, 0, 0, .09);
      box-shadow: 0 4px 8px rgba(0, 0, 0, .2);
      transform: translateY(-3px);
    }
  }
  .card-header {
    position: relative;
    overflow: hidden;
    width: 100%;
    padding: 8px;
    .meta {
      position: relative;
      display: flex;
      align-items: center;
      overflow: hidden;
      width: 100%;
      height: 32px;
      color: @text-color-secondary;
      font-size: 15px;
      line-height: 24px;
    }
  }
  .card-extra {
    margin-left: 24px;
  }
  .card-action {
    cursor: pointer;
    position: absolute;
    top: 0;
    right: 0;
  }
  .card-footer {
    border-top: 1px solid @gray-4;
    padding-top: 9px;
    margin-top: 8px;

    > * {
      position: relative;
    }
    .field {
      display: flex;
      justify-content: space-between;
      align-items: center;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin: 0;
      font-size: 15px;
      line-height: 24px;
    }
  }
  .card-content {
    margin-bottom: 12px;
    padding: 8px;
    width: 100%;
    font-size: 15px;
    line-height: 24px;
  }
</style>
