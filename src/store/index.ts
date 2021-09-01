import Vue from 'vue'
import Vuex from 'vuex'
import moduleLogin from './login'
import moduleInformation from './information'
import moduleOrder from './order'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    login: moduleLogin,
    information: moduleInformation,
    order: moduleOrder
  }
})
