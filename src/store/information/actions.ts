export default {
  setUserInformation ({ commit }:any, userData:any) {
    commit('SET_USER_INFORMATION', userData)
  },
  cancelUserInformation ({ commit }:any) {
    commit('CANCEL_USER_INFORMATION')
  }
}
