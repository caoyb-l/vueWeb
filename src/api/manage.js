import { axios } from '@/utils/request'

const api = {
  user: '/user',
  role: '/role',
  service: '/service',
  permission: '/permission',
  permissionNoPager: '/permission/no-pager',
  orgTree: '/org/tree'
}

export default api

// 获取管理员列表
export function getUserList (parameter) {
  console.log(parameter);
  return axios({
    url: '/userManage/queryUserMsg',
    method: 'POST',
    data: parameter
  })
}
// 管理员密码重置
export function resetPwd(parameter){
  console.log(parameter);
  return axios({
    url: '/userManage/revertPassword',
    method: 'POST',
    data: parameter
  })
}
// 删除管理员
export function deleteUser(parameter){
  console.log(parameter);
  return axios({
    url: '/userManage/delUserMsg',
    method: 'POST',
    data: parameter
  })
}
// 修改管理员
export function editUser(parameter){
  console.log(parameter);
  return axios({
    url: '/userManage/editUserMsg',
    method: 'POST',
    data: parameter
  })
}
// 获取单位
export function getOrgList(parameter){
  console.log(parameter);
  return axios({
    url: '/userManage/getHrOrgByPid',
    method: 'POST',
    data: parameter
  })
}
// 获取角色
export function getRoleList () {
  return axios({
    url: '/userManage/getAllSysRole',
    method: 'post',
  })
}
// 新增管理员
export function addUser(parameter){
  console.log(parameter);
  return axios({
    url: '/userManage/addUserMsg',
    method: 'post',
    data: parameter
  })
}
// 根据orgid获取单位信息
export function getOrgInfo(parameter){
  console.log(parameter);
  return axios({
    url: '/hrOrg/getOrgMessage',
    method: 'post',
    data: parameter
  })
}
// 新增单位信息
export function addOrg(parameter){
  console.log(parameter);
  return axios({
    url: '/hrOrg/save',
    method: 'post',
    data: parameter
  })
}
// 编辑单位信息
export function editOrg(parameter){
  console.log(parameter);
  return axios({
    url: '/hrOrg/save',
    method: 'post',
    data: parameter
  })
}
// 删除单位信息
export function delOrg(parameter){
  console.log(parameter);
  return axios({
    url: '/hrOrg/delete',
    method: 'post',
    data: parameter
  })
}
// export function getRoleList (parameter) {
//   return axios({
//     url: api.role,
//     method: 'get',
//     params: parameter
//   })
// }

export function getServiceList (parameter) {
  return axios({
    url: '/userManage/queryUserMsg',
    method: 'post',
    params: parameter
  })
}

export function getPermissions (parameter) {
  return axios({
    url: api.permissionNoPager,
    method: 'get',
    params: parameter
  })
}

export function getOrgTree (parameter) {
  return axios({
    url: 'hrOrg/list',
    method: 'post',
    data: parameter
  })
}

// id == 0 add     post
// id != 0 update  put
export function saveService (parameter) {
  return axios({
    url: api.service,
    method: parameter.id === 0 ? 'post' : 'put',
    data: parameter
  })
}

export function getMenu (parameter) {
  return axios({
    url: api.service,
    method: post,
    data: parameter
  })
}
