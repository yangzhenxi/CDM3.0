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
import { addVirtualCopy } from '@/api/cdm/virtualCopy'
import { getDataCenter, getClusterAndHost, getVMsByDataCenter } from '@/api/module/vmware'
import { getAllVirtual } from '@/api/resource/virtual'
import { FormBuilder } from '@/components'
import { useStepFormItem } from '@/core/use/form'
import { transformArray, deepGet, handleFetchStateErrorDone, isEmpty, debounce } from '@/utils/util'
import { isRepeat } from '@/utils/validator'

export default {
  name: 'VmwareStep2',
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
          rules: [
            { required: true, message: '请选择！' },
            { validator: debounce(async (rule, value, callback) => {
              const { valid, error } = await isRepeat(value, {
                fetchData: async () => {
                  try {
                    const datacenter = this.$refs.form.model.datacenter
                    const virtualMachines = deepGet(await getVMsByDataCenter({ virId: this.virId, datacenter }), 'virtualMachines', [])
                    const data = virtualMachines.filter(u => u.name === value)
                    return data
                  } catch (error) {
                    return []
                  }
                }
              })
              if (!valid) {
                callback(error)
              }
              callback()
            }) }
          ],
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
        }
      ],
      confirmLoading: false
    }
  },
  computed: {
    ...mapState({
      step1: state => state.cdmCloneSet.recover.step['step1'],
      vmwareStep1: state => state.cdmCloneSet.recover.step['vmwareStep1']
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
            name: this.vmwareStep1.name,
            recoverType: this.vmwareStep1.op === 'mount' ? 1 : 2,
            kind: this.step1.kind,
            lbletID: this.step1.lblet.id,
            goldenCopyID: this.step1.goldenCopyID,
            Vmware: {
              op: this.vmwareStep1.op,
              host: values.host,
              cluster: values.cluster,
              recover_name: values.recover_name,
              vcenter: {
                ...this.spec,
                datacenter: values.datacenter
              }
            }
          }

          await addVirtualCopy(params)
          this.confirmLoading = false
          this.next()
        } catch (error) {
          console.log(error)
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
        const virtual = data.find(u => u?.lbletId === this.step1.lblet?.id)
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
