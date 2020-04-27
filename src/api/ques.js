import { axios } from '@/utils/request'

// 获取问题；列表
export function getSkillsList (parameter) {
    console.log(parameter);
    return axios({
      url: '/skills/getSkillsList',
      method: 'POST',
      data: parameter
    })
  }
  // 根据问题id获取已有技能列表
export function getRobotSkillByTypeList (parameter) {
    console.log(parameter);
    return axios({
      url: '/skillsOption/getSkillsOptionList',
      method: 'POST',
      data: parameter
    })
  }
  // 获取全部技能
  export function getTotalSkill (parameter) {
    console.log(parameter);
    return axios({
      url: '/robotSkill/getRobotSkillByTypeList',
      method: 'POST',
      data: parameter
    })
  }
  export function addBusinessQues (parameter) {
    console.log(parameter);
    return axios({
      url: '/skills/save',
      method: 'POST',
      data: parameter
    })
  }
  export function deleteQues (parameter) {
    console.log(parameter);
    return axios({
      url: '/skills/delete',
      method: 'POST',
      data: parameter
    })
  }