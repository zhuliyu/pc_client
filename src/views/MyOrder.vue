<template>
  <div class="my-order-panel">
    <div class="my-order-panel-main">
      <div class="order-tab">
        <div :class="active === '' ? 'active' : ''" @click="changeTab('')"><span>全部</span></div>

        <div :class="active === 'TRADE_WAIT_PAY' ? 'active' : ''" @click="changeTab('TRADE_WAIT_PAY')"><span>待付款</span></div>

        <div :class="active === 'TRADE_SUCCESS' ? 'active' : ''" @click="changeTab('TRADE_SUCCESS')"><span>已付款</span></div>

        <div :class="active === 'TRADE_CLOSED' ? 'active' : ''" @click="changeTab('TRADE_CLOSED')"><span>已取消</span></div>
      </div>
      <div style="clear: both"></div>
      <div class="order-search">
        <div class="order-search-content">
          <el-row>
            <el-col :span="10">
              <el-select class="search-select" v-model.trim="orderSearch.selectValue" placeholder="请选择">
                <el-option
                  v-for="item in selectOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <el-input class="search-input" placeholder="请输入关键字搜索"  v-model.trim="orderSearch.selectLabel"></el-input>
            </el-col>
            <el-col :span="14">
              <span class="search-label">创建时间</span>
              <el-date-picker
                v-model="orderSearch.createBeginTime"
                :picker-options="pickerOptions1"
                class="search-date"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="请选择日期">
              </el-date-picker>
              <span class="search-split">-</span>
              <el-date-picker
                v-model="orderSearch.createEndTime"
                :picker-options="pickerOptions2"
                class="search-date"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="请选择日期">
              </el-date-picker>
            </el-col>
          </el-row>
        </div>
        <div class="order-search-btn">
          <el-button @click="serach()">查询</el-button>
        </div>
      </div>
      <div class="order-table">
         <el-row class="table-column column-header">
           <el-col :span="7" align="left">商品名称</el-col>
           <el-col :span="3" align="center">单价（元）</el-col>
           <el-col :span="2" align="center">数量</el-col>
           <el-col :span="4" align="center">实付（元）</el-col>
           <el-col :span="4" align="center">交易状态</el-col>
           <el-col :span="4" align="center">操作</el-col>
         </el-row>
        <div class="table-item-content" v-if="showOrderList">
          <div v-for="(item, index) in orderList" :key="getKey('orderList', index)" class="table-item">
            <div class="table-expend">
              <span>{{item.orderTime}}</span>
              <span>订单编号：{{item.outTradeNo}}</span>
              <span>{{item.facilitatorName}}</span>
            </div>
            <el-row class="table-column column-item">
              <el-col :span="7" align="left" class="column-order-name">
                <div  v-for="(itemChild, index) in item.goodsDetail" :key="getKey('goodsDetail1', index)">
                  <img :src="itemChild.goodsLogo" /><span :title="itemChild.goodsName">{{itemChild.goodsName}}</span>
                </div>
              </el-col>
              <el-col :span="3" align="center" class="column-order-price">
                <div v-for="(itemChild, index) in item.goodsDetail" :key="getKey('goodsDetail2', index)">
                  <span>¥{{itemChild.goodsPrice}}</span>
                </div>
              </el-col>
              <el-col :span="2" align="center" class="column-order-count">
                <div v-for="(itemChild, index) in item.goodsDetail" :key="getKey('goodsDetail3', index)">
                  <span>{{itemChild.goodsCount}}</span>
                </div>
              </el-col>
              <el-col :span="4" align="center" class="column-order-pay">
                <span>¥{{item.totalPrice}}</span>
              </el-col>
              <el-col :span="4" align="center" class="column-order-trade-status">
                <div v-show="item.orderStatus === 'TRADE_SUCCESS'" class="status-success">
                  <img  src="../assets/img/order/tradeSuccessIcon.png">
                  {{ transformType(item.orderStatus) }}
                </div>
                <div v-show="item.orderStatus === 'TRADE_WAIT_PAY'" class="status-wait-pay">
                  <img  src="../assets/img/order/tradeWaitPayIcon.png">
                  {{ transformType(item.orderStatus) }}
                </div>
                <div v-show="item.orderStatus === 'TRADE_CLOSED'" class="status-closed">
                  <img  src="../assets/img/order/tradeClosedIcon.png">
                  {{ transformType(item.orderStatus) }}
                </div>
              </el-col>
              <el-col :span="4" align="center" class="column-order-oprate">
                <div class="order-button-content">
                  <!-- <div class="order-button" v-if="item.orderStatus === 'TRADE_CLOSED'" @click="deleteOrder(item.orderNo, item.outTradeNo)">删除订单</div>-->
                  <div class="order-button order-blue" v-if="item.orderStatus === 'TRADE_WAIT_PAY'" @click="continuePayment(item.orderNo, item.outTradeNo)">立即付款</div>
                  <div class="order-button order-normal" v-if="item.orderStatus === 'TRADE_WAIT_PAY'" @click="cancelOrder(item.orderNo, item.outTradeNo)">取消订单</div>
                  <div class="order-button order-normal" @click="gotoDetail(item.orderNo, item.outTradeNo)">订单详情</div>
                  <i class="el-icon-delete order-delete"  v-if="item.orderStatus === 'TRADE_CLOSED'" @click="deleteOrder(item.orderNo, item.outTradeNo)"></i>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
        <div v-if="showNoData" class="table-item-content-no-data" >
          <img src="../assets/img/order/noData.png">
        </div>
      </div>
    </div>
    <el-dialog
      title="温馨提示"
      :visible.sync="showOrderDialog"
      class="tip-dialog"
      width="400px">
      <img src="../assets/img/home/question.png">
      <span>{{orderDialog.info}}</span>
      <span slot="footer" class="dialog-footer">
        <button @click="subMitDialog()">确 定</button>
        <button @click="clearDialogData()">取 消</button>
  </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { apiConfig, fetch, put, postFile, post } from '@/utils/api/Interfaces'
import { mixins } from 'vue-class-component'
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
interface IorderSearch{
  selectValue: string,
  selectLabel: string,
  createBeginTime: string,
  createEndTime: string
}
interface IorderDialog{
  title: string,
  info: string,
  orderNo: string,
  outTradeNo: string
}

  @Component({
    name: 'MyOrder',
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
export default class myOrder extends mixins(getUserInfo) {
    active: string = '';
    selectOptions: Array<any> = [{
      value: '1',
      label: '商品名称'
    }, {
      value: '2',
      label: '订单编号'
    }]
    orderSearch: IorderSearch = {
      selectValue: '1',
      selectLabel: '',
      createBeginTime: '',
      createEndTime: ''
    };
    orderDialog: IorderDialog = {
      title: '',
      info: '',
      orderNo: '',
      outTradeNo: ''
    }
    orderList: any = [];
    allList: any = [];
    payList: any = [];
    waitList: any = [];
    deleteList: any = [];
    showOrderDialog: boolean = false;
    showOrderList: boolean = false;
    showNoData: boolean = false;
    pickerOptions1:any = {
      disabledDate: (time:any) => {
        let tempFlag = true
        let pickTime:any = ''
        if (!this.orderSearch.createEndTime) {
          pickTime = Date.now()
          if (time.getTime() > pickTime) {
            tempFlag = true
          } else {
            tempFlag = false
          }
        } else {
          pickTime = new Date(this.orderSearch.createEndTime).getTime()
          if (time.getTime() < pickTime && time.getTime() < Date.now()) {
            tempFlag = false
          } else {
            tempFlag = true
          }
        }
        return tempFlag
      }
    }
    pickerOptions2:any = {
      disabledDate: (time:any) => {
        let tempFlag = true
        let pickTime:any = ''
        if (!this.orderSearch.createBeginTime) {
          pickTime = Date.now()
          if (time.getTime() > pickTime) {
            tempFlag = true
          } else {
            tempFlag = false
          }
        } else {
          pickTime = new Date(this.orderSearch.createBeginTime).getTime()
          if (time.getTime() + 3600 * 1000 * 24 > pickTime && time.getTime() < Date.now()) {
            tempFlag = false
          } else {
            tempFlag = true
          }
        }
        return tempFlag
      }
    }
    @Action('cancelMyOrderInformation', { namespace: 'order' })
    cancelMyOrderInformation: any;
    @Action('setMyOrderInformation', { namespace: 'order' })
    setMyOrderInformation: any;
    getOrderList (userId:string, goodsName:string, outTradeNo:string, createTimeBegin:string, createTimeEnd:string, activeType:string):void{
      this.showOrderList = false
      this.showNoData = false
      fetch(apiConfig('shopping/getOrderList'), { userId: this.userId, goodsName: goodsName, outTradeNo: outTradeNo, createTimeBegin: createTimeBegin, createTimeEnd: createTimeEnd, tradeStatus: activeType, pageNum: 1, pageSize: 999 })
        .then((res:any) => {
          if (res.code === 200) {
            this.orderList = []
            this.allList = []
            this.payList = []
            this.waitList = []
            this.deleteList = []
            this.allList = res.data
            res.data.forEach((item:any) => {
              if (item.orderStatus === 'TRADE_WAIT_PAY') {
                this.waitList.push(item)
              } else if (item.orderStatus === 'TRADE_SUCCESS') {
                this.payList.push(item)
              } else if (item.orderStatus === 'TRADE_CLOSED') {
                this.deleteList.push(item)
              }
            })
            if (activeType === 'TRADE_WAIT_PAY') {
              this.orderList = Object.assign(this.waitList)
            } else if (activeType === 'TRADE_SUCCESS') {
              this.orderList = Object.assign(this.payList)
            } else if (activeType === 'TRADE_CLOSED') {
              this.orderList = Object.assign(this.deleteList)
            } else {
              this.orderList = Object.assign(this.allList)
            }
            if (this.orderList.length > 0) {
              this.showOrderList = true
              this.showNoData = false
            } else {
              this.showOrderList = false
              this.showNoData = true
            }
            this.orderList.forEach((item:any) => {
              item.facilitatorName = item.goodsDetail[0].facilitatorName ? item.goodsDetail[0].facilitatorName : ''
              item.totalPrice = 0
              item.goodsDetail.forEach((itemChild:any) => {
                item.totalPrice += Number(itemChild.goodsPrice) * Number(itemChild.goodsCount)
              })
              item.totalPrice = item.totalPrice.toFixed(2)
            })
          } else {
            this.showOrderList = false
            this.showNoData = true
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
    changeTab (state:any) {
      this.active = state
      this.orderSearch.selectValue = '1'
      this.orderSearch.selectLabel = ''
      this.orderSearch.createBeginTime = ''
      this.orderSearch.createEndTime = ''
      this.getOrderList(this.userId, '', '', '', '', state)
      /* if (state === 'TRADE_WAIT_PAY') {
        this.orderList = Object.assign(this.waitList)
      } else if (state === 'TRADE_SUCCESS') {
        this.orderList = Object.assign(this.payList)
      } else if (state === 'TRADE_CLOSED') {
        this.orderList = Object.assign(this.deleteList)
      } else {
        this.orderList = Object.assign(this.allList)
      } */
    }
    continuePayment (orderNo:string, outTradeNo:string) {
      let win: any = window || {}
      let orderParam = JSON.parse(JSON.stringify({ selectValue: this.orderSearch.selectValue, selectLabel: this.orderSearch.selectLabel, createBeginTime: this.orderSearch.createBeginTime, createEndTime: this.orderSearch.createEndTime, active: this.active }))
      this.setMyOrderInformation(orderParam)
      let params = JSON.stringify({
        // 动态获取地址myOrder前的地址
        'url': location.protocol + '//' + location.host + '/cashierDesk/' + orderNo + '/' + outTradeNo,
        'appid': 'myApplyPay',
        'appname': '制造云订单'
      })
      win.external.OpenApp(params)
      /* this.$router.push({
        path: '/cashierDesk/' + orderNo + '/' + outTradeNo
      }) */
    }
    deleteOrder (orderNo:string, outTradeNo:string) {
      this.orderDialog.title = '删除订单'
      this.orderDialog.info = '您确定要删除该订单吗？'
      this.orderDialog.orderNo = orderNo
      this.orderDialog.outTradeNo = outTradeNo
      this.showOrderDialog = true
    }
    cancelOrder (orderNo:string, outTradeNo:string) {
      this.orderDialog.title = '取消订单'
      this.orderDialog.info = '您确定要取消该订单吗？'
      this.orderDialog.orderNo = orderNo
      this.orderDialog.outTradeNo = outTradeNo
      this.showOrderDialog = true
    }
    subMitDialog () {
      if (this.orderDialog.title === '删除订单') {
        post(apiConfig('shopping/deleteOrder'), { userId: this.userId, orderNo: this.orderDialog.orderNo, outTradeNo: this.orderDialog.outTradeNo })
          .then((res:any) => {
            if (res.code === 200) {
              this.serach()
              this.clearDialogData()
            }
          })
      } else if (this.orderDialog.title === '取消订单') {
        post(apiConfig('shopping/cancelOrder'), { userId: this.userId, orderNo: this.orderDialog.orderNo, outTradeNo: this.orderDialog.outTradeNo })
          .then((res:any) => {
            if (res.code === 200) {
              this.serach()
              this.clearDialogData()
            }
          })
      }
    }
    clearDialogData () {
      this.orderDialog.title = ''
      this.orderDialog.info = ''
      this.orderDialog.orderNo = ''
      this.orderDialog.outTradeNo = ''
      this.showOrderDialog = false
    }
    gotoDetail (orderNo: string, outTradeNo: string) {
      let orderParam = JSON.parse(JSON.stringify({ selectValue: this.orderSearch.selectValue, selectLabel: this.orderSearch.selectLabel, createBeginTime: this.orderSearch.createBeginTime, createEndTime: this.orderSearch.createEndTime, active: this.active }))
      this.setMyOrderInformation(orderParam)
      this.$router.push({
        path: '/myOrder/OrderDetail/' + orderNo + '/' + outTradeNo
      })
    }
    get getKey () {
      return (name:string, index:any):string => {
        return name + index
      }
    }
    serach () {
      let self = this
      let goodsName = ''
      let outTradeNo = ''
      let createBeginTime = ''
      let createEndTime = ''
      if (self.orderSearch.selectValue === '1') {
        goodsName = self.orderSearch.selectLabel
      } else if (self.orderSearch.selectValue === '2') {
        outTradeNo = self.orderSearch.selectLabel
      }
      if (self.orderSearch.createEndTime) {
        if (!self.orderSearch.createEndTime.split(' ')[1]) {
          createEndTime = self.orderSearch.createEndTime + ' ' + '23' + ':' + '59' + ':' + '59'
        }
      }
      if (self.orderSearch.createBeginTime) {
        if (!self.orderSearch.createBeginTime.split(' ')[1]) {
          createBeginTime = self.orderSearch.createBeginTime + ' ' + '00' + ':' + '00' + ':' + '00'
        }
      }
      this.getOrderList(this.userId, goodsName, outTradeNo, createBeginTime, createEndTime, this.active)
    }
    private mounted () {
      this.$emit('getNavigation', { menuName: '我的订单', menuChildName: ['订单管理'] })
      if ((this.$store.state.order.selectValue)) {
        let reOrderData = JSON.parse(JSON.stringify(this.$store.state.order))
        this.orderSearch.selectValue = reOrderData.selectValue
        this.orderSearch.selectLabel = reOrderData.selectLabel
        this.orderSearch.createBeginTime = reOrderData.createBeginTime
        this.orderSearch.createEndTime = reOrderData.createEndTime
        this.active = reOrderData.active
        let sgoodsName = ''
        let soutTradeNo = ''
        if (reOrderData.selectValue === '1') {
          sgoodsName = reOrderData.selectLabel
        } else if (reOrderData.selectValue === '2') {
          soutTradeNo = reOrderData.selectLabel
        }
        if (reOrderData.createBeginTime) {
          if (!reOrderData.createBeginTime.split(' ')[1]) {
            reOrderData.createBeginTime = reOrderData.createBeginTime + ' ' + '00' + ':' + '00' + ':' + '00'
          }
        }
        if (reOrderData.createEndTime) {
          if (!reOrderData.createEndTime.split(' ')[1]) {
            reOrderData.createEndTime = reOrderData.createEndTime + ' ' + '23' + ':' + '59' + ':' + '59'
          }
        }
        this.getOrderList(this.userId, sgoodsName, soutTradeNo, reOrderData.createBeginTime, reOrderData.createEndTime, reOrderData.active)
        this.cancelMyOrderInformation()
      } else {
        this.getOrderList(this.userId, '', '', '', '', '')
      }
    }
}
</script>
<style>
  .my-order-panel .el-dialog{
    border-radius: 8px;
  }
  .my-order-panel .el-dialog__body{
    text-align: center;
  }
  .my-order-panel .el-dialog__footer{
    text-align: center;
  }
</style>
<style scoped lang="less" type="text/less">
  .my-order-panel {
    width: calc(100% - 20px * 2);
    height: calc(100%);
    position: relative;
    background-color: white;
    margin-left: 20px;
    font-family: MicrosoftYaHei !important;
    .my-order-panel-main{
      background-color: #fff;
      width: 100%;
      height: 100%;
      .order-tab {
        width: 100%;
        height: 40px;
        line-height: 100px;
        background-color: white;
        border-bottom: 1px solid #e6ebf0;
        &>div {
          float: left;
          height: 100%;
          width: 140px;
          text-align: center;
          box-sizing: border-box;
          font-size: 16px;
          font-weight: normal;
          font-stretch: normal;
          line-height: 30px;
          letter-spacing: 0px;
          color: #667380;
          cursor: pointer;
          &>span{
            position: relative;
            top: -3px;
          }
        }
        &>div.active {
          &>span{
            color: #1f8dfc;
            border-bottom: 3px solid #1f8dfc;
            display: inline-block;
            height: 100%;
          }
        }
      }
      .order-search{
        height: 40px;
        padding: 20px 0;
        .order-search-content{
          display: inline-block;
          width: calc(100% - 150px);
          overflow: hidden;
          font-size: 16px;
          .search-select{
            width: 120px;
            margin-right: 10px;
          }
          .search-input{
            width: calc(100% - 150px);
          }
          .search-label{
            color: #667380;
            display: inline-block;
            width: 65px;
            margin-right: 10px;
          }
          .search-split{
            color: #667380;
            display: inline-block;
            width: 7px;
            margin: 0 10px;
          }
          .search-date{
            width: calc((100% - 102px)/2)
          }
        }
        .order-search-btn{
          display: inline-block;
          width: 150px;
          text-align: right;
          overflow: hidden;
          .el-button{
            background-color: #108af9;
            border-radius: 4px;
            font-size: 14px;
            color: #ffffff;
          }
          .el-button:hover{
            background: #108af9bf;
          }
        }
      }
      .order-table{
        width: 100%;
        height: calc(100% - 220px);
      .column-header{
          background-color: #f7f7f7;
          border-radius: 4px;
          font-size: 16px;
          color: #142433;
          height: 40px;
          line-height: 40px;
          padding: 0 20px;
          margin-bottom: 10px;
        }
        .table-item-content{
          width: 100%;
          height: calc(100% - 60px);
          overflow-y: auto;
          .table-item{
            border-radius: 4px;
            border: solid 1px #e6ebf0;
            margin-bottom: 20px;
            position: relative;
            .table-expend{
              font-size: 16px;
              color: #525c66;
              padding: 0 20px;
              border-bottom: 1px solid #e6ebf0;
              height: 40px;
              line-height: 40px;
              &>span{
                display: inline-block;
                margin-right: 20px;
              }
            }
            .table-column{
              width: 100%;
              .column-order-name{
                border-right: 1px solid #e6ebf0;
                padding:20px;
                &>div{
                  font-size: 16px;
                  color: #525c66;
                  &>img{
                    width: 50px;
                    height: 50px;
                    overflow: hidden;
                    border-radius: 2px;
                  }
                  &>span{
                    display: inline-block;
                    height: 50px;
                    line-height: 50px;
                    margin-left: 10px;
                    width: calc(100% - 60px);
                    overflow: hidden;
                    text-overflow:ellipsis;
                    white-space: nowrap;
                    word-break: break-all;
                  }
                }
              }
              .column-order-price{
                border-right: 1px solid #e6ebf0;
                padding:20px;
                &>div{
                  font-size: 16px;
                  /*color: #525c66;*/
                  &>span{
                    display: inline-block;
                    height: 50px;
                    line-height: 57px;
                    width: calc(100%);
                    overflow: hidden;
                    text-overflow:ellipsis;
                    white-space: nowrap;
                    word-break: break-all;
                    font-weight: bold;
                    color: #142433;
                  }
                }
              }
              .column-order-count{
                border-right: 1px solid #e6ebf0;
                padding:20px;
                &>div{
                  font-size: 16px;
                  color: #525c66;
                  &>span{
                    display: inline-block;
                    height: 50px;
                    line-height: 57px;
                    width: calc(100%);
                    overflow: hidden;
                    text-overflow:ellipsis;
                    white-space: nowrap;
                    word-break: break-all;
                  }
                }
              }
              .column-order-pay{
                border-right: 1px solid #e6ebf0;
                padding:20px;
                display:flex;
                justify-content:center;
                align-items:center;
                &>span{
                  display: inline-block;
                  height: 50px;
                  line-height: 50px;
                  width: calc(100%);
                  overflow: hidden;
                  text-overflow:ellipsis;
                  white-space: nowrap;
                  word-break: break-all;
                  font-size: 16px;
                  color: #142433;
                  font-weight: bold;
                }
              }
              .column-order-trade-status{
                border-right: 1px solid #e6ebf0;
                padding:20px;
                display:flex;
                justify-content:center;
                align-items:center;
                &>div{
                  display: inline-block;
                  font-size: 16px;
                  height: 50px;
                  line-height: 50px;
                  width: calc(100%);
                  overflow: hidden;
                  text-overflow:ellipsis;
                  white-space: nowrap;
                  word-break: break-all;
                  &>img{
                    position: relative;
                    top: 2px;
                  }
                }
                .status-success{
                  color: #34c635;
                }
                .status-wait-pay{
                  color: #ff9500;
                }
                .status-closed{
                  color: #525c66;
                }
              }
              .column-order-oprate {
                display:flex;
                justify-content:center;
                align-items:center;
                .order-button-content{
                  .order-button{
                    cursor:pointer;
                  }
                  .order-blue{
                    border-radius: 4px;
                    border: solid 1px #108af9;
                    width: 100px;
                    color: #108af9;
                    height: 33px;
                    line-height: 33px;
                  }
                  .order-normal{
                    height: 35px;
                    line-height: 35px;
                  }
                  .order-delete{
                    position: absolute;
                    right: 10px;
                    top: -25px;
                    color: #909499;
                    cursor: pointer;
                  }
                }

              }
            }
            .column-item{
              display:flex;
              padding: 15px 0;
            }
          }
        }
        .table-item-content-no-data{
          width: 100%;
          height: calc(100% - 60px);
          display:flex;
          justify-content:center;
          align-items:center;
        }

      }
    }
  }
</style>
