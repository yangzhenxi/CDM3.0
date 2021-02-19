<template>
  <div class="content-wrapper">
    <div class="centerDb" />
    <template v-for="item in ['platform', 'protection', 'delay']">
      <div :key="item" :class="[item]">
        <div v-for="(u, i) in data[item]" :key="i" class="text">
          <div class="title">{{ u.title }}</div>
          <div :ref="`value-${item}-${i}`" :class="[ 'value', { scroll: u.scroll } ]">
            <span :ref="`${item}-${i}`" :class="{ scroll: u.scroll }">
              <a-tooltip v-if="u.error" :title="u.error">
                <m-icon type="question-rect" style="cursor: pointer" @click.stop/>
              </a-tooltip>
              <span v-else :title="u.value">{{ u.value | convert(u.filter || u.enum, u.config) }}</span>
            </span>
          </div>
        </div>
      </div>
    </template>
    <div class="archive">
      <div v-for="(item, index) in data.archive" :key="index" class="text-arc">
        <div class="total" />
        <div class="used" ref="archiveUsed" />
        <div class="title-bg"><span>{{ item.title }}</span></div>
        <div class="value"><span>{{ item.value }}</span></div>
      </div>
    </div>
    <div class="scn">
      <div v-for="item in data.scn" :key="`scn_${item.key}`" :class="item.key">
        <div class="top">
          <div class="title-bg"><span>{{ item.title }}</span></div>
        </div>
        <div class="center">
          <div v-for="(u, i) in item.data" :key="i" class="text">
            <div class="title">{{ u.title }}</div>
            <div :ref="`value-scn-${i}`" :class="[ 'value', { scroll: u.scroll } ]">
              <span :ref="`scn-${i}`" :class="{ scroll: u.scroll }" :title="u.value">
                {{ u.value | convert(u.filter || u.enum, u.config) }}
              </span>
            </div>
          </div>
        </div>
        <div class="bottom" />
      </div>
    </div>
  </div>
</template>

<script>
import { MIcon } from '@/components'
import { isEmpty, isArray } from '@/utils/util'

export default {
  name: 'DgContent',
  components: {
    MIcon
  },
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      angleS: 210,
      angleE: -30,
      archive: [
        { value: 0 },
        { value: 0 }
      ]
    }
  },
  watch: {
    data: {
      handler (data) {
        Object.keys(data).map(u => {
          if (!isEmpty(this.$refs)) {
            if (isArray(data[u])) {
              if (['platform', 'protection', 'delay', 'scn'].includes(u)) {
                data[u].map((i, o) => {
                  this.$nextTick(() => {
                    const el0 = this.$refs[`value-${u}-${o}`][0]
                    const el1 = this.$refs[`${u}-${o}`][0]
                    i.scroll = el0.clientWidth < el1.clientWidth
                    this.$forceUpdate() // HACK: delay 更新
                  })
                })
              }
            }
          }
          if (u === 'archive') {
            data[u].map((i, o) => {
              // HACK: 只取第一次监听到的变化
              if (i.value && i.value !== this.archive[o].value) {
                this.handleArchive(i.value, o)
              }
            })
          }
        })
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    handleArchive (p, i) {
      let archivePer = this.archive[i].value
      const speed = Math.abs(archivePer - p) / 10
      if (speed) {
        this.archive[i].value = p
        const timer = setInterval(() => {
          // 注意与小数运算丢失精确度的问题
          if (p > archivePer) {
            archivePer = +(+(archivePer + speed)).toFixed(2)
          } else if (p < archivePer) {
            archivePer = +(+(archivePer - speed)).toFixed(2)
          } else {
            clearInterval(timer)
          }
          const angle = this.angleS + (archivePer % 100 / 100) * (this.angleE - this.angleS)
          this.getArchive(angle, i)
        }, 100)
      }
    },
    getArchive (angle, i) {
      // 范围 210° - -30°
      const x0 = 50
      const y0 = 50
      const r0 = 50
      const x1 = 50
      const y1 = 50
      const r1 = 35
      let scy0 = 85
      const scx1 = x1 + r1 * Math.cos(this.angleS * Math.PI / 180)
      const scy1 = y1 - r1 * Math.sin(this.angleS * Math.PI / 180)

      let ecx0 = x0 + r0 * Math.cos(angle * Math.PI / 180)
      const ecy0 = y0 - r0 * Math.sin(angle * Math.PI / 180)
      const ecx1 = x1 + r1 * Math.cos(angle * Math.PI / 180)
      const ecy1 = y1 - r1 * Math.sin(angle * Math.PI / 180)
      let ex0 = 100
      if (angle >= 90) { // 超过 90°（50%） 右上角x归0
        ex0 = 0
      }
      if (angle > 180) { // 超过 180°（0 ~ 12.5%） 终点大圆x归0
        ecx0 = 0
      }
      if (angle === this.angleS) { // 超过 210°（0） 起点大圆y = 终点大圆y
        scy0 = ecy0
      }
      if (angle < 0) { // 小于0°（87.5% ~ 100%） 终点大圆x归100
        ecx0 = 100
      }
      this.$refs.archiveUsed[i].style.clipPath = `polygon(0 0, 0 ${scy0}%, ${scx1}% ${scy1}%, ${ecx1}% ${ecy1}%, ${ecx0}% ${ecy0}%, ${ex0}% 0)`
    }
  }
}

</script>
<style lang='less' scoped>
.content-wrapper {
  position: relative;
  .centerDb {
    position: absolute;
    top: 5.5em;
    left: 50%;
    width: 7.85em;
    height: 6.5em;
    transform: translate(-50%, -50%);
    .bg('centerDb1');
    animation: db 3s infinite;
  }
  @keyframes db {
    0% {
      .bg('centerDb1');
    }
    50% {
      .bg('centerDb2');
    }
    100% {
      .bg('centerDb1');
    }
  }
  .platform, .protection, .delay, .archive  {
    position: absolute;
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
  .text {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 1.9em;
    height: .99em;
    padding: .2em;
    margin-bottom: .2em;
    .title {
      text-align: center;
      font-size: .2em;
      font-weight: bold;
      color: #00c8eb;
    }
    .value {
      width: 100%;
      text-align: center;
      font-size: .15em;
      font-weight: normal;
      color: #1dcdbe;
      margin-top: 4px;
      overflow: hidden;
      span {
        display: inline-block;
        white-space: nowrap;
        transition: .5s all;
        &.scroll {
          will-change: left, transform;
          animation: move 2s infinite alternate linear;
        }
      }
      &.scroll {
        text-align: start;
      }
      @keyframes move {
        0% {
          transform: translate(0, 0);
        }
        100% {
          transform: translate(calc(-100% + 10em), 0);
        }
      }
    }
    &:not(:first-child) {
      margin-left: .45em;
    }
  }
  .platform, .protection {
    .text {
      .bg('rect1');
    }
  }
  .platform {
    top: .6em;
  }
  .protection {
    top: 1.8em;
  }
  .delay {
    top: 3.2em;
    .text {
      .bg('rect3');
      .value {
        margin-top: .2em;
        font-size: .2em;
        .scroll {
          animation: delay_move 2s infinite alternate linear;
        }
      }
      @keyframes delay_move {
        0% {
          transform: translate(0, 0);
        }
        100% {
          transform: translate(calc(-100% + 7.5em), 0);
        }
      }
    }
  }
  .title-bg {
    position: absolute;
    left: 50%;
    transform: translate(-50%, 0);
    text-align: center;
    width: 1.15em;
    height: .4em;
    .bg('blue');
    span {
      position: absolute;
      width: 100%;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      padding: .2em;
      font-size: .2em;
      font-weight: bold;
      color: #00c8eb;
    }
  }
  .archive {
    bottom: 3em;
    .text-arc {
      position: relative;
      width: 1.5em;
      height: 1.5em;
      .total, .used {
        position: absolute;
        top: 55%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 1.4em;
        height: 1.4em;
        border-radius: .8em;
      }
      .total {
        border: .13em solid #0095ff;
        clip-path: polygon(0% 85%, 15% 70%, 85% 70%, 100% 85%, 100% 0, 0 0);
        z-index: 1;
      }
      .used {
        border: .13em solid #0bed95;
        clip-path: polygon(0 0, 0 0, 0 0, 0 0, 0 0, 0 0);
        z-index: 2;
      }
      .title-bg {
        bottom: 0;
      }
      .value {
        span {
          position: absolute;
          top: 50%;
          left: 52%;
          transform: translate(-50%, -50%);
          font: bold .3em digiface;
          color: #00bbe9;
          background-image: -webkit-gradient(linear, left 0, right 0, from(#3af7de), to(#00bbe9));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          &::after {
            content: '%';
            font-size: .17em;
          }
        }
      }
      &:not(:first-child) {
        margin-left: .45em;
      }
    }
  }
  .scn {
    position: absolute;
    width: 100%;
    bottom: .2em;
    .primaryPod, .standbyPod {
      position: absolute;
      bottom: 0;
      .center {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        .text {
          margin-bottom: 0;
          .bg('rect1');
        }
      }
      .top, .bottom {
        width: 4.63em;
        height: .13em;
        .bg('rectBottom');
      }
      .top {
        margin-bottom: .2em;
        .title-bg {
          top: -.13em;
        }
      }
      .bottom {
        margin-top: .2em;
      }
    }
    .primaryPod {
      left: -1.5em;
    }
    .standbyPod {
      right: -1.5em;
    }
  }
}
.bg(@url, @format: 'svg') {
  background: #00000000 ~"url(~@/assets/img/dg/@{url}.@{format})" no-repeat;
  background-size: 100% 100%;
}
@font-face {
  font-family: digiface;
  src: url('~@/assets/fonts/DigifaceWideRegular.TTF');
}
</style>
