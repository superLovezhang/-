import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Music from './Music';

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      redirect: '/Music'
    },
    Music
  ]
})
