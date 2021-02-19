<template>
  <a-spin :spinning="loading">
    <div class="warning">
      <div class="title"><a-icon type="exclamation-circle" /> <span>您正在进行删除应用的操作！！！</span></div>
      <div class="Centered">
        <div style="margin: 10px 0px 10px 20px;color:red;font-weight:600;font-size:14px">删除应用的同时也将删除这些项:</div>
        <div style="width: 200px;margin: 0px auto;">
          <div>
            <span>黄金副本:</span>
            <span class="Centered">{{ goldenCopyNum }}</span>
            <span>个</span>
          </div>
          <br>
          <div>
            <span>虚拟副本:</span>
            <span class="Centered">{{ virtualCopyNum }}</span>
            <span>个</span>
          </div>
          <br>
        </div>
      </div>
    </div>
  </a-spin>
</template>

<script>
import { mergeWith } from 'lodash'
import { getAllGoldenCopy } from '@/api/cdm/goldenCopy'
import { getAllVirtualCopy } from '@/api/cdm/virtualCopy'
import { handleFetchStateErrorDone, deepGet } from '@/utils/util'
import { MIcon } from '@/components'

export default {
  name: 'DeleteWarning',
  components: {
    MIcon
  },
  props: {
    record: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      loading: false,
      goldenCopyNum: 0,
      virtualCopyNum: 0,
      empty: {
        state: 'empty',
        data: null
      }
    }
  },
  mounted () {
    this.loadData()
  },
  methods: {
    async loadData () {
      this.loading = true
      const [
        goldenCopyNum,
        virtualCopyNum
      ] = (await Promise.all([
        getAllGoldenCopy({ applicationID: +this.record.id }),
        getAllVirtualCopy({ applicationID: +this.record.id })
      ].map(api => api.catch(error => {
        this.empty = mergeWith(this.empty, handleFetchStateErrorDone(error), (o, s) => {
          if (Array.isArray(o)) {
            return o.concat(s)
          }
          return s
        })
      })))).map(u => deepGet(u, 'total', 0))

      this.goldenCopyNum = goldenCopyNum
      this.virtualCopyNum = virtualCopyNum
      this.loading = false
    }
  }
}
</script>

<style lang="less" scoped>
.warning {
  .title {
    display: flex;
    align-items: center;
    i {
      color: #f4a52e;
      font-size: 25px;
      font-weight: 500;
      margin-right: 10px;
    }
    span {
      font-weight: 600;
      font-size: 15px;
    }
  }
  .Centered {
      color: #f50;
      font-weight: 600;
      font-size: 17px;
  }
}
</style>
