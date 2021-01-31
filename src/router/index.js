import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Reporter from '../components/Reporter.vue'
import Project from '../components/data/Project.vue'
import Page from '../components/data/Page.vue'
import Element from '../components/data/Element.vue'
import Environmental from '../components/data/Environmental.vue'
import AddTemplate from '../components/autocase/addTemplate.vue'
import Template from '../components/autocase/Template.vue'
import Case from '../components/autocase/Case.vue'
import Task from '../components/autocase/Task.vue'
import User from '../components/user/User.vue'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    {
      path: '/home',
      component: Home,
      redirect: '/reporter',
      children: [
        { path: '/reporter', component: Reporter },
        { path: '/projects', component: Project },
        { path: '/pages', component: Page },
        { path: '/templates', component: Template },
        { path: '/elements', component: Element },
        { path: '/addTemplate', component: AddTemplate },
        { path: '/cases', component: Case },
        { path: '/tasks', component: Task },
        { path: '/users', component: User },
        { path: '/environmentals', component: Environmental }
      ]
    }]
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  // 获取token
  const token = window.sessionStorage.getItem('token')
  window.console.log(token)
  if (!token) return next('/login')
  next()
})
export default router
