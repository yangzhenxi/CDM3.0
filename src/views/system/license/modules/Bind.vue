<template>
  <form-builder ref="form" :items="items" />
</template>

<script>
import { getAllPool } from '@/api/storage/pool'
import { bindPool } from '@/api/system/license'
import { MIcon, FormBuilder } from '@/components'
import { convert, deepGet, handleFetchStateErrorDone, transformArray, toEnum } from '@/utils/util'

export default {
  components: {
    MIcon,
    FormBuilder
  },
  props: {
    record: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      items: [
        {
          label: '存储池',
          prop: 'pool',
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
  created () {
    this.loadData()
  },
  methods: {
    async loadData () {
      try {
        const poolList = deepGet(await getAllPool(), 'data', []).map(pool => ({
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
        transformArray(this.items, { prop: 'pool' }, { component: { props: { options: poolList } } })
      } catch (error) {
        transformArray(this.items, { prop: 'pool' }, { component: { props: { emptyItemProps: handleFetchStateErrorDone(error) } } })
      }
    },
    onOk () {
      return new Promise(async (resolve, reject) => {
        const { valid, values, error } = await this.$refs.form.validate()
        if (valid) {
          try {
            await bindPool(this.record.name, {
              pool: values.pool
            })
            this.$message.success('绑定池成功！')
            resolve(true)
          } catch (error) {
            reject(error)
          }
        } else {
          reject(error)
        }
      })
    }
  }
}
</script>
