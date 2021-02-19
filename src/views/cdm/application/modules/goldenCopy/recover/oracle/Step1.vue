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
      <a-button type="primary" :loading="confirmLoading" @click="nextStep">挂载</a-button>
    </footer-tool-bar>
  </div>
</template>

<script>
import { getOracleEnv } from '@/api/module/oracle'
import { addVirtualCopy } from '@/api/cdm/virtualCopy'
import { getGoldenCopyList } from '@/api/cdm/goldenCopy'
import { MIcon, FormBuilder, FooterToolBar } from '@/components'
import { useStepFormItem } from '@/core/use/form'
import { formatDate, enumToSelection, deepGet, convert, transformArray, debounce } from '@/utils/util'
import { mapState } from 'vuex'
import { isPositiveInteger } from '@/utils/validator'

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
          rules: { required: true, message: '请输入！' },
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
            },
            on: {
              change: (e) => {
                this.$refs.form.model.recoverTime = e
              }
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
          rules: { required: true, message: '请输入！' },
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
          rules: { required: true, message: '请选择！' },
          component: {
            name: 'a-input'
          }
        },
        {
          label: 'user',
          prop: 'user',
          span: 2,
          rules: { required: true, message: '请输入！' },
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
          rules: { required: true, message: '请输入！' },
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
      step1: state => state.cdmCloneSet.recover.step['step1'],
      oracleStep1: state => state.cdmCloneSet.recover.step['oracleStep1'],
      oracleStep2: state => state.cdmCloneSet.recover.step['oracleStep2']
    })
  },
  methods: {
    async wakeData () {
      // 判断是否为集群
      const goldenCopyList = deepGet(await getGoldenCopyList({ applicationID: this.$route.params.applicationId }), 'data', [])
      this.goldenCopy = goldenCopyList.filter(u => u.id === this.$route.params.id)[0]
      const spec = JSON.parse(deepGet(goldenCopyList.filter(u => u.id === this.$route.params.id)[0], 'spec'))
      const Oracle = deepGet(await getOracleEnv({ lbletID: this.step1.lblet?.id }), 'oracle', {})
      transformArray(this.getOracleItems, { prop: 'home' }, { value: Oracle?.home })
      transformArray(this.getOracleItems, { prop: 'user' }, { value: Oracle?.user })
      transformArray(this.getOracleItems, { prop: 'listen' }, { value: Oracle?.listen })
      transformArray(this.getOracleItems, { prop: 'db' }, { value: spec?.db })
      if (+this.goldenCopy?.optionStartTime.substring(0, 10) === +this.goldenCopy?.optionEndTime.substring(0, 10)) {
        transformArray(
          this.getItems,
          { prop: 'recoverTime' },
          { component: { name: 'a-input' }, value: convert(+this.goldenCopy?.optionStartTime, 'unixToDate') }
        )
      } else {
        transformArray(
          this.getItems,
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
          rules: [
            { required: true, message: '请输入！' },
            { validator: debounce(async function (rule, value, callback) {
              const { valid, error } = isPositiveInteger(value)
              if (!valid) {
                callback(error)
              }
              callback()
            }) }
          ],
          component: {
            name: 'a-input',
            props: {
            },
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
          rules: [
            { required: true, message: '请输入！' },
            { validator: debounce(async (rule, value, callback) => {
              const { valid, error } = isPositiveInteger(value)
              if (!valid) {
                callback(error)
              }
              switch (this.pgaUnit) {
              case 'GB':
                if (value < 0 || value > 100) {
                  callback(new Error('pga 容量必须在 300 MB ~ 100 GB 之间！'))
                }
                break
              case 'MB':
                if (value < 300 || value > 100 * 1024) {
                  callback(new Error('pga 容量必须在 300 MB ~ 100 GB 之间！'))
                }
                break
              }
              callback()
            }) }
          ],
          component: {
            name: 'a-input',
            slots: {
              addonAfter: (
                <a-select
                  value = { this.pgaUnit }
                  options = {['GB', 'MB'].map(u => ({
                    value: u,
                    label: u
                  }))}
                  {...{ on: { change: value => {
                    this.pgaUnit = value
                  } } }}
                  style={{ 'width': '60px' }}>
                </a-select>
              )
            }
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
            name: 'a-input-number',
            style: {
              width: '100%'
            }
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
          rules: { required: true, message: '请输入!' },
          component: {
            name: 'a-input-number',
            style: {
              width: '100%'
            }
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
        // this.confirmLoading = true
        // if (+this.goldenCopy?.optionStartTime.substring(0, 10) === +this.goldenCopy?.optionEndTime.substring(0, 10)) {
        //   values.recoverTime = convert(values.recoverTime, 'dateToUnix')
        // }
        const params = {
          ...values,
          kind: this.step1.kind,
          lbletID: this.step1.lblet.id,
          goldenCopyID: this.step1.goldenCopyID,
          Oracle: {
            instance: oracleValues
          }
        }
        if (this.advanced) {
          extractValues.sga = +convert(extractValues?.sga, 'unitSize', { unit: [this.sgaUnit, 'MB'] }).split(' ')[0]
          extractValues.pga = +convert(extractValues?.pga, 'unitSize', { unit: [this.pgaUnit, 'MB'] }).split(' ')[0]
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
