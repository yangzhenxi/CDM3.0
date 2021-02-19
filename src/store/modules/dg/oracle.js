import { merge } from 'lodash'

export default {
  state: {
    step: {
      step1: {
        primaryPod: {
          lblets: []
        }
      },
      step2: {
        primaryPod: {
          instances: []
        }
      },
      step3: {
        standbyPod: {
          lblets: []
        }
      },
      step4: {
        standbyPod: {
          instances: []
        }
      },
      step5: {},
      step6: {}
    }
  },
  mutations: {
    SET_DG_ORACLE_STEP: (state, { key, data }) => {
      state.step[key] = merge(state.step[key], data)
    }
  }
}
