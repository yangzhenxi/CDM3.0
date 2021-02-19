export default {
  state: {
    step: {
      step0: {},
      step1: {
        /**
         * 选择的压缩池 [name]
         * @default none
         * @type Array
         */
        redupPools: [],
        /**
         * 压缩池列表
         * @default none
         * @type Array
         */
        redupPoolList: [],
        /**
         * 远端池列表
         * @default none
         * @type Array
         */
        remotePoolList: []
      },
      step2: {
        /**
         * 源池保留时间（天）
         * @default none
         * @type number
         */
        keepDays: null,
        /**
         * 源池 -> 压缩池 -> 远端池 🌲
         * @default none
         * @type Array<SLA_LINK>
         */
        tree: []
      }
    }
  },
  mutations: {
    SET_RESOURCE_SLA_STEP: (state, { key, data }) => {
      state.step[key] = Object.assign({}, state.step[key], data)
    }
  }
}
