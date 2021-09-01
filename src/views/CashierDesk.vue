<template>
  <div class="cashier-desk">
    <div class="cashier-desk-main">
      <div class="cashier-desk-title">
        <span class="split-bar"></span>
        <span class="desk-title">购买商品</span>
        <span class="desk-text">制造云支付</span>
      </div>
      <div class="cashier-desk-step">
        <el-steps  :active="step" align-center>
          <el-step title="确认订单" description="" icon="el-icon-success"></el-step>
          <el-step title="选择支付方式" description=""></el-step>
          <el-step title="支付成功" description=""></el-step>
        </el-steps>
      </div>
      <div class="cashier-desk-list">
        <div class="desk-list-tile">
          <span v-show="(!havedSubmitOrder) && (!havedCancelOrder)">请您在 <span class="desk-list-count-time">{{countDownTime}}</span> 内完成支付。若未及时付款，系统将自动取消订单。</span>
          <span v-show="havedSubmitOrder">订单已完成支付，不可重复支付。</span>
          <span v-show="havedCancelOrder">订单已取消，不可支付。</span>
        </div>
        <div class="desk-list-table">
          <el-row class="list-table-head">
             <el-col :span="12" align="left"><span class="head-left-text-normal">支付<span class="head-left-text-number">{{goodsList.length}}</span>笔订单</span></el-col>
             <el-col :span="12" align="right"><span class="head-right-text-normal">应付：</span><span class="head-right-text-icon">¥</span><span class="head-right-text-number">{{totalPrice}}</span></el-col>
           </el-row>
          <div class="list-table-info">
            <el-row >
              <el-col :span="12" align="left"><span class="list-table-order-text-normal">订单编号：{{outTradeNo}}</span></el-col>
              <el-col :span="12" align="right"><span class="list-table-order-price-normal">¥{{totalPrice}}</span></el-col>
            </el-row>
            <div class="order-list-content">
              <el-row v-for="(item, index) in goodsList" :key="getKey('goodsListCashier', index)">
                <el-col :span="12" align="left"><span class="list-table-order-item-text-normal"><span class="order-goods-name" :title="item.goodsName">{{item.goodsName}}</span><span>数量：</span><span>{{item.goodsCount}}</span></span></el-col>
                <el-col :span="12" align="right"><span class="list-table-order-item-price-normal">¥{{item.goodsTotalPrice}}</span></el-col>
              </el-row>
            </div>
          </div>
          <div class="cashier-desk-pay-way">
            <div class="desk-pay-way-tile"><span>选择支付方式</span></div>
            <div class="desk-pay-way-list">
              <div :class="payWay === 'alipay' ?  'desk-pay-way-item-choosed' : 'desk-pay-way-item'" @click="chooseWay('alipay')">
                <img src="../assets/img/cashierDesk/zhifubaoIcon.png">
                <span>支付宝</span>
              </div>
              <div :class="payWay === 'weixin' ?  'desk-pay-way-item-choosed' : 'desk-pay-way-item'" @click="chooseWay('weixin')">
                <img src="../assets/img/cashierDesk/weixinIcon.png">
                <span>微信支付</span>
              </div>
            </div>
          </div>
        </div>
        <div class="cashier-desk-count">
          <div class="desk-count-info">
            <el-button :class="btnDisabled ? 'cout-info-button button-disabled' : 'cout-info-button button-use'" :disabled="btnDisabled" @click="submitCashier()">确认支付</el-button>
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      title="收款方：深圳蜂巢互联科技有限公司"
      :visible.sync="showQrCodeDialog"
      :close-on-click-modal = false
      :close-on-press-escape = false
      class = "qr-code-dialog"
      @close='closeDialog'
      width="500px">
      <div class="head-info">
        <div class="head-info-left">
          <div>订单号：{{outTradeNo}}</div>
        </div>
        <div style="clear: both;"></div>
        <div class="head-text"><span>支付金额</span></div>
        <div class="head-text"><span class="head-total-price">¥<span class="head-price">{{totalPrice}}</span></span></div>
      </div>
      <div class="imgContent">
        <img :src="qrImg"/>
      </div>
      <div class="foot-info"><span>{{qrTip}}</span></div>
      <span slot="footer" class="dialog-footer">
  </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { apiConfig, fetch, fetchCode, put, postFile, post } from '@/utils/api/Interfaces'
import { mixins } from 'vue-class-component'
import getUserInfo from '@/components/mixins/getUserInfo'
import { State, Action } from 'vuex-class'
import { resetMessage } from '@/assets/js/resetMessage'
import {
  Button,
  Row,
  Col,
  Step,
  Steps,
  Dialog
} from 'element-ui'

  @Component({
    name: 'CashierDesk',
    components: {
      [Button.name]: Button,
      [Row.name]: Row,
      [Col.name]: Col,
      [Step.name]: Step,
      [Steps.name]: Steps,
      [Dialog.name]: Dialog
    }
  })
export default class cashierDesk extends mixins(getUserInfo) {
  step: number = 1;
  itemList: any = {};
  appId: string = '';
  totalPrice: string = '';
  countDownTime: string = '';
  btnDisabled: boolean = false;
  orderNo: string = '';
  outTradeNo: string = '';
  goodsList: any = [];
  payWay: string = '';
  showQrCodeDialog: boolean = false;
  qrImg: string = '';
  qrCodeInterval: any = null;
  timer: any = null;
  qrTip: string = '';
  havedSubmitOrder: boolean = false;
  havedCancelOrder: boolean = false;
  codeTimeCount: number = 0;
  @Action('setUserSubmitOutTradeNo', { namespace: 'order' })
  setUserSubmitOutTradeNo: any;
  @Action('cancelMyOrderInformation', { namespace: 'order' })
  cancelMyOrderInformation: any;
  resetTime (time:any) {
    let _self = this
    _self.timer = null
    let t: any = time
    let m: any = 0
    let s: any = 0
    function countDown () {
      t = t - 1000
      m = Math.floor((t / 1000 / 60) << 0)
      s = Math.floor((t / 1000) % 60)
      if (m === 0 && s === 0) {
        m = '00'
        s = '00'
        clearInterval(_self.timer)
        _self.btnDisabled = true
      }
      m = m.toString().length < 2 ? '0' + m : m
      s = s.toString().length < 2 ? '0' + s : s
      _self.countDownTime = m + '分' + s + '秒'
    }
    if (time > 0) {
      _self.timer = setInterval(countDown, 1000)
    } else {
      if (_self.timer) {
        clearInterval(_self.timer)
      }
    }
  }
  chooseWay (way:string) {
    let _self = this
    _self.payWay = _self.payWay === way ? '' : way
  }
  submitCashier () {
    this.judgeRepeatePay(() => {
      if (this.havedSubmitOrder) {
        this.$message({
          message: '订单已支付，不可重复支付！',
          type: 'success'
        })
      } else if (this.havedCancelOrder) {
        this.$message({
          message: '订单已被取消，不可支付！',
          type: 'success'
        })
      } else {
        this.commitCashier()
      }
    })
  }
  commitCashier ():void{
    if (this.btnDisabled) {
      return
    }
    if (this.payWay === '') {
      resetMessage.warning('请选择支付方式')
    } else {
      this.qrImg = ''
      this.noticePayType(this.payWay)
      if (this.payWay === 'weixin') {
        fetchCode(apiConfig('shopping/getWeixinQrCode'), { outTradeNo: this.outTradeNo })
          .then((res:any) => {
            if (res.code === 200) {
              this.qrImg = res.data.img
              this.qrTip = '请打开手机微信扫一扫以支付'
              this.showQrCodeDialog = true
              this.getPayStatus()
            }
          })
      } else if (this.payWay === 'alipay') {
        fetchCode(apiConfig('shopping/getAlipayQrCode'), { outTradeNo: this.outTradeNo })
          .then((res:any) => {
            if (res.code === 200) {
              this.qrImg = res.data.img
              this.qrTip = '请打开手机支付宝扫一扫以支付'
              this.showQrCodeDialog = true
              this.getPayStatus()
            }
          })
      }
      // 发起支付
      // let params = { payType: tempType, outTradeNo: this.outTradeNo, userId: this.userId }
      // console.log(params)
      // this.onSuccess()
      // this.onError()
      // window.ApplyFunc.openPay(JSON.stringify(params));
    }
  }
  getCashierInfo ():void{
    fetch(apiConfig('shopping/getCashierData'), { userId: this.userId, orderNo: this.orderNo, outTradeNo: this.outTradeNo })
      .then((res:any) => {
        if (res.code === 200) {
          if (res.data.time === 0) {
            this.btnDisabled = true
          }
          this.resetTime(res.data.time)
          this.totalPrice = res.data.price
          this.goodsList = res.data.notPayOrderOnPc
          this.goodsList.forEach((item:any) => {
            item.goodsTotalPrice = (Number(item.goodsPrice) * Number(item.goodsCount)).toFixed(2)
            // item.goodsPrice = item.goodsPrice.toFixed(2)
          })
          // this.cashierInfo = res.data;
        }
      })
  }
  closeDialog ():void {
    this.showQrCodeDialog = false
    if (this.qrCodeInterval) {
      clearInterval(this.qrCodeInterval)
      this.codeTimeCount = 0
    }
  }
  getPayStatus ():void{
    let _self = this
    _self.codeTimeCount = 0
    function getStatus () {
      _self.codeTimeCount = _self.codeTimeCount + 1
      if (_self.codeTimeCount <= 180) {
        fetch(apiConfig('shopping/getPayStatus'), { outTradeNo: _self.outTradeNo })
          .then((res:any) => {
            if (res.code === 200) {
              if (res.data.orderStatus === 'TRADE_SUCCESS') {
                clearInterval(_self.qrCodeInterval)
                _self.codeTimeCount = 0
                _self.setUserSubmitOutTradeNo(_self.outTradeNo)
                _self.onSuccess()
              } else if (res.data.orderStatus === 'TRADE_CLOSED') {
                clearInterval(_self.qrCodeInterval)
                _self.codeTimeCount = 0
                _self.qrTip = '订单已被取消，不可支付！'
                _self.qrImg = '../../../../yyzx_pc/img/shoppingCart/qrCodeInvalid.png'
                _self.btnDisabled = true
                _self.havedCancelOrder = true
                if (_self.timer) {
                  clearInterval(_self.timer)
                }
              }
            } else {
              clearInterval(_self.qrCodeInterval)
              _self.codeTimeCount = 0
              _self.$message({
                message: '获取支付状态失败！',
                type: 'error'
              })
            }
          })
      } else {
        clearInterval(_self.qrCodeInterval)
        _self.codeTimeCount = 0
        _self.qrTip = '二维码已失效，如需支付，请重新确认支付'
        _self.qrImg = '../../../../yyzx_pc/img/shoppingCart/qrCodeInvalid.png'
      }
    }
    _self.qrCodeInterval = setInterval(getStatus, 1000)
  }
  onSuccess ():void{
    let win:any = window || {}
    if (this.inClient()) {
      this.$router.push({
        path: '/paymentSuccess/' + this.orderNo + '/' + this.outTradeNo
      })
    } else {
      let returnAddr: any = this.$route.query.returnAddr
      window.location.replace(returnAddr)
    }
    // window.location.href = 'http://njtestyyzx.zhizaoyun.com/paymentSuccess/' + this.userId + '/' + this.orderNo + '/' + this.outTradeNo;
  }
  onError ():void{
    this.$router.push({
      path: '/paymentFailed/' + this.orderNo + '/' + this.outTradeNo
    })
  }
  noticeOfPayment () {
    let _self = this
    /* window.sdk = window.sdk || {};
    window.sdk["paymentFeedback"] = type => {
      if(type == 1) {
        _self.onSuccess()
      }else {
        _self.onError()
      }
    } */
  }
  noticePayType (payWay:string) {
    post(apiConfig('shopping/noticePayType'), { outTradeNo: this.outTradeNo, payType: payWay, userId: this.userId })
      .then((res:any) => {
        if (res.code === 200) {}
      })
  }
  judgeRepeatePay (callback:any) {
    let _self = this
    _self.havedSubmitOrder = false
    _self.havedCancelOrder = false
    fetch(apiConfig('shopping/getPayStatus'), { outTradeNo: _self.outTradeNo })
      .then((res:any) => {
        if (res.code === 200) {
          if (res.data.orderStatus === 'TRADE_SUCCESS') {
            this.btnDisabled = true
            this.havedSubmitOrder = true
            this.onSuccess()
            if (this.timer) {
              clearInterval(this.timer)
            }
            callback()
          } else if (res.data.orderStatus === 'TRADE_CLOSED') {
            this.btnDisabled = true
            _self.havedCancelOrder = true
            if (this.timer) {
              clearInterval(this.timer)
            }
            callback()
          } else {
            callback()
          }
        } else {
          callback()
        }
      })
    /* let submittraderNoArray: any = []
    if (this.$store.state.order.submitOutTradeNoArray !== '') {
      let tSubmitTraderNo:any = this.$store.state.order.submitOutTradeNoArray ? this.$store.state.order.submitOutTradeNoArray : '[]'
      submittraderNoArray = JSON.parse(tSubmitTraderNo)
      if (submittraderNoArray.includes(this.outTradeNo)) {
        this.btnDisabled = true
        this.havedSubmitOrder = true
        if (this.timer) {
          clearInterval(this.timer)
        }
        if (this.showQrCodeDialog) {
          this.qrTip = '二维码已失效，如需支付，请重新确认支付'
          if (this.qrCodeInterval) {
            clearInterval(this.qrCodeInterval)
          }
        }
        if (typeof callback === 'function') {
          callback()
        }
      } else {
        if (typeof callback === 'function') {
          callback()
        }
      }
    } else {
      if (typeof callback === 'function') {
        callback()
      }
    } */
  }
  get getKey () {
    return (name:string, index:any):string => {
      return name + index
    }
  }
  created () {
    if (this.$route.query.token) {
      let token: any = this.$route.query.token
      localStorage.setItem('token', token)
    }
  }
  inClient () {
    let win:any = window || {}
    try {
      win.external.IsClient()
      return true
    } catch (e) {
      return false
    }
  }
  private mounted () {
    this.orderNo = this.$route.params.orderNo
    this.outTradeNo = this.$route.params.outTradeNo
    if (!this.inClient() && this.$route.query.userId) {
      let userId: any = this.$route.query.userId
      this.userId = userId
    }
    this.getCashierInfo()
    this.noticeOfPayment()
    this.judgeRepeatePay(() => {})
  }
  private destroyed () {
    if (this.qrCodeInterval) {
      clearInterval(this.qrCodeInterval)
      this.codeTimeCount = 0
    }
    if (this.timer) {
      clearInterval(this.timer)
    }
  }
  private beforeRouteLeave (to:any, from:any, next:any) {
    if (to.name !== 'MyOrder') {
      this.cancelMyOrderInformation()
    }
    next()
  }
}
</script>
<style>
  /*修改步骤条title文字样式*/
  .cashier-desk-main .el-steps .el-step  .el-step__title{
    font-size: 16px;
    font-weight: normal;
    font-stretch: normal;
    line-height: 60px;
    letter-spacing: 0px;
    color: #142433;
  }
  .cashier-desk-main .el-steps .el-step  .el-step__title.is-finish{
    position:relative;
    top: 7px;
  }
  /*修改步骤条步骤圆圈文字样式*/
  .cashier-desk-main .el-steps .el-step .is-finish .is-text,.cashier-desk-main .el-steps .el-step .is-process .is-text,.cashier-desk-main .el-steps .el-step .is-wait .is-text{
    width: 40px;
    height: 40px;
    background-color: #ffffff;
    box-shadow: 0px 4px 6px 0px rgba(0, 127, 255, 0.2);
    border: solid 2px #d8e4f0;
    color: white;
    top: -8px;
    font-size: 20px;
  }
  /*修改步骤条当前进行步骤圆圈内样式*/
  .cashier-desk-main .el-steps .el-step .is-finish  .el-step__icon-inner{
    font-size: 45px;
    font-weight: 400;
    position: relative;
    top: 1px;
  }
  .cashier-desk-main .el-steps .el-step .is-process  .el-step__icon-inner{
    width: 8px;
    height: 8px;
    background-color: #1e8dfc;
    border-radius: 50px;
    color: #1e8dfc;
    font-size: 0;
  }
  .cashier-desk-main .el-steps .el-step .is-wait  .el-step__icon-inner{
    width: 8px;
    height: 8px;
    font-size: 0;
  }
  /*修改步骤条线条样式*/
  .cashier-desk-main .el-steps .el-step .el-step__head.is-finish .el-step__line{
    background-color: #1e8dfc;
  }
  .cashier-desk-main .el-steps .el-step .el-step__head.is-process .el-step__line{
    background-color: #e6ebf0;
  }
  .qr-code-dialog .el-dialog__body{
    font-size: 16px;
    padding: 15px 20px;
  }
  .qr-code-dialog .el-dialog__body .head-info{
    height: 140px;
    z-index: 100;
  }
  .qr-code-dialog .el-dialog__body .foot-info{
    height: 30px;
  }
  .qr-code-dialog .el-dialog__body .head-info .head-text{
    text-align: center;
    line-height: 50px;
    font-size: 18px;
    color: #666666;
  }
  .qr-code-dialog .el-dialog__body .foot-info{
    text-align: center;
    color: #333333;
    font-size: 18px;
  }
  .qr-code-dialog .el-dialog__body .head-info-left{
    float: left;
    color: #333333;
    margin-bottom: 20px;
    font-size: 16px;
  }
  .qr-code-dialog .el-dialog__body .head-info .head-text .head-total-price{
    font-size: 18px;
    font-weight: normal;
    letter-spacing: 0px;
    color: #1e8dfc;
  }
  .qr-code-dialog .el-dialog__body .head-info .head-text .head-total-price .head-price{
    font-size: 36px;
    font-weight: bold;
  }
  .qr-code-dialog .el-dialog__body .head-info-right{
    float: right
  }
  .qr-code-dialog .el-dialog__body .imgContent{
    text-align: center;
  }
  .qr-code-dialog .el-dialog__body .imgContent img{
    width: 300px;
    height: 300px;
  }
  .qr-code-dialog .el-dialog__header{
    background-color: #f1f1f1;
  }
  .qr-code-dialog .el-dialog__title{
    font-size: 16px;
    color: #666666;
  }
</style>
<style scoped lang="less" type="text/less">
  @import "../less/common.less";
  .cashier-desk {
    .regionSize(@fill, @fill);
    background-color: #f3f5f9;
    padding: 20px;
    font-family: MicrosoftYaHei;
    .cashier-desk-main{
      background-color: #fff;
      .regionSize(calc(@fill - 80px), calc(@fill - 40px));
      border-radius: 10px;
      padding: 20px;
      .cashier-desk-title{
        width: 100%;
        height: 30px;
        .split-bar{
          .regionSize(@spacing / 4, @spacing*1.2);
          display: inline-block;
          background-color: #1f8dfc;
          border-radius: @spacing / 10;
          top: @spacing / 5;
          margin-right: 10px;
        }
        .desk-title{
          font-size: 20px;
          font-weight: bold;
          font-stretch: normal;
          line-height: 26px;
          letter-spacing: 0px;
          color: #142433;
          display: inline-block;
          margin-right: 10px;
        }
        .desk-text{
          font-size: 14px;
          font-weight: normal;
          font-stretch: normal;
          line-height: 26px;
          letter-spacing: 0px;
          color: #525c66;
        }
      }
      .cashier-desk-step{
        width: 80%;
        height: 100px;
        padding-top: 30px;
        padding-bottom: 10px;
        margin-left: 10%;
      }
      .cashier-desk-list{
        height: calc(100% - 200px);
        //max-height: calc(100% - 400px);
        .desk-list-tile{
          font-size: 16px;
          font-weight: normal;
          font-stretch: normal;
          line-height: 26px;
          letter-spacing: 0px;
          color: #142433;
          height: 30px;
          .desk-list-count-time{
            color: #1e8dfc;
          }
        }
        .desk-list-table{
          width: 100%;
          height: calc(100% - 145px);
          padding-top: 15px;
          .list-table-head{
            background-color: #f7f7f7;
            border: solid 1px #e6ebf0;
            height: 60px;
            padding: 15px 30px;
            .head-left-text-normal{
              font-size: 18px;
              font-weight: normal;
              font-stretch: normal;
              line-height: 28px;
              letter-spacing: 0px;
              color: #142433;
              display: inline-block;
              .head-left-text-number{
                color: #1e8dfc;
                display: inline-block;
                margin: 0 5px;
              }
            }
            .head-right-text-normal{
              font-size: 18px;
              font-weight: normal;
              font-stretch: normal;
              line-height: 18px;
              letter-spacing: 0px;
              color: #142433;
            }
            .head-right-text-icon{
              font-size: 18px;
              font-weight: normal;
              letter-spacing: 0px;
              color: #1e8dfc;
            }
            .head-right-text-number{
              font-family: DINPro-Bold;
              font-size: 24px;
              font-weight: normal;
              letter-spacing: 0px;
              color: #1e8dfc;
              font-weight: bold;
            }
          }
          .list-table-info{
            border-left: solid 1px #e6ebf0;
            border-right: solid 1px #e6ebf0;
            border-bottom: solid 1px #e6ebf0;
            padding: 15px 30px;
            //height: auto;
            //max-height: calc(100% - 60px);
            max-height: calc(100% - 220px);
            overflow-y: auto;
            .el-row{
              height: 35px;
              line-height: 35px;
             /* border-left: solid 1px #e6ebf0;
              border-right: solid 1px #e6ebf0;
              padding: 0px 30px;*/
              .list-table-order-text-normal{
                font-size: 16px;
                font-weight: normal;
                font-stretch: normal;
                line-height: 18px;
                letter-spacing: 0px;
                color: #525c66;
              }
              .list-table-order-price-normal{
                font-size: 16px;
                font-weight: bold;
                font-stretch: normal;
                line-height: 18px;
                letter-spacing: 0px;
                color: #142433;
              }
              .list-table-order-item-text-normal{
                font-size: 16px;
                font-weight: normal;
                font-stretch: normal;
                line-height: 18px;
                letter-spacing: 0px;
                color: #142433;
                .order-goods-name{
                  display: inline-block;
                  margin-right: 15px;
                  width: 200px;
                  overflow: hidden;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                  word-break: break-all;
                }
              }
              .list-table-order-item-price-normal{
                font-size: 16px;
                font-stretch: normal;
                line-height: 18px;
                letter-spacing: 0px;
                color: #525c66;
                font-weight: bold;
              }
            }
            .order-list-content{
              //overflow-y: auto;
              //height: calc(100% - 35px);
            }
          }
          .cashier-desk-pay-way{
            height: 100px;
            padding-top: 30px;
            .desk-pay-way-tile{
              font-size: 16px;
              font-weight: normal;
              font-stretch: normal;
              line-height: 26px;
              letter-spacing: 0px;
              color: #142433;
              margin-bottom: 5px;
            }
            .desk-pay-way-list{
              .desk-pay-way-item{
                display: inline-block;
                height: 64px;
                width: 180px;
                background: url('../assets/img/cashierDesk/notchoosedIcon.png') no-repeat;
                margin-right: 20px;
                &>img{
                  position: relative;
                  top: 12px;
                  left: 12px;
                }
                &>span{
                  display: inline-block;
                  position: relative;
                  left: 30px;
                  top: -2px;
                }
              }
              .desk-pay-way-item-choosed{
                display: inline-block;
                height: 64px;
                width: 180px;
                margin-right: 20px;
                background: url('../assets/img/cashierDesk/choosedIcon.png') no-repeat;
                &>img{
                  position: relative;
                  top: 12px;
                  left: 12px;
                }
                &>span{
                  display: inline-block;
                  position: relative;
                  left: 30px;
                  top: -2px;
                }
              }
            }
          }
        }
        .cashier-desk-count{
          width: 100%;
          text-align: right;
          height: 100px;
          .desk-count-info{
            position: relative;
            margin-bottom: 30px;
            .cout-info-button{
              width: 140px;
              height: 40px;
              border-radius: 6px;
              font-size: 16px;
              font-weight: normal;
              font-stretch: normal;
              letter-spacing: 0px;
            }
            .button-use{
              background-color: #1e8dfc;
              color: #ffffff;
            }
            .button-disabled{
              color: #909399;
              background: #f4f4f5;
              border-color: #d3d4d6;
              cursor: not-allowed;
              background-image: none;
            }
          }
        }
      }
    }
  }
</style>
