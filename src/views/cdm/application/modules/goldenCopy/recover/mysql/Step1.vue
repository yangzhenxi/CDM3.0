<template>
  <div class="step-form-item">
    <form-builder ref="form" :items="items">
      <template #operator>
        <div class="step-form-item-operator">
          <a-button @click="back">取消新建</a-button>
          <a-button @click="prev">上一步</a-button>
          <a-button :loading="validatorLoading" @click="handleValidator">验证</a-button>
          <a-button type="primary" :loading="confirmLoading" :disabled="disabled" @click="nextStep">下一步</a-button>
        </div>
      </template>
    </form-builder>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { checkMysql, getMysql } from '@/api/module/mysql'
import { FormBuilder } from '@/components'
import { useStepFormItem } from '@/core/use/form'
import { throttle, enumToSelection } from '@/utils/util'

export default {
  name: 'MysqlStep1',
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
      items: [
        {
          label: '数据库类型',
          prop: 'service',
          value: 'mysql',
          rules: { required: true, message: '请选择！' },
          component: {
            name: 'm-select',
            props: {
              options: enumToSelection('MYSQL_SERVICE')
            }
          }
        },
        {
          label: '用户名',
          prop: 'username',
          value: 'root',
          rules: { required: true, message: '请输入！' },
          component: {
            name: 'a-input'
          }
        },
        {
          label: '密码',
          prop: 'password',
          value: 'Howlink@1401',
          rules: { required: true, message: '请输入！' },
          component: {
            name: 'a-input',
            props: {
              type: 'password'
            }
          }
        },
        {
          label: '端口',
          prop: 'port',
          value: 3307,
          rules: { required: true, message: '请输入！' },
          component: {
            name: 'a-input'
          }
        },
        {
          label: '数据库',
          prop: 'database',
          value: 'mysql',
          rules: { required: true, message: '请输入！' },
          component: {
            name: 'a-input'
          }
        }
      ],
      Mysql: null,
      validatorLoading: false,
      confirmLoading: false,
      model: {},
      disabled: true
    }
  },
  watch: {
    model: {
      handler () {
        this.disabled = true
      },
      deep: true
    }
  },
  computed: {
    ...mapState({
      step1: state => state.cdmCloneSet.recover.step['step1']
    })
  },
  mounted () {
    this.model = this.$refs.form.model
  },
  methods: {
    async nextStep () {
      try {
        const params = {
          id: this.step1?.lblet?.id,
          mysqlInstance: this.Mysql
        }
        const mysqlInfo = await getMysql(params)
        this.confirmLoading = true
        this.setStepData({
          data: {
            Mysql: this.Mysql,
            mysqlInfo
          }
        })
        this.confirmLoading = false
        this.next()
      } catch (error) {
        this.confirmLoading = false
      }
    },
    handleValidator: throttle(function () {
      return new Promise(async (resolve, reject) => {
        this.validatorLoading = true
        const { valid, values } = await this.$refs.form.validate()
        if (valid) {
          try {
            this.Mysql = {
              ip: this.step1?.lblet?.ipAddr,
              spec: values.service,
              username: values.username,
              password: values.password,
              port: +values.port,
              database: values.database
            }
            await checkMysql({
              id: this.step1?.lblet?.id,
              mysqlInstance: this.Mysql
            })
            this.$message.success('验证成功！')
            this.disabled = false
            this.validatorLoading = false
            resolve()
          } catch (error) {
            this.$message.error('验证失败！')
            this.validatorLoading = false
            reject(error)
          }
        } else {
          this.validatorLoading = false
        }
      })
    })
  }
}
</script>

<style lang="less" scoped>
.content-wrapper {
  max-width: 750px;
  margin: 16px auto;
}

</style>
