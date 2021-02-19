<template>
  <a-card :bordered="false" style="margin-bottom: 24px;" class="dg-wrapper">
    <div class="table-operator">
      <a-button type="primary" icon="plus" @click="handleCreate()">新建</a-button>
      <a-button icon="plus" @click="handleAdd()">添加</a-button>
    </div>
    <a-spin :spinning="loading">
      <empty-provider :isEmpty="!this.data.length" :itemProps="empty">
        <list :groups="groups" :columns="columns" :data="data" :row="row">
          <template slot="icon" slot-scope="text">
            <m-icon :type="text" class="icon-primary" style="font-size: 24px; margin-left: 0" />
          </template>
          <template slot="lsnrctlStatus" slot-scope="text">
            <div v-for="(u, index) in text" :key="`lsnrctlStatus_${index}`">
              <a-tooltip :title="deepGet(u, 'error')">
                <m-tag :color="toEnum(deepGet(u, 'state'), 'DG_DB_LSNRCTLSTATE').color" style="margin-right: 0">{{ deepGet(u, 'state') | convert('DG_DB_LSNRCTLSTATE') }}</m-tag>
              </a-tooltip>
            </div>
          </template>
          <template slot="archiverDestStatus" slot-scope="text">
            <div v-for="(u, index) in text" :key="`archiverDestStatus_${index}`">
              <a-tooltip :title="deepGet(u, 'error')">
                <m-tag :color="toEnum(deepGet(u, 'state'), 'DG_LOG_ARCHIVER_DEST_STATE').color" style="margin-right: 0">{{ deepGet(u, 'state') | convert('DG_LOG_ARCHIVER_DEST_STATE') }}</m-tag>
              </a-tooltip>
            </div>
          </template>
          <template slot="status" slot-scope="text, record">
            <a-tooltip v-if="text === 1" :title="deepGet(record, 'error')">
              <span>{{ text | convert('DG_STATE') }}</span>
            </a-tooltip>
            <m-icon v-else type="sync" :class="setStatusClass(record)"/>
          </template>
          <template slot="operator" slot-scope="text, record">
            <div v-if="deepGet(record, 'model.kind') === 2">
              <a class="button error" @click.stop="handleDestroy(record)">销毁</a>
            </div>
            <div>
              <a class="button error" @click.stop="handleDelete(record)">删除</a>
            </div>
          </template>
        </list>
      </empty-provider>
    </a-spin>

  </a-card>
</template>

<script>
import storage from 'store'
import { getAllDg, getDGInfo, deleteDg, destroyDg } from '@/api/dg/oracle'
import { EmptyProvider, MIcon } from '@/components'
import { DG_VISUALIZE_PARAMS } from '@/store/mutation-types'
import { deepGet, handleFetchStateErrorDone, handleFetchTextErrorDone, throttle, toEnum } from '@/utils/util'
import { List } from './Components'

export default {
  name: 'DgOracle',
  components: {
    EmptyProvider,
    MIcon,
    List
  },
  data () {
    return {
      groups: [
        {
          key: 'rh',
          span: 2
        },
        {
          key: 'primaryPod',
          span: 10
        },
        {
          key: 'status',
          span: 2
        },
        {
          key: 'standbyPod',
          span: 10
        }
      ],
      columns: [
        {
          key: 'name',
          title: '名称',
          span: 24,
          modules: ['rh']
        },
        {
          key: 'icon',
          title: '主',
          span: 2,
          modules: ['primaryPod'],
          valueScopedSlots: { customRender: 'icon' }
        },
        {
          key: 'icon',
          title: '从',
          span: 2,
          modules: ['standbyPod'],
          valueScopedSlots: { customRender: 'icon' }
        },
        {
          key: 'lbletId',
          title: '客户端',
          span: 4,
          modules: ['primaryPod', 'standbyPod'],
          valueScopedSlots: { customRender: 'array' }
        },
        {
          key: 'ip',
          title: 'IP',
          span: 5,
          modules: ['primaryPod', 'standbyPod'],
          valueScopedSlots: { customRender: 'array' }
        },
        {
          key: 'sid',
          title: '实例',
          span: 3,
          modules: ['primaryPod', 'standbyPod'],
          valueScopedSlots: { customRender: 'array' }
        },
        {
          key: 'lsnrctlStatus',
          title: '监听',
          span: 4,
          modules: ['primaryPod', 'standbyPod'],
          valueScopedSlots: { customRender: 'lsnrctlStatus' }
        },
        {
          key: 'archiverDestStatus',
          title: 'Dest_N',
          span: 4,
          modules: ['primaryPod', 'standbyPod'],
          valueScopedSlots: { customRender: 'archiverDestStatus' }
        },
        {
          key: 'status',
          title: '',
          span: 24,
          modules: ['status']
        }
      ],
      data: [],
      row: record => {
        return {
          on: {
            click: throttle(() => {
              storage.set(DG_VISUALIZE_PARAMS, record)
              window.open(this.$router.resolve({ name: 'dgOracleInfo' }).href, '_blank')
            })
          }
        }
      },
      loading: false,
      empty: {
        state: 'empty',
        data: null
      }
    }
  },
  created () {
    this.loadData()
  },
  methods: {
    async loadData () {
      try {
        this.loading = true
        this.data = deepGet(await getAllDg(), 'data', []).map(u => {
          u.pi = []
          u.si = []
          const instances = deepGet(u, 'instances', [])
          instances.map(i => {
            if (i?.primary) {
              u.pi.push(i)
            } else {
              u.si.push(i)
            }
          });
          [u.pi, u.si].map((i, index) => {
            u[['primaryPod', 'standbyPod'][index]] = {
              icon: i.length > 1 ? 'databases' : 'database',
              lbletId: i.map(o => o?.lbletId),
              ip: i.map(o => o?.ip),
              db: i.map(o => o?.db),
              sid: i.map(o => o?.sid),
              home: i.map(o => o?.home),
              listen: i.map(o => o?.listen),
              user: i.map(o => o?.user),
              destNum: i.map(o => o?.destNum),
              username: i[0]?.username,
              lsnrctlStatus: [],
              archiverDestStatus: []
            }
          })
          return {
            ...u,
            rh: {
              name: u?.model?.name
            },
            primaryPod: u?.primaryPod,
            standbyPod: u?.standbyPod
          }
        })
        this.loading = false;
        (async () => {
          this.data = await Promise.all(this.data.map(async u => {
            const lsnrctlStatus = (await Promise.all([
              ...u.pi.map(async i => deepGet(await getDGInfo({
                lbletID: i?.lbletId,
                instance: {
                  sid: i?.sid,
                  user: i?.user,
                  home: i?.home,
                  listen: i?.listen
                },
                typename: 'getLsnrctlStatus'
              }), 'data')),
              ...u.si.map(async i => deepGet(await getDGInfo({
                lbletID: i?.lbletId,
                instance: {
                  sid: i?.sid,
                  user: i?.user,
                  home: i?.home,
                  listen: i?.listen
                },
                typename: 'getLsnrctlStatus'
              }), 'data'))
            ].map((api, index) => api.catch(e => e)))).map(i => {
              return {
                state: i?.lsnrctlStatus,
                error: handleFetchTextErrorDone(i?.e)
              }
            })
            const pLsnrctlStatus = lsnrctlStatus.slice(0, u.pi.length)
            const sLsnrctlStatus = lsnrctlStatus.slice(u.pi.length, lsnrctlStatus.length)
            u.primaryPod.lsnrctlStatus = pLsnrctlStatus
            u.standbyPod.lsnrctlStatus = sLsnrctlStatus
            return u
          }))
        })();
        (async () => {
          this.data = await Promise.all(this.data.map(async u => {
            const archiverDestStatus = (await Promise.all([
              ...u.pi.map(async i => deepGet(await getDGInfo({
                lbletID: i?.lbletId,
                instance: {
                  sid: i?.sid,
                  user: i?.user,
                  home: i?.home,
                  listen: i?.listen
                },
                destNum: i?.destNum,
                typename: 'getArchiveDestStatus'
              }), 'data')),
              ...u.si.map(async i => deepGet(await getDGInfo({
                lbletID: i?.lbletId,
                instance: {
                  sid: i?.sid,
                  user: i?.user,
                  home: i?.home,
                  listen: i?.listen
                },
                destNum: i?.destNum,
                typename: 'getArchiveDestStatus'
              }), 'data'))
            ].map(api => api.catch(e => e)))).map(i => {
              return {
                state: i?.archDestStatus,
                error: handleFetchTextErrorDone(i?.e)
              }
            })
            const pArchiverDestStatus = archiverDestStatus.slice(0, u.pi.length)
            const sArchiverDestStatus = archiverDestStatus.slice(u.pi.length, archiverDestStatus.length)
            u.primaryPod.archiverDestStatus = pArchiverDestStatus
            u.standbyPod.archiverDestStatus = sArchiverDestStatus
            return u
          }))
        })()
      } catch (error) {
        this.empty = handleFetchStateErrorDone(error)
        this.loading = false
      }
    },
    handleCreate: throttle(function () {
      this.$router.push({ name: 'DgOracleCreate' })
    }),
    handleAdd: throttle(function () {
      this.$router.push({ name: 'DgOracleAdd' })
    }),
    handleDestroy: throttle(function (record) {
      this.$confirm({
        title: `是否销毁`,
        content: `销毁容灾组备库`,
        maskClosable: true,
        onOk: async () => {
          try {
            await destroyDg({ id: record?.model?.id })
            this.$message.success('提交销毁成功！')
          } catch (error) {}
        }
      })
    }),
    handleDelete: throttle(function (record) {
      this.$confirm({
        title: `是否删除`,
        content: `把 ${record?.name} 从监控中移除`,
        maskClosable: true,
        onOk: async () => {
          try {
            await deleteDg({ id: record?.model?.id })
            this.$message.success('提交删除成功！')
          } catch (error) {}
        }
      })
    }),
    setStatusClass (record) {
      const state = [
        ...record.primaryPod.archiverDestStatus,
        ...record.standbyPod.archiverDestStatus
      ]
      const valid = state.filter(u => u?.state !== 'VALID')
      if (valid.length === 0) {
        return ['icon', 'empty']
      } else if (valid.length < state.length) {
        return ['icon', 'half']
      } else {
        return ['icon', 'full']
      }
    },
    deepGet,
    toEnum
  }
}

</script>

<style lang="less" scoped>
  .icon {
    font-size: 32px;
    &.empty {
      color: #1AB394;
    }
    &.half {
      color: #F8AC59;
    }
    &.full {
      color: #ED5565;
    }
  }
</style>
