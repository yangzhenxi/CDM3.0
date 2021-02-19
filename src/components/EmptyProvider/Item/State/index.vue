<template>
  <div class="empty">
    <div v-if="!$slots.emptyState" class="empty-state">
      <component :is="_.component"></component>
    </div>
    <slot name="emptyState"></slot>
    <div v-if="!$slots.emptyData" class="empty-data">
      <template v-if="state === 'empty'">
        <template>
          {{ _.data }}
        </template>
      </template>
      <template v-else-if="state === 'error'">
        <template v-if="Array.isArray(_.data)">
          <div class="empty-data-title">接口异常</div>
          <div class="empty-data-content">
            <a-divider style="margin: 12px 0"/>
            <span v-for="(u, index) in _.data" :key="`${state}_${index}`">
              <a-tooltip>
                <template #title>
                  <span>{{ u.message }}</span>
                </template>
                <m-icon class="icon-error" type="question-rect" />
              </a-tooltip>
              <span class="title">{{ u.key }}</span>
            </span>
          </div>
        </template>
        <template v-else>
          {{ _.data }}
        </template>
      </template>
      <template v-else>
        <template>
          {{ _.data }}
        </template>
      </template>
    </div>
    <slot name="emptyData"></slot>
  </div>
</template>

<script>
import DataEmpty from './DataEmpty'
import DataError from './DataError'
import DataPrompt from './DataPrompt'
import MIcon from '../../../Icon'
import { isEmpty } from '@/utils/util'

export default {
  name: 'EmptyStateItem',
  components: {
    DataEmpty,
    DataError,
    DataPrompt,
    MIcon
  },
  props: {
    state: {
      type: String,
      default: 'empty'
    },
    data: {
      type: [String, Object, Array],
      default () {
        return {}
      }
    }
  },
  computed: {
    _ () {
      const _ = {
        component: `data-${this.state}`
      }
      switch (this.state) {
      case 'empty':
        _.data = this.$t('layouts.empty.empty-state.data')
        break
      case 'error':
        _.data = this.$t('layouts.empty.error-state.data')
        break
      case 'prompt':
        _.data = this.$t('layouts.empty.prompt-state.data')
        break
      }
      if (!isEmpty(this.data)) {
        _.data = this.data
      }
      return _
    }
  }
}

</script>

<style lang='less' scoped>
  .empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 32px 0;
    color: rgba(0, 0, 0, .25);
    .empty-state {
      height: 40px;
      margin-bottom: 8px;
    }
    .empty-data {
      .empty-data-title {
        font-weight: bold;
        font-size: 16px;
        text-align: center;
      }
      .empty-data-content {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        padding: 8px 4px;
        .title {
          font-weight: bold;
        }
        .icon-error {
          margin-right: 8px;
        }
      }
    }
  }
</style>
