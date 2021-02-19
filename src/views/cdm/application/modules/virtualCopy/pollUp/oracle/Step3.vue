<template>
  <div class="content-wrapper">
    <form-builder ref="form" :items="getItems()" />
    <footer-tool-bar class="step-form-item-operator">
      <a-button @click="back">取消新建</a-button>
      <a-button @click="prev">上一步</a-button>
      <a-button type="primary" :loading="confirmLoading" @click="nextStep">挂载</a-button>
    </footer-tool-bar>
  </div>
</template>

<script>
import { MIcon, FormBuilder, FooterToolBar } from '@/components'
import { useStepFormItem } from '@/core/use/form'
import { getLblet } from '@/api/resource/lblet'
import { deepGet, convert, transformArray } from '@/utils/util'
import { mapState } from 'vuex'

export default {
  name: 'OracleStep3',
  components: {
    FooterToolBar,
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
      next,
      prev
    }
  },
  data () {
    return {
      sgaUnit: 'GB',
      pgaUnit: 'GB',
      advanced: true,
      loading: false,
      confirmLoading: false
    }
  },
  computed: {
    ...mapState({
      oracleStep1: state => state.cdmCloneSet.recover.step['oracleStep1'],
      oracleStep2: state => state.cdmCloneSet.recover.step['oracleStep2']
    })
  },
  methods: {
    wakeData () {
      // 1.判断是否要显示时间点
      if (this.op && this.op === 'recover') {
        // 2.判断起始时间时候跟结束时间相等
        // 相等
        transformArray(this.items, { disabled: 'true' }, { visible: false })
        // 不想等
        // transformArray(this.items, { disabled: 'false' }, { visible: false })
      }
    },
    getItems () {
      const items = [
        {
          label: '名称',
          prop: 'alias',
          span: 2,
          labelCol: { span: 3 },
          wrapperCol: { span: 24 },
          rules: { required: true, message: '请选择！' },
          component: {
            name: 'm-select',
            props: {
              options: []
            }
          }
        },
        {
          label: '链路',
          prop: 'protocol',
          labelCol: { span: 3 },
          wrapperCol: { span: 24 },
          span: 2,
          rules: { required: true, message: '请选择！' },
          component: {
            name: 'm-select'
          }
        },
        {
          label: '时间点',
          prop: 'rtime',
          disabled: 'false',
          span: 2,
          visible: true,
          rules: { required: true, message: '请输入！' },
          labelCol: { span: 4 },
          wrapperCol: { span: 24 },
          component: {
            name: 'r-time-input',
            props: {
              min: 1609236819,
              max: 1629236819,
              value: 1609236819
            }
          }
        },
        {
          label: '时间点',
          prop: 'rtime',
          disabled: 'true',
          span: 2,
          visible: true,
          rules: { required: true, message: '请输入！' },
          value: convert(1609236819, 'unixToDate'),
          labelCol: { span: 4 },
          wrapperCol: { span: 24 },
          component: {
            name: 'a-input',
            props: {
              disabled: true
            }
          }
        },
        {
          component: {
            name: 'a-divider'
          },
          labelCol: { span: 0 },
          wrapperCol: { span: 24 }
        },
        {
          label: 'sid',
          prop: 'sid',
          labelCol: { span: 3 },
          wrapperCol: { span: 24 },
          span: 2,
          rules: { required: true, message: '请输入！' },
          component: {
            name: 'a-input'
          }
        },
        {
          label: 'home',
          prop: 'home',
          labelCol: { span: 3 },
          wrapperCol: { span: 24 },
          span: 2,
          rules: { required: true, message: '请输入！' },
          component: {
            name: 'a-input'
          }
        },
        {
          label: 'listen',
          prop: 'listen',
          labelCol: { span: 4 },
          wrapperCol: { span: 24 },
          span: 2,
          rules: { required: true, message: '请输入！' },
          component: {
            name: 'a-input'
          }
        },
        {
          label: 'user',
          prop: 'user',
          labelCol: { span: 3 },
          wrapperCol: { span: 24 },
          span: 2,
          rules: { required: true, message: '请输入！' },
          component: {
            name: 'a-input'
          }
        },

        {
          label: '高级选项',
          prop: 'advanced',
          labelCol: { span: 2 },
          wrapperCol: { span: 22 },
          value: this.advanced,
          span: 1,
          component: {
            name: 'a-switch',
            props: {
              checkedChildren: '开',
              unCheckedChildren: '关'
            },
            on: {
              click: (e) => {
                if (e) {
                  this.advanced = true
                } else {
                  this.advanced = false
                }
              }
            }
          }
        },
        {
          label: 'sga',
          prop: 'sga',
          labelCol: { span: 3 },
          wrapperCol: { span: 24 },
          value: 800,
          visible: this.advanced,
          span: 2,
          rules: { required: true, message: '请输入！' },
          component: {
            name: 'a-input',
            props: {},
            slots: {
              addonAfter: (
                <a-select
                  value = { this.sgaUnit }
                  options = {['GB', 'MB'].map(u => ({
                    value: u,
                    label: u
                  }))}
                  {...{ on: { change: value => {
                    this.sgaUnit = value
                  } } }}
                  style={{ 'width': '60px' }}>
                </a-select>
              )
            }
          }
        },
        {
          label: 'pga',
          prop: 'pga',
          value: 400,
          labelCol: { span: 3 },
          wrapperCol: { span: 24 },
          visible: this.advanced,
          span: 2,
          rules: { required: true, message: '请输入！' },
          component: {
            name: 'a-input',
            props: {}
          }
        },
        {
          label: 'processes',
          prop: 'processes',
          visible: this.advanced,
          value: 500,
          labelCol: { span: 6 },
          wrapperCol: { span: 24 },
          span: 2,
          rules: { required: true, message: '请输入！' },
          component: {
            name: 'a-input',
            props: {}
          }
        }
      ]
      return items
    },
    async nextStep () {
      const { valid, values } = await this.$refs.form.validate()
      if (valid) {
        this.confirmLoading = true
        const lblet = deepGet(await getLblet({ id: this.$route.params.id }), 'data', [])
        this.$emit('setStepData', {
          data: {
            module: values,
            lblet: lblet
          }
        })
        this.confirmLoading = false
        this.next()
        this.confirmLoading = false
      }
    },
    convert
  }
}
</script>

<style lang="less" scoped>
.content-wrapper {
  max-width: 750px;
	margin: 16px auto;
	.step-form-item-operator{
		margin-bottom:0px;
	}
}

</style>
