<template>
  <a-spin :spinning="o.loading">
    <h3 style="margin-bottom: 16px">
      <m-icon type="node" />
      {{ title }}
    </h3>
    <empty-provider :isEmpty="o.isEmpty" :itemProps="o.empty">
      <div class="flex-column" style="height: 400px">
        <detail :data="data" justify="end" :colon="false" />
        <a-carousel :dots="false" autoplay arrows>
          <div slot="prevArrow" class="custom-slick-arrow left">
            <a-icon type="left" />
          </div>
          <div slot="nextArrow" class="custom-slick-arrow right">
            <a-icon type="right" />
          </div>
          <div v-for="item in diskList" :key="item.key">
            <a-popover placement="top">
              <template slot="title">存储磁盘</template>
              <template slot="content">
                <detail :data="item" justify="end" :colon="false" style="width: 200px" />
              </template>
              <m-icon type="disk" class="icon-primary" style="font-size: 42px"/>
            </a-popover>
          </div>
        </a-carousel>
      </div>
    </empty-provider>
  </a-spin>
</template>

<script>
import { Detail, EmptyProvider, MIcon } from '@/components'
import { deepGet } from '@/utils/util'
import events from '../events'

export default {
  components: {
    Detail,
    EmptyProvider,
    MIcon
  },
  data () {
    return {
      title: '存储信息',
      data: [
        {
          key: 'pool',
          title: '存储池'
        },
        {
          key: 'presetSize',
          title: '预置保留容量',
          filter: 'unitSize'
        },
        {
          key: 'phyUsedSize',
          title: '原始占用容量',
          filter: 'unitSize'
        },
        {
          key: 'usedSize',
          title: '物理占用容量',
          filter: 'unitSize'
        },
        {
          key: 'protocol',
          title: '磁盘协议',
          enum: 'CDM_APPLICATION_PROTOCOL'
        },
        {
          key: 'compressRatio',
          title: '压缩比',
          filter: 'compressRatio'
        }
      ],
      diskList: [],
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
    events.$off(`update-storage-${this.id}`)
    events.$on(`update-storage-${this.id}`, () => {
      this.o = { ...this.o, ...events.data.find(u => u.id === this.id) }
      this.loadData()
    })
  },
  methods: {
    loadData () {
      this.data = this.data.map(u => Object.assign(u, {
        value: deepGet(this.o.record?.storage, u.key)
      }))
      this.diskList = this.o.record?.storage?.disk.map(u => [
        {
          key: 'name',
          title: '磁盘名称'
        },
        {
          key: 'capacity',
          title: '磁盘大小',
          filter: 'unitSize'
        },
        {
          key: 'mountPath',
          title: '磁盘路径'
        },
        {
          key: 'state',
          title: '磁盘状态',
          enum: 'STORAGE_DEVICE_DISK_STATE'
        }
      ].map(i => Object.assign(i, {
        value: deepGet(u, i.key)
      })))
    }
  }
}
</script>

<style lang="less" scoped>
  .ant-carousel {
    &:hover {
      /deep/ .custom-slick-arrow {
        transition: .3s;
        opacity: 0.5;
      }
    }
  }
  .ant-carousel /deep/ .slick-slide {
    text-align: center;
    height: 100px;
    line-height: 100px;
    overflow: hidden;
  }

  .ant-carousel /deep/ .custom-slick-arrow {
    width: 20px;
    height: 20px;
    font-size: 20px;
    color: @text-color;
    opacity: 0;
    &.left{
      left: 10px;
      z-index: 1;
    }
    &.right{
      right: 10px;
    }
  }
  .ant-carousel /deep/ .custom-slick-arrow:before {
    display: none;
  }
  .ant-carousel /deep/ .custom-slick-arrow:hover {
    opacity: 0.8;
  }

  .ant-carousel /deep/ .slick-slide {
    color: @text-color;
  }

  .ant-carousel /deep/ .slick-dots li button {
    background: @text-color;
    &.slick-active {
      background: @text-color;
    }
  }
</style>
