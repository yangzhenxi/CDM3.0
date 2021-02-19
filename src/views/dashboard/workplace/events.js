import Vue from 'vue'

export default new Vue({
  data () {
    return {
      data: {},
      storage: {
        poolList: [],
        selectedPoolKey: null
      },
      dg: {}
    }
  }
})
