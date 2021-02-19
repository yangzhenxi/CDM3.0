<template>
  <div class="content-wrapper">
    <form-builder ref="form" :items="getItems" />
    <a-divider/>
    <span>instance</span>
    <form-builder ref="oracle" :items="getOracleItems" />
    <span>高级选项</span>
    <a-switch checked-children="开" un-checked-children="关" :checked="advanced" @change="handleSwitch" />
    <form-builder ref="extract" :items="getExtractItems()" />
    <footer-tool-bar class="step-form-item-operator">
      <a-button @click="back">取消新建</a-button>
      <a-button @click="prev">上一步</a-button>
      <a-button type="primary" :loading="confirmLoading" @click="nextStep">拉起</a-button>
    </footer-tool-bar>
  </div>
</template>

<script>
import { getOracleEnv } from '@/api/module/oracle'
import { addVirtualCopy } from '@/api/cdm/virtualCopy'
import { getInstance } from '@/api/cdm/instance'
import { MIcon, FormBuilder, FooterToolBar } from '@/components'
import { useStepFormItem } from '@/core/use/form'
import { formatDate, enumToSelection, deepGet, convert, transformArray } from '@/utils/util'
import { mapState } from 'vuex'

export default {
  name: 'OracleStep1',
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
      goldenCopy: null,
      sgaUnit: 'GB',
      pgaUnit: 'GB',
      advanced: false,
      loading: false,
      confirmLoading: false,
      getItems: [
        {
          label: '名称',
          prop: 'name',
          value: `挂载:${formatDate(new Date(), 'MMDDHHmmss')}`,
          span: 2,
          labelCol: { span: 3 },
          wrapperCol: { span: 24 },
          rules: [{ required: true, message: '请输入名称' }],
          component: {
            name: 'a-input'
          }
        },
        {
          label: '恢复类型',
          prop: 'recoverType',
          span: 2,
          labelCol: { span: 5 },
          wrapperCol: { span: 24 },
          rules: { required: true, message: '请选择！' },
          component: {
            name: 'm-select',
            props: {
              options: enumToSelection('CDM_RECOVER_TYPE')
            }
          }
        },
        {
          label: '恢复时间',
          prop: 'recoverTime',
          span: 2,
          value: 1612345678,
          rules: [{ required: true, message: '请输入！' }],
          labelCol: { span: 5 },
          wrapperCol: { span: 24 },
          component: {
            name: 'r-time-input',
            props: {
              min: 1612345678,
              max: 1612345978
            }
          }
        }
      ],
      getOracleItems: [
        {
          label: 'sid',
          prop: 'sid',
          span: 2,
          labelCol: { span: 3 },
          wrapperCol: { span: 24 },
          rules: {
            required: true,
            message: '请选择名称'
          },
          component: {
            name: 'a-input',
            props: {
              options: []
            }
          }
        },
        {
          label: 'db',
          prop: 'db',
          disabled: 'true',
          span: 2,
          rules: [{ required: true, message: '请输入！' }],
          labelCol: { span: 4 },
          wrapperCol: { span: 24 },
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
          rules: {
            required: true,
            message: '请选择数据中心'
          },
          component: {
            name: 'a-input'
          }
        },
        {
          label: 'user',
          prop: 'user',
          span: 2,
          rules: [{ required: true, message: '请输入！' }],
          labelCol: { span: 4 },
          wrapperCol: { span: 24 },
          component: {
            name: 'a-input'
          }
        },
        {
          label: 'listen',
          prop: 'listen',
          disabled: 'true',
          span: 2,
          rules: [{ required: true, message: '请输入！' }],
          labelCol: { span: 4 },
          wrapperCol: { span: 24 },
          component: {
            name: 'a-input'
          }
        }
      ]
    }
  },
  computed: {
    ...mapState({
      step1: state => state.cdmCloneSet.pollup.step['step1']
    })
  },
  mounted () {
    this.wakeData()
  },
  methods: {
    async  wakeData () {
      // 判断是否为集群
      const instance = deepGet(await getInstance({ id: +this.$route.query.instanceId }), 'data', [])
      const Oracle = deepGet(await getOracleEnv({ lbletID: this.step1.lblet?.id }), 'oracle', {})
      const spec = JSON.parse(deepGet(instance, 'spec'))
      transformArray(this.getOracleItems, { prop: 'home' }, { value: Oracle?.home })
      transformArray(this.getOracleItems, { prop: 'user' }, { value: Oracle?.user })
      transformArray(this.getOracleItems, { prop: 'listen' }, { value: Oracle?.listen })
      transformArray(this.getOracleItems, { prop: 'db' }, { value: spec?.db })
      // if (+this.goldenCopy?.optionStartTime.substring(0, 10) === +this.goldenCopy?.optionEndTime.substring(0, 10)) {
      //   transformArray(
      //     this.items,
      //     { prop: 'recoverTime' },
      //     { component: { name: 'a-input' }, value: convert(+this.goldenCopy?.optionStartTime, 'unixToDate') }
      //   )
      // } else {
      //   transformArray(
      //     this.items,
      //     { prop: 'recoverTime' },
      //     {
      //       value: +this.goldenCopy?.optionStartTime.substring(0, 10),
      //       component: {
      //         props: {
      //           min: +this.goldenCopy?.optionStartTime.substring(0, 10),
      //           max: +this.goldenCopy?.optionEndTime.substring(0, 10)
      //         }
      //       }
      //     }
      //   )
      // }
    },
    getExtractItems () {
      const items = [
        {
          label: 'sga',
          prop: 'sga',
          labelCol: { span: 3 },
          wrapperCol: { span: 24 },
          value: 800,
          visible: this.advanced,
          span: 2,
          rules: {
            required: true,
            message: '请输入sga'
          },
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
          rules: {
            required: true,
            message: '请输入pga'
          },
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
          rules: {
            required: true,
            message: '请输入processes！'
          },
          component: {
            name: 'a-input',
            props: {}
          }
        },
        {
          label: 'totalMemory',
          prop: 'totalMemory',
          visible: this.advanced,
          value: 500,
          labelCol: { span: 6 },
          wrapperCol: { span: 24 },
          span: 2,
          rules: {
            required: true,
            message: '请输入!'
          },
          component: {
            name: 'a-input'
          }
        }
      ]
      return items
    },
    async nextStep () {
      const { valid, values } = await this.$refs.form.validate()
      const { valid: oracleValid, values: oracleValues } = await this.$refs.oracle.validate()
      const { valid: extractValid, values: extractValues } = await this.$refs.extract.validate()
      if (valid && oracleValid && extractValid) {
        this.confirmLoading = true
        if (+this.goldenCopy?.optionStartTime.substring(0, 10) === +this.goldenCopy?.optionEndTime.substring(0, 10)) {
          values.recoverTime = convert(values.recoverTime, 'dateToUnix')
        }
        const params = {
          ...values,
          kind: this.step1.kind,
          lbletID: this.step1.lblet.id,
          instanceID: this.$route.query.instanceId,
          Oracle: {
            instance: oracleValues
          }
        }
        if (this.advanced) {
          params.Oracle.extract = extractValues
        }
        await addVirtualCopy(params)
        this.confirmLoading = false
        this.next()
        this.confirmLoading = false
      }
    },
    handleSwitch (e) {
      this.advanced = e
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
