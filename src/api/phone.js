import { axios } from '@/utils/request'

// 
export function getAppList (parameter) {
    console.log(parameter);
    return axios({
      url: '/AppManage/queryAppMsg',
      method: 'POST',
      data: parameter
    })
  }
  // 
export function editPhoneApp (parameter) {
    console.log(parameter);
    return axios({
      url: '/AppManage/editRobotAppMsg',
      method: 'POST',
      data: parameter
    })
  }
// 
export function deleteApp (parameter) {
    console.log(parameter);
    return axios({
      url: '/AppManage/delRobotAppMsg',
      method: 'POST',
      data: parameter
    })
  }
export function addPhoneApp (parameter) {
    console.log(parameter);
    return axios({
      url: '/AppManage/addRobotAppMsg',
      method: 'POST',
      data: parameter
    })
  }