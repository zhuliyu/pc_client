<template>
  <div class="main">
    <div class="page-content"></div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { apiConfig, fetch } from '@/utils/api/Interfaces'
import { checkNumberAndEmail } from '@/assets/js/ruleCheck'
import { Action } from 'vuex-class'
import { Button, Form, FormItem, Input, Checkbox } from 'element-ui'

@Component({
  name: 'Skip',
  components: {
  }
})
export default class Skip extends Vue {
  code: any = '';
  state: any = '';
  type: string = '';
  @Action('setUserInformation', { namespace: 'information' })
  setUserInformation: any;
  getSex (sex: any) {
    let str
    if (sex === '男' || sex === 'm') {
      str = '1'
    } else if (sex === '女' || sex === 'f') {
      str = '2'
    } else {
      str = '3'
    }
    return str
  }
  getUserInfo () {
    let tempState: string = ''; let tempFlag: boolean = true; let tempParams = unescape(this.state)
    let win: any = window || {}
    if (tempParams.indexOf('|') >= 0) {
      tempState = this.state.split('|')[0]
    } else {
      tempFlag = false
      tempState = this.state
    }
    if (this.type === '1') {
      // 微博
      fetch(apiConfig('login/blogLoginInfo'), { code: this.code, state: tempState, tag: 1 })
        .then((res: any) => {
          if (res.code === 200) {
            if (res.data.status === 1) {
              let tempAddress = ''
              if (tempFlag) {
                tempAddress = this.state.split('|')[1]
              }
              this.$router.push({
                path: '/bindAccount',
                query: {
                  openId: res.data.sinaBlogUserInfo.id,
                  unionId: res.data.sinaBlogUserInfo.id,
                  thirdBindName: res.data.sinaBlogUserInfo.name,
                  registerName: res.data.sinaBlogUserInfo.registerName,
                  headImgUrl: res.data.sinaBlogUserInfo.avatar_large,
                  sex: this.getSex(res.data.sinaBlogUserInfo.gender),
                  state: tempState,
                  redirectAddress: tempAddress,
                  thirdBindType: '13'
                }
              })
            } else {
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
              if (tempFlag) {
                if (this.state.split('|')[1].indexOf('?') >= 0) {
                  window.location.href = this.state.split('|')[1] + '&token=' + res.data.loginData.access_token
                } else {
                  window.location.href = this.state.split('|')[1] + '?token=' + res.data.loginData.access_token
                }
              }
            }
          }
        })
    } else if (this.type === '2') {
      // QQ
      fetch(apiConfig('login/qqLoginInfo'), { code: this.code, state: tempState, tag: 1 })
        .then((res: any) => {
          if (res.code === 200) {
            if (res.data.status === 1) {
              let tempAddress = ''
              if (tempFlag) {
                tempAddress = this.state.split('|')[1]
              }

              this.$router.push({
                path: '/bindAccount',
                query: {
                  openId: res.data.qqUserInfo.openid,
                  unionId: res.data.qqUserInfo.unionid,
                  thirdBindName: res.data.qqUserInfo.nickname,
                  registerName: res.data.qqUserInfo.registerName,
                  headImgUrl: res.data.qqUserInfo.figureurl_qq_1,
                  sex: this.getSex(res.data.qqUserInfo.gender),
                  state: tempState,
                  redirectAddress: tempAddress,
                  thirdBindType: '11'
                }
              })
            } else {
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
              if (tempFlag) {
                if (this.state.split('|')[1].indexOf('?') >= 0) {
                  window.location.href = this.state.split('|')[1] + '&token=' + res.data.loginData.access_token
                } else {
                  window.location.href = this.state.split('|')[1] + '?token=' + res.data.loginData.access_token
                }
              }
            }
          }
        })
    }
  }
  mounted () {
    if (this.$route.query) {
      this.code = this.$route.query.code
      this.state = this.$route.query.state
    }
    if (this.$route.params.type) {
      console.log(typeof this.$route.params.type)
      this.type = this.$route.params.type
    }
    if (location.href.indexOf('error_uri=') >= 0) {
      this.$router.push({
        path: '/loginPop'
      })
    } else {
      this.getUserInfo()
    }
  }
}
</script>
