<template>
  <div>
    <a-input v-model="cron" @change="change"></a-input>
    <a-row style="margin-top: 8px">
      <a-col :span="5"><label for="period" title="备份周期" class="colon">备份周期</label></a-col>
      <a-col :span="19">
        <a-select v-model="cycleSelected" placeholder="请选择备份周期" @change="getCycleSelected">
          <a-select-option v-for="cycle in cycleList" :key="cycle.key" >{{ cycle.value }}</a-select-option>
        </a-select>
      </a-col>
    </a-row>
    <template v-if="cycleSelected === 'month'" style="margin-top: 8px">
      <label for="month" title="每月某天运行" class="colon">每月某天运行</label>
      <a-checkbox-group
        v-model="month"
        :options="monthOptions"
        @change="onChangeMonthday"
      />
    </template>
    <template v-if="cycleSelected === 'week'" style="margin-top: 8px">
      <label for="week" title="每周某天运行" class="colon">每周某天运行</label>
      <a-checkbox-group
        v-model="week"
        :options="weekOptions"
        @change="onChangeWeekday"
      />
    </template>
    <template v-if="cycleSelected === 'month' || cycleSelected === 'week' || cycleSelected === 'day'">
      <a-row style="margin-top: 8px">
        <a-col :span="5"><label for="time" title="运行时间" class="colon">运行时间</label></a-col>
        <a-col :span="19">
          <a-time-picker :value="time" format="HH:mm" :allowClear="false" @change="onChangeTime"/>
        </a-col>
      </a-row>
    </template>
    <template v-if="cycleSelected === 'hour'">
      <a-row :gutter="[16, 24]" >
        <a-col :span="2">第</a-col>
        <a-col :span="17">
          <a-select @change="getHourMinSelected" v-model="hourMin" >
            <a-select-option v-for="n in 59" :key="n" >{{ n }}</a-select-option>
          </a-select>
        </a-col>
        <a-col :span="5">分钟运行</a-col>
      </a-row>
    </template>
    <template v-if="cycleSelected === 'minute'">
      <a-row :gutter="[16, 24]">
        <a-col :span="3">每隔</a-col>
        <a-col :span="16">
          <a-select @change="getMinuteSelected" v-model="minute" >
            <a-select-option v-for="n in 59" :key="n" >{{ n }}</a-select-option>
          </a-select>
        </a-col>
        <a-col :span="5">分钟运行</a-col>
      </a-row>
    </template>
  </div>
</template>

<script>
import moment from 'moment'

const monthOptions = Array.from({ length: 31 }, (v, k) => `${k + 1}`)
const weekOptions = [
  { label: '每日', value: '0' },
  { label: '周一', value: '1' },
  { label: '周二', value: '2' },
  { label: '周三', value: '3' },
  { label: '周四', value: '4' },
  { label: '周五', value: '5' },
  { label: '周六', value: '6' }
]

export default {
  name: 'Cron',
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      cycleList: [
        { key: 'month', value: '月' },
        { key: 'week', value: '周' },
        { key: 'day', value: '天' },
        { key: 'hour', value: '小时' },
        { key: 'minute', value: '分钟' }
      ],
      monthOptions,
      weekOptions,
      cycleSelected: null,
      month: [],
      week: [],
      hourMin: 1,
      minute: 1,
      time: moment('00:00', 'HH:mm'),
      cron: this.value,
      cron_month: '*',
      cron_week: '*',
      cron_time: '0'
    }
  },
  watch: {
    value (value) {
      this.cron = value
    }
  },
  methods: {
    moment,
    change (e) {
      this.cron = e.target.value
      this.$emit('change', this.cron)
    },
    getCycleSelected () {
      if (this.cycleSelected) {
        this.refresh()
      }
      switch (this.cycleSelected) {
      case 'month':
        this.onChangeMonthday()
        break
      case 'week':
        this.onChangeWeekday()
        break
      case 'day':
        this.onChangeTime()
        break
      case 'hour':
        this.getHourMinSelected()
        break
      case 'minute':
        this.getMinuteSelected()
        break
      }
    },
    onChangeMonthday (month) {
      const cron = '0 ' + this.cron_time + ' '
      if (month && month.length > 0) {
        this.month = month
        this.cron_month = this.month.join(',')
      } else {
        this.cron_month = '*'
      }
      this.cron = cron + this.cron_month + ' * ?'
      this.$emit('change', this.cron)
    },
    onChangeWeekday (week) {
      const cron = '0 ' + this.cron_time + ' ? * '
      if (week && week.length > 0) {
        this.week = week
        this.cron_week = this.week.join(',')
      } else {
        this.cron_week = '*'
      }
      this.cron = cron + this.cron_week
      this.$emit('change', this.cron)
    },
    onChangeTime (time) {
      if (time) {
        this.time = time
        this.cron_time = this.time.format('m') + ' ' + this.time.format('H')
      }
      switch (this.cycleSelected) {
      case 'month':
        this.cron = this.cron_time + ' ' + this.cron_month + ' * ?'
        break
      case 'week':
        this.cron = this.cron_time + ' ? * ' + this.cron_week
        break
      case 'day':
        if (this.cron_time === '0') {
          this.cron = '0 ' + this.cron_time + ' * * ?'
        } else {
          this.cron = this.cron_time + ' * * ?'
        }
        break
      }
      this.$emit('change', this.cron)
    },
    getHourMinSelected (hour) {
      if (hour) {
        this.hourMin = hour
        this.cron = '/' + this.hourMin + ' * * * ?'
      } else {
        this.cron = '/1 * * * ?'
      }
      this.$emit('change', this.cron)
    },
    getMinuteSelected (minute) {
      if (minute) {
        this.minute = minute
        this.cron = '*/' + this.minute + ' * * * ?'
      } else {
        this.cron = '1 * * * ?'
      }
      this.$emit('change', this.cron)
    },
    refresh () {
      this.month = []
      this.week = []
      this.cron_month = '*'
      this.cron_week = '*'
      this.hourMin = 1
      this.minute = 1
    }
  }
}
</script>
