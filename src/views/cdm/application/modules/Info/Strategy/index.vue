<template>
  <a-spin :spinning="loading">
    <div class="flex-row" style="margin-bottom: 16px">
      <h3 style="margin-bottom: 0">
        <m-icon type="node" />
        {{ title }}
      </h3>
      <div class="form-operator">
        <a-button type="primary" size="small" @click="handleConfig">{{ isEmpty ? '配置' : '修改' }}</a-button>
        <a-button size="small" :disabled="isEmpty" @click="handleShowHistory">历史</a-button>
      </div>
    </div>
    <empty-provider :isEmpty="isEmpty" :itemProps="empty" :minHeight="180">
      <detail :data="data" justify="end" :colon="false">
        <template slot="able" slot-scope="text">
          <a-switch
            :checked="text"
            :loading="stateLoading"
            checkedChildren="启用"
            unCheckedChildren="禁用"
            @change="handleStateChange"
            @click.native.stop
          />
        </template>
      </detail>
    </empty-provider>
    <a-drawer
      title="历史记录"
      placement="right"
      :closable="false"
      :visible="visible"
      :width="1000"
      @close="() => { visible = false }"
    >
      <history />
    </a-drawer>
  </a-spin>
</template>

<script>
import { mergeWith } from 'lodash'
import { getApplication } from '@/api/cdm/application'
import { getProtectionStrategy, updateProtectionStrategy } from '@/api/cdm/protectionStrategy'
import { Detail, EmptyProvider, MIcon } from '@/components'
import { convert, columnsBuild, deepGet, handleFetchStateErrorDone, isEmpty, throttle, transformArray } from '@/utils/util'
import Add from './Add'
import Update from './Update'
import History from './History'
import events from '../../events'

export default {
  components: {
    Detail,
    EmptyProvider,
    MIcon,
    History
  },
  data () {
    return {
      title: '保护策略',
      moduleData: [
        {
          key: 'cronExpression',
          title: 'cron 表达式'
        },
        {
          key: '',
          title: '日志备份间隔',
          filter: 'unixToDate',
          modules: ['oracle', 'pgsql']
        },
        {
          key: 'able',
          title: '状态',
          valueScopedSlots: { customRender: 'able' }
        },
        {
          key: 'createdAt',
          title: '创建时间',
          filter: 'unixToDate'
        }
      ],
      data: [],
      isEmpty: false,
      empty: {
        state: 'empty',
        data: []
      },
      loading: false,
      stateLoading: false,
      visible: false,
      strategy: {},
      id: null,
      o: {
        strategy: {}
      }
    }
  },
  created () {
    this.id = this.$route.params.id
    events.$off(`refresh-strategy-${this.id}`)
    events.$on(`refresh-strategy-${this.id}`, () => {
      this.loadData()
    })
    this.loadData()
  },
  methods: {
    async loadData () {
      const o = this.o
      try {
        this.loading = true
        const [strategy, application] = (
          await Promise.all(
            [getProtectionStrategy({ applicationID: this.id }), getApplication({ id: this.id })].map(api =>
              api.catch((error) => {
                this.empty = mergeWith(this.empty, handleFetchStateErrorDone(error), (o, s) => {
                  if (Array.isArray(o)) {
                    return o.concat(s)
                  }
                  return s
                })
              })
            )
          )
        ).map(u => deepGet(u, 'data', {}))
        this.strategy = strategy
        this.data = columnsBuild(this.moduleData, convert(application?.kind, 'CDM_APPLICATION_MODULE'))
        this.data = this.data.map(u =>
          Object.assign(u, {
            value: deepGet(this.strategy, u.key)
          })
        )
        this.isEmpty = isEmpty(this.strategy)
        this.loading = false
        o.strategy = this.strategy
        transformArray(events.data, { id: this.id }, o)
      } catch (error) {
        this.empty = handleFetchStateErrorDone(error)
        this.isEmpty = true
        this.loading = false
      }
    },
    handleConfig: throttle(function () {
      if (isEmpty(this.strategy)) {
        this.$dialog(Add, {
          on: {
            ok: () => {
              events.$emit(`refresh-${this.id}`)
            }
          }
        }, { title: '新建策略' })
      } else {
        this.$dialog(Update, {
          record: this.strategy,
          on: {
            ok: () => {
              events.$emit(`refresh-${this.id}`)
            }
          }
        }, { title: '修改策略' })
      }
    }),
    handleShowHistory: throttle(function () {
      this.visible = true
    }),
    handleStateChange: throttle(async function () {
      try {
        this.stateLoading = true
        const able = !this.strategy.able
        await updateProtectionStrategy({
          id: this.strategy?.id,
          cronExpression: this.strategy.cronExpression,
          able
        })
        this.$message.success('修改成功！')
        this.loadData()
        this.stateLoading = false
      } catch (error) {
        this.stateLoading = false
      }
    })
  }
}
</script>
