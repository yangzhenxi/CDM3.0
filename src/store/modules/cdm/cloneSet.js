export default {
  state: {
    recover: {
      step: {
        step1: {
          lblet: null,
          kind: null,
          goldenCopyID: null,
          instance: []
        },
        oracleStep1: {
          /**
           * 恢复类型
           * @value ORACLE_RECOVER_OP
           * @default none
           * @type string
           */
          op: null
        },
        mysqlStep1: {
          databases: null,
          /**
           * 验证数据库的数据
           * @value
           * @default none
           * @type string
           */
          Mssql: null
        },
        mysqlStep2: {
          vaData: []
        },
        mssqlStep1: {
          Mssql: null
        },
        pgsqlStep1: {
          Pgsql: null
        },
        fileStep1: {
          lblet: null
        },
        fileStep2: {

        },
        vmwareStep1: {
          /**
           * @value VMWARE_RECOVER_OP
           * @default none
           * @type object
           */
          op: null
        },
        vmwareMountStep2: {
          lblet: null
        },
        vmwareMountStep3: {

        },
        vmwareStep2: {
          lblet: null
        },
        vmwareStep3: {
          virtual: null
        },
        vmwareStep4: {
          datacenter: null
        },
        vmwareStep5: {

        },
        hypervStep1: {
          lblet: null
        },
        hypervStep2: {

        }
      }
    },
    pollup: {
      step: {
        step1: {
          lblet: null,
          kind: null,
          goldenCopyID: null,
          instance: []
        },
        pgsqlStep1: {
          lblet: null
        }
      }
    }
  },
  mutations: {
    SET_CDM_CLONESET_STEP: (state, { key, data }) => {
      state.recover.step[key] = Object.assign({}, state.recover.step[key], data)
    },
    SET_CDM_CLONESET_POLLUP_STEP: (state, { key, data }) => {
      state.pollup.step[key] = Object.assign({}, state.pollup.step[key], data)
    }
  }
}
