<template>
  <div class="content-wrapper">
    <form-builder ref="form" :items="items">
      <template #operator>
        <div class="step-form-item-operator">
          <a-button @click="back">取消新建</a-button>
          <a-button @click="prev">上一步</a-button>
          <a-button type="primary" :loading="confirmLoading" @click="nextStep">新建</a-button>
        </div>
      </template>
    </form-builder>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getFilePath } from '@/api/module/file'
import { getAllPool } from '@/api/storage/pool'
import { FormBuilder } from '@/components'
import { useStepFormItem } from '@/core/use/form'
import { convert, deepGet, handleFetchStateErrorDone, toEnum, transformArray, unitSize, uuid } from '@/utils/util'

export default {
  name: 'FileStep1',
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
      items: [
        {
          label: '应用名称',
          prop: 'alias',
          rules: { required: true, message: '请输入！' },
          component: {
            name: 'a-input',
            props: {
            }
          }
        },
        {
          label: '文件目录',
          prop: 'path',
          rules: { required: true, message: '请选择！' },
          component: {
            name: 'a-tree-select',
            props: {
              treeCheckable: true,
              showCheckedStrategy: 'SHOW_PARENT',
              treeDataSimpleMode: true,
              treeData: [
                {
                  id: 1,
                  pId: 0,
                  value: '',
                  title: '..',
                  selectable: false,
                  disabled: true
                }
              ],
              loadData: (treeNode) => {
                return new Promise(resolve => {
                  getFilePath(deepGet(this.lblet, 'metadata.name'), {
                    path: treeNode.dataRef.value
                  }).then(res => {
                    const filePathList = [
                      {
                        isDir: true,
                        name: 'C:',
                        path: 'C:/'
                      }
                    ]
                    filePathList.map(u => {
                      this.treeData.push({
                        id: uuid(4),
                        pId: treeNode.dataRef.id,
                        value: u.path,
                        title: u.path,
                        isLeaf: !u.isDir,
                        selectable: u.isDir && u.path !== '/',
                        disabled: !u.isDir || u.path === '/'
                      })
                    })
                    transformArray(this.items, { prop: 'path' }, { component: { props: { treeData: this.treeData } } })
                    resolve()
                  })
                })
              }
            }
          }
        },
        {
          label: '快照池',
          prop: 'pool',
          rules: { required: true, message: '请选择！' },
          component: {
            name: 'm-select'
          }
        },
        {
          label: '保护容量（GB）',
          prop: 'capacity',
          value: '10',
          rules: { required: true, message: '请输入！' },
          component: {
            name: 'a-input-number',
            style: {
              width: '100%'
            }
          }
        },
        {
          label: '链路',
          prop: 'protocol',
          rules: { required: true, message: '请选择！' },
          component: {
            name: 'm-select'
          }
        }
      ],
      treeData: [
        {
          id: 1,
          pId: 0,
          value: '',
          title: '..',
          selectable: false,
          disabled: true
        }
      ],
      confirmLoading: false
    }
  },
  computed: {
    ...mapState({
      module: (state) => state.cdmApplication.step['step1'].module,
      lblet: (state) => state.cdmApplication.step['step1'].lblet
    })
  },
  methods: {
    async wakeData () {
      // 1.获取链路数据
      try {
        const iscsi = deepGet(this.lblet, 'initiatorNamessss')
        const fc = deepGet(this.lblet, 'status.code')
        if (iscsi) {
          const protocolIscsi = this.$enum('R_PROTOCOL').find((u) => u.key === 'iscsi')
          protocolIscsi.disabled = true
        }
        if (!fc) {
          const protocolFc = this.$enum('R_PROTOCOL').find((u) => u.key === 'fc')
          protocolFc.disabled = true
        }
        const protocol = this.$enum('R_PROTOCOL').map((item) => ({
          value: item.key,
          label: (
            <div class="flex">
              <span> {item.value}</span>
              {item.display ? <span>{item.support}</span> : <span></span>}
            </div>
          ),
          disabled: item.display
        }))
        transformArray(this.items, { prop: 'protocol' }, { component: { props: { options: protocol } } })
      } catch (error) {
        transformArray(this.items, { prop: 'protocol' }, { component: { props: { emptyItemProps: handleFetchStateErrorDone(error) } } })
      }
      // 2.获取快照池的数据
      try {
        const poolList = deepGet(await getAllPool(), 'data.items', []).map((pool) => ({
          value: pool?.id,
          label: (
            <div class="storage-pool">
              <div class="flex-row">
                <div>
                  <m-icon type={ toEnum(pool?.type, 'STORAGE_POOL_TYPE').icon } class="storage-pool-icon" />
                  { pool?.name }
                </div>
                <div>{ convert(pool?.free, 'unitSize') } / { convert(pool?.capacity, 'unitSize') }</div>
              </div>
              <div class="progress">
                <a-progress class="storage-pool-progress" strokeColor="#12bd5e" strokeWidth={ 12 } percent={pool?.free / pool?.capacity * 100 } showInfo={ false }/>
              </div>
            </div>
          ),
          title: pool?.name
        }))
        transformArray(this.items, { prop: 'pool' }, { component: { props: { options: poolList } } })
      } catch (error) {
        transformArray(this.items, { prop: 'pool' }, { component: { props: { emptyItemProps: handleFetchStateErrorDone(error) } } })
      }
    },
    async nextStep () {
      this.confirmLoading = true
      const { valid, values } = await this.$refs.form.validate()
      this.confirmLoading = valid
      if (valid) {
        const application = {
          metadata: {
            alias: values.alias,
            name: uuid(4)
          },
          spec: {
            mode: 'simple',
            lblets: [deepGet(this.lblet, 'metadata.name')],
            module: this.module,
            type: 'cdm',
            file: {
              roots: values.path,
              version: 2
            }
          }
        }
        const pod = {
          metadata: {
            name: uuid(4)
          },
          spec: {
            target: deepGet(this.lblet, 'metadata.name'),
            type: 'cdm',
            store: {
              pool: values.pool,
              capacity: unitSize(values.capacity, { unit: ['GB', 'B'] }).value,
              protocol: values.protocol
            },
            module: {
              module: this.module,
              file: {
                roots: values.path,
                version: 2,
                delete: true
              }
            }
          }
        }
        console.log(application, pod)
        this.confirmLoading = false
        this.next()
      } else {
        this.confirmLoading = false
      }
    }
  }
}
</script>
