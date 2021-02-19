<template>
  <form-builder ref="form" :items="items" />
</template>

<script>
import { updateLbletProtocolIQN, updateLbletProtocolWWN } from '@/api/resource/lblet'
import { FormBuilder } from '@/components'
import { enumToSelection } from '@/utils/util'

export default {
  components: {
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
          label: '协议类型',
          prop: 'type',
          rules: { required: true, message: '请输入！' },
          component: {
            name: 'm-select',
            props: {
              options: enumToSelection('R_PROTOCOL')
            }
          }
        },
        {
          label: '协议值',
          prop: 'protocolValue',
          rules: { required: true, message: '请输入！' },
          component: {
            name: 'a-textarea',
            props: {
              autoSize: {
                minRows: 3
              }
            }
          }
        }
      ]
    }
  },
  methods: {
    onOk () {
      return new Promise(async (resolve, reject) => {
        const { valid, values, error } = await this.$refs.form.validate()
        if (valid) {
          try {
            if (values.type === 1) {
              await updateLbletProtocolIQN({
                id: +this.record.id,
                iqn: values.protocolValue
              })
            } else {
              await updateLbletProtocolWWN({
                id: +this.record.id,
                wwn: values.protocolValue
              })
            }
            this.$message.success('修改协议成功')
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
