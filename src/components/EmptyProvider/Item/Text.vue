<template>
  <span>
    <template v-if="isPopup">
      <a-tooltip v-if="popupType === 'Tooltip'">
        <template slot="title">
          {{ _.title }}
        </template>
        <m-icon v-if="!$slots.ooo" class="icon-error" type="question-rect" />
        <slot name="ooo"></slot>
      </a-tooltip>
      <a-popover v-else-if="popupType === 'Popover'" :title="_.title">
        <template slot="content">
          <p v-if="!$slots.content">{{ _.content }}</p>
          <slot name="content"></slot>
        </template>
        <m-icon v-if="!$slots.ooo" class="icon-error" type="question-rect" />
        <slot name="ooo"></slot>
      </a-popover>
      <template v-else>
        <m-icon type="question-rect" class="icon-error slide" @click.native="handleShowModal" />
      </template>
    </template>
    <template v-else>
      <span>{{ ooo }}</span>
    </template>
  </span>
</template>

<script>
import MIcon from '../../Icon'
import { EMPTY_VALUE } from '@/config/constant.config'

export default {
  name: 'EmptyTextItem',
  components: {
    MIcon
  },
  props: {
    data: {
      type: Object,
      default () {
        return {}
      }
    },
    popupType: {
      type: String,
      default: 'Tooltip'
    },
    isPopup: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      ooo: EMPTY_VALUE
    }
  },
  computed: {
    _ () {
      const data = {}
      switch (this.popupType) {
      case 'Tooltip':
        data.title = this.$t('layouts.empty.error-tooltip.title')
        break
      case 'Popover':
        data.title = this.$t('layouts.empty.error-popover.title')
        data.content = this.$t('layouts.empty.error-popover.content')
        break
      case 'Modal':
        data.title = this.$t('layouts.empty.error-modal.title')
        data.content = this.$t('layouts.empty.error-modal.content')
        break
      }
      return Object.assign({}, data, this.data)
    }
  },
  methods: {
    handleShowModal () {
      this.$error({
        maskClosable: true,
        title: this._.title,
        content: this._.content
      })
    }
  }
}

</script>
