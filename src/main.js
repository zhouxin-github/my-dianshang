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
// 导入富文本编辑器组件
import VueQuillEditor from 'vue-quill-editor'
// 导入富文本编辑器组件的相关样式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

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
// 处理时间的过滤器
Vue.filter('dateFormat',function(originVal) {
  const dt = new Date(originVal)

  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 +'').padStart(2,'0')
  const d = (dt.getDate() +'').padStart(2,'0')

  const hh = (dt.getHours() + '').padStart(2,'0')
  const mm = (dt.getMinutes() + '').padStart(2,'0')
  const ss = (dt.getSeconds() + '').padStart(2,'0')

  // 年月日的时间样式  yyyy-mm-dd hh-mm-ss
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
}),
// 注册复文本组件编辑器
Vue.use(VueQuillEditor)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
