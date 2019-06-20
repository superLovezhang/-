import Vue from 'vue'
import App from './App.vue'
import router from './router/router.js'
import store from './store/store'
import axios from 'axios'
import VueLazyload from 'vue-lazyload'


Vue.use(VueLazyload,{
  loading: '/images/lazy.png'
})
Vue.prototype.axios = axios;

Vue.filter('setWH',function(value, keywords){
  return value + '?param=' +keywords;
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
