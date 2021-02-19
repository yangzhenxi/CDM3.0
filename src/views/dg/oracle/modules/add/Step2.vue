<template>
  <div class="step-form-item">
    <search-form-builder ref="form" :items="searchFormItems" @refresh="refresh" />
    <m-table
      ref="table"
      :rowKey="rowKey"
      :loading="loading"
      :columns="columns"
      :dataSource="filterData"
      :rowSelection="rowSelection"
      :rowClassName="rowClassName"
      :scroll="scroll"
      :pagination="false"
      :emptyItemProps="empty"
    >
      <template
        v-for="u in ['db', 'sid', 'user', 'home', 'listen', 'destNum']"
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
      <template slot="disabled" slot-scope="text, record">
        <span :style="{ color: toEnum(text, 'DG_LBLET_PROTECT').color, verticalAlign: 'middle' }">
          {{ text | convert('DG_LBLET_PROTECT') }}
        </span>
        <template v-if="text">
          <span :style="{ borderBottom: `1px solid ${toEnum(text, 'DG_LBLET_PROTECT').color}` }">
            {{ record.protectedName }}
          </span>
        </template>
      </template>
    </m-table>
    <div class="step-form-item-operator" style="margin-top: 16px">
      <a-button @click="prev">{{ $t('layouts.step.operator.prev') }}</a-button>
      <a-button type="primary" :loading="confirmLoading" @click="nextStep">{{ $t('layouts.step.operator.next') }}</a-button>
    </div>
  </div>
</template>

<script>
import { mergeWith } from 'lodash'
import { mapState } from 'vuex'
import { getOracleInstances } from '@/api/module/oracle'
import { EditableCell, SearchFormBuilder } from '@/components'
import { useTableContext, useStepFormItem } from '@/core/use'
import { convert, deepGet, handleFetchStateErrorDone, toEnum, transformArray, uniq } from '@/utils/util'
import { isAlphanumericWithSymbol } from '@/utils/validator'

export default {
  name: 'Step2',
  components: {
    EditableCell,
    SearchFormBuilder
  },
  setup (props, context) {
    const {
      prev,
      next,
      setStepData
    } = useStepFormItem(props, context)
    const columns = [
      {
        title: 'db',
        dataIndex: 'db',
        width: 100,
        ellipsis: true,
        scopedSlots: { customRender: 'db' }
      },
      {
        title: 'sid',
        dataIndex: 'sid',
        width: 100,
        ellipsis: true,
        scopedSlots: { customRender: 'sid' }
      },
      {
        title: '用户',
        dataIndex: 'user',
        width: 100,
        ellipsis: true,
        scopedSlots: { customRender: 'user' }
      },
      {
        title: 'home',
        dataIndex: 'home',
        width: 182,
        ellipsis: true,
        scopedSlots: { customRender: 'home' }
      },
      {
        title: '监听',
        dataIndex: 'listen',
        width: 182,
        ellipsis: true,
        scopedSlots: { customRender: 'listen' }
      },
      {
        title: 'destNum',
        dataIndex: 'destNum',
        width: 100,
        scopedSlots: { customRender: 'destNum' }
      },
      {
        title: '保护状态',
        dataIndex: 'disabled',
        width: 108,
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
      rowSelection: { getCheckboxProps: record => ({
        props: {
          disabled: record.disabled,
          name: record.target
        }
      }) }
    })
    const clearSelected = () => {
      if (rowSelection.value) {
        rowSelection.value.onChange([], [])
      }
    }
    return {
      prev,
      next,
      setStepData,
      rowKey,
      columns,
      rowSelection,
      rowClassName,
      scroll,
      clearSelected
    }
  },
  data () {
    return {
      searchFormItems: [
        {
          label: 'db',
          prop: 'db',
          component: {
            name: 'm-select'
          }
        }
      ],
      data: [],
      filterData: [],
      empty: {
        state: 'empty',
        data: null
      },
      loading: false,
      disabledList: [],
      confirmLoading: false
    }
  },
  computed: {
    ...mapState({
      step1: state => state.dgOracle.step['step1']
    })
  },
  methods: {
    async nextStep () {
      const { selectedRowKeys, selectedRows } = this.rowSelection
      if (!selectedRowKeys.length) {
        this.$message.info('请先选择数据库实例！')
        return
      }
      const instances = this.filterData.filter(u => selectedRowKeys.includes(u.id))
      if (uniq(instances.map(u => u.db)).length > 1) {
        this.$message.info('请先选择数据库下的同一实例！')
        return
      }
      if (uniq(instances.map(u => u.sid)).length !== instances.map(u => u.sid).length) {
        this.$message.info('sid 实例名不能相同！')
        return
      }
      if (instances.some(u => this.disabledList.map(u => u.sid).includes(u.sid))) {
        this.$message.info('sid 实例名不能相同！')
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
      if (isValid) {
        this.setStepData({
          data: {
            primaryPod: {
              instances
            }
          }
        })
        this.confirmLoading = false
        this.next()
      } else {
        this.confirmLoading = false
      }
    },
    async wakeData () {
      try {
        this.loading = true
        this.clearSelected()
        this.data = []
        let dbList = []
        this.empty = {
          state: 'empty',
          data: null
        };
        (
          await Promise.all(this.step1.primaryPod.lblets
            .map(async u => getOracleInstances({ lbletID: u?.id }))
            .map(api => api.catch(error => {
              this.empty = mergeWith(this.empty, handleFetchStateErrorDone(error), (o, s) => {
                if (Array.isArray(o)) {
                  return o.concat(s)
                }
                return s
              })
            })))
        ).map(u => deepGet(u, 'instances', []))
          .map((u, i) => {
            const ip = this.step1.primaryPod.lblets[i]?.ipAddr
            const lbletId = this.step1.primaryPod.lblets[i]?.id
            const data = u.map((o, j) => {
              dbList.push(o?.db)
              const r = {
                id: this.data.length + j,
                ip,
                lbletId,
                primary: true,
                db: o?.db,
                sid: o?.sid,
                user: o?.user,
                home: o?.home,
                listen: o?.listen,
                destNum: o?.destNum || 2
              };
              ['db', 'sid', 'user', 'home', 'listen', 'destNum'].map(e => {
                r[`editable_${e}`] = true
              })
              return r
            })
            this.data.push(...data)
          })
        dbList = uniq(dbList.filter(u => u)).map(u => ({
          value: u,
          label: u
        }))
        transformArray(this.searchFormItems, { prop: 'db' }, { component: { props: { options: dbList } } })
        this.refresh()
        this.loading = false
      } catch (error) {
        this.loading = false
      }
    },
    getEditableItem (value, record = {}, prop) {
      const validator = (rule, value, callback) => {
        const { valid, error } = isAlphanumericWithSymbol(value)
        if (!valid) {
          callback(new Error(error))
        }
        callback()
      }
      const rules = {
        db: [
          { required: true, message: '请输入！' },
          { validator }
        ],
        sid: [
          { required: true, message: '请输入！' },
          { validator }
        ],
        user: { required: true, message: '请输入！' },
        home: { required: true, message: '请输入！' },
        listen: { required: true, message: '请输入！' },
        destNum: { required: true, message: '请输入！' }
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
      case 'destNum':
        item.component = {
          name: 'a-input-number',
          props: {
            min: 1,
            max: 30,
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
    refresh () {
      this.filterData = this.data.filter(u => !this.$refs.form.model.db || u?.db.includes(this.$refs.form.model.db))
    },
    deepGet,
    convert,
    toEnum
  }
}
</script>

<style lang="less" scoped>
  .step-form-content {
    .step-form-item {
      max-width: 100%;
    }
  }
</style>
