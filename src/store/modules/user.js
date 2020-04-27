import Vue from 'vue'
import { login, getInfo, logout } from '@/api/login'
import { ACCESS_TOKEN ,USER_ROLE } from '@/store/mutation-types'
import { welcome } from '@/utils/util'
import notification from 'ant-design-vue/es/notification'
const user = {
  state: {
    token: '',
    roleId:'',
    name: '',
    welcome: '',
    avatar: '',
    roles: [],
    info: {},
    orgId:'',
    orgName:'',
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, { name, welcome }) => {
      state.name = name
      state.welcome = welcome
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_INFO: (state, info) => {
      state.info = info
    },
    SET_ROLEID: (state, roleId) => {
      state.roleId = roleId
    },
    SET_ORGID: (state, orgId) => {
      state.orgId = orgId
    },
    SET_ORGNAME: (state, orgName) => {
      state.orgName = orgName
    },
  },

  actions: {
    // 登录
    Login ({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo).then(response => {
          if(response.code == 0){
            const result = response.result
            // 存储token信息
            Vue.ls.set(ACCESS_TOKEN, result.token, 7*24*60*60* 1000)
            // 获取用户信息时传递
            Vue.ls.set(USER_ROLE,result.roleId)
            // 保存用户角色
            // console.log('result---------------',JSON.stringify(result));
            localStorage.setItem('user',JSON.stringify(result))
          } 
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo ({ commit },roleId) {
      var userinfo = { roleId:roleId};
      return new Promise((resolve, reject) => {
        getInfo(userinfo).then(response => {
          const result = response.result
          console.log(result);
          if (result.role && result.role.permissions.length > 0) {
    
            const role = result.role
            role.permissions = result.role.permissions
            role.permissions.map(per => {
              if (per.actionEntitySet != null && per.actionEntitySet.length > 0) {
                const action = per.actionEntitySet.map(action => { return action.action })
                per.actionList = action
              }
            })
            role.permissionList = role.permissions.map(permission => { return permission.permissionId })
            commit('SET_ROLES', result.role)
            commit('SET_INFO', result)
          } else {
            reject(new Error('getInfo: roles must be a non-null array !'))
          }
          commit('SET_AVATAR', result.avatar)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    Logout ({ commit, state }) {
      return new Promise((resolve) => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        Vue.ls.remove(ACCESS_TOKEN)
        localStorage.removeItem('user')
        logout(state.token).then(() => {
          resolve()
        }).catch(() => {
          resolve()
        })
      })
    }

  }
}

export default user
