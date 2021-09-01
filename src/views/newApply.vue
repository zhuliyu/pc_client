<template>
  <div class="app-panel">
    <div class="app-main">
      <div class="app-content" v-for="(item, index) in applyList" :key="'apply' + index">
        <div class="app-content-title">
          {{item.title}}
        </div>
        <div class="app-container">
          <div class="app-box" v-for="(list, index) in item.list" :key="'list' + index"
              @click="openWindow(list.redirectUrl, list.appId, list.name)">
            <div class="app-icn">
              <img :src="list.img">
            </div>
            <div class="app-txt">
              <div class="txt-one">{{list.name}}</div>
              <div class="txt-two">
                <div class="txt-icon"></div>
                {{list.companyName}}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      title="提示"
      :visible.sync="tipVisible"
      class="authority-tip"
      width="346px">
      <span>您的企业暂未开通此应用，请联系企业管理员开通后再试。</span>
      <span slot="footer" class="dialog-footer">
        <button @click="tipVisible = false">关 闭</button>
      </span>
    </el-dialog>
    <el-dialog
      title="提示"
      :visible.sync="authVisible"
      class="authority-tip"
      width="346px">
      <span>您的企业暂未开通此应用，请联系企业管理员开通后再试。</span>
      <span slot="footer" class="dialog-footer">
        <button @click="authVisible = false">关 闭</button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import { apiConfig, fetch, post } from '@/utils/api/Interfaces'
import { Dialog, Button } from 'element-ui'
import { mixins } from 'vue-class-component'
import getUserInfo from '@/components/mixins/getUserInfo'

@Component({
  name: 'newApply',
  components: {
    [Dialog.name]: Dialog,
    [Button.name]: Button
  }
})
export default class newApply extends mixins(getUserInfo) {
  serverError: boolean = false
  serverReturn: boolean = false
  tipVisible:boolean = false
  authVisible:boolean = false
  applyList:any[] = [
    { title: '技术资源',
      list: [
        { name: '设计模型库', img: require('../assets/img/newApply/designModel.png'), companyName: '深圳蜂巢互联科技有限公司' },
        { name: '产品样本库', img: require('../assets/img/newApply/productSample.png'), companyName: '深圳蜂巢互联科技有限公司' },
        { name: '工程图纸库', img: require('../assets/img/newApply/blueprint.png'), companyName: '深圳蜂巢互联科技有限公司' },
        { name: '技术视频库', img: require('../assets/img/newApply/technicalVideo.png'), companyName: '深圳蜂巢互联科技有限公司' },
        { name: '零件库', img: require('../assets/img/newApply/3dResource.png'), companyName: '杭州新迪数字工程系统有限公司' },
        { name: '技术资料库', img: require('../assets/img/newApply/technicalInformation.png'), companyName: '深圳蜂巢互联科技有限公司' }
      ] },
    { title: '研发设计',
      list: [
        { name: '图纸通', img: require('../assets/img/newApply/drawingPass.png'), companyName: '杭州新迪数字工程系统有限公司' }
      ] },
    { title: '生产制造',
      list: [
        { name: '精益生产电子看板', img: require('../assets/img/newApply/electronicSignage.png'), companyName: '深圳蜂巢互联科技有限公司' },
        { name: '蜂阵-智能设备维护管理', img: require('../assets/img/newApply/mis.jpg'), companyName: '深圳蜂巢互联科技有限公司' },
        { name: '蜂舞-精益现场管理', img: require('../assets/img/newApply/eCIP.png'), companyName: '深圳蜂巢互联科技有限公司' }
      ] },
    { title: '工业诊断',
      list: [
        { name: '精益生产诊断体验版', img: require('../assets/img/newApply/trailVersion.png'), companyName: '深圳蜂巢互联科技有限公司' },
        { name: '精益数字化生产诊断标准版', img: require('../assets/img/newApply/standardVersion.png'), companyName: '深圳蜂巢互联科技有限公司' },
        { name: '精益数字化生产诊断高级版', img: require('../assets/img/newApply/premiunVersion.png'), companyName: '深圳蜂巢互联科技有限公司' }
      ] },
    { title: '行业资讯',
      list: [
        { name: '专家视点', img: require('../assets/img/newApply/expertViews.png'), companyName: '深圳蜂巢互联科技有限公司' },
        { name: '精益管理', img: require('../assets/img/newApply/leanManagement.png'), companyName: '深圳蜂巢互联科技有限公司' },
        { name: '蜂巢资讯', img: require('../assets/img/newApply/fengchaoNews.png'), companyName: '深圳蜂巢互联科技有限公司' },
        { name: '汽车产业动态', img: require('../assets/img/newApply/carIndustryNews.png'), companyName: '深圳蜂巢互联科技有限公司' },
        { name: '化妆品产业动态', img: require('../assets/img/newApply/cosmeticsIndustryNews.png'), companyName: '深圳蜂巢互联科技有限公司' },
        { name: '高科技电子动态', img: require('../assets/img/newApply/highTechDynamic.png'), companyName: '深圳蜂巢互联科技有限公司' },
        { name: '智能制造动态', img: require('../assets/img/newApply/smartMakeNews.png'), companyName: '深圳蜂巢互联科技有限公司' },
        { name: '工业互联网动态', img: require('../assets/img/newApply/industrialIntelNews.png'), companyName: '深圳蜂巢互联科技有限公司' },
        { name: '工业软件动态', img: require('../assets/img/newApply/industrialSoftNews.png'), companyName: '深圳蜂巢互联科技有限公司' },
        { name: '加工制造技术', img: require('../assets/img/newApply/manufacturing.png'), companyName: '深圳蜂巢互联科技有限公司' },
        { name: '工业软件技巧', img: require('../assets/img/newApply/productDesign.png'), companyName: '深圳蜂巢互联科技有限公司' }
      ] }
  ]
  mounted () {
    this.getAppList()
  }
  getAppList ():void {
    if (this.userId) {
      post(apiConfig('home/appList'), {
        equipmentId: 1,
        userId: this.userId,
        limitNum: -1
      })
        .then((res:any) => {
          if (res.code === 200) {
            this.handleData(res.data)
          } else {
            this.serverError = true
          }
        }).catch((err: any) => {
          this.serverError = true
        })
    } else {
      post(apiConfig('home/appListNotLogin'), {
        equipmentId: 1,
        userId: this.userId,
        limitNum: -1
      })
        .then((res:any) => {
          if (res.code === 200) {
            this.handleData(res.data)
          } else {
            this.serverError = true
          }
        }).catch((err: any) => {
          this.serverError = true
        })
    }
  }
  handleData (apply:any) {
    this.applyList.map(item => {
      item.list && item.list.map((list:any) => {
        let find = apply.find((data:any) => data.appName === list.name)
        if (find) {
          list.redirectUrl = find.redirectUrl
          list.appId = find.appId
        }
      })
    })
    this.serverReturn = true
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
  async openDialog ():Promise<void> {
    let status: any
    let win: any = window || {}
    try {
      status = await win.external.ShowMsgBox(0)
    } catch (e) {
      console.log('打开失败')
    } finally {
      if (status === '1') {
        this.goLogin()
      }
    }
  }
  async openWindow (redirectUrl:string, appId:string, appName:string):Promise<void> {
    let win: any = window || {}
    try {
      this.userId = JSON.parse(win.external.GetUserLoginInfo()).userId
    } catch (e) {
      console.log('重新获取userId失败')
    }
    if (this.userId) {
      if (this.serverError) {
        this.$message({
          message: '服务器异常，请稍后再试',
          type: 'warning'
        })
        return;
      }
      if (!this.serverReturn) {
        this.$message({
          message: '数据请求中，请稍后',
          type: 'warning'
        })
        return;
      }
      if (redirectUrl && appId) {
        fetch(apiConfig('application/platformAuthorization'), { appId, userId: this.userId })
          .then((res:any) => {
            if (res.data) {
              fetch(apiConfig('home/insertingCoil'), {
                appId,
                equipmentId: 1
              })
                .then((res:any) => {
                  return res.data
                })
                .then((res:number) => {
                  if (res === 0) {
                    // 应用已下架
                    this.$message({
                      message: '该应用已经下架！',
                      type: 'warning'
                    })
                  } else {
                    post(apiConfig('home/appRecord'), {
                      appId,
                      userId: this.userId,
                      equipmentId: 1
                    })
                      .then((res:any) => {
                        if (res.code === 200) {
                          // 记录成功！
                        }
                      })
                    // 存入appId
                    // localStorage.setItem('appIdArray', appId)
                    try {
                      let cookieVal = JSON.stringify({
                        'cookies': [
                          {
                            'name': 'appId',
                            'val': appId + ''
                          }]
                      })
                      win.external.SetCookies(cookieVal)
                    } catch (e) {
                      console.log('存入AppId错误')
                    }
                    // win.open(redirectUrl)
                    try {
                      let params = JSON.stringify({
                        'url': redirectUrl + '',
                        'appid': appId + '',
                        'appname': appName + ''
                      })
                      win.external.OpenApp(params)
                    } catch (e) {
                      console.log('open error')
                    }
                  }
                })
            } else {
              this.authVisible = true
            }
          })
      } else {
        this.tipVisible = true
      }
    } else {
      this.openDialog()
    }
  }
}
</script>

<style scoped lang="less" type="text/less">
  @import "../less/common.less";
  /deep/ .authority-tip .el-dialog{
    position: absolute;
    left: 50%;
    top: 50%;
    margin-left: -173px;
    margin-top: -105.5px !important;
    height: 211px !important;
    border-radius: 6px;
  }
  /deep/.authority-tip .el-dialog__header .el-dialog__title{
    font-size: 16px !important;
    font-weight: bold;
  }
  /deep/.authority-tip .el-dialog__body{
    text-align: center;
    color: black;
    font-size: 14px;
  }
  /deep/.authority-tip .el-dialog__footer{
    text-align: center !important;
  }
  /deep/.authority-tip .el-dialog__footer button{
    padding: 5px 30px;
    font-size: 14px;
    background-color: #1f8Dfc;
    color: white;
    border-radius: 3px;
    border:none;
    cursor: pointer;
  }
  .app-main ::-webkit-scrollbar-track-piece{
        background-color: #e6ebf0 !important;
    }
  .app-panel {
    .regionSize(@fill, @fill);
    background-color: #f3f5f9;
    padding-top: @spacing;
    .app-main {
      .regionSize(calc(@fill - @spacing * 2), calc(@fill - @spacing * 2));
      margin-left: @spacing;
      padding: @spacing * 1.5 @spacing;
      border-radius: @spacing / 2;
      overflow-x: hidden;
      overflow-y: auto;
      background-color: #fff;
      box-sizing: border-box;
      .app-content{
        width: @fill;
        background-color: #ffffff;
        box-shadow: 0px 6px 18px 0px rgba(200, 211, 222, 0.35);
        border-radius: 8px;
        border: solid 1px #f0f2f5;
        margin-bottom: 15px;
        .app-content-title{
          padding: 10px 0 10px 15px;
          border-bottom: 1px solid #f0f2f5;
          font-size: 15px;
        }
        .app-container{
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          padding: 10px 0;
          .app-box{
            height: @spacing * 4.5;
            padding-left: @spacing * 0.6;;
            width: calc(100%/3 - 34px);
            display: flex;
            justify-content: flex-start;
            align-items: center;
            margin: 0 @spacing / 2 2px @spacing / 2;
            border: solid 1px white;
            border-radius: 8px;
            cursor: pointer;
            .app-icn{
              width: @spacing * 3.5;
              height: @spacing *3.5;
              margin-right: @spacing;
              border-radius: 6px;
              overflow: hidden;
              img{
                border-radius: @spacing / 4;
                width: @fill;
                height: @fill;
              }
            }
            .app-txt{
              .txt-one{
                width: @fill;
                font-size: 16px;
                color: #142433;
                margin-bottom: @spacing * 0.7;
              }
              .txt-two{
                width: @fill;
                font-size: 14px;
                color: #667380;
                .txt-icon{
                  width: @spacing * 0.7;
                  height: @spacing * 0.8;
                  background: url(../assets/img/application/app_tip.png) no-repeat;
                  background-size: 100%;
                  float: left;
                  margin-right: @spacing * 0.3;
                }
              }
            }
          }
          .app-box:hover{
            border: solid 1px #0687f3
          }
        }
      }
    }
  }
</style>
