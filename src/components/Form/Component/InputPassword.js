import './InputPassword.less'

export default {
  // eslint-disable-next-line vue/require-prop-types
  props: ['value'],
  data () {
    return {
      password: null,
      level: 0
    }
  },
  watch: {
    value (value) {
      this.password = value
      this.level = this.checkPassword(value)
    }
  },
  methods: {
    handleChange (password) {
      this.triggerChange(password)
    },
    triggerChange (value) {
      this.$emit('change', value)
    },
    checkPassword (value) {
      let level = 0
      if (/\d/.test(value)) {
        level++
      }
      if (/[a-zA-Z]/.test(value)) {
        level++
      }
      if (/[`~!@#$%^&*()_\-+=<>?:"{}|,.\\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘'，。、]/.test(value)) {
        level++
      }
      return level
    }
  },
  render () {
    return (
      <div class="password">
        <a-input-password value={this.value} onChange={this.handleChange} />
        <div class="password-strength">
          <div class={['easy', this.level >= 1 ? 'active' : '']}>弱</div>
          <div class={['normal', this.level >= 2 ? 'active' : '']}>中</div>
          <div class={['hard', this.level >= 3 ? 'active' : '']}>强</div>
        </div>
      </div>
    )
  }
}
