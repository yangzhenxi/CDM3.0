export default {
  props: {
    value: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      hour: null,
      minute: null
    }
  },
  watch: {
    value (value = {}) {
      this.hour = value.hour
      this.minute = value.minute
    }
  },
  methods: {
    handleHourChange (hour) {
      this.triggerChange({ hour })
    },
    handleMinChange (minute) {
      this.triggerChange({ minute })
    },
    triggerChange (value) {
      this.$emit('change', Object.assign({}, this.$data, value))
    }
  },
  render () {
    return (
      <span>
        <a-input-number min={0} max={23} value={this.value.hour} precision={0} onChange={this.handleHourChange} />
        <b style="margin: 0 4px">时</b>
        <a-input-number min={0} max={59} value={this.value.minute} precision={0} onChange={this.handleMinChange} />
        <b style="margin-left: 4px">分</b>
      </span>
    )
  }
}
