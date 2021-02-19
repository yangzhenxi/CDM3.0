<template>
  <div >
    <search-form-builder ref="form" :items="searchFormItems" @refresh="$refs.table.refresh()" />
    <div class="table-operator">
      <a-button icon="plus" @click="handleAdd()">新建</a-button>
      <a-switch v-model="isCluster" checked-children="开启集群" un-checked-children="关闭集群" @change="handleSwitch" />
    </div>
    <m-table
      ref="table"
      :rowKey="rowKey"
      :loading="loading"
      :columns="columns"
      :dataSource="data"
      :rowSelection="rowSelection"
      :rowClassName="rowClassName"
      :scroll="scroll"
      :pagination="false"
      :emptyItemProps="empty"
    >
      <template
        v-for="u in ['db', 'instanceName','sizeDB']"
        :slot="u"
        slot-scope="text, record"
      >
        <div :key="u" >
          <editable-cell
            :ref="`editable_${u}_${deepGet(record, 'id')}`"
            :item="getEditableItem(text, record, u)"
            @change="value => { record[u] = value }" />
        </div>
      </template>
    </m-table>
    <div class="step-form-item-operator" style="margin-top: 16px">
      <a-button @click="back">取消新建</a-button>
      <a-button @click="prev">上一步</a-button>
      <a-button type="primary" :loading="confirmLoading" @click="nextStep">下一步</a-button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
// import { pick } from 'lodash'
import { useStepFormItem, useTableContext } from '@/core/use'
import { SearchFormBuilder, MTable, EditableCell } from '@/components'
import { getOracleInstances } from '@/api/module/oracle'
import { deepGet, convert, handleFetchStateErrorDone, uniq } from '@/utils/util'

export default {
  name: 'OracleStep1',
  components: {
    SearchFormBuilder,
    EditableCell,
    MTable
  },
  setup (props, context) {
    const { back, prev, next, setStepData } = useStepFormItem(props, context)
    const columns = [
      {
        title: '客户端',
        dataIndex: 'target',
        width: 100,
        ellipsis: true,
        modules: ['oracle', 'asm']
      },
      {
        title: 'db',
        dataIndex: 'db',
        width: 100,
        ellipsis: true,
        modules: ['oracle', 'asm'],
        scopedSlots: { customRender: 'db' }
      },
      {
        title: '实例名称',
        dataIndex: 'instanceName',
        width: 100,
        ellipsis: true,
        modules: ['oracle', 'asm'],
        scopedSlots: { customRender: 'instanceName' }
      },
      {
        title: 'sid',
        dataIndex: 'sid',
        width: 100,
        ellipsis: true,
        modules: ['oracle', 'asm'],
        scopedSlots: { customRender: 'sid' }
      },
      {
        title: '用户',
        dataIndex: 'user',
        width: 100,
        ellipsis: true,
        modules: ['oracle', 'asm'],
        scopedSlots: { customRender: 'user' }
      },
      {
        title: 'Home',
        dataIndex: 'home',
        width: 150,
        ellipsis: true,
        modules: ['oracle', 'asm'],
        scopedSlots: { customRender: 'home' }
      },
      {
        title: '监听',
        dataIndex: 'listen',
        width: 150,
        ellipsis: true,
        modules: ['oracle', 'asm'],
        scopedSlots: { customRender: 'listen' }
      },
      {
        title: '数据库容量（GB）',
        dataIndex: 'sizeDB',
        width: 120,
        ellipsis: true,
        modules: ['oracle', 'asm'],
        scopedSlots: { customRender: 'sizeDB' }
      },
      {
        title: '保护状态',
        dataIndex: 'disabled',
        width: 100,
        fixed: 'right',
        scopedSlots: { customRender: 'disabled' }
      }
    ]
    const {
      rowKey,
      rowSelection,
      scroll,
      rowClassName
    } = useTableContext({
      columns,
      rowSelection: { type: 'radio',
        getCheckboxProps: record => ({
          props: {
            disabled: record.disabled,
            name: record.target
          }
        }) }
    })
    return {
      back,
      next,
      prev,
      rowKey,
      rowSelection,
      scroll,
      columns,
      rowClassName,
      setStepData

    }
  },
  data () {
    return {
      data: [],
      dbList: [],
      filterData: [],
      isCluster: false,
      loading: false,
      confirmLoading: false,
      showRowSelection: false,
      searchFormItems: [
        {
          label: 'db',
          prop: 'db',
          component: {
            name: 'm-select'
          }
        }
      ],
      fieldLabel: {
        db: 'db',
        sid: 'sid',
        home: 'home',
        listen: 'listen',
        user: 'user',
        asmSid: 'asm sid',
        asmHome: 'asm home',
        asmListen: 'asm listen',
        asmUser: 'asm user'
      },
      empty: {
        state: 'empty',
        data: null
      }
    }
  },
  computed: {
    ...mapState({
      step1: state => state.cdmApplication.step['step1']
    })
  },
  methods: {
    handleAdd () {
      const instance = {
        index: this.data.length,
        id: `${this.data.length}`,
        db: null,
        sid: null,
        user: null,
        home: null,
        listen: null,
        instanceName: null,
        target: deepGet(this.step1.lblet, 'name'),
        dbSize: 0
      };
      ['db', 'sid', 'home', 'user', 'listen', 'instanceName'].forEach(o => {
        instance[`editable_${o}`] = true
      })
      this.data.push(instance)
    },
    async nextStep () {
      const { selectedRowKeys, selectedRows } = this.rowSelection
      if (selectedRowKeys.length === 0) {
        this.$message.info('请先选择数据库实例！')
        return
      }
      this.confirmLoading = true
      let isValid = true
      await Promise.all(selectedRows.map((u, index) => {
        Object.keys(u).map(async i => {
          if (i.includes('editable')) {
            const { valid } = await this.$refs[`${i}_${u?.id}`][0].validate()
            if (!valid) {
              isValid = false
            }
          }
        })
      }))
      const instances = this.data.filter(u => selectedRowKeys.includes(u.id)).map(u => {
        const spec = {
          db: u.db,
          sid: u.sid,
          home: u.home,
          user: u.user,
          listen: u.listen,
          sizeDB: `${convert(u.sizeDB, 'unitSize', { unit: ['GB', 'B'] }).split(' ')[0]}`
        }
        return {
          name: u.instanceName,
          lbletId: +this.step1.lblet?.id,
          spec: JSON.stringify(spec)
        }
      })
      if (isValid) {
        this.setStepData({
          data: {
            instances,
            isCluster: this.isCluster
          }
        })
        this.confirmLoading = false
        this.next()
      } else {
        this.confirmLoading = false
      }
      this.confirmLoading = false
    },
    refresh () {
      this.filterData = this.data.filter(u => !this.$refs.form.model.db || u?.db.includes(this.$refs.form.model.db))
    },
    async wakeData () {
      this.loading = true
      this.data = []
      try {
        // 获取客户端下的Oracle实例信息
        const Oracle = deepGet(await getOracleInstances({ lbletID: this.step1.lblet?.id }), 'instances', [])
        Oracle.map(u => {
          const target = deepGet(this.step1.lblet, 'name')
          const db = deepGet(u, 'db')
          const sid = deepGet(u, 'sid')
          const sizeDB = +convert(u?.sizeDB, 'unitSize', { unit: ['B', 'GB'] }).split(' ')[0] * 1.5
          const instance = {
            index: this.data.length,
            id: this.data.length,
            target,
            db,
            sid,
            listen: u?.listen,
            home: u?.home,
            user: u?.user,
            instanceName: null,
            sizeDB: sizeDB > 10 ? sizeDB : 10
          };
          ['db', 'instanceName', 'sizeDB'].forEach(o => {
            instance[`editable_${o}`] = true
          })
          this.data.push(instance)
        })
        this.dbList = uniq(this.dbList)
      } catch (error) {
        this.loading = false
        this.empty = handleFetchStateErrorDone(error)
      }
      this.loading = false
      return {
        data: this.data
      }
    },
    getEditableItem (value, record = {}, prop) {
      const rules = {
        db: { required: true, message: '请输入！' },
        sizeDB: { required: true, message: '请输入！' },
        instanceName: { required: true, message: '请输入！' }
      }
      const item = {
        prop,
        value,
        rules: rules[prop],
        component: {
          name: 'a-input'
        },
        editable: record[`editable_${prop}`]
      }
      switch (prop) {
      case 'sizeDB':
        item.component = {
          name: 'a-input-number',
          props: {
            min: 1,
            max: 999,
            precision: 0
          },
          style: {
            width: '100%'
          }
        }
        break
      }
      return item
    },
    handleSwitch (e) {
      e ? this.rowSelection.type = 'checkbox' : this.rowSelection.type = 'radio'
    },
    deepGet
  }
}
</script>
