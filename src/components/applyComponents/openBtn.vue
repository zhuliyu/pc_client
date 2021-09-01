<template>
  <div class="app-btn">
    <el-button
      type="primary"
      @click="openWindow(appInfo.clientId, appInfo.appId, appInfo.appName)"
      :class="'btn-'+size">打开应用</el-button>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Emit, Watch } from 'vue-property-decorator'
import { apiConfig, fetch, post } from '@/utils/api/Interfaces'
import { Dialog, Button, Input } from 'element-ui'
import { mixins } from 'vue-class-component'

@Component({
  name: 'OpenBtn',
  components: {
    [Button.name]: Button,
    [Dialog.name]: Dialog
  }
})
export default class newApply extends Vue {
  @Prop({ default: {} }) appInfo : any
  @Prop() size: any
  @Emit('authVisible')
  authVisible () {}
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
  async openWindow (clientId:string, appId:string, appName:string):Promise<void> {
    let win: any = window || {}
    let userId:string = ''
    try {
      userId = JSON.parse(win.external.GetUserLoginInfo()).userId
    } catch (e) {
      // userId = 'D9744140C97EF9F9546F5B48B8A0D949'
      console.log('重新获取userId失败')
    }
    if (userId) {
      if (clientId) {
        fetch(apiConfig('application/getAccessUrl'), {
          equipmentId: 1,
          userId: userId,
          clientId: clientId
        })
          .then((res:any) => {
            if (res.code === 200) {
              let redirectUrl: string = res.data.redirectUrl
              if (res.data.canUseAuth === 0) {
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
                        userId: userId,
                        equipmentId: 1
                      })
                        .then((res:any) => {
                          if (res.code === 200) {
                            // 记录成功！
                          }
                        })
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
                this.authVisible()
              }
            } else {
              this.$message({
                message: res.msg,
                type: 'warning'
              })
            }
          })
      }
    } else {
      this.openDialog()
    }
  }
}
</script>
<style scoped lang="less" type="text/less">
  @deep: ~'>>>';
  .app-btn {
    .el-button {
      text-align: center;
      background-color: #1f8dfc;
      box-shadow: 0px 2px 8px 0px rgba(22, 109, 237, 0.35);
      padding: 0;
      margin: 0;
    }
    .btn-110{
      width: 110px;
      height: 48px;
      line-height: 48px;
      font-size: 16px;
      margin-bottom: 18px;
      border-radius: 24px;
    }
    .btn-80{
      width: 80px;
      height: 32px;
      border-radius: 16px;
      line-height: 32px;
      font-size: 12px;
      // margin-right: 12px;
    }
    .btn-158{
      width: 158px;
      height: 60px;
      line-height: 48px;
      font-size: 16px;
      margin-bottom: 18px;
      border-radius: 30px;
    }
  }
</style>
