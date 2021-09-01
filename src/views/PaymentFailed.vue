<template>
  <div class="payment-failed">
    <div class="payment-failed-main">
      <div class="payment-failed-info">
        <div class="failed-info-icon">
          <img src="../assets/img/payment/paymentFailedIcon.png">
          <div class="failed-info-icon-text"><span>支付失败，请重新支付</span></div>
        </div>
        <div class="failed-info-button">
          <div><el-button @click="rePayment()">重新支付</el-button></div>
          <div><span class="failed-info-text">{{countDown}}秒后自动返回</span></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { apiConfig, fetch, put, postFile, post } from '@/utils/api/Interfaces'
import { mixins } from 'vue-class-component'
import getUserInfo from '@/components/mixins/getUserInfo'
import {
  Button
} from 'element-ui'

  @Component({
    name: 'PaymentFailed',
    components: {
      [Button.name]: Button
    }
  })
export default class paymentFailed extends mixins(getUserInfo) {
    step: number = 3;
    orderNo: string = '';
    outTradeNo: string = '';
    countDown: number = 5;
    countDownInterVal: any = '';
    rePayment ():void{
      this.$router.push({
        path: '/cashierDesk/' + this.orderNo + '/' + this.outTradeNo
      })
    }
    countDownFunc ():void{
      this.countDownInterVal = window.setInterval(() => {
        this.countDown -= 1
        if (this.countDown === 0) {
          window.clearInterval(this.countDownInterVal)
          this.rePayment()
        }
      }, 1000)
    }
    private mounted () {
      this.orderNo = this.$route.params.orderNo
      this.outTradeNo = this.$route.params.outTradeNo
      this.countDownFunc()
    }
    private destroyed () {
      if (this.countDownInterVal) {
        window.clearInterval(this.countDownInterVal)
      }
    }
}
</script>
<style scoped lang="less" type="text/less">
  @import "../less/common.less";
  .payment-failed {
    .regionSize(@fill, @fill);
    background-color: #f3f5f9;
    padding: 20px;
    font-family: MicrosoftYaHei;
    .payment-failed-main{
      background-color: #fff;
      .regionSize(calc(@fill - 80px), calc(@fill - 40px));
      border-radius: 10px;
      padding: 20px;
      .payment-failed-info{
        width: 100%;
        height: auto;
        padding-top: 200px;
        .failed-info-icon{
          width: 100%;
          text-align: center;
          .failed-info-icon-text{
            font-size: 18px;
            font-weight: normal;
            font-stretch: normal;
            letter-spacing: 0px;
            color: #142433;
            height: 60px;
            line-height: 60px;
          }
        }
        .failed-info-button{
          font-size: 16px;
          font-weight: normal;
          font-stretch: normal;
          line-height: 18px;
          letter-spacing: 0px;
          color: #1e8dfc;
          width: 100%;
          text-align: center;
          padding-top:30px;
          &>div{
            .el-button{
              width: 200px;
              height: 40px;
              background-color: #f55656;
              border-radius: 6px;
              font-size: 16px;
              font-weight: bold;
              font-stretch: normal;
              letter-spacing: 0px;
              color: #ffffff;
            }
            .failed-info-text{
              font-size: 14px;
              font-weight: normal;
              font-stretch: normal;
              line-height: 40px;
              letter-spacing: 0px;
              color: #667380;
            }
          }
        }
      }
    }
  }
</style>
