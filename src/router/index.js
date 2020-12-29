import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/user/Users.vue'





Vue.use(Router)
// Vue.use('Login')
const router = new Router({
  routes: [
    {path:'/',redirect:Login},
    {path:'/login',component:Login},
    {
      path:'/home',
      component:Home,
      redirect:'/welcome',
      children:[
        {path:'/welcome',component:Welcome},
        {path:'/users',component:Users}
      ]
    
    }

  ]
})
// 挂载路由导航守卫
router.beforeEach((to,from,next) => {
    // to将要访问的路径
    // from 代表从哪一个路径跳转而来
    // next 是一个函数，表示放行
    // next（） 放行  next('/login) 强制跳转
    if(to.path === '/login') return next()
    const tokenStr = window.sessionStorage.getItem('token')
    if(!tokenStr) return next ('/login')
    next()
})
export default router




