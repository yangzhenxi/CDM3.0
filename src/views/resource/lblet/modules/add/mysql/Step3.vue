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
import { addApplication, getAllApplication } from '@/api/cdm/application'
import { getAllPool } from '@/api/storage/pool'
import { FormBuilder, MIcon } from '@/components'
import { useStepFormItem } from '@/core/use/form'
import { convert, deepGet, handleFetchStateErrorDone, transformArray, toEnum, debounce } from '@/utils/util'
import { isRepeat } from '@/utils/validator'

export default {
  name: 'MysqlStep3',
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
          label: '应用名称',
          prop: 'name',
          rules: [
            { required: true, message: '请输入！' },
            { validator: debounce(async function (rule, value, callback) {
              const { valid, error } = await isRepeat(value, {
                fetchData: async () => {
                  try {
                    const data = deepGet(await getAllApplication({ name: value }), 'data', [])
                    return data
                  } catch (error) {
                    return []
                  }
                }
              })
              if (!valid) {
                callback(error)
              }
              callback()
            }) }
          ],
          component: {
            name: 'a-input'
          }
        },
        {
          label: '快照池',
          prop: 'poolID',
          rules: { required: true, message: '请选择！' },
          component: {
            name: 'm-select',
            props: {
              optionLabelProp: 'title'
            }
          }
        },
        {
          label: '保护容量',
          prop: 'sizeDB',
          visible: false,
          rules: { required: true, message: '请选择！' },
          component: {
            name: 'a-input-number',
            props: {
              optionLabelProp: 'title'
            },
            style: {
              width: '100%'
            }
          }
        }
      ],
      confirmLoading: false
    }
  },
  computed: {
    ...mapState({
      step1: state => state.cdmApplication.step['step1'],
      mysqlStep1: state => state.cdmApplication.step['mysqlStep1'],
      mysqlStep2: state => state.cdmApplication.step['mysqlStep2']
    })
  },
  methods: {
    async nextStep () {
      this.confirmLoading = true
      const { valid, values } = await this.$refs.form.validate()
      const type = +deepGet(this.$route.query, 'type', 1)
      const sizeDB = `${convert(values?.sizeDB, 'unitSize', { unit: ['GB', 'B'] }).split(' ')[0]}`
      const instances = this.mysqlStep2.instance
      if (type === 1) {
        instances[0].spec.sizeDB = sizeDB
        instances[0].spec = JSON.stringify(instances[0].spec)
      }
      if (valid) {
        try {
          await addApplication({
            name: values.name,
            kind: +this.step1.module,
            type,
            poolID: +values.poolID,
            instanceRelation: 1,
            instances
          })
          this.confirmLoading = false
          this.next()
        } catch (error) {
          this.confirmLoading = false
        }
      } else {
        this.confirmLoading = false
      }
    },
    async wakeData () {
      try {
        // 数据库大小小于10GB 保护容量设置10GB
        let sizeDB = +convert(this.mysqlStep1.databaseList[0].dbSize, 'unitSize', { unit: ['B', 'GB'] }).split(' ')[0]
        sizeDB = sizeDB < 10 ? 10 : sizeDB
        const type = +deepGet(this.$route.query, 'type', 1)
        if (type === 1) {
          transformArray(this.items, { prop: 'sizeDB' }, { value: sizeDB, visible: true })
        }
        const poolList = deepGet(await getAllPool({ type: 1 }), 'data', []).map(pool => ({
          value: pool?.id,
          label: (
            <div class="storage-pool">
              <div class="flex-row">
                <div>
                  <m-icon type={ toEnum(pool?.type, 'STORAGE_POOL_TYPE').icon } class="storage-pool-icon" />
                  { pool?.name }
                </div>
                <div>{ convert(pool?.free, 'unitSize') } / { convert(pool?.capacity, 'unitSize') }</div>
              </div>
              <div class="progress">
                <a-progress class="storage-pool-progress" strokeColor="#12bd5e" strokeWidth={ 12 } percent={pool?.free / pool?.capacity * 100 } showInfo={ false }/>
              </div>
            </div>
          ),
          title: pool?.name
        }))
        transformArray(this.items, { prop: 'poolID' }, { component: { props: { options: poolList } } })
      } catch (error) {
        transformArray(this.items, { prop: 'poolID' }, { component: { props: { emptyItemProps: handleFetchStateErrorDone(error) } } })
      }
    }
  }
}
</script>
