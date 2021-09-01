import * as type from './mutation-types'
export default {
  [type.SET_USER_ORDERNO_ARRAY] (state:any, orderNo:string) {
    let orderNoArray:any = []
    if (localStorage.getItem('order-orderNoArray') !== '') {
      let tOrderNo:any = localStorage.getItem('order-orderNoArray') ? localStorage.getItem('order-orderNoArray') : '[]'
      orderNoArray = JSON.parse(tOrderNo)
    }
    orderNoArray.push(orderNo)
    localStorage.setItem('order-orderNoArray', JSON.stringify(Array.from(new Set(orderNoArray))))
    state.orderNoArray = JSON.stringify(Array.from(new Set(orderNoArray)))
  },
  [type.SET_USER_SUBMIT_OUTTRADENO] (state:any, outTradeNo:string) {
    let submitOutTradeNoArray:any = []
    if (localStorage.getItem('order-submitOutTradeNoArray') !== '') {
      let tSubmitOutTradeNo:any = localStorage.getItem('order-submitOutTradeNoArray') ? localStorage.getItem('order-submitOutTradeNoArray') : '[]'
      submitOutTradeNoArray = JSON.parse(tSubmitOutTradeNo)
    }
    submitOutTradeNoArray.push(outTradeNo)
    localStorage.setItem('order-submitOutTradeNoArray', JSON.stringify(Array.from(new Set(submitOutTradeNoArray))))
    state.submitOutTradeNoArray = JSON.stringify(Array.from(new Set(submitOutTradeNoArray)))
  },
  [type.SET_MY_ORDER_INFORMATION] (state:any, orderData:any) {
    localStorage.setItem('order-searchSelectValue', orderData.selectValue)
    state.selectValue = orderData.selectValue
    localStorage.setItem('order-searchSelectLabel', orderData.selectLabel)
    state.selectLabel = orderData.selectLabel
    localStorage.setItem('order-searchCreateBeginTime', orderData.createBeginTime)
    state.createBeginTime = orderData.createBeginTime
    localStorage.setItem('order-searchCreateEndTime', orderData.createEndTime)
    state.createEndTime = orderData.createEndTime
    localStorage.setItem('order-myOrderActiveTab', orderData.active)
    state.active = orderData.active
  },
  [type.CANCEL_MY_ORDER_INFORMATION] (state:any) {
    localStorage.removeItem('order-searchSelectValue')
    state.selectValue = '1'
    localStorage.removeItem('order-searchSelectLabel')
    state.selectLabel = ''
    localStorage.removeItem('order-searchCreateBeginTime')
    state.createBeginTime = ''
    localStorage.removeItem('order-searchCreateEndTime')
    state.createEndTime = ''
    localStorage.removeItem('order-myOrderActiveTab')
    state.active = ''
  }
}
