<template>
  <div class="payment-success">
    <div class="payment-success-main">
      <div class="payment-success-title">
        <span class="split-bar"></span>
        <span class="success-title">购买商品</span>
        <span class="payment-success-text">制造云支付</span>
      </div>
      <div class="payment-success-step">
        <el-steps  :active="step" align-center>
          <el-step title="确认订单" description="" icon="el-icon-success"></el-step>
          <el-step title="选择支付方式" description="" icon="el-icon-success"></el-step>
          <el-step title="支付成功" description="" icon="el-icon-success"></el-step>
        </el-steps>
      </div>
      <div class="payment-success-info">
         <div class="success-info-icon">
            <img src="../assets/img/payment/paymentSuccessIcon.png">
            <div class="success-info-icon-text"><span>恭喜，支付成功！</span></div>
         </div>
        <div class="success-info-detail">
          <div><span>实付金额：¥{{ paymentResult.actualPayPrice }}</span></div>
          <div><span>支付方式：{{ paymentResult.payType }}</span></div>
          <div><span>订单编号：{{ paymentResult.outOrderNo }}</span></div>
        </div>
        <div class="success-info-text-button">
          <span @click="gotoDetail()">查看订单详情</span>
          <span @click="returnApply()">返回应用</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import { apiConfig, post } from '@/utils/api/Interfaces'
import { mixins } from 'vue-class-component'
import getUserInfo from '@/components/mixins/getUserInfo'
import {
  Step,
  Steps
} from 'element-ui'

  @Component({
    name: 'PaymentSuccess',
    components: {
      [Step.name]: Step,
      [Steps.name]: Steps
    }
  })
export default class paymentSuccess extends mixins(getUserInfo) {
    step: number = 3;
    orderNo: string = '';
    outTradeNo: string = '';
    paymentResult: any = {
      actualPayPrice: '',
      payType: '',
      payTime: '',
      outOrderNo: ''
    }
    gotoDetail ():void{
      this.$router.push({
        path: '/myOrder/OrderDetail/' + this.orderNo + '/' + this.outTradeNo
      })
    }
    gotoThirdApp ():void{
      // window.ApplyFunc.goThirdApply();
    }
    gotoMyOrder ():void{
      let _self = this
      /* window.sdk = window.sdk || {};
      window.sdk["gotoMyOrder"] = () => {
        _self.$router.push({
          path: '/myOrder'
        })
      }; */
    }
    getPaymentInfo ():void {
      post(apiConfig('shopping/getPaymentInfo'), { userId: this.userId, orderNo: this.orderNo, outTradeNo: this.outTradeNo })
        .then((res:any) => {
          if (res.code === 200) {
            this.paymentResult = res.data
          }
        })
    }
    returnApply () {
      let win: any = window || {}
      try {
        // win.external.DoMenuItemJump('menu003')
        let tempAppId = win.external.GetCurrentTabAppId()
        let tempObj = {
          'appid_close': tempAppId + '',
          'appid_switch': tempAppId.replace('zhifu', '') + ''
        }
        win.external.CloseAndSwitchPage(JSON.stringify(tempObj))
      } catch (e) {
        // alert('页签切换失败')
      }
    }
    private mounted () {
      this.orderNo = this.$route.params.orderNo
      this.outTradeNo = this.$route.params.outTradeNo
      this.getPaymentInfo()
      this.gotoMyOrder()
    }
}
</script>
<style>
  /*修改步骤条title文字样式*/
  .payment-success-main .el-steps .el-step  .el-step__title{
    font-size: 16px;
    font-weight: normal;
    font-stretch: normal;
    line-height: 60px;
    letter-spacing: 0px;
    color: #142433;
  }
  /*修改步骤条步骤圆圈文字样式*/
  .payment-success-main .el-steps .el-step .is-finish .is-text,.payment-success-main .el-steps .el-step .is-process .is-text,.payment-success-main .el-steps .el-step .is-wait .is-text{
    width: 35px;
    height: 35px;
    background-color: #ffffff;
    box-shadow: 0px 4px 6px 0px rgba(0, 127, 255, 0.2);
    border: solid 2px #d8e4f0;
    color: white;
    top: -8px;
    font-size: 20px;
  }
  /*修改步骤条当前进行步骤圆圈内样式*/
  .payment-success-main .el-steps .el-step .is-finish  .el-step__icon-inner,.payment-success-main .el-steps .el-step .is-process  .el-step__icon-inner,.payment-success-main .el-steps .el-step .is-wait  .el-step__icon-inner{
    font-size: 45px;
    font-weight: 400;
  }
  /*修改步骤条线条样式*/
  .payment-success-main .el-steps .el-step .el-step__head.is-finish .el-step__line,.payment-success-main .el-steps .el-step .el-step__head.is-process .el-step__line{
    background-color: #1e8dfc;
  }
</style>
<style scoped lang="less" type="text/less">
  @import "../less/common.less";
  .payment-success {
    .regionSize(@fill, @fill);
    background-color: #f3f5f9;
    padding: 20px;
    font-family: MicrosoftYaHei;
    .payment-success-main{
      background-color: #fff;
      .regionSize(calc(@fill - 80px), calc(@fill - 40px));
      border-radius: 10px;
      padding: 20px;
      .payment-success-title{
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
        .success-title{
          font-size: 20px;
          font-weight: bold;
          font-stretch: normal;
          line-height: 26px;
          letter-spacing: 0px;
          color: #142433;
          display: inline-block;
          margin-right: 10px;
        }
        .success-text{
          font-size: 14px;
          font-weight: normal;
          font-stretch: normal;
          line-height: 26px;
          letter-spacing: 0px;
          color: #525c66;
        }
      }
      .payment-success-step{
        width: 80%;
        height: 100px;
        padding-top: 30px;
        padding-bottom: 10px;
        margin-left: 10%;
      }
      .payment-success-info{
        width: 100%;
        height: auto;
        padding-top: 30px;
        .success-info-icon{
          width: 145px;
          text-align: center;
          margin-left: calc((100% - 145px)/2);
          .success-info-icon-text{
            font-size: 18px;
            font-weight: normal;
            font-stretch: normal;
            letter-spacing: 0px;
            color: #142433;
            height: 60px;
            line-height: 60px;
          }
        }
        .success-info-detail{
          font-size: 16px;
          font-weight: normal;
          font-stretch: normal;
          letter-spacing: 0px;
          color: #525c66;
          margin-left: calc((100% - 145px)/2);
          line-height: 35px;
          padding-top:20px;
        }
        .success-info-text-button{
          font-size: 16px;
          font-weight: normal;
          font-stretch: normal;
          line-height: 18px;
          letter-spacing: 0px;
          color: #1e8dfc;
          margin-left: calc((100% - 145px)/2);
          padding-top:30px;
          &>span{
            cursor: pointer;
          }
          &>span:first-child{
            margin-right: 20px;
          }
        }
      }
    }
  }
</style>
