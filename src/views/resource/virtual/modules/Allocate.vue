<template>
  <div style="height: 400px">
    <a-input-search
      :placeholder="$t('layouts.table.search.form.input.placeholder')"
      enter-button
      style="margin-bottom: 16px"
      @change="e => onSearch(e.target.value)"
      @search="onSearch"
    />
    <m-table
      :rowKey="rowKey"
      :loading="loading"
      :columns="columns"
      :dataSource="data"
      :rowSelection="rowSelection"
      :customRow="customRow"
      :scroll="scroll"
      :pagination="false"
      :emptyItemProps="empty"
    />
  </div>
</template>

<script>
import { mergeWith } from 'lodash'
import { allocateUser } from '@/api/resource/virtual'
import { getAllUser } from '@/api/system/user'
import { getAllRole } from '@/api/system/role'
import { useTableContext } from '@/core/use'
import { convert, deepGet, handleFetchStateErrorDone, toEnum } from '@/utils/util'

export default {
  props: {
    record: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  setup (props, context) {
    const columns = [
      {
        title: '用户名',
        dataIndex: 'nickname',
        width: 100
      },
      {
        title: '角色',
        dataIndex: 'roleName',
        width: 80,
        scopedSlots: { customRender: 'role' }
      }
    ]
    const {
      rowKey,
      rowSelection,
      customRow,
      scroll
    } = useTableContext({
      columns,
      rowSelection: {},
      rowClick: true,
      scroll: {
        y: 300
      }
    })
    return {
      rowKey,
      columns,
      rowSelection,
      customRow,
      scroll
    }
  },
  data () {
    return {
      loading: false,
      data: [],
      localData: [],
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
        const [
          res0,
          res1
        ] = (await Promise.all([
          getAllUser(),
          getAllRole()
        ].map((api, index) => api.catch(error => {
          this.empty = mergeWith(this.empty, handleFetchStateErrorDone(error), (o, s) => {
            if (Array.isArray(o)) {
              return o.concat(s)
            }
            return s
          })
        }))))
        this.roleList = deepGet(res1, 'data', [])
        this.localData = deepGet(res0, 'data', []).map(u => ({
          ...u,
          roleName: this.roleList.find(i => u?.role === i.id)?.name
        }))
        this.data = this.localData
        this.loading = false
      } catch (error) {
        this.empty = handleFetchStateErrorDone(error)
        this.loading = false
      }
    },
    onSearch (value) {
      this.data = this.localData.filter(u => (u?.name.includes(value) || convert(u?.role, 'SYSTEM_ROLE_TYPE').includes(value)))
    },
    onOk () {
      return new Promise(async (resolve, reject) => {
        const { selectedRows } = this.rowSelection
        if (!selectedRows.length) {
          this.$message.info('请先选择需要分配的用户！')
          reject(new Error())
          return
        }
        try {
          await allocateUser({
            id: this.record.id,
            users: selectedRows.map(u => u?.name)
          })
          this.$message.success('绑定虚拟化成功！')
          resolve(true)
        } catch (error) {
          reject(error)
        }
      })
    },
    toEnum
  }
}
</script>
