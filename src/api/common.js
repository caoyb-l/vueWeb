import { axios } from '@/utils/request'

export function queryData (parameter,requestUrl) {
    console.log('请求参数:',parameter);
    return axios({
      url: requestUrl,
      method: 'post',
      data: parameter
    })
}

export function addData (parameter,requestUrl) {
    console.log('新增/编辑 数据',parameter);
    return axios({
      url: requestUrl,
      method: 'post',
      data: parameter
    })
}
