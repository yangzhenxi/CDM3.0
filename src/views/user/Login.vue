<template>
  <a-form class="user-layout-login" :form="form" @submit.prevent="handleSubmit">
    <a-alert v-if="isLoginError" type="error" showIcon style="margin-bottom: 24px;" message="账户或密码错误" />
    <a-form-item>
      <a-input
        size="large"
        placeholder="请输入账号"
        v-decorator="['username',[{ rules: { required: true, message: '请输入账号' } }]]"
      >
        <a-icon slot="prefix" type="user" :style="{ color: 'rgba(0, 0, 0, .25)' }"/>
      </a-input>
    </a-form-item>
    <a-form-item>
      <a-input-password
        size="large"
        autocomplete="false"
        placeholder="请输入密码"
        v-decorator="['password',[{ rules: { required: true, message: '请输入密码' } }]]"
      >
        <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0, 0,0,  .25)' }"/>
      </a-input-password>
    </a-form-item>
    <a-form-item style="margin-top: 24px">
      <a-button
        size="large"
        type="primary"
        htmlType="submit"
        class="login-button"
        :loading="loginBtn"
        :disabled="loginBtn"
      >确定</a-button>
    </a-form-item>
  </a-form>
</template>

<script>
import { mapActions } from 'vuex'
import { handleFetchErrorNotification } from '@/utils/util'

export default {
  data () {
    return {
      loginBtn: false,
      isLoginError: false,
      form: this.$form.createForm(this)
    }
  },
  methods: {
    ...mapActions(['Login']),
    handleSubmit () {
      this.loginBtn = true
      this.form.validateFields(['username', 'password'], { force: true }, (err, values) => {
        if (!err) {
          this.Login(values).then(res => this.loginSuccess(res))
            .catch(error => this.requestFailed(error))
            .finally(() => {
              this.loginBtn = false
            })
        } else {
          setTimeout(() => {
            this.loginBtn = false
          }, 600)
        }
      })
    },
    async loginSuccess (res) {
      this.$router.push({ path: '/' })
      this.isLoginError = false
    },
    requestFailed (error) {
      handleFetchErrorNotification(error)
    }
  }
}
</script>

<style lang="less" scoped>
  .user-layout-login {
    button.login-button {
      padding: 0 15px;
      font-size: 16px;
      height: 40px;
      width: 100%;
    }
  }
</style>
