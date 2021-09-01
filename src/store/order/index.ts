import getters from './getters'
import actions from './actions'
import mutations from './mutations'

interface orderInterface {
  orderNoArray: string | null,
  submitOutTradeNoArray: string | null
}

const state = {
  orderNoArray: localStorage.getItem('order-orderNoArray') ? localStorage.getItem('order-orderNoArray') : '',
  submitOutTradeNoArray: localStorage.getItem('order-submitOutTradeNoArray') ? localStorage.getItem('order-submitOutTradeNoArray') : '',
  searchSelectValue: localStorage.getItem('order-searchSelectValue') ? localStorage.getItem('order-searchSelectValue') : '',
  searchSelectLabel: localStorage.getItem('order-searchSelectLabel') ? localStorage.getItem('order-searchSelectLabel') : '',
  searchCreateBeginTime: localStorage.getItem('order-searchCreateBeginTime') ? localStorage.getItem('order-searchCreateBeginTime') : '',
  searchCreateEndTime: localStorage.getItem('order-searchCreateEndTime') ? localStorage.getItem('order-searchCreateEndTime') : '',
  myOrderActiveTab: localStorage.getItem('order-myOrderActiveTab') ? localStorage.getItem('order-myOrderActiveTab') : ''
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
