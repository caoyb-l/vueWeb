import { axios } from '@/utils/request'

export function getExpressList (parameter) {
    console.log(parameter);
    return axios({
      url: '/robotExpManage/queryRobotExpMsg',
      method: 'post',
      data: parameter
    })
  }