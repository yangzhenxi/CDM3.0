<template>
  <page-header-wrapper :title="false">
    <a-card :bordered="false">
      <s-operator :config="operatorConfig"/>
      <s-table
        ref="table"
        :columns="columns"
        :fetchData="fetchData"
        :emptyItemProps="empty"
      >
        <template slot="module" slot-scope="text">
          <span class="hover-default">{{ text | convert('SYSTEM_LICENSE_MODULE') }}</span>
        </template>
        <template slot="type" slot-scope="text">
          <m-icon :type="toEnum(text, 'SYSTEM_LICENSE_TYPE').icon" style="font-size: 24px" />
        </template>
        <template slot="state" slot-scope="text, record">
          <a-tooltip :title="deepGet(record, 'error')">
            <m-tag :color="toEnum(text, 'SYSTEM_LICENSE_STATE').color">{{ text | convert('SYSTEM_LICENSE_STATE') }}</m-tag>
          </a-tooltip>
        </template>
        <template slot="action" slot-scope="text, record">
          <div class="table-inline-operator">
            <a-button type="primary" size="small" @click.stop="handleBind(record)">绑定</a-button>
          </div>
        </template>
      </s-table>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { getLicenseList } from '@/api/system/license'
import { MIcon, STable, SOperator } from '@/components'
import { deepGet, handleFetchStateErrorDone, isEmpty, throttle, toEnum } from '@/utils/util'
import Info from './modules/Info'
import PoolInfo from './modules/PoolInfo'
import Bind from './modules/Bind.vue'
import Upload from './modules/Upload'

export default {
  name: 'SystemLicense',
  components: {
    MIcon,
    STable,
    SOperator
  },
  data () {
    return {
      operatorConfig: {
        fields: [
          {
            key: '导入',
            props: {
              type: 'primary',
              icon: 'plus'
            },
            onClick: throttle(() => {
              this.handleUpload()
            })
          }
        ]
      },
      columns: [
        {
          title: '模块',
          dataIndex: 'module',
          width: 100,
          ellipsis: true,
          scopedSlots: { customRender: 'module' },
          customCell: (record, index) => ({
            style: {
              color: '#1890ff',
              cursor: 'pointer'
            },
            on: {
              click: e => {
                e.stopPropagation()
                if (deepGet(record, 'module') === 'storage' && this.$enum('STORAGE_POOL_TYPE').map(u => u.key).includes(deepGet(record, 'type'))) {
                  this.$dialog(PoolInfo, { record }, {
                    width: 700,
                    footer: false
                  })
                } else {
                  this.$dialog(Info, { record }, {
                    width: 400,
                    footer: false
                  })
                }
              }
            }
          })
        },
        {
          title: '类型',
          dataIndex: 'type',
          width: 80,
          align: 'center',
          scopedSlots: { customRender: 'type' }
        },
        {
          title: '授权时间',
          dataIndex: 'createdAt',
          width: 175,
          scopedSlots: { customRender: 'unixToDate' }
        },
        {
          title: '过期时间',
          dataIndex: 'expireDate',
          width: 175,
          scopedSlots: { customRender: 'unixToDate' }
        },
        {
          title: '状态',
          dataIndex: 'state',
          width: 80,
          fixed: 'right',
          scopedSlots: { customRender: 'state' }
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: 60,
          fixed: 'right',
          scopedSlots: { customRender: 'action' }
        }
      ],
      fetchData: async params => {
        this.empty = {
          state: 'empty',
          data: null
        }
        let data = []
        try {
          data = deepGet(await getLicenseList(params), 'data.items', [])
        } catch (error) {
          this.empty = handleFetchStateErrorDone(error)
        }
        if (isEmpty(this.empty?.data)) {
          return {
            data
          }
        } else {
          return {}
        }
      },
      empty: {
        state: 'empty',
        data: null
      }
    }
  },
  methods: {
    handleUpload: throttle(function (record) {
      this.$dialog(Upload, { on: { ok: () => { this.$refs.table.refresh() } } }, { title: '导入' })
    }),
    handleBind: throttle(function (record) {
      this.$dialog(Bind, { record, on: { ok: () => { this.$refs.table.refresh() } } }, { title: '绑定' })
    }),
    deepGet,
    toEnum
  }
}
</script>
