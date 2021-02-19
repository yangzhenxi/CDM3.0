import { UserLayout, BasicLayout, RouteView } from '@/layouts'

/**
 * 基础路由
 * @type { *[] }
 */
export const asyncRouterMap = [
  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    redirect: '/dashboard',
    meta: { title: '首页' },
    children: [
      {
        path: '/dashboard',
        redirect: '/dashboard/workplace',
        component: RouteView,
        meta: { hiddenSub: true },
        children: [
          {
            path: '/dashboard/workplace',
            name: 'Workplace',
            component: () => import('@/views/dashboard/workplace'),
            meta: { title: '系统概况', icon: 'workspace', keepAlive: true }
          }
        ]
      },
      {
        path: '/resource',
        component: RouteView,
        redirect: '/resource/lblet',
        meta: { title: '系统资源', icon: 'resource' },
        children: [
          {
            path: '/resource/lblet',
            name: 'ResourceLblet',
            component: () => import('@/views/resource/lblet'),
            meta: { title: '客户端', keepAlive: true }
          },
          {
            path: '/resource/lblet/:id',
            name: 'ResourceLbletInfo',
            component: () => import('@/views/resource/lblet/modules/Info/index.vue'),
            meta: { title: '客户端 - 详情', keepAlive: true, hidden: true }
          },
          {
            path: '/resource/lblet/:id/addApplication',
            name: 'ResourceLbletAdd',
            component: () => import('@/views/resource/lblet/modules/add/index.vue'),
            meta: { title: '客户端 - 新建应用', keepAlive: true, hidden: true }
          },
          {
            path: '/resource/virtual',
            name: 'ResourceVirtual',
            component: () => import('@/views/resource/virtual'),
            meta: { title: '虚拟化', keepAlive: true }
          },
          {
            path: '/resource/virtual/:id',
            name: 'ResourceVirtualInfo',
            component: () => import('@/views/resource/virtual/modules/Info/index.vue'),
            meta: { title: '虚拟化 - 详情', keepAlive: true, hidden: true }
          }
        ]
      },
      {
        path: '/cdm',
        component: RouteView,
        redirect: '/cdm/application',
        meta: { title: 'CDM', icon: 'cdm' },
        children: [
          {
            path: '/cdm/application',
            name: 'CdmApplication',
            component: () => import('@/views/cdm/application'),
            meta: { title: '应用管理', keepAlive: true }
          },
          {
            path: '/cdm/application/add',
            name: 'CdmApplicationAdd',
            component: () => import('@/views/cdm/application/modules/add/index.vue'),
            meta: { title: '应用管理 - 新增', keepAlive: true, hidden: true }
          },
          {
            path: '/cdm/application/:applicationId/goldenCopy/recover/:id',
            name: 'CdmApplicationGoldenCopyRecover',
            component: () => import('@/views/cdm/application/modules/goldenCopy/recover/index.vue'),
            meta: { title: '黄金副本 - 挂载', hidden: true }
          },
          {
            path: '/cdm/application/:applicationId/virtualCopy/pollUp',
            name: 'cdmApplicationVirtualCopyPollUp',
            component: () => import('@/views/cdm/application/modules/virtualCopy/pollUp/index.vue'),
            meta: { title: '虚拟副本 - 快速拉起', hidden: true }
          },
          {
            path: '/cdm/application/:id',
            name: 'CdmApplicationInfo',
            component: () => import('@/views/cdm/application/modules/Info/index.vue'),
            meta: { title: '应用管理 - 详情', keepAlive: true, hidden: true }
          },
          {
            path: '/cdm/application/:id/instances',
            name: 'CdmApplicationInstancesInfo',
            component: () => import('@/views/cdm/application/modules/InstancesInfo/index.vue'),
            meta: { title: '应用管理 - 详情', keepAlive: true, hidden: true }
          },
          {
            path: '/cdm/application/:applicationId/instances/:id',
            name: 'CdmApplicationInstanceInfo',
            component: () => import('@/views/cdm/application/modules/InstancesInfo/Instance/index.vue'),
            meta: { title: '应用管理 - 实例详情', keepAlive: true, hidden: true }
          },
          {
            path: '/cdm/application/:applicationId/sla/add',
            name: 'CdmApplicationSLAAdd',
            component: () => import('@/views/cdm/application/modules/sla/add'),
            meta: { title: 'SLA - 新建', keepAlive: true, hidden: true }
          },
          {
            path: '/cdm/application/:applicationId/sla/update/:id',
            name: 'CdmApplicationSLAUpdate',
            component: () => import('@/views/cdm/application/modules/sla/update'),
            meta: { title: 'SLA - 修改', keepAlive: true, hidden: true }
          },
          {
            path: '/cdm/application/:applicationId/sla/:id',
            name: 'CdmApplicationSLAInfo',
            component: () => import('@/views/cdm/application/modules/sla/Info/index.vue'),
            meta: { title: 'SLA - 详情', keepAlive: true, hidden: true }
          }
          // {
          //   path: '/cdm/workflow',
          //   name: 'CdmWorkflow',
          //   component: () => import('@/views/cdm/workflow'),
          //   meta: { title: '工作流', keepAlive: true }
          // },
          // {
          //   path: '/cdm/workflow/add',
          //   name: 'CdmWorkflowAdd',
          //   component: () => import('@/views/cdm/workflow/modules/add/index.vue'),
          //   meta: { title: '工作流 - 新增', keepAlive: true, hidden: true }
          // },
          // {
          //   path: '/cdm/workflow/:id',
          //   name: 'CdmWorkflowInfo',
          //   component: () => import('@/views/cdm/workflow/modules/Info/index.vue'),
          //   meta: { title: '工作流 - 详情', keepAlive: true, hidden: true }
          // }
        ]
      },
      {
        path: '/backup',
        component: RouteView,
        redirect: '/backup/application',
        meta: { title: '数据备份', icon: 'backup' },
        children: [
          {
            path: '/backup/application',
            name: 'BackupApplication',
            component: () => import('@/views/backup/application'),
            meta: { title: '应用管理', keepAlive: true }
          },
          {
            path: '/backup/application/add',
            name: 'BackupApplicationAdd',
            component: () => import('@/views/backup/application/modules/add'),
            meta: { title: '应用管理 - 新增', keepAlive: true, hidden: true }
          },
          {
            path: '/backup/application/:id',
            name: 'BackupApplicationInfo',
            component: () => import('@/views/backup/application/modules/Info/index.vue'),
            meta: { title: '应用管理 - 详情', keepAlive: true, hidden: true }
          },
          {
            path: '/backup/application/:applicationId/instances/:id',
            name: 'BackupApplicationInstanceInfo',
            component: () => import('@/views/backup/application/modules/Info/modules/index.vue'),
            meta: { title: '应用管理 - 实例详情', keepAlive: true, hidden: true }
          }
        ]
      },
      {
        path: '/dg',
        component: RouteView,
        redirect: '/dg/oracle',
        meta: { title: '容灾管理', icon: 'dg' },
        children: [
          {
            path: '/dg/oracle',
            name: 'DgOracle',
            component: () => import('@/views/dg/oracle'),
            meta: { title: 'Oracle', keepAlive: true }
          },
          {
            path: '/dg/oracle/create',
            name: 'DgOracleCreate',
            component: () => import('@/views/dg/oracle/modules/create'),
            meta: { title: 'Oracle - 创建', keepAlive: true, hidden: true },
            hidden: true
          },
          {
            path: '/dg/oracle/add',
            name: 'DgOracleAdd',
            component: () => import('@/views/dg/oracle/modules/add'),
            meta: { title: 'Oracle - 添加', keepAlive: true, hidden: true },
            hidden: true
          }
        ]
      },
      {
        path: '/task',
        redirect: '/task/monitor',
        component: RouteView,
        meta: { title: '任务监控', hiddenSub: true },
        children: [
          {
            path: '/task/monitor',
            name: 'TaskMonitor',
            component: () => import('@/views/task/monitor'),
            meta: { title: '任务监控', icon: 'monitor', keepAlive: true }
          },
          {
            path: '/task/monitor/:id',
            name: 'TaskMonitorInfo',
            component: () => import('@/views/task/monitor/modules/Info/index.vue'),
            meta: { title: '任务监控 - 详情', keepAlive: true, hidden: true }
          }
        ]
      },
      {
        path: '/storage',
        redirect: '/storage/class',
        component: RouteView,
        meta: { title: '存储管理', icon: 'storage' },
        children: [
          {
            path: '/storage/class',
            name: 'StorageClass',
            component: () => import('@/views/storage/class'),
            meta: { title: '节点管理', keepAlive: true }
          },
          {
            path: '/storage/class/:id',
            name: 'StorageClassInfo',
            component: () => import('@/views/storage/class/modules/Info/index.vue'),
            meta: { title: '节点管理 - 详情', keepAlive: true, hidden: true }
          },
          {
            path: '/storage/pool',
            name: 'StoragePool',
            component: () => import('@/views/storage/pool'),
            meta: { title: '存储池管理', keepAlive: true }
          },
          {
            path: '/storage/pool/add',
            name: 'StoragePoolAdd',
            component: () => import('@/views/storage/pool/modules/add/index.vue'),
            meta: { title: '存储池管理 - 新建', keepAlive: true, hidden: true }
          },
          {
            path: '/storage/pool/:id',
            name: 'StoragePoolInfo',
            component: () => import('@/views/storage/pool/modules/Info/index.vue'),
            meta: { title: '存储池管理 - 详情', keepAlive: true, hidden: true }
          }
        ]
      },
      {
        path: '/log',
        component: RouteView,
        redirect: '/log/user',
        meta: { title: '日志', icon: 'log' },
        children: [
          {
            path: '/log/user',
            name: 'LogUser',
            component: () => import('@/views/log/user'),
            meta: { title: '用户日志', keepAlive: true }
          },
          {
            path: '/log/alert',
            name: 'LogAlert',
            component: () => import('@/views/log/alert'),
            props: true,
            meta: { title: '告警信息', keepAlive: true }
          }
        ]
      },
      {
        path: '/system',
        component: RouteView,
        redirect: '/system/user',
        meta: { title: '系统管理', icon: 'system' },
        children: [
          {
            path: '/system/user',
            name: 'SystemUser',
            component: () => import('@/views/system/user'),
            meta: { title: '用户管理', keepAlive: true }
          },
          {
            path: '/system/role',
            name: 'SystemRole',
            component: () => import('@/views/system/role'),
            meta: { title: '角色管理', keepAlive: true }
          },
          {
            path: '/system/license',
            name: 'SystemLicense',
            component: () => import('@/views/system/license'),
            meta: { title: '授权管理', keepAlive: true }
          },
          {
            path: '/system/alert',
            name: 'SystemAlert',
            component: () => import('@/views/system/alert'),
            meta: { title: '告警配置', keepAlive: true }
          },
          {
            path: '/system/component',
            name: 'SystemComponent',
            component: () => import('@/views/system/component'),
            meta: { title: '组件管理', keepAlive: true }
          },
          {
            path: '/system/console',
            name: 'SystemConsole',
            component: () => import('@/views/system/console'),
            meta: { title: '控制台', keepAlive: true }
          }
        ]
      },
      {
        path: '/user',
        redirect: '/user/center',
        component: RouteView,
        meta: { title: '用户', hidden: true },
        children: [
          {
            path: '/user/center',
            name: 'UserCenter',
            component: () => import('@/views/user/center'),
            meta: { title: '个人中心', keepAlive: true, hidden: true }
          }
        ]
      },
      {
        path: '/redirect',
        component: RouteView,
        meta: { hidden: true },
        children: [
          {
            path: '/redirect/:path(.*)',
            component: () => import('@/views/redirect/index')
          }
        ]
      }
    ]
  },
  {
    path: '/dataGuard',
    name: 'dgOracleInfo',
    component: () => import('@/views/dg/oracle/modules/Info'),
    meta: { title: 'Oracle - DataGuard' },
    hidden: true
  },
  {
    path: '*', redirect: '/404', meta: { hidden: true }
  }
]

/**
 * 固定路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    meta: { hidden: true },
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import('@/views/user/Login')
      }
    ]
  },
  {
    path: '/404',
    component: () => import('@/views/exception/404')
  }
]
