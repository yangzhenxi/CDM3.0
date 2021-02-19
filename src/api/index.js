// NOTE: 提供接口信息

import { Api as Oracle } from './module/oracle'
import { Api as Mssql } from './module/mssql'
import { Api as Mysql } from './module/mysql'
import { Api as Pgsql } from './module/pgsql'
import { Api as Vmware } from './module/vmware'
import { Api as Hyperv } from './module/hyperv'
import { Api as File } from './module/file'

import { Api as dashboard } from './dashboard/workplace'

import { Api as resourceLblet } from './resource/lblet'
import { Api as resourceVirtual } from './resource/virtual'
import { Api as resourceSLA } from './resource/sla'

import { Api as cdmApplication } from './cdm/application'
import { Api as cdmInstance } from './cdm/instance'
import { Api as cdmGoldenCopy } from './cdm/goldenCopy'
import { Api as cdmProtectionStrategy } from './cdm/protectionStrategy'
import { Api as cdmVirtualCopy } from './cdm/virtualCopy'
import { Api as cdmWorkflow } from './cdm/workflow'

import { Api as dgOracle } from './dg/oracle'

import { Api as taskMonitor } from './task/monitor'

import { Api as storageClass } from './storage/class'
import { Api as storagePool } from './storage/pool'

import { Api as logUser } from './log/user'
import { Api as logAlert } from './log/alert'

import { Api as systemAlert } from './system/alert'
import { Api as systemComponent } from './system/component'
import { Api as system } from './system'
import { Api as systemLicense } from './system/license'
import { Api as systemRole } from './system/role'
import { Api as systemUser } from './system/user'

export default [

  ...Oracle,
  ...Mssql,
  ...Mysql,
  ...Pgsql,
  ...Vmware,
  ...Hyperv,
  ...File,

  ...dashboard,

  ...resourceLblet,
  ...resourceVirtual,
  ...resourceSLA,

  ...cdmApplication,
  ...cdmInstance,
  ...cdmGoldenCopy,
  ...cdmProtectionStrategy,
  ...cdmVirtualCopy,
  ...cdmWorkflow,

  ...cdmApplication,
  ...cdmGoldenCopy,
  ...cdmProtectionStrategy,
  ...cdmVirtualCopy,
  ...cdmWorkflow,

  ...dgOracle,
  ...taskMonitor,

  ...storageClass,
  ...storagePool,

  ...logUser,
  ...logAlert,

  ...storagePool,

  ...systemAlert,
  ...systemComponent,
  ...system,
  ...systemLicense,
  ...systemRole,
  ...systemUser
]
