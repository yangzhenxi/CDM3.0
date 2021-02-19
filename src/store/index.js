import Vue from 'vue'
import Vuex from 'vuex'

import getters from './getters'
import app from './modules/app'
import permission from './modules/permission'

import socketTerm from './modules/socket/term'

import cdmApplication from './modules/cdm/application'
import cdmCloneSet from './modules/cdm/cloneSet'
import cdmWorkflow from './modules/cdm/workflow'

import dgOracle from './modules/dg/oracle'

import storagePool from './modules/storage/pool'

import user from './modules/system/user'
import role from './modules/system/role'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    app,
    permission,
    socketTerm,

    cdmApplication,
    cdmCloneSet,
    cdmWorkflow,

    dgOracle,

    storagePool,

    user,
    role
  },
  state: {

  },
  mutations: {

  },
  actions: {

  },
  getters
})
