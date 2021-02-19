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
import { addApplication, getApplicationList } from '@/api/cdm/application'
import { getAllPool } from '@/api/storage/pool'
import { mapState } from 'vuex'
import { MIcon, FormBuilder } from '@/components'
import { useStepFormItem } from '@/core/use/form'
import { deepGet, transformArray, convert, handleFetchStateErrorDone, toEnum, debounce } from '@/utils/util'
import { isRepeat } from '@/utils/validator'
// import { addPod, addOracleClusterPod } from '@/api/cdm/pod'

export default {
  name: 'OracleStep2',
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
      confirmLoading: false,
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
                    const data = deepGet(await getApplicationList({ name: value }), 'data', [])
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
            name: 'a-input',
            props: {
            }
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
        }
      ]
    }
  },
  computed: {
    ...mapState({
      step1: (state) => state.cdmApplication.step['step1'],
      oracleStep1: state => state.cdmApplication.step['oracleStep1']
    })
  },
  methods: {
    async nextStep () {
      const { valid, values } = await this.$refs.form.validate()
      if (valid) {
        this.confirmLoading = true
        const params = {
          type: 1,
          name: values.name,
          instanceRelation: this.oracleStep1.isCluster ? 2 : 1,
          poolID: +values.poolID,
          kind: this.step1.module,
          instances: this.oracleStep1.instances
        }
        try {
          await addApplication(params)
          this.next()
          this.confirmLoading = false
        } catch (error) {
          this.confirmLoading = false
        }
      } else {
        this.confirmLoading = false
      }
    },
    async wakeData () {
      try {
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
    },
    convert
  }
}
</script>
