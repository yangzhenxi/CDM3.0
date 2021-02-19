<template>
  <page-header-wrapper :breadcrumb="false" @back="handleBack">
    <template #title>
      <span style="cursor: pointer" @click="handleBack">返回</span>
    </template>
    <template #extra>
      <div class="form-operator">
        <s-transition animate="slideDown">
          <m-button key="delete" type="green" @click="handleDelete">删除</m-button>
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
      <a-col :md="24" :sm="24">
        <a-card :bordered="false">
          <pool />
        </a-card>
      </a-col>
    </a-row>
  </page-header-wrapper>
</template>

<script>
import { deleteClass } from '@/api/storage/class'
import { STransition } from '@/components'
import { throttle } from '@/utils/util'
import { Detail, Device, Pool } from './index'

export default {
  name: 'StorageClassInfo',
  components: {
    STransition,
    Detail,
    Device,
    Pool
  },
  data () {
    return {
      deleteConfirm: null,
      id: null
    }
  },
  created () {
    this.id = this.$route.params.id
  },
  methods: {
    handleDelete: throttle(function () {
      this.deleteConfirm = undefined
      const onOk = async () => {
        if (this.deleteConfirm === 'YES') {
          await deleteClass({ id: this.id })
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
      this.$router.push({ name: 'StorageClass' })
    }
  }
}
</script>
