<template>
  <div ref="dg" class="dg-wrapper">
    <div id="preloadedImages" />
    <dg-header class="header" :title="title"/>
    <dg-main :data="data" class="main"/>
  </div>
</template>

<script>
import storage from 'store'
import { getDGInfo } from '@/api/dg/oracle'
import { EMPTY_VALUE } from '@/config/constant.config'
import { DG_VISUALIZE_PARAMS } from '@/store/mutation-types'
import { deepGet, debounce, handleFetchTextErrorDone } from '@/utils/util'
import { DgHeader, DgMain } from './modules'

export default {
  name: 'DataGuard',
  components: {
    DgHeader,
    DgMain
  },
  data () {
    return {
      title: '',
      data: {
        primaryPod: [
          { key: 'ip', title: 'IP', value: '-', error: null },
          { key: 'sid', title: '实例名', value: '-', error: null },

          // { key: 'db', title: '名称', value: '-' },
          { key: 'dbRole', title: '角色', value: '-', error: null },
          { key: 'dbRedoCount', title: '日志组数', value: '-', filter: 'unit', config: { unit: '个' }, error: null },
          { key: 'dbLogMode', title: '归档模式', value: '-', enum: 'DG_DB_ARCHIVELOG', error: null },
          { key: 'dbForceLog', title: '强制日志', value: '-', enum: 'DG_DB_FORCELOG', error: null },
          { key: 'dbLsnrctlStatus', title: '监听状态', value: '-', enum: 'DG_DB_LSNRCTLSTATE', error: null },
          { key: 'dbOpenMode', title: '打开状态', value: '-', enum: 'DG_DB_OPENMODE', error: null },

          { key: 'logGroup', title: '当前日志组', error: null },
          { key: 'logArchiveDest', title: '日志路径', value: '-', error: null },
          { key: 'logSchedule', title: '定时调度', value: '-', enum: 'DG_LOG_SCHEDULE', error: null },
          { key: 'logDestNum', title: 'Dest_ID', value: '-', error: null },
          { key: 'logArchiveDestStatus', title: '日志状态', value: '-', enum: 'DG_LOG_ARCHIVER_DEST_STATE', error: null },
          { key: 'logTransmitMode', title: '传输模式', value: '-', error: null },

          { key: 'platformName', title: '平台信息', value: '-', error: null },

          { key: 'protectionMode', title: '保护模式', value: '-', error: null },
          { key: 'protectionLevel', title: '保护级别', value: '-', error: null },

          { key: 'archivePer', title: '归档占用率', value: 0, error: null },

          { key: 'scnThread', title: '线程', value: '-', error: null },
          { key: 'scnSequence', title: '序列', value: '-', error: null }
        ],
        standbyPod: [
          { key: 'ip', title: 'IP', value: '-', error: null },
          { key: 'sid', title: '实例名', value: '-', error: null },

          { key: 'dbRole', title: '角色', value: '-', error: null },
          { key: 'dbRedoCount', title: '日志组数', value: '-', filter: 'unit', config: { unit: '个' }, error: null },
          { key: 'dbLogMode', title: '归档模式', value: '-', enum: 'DG_DB_ARCHIVELOG', error: null },
          { key: 'dbForceLog', title: '强制日志', value: '-', enum: 'DG_DB_FORCELOG', error: null },
          { key: 'dbLsnrctlStatus', title: '监听状态', value: '-', enum: 'DG_DB_LSNRCTLSTATE', error: null },
          { key: 'dbOpenMode', title: '打开状态', value: '-', enum: 'DG_DB_OPENMODE', error: null },

          { key: 'logGroup', title: '当前日志组', error: null },
          { key: 'logArchiveDest', title: '日志路径', value: '-', error: null },
          { key: 'logSchedule', title: '定时调度', value: '-', enum: 'DG_LOG_SCHEDULE', error: null },
          { key: 'logDestNum', title: 'Dest_ID', value: '-', error: null },
          { key: 'logArchiveDestStatus', title: '日志状态', value: '-', enum: 'DG_LOG_ARCHIVER_DEST_STATE', error: null },
          { key: 'logTransmitMode', title: '传输模式', value: '-', error: null },

          { key: 'platformName', title: '平台信息', value: '-', error: null },

          { key: 'protectionMode', title: '保护模式', value: '-', error: null },
          { key: 'protectionLevel', title: '保护级别', value: '-', error: null },

          { key: 'archivePer', title: '归档占用率', value: 0, error: null },

          { key: 'scnThread', title: '线程', value: '-', error: null },
          { key: 'scnSequence', title: '序列', value: '-', error: null },

          { key: 'delay', title: '传输延时', value: '-', error: null }
        ]
      },
      currentPrimaryPod: {
        type: 'primaryPod',
        index: 0,

        ip: '-',
        sid: '-',

        // 数据库
        // db: '-', // 名称
        dbRole: '-', // 角色
        dbRedoCount: '-', // 日志组数量
        dbLogMode: '-', // 归档模式
        // dbArchiveDest: '-', // 归档路径
        // dbArchiveDestStatus: '-', // 归档状态
        dbForceLog: '-', // 强制日志模式状态
        dbLsnrctlStatus: '-', // lsnrctl 监听模式
        dbOpenMode: '-', // 打开模式

        // 日志
        logGroup: '-', // 日志类型
        logArchiveDest: '-', // 日志路径
        logSchedule: '-', // 定时调度
        logDestNum: '-', // Dest_ID
        logArchiveDestStatus: '-', // 日志状态
        logTransmitMode: '-', // 传输模式

        // 平台
        platformName: '-', // 名称

        // 保护模式
        protectionMode: '-', // 模式
        protectionLevel: '-', // 级别

        archivePer: 0, // 归档占用率

        // scn
        scnThread: '-', // 线程数
        scnSequence: '-' // 序列
      },
      currentStandbyPod: {
        type: 'standbyPod',
        index: 0,

        ip: '-',
        sid: '-',

        // 数据库
        // db: '-', // 名称
        dbRole: '-', // 角色
        dbRedoCount: '-', // 日志组数量
        dbLogMode: '-', // 归档模式
        // dbArchiveDest: '-', // 归档路径
        // dbArchiveDestStatus: '-', // 归档状态
        dbForceLog: '-', // 强制日志模式状态
        dbLsnrctlStatus: '-', // lsnrctl 监听模式
        dbOpenMode: '-', // 打开模式

        // 日志
        logGroup: '-', // 日志类型
        logArchiveDest: '-', // 日志路径
        logSchedule: '-', // 定时调度
        logDestNum: '-', // Dest_ID
        logArchiveDestStatus: '-', // 日志状态
        logTransmitMode: '-', // 传输模式

        // 平台
        platformName: '-', // 名称

        // 保护模式
        protectionMode: '-', // 模式
        protectionLevel: '-', // 级别

        archivePer: 0, // 归档占用率

        // scn
        scnThread: '-', // 线程数
        scnSequence: '-', // 序列

        // 延时
        delay: '-'
      }
    }
  },
  created () {
    const record = storage.get(DG_VISUALIZE_PARAMS)
    if (!record) {
      this.$router.push({ name: 'dgOracle' })
    } else {
      this.refresh(this.currentPrimaryPod)
      this.refresh(this.currentStandbyPod)
      this.loadData(record)
      const timer = setInterval(() => {
        this.loadData(record)
      }, 60000)
      this.$once('hook:beforeDestroy', () => {
        clearInterval(timer)
      })
    }
  },
  mounted () {
    this.$refs.dg.style.fontSize = document.body.clientWidth > 1920 ? `${document.body.clientWidth / 24}px` : '80px'
    window.onresize = debounce(() => {
      this.$refs.dg.style.fontSize = document.body.clientWidth > 1920 ? `${document.body.clientWidth / 24}px` : '80px'
    })
  },
  methods: {
    loadData (record) {
      this.title = record?.model.name
      let p = 0
      let s = 0
      const primaryPod = {
        type: 'primaryPod',
        lbletId: record.primaryPod.lbletId[p],
        ip: record.primaryPod.ip[p],
        db: record.primaryPod.db[p],
        sid: record.primaryPod.sid[p],
        user: record.primaryPod.user[p],
        home: record.primaryPod.home[p],
        listen: record.primaryPod.listen[p],
        destNum: record.primaryPod.destNum[p]
      }
      const standbyPod = {
        type: 'standbyPod',
        lbletId: record.standbyPod.lbletId[s],
        ip: record.standbyPod.ip[s],
        db: record.standbyPod.db[s],
        user: record.standbyPod.user[s],
        sid: record.standbyPod.sid[s],
        home: record.standbyPod.home[s],
        listen: record.standbyPod.listen[s],
        destNum: record.standbyPod.destNum[s]
      }
      this._getDGInfo(primaryPod, p)
      this._getDGInfo(standbyPod, s)
      p = (p + 1) % record.pi.length
      s = (s + 1) % record.si.length
    },
    _getDGInfo (pod, index) {
      const { type, lbletId: lbletID, ip, db, destNum, ...instance } = pod
      const currentPod = type === 'primaryPod' ? this.currentPrimaryPod : this.currentStandbyPod
      currentPod.ip = ip
      currentPod.sid = instance.sid
      currentPod.db = db
      currentPod.logDestNum = destNum
      const params = {
        lbletID,
        instance
      }

      const func = (fetch) => {
        (async () => {
          await fetch()
          this.refresh(currentPod)
        })()
      }

      func(async () => {
        try {
          currentPod.dbRole = deepGet(await getDGInfo({ ...params, typename: 'getDBRole' }), 'data.role')
          currentPod.dbRole_error = null
        } catch (error) {
          currentPod.dbRole_error = error
        }
      })

      func(async () => {
        try {
          currentPod.dbRedoCount = deepGet(await getDGInfo({ ...params, typename: 'getRedoCount' }), 'data.redoCount')
          currentPod.dbRedoCount_error = null
        } catch (error) {
          currentPod.dbRedoCount_error = error
        }
      })

      func(async () => {
        try {
          currentPod.dbLogMode = deepGet(await getDGInfo({ ...params, typename: 'getDBLogMode' }), 'data.logMode')
          currentPod.dbLogMode_error = null
        } catch (error) {
          currentPod.dbLogMode_error = error
        }
      })

      func(async () => {
        try {
          const res = deepGet(await getDGInfo({ ...params, typename: 'getArchivePer' }), 'data')
          currentPod.logArchiveDest = res?.archiveDest
          currentPod.archivePer = +(+deepGet(res, 'archivePer', 0)).toFixed(0)
          currentPod.logArchiveDest_error = null
          currentPod.archivePer_error = null
        } catch (error) {
          currentPod.logArchiveDest_error = error
          currentPod.archivePer_error = error
        }
      })

      func(async () => {
        try {
          currentPod.dbForceLog = deepGet(await getDGInfo({ ...params, typename: 'getForceLog' }), 'data.forceLog')
          currentPod.dbForceLog_error = null
        } catch (error) {
          currentPod.dbForceLog_error = error
        }
      })

      func(async () => {
        try {
          currentPod.dbLsnrctlStatus = deepGet(await getDGInfo({ ...params, typename: 'getLsnrctlStatus' }), 'data.lsnrctlStatus')
          currentPod.dbLsnrctlStatus_error = null
        } catch (error) {
          currentPod.dbLsnrctlStatus_error = error
        }
      })

      func(async () => {
        try {
          currentPod.dbOpenMode = deepGet(await getDGInfo({ ...params, typename: 'getOpenMode' }), 'data.openMode')
          currentPod.dbOpenMode_error = null
        } catch (error) {
          currentPod.dbOpenMode_error = error
        }
      })

      func(async () => {
        try {
          currentPod.logGroup = deepGet(await getDGInfo({ ...params, typename: 'getCurrentLogGroup' }), 'data.currentLogGroup')
          currentPod.logGroup_error = null
        } catch (error) {
          currentPod.logGroup_error = error
        }
      })

      func(async () => {
        try {
          const typename = type === 'primaryPod' ? 'getPrimaryLog' : 'getStandbyLog'
          currentPod.logSchedule = deepGet(await getDGInfo({ ...params, typename }), 'data.Schedule')
          currentPod.logSchedule_error = null
        } catch (error) {
          currentPod.logSchedule_error = error
        }
      })

      func(async () => {
        try {
          currentPod.logArchiveDestStatus = deepGet(await getDGInfo({ ...params, destNum, typename: 'getArchiveDestStatus' }), 'data.archDestStatus')
          currentPod.logArchiveDestStatus_error = null
        } catch (error) {
          currentPod.logArchiveDestStatus_error = error
        }
      })

      func(async () => {
        try {
          currentPod.logTransmitMode = deepGet(await getDGInfo({ ...params, destNum, typename: 'getTransmitMode' }), 'data.transmitMode')
          currentPod.logTransmitMode_error = null
        } catch (error) {
          currentPod.logTransmitMode_error = error
        }
      })

      func(async () => {
        try {
          currentPod.platformName = deepGet(await getDGInfo({ ...params, typename: 'getPlatform' }), 'data.PlatformName')
          currentPod.platformName_error = null
        } catch (error) {
          currentPod.platformName_error = error
        }
      })

      func(async () => {
        try {
          const res = deepGet(await getDGInfo({ ...params, typename: 'getProtection' }), 'data', {})
          currentPod.protectionMode = deepGet(res, 'ProtectionMode')
          currentPod.protectionLevel = deepGet(res, 'ProtectionLevel')
          currentPod.protectionMode_error = null
          currentPod.protectionLevel_error = null
        } catch (error) {
          currentPod.protectionMode_error = error
          currentPod.protectionLevel_error = error
        }
      })

      func(async () => {
        try {
          const res = deepGet(await getDGInfo({ ...params, typename: 'getCurrentSCN' }), 'data', {})
          currentPod.scnThread = deepGet(res, 'Thread')
          currentPod.scnSequence = deepGet(res, 'Sequence')
          currentPod.scnThread_error = null
          currentPod.scnSequence_error = null
        } catch (error) {
          currentPod.scnThread_error = error
          currentPod.scnSequence_error = error
        }
      })

      if (type === 'standbyPod') {
        func(async () => {
          try {
            const res = deepGet(await getDGInfo({ ...params, typename: 'getTransportLag' }), 'data', {})
            currentPod.delay = deepGet(res, 'Lag')
            currentPod.delay_error = null
          } catch (error) {
            currentPod.delay_error = error
          }
        })
      }
    },
    refresh (currentPod) {
      this.data[currentPod.type].map(u => Object.assign(u, {
        value: deepGet(currentPod, u.key, EMPTY_VALUE),
        error: handleFetchTextErrorDone(currentPod[`${u.key}_error`])
      }))
      if (currentPod.type === 'standbyPod') {
        this.data.standbyPod.find(u => u.key === 'delay').value = currentPod.delay
      }
    }
  }
}

</script>
<style lang='less' scoped>
#preloadedImages {
  width: 0px;
  height: 0px;
  display: inline;
  .bg('background', 'jpg', #102449);
  .bg('header', 'jpg');
  .bg('headerTime');
  .bg('listLeft1');
  .bg('listRight1');
  .bg('listLeft2');
  .bg('listRight2');
  .bg('arc1');
  .bg('arc2');
  .bg('arc3');
  .bg('centerDb1');
  .bg('centerDb2');
  .bg('rect1');
  .bg('rect2');
  .bg('rect3');
  .bg('blue');
  .bg('rectBottom');
}
.dg-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  min-width: 1920px;
  min-height: 1080px;
  padding: 0;
  margin: 0;
  color: @text-color-secondary-dark;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .bg('background', 'jpg', #102449);
  &.visual {
    font-size: 80px;
  }
  .header {
    flex: 0 0 1em;
    height: 1em;
  }
  .main {
    flex: 1;
  }
}
.bg(@url, @format: 'svg', @color: #00000000) {
  background: #00000000 ~"url(~@/assets/img/dg/@{url}.@{format})" no-repeat;
  background-size: 100% 100%;
}
</style>
