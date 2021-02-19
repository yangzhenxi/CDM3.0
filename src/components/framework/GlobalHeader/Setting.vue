<template>
  <a-popover placement="bottomRight">
    <template #content>
      <detail :title="title" :data="data" />
    </template>
    <span>
      <a-icon type="setting" />
    </span>
  </a-popover>
</template>

<script>
import { mapMutations } from 'vuex'
import { TOGGLE_MOCK } from '@/store/mutation-types'
import Detail from '../../Detail'

export default {
  name: 'Setting',
  components: {
    Detail
  },
  data () {
    return {
      title: '系统设置',
      data: [
        {
          key: 'mock',
          title: 'mock',
          tooltip: 'mock 设置',
          checked: this.$store.state.app.mock,
          valueScopedSlots: { customRender: (text, record, index, item) => {
            return (
              <a-switch checked-children="开" un-checked-children="关" checked={ item.checked } onChange={ checked => {
                item.checked = checked
                this.setMock(checked)
                setTimeout(() => {
                  window.location.reload()
                }, 500)
              } } />
            )
          } }
        }

      ]
    }
  },
  methods: {
    ...mapMutations({
      setMock: TOGGLE_MOCK
    })
  }
}

</script>

<style lang='less' scoped>
</style>
