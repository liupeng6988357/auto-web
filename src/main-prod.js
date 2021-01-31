import Vue from 'vue'
import App from './App.vue'
import router from './router'
// import './plugins/element.js'
/** 导入全局样式表 */
import './assets/css/global.css'
/** 导入axios */
import axios from 'axios'

import Qs from 'qs'
import echarts from 'echarts'

axios.defaults.baseURL = 'http://192.168.1.10:8081/api/'

Vue.prototype.$http = axios
Vue.prototype.$echarts = echarts
Vue.prototype.$qs = Qs

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
