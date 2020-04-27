import api from './index'
import { axios } from '@/utils/request'

/**
 * login func
 * parameter: {
 *     username: '',
 *     password: '',
 *     remember_me: true,
 *     captcha: '12345'
 * }
 * @param parameter
 * @returns {*}
 */
export function login (parameter) {
  console.log(parameter);
  return axios({
    url: '/login/getUserMsg',
    method: 'post',
    data: parameter
  })
}
export function getSmsCaptcha (parameter) {
  return axios({
    url: api.SendSms,
    method: 'post',
    data: parameter
  })
}

// export function getInfo (parameter) {
//   return axios({
//     url: '/robot/info',
//     method: 'post',
//     data : parameter
//   })
// }
export function getInfo (parameter) {
console.log('请求参数',parameter);
  return axios({
    url: '/login/getRoleMenu',
    // url: '/robot/info',
    method: 'post',
    data : parameter
  })
}
export function logout () {
  return axios({
    url: '/auth/logout',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * get user 2step code open?
 * @param parameter {*}
 */
export function get2step (parameter) {
  return axios({
    url: api.twoStepCode,
    method: 'post',
    data: parameter
  })
}
