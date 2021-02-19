<template>
  <a-spin :spinning="loading">
    <div class="flex-row" style="margin-bottom: 16px">
      <h3 style="margin-bottom: 0">
        <m-icon type="node" />
        {{ title }}
      </h3>
      <div class="form-operator">
        <a-button type="primary" size="small" @click="handleConfig">配置</a-button>
        <a-button size="small" @click="handleInfo">详情</a-button>
        <a-button type="danger" size="small" @click="handleDelete">删除</a-button>
      </div>
    </div>
    <empty-provider :isEmpty="isEmpty" :itemProps="empty" :minHeight="150">
      <detail :data="data" justify="end" :colon="false">
        <template slot="state" slot-scope="text">
          <a-switch
            :checked="text === 1"
            :loading="stateLoading"
            checkedChildren="启用"
            unCheckedChildren="禁用"
            @change="handleStateChange"
            @click.native.stop
          />
        </template>
      </detail>
    </empty-provider>
  </a-spin>
</template>

<script>
import { getSLA, updateSLA, deleteSLA } from '@/api/resource/sla'
import { Detail, EmptyProvider, MIcon } from '@/components'
import { deepGet, handleFetchStateErrorDone, throttle, transformArray } from '@/utils/util'
import events from '../events'

export default {
  components: {
    Detail,
    EmptyProvider,
    MIcon
  },
  data () {
    return {
      title: 'SLA',
      data: [
        {
          key: 'name',
          title: '名称'
        },
        {
          key: 'time',
          title: '执行时间',
          filter: 'unixToDate'
        }
      ],
      isEmpty: false,
      empty: {
        state: 'empty',
        data: []
      },
      loading: false,
      stateLoading: false,
      deleteConfirm: null,
      sla: {},
      id: null,
      o: {
        sla: {}
      }
    }
  },
  created () {
    this.id = this.$route.params.id
    events.$off(`refresh-sla-${this.id}`)
    events.$on(`refresh-sla-${this.id}`, () => {
      this.loadData()
    })
    this.loadData()
  },
  methods: {
    async loadData () {
      const o = this.o
      try {
        o.id = this.id
        this.loading = true
        this.sla = deepGet(await getSLA({ applicationId: this.id }), 'data', {})
        this.data = this.data.map(u => Object.assign(u, {
          value: deepGet(o.sla, u.key)
        }))
        this.isEmpty = !this.sla.length
        this.loading = false
        o.sla = this.sla
        transformArray(events.data, { id: this.id }, o)
      } catch (error) {
        this.empty = handleFetchStateErrorDone(error)
        this.isEmpty = true
        this.loading = false
      }
    },
    handleConfig: throttle(function () {
      if (!this.sla.length) {
        this.$router.push({ path: `/cdm/application/${this.id}/sla/add` })
      } else {
        this.$router.push({ path: `/cdm/application/${this.id}/sla/update/${this.sla?.id}`, query: { name: this.sla?.name } })
      }
    }),
    handleInfo: throttle(function () {
      this.$router.push({ path: `/cdm/application/${this.id}/sla/${this.sla?.id}`, query: { name: this.sla?.name } })
    }),
    handleDelete: throttle(function () {
      this.deleteConfirm = undefined
      const onOk = async () => {
        if (this.deleteConfirm === 'YES') {
          await deleteSLA({ id: this.id })
          modal.destroy()
          this.$multiTab.close(this.$route.fullPath, { force: true })
          this.handleBack()
          this.$message.success('提交删除成功！')
        } else {
          this.$message.error('提交删除失败！')
        }
      }
      const modal = this.$confirm({
        title: '是否删除',
        content: h => (
          <div>
            <p>
              请在输入 <m-tag color={'green'}>YES</m-tag>后确认删除
              <b style="margin-left: 4px">{ this.sla.name }</b>
            </p>
            <a-input v-model={ this.deleteConfirm } placeholder="请输入" allowClear { ... { on: { pressEnter: onOk } }} />
          </div>
        ),
        maskClosable: true,
        destroyOnClose: true,
        onOk
      })
    }),
    handleStateChange: throttle(async function () {
      try {
        this.stateLoading = true
        const state = this.sla.state === 1 ? 2 : 1
        await updateSLA({
          id: this.id,
          state
        })
        this.$message.success('修改成功！')
        this.sla.state = state
        this.loadData()
        this.stateLoading = false
      } catch (error) {
        this.stateLoading = false
      }
    })
  }
}

</script>
