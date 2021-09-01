<template>
  <div class="login-panel">
    <!-- <div class="login-panel-close" @click="closePanel()">X</div> -->
    <div class="login-form">
      <div>
        <div class="login-form-title">
          <span>欢迎登录</span><span @click="goRegister()">立即注册</span><span>没有账号？</span>
        </div>

        <div class="login-form-tab">
          <div :class="activeTab === 'tel' ? 'tab-active' : ''" @click="tabChange('tel')">手机验证码登录</div>

          <div :class="activeTab === 'pas' ? 'tab-active' : ''" @click="tabChange('pas')">密码登录</div>
        </div>

        <div class="login-form-content" v-show="activeTab === 'tel'">
          <el-form :model="phoneForm" :rules="rules" ref="phoneForm" label-width="0px" class="demo-ruleForm">
            <el-form-item label="" prop="phoneNumber" class="phoneInput login-form-panel">
              <div class="num10086">+86 (中国大陆)</div>

              <el-input placeholder="请输入您的手机号" v-model="phoneForm.phoneNumber"></el-input>
            </el-form-item>

            <el-form-item label="" prop="identifyingCode" class="identifyingCode login-form-panel">
              <el-input  placeholder="请输入您的验证码" v-model="phoneForm.identifyingCode"></el-input>

              <div class="login-form-sms">
                <SMS v-bind:phoneNumber = phoneForm.phoneNumber
                    v-bind:checkNumber = checkNumber
                    v-bind:msgType = msgType
                    @getUuid = "getUuid">
                </SMS>
              </div>
            </el-form-item>

            <div class="login-panel-additional"></div>

            <el-form-item class="login-form-btn">
              <el-button type="primary" @click="phoneIn('phoneForm')">登录</el-button>
            </el-form-item>
          </el-form>
        </div>

        <div class="login-form-content" v-show="activeTab === 'pas'">
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="demo-ruleForm">
            <el-form-item label="" prop="loginName">
              <el-input placeholder="请输入您的用户名/手机号/邮箱" v-model="ruleForm.loginName"></el-input>
            </el-form-item>

            <el-form-item label="" prop="password">
              <el-input placeholder="请输入您的密码" :type="pwdType" v-model="ruleForm.password"
                        oncopy="return false" onpaste="return true" oncut="return false">
                <i slot="suffix" :class="pwdType === 'password' ? 'el-input__icon register-eyes-close' : 'el-input__icon register-eyes-open'" @click="showPwd()"></i>
              </el-input>
            </el-form-item>

            <div class="login-panel-additional">
              <el-checkbox label="记住密码" name="type" :checked="rememberPassword" ref="rememberPassword" @change="changeCheck($event)"></el-checkbox>

              <span class="login-panel-forgot" @click="forgotPassword()">忘记密码？</span>
            </div>

            <el-form-item class="login-form-btn">
              <el-button type="primary" @click="loginIn('ruleForm')">登录</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="login-panel-other">
          <div class="login-panel-split">
            <div>其他登录方式</div>
          </div>

          <div class="login-panel-button">
            <div @click="codeLogin(1)"></div>

            <div @click="codeLogin(2)"></div>

            <div @click="codeLogin(3)"></div>

            <div @click="codeLogin(4)"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { apiConfig, fetch } from '@/utils/api/Interfaces'
import { checkNumberAndEmail } from '@/assets/js/ruleCheck'
import { Action } from 'vuex-class'
import SMS from '../views/sms/index.vue'
import { Button, Form, FormItem, Input, Checkbox } from 'element-ui'
import { encrypt, decrypt } from '@/assets/js/encryption'

interface phoneInterface {
  phoneNumber:string,
  identifyingCode: string,
  uuid: string
}
interface passInterface {
  loginName:string,
  password: string
}
interface ruleInterface {
  loginName:any,
  password: any,
  phoneNumber: any,
  identifyingCode: any
}

@Component({
  name: 'LoginPop',
  components: {
    SMS,
    [Button.name]: Button,
    [Form.name]: Form,
    [FormItem.name]: FormItem,
    [Input.name]: Input,
    [Checkbox.name]: Checkbox
  }
})
export default class LoginPop extends Vue {
    activeTab: string = 'tel';
    checkNumber: string = '';
    msgType: string = 'login';
    phoneForm:phoneInterface ={
      phoneNumber: '',
      identifyingCode: '',
      uuid: ''
    };
    rememberPassword: boolean = true;
    pwdType: string = 'password';
    ruleForm:passInterface = {
      loginName: '',
      password: ''
    };
    redirectAddress: string = ''
    rules:ruleInterface ={
      loginName: [{ validator: (rule:any, value:string, callback:any) => {
        if (value === '') {
          return callback(new Error('请输入您的用户名/手机号/邮箱'))
        } else {
          if (value.indexOf(' ') >= 0) {
            return callback(new Error('手机号/用户名/邮箱不能输入空格'))
          }
          callback()
        }
      },
      trigger: 'blur' }],
      password: [{ validator: (rule:any, value:string, callback:any) => {
        if (value === '') {
          return callback(new Error('请输入您的密码'))
        } else {
          if (value.indexOf(' ') >= 0) {
            return callback(new Error('密码不能输入空格'))
          }
          callback()
        }
      },
      trigger: 'blur' }
      ],
      phoneNumber: [{ validator: (rule:any, value:string, callback:any) => {
        if (value === '') {
          return callback(new Error('手机号不能为空'))
        } else {
          checkNumberAndEmail('telephoneNumber', value, (checkResult:boolean) => {
            if (!checkResult) {
              return callback(new Error('手机号填写不正确，请输入有效的11位手机号'))
            } else {
              fetch(apiConfig('login/isAdmin'), { phoneNum: value })
                .then((res:any) => {
                  if (res.data) {
                    this.checkNumber = ''
                    callback()
                  } else {
                    this.checkNumber = 'login'
                    return callback(new Error('该手机号未注册，建议您立即注册'))
                  }
                })
            }
          })
        }
      },
      trigger: 'blur' }
      ],
      identifyingCode: [{ required: true,
        validator: (rule:any, value:string, callback:any) => {
          let numberCode = Number(value)
          if (value === '') {
            return callback(new Error('验证码不能为空'))
          } else {
            if (value.indexOf(' ') >= 0) {
              return callback(new Error('验证码不能输入空格'))
            }
            if (!Number.isInteger(numberCode)) {
              return callback(new Error('验证码必须为数值'))
            }
            callback()
          }
        },
        trigger: 'blur' }
      ]
    };
    @Action('userLogin', { namespace: 'login' })
    userLogin: any;
    @Action('telLogin', { namespace: 'login' })
    telLogin: any;
    tabChange (type:string):void {
      this.activeTab = type
    }
    goRegister ():void {
      this.$router.push({
        path: '/registerPop'
      })
    }
    closePanel ():void {
      let win: any = window || {}
      win.external.CloseLoginPage()
    }
    changeCheck (event:any):void {
      this.rememberPassword = event
    }
    loginIn (formName:string):void {
      (this.$refs[formName] as HTMLFormElement).validate((valid:any) => {
        if (valid) {
          if (this.rememberPassword) {
            localStorage.setItem('localName', this.ruleForm.loginName)
            localStorage.setItem('localPassword', encrypt(this.ruleForm.password))
            localStorage.setItem('rememberPassword', 'true')
          } else {
            localStorage.removeItem('localName')
            localStorage.removeItem('localPassword')
            localStorage.setItem('rememberPassword', 'false')
          }
          this.userLogin({ loginName: this.ruleForm.loginName, loginPassword: this.ruleForm.password, type: 1 })
        } else {
          return false
        }
      })
    }
    forgotPassword ():void {
      this.$router.push({
        path: '/forgetPop'
      })
    }
    showPwd () :void{
      this.pwdType === 'password' ? this.pwdType = '' : this.pwdType = 'password'
    }
    getUuid (uuid:string):void {
      this.phoneForm.uuid = uuid
    }
    phoneIn (formName:string) {
      (this.$refs[formName] as HTMLFormElement).validate((valid:any) => {
        if (valid) {
          if (this.phoneForm.uuid) {
            this.telLogin({ loginName: this.phoneForm.phoneNumber, loginPassword: this.phoneForm.identifyingCode, key: this.phoneForm.uuid, type: 2 })
          } else {
            this.$message({
              message: '验证码错误或已失效！',
              type: 'warning'
            })
          }
        } else {
          return false
        }
      })
    }
    closeBox ():void {
      let win: any = window || {}
      try {
        win.external.CloseClientByJs()
      } catch (e) {
        // win.external.ShowHomePage()
      }
    }
    backBox ():void {
      let win: any = window || {}
      try {
        win.external.ShowHomePage()
      } catch (e) {
        // win.external.ShowHomePage()
      }
    }
    codeLogin (type: number) {
      if (type === 1) {
        fetch(apiConfig('login/qqLoginUrl'), { type, toUrl: this.redirectAddress, tag: 1 })
          .then((res:any) => {
            if (res.code === 200) {
              window.location.href = res.data
            }
          }).catch((err:any) => {
            this.$message({
              message: err,
              type: 'warning'
            })
          })
      }
      if (type === 2) {
        if (this.redirectAddress) {
          this.$router.push({
            path: '/codeLogin?address=' + this.redirectAddress
          })
        } else {
          this.$router.push({
            path: '/codeLogin'
          })
        }
      }
      if (type === 3) {
        fetch(apiConfig('login/blogLoginUrl'), { type, toUrl: this.redirectAddress, tag: 1 })
          .then((res: any) => {
            if (res.code === 200) {
              window.location.href = res.data
            }
          })
      }
      if (type === 4) {
        if (this.redirectAddress) {
          this.$router.push({
            path: '/emailLogin?address=' + this.redirectAddress
          })
        } else {
          this.$router.push({
            path: '/emailLogin'
          })
        }
      }
    }
    created () {
      // 记住密码功能
      if (localStorage.getItem('localName')) {
        this.ruleForm.loginName = localStorage.getItem('localName') as string
        this.ruleForm.password = decrypt(localStorage.getItem('localPassword') as string)
        this.rememberPassword = true
      }
      if (localStorage.getItem('rememberPassword')) {
        let reBoolean:any = localStorage.getItem('rememberPassword')
        if (reBoolean === 'false') {
          this.rememberPassword = false
        } else {
          this.rememberPassword = true
        }
      }
      if (location.href.indexOf('?address=') >= 0) {
        let tempHash = location.href
        let redirectUrl = tempHash.split('?address=')[1]
        if (redirectUrl) {
          redirectUrl = redirectUrl.replace('#type=pc', '')
        }
        console.log(redirectUrl)
        this.redirectAddress = unescape(redirectUrl)
      }
    }
}
</script>

<style scoped lang="less" type="text/less">
  @import "../less/common.less";
  @import '~font-awesome/css/font-awesome.css';
  @deep: ~'>>>';
  .login-form .phoneInput @{deep} .el-input input {text-indent: 135px;}
  .login-form .identifyingCode @{deep} .el-input {width: calc(100% - 126px);}
  .login-form @{deep} .el-input input {height: 40px;}
  .login-form .login-form-btn @{deep} .el-button--primary {width: 100%;height: 48px;font-size: 18px;/*px*/}
  .login-form .login-form-sms @{deep} .el-button--primary {width: 100%;height: 40px;padding:0}
  .login-panel-close {
    margin-left: 94%;
    margin-top: 10px;
    cursor: pointer;
  }
  .login-panel {
    .regionSize(100%, 100%);
    color: #7d8082;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    min-width: 320px;
    min-height: 440px;
    max-width: 440px;
    max-height: 568px;
    .login-form {
      .regionSize(100%, 100%);
      margin: auto;
      padding: 1vh 20px 0px;
      box-sizing: border-box;
      &>div:last-child {
        .regionSize(100%, 100%);
        .login-form-title {
          overflow: hidden;
          &>span:first-child {
            color: #1f8dfb;
            font-weight: bold;
            font-size: 24px;
          }
          &>span:nth-child(2) {
            float: right;
            margin-top: 15px;
            color: #1f8dfb;
            cursor: pointer;
            font-size: 14px;
          }
          &>span:last-child {
            float: right;
            margin-top: 15px;
            font-size: 14px;
          }
        }
        .login-form-tab {
          width: @fill;
          margin-top: 3vh;
          height: 32px;
          box-sizing: border-box;
          border: 1px solid #1f8dfb;
          border-radius: 5px;/*no*/
          overflow: hidden;
          &>div {
            float: left;
            width: @fill / 2;
            height: @fill;
            text-align: center;
            line-height: 32px;
            color: #1f8dfb;
            font-size: 14px;
          }
          :hover {
            cursor: pointer;
          }
          .tab-active {
            color: white;
            background-color: #1f8dfb;
          }
        }
        .login-form-content {
          margin-top: @spacing * 1.5;
          position: relative;
          // height: calc(100% - 140px);
          // padding-bottom: 160px;
          // height: calc(100% - 100px);
          // .regionSize(@fill, @spacing * 20);
          .login-form-panel {
            margin-bottom: @spacing * 1.5;
          }
          .login-form-btn {
            width: 100%;
            margin-top: 20px;
          }
          .login-form-sms {
            float: right;
            width: @spacing * 5.5;
            height: 45px;
            text-align: center;
            margin-left: 3px;
          }
          .login-panel-forgot {
            float: right;
            font-size: 14px;/*px*/
          }
          :hover{
            cursor: pointer;
          }
          .num10086 {
            position: absolute;
            z-index: 9;
            left: 18px;
            color: #1f8dfb;
          }
        }
      }
      .login-panel-other {
        width:100%;
        position: absolute;
        left: 0;
        bottom: 40px;
      }
      .login-panel-split {
        // width: calc(@fill - @spacing * 3.5);
        // margin-left: @spacing * 2 - 5;
        text-align: center;
        font-size: 14px;
        color: #828282;
        border-bottom: 1px solid #828282;
        &>div {
          width: @spacing * 7.5;
          position: relative;
          top: 9px;
          background-color: white;
          left: calc(50% - 75px)
        }
      }
      .login-panel-button {
        // margin-left: @spacing * 4;
        display: flex;
        flex-direction: row;
        justify-content: center;
        &>div {
          float: left;
          .regionSize(@spacing * 2, @spacing * 2);
          background-size: @fill @fill;
          margin-right: @spacing;
          margin-top: @spacing;
          cursor: pointer;
        }
        &>div:last-child {
          margin-right: 0;
        }
        &>div:nth-child(1) {
          background: url("../assets/img/login/QQ.png") no-repeat;
        }
        &>div:nth-child(1):hover {
          background: url("../assets/img/login/QQ-light.png") no-repeat;
        }
        &>div:nth-child(2) {
          background: url("../assets/img/login/weixin.png") no-repeat;
        }
        &>div:nth-child(2):hover {
          background: url("../assets/img/login/weixin-light.png") no-repeat;
        }
        &>div:nth-child(3) {
          background: url("../assets/img/login/weibo.png") no-repeat;
        }
        &>div:nth-child(3):hover {
          background: url("../assets/img/login/weibo-light.png") no-repeat;
        }
        &>div:nth-child(4) {
          background: url("../assets/img/login/emailImg.png") no-repeat;
        }
        &>div:nth-child(4):hover {
          background: url("../assets/img/login/emailImg-light.png") no-repeat;
        }
      }
    }
  }
</style>
