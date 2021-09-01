<template>
  <div class="code-main">
    <div class="page-content">
      <div>
        <div class="page-content-title">微信登录</div>
        <div class="page-img-container">
          <img id="loginCodeImg" :src="loginCodeInfo.imageUrl" />

          <div class="exceedTimePanel" v-show="exceedTimePanel" @click="getLoginCode()">二维码已过期，请刷新二维码</div>
        </div>
        <div class="page-content-info">
          <div>请使用微信扫描二维码登录</div>

          <div>制造云</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { apiConfig, fetch, post } from '@/utils/api/Interfaces'
import { checkNumberAndEmail } from '@/assets/js/ruleCheck'
import { Action } from 'vuex-class'
import { Button, Form, FormItem, Input, Checkbox, Tabs, TabPane, Dialog } from 'element-ui'
import 'jquery'
interface codeInterface {
  expireSeconds:number,
  imageUrl: any,
  randomCode: any,
  url: any
}
@Component({
  name: 'CodeLogin',
  components: {

  }
})

export default class CodeLogin extends Vue {
  msg:string = 'Welcome to CodeLogin Page !'
  redirectAddress:any = ''
  loginStateInterval:any = ''
  exceedTimeInterval:any = ''
  exceedTimePanel:boolean = false
  loginCodeInfo:codeInterface = {
    expireSeconds: 7200,
    imageUrl: '',
    randomCode: '',
    url: ''
  }
  getLoginCode () {
    let win: any = window || {}
    fetch(apiConfig('login/loginCode'), {})
      .then((res: any) => {
        if (res.code === 200) {
          this.exceedTimePanel = false
          this.loginCodeInfo = res.data
          if (this.exceedTimeInterval) {
            window.clearInterval(this.exceedTimeInterval)
          }
          if (this.loginStateInterval) {
            window.clearInterval(this.loginStateInterval)
          }
          this.exceedTimeInterval = window.setInterval(() => {
            this.loginCodeInfo.expireSeconds--
            if (this.loginCodeInfo.expireSeconds === 0) {
              this.exceedTimePanel = true
              window.clearInterval(this.exceedTimeInterval)
              window.clearInterval(this.loginStateInterval)
            }
          }, 1000)
          this.loginStateInterval = window.setInterval(() => {
            fetch(apiConfig('login/wxIsLogin'), { code: this.loginCodeInfo.randomCode })
              .then((res: any) => {
                if (res.code === 200) {
                  window.clearInterval(this.exceedTimeInterval)
                  window.clearInterval(this.loginStateInterval)
                  if (res.data.status === 2) {
                    // 登录成功
                    let tempParams = {
                      token: res.data.loginData.access_token,
                      userName: res.data.loginData.userInfo.username,
                      expires_in: res.data.loginData.expires_in,
                      userId: res.data.loginData.userInfo.userid,
                      headUrl: res.data.loginData.userInfo.headImgUrl
                    }
                    try {
                      // 调用盒子并塞值
                      win.external.SetUserLoginInfo(JSON.stringify(tempParams))
                    } catch (e) {
                      this.$router.push({
                        path: '/home'
                      })
                    }
                    // this.setUserInfo(tempParams)
                    if (this.redirectAddress) {
                      if (this.redirectAddress.indexOf('?') >= 0) {
                        window.location.href = this.redirectAddress + '&token=' + res.data.loginData.access_token
                      } else {
                        window.location.href = this.redirectAddress + '?token=' + res.data.loginData.access_token
                      }
                    }
                  } else {
                    // 跳转至注册/激活页
                    this.$router.push({
                      path: '/bindAccount',
                      query: {
                        openId: res.data.wechatUserInfo.openid,
                        unionId: res.data.wechatUserInfo.unionid,
                        thirdBindName: res.data.wechatUserInfo.nickname,
                        registerName: res.data.wechatUserInfo.registerName,
                        headImgUrl: res.data.wechatUserInfo.headimgurl,
                        sex: res.data.wechatUserInfo.sex,
                        state: res.data.state,
                        redirectAddress: this.redirectAddress,
                        thirdBindType: '12'
                      }
                    })
                  }
                } else {
                  this.$message({
                    message: res.msg,
                    type: 'warning'
                  })
                }
              })
            //   .catch((err) => {
            //       this.$message({
            //           message:err,
            //           type: 'warning'
            //       })
            // });
          }, 2000)
        }
      })
  }
  mounted () {
    this.getLoginCode()
  }
  created () {
    if (location.href.indexOf('?address=') >= 0) {
      let tempHash = location.href
      this.redirectAddress = unescape(tempHash.split('?address=')[1])
    }
  }
  destroyed () {
    if (this.exceedTimeInterval) {
      window.clearInterval(this.exceedTimeInterval)
    }
    if (this.loginStateInterval) {
      window.clearInterval(this.loginStateInterval)
    }
  }
}
</script>
<style scoped lang="less" type="text/less">
  @spacing: 20px;
  @fill: 100%;
  .regionSize (@regionW: 100%, @regionH: 100%) {
    width: @regionW;
    height: @regionH;
    position: relative;
  }
  .code-main {
    .regionSize(@fill, @fill);
    min-width: 320px;
    min-height: 440px;
    max-width: 440px;
    max-height: 568px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    .page-content {
      .regionSize(@fill, @fill);
      background-color: #333333;
      overflow: hidden;
      &>div {
        // .regionSize(@spacing * 22 - 5, @spacing * 27.5);
        margin: @spacing * 2 auto;
        color: white;
        text-align: center;
        .page-content-title {
          height: @spacing * 2;
          line-height: @spacing * 2;
          font-size: @spacing;
        }
        .page-img-container{
          .regionSize(250px, 250px);
          margin: 20px auto;
          &>img {
            width: 100%;
            height: 100%;
          }
          .exceedTimePanel {
            position: absolute;
            top: 105px;
            width: 250px;
            height: @spacing * 2;
            line-height: @spacing * 2;
            background-color: black;
            cursor: pointer;
          }
        }
        .page-content-info {
          .regionSize(90%, @spacing * 3);
          background-color: #232323;
          border-radius: @spacing * 2.5;
          overflow: hidden;
          margin: 10px auto;
          &>div:first-child {
            margin-top: 8px;
          }
        }
      }
    }
  }
</style>
