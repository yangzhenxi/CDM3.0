import Mock from 'mockjs2'
import { getBaseUrl } from '../../util'

const baseUrl = getBaseUrl()

const instances = [
  {
    db: 'zhuku',
    sid: 'zhuku',
    home: '/u01/app/oracle/product/11g/db_1',
    user: 'oracle',
    listen: '/u01/app/oracle/product/11g/db_1/network/admin',
    sizeDB: '195171440'
  },
  {
    db: 'zhuku2',
    sid: 'zhuku2',
    home: '/u01/app/oracle/product/11g/db_2',
    user: 'oracle2',
    listen: '/u01/app/oracle/product/11g/db_1/network/admin',
    sizeDB: '195171440'
  },
  {
    db: 'zhuku3',
    sid: 'zhuku3',
    home: '/u01/app/oracle/product/11g/db_3',
    user: 'oracle3',
    listen: '/u01/app/oracle/product/11g/db_1/network/admin',
    sizeDB: '195171440'
  }
]

const getOracleInstances = () => {
  return {
    instances
  }
}

Mock.mock(`${baseUrl}/admin.v1.Oracle/GetOracleInstances`, 'post', getOracleInstances)
