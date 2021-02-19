<template>
  <page-header-wrapper :breadcrumb="false" @back="handleBack">
    <template #title>
      <span style="cursor: pointer" @click="handleBack">返回</span>
    </template>
    <template #extra>
      <div class="form-operator">
        <a-button type="primary" @click="handleUpdate">修改</a-button>
        <a-button @click="handleAllocate">分配</a-button>
        <a-button type="danger" @click="handleDelete">删除</a-button>
      </div>
    </template>
    <a-row :gutter="[16, 16]">
      <a-col :md="8" :sm="24">
        <a-card :bordered="false" :bodyStyle="{ height: '500px' }">
          <detail />
        </a-card>
      </a-col>
      <a-col :md="16" :sm="24">
        <a-card :bordered="false" :bodyStyle="{ height: '500px' }">
          <vm />
        </a-card>
      </a-col>
    </a-row>
  </page-header-wrapper>
</template>

<script>
import { getLblet } from '@/api/resource/lblet'
import { getVirtual, deleteVirtual } from '@/api/resource/virtual'
import { getVCenter } from '@/api/module/vmware'
import { getHyperVVCList } from '@/api/module/hyperv'
import { deepGet, handleFetchStateErrorDone, throttle, transformArray } from '@/utils/util'
import { Detail, Vm } from './index'
import Allocate from '../Allocate'
import Update from '../Update'
import events from '../events'

export default {
  name: 'ResourceVirtualInfo',
  components: {
    Detail,
    Vm
  },
  data () {
    return {
      deleteConfirm: null,
      id: null,
      o: {}
    }
  },
  created () {
    this.id = this.$route.params.id
    events.$off(`refresh-${this.id}`)
    events.$on(`refresh-${this.id}`, () => {
      this.loadData()
    })
    this.loadData()
  },
  methods: {
    async loadData () {
      const o = events.data.find(u => u.id === this.id) || {}
      try {
        o.id = this.id
        o.loading = true
        o.record = deepGet(await getVirtual({ id: this.id }), 'data', {})
        const lblet = deepGet(await getLblet({ id: o.record?.lbletId }), 'data', {})
        o.record.lblet = lblet?.name
        if (o?.record?.kind === 1) {
          o.record.ipAddr = o.record?.vCenter?.ipAddr
          const vm = deepGet(await getVCenter({ virID: this.id }), 'vcinfo', {})
          o.record.data = deepGet(vm, 'vm', [])
          o.record.hostSize = deepGet(vm, 'host.length', 0)
          o.record.vmSize = deepGet(vm, 'vm.length', 0)
          o.record.version = deepGet(vm, 'version')
        } else {
          const data = deepGet(await getHyperVVCList({ virtualID: this.id }), 'virtualMachines', [])
          o.record.data = data
          o.record.vmSize = data.length
          o.record.ipAddr = lblet?.ipAddr
        }
        o.loading = false
        this.o = o
        transformArray(events.data, { id: this.id }, o)
        events.$emit(`update-detail-${this.id}`)
        events.$emit(`update-vm-${this.id}`)
      } catch (error) {
        o.empty = handleFetchStateErrorDone(error)
        o.isEmpty = true
        o.loading = false
        transformArray(events.data, { id: this.id }, o)
        events.$emit(`update-detail-${this.id}`)
        events.$emit(`update-vm-${this.id}`)
      }
    },
    handleUpdate: throttle(function () {
      this.$dialog(Update, {
        record: this.o.record,
        on: {
          ok: () => {
            events.$emit(`refresh`)
            events.$emit(`refresh-${this.id}`)
          }
        }
      }, { title: '修改客户端' })
    }),
    handleAllocate: throttle(function () {
      this.$dialog(Allocate, { record: this.o.record }, { title: '分配用户' })
    }),
    handleDelete: throttle(function () {
      this.deleteConfirm = undefined
      const onOk = async () => {
        if (this.deleteConfirm === 'YES') {
          await deleteVirtual({ id: this.id })
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
              <b style="margin-left: 4px">{this.o.record?.name}</b>
            </p>
            <a-input v-model={ this.deleteConfirm } placeholder="请输入" allowClear {...{ on: { pressEnter: onOk } }} />
          </div>
        ),
        maskClosable: true,
        destroyOnClose: true,
        onOk
      })
    }),
    handleBack () {
      this.$router.push({ name: 'ResourceVirtual' })
    }
  }
}
</script>
