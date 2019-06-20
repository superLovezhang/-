import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    picurl: '' || 'http://cdn.mtnhao.com/music/bg.jpg?param=300y300',
    resdata: null,
    musicIndex: -1,
    timer: null,
    truthly: true
  },
  mutations: {
    changeUrl(state, value){
      state.picurl = value;
    }
  },
  actions: {

  }
})
