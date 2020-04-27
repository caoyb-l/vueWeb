// eslint-disable-next-line
import { UserLayout, BasicLayout, RouteView, BlankLayout, PageView } from '@/layouts'
import { bxAnaalyse } from '@/core/icons'

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
            meta: { title: '手机app管理', keepAlive: true, permission: [ 'app' ] }
          },
          {
            path: '/system/RobotVersion',
            name: 'RobotVersion',
            component: () => import('@/views/system/RobotVersion'),
            meta: { title: '机器人APP管理', keepAlive: true, permission: [ 'robotVersion' ] }
          },
          {
            path: '/system/SinglechipVersion',
            name: 'SinglechipVersion',
            component: () => import('@/views/system/SinglechipVersion'),
            meta: { title: '单片机管理', keepAlive: true, permission: [ 'singlechip' ] }
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
            meta: { title: '单位列表', keepAlive: true, permission: [ 'company' ] }
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
            meta: { title: '单位机器人APP管理', keepAlive: true, permission: [ 'orgRobotVersion' ] }
          },
          {
            path: '/system/OrgSinglechipVersion',
            name: 'OrgSinglechipVersion',
            component: () => import('@/views/system/OrgSinglechipVersion'),
            meta: { title: '单位单片机版本管理', keepAlive: true, permission: [ 'orgSinglechip' ] }
          }
        ]
      },
      // 机器人管理
      {
        path: '/robot',
        name: 'Robot',
        component: RouteView,
        redirect: '/robot/RobotList',
        meta: { title: '机器人管理', icon: 'android', permission: ['robot', 'skillsRobot', 'appImage', 'map', 'AiuiScene', 'sensor'] },
        children: [
          {
            path: '/robot/List',
            name: 'RobotList',
            component: () => import('@/views/robot/RobotList'),
            meta: { title: '机器人列表', keepAlive: true, permission: [ 'robot' ] }
          },
          {
            path: '/robot/SkillsRobot',
            name: 'SkillsRobot',
            component: () => import('@/views/robot/SkillsRobot'),
            meta: { title: '问答库分配', keepAlive: true, permission: [ 'skillsRobot' ] }
          },
          {
            path: '/robot/AppImage',
            name: 'AppImageList',
            component: () => import('@/views/robot/AppImage'),
            meta: { title: '屏幕显示', keepAlive: true, permission: [ 'appImage' ] }
          },
          {
            path: '/instruction/Sensor',
            name: 'SensorList',
            component: () => import('@/views/instruction/Sensor'),
            meta: { title: '触摸感应', keepAlive: true, permission: [ 'sensor' ] }
          },
          {
            path: '/robot/AiuiScene',
            name: 'AiuiScene',
            component: () => import('@/views/robot/AiuiSceneList'),
            meta: { title: '引擎管理', keepAlive: true, permission: [ 'AiuiScene' ] }
          },
          {
            path: '/robot/Map',
            name: 'MapList',
            component: () => import('@/views/robot/MapList'),
            meta: { title: '地图管理', keepAlive: true, permission: [ 'map' ] }
          },
          {
            path: '/robot/Map1',
            name: 'MapList1',
            component: () => import('@/views/robot/MapList'),
            meta: { title: '分析报告', keepAlive: true }
          }
        ]
      },

      // 问答库管理
      {
        path: '/ques',
        name: 'ques',
        component: RouteView,
        redirect: '/ques/Business',
        // eslint-disable-next-line standard/array-bracket-even-spacing
        meta: { title: '问答库管理', icon: 'notification', permission: [ 'quesBusiness', 'quesChat', 'cmdCollection', 'fileManage', 'skillsType'] },
        children: [
          {
            path: '/ques/Business',
            name: 'quesBusiness',
            component: () => import('@/views/ques/Business'),
            meta: { title: '知识库', keepAlive: true, permission: [ 'quesBusiness' ] }
          },
          {
            path: '/ques/Chat',
            name: 'quesChat',
            component: () => import('@/views/ques/Chat'),
            // eslint-disable-next-line standard/object-curly-even-spacing
            meta: { title: '闲聊', keepAlive: true, permission: [ 'quesChat' ] }
          },
          {
            path: '/ques/SkillsTypeRobot',
            name: 'skillTypeRobot',
            component: () => import('@/views/ques/SkillsTypeRobot'),
            // eslint-disable-next-line standard/object-curly-even-spacing
            meta: { title: '自定义库', keepAlive: true, permission: [ 'quesChat' ] }
          },
          {
            path: '/instruction/CmdCollection',
            name: 'CmdCollectionList',
            component: () => import('@/views/instruction/CmdCollection'),
            meta: { title: '策略管理', keepAlive: true, permission: [ 'cmdCollection' ] }
          },
          {
            path: '/system/FileManage',
            name: 'FileManage',
            component: () => import('@/views/system/FileManage'),
            meta: { title: '文件管理', keepAlive: true, permission: [ 'fileManage' ] }
          },
          {
            path: '/ques/SkillsType',
            name: 'skillsType',
            component: () => import('@/views/ques/SkillsType'),
            meta: { title: '其他', keepAlive: true, permission: [ 'skillsType' ] }
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
            meta: { title: '人脸库', keepAlive: true, permission: [ 'face' ] }
          }
        ]
      },
      // Company动作集以及表情模块
      {
        path: '/instruction',
        name: 'instruction',
        component: RouteView,
        redirect: '/instruction/Expression',
        meta: { title: '基础数据管理', icon: 'inbox', keepAlive: false, permission: ['expression', 'touchCmd', 'cellCmd', 'cmdType'] },
        children: [
          {
            path: '/instruction/Expression',
            name: 'ExpressionList',
            component: () => import('@/views/instruction/Expression'),
            meta: { title: '表情管理', keepAlive: true, permission: [ 'expression' ] }
          },
          // {
          //   path: '/instruction/SuperCmd',
          //   name: 'SuperCmdList',
          //   component: () => import('@/views/instruction/SuperCmd'),
          //   meta: { title: '超级指令' , permission: [ 'robot' ] }
          // },
          {
            path: '/instruction/TouchCmd',
            name: 'TouchCmdList',
            component: () => import('@/views/instruction/TouchCmd'),
            meta: { title: '触发指令', keepAlive: true, permission: [ 'touchCmd' ] }
          },
          {
            path: '/instruction/CellCmd',
            name: 'CellCmdList',
            component: () => import('@/views/instruction/CellCmd'),
            meta: { title: '单元命令', keepAlive: true, permission: [ 'cellCmd' ] }
          },
          {
            path: '/instruction/CmdType',
            name: 'CmdTypeList',
            component: () => import('@/views/instruction/CmdType'),
            meta: { title: '单元命令类型', keepAlive: true, permission: [ 'cmdType' ] }
          }
        ]
      },
      {
        path: '/thirdUrl',
        name: 'thirdUrl',
        redirect: '/thirdUrl/medicalCare',
        component: RouteView,
        meta: { title: '三方系统', keepAlive: false, icon: bxAnaalyse },
        children: [
          {
            path: '/thirdUrl/medicalCare',
            name: 'medicalCareUrl',
            component: () => import('@/views/thirdUrl/medicalCare'),
            meta: { title: '医疗知识系统', keepAlive: false }
          },
          {
            path: '/thirdUrl/edu',
            name: 'eduUrl',
            component: () => import('@/views/thirdUrl/edu'),
            meta: { title: '教育教学系统', keepAlive: false }
          },
          {
            path: '/thirdUrl/police',
            name: 'police',
            component: () => import('@/views/thirdUrl/police'),
            meta: { title: '公安便民系统', keepAlive: false }
          }
        ]
      }
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
