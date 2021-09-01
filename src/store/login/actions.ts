export default {
  userLogin ({ commit }:any, userInfo:any) {
    commit('USER_LOGIN_IN', userInfo)
  },
  telLogin ({ commit }:any, userInfo:any) {
    commit('TEL_LOGIN_IN', userInfo)
  },
  clearToken ({ commit }:any) {
    commit('CLEAR_USER_INFO')
  },
  setHeadImgUrl ({ commit }:any, headImgUrl:string) {
    commit('SET_HEAD_IMG_URL', headImgUrl)
  },
  setUserName ({ commit }:any, userName:string) {
    commit('SET_USER_NAME', userName)
  },
  wxBind ({ commit }:any, userInfo:any) {
    commit('USER_WX_BIND', userInfo)
  }
}
