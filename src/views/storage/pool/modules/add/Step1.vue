<template>
  <div class="step-form-item">
    <form-builder ref="form" :items="items">
      <template #operator>
        <div class="step-form-item-operator">
          <a-button @click="back">{{ $t('layouts.step.operator.back') }}</a-button>
          <a-button type="primary" @click="nextStep">{{ $t('layouts.step.operator.next') }}</a-button>
        </div>
      </template>
    </form-builder>
  </div>
</template>

<script>
import { getAllClass } from '@/api/storage/class'
import { FormBuilder, MIcon } from '@/components'
import { useStepFormItem } from '@/core/use/form'
import { deepGet, enumToSelection, handleFetchStateErrorDone, transformArray } from '@/utils/util'

export default {
  name: 'Step1',
  components: {
    FormBuilder,
    MIcon
  },
  setup (props, context) {
    const {
      back,
      next,
      setStepData
    } = useStepFormItem(props, context)
    return {
      back,
      next,
      setStepData
    }
  },
  data () {
    return {
      items: [
        {
          label: '节点',
          prop: 'class',
          rules: { required: true, message: '请选择！' },
          component: {
            name: 'm-select'
          }
        },
        {
          label: '类型',
          prop: 'type',
          rules: { required: true, message: '请选择！' },
          component: {
            name: 'm-select',
            props: {
              optionLabelProp: 'title',
              options: enumToSelection('STORAGE_POOL_TYPE', u => ({
                value: u.key,
                label: <span><m-icon type={ u.icon } style="margin-right: 4px" />{ u.value }</span>,
                title: u.value
              }))
            }
          }
        }
      ],
      classList: []
    }
  },
  methods: {
    async nextStep () {
      const { valid, values } = await this.$refs.form.validate()
      if (valid) {
        this.setStepData({
          data: {
            pool: {
              classId: this.classList.find(u => u?.name === values.class)?.id,
              class: values.class,
              type: values.type
            }
          }
        })
        this.next()
      }
    },
    async wakeData () {
      try {
        this.classList = deepGet(await getAllClass(), 'data', [])
        transformArray(this.items, { prop: 'class' }, { component: { props: { options: this.classList.map(u => ({
          value: u?.name,
          label: u?.name
        })) } } })
      } catch (error) {
        transformArray(this.items, { prop: 'class' }, { component: { props: { emptyItemProps: handleFetchStateErrorDone(error) } } })
      }
    }
  }
}
</script>
