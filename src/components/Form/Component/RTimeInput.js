import { convert } from '@/utils/util'

export default {
  props: {
    value: {
      type: Number,
      required: true
    },
    min: {
      type: Number,
      required: true
    },
    max: {
      type: Number,
      required: true
    }
  },
  data () {
    const value = this.value
    return {
      rtime: value,
      rtimeInput: convert(value, 'unixToDate')
    }
  },
  watch: {
    rtime (value) {
      if (!isNaN(value)) {
        this.rtime = value
      }
      this.rtimeInput = convert(this.rtime, 'unixToDate')
    }
  },
  methods: {
    change (rtime) {
      this.rtime = rtime
      this.$emit('change', rtime)
    },
    inputChange (e) {
      this.$emit('change', convert(e.target.value, 'dateToUnix'))
    }
  },
  render () {
    return (
      <a-row gutter={16} type="flex" justify="space-between">
        <a-col span={12}>
          <a-slider
            value={this.rtime}
            min={this.min}
            max={this.max}
            tipFormatter={value => `${convert(value, 'unixToDate')}`}
            onChange={this.change}
          />
        </a-col>
        <a-col span={12}>
          <a-input
            value={this.rtimeInput}
            onChange={this.inputChange}
          />
        </a-col>
      </a-row>
    )
  }
}
