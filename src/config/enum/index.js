import { EMPTY_VALUE } from '@/config/constant.config'

import state from './common/state'

import oracle from './module/oracle'
import mysql from './module/mysql'
import mssql from './module/mssql'
import pgsql from './module/pgsql'
import file from './module/file'
import vmware from './module/vmware'
import hyperv from './module/hyperv'

import resourceLblet from './resource/lblet'
import resourceVirtual from './resource/virtual'

import backup from './backup/backup'

import cdmApplication from './cdm/application'
import cdmInstance from './cdm/instance'
import cdmGoldenCopy from './cdm/goldenCopy'
import cdmVirtualCopy from './cdm/virtualCopy'
import cdmProtectionStrategy from './cdm/protectionStrategy'
import cdmWorkflow from './cdm/workflow'
import cdmPersistentVolume from './cdm/persistentVolume'

import dgOracle from './dg/oracle'

import taskMonitor from './task/monitor'

import logUser from './log/user'
import logAlert from './log/alert'

import storageClass from './storage/class'
import storageDevice from './storage/device'
import storagePool from './storage/pool'

import systemAlert from './system/alert'
import systemComponent from './system/component'
import systemLicense from './system/license'
import systemRole from './system/role'
import systemUser from './system/user'

export default {
  ...state,

  ...oracle,
  ...mysql,
  ...mssql,
  ...pgsql,
  ...file,
  ...vmware,
  ...hyperv,

  ...resourceLblet,
  ...resourceVirtual,

  ...backup,

  ...cdmApplication,
  ...cdmInstance,
  ...cdmGoldenCopy,
  ...cdmVirtualCopy,
  ...cdmProtectionStrategy,
  ...cdmWorkflow,
  ...cdmPersistentVolume,

  ...dgOracle,

  ...taskMonitor,

  ...storageClass,
  ...storageDevice,
  ...storagePool,

  ...logUser,
  ...logAlert,

  ...systemAlert,
  ...systemComponent,
  ...systemLicense,
  ...systemRole,
  ...systemUser,

  // 未找到
  ...{ notFound: [{ key: EMPTY_VALUE, value: EMPTY_VALUE }] }
}
