import getters from './getters'
import actions from './actions'
import mutations from './mutations'

interface userInterface {
  userName: string | null,
  userID: string | null,
  headImgUrl: string | null,
  role: string | null,
  token: string | null
}

let myState: userInterface = {
  userName: localStorage.getItem('userName') ? localStorage.getItem('userName') : '',
  userID: localStorage.getItem('userID') ? localStorage.getItem('userID') : '',
  headImgUrl: localStorage.getItem('headImgUrl') ? localStorage.getItem('headImgUrl') : '',
  role: localStorage.getItem('role') ? localStorage.getItem('role') : '',
  token: localStorage.getItem('token') ? localStorage.getItem('token') : ''
}

const state = myState

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
