import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)


export default new Vuex.Store({
  state: {
    willModify_mdContent: '' // 待修改的简历内容
  },

  getters: {
    get_willModify_mdContent: (state) => {
      return state.willModify_mdContent
    }
  },

  mutations: {
    setModify_mdContent(state, payload) {
      state.willModify_mdContent =  payload.willModify_mdContent 
    }
  },

  actions: {

  }
})



