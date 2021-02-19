<template>
  <div>
    <form-builder ref="form" :items="items">
      <template #operator v-if="record.type === 'application'">
        <div class="optionInstance">选择实例:</div>
        <div style="max-height: 400px; min-height:150px; margin:0px 10px;">
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
          >
            <template slot="state" slot-scope="text">
              <span>{{ text | convert('CDM_INSTANCE_STATE') }}</span>
            </template>
          </m-table>
        </div>
      </template>
    </form-builder>
  </div>
</template>

<script>
import { backupInstance } from '@/api/cdm/instance'
import { FormBuilder } from '@/components'
import { enumToSelection, deepGet } from '@/utils/util'
import { useTableContext } from '@/core/use'

export default {
  components: {
    FormBuilder
  },
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
        title: '实例名',
        dataIndex: 'name',
        width: 100
      },
      {
        title: '状态',
        dataIndex: 'state',
        width: 80,
        scopedSlots: { customRender: 'state' }
      }
    ]
    const { rowKey, customRow, scroll } = useTableContext({
      columns,
      rowClick: true,
      scroll: {
        y: 300
      }
    })
    return {
      rowKey,
      columns,
      customRow,
      scroll
    }
  },
  data () {
    return {
      data: [],
      loading: false,
      localData: [],
      selectedRows: [],
      items: [
        {
          label: '类型',
          prop: 'type',
          labelCol: { span: 3 },
          wrapperCol: { span: 24 },
          rules: { required: true, message: '请选择！' },
          component: {
            name: 'm-select',
            props: {
              options: enumToSelection('CDM_APPLICATION_BACKUP_TYPE')
            }
          }
        }
      ],
      empty: {
        state: 'empty',
        data: null
      }
    }
  },
  computed: {
    rowSelection () {
      const self = this
      return {
        selectedRows: self.selectedRows,
        onChange: function (selectedRowKeys, selectedRow) {
          self.selectedRows = selectedRow
        },
        getCheckboxProps (record) {
          return {
            defaultChecked: true, // 配置默认勾选的列
            props: {
              defaultChecked: true // 配置默认勾选的列
            }
          }
        }
      }
    }
  },
  created () {
    this.loadData()
  },
  methods: {
    loadData () {
      this.loading = true
      this.localData = deepGet(this.record, 'instances', [])
      this.data = this.localData
      this.selectedRows = this.localData
      this.loading = false
    },
    onSearch (value) {
      this.data = this.localData.filter(u => u?.name.includes(value))
    },
    onOk () {
      return new Promise(async (resolve, reject) => {
        const { valid, values, error } = await this.$refs.form.validate()
        if (this.record.type === 'application') {
          const { selectedRows } = this.rowSelection
          if (!selectedRows.length) {
            this.$message.info('请先选择要备份的实例')
            reject(new Error())
            return
          }
          if (valid) {
            let isValid = true
            await Promise.all(selectedRows.map(async u => {
              try {
                const params = {
                  id: u.id,
                  type: values.type
                }
                await backupInstance(params)
              } catch (error) {
                isValid = false
                this.$message.error('提交备份失败')
              }
            }))
            if (isValid) {
              this.$message.success('提交备份成功！')
              resolve(true)
            } else {
              reject(error)
              this.$message.error('提交备份失败！')
            }
          } else {
            reject(new Error())
          }
        } else {
          try {
            const params = {
              id: this.record.id,
              type: values.type
            }
            await backupInstance(params)
            resolve(true)
            this.$message.success('备份成功')
          } catch (error) {
            this.$message.error('备份失败')
            reject(error)
          }
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .optionInstance::before{
      display: inline-block;
      margin-right: 4px;
      color: #f5222d;
      font-size: 14px;
      font-family: SimSun, sans-serif;
      line-height: 1;
      content: '*';
  }
  .optionInstance{
    margin-left:10px;
    margin-bottom:10px;
  }
</style>
