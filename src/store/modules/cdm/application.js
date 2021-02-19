export default {
  state: {
    step: {
      step1: {
        module: null,
        lblet: null
      },
      oracleStep1: {
        /**
         * 客户端
         * @default none
         * @type Array
         */
        lblets: [],
        /**
         * 集群
         * @default none
         * @type boolean
         */
        isCluster: false
      },
      oracleStep2: {
        /**
         * 实例
         * @default none
         * @type string
         */
        instances: []
      },
      mysqlStep1: {
        databaseList: [],
        spec: {
          database: null,
          ip: null,
          password: null,
          username: null,
          spec: null,
          port: null
        }
      },
      mysqlStep2: {
        instance: {}
      },
      mssqlStep1: {
        databaseList: [],
        spec: {
          database: null,
          ip: null,
          password: null,
          username: null,
          spec: null,
          port: null
        }
      },
      mssqlStep2: {
        instances: []
      },
      pgsqlStep1: {
        databaseList: [],
        spec: {
          user: null,
          password: null,
          port: null,
          sslMode: null,
          dbName: null,
          ip: null
        }
      },
      pgsqlStep2: {
        vaData: []
      },
      pgsqlStep3: {
        pgsql: {
          addr: {
            ip: null,
            port: null
          },
          auth: {
            username: null,
            password: null
          },
          database: null,
          sslMode: 'disable',
          databases: [],
          databasePath: null,
          databaseSize: null,
          version: null
        }
      },
      fileStep1: {
        /**
         * 客户端
         * @default none
         * @type object
         */
        lblet: null
      },
      vmwareStep1: {},
      hypervStep1: {}
    }
  },
  mutations: {
    SET_CDM_APPLICATION_STEP: (state, { key, data }) => {
      state.step[key] = Object.assign({}, state.step[key], data)
    }
  }
}
