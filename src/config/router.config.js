// eslint-disable-next-line
import { UserLayout, BasicLayout, RouteView, BlankLayout, PageView } from '@/layouts'
import { bxAnaalyse } from '@/core/icons'
import { getMenu } from '@/api/manage'
export const asyncRouterMap = [
  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: '首页' },
    redirect: '/dashboard/workplace',
    children: [
      // dashboard
      {
        path: '/dashboard',
        name: 'dashboard',
        redirect: '/dashboard/workplace',
        component: RouteView,
        meta: { title: '首页', keepAlive: true, icon: bxAnaalyse },
        children: [
          {
            path: '/dashboard/workplace',
            name: 'Workplace',
            //component: () => import('@/views/dashboard/Analysis'),
            component: () => import('@/views/dashboard/Workplace'),
            meta: { title: '欢迎使用', keepAlive: true }
          }
        ]
      },
      // system
      {
        path: '/system',
        name: 'system',
        component: RouteView,
        redirect: '/system/Menu',
        meta: { title: '系统管理', icon: 'setting', permission: ['role', 'app', 'robotVersion', 'singlechip'] },
        children: [
          {
            path: '/system/Role',
            name: 'systemRole',
            component: () => import('@/views/system/Role'),
            meta: { title: '角色库', keepAlive: true, permission: ['role'] }
          },
          {
            path: '/system/PhoneApp',
            name: 'systemPhoneApp',
            component: () => import('@/views/system/PhoneApp'),
            meta: { title: '手机app管理', keepAlive: false, permission: [ 'app' ] }
          },
          {
            path: '/system/RobotVersion',
            name: 'RobotVersion',
            component: () => import('@/views/system/RobotVersion'),
            meta: { title: '机器人APP管理', keepAlive: false, permission: [ 'robotVersion' ] }
          },
          {
            path: '/system/SinglechipVersion',
            name: 'SinglechipVersion',
            component: () => import('@/views/system/SinglechipVersion'),
            meta: { title: '单片机管理', keepAlive: false, permission: [ 'singlechip' ] }
          }
        ]
      },
      // Company
      {
        path: '/company',
        name: 'company',
        component: RouteView,
        redirect: '/company/ComList',
        meta: { title: '单位管理', icon: 'bank', permission: [ 'company', 'user', 'orgRobotVersion', 'orgSinglechip' ] },
        children: [
          {
            path: '/company/ComList',
            name: 'ComList',
            component: () => import('@/views/company/ComList'),
            meta: { title: '单位列表', permission: [ 'company' ] }
          },
          {
            path: '/system/User',
            name: 'systemUser',
            component: () => import('@/views/system/User'),
            meta: { title: '管理员库', keepAlive: true, permission: [ 'user' ] }
          },
          {
            path: '/system/OrgRobotVersion',
            name: 'OrgRobotVersion',
            component: () => import('@/views/system/OrgRobotVersion'),
            meta: { title: '单位机器人APP管理', keepAlive: false, permission: [ 'orgRobotVersion' ] }
          },
          {
            path: '/system/OrgSinglechipVersion',
            name: 'OrgSinglechipVersion',
            component: () => import('@/views/system/OrgSinglechipVersion'),
            meta: { title: '单位单片机版本管理', keepAlive: false, permission: [ 'orgSinglechip' ] }
          }
        ]
      },
      // 机器人管理
      {
        path: '/robot',
        name: 'Robot',
        component: RouteView,
        redirect: '/robot/RobotList',
        meta: { title: '机器人管理', icon: 'android', permission: ['robot', 'skillsRobot', 'appImage', 'map', 'AiuiScene', 'sensor', 'timedTask','robotTheme'] },
        children: [
          {
            path: '/robot/List',
            name: 'RobotList',
            component: () => import('@/views/robot/RobotList'),
            meta: { title: '机器人列表', permission: [ 'robot' ] }
          },
          {
            path: '/robot/SkillsRobot',
            name: 'SkillsRobot',
            component: () => import('@/views/robot/SkillsRobot'),
            meta: { title: '问答库分配', permission: [ 'skillsRobot' ] }
          },
          {
            path: '/robot/AppImage',
            name: 'AppImageList',
            component: () => import('@/views/robot/AppImage'),
            meta: { title: '屏幕显示', permission: [ 'appImage' ] }
          },
          {
            path: '/instruction/Sensor',
            name: 'SensorList',
            component: () => import('@/views/instruction/Sensor'),
            meta: { title: '触摸感应' , permission: [ 'sensor' ] }
          },
          {
            path: '/robot/AiuiScene',
            name: 'AiuiScene',
            component: () => import('@/views/robot/AiuiSceneList'),
            meta: { title: '引擎管理' , permission: [ 'AiuiScene' ] }
          },
          {
            path: '/robot/Map',
            name: 'MapList',
            component: () => import('@/views/robot/MapList'),
            meta: { title: '地图管理' , permission: [ 'map' ] }
          },
          {
            path: '/system/TimedTask',
            name: 'TimedTask',
            component: () => import('@/views/system/TimedTask'),
            meta: { title: '定时任务管理', permission: [ 'timedTask' ] }
          },
          {
            path: '/robotTheme/robotTheme',
            name: 'robotTheme',
            component: () => import( '@/views/robotTheme/robotTheme'),
            meta: { title: '主题管理' , permission: [ 'robotTheme' ]}
          }
        ]
      },

      // 问答库管理
      {
        path: '/ques',
        name: 'ques',
        component: RouteView,
        redirect: '/ques/Business',
        meta: { title: '问答库管理', icon: 'notification', permission: [ 'quesBusiness','quesChat','skillsTypeRobot','cmdCollection','fileManage'] },
        children: [
          {
            path: '/ques/Business',
            name: 'quesBusiness',
            component: () => import('@/views/ques/Business'),
            meta: { title: '业务', permission: [ 'quesBusiness' ]  }
          },
          {
            path: '/ques/Chat',
            name: 'quesChat',
            component: () => import('@/views/ques/Chat'),
            meta: { title: '闲聊' , permission: [ 'quesChat' ]}
          },
          {
            path: '/ques/SkillsTypeRobot',
            name: 'SkillsTypeRobot',
            component: () => import('@/views/ques/SkillsTypeRobot'),
            meta: { title: '自定义库' , permission: [ 'skillsTypeRobot' ]}
          },
          {
            path: '/instruction/CmdCollection',
            name: 'CmdCollectionList',
            component: () => import('@/views/instruction/CmdCollection'),
            meta: { title: '动作集' , permission: [ 'cmdCollection' ] }
          },
          {
            path: '/system/FileManage',
            name: 'FileManage',
            component: () => import('@/views/system/FileManage'),
            meta: { title: '文件管理', keepAlive: false, permission: [ 'fileManage' ] }
          }
        ]
      },

      // face人脸模块
      {
        path: '/face',
        name: 'face',
        component: RouteView,
        redirect: '/face/FaceList',
        meta: { title: '人脸管理', icon: 'smile', permission: [ 'face' ] },
        children: [
          {
            path: '/face/FaceList',
            name: 'faceList',
            component: () => import('@/views/face/FaceList'),
            meta: { title: '人脸库' , permission: [ 'face' ] }
          }
        ]
      },


      // Company动作集以及表情模块
      {
        path: '/instruction',
        name: 'instruction',
        component: RouteView,
        redirect: '/instruction/Expression',
        meta: { title: '基础数据管理', icon: 'inbox',keepAlive: false, permission: [ 'expression','touchCmd','cellCmd','cmdType'] },
        children: [
          {
            path: '/instruction/Expression',
            name: 'ExpressionList',
            component: () => import('@/views/instruction/Expression'),
            meta: { title: '表情管理' , permission: [ 'expression' ] }
          },
          {
            path: '/instruction/TouchCmd',
            name: 'TouchCmdList',
            component: () => import('@/views/instruction/TouchCmd'),
            meta: { title: '触发指令' , permission: [ 'touchCmd' ] }
          },
          {
            path: '/instruction/CellCmd',
            name: 'CellCmdList',
            component: () => import('@/views/instruction/CellCmd'),
            meta: { title: '单元命令' ,keepAlive: false, permission: [ 'cellCmd' ]}
          },
          {
            path: '/instruction/CmdType',
            name: 'CmdTypeList',
            component: () => import('@/views/instruction/CmdType'),
            meta: { title: '单元命令类型' ,keepAlive: false, permission: [ 'cmdType' ]}
          }
        ]
      },
    ]
  },

  {
    path: '*', redirect: '/404', hidden: true
  }
]

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login')
      },
      {
        path: 'register',
        name: 'register',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Register')
      },
      {
        path: 'register-result',
        name: 'registerResult',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/RegisterResult')
      }
    ]
  },

  {
    path: '/test',
    component: BlankLayout,
    redirect: '/test/home',
    children: [
      {
        path: 'home',
        name: 'TestHome',
        component: () => import('@/views/Home')
      }
    ]
  },

  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
  }

]
