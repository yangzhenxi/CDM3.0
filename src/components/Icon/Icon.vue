<template>
  <m-icon :type="`icon-${type}`" :class="[`icon-${color}`]" />
</template>

<script>
import { Icon } from 'ant-design-vue'
import './index.less'

const iconURL = '/assets/js/icon.js'

const MIcon = Icon.createFromIconfontCN({
  scriptUrl: iconURL
})

const PresetColorTypes = ['pink', 'red', 'yellow', 'orange', 'cyan', 'green', 'blue', 'purple', 'geekblue', 'magenta', 'volcano', 'gold', 'lime']

export default {
  components: {
    MIcon
  },
  props: {
    type: {
      type: String,
      default () {
        return ''
      }
    },
    color: {
      type: String,
      default () {
        return ''
      },
      validator: function (value) {
        if (value) {
          return PresetColorTypes.includes(value)
        }
        return true
      }
    }
  }
}
</script>
