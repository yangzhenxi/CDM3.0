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
import { getGoldenCopyList } from '@/api/cdm/goldenCopy'
import { FormBuilder, MIcon } from '@/components'
import { useStepFormItem } from '@/core/use/form'
import { formatDate, deepGet, transformArray, convert } from '@/utils/util'
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
            { required: true, message: '请输入名称' }
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
        },
        {
          label: '恢复时间',
          prop: 'recoverTime',
          visible: false,
          rules: [{ required: true, message: '请输入！' }],
          component: {
            name: 'r-time-input',
            props: {
              min: 0,
              max: 0
            },
            on: {
              change: (e) => {
                this.$refs.form.model.recoverTime = e
              }
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
    async wakeData () {
      if (this.$route.query.type === '2') {
        const goldenCopyList = deepGet(
          await getGoldenCopyList({ applicationID: this.$route.params.applicationId }),
          'data',
          []
        )
        this.goldenCopy = goldenCopyList.filter(u => u.id === this.$route.params.id)[0]
        transformArray(this.items, { prop: 'recoverTime' }, { visible: true })
        if (+this.goldenCopy?.optionStartTime.substring(0, 10) === +this.goldenCopy?.optionEndTime.substring(0, 10)) {
          transformArray(
            this.items,
            { prop: 'recoverTime' },
            { component: { name: 'a-input' }, value: convert(+this.goldenCopy?.optionStartTime, 'unixToDate'), props: { disabled: true } }
          )
        } else {
          transformArray(
            this.items,
            { prop: 'recoverTime' },
            {
              value: +this.goldenCopy?.optionStartTime.substring(0, 10),
              component: {
                props: {
                  min: +this.goldenCopy?.optionStartTime.substring(0, 10),
                  max: +this.goldenCopy?.optionEndTime.substring(0, 10)
                }
              }
            }
          )
        }
      }
    },
    async nextStep () {
      this.confirmLoading = true
      const { valid, values } = await this.$refs.form.validate()
      if (valid) {
        try {
          if (this.$route.query.type === '2') {
            if (+this.goldenCopy?.optionStartTime.substring(0, 10) === +this.goldenCopy?.optionEndTime.substring(0, 10)) {
              values.recoverTime = convert(values.recoverTime, 'dateToUnix')
            }
            const spec = JSON.parse(this.goldenCopy?.spec)
            this.mysqlStep1.Mysql.backupDatabase = spec.backupDatabase
          } else {
            delete values.recoverTime
          }
          const params = {
            name: values.name,
            recoverType: values.recoverType,
            recoverTime: values.recoverTime,
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
