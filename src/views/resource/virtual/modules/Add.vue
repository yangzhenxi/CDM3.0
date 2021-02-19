<template>
  <form-builder ref="form" :items="items" />
</template>

<script>
import { getAllLblet } from '@/api/resource/lblet'
import { addVirtual } from '@/api/resource/virtual'
import { FormBuilder, MIcon } from '@/components'
import { enumToSelection, transformArray, deepGet } from '@/utils/util'

export default {
  components: {
    FormBuilder,
    MIcon
  },
  props: {
    record: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      items: [
        {
          label: '名称',
          prop: 'name',
          rules: { required: true, message: '请输入！' },
          component: {
            name: 'a-input'
          }
        },
        {
          label: '客户端',
          prop: 'lbletId',
          rules: { required: true, message: '请选择！' },
          component: {
            name: 'm-select',
            mode: 'multiple'
          }
        },
        {
          label: '类型',
          prop: 'virtualKind',
          rules: { required: true, message: '请选择！' },
          component: {
            name: 'm-select',
            props: {
              optionLabelProp: 'title',
              options: enumToSelection('R_VIRTUAL_MODULE', u => ({
                value: u.key,
                label: <span><m-icon type={ u.icon } style="margin-right:4px;font-size: 20px;"/>{ u.title }</span>,
                title: u.title
              }))
            },
            on: {
              select: value => {
                if (value === 1) {
                  transformArray(this.items, { prop: 'ipAddr' }, { visible: true })
                  transformArray(this.items, { prop: 'username' }, { visible: true })
                  transformArray(this.items, { prop: 'password' }, { visible: true })
                } else {
                  transformArray(this.items, { prop: 'ipAddr' }, { visible: false })
                  transformArray(this.items, { prop: 'username' }, { visible: false })
                  transformArray(this.items, { prop: 'password' }, { visible: false })
                }
              }
            }
          }
        },
        {
          label: 'VC IP',
          prop: 'ipAddr',
          visible: false,
          rules: { required: true, message: '请输入！' },
          component: {
            name: 'a-input'
          }
        },
        {
          label: '用户名',
          prop: 'username',
          visible: false,
          rules: { required: true, message: '请输入！' },
          component: {
            name: 'a-input'
          }
        },
        {
          label: '密码',
          prop: 'password',
          visible: false,
          rules: { required: true, message: '请输入！' },
          component: {
            name: 'a-input',
            props: {
              type: 'password'
            }
          }
        }
      ]
    }
  },
  created () {
    this.loadData()
  },
  methods: {
    loadData () {
      this.getLbletList()
    },
    async getLbletList () {
      const list = await Promise.resolve(deepGet(await getAllLblet(), 'data', []).map(u => ({
        value: u?.id,
        label: u?.name
      })))
      transformArray(this.items, { prop: 'lbletId' }, { component: { props: { options: list } } })
    },
    onOk () {
      return new Promise(async (resolve, reject) => {
        const { valid, values, error } = await this.$refs.form.validate()
        if (valid) {
          try {
            await addVirtual({
              name: values.name,
              lbletId: values.lbletId,
              virtualKind: values.virtualKind,
              vcenter: values.virtualKind === 1 ? {
                ipAddr: values.ipAddr,
                username: values.username,
                password: values.password
              } : undefined
            })
            this.$message.success('新建虚拟化成功！')
            resolve(true)
          } catch (error) {
            reject(error)
          }
        } else {
          reject(error)
        }
      })
    }
  }
}
</script>
