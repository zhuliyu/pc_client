export default {
  setUserOrderNoArray ({ commit }:any, orderNo:string) {
    commit('SET_USER_ORDERNO_ARRAY', orderNo)
  },
  setUserCancelOutTradeNo ({ commit }:any, orderNo:string) {
    commit('SET_USER_ORDERNO_ARRAY', orderNo)
  },
  setUserSubmitOutTradeNo ({ commit }:any, outTradeNo:string) {
    commit('SET_USER_SUBMIT_OUTTRADENO', outTradeNo)
  },
  setMyOrderInformation ({ commit }:any, orderData:any) {
    commit('SET_MY_ORDER_INFORMATION', orderData)
  },
  cancelMyOrderInformation ({ commit }:any) {
    commit('CANCEL_MY_ORDER_INFORMATION')
  }
}
