<template>
  <div v-if="!isEmpty(o.record)">
    <detail :data="data" align="center" :colon="false">
      <template slot="alertRatio" slot-scope="text">
        <a-popconfirm
          :title="`确定要修改告警值为 ${deepGet(o.record, 'alertRatio', 0)} 吗？`"
          :visible="alertRatioVisible"
          :okButtonProps="{ props: { loading: alertRatioLoading } }"
          @confirm="handleConfirm('alertRatio')"
          @cancel="handleCancel('alertRatio')"
        >
          <div class="flex-row" style="width: 100%">
            <a-slider :value="+text" :tooltipVisible="false" style="flex: 1" @change="value => { handleChange(value, 'alertRatio') }" />
            <span>{{ text }} %</span>
          </div>
        </a-popconfirm>
      </template>
      <template slot="quota" slot-scope="text">
        <a-popconfirm
          :title="`确定要修改使用限额为 ${deepGet(o.record, 'quota', 0)} 吗？`"
          :visible="quotaVisible"
          :okButtonProps="{ props: { loading: quotaLoading } }"
          @confirm="handleConfirm('quota')"
          @cancel="handleCancel('quota')"
        >
          <div class="flex-row" style="width: 100%">
            <a-slider :value="+text" :tooltipVisible="false" style="flex: 1" @change="value => { handleChange(value, 'quota') }" />
            <span>{{ text }} %</span>
          </div>
        </a-popconfirm>
      </template>
    </detail>
  </div>

</template>

<script>
import { cloneDeep } from 'lodash'
import { updatePool } from '@/api/storage/pool'
import { Detail } from '@/components'
import { deepGet, isEmpty } from '@/utils/util'
import events from '../events'

export default {
  components: {
    Detail
  },
  data () {
    return {
      data: [
        {
          key: 'alertRatio',
          title: '告警值',
          valueScopedSlots: { customRender: 'alertRatio' }
        },
        {
          key: 'quota',
          title: '使用限额',
          valueScopedSlots: { customRender: 'quota' }
        }
      ],
      oldAlertRatio: 0,
      oldQuota: 0,
      alertRatioVisible: false,
      quotaVisible: false,
      alertRatioLoading: false,
      quotaLoading: false,
      id: null
    }
  },
  computed: {
    o: {
      get () {
        return cloneDeep(events.data.find(u => u?.id === this.id) || {})
      },
      set (value) {
        return value
      }
    }
  },
  watch: {
    'o.record': {
      handler (value) {
        if (!isEmpty(value)) {
          this.loadData()
          this.oldAlertRatio = this.o.record?.alertRatio
          this.oldQuota = this.o.record?.quota
        }
      },
      deep: true
    }
  },
  created () {
    this.id = this.$route.params.id
    events.$off(`refresh-updateView-${this.id}`)
    events.$on(`refresh-updateView-${this.id}`, () => {
      this.loadData()
      this.oldAlertRatio = this.o.record?.alertRatio
      this.oldQuota = this.o.record?.quota
    })
  },
  methods: {
    loadData () {
      this.data = this.data.map(u => Object.assign(u, {
        value: deepGet(this.o.record, u.key, 0)
      }))
    },
    async handleConfirm (key) {
      try {
        this[`${key}Loading`] = true
        await updatePool({
          id: this.id,
          alertRatio: this.o.record?.alertRatio !== this.oldAlertRatio ? +this.o.record?.alertRatio : undefined,
          quota: this.o.record?.quota !== this.oldQuota ? +this.o.record?.quota : undefined
        })
        this.$message.success('修改成功！')
        this.oldAlertRatio = this.o.record?.alertRatio
        this.oldQuota = this.o.record?.quota
        this[`${key}Loading`] = false
        this[`${key}Visible`] = false
      } catch (error) {
        this[`${key}Loading`] = false
      }
    },
    handleCancel (key) {
      this[`${key}Visible`] = false
      this.o.record[key] = this[`old${key.charAt(0).toUpperCase() + key.slice(1)}`]
      this.loadData()
    },
    handleChange (value, key) {
      this.handleCancel(['alertRatio', 'quota'].find(u => u !== key))
      this[`${key}Visible`] = true
      this.o.record[key] = value
      this.loadData()
    },
    deepGet,
    isEmpty
  }
}

</script>
