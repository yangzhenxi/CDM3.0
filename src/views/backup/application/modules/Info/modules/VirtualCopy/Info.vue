<template>
  <div>
    <div v-for="item in data" :key="item.key">
      <a-divider orientation="left">{{ item.title }}</a-divider>
      <detail :data="item.list" :colSpan="2" justify="end" :colon="false" >
        <template slot="time" slot-scope="text, r">
          {{ (`${deepGet(r, 'completedAt', 0)}`.substring(0, 10) - `${deepGet(r, 'createdAt', 0)}`.substring(0, 10)) | convert('unixDiff') }}
        </template>
      </detail>
    </div>
  </div>
</template>

<script>
import { Detail } from '@/components'
import { convert, columnsBuild, deepGet } from '@/utils/util'

export default {
  components: {
    Detail
  },
  props: {
    record: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      data: [
        {
          key: 'base',
          title: '基础信息',
          list: [
            {
              key: 'name',
              title: '名称'
            },
            {
              key: 'pool',
              title: '存储池'
            },
            {
              key: 'status.pod.spec.module.vmware.vmname',
              title: '虚拟机',
              modules: ['vmware']
            },
            {
              key: 'status.pod.spec.module.hyperv.hypervPart.name',
              title: '虚拟机',
              modules: ['hyperv']
            },
            {
              key: 'mountPath',
              title: '磁盘路径'
            },
            {
              key: 'state',
              title: '状态',
              enum: 'CDM_GOLDENCOPY_STATE'
            }
          ]
        },
        {
          key: 'backup',
          title: '备份集信息',
          list: [
            {
              key: 'createdAt',
              title: '开始时间',
              filter: 'unixToDate'
            },
            {
              key: 'used',
              title: '实际容量',
              filter: 'unitSize'
            },
            {
              key: 'completedAt',
              title: '结束时间',
              filter: 'unixToDate'
            },
            {
              key: 'compressRatio',
              title: '压缩比',
              filter: 'compressRatio'
            },
            {
              key: 'time',
              title: '耗时',
              valueScopedSlots: { customRender: 'time' }
            }
          ]
        }
      ]
    }
  },
  created () {
    this.loadData()
  },
  methods: {
    loadData () {
      const snapshots = deepGet(this.record, 'snapshots', [])
      const compressRatio = (snapshots.reduce((pre, cur) => pre + deepGet(cur, 'compressRatio', 0), 0) / snapshots.length).toFixed(2)
      this.record = Object.assign(this.record, {
        used: snapshots.reduce((pre, cur) => pre + parseInt(deepGet(cur, 'used', 0)), 0),
        compressRatio: compressRatio > 0 ? compressRatio : undefined,
        mountPath: deepGet(this.record, 'persistentVolumeClaims', []).map(u => u?.mountPath)
      })
      this.data = this.data.map(u => {
        u.list = columnsBuild(u.list, convert(this.record?.kind, 'CDM_APPLICATION_MODULE'))
        u.list = u.list.map(i => ({
          ...i,
          value: deepGet(this.record, i.key)
        }))
        return u
      })
    },
    deepGet
  }
}
</script>
