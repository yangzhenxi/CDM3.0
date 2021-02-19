export default {
  state: {
    step: {
      step1: {
        /**
         * 应用
         * @default none
         * @type object
         */
        app: null,
        /**
         * 类型
         * @value CDM_APPLICATION_TYPE
         * @default none
         * @type string
         */
        module: null,
        /**
         * 恢复参数
         * @default none
         * @type object
         */
        clone: null
      },
      step2: {
        /**
         * 实例ID
         * @default none
         * @type object
         */
        instanceID: null
      },
      step3: {
        /**
         * 实例ID
         * @default none
         * @type object
         */
        lblet: null
      },
      oracleStep1: {
        clone: {
          module: 'oracle',
          oracle: {
            op: 'recover',
            instance: {
              sid: null,
              home: null,
              listen: null,
              user: null
            },
            asm: {
              db: null,
              sid: null,
              user: null,
              home: null,
              listen: null
            },
            sga: null,
            pga: null,
            processes: null
          }
        }
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
        clone: {
          module: 'mysql',
          instance: {}
        }
      },
      mssqlStep1: {
        /**
         * 验证数据
         * @value
         * @default none
         * @type object
         */
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
        instances: []
      },
      vmwareStep1: {
        /**
         * 虚拟化
         * @default none
         * @type string
         */
        virtual: null
      },
      vmwareStep2: {
        /**
         * 数据中心
         * @default none
         * @type string
         */
        datacenter: null
      },
      vmwareStep3: {
        clone: {
          module: 'vmware',
          vmware: {
            op: 'recover',
            /**
             * 新虚拟机名称
             * @default none
             * @type string
             * @validator text
             */
            newname: null,
            /**
             * ip
             * @default none
             * @type string
             */
            host: null,
            folder: 'folder',
            resourcePool: 'resourcePool',
            /**
             * 集群
             * @value 'cluster' | ''
             * @default none
             * @type string
             */
            cluster: null,
            vmware: {
              instance: {
                datacenter: null,
                username: null,
                password: null,
                vsphere: null
              }
            }
          }
        }
      }
    }
  },
  mutations: {
    SET_CDM_WORKFLOW_STEP: (state, { key, data }) => {
      state.step[key] = Object.assign({}, state.step[key], data)
    }
  }
}
