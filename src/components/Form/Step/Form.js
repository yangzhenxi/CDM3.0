import { useStepForm } from '@/core/use/form'
import { deepGet } from '@/utils/util'

// NOTE: 步骤表单
/**
 * #1 步骤中使用 insertStep， setTimeout => next, 以及 keep-alive 后出现 next 下一步的组件无法渲染的问题
 *    去掉 setTimeout，或者都放在 setTimeout 中，去掉 keep-alive 问题消失
 *  \ 改成切换路由刷新缓存
 */

export default {
  name: 'StepForm',
  props: {
    step: {
      type: Array,
      required: true
    },
    config: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  setup (props, context) {
    const {
      inKeep,
      curStep,
      current,
      cache,
      insertStep,
      setStepData,
      prev,
      next,
      back,
      redo
    } = useStepForm(props, context)
    return {
      inKeep,
      curStep,
      current,
      cache,
      insertStep,
      setStepData,
      prev,
      next,
      back,
      redo
    }
  },
  methods: {
    deepGet
  },
  render () {
    const step = this.$slots[deepGet(this.curStep, [this.current, 'component'])]
    /**
     * 添加方法
     */
    if (step) {
      step[0].componentOptions.listeners = {
        insertStep: this.insertStep,
        setStepData: this.setStepData,
        back: this.back,
        prev: this.prev,
        next: this.next,
        redo: this.redo
      }
    }
    return (
      <div>
        <a-steps class="step-form" current={ this.current }>
          { this.curStep.map(i => (<a-step key={ i.key } title={ i.title } />)) }
        </a-steps>
        <div class="step-form-content">
          {
            this.inKeep ? (
              <keep-alive include={ this.cache }>
                { step }
              </keep-alive>
            ) : { step }
          }
        </div>
      </div>
    )
  }
}
