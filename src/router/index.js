import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/Login/index'
import Index from '@/views/Index'
import Home from '@/views/Home/index'
import Belt from '@/views/Belt/index'
import History from '@/views/History/index'
import Release from '@/views/History/release'
import Communication from '@/views/Communication/index'
import Lives from '@/views/Lives/index'
import BeltSetting from '@/views/Setting/BeltSetting/index'
import LiveSetting from '@/views/Setting/LiveSetting/index'
import LiveDemo from '@/views/LiveDemo/index'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path:'/',
      name:'index',
      component:Index,
      redirect:'/home',
      children:[
        {
          path: '/home',
          name: 'home',
          component: Home
        },
        {
          path: '/belt',
          name: 'belt',
          component: Belt
        },
        {
          path: '/history',
          name: 'history',
          component: History
        },
        {
          path: '/communication',
          name: 'communication',
          component: Communication
        },
        {
          path: '/release',
          name: 'release',
          component: Release
        },
        {
          path: '/lives',
          name: 'lives',
          component: Lives
        },
        {
          path: '/belt_setter',
          name: 'beltSetting',
          component: BeltSetting
        },
        {
          path: '/live_setter',
          name: 'liveSetting',
          component: LiveSetting
        },
        {
          path: '/demo',
          name: 'demo',
          component: LiveDemo
        }
      ]
    }
  ]
})
