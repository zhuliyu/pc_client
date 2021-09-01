<template>
  <div class="login-panel">
    <div class="login-head">
      <img src="../assets/img/login/logo.png" />
      <div class="colseBox" @click="closeBox()">
        <i class="el-icon-close"></i>
      </div>
    </div>
    <div class="login-form">
      <div>
        <img src="../assets/img/login/illustration.png" />
      </div>

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
      </div>
    </div>

    <div class="go-back" @click="backBox()">
      <span><i class="fa fa-long-arrow-left"></i></span>
      <span>返回</span>
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
  name: 'Login',
  components: {
    SMS,
    [Button.name]: Button,
    [Form.name]: Form,
    [FormItem.name]: FormItem,
    [Input.name]: Input,
    [Checkbox.name]: Checkbox
  }
})
export default class Login extends Vue {
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
        path: '/register'
      })
    }
    changeCheck (event:any):void {
      this.rememberPassword = event
    }
    loginIn (formName:string):void {
      (this.$refs[formName] as HTMLFormElement).validate((valid:any) => {
        if (valid) {
          if (this.rememberPassword) {
            let cookieVal = JSON.stringify({
              'cookies': [
                {
                  'name': 'loginName',
                  'val': this.ruleForm.loginName
                },
                {
                  'name': 'loginPassword',
                  'val': this.ruleForm.password
                },
                {
                  'name': 'rememberPassword',
                  'val': 'true'
                }]
            })
            this.setCookie(cookieVal)
          } else {
            let cookieVal = JSON.stringify({
              'cookies': [
                {
                  'name': 'loginName',
                  'val': ''
                },
                {
                  'name': 'loginPassword',
                  'val': ''
                },
                {
                  'name': 'rememberPassword',
                  'val': 'false'
                }]
            })
            this.setCookie(cookieVal)
            // localStorage.removeItem('localName')
            // localStorage.removeItem('localPassword')
            // localStorage.setItem('rememberPassword', 'false')
          }
          this.userLogin({ loginName: this.ruleForm.loginName, loginPassword: this.ruleForm.password, type: 1 })
        } else {
          return false
        }
      })
    }
    setCookie (cookieVal: any):void {
      let win: any = window || {}
      try {
        win.external.SetCookies(cookieVal)
      } catch (e) {
        console.log('设置登录信息')
      }
    }

    forgotPassword ():void {
      this.$router.push({
        path: '/forget'
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
    created () {
      // 记住密码功能
      let win: any = window || {}
      try {
        let cookieVal = JSON.stringify({
          'cookies': [
            {
              'name': 'loginName'
            },
            {
              'name': 'loginPassword'
            },
            {
              'name': 'rememberPassword'
            }
          ]
        })
        let val:any = JSON.parse(win.external.GetCookies(cookieVal)).cookies
        val.forEach((item:any) => {
          if (item.name === 'loginName') {
            this.ruleForm.loginName = item.val
          }
          if (item.name === 'loginPassword') {
            this.ruleForm.password = item.val
          }
          if (item.name === 'rememberPassword') {
            let reBoolean:any = item.val
            if (reBoolean === 'false') {
              this.rememberPassword = false
            } else {
              this.rememberPassword = true
            }
          }
        })
      } catch (e) {
        console.log('获取AppId错误')
      }
      // if (localStorage.getItem('localName')) {
      //   this.ruleForm.loginName = localStorage.getItem('localName') as string
      //   this.ruleForm.password = localStorage.getItem('localPassword') as string
      //   this.rememberPassword = true
      // }
      // if (localStorage.getItem('rememberPassword')) {
      //   let reBoolean:any = localStorage.getItem('rememberPassword')
      //   if (reBoolean === 'false') {
      //     this.rememberPassword = false
      //   } else {
      //     this.rememberPassword = true
      //   }
      // }
    }
}
</script>

<style>
  .login-form .phoneInput .el-input input {text-indent: 135px;}
  .login-form .identifyingCode .el-input {width: calc(100% - 220px);}
  .login-form .el-input input {height: 45px;}
  .login-form .login-form-btn .el-button--primary {width: 100%;height: 50px;font-size: 20px;/*px*/}
  .login-form .login-form-sms .el-button--primary {width: 100%;height: 45px;}
</style>
<style scoped lang="less" type="text/less">
  @import "../less/common.less";
  @import '~font-awesome/css/font-awesome.css';
  .login-panel {
    .regionSize(@fill, @fill);
    color: #7d8082;
    background: url("../assets/img/login/bg.png") no-repeat;
    background-size: cover;
    overflow: hidden;
    .login-head {
      position: relative;
      .regionSize(@fill, @spacing * 4);
      margin-top: @spacing;
      margin-left: @spacing;
      img {
        width: @spacing * 9;
      }
      .colseBox{
        font-size: 30px;
        position: absolute;
        right: @spacing * 2;
        top: @spacing / 4;
        color: #fff;
        cursor: pointer;
      }
    }
    .login-form {
      .regionSize(@spacing * 51, @spacing * 27);
      background: url("../assets/img/login/form.png") no-repeat;
      background-size: @fill @fill;
      margin: 0 auto;
      top: 50%;
      margin-top: -(@spacing * 18);
      &>div:first-child {
        float: left;
        .regionSize(@spacing * 22, @spacing * 25);
        margin-left: @spacing * 4.2;
        top: @spacing * 2.5;
        img {
          margin-top: @spacing * 3.5;
          margin-left: @spacing;
          width: 415px;
        }
      }
      &>div:last-child {
        float: left;
        .regionSize(@spacing * 20, @spacing * 25);
        margin-left: 20px;
        top: @spacing * 3;
        .login-form-title {
          &>span:first-child {
            color: #1f8dfb;
            font-weight: bold;
            font-size: 28px;/*px*/
          }
          &>span:nth-child(2) {
            float: right;
            margin-top: @spacing;
            color: #1f8dfb;
            cursor: pointer;
            margin-right: @spacing / 2;
          }
          &>span:last-child {
            float: right;
            margin-top: @spacing;
          }
        }
        .login-form-tab {
          width: @fill;
          margin-top: @spacing * 1.5;
          height: @spacing * 2;
          box-sizing: border-box;
          border: 1px solid #1f8dfb;
          border-radius: 5px;/*no*/
          overflow: hidden;
          &>div {
            float: left;
            width: @fill / 2;
            height: @fill;
            text-align: center;
            line-height: @spacing * 2;
            color: #1f8dfb;
            font-size: 16px;/*px*/
          }
          .tab-active {
            color: white;
            background-color: #1f8dfb;
          }
        }
        .login-form-content {
          margin-top: @spacing * 1.5;
          .regionSize(@fill, @spacing * 20);
          .login-form-panel {
            margin-bottom: @spacing * 1.5;
          }
          .login-form-btn {
            margin-top: @spacing * 2.3;
          }
          .login-form-sms {
            float: right;
            width: @spacing * 10;
            height: 45px;
            text-align: center;
            margin-left: 3px;
          }
          .login-panel-forgot {
            float: right;
            font-size: 14px;/*px*/
          }
          .num10086 {
            position: absolute;
            z-index: 9;
            left: 18px;
            top: 3px;
            color: #1f8dfb;
          }
        }
      }
    }
    .go-back {
      position: absolute !important;
      .regionSize(@spacing * 6, @spacing * 2);
      line-height: @spacing * 2;
      color: #1970fb;
      background-color: white;
      border-radius: @spacing / 2;
      bottom: @spacing;
      left: @spacing;
      cursor: pointer;
      span:first-child {
        font-size: @spacing + 10;
        margin-left: @spacing / 2;
      }
      span:last-child {
        font-size: @spacing + 4;
        margin-left: @spacing;
        position: relative;
        top: -2px;
      }
    }
  }
</style>
