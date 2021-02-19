<template>
  <div class="list-wrapper">
    <div v-for="(item, index) in data.data" :key="item.key" :class="`list-${data.key}-arc`">
      <div v-if="data.key === 'standbyPod'" :class="setClass(index)">
        <span class="title title-standbyPod">{{ item.title }}</span>
      </div>
      <a-row
        type="flex"
        justify="space-around"
        align="middle"
        :class="setListClass(index)"
      >
        <a-col :span="7" v-for="u in item.data" :key="u.key" class="text">
          <div class="title">{{ u.title }}</div>
          <div :ref="`value-${data.key}-${u.key}`" :class="[ 'value', { scroll: u.scroll } ]">
            <span :ref="`${data.key}-${u.key}`" :class="{ scroll: u.scroll }">
              <a-tooltip v-if="u.error" :title="u.error">
                <m-icon type="question-rect" style="cursor: pointer" @click.stop/>
              </a-tooltip>
              <span v-else :title="u.value">{{ u.value | convert(u.filter || u.enum, u.config) }}</span>
            </span>
          </div>
        </a-col>
      </a-row>
      <div v-if="data.key === 'primaryPod'" :class="setClass(index)">
        <span class="title" :title="item.title">{{ item.title }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { MIcon } from '@/components'

export default {
  name: 'DgList',
  components: {
    MIcon
  },
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  watch: {
    data: {
      handler (data) {
        data.data.map(u => {
          u.data.map(i => {
            const el0 = this.$refs[`value-${this.data.key}-${i.key}`][0]
            const el1 = this.$refs[`${this.data.key}-${i.key}`][0]
            i.scroll = el0.clientWidth < el1.clientWidth
          })
        })
      },
      deep: true
    }
  },
  methods: {
    setListClass (index) {
      return [
        {
          list: true,
          [`${this.data.key}_${index}`]: true
        }
      ]
    },
    setClass (index) {
      return [
        {
          [`arc_${index}_${this.data.key}`]: true
        }
      ]
    }
  }
}

</script>
<style lang='less' scoped>
.list-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  .list-primaryPod-arc, .list-standbyPod-arc {
    display: flex;
    flex-direction: row;
    align-items: center;
    .list {
      .text {
        .bg('text');
        position: relative;
        width: 1.32em;
        height: 1.13em;
        padding: .3em 0;
        .title {
          text-align: center;
          font-size: .2em;
          font-weight: bold;
          color: rgba(255, 255, 255, .65);
        }
        .value {
          width: 100%;
          text-align: center;
          font-size: .15em;
          font-weight: normal;
          color: #1fd2c6;
          margin-top: 4px;
          overflow: hidden;
          span {
            display: inline-block;
            white-space: nowrap;
            transition: .5s all;
            &.scroll {
              will-change: left, transform;
              animation: move 16s infinite alternate linear;
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
              transform: translate(calc(-100% + 8.8em), 0);
            }
          }
        }
      }
      &.primaryPod_0, &.standbyPod_0 {
        width: 5.2em;
        height: 2.1em;
        padding: .3em .2em;
      }
      &.primaryPod_0 {
        .bg('listLeft1');
      }
      &.standbyPod_0 {
        .bg('listRight1');
      }
      &.primaryPod_1, &.standbyPod_1, &.primaryPod_2, &.standbyPod_2 {
        width: 5.2em;
        height: 3.2em;
        padding: .4em .2em;
      }
      &.primaryPod_1, &.primaryPod_2  {
        .bg('listLeft2');
      }
      &.standbyPod_1, &.standbyPod_2 {
        .bg('listRight2');
      }
    }
    .arc_0_primaryPod, .arc_1_primaryPod, .arc_2_primaryPod,
    .arc_0_standbyPod, .arc_1_standbyPod, .arc_2_standbyPod {
      width: 2.13em;
      height: 1.71em;
      position: relative;
      .title {
        position: absolute;
        top: 50%;
        left: 60%;
        transform: translate(-50%, -50%);
        font-size: .2em;
        font-weight: bold;
        &.title-standbyPod {
          transform: rotateY(180deg);
          transform-origin: 25% 25%;
          top: 40%;
        }
      }
    }
    .arc_0_primaryPod {
      .bg-arc('arc1');
      .title {
        color: #1ee3cd;
      }
    }
    .arc_1_primaryPod {
      .bg-arc('arc2');
      .title {
        color: #d4d75b;
      }
    }
    .arc_2_primaryPod {
      .bg-arc('arc3');
      .title {
        color: #c7b8ea;
      }
    }
    .arc_0_standbyPod {
      .bg-arc('arc1', 'standbyPod');
      .title {
        color: #1ee3cd;
      }
    }
    .arc_1_standbyPod {
      .bg-arc('arc2', 'standbyPod');
      .title {
        color: #d4d75b;
      }
    }
    .arc_2_standbyPod {
      .bg-arc('arc3', 'standbyPod');
      .title {
        color: #c7b8ea;
      }
    }
  }
  .list-primaryPod-arc {
    padding: .4em 0 .4em .8em;
  }
  .list-standbyPod-arc {
    padding: .4em .8em .4em 0;
  }

}
.bg-arc(@url, @key: 'primaryPod') when(@key = 'primaryPod') {
  background: #00000000 ~"url(~@/assets/img/dg/@{url}.svg)" no-repeat;
  background-size: 100% 100%;
}
.bg-arc(@url, @key: 'primaryPod') when(@key = 'standbyPod') {
  background: #00000000 ~"url(~@/assets/img/dg/@{url}.svg)" no-repeat;
  background-size: 100% 100%;
  transform: rotateY(180deg);
}
.bg-arc(@url, @key: 'primaryPod') {
  background: #00000000 ~"url(~@/assets/img/dg/@{url}.svg)" no-repeat;
  background-size: 100% 100%;
}
.bg(@url, @format: 'svg') {
  background: #00000000 ~"url(~@/assets/img/dg/@{url}.@{format})" no-repeat;
  background-size: 100% 100%;
}
</style>
