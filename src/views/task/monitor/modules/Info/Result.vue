<template>
  <div>
    <h3 style="margin-bottom: 16px">{{ title }}</h3>
    <a-spin :spinning="loading">
      <empty-provider :isEmpty="o.isEmpty" :itemProps="o.empty">
        <a-result
          ref="info"
          class="info-result"
          style="padding: 0 48px"
        >
          <div>
            <detail :data="data" justify="end" :colon="false" :colSpan="2">
              <template slot="type" slot-scope="text">
                <m-tag :color="toEnum(text, 'TASK_MONITOR_TYPE').color" style="margin: 0">{{ text | convert('TASK_MONITOR_TYPE') }}</m-tag>
              </template>
            </detail>
            <a-progress
              :percent="o.record.percent"
              size="small"
              :status="deepGet(toEnum(o.current.phase_status, 'TASK_MONITOR_WORKFLOW_PHASE_STATUS'), 'result.processState')"
            />
          </div>
          <template #icon>
            <a-icon
              :type="deepGet(toEnum(o.current.phase_status, 'TASK_MONITOR_WORKFLOW_PHASE_STATUS'), 'result.icon', ' ')"
              :style="{ color: deepGet(toEnum(o.current.phase_status, 'TASK_MONITOR_WORKFLOW_PHASE_STATUS'), 'result.color') }"
            />
          </template>
        </a-result>
      </empty-provider>
    </a-spin>
  </div>
</template>

<script>
import { getTask } from '@/api/task/monitor'
import { Detail, EmptyProvider } from '@/components'
import { columnsBuild, deepGet, handleFetchStateErrorDone, toEnum, transformArray } from '@/utils/util'
import events from '../events'

export default {
  components: {
    Detail,
    EmptyProvider
  },
  data () {
    return {
      title: '任务详情',
      modulesData: [
        {
          key: 'id',
          title: 'ID'
        },
        {
          key: 'workflow.createdAt',
          title: '开始时间',
          filter: 'unixToDate'
        },
        {
          key: 'type',
          title: '类型',
          valueScopedSlots: { customRender: 'type' }
        },
        {
          key: 'workflow.completedAt',
          title: '结束时间',
          filter: 'unixToDate'
        },
        {
          key: 'app',
          title: '所属应用'
        },
        {
          key: 'time',
          title: '耗时',
          filter: 'unixDiff'
        },
        {
          key: 'inout',
          title: '输入/输出',
          modules: [3]
        },
        {
          key: 'speed',
          title: '速率',
          filter: 'unitSpeed',
          modules: [3]
        }
      ],
      data: [],
      loading: false,
      o: {
        id: null,
        record: {},
        current: {},
        selected: {},
        isEmpty: true,
        empty: {
          state: 'empty',
          data: null
        }
      }
    }
  },
  activated () {
    this.id = this.$route.params.id
    events.$off(`refresh-result-${this.id}`)
    events.$on(`refresh-result-${this.id}`, () => {
      this.loadData()
    })
    this.loadData()
  },
  deactivated () {
    clearTimeout(events.timer)
  },
  methods: {
    async loadData (isRefresh = true) {
      try {
        if (isRefresh) {
          this.o = {
            id: this.id,
            record: {},
            current: {},
            selected: {},
            isEmpty: true,
            empty: {
              state: 'empty',
              data: null
            }
          }
        }
        this.loading = isRefresh
        this.o.record = deepGet(await getTask({ id: this.id }), 'data', {})
        this.o.record.app = deepGet(this.o.record, 'belong', '').split(' ').shift()
        this.o.record.time = `${deepGet(this.o.record, 'workflow.completedAt', 0)}`.substring(0, 10) - `${deepGet(this.o.record, 'workflow.createdAt', 0)}`.substring(0, 10)
        const workUnits = deepGet(this.o.record, 'workflow.workUnits', [])
        workUnits.map((u, index) => {
          u.index = index
          u.phase_status = +`${u?.phase}${u?.status}`
        })
        let percent = 0
        workUnits.some((u, index) => {
          this.o.current = u
          if (isRefresh) {
            this.o.selected = u
          }
          percent += +u.percent
          // 准备，运行，暂停 正常时，定时查询
          if ([1, 2, 3].includes(u?.phase)) {
            if (u?.status === 1) {
              clearTimeout(events.timer)
              events.timer = setTimeout(() => this.loadData(false), 1000)
              this.$once('hook:beforeDestroy', () => {
                clearTimeout(events.timer)
              })
            }
            return true
          }
        })
        this.o.record.percent = workUnits.length > 0 ? +(percent / workUnits.length).toFixed(0) : 0
        this.data = columnsBuild(this.modulesData, this.o.record?.type)
        this.data = this.data.map(u => Object.assign(u, {
          value: deepGet(this.o.record, u.key)
        }))
        this.o.isEmpty = false
        transformArray(events.data, { id: this.id }, this.o)
        this.loading = false
      } catch (error) {
        this.o.empty = handleFetchStateErrorDone(error)
        transformArray(events.data, { id: this.id }, this.o)
        this.loading = false
      }
    },
    deepGet,
    toEnum
  }
}
</script>

<style lang="less" scoped>
  /deep/ .ant-result-content{
    margin-top: 50px;
  }
</style>
