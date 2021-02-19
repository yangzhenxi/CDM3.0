<template>
  <div class="step-form-item">
    <form-builder ref="form" :items="items">
      <template #operator>
        <div class="step-form-item-operator">
          <a-button @click="back">取消新建</a-button>
          <a-button @click="prev">上一步</a-button>
          <a-button type="primary" :loading="confirmLoading" @click="nextStep">新建</a-button>
        </div>
      </template>
    </form-builder>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { FormBuilder } from '@/components'
import { useStepFormItem } from '@/core/use/form'
import { deepGet, formatDate, handleFetchStateErrorDone, transformArray } from '@/utils/util'

export default {
  name: 'MssqlStep4',
  components: {
    FormBuilder
  },
  setup (props, context) {
    const {
      back,
      prev,
      next
    } = useStepFormItem(props, context)
    return {
      back,
      prev,
      next
    }
  },
  data () {
    return {
      items: [
        {
          label: '名称',
          prop: 'alias',
          value: '111',
          rules: { required: true, message: '请输入！' },
          component: {
            name: 'a-input'
          }
        },
        {
          label: '链路',
          prop: 'protocol',
          rules: { required: true, message: '请选择！' },
          component: {
            name: 'm-select'
          }
        }
      ],
      confirmLoading: false
    }
  },
  computed: {
    ...mapState({
      record: state => state.cdmCloneSet.recover.step['step0'].record,
      lblet: state => state.cdmCloneSet.recover.step['fileStep1'].lblet
    })
  },
  methods: {
    async nextStep () {
      this.confirmLoading = true
      const { valid, values } = await this.$refs.form.validate()
      this.confirmLoading = valid
      if (valid) {
        try {
          console.log(values)
          this.confirmLoading = false
          this.next()
        } catch (error) {
          this.confirmLoading = false
        }
      }
    },
    async wakeData () {
      this.loading = true
      // 1.获取链路数据
      try {
        const iscsi = deepGet(this.lblet, 'initiatorNamessss')
        const fc = deepGet(this.lblet, 'status.code')
        if (iscsi) {
          const protocolIscsi = this.$enum('R_PROTOCOL').find((u) => u.key === 'iscsi')
          protocolIscsi.disabled = true
        }
        if (!fc) {
          const protocolFc = this.$enum('R_PROTOCOL').find((u) => u.key === 'fc')
          protocolFc.disabled = true
        }
        const protocol = this.$enum('R_PROTOCOL').map((item) => ({
          value: item.key,
          label: (
            <div class="flex">
              <span> {item.value}</span>
              {item.display ? <span>{item.support}</span> : <span></span>}
            </div>
          ),
          disabled: item.display
        }))
        transformArray(this.items, { prop: 'protocol' }, { component: { props: { options: protocol } } })
      } catch (error) {
        transformArray(this.items, { prop: 'protocol' }, { component: { props: { emptyItemProps: handleFetchStateErrorDone(error) } } })
      }
      this.$nextTick(u => {
        this.$refs.form.model.alias = `挂载:${formatDate(new Date(), 'MMDDHHmmss')}`
      })
      this.loading = false
    }
  }
}
</script>
