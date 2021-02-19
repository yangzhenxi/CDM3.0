<template>
  <div class="step-form-item">
    <form-builder ref="form" :items="items">
      <template #operator>
        <div class="step-form-item-operator">
          <a-button @click="back">取消新建</a-button>
          <a-button @click="prev">上一步</a-button>
          <a-button type="primary" :loading="confirmLoading" @click="nextStep">创建</a-button>
        </div>
      </template>
    </form-builder>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { addRecoveryStrategy } from '@/api/cdm/workflow'
import { getDataCenter, getClusterAndHost } from '@/api/module/vmware'
import { getAllVirtual } from '@/api/resource/virtual'
import { FormBuilder } from '@/components'
import { useStepFormItem } from '@/core/use/form'
import { transformArray, deepGet, handleFetchStateErrorDone, isEmpty } from '@/utils/util'
export default {
  name: 'VmwareStep1',
  components: {
    FormBuilder
  },
  setup (props, context) {
    const {
      back,
      prev,
      next
    } = useStepFormItem(props, context)
    return {
      back,
      prev,
      next
    }
  },
  data () {
    return {
      virId: null,
      spec: {},
      clusterAndHost: [],
      items: [
        {
          label: '新虚拟机名称',
          prop: 'recover_name',
          rules: { required: true, message: '请选择！' },
          component: {
            name: 'a-input'
          }
        },
        {
          label: '数据中心',
          prop: 'datacenter',
          rules: { required: true, message: '请选择！' },
          component: {
            name: 'm-select',
            on: {
              select: value => {
                this._getPath(value)
              }
            }
          }
        },
        {
          label: '挂载位置',
          prop: 'cluster',
          rules: { required: true, message: '请选择！' },
          component: {
            name: 'm-select',
            on: {
              select: value => {
                this._gethost(value)
              }
            }
          }
        },
        {
          label: '挂载主机',
          prop: 'host',
          rules: { required: true, message: '请选择！' },
          component: {
            name: 'm-select'
          }
        },
        {
          label: '挂载方式',
          prop: 'op',
          rules: { required: true, message: '请选择！' },
          component: {
            name: 'm-select',
            props: {
              options: [
                { key: 'mount', label: '挂载磁盘' },
                { key: 'recover', label: '挂载虚拟机' }
              ]
            }
          }
        }
      ],
      confirmLoading: false
    }
  },
  computed: {
    ...mapState({
      step1: state => state.cdmWorkflow.step['step1'],
      step2: state => state.cdmWorkflow.step['step2'],
      step3: state => state.cdmWorkflow.step['step3']
    })
  },
  created () {
    this.wakeData()
  },
  methods: {
    async nextStep () {
      this.confirmLoading = true
      const { valid, values } = await this.$refs.form.validate()
      if (valid) {
        try {
          const params = {
            op: values.op,
            host: values.host,
            cluster: values.cluster,
            recover_name: values.recover_name,
            vcenter: {
              ...this.spec,
              datacenter: values.datacenter
            }
          }
          await addRecoveryStrategy(params)
          this.confirmLoading = false
          this.next()
        } catch (error) {
          this.$message.error('添加失败')
          this.confirmLoading = false
        }
      } else {
        this.confirmLoading = false
      }
    },
    async wakeData () {
      try {
        // 1.获取数据中心
        const data = deepGet(await getAllVirtual(), 'data', [])
        const virtual = data.find(u => u?.lbletId === this.step3.lblet?.id)
        this.spec = JSON.parse(deepGet(virtual, 'spec', '{}'))
        this.virId = virtual?.id
        this._getDataCenter()
      } catch (error) {
      }
    },
    async _getDataCenter () {
      try {
        this.datacenterList = deepGet(await getDataCenter({ virtualID: this.virId }), 'data', []).map(u => ({
          value: u.string,
          label: u.string
        }))
        transformArray(this.items, { prop: 'datacenter' }, { component: { props: { options: this.datacenterList } } })
      } catch (error) {
        transformArray(this.items, { prop: 'datacenter' }, { component: { props: { emptyItemProps: handleFetchStateErrorDone(error) } } })
      }
    },
    async _getPath (value) {
      try {
        const params = {
          virtualID: this.virId,
          datacenter: value
        }
        this.clusterAndHost = deepGet(await getClusterAndHost(params), 'cluster_and_host', [])
        const path = this.clusterAndHost.map(u => ({
          value: u.path,
          label: u.path
        }))
        transformArray(this.items, { prop: 'cluster' }, { component: { props: { options: path } } })
      } catch (error) {
        transformArray(this.items, { prop: 'cluster' }, { component: { props: { emptyItemProps: handleFetchStateErrorDone(error) } } })
      }
    },
    _gethost (value) {
      const host = this.clusterAndHost.filter(u => u.path === value)?.map(u => u.ips)[0]?.map(u => ({
        value: u,
        label: u
      }))
      if (!isEmpty(host)) {
        transformArray(this.items, { prop: 'host' }, { visible: true })
        transformArray(this.items, { prop: 'host' }, { component: { props: { options: host } } })
      } else {
        transformArray(this.items, { prop: 'host' }, { visible: false })
      }
    }
  }
}
</script>
