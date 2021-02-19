<template>
  <a-spin :spinning="o.loading">
    <empty-provider :isEmpty="o.isEmpty" :itemProps="o.empty">
      <div :id="`sla_${id}`" />
    </empty-provider>
  </a-spin>
</template>

<script>
import G6 from '@antv/g6'
import { EmptyProvider } from '@/components'
import { deepGet } from '@/utils/util'
import events from '../events'

const charts = {}

const nodeConfig = {
  bgColor: '#fff',
  borderColor: '#1AB394',
  borderHoverColor: '#123',
  iconColor: '#23c6c8',
  textColor: 'rgba(0, 0, 0, .65)',
  remarkColor: 'rgba(0, 0, 0, .45)'
}

export default {
  components: {
    EmptyProvider
  },
  data () {
    return {
      list: {
        nodes: [],
        edges: []
      },
      graph: null,
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
  mounted () {
    this.id = this.$route.params.id
    events.$off(`update-detail-${this.id}`)
    events.$on(`update-detail-${this.id}`, () => {
      this.o = { ...this.o, ...events.data.find(u => u.id === this.id) }
      this.loadData()
    })
  },
  methods: {
    async loadData () {
      this.register()
      const tree = deepGet(this.o.record, 'chain.targets', [])
      this.list = {
        nodes: [
          {
            id: '0',
            type: 'm-node',
            icon: '\ue645',
            name: `源池`,
            remark: `保留天数：${deepGet(this.o.record, 'chain.keep')} 天`,
            anchorPoints: [
              [0, 0.5],
              [1, 0.5],
              [0.5, 0],
              [0.5, 1]
            ]
          }
        ],
        edges: []
      }
      const generator = (pool) => {
        let name = ''
        let source = '0'
        if (f === 1) {
          name = `压缩池：${deepGet(pool, 'poolId')}`
          source = '0'
        } else {
          name = `远端池：${deepGet(pool, 'target.pool')}`
          source = `${this.list.nodes.length}`
        }
        const node = {
          id: `${this.list.nodes.length + 1}`,
          type: 'm-node',
          icon: '\ue645',
          name,
          remark: `保留天数：${deepGet(pool, 'keep')} 天`,
          anchorPoints: [
            [0, 0.5],
            [1, 0.5],
            [0.5, 0],
            [0.5, 1]
          ]
        }
        const edge = {
          source,
          target: `${this.list.nodes.length + 1}`,
          label: '',
          style: {
            stroke: '#1AB394',
            shadowColor: '#1AB394cc',
            shadowBlur: 2,
            opacity: 0.85,
            endArrow: true
          }
        }
        this.list.nodes.push(node)
        this.list.edges.push(edge)
        if (pool.next) {
          f = 2
          generator(pool.next)
        }
      }
      let f = 1
      tree.map((u, index) => {
        generator(u)
      })
      this.init()
      this.behavior()
    },
    init () {
      const container = `sla_${this.id}`
      const width = document.getElementById(container).scrollWidth
      const height = document.getElementById(container).scrollHeight || 300
      const minimap = new G6.Minimap({
        size: [150, 100]
      })
      charts[container] && charts[container].destroy()
      delete charts[container]
      charts[container] = new G6.Graph({
        container,
        width,
        height,
        modes: {
          default: [ 'drag-canvas', 'drag-node', 'zoom-canvas' ]
        },
        layout: {
          type: 'dagre',
          preventOverlap: true,
          nodeSize: 30,
          rankdir: 'LR',
          align: 'DL',
          nodesep: 40,
          ranksep: 120
        },
        animate: true,
        defaultNode: {
          type: 'm-node'
        },
        defaultEdge: {
          size: 2,
          labelCfg: {
            autoRotate: true,
            refY: 10
          },
          lineAppendWidth: 5
        },
        plugins: [ minimap ]
      })
      charts[container].data(this.list)
      charts[container].render()
    },
    register () {
      G6.registerNode(
        'm-node', {
          drawShape: (cfg, group) => {
            const container = group.addShape('rect', {
              attrs: {
                x: 0,
                y: 0,
                width: 200,
                height: 100,
                fill: nodeConfig.bgColor,
                stroke: nodeConfig.borderColor,
                shadowColor: 'rgba(0, 0, 0, .09)',
                shadowBlur: 8,
                shadowOffsetX: 0,
                shadowOffsetY: 2,
                lineWidth: 1,
                radius: 2,
                cursor: 'pointer'
              }
            })
            group.addShape('text', {
              attrs: {
                x: 26,
                y: 50,
                fontFamily: 'iconfont', // 对应css里面的font-family: "iconfont";
                textAlign: 'center',
                textBaseline: 'middle',
                text: cfg.icon,
                fill: nodeConfig.iconColor,
                fontSize: 48
              }
            })
            group.addShape('text', {
              attrs: {
                text: cfg.name,
                x: 58,
                y: 24,
                fontSize: 16,
                textAlign: 'left',
                textBaseline: 'middle',
                fill: nodeConfig.textColor
              }
            })
            group.addShape('text', {
              attrs: {
                text: cfg.remark,
                x: 58,
                y: 48,
                fontSize: 14,
                textAlign: 'left',
                textBaseline: 'middle',
                fill: nodeConfig.remarkColor
              }
            })
            return container
          },
          setState (name, value, item) {
            const group = item.getContainer()
            const shape = group.get('children')[0] // 顺序根据 draw 时确定
            if (name === 'hover') {
              if (value) {
                const attrs = {
                  x: -7.5,
                  y: -5.5,
                  width: 215,
                  height: 111,
                  stroke: '#fff'
                }
                shape.attr(attrs)
              } else {
                const attrs = {
                  x: 0,
                  y: 0,
                  width: 200,
                  height: 100,
                  stroke: nodeConfig.borderColor
                }
                shape.attr(attrs)
              }
            }
          }
        },
        'single-shape'
      )
    },
    behavior () {
      const container = `sla_${this.id}`
      charts[container].on('node:mouseenter', evt => {
        const node = evt.item
        charts[container].setItemState(node, 'hover', true)
      })
      charts[container].on('node:mouseleave', evt => {
        const node = evt.item
        charts[container].setItemState(node, 'hover', false)
      })
      charts[container].on('edge:mouseenter', evt => {
        const edge = evt.item
        const model = edge.getModel()
        model.oriLabel = model.label
        charts[container].setItemState(edge, 'hover', true)
        /* charts[container].updateItem(edge, {
          label: '执行天数'
        }) */
      })
      charts[container].on('edge:mouseleave', evt => {
        const edge = evt.item
        const model = edge.getModel()
        charts[container].setItemState(edge, 'hover', false)
        charts[container].updateItem(edge, {
          label: model.oriLabel
        })
      })
    }
  }
}

</script>

<style>
  @import '/assets/js/icon.css';
</style>
