import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import My from './views/My.vue'
import Login from './views/Login'
import Register from './views/Register'
import Marketplace from './views/Marketplace'
import Edit from './views/Edit'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      children: [
        {
          path: '/',
          name: 'marketplace',
          component: Marketplace
        },
        {
          path: '/edit',
          name: 'edit',
          component: Edit
        }
      ]
    },
    {
      path: '/my',
      name: 'my',
      component: My
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/modify/:resumeID',
      name: 'modify',
      component: Edit
    }
  ]
})
