import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入icon图片文件css样式
import './assets/fonts/iconfont.css'
// 引入css文件
import './assets/css/global.css'
// 导入axios文件
import axios from 'axios'
// 配置他的请求路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
Vue.prototype.$http = axios

Vue.config.productionTip = false
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
 