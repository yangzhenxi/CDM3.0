<template>
  <div class="user-wrapper">
    <h3>
      {{ title }}
      <a-icon type="form" class="icon-primary" @click.native="handleUpdate" />
    </h3>
    <a-spin :spinning="loading">
      <empty-provider :isEmpty="isEmpty" :itemProps="empty">
        <detail :data="data">
          <template slot="status" slot-scope="text, r">
            <a-tooltip :title="deepGet(r, 'error')">
              <m-tag :color="toEnum(text, 'SYSTEM_USER_STATE').color">{{ text | convert('SYSTEM_USER_STATE') }}</m-tag>
            </a-tooltip>
            <a-tooltip title="异常信息">
              <m-tag color="red">异常</m-tag>
            </a-tooltip>
          </template>
        </detail>
      </empty-provider>
    </a-spin>
  </div>
</template>

<script>
import { mergeWith } from 'lodash'
import { mapGetters } from 'vuex'
import { getUser } from '@/api/system/user'
import { getAllRole } from '@/api/system/role'
import { Detail, EmptyProvider, FormBuilder } from '@/components'
import { deepGet, handleFetchStateErrorDone, throttle, toEnum } from '@/utils/util'
import Update from './Update'

export default {
  name: 'Info',
  components: {
    Detail,
    EmptyProvider,
    FormBuilder
  },
  data () {
    return {
      title: '个人信息',
      data: [
        {
          key: 'nickname',
          title: '名称',
          tooltip: '说明信息'
        },
        {
          key: 'username',
          title: '用户名'
        },
        {
          key: 'roleName',
          title: '角色'
        },
        {
          key: 'email',
          title: '邮箱'
        },
        {
          key: 'status',
          title: '状态',
          enum: 'SYSTEM_USER_STATE',
          valueScopedSlots: { customRender: 'status' }
        },
        {
          key: 'createdAt',
          title: '创建时间',
          filter: 'unixToDate'
        }
      ],
      record: {},
      isEmpty: true,
      empty: {
        state: 'empty',
        data: []
      },
      loading: false
    }
  },
  computed: {
    ...mapGetters(['user'])
  },
  created () {
    this.loadData()
  },
  methods: {
    async loadData () {
      this.loading = true
      this.empty = {
        state: 'empty',
        data: null
      }
      const [
        res0,
        res1
      ] = await Promise.all([
        getUser({ id: this.user?.id }),
        getAllRole()
      ].map((api, index) => api.catch(error => {
        this.empty = mergeWith(this.empty, handleFetchStateErrorDone(error), (o, s) => {
          if (Array.isArray(o)) {
            return o.concat(s)
          }
          return s
        })
        this.loading = false
      })))
      this.record = res0?.data
      const role = deepGet(res1, 'data', []).find(u => u?.id === this.record?.id)
      this.record.roleName = role?.name
      this.data = this.data.map(u => Object.assign(u, {
        value: deepGet(this.record, u.key)
      }))
      this.isEmpty = false
      this.loading = false
    },
    handleUpdate: throttle(function () {
      this.$dialog(Update, {
        record: this.record,
        on: {
          ok: () => {
            this.loadData()
          }
        }
      }, { title: '修改用户' })
    }),
    deepGet,
    toEnum
  }
}
</script>
