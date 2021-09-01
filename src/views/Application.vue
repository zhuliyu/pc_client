<template>
  <div class="app_panel">
      <div class="app_main">
        <div class="app_content">
          <div class="app_box" v-for="item in applicationList" :key="item.appId"
               @click="openWindow(item.redirectUrl, item.logoUrl, item.appName, item.appId)">
            <div class="app_icn">
              <img :src="item.logoUrl" >
            </div>
            <div class="app_txt">
              <div class="txt_one">{{item.appName}}</div>
              <div class="txt_two">
                <div class="txt_icon"></div>
                {{item.facilitatorName}}
              </div>
            </div>
          </div>
          <!-- 填充剩余部分 -->
          <!--<div class="empty_box" v-for="item in applicationList" :key="item.appName"></div>-->
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
    <el-dialog
      title="温馨提示"
      :visible.sync="authDialogVisible"
      class="tip-dialog"
      width="346px">
      <img src="../assets/img/home/question.png">
      <span>您的企业暂未开通此应用，请联系企业管理员开通后再试。</span>
      <span slot="footer" class="dialog-footer">
        <button @click="authDialogVisible = false">关 闭</button>
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
  name: 'Application',
  components: {
    [Dialog.name]: Dialog,
    [Button.name]: Button
  }
})
export default class Application extends mixins(getUserInfo) {
  applicationList:any[] =[];
  dialogVisible:boolean = false;
  authDialogVisible:boolean = false;

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
            this.applicationList = res.data
          }
        })
    } else {
      post(apiConfig('home/appListNotLogin'), {
        equipmentId: 1,
        userId: this.userId,
        limitNum: -1
      })
        .then((res:any) => {
          if (res.code === 200) {
            this.applicationList = res.data
          }
        })
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

  async openWindow (redirectUrl:string, logoUrl:string, appName:string, appId:string):Promise<void> {
    let win: any = window || {}
    try {
      this.userId = JSON.parse(win.external.GetUserLoginInfo()).userId
    } catch (e) {
      console.log('重新获取userId失败')
    }
    if (this.userId) {
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
                  this.getAppList()
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
            this.authDialogVisible = true
          }
        })
    } else {
      // this.dialogVisible = true
      this.openDialog()
    }
  }
}
</script>

<style scoped lang="less" type="text/less">
  @import "../less/common.less";
  .app_main ::-webkit-scrollbar-track-piece{
        background-color: #e6ebf0 !important;
    }
  .app_panel {
    .regionSize(@fill, @fill);
    background-color: #f3f5f9;
    padding-top: @spacing;
    .app_main {
      .regionSize(calc(@fill - @spacing * 2), calc(@fill - @spacing * 2));
      margin-left: @spacing;
      padding: @spacing * 1.5 @spacing;
      border-radius: @spacing / 2;
      overflow-x: hidden;
      overflow-y: auto;
      background-color: #fff;
      box-sizing: border-box;
      .app_content{
        width: @fill;
        /*display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        box-sizing: border-box;*/
        .app_box{
          height: @spacing * 5.5;
          background-color: #ffffff;
          box-shadow: 0px 6px 18px 0px rgba(200, 211, 222, 0.35);
          border-radius: 8px;
          border: solid 1px #f0f2f5;
          padding-left: @spacing * 0.6;;
          width: calc(100%/3 - 34px);
          display: inline-block;
         /* display: flex;
          justify-content: flex-start;
          align-items: center;
          box-sizing: border-box;*/
          margin: 0 @spacing / 2 @spacing * 1.5 @spacing / 2;
          .app_icn{
            width: @spacing * 4;
            height: @spacing *4;
            margin-right: @spacing;
            border-radius: 6px;
            overflow: hidden;
            position: relative;
            top: 15px;
            img{
              border-radius: @spacing / 4;
              width: @fill;
              height: @fill;
            }
          }
          .app_txt{
            height: @spacing * 2.5;
            position: relative;
            top: -50px;
            left: 100px;
            .txt_one{
              width: @fill;
              font-size: 16px;
              color: #142433;
              margin-bottom: @spacing * 0.7;
            }
            .txt_two{
              width: @fill;
              font-size: 14px;
              color: #667380;
              .txt_icon{
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
        .empty_box {
          height: 0;
          width: @spacing * 18.9;
          margin: 0 @spacing;
        }
      }
    }
  }
</style>
