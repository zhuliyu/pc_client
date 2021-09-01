<template>
  <div class="order-detail-panel">
    <div class="order-detail-panel-main">
      <div class="order-detail-title">
        <el-row>
          <el-col :span="12">
            <span class="split-line"></span><span class="order-detail-title-text">订单详情</span>
          </el-col>
        </el-row>
      </div>
      <div class="order-detail-status">
        <div class="detail-status-left" v-cloak>
          <img :src="orderIcon"/>
          <div :class="orderDetail.tradeStatus === 'TRADE_CLOSED' ? 'status-left-text status-left-text-center' : 'status-left-text'">
            <span class="left-text-title">{{orderTitle}}</span>
            <span class="left-text-tip" v-show="orderDetail.tradeStatus === 'TRADE_WAIT_PAY'">请您在 <span class="text-tip-count-time">{{countDownTime}}</span> 内完成支付。若未及时付款，系统将自动取消订单<span  v-show="!btnDisabled" class="text-cancel-order" @click="cancelOrder()">取消订单</span></span>
            <span class="left-text-tip" v-show="orderDetail.tradeStatus === 'TRADE_SUCCESS'">订单交易成功！如果您需要开具发票或有其他疑问，请联系人工客服获取帮助。</span>
          </div>
        </div>
        <div class="detail-status-right">
           <div v-show="orderDetail.tradeStatus === 'TRADE_WAIT_PAY'">
             <el-button :class="btnDisabled ? 'cout-info-button button-disabled' : 'cout-info-button button-use'" :disabled="btnDisabled" @click="goToCashierDesk()">立即付款</el-button>
           </div>
          <div v-show="orderDetail.tradeStatus === 'TRADE_SUCCESS'" class="status-right-trade_success">
            <div class="status-right-text-title">
              <img src="../assets/img/orderDetail/orderDetailLink.png"/>
              <span>联系客服</span>
            </div>
            <div class="status-right-text"><span>电话： 400-660-8853</span></div>
            <div class="status-right-text"><span>邮箱： support@zhizaoyun.com</span></div>
          </div>
        </div>
      </div>
      <div style="clear:both"></div>
      <div class="order-detail-data">
         <div>订单编号：{{orderDetail.orderInfo.outTradeNo}}</div>
         <div class="detail-data-text"><span>创建时间：{{orderDetail.orderInfo.creatTime}}</span>
              <span v-show="orderDetail.tradeStatus === 'TRADE_SUCCESS'">支付时间：{{orderDetail.orderInfo.payTime}}</span>
              <span v-show="orderDetail.tradeStatus === 'TRADE_CLOSED'">取消时间：{{orderDetail.orderInfo.invalidTime}}</span>
         </div>
        <div class="detail-data-text" v-show="orderDetail.tradeStatus === 'TRADE_SUCCESS'">
          <span>支付方式：{{orderDetail.orderInfo.payType}}</span>
          <span>交易流水号：{{orderDetail.orderInfo.tradeNo}}</span>
        </div>
      </div>
      <div class="order-detail-list">
        <div class="detail-list-title">
          <img src="../assets/img/orderDetail/facilitatorIcon.png"/>
          <span>{{facilitatorName}}</span>
        </div>
        <div class="detail-list-table">
          <el-table
            :data="orderDetail.goodsDetail"
            ref="orderListTable"
            border
            highlight-current-row
            class="order-list-table"
            height="100%"
            max-height="100%"
            tooltip-effect="dark"
            :header-cell-style="{background:'#f7f7f7',color:'#142433',fontWeight: 'normal'}"
            style="width: 100%;margin-top: 10px;overflow-y: auto">
            <el-table-column
              prop="goodsName"
              label="商品名称"
              show-overflow-tooltip
              align="center">
              <template slot-scope="scope">
                <div :style="{'width': '50px','height': '50px','display':'inline-block','background': 'url('+scope.row.goodsLogo+') no-repeat center / contain'}"></div>
                <span class="detail-list-goods-name">{{scope.row.goodsName}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="goodsPrice"
              label="单价（元）"
              show-overflow-tooltip
              align="center">
              <template slot-scope="scope">
                <span class="detail-list-goods-price">¥</span>
                <span class="detail-list-goods-price">{{scope.row.goodsPrice}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="goodsCount"
              label="数量"
              show-overflow-tooltip
              align="center">
            </el-table-column>
            <el-table-column
              prop="realPay"
              label="实付（元）"
              show-overflow-tooltip
              align="center">
              <template slot-scope="scope">
                <span class="detail-list-real-pay">¥{{scope.row.realPay}}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="交易状态"
              show-overflow-tooltip
              align="center">
              <template>
                <span>{{transformType(orderDetail.tradeStatus)}}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="order-detail-total">
        <div><span class="detail-total-title">商品总价：</span><span class="total-price">¥{{orderDetail.totalPrice}}</span></div>
        <div><span class="detail-total-title">{{totalTitle}}：</span><span class="need-pay">¥{{orderDetail.totalPrice}}</span></div>
      </div>
    </div>
    <el-dialog
      title="温馨提示"
      :visible.sync="showOrderDialog"
      class="tip-dialog"
      width="400px">
      <img src="../assets/img/home/question.png">
      <span>您确定要取消该订单吗？</span>
      <span slot="footer" class="dialog-footer">
        <button @click="subMitDialog()">确 定</button>
        <button @click="showOrderDialog = false">取 消</button>
  </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { apiConfig, fetch, put, postFile, post } from '@/utils/api/Interfaces'
import { mixins } from 'vue-class-component'
import util from '../assets/js/util'
import getUserInfo from '@/components/mixins/getUserInfo'
import { Action } from 'vuex-class'
import {
  Button,
  Select,
  Option,
  OptionGroup,
  Input,
  DatePicker,
  Row,
  Col,
  Table,
  TableColumn,
  Dialog
} from 'element-ui'
interface IorderDetail{
  time: number,
  actualPayPrice: string,
  totalPrice: string,
  tradeStatus: string,
  goodsDetail: any
  orderInfo: any
}

  @Component({
    name: 'OrderDetail',
    components: {
      [Button.name]: Button,
      [Select.name]: Select,
      [Option.name]: Option,
      [OptionGroup.name]: OptionGroup,
      [Input.name]: Input,
      [DatePicker.name]: DatePicker,
      [Row.name]: Row,
      [Col.name]: Col,
      [Table.name]: Table,
      [TableColumn.name]: TableColumn,
      [Dialog.name]: Dialog
    }
  })
export default class orderDetail extends mixins(getUserInfo) {
    orderDetail: IorderDetail ={
      time: 0,
      actualPayPrice: '',
      totalPrice: '',
      tradeStatus: '',
      goodsDetail: [],
      orderInfo: {
        creatTime: '',
        invalidTime: '',
        outTradeNo: '',
        payTime: '',
        payType: '',
        tradeNo: ''
      }
    }
    orderNo: string = '';
    outTradeNo: string = '';
    orderTitle: string = '';
    orderIcon: string = '';
    totalTitle: string = '';
    countDownTime: string = '';
    btnDisabled: boolean = false;
    showOrderDialog: boolean = false;
    facilitatorName: string = '';
    @Action('cancelMyOrderInformation', { namespace: 'order' })
    cancelMyOrderInformation: any;
    getOrderInfo ():void{
      fetch(apiConfig('shopping/getOrderInfo'), { userId: this.userId, orderNo: this.orderNo, outTradeNo: this.outTradeNo })
        .then((res:any) => {
          if (res.code === 200) {
            this.orderDetail = res.data
            if (this.orderDetail.tradeStatus === 'TRADE_WAIT_PAY') {
              this.orderTitle = '等待付款'
              this.totalTitle = '需付款'
              this.orderIcon = '../../../../../img/orderDetail/orderDetailWaitPayIcon.png'
              this.resetTime(this.orderDetail.time)
            } else if (this.orderDetail.tradeStatus === 'TRADE_CLOSED') {
              this.orderTitle = '已取消'
              this.totalTitle = '需付款'
              this.orderIcon = '../../../../../img/orderDetail/orderDetailPayClosedIcon.png'
            } else {
              this.orderTitle = '已付款'
              this.totalTitle = '实付款'
              this.orderIcon = '../../../../../img/orderDetail/orderDetailPaySuccessIcon.png'
            }
            this.facilitatorName = this.orderDetail.goodsDetail[0].facilitatorName
            this.orderDetail.goodsDetail.forEach((item:any) => {
              item.realPay = (Number(item.goodsPrice) * Number(item.goodsCount)).toFixed(2)
              // item.goodsLogo = util.getStaticServer() + item.goodsLogo
            })
          }
        })
    }
    transformType (type:string):string {
      let str = ''
      switch (type) {
        case 'TRADE_WAIT_PAY':
          str = '待付款'
          break
        case 'TRADE_SUCCESS':
          str = '已付款'
          break
        default:
          str = '已取消'
      }
      return str
    }
    resetTime (time:any) {
      let _self = this
      let timer: any = null
      let t: any = time
      let m: any = 0
      let s: any = 0
      function countDown () {
        t = t - 1000
        console.log(t)
        m = Math.floor((t / 1000 / 60) << 0)
        s = Math.floor((t / 1000) % 60)
        if (m === 0 && s === 0) {
          m = '00'
          s = '00'
          clearInterval(timer)
          _self.btnDisabled = true
        }
        m = m.toString().length < 2 ? '0' + m : m
        s = s.toString().length < 2 ? '0' + s : s
        _self.countDownTime = m + '分' + s + '秒'
      }
      timer = setInterval(countDown, 1000)
    }
    goToCashierDesk () {
      this.$router.push({
        path: '/cashierDesk/' + this.orderNo + '/' + this.outTradeNo
      })
    }
    cancelOrder () {
      this.showOrderDialog = true
    }
    subMitDialog () {
      post(apiConfig('shopping/cancelOrder'), { userId: this.userId, orderNo: this.orderNo, outTradeNo: this.outTradeNo })
        .then((res:any) => {
          if (res.code === 200) {
            this.getOrderInfo()
            this.showOrderDialog = false
          }
        })
    }
    private mounted () {
      this.orderNo = this.$route.params.orderNo
      this.outTradeNo = this.$route.params.outTradeNo
      this.getOrderInfo()
      this.$emit('getNavigation', { menuName: '我的订单', menuChildName: ['订单管理', '订单详情'] })
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
  .order-list-table td,.order-list-table th,.order-list-table .el-table__body-wrapper .el-table--border.is-scrolling-left~.el-table__fixed{
    border-right: 0 solid #EBEEF5 !important;
  }
  [v-cloak] {
    display:none;
  }
  .order-detail-panel .el-dialog{
     border-radius: 8px;
  }
  .order-detail-panel .el-dialog__body{
    text-align: center;
  }
  .order-detail-panel .el-dialog__footer{
    text-align: center;
  }
</style>
<style scoped lang="less" type="text/less">
  @import "../less/common.less";
  .order-detail-panel {
    width: calc(100% - 20px * 2);
    height: calc(100%);
    position: relative;
    background-color: white;
    margin-left: 20px;
    font-family: MicrosoftYaHei !important;
    .order-detail-panel-main{
      background-color: #fff;
      width: 100%;
      height: 100%;
      .order-detail-title{
        width: 100%;
        height: 30px;
        .split-line {
          .regionSize(@spacing / 4, @spacing*1.2);
          display: inline-block;
          background-color: #1f8dfc;
          border-radius: 2px;
          top: 5px;
          margin-right: @spacing/1.2;
        }
        .order-detail-title-text{
          font-size: 20px;
        }
      }
      .order-detail-status{
        background-color: #ffffff;
        border-radius: 4px;
        border: solid 1px #e6ebf0;
        height: 109px;
        margin-top: 30px;
        width: calc(100%);
        .detail-status-left{
          float:left;
          display:flex;
          justify-content:center;
          align-items:center;
          padding: 30px 0 30px 30px;
          &>img{
            position: relative;
            margin-right: 20px;
          }
          .status-left-text{
            display:inline-block;
            height: 50px;
            &>span{
              display: block;
            }
            .left-text-title{
              font-size: 18px;
              color: #142433;
            }
            .left-text-tip{
              font-size: 14px;
              color: #525c66;
              .text-tip-count-time{
                color: #142433;
                font-weight: bold;
              }
              .text-cancel-order{
                color: #1e8dfc;
                margin-left: 15px;
                cursor: pointer;
              }
            }
          }
          .status-left-text-center{
            display: flex;
            -webkit-box-pack: center;
            -ms-flex-pack: center;
            justify-content: center;
            -webkit-box-align: center;
            -ms-flex-align: center;
            align-items: center;
          }
        }
        .detail-status-right{
          float: right;
          .status-right-trade_success{
            width: 230px;
            border-left: 1px solid #e6ebf0;
            padding: 15px 30px 15px 10px;
          }
          &>div{
            .el-button{
              width: 140px;
              height: 40px;
              background-color: #1e8dfc;
              border-radius: 6px;
              font-size: 16px;
              font-weight: bold;
              font-stretch: normal;
              letter-spacing: 0px;
              color: #ffffff;
              margin-top: 33px;
              margin-right: 30px;
            }
            .button-disabled{
              color: #909399;
              background: #f4f4f5;
              border-color: #d3d4d6;
              cursor: not-allowed;
              background-image: none;
            }
          }
          .status-right-text-title{
            font-size: 16px;
            color: #142433;
            &>img{
              position: relative;
              top: 4px;
              margin-right: 5px;
            }
          }
          .status-right-text{
            font-size: 14px;
            color: #525c66;
          }
        }
      }
      .order-detail-data{
        font-size: 15px;
        color: #525c66;
        height: 120px;
        padding-top: 20px;
        line-height: 30px;
        .detail-data-text{
          &>span:first-child{
            width: 300px;
            display: inline-block;
          }
        }
      }
      .order-detail-list{
        height: calc(100% - 480px);
        .detail-list-title{
          font-size: 15px;
          color: #525c66;
          &>img{
            position: relative;
            top: 2px;
            margin-right: 5px;
          }
        }
        .detail-list-table{
          height: calc(100% - 80px);
          .detail-list-goods-name{
            display: inline-block;
            position: relative;
            height: 50px;
            top: 13px;
            overflow: hidden;
            left: 10px;
            width: calc(100% - 60px);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            word-break: break-all;
            text-align: left;
          }
          .detail-list-real-pay{
            font-weight: bold;
          }
          .detail-list-goods-price{
            font-weight: bold;
          }
        }

      }
      .order-detail-total{
        width: 100%;
        text-align: right;
        line-height: 40px;
        .detail-total-title{
          font-size: 16px;
          color: #525c66;
        }
        .total-price{
          font-size: 18px;
          color: #142433;
        }
        .need-pay{
          font-size: 22px;
          color: #1e8dfc;
          font-weight: bold;
        }
      }
    }
  }
</style>
