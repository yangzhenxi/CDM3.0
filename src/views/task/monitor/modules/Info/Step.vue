<template>
  <div>
    <h3 style="margin-bottom: 16px">{{ title }}</h3>
    <a-spin :spinning="loading">
      <empty-provider :isEmpty="isEmpty" :itemProps="empty" style="width: 100%; maxHeight: 579px; padding: 1px 16px 0 1px; overflow: hidden auto">
        <a-timeline>
          <template v-if="!isDone" #pending>
            <div>
              <div :class="['title', o.selected.index === o.current.index ? 'active' : '']" @click="handleStepClick(o.current)">
                <span :title="o.current.desc" class="name">{{ o.current.desc }}</span>
                <span class="time">{{ o.current.completedAt | convert('unixToDate') }}</span>
              </div>
              <div>
                <a-progress
                  :percent="o.current.percent"
                  size="small"
                  :status="deepGet(toEnum(o.current.phase_status, 'TASK_MONITOR_WORKFLOW_PHASE_STATUS'), 'result.processState')"
                  style="padding: 0 4px 8px 4px"
                />
                <m-tag :color="toEnum(o.current.phase_status, 'TASK_MONITOR_WORKFLOW_PHASE_STATUS').color">
                  <span>{{ o.current.phase_status | convert('TASK_MONITOR_WORKFLOW_PHASE_STATUS') }}</span>
                </m-tag>
                <div v-if="[2, 3].includes(o.current.status) && o.current.error" class="subTitle" :title="o.current.error">{{ o.current.error }}</div>
              </div>
            </div>
          </template>
          <s-transition animate="fadeIn">
            <a-timeline-item
              v-for="item in workUnits"
              :key="item.index"
            >
              <template #dot>
                <m-icon type="dot" :color="toEnum(item.phase_status, 'TASK_MONITOR_WORKFLOW_PHASE_STATUS').color" />
              </template>
              <div>
                <div :class="['title', o.selected.index === item.index ? 'active' : '']" @click="handleStepClick(item)">
                  <span :title="item.desc" class="name">{{ item.desc }}</span>
                  <span class="time">{{ item.completedAt | convert('unixToDate') }}</span>
                </div>
                <div style="margin: 16px 0">
                  <m-tag :color="toEnum(item.phase_status, 'TASK_MONITOR_WORKFLOW_PHASE_STATUS').color">
                    <span>{{ item.phase_status | convert('TASK_MONITOR_WORKFLOW_PHASE_STATUS') }}</span>
                  </m-tag>
                  <div v-if="[2, 3].includes(item.status) && item.error" class="subTitle" :title="item.error">{{ item.error }}</div>
                </div>
              </div>
            </a-timeline-item>
          </s-transition>
        </a-timeline>
      </empty-provider>
    </a-spin>
  </div>
</template>

<script>
import { EmptyProvider, MIcon, STransition } from '@/components'
import { deepGet, isEmpty, throttle, toEnum, transformArray } from '@/utils/util'
import events from '../events'

export default {
  components: {
    EmptyProvider,
    STransition,
    MIcon
  },
  data () {
    return {
      title: '执行过程',
      workUnits: [],
      isDone: true,
      isEmpty: true,
      empty: {
        state: 'empty',
        data: null
      },
      loading: false,
      id: null
    }
  },
  computed: {
    o () {
      return events.data.find(u => u?.id === this.id) || {}
    }
  },
  watch: {
    'o.record': {
      handler (value) {
        if (!isEmpty(value)) {
          this.loading = true
          this.loadData()
        } else {
          this.loading = false
          this.isEmpty = this.o.isEmpty
          this.empty = this.o.empty
        }
      },
      deep: true
    }
  },
  created () {
    this.id = this.$route.params.id
    this.loading = true
    events.$off(`refresh-step-${this.id}`)
    events.$on(`refresh-step-${this.id}`, () => {
      this.loading = true
      this.loadData()
    })
  },
  methods: {
    loadData () {
      const workUnits = deepGet(this.o.record, 'workflow.workUnits', [])
      if ([1, 2, 3].includes(this.o.current.phase)) {
        if (this.o.current.status === 1) {
          this.isDone = false
          this.workUnits = workUnits.slice(0, this.o.current.index)
        } else {
          this.workUnits = workUnits.slice(0, this.o.current.index + 1)
        }
      } else {
        this.workUnits = workUnits
      }
      this.isEmpty = false
      this.loading = false
    },
    handleStepClick: throttle(function (selected) {
      this.o.selected = selected
      transformArray(events.data, { id: this.id }, this.o)
    }),
    deepGet,
    toEnum
  }
}

</script>

<style lang='less' scoped>
  .title {
    cursor: pointer;
    .name {
      font-size: 16px;
      color: @text-color;
    }
    .time {
      font-size: 14px;
      margin-left: 8px;
      color: @text-color-secondary;
    }
    &:hover, &.active {
      .name, .time{
        color: @primary-color;
      }
    }
  }
  .subTitle {
    background: @gray-2;
    color: @text-color;
    padding: 8px;
    margin: 16px 0;
    max-width: 800px;
    word-break: break-all;
    word-wrap: break-word;
    white-space: normal;
  }
</style>
