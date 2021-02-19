<template>
  <main class="main-wrapper">
    <dg-list :data="primaryPod" />
    <dg-content :data="content"/>
    <dg-list :data="standbyPod" />
  </main>
</template>

<script>
import DgContent from './Content'
import DgList from './List'
export default {
  name: 'DgMain',
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  components: {
    DgContent,
    DgList
  },
  data () {
    return {
      primaryPod: null,
      standbyPod: null,
      content: {}
    }
  },
  watch: {
    data: {
      handler (data) {
        const primaryPodData = this.data.primaryPod
        const standbyPodData = this.data.standbyPod
        this.primaryPod = {
          key: 'primaryPod',
          data: [
            {
              key: 'instance',
              title: '实例',
              data: primaryPodData.filter(u => ['ip', 'sid'].includes(u.key))
            },
            {
              key: 'db',
              title: '数据库',
              data: primaryPodData.filter(u => u.key.indexOf('db') !== -1)
            },
            {
              key: 'log',
              title: '日志',
              data: primaryPodData.filter(u => u.key.indexOf('log') !== -1)
            }
          ]
        }
        this.standbyPod = {
          key: 'standbyPod',
          data: [
            {
              key: 'instance',
              title: '实例',
              data: standbyPodData.filter(u => ['ip', 'sid'].includes(u.key))
            },
            {
              key: 'db',
              title: '数据库',
              data: standbyPodData.filter(u => u.key.indexOf('db') !== -1)
            },
            {
              key: 'log',
              title: '日志',
              data: standbyPodData.filter(u => u.key.indexOf('log') !== -1)
            }
          ]
        }
        this.content = {
          platform: [
            primaryPodData.find(u => u.key === 'platformName'),
            standbyPodData.find(u => u.key === 'platformName')
          ],
          protection: [
            primaryPodData.find(u => u.key === 'protectionMode'),
            standbyPodData.find(u => u.key === 'protectionMode')
          ],
          delay: [
            standbyPodData.find(u => u.key === 'delay')
          ],
          archive: [
            primaryPodData.find(u => u.key === 'archivePer'),
            standbyPodData.find(u => u.key === 'archivePer')
          ],
          scn: [
            {
              key: 'primaryPod',
              title: 'SCN',
              data: primaryPodData.filter(u => u.key.indexOf('scn') !== -1)
            },
            {
              key: 'standbyPod',
              title: 'SCN',
              data: standbyPodData.filter(u => u.key.indexOf('scn') !== -1)
            }
          ]
        }
      },
      deep: true,
      immediate: true
    }
  }
}

</script>
<style lang='less' scoped>
.main-wrapper {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  column-gap: .2em;
  .carousel {
    font-size: 80px;
  }
}
</style>
