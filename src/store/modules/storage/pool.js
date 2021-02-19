import { merge } from 'lodash'

export default {
  state: {
    step: {
      step1: {
        pool: {
          /**
           * 节点名
           * @default none
           * @type string
           */
          class: null,
          /**
           * 存储池类型
           * @value STORAGE_POOL_MERGE_TYPE
           * @default none
           * @type string
           */
          type: null
        }

      }
    }
  },
  mutations: {
    SET_STORAGE_POOL_STEP: (state, { key, data }) => {
      state.step[key] = merge(state.step[key], data)
    }
  }
}
