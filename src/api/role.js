import { axios } from '@/utils/request'

// 获取管理员列表
export function getRoleLists (parameter) {
    console.log(parameter);
    return axios({
      url: '/SysRoleManage/querySysRoleMsg',
      method: 'POST',
      data: parameter
    })
  }
  // 根据roleid获取角色信息
export function getRoleInfo (parameter) {
  console.log(parameter);
  return axios({
    url: '/SysRoleManage/loadResourceMsg',
    method: 'POST',
    data: parameter
  })
}
// 修改角色信息
export function editRoleInfo (parameter) {
  console.log(parameter);
  return axios({
    url: '/SysRoleManage/editSysRoleMsg',
    method: 'POST',
    data: parameter
  })
}
// 新建角色信息
export function addRoleInfo (parameter) {
  console.log(parameter);
  return axios({
    url: '/SysRoleManage/addSysRoleMsg',
    method: 'POST',
    data: parameter
  })
}
// 删除角色
export function deleteRole (parameter) {
  console.log(parameter);
  return axios({
    url: '/SysRoleManage/delSysRoleMsg',
    method: 'POST',
    data: parameter
  })
}