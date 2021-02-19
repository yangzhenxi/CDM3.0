<template>
  <div class="operator-wrapper">
    <a-row :gutter="16" type="flex">
      <a-col v-for="item in data" :key="item.key" :flex="1">
        <div class="operator" @click="item.onClick">
          <div :class="['operator-box', item.key]">
            <a-icon :type="item.icon" />
          </div>
          <span>{{ item.title }}</span>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { deleteLblet } from '@/api/resource/lblet'
import { throttle } from '@/utils/util'
import Update from '../Update'
import Bind from '../Bind'
import events from '../events'

export default {
  data () {
    return {
      data: [],
      deleteConfirm: null,
      id: null,
      o: {}
    }
  },
  created () {
    this.id = this.$route.params.id
    events.$off(`update-operator-${this.id}`)
    events.$on(`update-operator-${this.id}`, () => {
      this.o = events.data.find(u => u.id === this.id) || {}
      this.loadData()
    })
  },
  methods: {
    loadData () {
      this.data = [
        {
          key: 'add',
          title: '新建应用',
          icon: 'plus-circle',
          onClick: throttle(() => {
            this.$router.push({ path: `/resource/lblet/${this.id}/addApplication`, query: { name: this.o.record?.name } })
          })
        },
        {
          key: 'bind',
          title: '绑定标签',
          icon: 'tag',
          onClick: throttle(() => {
            this.$dialog(Bind, {
              record: this.o.record,
              on: {
                ok: () => {
                  events.$emit('refresh')
                  events.$emit(`refresh-${this.id}`)
                }
              }
            }, { title: '绑定标签' })
          })
        },
        {
          key: 'update',
          title: '修改',
          icon: 'edit',
          onClick: throttle(() => {
            this.$dialog(Update, {
              record: this.o.record,
              on: {
                ok: () => {
                  events.$emit('refresh')
                  events.$emit(`refresh-${this.id}`)
                }
              }
            }, { title: '修改客户端' })
          })
        },
        {
          key: 'delete',
          title: '删除',
          icon: 'delete',
          onClick: throttle(() => {
            this.deleteConfirm = undefined
            const onOk = async () => {
              if (this.deleteConfirm === 'YES') {
                await deleteLblet({ id: this.id })
                modal.destroy()
                this.$multiTab.close(this.$route.fullPath, { force: true })
                this.handleBack()
                this.$message.success('提交删除成功！')
              } else {
                this.$message.error('提交删除失败！')
              }
            }
            const modal = this.$confirm({
              title: '是否删除',
              content: h => (
                <div>
                  <p>
                    请在输入 <m-tag color={'green'}>YES</m-tag>后确认删除
                  </p>
                  <a-input v-model={ this.deleteConfirm } placeholder="请输入" allowClear { ... { on: { pressEnter: onOk } }} />
                </div>
              ),
              maskClosable: true,
              destroyOnClose: true,
              onOk
            })
          })
        }
      ]
    },
    handleBack () {
      this.$router.push({ name: 'ResourceLblet' })
    }
  }
}
</script>

<style lang='less' scoped>
  .operator-wrapper {
    .operator {
      width: 100%;
      padding: 16px;
      margin-bottom: 16px;
      background: @gray-1;
      cursor: pointer;
      .operator-box {
        position: relative;
        width: 72px;
        height: 72px;
        margin: 0px auto;
        border-radius: 50%;
        &.add {
          border: 2px solid rgba(178, 111, 249, 0.4);
          box-shadow: 0 3px 8px rgba(178, 111, 249, 0.4);
          background: linear-gradient(180deg, #b26ff9, #9d44f8);
        }
        &.bind {
          border: 2px solid rgba(97, 208, 189, 0.4);
          box-shadow: 0 3px 8px rgba(97, 208, 189, 0.4);
          background: linear-gradient(180deg, #61d0bd, #28c1a7);
        }
        &.update {
          border: 2px solid rgba(64, 197, 236, 0.4);
          box-shadow: 0 3px 8px rgba(64, 197, 236, 0.4);
          background: linear-gradient(180deg, #40c5ec, #00b1e6);
        }
        &.delete {
          border: 2px solid rgba(230, 80, 73, 0.8);
          box-shadow: 0 3px 8px rgba(230, 80, 73, 0.8);
          background: linear-gradient(180deg, #ec524a, #e6514a);
        }
      }
      i {
        position: absolute;
        top: 50%;
        left: 50%;
        font-size: 48px;
        transform: translate(-50%, -50%);
        color: rgba(255, 255, 255, 0.85);
      }
      span {
        display: block;
        width: 100%;
        text-align: center;
        font-size: 20px;
        font-weight: 800;
        margin-top: 20px;
        letter-spacing: 4px;
      }
    }
  }
</style>
