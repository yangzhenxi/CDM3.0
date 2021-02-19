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
import { addVirtualCopy } from '@/api/cdm/virtualCopy'
import { FormBuilder, MIcon } from '@/components'
import { useStepFormItem } from '@/core/use/form'
import { formatDate, enumToSelection } from '@/utils/util'
// import { isRepeat } from '@/utils/validator' debounce

export default {
  name: 'PgsqlStep2',
  components: {
    FormBuilder,
    MIcon
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
          prop: 'name',
          value: `挂载:${formatDate(new Date(), 'MMDDHHmmss')}`,
          rules: [
            { required: true, message: '请输入！' }
            // { validator: debounce(async function (rule, value, callback) {
            //   const { valid, error } = await isRepeat(value, {
            //     fetchData: async () => {
            //       try {
            //         const data = deepGet(await getAllApplication({ name: value }), 'data', [])
            //         return data
            //       } catch (error) {
            //         return []
            //       }
            //     }
            //   })
            //   if (!valid) {
            //     callback(error)
            //   }
            //   callback()
            // }) }
          ],
          component: {
            name: 'a-input'
          }
        },
        {
          label: '恢复类型',
          prop: 'recoverType',
          rules: { required: true, message: '请选择！' },
          component: {
            name: 'm-select',
            props: {
              options: enumToSelection('CDM_RECOVER_TYPE')
            }
          }
        }
      ],
      confirmLoading: false
    }
  },
  computed: {
    ...mapState({
      step1: state => state.cdmCloneSet.recover.step['step1'],
      pgsqlStep1: state => state.cdmCloneSet.recover.step['pgsqlStep1']
    })
  },
  methods: {
    async nextStep () {
      this.confirmLoading = true
      const { valid, values } = await this.$refs.form.validate()
      if (valid) {
        try {
          const params = {
            ...values,
            kind: this.step1.kind,
            lbletID: this.step1.lblet.id,
            goldenCopyID: this.step1.goldenCopyID,
            Pgsql: this.mysqlStep1.Pgsql
          }
          await addVirtualCopy(params)
          this.confirmLoading = false
          this.next()
        } catch (error) {
          this.confirmLoading = false
        }
      } else {
        this.confirmLoading = false
      }
    }
  }
}
</script>

<style lang="less" scoped>
.flex {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/deep/ .ant-progress-inner {
  border-radius: 0;
}
/deep/ .ant-progress-bg,
.ant-progress-success-bg {
  border-radius: 0;
}
/deep/ .ant-progress-bg {
  border-radius: 0 !important;
}
.content-wrapper {
  max-width: 750px;
  margin: 16px auto;
}

</style>
