import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入icon图片文件css样式
import './assets/fonts/iconfont.css'
// 引入css文件
import './assets/css/global.css'
// 导入我们的table依赖文件
import TreeTable from 'vue-table-with-tree-grid'
// 导入axios文件
import axios from 'axios'
// 配置他的请求路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(config => {
  console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 在最后必须 return config
  return config
})
Vue.prototype.$http = axios


Vue.config.productionTip = false
// 注册这个全局组件
Vue.component('tree-table',TreeTable)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
