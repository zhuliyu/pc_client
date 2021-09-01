<template>
  <div class="bind-main">

    <div class="page-content">
      <div>
        <div class="page-content-title">联合登录</div>

        <div class="page-content-body">
          <el-tabs v-model="activeName" @tab-click="handleClick" ref="tabs" style="height: 100%">
            <el-tab-pane label="已有制造云账号" name="first">
              <div class="page-content-info">
                <img style="width: 36px;position: relative;top: 12px;left: 10px;border: 1px solid transparent;border-radius: 50px;" :src=" headImgUrl ? headImgUrl : '../../static/img/user/person.png'" />

                <span style="margin-left: 15px;">Hi,</span> <span style="color: #409EFF;">{{ thirdBindName }}</span>

                <span>欢迎来到制造云，完成绑定后可以一键登录哦~</span>
              </div>

              <div v-show="currentStep === 1" style="">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                  <el-form-item label="" prop="loginName">
                    <el-input placeholder="请输入您的用户名/手机号" v-model.trim="ruleForm.loginName"></el-input>
                  </el-form-item>

                  <el-form-item label="" prop="password">
                    <el-input placeholder="请输入您的密码" :type="pwdType" v-model.trim="ruleForm.password"
                              oncopy="return false" onpaste="return true" oncut="return false">
                      <i slot="suffix" :class="pwdType === 'password' ? 'el-input__icon register-eyes-close' : 'el-input__icon register-eyes-open'" @click="showPwd()"></i>
                    </el-input>
                  </el-form-item>
                </el-form>

                <div @click="gotoForget()" style="float: right;color: #999999;font-size: 14px;cursor: pointer;">忘记登录密码？</div>
              </div>

              <div v-show="currentStep === 1" style="text-align: center;margin-top: 12vh">
                <el-button type="primary" @click="loginIn('ruleForm')" style="width:100%">下一步</el-button>
              </div>

              <div v-show="currentStep === 2" style="width: 100%;">
                <div class="logo-box">
                  <div class="verBox" style="padding-top:25px">
                    <div id="imgVer" style="display:inline-block;"></div>
                  </div>
                </div>
              </div>

              <div v-show="currentStep === 2" style="text-align: center;margin-top: 3vh">
                <el-button type="primary" @click="beforeStep()" style="width:60%">上一步</el-button>
              </div>

              <div v-show="currentStep === 3" style="text-align: center;margin-top: 80px;margin-bottom: 60px;">
                <i class="fa fa-check-circle-o font-custom"></i>恭喜您，绑定制造云账号成功！
              </div>

              <div v-show="currentStep === 3" style="text-align: center;margin-top: 20px;width: calc(100% - 160px);margin-left: 80px;">
                <span>{{ countDown }}</span><span>秒后</span><span style="color: #828282;">返回</span>
              </div>

              <div v-show="currentStep === 3" style="text-align: center;margin-top: 20px;width: calc(100% - 160px);margin-left: 80px;">
                <el-button type="primary" @click="gotoHome()">完成</el-button>
              </div>
            </el-tab-pane>

            <el-tab-pane label="没有制造云账号" name="second">
              <div class="page-content-info">
                <img style="width: 36px;position: relative;top: 12px;left: 10px;border: 1px solid transparent;border-radius: 50px;" :src="headImgUrl ? headImgUrl : '../../static/img/user/person.png'" />

                <span style="margin-left: 15px;">Hi,</span> <span style="color: #409EFF;">{{ thirdBindName }}</span>

                <span>欢迎来到制造云，完成绑定后可以一键登录哦~</span>
              </div>

              <div style="">
                <el-form :model="phoneForm" :rules="rules" ref="phoneForm" label-width="130px" class="demo-ruleForm">
                  <el-form-item label="" prop="phoneNumber" class="phoneInput">
                    <div class="num10086">+86 (中国大陆)</div>

                    <el-input placeholder="请输入您的手机号" v-model="phoneForm.phoneNumber"></el-input>
                  </el-form-item>

                  <el-form-item label="" prop="identifyingCode" class="identifyingCode">
                    <el-input placeholder="请输入您的验证码" v-model="phoneForm.identifyingCode"></el-input>

                    <el-button type="primary" style="width: 126px;text-align: center;text-indent: -7px;" @click="getCode()">{{ codeInfo }}</el-button>
                  </el-form-item>
                </el-form>
              </div>

              <div class="readAgreementCheck">
                  <el-checkbox v-model="readAgreementChecked"></el-checkbox>
                  <span class="text">已阅读并同意</span>
                  <span class="agreement" @click="openAgreement(1)" style="margin-left: -5px;">《用户服务条款》</span>
                  <span class="text" style="margin-left: -5px;">和</span>
                  <span class="agreement" @click="openAgreement(2)" style="margin-left: -5px;">《法律声明及隐私权政策》</span>
              </div>

              <div style="text-align: center;margin-top: 6vh">
                <el-button type="primary" :disabled="!readAgreementChecked" @click="phoneIn('phoneForm')" style="width:100%">立即绑定</el-button>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
    <el-dialog  title=""
                :visible.sync="show"
                class="registerDialog"
                :close-on-click-modal="false"
                :modal-append-to-body="false"
                :show-close="true">
      <firstDeclare v-show="firstDialog"></firstDeclare>
      <secondDeclare v-show="secondDialog"></secondDeclare>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { apiConfig, fetch, post } from '@/utils/api/Interfaces'
import { checkNumberAndEmail } from '@/assets/js/ruleCheck'
import { Action } from 'vuex-class'
import { Button, Form, FormItem, Input, Checkbox, Tabs, TabPane, Dialog } from 'element-ui'
import imgVer from '../components/slide/img_ver'
import firstDeclare from '../views/firstDeclare.vue'
import secondDeclare from '../views/secondDeclare.vue'
import config from '@/assets/js/config'

interface ruleInterface {
  loginName:any,
  password: any,
  phoneNumber: any,
  identifyingCode: any
}

@Component({
  name: 'BindAccount',
  components: {
    [Button.name]: Button,
    [Form.name]: Form,
    [FormItem.name]: FormItem,
    [Input.name]: Input,
    [Checkbox.name]: Checkbox,
    [Tabs.name]: Tabs,
    [TabPane.name]: TabPane,
    firstDeclare,
    secondDeclare,
    [Dialog.name]: Dialog
  }
})
export default class BindAccount extends Vue {
  show: boolean = false;
  firstDialog: boolean = false;
  secondDialog: boolean = false;
  msg: string = 'Welcome to BindAccount Page !'
  readAgreementChecked: boolean = false
  openId:any = ''
  unionId:any = ''
  thirdBindType:any = ''
  thirdBindName:any = ''
  registerName:any = ''
  headImgUrl:any = ''
  sex:any = ''
  state:any = ''
  redirectAddress:any = ''
  currentStep:number = 1
  countDown:number = 5
  activeName:string = 'second'
  pwdType:string = 'password'
  codeInfo:string = '获取短信验证码'
  codeInterval:any = ''
  countInterval:any = ''
  ruleForm: any = {
    loginName: '',
    password: ''
  }
  phoneForm: any ={
    phoneNumber: '',
    identifyingCode: '',
    uuid: ''
  }
  @Action('wxBind', { namespace: 'login' })
  wxBind: any;
  rules:ruleInterface = {
    loginName: [
      { required: true,
        validator: (rule:any, value:string, callback:any) => {
          if (!value) {
            callback(new Error('请输入您的手机号/用户名'))
          } else {
            if (value.indexOf(' ') >= 0) {
              return callback(new Error('手机号/用户名不能有空格'))
            } else {
              callback()
            }
          }
        },
        trigger: 'blur' }
    ],
    password: [
      { required: true,
        validator: (rule:any, value:string, callback:any) => {
          if (!value) {
            callback(new Error('请输入您的密码'))
          } else {
            if (value.indexOf(' ') >= 0) {
              return callback(new Error('密码不能有空格'))
            } else {
              callback()
            }
          }
        },
        trigger: 'blur' }
    ],
    phoneNumber: [
      { validator: (rule:any, value:string, callback:any) => {
        if (value === '') {
          return callback(new Error('手机号不能为空'))
        } else {
          checkNumberAndEmail('telephoneNumber', value, (checkResult: any) => {
            if (!checkResult) {
              return callback(new Error('手机号填写不正确，请输入有效的11位手机号'))
            } else {
              fetch(apiConfig('login/checkAccount'), { username: value })
                .then((res: any) => {
                  if (res.code === 200) {
                    return callback(new Error('当前手机号已注册，建议您立即登录'))
                  } else {
                    callback()
                  }
                })
            }
          })
        }
      },
      trigger: 'blur' }
    ],
    identifyingCode: [
      { validator: (rule:any, value:string, callback:any) => {
        if (value === '') {
          return callback(new Error('请输入您的验证码'))
        } else {
          fetch(apiConfig('forget/checkStatus'), { code: this.phoneForm.identifyingCode, key: this.phoneForm.uuid, delete: false })
            .then((res: any) => {
              if (res.code === 200) {
                callback()
              } else {
                return callback(new Error('验证码输入错误'))
              }
            })
        }
      },
      trigger: 'blur' }
    ]
  }
  gotoHome ():void {
    let win: any = window || {}
    win.external.CloseLoginPage()
  }
  gotoForget ():void {
    if (this.redirectAddress) {
      this.$router.push({
        path: '/forgetPop?address=' + this.redirectAddress
      })
    } else {
      this.$router.push({
        path: '/forgetPop'
      })
    }
  }
  beforeStep ():void {
    this.currentStep--
  }
  loginIn (formName: any) {
    let _self = this;
    (_self.$refs[formName] as HTMLFormElement).validate((valid: any) => {
      if (valid) {
        _self.currentStep++
        imgVer({
          el: '$("#imgVer")',
          width: '260',
          height: '116',
          img: [
            require('../assets/img/slide/ver1.png'),
            require('../assets/img/slide/ver2.png'),
            require('../assets/img/slide/ver3.png'),
            require('../assets/img/slide/ver4.png')
          ],
          success: function () {
            // 滑动成功事件
            _self.wxBind({ type: _self.thirdBindType,
              username: _self.ruleForm.loginName,
              password: _self.ruleForm.password,
              openid: _self.openId,
              unionid: _self.unionId,
              redirectAddress: _self.redirectAddress,
              bind: true,
              next: (type: any, token: any) => {
                // action分发完毕回调
                _self.currentStep++
                _self.countInterval = window.setInterval(() => {
                  _self.countDown--
                  if (_self.countDown === 0) {
                    if (_self.redirectAddress) {
                      if (_self.redirectAddress.indexOf('?') >= 0) {
                        window.location.href = _self.redirectAddress + '&token=' + token
                      } else {
                        window.location.href = _self.redirectAddress + '?token=' + token
                      }
                    } else {
                      _self.$router.push({
                        path: '/home'
                      })
                    }
                  }
                }, 1000)
              } })
          },
          error: function () {
            // alert('执行失败')
          }
        })
        if (navigator.userAgent.indexOf('Firefox') > 0) {
          /* 火狐浏览器 */
        }
      } else {
        return false
      }
    })
  }
  showPwd ():void {
    this.pwdType === 'password' ? this.pwdType = '' : this.pwdType = 'password'
  }
  phoneIn (formName: any) {
    let win: any = window || {};
    (this.$refs[formName] as HTMLFormElement).validate((valid: any) => {
      if (valid) {
        post(apiConfig('login/registerImmediately'),
          {
            username: this.registerName,
            phone: this.phoneForm.phoneNumber,
            openid: this.openId,
            type: this.thirdBindType,
            sex: this.sex,
            headImgUrl: this.headImgUrl,
            state: this.state,
            unionid: this.unionId,
            sourceType: config.registerSourceType
          })
          .then((res0: any) => {
            if (res0.code === 200) {
              this.$message({
                message: '注册成功！',
                type: 'success'
              })
              fetch(apiConfig('login/userInfo'), { access_token: res0.data.access_token })
                .then((res: any) => {
                  if (res.code === 200) {
                    let tempParams = {
                      token: res0.data.access_token,
                      userName: res.data.username,
                      userId: res.data.userid,
                      headUrl: res.data.headImgUrl,
                      expires_in: res0.data.expires_in
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
                        window.location.href = this.redirectAddress + '&token=' + res0.data.access_token
                      } else {
                        window.location.href = this.redirectAddress + '?token=' + res0.data.access_token
                      }
                    }
                  }
                })
            }
          })
      } else {
        return false
      }
    })
  }
  getCode () {
    if (this.phoneForm.phoneNumber.length < 11) {
      this.$message({
        message: '请输入正确的手机号码',
        type: 'warning'
      })
      return
    }
    fetch(apiConfig('login/checkAccount'), { username: this.phoneForm.phoneNumber })
      .then((res:any) => {
        if (res.code === 200) {
          this.$message({
            message: '当前手机号已注册，建议您立即登录',
            type: 'warning'
          })
        } else {
          if (this.codeInfo === '获取短信验证码') {
            post(apiConfig('login/message'), { phoneNum: this.phoneForm.phoneNumber })
              .then((res: any) => {
                if (res.code === 200) {
                  let count = 60
                  this.phoneForm.uuid = res.data.smsUuid
                  this.codeInterval = window.setInterval(() => {
                    if (count === -1) {
                      this.codeInfo = '获取短信验证码'
                      window.clearInterval(this.codeInterval)
                    } else {
                      this.codeInfo = count + '秒后可重发'
                      count--
                    }
                  }, 1000)
                } else if (res.code === 201) {
                  this.$message({
                    message: res.msg,
                    type: 'warning'
                  })
                }
              })
          }
        }
      })
  }
  handleClick (tab: any, event: any) {
    // console.log(tab, event)
  }
  openAgreement (type: any):void {
    this.show = true
    if (type === 1) {
      this.firstDialog = true
      this.secondDialog = false
    } else {
      this.firstDialog = false
      this.secondDialog = true
    }
  }
  created () {
    let win:any = window || {}
    win.ver1_img = new Image()
    win.ver1_img.src = require('../assets/img/slide/ver1.png')
    win.ver2_img = new Image()
    win.ver2_img.src = require('../assets/img/slide/ver2.png')
    win.ver3_img = new Image()
    win.ver3_img.src = require('../assets/img/slide/ver3.png')
    win.ver4_img = new Image()
    win.ver4_img.src = require('../assets/img/slide/ver4.png')
    // 判断从基本资料流程入口，修改activeName，去掉tab
    // if (this.$route.query.status === '1') {
    //   this.activeName = 'first'
    //   this.$nextTick(function () {
    //     this.$refs.tabs.$children[0].$el.style.visibility = 'hidden'
    //   })
    // }
    if (this.$route.query) {
      this.openId = this.$route.query.openId
      this.unionId = this.$route.query.unionId
      this.thirdBindType = this.$route.query.thirdBindType
      this.thirdBindName = this.$route.query.thirdBindName
      this.registerName = this.$route.query.registerName
      this.headImgUrl = this.$route.query.headImgUrl
      this.sex = this.$route.query.sex
      this.state = this.$route.query.state
      this.redirectAddress = this.$route.query.redirectAddress
    }
  }
  destroyed () {
    if (this.codeInterval) {
      window.clearInterval(this.codeInterval)
    }
    if (this.countInterval) {
      window.clearInterval(this.countInterval)
    }
  }
}
</script>
<style>
  .slider-btn{position:absolute;width:44px;height:44px;left:0;top:-7px;z-index:12;cursor:pointer;background-image:url('../assets/img/slide/sprite.3.2.0.png');background-position:0 -84px;transition:inherit}
  .ver-tips{position:absolute;left:0;bottom:-22px;background:rgba(255,255,255,.9);height:22px;line-height:22px;font-size:12px;width:100%;margin:0;text-align:left;padding:0 8px;transition:all .4s}
  .slider-tips{bottom:0}
  .ver-tips i{display:inline-block;width:22px;height:22px;vertical-align:top;background-image:url('../assets/img/slide/sprite.3.2.0.png');background-position:-4px -1229px}
  .ver-tips span{display:inline-block;vertical-align:top;line-height:22px;color:#455}
  .active-tips{display:block}
  .hidden{display:none}
  .re-btn{position:absolute;left:0;bottom:0;height:28px;padding:0 16px}
  .re-btn a{display:inline-block;width:14px;height:14px;margin:7px 0;background-image:url('../assets/img/slide/sprite.3.2.0.png');background-position:0 -1179px;cursor:pointer}
  .re-btn a:hover{background-position:0 -1193px}
  .bind-main .page-content-body .el-tabs .el-tabs__content{  height: calc(100% - 40px);overflow-y: auto;}
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less" type="text/less">
  @spacing: 20px;
  @fill: 100%;
  @deep: ~'>>>';
  .bind-main @{deep}.el-radio-group {width: 100%;}
  .bind-main @{deep}.el-form-item__content {margin-left: 0px !important;}
  // .bind-main .phoneInput @{deep}.el-form-item__content .el-form-item__error {margin-left: 136px}
  .bind-main .phoneInput @{deep}.el-input input {text-indent: 115px;}
  .bind-main .identifyingCode @{deep}.el-input {width: calc(100% - 160px);}
  .bind-main .identifyingCode @{deep}.el-button {margin-left: 30px;}
  .bind-main @{deep}.el-tabs__nav {width: 100%;}
  .bind-main @{deep}.el-tabs__item {width: 50%;text-align: center;}
  .bind-main .register-form-btn @{deep} .el-button--primary {width: 100%;height: 48px;}
  .bind-main .registerDialog @{deep} .el-dialog{
    margin-top: 0px !important;
    min-width: 320px;
    min-height: 440px;
    max-width: 440px;
    max-height: 568px;
    width: 100%;
    height: 100%;
    margin: 0 auto;
    overflow: hidden;
  }
  .bind-main .registerDialog @{deep} .el-dialog .el-dialog__body{height: calc(100% - 90px);padding: 0 20px;}
  .bind-main .registerDialog @{deep} .el-dialog .el-dialog__header {padding: 40px 20px 10px !important;}
  .regionSize (@regionW: 100%, @regionH: 100%) {
    width: @regionW;
    height: @regionH;
    position: relative;
  }
  .bind-main {
    .regionSize(@fill, @fill);
    min-width: 320px;
    min-height: 440px;
    max-width: 440px;
    max-height: 568px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 1vh 20px 0;
    box-sizing: border-box;
    .page-content {
      .regionSize(@fill, @fill);
      overflow: hidden;
      .font-custom {
        font-size: @spacing * 1.5;
        color: #24ad45;
        position: relative;
        top: @spacing / 4;
        margin-right: @spacing / 4;
      }
      &>div {
        // width: @spacing * 55;
        // height: calc(100% - 70px);
        .regionSize(@fill, @fill);

        .page-content-title {
          font-size: 24px;
          font-weight: bold;
          color: #1f8dfb;
        }
        .page-content-body {
          .regionSize(@fill, auto);
          margin-top: 2vh;
          .page-content-info {
            .regionSize(@fill, @spacing * 3);
            margin: 0 0 20px 0;
            font-size: 12px;
            background-color: #f2f2f2;
          }
          .num10086 {
            position: absolute;
            z-index: 99;
            margin-left: @spacing;
            color: #1f8dfb;
          }
          .el-tabs{
            .el-tabs__content{
              height: calc(100% - 40px);
              overflow-y: auto;
            }
          }
        }
      }
    }
    .register-eyes-open{
      background: url(../assets/img/login/register-eyes-open.png) center no-repeat;
      background-size: contain;
      cursor: pointer;
      &:before{
        content: "";
      }
      &:after {
        content: '';
        height: 100%;
        width: 22px;
        display: inline-block;
        vertical-align: middle;
      }
    }
    .register-eyes-close{
      background: url(../assets/img/login/register-eyes-close.png) center no-repeat;
      background-size: contain;
      cursor: pointer;
      &:before{
        content: "";
      }
      &:after {
        content: '';
        height: 100%;
        width: 22px;
        display: inline-block;
        vertical-align: middle;
      }
    }
    .logo-box {
      // width:404px;
      margin:15px auto;
      border:1px solid #e5e5e5;
      border-radius:4px;
      box-shadow:0 4px 18px rgba(0,0,0,0.2);
      position:relative;
      overflow:hidden;
      // height:325px;
      padding: 0 0 20px;
    }
    .verBox {
      position:relative;
      width:100%;
      text-align:center;
      left:0px;
      top:0;
      opacity:1;
      transition:all 0.8s;
      padding-top:55px;
    }
    .readAgreementCheck{
      // margin-left: 235px;
      .text{
        font-size: 12px;
        font-weight: normal;
        font-stretch: normal;
        letter-spacing: 0px;
        color: #444444;
      }
      .agreement{
        font-size: 12px;
        font-weight: normal;
        letter-spacing: 0px;
        color: #1f8dfb;
        cursor: pointer;
      }
      .el-checkbox {
        margin-right: 5px;
      }
    }
  }
</style>
