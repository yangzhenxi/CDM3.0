<template>
  <a-spin :spinning="o.loading">
    <h3 style="margin-bottom: 16px"><m-icon type="node" />{{ title }}</h3>
    <empty-provider :isEmpty="o.isEmpty" :itemProps="o.empty">
      <detail :data="data" justify="end" :colon="false">
        <template slot="state" slot-scope="text, record">
          <a-switch
            :checked="text"
            :loading="record.statusLoading"
            checkedChildren="启用"
            unCheckedChildren="禁用"
            @change="handleStatusChange(record)"
            @click.native.stop
          />
        </template>
      </detail>
    </empty-provider>
  </a-spin>
</template>

<script>
import { updateRecoveryStrategy } from '@/api/cdm/workflow'
import { Detail, EmptyProvider, MIcon } from '@/components'
import { deepGet, toEnum, throttle } from '@/utils/util'
import events from '../events'

export default {
  components: {
    Detail,
    EmptyProvider,
    MIcon
  },
  data () {
    return {
      title: '工作流信息',
      data: [
        {
          key: 'appKind',
          title: '应用类型',
          enum: 'CDM_APPLICATION_MODULE'
        },
        {
          key: 'application.name',
          title: '应用名称'
        },
        {
          key: 'lblet.name',
          title: '目标主机'
        },
        {
          key: 'cronExpression',
          title: '执行时间'
        },
        {
          key: 'createdAt',
          title: '创建时间',
          filter: 'unixToDate'
        },
        {
          key: 'able',
          title: '状态',
          valueScopedSlots: { customRender: 'state' }
        },
        {
          key: 'type',
          title: '挂载类型'
        },
        {
          key: 'sid',
          title: 'sid'
        }
      ],
      id: null,
      o: {
        loading: false,
        isEmpty: false,
        empty: {
          state: 'empty',
          data: null
        }
      }
    }
  },
  created () {
    this.id = this.$route.params.id
    events.$off(`update-detail-${this.id}`)
    events.$on(`update-detail-${this.id}`, () => {
      this.o = { ...this.o, ...events.data.find(u => u.id === this.id) }
      this.loadData()
    })
  },
  methods: {
    loadData () {
      this.data = this.data.map(u => Object.assign(u, {
        value: deepGet(this.o.record, u.key)
      }))
    },
    handleStatusChange: throttle(async function (record) {
      try {
        this.o.record.statusLoading = true
        await updateRecoveryStrategy({
          id: this.o.record?.id,
          able: !record.able,
          name: this.o.record.name,
          cronExpression: this.o.record.cronExpression
        })
        this.$message.success('修改成功！')
        events.$emit(`refresh-${this.id}`)
        this.o.record.statusLoading = false
      } catch (error) {
        record.statusLoading = false
      }
    }),
    deepGet,
    toEnum
  }
}

</script>
