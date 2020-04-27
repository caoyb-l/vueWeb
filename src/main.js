// ie polyfill
import '@babel/polyfill'

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/'
import vcolorpicker from 'vcolorpicker'//引入颜色选择弃插件

import { VueAxios, axios } from './utils/request'

// mock
import './mock'

import bootstrap from './core/bootstrap'
import './core/use'
import './permission' // permission control
import './utils/filter' // global filter

Vue.config.productionTip = false

// mount axios Vue.$http and this.$http
Vue.use(VueAxios)
Vue.use(vcolorpicker)// 注册颜色选择器
axios.defaults.baseURL = 'http://robot.lovechuangchuang.com:8085/'
// axios.defaults.baseURL = 'http://localhost:54321/'
new Vue({
  router,
  store,
  created () {
    bootstrap()
  },
  render: h => h(App)
}).$mount('#app')
