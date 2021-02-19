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
import { formatDate } from '@/utils/util'
// import { isRepeat } from '@/utils/validator' debounce

export default {
  name: 'MysqlStep2',
  components: {
    FormBuilder,
    MIcon
  },
  setup (props, context) {
    const { back, prev, next } = useStepFormItem(props, context)
    return {
      back,
      prev,
      next
    }
  },
  data () {
    return {
      goldenCopy: null,
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
              options: [{ label: '恢复', value: 1 }]
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
      mysqlStep1: state => state.cdmCloneSet.recover.step['mysqlStep1']
    })
  },
  methods: {
    async nextStep () {
      this.confirmLoading = true
      const { valid, values } = await this.$refs.form.validate()
      if (valid) {
        try {
          const params = {
            name: values.name,
            recoverType: values.recoverType,
            kind: this.step1.kind,
            lbletID: this.step1.lblet.id,
            goldenCopyID: this.step1.goldenCopyID,
            Mysql: this.mysqlStep1.Mysql
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
