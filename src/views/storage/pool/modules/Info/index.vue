<template>
  <page-header-wrapper :breadcrumb="false" @back="handleBack">
    <template #title>
      <span style="cursor: pointer" @click="handleBack">返回</span>
    </template>
    <template #extra>
      <div class="form-operator">
        <s-transition animate="slideDown">
          <a-button v-if="!isEmpty(o.record)" key="resize" type="primary" @click="handleResize">扩容</a-button>
          <a-button v-if="!isEmpty(o.record)" key="test" :loading="testLoading" @click="handleTest">测试</a-button>
          <a-button v-if="!isEmpty(o.record)" key="allocate" @click="handleAllocate">分配</a-button>
          <a-button type="danger" key="delete" @click="handleDelete">删除</a-button>
        </s-transition>
      </div>
    </template>
    <a-row :gutter="[16, 16]">
      <a-col :md="8" :sm="24">
        <a-card :bordered="false" :bodyStyle="{ height: '400px' }">
          <detail />
        </a-card>
      </a-col>
      <a-col :md="16" :sm="24">
        <a-card :bordered="false" :bodyStyle="{ height: '400px' }">
          <device />
        </a-card>
      </a-col>
      <a-col :md="10" :sm="24">
        <a-card :bordered="false" :bodyStyle="{ height: '496px' }">
          <pie-chart />
          <update-view style="margin-top: 16px"/>
        </a-card>
      </a-col>
      <a-col :md="14" :sm="24">
        <a-card :bordered="false" :bodyStyle="{ height: '240px' }">
          <io-chart />
        </a-card>
        <a-card :bordered="false" :bodyStyle="{ height: '240px', marginTop: '16px' }">
          <iops-chart />
        </a-card>
      </a-col>
    </a-row>
  </page-header-wrapper>
</template>

<script>
import { deletePool } from '@/api/storage/pool'
import { STransition } from '@/components'
import { isEmpty, throttle, transformArray } from '@/utils/util'
import { Detail, Device, Test, PieChart, UpdateView, IoChart, IopsChart } from './index'
import Allocate from '../Allocate'
import Resize from '../Resize'
import events from '../events'

export default {
  name: 'StoragePoolInfo',
  components: {
    STransition,
    Detail,
    Device,
    Test,
    PieChart,
    UpdateView,
    IoChart,
    IopsChart
  },
  data () {
    return {
      testLoading: false,
      deleteConfirm: null,
      id: null
    }
  },
  computed: {
    o () {
      return events.data.find(u => u?.id === this.id) || {}
    }
  },
  created () {
    this.id = this.$route.params.id
    transformArray(events.data, { id: this.id }, false)
    events.$off(`refresh-${this.id}`)
    events.$on(`refresh-${this.id}`, () => {
      events.$emit(`refresh-detail-${this.id}`)
      events.$emit(`refresh-metric-io-${this.id}`)
    })
  },
  methods: {
    handleResize: throttle(function () {
      this.$dialog(Resize, {
        record: this.o.record,
        on: {
          ok: () => {
            events.$emit(`refresh-${this.id}`)
          }
        }
      }, { title: '扩容' })
    }),
    handleTest: throttle(function () {
      this.$dialog(Test, {}, { title: '测试' })
    }),
    handleAllocate: throttle(function () {
      this.$dialog(Allocate, { record: this.o.record }, { title: '分配用户' })
    }),
    handleDelete: throttle(function () {
      this.deleteConfirm = undefined
      const onOk = async () => {
        if (this.deleteConfirm === 'YES') {
          await deletePool({ id: this.id })
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
            </p>
            <a-input v-model={ this.deleteConfirm } placeholder="请输入" allowClear { ... { on: { pressEnter: onOk } }} />
          </div>
        ),
        maskClosable: true,
        destroyOnClose: true,
        onOk
      })
    }),
    handleBack () {
      this.$router.push({ name: 'StoragePool' })
    },
    isEmpty
  }
}
</script>
