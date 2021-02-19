<template>
  <div class="table-operator">
    <template v-for="o in fields">
      <a-button
        v-bind="o.props"
        v-action="o.action"
        :key="o.key"
        @click="o.onClick(o)"
      >
        {{ $t(o.key) }}
      </a-button>
    </template>
  </div>
</template>

<script>
import { watch, reactive, toRefs } from '@vue/composition-api'

export default {
  name: 'Operator',
  props: {
    config: {
      type: Object,
      required: true
    }
  },
  setup (props) {
    const state = reactive({
      fields: props.config.fields
    })
    watch(
      () => props.config.fields,
      value => {
        state.fields = value
      }, {
        deep: true
      }
    )
    return {
      ...toRefs(state)
    }
  }
}

</script>
