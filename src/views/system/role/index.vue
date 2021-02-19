<template>
  <page-header-wrapper :title="false">
    <a-card :bordered="false">
      <a-spin :spinning="loading">
        <empty-provider :isEmpty="isEmpty" :itemProps="empty">
          <a-row :gutter="24">
            <a-col :md="5">
              <div class="list">
                <div
                  v-for="item in roles"
                  :key="deepGet(item, 'id')"
                  :class="['list-item', 'flex-row', deepGet(item, 'id') === deepGet(role, 'id') ? 'list-item-active' : '']"
                  @click="handleRoleClick(item)"
                >
                  <div class="list-item-title">{{ item.name }}</div>
                  <div class="flex-row">
                    <a @click.stop="handleUpdate(item)"><a-icon type="edit" /></a>
                    <a @click.stop="handleDelete(item)"><a-icon type="delete" /></a>
                  </div>
                </div>
                <div class="operation">
                  <h4>
                    <a @click="handleAdd()"><a-icon type="plus" /> 新增</a>
                  </h4>
                </div>
              </div>
            </a-col>
            <a-col :md="5">
              <div class="list" style="margin-bottom: 16px">
                <div
                  v-for="item in modules"
                  :key="item"
                  :class="['list-item', item === module ? 'list-item-active' : '']"
                  @click="handleModuleClick(item)"
                >
                  <div class="list-item-title">{{ item }}</div>
                </div>
              </div>
            </a-col>
            <a-col :md="14">
              <div class="role-module">
                <div v-for="item in moduleObjects" :key="item.object" class="role-module-object">
                  {{ item.title }}
                  <a-checkbox
                    v-if="item.actions.length"
                    :indeterminate="item.indeterminate"
                    :checked="item.checkedAll"
                    style="margin-left: 8px"
                    @change="onChangeCheckAll($event, item)">
                    全选
                  </a-checkbox>
                  <div style="margin-top: 8px">
                    <a-checkbox-group
                      v-model="item.selected"
                      style="width: 100%"
                      @change="onChangeCheck(item)"
                    >
                      <a-row :gutter="8">
                        <a-col v-for="action in item.actions" :key="action" :md="6" :sm="12">
                          <a-checkbox :value="action" style="width: 100%" class="overflow">
                            <span :title="action">{{ action }}</span>
                          </a-checkbox>
                        </a-col>
                      </a-row>
                    </a-checkbox-group>
                  </div>
                </div>
                <a-button v-if="modules.length" type="primary" :loading="confirmLoading" @click="handleSubmit()">提交</a-button>
              </div>
            </a-col>
          </a-row>
        </empty-provider>
      </a-spin>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { mergeWith, groupBy } from 'lodash'
import { mapActions } from 'vuex'
import { getAllRole, getAllResource, deleteRole } from '@/api/system/role'
import { EmptyProvider } from '@/components'
import { deviceMixin } from '@/store/device-mixin'
import { deepGet, handleFetchStateErrorDone, isEmpty, throttle } from '@/utils/util'
import Add from './modules/Add'
import Update from './modules/Update'

export default {
  name: 'SystemRole',
  components: {
    EmptyProvider
  },
  mixins: [deviceMixin],
  data () {
    return {
      roles: [], // 角色集合
      resources: [], // 权限集合
      resourceTree: [],
      role: null, // 当前角色
      module: null, // 当前模块
      modules: [], // 模块集合
      moduleObjects: [], // 当前模块权限集合
      confirmLoading: false,
      loading: false,
      isEmpty: true,
      empty: {
        state: 'empty',
        data: []
      },
      deleteConfirm: null
    }
  },
  created () {
    this.loadData()
  },
  methods: {
    ...mapActions(['UpdateRole']),
    async loadData (bool = true) {
      this.loading = bool
      this.empty = {
        state: 'empty',
        data: null
      }
      const [
        roles,
        resources
      ] = (await Promise.all([
        getAllRole(),
        getAllResource()
      ].map((api, index) => api.catch(error => {
        this.empty = mergeWith(this.empty, handleFetchStateErrorDone(error), (o, s) => {
          if (Array.isArray(o)) {
            return o.concat(s)
          }
          return s
        })
        this.loading = false
      })))).map(u => this.deepGet(u, 'data', []))
      this.resources = resources
      const modules = groupBy(resources, 'module')
      this.resourceTree = Object.keys(modules).map(u => {
        const objects = groupBy(resources.filter(i => i.module === u), 'object')
        return {
          module: u,
          title: modules[u][0].name.split('-')[0],
          objects: Object.keys(objects).map(i => (
            {
              object: i,
              title: objects[i][0].name.split('-')[1],
              actions: objects[i].map(o => o?.name.split('-')[2]),
              selected: [],
              checkedAll: false,
              indeterminate: false
            }
          ))
        }
      })
      this.modules = this.resourceTree.map(u => u.title)
      // 角色
      this.roles = roles
      this.handleRoleClick(this.role || this.roles[0])
      this.handleModuleClick(this.module)
      this.isEmpty = !isEmpty(this.empty?.data)
      this.loading = false
    },
    handleRoleClick (role) {
      this.role = role || this.roles[0]
      const roleResources = deepGet(this.role, 'resources', []).map(u => `${u?.module}${u?.object}${u?.action}`)
      const resources = this.resources.filter(u => roleResources.includes('***') || roleResources.includes(`${u?.module}${u?.object}${u?.action}`))
      this.resourceTree.map(u => {
        u.objects.map(i => {
          i.selected = []
          i.checkedAll = false
          i.indeterminate = false
        })
      })
      resources.map(u => {
        if (roleResources.includes('***')) {
          this.resourceTree.map(u => {
            u.objects.map(i => {
              i.selected = i.actions
              this.onChangeCheck(i)
            })
          })
        } else {
          const moduleIndex = this.resourceTree.findIndex(i => i.module === u?.module)
          const module = this.resourceTree[moduleIndex]
          const objectIndex = module.objects.findIndex(i => i.object === u?.object)
          const object = module.objects[objectIndex]
          const action = object.actions.find(i => i === u?.action)
          if (action) {
            object.selected.push(action)
            this.onChangeCheck(object)
          }
        }
      })
    },
    handleModuleClick (module) {
      this.module = module || this.resourceTree[0]?.title
      this.moduleObjects = this.resourceTree.filter(u => u.title === this.module)[0]?.objects
    },
    async handleSubmit () {
      try {
        this.confirmLoading = true
        const resources = []
        this.resourceTree.map(u => {
          u.objects.map(i => {
            i.selected.map(o => {
              resources.push({
                module: u.module,
                object: i.object,
                action: o
              })
            })
          })
        })
        await this.UpdateRole({ id: this.role?.id, resources })
        this.confirmLoading = false
        this.$message.success('修改成功！')
      } catch (error) {
        this.confirmLoading = false
      }
    },
    handleAdd: throttle(function () {
      this.$dialog(Add, {
        on: {
          ok: () => {
            this.loadData(false)
          }
        }
      }, { title: '新建角色' })
    }),
    handleUpdate: throttle(function (record) {
      this.$dialog(Update, {
        record,
        on: {
          ok: () => {
            this.loadData(false)
          }
        }
      }, { title: h => <span>修改角色：{ record?.name }</span> })
    }),
    handleDelete: throttle(function (record) {
      this.deleteConfirm = undefined
      const onOk = async () => {
        if (this.deleteConfirm === 'YES') {
          await deleteRole({ id: record?.id })
          modal.destroy()
          this.loadData(false)
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
              <b style="margin-left: 4px">{ record?.name }</b>
            </p>
            <a-input v-model={ this.deleteConfirm } placeholder="请输入" allowClear { ... { on: { pressEnter: onOk } }} />
          </div>
        ),
        maskClosable: true,
        destroyOnClose: true,
        onOk
      })
    }),
    onChangeCheck (o) {
      o.indeterminate = !!o.selected.length && (o.selected.length < o.actions.length)
      o.checkedAll = o.selected.length >= o.actions.length
    },
    onChangeCheckAll (e, o) {
      Object.assign(o, {
        selected: e.target.checked ? o.actions : [],
        indeterminate: false,
        checkedAll: e.target.checked
      })
    },
    deepGet
  }
}
</script>

<style lang="less" scoped>
  .list {
    .list-item {
      cursor: pointer;
      padding: 16px 8px;
      font-size: 16px;
      border-radius: 4px;
      opacity: 1;
      transition: .5s;
      a {
        padding: 2px;
        color: @text-color;
        transition: all 0.3s;
        &:hover, &:active {
          color: @primary-color;
        }
      }
      .list-item-title {
        display: block;
        text-align: center;
        color: @text-color;
        .textOverflow
      }
    }
    .list-item-active {
      background-color: @primary-2;
      opacity: 1;
      box-shadow: 2px 0 8px rgba(0, 0, 0, .09);
      transition: .5s;
      & + li {
        border-top: 1px solid #ffffff00;
      }
    }
    .list-item-add {
      border: 1px dashed @gray-4;
    }
  }
  .role-module {
    .role-module-object {
      padding-bottom: 8px;
      border-bottom: 1px solid @gray-4;
      margin-bottom: 16px;
    }
  }
  .operation {
    margin-top: 24px;
    font-size: 16px;
    line-height: 24px;
    h4 {
      padding: 12px;
      border: 1px dashed @gray-1;
      &:hover {
        border: 1px dashed #e2e2e2;
        border-radius: 4px;
      }
    }
    a {
      display: block;
      text-align: center;
      color: @text-color;
      transition: all 0.3s;
      &:hover, &:active {
        color: @primary-color;
      }
    }
  }
</style>
