import { toRefs, reactive, getCurrentInstance, onMounted, onActivated } from '@vue/composition-api'
import { columnsBuild, uuid } from '@/utils/util'

function useStepForm (props, context) {
  const _ = getCurrentInstance().proxy
  const { step, config } = props
  const { inKeep = true, store, route } = config
  const state = reactive({
    inKeep,
    step: [],
    curStep: [],
    current: 0,
    cache: []
  })

  const loadData = () => {
    step.map(u => {
      u.key = `${u.component}-${uuid()}`
      state.cache.push(`${u.component}`)
      _.$store.commit(store, { key: u.dataKey, data: null })
    })
    state.step = step
    state.curStep = columnsBuild(step)
    state.current = 0
  }

  onMounted(() => {
    loadData()
  })

  const insertStep = (module) => {
    state.curStep = columnsBuild(state.step, module)
  }

  const setStepData = ({ key, data }) => {
    if (key) {
      _.$store.commit(store, { key, data })
    } else {
      _.$store.commit(store, { key: state.curStep[state.current].dataKey, data })
    }
  }

  const prev = () => {
    if (state.current > 0) {
      state.current -= 1
    }
  }

  const next = () => {
    if (state.current < state.curStep.length - 1) {
      state.current += 1
    }
  }

  const back = () => {
    const path = _.$route.fullPath
    _.$multiTab.close(path, { force: true })
    _.$router.push({ path: route })
  }

  const redo = () => {
    _.$router.replace({
      path: '/redirect' + _.$route.path, query: { name: _.$route.name, params: _.$route.params, query: _.$route.query }
    })
    loadData()
  }

  return {
    ...toRefs(state),
    insertStep,
    setStepData,
    prev,
    next,
    back,
    redo
  }
}

function useStepFormItem (props, context, options = {}) {
  const _ = getCurrentInstance().proxy

  onMounted(() => {
    _.loadData && _.loadData()
  })

  onActivated(() => {
    _.wakeData && _.wakeData()
  })

  const setStepData = (value) => {
    context.emit('setStepData', value)
  }

  const back = () => {
    context.emit('back')
  }

  const prev = () => {
    context.emit('prev')
  }

  const next = () => {
    context.emit('next')
  }

  const redo = () => {
    context.emit('redo')
  }

  return {
    back,
    prev,
    next,
    redo,
    setStepData
  }
}

export {
  useStepForm,
  useStepFormItem
}
