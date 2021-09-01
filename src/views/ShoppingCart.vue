<template>
  <div class="shopping-panel">
    <div class="shopping-panel-main">
      <div class="shopping-panel-title">
        <span class="split-bar"></span>
        <span class="panel-title">购买商品</span>
        <span class="panel-text">制造云订单</span>
      </div>
      <div class="shopping-panel-step">
        <el-steps  :active="step" align-center>
          <el-step title="确认订单" description=""></el-step>
          <el-step title="选择支付方式" description=""></el-step>
          <el-step title="支付成功" description=""></el-step>
        </el-steps>
      </div>
      <div class="shopping-panel-list">
        <div class="panel-list-tile"><span>订单详情</span></div>
        <div class="panel-list-table">
          <el-table
            :data="shoppingListTableData"
            ref="shoppingListTable"
            border
            highlight-current-row
            class="shopping-list-table"
            height="100%"
            max-height="100%"
            tooltip-effect="dark"
            :header-cell-style="{background:'#f7f7f7',color:'#142433',fontWeight: 'normal'}"
            style="width: 100%;margin-top: 10px;">
            <el-table-column
              prop="goodsName"
              label="商品名称"
              show-overflow-tooltip
              align="center">
              <template slot-scope="scope">
                <div :style="{'width': '50px','height': '50px','display':'inline-block','background': 'url('+scope.row.goodsLogo+') no-repeat center / contain'}"></div>
                <span class="panel-list-goods-name">{{scope.row.goodsName}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="goodsPrice"
              label="单价（元）"
              show-overflow-tooltip
              align="center">
              <template slot-scope="scope">
                <span class="panel-list-goods-price">¥</span>
                <span class="panel-list-goods-price">{{scope.row.goodsPrice}}</span>
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
                <span class="panel-list-real-pay">¥{{(scope.row.goodsPrice * scope.row.goodsCount).toFixed(2)}}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="交易状态"
              show-overflow-tooltip
              align="center">
              <template>
                <span>待付款</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="shopping-panel-tip">
        <div class="panel-tip-tile"><span>温馨提示</span></div>
        <div class="panel-tip-info"><span>1.下单后如需要开票或者有任何问题请联系我们</span></div>
        <div class="panel-tip-info"><span class="text-link-way">联系电话：400-660-8853</span></div>
        <div class="panel-tip-info"><span class="text-link-way">客服邮箱：support@zhizaoyun.com</span></div>
        <!--<div class="panel-tip-info"><span>1.退订说明：下单请阅读<span class="hover-text">云市场退订规则</span>和<span class="hover-text">退订操作说明</span>。</span></div>-->
        <!--<div class="panel-tip-info"><span>2.开票说明：商品的发票由提供该商品的服务商开具，下单前请咨询服务商可开发票类型及内容。<span class="hover-text">开票规则及操作说明</span>。</span></div>-->
      </div>
      <div class="shopping-panel-count">
        <div class="panel-count-info">
          <span class="cout-info-icon">¥<span class="count-info-price">{{totalPrice}}</span></span>
          <el-button :class="(havedCommitOrder || submitOrderClick) ? 'cout-info-button button-disabled' : 'cout-info-button button-use'" @click="commitOrder()" :disabled="havedCommitOrder || submitOrderClick">提交订单</el-button>
        </div>
        <!--<div class="panel-count-tip">
          <span>点击以上按钮，代表您已阅读并同意<span class="hover-text">《应用市场平台服务协议》</span></span>
        </div>-->
      </div>
    </div>
    <el-dialog
      title="温馨提示"
      :visible.sync="dialogVisible"
      class="tip-dialog"
      width="346px">
      <img src="../assets/img/home/question.png">
      <span>需先登录才可以使用！</span>
      <span slot="footer" class="dialog-footer">
        <button @click="dialogVisible = goLogin()">确 定</button>
        <button @click="dialogVisible = false">取 消</button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { apiConfig, fetch, put, postFile, post } from '@/utils/api/Interfaces'
import { mixins } from 'vue-class-component'
import getUserInfo from '@/components/mixins/getUserInfo'
import { State, Action } from 'vuex-class'
import {
  Button,
  Step,
  Steps,
  Table,
  TableColumn,
  Dialog
} from 'element-ui'

  @Component({
    name: 'ShoppingCart',
    components: {
      [Button.name]: Button,
      [Step.name]: Step,
      [Steps.name]: Steps,
      [Table.name]: Table,
      [TableColumn.name]: TableColumn,
      [Dialog.name]: Dialog
    }
  })
export default class shoppingCart extends mixins(getUserInfo) {
    step: number = 1;
    itemList: any = {};
    appId: string = '';
    totalPrice: number = 0;
    shoppingListTableData: any = [];
    goodsItemsData: any = '';
    havedCommitOrder: boolean = false;
    dialogVisible: boolean = false;
    submitOrderClick: boolean = false;
    @Action('setUserOrderNoArray', { namespace: 'order' })
    setUserOrderNoArray: any;
    getItemData ():void{
      let win: any = window || {}
      try {
        let cookieVal = JSON.stringify({
          'cookies': [
            {
              'name': 'goodsItems'
            }
          ]
        })
        let val:any
        let tempStorage = window.sessionStorage.getItem('localGoodsItems')
        if (tempStorage) {
          val = JSON.parse(tempStorage)
          this.itemList = val
        } else {
          val = JSON.parse(win.external.GetCookies(cookieVal)).cookies
          val.forEach((item:any) => {
            if (item.name === 'goodsItems') {
              this.goodsItemsData = item.val
              window.sessionStorage.setItem('localGoodsItems', this.goodsItemsData)
              // let val:any = localStorage.getItem('goodsItems') as any
              this.itemList = JSON.parse(item.val)
            }
          })
        }
        this.shoppingListTableData = this.itemList.goodsDetail
        this.shoppingListTableData.forEach((item:any) => {
          item.realPay = (Number(item.goodsPrice) * 100 * Number(item.goodsCount) * 100).toFixed(2)
          this.totalPrice += Number(item.realPay)
          // item.goodsPrice = item.goodsPrice.toFixed(2)
        })
        this.totalPrice = this.totalPrice / 10000
      } catch (e) {
        console.log('获取订单信息错误')
      }
      /*  let obj = {
        'orderNo': '123123123',
        'orderTitle': '123123123',
        'orderDesc': '123',
        'goodsDetail':
          [
            { 'goodsId': '11', 'goodsName': '图纸通-1-1-1-1-1-1-1-1-1-1-1-1-', 'goodsCount': '1', 'goodsPrice': '2340.00', 'goodsDesc': '11', 'goodsLogo': '../../img/shoppingCart/logo.png', 'facilitatorName': '杭州新迪数字工程系统有限公司', 'goodsType': '1' },
            { 'goodsId': '22', 'goodsName': '图纸通-2-2', 'goodsCount': '2', 'goodsPrice': '2340.11', 'goodsDesc': '22', 'goodsLogo': '../../img/shoppingCart/logo.png', 'facilitatorName': '杭州新迪数字工程系统有限公司', 'goodsType': '2' },
            { 'goodsId': '22', 'goodsName': '图纸通-2', 'goodsCount': '2', 'goodsPrice': '2340.11', 'goodsDesc': '22', 'goodsLogo': '../../img/shoppingCart/logo.png', 'facilitatorName': '杭州新迪数字工程系统有限公司', 'goodsType': '2' },
            { 'goodsId': '22', 'goodsName': '图纸通-2', 'goodsCount': '2', 'goodsPrice': '2340.11', 'goodsDesc': '22', 'goodsLogo': '../../img/shoppingCart/logo.png', 'facilitatorName': '杭州新迪数字工程系统有限公司', 'goodsType': '2' },
            { 'goodsId': '22', 'goodsName': '图纸通-2', 'goodsCount': '2', 'goodsPrice': '2340.11', 'goodsDesc': '22', 'goodsLogo': '../../img/shoppingCart/logo.png', 'facilitatorName': '杭州新迪数字工程系统有限公司', 'goodsType': '2' },
            { 'goodsId': '22', 'goodsName': '图纸通-2', 'goodsCount': '2', 'goodsPrice': '2340.11', 'goodsDesc': '22', 'goodsLogo': '../../img/shoppingCart/logo.png', 'facilitatorName': '杭州新迪数字工程系统有限公司', 'goodsType': '2' },
            { 'goodsId': '22', 'goodsName': '图纸通-2', 'goodsCount': '2', 'goodsPrice': '2340.11', 'goodsDesc': '22', 'goodsLogo': '../../img/shoppingCart/logo.png', 'facilitatorName': '杭州新迪数字工程系统有限公司', 'goodsType': '2' },
            { 'goodsId': '22', 'goodsName': '图纸通-2', 'goodsCount': '2', 'goodsPrice': '2340.11', 'goodsDesc': '22', 'goodsLogo': '../../img/shoppingCart/logo.png', 'facilitatorName': '杭州新迪数字工程系统有限公司', 'goodsType': '2' },
            { 'goodsId': '22', 'goodsName': '图纸通-2', 'goodsCount': '2', 'goodsPrice': '2340.11', 'goodsDesc': '22', 'goodsLogo': '../../img/shoppingCart/logo.png', 'facilitatorName': '杭州新迪数字工程系统有限公司', 'goodsType': '2' }
          ]
      }
      this.itemList = JSON.parse(JSON.stringify(obj))
      this.shoppingListTableData = this.itemList.goodsDetail
      this.shoppingListTableData.forEach((item:any) => {
        item.realPay = (Number(item.goodsPrice) * 100 * Number(item.goodsCount) * 100).toFixed(2)
        item.realPay = item.realPay
        this.totalPrice += Number(item.realPay)
        // item.goodsPrice = item.goodsPrice.toFixed(2)
      })
      this.totalPrice = (this.totalPrice / 10000) */
      /* let _self = this
      _self.$bridge.callHandler('getItemData', {}, res => {
        _self.itemList = JSON.parse(res)
        _self.itemList.goodsDetail.forEach(item => {
          _self.totalPrice += item.goodsPrice * item.goodsCount
        })
      }) */
    }
    getAppId ():void{
      let win: any = window || {}
      try {
        this.appId = win.external.GetCurrentTabAppId()
      } catch (e) {
        console.log('获取AppId错误')
      }
      // this.appId = localStorage.getItem('appIdArray') as string
    }
    commitOrder ():void{
      this.dialogVisible = false
      this.submitOrderClick = true
      window.setTimeout(() => {
        this.submitOrderClick = false
      }, 2000)
      // 提交订单
      // alert(this.userId)
      if (this.userId) {
        let orderParams = {
          appId: this.$route.query.cid ? this.$route.query.cid : '',
          // clientId: this.$route.query.cid ? this.$route.query.cid : '',
          userId: this.userId ? this.userId : '',
          orderDesc: this.itemList.orderDesc,
          orderNo: this.itemList.orderNo,
          orderTitle: this.itemList.orderTitle,
          recvTotalPrice: this.totalPrice,
          goodsDetail: this.itemList.goodsDetail,
          equipmentId: 1
        }
        post(apiConfig('shopping/commitOrder'), orderParams)
          .then((res:any) => {
            if (res.code === 200) {
              this.setUserOrderNoArray(this.appId + '-' + this.itemList.orderNo)
              this.$router.push({
                path: '/cashierDesk/' + orderParams.orderNo + '/' + res.data.outTradeNo
              })
            }
          })
      } else {
        this.dialogVisible = true
      }
    }
    goLogin () {
      let win: any = window || {}
      try {
        win.external.ShowLoginPage()
      } catch (e) {
        this.$router.push({
          path: '/login'
        })
      }
    }
    private mounted () {
      /* let win: any = window || {}
        let cookieVal = JSON.stringify({
          'cookies': [
            {
              'name': 'goodsItems1',
              'val': '123'
            },
            {
              'name': 'goodsItems2',
              'val': 'kkk'
            }
          ]
        })
        win.external.SetCookies(cookieVal)
        let cookieVal2 = JSON.stringify({
          'cookies': [
            {
              'name': 'goodsItems2'
            }
          ]
        })
        let val:any = win.external.GetCookies(cookieVal2)
        alert('val--' + val) */
      this.getItemData()
      this.getAppId()
      /* window.addEventListener('beforeunload', (e) => {
        localStorage.setItem('appIdArray', this.appId)
      }) */
      /* window.addEventListener('beforeunload', (e) => {
        let win: any = window || {}
        try {
          let cookieVal = JSON.stringify({
            'cookies': [
              {
                'name': 'appId',
                'val': this.appId + ''
              }]
          })
          console.log(cookieVal)
          win.external.SetCookies(cookieVal)
          let cookieVal2 = JSON.stringify({
            'cookies': [
              {
                'name': 'goodsItems',
                'val': this.goodsItemsData + ''
              }
            ]
          })
          console.log(cookieVal2)
          win.external.SetCookies(cookieVal2)
        } catch (e) {
          console.log('更新AppId错误')
        }
      }) */
      let orderNoArray: any = []
      if (this.$store.state.order.orderNoArray !== '') {
        let tOrderNo:any = this.$store.state.order.orderNoArray ? this.$store.state.order.orderNoArray : '[]'
        orderNoArray = JSON.parse(tOrderNo)
        if (orderNoArray.includes(this.appId + '-' + this.itemList.orderNo)) {
          this.havedCommitOrder = true
        }
      }
    }
}
</script>
<style>
  /*修改步骤条title文字样式*/
  .shopping-panel-main .el-steps .el-step  .el-step__title{
    font-size: 16px;
    font-weight: normal;
    font-stretch: normal;
    line-height: 60px;
    letter-spacing: 0px;
    color: #142433;
  }
  /*修改步骤条步骤圆圈文字样式*/
  .shopping-panel-main .el-steps .el-step .is-finish .is-text,.shopping-panel-main .el-steps .el-step .is-process .is-text,.shopping-panel-main .el-steps .el-step .is-wait .is-text{
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
  .shopping-panel-main .el-steps .el-step .is-finish  .el-step__icon-inner{
    width: 8px;
    height: 8px;
    background-color: #1e8dfc;
    border-radius: 50px;
    color: #1e8dfc;
    font-size: 0;
  }
  .shopping-panel-main .el-steps .el-step .is-process  .el-step__icon-inner,.shopping-panel-main .el-steps .el-step .is-wait  .el-step__icon-inner{
    width: 10px;
    height: 10px;
    font-size: 0;
  }
  /*修改步骤条线条样式*/
  .shopping-panel-main .el-steps .el-step .el-step__head.is-finish .el-step__line,.shopping-panel-main .el-steps .el-step .el-step__head.is-process .el-step__line{
    background-color: #e6ebf0;
  }
  /*去除表格竖分格线*/
  .shopping-list-table td,.shopping-list-table th,.shopping-list-table .el-table__body-wrapper .el-table--border.is-scrolling-left~.el-table__fixed{
    border-right: 0 solid #EBEEF5 !important;
  }
</style>
<style scoped lang="less" type="text/less">
  @import "../less/common.less";
  .shopping-panel {
    .regionSize(@fill, @fill);
    background-color: #f3f5f9;
    padding: 20px;
    font-family: MicrosoftYaHei;
    .shopping-panel-main{
      background-color: #fff;
      .regionSize(calc(@fill - 80px), calc(@fill - 40px));
      border-radius: 10px;
      padding: 20px;
      .shopping-panel-title{
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
        .panel-title{
          font-size: 20px;
          font-weight: bold;
          font-stretch: normal;
          line-height: 26px;
          letter-spacing: 0px;
          color: #142433;
          display: inline-block;
          margin-right: 10px;
        }
        .panel-text{
          font-size: 14px;
          font-weight: normal;
          font-stretch: normal;
          line-height: 26px;
          letter-spacing: 0px;
          color: #525c66;
        }
      }
      .shopping-panel-step{
        width: 80%;
        height: 100px;
        padding-top: 30px;
        padding-bottom: 10px;
        margin-left: 10%;
      }
      .shopping-panel-list{
        height: calc(100% - 450px);
        .panel-list-tile{
          font-size: 18px;
          font-weight: normal;
          font-stretch: normal;
          line-height: 26px;
          letter-spacing: 0px;
          color: #142433;
          height: 30px;
        }
        .panel-list-goods-name{
          display: inline-block;
          position: relative;
          height: 50px;
          top: 13px;
          overflow: hidden;
          left: 10px;
          width: calc(100% - 50px);
          text-align: left;
          white-space: nowrap;
          text-overflow: ellipsis;
          word-break: break-all;
        }
        .panel-list-real-pay{
          font-weight: bold;
        }
        .panel-list-goods-price{
          font-weight: bold;
        }
        .panel-list-table{
          width: 100%;
          height: calc(100% - 30px);
        }
      }
      .shopping-panel-tip{
        height: 100px;
        padding-top: 30px;
        .panel-tip-tile{
          font-size: 16px;
          font-weight: normal;
          font-stretch: normal;
          line-height: 26px;
          letter-spacing: 0px;
          color: #142433;
          margin-bottom: 5px;
        }
        .panel-tip-info{
          font-size: 16px;
          font-weight: normal;
          font-stretch: normal;
          line-height: 30px;
          letter-spacing: 0px;
          color: #667380;
          .hover-text{
            color: #1e8dfc;
            cursor: pointer;
          }
          .text-link-way{
            display: inline-block;
            margin-left: 15px;
          }
        }
      }
      .shopping-panel-count{
        width: 100%;
        text-align: right;
        position: fixed;
        bottom: 40px;
        right: 60px;
        height: 100px;
        .panel-count-info{
          position: relative;
          margin-bottom: 30px;
          .cout-info-icon{
            font-size: 20px;
            font-weight: normal;
            font-stretch: normal;
            height: 40px;
            line-height: 40px;
            letter-spacing: 0px;
            color: #1e8dfc;
            margin-right: 20px;
            display: inline-block;
            position: relative;
            top: 5px;
            .count-info-price{
              font-family: DINPro-Bold;
              font-size: 26px;
              font-weight: bold;
              letter-spacing: 0px;
              color: #1e8dfc;
            }
          }
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
        .panel-count-tip{
          font-size: 16px;
          font-weight: normal;
          font-stretch: normal;
          line-height: 30px;
          letter-spacing: 0px;
          color: #667380;
          .hover-text{
            color: #1e8dfc;
            cursor: pointer;
          }
        }
      }
    }
  }
</style>
