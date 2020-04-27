import { axios } from '@/utils/request'

// 获取机器人列表
export function getRobotLists (parameter) {
    console.log(parameter);
    return axios({
      url: '/robotInfo/list',
      method: 'POST',
      data: parameter
    })
  }

  //  所属单位下拉框 
export function getOrgLists (parameter) {
    console.log(parameter);
    return axios({
      url: '/robotInfo/getOrglist',
      method: 'POST',
      data: parameter
    })
  }
  // 删除机器人
export function delRobot (parameter) {
  console.log(parameter);
  return axios({
    url: '/robotInfo/delete',
    method: 'POST',
    data: parameter
  })
}
  // 编辑机器人
  export function editRobot (parameter) {
    console.log(parameter);
    return axios({
      url: '/robotInfo/save',
      method: 'POST',
      data: parameter
    })
  }