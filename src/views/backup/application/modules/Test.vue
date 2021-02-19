<template>
  <div>
    1
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { FormBuilder } from '@/components'
import { useStepFormItem } from '@/core/use/form'
import { transformArray } from '@/utils/util'
export default {
  name: 'VmwareStep3',
  components: {
    FormBuilder
  },
  setup (props, context) {
    const {
      back,
      prev,
      next,
      setStepData
    } = useStepFormItem(props, context)
    return {
      back,
      prev,
      next,
      setStepData
    }
  },
  data () {
    return {
      pathList: [],
      path: null, // 集群 | 单机
      hostList: [], // ip列表
      items: [
        {
          label: '新虚拟机名称',
          prop: 'newname',
          rules: { required: true, message: '请选择！' },
          component: {
            name: 'a-input'
          }
        },
        {
          label: '挂载位置',
          prop: 'path',
          rules: { required: true, message: '请选择！' },
          component: {
            name: 'm-select',
            on: {
              selece: value => {
                const host = this.pathList.find(u => u.type === value).ips
                transformArray(this.items, { prop: 'host' }, { component: { props: { options: host } } })
              }
            }
          }
        },
        {
          label: '挂载主机',
          prop: 'host',
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
      step2: state => state.cdmApplication.step['step2']
    })
  },
  methods: {
    async nextStep () {
      this.confirmLoading = true
      const { valid, values } = await this.$refs.form.validate()
      if (valid) {
        console.log(values.datacenter)
        this.confirmLoading = true
        this.confirmLoading = false
        this.next()
      } else {
        this.confirmLoading = false
      }
    },
    async wakeData () {
      try {
        // 1 获取挂载位置数据
        // 2.获取host列表
      } catch (error) {
      }
    }
  }
}
</script>
