<template>
  <div class="user-wrapper">
    <h3>修改密码</h3>
    <form-builder
      ref="form"
      :labelCol="labelCol"
      :wrapperCol="wrapperCol"
      :items="items"
      hideRequiredMark>
      <template #operator>
        <a-col v-bind="operatorCol">
          <div class="form-operator">
            <a-button type="primary" :loading="loading" @click="handleSubmit">
              {{ $t('layouts.form.submit') }}
            </a-button>
          </div>
        </a-col>
      </template>
    </form-builder>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { updateUser } from '@/api/system/user'
import { FormBuilder } from '@/components'

export default {
  name: 'Security',
  components: {
    FormBuilder
  },
  data () {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
        md: { span: 3 },
        lg: { span: 3 },
        xl: { span: 3 },
        xxl: { span: 2 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 21 }
      },
      operatorCol: {
        xs: { span: 24 },
        sm: { span: 21, offset: 3 },
        xxl: { span: 21, offset: 2 }
      },
      items: [
        {
          label: '旧密码',
          prop: 'oldPassword',
          rules: {
            required: true,
            message: '请输入！',
            trigger: ['change', 'blur']
          },
          component: {
            name: 'a-input',
            props: {
              type: 'password'
            }
          }
        },
        {
          label: '新密码',
          prop: 'newPassword',
          rules: [
            { required: true, message: '请输入！', trigger: ['change', 'blur'] },
            { validator: this.handlePasswordValidator }
          ],
          component: {
            name: 'a-input',
            props: {
              type: 'password'
            }
          }
        },
        {
          label: '重复密码',
          prop: 'repeatPassword',
          rules: [
            { required: true, message: '请输入！', trigger: ['change', 'blur'] },
            { validator: this.handleRepeatPasswordValidator }
          ],
          component: {
            name: 'a-input',
            props: {
              type: 'password'
            }
          }
        }
      ],
      loading: false
    }
  },
  computed: {
    ...mapGetters(['user'])
  },
  methods: {
    async handleSubmit () {
      const { valid, values } = await this.$refs.form.validate()
      if (valid) {
        try {
          this.loading = true
          await updateUser({
            id: this.user?.id,
            password: values.newPassword
          })
          this.$message.success('修改密码成功, 即将退出登录！')
          this.$store.dispatch('Logout').then(() => {
            setTimeout(() => {
              window.location.reload()
            }, 1000)
          })
          this.loading = false
        } catch (error) {
          this.loading = false
        }
      }
    },
    handlePasswordValidator (rule, value, callback) {
      const oldPassword = this.$refs.form.model.oldPassword
      if (value.trim() === oldPassword.trim()) {
        callback(new Error('新的密码不能和旧的相同！'))
      }
      callback()
    },
    handleRepeatPasswordValidator (rule, value, callback) {
      const newPassword = this.$refs.form.model.newPassword
      if (value.trim() !== newPassword.trim()) {
        callback(new Error('两次密码不一致'))
      }
      callback()
    }
  }
}
</script>

<style lang="less" scoped>
  .user-wrapper {
    max-width: 600px;
    /deep/ .ant-form-item-label label{
      color: @text-color
    }
    /deep/ .ant-input {
      display: inline-block;
      padding: 0;
      height: 25px;
      color: @gray-7;
      border: none;
      border-radius: 0;
      border-bottom: 1px solid @gray-6;
      &:focus {
        border-bottom: 1px solid @primary-color;
        box-shadow: 0 4px 2px @primary-1;
      }
    }
  }
</style>
